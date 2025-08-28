import { Account } from '@/types/admin'

export const mockAccounts: Account[] = [
  {
    id: '1',
    name: 'Cash',
    type: 'cash',
    balance: 500000
  },
  {
    id: '2',
    name: 'BCA',
    type: 'bank',
    balance: 2500000
  },
  {
    id: '3',
    name: 'GoPay',
    type: 'wallet',
    balance: 150000
  },
  {
    id: '4',
    name: 'Mandiri',
    type: 'bank',
    balance: 1000000
  }
]

export function getAccounts(): Promise<Account[]> {
  return Promise.resolve(mockAccounts)
}

export function createAccount(account: Omit<Account, 'id'>): Promise<Account> {
  const newAccount: Account = {
    ...account,
    id: Date.now().toString()
  }
  mockAccounts.push(newAccount)
  return Promise.resolve(newAccount)
}

export function updateAccount(id: string, updates: Partial<Account>): Promise<Account> {
  const index = mockAccounts.findIndex(a => a.id === id)
  if (index === -1) {
    throw new Error('Account not found')
  }
  mockAccounts[index] = { ...mockAccounts[index], ...updates }
  return Promise.resolve(mockAccounts[index])
}

export function deleteAccount(id: string): Promise<void> {
  const index = mockAccounts.findIndex(a => a.id === id)
  if (index === -1) {
    throw new Error('Account not found')
  }
  mockAccounts.splice(index, 1)
  return Promise.resolve()
}

export const mockAccountOptions = mockAccounts.map((a) => ({
  id: a.id,
  name: a.name,
}))

export const mockCategoryOptions = [
  { id: "food", name: "Makanan & Minuman" },
  { id: "transport", name: "Transportasi" },
  { id: "shopping", name: "Belanja" },
  { id: "entertainment", name: "Hiburan" },
  { id: "health", name: "Kesehatan" },
  { id: "education", name: "Pendidikan" },
  { id: "utilities", name: "Tagihan" },
  { id: "other", name: "Lainnya" },
]

export const mockIncomeSources = [
  { id: "salary", name: "Gaji" },
  { id: "bonus", name: "Bonus" },
  { id: "investment", name: "Investasi" },
  { id: "business", name: "Bisnis" },
  { id: "other", name: "Lainnya" },
]

