import { defineStore } from 'pinia'

export const useOnlineStore = defineStore('shape-to-emoji-online', {
  state: () => ({
    accessToken: undefined as string | undefined,
    me: undefined as any | undefined
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
    }
  },
  persist: {
    key: `shape-to-emoji-online`
  },
  share: {
    enable: true
  }
})
