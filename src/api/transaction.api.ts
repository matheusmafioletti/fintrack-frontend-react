import api from './axios.config'
import {
  Transaction,
  TransactionRequest,
  TransactionFilter,
  TransactionSummary,
  PaginatedTransactions,
} from '@/types/transaction.types'

export const transactionApi = {
  getAll: async (
    filter?: TransactionFilter,
    page = 0,
    size = 20,
    sort = 'date,desc'
  ): Promise<PaginatedTransactions> => {
    const params = {
      ...filter,
      page,
      size,
      sort,
    }
    const response = await api.get<PaginatedTransactions>('/transactions', { params })
    return response.data
  },

  getById: async (id: number): Promise<Transaction> => {
    const response = await api.get<Transaction>(`/transactions/${id}`)
    return response.data
  },

  create: async (data: TransactionRequest): Promise<Transaction> => {
    const response = await api.post<Transaction>('/transactions', data)
    return response.data
  },

  update: async (id: number, data: Partial<TransactionRequest>): Promise<Transaction> => {
    const response = await api.put<Transaction>(`/transactions/${id}`, data)
    return response.data
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/transactions/${id}`)
  },

  getSummary: async (startDate?: string, endDate?: string): Promise<TransactionSummary> => {
    const params = { startDate, endDate }
    const response = await api.get<TransactionSummary>('/transactions/summary', { params })
    return response.data
  },
}
