<template>
  <div class="flex h-full items-center justify-center gap-8">
    <!-- CANVAS PREVIEW -->
    <canvas
      ref="canvasRef"
      class="mr-32 scale-[3] rounded border border-gray-300"
      :width="options.size"
      :height="options.size"
      @wheel.prevent="onWheel"
      @mousedown="onMouseDown"
    />

    <div class="space-y-8">
      <DragAndDrop accept="image/*" @file="onDropFile" />
      <input class="hidden" ref="inputRef" type="file" accept="image/*" @change="onInputChange" />

      <div class="space-y-2">
        <button
          @click="browseFiles"
          class="mx-auto flex w-48 items-center justify-center gap-2 rounded bg-white/10 px-2 py-1 transition-colors hover:bg-white/20"
        >
          <span>{{ file ? 'Change Image' : 'Upload Image' }}</span>
          <Shortcut shortcut="f" ctrl @confirm="browseFiles" />
        </button>
        <p class="text-center text-white">{{ file?.name }}</p>

        <!-- SETTINGS -->
        <div class="w-full space-y-2">
          <div class="flex items-center justify-between">
            <h2>Settings</h2>
            <button
              @click="resetOptions"
              class="flex items-center justify-center gap-2 rounded bg-white/10 px-2 py-1 transition-colors hover:bg-white/20"
            >
              <span>Reset</span>
            </button>
          </div>
          <div>
            <label>Delay: </label>
            <input
              class="accent-purple-500"
              type="range"
              min="10"
              max="200"
              step="10"
              v-model.number="options.delay"
            />
          </div>
          <div>
            <label>Zoom: </label>
            <input
              class="accent-purple-500"
              type="range"
              min="0.5"
              max="2"
              step="0.01"
              v-model.number="options.zoom"
            />
          </div>
          <div>
            <label>Translate X: </label>
            <input
              class="accent-purple-500"
              type="range"
              min="-128"
              max="128"
              step="1"
              v-model.number="options.translateX"
            />
          </div>
          <div>
            <label>Translate Y: </label>
            <input
              class="accent-purple-500"
              type="range"
              min="-128"
              max="128"
              step="1"
              v-model.number="options.translateY"
            />
          </div>
          <div>
            <label>Rotate: </label>
            <input
              class="accent-purple-500"
              type="range"
              min="0"
              max="360"
              step="1"
              v-model.number="options.rotation"
            />
          </div>
        </div>

        <button
          v-if="file"
          @click="handleGenerate"
          :disabled="generating || !gifFrames.length"
          class="mx-auto flex w-48 items-center justify-center gap-2 rounded bg-white/10 px-2 py-1 transition-colors hover:bg-white/20 disabled:opacity-50"
        >
          <span>{{ generating ? 'Generating...' : 'Generate GIF' }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { GifFrame, GifOptions } from '@/utils/gif'

const PREVIEW_SCALE = 3

const canvasRef = ref<HTMLCanvasElement | null>(null)
const inputRef = ref<HTMLInputElement | null>(null)
const file = ref<File>()
const image = ref<HTMLImageElement | null>(null)
const gifFrames = ref<GifFrame[]>([])
const generating = ref(false)

const options = ref<GifOptions>({ ...DEFAULT_GIF_OPTIONS })

// ---- Store ----

const store = useStore()
const { currentMask } = storeToRefs(store)

// ---- File handling ----

const browseFiles = () => inputRef.value?.click()

const onInputChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.files?.[0]) loadImage(target.files[0])
}

const onDropFile = (droppedFile: File) => loadImage(droppedFile)

const loadImage = (newFile: File) => {
  file.value = newFile
  options.value.input = newFile.name.replace(/\.[^.]+$/, '')

  const reader = new FileReader()
  reader.onload = (e) => {
    const img = new Image()
    img.onload = () => {
      image.value = img
    }
    img.src = e.target?.result as string
  }
  reader.readAsDataURL(newFile)
}

// ---- Options ----

const resetOptions = () => {
  const { mask, input } = options.value
  options.value = { ...DEFAULT_GIF_OPTIONS, mask, input }
}

// ---- Mask frames ----

const loadMaskFrames = async () => {
  if (!currentMask.value?.animate || !currentMask.value?.src) {
    gifFrames.value = []
    return
  }
  try {
    gifFrames.value = await extractGifFrames(currentMask.value.src)
    frameIndex = 0
    lastFrameTime = 0
  } catch (err) {
    console.error('Failed to extract GIF frames:', err)
    gifFrames.value = []
  }
}

// ---- Animation loop (requestAnimationFrame) ----

let animFrameId: number | null = null
let frameIndex = 0
let lastFrameTime = 0

const animate = (timestamp: number) => {
  const canvas = canvasRef.value
  if (!canvas) {
    animFrameId = requestAnimationFrame(animate)
    return
  }

  const ctx = canvas.getContext('2d')!
  const { size } = options.value
  const frames = gifFrames.value
  const img = image.value

  if (frames.length > 0) {
    // Advance frame based on elapsed time
    const elapsed = timestamp - lastFrameTime
    if (elapsed >= options.value.delay) {
      lastFrameTime = timestamp - (elapsed % options.value.delay)
      frameIndex = (frameIndex + 1) % frames.length
    }
    renderFrame(ctx, img, frames[frameIndex], options.value)
  } else {
    // No mask frames loaded yet — show static image preview
    ctx.clearRect(0, 0, size, size)
    if (img?.complete && img.naturalWidth > 0) {
      drawUserImage(ctx, img, options.value)
    }
  }

  animFrameId = requestAnimationFrame(animate)
}

// ---- Mouse interaction ----

let isDragging = false
const dragStart = { x: 0, y: 0 }
const dragInitial = { x: 0, y: 0 }

const onMouseDown = (e: MouseEvent) => {
  isDragging = true
  dragStart.x = e.clientX
  dragStart.y = e.clientY
  dragInitial.x = options.value.translateX
  dragInitial.y = options.value.translateY
}

const onMouseMove = (e: MouseEvent) => {
  if (!isDragging) return
  const dx = (e.clientX - dragStart.x) / PREVIEW_SCALE
  const dy = (e.clientY - dragStart.y) / PREVIEW_SCALE
  options.value.translateX = Math.round(dragInitial.x + dx)
  options.value.translateY = Math.round(dragInitial.y + dy)
}

const onMouseUp = () => {
  isDragging = false
}

const onWheel = (e: WheelEvent) => {
  if (e.ctrlKey || e.metaKey) {
    // Rotate
    const newRotation = options.value.rotation + e.deltaY * 0.1
    options.value.rotation = Math.round(Math.min(360, Math.max(0, newRotation)))
  } else {
    // Zoom
    const delta = -e.deltaY * 0.001
    const newZoom = Math.round((options.value.zoom + delta) * 100) / 100
    options.value.zoom = Math.min(2, Math.max(0.5, newZoom))
  }
}

// ---- Generate GIF ----

const handleGenerate = async () => {
  if (!file.value || gifFrames.value.length === 0 || generating.value) return
  generating.value = true
  try {
    await generateAndDownloadGif(image.value, gifFrames.value, options.value)
  } catch (err) {
    console.error('Failed to generate GIF:', err)
  } finally {
    generating.value = false
  }
}

// ---- Lifecycle ----

onMounted(() => {
  if (currentMask.value) {
    options.value.mask = currentMask.value.name
  }
  loadMaskFrames()

  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('mouseup', onMouseUp)

  animFrameId = requestAnimationFrame(animate)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', onMouseMove)
  window.removeEventListener('mouseup', onMouseUp)
  if (animFrameId !== null) cancelAnimationFrame(animFrameId)
})

watch(currentMask, () => {
  if (currentMask.value) {
    options.value.mask = currentMask.value.name
  }
  loadMaskFrames()
})
</script>
