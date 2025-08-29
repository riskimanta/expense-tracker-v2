import { BudgetRule } from '@/types/admin'
// Mock data moved inline
const mockBudgets = {
  getBudgetRules: () => [
    {
      id: '1',
      userId: '1',
      needs: 50,
      wants: 25,
      savings: 15,
      invest: 5,
      coins: 5,
      updatedAt: '2024-01-01'
    }
  ],
  getBudgetRule: (userId: string) => ({
    id: '1',
    userId: '1',
    needs: 50,
    wants: 25,
    savings: 15,
    invest: 5,
    coins: 5,
    updatedAt: '2024-01-01'
  }),
  updateBudgetRule: (userId: string, updates: Partial<BudgetRule>) => ({
    id: '1',
    userId: '1',
    needs: 50,
    wants: 25,
    savings: 15,
    invest: 5,
    coins: 5,
    updatedAt: '2024-01-01',
    ...updates
  })
}

const API_URL = process.env.NEXT_PUBLIC_API_URL

export async function getBudgetRules(): Promise<BudgetRule[]> {
  if (!API_URL) {
    return mockBudgets.getBudgetRules()
  }

  try {
    const response = await fetch(`${API_URL}/api/budgets`)
    if (!response.ok) {
      throw new Error('Failed to fetch budget rules')
    }
    return response.json()
  } catch (error) {
    console.warn('API call failed, falling back to mock data:', error)
    return mockBudgets.getBudgetRules()
  }
}

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
