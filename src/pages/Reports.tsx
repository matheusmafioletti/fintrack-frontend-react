import { useState } from 'react'
import { Card } from '@/components/common/Card'
import { Button } from '@/components/common/Button'
import { formatCurrency } from '@/utils/formatters'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
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
import { Calendar, TrendingUp, TrendingDown, DollarSign } from 'lucide-react'

const MOCK_DATA = {
  monthlyComparison: [
    { month: 'Jan', income: 7200, expense: 5100, balance: 2100 },
    { month: 'Feb', income: 6800, expense: 5300, balance: 1500 },
    { month: 'Mar', income: 7500, expense: 4900, balance: 2600 },
    { month: 'Apr', income: 7200, expense: 5100, balance: 2100 },
    { month: 'May', income: 7800, expense: 5500, balance: 2300 },
    { month: 'Jun', income: 8200, expense: 4800, balance: 3400 },
    { month: 'Jul', income: 7500, expense: 5200, balance: 2300 },
    { month: 'Aug', income: 8000, expense: 5600, balance: 2400 },
    { month: 'Sep', income: 7600, expense: 4900, balance: 2700 },
    { month: 'Oct', income: 8500, expense: 5230, balance: 3270 },
  ],
  categoryBreakdown: [
    { name: 'Food', value: 1250, color: '#F59E0B' },
    { name: 'Transport', value: 850, color: '#3B82F6' },
    { name: 'Entertainment', value: 620, color: '#EC4899' },
    { name: 'Utilities', value: 450, color: '#14B8A6' },
    { name: 'Shopping', value: 980, color: '#8B5CF6' },
    { name: 'Others', value: 1080, color: '#6B7280' },
  ],
  topExpenses: [
    { category: 'Food', amount: 1250, transactions: 28 },
    { category: 'Shopping', amount: 980, transactions: 12 },
    { category: 'Transport', amount: 850, transactions: 35 },
    { category: 'Entertainment', amount: 620, transactions: 8 },
    { category: 'Utilities', amount: 450, transactions: 6 },
  ],
}

export function Reports() {
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('month')

  const latestMonth = MOCK_DATA.monthlyComparison[MOCK_DATA.monthlyComparison.length - 1]
  const prevMonth = MOCK_DATA.monthlyComparison[MOCK_DATA.monthlyComparison.length - 2]

  const incomeChange = ((latestMonth.income - prevMonth.income) / prevMonth.income) * 100
  const expenseChange = ((latestMonth.expense - prevMonth.expense) / prevMonth.expense) * 100

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Reports
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Analyze your financial performance and trends
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant={period === 'week' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setPeriod('week')}
          >
            Week
          </Button>
          <Button
            variant={period === 'month' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setPeriod('month')}
          >
            Month
          </Button>
          <Button
            variant={period === 'year' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setPeriod('year')}
          >
            Year
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Current Month Income</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(latestMonth.income)}
              </p>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-600 font-medium">
                  +{incomeChange.toFixed(1)}%
                </span>
                <span className="text-sm text-gray-500">vs last month</span>
              </div>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Current Month Expense</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(latestMonth.expense)}
              </p>
              <div className="flex items-center gap-1 mt-2">
                <TrendingDown className="h-4 w-4 text-red-600" />
                <span className="text-sm text-red-600 font-medium">
                  +{expenseChange.toFixed(1)}%
                </span>
                <span className="text-sm text-gray-500">vs last month</span>
              </div>
            </div>
            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <DollarSign className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Savings Rate</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {((latestMonth.balance / latestMonth.income) * 100).toFixed(1)}%
              </p>
              <p className="text-sm text-gray-500 mt-2">
                {formatCurrency(latestMonth.balance)} saved
              </p>
            </div>
            <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
              <Calendar className="h-6 w-6 text-primary-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trend */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Income vs Expense Trend
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={MOCK_DATA.monthlyComparison}>
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
                name="Income"
              />
              <Line
                type="monotone"
                dataKey="expense"
                stroke="#EF4444"
                strokeWidth={2}
                dot={{ fill: '#EF4444', r: 4 }}
                name="Expense"
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Category Distribution */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Expense by Category
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={MOCK_DATA.categoryBreakdown}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {MOCK_DATA.categoryBreakdown.map((entry, index) => (
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

        {/* Balance Evolution */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Monthly Balance
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={MOCK_DATA.monthlyComparison}>
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
              <Bar dataKey="balance" fill="#6366F1" name="Balance" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Top Expenses */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Top Expense Categories
          </h3>
          <div className="space-y-4">
            {MOCK_DATA.topExpenses.map((item, index) => {
              const categoryData = MOCK_DATA.categoryBreakdown.find(c => c.name === item.category)
              const total = MOCK_DATA.categoryBreakdown.reduce((sum, c) => sum + c.value, 0)
              const percentage = (item.amount / total) * 100

              return (
                <div key={item.category} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gray-100 dark:bg-gray-700">
                        <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                          #{index + 1}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {item.category}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {item.transactions} transactions
                        </p>
                      </div>
                    </div>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(item.amount)}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: categoryData?.color,
                      }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      </div>
    </div>
  )
}
