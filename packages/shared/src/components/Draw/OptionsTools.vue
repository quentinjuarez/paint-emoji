<template>
  <div class="space-y-3">
    <UiSectionTitle>Optimization</UiSectionTitle>
    <div class="space-y-1.5">
      <UiCheckbox id="optimize-top" v-model="store.options.optimizeTop">Top</UiCheckbox>
      <UiCheckbox id="optimize-right" v-model="store.options.optimizeRight">Right</UiCheckbox>
      <UiCheckbox id="optimize-bottom" v-model="store.options.optimizeBottom">Bottom</UiCheckbox>
      <UiCheckbox id="optimize-left" v-model="store.options.optimizeLeft">Left</UiCheckbox>
    </div>
  </div>
</template>

<script setup lang="ts">
const store = useStore()
</script>
