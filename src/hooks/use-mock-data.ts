import { useQuery } from "@tanstack/react-query"
import { fakeFetcher } from "@/lib/fake-fetcher"
import { mockAccounts, mockAccountOptions, mockCategoryOptions, mockIncomeSources } from "@/mock/accounts"
import { mockTransactions, mockExpenseTransactions, mockIncomeTransactions, mockTransferTransactions, mockKPIData } from "@/mock/transactions"
import { mockCategoryData, mockMonthlyData, mockBudgetData } from "@/mock/reports"

// Accounts
export const useAccounts = () => {
  return useQuery({
    queryKey: ["accounts"],
    queryFn: () => fakeFetcher(mockAccounts),
    initialData: mockAccounts,
    staleTime: Infinity, // Prevent refetching
  })
}

export const useAccountOptions = () => {
  return useQuery({
    queryKey: ["accountOptions"],
    queryFn: () => fakeFetcher(mockAccountOptions),
    initialData: mockAccountOptions,
    staleTime: Infinity,
  })
}

export const useCategoryOptions = () => {
  return useQuery({
    queryKey: ["categoryOptions"],
    queryFn: () => fakeFetcher(mockCategoryOptions),
    initialData: mockCategoryOptions,
    staleTime: Infinity,
  })
}

export const useIncomeSources = () => {
  return useQuery({
    queryKey: ["incomeSources"],
    queryFn: () => fakeFetcher(mockIncomeSources),
    initialData: mockIncomeSources,
    staleTime: Infinity,
  })
}

// Transactions
export const useTransactions = () => {
  return useQuery({
    queryKey: ["transactions"],
    queryFn: () => fakeFetcher(mockTransactions),
    initialData: mockTransactions,
    staleTime: Infinity,
  })
}

export const useExpenseTransactions = () => {
  return useQuery({
    queryKey: ["expenseTransactions"],
    queryFn: () => fakeFetcher(mockExpenseTransactions),
    initialData: mockExpenseTransactions,
    staleTime: Infinity,
  })
}

export const useIncomeTransactions = () => {
  return useQuery({
    queryKey: ["incomeTransactions"],
    queryFn: () => fakeFetcher(mockIncomeTransactions),
    initialData: mockIncomeTransactions,
    staleTime: Infinity,
  })
}

export const useTransferTransactions = () => {
  return useQuery({
    queryKey: ["transferTransactions"],
    queryFn: () => fakeFetcher(mockTransferTransactions),
    initialData: mockTransferTransactions,
    staleTime: Infinity,
  })
}

export const useKPIData = () => {
  return useQuery({
    queryKey: ["kpiData"],
    queryFn: () => fakeFetcher(mockKPIData),
    initialData: mockKPIData,
    staleTime: Infinity,
  })
}

// Reports
export const useCategoryData = () => {
  return useQuery({
    queryKey: ["categoryData"],
    queryFn: () => fakeFetcher(mockCategoryData),
    initialData: mockCategoryData,
    staleTime: Infinity,
  })
}

export const useMonthlyData = () => {
  return useQuery({
    queryKey: ["monthlyData"],
    queryFn: () => fakeFetcher(mockMonthlyData),
    initialData: mockMonthlyData,
    staleTime: Infinity,
  })
}

export const useBudgetData = () => {
  return useQuery({
    queryKey: ["budgetData"],
    queryFn: () => fakeFetcher(mockBudgetData),
    initialData: mockBudgetData,
    staleTime: Infinity,
  })
}
