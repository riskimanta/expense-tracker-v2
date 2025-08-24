import { formatIDR } from '@/lib/format'

export interface ExpenseTransaction {
  id: string
  date: string
  category: string
  amount: number
  description: string
  accountId: string
  accountName: string
  splitCount?: number
  splits?: Array<{
    id: string
    category: string
    amount: number
    description: string
  }>
}

export interface ExpenseCategory {
  id: string
  name: string
  color: string
  budget: number
  spent: number
}

export const mockExpenseCategories: ExpenseCategory[] = [
  { id: '1', name: 'Makanan & Minuman', color: 'var(--needs)', budget: 2000000, spent: 1800000 },
  { id: '2', name: 'Transportasi', color: 'var(--needs)', budget: 800000, spent: 750000 },
  { id: '3', name: 'Belanja', color: 'var(--wants)', budget: 1000000, spent: 1200000 },
  { id: '4', name: 'Hiburan', color: 'var(--wants)', budget: 500000, spent: 300000 },
  { id: '5', name: 'Tagihan', color: 'var(--needs)', budget: 1500000, spent: 1500000 },
  { id: '6', name: 'Kesehatan', color: 'var(--needs)', budget: 300000, spent: 250000 },
  { id: '7', name: 'Investasi', color: 'var(--invest)', budget: 2000000, spent: 2000000 },
  { id: '8', name: 'Tabungan', color: 'var(--savings)', budget: 1000000, spent: 800000 },
]

export const mockExpenseTransactions: ExpenseTransaction[] = [
  {
    id: '1',
    date: '2025-01-18',
    category: 'Makanan & Minuman',
    amount: 300000,
    description: 'Belanja bulanan - split dengan keluarga',
    accountId: '1',
    accountName: 'Cash',
    splitCount: 3,
    splits: [
      { id: '1a', category: 'Makanan & Minuman', amount: 100000, description: 'Beras, sayur, daging' },
      { id: '1b', category: 'Makanan & Minuman', amount: 100000, description: 'Bumbu, minyak, gula' },
      { id: '1c', category: 'Makanan & Minuman', amount: 100000, description: 'Snack, minuman' }
    ]
  },
  {
    id: '2',
    date: '2025-01-17',
    category: 'Makanan & Minuman',
    amount: 50000,
    description: 'Nasi goreng + es teh',
    accountId: '2',
    accountName: 'BCA',
    splitCount: 1
  },
  {
    id: '3',
    date: '2025-01-16',
    category: 'Transportasi',
    amount: 25000,
    description: 'GoJek ke kantor',
    accountId: '3',
    accountName: 'OVO',
    splitCount: 1
  },
  {
    id: '4',
    date: '2025-01-15',
    category: 'Belanja',
    amount: 150000,
    description: 'Baju baru untuk kerja',
    accountId: '2',
    accountName: 'BCA',
    splitCount: 1
  },
  {
    id: '5',
    date: '2025-01-14',
    category: 'Tagihan',
    amount: 500000,
    description: 'Listrik bulan Januari',
    accountId: '2',
    accountName: 'BCA',
    splitCount: 1
  }
]

export const mockExpenseKPIs = {
  totalSpent: 1025000,
  monthlyBudget: 5000000,
  remainingBudget: 3975000,
  topCategory: 'Makanan & Minuman',
  topCategoryAmount: 350000,
  averageDaily: 68200,
  daysRemaining: 13
}

export const mockBudgetAllocation = [
  { name: 'Needs', value: 50, color: 'var(--needs)' },
  { name: 'Wants', value: 25, color: 'var(--wants)' },
  { name: 'Savings', value: 5, color: 'var(--savings)' },
  { name: 'Invest', value: 15, color: 'var(--invest)' },
  { name: 'Coins', value: 5, color: 'var(--coins)' }
]

export const mockMonthlyExpenses = [
  { month: 'Jan', amount: 1025000 },
  { month: 'Feb', amount: 950000 },
  { month: 'Mar', amount: 1100000 },
  { month: 'Apr', amount: 980000 },
  { month: 'May', amount: 1050000 },
  { month: 'Jun', amount: 920000 },
  { month: 'Jul', amount: 1080000 },
  { month: 'Aug', amount: 970000 },
  { month: 'Sep', amount: 1030000 },
  { month: 'Oct', amount: 940000 },
  { month: 'Nov', amount: 1060000 },
  { month: 'Dec', amount: 960000 }
]
