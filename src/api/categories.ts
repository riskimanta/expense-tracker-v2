import { Category } from '@/types/admin'

const API_URL = process.env.NEXT_PUBLIC_API_URL

export async function getCategories(): Promise<Category[]> {
  if (!API_URL) {
    // Return empty array if no API configured
    return []
  }

  const response = await fetch(`${API_URL}/api/categories`)
  if (!response.ok) {
    throw new Error('Failed to fetch categories')
  }
  return response.json()
}

export async function createCategory(category: Omit<Category, 'id'>): Promise<Category> {
  if (!API_URL) {
    throw new Error('API not configured')
  }

  const response = await fetch(`${API_URL}/api/categories`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(category)
  })
  if (!response.ok) {
    throw new Error('Failed to create category')
  }
  return response.json()
}

export async function updateCategory(id: string, updates: Partial<Category>): Promise<Category> {
  if (!API_URL) {
    throw new Error('API not configured')
  }

  const response = await fetch(`${API_URL}/api/categories/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates)
  })
  if (!response.ok) {
    throw new Error('Failed to update category')
  }
  return response.json()
}

export async function deleteCategory(id: string): Promise<void> {
  if (!API_URL) {
    throw new Error('API not configured')
  }

  const response = await fetch(`${API_URL}/api/categories/${id}`, {
    method: 'DELETE'
  })
  if (!response.ok) {
    throw new Error('Failed to delete category')
  }
}
