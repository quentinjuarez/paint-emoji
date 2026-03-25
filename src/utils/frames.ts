import { parseGIF, decompressFrames } from 'gifuct-js'

export interface AnimFrame {
  canvas: HTMLCanvasElement
  delay: number
}

/**
 * Detect the type of an animated image from its first bytes.
 */
const detectMime = (buffer: ArrayBuffer): 'image/gif' | 'image/webp' | null => {
  const view = new Uint8Array(buffer, 0, 12)
  // GIF87a / GIF89a
  if (view[0] === 0x47 && view[1] === 0x49 && view[2] === 0x46) return 'image/gif'
  // RIFF....WEBP
  if (
    view[0] === 0x52 &&
    view[1] === 0x49 &&
    view[2] === 0x46 &&
    view[3] === 0x46 &&
    view[8] === 0x57 &&
    view[9] === 0x45 &&
    view[10] === 0x42 &&
    view[11] === 0x50
  )
    return 'image/webp'
  return null
}

/**
 * Extract frames from a GIF buffer using gifuct-js.
 * Handles cumulative rendering and disposal modes.
 */
const extractGifFramesFromBuffer = (buffer: ArrayBuffer): AnimFrame[] => {
  const gif = parseGIF(buffer)
  const frames = decompressFrames(gif, true)
  if (frames.length === 0) return []

  const w = gif.lsd.width
  const h = gif.lsd.height

  const compCanvas = document.createElement('canvas')
  compCanvas.width = w
  compCanvas.height = h
  const compCtx = compCanvas.getContext('2d')!

  const result: AnimFrame[] = []

  for (const frame of frames) {
    const savedData = frame.disposalType === 3 ? compCtx.getImageData(0, 0, w, h) : null

    const patchCanvas = document.createElement('canvas')
    patchCanvas.width = frame.dims.width
    patchCanvas.height = frame.dims.height
    const patchCtx = patchCanvas.getContext('2d')!
    patchCtx.putImageData(
      new ImageData(new Uint8ClampedArray(frame.patch), frame.dims.width, frame.dims.height),
      0,
      0
    )

    compCtx.drawImage(patchCanvas, frame.dims.left, frame.dims.top)

    const snapshot = document.createElement('canvas')
    snapshot.width = w
    snapshot.height = h
    snapshot.getContext('2d')!.drawImage(compCanvas, 0, 0)

    result.push({
      canvas: snapshot,
      delay: (frame.delay || 5) * 10
    })

    if (frame.disposalType === 2) {
      compCtx.clearRect(frame.dims.left, frame.dims.top, frame.dims.width, frame.dims.height)
    } else if (frame.disposalType === 3 && savedData) {
      compCtx.putImageData(savedData, 0, 0)
    }
  }

  return result
}

/**
 * Extract frames from an animated WebP using the WebCodecs ImageDecoder API.
 * Falls back to a single-frame extraction via <img> if ImageDecoder is unavailable.
 */
const extractWebpFramesFromBuffer = async (buffer: ArrayBuffer): Promise<AnimFrame[]> => {
  // Modern path: ImageDecoder (Chromium 94+)
  if ('ImageDecoder' in window) {
    return extractWebpViaImageDecoder(buffer)
  }
  // Fallback: render as a single static frame
  return extractWebpFallback(buffer)
}

const extractWebpViaImageDecoder = async (buffer: ArrayBuffer): Promise<AnimFrame[]> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const decoder = new (window as any).ImageDecoder({
    type: 'image/webp',
    data: new Uint8Array(buffer)
  })

  await decoder.tracks.ready
  const track = decoder.tracks.selectedTrack
  const frameCount: number = track?.frameCount ?? 1

  const frames: AnimFrame[] = []

  for (let i = 0; i < frameCount; i++) {
    const result = await decoder.decode({ frameIndex: i })
    const vf = result.image

    const canvas = document.createElement('canvas')
    canvas.width = vf.displayWidth
    canvas.height = vf.displayHeight
    const ctx = canvas.getContext('2d')!
    ctx.drawImage(vf, 0, 0)
    vf.close()

    frames.push({
      canvas,
      delay: Math.max((vf.duration ?? 50000) / 1000, 10) // microseconds → ms, min 10ms
    })
  }

  decoder.close()
  return frames
}

const extractWebpFallback = async (buffer: ArrayBuffer): Promise<AnimFrame[]> => {
  const blob = new Blob([buffer], { type: 'image/webp' })
  const url = URL.createObjectURL(blob)
  try {
    const img = await loadImageFromUrl(url)
    const canvas = document.createElement('canvas')
    canvas.width = img.naturalWidth
    canvas.height = img.naturalHeight
    canvas.getContext('2d')!.drawImage(img, 0, 0)
    return [{ canvas, delay: 100 }]
  } finally {
    URL.revokeObjectURL(url)
  }
}

const loadImageFromUrl = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = url
  })

/**
 * Unified frame extraction: auto-detects GIF vs WebP and extracts
 * all animation frames. Works with URLs or Files.
 */
export const extractAnimatedFrames = async (source: string | File): Promise<AnimFrame[]> => {
  let buffer: ArrayBuffer

  if (source instanceof File) {
    buffer = await source.arrayBuffer()
  } else {
    const res = await fetch(source)
    buffer = await res.arrayBuffer()
  }

  const mime = detectMime(buffer)

  if (mime === 'image/gif') {
    return extractGifFramesFromBuffer(buffer)
  }
  if (mime === 'image/webp') {
    return extractWebpFramesFromBuffer(buffer)
  }

  // Not an animated format we recognize — return empty
  return []
}

// ---- Rendering helpers -------------------------------------------------------

export interface FrameRenderOptions {
  size: number
  delay: number
  zoom: number
  translateX: number
  translateY: number
  rotation: number
  frameOpacity: number
  input: string
  mask: string
}

export const DEFAULT_FRAME_OPTIONS: FrameRenderOptions = {
  size: 128,
  delay: 50,
  zoom: 1,
  translateX: 0,
  translateY: 0,
  rotation: 0,
  frameOpacity: 1,
  input: '',
  mask: 'clean'
}

export const drawUserImageOnCtx = (
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  opts: FrameRenderOptions
) => {
  const { size, translateX, translateY, rotation, zoom } = opts
  ctx.save()
  ctx.translate(size / 2 + translateX, size / 2 + translateY)
  ctx.rotate((rotation * Math.PI) / 180)
  ctx.scale(zoom, zoom)
  ctx.drawImage(image, -size / 2, -size / 2, size, size)
  ctx.restore()
}

export const renderCompositeFrame = (
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement | null,
  frame: AnimFrame,
  opts: FrameRenderOptions
) => {
  ctx.clearRect(0, 0, opts.size, opts.size)
  if (image) drawUserImageOnCtx(ctx, image, opts)
  ctx.save()
  ctx.globalAlpha = opts.frameOpacity
  ctx.drawImage(frame.canvas, 0, 0, opts.size, opts.size)
  ctx.restore()
}

// ---- GIF generation with improved transparency --------------------------------

/**
 * Generate a GIF blob with proper transparency handling.
 * Uses disposal mode 2 (restore to background) and transparent color
 * so semi-transparent mask areas don't leave artefacts across frames.
 */
export const generateGifBlob = (
  image: HTMLImageElement | null,
  frames: AnimFrame[],
  opts: FrameRenderOptions
): Promise<Blob> =>
  new Promise((resolve, reject) => {
    if (!window.GIF) {
      reject(new Error('GIF library not loaded'))
      return
    }

    const canvas = document.createElement('canvas')
    canvas.width = opts.size
    canvas.height = opts.size
    const ctx = canvas.getContext('2d')!

    const renderer = new window.GIF({
      quality: 2,
      workers: 4,
      workerScript: '/vendor/gifjs/gif.worker.js',
      width: opts.size,
      height: opts.size,
      transparent: 0x00000000
    })

    renderer.on('finished', (blob: Blob) => resolve(blob))

    for (const frame of frames) {
      renderCompositeFrame(ctx, image, frame, opts)
      renderer.addFrame(ctx, {
        delay: opts.delay,
        copy: true,
        dispose: 2 // restore to background — avoids ghosting artefacts
      })
    }

    renderer.render()
  })

// ---- WebP static download --------------------------------------------------

export const canvasToWebpBlob = (canvas: HTMLCanvasElement, quality = 0.9): Promise<Blob> =>
  new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('WebP encoding failed'))),
      'image/webp',
      quality
    )
  })

// ---- Animated WebP generation (RIFF container) -------------------------------

const readU32LE = (data: Uint8Array, offset: number): number =>
  data[offset] |
  (data[offset + 1] << 8) |
  (data[offset + 2] << 16) |
  ((data[offset + 3] << 24) >>> 0)

const u32LE = (n: number): Uint8Array =>
  new Uint8Array([n & 0xff, (n >> 8) & 0xff, (n >> 16) & 0xff, (n >> 24) & 0xff])

const u24LE = (n: number): Uint8Array =>
  new Uint8Array([n & 0xff, (n >> 8) & 0xff, (n >> 16) & 0xff])

const tagBytes = (tag: string): Uint8Array =>
  new Uint8Array([tag.charCodeAt(0), tag.charCodeAt(1), tag.charCodeAt(2), tag.charCodeAt(3)])

const buildChunk = (tag: string, payload: Uint8Array): Uint8Array => {
  const pad = payload.length & 1 ? 1 : 0
  const chunk = new Uint8Array(8 + payload.length + pad)
  chunk.set(tagBytes(tag), 0)
  chunk.set(u32LE(payload.length), 4)
  chunk.set(payload, 8)
  return chunk
}

/**
 * Walk a WebP RIFF chunk list and return named chunks with their byte ranges.
 */
const walkRiff = (data: Uint8Array, start: number) => {
  const chunks: Array<{ tag: string; from: number; to: number }> = []
  let ofs = start
  while (ofs + 8 <= data.length) {
    const tag = String.fromCharCode(data[ofs], data[ofs + 1], data[ofs + 2], data[ofs + 3])
    const sz = readU32LE(data, ofs + 4)
    chunks.push({ tag, from: ofs, to: ofs + 8 + sz + (sz & 1) })
    ofs += 8 + sz + (sz & 1)
  }
  return chunks
}

/**
 * Extract the frame-relevant chunks (VP8 / VP8L / ALPH) from a single-frame
 * WebP ArrayBuffer, ready to embed directly inside an ANMF chunk.
 * Strips VP8X, ICCP, EXIF, XMP wrappers produced by canvas.toBlob.
 */
const extractWebpFrameData = (buffer: ArrayBuffer): Uint8Array => {
  const data = new Uint8Array(buffer)
  const chunks = walkRiff(data, 12) // skip RIFF header + WEBP FourCC
  const keep = chunks.filter((c) => c.tag === 'VP8 ' || c.tag === 'VP8L' || c.tag === 'ALPH')
  if (keep.length === 0) throw new Error('No VP8/VP8L frame data found in WebP blob')
  const totalLen = keep.reduce((s, c) => s + (c.to - c.from), 0)
  const out = new Uint8Array(totalLen)
  let pos = 0
  for (const c of keep) {
    out.set(data.subarray(c.from, c.to), pos)
    pos += c.to - c.from
  }
  return out
}

const hasAlphaData = (frameData: Uint8Array): boolean => {
  const chunks = walkRiff(frameData, 0)
  return chunks.some((c) => c.tag === 'ALPH' || c.tag === 'VP8L')
}

/**
 * Assemble frame payloads into an animated WebP RIFF blob.
 * Uses VP8X + ANIM + ANMF structure per the WebP container spec.
 */
const buildAnimatedWebpRiff = (
  frames: Array<{ data: Uint8Array; delay: number }>,
  width: number,
  height: number
): Blob => {
  const alphaFlag = frames.some((f) => hasAlphaData(f.data))

  // VP8X chunk — 10 bytes: flags (4) + canvas width-1 (3) + canvas height-1 (3)
  // Flag bits (libwebp): 0x02 = ANIM, 0x10 = ALPHA
  const vp8xPayload = new Uint8Array(10)
  vp8xPayload[0] = 0x02 | (alphaFlag ? 0x10 : 0x00)
  vp8xPayload.set(u24LE(width - 1), 4)
  vp8xPayload.set(u24LE(height - 1), 7)

  // ANIM chunk — 6 bytes: background BGRA (4, all 0 = transparent) + loop count (2, 0 = infinite)
  const animPayload = new Uint8Array(6)

  // ANMF chunks
  const anmfChunks = frames.map(({ data, delay }) => {
    const anmfPayload = new Uint8Array(16 + data.length)
    // Frame X (3 bytes, stored as X/2): 0
    // Frame Y (3 bytes, stored as Y/2): 0
    anmfPayload.set(u24LE(width - 1), 6) // Frame Width Minus One
    anmfPayload.set(u24LE(height - 1), 9) // Frame Height Minus One
    anmfPayload.set(u24LE(Math.max(1, Math.round(delay))), 12) // Duration (ms)
    // Flags: bit 0 = dispose (1 = to background), bit 1 = blend (0 = use alpha blending)
    anmfPayload[15] = 0x01 // dispose to background, with alpha blending
    anmfPayload.set(data, 16)
    return buildChunk('ANMF', anmfPayload)
  })

  const vp8xChunk = buildChunk('VP8X', vp8xPayload)
  const animChunk = buildChunk('ANIM', animPayload)

  const contentLen =
    vp8xChunk.length + animChunk.length + anmfChunks.reduce((s, c) => s + c.length, 0)

  // RIFF header: "RIFF" + (4 + contentLen) + "WEBP"
  const header = new Uint8Array(12)
  header.set(tagBytes('RIFF'), 0)
  header.set(u32LE(4 + contentLen), 4)
  header.set(tagBytes('WEBP'), 8)

  const parts: ArrayBuffer[] = [header, vp8xChunk, animChunk, ...anmfChunks].map(
    (c) => c.buffer.slice(c.byteOffset, c.byteOffset + c.byteLength) as ArrayBuffer
  )
  return new Blob(parts, { type: 'image/webp' })
}

/**
 * Generate an animated WebP blob by compositing user image + mask frames.
 * Each frame is canvas-encoded to WebP individually, then assembled into
 * a RIFF animated WebP container — no external library required.
 *
 * @param onProgress optional callback with completed/total counts
 */
export const generateAnimatedWebpBlob = async (
  image: HTMLImageElement | null,
  frames: AnimFrame[],
  opts: FrameRenderOptions,
  quality = 0.9,
  onProgress?: (done: number, total: number) => void
): Promise<Blob> => {
  const canvas = document.createElement('canvas')
  canvas.width = opts.size
  canvas.height = opts.size
  const ctx = canvas.getContext('2d')!

  const frameDataList: Array<{ data: Uint8Array; delay: number }> = []

  for (let i = 0; i < frames.length; i++) {
    renderCompositeFrame(ctx, image, frames[i], opts)
    const blob = await canvasToWebpBlob(canvas, quality)
    const buffer = await blob.arrayBuffer()
    frameDataList.push({ data: extractWebpFrameData(buffer), delay: opts.delay })
    onProgress?.(i + 1, frames.length)
  }

  return buildAnimatedWebpRiff(frameDataList, opts.size, opts.size)
}
