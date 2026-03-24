<template>
  <div class="flex justify-center gap-1.5">
    <UiButton
      size="icon"
      :data-tooltip="'Undo'"
      :disabled="store.historyIndex === -1"
      :class="{ 'bg-white/20': active === 'undo' }"
      @click="handleUndo"
    >
      ↩
      <Shortcut shortcut="z" ctrl @confirm="handleUndo" />
    </UiButton>
    <UiButton
      size="icon"
      :data-tooltip="'Redo'"
      :disabled="store.historyIndex === store.history.length - 1"
      :class="{ 'bg-white/20': active === 'redo' }"
      @click="handleRedo"
    >
      ↪
      <Shortcut shortcut="y" ctrl @confirm="handleRedo" />
    </UiButton>
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
