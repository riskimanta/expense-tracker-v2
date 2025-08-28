import { useQuery } from "@tanstack/react-query"
import { mockAccounts, mockAccountOptions, mockCategoryOptions, mockIncomeSources } from "@/mock/accounts"
import { mockTransactions, mockExpenseTransactions, mockIncomeTransactions, mockTransferTransactions, mockKPIData } from "@/mock/transactions"
import { mockCategoryBreakdown, mockMonthlyData, mockBudgetData } from "@/mock/reports"

// Accounts
export const useAccounts = () => {
  return useQuery({
    queryKey: ["accounts"],
    queryFn: () => Promise.resolve(mockAccounts),
    initialData: mockAccounts,
    staleTime: Infinity, // Prevent refetching
  })
}

export const useAccountOptions = () => {
  return useQuery({
    queryKey: ["accountOptions"],
    queryFn: () => Promise.resolve(mockAccountOptions),
    initialData: mockAccountOptions,
    staleTime: Infinity,
  })
}

export const useCategoryOptions = () => {
  return useQuery({
    queryKey: ["categoryOptions"],
    queryFn: () => Promise.resolve(mockCategoryOptions),
    initialData: mockCategoryOptions,
    staleTime: Infinity,
  })
}

export const useIncomeSources = () => {
  return useQuery({
    queryKey: ["incomeSources"],
    queryFn: () => Promise.resolve(mockIncomeSources),
    initialData: mockIncomeSources,
    staleTime: Infinity,
  })
}

// Transactions
export const useTransactions = () => {
  return useQuery({
    queryKey: ["transactions"],
    queryFn: () => Promise.resolve(mockTransactions),
    initialData: mockTransactions,
    staleTime: Infinity,
  })
}

export const useExpenseTransactions = () => {
  return useQuery({
    queryKey: ["expenseTransactions"],
    queryFn: () => Promise.resolve(mockExpenseTransactions),
    initialData: mockExpenseTransactions,
    staleTime: Infinity,
  })
}

export const useIncomeTransactions = () => {
  return useQuery({
    queryKey: ["incomeTransactions"],
    queryFn: () => Promise.resolve(mockIncomeTransactions),
    initialData: mockIncomeTransactions,
    staleTime: Infinity,
  })
}

export const useTransferTransactions = () => {
  return useQuery({
    queryKey: ["transferTransactions"],
    queryFn: () => Promise.resolve(mockTransferTransactions),
    initialData: mockTransferTransactions,
    staleTime: Infinity,
  })
}

export const useKPIData = () => {
  return useQuery({
    queryKey: ["kpiData"],
    queryFn: () => Promise.resolve(mockKPIData),
    initialData: mockKPIData,
    staleTime: Infinity,
  })
}

// Reports
export const useCategoryData = () => {
  return useQuery({
    queryKey: ["categoryData"],
    queryFn: () => Promise.resolve(mockCategoryBreakdown),
    initialData: mockCategoryBreakdown,
    staleTime: Infinity,
  })
}

export const useMonthlyData = () => {
  return useQuery({
    queryKey: ["monthlyData"],
    queryFn: () => Promise.resolve(mockMonthlyData),
    initialData: mockMonthlyData,
    staleTime: Infinity,
  })
}

export const useBudgetData = () => {
  return useQuery({
    queryKey: ["budgetData"],
    queryFn: () => Promise.resolve(mockBudgetData),
    initialData: mockBudgetData,
    staleTime: Infinity,
  })
}
