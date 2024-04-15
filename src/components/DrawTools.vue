<template>
  <div v-show="store.tab === 'draw'" class="space-y-4">
    <h2 class="text-xl font-bold">Tools</h2>

    <DrawUndoRedo />

    <EmojiFiles />

    <button
      @click="handleClear"
      class="w-full rounded bg-white/10 px-2 py-1 transition-colors hover:bg-white/20"
    >
      Clear Canvas
    </button>

    <button
      @click="handleClick"
      class="w-full rounded bg-white/10 px-2 py-1 transition-colors hover:bg-white/20"
    >
      Upload Image
    </button>

    <input
      class="hidden"
      type="file"
      accept="image/*"
      ref="fileInputRef"
      @change="handleUpload"
    />

    <!-- DEV MODE -->
    <div class="w-full">
      <img
        v-if="devSrc"
        :src="devSrc"
        alt="placeholder"
        class="mx-auto size-24"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const store = useStore();

const handleClear = () => {
  store.clearCanvas();

  fileInputRef.value!.value = "";
  devSrc.value = "";
};

// Handle file upload
const fileInputRef = ref<HTMLInputElement>();

const EMOJI = [
  "white_large_square",
  "black_large_square",
  "large_red_square",
  "large_orange_square",
  "large_yellow_square",
  "large_green_square",
  "large_blue_square",
  "large_purple_square",
  "large_brown_square",
];

const PALLETTE = {
  white_large_square: [255, 255, 255],
  black_large_square: [0, 0, 0],
  large_red_square: [255, 0, 0],
  large_orange_square: [255, 165, 0],
  large_yellow_square: [255, 255, 0],
  large_green_square: [0, 128, 0],
  large_blue_square: [0, 0, 255],
  large_purple_square: [128, 0, 128],
  large_brown_square: [165, 42, 42],
};

const handleClick = () => {
  fileInputRef.value?.click();
};

const devSrc = ref<string>("");

const handleUpload = (e: Event) => {
  try {
    const TILE_SIZE = store.settings.tileSize;
    const TILES_PER_ROW = store.settings.tilesPerRow;
    const CANVAS_SIZE = TILE_SIZE * TILES_PER_ROW;

    const target = e.target as HTMLInputElement;

    const file = target.files?.[0];

    if (!file) return;

    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      if (reader.result) {
        // Ensure reader.result is valid before setting it as src

        var image = new Image();

        image.src = reader.result as string;
        devSrc.value = reader.result as string;

        image.width = CANVAS_SIZE;
        image.height = CANVAS_SIZE;

        image.onload = function () {
          var canvas = document.createElement("canvas");
          canvas.width = CANVAS_SIZE;
          canvas.height = CANVAS_SIZE;
          var context = canvas.getContext("2d", { willReadFrequently: true });
          context?.drawImage(image, 0, 0, CANVAS_SIZE, CANVAS_SIZE);
          for (let i = 0; i < TILES_PER_ROW; i++) {
            for (let j = 0; j < TILES_PER_ROW; j++) {
              const pixelData = context?.getImageData(
                TILE_SIZE * i,
                TILE_SIZE * j,
                1,
                1
              ).data;
              const [r, g, b, a] = pixelData || [0, 0, 0, 0]; // Default values if no pixel data found

              if (a === 0) {
                store.displayedFrame[j][i] = "0";
              } else {
                store.displayedFrame[j][i] = String(rgbToPallette(r, g, b));
              }
            }
          }

          fileInputRef.value!.value = "";

          const text = store.canvasToText();

          if (!text) return;
          store.addFrame(text);
        };

        image.onerror = function (error) {
          console.error("Error loading image:", error);
        };
      } else {
        console.error("Failed to read image data.");
      }
    };
  } catch (error) {
    console.error(error);
  }
};

const rgbToPallette = (r: number, g: number, b: number) => {
  const distance = (
    r1: number,
    g1: number,
    b1: number,
    r2: number,
    g2: number,
    b2: number
  ) => {
    return Math.sqrt((r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2);
  };

  let minDistance = Number.MAX_VALUE;
  let minIndex = 0;

  for (let i = 0; i < EMOJI.length; i++) {
    // @ts-ignore
    const [r1, g1, b1] = PALLETTE[EMOJI[i]];
    const dist = distance(r, g, b, r1, g1, b1);
    if (dist < minDistance) {
      minDistance = dist;
      minIndex = i;
    }
  }

  return minIndex + 1;
};
</script>
