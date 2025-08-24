import type { Account } from '@/api/accounts'

export const mockAccounts: Account[] = [
  {
    id: '1',
    name: 'Cash',
    type: 'cash',
    balance: 2500000,
    currency: 'IDR',
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z'
  },
  {
    id: '2',
    name: 'BCA',
    type: 'bank',
    balance: 8500000,
    currency: 'IDR',
    accountNumber: '1234567890',
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z'
  },
  {
    id: '3',
    name: 'OVO',
    type: 'ewallet',
    balance: 1500000,
    currency: 'IDR',
    accountNumber: '08123456789',
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z'
  },
  {
    id: '4',
    name: 'GoPay',
    type: 'ewallet',
    balance: 800000,
    currency: 'IDR',
    accountNumber: '08123456789',
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z'
  }
]

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

