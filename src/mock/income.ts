import { formatIDR } from '@/lib/format'

export interface IncomeTransaction {
  id: string
  date: string
  account: string
  source: string
  amount: number
  description: string
  category: string
}

export interface IncomeSource {
  id: string
  name: string
  type: 'salary' | 'bonus' | 'business' | 'investment' | 'other'
  color: string
}

export const mockIncomeSources: IncomeSource[] = [
  { id: '1', name: 'Gaji Pokok', type: 'salary', color: 'var(--success)' },
  { id: '2', name: 'Bonus', type: 'bonus', color: 'var(--warning)' },
  { id: '3', name: 'Bisnis', type: 'business', color: 'var(--primary)' },
  { id: '4', name: 'Investasi', type: 'investment', color: 'var(--invest)' },
  { id: '5', name: 'Lainnya', type: 'other', color: 'var(--txt-med)' }
]

export const mockIncomeTransactions: IncomeTransaction[] = [
  {
    id: '1',
    date: '2025-01-18',
    account: 'BCA',
    source: 'Gaji Pokok',
    amount: 8000000,
    description: 'Gaji Januari 2025',
    category: 'salary'
  },
  {
    id: '2',
    date: '2025-01-16',
    account: 'BCA',
    source: 'Bonus',
    amount: 2000000,
    description: 'Bonus project Q4 2024',
    category: 'bonus'
  },
  {
    id: '3',
    date: '2025-01-15',
    account: 'Cash',
    source: 'Bisnis',
    amount: 1500000,
    description: 'Pendapatan freelance',
    category: 'business'
  },
  {
    id: '4',
    date: '2025-01-10',
    account: 'BCA',
    source: 'Investasi',
    amount: 500000,
    description: 'Dividen reksadana',
    category: 'investment'
  },
  {
    id: '5',
    date: '2025-01-05',
    account: 'OVO',
    source: 'Lainnya',
    amount: 100000,
    description: 'Cashback belanja online',
    category: 'other'
  }
]

export const mockIncomeKPIs = {
  totalIncome: 12100000,
  monthlyTarget: 10000000,
  averageDaily: 403333,
  topSource: 'Gaji Pokok',
  topSourceAmount: 8000000,
  daysRemaining: 13
}
