import Service from '..'

class UserService extends Service {
  async getMe() {
    return this.client.get(`/users/me`).then((res) => res.data)
  }
}

export default UserService
