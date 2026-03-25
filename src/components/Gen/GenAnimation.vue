<template>
  <div class="flex h-full items-center justify-center gap-12">
    <!-- CANVAS PREVIEW -->
    <div class="flex flex-col items-center gap-3">
      <div class="relative" style="width: 384px; height: 384px">
        <canvas
          ref="canvasRef"
          class="absolute top-0 left-0 origin-top-left scale-[3] cursor-grab rounded border border-white/20 active:cursor-grabbing"
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
          {{ maskFrames.length ? maskFrames.length + ' frames' : 'loading…' }}
        </span>
        <span v-else class="rounded bg-white/10 px-2 py-0.5 text-white/40">static</span>
      </div>
      <!-- format badge (beta only) -->
      <div v-if="store.beta && inputFormat" class="flex items-center gap-1 text-xs text-white/30">
        <span
          class="rounded px-2 py-0.5"
          :class="
            inputFormat === 'webp'
              ? 'bg-green-500/20 text-green-300'
              : 'bg-blue-500/20 text-blue-300'
          "
        >
          {{ inputFormat.toUpperCase() }}
        </span>
        <span v-if="inputFrames.length > 1" class="rounded bg-white/10 px-2 py-0.5 text-white/40">
          {{ inputFrames.length }} input frames
        </span>
      </div>
    </div>

    <!-- RIGHT PANEL -->
    <div class="w-60 space-y-5">
      <!-- Upload -->
      <div class="space-y-2">
        <DragAndDrop :accept="store.beta ? 'image/*,.webp' : 'image/*'" @file="onDropFile" />
        <input
          class="hidden"
          ref="inputRef"
          type="file"
          :accept="store.beta ? 'image/*,.webp' : 'image/*'"
          @change="onInputChange"
        />
        <UiButton class="w-full" @click="browseFiles">
          {{ file ? 'Change Image' : 'Upload Image' }}
          <Shortcut shortcut="f" ctrl @confirm="browseFiles" />
        </UiButton>
        <p v-if="file" class="truncate text-center text-xs text-white/50">{{ file.name }}</p>
      </div>

      <!-- Settings -->
      <div class="space-y-2">
        <div class="flex items-center justify-between">
          <span class="text-sm font-semibold">Settings</span>
          <UiButton variant="ghost" size="sm" @click="resetOptions">Reset</UiButton>
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
        <UiButton class="w-full" @click="downloadPng">Download PNG</UiButton>
        <UiButton
          v-if="store.beta"
          class="w-full bg-green-700 hover:bg-green-600"
          @click="downloadWebp"
        >
          Download WebP
        </UiButton>
        <UiButton
          v-if="currentMask?.animated"
          class="w-full bg-purple-600 hover:bg-purple-500"
          @click="handleGenerateGif"
          :disabled="generating || !maskFrames.length"
        >
          {{ generating ? 'Generating…' : 'Generate GIF' }}
        </UiButton>
        <UiButton
          v-if="store.beta && currentMask?.animated"
          class="w-full bg-green-700 hover:bg-green-600"
          @click="handleGenerateWebp"
          :disabled="generatingWebp || !maskFrames.length"
        >
          {{
            generatingWebp
              ? `Encoding… ${webpProgress.done}/${webpProgress.total}`
              : 'Generate WebP'
          }}
        </UiButton>
        <p v-if="generating || generatingWebp" class="text-center text-xs text-white/40">
          This may take a moment…
        </p>
      </div>

      <!-- Slack Preview -->
      <div v-if="file && previewUrl" class="space-y-2">
        <span class="text-sm font-semibold">Slack Preview</span>
        <div class="rounded-lg bg-[rgb(26,29,33)] p-3 text-sm">
          <div class="flex gap-2">
            <img
              src="https://ca.slack-edge.com/TSTD7B5L5-U0329SYSH09-36b9d0738769-512"
              class="mt-0.5 h-9 w-9 shrink-0 rounded object-cover"
            />
            <div class="min-w-0">
              <div class="flex items-baseline gap-2">
                <span class="font-bold text-white">Quentin</span>
                <span class="text-xs text-white/40">10 h 37</span>
              </div>
              <div class="mt-1 flex flex-wrap items-center gap-x-0.5 text-white/80">
                <span>Voici un emoji</span>
                <img :src="previewUrl" class="inline-block h-5 w-5 align-middle" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const PREVIEW_SCALE = 3

const canvasRef = ref<HTMLCanvasElement | null>(null)
const inputRef = ref<HTMLInputElement | null>(null)
const file = ref<File>()
const previewUrl = ref<string>('')
const image = ref<HTMLImageElement | null>(null)
const maskFrames = ref<AnimFrame[]>([])
const inputFrames = ref<AnimFrame[]>([])
const inputFormat = ref<string>('')
const maskImageEl = ref<HTMLImageElement | null>(null)
const generating = ref(false)
const generatingWebp = ref(false)
const webpProgress = ref({ done: 0, total: 0 })

const options = ref<FrameRenderOptions>({ ...DEFAULT_FRAME_OPTIONS })

const store = useStore()
const { currentMask } = storeToRefs(store)

// ---- File handling ----

const browseFiles = () => inputRef.value?.click()

const onInputChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.files?.[0]) loadImage(target.files[0])
}

const onDropFile = (droppedFile: File) => loadImage(droppedFile)

const loadImage = async (newFile: File) => {
  file.value = newFile
  options.value.input = newFile.name.replace(/\.[^.]+$/, '')

  if (store.beta) {
    const ext = newFile.name.split('.').pop()?.toLowerCase() ?? ''
    inputFormat.value = ext
    try {
      inputFrames.value = await extractAnimatedFrames(newFile)
    } catch {
      inputFrames.value = []
    }
  } else {
    inputFormat.value = ''
    inputFrames.value = []
  }

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
  if (store.beta) {
    options.value = { ...DEFAULT_FRAME_OPTIONS, mask, input }
  } else {
    options.value = { ...DEFAULT_GIF_OPTIONS, mask, input } as FrameRenderOptions
  }
}

// ---- Mask loading ----

const getMaskImages = () => {
  const mask = currentMask.value
  if (!mask) return null
  if (store.beta) {
    return mask.imagesBeta?.length ? mask.imagesBeta : mask.images
  }
  return mask.images
}

const getMaskUrl = () => {
  const imgs = getMaskImages()
  if (!imgs?.length) return null
  const entry = imgs.find((i) => i.scale === store.selectedMaskScale) ?? imgs[imgs.length - 1]
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
    maskFrames.value = []
    return
  }

  try {
    if (store.beta) {
      maskFrames.value = await extractAnimatedFrames(url)
    } else {
      maskFrames.value = await extractGifFrames(url)
    }
    options.value.delay = getDelayFromFrameCount(maskFrames.value.length)
    frameIndex = 0
    lastFrameTime = 0
  } catch (err) {
    console.error('Failed to extract mask frames:', err)
    maskFrames.value = []
  }
}

const getDelayFromFrameCount = (count: number): number => {
  if (count <= 2) return 200
  if (count <= 4) return 150
  if (count <= 10) return 100
  if (count <= 20) return 70
  if (count <= 50) return 50
  if (count <= 100) return 20
  return 10
}

// ---- Animation loop ----

let animFrameId: number | null = null
let frameIndex = 0
let lastFrameTime = 0
let previewTick = 0

const animate = (timestamp: number) => {
  const canvas = canvasRef.value
  if (!canvas) {
    animFrameId = requestAnimationFrame(animate)
    return
  }

  const ctx = canvas.getContext('2d')!
  const { size } = options.value
  const frames = maskFrames.value
  const img = image.value
  const maskEl = maskImageEl.value

  if (frames.length > 0) {
    const elapsed = timestamp - lastFrameTime
    if (elapsed >= options.value.delay) {
      lastFrameTime = timestamp - (elapsed % options.value.delay)
      frameIndex = (frameIndex + 1) % frames.length
    }
    if (store.beta) {
      renderCompositeFrame(ctx, img, frames[frameIndex], options.value)
    } else {
      renderFrame(ctx, img, frames[frameIndex], options.value as GifOptions)
    }
  } else {
    ctx.clearRect(0, 0, size, size)
    if (img?.complete && img.naturalWidth > 0) {
      if (store.beta) {
        drawUserImageOnCtx(ctx, img, options.value)
      } else {
        drawUserImage(ctx, img, options.value as GifOptions)
      }
    }
    if (maskEl?.complete && maskEl.naturalWidth > 0) {
      ctx.save()
      ctx.globalAlpha = options.value.frameOpacity
      ctx.drawImage(maskEl, 0, 0, size, size)
      ctx.restore()
    }
  }

  previewTick++
  if (previewTick % 8 === 0 && file.value) {
    previewUrl.value = canvas.toDataURL('image/png')
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

// ---- Downloads ----

const downloadPng = () => {
  const canvas = canvasRef.value
  if (!canvas) return
  if (store.beta) {
    canvas.toBlob((blob) => {
      if (!blob) return
      download(
        blob,
        `${currentMask.value?.name ?? 'mask'}-${options.value.input || 'image'}`,
        'png'
      )
    }, 'image/png')
  } else {
    const link = document.createElement('a')
    link.download = `${currentMask.value?.name ?? 'mask'}-${options.value.input || 'image'}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }
}

const downloadWebp = async () => {
  const canvas = canvasRef.value
  if (!canvas) return
  try {
    const blob = await canvasToWebpBlob(canvas)
    download(blob, `${currentMask.value?.name ?? 'mask'}-${options.value.input || 'image'}`, 'webp')
  } catch (err) {
    console.error('WebP export failed:', err)
  }
}

// ---- Generate GIF ----

const handleGenerateGif = async () => {
  if (!file.value || maskFrames.value.length === 0 || generating.value) return
  generating.value = true
  try {
    if (store.beta) {
      const blob = await generateGifBlob(image.value, maskFrames.value, options.value)
      download(blob, `${options.value.mask}-${options.value.input}`, 'gif')
    } else {
      await generateAndDownloadGif(image.value, maskFrames.value, options.value as GifOptions)
    }
  } catch (err) {
    console.error('Failed to generate GIF:', err)
  } finally {
    generating.value = false
  }
}

// ---- Generate animated WebP ----

const handleGenerateWebp = async () => {
  if (!file.value || maskFrames.value.length === 0 || generatingWebp.value) return
  generatingWebp.value = true
  webpProgress.value = { done: 0, total: maskFrames.value.length }
  try {
    const blob = await generateAnimatedWebpBlob(
      image.value,
      maskFrames.value,
      options.value,
      0.9,
      (done, total) => {
        webpProgress.value = { done, total }
      }
    )
    download(blob, `${options.value.mask}-${options.value.input}`, 'webp')
  } catch (err) {
    console.error('Failed to generate animated WebP:', err)
  } finally {
    generatingWebp.value = false
    webpProgress.value = { done: 0, total: 0 }
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

// Reload mask when switching engines (images vs imagesBeta)
watch(
  () => store.beta,
  () => {
    loadMask()
  }
)
</script>
