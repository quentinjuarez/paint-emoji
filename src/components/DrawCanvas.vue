<template>
  <div class="flex flex-col justify-center items-center h-full gap-4">
    <div
      :style="{
        width: `${CANVAS_SIZE}px`,
        height: `${CANVAS_SIZE}px`,
        backgroundColor: store.darkMode ? 'rgb(27, 29, 33)' : 'white',
      }"
      class="select-none relative"
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
            size="sm"
          />
        </div>
      </div>

      <!-- TOOLS -->
      <div class="absolute -right-12 top-40 z-10 flex flex-col gap-2">
        <button
          class="w-8 h-8 rounded bg-white/10 border-2 border-transparent"
          :class="{ '!border-purple-500': !isErasing }"
          @click="isErasing = !isErasing"
        >
          ✏️
        </button>
        <button
          class="w-8 h-8 rounded bg-white/10 border-2 border-transparent"
          :class="{ '!border-purple-500': isErasing }"
          @click="isErasing = !isErasing"
        >
          🧽
        </button>
      </div>
    </div>
    <slot></slot>
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

  canvasRef.value.addEventListener("mousedown", (e) => {
    isDrawing.value = true;
    draw(e);
  });

  canvasRef.value.addEventListener("mousemove", (e) => {
    if (isDrawing.value) {
      draw(e);
    }
  });

  canvasRef.value.addEventListener("mouseup", () => {
    isDrawing.value = false;
    const text = store.canvasToText();

    if (!text) return;
    store.addFrame(text);
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

  if (tileX < 0 || tileY < 0) return;
  if (tileX >= CANVAS_SIZE || tileY >= CANVAS_SIZE) return;

  store.displayedFrame[tileY / TILE_SIZE][tileX / TILE_SIZE] =
    store.selectedEmojiIndex === undefined || isErasing.value
      ? "0"
      : String(store.selectedEmojiIndex + 1);
};
</script>
