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

  const emojis = initEmojis()

  store.displayedFrame.forEach((row, index) => {
    row.forEach((tile, tileIndex) => {
      const x = (tileIndex % TILE_PER_ROW) * TILE_SIZE
      const y = index * TILE_SIZE

      const emoji = store.emojiSelection[valueToIndex(tile)]

      if (!emoji) return

      if (emoji.type === 'slack') {
        ctx.font = '16px sans-serif'
        ctx.fillText(emoji.value, x, y + 16)
      } else {
        ctx.font = '16px sans-serif'
        ctx.fillText(emojis[valueToIndex(tile)].value, x, y + 16)
      }
    })
  })
}

onMounted(() => {
  generateCanvas()
})
</script>
