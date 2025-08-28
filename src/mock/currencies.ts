import { Currency } from '@/types/admin'

export const mockCurrencies: Currency[] = [
  {
    code: 'IDR',
    name: 'Indonesian Rupiah',
    symbol: 'Rp',
    rateToIDR: 1,
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    code: 'USD',
    name: 'US Dollar',
    symbol: '$',
    rateToIDR: 15000,
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    code: 'EUR',
    name: 'Euro',
    symbol: '€',
    rateToIDR: 16500,
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    code: 'SGD',
    name: 'Singapore Dollar',
    symbol: 'S$',
    rateToIDR: 11200,
    updatedAt: '2024-01-01T00:00:00Z'
  }
]

export function getCurrencies(): Promise<Currency[]> {
  return Promise.resolve(mockCurrencies)
}

export function createCurrency(currency: Omit<Currency, 'updatedAt'>): Promise<Currency> {
  const newCurrency: Currency = {
    ...currency,
    updatedAt: new Date().toISOString()
  }
  mockCurrencies.push(newCurrency)
  return Promise.resolve(newCurrency)
}

export function updateCurrency(code: string, updates: Partial<Currency>): Promise<Currency> {
  const index = mockCurrencies.findIndex(c => c.code === code)
  if (index === -1) {
    throw new Error('Currency not found')
  }
  mockCurrencies[index] = { 
    ...mockCurrencies[index], 
    ...updates,
    updatedAt: new Date().toISOString()
  }
  return Promise.resolve(mockCurrencies[index])
}

export function deleteCurrency(code: string): Promise<void> {
  const index = mockCurrencies.findIndex(c => c.code === code)
  if (index === -1) {
    throw new Error('Currency not found')
  }
  if (mockCurrencies[index].code === 'IDR') {
    throw new Error('Cannot delete IDR currency')
  }
  mockCurrencies.splice(index, 1)
  return Promise.resolve()
}
