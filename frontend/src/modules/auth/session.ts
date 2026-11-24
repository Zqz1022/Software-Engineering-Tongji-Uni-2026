import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api, ApiError, type User } from '../../api/client'

export const useSessionStore = defineStore('session', () => {
  const user = ref<User | null>(null)

  async function restore() {
    try {
      user.value = await api.me()
    } catch (error) {
      user.value = null
      if (!(error instanceof ApiError && error.status === 401)) throw error
    }
  }

  async function login(userId: number) {
    user.value = await api.devLogin(userId)
  }

  async function logout() {
    await api.logout()
    user.value = null
  }

  return { user, restore, login, logout }
})
