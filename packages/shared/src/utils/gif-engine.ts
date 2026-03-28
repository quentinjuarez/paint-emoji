import { parseGIF, decompressFrames } from 'gifuct-js'
import download from './download'

export interface GifFrame {
  canvas: HTMLCanvasElement
  delay: number
}

export interface GifOptions {
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

export const DEFAULT_GIF_OPTIONS: GifOptions = {
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

/**
 * Extract GIF frames with proper cumulative rendering and disposal handling.
 * Returns fully-composited frame canvases (no async image loading needed).
 */
export const extractGifFrames = async (gifUrl: string): Promise<GifFrame[]> => {
  const response = await fetch(gifUrl)
  const buffer = await response.arrayBuffer()
  const gif = parseGIF(buffer)
  const frames = decompressFrames(gif, true)

  if (frames.length === 0) return []

  const w = gif.lsd.width
  const h = gif.lsd.height

  // Persistent composition canvas for cumulative frame building
  const compCanvas = document.createElement('canvas')
  compCanvas.width = w
  compCanvas.height = h
  const compCtx = compCanvas.getContext('2d')!

  const result: GifFrame[] = []

  for (const frame of frames) {
    // Save state before drawing (needed for disposal type 3: restore to previous)
    const savedData = frame.disposalType === 3 ? compCtx.getImageData(0, 0, w, h) : null

    // Create temp canvas for this frame's patch
    const patchCanvas = document.createElement('canvas')
    patchCanvas.width = frame.dims.width
    patchCanvas.height = frame.dims.height
    const patchCtx = patchCanvas.getContext('2d')!

    patchCtx.putImageData(
      new ImageData(new Uint8ClampedArray(frame.patch), frame.dims.width, frame.dims.height),
      0,
      0
    )

    // Composite patch onto the persistent canvas
    compCtx.drawImage(patchCanvas, frame.dims.left, frame.dims.top)

    // Take snapshot of the full composited state
    const snapshot = document.createElement('canvas')
    snapshot.width = w
    snapshot.height = h
    snapshot.getContext('2d')!.drawImage(compCanvas, 0, 0)

    result.push({
      canvas: snapshot,
      delay: (frame.delay || 5) * 10 // centiseconds → milliseconds
    })

    // Apply disposal after snapshot
    if (frame.disposalType === 2) {
      compCtx.clearRect(frame.dims.left, frame.dims.top, frame.dims.width, frame.dims.height)
    } else if (frame.disposalType === 3 && savedData) {
      compCtx.putImageData(savedData, 0, 0)
    }
  }

  return result
}

/**
 * Draw the user's uploaded image with zoom, translation, and rotation transforms.
 */
export const drawUserImage = (
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  options: GifOptions
) => {
  const { size, translateX, translateY, rotation, zoom } = options
  ctx.save()
  ctx.translate(size / 2 + translateX, size / 2 + translateY)
  ctx.rotate((rotation * Math.PI) / 180)
  ctx.scale(zoom, zoom)
  ctx.drawImage(image, -size / 2, -size / 2, size, size)
  ctx.restore()
}

/**
 * Render a single composited frame: user image underneath + mask frame on top.
 */
export const renderFrame = (
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement | null,
  frame: GifFrame,
  options: GifOptions
) => {
  ctx.clearRect(0, 0, options.size, options.size)
  if (image) {
    drawUserImage(ctx, image, options)
  }
  ctx.save()
  ctx.globalAlpha = options.frameOpacity
  ctx.drawImage(frame.canvas, 0, 0, options.size, options.size)
  ctx.restore()
}

/**
 * Generate a GIF blob from user image + mask frames.
 */
export const generateGif = (
  image: HTMLImageElement | null,
  frames: GifFrame[],
  options: GifOptions
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    if (!window.GIF) {
      reject(new Error('GIF library not loaded'))
      return
    }

    const canvas = document.createElement('canvas')
    canvas.width = options.size
    canvas.height = options.size
    const ctx = canvas.getContext('2d')!

    const renderer = new window.GIF({
      quality: 2,
      workers: 4,
      workerScript: '/vendor/gifjs/gif.worker.js',
      width: options.size,
      height: options.size
    })

    renderer.on('finished', (blob: Blob) => resolve(blob))

    for (const frame of frames) {
      renderFrame(ctx, image, frame, options)
      renderer.addFrame(ctx, { delay: options.delay, copy: true })
    }

    renderer.render()
  })
}

/**
 * Generate and auto-download the GIF.
 */
export const generateAndDownloadGif = async (
  image: HTMLImageElement | null,
  frames: GifFrame[],
  options: GifOptions
) => {
  const blob = await generateGif(image, frames, options)
  download(blob, `${options.mask}-${options.input}`, 'gif')
}
