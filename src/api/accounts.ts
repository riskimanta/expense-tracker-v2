import { Account } from '@/types/admin'
import * as mockAccounts from '@/mock/accounts'

const API_URL = process.env.NEXT_PUBLIC_API_URL

export async function getAccounts(): Promise<Account[]> {
  if (!API_URL) {
    return mockAccounts.getAccounts()
  }

  const response = await fetch(`${API_URL}/api/accounts`)
  if (!response.ok) {
    throw new Error('Failed to fetch accounts')
  }
  return response.json()
}

export async function createAccount(account: Omit<Account, 'id'>): Promise<Account> {
  if (!API_URL) {
    return mockAccounts.createAccount(account)
  }

  const response = await fetch(`${API_URL}/api/accounts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(account)
  })
  if (!response.ok) {
    throw new Error('Failed to create account')
  }
  return response.json()
}

export async function updateAccount(id: string, updates: Partial<Account>): Promise<Account> {
  if (!API_URL) {
    return mockAccounts.updateAccount(id, updates)
  }

  const response = await fetch(`${API_URL}/api/accounts/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates)
  })
  if (!response.ok) {
    throw new Error('Failed to update account')
  }
  return response.json()
}

export async function deleteAccount(id: string): Promise<void> {
  if (!API_URL) {
    return mockAccounts.deleteAccount(id)
  }

  const response = await fetch(`${API_URL}/api/accounts/${id}`, {
    method: 'DELETE'
  })
  if (!response.ok) {
    throw new Error('Failed to delete account')
  }
}
