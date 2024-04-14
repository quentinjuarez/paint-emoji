<template>
  <div class="flex gap-2 justify-center">
    <button
      id="undo-button"
      class="rounded p-1 bg-white/10 hover:bg-white/20 transition-colors flex gap-2 items-center disabled:opacity-50"
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
      class="rounded p-1 bg-white/10 hover:bg-white/20 transition-colors flex gap-2 items-center disabled:opacity-50"
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
import tippy from "tippy.js";
const store = useStore();

const active = ref<undefined | "undo" | "redo">();

const handleUndo = () => {
  const text = store.undoFrame();
  if (text === null) return;

  store.textToCanvas(text);

  active.value = "undo";
  setTimeout(() => {
    active.value = undefined;
  }, 500);
};

const handleRedo = () => {
  const text = store.redoFrame();
  if (text === null) return;

  store.textToCanvas(text);

  active.value = "redo";
  setTimeout(() => {
    active.value = undefined;
  }, 500);
};

let tooltips = [] as any[];

onMounted(() => {
  initializeTooltips();
});

function initializeTooltips() {
  // Destroy existing tooltips
  tooltips.forEach((tooltip) => tooltip.destroy());
  tooltips = [];

  // Initialize new tooltips
  ["undo-button", "redo-button"].forEach((id) => {
    // @ts-ignore
    const tooltip = tippy(document.getElementById(id), {
      content(reference) {
        return reference.getAttribute("data-tooltip");
      },
      theme: "light", // Specify the theme as 'light'
    });
    tooltips.push(tooltip);
  });
}

onUnmounted(() => {
  tooltips.forEach((tooltip) => tooltip.destroy());
});
</script>
