<template>
  <div class="flex flex-1 overflow-hidden">
    <!-- Resizable mask sidebar -->
    <UiResizablePanel :size="sidebarWidth" class="border-r border-white/10 p-4">
      <MaskTools />
    </UiResizablePanel>

    <UiResizableHandle v-model:panel-size="sidebarWidth" :min="180" :max="480" />

    <div class="flex min-w-0 flex-1 items-center justify-center p-4">
      <GenAnimation />
    </div>
  </div>
</template>

<script setup lang="ts">
const sidebarWidth = ref(256)
</script>
