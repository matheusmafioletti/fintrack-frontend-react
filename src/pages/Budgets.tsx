import { useState, useEffect } from 'react'
import { Card } from '@/components/common/Card'
import { Button } from '@/components/common/Button'
import { Modal } from '@/components/common/Modal'
import { Input } from '@/components/common/Input'
import { EmptyState } from '@/components/common/EmptyState'
import { Loading } from '@/components/common/Loading'
import { Plus, Edit2, Trash2, Target, AlertTriangle, CheckCircle } from 'lucide-react'
import { cn } from '@/utils/cn'
import { formatCurrency } from '@/utils/formatters'
import { toast } from 'sonner'

interface Budget {
  id: number
  categoryId: number
  categoryName: string
  categoryColor: string
  amount: number
  spent: number
  period: 'WEEKLY' | 'MONTHLY' | 'YEARLY'
}

const MOCK_CATEGORIES = [
  { id: 3, name: 'Food', color: '#F59E0B' },
  { id: 4, name: 'Transport', color: '#3B82F6' },
  { id: 5, name: 'Entertainment', color: '#EC4899' },
  { id: 6, name: 'Utilities', color: '#14B8A6' },
]

export function Budgets() {
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null)
  const [formData, setFormData] = useState({
    categoryId: MOCK_CATEGORIES[0].id,
    amount: '',
    period: 'MONTHLY' as 'WEEKLY' | 'MONTHLY' | 'YEARLY',
  })

  useEffect(() => {
    loadBudgets()
  }, [])

  const loadBudgets = async () => {
    setIsLoading(true)
    // Mock data
    setTimeout(() => {
      setBudgets([
        {
          id: 1,
          categoryId: 3,
          categoryName: 'Food',
          categoryColor: '#F59E0B',
          amount: 1000,
          spent: 750.50,
          period: 'MONTHLY',
        },
        {
          id: 2,
          categoryId: 4,
          categoryName: 'Transport',
          categoryColor: '#3B82F6',
          amount: 500,
          spent: 475.00,
          period: 'MONTHLY',
        },
        {
          id: 3,
          categoryId: 5,
          categoryName: 'Entertainment',
          categoryColor: '#EC4899',
          amount: 300,
          spent: 320.00,
          period: 'MONTHLY',
        },
      ])
      setIsLoading(false)
    }, 500)
  }

  const handleOpenModal = (budget?: Budget) => {
    if (budget) {
      setEditingBudget(budget)
      setFormData({
        categoryId: budget.categoryId,
        amount: budget.amount.toString(),
        period: budget.period,
      })
    } else {
      setEditingBudget(null)
      setFormData({
        categoryId: MOCK_CATEGORIES[0].id,
        amount: '',
        period: 'MONTHLY',
      })
    }
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingBudget(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.amount) {
      toast.error('Please enter an amount')
      return
    }

    const amount = parseFloat(formData.amount)
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount')
      return
    }

    const category = MOCK_CATEGORIES.find(c => c.id === formData.categoryId)!

    if (editingBudget) {
      setBudgets(prev =>
        prev.map(b =>
          b.id === editingBudget.id
            ? {
                ...b,
                categoryId: formData.categoryId,
                categoryName: category.name,
                categoryColor: category.color,
                amount,
                period: formData.period,
              }
            : b
        )
      )
      toast.success('Budget updated successfully')
    } else {
      const newBudget: Budget = {
        id: Date.now(),
        categoryId: formData.categoryId,
        categoryName: category.name,
        categoryColor: category.color,
        amount,
        spent: 0,
        period: formData.period,
      }
      setBudgets(prev => [...prev, newBudget])
      toast.success('Budget created successfully')
    }

    handleCloseModal()
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this budget?')) return
    setBudgets(prev => prev.filter(b => b.id !== id))
    toast.success('Budget deleted successfully')
  }

  const getProgressPercentage = (spent: number, amount: number) => {
    return Math.min((spent / amount) * 100, 100)
  }

  const getProgressStatus = (percentage: number) => {
    if (percentage >= 100) return 'exceeded'
    if (percentage >= 80) return 'warning'
    return 'ok'
  }

  const getProgressColor = (status: string) => {
    switch (status) {
      case 'exceeded':
        return 'bg-red-500'
      case 'warning':
        return 'bg-yellow-500'
      default:
        return 'bg-green-500'
    }
  }

  const totalBudget = budgets.reduce((sum, b) => sum + b.amount, 0)
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0)
  const overallPercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0

  if (isLoading) {
    return <Loading text="Loading budgets..." />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Budgets
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Set and track spending limits for your categories
          </p>
        </div>
        <Button onClick={() => handleOpenModal()}>
          <Plus className="h-4 w-4 mr-2" />
          Add Budget
        </Button>
      </div>

      {/* Overall Summary */}
      {budgets.length > 0 && (
        <Card>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Overall Budget
              </h3>
              <span className={cn(
                "text-sm font-medium",
                overallPercentage >= 100 ? "text-red-600" :
                overallPercentage >= 80 ? "text-yellow-600" :
                "text-green-600"
              )}>
                {overallPercentage.toFixed(1)}% used
              </span>
            </div>

            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(totalSpent)}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                of {formatCurrency(totalBudget)}
              </span>
            </div>

            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full transition-all",
                  getProgressColor(getProgressStatus(overallPercentage))
                )}
                style={{ width: `${Math.min(overallPercentage, 100)}%` }}
              />
            </div>
          </div>
        </Card>
      )}

      {/* Budgets List */}
      {budgets.length === 0 ? (
        <EmptyState
          icon={Target}
          title="No budgets yet"
          description="Create your first budget to start tracking your spending limits"
          action={{
            label: 'Add Budget',
            onClick: () => handleOpenModal(),
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {budgets.map(budget => {
            const percentage = getProgressPercentage(budget.spent, budget.amount)
            const status = getProgressStatus(percentage)
            const remaining = budget.amount - budget.spent

            return (
              <Card key={budget.id} className="relative">
                {/* Status Badge */}
                <div className="absolute top-4 right-4">
                  {status === 'exceeded' ? (
                    <div className="flex items-center gap-1 text-red-600 bg-red-100 dark:bg-red-900/30 px-2 py-1 rounded-full text-xs font-medium">
                      <AlertTriangle className="h-3 w-3" />
                      Over Budget
                    </div>
                  ) : status === 'warning' ? (
                    <div className="flex items-center gap-1 text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 px-2 py-1 rounded-full text-xs font-medium">
                      <AlertTriangle className="h-3 w-3" />
                      Warning
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full text-xs font-medium">
                      <CheckCircle className="h-3 w-3" />
                      On Track
                    </div>
                  )}
                </div>

                <div className="space-y-4 pt-8">
                  {/* Category Info */}
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${budget.categoryColor}20` }}
                    >
                      <Target className="h-6 w-6" style={{ color: budget.categoryColor }} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {budget.categoryName}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {budget.period.charAt(0) + budget.period.slice(1).toLowerCase()} Budget
                      </p>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="space-y-2">
                    <div className="flex items-baseline justify-between">
                      <span className="text-2xl font-bold text-gray-900 dark:text-white">
                        {formatCurrency(budget.spent)}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        of {formatCurrency(budget.amount)}
                      </span>
                    </div>

                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "h-full transition-all",
                          getProgressColor(status)
                        )}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className={cn(
                        "font-medium",
                        remaining >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                      )}>
                        {remaining >= 0 ? `${formatCurrency(remaining)} remaining` : `${formatCurrency(Math.abs(remaining))} over`}
                      </span>
                      <span className="text-gray-500 dark:text-gray-400">
                        {percentage.toFixed(1)}% used
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenModal(budget)}
                      className="flex-1"
                    >
                      <Edit2 className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(budget.id)}
                      className="flex-1"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingBudget ? 'Edit Budget' : 'Add Budget'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category
            </label>
            <select
              value={formData.categoryId}
              onChange={(e) => setFormData(prev => ({ ...prev, categoryId: parseInt(e.target.value) }))}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
              required
            >
              {MOCK_CATEGORIES.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <Input
            label="Budget Amount"
            type="number"
            step="0.01"
            value={formData.amount}
            onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
            placeholder="0.00"
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Period
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['WEEKLY', 'MONTHLY', 'YEARLY'] as const).map(period => (
                <Button
                  key={period}
                  type="button"
                  variant={formData.period === period ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setFormData(prev => ({ ...prev, period }))}
                >
                  {period.charAt(0) + period.slice(1).toLowerCase()}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={handleCloseModal} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              {editingBudget ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
