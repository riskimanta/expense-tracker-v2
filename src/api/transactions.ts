import { apiGet, apiPost } from './http'
import { mockExpenseTransactions } from '@/mock/expenses'
import { mockIncomeTransactions } from '@/mock/income'
import { mockTransferTransactions } from '@/mock/transfer'

export interface Transaction {
  id: string
  type: 'INCOME' | 'EXPENSE' | 'TRANSFER'
  accountId: string
  categoryId?: string
  amount: number
  currency: string
  rate?: number
  description: string
  date: string
  splits?: TransactionSplit[]
  createdAt: string
  updatedAt: string
}

export interface TransactionSplit {
  id: string
  categoryId: string
  amount: number
  description: string
}

export interface CreateTransactionRequest {
  type: 'INCOME' | 'EXPENSE' | 'TRANSFER'
  accountId: string
  categoryId?: string
  amount: number
  currency: string
  rate?: number
  description: string
  date: string
  splits?: Omit<TransactionSplit, 'id'>[]
}

export interface TransactionFilters {
  type?: 'INCOME' | 'EXPENSE' | 'TRANSFER'
  from?: string
  to?: string
  accountId?: string
  categoryId?: string
}

// GET /api/transactions?type=INCOME|EXPENSE&from=&to=&accountId=
export async function getTransactions(filters: TransactionFilters = {}): Promise<Transaction[]> {
  try {
    const queryParams = new URLSearchParams()
    if (filters.type) queryParams.append('type', filters.type)
    if (filters.from) queryParams.append('from', filters.from)
    if (filters.to) queryParams.append('to', filters.to)
    if (filters.accountId) queryParams.append('accountId', filters.accountId)
    if (filters.categoryId) queryParams.append('categoryId', filters.categoryId)

    const endpoint = `/api/transactions?${queryParams.toString()}`
    const response = await apiGet<Transaction[]>(endpoint)
    return response.data
  } catch (error) {
    console.warn('API call failed, using mock data:', error)
    
    // Filter mock data based on filters
    let allTransactions: Transaction[] = []
    
    if (!filters.type || filters.type === 'EXPENSE') {
      allTransactions.push(...mockExpenseTransactions.map(t => ({
        id: t.id,
        type: 'EXPENSE' as const,
        accountId: t.accountId,
        categoryId: t.category,
        amount: t.amount,
        currency: 'IDR',
        description: t.description,
        date: t.date,
        splits: t.splits?.map(split => ({
          id: split.id,
          categoryId: split.category,
          amount: split.amount,
          description: split.description
        })),
        createdAt: t.date,
        updatedAt: t.date
      })))
    }
    
    if (!filters.type || filters.type === 'INCOME') {
      allTransactions.push(...mockIncomeTransactions.map(t => ({
        id: t.id,
        type: 'INCOME' as const,
        accountId: t.account,
        categoryId: t.source,
        amount: t.amount,
        currency: 'IDR',
        description: t.description,
        date: t.date,
        createdAt: t.date,
        updatedAt: t.date
      })))
    }
    
    if (!filters.type || filters.type === 'TRANSFER') {
      allTransactions.push(      ...mockTransferTransactions.map(t => ({ 
        id: t.id,
        type: 'TRANSFER' as const, 
        accountId: t.fromAccount,
        amount: t.amount,
        currency: 'IDR',
        description: t.description,
        date: t.date,
        createdAt: t.date,
        updatedAt: t.date
      })))
    }
    
    // Apply filters
    if (filters.accountId) {
      allTransactions = allTransactions.filter(t => t.accountId === filters.accountId)
    }
    
    if (filters.categoryId) {
      allTransactions = allTransactions.filter(t => t.categoryId === filters.categoryId)
    }
    
    if (filters.from) {
      allTransactions = allTransactions.filter(t => t.date >= filters.from!)
    }
    
    if (filters.to) {
      allTransactions = allTransactions.filter(t => t.date <= filters.to!)
    }
    
    return allTransactions
  }
}

export async function getTransactionById(id: string): Promise<Transaction | null> {
  try {
    const response = await apiGet<Transaction>(`/api/transactions/${id}`)
    return response.data
  } catch (error) {
    console.warn('API call failed, using mock data:', error)
    
    // Search in all mock data
    const allTransactions = [
      ...mockExpenseTransactions.map(t => ({ 
        id: t.id,
        type: 'EXPENSE' as const, 
        accountId: t.accountId,
        categoryId: t.category,
        amount: t.amount,
        currency: 'IDR',
        description: t.description,
        date: t.date,
        splits: t.splits?.map(split => ({
          id: split.id,
          categoryId: split.category,
          amount: split.amount,
          description: split.description
        })),
        createdAt: t.date,
        updatedAt: t.date
      })),
      ...mockIncomeTransactions.map(t => ({ 
        id: t.id,
        type: 'INCOME' as const, 
        accountId: t.account,
        categoryId: t.source,
        amount: t.amount,
        currency: 'IDR',
        description: t.description,
        date: t.date,
        createdAt: t.date,
        updatedAt: t.date
      })),
      ...mockTransferTransactions.map(t => ({ 
        id: t.id,
        type: 'TRANSFER' as const, 
        accountId: t.fromAccount,
        amount: t.amount,
        currency: 'IDR',
        description: t.description,
        date: t.date,
        createdAt: t.date,
        updatedAt: t.date
      }))
    ]
    
    const transaction = allTransactions.find(t => t.id === id)
    if (!transaction) return null
    
    return {
      ...transaction,
      createdAt: transaction.date,
      updatedAt: transaction.date
    }
  }
}

// POST /api/transactions (body {type, accountId, categoryId?, amount, currency?, rate?, description, date, splits?[]})
export async function createTransaction(data: CreateTransactionRequest): Promise<Transaction> {
  try {
    const response = await apiPost<Transaction>('/api/transactions', data)
    return response.data
  } catch (error) {
    console.warn('API call failed, creating mock transaction:', error)
    
    // Create mock transaction
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      ...data,
      splits: data.splits?.map((split, index) => ({
        id: `${Date.now()}-split-${index}`,
        categoryId: split.categoryId,
        amount: split.amount,
        description: split.description
      })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    
    return newTransaction
  }
}

export async function updateTransaction(id: string, data: Partial<CreateTransactionRequest>): Promise<Transaction> {
  try {
    const response = await apiPost<Transaction>(`/api/transactions/${id}`, data)
    return response.data
  } catch (error) {
    console.warn('API call failed, updating mock transaction:', error)
    throw new Error('Update not implemented in mock mode')
  }
}

export async function deleteTransaction(id: string): Promise<boolean> {
  try {
    await apiGet(`/api/transactions/${id}/delete`)
    return true
  } catch (error) {
    console.warn('API call failed, deleting mock transaction:', error)
    throw new Error('Delete not implemented in mock mode')
  }
}
