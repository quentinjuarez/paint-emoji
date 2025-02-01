import { defineStore } from 'pinia'

const __TILES_PER_ROW__ = 32
const __TILE_SIZE__ = 16

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
    emojiSelection: initEmojis(),
    selectedEmojiIndex: 0 as number,
    frequentEmojis: [] as Emoji[],
    maxFrequentEmojis: 10 as number,
    history: [] as string[],
    historyIndex: -1 as number,
    displayedFrame: Array.from({ length: __TILES_PER_ROW__ }, () =>
      Array.from({ length: __TILES_PER_ROW__ }, () => '0')
    ),
    settings: {
      tileSize: __TILE_SIZE__,
      tilesPerRow: __TILES_PER_ROW__
    },
    options: {
      optimizeTop: true,
      optimizeRight: false,
      optimizeBottom: true,
      optimizeLeft: false
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
    },
    currentMask: undefined as any | undefined
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

      // Add emoji to frequent emojis
      const index = this.frequentEmojis.findIndex((e) => e.value === emoji.value)

      if (index !== -1) {
        this.frequentEmojis = this.frequentEmojis.filter((e) => e.value !== emoji.value)
      }

      if (this.frequentEmojis.length >= this.maxFrequentEmojis) {
        this.frequentEmojis = this.frequentEmojis.slice(0, this.maxFrequentEmojis - 1)
      }

      this.frequentEmojis = [emoji, ...this.frequentEmojis]
    },
    clearEmojiSelection() {
      this.emojiSelection = initEmojis('empty')
      this.selectedEmojiIndex = 0
    },
    resetEmojiSelection(pattern?: 'largeSquares' | 'hearts' | 'circles' | 'empty') {
      this.emojiSelection = initEmojis(pattern)
    },
    removeEmoji(index: number) {
      this.emojiSelection[index] = {
        name: `:_:`,
        value: String(index + 1),
        type: 'empty'
      }
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
      const [major, minor] = getVersion(__VERSION__)
      const [storedMajor, storedMinor] = getVersion(this.version)

      if (major > storedMajor) {
        this.$reset()
        this.version = __VERSION__
        return
      }

      if (minor > storedMinor) {
        this.$reset()
        this.version = __VERSION__
        return
      }
    }
  },
  persist: {
    key: `shape-to-emoji`
  },
  share: {
    enable: false
  }
})
