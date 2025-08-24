export interface Account {
  id: string
  name: string
  type: string
  balance: number
}

export interface Category {
  id: string
  name: string
  type: 'expense' | 'income'
  color?: string
  icon?: string
}

export interface Transaction {
  id: string
  date: string
  category: string
  amount: number
  note?: string
  isSplit?: boolean
  splitCount?: number
}

export const mockAccounts: Account[] = [
  { id: "1", name: "Cash", type: "cash", balance: 500000 },
  { id: "2", name: "BCA Giro", type: "bank", balance: 8500000 },
  { id: "3", name: "OVO", type: "wallet", balance: 250000 },
]

export const mockCategories: Category[] = [
  { id: "1", name: "Makanan", type: "expense", color: "#F59E0B" },
  { id: "2", name: "Transport", type: "expense", color: "#3B82F6" },
  { id: "3", name: "Belanja", type: "expense", color: "#8B5CF6" },
  { id: "4", name: "Hiburan", type: "expense", color: "#EC4899" },
  { id: "5", name: "Kesehatan", type: "expense", color: "#10B981" },
  { id: "6", name: "Gaji", type: "income", color: "#3B82F6" },
  { id: "7", name: "Investasi", type: "income", color: "#06B6D4" },
]

export const mockTransactions: Transaction[] = [
  {
    id: "1",
    date: "2025-08-18",
    category: "Split x3",
    amount: -300000,
    note: "Belanja bulanan",
    isSplit: true,
    splitCount: 3,
  },
  {
    id: "2",
    date: "2025-08-17",
    category: "Makanan",
    amount: -50000,
    note: "nasi goreng",
  },
  {
    id: "3",
    date: "2025-08-01",
    category: "Gaji",
    amount: 5000000,
    note: "Gaji Agustus",
  },
]

export const mockMonthlySummary = {
  totalIncome: 5000000,
  totalExpenses: 350000,
  remaining: 2790000,
  avgDailySpending: 11667,
  savingsRate: 94.4,
}

// Provider helper functions
export const getMonthlySummary = () => Promise.resolve(mockMonthlySummary)
export const getTransactions = () => Promise.resolve(mockTransactions)
export const getCategories = () => Promise.resolve(mockCategories)
export const getAccounts = () => Promise.resolve(mockAccounts)
