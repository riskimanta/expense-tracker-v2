import { Currency } from '@/types/admin'
// Mock data moved inline
const mockCurrencies = {
  getCurrencies: () => [
    { code: 'IDR', name: 'Indonesian Rupiah', symbol: 'Rp', rateToIDR: 1, updatedAt: '2024-01-01' },
    { code: 'USD', name: 'US Dollar', symbol: '$', rateToIDR: 15000, updatedAt: '2024-01-01' },
    { code: 'EUR', name: 'Euro', symbol: '€', rateToIDR: 16500, updatedAt: '2024-01-01' }
  ]
}

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
