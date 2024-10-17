<template>
  <div
    class="fixed inset-0 z-50 hidden rounded-lg bg-white/50 transition-colors"
    :class="{ '!block': isDragging }"
  ></div>
</template>

<script setup lang="ts">
const props = defineProps<{
  accept: string
}>()

const isDragging = ref(false)
const dragCounter = ref(0) // To track multiple dragenter/leave events

// Emitting the selected file
const emit = defineEmits(['file', 'error'])

// Handle drag enter to show overlay
const handleDragEnter = () => {
  dragCounter.value++
  isDragging.value = true
}

// Handle drag over (fires continuously, but we use it to prevent default behavior)
const handleDragOver = (event: DragEvent) => {
  event.preventDefault()
}

// Handle drag leave to hide the overlay (using dragCounter for nested elements)
const handleDragLeave = () => {
  dragCounter.value--
  if (dragCounter.value === 0) {
    isDragging.value = false
  }
}

// Function to check if the file type is accepted
function isFileTypeAccepted(accept: string, fileType: string): boolean {
  const acceptArray = accept.split(',').map((type) => type.trim())

  return acceptArray.some((type) => {
    if (type.endsWith('/*')) {
      // If the accepted type ends with '/*', check if it's a valid prefix for dropped file type
      const acceptedPrefix = type.slice(0, -2)
      return fileType.startsWith(acceptedPrefix)
    }

    return type === fileType
  })
}

// Handle the file drop event
const handleDrop = (event: DragEvent) => {
  emit('error', false)
  event.preventDefault()
  dragCounter.value = 0
  isDragging.value = false

  const files = event.dataTransfer?.files

  if (files && files.length > 0) {
    const file = files[0]

    // Check if the file type is accepted
    if (!isFileTypeAccepted(props.accept, file.type)) {
      emit('error', true)
      return
    }

    // Emit the valid file
    emit('file', file)
  }
}

onMounted(() => {
  document.addEventListener('dragenter', handleDragEnter)
  document.addEventListener('dragover', handleDragOver)
  document.addEventListener('dragleave', handleDragLeave)
  document.addEventListener('drop', handleDrop)
})

onBeforeUnmount(() => {
  document.removeEventListener('dragenter', handleDragEnter)
  document.removeEventListener('dragover', handleDragOver)
  document.removeEventListener('dragleave', handleDragLeave)
  document.removeEventListener('drop', handleDrop)
})
</script>
