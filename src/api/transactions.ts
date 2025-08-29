import { apiGet, apiPost } from './http'

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
    console.error('Failed to fetch transactions:', error)
    throw new Error('Failed to fetch transactions from database')
  }
}

export async function getTransactionById(id: string): Promise<Transaction | null> {
  try {
    const response = await apiGet<Transaction>(`/api/transactions/${id}`)
    return response.data
  } catch (error) {
    console.error('Failed to fetch transaction:', error)
    throw new Error('Failed to fetch transaction from database')
  }
}

export async function createTransaction(data: CreateTransactionRequest): Promise<Transaction> {
  try {
    const response = await apiPost<Transaction>('/api/transactions', data)
    return response.data
  } catch (error) {
    console.error('Failed to create transaction:', error)
    throw new Error('Failed to create transaction in database')
  }
}

export async function updateTransaction(id: string, data: Partial<CreateTransactionRequest>): Promise<Transaction> {
  try {
    const response = await apiPost<Transaction>(`/api/transactions/${id}`, data)
    return response.data
  } catch (error) {
    console.error('Failed to update transaction:', error)
    throw new Error('Failed to update transaction in database')
  }
}

export async function deleteTransaction(id: string): Promise<void> {
  try {
    await apiPost(`/api/transactions/${id}/delete`, {})
  } catch (error) {
    console.error('Failed to delete transaction:', error)
    throw new Error('Failed to delete transaction from database')
  }
}
