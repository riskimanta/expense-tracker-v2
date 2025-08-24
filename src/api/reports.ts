import { apiGet, apiCallWithMock } from './http'
import { mockMonthlyData, mockCategoryBreakdown } from '@/mock/reports'

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
  type?: 'income' | 'expense'
}

// GET /api/reports/monthly?from=&to= → [{date, income, expense}]
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
    console.warn('API call failed, using mock data:', error)
    
    // Filter mock data based on date range
    let filteredData = mockMonthlyData
    
    if (filters.from) {
      filteredData = filteredData.filter(item => item.month >= filters.from)
    }
    
    if (filters.to) {
      filteredData = filteredData.filter(item => item.month <= filters.to)
    }
    
    return filteredData.map(item => ({
      date: item.month,
      income: item.income,
      expense: item.expense,
      net: item.net
    }))
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
    console.warn('API call failed, using mock data:', error)
    
    // Return mock category breakdown
    return mockCategoryBreakdown.map(item => ({
      category: item.category,
      total: item.amount,
      percentage: item.percentage,
      count: Math.floor(item.amount / 100000) // Mock count based on amount
    }))
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
    const response = await apiGet<any>(endpoint)
    return response.data
  } catch (error) {
    console.warn('API call failed, using mock data:', error)
    
    // Calculate from mock data
    const monthlyData = await getMonthlyReport(filters)
    const totalIncome = monthlyData.reduce((sum, item) => sum + item.income, 0)
    const totalExpense = monthlyData.reduce((sum, item) => sum + item.expense, 0)
    const netIncome = totalIncome - totalExpense
    const savingsRate = totalIncome > 0 ? (netIncome / totalIncome) * 100 : 0
    
    const categoryData = await getCategoryReport(filters)
    const topCategory = categoryData[0]?.category || 'Unknown'
    const topCategoryAmount = categoryData[0]?.total || 0
    
    return {
      totalIncome,
      totalExpense,
      netIncome,
      savingsRate: Math.round(savingsRate * 10) / 10,
      topCategory,
      topCategoryAmount
    }
  }
}

export async function getCashFlowData(filters: ReportFilters): Promise<{
  date: string
  income: number
  expense: number
}[]> {
  try {
    const queryParams = new URLSearchParams()
    queryParams.append('from', filters.from)
    queryParams.append('to', filters.to)
    if (filters.accountId) queryParams.append('accountId', filters.accountId)

    const endpoint = `/api/reports/cashflow?${queryParams.toString()}`
    const response = await apiGet<any[]>(endpoint)
    return response.data
  } catch (error) {
    console.warn('API call failed, using mock data:', error)
    
    // Return mock cash flow data
    const monthlyData = await getMonthlyReport(filters)
    return monthlyData.map(item => ({
      date: item.date,
      income: item.income,
      expense: item.expense
    }))
  }
}
