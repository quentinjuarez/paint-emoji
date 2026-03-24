<template>
  <div class="mt-8 space-y-4">
    <div class="flex items-center gap-3">
      <UiInput v-model="store.text" placeholder="Type something..." />
      <UiButton :disabled="!store.text" @click="handleCopyText" class="w-48 shrink-0">
        {{ copy ? '✅ Copied!' : 'Copy' }}
        <Shortcut shortcut="c" ctrl @confirm="handleCopyText" />
      </UiButton>
    </div>

    <div
      v-show="displayWriteArr.length > 0"
      class="flex max-w-[65vw] flex-wrap gap-y-1 overflow-auto rounded-lg p-4"
      :style="{
        backgroundColor: store.darkMode ? 'rgb(27, 29, 33)' : 'white'
      }"
    >
      <div v-for="(el, index) in displayWriteArr" :key="index" class="size-7">
        <UiEmoji :emoji="el" size="lg" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { emojis } from '@/assets/data/custom-emojis.json'

const customEmojis = emojis.map((e) => ({
  name: `:${e.name}:`,
  value: e.url,
  type: 'custom'
}))

const store = useStore()

const writeArr = computed(() => {
  return textToBounce(store.text)
})

const displayWriteArr = computed(() => {
  return writeArr.value.map((el) => customEmojis.find((e) => e.name === el)) as unknown as Emoji[]
})

const copy = ref(false)

const handleCopyText = () => {
  if (!store.textEmoji) return
  const emoji = store.textEmoji

  if (!emoji) return

  copy.value = true

  const copyText = writeArr.value.join('')

  navigator.clipboard.writeText(copyText)

  setTimeout(() => {
    copy.value = false
  }, 1000)
}
</script>
