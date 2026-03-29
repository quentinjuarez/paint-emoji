import { defineStore } from 'pinia'
import { api } from '../api'

export const useOnlineStore = defineStore('shape-to-emoji-online', {
  state: () => ({
    accessToken: undefined as string | undefined,
    me: undefined as User | undefined,
    customEmojis: [] as Emoji[],
    search: {
      items: [] as Drawing[],
      total: 0,
      prev: null as number | null,
      next: null as number | null
    },
    drawings: [] as Drawing[]
  }),
  getters: {
    isAuthenticated: (state) => !!state.accessToken
  },
  actions: {
    async loginGoogle({ code }: { code: string }) {
      try {
        this.$reset()
        const accessToken = await api.auth.loginGoogle(code)
        if (!accessToken) return null

        this.accessToken = accessToken
        return this.getMe()
      } catch {
        return false
      }
    },
    async logout() {
      this.$reset()
    },
    async getMe() {
      try {
        if (!this.accessToken) return false

        const me = await api.users.getMe()

        this.me = me

        return true
      } catch {
        return false
      }
    },
    // DRAWINGS
    async saveDrawing(drawing: DrawingDTO) {
      try {
        await api.drawings.save(drawing)

        return true
      } catch {
        return false
      }
    },
    async getDrawings() {
      try {
        const search = await api.drawings.getAll()
        this.search = search

        return true
      } catch {
        return false
      }
    },
    async searchDrawings({
      query,
      limit,
      offset
    }: {
      query: string
      limit: number
      offset: number
    }) {
      try {
        const search = await api.drawings.search({
          query,
          limit,
          offset
        })
        this.search = search

        return true
      } catch {
        return false
      }
    },
    async getMineDrawings() {
      try {
        const { items } = await api.drawings.getMine()
        this.drawings = items

        return true
      } catch {
        return false
      }
    },
    async deleteDrawing(id: string) {
      try {
        await api.drawings.delete(id)

        await this.getMineDrawings()

        return true
      } catch {
        return false
      }
    },
    // SLACK
    async fetchCustomEmojis() {
      try {
        const emojis = await api.slack.getCustomEmojis()
        this.customEmojis = emojis.map((e) => ({
          name: `:${e.name}:`,
          value: e.url,
          type: 'custom' as const,
          search: `:${e.name}:`
        }))
        return true
      } catch {
        return false
      }
    },
    async getSlackOAuthUrl() {
      try {
        return await api.slack.getOAuthUrl()
      } catch {
        return null
      }
    }
  },
  persist: {
    key: `shape-to-emoji-online`
  },
  share: {
    enable: true
  }
})
