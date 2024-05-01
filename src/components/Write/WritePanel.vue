<template>
  <div class="mt-8 space-y-4">
    <div class="flex items-center gap-4">
      <input type="text" v-model="store.text" class="w-full rounded bg-white/10 px-2 py-1" />
      <button
        :disabled="!store.text"
        @click="handleCopyText"
        class="flex w-48 items-center justify-center gap-2 rounded bg-white/10 px-2 py-1 transition-colors hover:bg-white/20"
        :class="{
          'cursor-not-allowed hover:!bg-white/10': !store.text
        }"
      >
        <span>
          {{ copy ? '✅ Copied!' : 'Copy' }}
        </span>

        <Shortcut shortcut="c" ctrl @confirm="handleCopyText" />
      </button>
    </div>

    <div
      v-show="displayWriteArr.length > 0"
      class="flex max-w-[65vw] flex-wrap gap-y-1 overflow-auto p-4"
      :style="{
        backgroundColor: store.darkMode ? 'rgb(27, 29, 33)' : 'white'
      }"
    >
      <div v-for="(el, index) in displayWriteArr" :key="index" class="size-7">
        <BaseEmoji :emoji="el" size="lg" write />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { emoji } from '@/assets/data/slack-emoji.json'

const customEmoji = emoji.map((e) => ({
  name: `:${e.name}:`,
  value: e.url,
  type: 'custom'
}))

const store = useStore()

const writeArr = computed(() => {
  return textToBounce(store.text)
})

const displayWriteArr = computed(() => {
  return writeArr.value.map((el) => customEmoji.find((e) => e.name === el)) as unknown as Emoji[]
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
