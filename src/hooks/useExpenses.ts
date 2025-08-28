import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { transactionApi, categoryApi, accountApi } from "@/lib/api"
import { getCategories } from "@/mock/expenses"

interface UseExpensesParams {
  userId: string
  month: Date | null
  categoryId: string
  accountId: string
}

interface TransactionResponse {
  id: number
  date: string
  amount: number
  description: string
  type: string
  category_id: number
  category_name: string
  account_id: number
  account_name: string
  created_at: string
  transfer_group?: string
}

interface CategoryResponse {
  id: number
  name: string
  color?: string
  type: string
  icon?: string
  created_at: string
}

interface AccountResponse {
  id: number
  name: string
  type: string
  balance: number
  created_at: string
}

export function useExpenses({ userId, month, categoryId, accountId }: UseExpensesParams) {
  const from = month ? `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, '0')}-01` : null
  const to = month ? `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, '0')}-${new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate()}` : null

  console.log('useExpenses hook called with:', { userId, month, from, to, categoryId, accountId })

  return useQuery({
    queryKey: ['expenses', userId, from, to, categoryId, accountId],
    queryFn: async () => {
      if (!month) return []
      
      console.log('Fetching expenses for date range:', { from, to })
      
      try {
        // Use local API routes (no external API configured)
        const transactions = await transactionApi.getTransactions({
          type: 'EXPENSE',
          from: from!,
          to: to!,
          userId,
          categoryId: categoryId === 'all' ? undefined : categoryId,
          accountId: accountId === 'all' ? undefined : accountId
        })
        
        console.log('API response:', transactions)
        
        // Transform API response to match expected ExpenseTransaction interface
        console.log('Starting transformation...')
        const transformed = transactions.map((tx: TransactionResponse, index: number) => {
          console.log(`Transforming transaction ${index}:`, tx)
          const result = {
            id: tx.id.toString(),
            date: tx.date,
            category: tx.category_name || 'Unknown',
            amount: tx.amount,
            description: tx.description || '',
            accountId: tx.account_id.toString(),
            accountName: tx.account_name || 'Unknown',
            splitCount: 1,
            // Add fields needed for editing
            type: tx.type,
            category_id: tx.category_id?.toString(),
            account_id: tx.account_id?.toString()
          }
          console.log(`Transformed result ${index}:`, result)
          return result
        })
        
        console.log('Transformed expenses:', transformed)
        return transformed
      } catch (error) {
        console.error('API call failed:', error)
        // Don't fallback to mock data for now
        throw error
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!month, // Only run query when month is available
  })
}

export function useExpenseCategories() {
  return useQuery({
    queryKey: ['expense-categories'],
    queryFn: async () => {
      try {
        // Use local API routes
        const categories = await categoryApi.getCategories('expense')
        
        // Transform API response to match expected format
        return categories.map((cat: CategoryResponse) => ({
          id: cat.id.toString(),
          name: cat.name,
          color: cat.color || 'var(--needs)',
          budget: 0, // Budget not stored in current schema
          spent: 0 // This would need to be calculated from transactions
        }))
      } catch (error) {
        console.warn('API call failed, falling back to mock data:', error)
        // Fallback to mock data
        return getCategories()
      }
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

export function useAccounts(userId: string = '1') {
  return useQuery({
    queryKey: ['accounts', userId],
    queryFn: async () => {
      try {
        // Use local API routes
        const accounts = await accountApi.getAccounts(userId)
        
        // Transform API response to match expected format
        return accounts.map((acc: AccountResponse) => ({
          id: acc.id.toString(),
          name: acc.name,
          type: acc.type || 'CASH',
          balance: acc.balance || 0,
          currency: 'IDR' // Currency not stored in current schema
        }))
      } catch (error) {
        console.warn('API call failed, falling back to mock data:', error)
        // Fallback to mock data - you might want to add mock accounts here
        return []
      }
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

// Mutation hook for creating expenses
export function useCreateExpense() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: {
      date: string
      categoryId: string
      amount: number
      description: string
      accountId: string
      userId?: string
    }) => {
      return transactionApi.createTransaction({
        ...data,
        type: 'EXPENSE',
        userId: data.userId || '1'
      })
    },
    onSuccess: () => {
      // Invalidate and refetch expenses queries
      queryClient.invalidateQueries({ queryKey: ['expenses'] })
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
    },
    onError: (error) => {
      console.error('Failed to create expense:', error)
    }
  })
}

// Mutation hook for updating transactions
export function useUpdateTransaction() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: {
      id: string
      date: string
      categoryId: string
      amount: number
      description: string
      accountId: string
      type: string
    }) => {
      return transactionApi.updateTransaction(data.id, {
        date: data.date,
        categoryId: data.categoryId,
        amount: data.amount,
        description: data.description,
        accountId: data.accountId,
        type: data.type
      })
    },
    onSuccess: () => {
      // Invalidate and refetch expenses queries
      queryClient.invalidateQueries({ queryKey: ['expenses'] })
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
    },
    onError: (error) => {
      console.error('Failed to update transaction:', error)
    }
  })
}

// Mutation hook for deleting transactions
export function useDeleteTransaction() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: string) => {
      return transactionApi.deleteTransaction(id)
    },
    onSuccess: () => {
      // Invalidate and refetch expenses queries
      queryClient.invalidateQueries({ queryKey: ['expenses'] })
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
    },
    onError: (error) => {
      console.error('Failed to delete transaction:', error)
    }
  })
}

