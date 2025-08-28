"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { transactionApi, categoryApi, accountApi } from "@/lib/api"
import { formatIDR } from "@/lib/format"

interface UseIncomeParams {
  userId: string
  month?: Date
  categoryId?: string
}

interface IncomeTransaction {
  id: string
  date: string
  category: string
  amount: number
  description: string
  accountId: string
  accountName: string
  splitCount: number
  type?: string
  category_id?: string
  account_id?: string
}

interface IncomeKPI {
  totalIncome: number
  monthlyTarget: number
  averageDaily: number
  topSource: string
  topSourceAmount: number
}

export function useIncome({ userId, month, categoryId = 'all' }: UseIncomeParams) {
  const queryClient = useQueryClient()
  
  // Calculate date range for the month
  const from = month ? month.toISOString().split('T')[0].substring(0, 7) + '-01' : undefined
  const to = month ? new Date(month.getFullYear(), month.getMonth() + 1, 0).toISOString().split('T')[0] : undefined

  console.log('useIncome hook called with:', {
    userId,
    month,
    from,
    to,
    categoryId
  })

  return useQuery({
    queryKey: ['income', userId, from, to, categoryId],
    queryFn: async () => {
      if (!from || !to) {
        console.log('Returning empty data: no date range')
        return []
      }

      try {
        const [transactions, categories, accounts] = await Promise.all([
          transactionApi.getTransactions({
            type: 'INCOME',
            from,
            to,
            userId,
            categoryId: categoryId === 'all' ? undefined : categoryId
          }),
          categoryApi.getCategories('income'),
          accountApi.getAccounts(userId)
        ])

        console.log('API responses:', { transactions, categories, accounts })

        const transformed = transactions.map((tx: any, index: number) => {
          const result = {
            id: tx.id.toString(),
            date: tx.date,
            category: tx.category_name || 'Unknown',
            amount: tx.amount,
            description: tx.description || '',
            accountId: tx.account_id.toString(),
            accountName: tx.account_name || 'Unknown',
            splitCount: 1,
            // Added fields needed for editing to be passed to UI
            type: tx.type,
            category_id: tx.category_id ? tx.category_id.toString() : null,
            account_id: tx.account_id ? tx.account_id.toString() : null
          }
          return result
        })

        console.log('Transformed income data:', transformed)
        return transformed
      } catch (error) {
        console.error('Error fetching income data:', error)
        // Fallback to mock data if API fails
        console.log('Falling back to mock data')
        return []
      }
    },
    enabled: !!month,
    staleTime: 0, // Always fresh to ensure real-time updates
  })
}

export function useIncomeKPIs({ userId, month }: { userId: string; month?: Date }) {
  const { data: transactions, isLoading } = useIncome({ userId, month })
  
  // Calculate date range for the month (same as useIncome)
  const from = month ? month.toISOString().split('T')[0].substring(0, 7) + '-01' : undefined
  const to = month ? new Date(month.getFullYear(), month.getMonth() + 1, 0).toISOString().split('T')[0] : undefined
  
  return useQuery({
    queryKey: ['income-kpis', userId, from, to, transactions?.length || 0, transactions?.map((t: IncomeTransaction) => t.id).join(',') || ''],
    queryFn: () => {
      if (!transactions || transactions.length === 0) {
        return {
          totalIncome: 0,
          monthlyTarget: 10000000, // Default target
          averageDaily: 0,
          topSource: 'N/A',
          topSourceAmount: 0
        }
      }

      const totalIncome = transactions.reduce((sum: number, tx: IncomeTransaction) => sum + tx.amount, 0)
      const daysInMonth = month ? new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate() : 30
      const averageDaily = totalIncome / daysInMonth
      
      // Find top source
      const sourceMap = new Map<string, number>()
      transactions.forEach((tx: IncomeTransaction) => {
        const current = sourceMap.get(tx.category) || 0
        sourceMap.set(tx.category, current + tx.amount)
      })
      
      let topSource = 'N/A'
      let topSourceAmount = 0
      for (const [source, amount] of sourceMap.entries()) {
        if (amount > topSourceAmount) {
          topSource = source
          topSourceAmount = amount
        }
      }

      return {
        totalIncome,
        monthlyTarget: 10000000, // Default target
        averageDaily,
        topSource,
        topSourceAmount
      }
    },
    enabled: !isLoading && !!month,
    staleTime: 0, // Always fresh to ensure real-time updates
  })
}

export function useCreateIncome() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: {
      date: string
      categoryId: string
      amount: number
      description: string
      accountId: string
      type: string
    }) => {
      return transactionApi.createTransaction(data)
    },
    onSuccess: (data, variables) => {
      // Invalidate and refetch income queries
      queryClient.invalidateQueries({ queryKey: ['income'] })
      queryClient.invalidateQueries({ queryKey: ['income-kpis'] })
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
      queryClient.invalidateQueries({ queryKey: ['income-categories'] })
      
      // Also invalidate any dashboard or summary queries that might depend on income data
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      queryClient.invalidateQueries({ queryKey: ['reports'] })
      
      // Force refetch by invalidating all queries to ensure UI updates
      queryClient.invalidateQueries()
    },
  })
}

export function useIncomeCategories() {
  return useQuery({
    queryKey: ['income-categories'],
    queryFn: () => categoryApi.getCategories('income'),
    staleTime: 1000 * 60 * 10, // 10 minutes
  })
}

export function useIncomeAccounts(userId: string) {
  return useQuery({
    queryKey: ['accounts', userId],
    queryFn: () => accountApi.getAccounts(userId),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export function useUpdateIncome() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      return transactionApi.updateTransaction(id, data)
    },
    onSuccess: () => {
      console.log('useUpdateIncome - Invalidating queries after successful update');
      
      // Invalidate and refetch income queries with more specific patterns
      queryClient.invalidateQueries({ queryKey: ['income'] })
      queryClient.invalidateQueries({ queryKey: ['income-kpis'] })
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
      queryClient.invalidateQueries({ queryKey: ['income-categories'] })
      
      // Also invalidate any dashboard or summary queries that might depend on income data
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      queryClient.invalidateQueries({ queryKey: ['reports'] })
      
      // Force refetch by invalidating all queries to ensure UI updates
      queryClient.invalidateQueries()
      
      console.log('useUpdateIncome - All queries invalidated');
    },
  })
}

export function useDeleteIncome() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      return transactionApi.deleteTransaction(id)
    },
    onSuccess: () => {
      // Invalidate and refetch income queries
      queryClient.invalidateQueries({ queryKey: ['income'] })
      queryClient.invalidateQueries({ queryKey: ['income-kpis'] })
      queryClient.invalidateQueries({ queryKey: ['accounts'] })
      queryClient.invalidateQueries({ queryKey: ['income-categories'] })
      
      // Also invalidate any dashboard or summary queries that might depend on income data
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      queryClient.invalidateQueries({ queryKey: ['reports'] })
      
      // Force refetch by invalidating all queries to ensure UI updates
      queryClient.invalidateQueries()
    },
  })
}
