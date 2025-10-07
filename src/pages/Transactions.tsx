import { useState, useEffect } from 'react'
import { Card } from '@/components/common/Card'
import { Button } from '@/components/common/Button'
import { Modal } from '@/components/common/Modal'
import { Input } from '@/components/common/Input'
import { EmptyState } from '@/components/common/EmptyState'
import { Loading } from '@/components/common/Loading'
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Search, 
  Filter,
  TrendingUp,
  TrendingDown,
  ChevronLeft,
  ChevronRight,
  Receipt
} from 'lucide-react'
import { cn } from '@/utils/cn'
import { formatCurrency, formatDate } from '@/utils/formatters'
import { toast } from 'sonner'

interface Transaction {
  id: number
  description: string
  amount: number
  type: 'INCOME' | 'EXPENSE'
  categoryId: number
  categoryName: string
  categoryColor: string
  date: string
  notes?: string
}

interface Category {
  id: number
  name: string
  type: 'INCOME' | 'EXPENSE'
  color: string
}

const MOCK_CATEGORIES: Category[] = [
  { id: 1, name: 'Salary', type: 'INCOME', color: '#10B981' },
  { id: 2, name: 'Freelance', type: 'INCOME', color: '#8B5CF6' },
  { id: 3, name: 'Food', type: 'EXPENSE', color: '#F59E0B' },
  { id: 4, name: 'Transport', type: 'EXPENSE', color: '#3B82F6' },
  { id: 5, name: 'Entertainment', type: 'EXPENSE', color: '#EC4899' },
  { id: 6, name: 'Utilities', type: 'EXPENSE', color: '#14B8A6' },
]

export function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'INCOME' | 'EXPENSE'>('ALL')
  const [categoryFilter, setCategoryFilter] = useState<number | 'ALL'>('ALL')
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  
  // Form
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    type: 'EXPENSE' as 'INCOME' | 'EXPENSE',
    categoryId: MOCK_CATEGORIES[2].id,
    date: new Date().toISOString().split('T')[0],
    notes: '',
  })

  useEffect(() => {
    loadTransactions()
  }, [])

  const loadTransactions = async () => {
    setIsLoading(true)
    // Mock data
    setTimeout(() => {
      setTransactions([
        {
          id: 1,
          description: 'Monthly Salary',
          amount: 5000,
          type: 'INCOME',
          categoryId: 1,
          categoryName: 'Salary',
          categoryColor: '#10B981',
          date: '2024-10-01',
        },
        {
          id: 2,
          description: 'Grocery Shopping',
          amount: 250.50,
          type: 'EXPENSE',
          categoryId: 3,
          categoryName: 'Food',
          categoryColor: '#F59E0B',
          date: '2024-10-05',
          notes: 'Weekly groceries',
        },
        {
          id: 3,
          description: 'Uber Ride',
          amount: 25.00,
          type: 'EXPENSE',
          categoryId: 4,
          categoryName: 'Transport',
          categoryColor: '#3B82F6',
          date: '2024-10-05',
        },
        {
          id: 4,
          description: 'Freelance Project',
          amount: 1500,
          type: 'INCOME',
          categoryId: 2,
          categoryName: 'Freelance',
          categoryColor: '#8B5CF6',
          date: '2024-10-03',
        },
        {
          id: 5,
          description: 'Movie Tickets',
          amount: 50.00,
          type: 'EXPENSE',
          categoryId: 5,
          categoryName: 'Entertainment',
          categoryColor: '#EC4899',
          date: '2024-10-04',
        },
        {
          id: 6,
          description: 'Electricity Bill',
          amount: 180.00,
          type: 'EXPENSE',
          categoryId: 6,
          categoryName: 'Utilities',
          categoryColor: '#14B8A6',
          date: '2024-10-02',
        },
      ])
      setIsLoading(false)
    }, 600)
  }

  const handleOpenModal = (transaction?: Transaction) => {
    if (transaction) {
      setEditingTransaction(transaction)
      setFormData({
        description: transaction.description,
        amount: transaction.amount.toString(),
        type: transaction.type,
        categoryId: transaction.categoryId,
        date: transaction.date,
        notes: transaction.notes || '',
      })
    } else {
      setEditingTransaction(null)
      setFormData({
        description: '',
        amount: '',
        type: 'EXPENSE',
        categoryId: MOCK_CATEGORIES[2].id,
        date: new Date().toISOString().split('T')[0],
        notes: '',
      })
    }
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingTransaction(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.description.trim() || !formData.amount) {
      toast.error('Please fill in all required fields')
      return
    }

    const amount = parseFloat(formData.amount)
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount')
      return
    }

    const category = MOCK_CATEGORIES.find(c => c.id === formData.categoryId)!

    if (editingTransaction) {
      setTransactions(prev =>
        prev.map(t =>
          t.id === editingTransaction.id
            ? {
                ...t,
                description: formData.description,
                amount,
                type: formData.type,
                categoryId: formData.categoryId,
                categoryName: category.name,
                categoryColor: category.color,
                date: formData.date,
                notes: formData.notes,
              }
            : t
        )
      )
      toast.success('Transaction updated successfully')
    } else {
      const newTransaction: Transaction = {
        id: Date.now(),
        description: formData.description,
        amount,
        type: formData.type,
        categoryId: formData.categoryId,
        categoryName: category.name,
        categoryColor: category.color,
        date: formData.date,
        notes: formData.notes,
      }
      setTransactions(prev => [newTransaction, ...prev])
      toast.success('Transaction created successfully')
    }

    handleCloseModal()
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this transaction?')) return
    setTransactions(prev => prev.filter(t => t.id !== id))
    toast.success('Transaction deleted successfully')
  }

  // Filtering
  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         t.categoryName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === 'ALL' || t.type === typeFilter
    const matchesCategory = categoryFilter === 'ALL' || t.categoryId === categoryFilter

    return matchesSearch && matchesType && matchesCategory
  })

  // Pagination
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedTransactions = filteredTransactions.slice(startIndex, startIndex + itemsPerPage)

  // Calculate totals
  const totals = filteredTransactions.reduce(
    (acc, t) => {
      if (t.type === 'INCOME') {
        acc.income += t.amount
      } else {
        acc.expense += t.amount
      }
      return acc
    },
    { income: 0, expense: 0 }
  )

  const availableCategories = MOCK_CATEGORIES.filter(
    c => formData.type === 'ALL' || c.type === formData.type
  )

  if (isLoading) {
    return <Loading text="Loading transactions..." />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Transactions
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track all your income and expenses
          </p>
        </div>
        <Button onClick={() => handleOpenModal()}>
          <Plus className="h-4 w-4 mr-2" />
          Add Transaction
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Income</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {formatCurrency(totals.income)}
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Expense</p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                {formatCurrency(totals.expense)}
              </p>
            </div>
            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <TrendingDown className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Balance</p>
              <p className={cn(
                "text-2xl font-bold",
                totals.income - totals.expense >= 0
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
              )}>
                {formatCurrency(totals.income - totals.expense)}
              </p>
            </div>
            <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
              <Receipt className="h-6 w-6 text-primary-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
            >
              <option value="ALL">All Types</option>
              <option value="INCOME">Income</option>
              <option value="EXPENSE">Expense</option>
            </select>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value === 'ALL' ? 'ALL' : parseInt(e.target.value))}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
            >
              <option value="ALL">All Categories</option>
              {MOCK_CATEGORIES.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Transactions List */}
      {paginatedTransactions.length === 0 ? (
        <EmptyState
          icon={Receipt}
          title="No transactions found"
          description="Start tracking your finances by adding your first transaction"
          action={{
            label: 'Add Transaction',
            onClick: () => handleOpenModal(),
          }}
        />
      ) : (
        <Card>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {paginatedTransactions.map(transaction => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${transaction.categoryColor}20` }}
                  >
                    {transaction.type === 'INCOME' ? (
                      <TrendingUp className="h-6 w-6" style={{ color: transaction.categoryColor }} />
                    ) : (
                      <TrendingDown className="h-6 w-6" style={{ color: transaction.categoryColor }} />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 dark:text-white truncate">
                      {transaction.description}
                    </h4>
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <span className="truncate">{transaction.categoryName}</span>
                      <span>•</span>
                      <span>{formatDate(transaction.date)}</span>
                    </div>
                    {transaction.notes && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 truncate">
                        {transaction.notes}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span
                    className={cn(
                      'font-bold text-lg',
                      transaction.type === 'INCOME'
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                    )}
                  >
                    {transaction.type === 'INCOME' ? '+' : '-'}
                    {formatCurrency(transaction.amount)}
                  </span>

                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOpenModal(transaction)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(transaction.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-gray-700">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredTransactions.length)} of{' '}
                {filteredTransactions.length} transactions
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <Button
                      key={page}
                      variant={currentPage === page ? 'primary' : 'outline'}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </Button>
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingTransaction ? 'Edit Transaction' : 'Add Transaction'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Description"
            type="text"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="e.g., Grocery shopping"
            required
          />

          <Input
            label="Amount"
            type="number"
            step="0.01"
            value={formData.amount}
            onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
            placeholder="0.00"
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Type
            </label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={formData.type === 'INCOME' ? 'primary' : 'outline'}
                className="flex-1"
                onClick={() => setFormData(prev => ({ ...prev, type: 'INCOME', categoryId: MOCK_CATEGORIES[0].id }))}
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Income
              </Button>
              <Button
                type="button"
                variant={formData.type === 'EXPENSE' ? 'primary' : 'outline'}
                className="flex-1"
                onClick={() => setFormData(prev => ({ ...prev, type: 'EXPENSE', categoryId: MOCK_CATEGORIES[2].id }))}
              >
                <TrendingDown className="h-4 w-4 mr-2" />
                Expense
              </Button>
            </div>
          </div>

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
              {availableCategories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <Input
            label="Date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Notes (optional)
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Add any additional notes..."
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 resize-none"
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={handleCloseModal} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              {editingTransaction ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
