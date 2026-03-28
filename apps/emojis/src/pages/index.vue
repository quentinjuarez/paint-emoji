<template>
  <div class="flex h-full flex-col">
    <LayoutHeader />

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
  const tab = hash.slice(1)
  // Only allow safe tabs
  if (tab === 'draw' || tab === 'text') {
    store.tab = tab
  } else {
    store.tab = 'draw'
  }
}

const route = useRoute()
watch(() => route.hash, handleHashChange, { immediate: true })
</script>
