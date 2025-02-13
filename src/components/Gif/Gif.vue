<template>
  <div class="flex h-full items-center justify-center gap-8">
    <!-- CANVAS -->
    <canvas
      id="preview-canvas"
      class="mr-32 scale-[3] rounded border border-gray-300"
      :width="options.size"
      :height="options.size"
    ></canvas>
    <div class="space-y-8">
      <DragAndDrop accept="image/*" @file="onDropChange" />
      <input class="hidden" ref="inputRef" type="file" accept="image/*" @change="onFilesChange" />
      <div class="space-y-2">
        <button
          @click="browseFiles"
          class="mx-auto flex w-48 items-center justify-center gap-2 rounded bg-white/10 px-2 py-1 transition-colors hover:bg-white/20"
        >
          <span v-if="!file"> Upload Image </span>
          <span v-else> Change Image </span>
          <Shortcut shortcut="f" ctrl @confirm="browseFiles" />
        </button>
        <p class="text-center text-white">{{ file?.name }}</p>

        <!-- SETTINGS - Zoom, Translation X,Y, Rotate -->
        <div class="w-full space-y-2">
          <div class="flex items-center justify-between">
            <h2>Settings</h2>
            <button
              @click="reset"
              class="flex items-center justify-center gap-2 rounded bg-white/10 px-2 py-1 transition-colors hover:bg-white/20"
            >
              <span> Reset </span>
            </button>
          </div>
          <div>
            <label>Delay: </label>
            <input
              class="accent-purple-500"
              type="range"
              min="0"
              max="200"
              step="10"
              v-model="options.delay"
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
              v-model="options.zoom"
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
              v-model="options.translateX"
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
              v-model="options.translateY"
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
              v-model="options.rotation"
            />
          </div>
        </div>

        <button
          v-if="file"
          @click="handleGenerateGif"
          class="mx-auto flex w-48 items-center justify-center gap-2 rounded bg-white/10 px-2 py-1 transition-colors hover:bg-white/20"
        >
          <span> Generate GIF </span>
        </button>
      </div>
    </div>

    <!-- <div class="flex flex-wrap">
      <img
        v-for="frame in gifFrames"
        :key="frame.src"
        :src="frame.src"
        class="size-2 border border-gray-300"
      />
    </div> -->
  </div>
</template>

<script setup lang="ts">
const inputRef = ref<HTMLInputElement | null>(null)
const file = ref<File>()
const gifFrames = ref<HTMLImageElement[]>([])

const DEFAULT_OPTIONS = {
  size: 128,
  delay: 50,
  zoom: '1',
  translateX: '0',
  translateY: '0',
  rotation: '0',
  input: '',
  mask: 'clean'
}

const options = ref({ ...DEFAULT_OPTIONS })

const reset = () => {
  options.value = { ...DEFAULT_OPTIONS }
}

const browseFiles = () => {
  inputRef.value?.click()
}

const onFilesChange = (e: any) => {
  const file = e.target.files[0]
  onFileChange(file)
}

const onDropChange = (file: File) => {
  onFileChange(file)
}

const image = ref<HTMLImageElement>(new Image())

const onFileChange = (newFile: File) => {
  resetPreview()
  file.value = newFile
  options.value.input = newFile.name.split('.')[0]
  const reader = new FileReader()

  reader.onload = (e: any) => {
    const img = new Image()
    img.src = e.target.result

    img.onload = () => {
      image.value = img
      processImage()
    }
  }

  reader.readAsDataURL(file.value!)
}

const previewing = ref(false)

const processImage = async () => {
  resetPreview()
  await sleep(500)
  previewing.value = true

  const canvas = document.getElementById('preview-canvas') as HTMLCanvasElement
  const ctx = canvas.getContext('2d')

  if (!ctx || !image.value || !file.value || !gifFrames.value?.length) {
    console.error('Missing context or image')
    return
  }

  let frameIndex = 0
  while (previewing.value) {
    renderFrame(ctx, image.value, gifFrames.value[frameIndex], options.value)
    frameIndex = (frameIndex + 1) % gifFrames.value.length
    await sleep(Number(options.value.delay))
  }
}

const resetPreview = () => {
  previewing.value = false
}

const handleGenerateGif = async () => {
  if (!file.value) return

  if (gifFrames.value.length === 0) {
    console.error('No frames to generate GIF')
    return
  }

  generateGif(image.value, gifFrames.value, options.value)
}

const store = useStore()

const { currentMask } = storeToRefs(store)

const handleExtractGifFrames = () => {
  if (!currentMask.value || !currentMask.value.animate) return
  gifFrames.value = []
  extractGifFrames(currentMask.value.src, gifFrames)
}

onMounted(() => {
  handleExtractGifFrames()

  options.value.mask = currentMask.value?.name || 'clean'

  const canvas = document.getElementById('preview-canvas') as HTMLCanvasElement

  // Mousewheel event for zoom and rotate
  canvas.addEventListener('wheel', onWheel)

  // Mouse events for drag and drop
  canvas.addEventListener('mousedown', onMouseDown)
  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('mouseup', onMouseUp)
})

const isDragging = ref(false)
const dragStart = ref({ x: 0, y: 0 })
const initialTranslate = ref({ x: 0, y: 0 })

// Handle mouse drag for translation
const onMouseDown = (e: MouseEvent) => {
  isDragging.value = true
  dragStart.value = { x: e.clientX, y: e.clientY }
  initialTranslate.value = {
    x: parseInt(options.value.translateX),
    y: parseInt(options.value.translateY)
  }
}

const onMouseMove = (e: MouseEvent) => {
  if (!isDragging.value) return

  const deltaX = e.clientX - dragStart.value.x
  const deltaY = e.clientY - dragStart.value.y

  options.value.translateX = (initialTranslate.value.x + deltaX).toString()
  options.value.translateY = (initialTranslate.value.y + deltaY).toString()

  processImage()
}

const onMouseUp = () => {
  isDragging.value = false
}

// Handle mousewheel for zoom and rotation
const onWheel = (e: WheelEvent) => {
  e.preventDefault()

  if (e.ctrlKey || e.metaKey) {
    // Rotate
    options.value.rotation = String(
      Math.min(360, Math.max(0, parseInt(options.value.rotation) + e.deltaY * 0.1))
    )
  } else {
    // Zoom
    const zoomDelta = -e.deltaY * 0.001
    const roundedNewVal = Math.round((parseFloat(options.value.zoom) + zoomDelta) * 100) / 100
    options.value.zoom = String(Math.min(2, Math.max(0.5, roundedNewVal)))
  }

  processImage()
}

watch(currentMask, () => {
  options.value.mask = currentMask.value?.name || 'clean'
  handleExtractGifFrames()
  processImage()
})
</script>
