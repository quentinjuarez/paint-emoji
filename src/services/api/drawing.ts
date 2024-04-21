import { AxiosInstance } from 'axios'

class DrawingService {
  private axiosClient: AxiosInstance

  constructor(axiosClient: AxiosInstance) {
    this.axiosClient = axiosClient
  }

  async findDrawingById(id: string) {
    return this.axiosClient.get(`/drawings/${id}`)
  }
}

export default DrawingService
