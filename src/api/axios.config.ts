import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'
import { API_URL } from '@/utils/constants'
import { storageService } from '@/services/storageService'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor - adiciona token JWT
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = storageService.getToken()
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

// Response interceptor - trata erros globais
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Token inválido ou expirado
      storageService.clearAll()
      window.location.href = '/login'
    }
    
    return Promise.reject(error)
  }
)

export default api
