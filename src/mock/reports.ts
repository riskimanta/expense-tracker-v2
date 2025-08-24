export interface MonthlyKPI {
  totalIncome: number
  totalExpense: number
  netIncome: number
  savingsRate: number
  topCategory: string
  topCategoryAmount: number
}

export interface CategoryBreakdown {
  category: string
  amount: number
  percentage: number
  color: string
}

export interface MonthlyData {
  month: string
  income: number
  expense: number
  net: number
}

export const mockMonthlyKPI: MonthlyKPI = {
  totalIncome: 8500000,
  totalExpense: 5200000,
  netIncome: 3300000,
  savingsRate: 38.8,
  topCategory: 'Makanan & Minuman',
  topCategoryAmount: 1800000
}

export const mockCategoryBreakdown: CategoryBreakdown[] = [
  {
    category: 'Makanan & Minuman',
    amount: 1800000,
    percentage: 34.6,
    color: 'var(--needs)'
  },
  {
    category: 'Transportasi',
    amount: 1200000,
    percentage: 23.1,
    color: 'var(--wants)'
  },
  {
    category: 'Belanja',
    amount: 800000,
    percentage: 15.4,
    color: 'var(--wants)'
  },
  {
    category: 'Tagihan',
    amount: 600000,
    percentage: 11.5,
    color: 'var(--needs)'
  },
  {
    category: 'Hiburan',
    amount: 400000,
    percentage: 7.7,
    color: 'var(--wants)'
  },
  {
    category: 'Lainnya',
    amount: 400000,
    percentage: 7.7,
    color: 'var(--coins)'
  }
]

export const mockMonthlyData: MonthlyData[] = [
  { month: 'Jan', income: 7500000, expense: 4800000, net: 2700000 },
  { month: 'Feb', income: 8000000, expense: 5200000, net: 2800000 },
  { month: 'Mar', income: 7800000, expense: 4900000, net: 2900000 },
  { month: 'Apr', income: 8200000, expense: 5100000, net: 3100000 },
  { month: 'Mei', income: 7900000, expense: 5300000, net: 2600000 },
  { month: 'Jun', income: 8100000, expense: 5000000, net: 3100000 },
  { month: 'Jul', income: 8300000, expense: 5400000, net: 2900000 },
  { month: 'Ags', income: 8500000, expense: 5200000, net: 3300000 },
  { month: 'Sep', income: 8200000, expense: 5100000, net: 3100000 },
  { month: 'Okt', income: 8400000, expense: 5300000, net: 3100000 },
  { month: 'Nov', income: 8000000, expense: 5200000, net: 2800000 },
  { month: 'Des', income: 8600000, expense: 5500000, net: 3100000 }
]

export const mockBudgetData = {
  needs: 50,
  wants: 25,
  savings: 5,
  invest: 15,
  coins: 5,
}

