<template>
  <div class="flex h-full items-center justify-center gap-8">
    <!-- CANVAS -->
    <canvas id="canvas" class="border border-gray-300" width="512" height="512"></canvas>
    <div class="space-y-8">
      <DragAndDrop accept="image/*" @file="onDropChange" />

      <input class="hidden" ref="inputRef" type="file" accept="image/*" @change="onFilesChange" />
      <div>
        <button
          @click="browseFiles"
          class="mx-auto flex w-48 items-center justify-center gap-2 rounded bg-white/10 px-2 py-1 transition-colors hover:bg-white/20"
        >
          <span v-if="!file"> Upload Image </span>
          <span v-else> Change Image </span>
          <Shortcut shortcut="f" ctrl @confirm="browseFiles" />
        </button>
        <p class="text-center text-white">{{ file?.name }}</p>
      </div>
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
          <label>Zoom: </label>
          <input
            class="accent-purple-500"
            type="range"
            min="0.5"
            max="2"
            step="0.01"
            v-model="zoom"
            @input="drawPreview"
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
            v-model="translateX"
            @input="drawPreview"
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
            v-model="translateY"
            @input="drawPreview"
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
            v-model="rotation"
            @input="drawPreview"
          />
        </div>
      </div>
      <!-- DOWNLOAD -->
      <button
        @click="downloadImage"
        class="mx-auto flex w-48 items-center justify-center gap-2 rounded bg-white/10 px-2 py-1 transition-colors hover:bg-white/20"
      >
        <span> Download </span>

        <Shortcut shortcut="d" ctrl @confirm="downloadImage" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import icant from '@/assets/masks/icant.png'
import clean from '@/assets/masks/clean.gif'
import { GifReader } from 'omggif'

const masks = [
  { name: 'icant', src: icant, animated: false },
  { name: 'clean', src: clean, animated: true }
]

const store = useStore()

// const currentMaskImageElement = computed<HTMLImageElement>(() => {
//   const mask = masks.find((mask) => mask.name === store.currentMask)

//   if (!mask) return new Image()

//   const image = new Image()
//   image.src = mask.src

//   return image
// })

const currentMaskImageElement = ref<HTMLImageElement>()
const uploadedImageElement = ref<HTMLImageElement>()

const DEFAULT = {
  ZOOM: '1',
  TRANSLATE_X: '0',
  TRANSLATE_Y: '0',
  ROTATION: '25'
}

const zoom = ref(DEFAULT.ZOOM)
const translateX = ref(DEFAULT.TRANSLATE_X)
const translateY = ref(DEFAULT.TRANSLATE_Y)
const rotation = ref(DEFAULT.ROTATION)

const isDragging = ref(false)
const dragStart = ref({ x: 0, y: 0 })
const initialTranslate = ref({ x: 0, y: 0 })

const reset = () => {
  zoom.value = DEFAULT.ZOOM
  translateX.value = DEFAULT.TRANSLATE_X
  translateY.value = DEFAULT.TRANSLATE_Y
  rotation.value = DEFAULT.ROTATION
  drawPreview()
}

const file = ref<File>()

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

// Load the uploaded image
const onFileChange = (newFile: File) => {
  file.value = newFile
  const reader = new FileReader()

  reader.onload = (e: any) => {
    const image = new Image()
    image.src = e.target.result

    uploadedImageElement.value = image

    image.onload = () => {
      drawPreview()
    }
  }

  reader.readAsDataURL(file.value!)
}

const drawUploadedImage = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
  // If no uploaded image, do nothing
  if (!uploadedImageElement.value) return

  ctx.save() // Save the current state

  // Move the origin to the center of the canvas, apply translation
  ctx.translate(
    canvas.width / 2 + parseInt(translateX.value),
    canvas.height / 2 + parseInt(translateY.value)
  )

  // Rotate the canvas around the center
  ctx.rotate((parseInt(rotation.value) * Math.PI) / 180)

  // Apply zoom
  ctx.scale(parseFloat(zoom.value), parseFloat(zoom.value))

  // Draw the image centered at the new origin
  ctx.drawImage(
    uploadedImageElement.value,
    -canvas.width / 2,
    -canvas.height / 2,
    canvas.width,
    canvas.height
  )

  ctx.restore() // Restore the state after transformations
}

// Function to draw the image and mask with transformations
const drawPreview = () => {
  const canvas = document.getElementById('canvas') as HTMLCanvasElement
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D

  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  // Draw the uploaded image with transformations
  drawUploadedImage(canvas, ctx)

  // Draw the mask image over the entire canvas (no transformation)
  if (currentMaskImageElement.value && uploadedImageElement.value) {
    ctx.drawImage(currentMaskImageElement.value, 0, 0, canvas.width, canvas.height)
  }
}

onMounted(() => {
  const canvas = document.getElementById('canvas') as HTMLCanvasElement

  // Mousewheel event for zoom and rotate
  canvas.addEventListener('wheel', onWheel)

  // Mouse events for drag and drop
  canvas.addEventListener('mousedown', onMouseDown)
  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('mouseup', onMouseUp)
})

const inputRef = ref<HTMLInputElement | null>(null)

// Handle mouse drag for translation
const onMouseDown = (e: MouseEvent) => {
  isDragging.value = true
  dragStart.value = { x: e.clientX, y: e.clientY }
  initialTranslate.value = { x: parseInt(translateX.value), y: parseInt(translateY.value) }
}

const onMouseMove = (e: MouseEvent) => {
  if (!isDragging.value) return

  const deltaX = e.clientX - dragStart.value.x
  const deltaY = e.clientY - dragStart.value.y

  translateX.value = (initialTranslate.value.x + deltaX).toString()
  translateY.value = (initialTranslate.value.y + deltaY).toString()

  drawPreview()
}

const onMouseUp = () => {
  isDragging.value = false
}

// Handle mousewheel for zoom and rotation
const onWheel = (e: WheelEvent) => {
  e.preventDefault()

  if (e.ctrlKey || e.metaKey) {
    // Rotate
    rotation.value = String(Math.min(360, Math.max(0, parseInt(rotation.value) + e.deltaY * 0.1)))
  } else {
    // Zoom
    const zoomDelta = -e.deltaY * 0.001
    const roundedNewVal = Math.round((parseFloat(zoom.value) + zoomDelta) * 100) / 100
    zoom.value = String(Math.min(2, Math.max(0.5, roundedNewVal)))
  }

  drawPreview()
}

watch(
  () => store.currentMask,
  (newVal) => {
    const mask = masks.find((mask) => mask.name === newVal)

    if (!mask) return

    const image = new Image()
    image.src = mask.src

    currentMaskImageElement.value = image

    image.onload = () => {
      drawPreview()
    }
  },
  { immediate: true }
)

const getFrames = () => {
  const mask = masks.find((mask) => mask.name === store.currentMask)
  if (!mask || !mask.animated) return []

  const reader = new GifReader(mask.src)
  const frames = []

  for (let i = 0; i < reader.numFrames(); i++) {
    const frame = reader.decodeAndBlitFrameRGBA(i, new Uint8Array(reader.width * reader.height * 4))
    const imageData = new ImageData(new Uint8ClampedArray(frame), reader.width, reader.height)
    frames.push(imageData)
  }

  return frames
}

const downloadImage = async () => {
  if (!uploadedImageElement.value) return

  const canvas = document.getElementById('canvas') as HTMLCanvasElement
  const mask = masks.find((mask) => mask.name === store.currentMask)
  const fileName = file.value?.name.split('.')[0] || ''

  if (!mask) return

  // Case 1: Download as PNG
  if (mask.animated === false) {
    const link = document.createElement('a')
    link.download = `${store.currentMask}-${fileName}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  } else {
    // Case 2: Download as GIF using omggif
    const frames = getFrames()

    console.log(frames)
  }
}
</script>

<style scoped>
input[type='range'] {
  width: 100%;
}
</style>
