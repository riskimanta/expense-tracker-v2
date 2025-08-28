import { formatIDR } from '@/lib/format'

export interface DashboardKPI {
  label: string
  value: string
  change: string
  changeType: 'increase' | 'decrease' | 'neutral'
  icon: string
}

export interface AccountBalance {
  id: string
  name: string
  type: 'cash' | 'bank' | 'ewallet'
  balance: number
  currency: string
  icon: string
}

export interface RecentTransaction {
  id: string
  date: string
  description: string
  amount: number
  type: 'income' | 'expense' | 'transfer'
  account: string
  category?: string
}

export interface BudgetCompliance {
  category: string
  target: number
  actual: number
  percentage: number
  status: 'on-track' | 'over-budget' | 'under-budget'
}

export const mockDashboardKPIs: DashboardKPI[] = [
  {
    label: 'Sisa Aman',
    value: formatIDR(2500000),
    change: '+15% dari bulan lalu',
    changeType: 'increase',
    icon: '💰'
  },
  {
    label: 'Pemasukan Bulan Ini',
    value: formatIDR(8000000),
    change: '+8% dari bulan lalu',
    changeType: 'increase',
    icon: '📈'
  },
  {
    label: 'Pengeluaran Bulan Ini',
    value: formatIDR(5500000),
    change: '-5% dari bulan lalu',
    changeType: 'decrease',
    icon: '📉'
  },
  {
    label: 'Saldo Akhir',
    value: formatIDR(15000000),
    change: '+12% dari bulan lalu',
    changeType: 'increase',
    icon: '🏦'
  }
]

export const mockAccountBalances: AccountBalance[] = [
  {
    id: '1',
    name: 'Cash',
    type: 'cash',
    balance: 2500000,
    currency: 'IDR',
    icon: '💵'
  },
  {
    id: '2',
    name: 'BCA',
    type: 'bank',
    balance: 8500000,
    currency: 'IDR',
    icon: '🏦'
  },
  {
    id: '3',
    name: 'OVO',
    type: 'ewallet',
    balance: 1500000,
    currency: 'IDR',
    icon: '📱'
  },
  {
    id: '4',
    name: 'GoPay',
    type: 'ewallet',
    balance: 800000,
    currency: 'IDR',
    icon: '📱'
  }
]

export const mockRecentTransactions: RecentTransaction[] = [
  {
    id: '1',
    date: '2025-01-18',
    description: 'Gaji Januari',
    amount: 8000000,
    type: 'income',
    account: 'BCA'
  },
  {
    id: '2',
    date: '2025-01-18',
    description: 'Belanja bulanan',
    amount: -300000,
    type: 'expense',
    account: 'Cash',
    category: 'Makanan & Minuman'
  },
  {
    id: '3',
    date: '2025-01-17',
    description: 'Transfer ke tabungan',
    amount: -1000000,
    type: 'transfer',
    account: 'BCA'
  },
  {
    id: '4',
    date: '2025-01-16',
    description: 'Bonus project',
    amount: 2000000,
    type: 'income',
    account: 'BCA'
  },
  {
    id: '5',
    date: '2025-01-15',
    description: 'Baju kerja',
    amount: -150000,
    type: 'expense',
    account: 'BCA',
    category: 'Belanja'
  }
]

export const mockBudgetCompliance: BudgetCompliance[] = [
  {
    category: 'Needs (50%)',
    target: 50,
    actual: 48,
    percentage: 96,
    status: 'on-track'
  },
  {
    category: 'Wants (25%)',
    target: 25,
    actual: 28,
    percentage: 112,
    status: 'over-budget'
  },
  {
    category: 'Savings (5%)',
    target: 5,
    actual: 6,
    percentage: 120,
    status: 'under-budget'
  },
  {
    category: 'Invest (15%)',
    target: 15,
    actual: 14,
    percentage: 93,
    status: 'on-track'
  },
  {
    category: 'Coins (5%)',
    target: 5,
    actual: 4,
    percentage: 80,
    status: 'on-track'
  }
]

export const mockCashFlowData = [
  { date: '01/01', income: 5000000, expense: 1200000 },
  { date: '02/01', income: 0, expense: 850000 },
  { date: '03/01', income: 0, expense: 950000 },
  { date: '04/01', income: 0, expense: 1100000 },
  { date: '05/01', income: 0, expense: 780000 },
  { date: '06/01', income: 0, expense: 920000 },
  { date: '07/01', income: 0, expense: 1350000 },
  { date: '08/01', income: 0, expense: 880000 },
  { date: '09/01', income: 0, expense: 1120000 },
  { date: '10/01', income: 0, expense: 690000 },
  { date: '11/01', income: 0, expense: 840000 },
  { date: '12/01', income: 0, expense: 1010000 },
  { date: '13/01', income: 0, expense: 770000 },
  { date: '14/01', income: 0, expense: 1500000 },
  { date: '15/01', income: 0, expense: 650000 },
  { date: '16/01', income: 2000000, expense: 125000 },
  { date: '17/01', income: 0, expense: 450000 },
  { date: '18/01', income: 0, expense: 1000000 }
]

export const mockCategoryExpenses = [
  { name: 'Makanan & Minuman', value: 35, color: 'var(--needs)' },
  { name: 'Transportasi', value: 20, color: 'var(--needs)' },
  { name: 'Belanja', value: 15, color: 'var(--wants)' },
  { name: 'Tagihan', value: 12, color: 'var(--needs)' },
  { name: 'Hiburan', value: 8, color: 'var(--wants)' },
  { name: 'Kesehatan', value: 5, color: 'var(--needs)' },
  { name: 'Lainnya', value: 5, color: 'var(--txt-med)' }
]

export const mockAdvisorResult = {
  canAfford: true,
  message: 'Aman! Kamu bisa beli ini.',
  reason: 'Sisa aman bulan ini: Rp 2.500.000',
  recommendation: 'Beli sekarang atau tunggu promo',
  safeDate: '2025-01-20'
}
