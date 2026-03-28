export {}

declare global {}

declare global {
  interface Window {
    GIF: unknown
  }
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
    search?: string
  }

  interface EmojiCategory {
    key: string
    name: string
    emojis: Emoji[]
  }

  type MaskImage = { scale: number; url: string; width: number; frameCount: number; mime: string }

  type Mask = {
    id: string
    name: string
    tags: string[]
    animated: boolean
    images: MaskImage[]
    imagesBeta: MaskImage[]
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
