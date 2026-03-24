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
      :class="{ 'select-none': isResizing }"
    >
      <!-- Resizable mask sidebar -->
      <div
        class="flex h-full shrink-0 flex-col border-r border-white/10 p-4"
        :style="{ width: sidebarWidth + 'px' }"
      >
        <MaskTools />
      </div>

      <!-- Resize handle -->
      <div
        class="group relative w-px shrink-0 cursor-col-resize bg-white/10 transition-colors hover:bg-purple-500/60"
        :class="{ 'bg-purple-500/60': isResizing }"
        @mousedown.prevent="startResize"
      >
        <!-- wider hit area -->
        <div class="absolute inset-y-0 -left-1.5 -right-1.5" />
      </div>

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

// Resizable sidebar
const sidebarWidth = ref(256)
const isResizing = ref(false)

const startResize = (e: MouseEvent) => {
  isResizing.value = true
  const startX = e.clientX
  const startWidth = sidebarWidth.value
  const onMove = (e: MouseEvent) => {
    sidebarWidth.value = Math.max(180, Math.min(480, startWidth + e.clientX - startX))
  }
  const onUp = () => {
    isResizing.value = false
    window.removeEventListener('mousemove', onMove)
    window.removeEventListener('mouseup', onUp)
  }
  window.addEventListener('mousemove', onMove)
  window.addEventListener('mouseup', onUp)
}
</script>

