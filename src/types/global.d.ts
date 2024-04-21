export {}

declare global {
  const __DEV__: boolean
  const __VERSION__: string
  const __BASE_URL__: string
  const __API_URL__: string

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

  interface User {
    _id: string
    username: string
    firstName: string
    lastName: string
    email: string
    profilePicture: string
    coverPicture: string
    description: string
    isDemo: boolean
    isAdmin: boolean
    source: string
    externalId: string
    createdAt: string
    updatedAt: string
    __v: number
  }
}
