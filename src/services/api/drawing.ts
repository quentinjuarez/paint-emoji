import Service from '..'

class DrawingService extends Service {
  async saveDrawing(drawing: DrawingDTO) {
    return this.client.post('/drawings/save', drawing)
  }
  async getDrawings() {
    return this.client
      .get<{
        items: Drawing[]
        total: number
        prev: number | null
        next: number | null
      }>('/drawings')
      .then((res) => res.data)
  }

  async searchDrawings({ query, limit, offset }: { query: string; limit: number; offset: number }) {
    return this.client
      .get<{
        items: Drawing[]
        total: number
        prev: number | null
        next: number | null
      }>('/drawings/search', {
        params: {
          query,
          limit,
          offset
        }
      })
      .then((res) => res.data)
  }

  async getMineDrawings() {
    return this.client
      .get<{
        items: Drawing[]
        total: number
        prev: number | null
        next: number | null
      }>('/drawings/me', {
        params: {
          limit: 100,
          offset: 0
        }
      })
      .then((res) => res.data)
  }

  async deleteDrawing(id: string) {
    return this.client.delete<boolean>(`/drawings/${id}`).then((res) => res.data)
  }

  async getEmojiData(emojiUrls: string[]) {
    return this.client.post<any[]>('/drawings/emoji-data', { emojiUrls }).then((res) => res.data)
  }
}

export default DrawingService
