<template>
  <Col>
    <div class="hidden flex-col space-y-4 lg:flex">
      <UserMenu />

      <DrawTools v-show="store.tab === 'draw'" />

      <TextTools v-show="store.tab === 'text'" />

      <ThemeTools />
    </div>
  </Col>
</template>

<script setup lang="ts">
const store = useStore()
</script>
