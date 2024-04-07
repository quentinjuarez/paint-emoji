import { defineStore } from 'pinia';

export const useStore = defineStore('shape-to-emoji', {
  state: () => ({
    screenWidth: document.documentElement.clientWidth,
    screenHeight: document.documentElement.clientHeight,
    emojiSelection: [] as Emoji[],
    selectedEmojiIndex: undefined as number | undefined,
    frames: [] as string[],
  }),
  getters: {
    lastFrame(state) {
      return state.frames[state.frames.length - 1];
    },
  },
  actions: {
    selectEmoji(emoji: Emoji) {
      if (
        this.emojiSelection.length === 9 ||
        this.emojiSelection.find((e) => emoji.value === e.value)
      ) {
        return;
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
  },
  persist: {
    key: `shape-to-emoji`,
  },
  share: {
    enable: false,
  },
});
