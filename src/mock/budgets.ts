import { BudgetRule } from '@/types/admin'

export const mockBudgetRules: BudgetRule[] = [
  {
    id: '1',
    userId: '1',
    needs: 50,
    wants: 25,
    savings: 15,
    invest: 5,
    coins: 5,
    updatedAt: '2024-01-01T00:00:00Z'
  }
]

export function getBudgetRule(userId: string): Promise<BudgetRule | null> {
  const rule = mockBudgetRules.find(r => r.userId === userId)
  return Promise.resolve(rule || null)
}

export function updateBudgetRule(userId: string, updates: Partial<BudgetRule>): Promise<BudgetRule> {
  const index = mockBudgetRules.findIndex(r => r.userId === userId)
  if (index === -1) {
    // Create new rule if doesn't exist
    const newRule: BudgetRule = {
      id: Date.now().toString(),
      userId,
      needs: 50,
      wants: 25,
      savings: 15,
      invest: 5,
      coins: 5,
      updatedAt: new Date().toISOString(),
      ...updates
    }
    mockBudgetRules.push(newRule)
    return Promise.resolve(newRule)
  }
  
  mockBudgetRules[index] = { 
    ...mockBudgetRules[index], 
    ...updates,
    updatedAt: new Date().toISOString()
  }
  return Promise.resolve(mockBudgetRules[index])
}
