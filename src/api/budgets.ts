import { BudgetRule } from '@/types/admin'

export async function getBudgetRules(): Promise<BudgetRule[]> {
  try {
    const response = await fetch('/api/budgets')
    if (!response.ok) {
      throw new Error('Failed to fetch budget rules')
    }
    return response.json()
  } catch (error) {
    console.error('Failed to fetch budget rules:', error)
    throw new Error('Failed to fetch budget rules from database')
  }
}

export async function getBudgetRule(userId: string): Promise<BudgetRule | null> {
  try {
    const response = await fetch(`/api/budgets/${userId}`)
    if (!response.ok) {
      if (response.status === 404) {
        return null
      }
      throw new Error('Failed to fetch budget rule')
    }
    return response.json()
  } catch (error) {
    console.error('Failed to fetch budget rule:', error)
    throw new Error('Failed to fetch budget rule from database')
  }
}

export async function updateBudgetRule(userId: string, updates: Partial<BudgetRule>): Promise<BudgetRule> {
  try {
    const response = await fetch(`/api/budgets/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    })
    if (!response.ok) {
      throw new Error('Failed to update budget rule')
    }
    return response.json()
  } catch (error) {
    console.error('Failed to update budget rule:', error)
    throw new Error('Failed to update budget rule in database')
  }
}
