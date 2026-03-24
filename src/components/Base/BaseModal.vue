<template>
  <Teleport to="body">
  <Transition name="fade">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-10"
      @mousedown.left.self="emit('close')"
    >
      <div class="cursor-default">
        <slot />
      </div>
    </div>
  </Transition>
  </Teleport>
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
