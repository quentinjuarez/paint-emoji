<template>
  <div class="flex justify-center gap-1.5">
    <UiButton size="icon" v-tooltip="'Save as file'" @click="downloadTextFile"
      ><Save class="size-4"
    /></UiButton>
    <UiButton size="icon" v-tooltip="'Load from file'" @click="clickFileInput"
      ><FolderOpen class="size-4"
    /></UiButton>
    <input ref="fileRef" type="file" class="hidden" @change="loadTextFile" accept=".emoji" />
  </div>
</template>

<script setup lang="ts">
import { Save, FolderOpen } from 'lucide-vue-next'

const store = useStore()

const fileRef = ref<HTMLInputElement>()

const clickFileInput = () => {
  fileRef.value?.click()
}

const signatureHeader = () => {
  const project = 'paint-emoji'
  const name = 'Created By: Quentin Juarez'
  const github = 'GitHub: https://github.com/quentinjuarez/paint-emoji'
  return [project, name, github].join('\n')
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

  reader.onload = async (e: ProgressEvent<FileReader>) => {
    let text = e.target?.result
    if (!text || typeof text !== 'string') {
      console.warn('Invalid file content.')
      return
    }

    if (!text.startsWith('paint-emoji')) {
      console.warn('Invalid file signature.')
      return
    }
    // remove 3 first line
    text = text.split('\n').slice(3).join('\n')

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
