import axios from 'axios'
import UserService from '../services/api/user'
import AuthService from '../services/api/auth'

export interface ApiInterface {
  auth: AuthService
  users: UserService
}

const initServices = () => {
  const onlineStore = useOnlineStore()

  // custom axios instance
  const apiClient = axios.create({
    baseURL: `${__API_URL__}/api`,
    headers: {
      'Content-Type': 'application/json',
      'X-Client-Origin': 'JUKEPHONE_APP'
    }
  })
  // attach token
  apiClient.interceptors.request.use(
    (config: any) => {
      const token = onlineStore.accessToken
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`
      }
      return config
    },
    (error: any) => {
      return Promise.reject(error)
    }
  )

  // services
  const api = {
    auth: new AuthService(apiClient),
    users: new UserService(apiClient)
  }

  return api
}

export default initServices
