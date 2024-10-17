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
          <Shortcut shortcut="k" ctrl @confirm="browseFiles" />
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
            @input="drawImage"
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
            @input="drawImage"
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
            @input="drawImage"
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
            @input="drawImage"
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
import { ref, onMounted } from 'vue'
import icant from '@/assets/masks/icant.png'

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
  drawImage()
}

let uploadedImg: HTMLImageElement | null = null
let icantMask: HTMLImageElement | null = null

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
    uploadedImg = new Image()
    uploadedImg.src = e.target.result

    uploadedImg.onload = () => {
      drawImage()
    }
  }

  reader.readAsDataURL(file.value!)
}

// Function to draw the image and mask with transformations
const drawImage = () => {
  const canvas = document.getElementById('canvas') as HTMLCanvasElement
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D

  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  // If no uploaded image, do nothing
  if (!uploadedImg) return

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
  ctx.drawImage(uploadedImg, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height)

  ctx.restore() // Restore the state after transformations

  // Draw the mask image over the entire canvas (no transformation)
  if (icantMask) {
    ctx.drawImage(icantMask, 0, 0, canvas.width, canvas.height)
  }
}

// Load the 'icant' mask image once on mount
onMounted(() => {
  icantMask = new Image()
  icantMask.src = icant
  icantMask.onload = () => {
    drawImage() // Ensure the mask is drawn even if no uploaded image
  }

  const canvas = document.getElementById('canvas') as HTMLCanvasElement

  // Mousewheel event for zoom and rotate
  canvas.addEventListener('wheel', onWheel)

  // Mouse events for drag and drop
  canvas.addEventListener('mousedown', onMouseDown)
  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('mouseup', onMouseUp)
})

// Download the canvas image as PNG
const downloadImage = () => {
  if (!uploadedImg) return

  const canvas = document.getElementById('canvas') as HTMLCanvasElement

  const link = document.createElement('a')

  const fileName = file.value?.name.split('.')[0] || ''

  link.download = `icant-${fileName}.png`
  link.href = canvas.toDataURL('image/png')
  link.click()
}

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

  drawImage()
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

  drawImage()
}
</script>

<style scoped>
input[type='range'] {
  width: 100%;
}
</style>
