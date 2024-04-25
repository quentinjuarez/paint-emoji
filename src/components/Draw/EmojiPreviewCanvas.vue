<template>
  <div class="bg-transparent" style="width: 100%; height: 100%">
    <canvas id="preview-canvas" ref="canvasRef" :width="CANVAS_SIZE" :height="CANVAS_SIZE"></canvas>
  </div>
</template>

<script setup lang="ts">
const TILE_SIZE = 16
const TILE_PER_ROW = 32

const CANVAS_SIZE = TILE_SIZE * TILE_PER_ROW

const canvasRef = ref<HTMLCanvasElement | null>(null)

const store = useStore()

const valueToIndex = (value: string) => {
  return parseInt(value, 10) - 1
}

const generateCanvas = () => {
  const canvas = canvasRef.value
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE)

  store.displayedFrame.forEach((row, index) => {
    row.forEach((tile, tileIndex) => {
      const x = (tileIndex % TILE_PER_ROW) * TILE_SIZE
      const y = index * TILE_SIZE

      const emoji = store.emojiSelection[valueToIndex(tile)]

      if (!emoji) return

      if (emoji.type === 'slack') {
        // text
        ctx.font = '16px sans-serif'
        ctx.fillText(emoji.value, x, y + 16)
      } else {
        // image
      }
    })
  })
}

const emojiSelectionPixels = async () => {
  const emojiUrls = store.emojiSelection
    .filter((emoji) => emoji.type === 'custom')
    .map((emoji) => emoji.value)

  const dataUrls = await store.getEmojiData(emojiUrls)

  if (!dataUrls) return

  console.log('dataUrls', dataUrls)

  // dataUrl
  // data:image/png;base64,R0lGODlhaABgAP0AAAA...

  dataUrls.map((dataUrl) => {
    const image = new Image()
    image.src = dataUrl
    image.onload = function () {
      return getPixels(image)
    }
  })

  return true
}

const getPixels = (image: any) => {
  const fakeCanvas = document.createElement('canvas')
  //   fakeCanvas.style.position = 'absolute'
  //   fakeCanvas.style.top = '0'
  //   fakeCanvas.style.left = '0'
  const fakeCtx = fakeCanvas.getContext('2d', { willReadFrequently: true })

  if (!fakeCtx) {
    throw new Error('Failed to create canvas context')
  }

  fakeCanvas.width = 16
  fakeCanvas.height = 16

  fakeCtx.drawImage(image, 0, 0, 16, 16)
  const imageData = fakeCtx.getImageData(0, 0, fakeCanvas.width, fakeCanvas.height)

  const pixelMap = []

  for (let y = 0; y < fakeCanvas.height; y++) {
    const row = []
    for (let x = 0; x < fakeCanvas.width; x++) {
      const index = (y * fakeCanvas.width + x) * 4 // Each pixel takes 4 array elements: RGBA
      const [r, g, b, a] = imageData.data.slice(index, index + 4)
      row.push(
        a === 0
          ? 'transparent'
          : `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
      )
    }
    pixelMap.push(row)
  }

  console.log('pixelMap', pixelMap)
}

onMounted(() => {
  generateCanvas()

  return emojiSelectionPixels()
})
</script>
