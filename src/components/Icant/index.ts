import { parseGIF, decompressFrames } from 'gifuct-js'

export const extractGifFrames = async (gifUrl: string, gifFrames: any) => {
  try {
    const response = await fetch(gifUrl)
    const buffer = await response.arrayBuffer()

    // Parse the GIF
    const gif = parseGIF(buffer)
    const frames = decompressFrames(gif, true) // Extract frames

    frames.forEach((frame) => {
      const canvas = document.createElement('canvas')
      canvas.width = gif.lsd.width
      canvas.height = gif.lsd.height
      const ctx = canvas.getContext('2d')

      if (ctx) {
        const imageData = new ImageData(
          new Uint8ClampedArray(frame.patch),
          frame.dims.width,
          frame.dims.height
        )
        ctx.putImageData(imageData, frame.dims.left, frame.dims.top)

        const img = new Image()
        img.src = canvas.toDataURL()
        gifFrames.value.push(img)
      }
    })
  } catch (error) {
    console.error('Error extracting GIF frames:', error)
  }
}

const renderCachedFrame = (ctx: CanvasRenderingContext2D, image: any, frame: any) => {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
  ctx.drawImage(image, 0, 0, ctx.canvas.width, ctx.canvas.height)
  ctx.drawImage(frame, 0, 0, ctx.canvas.width, ctx.canvas.height)
}

export const generateGif = (image: any, frames: any, options: any) => {
  if (!window.GIF) {
    console.error('GIF library not loaded')
    return
  }

  const gifOutputCanvas = document.createElement('canvas')

  const width = 128
  const height = 128

  const outputProcessingCtx = gifOutputCanvas.getContext('2d')
  if (!outputProcessingCtx) {
    return
  }

  const gifRenderer = new window.GIF({
    workers: 4,
    workerScript: `/vendor/gifjs/gif.worker.js`,
    width,
    height,
    transparent: 0x00000000
  })

  gifRenderer.on('finished', (blob: Blob) => {
    console.log('GIF finished rendering')
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'my-gif.gif'
    a.click()
    URL.revokeObjectURL(url)
  })

  for (const frame of frames) {
    renderCachedFrame(outputProcessingCtx, image, frame)
    gifRenderer.addFrame(outputProcessingCtx, { delay: options.delay, copy: true })
  }

  gifRenderer.render()
}
