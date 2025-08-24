import { mockAccounts, mockCategories, mockTransactions } from "@/mock/data"

// Simple delay function
const delay = (ms: number = 300) => new Promise(resolve => setTimeout(resolve, ms))

// Mock data types matching the actual mock data structure
export interface ExpenseCreate {
  category: string
  amount: number
  date: string
  note?: string
}

export interface IncomeCreate {
  category: string
  amount: number
  date: string
  note?: string
}

export interface TransferCreate {
  fromCategory: string
  toCategory: string
  amount: number
  date: string
  note?: string
}

// Mock API functions
export const mockApi = {
  // Accounts
  async getAccounts() {
    await delay()
    return mockAccounts
  },

  // Categories
  async getCategories() {
    await delay()
    return mockCategories
  },

  // Expenses
  async getExpenses() {
    await delay()
    return mockTransactions.filter(txn => txn.amount < 0)
  },

  async createExpense(data: ExpenseCreate) {
    await delay()
    const newExpense = {
      id: `expense-${Date.now()}`,
      date: data.date,
      category: data.category,
      amount: -Math.abs(data.amount), // Negative for expenses
      note: data.note,
    }
    // In a real app, this would add to the transactions array
    console.log('Creating expense:', newExpense)
    return newExpense
  },

  async deleteExpense(id: string) {
    await delay()
    console.log(`Deleting expense with ID: ${id}`)
  },

  // Income
  async createIncome(data: IncomeCreate) {
    await delay()
    const newIncome = {
      id: `income-${Date.now()}`,
      date: data.date,
      category: data.category,
      amount: Math.abs(data.amount), // Positive for income
      note: data.note,
    }
    console.log('Creating income:', newIncome)
    return newIncome
  },

  // Transfer
  async createTransfer(data: TransferCreate) {
    await delay()
    const transferOut = {
      id: `transfer-out-${Date.now()}`,
      date: data.date,
      category: data.fromCategory,
      amount: -Math.abs(data.amount),
      note: data.note || `Transfer to ${data.toCategory}`,
    }
    const transferIn = {
      id: `transfer-in-${Date.now()}`,
      date: data.date,
      category: data.toCategory,
      amount: Math.abs(data.amount),
      note: data.note || `Transfer from ${data.fromCategory}`,
    }
    console.log('Creating transfer:', { transferOut, transferIn })
    return { transferOut, transferIn }
  },

  // Reports
  async getMonthlyReport() {
    await delay()
    const expenses = mockTransactions.filter(t => t.amount < 0)
    const income = mockTransactions.filter(t => t.amount > 0)
    
    const totalExpenses = Math.abs(expenses.reduce((sum, t) => sum + t.amount, 0))
    const totalIncome = income.reduce((sum, t) => sum + t.amount, 0)
    
    return {
      totalIncome,
      totalExpenses,
      netAmount: totalIncome - totalExpenses,
      savingsRate: totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0,
      monthlyBreakdown: []
    }
  },

  async getCategoryReport() {
    await delay()
    const expenses = mockTransactions.filter(t => t.amount < 0)
    const totalExpenses = Math.abs(expenses.reduce((sum, t) => sum + t.amount, 0))
    
    const categoryMap = new Map<string, { totalAmount: number; transactionCount: number }>()
    
    expenses.forEach(txn => {
      const existing = categoryMap.get(txn.category) || { totalAmount: 0, transactionCount: 0 }
      categoryMap.set(txn.category, {
        totalAmount: existing.totalAmount + Math.abs(txn.amount),
        transactionCount: existing.transactionCount + 1
      })
    })
    
    return Array.from(categoryMap.entries()).map(([categoryName, data]) => ({
      categoryId: categoryName,
      categoryName,
      totalAmount: data.totalAmount,
      percentage: totalExpenses > 0 ? (data.totalAmount / totalExpenses) * 100 : 0,
      transactionCount: data.transactionCount
    }))
  },

  // Advisor
  async canBuy(data: { price: number; targetDate?: string; priority?: string }) {
    await delay()
    
    // Simple mock logic
    const monthlyIncome = 8000000 // Mock monthly income
    const monthlyExpenses = 6000000 // Mock monthly expenses
    const safeToSpend = monthlyIncome - monthlyExpenses - 1000000 // Buffer
    
    const canBuy = safeToSpend >= data.price
    const reason = canBuy ? 'ok' : 'bad'
    
    return {
      canBuy,
      reason,
      metrics: {
        safeToSpend,
        projectedMonthEnd: monthlyIncome - monthlyExpenses,
        bufferPercent: 10
      },
      notes: canBuy ? 'Anda bisa membeli ini dengan aman' : 'Saldo tidak cukup untuk pembelian ini',
      recommendations: canBuy ? ['Simpan bukti pembelian'] : ['Tunggu sampai gajian berikutnya', 'Kurangi pengeluaran lain']
    }
  }
}
