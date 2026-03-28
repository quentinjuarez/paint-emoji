<template>
  <div class="flex flex-1 flex-col overflow-hidden lg:flex-row">
    <EmojiList />

    <div class="flex min-w-0 flex-1 flex-col gap-3 overflow-y-auto p-4">
      <DrawPanel v-if="store.tab === 'draw'" />
      <TextPanel v-if="store.tab === 'text'" />
    </div>

    <Tools />
  </div>
</template>

<script setup lang="ts">
const store = useStore()
</script>
