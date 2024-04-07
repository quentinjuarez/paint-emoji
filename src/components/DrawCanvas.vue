<template>
  <div class="space-y-4">
    <div class="flex justify-center items-center">
      <canvas
        ref="canvasRef"
        :width="canvasSize"
        :height="canvasSize"
        :style="{ width: `${canvasSize}px`, height: `${canvasSize}px` }"
        class="bg-white cursor-crosshair"
      ></canvas>
    </div>
    <div class="flex flex-col gap-4">
      <button @click="downloadTextFile">Save as Text</button>

      <button @click="reset">Reset</button>

      <input type="file" @change="loadTextFile" accept=".emoji" />
    </div>
  </div>
</template>

<script setup lang="ts">
const store = useStore();

const tileSize = 16;
const tilesPerRow = 24;
const canvasSize = tilesPerRow * tileSize;

const canvasRef = ref<HTMLCanvasElement | null>(null);

const ctx = ref<CanvasRenderingContext2D | null>(null);

const isDrawing = ref(false);
const isErasing = ref(false);

const reset = () => {
  textToCanvas();
  store.frames = [];
};

onMounted(() => {
  if (!canvasRef.value) {
    return;
  }

  ctx.value = canvasRef.value.getContext('2d');

  textToCanvas(store.lastFrame);

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
    const text = canvasToText();

    if (!text) return;
    store.addFrame(text);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'z' && (e.ctrlKey || e.metaKey)) {
      const text = store.undoFrame();
      textToCanvas(text);
    }
  });
});

const draw = (e: MouseEvent) => {
  if (!canvasRef.value || !ctx.value) return;
  const rect = canvasRef.value.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  // Adjust x and y coordinates to align with the closest tile
  const tileX = Math.floor(x / tileSize) * tileSize;
  const tileY = Math.floor(y / tileSize) * tileSize;

  ctx.value.fillStyle = 'black';
  ctx.value.fillRect(tileX, tileY, tileSize, tileSize);
};

const erase = (e: MouseEvent) => {
  if (!canvasRef.value || !ctx.value) return;
  const rect = canvasRef.value.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  // Adjust x and y coordinates to align with the closest tile
  const tileX = Math.floor(x / tileSize) * tileSize;
  const tileY = Math.floor(y / tileSize) * tileSize;

  ctx.value.fillStyle = 'white';
  ctx.value.fillRect(tileX, tileY, tileSize, tileSize);
};

const canvasToText = () => {
  if (!canvasRef.value || !ctx.value) return;
  // black is 1, white is 0
  // canvasSize x canvasSize
  // with tileSize x tileSize
  const data = ctx.value.getImageData(0, 0, canvasSize, canvasSize).data;
  let text = '';

  for (let blockY = 0; blockY < canvasSize; blockY += tileSize) {
    for (let blockX = 0; blockX < canvasSize; blockX += tileSize) {
      const pixelIndex = (blockY * canvasSize + blockX) * 4;
      const r = data[pixelIndex];
      const g = data[pixelIndex + 1];
      const b = data[pixelIndex + 2];
      const a = data[pixelIndex + 3];

      // Check if the top-left pixel of the block is black
      if (r === 0 && g === 0 && b === 0 && a === 255) {
        text += '1';
      } else {
        text += '0';
      }
    }
    text += '\n';
  }

  return text;
};

const downloadTextFile = () => {
  const text = `${signatureHeader()}\n${canvasToText()}`;
  const blob = new Blob([text], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const random = Math.random().toString(36).substring(7);
  a.download = random + '.emoji';
  a.click();
  URL.revokeObjectURL(url);
};

const loadTextFile = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target?.files?.[0];
  if (!file || !file.type.match('text.*')) {
    return;
  }

  const reader = new FileReader();

  reader.onload = async (e: any) => {
    let text = e.target.result;
    if (!text || typeof text !== 'string') {
      console.warn('Invalid file content.');
      return;
    }

    if (!text.startsWith('shape-to-emoji')) {
      console.warn('Invalid file signature.');
      return;
    }
    // remove 4 first line
    text = text.split('\n').slice(4).join('\n');
    textToCanvas(text);
  };

  reader.onerror = (error) => {
    console.error('Error reading the file:', error);
  };

  reader.readAsText(file);
};

const maxCharactersPerRow = canvasSize / tileSize;
const maxRows = canvasSize / tileSize;

const textToCanvas = (text?: string) => {
  if (!ctx.value) return;

  if (!text) {
    // Clear the canvas
    ctx.value.fillStyle = 'white';
    ctx.value.fillRect(0, 0, canvasSize, canvasSize);
    return;
  }
  const lines = text.trim().split('\n');

  if (lines.length > maxRows) {
    console.warn(
      `Text file contains too many rows. Truncating to ${maxRows} rows.`
    );
    text = lines.slice(0, maxRows).join('\n');
  }

  for (let y = 0; y < lines.length; y++) {
    const line = lines[y].trim();
    if (line.length > maxCharactersPerRow) {
      console.warn(
        `Row ${y + 1} contains too many characters. Truncating to ${maxCharactersPerRow} characters.`
      );
      text = text.replace(line, line.slice(0, maxCharactersPerRow));
    }
    for (let x = 0; x < line.length; x++) {
      const color = line.charAt(x);
      const blockX = x * tileSize;
      const blockY = y * tileSize;
      ctx.value.fillStyle = color === '1' ? 'black' : 'white';
      ctx.value.fillRect(blockX, blockY, tileSize, tileSize);
    }
  }
};

const signatureHeader = () => {
  // DrawMoji;
  // PaintMoji;
  // EmojiPaint;
  const project = 'shape-to-emoji';
  const name = 'Created By: Quentin Juarez';
  const github = 'GitHub: https://github.com/quentinjuarez/shape-to-emoji';
  const version = `Version: ${VERSION}\n`;
  return [project, name, github, version].join('\n');
};
</script>
