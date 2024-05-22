<template>
  <div class="space-y-4">
    <h2 class="text-xl font-bold">Optimization</h2>

    <div class="space-y-2">
      <div class="flex items-center gap-2">
        <input id="optimize-top" type="checkbox" v-model="store.options.optimizeTop" />
        <label for="optimize-top">Top</label>
      </div>

      <div class="flex items-center gap-2">
        <input id="optimize-right" type="checkbox" v-model="store.options.optimizeRight" />
        <label for="optimize-right">Right</label>
      </div>

      <div class="flex items-center gap-2">
        <input id="optimize-bottom" type="checkbox" v-model="store.options.optimizeBottom" />
        <label for="optimize-bottom">Bottom</label>
      </div>

      <div class="flex items-center gap-2">
        <input id="optimize-left" type="checkbox" v-model="store.options.optimizeLeft" />
        <label for="optimize-left">Left</label>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const store = useStore()
</script>
