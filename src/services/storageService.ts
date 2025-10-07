import { STORAGE_KEYS } from '@/utils/constants'

export const storageService = {
  getToken: (): string | null => {
    return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)
  },

  setToken: (token: string): void => {
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token)
  },

  removeToken: (): void => {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN)
  },

  getUser: (): string | null => {
    return localStorage.getItem(STORAGE_KEYS.USER)
  },

  setUser: (user: unknown): void => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user))
  },

  removeUser: (): void => {
    localStorage.removeItem(STORAGE_KEYS.USER)
  },

  getTheme: (): string | null => {
    return localStorage.getItem(STORAGE_KEYS.THEME)
  },

  setTheme: (theme: string): void => {
    localStorage.setItem(STORAGE_KEYS.THEME, theme)
  },

  clearAll: (): void => {
    localStorage.clear()
  },
}
