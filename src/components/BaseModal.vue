<template>
  <div
    class="fixed inset-0 z-50 !m-0 flex cursor-pointer items-center justify-center bg-black/40 p-10"
    @mousedown.left.self="emit('close')"
  >
    <div class="flex cursor-default items-center justify-center">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  (e: 'close'): void;
}>();

const handleEscape = (e: KeyboardEvent) => {
  if (e.key === 'Escape') emit('close');
};

onMounted(() => {
  window.addEventListener('keydown', handleEscape);
  document.body.classList.add('overflow-hidden');
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleEscape);
  document.body.classList.remove('overflow-hidden');
});
</script>
