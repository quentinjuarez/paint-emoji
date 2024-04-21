import { AxiosInstance } from 'axios'

export default class Service {
  client: AxiosInstance
  constructor(client: AxiosInstance) {
    this.client = client
  }
}
