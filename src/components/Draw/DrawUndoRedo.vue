<template>
  <div class="flex justify-center gap-2">
    <button
      id="undo-button"
      class="flex items-center gap-2 rounded bg-white/10 p-1 transition-colors hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:!bg-white/10"
      :class="{ 'bg-white/20': active === 'undo' }"
      :data-tooltip="'Undo'"
      :disabled="store.historyIndex === -1"
      @click="handleUndo"
    >
      <span>↩</span>
      <Shortcut shortcut="z" ctrl @confirm="handleUndo" />
    </button>

    <button
      id="redo-button"
      class="flex items-center gap-2 rounded bg-white/10 p-1 transition-colors hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:!bg-white/10"
      :class="{ 'bg-white/20': active === 'redo' }"
      :data-tooltip="'Redo'"
      :disabled="store.historyIndex === store.history.length - 1"
      @click="handleRedo"
    >
      <span>↪</span>
      <Shortcut shortcut="y" ctrl @confirm="handleRedo" />
    </button>
  </div>
</template>

<script setup lang="ts">
const store = useStore()

const active = ref<undefined | 'undo' | 'redo'>()

const handleUndo = () => {
  const text = store.undoFrame()
  if (text === null) return

  store.textToCanvas(text)

  active.value = 'undo'
  setTimeout(() => {
    active.value = undefined
  }, 500)
}

const handleRedo = () => {
  const text = store.redoFrame()
  if (text === null) return

  store.textToCanvas(text)

  active.value = 'redo'
  setTimeout(() => {
    active.value = undefined
  }, 500)
}
</script>
