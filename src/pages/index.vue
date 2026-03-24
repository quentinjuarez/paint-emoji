<template>
  <div class="flex h-full flex-col">
    <AppHeader />

    <!-- ─── Emojis section ─────────────────────────────────────── -->
    <div
      v-if="store.section === 'emojis'"
      class="flex flex-1 overflow-hidden flex-col lg:flex-row"
    >
      <EmojiList />

      <div class="flex min-w-0 flex-1 flex-col gap-3 overflow-y-auto p-4">
        <HeaderTabs :tab="store.tab" />

        <DrawPanel v-if="store.tab === 'draw'" />
        <TextPanel v-if="store.tab === 'text'" />
        <WritePanel v-if="store.tab === 'write'" />
      </div>

      <Tools />
    </div>

    <!-- ─── Image Generation section ─────────────────────────── -->
    <div
      v-else-if="store.section === 'gif'"
      class="flex flex-1 overflow-hidden"
    >
      <!-- Resizable mask sidebar -->
      <UiResizablePanel :size="sidebarWidth" class="border-r border-white/10 p-4">
        <MaskTools />
      </UiResizablePanel>

      <UiResizableHandle v-model:panel-size="sidebarWidth" :min="180" :max="480" />

      <!-- Main compositor -->
      <div class="flex min-w-0 flex-1 items-center justify-center p-4">
        <Gif />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const store = useStore()

const handleHashChange = () => {
  const hash = window.location.hash
  if (!hash) { store.tab = 'draw'; return }
  store.tab = hash.slice(1)
}

const route = useRoute()
watch(() => route.hash, handleHashChange, { immediate: true })

const sidebarWidth = ref(256)
</script>

