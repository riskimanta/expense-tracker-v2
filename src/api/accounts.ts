import { apiGet, apiPost, apiPut, apiDelete, apiCallWithMock } from './http'
import { mockAccounts } from '@/mock/accounts'

export interface Account {
  id: string
  name: string
  type: 'cash' | 'bank' | 'ewallet'
  balance: number
  currency: string
  accountNumber?: string
  createdAt: string
  updatedAt: string
}

export interface CreateAccountRequest {
  name: string
  type: 'cash' | 'bank' | 'ewallet'
  balance: number
  currency: string
  accountNumber?: string
}

export interface UpdateAccountRequest {
  name?: string
  type?: 'cash' | 'bank' | 'ewallet'
  balance?: number
  currency?: string
  accountNumber?: string
}

// GET /api/accounts → [{id,name,type,balance}]
export async function getAccounts(): Promise<Account[]> {
  return apiCallWithMock(
    () => apiGet<Account[]>('/api/accounts'),
    mockAccounts
  )
}

export async function getAccountById(id: string): Promise<Account | null> {
  try {
    const response = await apiGet<Account>(`/api/accounts/${id}`)
    return response.data
  } catch (error) {
    console.warn('API call failed, using mock data:', error)
    return mockAccounts.find(account => account.id === id) || null
  }
}

export async function createAccount(data: CreateAccountRequest): Promise<Account> {
  try {
    const response = await apiPost<Account>('/api/accounts', data)
    return response.data
  } catch (error) {
    console.warn('API call failed, creating mock account:', error)
    // Create mock account
    const newAccount: Account = {
      id: Date.now().toString(),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    return newAccount
  }
}

export async function updateAccount(id: string, data: UpdateAccountRequest): Promise<Account> {
  try {
    const response = await apiPut<Account>(`/api/accounts/${id}`, data)
    return response.data
  } catch (error) {
    console.warn('API call failed, updating mock account:', error)
    // Update mock account
    const accountIndex = mockAccounts.findIndex(account => account.id === id)
    if (accountIndex !== -1) {
      mockAccounts[accountIndex] = {
        ...mockAccounts[accountIndex],
        ...data,
        updatedAt: new Date().toISOString(),
      }
      return mockAccounts[accountIndex]
    }
    throw new Error('Account not found')
  }
}

export async function deleteAccount(id: string): Promise<boolean> {
  try {
    await apiDelete(`/api/accounts/${id}`)
    return true
  } catch (error) {
    console.warn('API call failed, deleting mock account:', error)
    // Delete mock account
    const accountIndex = mockAccounts.findIndex(account => account.id === id)
    if (accountIndex !== -1) {
      mockAccounts.splice(accountIndex, 1)
      return true
    }
    return false
  }
}
