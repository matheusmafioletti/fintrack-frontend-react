export type TransactionType = 'INCOME' | 'EXPENSE'

export interface Category {
  id: number
  name: string
  type: TransactionType
  color: string
  icon: string
  createdAt: string
  updatedAt: string
}

export interface CategoryRequest {
  name: string
  type: TransactionType
  color?: string
  icon?: string
}

export interface CategoryResponse extends Category {}
