<template>
  <div class="flex h-full items-center justify-center gap-12">
    <!-- CANVAS PREVIEW -->
    <div class="flex flex-col items-center gap-3">
      <div class="relative" style="width: 384px; height: 384px">
        <canvas
          ref="canvasRef"
          class="absolute left-0 top-0 origin-top-left scale-[3] cursor-grab rounded border border-white/20 active:cursor-grabbing"
          :width="options.size"
          :height="options.size"
          @wheel.prevent="onWheel"
          @mousedown="onMouseDown"
        />
      </div>
      <!-- hints -->
      <div class="flex gap-4 text-xs text-white/30">
        <span>scroll → zoom</span>
        <span>⌘+scroll → rotate</span>
        <span>drag → move</span>
      </div>
      <!-- mask badge -->
      <div v-if="currentMask" class="flex items-center gap-2 text-xs">
        <span class="rounded bg-white/10 px-2 py-0.5 text-white/60">{{ currentMask.name }}</span>
        <span
          v-if="currentMask.animated"
          class="rounded bg-purple-500/30 px-2 py-0.5 text-purple-300"
        >
          {{ gifFrames.length ? gifFrames.length + ' frames' : 'loading…' }}
        </span>
        <span v-else class="rounded bg-white/10 px-2 py-0.5 text-white/40">static</span>
      </div>
    </div>

    <!-- RIGHT PANEL -->
    <div class="w-60 space-y-5">
      <!-- Upload -->
      <div class="space-y-2">
        <DragAndDrop accept="image/*" @file="onDropFile" />
        <input class="hidden" ref="inputRef" type="file" accept="image/*" @change="onInputChange" />
        <button
          @click="browseFiles"
          class="flex w-full items-center justify-center gap-2 rounded bg-white/10 px-3 py-2 text-sm transition-colors hover:bg-white/20"
        >
          <span>{{ file ? 'Change Image' : 'Upload Image' }}</span>
          <Shortcut shortcut="f" ctrl @confirm="browseFiles" />
        </button>
        <p v-if="file" class="truncate text-center text-xs text-white/50">{{ file.name }}</p>
      </div>

      <!-- Settings -->
      <div class="space-y-2">
        <div class="flex items-center justify-between">
          <span class="text-sm font-semibold">Settings</span>
          <button
            @click="resetOptions"
            class="rounded bg-white/10 px-2 py-0.5 text-xs transition-colors hover:bg-white/20"
          >
            Reset
          </button>
        </div>
        <div class="space-y-0.5">
          <div class="flex justify-between text-xs text-white/60">
            <label>Zoom</label><span>{{ options.zoom.toFixed(2) }}×</span>
          </div>
          <input
            class="w-full accent-purple-500"
            type="range"
            min="0.5"
            max="2"
            step="0.01"
            v-model.number="options.zoom"
          />
        </div>
        <div class="space-y-0.5">
          <div class="flex justify-between text-xs text-white/60">
            <label>Horizontal</label><span>{{ options.translateX }}px</span>
          </div>
          <input
            class="w-full accent-purple-500"
            type="range"
            min="-128"
            max="128"
            step="1"
            v-model.number="options.translateX"
          />
        </div>
        <div class="space-y-0.5">
          <div class="flex justify-between text-xs text-white/60">
            <label>Vertical</label><span>{{ options.translateY }}px</span>
          </div>
          <input
            class="w-full accent-purple-500"
            type="range"
            min="-128"
            max="128"
            step="1"
            v-model.number="options.translateY"
          />
        </div>
        <div class="space-y-0.5">
          <div class="flex justify-between text-xs text-white/60">
            <label>Rotate</label><span>{{ Math.round(options.rotation) }}°</span>
          </div>
          <input
            class="w-full accent-purple-500"
            type="range"
            min="0"
            max="360"
            step="1"
            v-model.number="options.rotation"
          />
        </div>
        <div class="space-y-0.5">
          <div class="flex justify-between text-xs text-white/60">
            <label>Mask Opacity</label><span>{{ Math.round(options.frameOpacity * 100) }}%</span>
          </div>
          <input
            class="w-full accent-purple-500"
            type="range"
            min="0"
            max="1"
            step="0.01"
            v-model.number="options.frameOpacity"
          />
        </div>
        <div v-if="currentMask?.animated" class="space-y-0.5">
          <div class="flex justify-between text-xs text-white/60">
            <label>Frame Delay</label><span>{{ options.delay }}ms</span>
          </div>
          <input
            class="w-full accent-purple-500"
            type="range"
            min="10"
            max="200"
            step="10"
            v-model.number="options.delay"
          />
        </div>
      </div>

      <!-- Actions -->
      <div v-if="file" class="space-y-2">
        <button
          @click="downloadPng"
          class="flex w-full items-center justify-center gap-2 rounded bg-white/10 px-3 py-2 text-sm transition-colors hover:bg-white/20"
        >
          Download PNG
        </button>
        <button
          v-if="currentMask?.animated"
          @click="handleGenerate"
          :disabled="generating || !gifFrames.length"
          class="flex w-full items-center justify-center gap-2 rounded bg-purple-600 px-3 py-2 text-sm transition-colors hover:bg-purple-500 disabled:opacity-40"
        >
          {{ generating ? 'Generating…' : 'Generate GIF' }}
        </button>
        <p v-if="generating" class="text-center text-xs text-white/40">This may take a moment…</p>
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
const maskImageEl = ref<HTMLImageElement | null>(null)
const generating = ref(false)

const options = ref<GifOptions>({ ...DEFAULT_GIF_OPTIONS })

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

// ---- Mask loading ----

const getMaskUrl = () => {
  const mask = currentMask.value
  if (!mask?.images?.length) return null
  const entry =
    mask.images.find((i: any) => i.scale === store.selectedMaskScale) ??
    mask.images[mask.images.length - 1]
  return entry?.url ?? null
}

const loadMask = async () => {
  const url = getMaskUrl()

  if (url) {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = url
    maskImageEl.value = img
  } else {
    maskImageEl.value = null
  }

  if (!currentMask.value?.animated || !url) {
    gifFrames.value = []
    return
  }
  try {
    gifFrames.value = await extractGifFrames(url)
    frameIndex = 0
    lastFrameTime = 0
  } catch (err) {
    console.error('Failed to extract GIF frames:', err)
    gifFrames.value = []
  }
}

// ---- Animation loop ----

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
  const maskEl = maskImageEl.value

  if (frames.length > 0) {
    const elapsed = timestamp - lastFrameTime
    if (elapsed >= options.value.delay) {
      lastFrameTime = timestamp - (elapsed % options.value.delay)
      frameIndex = (frameIndex + 1) % frames.length
    }
    renderFrame(ctx, img, frames[frameIndex], options.value)
  } else {
    ctx.clearRect(0, 0, size, size)
    if (img?.complete && img.naturalWidth > 0) {
      drawUserImage(ctx, img, options.value)
    }
    if (maskEl?.complete && maskEl.naturalWidth > 0) {
      ctx.save()
      ctx.globalAlpha = options.value.frameOpacity
      ctx.drawImage(maskEl, 0, 0, size, size)
      ctx.restore()
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
    const newRotation = options.value.rotation + e.deltaY * 0.1
    options.value.rotation = Math.round(Math.min(360, Math.max(0, newRotation)))
  } else {
    const delta = -e.deltaY * 0.001
    const newZoom = Math.round((options.value.zoom + delta) * 100) / 100
    options.value.zoom = Math.min(2, Math.max(0.5, newZoom))
  }
}

// ---- Download ----

const downloadPng = () => {
  const canvas = canvasRef.value
  if (!canvas) return
  const link = document.createElement('a')
  link.download = `${currentMask.value?.name ?? 'mask'}-${options.value.input || 'image'}.png`
  link.href = canvas.toDataURL('image/png')
  link.click()
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
  loadMask()

  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('mouseup', onMouseUp)

  animFrameId = requestAnimationFrame(animate)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', onMouseMove)
  window.removeEventListener('mouseup', onMouseUp)
  if (animFrameId !== null) cancelAnimationFrame(animFrameId)
})

watch([currentMask, () => store.selectedMaskScale], () => {
  if (currentMask.value) {
    options.value.mask = currentMask.value.name
  }
  loadMask()
})
</script>
