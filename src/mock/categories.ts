import { Category } from '@/types/admin'

export const mockCategories: Category[] = [
  {
    id: '1',
    name: 'Makanan & Minuman',
    type: 'expense',
    color: '#ef4444',
    icon: '🍽️',
    isDefault: true
  },
  {
    id: '2',
    name: 'Transportasi',
    type: 'expense',
    color: '#3b82f6',
    icon: '🚗',
    isDefault: true
  },
  {
    id: '3',
    name: 'Belanja',
    type: 'expense',
    color: '#8b5cf6',
    icon: '🛍️',
    isDefault: true
  },
  {
    id: '4',
    name: 'Gaji',
    type: 'income',
    color: '#10b981',
    icon: '💰',
    isDefault: true
  },
  {
    id: '5',
    name: 'Bonus',
    type: 'income',
    color: '#f59e0b',
    icon: '🎁',
    isDefault: false
  }
]

export function getCategories(): Promise<Category[]> {
  return Promise.resolve(mockCategories)
}

export function createCategory(category: Omit<Category, 'id'>): Promise<Category> {
  const newCategory: Category = {
    ...category,
    id: Date.now().toString()
  }
  mockCategories.push(newCategory)
  return Promise.resolve(newCategory)
}

export function updateCategory(id: string, updates: Partial<Category>): Promise<Category> {
  const index = mockCategories.findIndex(c => c.id === id)
  if (index === -1) {
    throw new Error('Category not found')
  }
  mockCategories[index] = { ...mockCategories[index], ...updates }
  return Promise.resolve(mockCategories[index])
}

export function deleteCategory(id: string): Promise<void> {
  const index = mockCategories.findIndex(c => c.id === id)
  if (index === -1) {
    throw new Error('Category not found')
  }
  mockCategories.splice(index, 1)
  return Promise.resolve()
}
