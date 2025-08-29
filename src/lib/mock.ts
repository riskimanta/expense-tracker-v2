// Mock data moved inline
const mockAccounts = [
  { id: '1', name: 'Cash', type: 'cash', balance: 500000 },
  { id: '2', name: 'BCA', type: 'bank', balance: 8500000 },
  { id: '3', name: 'OVO', type: 'ewallet', balance: 250000 }
]

const mockCategories = [
  { id: '1', name: 'Makanan', type: 'expense', color: '#ef4444' },
  { id: '2', name: 'Transport', type: 'expense', color: '#3b82f6' },
  { id: '3', name: 'Gaji', type: 'income', color: '#10b981' }
]

const mockTransactions = [
  { id: '1', type: 'expense', amount: 50000, category: '1', account: '1', date: '2024-01-15' },
  { id: '2', type: 'income', amount: 8000000, category: '3', account: '1', date: '2024-01-15' }
]



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
    return mockAccounts
  },

  // Categories
  async getCategories() {
    return mockCategories
  },

  // Expenses
  async getExpenses() {
    return mockTransactions.filter(txn => txn.amount < 0)
  },

  async createExpense(data: ExpenseCreate) {
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
    console.log(`Deleting expense with ID: ${id}`)
  },

  // Income
  async createIncome(data: IncomeCreate) {
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
