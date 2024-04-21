import { AxiosInstance } from 'axios'

class UserService {
  private axiosClient: AxiosInstance

  constructor(axiosClient: AxiosInstance) {
    this.axiosClient = axiosClient
  }

  async findUserById(id: string) {
    return this.axiosClient.get(`/users/${id}`)
  }
}

export default UserService
