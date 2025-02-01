<template>
  <div class="flex justify-center gap-2">
    <button
      id="download-button"
      class="rounded bg-white/10 p-1 transition-colors hover:bg-white/20"
      :data-tooltip="'Save as file'"
      @click="downloadTextFile"
    >
      💾
    </button>

    <button
      id="upload-button"
      class="rounded bg-white/10 p-1 transition-colors hover:bg-white/20"
      :data-tooltip="'Load from file'"
      @click="clickFileInput"
    >
      📂
    </button>

    <input ref="fileRef" type="file" class="hidden" @change="loadTextFile" accept=".emoji" />
  </div>
</template>

<script setup lang="ts">
const store = useStore()

const fileRef = ref<HTMLInputElement>()

const clickFileInput = () => {
  fileRef.value?.click()
}

const signatureHeader = () => {
  // DrawMoji;
  // PaintMoji;
  // EmojiPaint;
  const project = 'shape-to-emoji'
  const name = 'Created By: Quentin Juarez'
  const github = 'GitHub: https://github.com/quentinjuarez/shape-to-emoji'
  const version = `Version: ${__VERSION__}\n`
  return [project, name, github, version].join('\n')
}

const downloadTextFile = () => {
  const text = `${signatureHeader()}\n${store.canvasToText()}`
  const blob = new Blob([text], { type: 'text/plain' })
  // const url = URL.createObjectURL(blob)
  // const a = document.createElement('a')
  // a.href = url
  // const random = Math.random().toString(36).substring(7)
  // a.download = random + '.emoji'
  // a.click()
  // URL.revokeObjectURL(url)
  download(blob, 'config', 'emoji')
}

const loadTextFile = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target?.files?.[0]
  if (!file) return

  const reader = new FileReader()

  reader.onload = async (e: any) => {
    let text = e.target.result
    if (!text || typeof text !== 'string') {
      console.warn('Invalid file content.')
      return
    }

    if (!text.startsWith('shape-to-emoji')) {
      console.warn('Invalid file signature.')
      return
    }
    // remove 4 first line
    text = text.split('\n').slice(4).join('\n')

    if (!text) return
    store.addFrame(text)
    store.textToCanvas(text)

    // Reset the file input
    target.value = ''
  }

  reader.onerror = (error) => {
    console.error('Error reading the file:', error)
  }

  reader.readAsText(file)
}
</script>
