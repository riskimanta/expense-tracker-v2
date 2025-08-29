import { Account } from '@/types/admin'

// Database-based account service
export class AccountService {
  private static instance: AccountService
  private accounts: Account[] = []

  private constructor() {
    // Initialize with default accounts if database is empty
    this.accounts = [
      {
        id: '1',
        name: 'Cash',
        type: 'cash',
        balance: 2500000,
        icon: '💵'
      },
      {
        id: '2',
        name: 'BCA',
        type: 'bank',
        balance: 8500000,
        icon: '🏦'
      },
      {
        id: '3',
        name: 'OVO',
        type: 'ewallet',
        balance: 1500000,
        icon: '📱'
      },
      {
        id: '4',
        name: 'GoPay',
        type: 'ewallet',
        balance: 800000,
        icon: '📱'
      }
    ]
  }

  public static getInstance(): AccountService {
    if (!AccountService.instance) {
      AccountService.instance = new AccountService()
    }
    return AccountService.instance
  }

  async getAccounts(): Promise<Account[]> {
    try {
      // TODO: Replace with actual database call
      // const response = await fetch('/api/accounts')
      // if (!response.ok) throw new Error('Failed to fetch accounts')
      // return response.json()
      
      // For now, return in-memory data
      return this.accounts
    } catch (error) {
      console.error('Error fetching accounts:', error)
      return this.accounts
    }
  }

  async createAccount(account: Omit<Account, 'id'>): Promise<Account> {
    try {
      const newAccount: Account = {
        ...account,
        id: Date.now().toString()
      }
      
      // TODO: Replace with actual database call
      // const response = await fetch('/api/accounts', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(newAccount)
      // })
      // if (!response.ok) throw new Error('Failed to create account')
      // return response.json()
      
      this.accounts.push(newAccount)
      return newAccount
    } catch (error) {
      console.error('Error creating account:', error)
      throw error
    }
  }

  async updateAccount(id: string, updates: Partial<Account>): Promise<Account> {
    try {
      const index = this.accounts.findIndex(acc => acc.id === id)
      if (index === -1) throw new Error('Account not found')
      
      const updatedAccount = { ...this.accounts[index], ...updates }
      
      // TODO: Replace with actual database call
      // const response = await fetch(`/api/accounts/${id}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(updatedAccount)
      // })
      // if (!response.ok) throw new Error('Failed to update account')
      // return response.json()
      
      this.accounts[index] = updatedAccount
      return updatedAccount
    } catch (error) {
      console.error('Error updating account:', error)
      throw error
    }
  }

  async deleteAccount(id: string): Promise<void> {
    try {
      const index = this.accounts.findIndex(acc => acc.id === id)
      if (index === -1) throw new Error('Account not found')
      
      // TODO: Replace with actual database call
      // const response = await fetch(`/api/accounts/${id}`, {
      //   method: 'DELETE'
      // })
      // if (!response.ok) throw new Error('Failed to delete account')
      
      this.accounts.splice(index, 1)
    } catch (error) {
      console.error('Error deleting account:', error)
      throw error
    }
  }

  async updateAccountBalances(
    fromAccountId: string,
    toAccountId: string,
    amount: number,
    fee: number = 0
  ): Promise<Account[]> {
    try {
      const fromAccount = this.accounts.find(acc => acc.id === fromAccountId)
      const toAccount = this.accounts.find(acc => acc.id === toAccountId)
      
      if (!fromAccount || !toAccount) {
        throw new Error('One or both accounts not found')
      }
      
      // Update balances
      fromAccount.balance = Math.max(0, fromAccount.balance - amount - fee)
      toAccount.balance = toAccount.balance + amount
      
      // Save to database
      await this.updateAccount(fromAccountId, { balance: fromAccount.balance })
      await this.updateAccount(toAccountId, { balance: toAccount.balance })
      
      return this.accounts
    } catch (error) {
      console.error('Error updating account balances:', error)
      throw error
    }
  }

  async resetAccounts(): Promise<void> {
    try {
      // TODO: Replace with actual database call
      // const response = await fetch('/api/accounts/reset', { method: 'POST' })
      // if (!response.ok) throw new Error('Failed to reset accounts')
      
      // For now, just reset in-memory data
      this.accounts = [
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
          icon: '🏦'
        },
        {
          id: '3',
          name: 'OVO',
          type: 'ewallet',
          balance: 1500000,
          icon: '📱'
        },
        {
          id: '4',
          name: 'GoPay',
          type: 'ewallet',
          balance: 800000,
          icon: '📱'
        }
      ]
    } catch (error) {
      console.error('Error resetting accounts:', error)
      throw error
    }
  }
}

export const accountService = AccountService.getInstance()
