export interface Account {
  id: string
  name: string
  type: 'cash' | 'bank' | 'ewallet'
  balance: number
  currency: string
  icon: string
  accountNumber?: string
}

const STORAGE_KEY = 'expense-tracker-accounts'

// Get initial accounts data
const getInitialAccounts = (): Account[] => [
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
    icon: '🏦',
    accountNumber: '1234567890'
  },
  {
    id: '3',
    name: 'OVO',
    type: 'ewallet',
    balance: 1500000,
    currency: 'IDR',
    icon: '📱',
    accountNumber: '08123456789'
  },
  {
    id: '4',
    name: 'GoPay',
    type: 'ewallet',
    balance: 800000,
    currency: 'IDR',
    icon: '📱',
    accountNumber: '08123456789'
  }
]

// Get accounts from localStorage or return initial data
export const getAccounts = (): Account[] => {
  if (typeof window === 'undefined') return getInitialAccounts()
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.error('Error reading accounts from localStorage:', error)
  }
  
  return getInitialAccounts()
}

// Save accounts to localStorage
export const saveAccounts = (accounts: Account[]): void => {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts))
  } catch (error) {
    console.error('Error saving accounts to localStorage:', error)
  }
}

// Update account balance after transfer
export const updateAccountBalances = (
  fromAccountId: string,
  toAccountId: string,
  amount: number,
  fee: number = 0
): Account[] => {
  const accounts = getAccounts()
  
  const updatedAccounts = accounts.map(account => {
    if (account.id === fromAccountId) {
      // Decrease balance from source account (amount + fee)
      return {
        ...account,
        balance: Math.max(0, account.balance - amount - fee) // Prevent negative balance
      }
    } else if (account.id === toAccountId) {
      // Increase balance in destination account (amount only)
      return {
        ...account,
        balance: account.balance + amount
      }
    }
    return account
  })
  
  saveAccounts(updatedAccounts)
  return updatedAccounts
}

// Reset accounts to initial state
export const resetAccounts = (): void => {
  saveAccounts(getInitialAccounts())
}
