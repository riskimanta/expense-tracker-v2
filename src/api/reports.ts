import { apiGet } from './http'

export interface MonthlyReport {
  date: string
  income: number
  expense: number
  net: number
}

export interface CategoryReport {
  category: string
  total: number
  percentage: number
  count: number
}

export interface ReportFilters {
  from: string
  to: string
  accountId?: string
  type?: 'INCOME' | 'EXPENSE'
}

// GET /api/reports/monthly?from=&to=&accountId= → [{date,income,expense,net}]
export async function getMonthlyReport(filters: ReportFilters): Promise<MonthlyReport[]> {
  try {
    const queryParams = new URLSearchParams()
    queryParams.append('from', filters.from)
    queryParams.append('to', filters.to)
    if (filters.accountId) queryParams.append('accountId', filters.accountId)

    const endpoint = `/api/reports/monthly?${queryParams.toString()}`
    const response = await apiGet<MonthlyReport[]>(endpoint)
    return response.data
  } catch (error) {
    console.error('Failed to fetch monthly report:', error)
    throw new Error('Failed to fetch monthly report from database')
  }
}

// GET /api/reports/by-category?from=&to= → [{category,total}]
export async function getCategoryReport(filters: ReportFilters): Promise<CategoryReport[]> {
  try {
    const queryParams = new URLSearchParams()
    queryParams.append('from', filters.from)
    queryParams.append('to', filters.to)
    if (filters.accountId) queryParams.append('accountId', filters.accountId)
    if (filters.type) queryParams.append('type', filters.type)

    const endpoint = `/api/reports/by-category?${queryParams.toString()}`
    const response = await apiGet<CategoryReport[]>(endpoint)
    return response.data
  } catch (error) {
    console.error('Failed to fetch category report:', error)
    throw new Error('Failed to fetch category report from database')
  }
}

export async function getDashboardSummary(filters: ReportFilters): Promise<{
  totalIncome: number
  totalExpense: number
  netIncome: number
  savingsRate: number
  topCategory: string
  topCategoryAmount: number
}> {
  try {
    const queryParams = new URLSearchParams()
    queryParams.append('from', filters.from)
    queryParams.append('to', filters.to)
    if (filters.accountId) queryParams.append('accountId', filters.accountId)

    const endpoint = `/api/reports/dashboard?${queryParams.toString()}`
    const response = await apiGet<{
      totalIncome: number
      totalExpense: number
      netIncome: number
      savingsRate: number
      topCategory: string
      topCategoryAmount: number
    }>(endpoint)
    return response.data
  } catch (error) {
    console.error('Failed to fetch dashboard summary:', error)
    throw new Error('Failed to fetch dashboard summary from database')
  }
}

export async function getCashFlowData(filters: ReportFilters): Promise<{
  date: string
  income: number
  expense: number
  net: number
}[]> {
  try {
    const queryParams = new URLSearchParams()
    queryParams.append('from', filters.from)
    queryParams.append('to', filters.to)
    if (filters.accountId) queryParams.append('accountId', filters.accountId)

    const endpoint = `/api/reports/cashflow?${queryParams.toString()}`
    const response = await apiGet<{
      date: string
      income: number
      expense: number
      net: number
    }[]>(endpoint)
    return response.data
  } catch (error) {
    console.error('Failed to fetch cash flow data:', error)
    throw new Error('Failed to fetch cash flow data from database')
  }
}
