<template>
  <div
    class="fixed inset-0 z-50 !m-0 flex cursor-pointer items-center justify-center bg-black/40 p-10 opacity-0 transition-opacity"
    :class="{ 'opacity-100': isOpen }"
    @mousedown.left.self="emit('close')"
  >
    <div class="flex cursor-default items-center justify-center">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  (e: 'close'): void
}>()

const handleEscape = (e: KeyboardEvent) => {
  if (e.key === 'Escape') emit('close')
}

const isOpen = ref(false)

onMounted(() => {
  isOpen.value = true
  window.addEventListener('keydown', handleEscape)
  document.body.classList.add('overflow-hidden')
})

onUnmounted(() => {
  isOpen.value = false
  window.removeEventListener('keydown', handleEscape)
  document.body.classList.remove('overflow-hidden')
})
</script>
