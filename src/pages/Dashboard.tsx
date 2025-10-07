import { useEffect, useState } from 'react'
import { Card } from '@/components/common/Card'
import { Loading } from '@/components/common/Loading'
import { TrendingUp, TrendingDown, DollarSign, ArrowUpRight, ArrowDownRight, Wallet } from 'lucide-react'
import { cn } from '@/utils/cn'
import { formatCurrency, formatDate } from '@/utils/formatters'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

interface DashboardData {
  summary: {
    totalIncome: number
    totalExpense: number
    balance: number
    incomeChange: number
    expenseChange: number
  }
  recentTransactions: Array<{
    id: number
    description: string
    amount: number
    type: 'INCOME' | 'EXPENSE'
    date: string
    categoryName: string
    categoryColor: string
  }>
  categoryExpenses: Array<{
    name: string
    value: number
    color: string
  }>
  monthlyEvolution: Array<{
    month: string
    income: number
    expense: number
  }>
}

export function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate API call with mock data
    const loadDashboardData = async () => {
      setIsLoading(true)
      
      // Mock data for demonstration
      setTimeout(() => {
        setData({
          summary: {
            totalIncome: 8500.00,
            totalExpense: 5230.75,
            balance: 3269.25,
            incomeChange: 12.5,
            expenseChange: -8.3,
          },
          recentTransactions: [
            {
              id: 1,
              description: 'Salary',
              amount: 5000.00,
              type: 'INCOME',
              date: '2024-10-05',
              categoryName: 'Salary',
              categoryColor: '#10B981',
            },
            {
              id: 2,
              description: 'Grocery Shopping',
              amount: 250.50,
              type: 'EXPENSE',
              date: '2024-10-04',
              categoryName: 'Food',
              categoryColor: '#F59E0B',
            },
            {
              id: 3,
              description: 'Electricity Bill',
              amount: 180.00,
              type: 'EXPENSE',
              date: '2024-10-03',
              categoryName: 'Utilities',
              categoryColor: '#3B82F6',
            },
            {
              id: 4,
              description: 'Freelance Project',
              amount: 1500.00,
              type: 'INCOME',
              date: '2024-10-02',
              categoryName: 'Freelance',
              categoryColor: '#8B5CF6',
            },
          ],
          categoryExpenses: [
            { name: 'Food', value: 1250, color: '#F59E0B' },
            { name: 'Transport', value: 850, color: '#3B82F6' },
            { name: 'Entertainment', value: 620, color: '#8B5CF6' },
            { name: 'Utilities', value: 450, color: '#10B981' },
            { name: 'Others', value: 2060.75, color: '#6B7280' },
          ],
          monthlyEvolution: [
            { month: 'Apr', income: 7200, expense: 5100 },
            { month: 'May', income: 7800, expense: 5500 },
            { month: 'Jun', income: 8200, expense: 4800 },
            { month: 'Jul', income: 7500, expense: 5200 },
            { month: 'Aug', income: 8000, expense: 5600 },
            { month: 'Sep', income: 7600, expense: 4900 },
            { month: 'Oct', income: 8500, expense: 5230.75 },
          ],
        })
        setIsLoading(false)
      }, 800)
    }

    loadDashboardData()
  }, [])

  if (isLoading || !data) {
    return <Loading text="Loading dashboard..." />
  }

  const { summary, recentTransactions, categoryExpenses, monthlyEvolution } = data

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Financial overview for October 2024
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Income */}
        <Card className="relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Total Income
              </p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {formatCurrency(summary.totalIncome)}
              </h3>
              <div className="flex items-center gap-1 text-sm">
                <ArrowUpRight className="h-4 w-4 text-green-600" />
                <span className="text-green-600 font-medium">
                  {summary.incomeChange}%
                </span>
                <span className="text-gray-500 dark:text-gray-400">vs last month</span>
              </div>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </Card>

        {/* Total Expense */}
        <Card className="relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Total Expense
              </p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {formatCurrency(summary.totalExpense)}
              </h3>
              <div className="flex items-center gap-1 text-sm">
                <ArrowDownRight className="h-4 w-4 text-red-600" />
                <span className="text-red-600 font-medium">
                  {Math.abs(summary.expenseChange)}%
                </span>
                <span className="text-gray-500 dark:text-gray-400">vs last month</span>
              </div>
            </div>
            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <TrendingDown className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </Card>

        {/* Balance */}
        <Card className="relative overflow-hidden bg-gradient-to-br from-primary-500 to-primary-600">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-primary-100 mb-1">
                Current Balance
              </p>
              <h3 className="text-2xl font-bold text-white mb-2">
                {formatCurrency(summary.balance)}
              </h3>
              <p className="text-sm text-primary-100">
                Income - Expense
              </p>
            </div>
            <div className="p-3 bg-white/20 rounded-lg">
              <Wallet className="h-6 w-6 text-white" />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Evolution Chart */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Monthly Evolution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyEvolution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
              <XAxis 
                dataKey="month" 
                stroke="#6B7280"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="#6B7280"
                style={{ fontSize: '12px' }}
                tickFormatter={(value) => `$${value / 1000}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                }}
                formatter={(value: number) => formatCurrency(value)}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="income"
                stroke="#10B981"
                strokeWidth={2}
                dot={{ fill: '#10B981', r: 4 }}
                activeDot={{ r: 6 }}
                name="Income"
              />
              <Line
                type="monotone"
                dataKey="expense"
                stroke="#EF4444"
                strokeWidth={2}
                dot={{ fill: '#EF4444', r: 4 }}
                activeDot={{ r: 6 }}
                name="Expense"
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Category Distribution */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Expenses by Category
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryExpenses}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryExpenses.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                }}
                formatter={(value: number) => formatCurrency(value)}
              />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Recent Transactions
          </h3>
          <button className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium">
            View all
          </button>
        </div>
        
        <div className="space-y-3">
          {recentTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${transaction.categoryColor}20` }}
                >
                  <DollarSign
                    className="h-5 w-5"
                    style={{ color: transaction.categoryColor }}
                  />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {transaction.description}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {transaction.categoryName} • {formatDate(transaction.date)}
                  </p>
                </div>
              </div>
              <span
                className={cn(
                  'font-semibold',
                  transaction.type === 'INCOME'
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                )}
              >
                {transaction.type === 'INCOME' ? '+' : '-'}
                {formatCurrency(transaction.amount)}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
