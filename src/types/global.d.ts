export {}

declare global {
  const __DEV__: boolean
  const __VERSION__: string
  const __BASE_URL__: string
  const __TILE_SIZE__: number
  const __TILES_PER_ROW__: number

  interface CustomEmoji {
    name: string
    url: string
  }

  interface SlackEmoji {
    base: number[]
    alternates: Array<number[]>
    emoticons: string[]
    shortcodes: string[]
    animated: boolean
    directional: boolean
  }

  interface Emoji {
    name: string
    value: string
    type: 'slack' | 'custom' | 'empty'
  }
}
