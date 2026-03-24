<template>
  <div
    class="flex h-full shrink-0 flex-col"
    :style="{ width: size + 'px' }"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps<{ size: number }>()
</script>
