import { Account } from '@/types/admin'
import { accountService } from '@/lib/accountService'

const API_URL = process.env.NEXT_PUBLIC_API_URL

export async function getAccounts(): Promise<Account[]> {
  if (!API_URL) {
    return accountService.getAccounts()
  }

  const response = await fetch(`${API_URL}/api/accounts`)
  if (!response.ok) {
    throw new Error('Failed to fetch accounts')
  }
  return response.json()
}

export async function createAccount(account: Omit<Account, 'id'>): Promise<Account> {
  if (!API_URL) {
    return accountService.createAccount(account)
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
    return accountService.updateAccount(id, updates)
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

export async function deleteAccount(id: string, force: boolean = false): Promise<{ success: boolean; message: string }> {
  if (!API_URL) {
    await accountService.deleteAccount(id)
    return { success: true, message: 'Account deleted successfully' }
  }

  const response = await fetch(`${API_URL}/api/accounts/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ force })
  })
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error || 'Failed to delete account')
  }
  
  return response.json()
}
