import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User, LoginRequest, RegisterRequest } from '@/types/user.types'
import { authApi } from '@/api/auth.api'
import { storageService } from '@/services/storageService'
import { toast } from 'sonner'

interface AuthContextData {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (credentials: LoginRequest) => Promise<void>
  register: (data: RegisterRequest) => Promise<void>
  logout: () => void
  updateUser: (data: Partial<User>) => Promise<void>
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadUser = async () => {
      const token = storageService.getToken()
      
      if (token) {
        try {
          const userData = await authApi.getCurrentUser()
          setUser(userData)
        } catch (error) {
          storageService.clearAll()
        }
      }
      
      setIsLoading(false)
    }

    loadUser()
  }, [])

  const login = async (credentials: LoginRequest) => {
    try {
      const response = await authApi.login(credentials)
      
      storageService.setToken(response.token)
      storageService.setUser(response.user)
      setUser(response.user)
      
      toast.success('Login realizado com sucesso!')
    } catch (error: any) {
      const message = error.response?.data?.message || 'Erro ao fazer login'
      toast.error(message)
      throw error
    }
  }

  const register = async (data: RegisterRequest) => {
    try {
      const response = await authApi.register(data)
      
      storageService.setToken(response.token)
      storageService.setUser(response.user)
      setUser(response.user)
      
      toast.success('Conta criada com sucesso!')
    } catch (error: any) {
      const message = error.response?.data?.message || 'Erro ao criar conta'
      toast.error(message)
      throw error
    }
  }

  const logout = () => {
    storageService.clearAll()
    setUser(null)
    toast.info('Você saiu da sua conta')
  }

  const updateUser = async (data: Partial<User>) => {
    try {
      const updatedUser = await authApi.updateProfile(data)
      setUser(updatedUser)
      storageService.setUser(updatedUser)
      toast.success('Perfil atualizado com sucesso!')
    } catch (error: any) {
      const message = error.response?.data?.message || 'Erro ao atualizar perfil'
      toast.error(message)
      throw error
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  
  return context
}
