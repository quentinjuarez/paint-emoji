<template>
  <div class="flex justify-center items-center h-full">
    <div
      :style="{ width: `${CANVAS_SIZE}px`, height: `${CANVAS_SIZE}px` }"
      class="bg-white select-none"
      ref="canvasRef"
    >
      <div v-for="(row, i) in store.displayedFrame" :key="i" class="flex">
        <div
          v-for="(value, j) in row"
          :key="j"
          :style="{ width: `${TILE_SIZE}px`, height: `${TILE_SIZE}px` }"
        >
          <BaseEmoji
            v-if="value !== '0'"
            :emoji="store.emojiSelection[valueToIndex(value)]"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const store = useStore();

const TILE_SIZE = store.settings.tileSize;
const TILES_PER_ROW = store.settings.tilesPerRow;
const CANVAS_SIZE = TILE_SIZE * TILES_PER_ROW;

const canvasRef = ref<HTMLCanvasElement | null>(null);

const isDrawing = ref(false);
const isErasing = ref(false);

const valueToIndex = (value: string) => {
  return parseInt(value, 10) - 1;
};

onMounted(() => {
  if (!canvasRef.value) {
    return;
  }

  store.textToCanvas(store.lastFrame);

  canvasRef.value.addEventListener('mousedown', (e) => {
    isDrawing.value = true;
    if (isErasing.value) {
      erase(e);
    } else {
      draw(e);
    }
  });

  canvasRef.value.addEventListener('mousemove', (e) => {
    if (isDrawing.value) {
      if (isErasing.value) {
        erase(e);
      } else {
        draw(e);
      }
    }
  });

  canvasRef.value.addEventListener('mouseup', () => {
    isDrawing.value = false;
    const text = store.canvasToText();

    if (!text) return;
    store.addFrame(text);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'z' && (e.ctrlKey || e.metaKey)) {
      const text = store.undoFrame();
      store.textToCanvas(text);
    }
  });
});

const draw = (e: MouseEvent) => {
  if (!canvasRef.value) return;
  const rect = canvasRef.value.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  // Adjust x and y coordinates to align with the closest tile
  const tileX = Math.floor(x / TILE_SIZE) * TILE_SIZE;
  const tileY = Math.floor(y / TILE_SIZE) * TILE_SIZE;

  store.displayedFrame[tileY / TILE_SIZE][tileX / TILE_SIZE] =
    store.selectedEmojiIndex === undefined
      ? '0'
      : String(store.selectedEmojiIndex + 1);
};

const erase = (e: MouseEvent) => {
  if (!canvasRef.value) return;
  const rect = canvasRef.value.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  // Adjust x and y coordinates to align with the closest tile
  const tileX = Math.floor(x / TILE_SIZE) * TILE_SIZE;
  const tileY = Math.floor(y / TILE_SIZE) * TILE_SIZE;

  store.displayedFrame[tileY / TILE_SIZE][tileX / TILE_SIZE] = '0';
};
</script>
