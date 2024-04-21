import Service from '..'

class DrawingService extends Service {
  async saveDrawing(drawing: DrawingDTO) {
    return this.client.post('/drawings/save', drawing)
  }
}

export default DrawingService
