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

  interface LightUser {
    _id: string
    username: string
    firstName: string
    lastName: string
    profilePicture: string
  }

  interface User extends LightUser {
    email: string
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

  interface Drawing {
    _id: string
    title: string
    description?: string
    emojis: Emoji[]
    canvas: string
    version: string
    authorId: string
    author?: LightUser
    isPublic: boolean
    preview: string
    createdAt: string
    updatedAt: string
    __v: number
  }

  interface DrawingDTO {
    title: string
    description?: string
    emojis: Emoji[]
    canvas: string
    version: string
    isPublic?: boolean
    preview?: string
  }
}
