<template>
  <div class="mt-8 space-y-4">
    <button
      v-if="store.textEmoji"
      class="group relative size-8 rounded border-2 !border-purple-500 bg-white/10 transition-all"
    >
      <span v-if="store.textEmoji.type === 'slack'"> {{ store.textEmoji.value }}</span>
      <img class="rounded" v-else :src="store.textEmoji.value" :alt="store.textEmoji.name" />
    </button>

    <div class="flex items-center gap-4">
      <input type="text" v-model="store.text" class="w-full rounded bg-white/10 px-2 py-1" />
      <button
        :disabled="!store.textEmoji"
        @click="handleCopyText"
        class="flex w-48 items-center justify-center gap-2 rounded bg-white/10 px-2 py-1 transition-colors hover:bg-white/20"
        :class="{
          'cursor-not-allowed hover:!bg-white/10': !store.textEmoji
        }"
      >
        <span>
          {{ copy ? '✅ Copied!' : 'Copy' }}
        </span>

        <Shortcut shortcut="c" ctrl @confirm="handleCopyText" />
      </button>
    </div>

    <div
      v-if="displaySplittedPatterns[0].length > 2"
      class="w-fit max-w-[65vw] overflow-auto p-4"
      :style="{
        backgroundColor: store.darkMode ? 'rgb(27, 29, 33)' : 'white'
      }"
    >
      <div
        v-for="(line, index) in displaySplittedPatterns"
        :key="index"
        class="flex w-fit"
        :class="{
          'mb-4': (index + 1) % 7 === 0
        }"
      >
        <div v-for="(char, index) in line" :key="index" class="size-4">
          <BaseEmoji v-show="char !== '0'" :emoji="store.textEmoji" size="sm" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const store = useStore()

const displaySplittedPatterns = computed(() => {
  return splittedTextPatterns.value
    .join('\n')
    .split('\n')
    .map((line) => line.split(''))
})

const copy = ref(false)

const MAX_LENGTH = 9

const splitLongWord = (word: string): string[] => {
  const chunks = []
  for (let i = 0; i < word.length; i += MAX_LENGTH) {
    chunks.push(word.slice(i, i + MAX_LENGTH))
  }
  return chunks
}

const splittedText = computed(() => {
  const words = store.text.split(' ')
  const lines = []
  let currentLine = ''

  for (const word of words) {
    // Line with a long word
    if (word.length > 9) {
      // Split long words into chunks
      const chunks = splitLongWord(word)
      for (const chunk of chunks) {
        if (currentLine.length + chunk.length > MAX_LENGTH) {
          if (currentLine.trim()) {
            lines.push(currentLine.trim())
          }
          currentLine = chunk + ' '
        } else {
          currentLine += chunk + ' '
        }
      }
      // Line with a normal word and an another word
    } else {
      if (currentLine.length + word.length > MAX_LENGTH) {
        if (currentLine.trim()) {
          lines.push(currentLine.trim())
        }
        currentLine = word + ' '
      } else {
        currentLine += word + ' '
      }
    }
  }

  // Add any remaining text in the current line
  if (currentLine.trim()) {
    lines.push(currentLine.trim())
  }

  return lines
})

const handleCopyText = () => {
  if (!store.textEmoji) return
  const emoji = store.textEmoji

  if (!emoji) return

  copy.value = true

  const copyText = splittedTextPatterns.value
    .join('\n\n')
    .replaceAll('0', ':_:')
    .replaceAll('1', emoji.name)

  navigator.clipboard.writeText(copyText)

  setTimeout(() => {
    copy.value = false
  }, 1000)
}

const splittedTextPatterns = computed(() => {
  return splittedText.value.map((line) => {
    return textToPatterns(line, store.textSettings.tight ? 'tight' : 'normal')
  })
})
</script>
