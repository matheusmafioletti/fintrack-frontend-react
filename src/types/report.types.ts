export interface MonthSummary {
  month: string
  totalIncome: number
  totalExpense: number
  balance: number
  comparisonWithPreviousMonth?: {
    incomeChange: number
    expenseChange: number
    balanceChange: number
  }
}

export interface CategorySummary {
  categoryId: number
  categoryName: string
  categoryColor: string
  totalAmount: number
  percentage: number
  transactionCount: number
}

export interface MonthlyEvolution {
  month: string
  income: number
  expense: number
  balance: number
}

export interface FinancialOverview {
  currentMonth: {
    totalIncome: number
    totalExpense: number
    balance: number
  }
  topCategories: {
    categoryName: string
    categoryColor: string
    amount: number
    percentage: number
  }[]
  recentTransactions: {
    id: number
    description: string
    amount: number
    type: 'INCOME' | 'EXPENSE'
    date: string
    categoryName: string
  }[]
  totalAllTime: {
    income: number
    expense: number
    balance: number
  }
}
