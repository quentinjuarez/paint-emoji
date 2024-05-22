<template>
  <div class="mt-4 w-full space-y-4 lg:h-[calc(100vh-164px)]">
    <EmojiSelection />

    <DrawCanvas>
      <div class="flex justify-center">
        <button
          @click="handleCopy"
          class="flex w-48 items-center justify-center gap-2 rounded bg-white/10 px-2 py-1 transition-colors hover:bg-white/20"
        >
          <span>
            {{ copy ? '✅ Copied!' : 'Copy' }}
          </span>

          <Shortcut shortcut="c" ctrl @confirm="handleCopy" />
        </button>
      </div>
    </DrawCanvas>
  </div>
</template>

<script setup lang="ts">
const store = useStore()

const copy = ref(false)

const optimizedTop = (lines: string[]) => {
  let start = 0

  // Find the first non-empty row from the start
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() !== '0'.repeat(store.settings.tilesPerRow)) {
      start = i
      break
    }
  }

  return lines.slice(start)
}

const optimizedBottom = (lines: string[]) => {
  let end = lines.length - 1

  // Find the last non-empty row from the end
  for (let i = lines.length - 1; i >= 0; i--) {
    if (lines[i].trim() !== '0'.repeat(store.settings.tilesPerRow)) {
      end = i
      break
    }
  }

  return lines.slice(0, end + 1)
}

const optimizedRight = (lines: string[]) => {
  return lines.map((line) => {
    let emptySpaceLength = 0

    // loop through the line from right to left
    for (let i = line.length - 1; i >= 0; i--) {
      const char = line[i]

      if (char !== '0') {
        break
      }

      emptySpaceLength++
    }

    return line.slice(0, line.length - emptySpaceLength)
  })
}

const optimizedLeft = (lines: string[]) => {
  let minEmptySpaceLength = 0

  lines.forEach((line, index) => {
    let emptySpaceLength = 0

    // loop through the line from left to right
    for (let i = 0; i < line.length; i++) {
      const char = line[i]

      if (char !== '0') {
        break
      }

      emptySpaceLength++
    }

    if (index === 0) {
      minEmptySpaceLength = emptySpaceLength
    } else {
      minEmptySpaceLength = Math.min(minEmptySpaceLength, emptySpaceLength)
    }
  })

  return lines.map((line) => {
    return line.slice(minEmptySpaceLength)
  })
}

const handleCopy = () => {
  try {
    const text = store.lastFrame

    if (!text) {
      return
    }

    copy.value = true

    let lines = text.trim().split('\n')

    if (store.options.optimizeTop) {
      lines = optimizedTop(lines)
    }

    if (store.options.optimizeBottom) {
      lines = optimizedBottom(lines)
    }

    if (store.options.optimizeRight) {
      lines = optimizedRight(lines)
    }

    if (store.options.optimizeLeft) {
      lines = optimizedLeft(lines)
    }

    const copyText = lines
      .join('\n')
      .replaceAll('0', ':_:')
      .replace(/\d/g, (match) => {
        const index = parseInt(match) - 1
        return index < store.emojiSelection.length ? store.emojiSelection[index].name : ''
      })

    navigator.clipboard.writeText(copyText)
  } catch (error) {
    console.error(error)
  } finally {
    setTimeout(() => {
      copy.value = false
    }, 1000)
  }
}
</script>
