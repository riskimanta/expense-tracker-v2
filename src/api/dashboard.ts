import { http } from './http'

export interface DashboardData {
  kpis: {
    totalIncome: number
    totalExpenses: number
    safeToSpend: number
    balance: number
    savingsRate: number
    budgetCompliance: number
  }
  charts: {
    incomeExpense: Array<{
      date: string
      income: number
      expenses: number
    }>
    categoryBreakdown: Array<{
      category: string
      amount: number
      percentage: number
      color: string
    }>
    budgetAllocation: Array<{
      category: string
      actual: number
      target: number
      percentage: number
      color: string
    }>
  }
  accounts: Array<{
    id: string
    name: string
    type: string
    balance: number
    currency: string
  }>
  recentTransactions: Array<{
    id: string
    date: string
    category: string
    amount: number
    note: string
    type: 'income' | 'expense'
  }>
  advisor: {
    message: string
    type: 'info' | 'warning' | 'success'
    action?: string
  }
}

export const dashboardApi = {
  getDashboardData: () => http.get<DashboardData>('/api/dashboard'),
  getMonthlyData: (month: string) => http.get<DashboardData>(`/api/dashboard/monthly/${month}`),
}
