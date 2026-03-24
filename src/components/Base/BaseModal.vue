<template>
  <UiDialog @close="emit('close')">
    <slot />
  </UiDialog>
</template>

<script setup lang="ts">
const emit = defineEmits<{ (e: 'close'): void }>()
</script>
