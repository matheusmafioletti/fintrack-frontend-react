import { Category, TransactionType } from './category.types'

export interface Transaction {
  id: number
  description: string
  amount: number
  type: TransactionType
  date: string
  notes?: string
  recurring: boolean
  category: {
    id: number
    name: string
    color: string
    icon: string
  }
  createdAt: string
  updatedAt: string
}

export interface TransactionRequest {
  description: string
  amount: number
  type: TransactionType
  categoryId: number
  date: string
  notes?: string
  recurring?: boolean
}

export interface TransactionFilter {
  type?: TransactionType
  categoryId?: number
  startDate?: string
  endDate?: string
  search?: string
}

export interface TransactionSummary {
  totalIncome: number
  totalExpense: number
  balance: number
  transactionCount: number
  period: {
    startDate: string
    endDate: string
  }
}

export interface PaginatedTransactions {
  content: Transaction[]
  page: number
  size: number
  totalElements: number
  totalPages: number
  last: boolean
}
