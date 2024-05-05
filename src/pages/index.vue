<template>
  <div class="flex flex-col gap-0 lg:flex-row lg:gap-4">
    <EmojiList />

    <div class="mt-4 w-full">
      <HeaderTabs :tab="store.tab" />

      <DrawPanel v-if="store.tab === 'draw'" />
      <TextPanel v-if="store.tab === 'text'" />
      <WritePanel v-if="store.tab === 'write'" />
    </div>

    <Tools />

    <!-- VERSION -->
    <div class="fixed bottom-0 m-1">
      <p class="text-xs text-gray-500">{{ version }}</p>
    </div>
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

  const id = hash.slice(1)

  store.tab = id
}

const route = useRoute()

const version = computed(() => `v${__VERSION__}`)

watch(
  () => route.hash,
  () => {
    handleHashChange()
  },
  {
    immediate: true
  }
)
</script>
