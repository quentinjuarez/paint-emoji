import { defineStore } from 'pinia'

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
        const accessToken = await this.$api.auth.loginGoogle(code)
        if (!accessToken) return null

        this.accessToken = accessToken
        return this.getMe()
      } catch (error) {
        return false
      }
    },
    async logout() {
      this.$reset()
    },
    async getMe() {
      try {
        if (!this.accessToken) return false

        const me = await this.$api.users.getMe()

        this.me = me

        return true
      } catch (error) {
        return false
      }
    },
    // DRAWINGS
    async saveDrawing(drawing: DrawingDTO) {
      try {
        await this.$api.drawings.saveDrawing(drawing)

        return true
      } catch (error) {
        return false
      }
    },
    async getDrawings() {
      try {
        const search = await this.$api.drawings.getDrawings()
        this.search = search

        return true
      } catch (error) {
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
        const search = await this.$api.drawings.searchDrawings({
          query,
          limit,
          offset
        })
        this.search = search

        return true
      } catch (error) {
        return false
      }
    },
    async getMineDrawings() {
      try {
        const { items } = await this.$api.drawings.getMineDrawings()
        this.drawings = items

        return true
      } catch (error) {
        return false
      }
    },
    async deleteDrawing(id: string) {
      try {
        await this.$api.drawings.deleteDrawing(id)

        await this.getMineDrawings()

        return true
      } catch (error) {
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
