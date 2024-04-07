<template>
  <div
    class="bg-black/40 !m-0 flex justify-center items-center fixed inset-0 z-50 p-10 cursor-pointer"
    @mousedown.left.self="emit('close')"
  >
    <div class="flex justify-center items-center cursor-default">
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
