export const APP_NAME = 'FinTrack'
export const APP_DESCRIPTION = 'Sistema de Controle Financeiro Pessoal'

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

export const STORAGE_KEYS = {
  AUTH_TOKEN: '@fintrack:token',
  USER: '@fintrack:user',
  THEME: '@fintrack:theme',
}

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  TRANSACTIONS: '/transactions',
  CATEGORIES: '/categories',
  BUDGETS: '/budgets',
  REPORTS: '/reports',
  PROFILE: '/profile',
}

export const TRANSACTION_TYPES = {
  INCOME: 'INCOME' as const,
  EXPENSE: 'EXPENSE' as const,
}

export const BUDGET_PERIODS = {
  WEEKLY: 'WEEKLY' as const,
  MONTHLY: 'MONTHLY' as const,
  YEARLY: 'YEARLY' as const,
}

export const BUDGET_STATUS = {
  OK: 'OK' as const,
  WARNING: 'WARNING' as const,
  EXCEEDED: 'EXCEEDED' as const,
}

export const PAGINATION = {
  DEFAULT_PAGE: 0,
  DEFAULT_SIZE: 20,
}
