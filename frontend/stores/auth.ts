import { defineStore } from 'pinia'

interface PublicUser {
  id: string
  email: string
  businessName: string
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null as string | null,
    user: null as PublicUser | null,
  }),
  actions: {
    setSession(token: string, user: PublicUser) {
      this.token = token
      this.user = user
      if (import.meta.client) {
        localStorage.setItem('fidelo_token', token)
        localStorage.setItem('fidelo_user', JSON.stringify(user))
      }
    },
    restore() {
      if (import.meta.client) {
        const token = localStorage.getItem('fidelo_token')
        const user = localStorage.getItem('fidelo_user')
        if (token && user) {
          this.token = token
          this.user = JSON.parse(user)
        }
      }
    },
    logout() {
      this.token = null
      this.user = null
      if (import.meta.client) {
        localStorage.removeItem('fidelo_token')
        localStorage.removeItem('fidelo_user')
      }
    },
  },
})
