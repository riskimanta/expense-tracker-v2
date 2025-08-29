import { AccountType } from '@/types/admin'

const API_URL = process.env.NEXT_PUBLIC_API_URL

// GET /api/account-types - Fetch all account types
export async function getAccountTypes(): Promise<AccountType[]> {
  if (!API_URL) {
    // Fallback to mock data if no API URL
    return [
      { id: 1, name: 'Cash', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
      { id: 2, name: 'Bank', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
      { id: 3, name: 'E-Wallet', created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
    ]
  }

  try {
    const response = await fetch(`${API_URL}/api/account-types`)
    if (!response.ok) {
      throw new Error(`Failed to fetch account types: ${response.status}`)
    }
    return response.json()
  } catch (error) {
    console.error('Error fetching account types:', error)
    throw error
  }
}

// POST /api/account-types - Create new account type
export async function createAccountType(data: Omit<AccountType, 'id' | 'created_at' | 'updated_at'>): Promise<{ id: number; message: string }> {
  if (!API_URL) {
    throw new Error('API URL not configured')
  }

  try {
    const response = await fetch(`${API_URL}/api/account-types`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `Failed to create account type: ${response.status}`)
    }

    return response.json()
  } catch (error) {
    console.error('Error creating account type:', error)
    throw error
  }
}

// PUT /api/account-types/[id] - Update account type
export async function updateAccountType(id: number, updates: Partial<AccountType>): Promise<{ message: string }> {
  if (!API_URL) {
    throw new Error('API URL not configured')
  }

  try {
    const response = await fetch(`${API_URL}/api/account-types/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `Failed to update account type: ${response.status}`)
    }

    return response.json()
  } catch (error) {
    console.error('Error updating account type:', error)
    throw error
  }
}

// DELETE /api/account-types/[id] - Delete account type
export async function deleteAccountType(id: number): Promise<{ message: string }> {
  if (!API_URL) {
    throw new Error('API URL not configured')
  }

  try {
    const response = await fetch(`${API_URL}/api/account-types/${id}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `Failed to delete account type: ${response.status}`)
    }

    return response.json()
  } catch (error) {
    console.error('Error deleting account type:', error)
    throw error
  }
}
