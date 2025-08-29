import { Currency } from '@/types/admin'

export async function getCurrencies(): Promise<Currency[]> {
  try {
    const response = await fetch('/api/currencies')
    if (!response.ok) {
      throw new Error('Failed to fetch currencies')
    }
    return response.json()
  } catch (error) {
    console.error('Failed to fetch currencies:', error)
    throw new Error('Failed to fetch currencies from database')
  }
}

export async function createCurrency(currency: Omit<Currency, 'updatedAt'>): Promise<Currency> {
  try {
    const response = await fetch('/api/currencies', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(currency)
    })
    if (!response.ok) {
      throw new Error('Failed to create currency')
    }
    return response.json()
  } catch (error) {
    console.error('Failed to create currency:', error)
    throw new Error('Failed to create currency in database')
  }
}

export async function updateCurrency(code: string, updates: Partial<Currency>): Promise<Currency> {
  try {
    const response = await fetch(`/api/currencies/${code}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    })
    if (!response.ok) {
      throw new Error('Failed to update currency')
    }
    return response.json()
  } catch (error) {
    console.error('Failed to update currency:', error)
    throw new Error('Failed to update currency in database')
  }
}

export async function deleteCurrency(code: string): Promise<void> {
  try {
    const response = await fetch(`/api/currencies/${code}`, {
      method: 'DELETE'
    })
    if (!response.ok) {
      throw new Error('Failed to delete currency')
    }
  } catch (error) {
    console.error('Failed to delete currency:', error)
    throw new Error('Failed to delete currency from database')
  }
}
