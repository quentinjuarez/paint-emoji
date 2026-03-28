<template>
  <div
    class="hidden h-full w-56 shrink-0 flex-col gap-5 overflow-y-auto border-l border-white/10 p-4 lg:flex"
  >
    <DrawTools v-show="store.tab === 'draw'" />
    <TextTools v-show="store.tab === 'text'" />
    <OptionsTools v-show="store.tab === 'draw'" />
    <ThemeTools />
  </div>
</template>

<script setup lang="ts">
const store = useStore()
</script>
