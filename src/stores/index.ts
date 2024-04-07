import { defineStore } from 'pinia';

export const useStore = defineStore('shape-to-emoji', {
  state: () => ({
    screenWidth: document.documentElement.clientWidth,
    screenHeight: document.documentElement.clientHeight,
    emojiSelection: [] as Emoji[],
    colors: [
      '#ff0000',
      '#ff8000',
      '#ffff00',
      '#80ff00',
      '#00ff00',
      '#00ff80',
      '#00ffff',
      '#0080ff',
      '#0000ff',
      '#8000ff',
      '#ff00ff',
      '#ff0080',
      '#000000',
      '#808080',
    ],
    frames: [] as string[],
  }),
  getters: {
    lastFrame(state) {
      return state.frames[state.frames.length - 1];
    },
  },
  actions: {
    selectEmoji(emoji: Emoji) {
      // this.emojiSelection.push({
      //   ...emoji,
      //   color: '#000000',
      // });
      this.emojiSelection = [
        {
          ...emoji,
          color: '#000000',
        },
      ];
    },
    removeEmoji(index: number) {
      this.emojiSelection.splice(index, 1);
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
