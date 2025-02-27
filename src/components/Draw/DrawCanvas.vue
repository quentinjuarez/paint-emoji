<template>
  <div class="relative flex h-full flex-col items-center justify-center gap-4">
    <div
      id="canvas"
      :style="{
        backgroundColor: store.darkMode ? 'rgb(27, 29, 33)' : 'white'
      }"
      class="relative size-[calc(32*12px)] cursor-cell select-none md:size-[calc(32*16px)] lg:size-[calc(32*16px)]"
      ref="canvasRef"
    >
      <div
        :style="props.sliceStyle"
        class="pointer-events-none absolute ring-1 ring-purple-700"
      ></div>
      <div v-for="(row, i) in store.displayedFrame" :key="i" class="flex">
        <div
          v-for="(value, j) in row"
          :key="j"
          class="size-3 ring-1 ring-transparent hover:ring-purple-500 md:size-4 lg:size-4"
        >
          <BaseEmoji
            v-if="value !== '0'"
            :emoji="store.emojiSelection[valueToIndex(value)]"
            size="sm"
          />
        </div>
      </div>

      <!-- TOOLS -->
      <div class="absolute -right-12 top-22 z-10 flex flex-col gap-2 lg:top-40">
        <button
          class="size-8 rounded border-2 border-transparent bg-white/10"
          :class="{ '!border-purple-500': !isErasing }"
          @click="isErasing = !isErasing"
        >
          ✏️
        </button>
        <button
          class="rounded border-2 border-transparent bg-white/10"
          :class="{ '!border-purple-500': isErasing }"
          @click="isErasing = !isErasing"
        >
          🧽
        </button>
      </div>
    </div>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  sliceStyle: any
}>()

const store = useStore()

const TILE_SIZE = store.settings.tileSize
const TILES_PER_ROW = store.settings.tilesPerRow
const CANVAS_SIZE = TILE_SIZE * TILES_PER_ROW

const canvasRef = ref<HTMLCanvasElement | null>(null)

const isDrawing = ref(false)
const isErasing = ref(false)
const isRightClick = ref(false)

const valueToIndex = (value: string) => {
  return parseInt(value, 10) - 1
}

const { isMedium, isLarge } = useScreen()

onMounted(() => {
  if (!canvasRef.value) {
    return
  }

  store.textToCanvas(store.lastFrame)

  canvasRef.value.addEventListener('contextmenu', (e) => {
    e.preventDefault() // Prevent the default right-click context menu
  })

  canvasRef.value.addEventListener('mousedown', (e) => {
    isDrawing.value = true
    if (e.button === 2) {
      isRightClick.value = true
    } else {
      isRightClick.value = false
    }

    draw(e)
  })

  canvasRef.value.addEventListener('mousemove', (e) => {
    if (isDrawing.value) {
      draw(e)
    }
  })

  canvasRef.value.addEventListener('mouseup', () => {
    isDrawing.value = false
    isRightClick.value = false
    const text = store.canvasToText()

    if (!text) return
    store.addFrame(text)
  })
})

const draw = (e: MouseEvent) => {
  e.preventDefault()
  if (!canvasRef.value) return

  const rect = canvasRef.value.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top

  // lg -> 1
  // md -> 1
  // sm -> 0.75
  const ratio = isLarge.value ? 1 : isMedium.value ? 1 : 0.75
  const tileSize = TILE_SIZE * ratio
  const canvasSize = CANVAS_SIZE * ratio

  // Adjust x and y coordinates to align with the closest tile
  const tileX = Math.floor(x / tileSize) * tileSize
  const tileY = Math.floor(y / tileSize) * tileSize

  if (tileX < 0 || tileY < 0) return
  if (tileX >= canvasSize || tileY >= canvasSize) return

  store.displayedFrame[tileY / tileSize][tileX / tileSize] =
    store.selectedEmojiIndex === undefined || isErasing.value || isRightClick.value
      ? '0'
      : String(store.selectedEmojiIndex + 1)
}
</script>
