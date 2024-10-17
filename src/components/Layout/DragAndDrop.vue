<template>
  <!-- Drag overlay -->
  <div
    class="fixed inset-0 z-50 hidden items-center justify-center bg-gradient-to-br from-blue-500/20 to-indigo-500/20 backdrop-blur-md transition-all duration-300 ease-in-out"
    :class="{ '!flex': isDragging }"
  >
    <div class="p-8 text-center">
      <p class="text-xl font-semibold text-white">Drop your file here</p>
    </div>
  </div>
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

    if (!isFileTypeAccepted(props.accept, file.type)) {
      emit('error', true)
      return
    }

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
