import api from './axios.config'
import { Budget, BudgetRequest, BudgetProgress, BudgetPeriod } from '@/types/budget.types'

export const budgetApi = {
  getAll: async (period?: BudgetPeriod): Promise<Budget[]> => {
    const params = period ? { period } : {}
    const response = await api.get<Budget[]>('/budgets', { params })
    return response.data
  },

  getById: async (id: number): Promise<Budget> => {
    const response = await api.get<Budget>(`/budgets/${id}`)
    return response.data
  },

  create: async (data: BudgetRequest): Promise<Budget> => {
    const response = await api.post<Budget>('/budgets', data)
    return response.data
  },

  update: async (id: number, data: Partial<BudgetRequest>): Promise<Budget> => {
    const response = await api.put<Budget>(`/budgets/${id}`, data)
    return response.data
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/budgets/${id}`)
  },

  getProgress: async (): Promise<BudgetProgress[]> => {
    const response = await api.get<BudgetProgress[]>('/budgets/progress')
    return response.data
  },
}
