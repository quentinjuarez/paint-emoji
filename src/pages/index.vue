<template>
  <div class="flex h-full flex-col">
    <AppHeader />

    <RouterView />
  </div>
</template>

<script setup lang="ts">
const store = useStore()

const handleHashChange = () => {
  const hash = window.location.hash
  if (!hash) {
    store.tab = 'draw'
    return
  }
  store.tab = hash.slice(1)
}

const route = useRoute()
watch(() => route.hash, handleHashChange, { immediate: true })
</script>
