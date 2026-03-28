import { defineStore } from 'pinia'
import { api } from '../api'

export const useOnlineStore = defineStore('shape-to-emoji-online', {
  state: () => ({
    accessToken: undefined as string | undefined,
    me: undefined as any | undefined,
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
      } catch (_) {
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
      } catch (_) {
        return false
      }
    },
    // DRAWINGS
    async saveDrawing(drawing: DrawingDTO) {
      try {
        await api.drawings.save(drawing)

        return true
      } catch (_) {
        return false
      }
    },
    async getDrawings() {
      try {
        const search = await api.drawings.getAll()
        this.search = search

        return true
      } catch (_) {
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
      } catch (_) {
        return false
      }
    },
    async getMineDrawings() {
      try {
        const { items } = await api.drawings.getMine()
        this.drawings = items

        return true
      } catch (_) {
        return false
      }
    },
    async deleteDrawing(id: string) {
      try {
        await api.drawings.delete(id)

        await this.getMineDrawings()

        return true
      } catch (_) {
        return false
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
