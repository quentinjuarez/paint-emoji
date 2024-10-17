<template>
  <div class="mt-4 w-full space-y-4 lg:h-[calc(100vh-164px)]">
    <EmojiSelection />

    <DrawCanvas :sliceStyle="sliceStyle">
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

const sliceDimensions = ref({
  top: 0,
  left: 0
})

const sliceStyle = computed(() => {
  const size = store.settings.tileSize

  const dimX = optimizedFrame.value?.length || 0
  const dimY = optimizedFrame.value?.reduce((acc, line) => Math.max(acc, line.length), 0) || 0

  const top = sliceDimensions.value.top
  const left = sliceDimensions.value.left

  return {
    top: `${top * size}px`,
    left: `${left * size}px`,
    width: `${dimY * size}px`,
    height: `${dimX * size}px`
  }
})

const optimizedTop = (lines: string[]) => {
  if (!store.options.optimizeTop) {
    sliceDimensions.value.top = 0

    return lines
  }

  let start = 0

  // Find the first non-empty row from the start
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() !== '0'.repeat(store.settings.tilesPerRow)) {
      start = i
      break
    }
  }

  sliceDimensions.value.top = start

  return lines.slice(start)
}

const optimizedBottom = (lines: string[]) => {
  if (!store.options.optimizeBottom) return lines

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
  if (!store.options.optimizeRight) return lines

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
  if (!store.options.optimizeLeft) {
    sliceDimensions.value.left = 0

    return lines
  }

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

  sliceDimensions.value.left = minEmptySpaceLength

  return lines.map((line) => {
    return line.slice(minEmptySpaceLength)
  })
}

const optimizedFrame = computed(() => {
  if (!store.lastFrame) return null

  let lines = store.lastFrame.trim().split('\n')

  lines = optimizedTop(lines)

  lines = optimizedBottom(lines)

  lines = optimizedRight(lines)

  lines = optimizedLeft(lines)

  return lines
})

const handleCopy = () => {
  try {
    if (!optimizedFrame.value) return

    copy.value = true

    const copyText = optimizedFrame.value
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
