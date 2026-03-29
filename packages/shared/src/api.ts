import axios from 'axios'
import { useOnlineStore } from './stores/online'

const client = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  headers: {
    'Content-Type': 'application/json'
  }
})

client.interceptors.request.use((config) => {
  const token = useOnlineStore().accessToken
  if (token) config.headers['Authorization'] = `Bearer ${token}`
  return config
})

export const api = {
  auth: {
    loginGoogle: (code: string): Promise<string> =>
      client.get<string>('/auth/google/callback', { params: { code } }).then((r) => r.data)
  },
  users: {
    getMe: () => client.get('/users/me').then((r) => r.data)
  },
  drawings: {
    save: (drawing: DrawingDTO) => client.post('/drawings/save', drawing),
    getAll: () =>
      client
        .get<{
          items: Drawing[]
          total: number
          prev: number | null
          next: number | null
        }>('/drawings')
        .then((r) => r.data),
    search: ({ query, limit, offset }: { query: string; limit: number; offset: number }) =>
      client
        .get<{
          items: Drawing[]
          total: number
          prev: number | null
          next: number | null
        }>('/drawings/search', { params: { query, limit, offset } })
        .then((r) => r.data),
    getMine: () =>
      client.get<{ items: Drawing[]; total: number }>('/drawings/me').then((r) => r.data),
    delete: (id: string) => client.delete<boolean>(`/drawings/${id}`).then((r) => r.data)
  },
  slack: {
    getOAuthUrl: () => client.get<{ url: string }>('/slack/oauth-url').then((r) => r.data.url),
    getCustomEmojis: () =>
      client.get<{ name: string; url: string }[]>('/slack/emojis').then((r) => r.data),
    getWorkspaces: () =>
      client
        .get<{ teamId: string; teamName: string; lastSynced: string }[]>('/slack/workspaces')
        .then((r) => r.data),
    syncWorkspace: (teamId: string) =>
      client.post<{ ok: boolean }>(`/slack/workspaces/${teamId}/sync`).then((r) => r.data)
  }
}
