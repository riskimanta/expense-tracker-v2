import { Currency } from '@/types/admin'
import * as mockCurrencies from '@/mock/currencies'

const API_URL = process.env.NEXT_PUBLIC_API_URL

export async function getCurrencies(): Promise<Currency[]> {
  if (!API_URL) {
    return mockCurrencies.getCurrencies()
  }

  const response = await fetch(`${API_URL}/api/currencies`)
  if (!response.ok) {
    throw new Error('Failed to fetch currencies')
  }
  return response.json()
}

export async function createCurrency(currency: Omit<Currency, 'updatedAt'>): Promise<Currency> {
  if (!API_URL) {
    return mockCurrencies.createCurrency(currency)
  }

  const response = await fetch(`${API_URL}/api/currencies`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(currency)
  })
  if (!response.ok) {
    throw new Error('Failed to create currency')
  }
  return response.json()
}

export async function updateCurrency(code: string, updates: Partial<Currency>): Promise<Currency> {
  if (!API_URL) {
    return mockCurrencies.updateCurrency(code, updates)
  }

  const response = await fetch(`${API_URL}/api/currencies/${code}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates)
  })
  if (!response.ok) {
    throw new Error('Failed to update currency')
  }
  return response.json()
}

export async function deleteCurrency(code: string): Promise<void> {
  if (!API_URL) {
    return mockCurrencies.deleteCurrency(code)
  }

  const response = await fetch(`${API_URL}/api/currencies/${code}`, {
    method: 'DELETE'
  })
  if (!response.ok) {
    throw new Error('Failed to delete currency')
  }
}
