<template>
  <div class="space-y-4">
    <h2 class="text-xl font-bold">Slack Theme</h2>
    <div class="flex items-center gap-2">
      <input id="dark-mode" type="checkbox" v-model="store.darkMode" />
      <label for="dark-mode">Dark mode</label>
    </div>
  </div>
</template>

<script setup lang="ts">
const store = useStore();
</script>
