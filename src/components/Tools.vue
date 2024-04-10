<template>
  <Col>
    <div class="flex flex-col space-y-4">
      <DrawTools v-show="store.tab === 'draw'" />

      <TextTools v-show="store.tab === 'text'" />

      <ThemeTools />
    </div>
  </Col>
</template>

<script setup lang="ts">
const store = useStore();
</script>
