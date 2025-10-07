import { useState, useEffect } from 'react'
import { Card } from '@/components/common/Card'
import { Button } from '@/components/common/Button'
import { Modal } from '@/components/common/Modal'
import { Input } from '@/components/common/Input'
import { EmptyState } from '@/components/common/EmptyState'
import { Loading } from '@/components/common/Loading'
import { Plus, Edit2, Trash2, FolderOpen, TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/utils/cn'
import { toast } from 'sonner'

interface Category {
  id: number
  name: string
  type: 'INCOME' | 'EXPENSE'
  color: string
  icon: string
}

const COLORS = [
  '#EF4444', // red
  '#F59E0B', // amber
  '#10B981', // green
  '#3B82F6', // blue
  '#8B5CF6', // purple
  '#EC4899', // pink
  '#14B8A6', // teal
  '#F97316', // orange
]

export function Categories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [filter, setFilter] = useState<'ALL' | 'INCOME' | 'EXPENSE'>('ALL')
  const [formData, setFormData] = useState({
    name: '',
    type: 'EXPENSE' as 'INCOME' | 'EXPENSE',
    color: COLORS[0],
  })

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    setIsLoading(true)
    // Mock data - replace with actual API call
    setTimeout(() => {
      setCategories([
        { id: 1, name: 'Salary', type: 'INCOME', color: '#10B981', icon: 'trending-up' },
        { id: 2, name: 'Freelance', type: 'INCOME', color: '#8B5CF6', icon: 'trending-up' },
        { id: 3, name: 'Food', type: 'EXPENSE', color: '#F59E0B', icon: 'trending-down' },
        { id: 4, name: 'Transport', type: 'EXPENSE', color: '#3B82F6', icon: 'trending-down' },
        { id: 5, name: 'Entertainment', type: 'EXPENSE', color: '#EC4899', icon: 'trending-down' },
        { id: 6, name: 'Utilities', type: 'EXPENSE', color: '#14B8A6', icon: 'trending-down' },
      ])
      setIsLoading(false)
    }, 500)
  }

  const handleOpenModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category)
      setFormData({
        name: category.name,
        type: category.type,
        color: category.color,
      })
    } else {
      setEditingCategory(null)
      setFormData({
        name: '',
        type: 'EXPENSE',
        color: COLORS[0],
      })
    }
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingCategory(null)
    setFormData({
      name: '',
      type: 'EXPENSE',
      color: COLORS[0],
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      toast.error('Category name is required')
      return
    }

    // Mock API call
    if (editingCategory) {
      setCategories(prev =>
        prev.map(cat =>
          cat.id === editingCategory.id
            ? { ...cat, ...formData }
            : cat
        )
      )
      toast.success('Category updated successfully')
    } else {
      const newCategory: Category = {
        id: Date.now(),
        ...formData,
        icon: formData.type === 'INCOME' ? 'trending-up' : 'trending-down',
      }
      setCategories(prev => [...prev, newCategory])
      toast.success('Category created successfully')
    }

    handleCloseModal()
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this category?')) return

    // Mock API call
    setCategories(prev => prev.filter(cat => cat.id !== id))
    toast.success('Category deleted successfully')
  }

  const filteredCategories = categories.filter(cat => {
    if (filter === 'ALL') return true
    return cat.type === filter
  })

  if (isLoading) {
    return <Loading text="Loading categories..." />
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Categories
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Organize your transactions with custom categories
          </p>
        </div>
        <Button onClick={() => handleOpenModal()}>
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        <Button
          variant={filter === 'ALL' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setFilter('ALL')}
        >
          All
        </Button>
        <Button
          variant={filter === 'INCOME' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setFilter('INCOME')}
        >
          <TrendingUp className="h-4 w-4 mr-1" />
          Income
        </Button>
        <Button
          variant={filter === 'EXPENSE' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setFilter('EXPENSE')}
        >
          <TrendingDown className="h-4 w-4 mr-1" />
          Expense
        </Button>
      </div>

      {/* Categories Grid */}
      {filteredCategories.length === 0 ? (
        <EmptyState
          icon={FolderOpen}
          title="No categories found"
          description="Create your first category to start organizing your transactions"
          action={{
            label: 'Add Category',
            onClick: () => handleOpenModal(),
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCategories.map(category => (
            <Card key={category.id} className="hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${category.color}20` }}
                  >
                    {category.type === 'INCOME' ? (
                      <TrendingUp className="h-6 w-6" style={{ color: category.color }} />
                    ) : (
                      <TrendingDown className="h-6 w-6" style={{ color: category.color }} />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {category.type === 'INCOME' ? 'Income' : 'Expense'}
                    </p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleOpenModal(category)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(category.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingCategory ? 'Edit Category' : 'Add Category'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Name"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="e.g., Food, Transport, Salary"
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
                onClick={() => setFormData(prev => ({ ...prev, type: 'INCOME' }))}
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Income
              </Button>
              <Button
                type="button"
                variant={formData.type === 'EXPENSE' ? 'primary' : 'outline'}
                className="flex-1"
                onClick={() => setFormData(prev => ({ ...prev, type: 'EXPENSE' }))}
              >
                <TrendingDown className="h-4 w-4 mr-2" />
                Expense
              </Button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Color
            </label>
            <div className="grid grid-cols-8 gap-2">
              {COLORS.map(color => (
                <button
                  key={color}
                  type="button"
                  className={cn(
                    'w-8 h-8 rounded-full border-2 transition-all',
                    formData.color === color
                      ? 'border-gray-900 dark:border-white scale-110'
                      : 'border-transparent'
                  )}
                  style={{ backgroundColor: color }}
                  onClick={() => setFormData(prev => ({ ...prev, color }))}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={handleCloseModal} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              {editingCategory ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
