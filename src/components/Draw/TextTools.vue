<template>
  <div class="space-y-2">
    <h2 class="text-xl font-bold">Text</h2>

    <div class="flex items-center gap-2">
      <input id="tight-mode" type="checkbox" v-model="store.textSettings.tight" />
      <label for="tight-mode">Tight</label>
    </div>
  </div>
</template>

<script setup lang="ts">
const store = useStore()
</script>
