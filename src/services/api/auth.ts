import Service from '..'

class AuthService extends Service {
  async loginGoogle(code: string): Promise<string> {
    return this.client
      .get<string>('/auth/google/callback', {
        params: { code }
      })
      .then((res) => res.data)
  }
}

export default AuthService
