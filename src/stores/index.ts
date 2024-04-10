import { defineStore } from 'pinia';

export const useStore = defineStore('shape-to-emoji', {
  state: () => ({
    screenWidth: document.documentElement.clientWidth,
    screenHeight: document.documentElement.clientHeight,
    emojiSelection: [] as Emoji[],
    selectedEmojiIndex: undefined as number | undefined,
    frames: [] as string[],
    displayedFrame: Array.from({ length: 24 }, () =>
      Array.from({ length: 24 }, () => '0')
    ),
    settings: {
      tileSize: 16,
      tilesPerRow: 24,
    },
  }),
  getters: {
    lastFrame(state) {
      return state.frames[state.frames.length - 1];
    },
  },
  actions: {
    selectEmoji(emoji: Emoji) {
      if (this.emojiSelection.find((e) => emoji.value === e.value)) {
        return;
      }
      if (this.emojiSelection.length === 9) {
        this.emojiSelection.shift();
      }

      this.emojiSelection.push(emoji);
      this.selectedEmojiIndex = this.emojiSelection.length - 1;
    },
    removeEmoji(index: number) {
      this.emojiSelection.splice(index, 1);
      this.selectedEmojiIndex = undefined;
    },
    addFrame(frame: string) {
      this.frames.push(frame);
    },
    undoFrame() {
      if (this.frames.length === 0) return;
      this.frames.pop();

      return this.lastFrame;
    },
    // UTILS
    canvasToText() {
      const TILE_SIZE = this.settings.tileSize;
      const TILES_PER_ROW = this.settings.tilesPerRow;
      const CANVAS_SIZE = TILE_SIZE * TILES_PER_ROW;
      let text = '';

      for (let y = 0; y < CANVAS_SIZE; y += TILE_SIZE) {
        for (let x = 0; x < CANVAS_SIZE; x += TILE_SIZE) {
          const color = this.displayedFrame[y / TILE_SIZE][x / TILE_SIZE];
          text += color;
        }
        text += '\n';
      }

      return text;
    },
    textToCanvas(text?: string) {
      const TILE_SIZE = this.settings.tileSize;
      const TILES_PER_ROW = this.settings.tilesPerRow;

      if (!text) {
        // Clear the canvas
        this.displayedFrame = Array.from({ length: TILES_PER_ROW }, () =>
          Array.from({ length: TILES_PER_ROW }, () => '0')
        );
        return;
      }
      const lines = text.trim().split('\n');

      if (lines.length > TILES_PER_ROW) {
        console.warn(
          `Text file contains too many rows. Truncating to ${TILES_PER_ROW} rows.`
        );
        text = lines.slice(0, TILES_PER_ROW).join('\n');
      }

      for (let y = 0; y < lines.length; y++) {
        const line = lines[y].trim();
        if (line.length > TILES_PER_ROW) {
          console.warn(
            `Row ${y + 1} contains too many characters. Truncating to ${TILES_PER_ROW} characters.`
          );
          text = text.replace(line, line.slice(0, TILES_PER_ROW));
        }
        for (let x = 0; x < line.length; x++) {
          const color = line.charAt(x);
          const blockX = x * TILE_SIZE;
          const blockY = y * TILE_SIZE;
          this.displayedFrame[blockY / TILE_SIZE][blockX / TILE_SIZE] = color;
        }
      }
    },
  },
  persist: {
    key: `shape-to-emoji`,
  },
  share: {
    enable: false,
  },
});
