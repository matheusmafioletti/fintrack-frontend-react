export type BudgetPeriod = 'WEEKLY' | 'MONTHLY' | 'YEARLY'
export type BudgetStatus = 'OK' | 'WARNING' | 'EXCEEDED'

export interface Budget {
  id: number
  amount: number
  period: BudgetPeriod
  startDate: string
  endDate: string | null
  category: {
    id: number
    name: string
    color: string
    icon: string
  }
  createdAt: string
  updatedAt: string
}

export interface BudgetRequest {
  categoryId: number
  amount: number
  period: BudgetPeriod
  startDate: string
  endDate?: string | null
}

export interface BudgetProgress {
  budgetId: number
  categoryName: string
  categoryColor: string
  budgetAmount: number
  spentAmount: number
  remainingAmount: number
  percentageUsed: number
  status: BudgetStatus
  period: BudgetPeriod
  startDate: string
  endDate: string | null
}
