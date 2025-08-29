export type User = {
  id: string
  name: string
  email: string
  role: 'admin' | 'user'
  status: 'active' | 'inactive'
  createdAt: string
}

export type Category = {
  id: string
  name: string
  type: 'expense' | 'income'
  color?: string
  icon?: string
  isDefault?: boolean
  userId?: string
}

export type Account = {
  id: string
  name: string
  type: 'cash' | 'bank' | 'ewallet'
  balance: number
  icon?: string
  currency?: string
  accountNumber?: string
}

export type BudgetRule = {
  id: string
  userId: string
  needs: number
  wants: number
  savings: number
  invest: number
  coins: number
  updatedAt: string
}

export type Currency = {
  code: string
  name: string
  symbol: string
  rateToIDR: number
  updatedAt: string
}

export type AdminSettings = {
  safeToSpendBuffer: number
  monthStartDate: number
  showDecimals: boolean
}
