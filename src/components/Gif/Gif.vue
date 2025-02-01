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
        <div>
          <label>DELAY: {{ options.delay }}</label>
          <input
            class="accent-purple-500"
            type="range"
            min="0"
            max="200"
            step="10"
            v-model="options.delay"
          />
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

const options = ref({
  size: 128,
  delay: 50,
  input: '',
  mask: 'clean'
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
    renderFrame(ctx, image.value, gifFrames.value[frameIndex])
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
})

watch(currentMask, () => {
  handleExtractGifFrames()
  processImage()
})
</script>
