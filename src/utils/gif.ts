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

export const renderFrame = (
  ctx: CanvasRenderingContext2D,
  image: any,
  frame: any,
  options: any
) => {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
  drawImage(ctx, image, options)
  ctx.drawImage(frame, 0, 0, ctx.canvas.width, ctx.canvas.height)
}

const drawImage = (ctx: CanvasRenderingContext2D, image: any, options: any) => {
  ctx.save() // Save the current state

  // Move the origin to the center of the canvas, apply translation
  ctx.translate(
    options.size / 2 + parseInt(options.translateX),
    options.size / 2 + parseInt(options.translateY)
  )

  // Rotate the canvas around the center
  ctx.rotate((parseInt(options.rotation) * Math.PI) / 180)

  // Apply zoom
  ctx.scale(parseFloat(options.zoom), parseFloat(options.zoom))

  // Draw the image centered at the new origin
  ctx.drawImage(image, -options.size / 2, -options.size / 2, options.size, options.size)

  ctx.restore() // Restore the state after transformations
}

export const generateGif = (image: any, frames: any, options: any) => {
  if (!window.GIF) {
    console.error('GIF library not loaded')
    return
  }

  const gifOutputCanvas = document.createElement('canvas')
  gifOutputCanvas.width = options.size
  gifOutputCanvas.height = options.size

  const outputProcessingCtx = gifOutputCanvas.getContext('2d')
  if (!outputProcessingCtx) {
    return
  }

  const gifRenderer = new window.GIF({
    quality: 10,
    workers: 4,
    workerScript: `/vendor/gifjs/gif.worker.js`,
    width: options.size,
    height: options.size,
    transparent: 0x00000000 as any
  })

  gifRenderer.on('finished', (blob: Blob) => {
    download(blob, `${options.mask}-${options.input}`, 'gif')
  })

  for (const frame of frames) {
    renderFrame(outputProcessingCtx, image, frame, options)
    gifRenderer.addFrame(outputProcessingCtx, { delay: Number(options.delay), copy: true })
  }

  gifRenderer.render()
}
