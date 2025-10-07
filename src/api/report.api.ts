import api from './axios.config'
import {
  MonthSummary,
  CategorySummary,
  MonthlyEvolution,
  FinancialOverview,
} from '@/types/report.types'

export const reportApi = {
  getMonthSummary: async (): Promise<MonthSummary> => {
    const response = await api.get<MonthSummary>('/reports/month-summary')
    return response.data
  },

  getCategorySummary: async (month?: string): Promise<CategorySummary[]> => {
    const params = month ? { month } : {}
    const response = await api.get<CategorySummary[]>('/reports/category-summary', { params })
    return response.data
  },

  getMonthlyEvolution: async (months = 12): Promise<MonthlyEvolution[]> => {
    const params = { months }
    const response = await api.get<MonthlyEvolution[]>('/reports/monthly-evolution', { params })
    return response.data
  },

  getOverview: async (): Promise<FinancialOverview> => {
    const response = await api.get<FinancialOverview>('/reports/overview')
    return response.data
  },
}
