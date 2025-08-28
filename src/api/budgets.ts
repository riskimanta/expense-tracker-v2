import { BudgetRule } from '@/types/admin'
import * as mockBudgets from '@/mock/budgets'

const API_URL = process.env.NEXT_PUBLIC_API_URL

export async function getBudgetRule(userId: string): Promise<BudgetRule | null> {
  if (!API_URL) {
    return mockBudgets.getBudgetRule(userId)
  }

  const response = await fetch(`${API_URL}/api/budgets/${userId}`)
  if (!response.ok) {
    if (response.status === 404) {
      return null
    }
    throw new Error('Failed to fetch budget rule')
  }
  return response.json()
}

export async function updateBudgetRule(userId: string, updates: Partial<BudgetRule>): Promise<BudgetRule> {
  if (!API_URL) {
    return mockBudgets.updateBudgetRule(userId, updates)
  }

  const response = await fetch(`${API_URL}/api/budgets/${userId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates)
  })
  if (!response.ok) {
    throw new Error('Failed to update budget rule')
  }
  return response.json()
}
