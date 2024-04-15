import { defineStore } from 'pinia'

const emptyEmoji = (index: number): Emoji => ({
  name: `:_:`,
  value: String(index + 1),
  type: 'empty'
})

// VERSION HISTORY
// 0.0.0 - Init
// 0.0.1 - Added emoji selection
// 0.1.0 - Initial release
// 0.1.1 - Added text to emoji
// 0.2.0 - Split text and draw tabs
// 0.2.1 - Split words
// 0.3.0 - Init upload
// 0.3.1 - Rework ux
// 0.3.2 - Rework ui

export const useStore = defineStore('shape-to-emoji', {
  state: () => ({
    error: false,
    version: __VERSION__,
    screenWidth: document.documentElement.clientWidth,
    screenHeight: document.documentElement.clientHeight,
    emojiSelection: [
      {
        name: ':white_large_square:',
        value: '⬜',
        type: 'slack'
      },
      {
        name: ':black_large_square:',
        value: '⬛',
        type: 'slack'
      },
      {
        name: ':red_square:',
        value: '🟥',
        type: 'slack'
      },
      {
        name: ':orange_square:',
        value: '🟧',
        type: 'slack'
      },
      {
        name: ':yellow_square:',
        value: '🟨',
        type: 'slack'
      },
      {
        name: ':green_square:',
        value: '🟩',
        type: 'slack'
      },
      {
        name: ':blue_square:',
        value: '🟦',
        type: 'slack'
      },
      {
        name: ':purple_square:',
        value: '🟪',
        type: 'slack'
      },
      {
        name: ':brown_square:',
        value: '🟫',
        type: 'slack'
      }
    ] as Emoji[],
    selectedEmojiIndex: 0 as number,
    history: [] as string[],
    historyIndex: -1 as number,
    displayedFrame: Array.from({ length: 24 }, () => Array.from({ length: 24 }, () => '0')),
    settings: {
      tileSize: 16,
      tilesPerRow: 24
    },
    darkMode: false,
    textEmoji: {
      name: ':red_square:',
      value: '🟥',
      type: 'slack'
    } as Emoji,
    tab: 'draw',
    text: '',
    textSettings: {
      tight: false
    }
  }),
  getters: {
    lastFrame(state) {
      if (state.historyIndex < -1) return
      return state.history[state.historyIndex]
    }
  },
  actions: {
    selectEmoji(emoji: Emoji) {
      if (this.tab === 'text') {
        this.textEmoji = emoji
        return
      }

      this.emojiSelection[this.selectedEmojiIndex] = emoji
    },
    clearEmojiSelection() {
      this.emojiSelection = this.emojiSelection.map((_, index) => emptyEmoji(index))
      this.selectedEmojiIndex = 0
    },
    removeEmoji(index: number) {
      this.emojiSelection[index] = emptyEmoji(index)
    },
    addFrame(frame: string) {
      this.history = this.history.slice(0, this.historyIndex + 1)
      this.history.push(frame)
      this.historyIndex++
    },
    undoFrame() {
      if (this.historyIndex === -1) return null
      this.historyIndex--

      return this.lastFrame
    },
    redoFrame() {
      if (this.historyIndex === this.history.length - 1) return null
      this.historyIndex++

      return this.lastFrame
    },
    // UTILS
    canvasToText() {
      const TILE_SIZE = this.settings.tileSize
      const TILES_PER_ROW = this.settings.tilesPerRow
      const CANVAS_SIZE = TILE_SIZE * TILES_PER_ROW
      let text = ''

      for (let y = 0; y < CANVAS_SIZE; y += TILE_SIZE) {
        for (let x = 0; x < CANVAS_SIZE; x += TILE_SIZE) {
          const color = this.displayedFrame[y / TILE_SIZE][x / TILE_SIZE]
          text += color
        }
        text += '\n'
      }

      return text
    },
    textToCanvas(text?: string) {
      const TILE_SIZE = this.settings.tileSize
      const TILES_PER_ROW = this.settings.tilesPerRow

      if (!text) {
        // Clear the canvas
        this.displayedFrame = Array.from({ length: TILES_PER_ROW }, () =>
          Array.from({ length: TILES_PER_ROW }, () => '0')
        )
        return
      }
      const lines = text.trim().split('\n')

      if (lines.length > TILES_PER_ROW) {
        console.warn(`Text file contains too many rows. Truncating to ${TILES_PER_ROW} rows.`)
        text = lines.slice(0, TILES_PER_ROW).join('\n')
      }

      for (let y = 0; y < lines.length; y++) {
        const line = lines[y].trim()
        if (line.length > TILES_PER_ROW) {
          console.warn(
            `Row ${y + 1} contains too many characters. Truncating to ${TILES_PER_ROW} characters.`
          )
          text = text.replace(line, line.slice(0, TILES_PER_ROW))
        }
        for (let x = 0; x < line.length; x++) {
          const color = line.charAt(x)
          const blockX = x * TILE_SIZE
          const blockY = y * TILE_SIZE
          this.displayedFrame[blockY / TILE_SIZE][blockX / TILE_SIZE] = color
        }
      }
    },
    clearCanvas() {
      this.textToCanvas()
      this.history = []
      this.historyIndex = -1
    },
    resetStore() {
      if (this.version !== __VERSION__) return
      this.$reset()
    }
  },
  persist: {
    key: `shape-to-emoji`
  },
  share: {
    enable: false
  }
})
