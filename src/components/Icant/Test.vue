<template>
  <div class="flex h-full items-center justify-center gap-8">
    <!-- CANVAS -->
    <canvas
      id="preview-canvas"
      class="border border-gray-300"
      :width="SIZE"
      :height="SIZE"
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
        <button
          v-if="file"
          @click="handleGenerateGif"
          class="mx-auto flex w-48 items-center justify-center gap-2 rounded bg-white/10 px-2 py-1 transition-colors hover:bg-white/20"
        >
          <span> Generate GIF </span>
        </button>
      </div>
    </div>

    <div class="flex flex-wrap">
      <img
        v-for="frame in gifFrames"
        :key="frame.src"
        :src="frame.src"
        class="size-10 border border-gray-300"
        :width="SIZE"
        :height="SIZE"
      />
    </div>

    <div>
      <label>DELAY: </label>
      <input
        class="accent-purple-500"
        type="range"
        min="10"
        max="1000"
        step="10"
        v-model="options.delay"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { extractGifFrames, generateGif } from '.'
import clean from '@/assets/masks/clean.gif'

const SIZE = 128
const inputRef = ref<HTMLInputElement | null>(null)
const file = ref<File>()
const gifFrames = ref<HTMLImageElement[]>([])
const outputGifUrl = ref<string | null>(null)

const options = ref({
  delay: 100
})

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

const imgEl = ref<HTMLImageElement>()

const onFileChange = (newFile: File) => {
  file.value = newFile
  const reader = new FileReader()

  reader.onload = (e: any) => {
    const image = new Image()
    image.src = e.target.result

    image.onload = () => {
      imgEl.value = image
      processImage(image)
    }
  }

  reader.readAsDataURL(file.value!)
}

const processImage = (image: HTMLImageElement) => {
  const canvas = document.getElementById('preview-canvas') as HTMLCanvasElement
  const ctx = canvas.getContext('2d')

  if (!ctx) return
  ctx.clearRect(0, 0, SIZE, SIZE)
  ctx.drawImage(image, 0, 0, SIZE, SIZE)

  if (gifFrames.value.length > 0) {
    let frameIndex = 0
    const interval = setInterval(() => {
      ctx.clearRect(0, 0, SIZE, SIZE)
      ctx.drawImage(image, 0, 0, SIZE, SIZE)
      ctx.drawImage(gifFrames.value[frameIndex], 0, 0, SIZE, SIZE)
      frameIndex = (frameIndex + 1) % gifFrames.value.length
    }, options.value.delay)
  }
}

const handleGenerateGif = async () => {
  if (!file.value) return

  if (gifFrames.value.length === 0) {
    console.error('No frames to generate GIF')
    return
  }

  generateGif(imgEl.value, gifFrames.value, options.value)
}

onMounted(() => {
  extractGifFrames(clean, gifFrames)
})
</script>
