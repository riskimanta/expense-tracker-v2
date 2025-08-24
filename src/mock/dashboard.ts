import type { DashboardData } from '@/api/dashboard'

export const mockDashboardData: DashboardData = {
  kpis: {
    totalIncome: 8500000,
    totalExpenses: 3200000,
    safeToSpend: 2800000,
    balance: 5300000,
    savingsRate: 62.4,
    budgetCompliance: 87.2,
  },
  charts: {
    incomeExpense: [
      { date: '2025-08-01', income: 8500000, expenses: 0 },
      { date: '2025-08-05', income: 0, expenses: 800000 },
      { date: '2025-08-10', income: 0, expenses: 1200000 },
      { date: '2025-08-15', income: 0, expenses: 900000 },
      { date: '2025-08-20', income: 0, expenses: 300000 },
      { date: '2025-08-25', income: 0, expenses: 0 },
    ],
    categoryBreakdown: [
      { category: 'Makanan', amount: 1200000, percentage: 37.5, color: 'var(--needs)' },
      { category: 'Transport', amount: 800000, percentage: 25.0, color: 'var(--wants)' },
      { category: 'Belanja', amount: 600000, percentage: 18.8, color: 'var(--invest)' },
      { category: 'Hiburan', amount: 400000, percentage: 12.5, color: 'var(--coins)' },
      { category: 'Lainnya', amount: 200000, percentage: 6.2, color: 'var(--savings)' },
    ],
    budgetAllocation: [
      { category: 'Needs', actual: 1200000, target: 1600000, percentage: 75.0, color: 'var(--needs)' },
      { category: 'Wants', actual: 800000, target: 800000, percentage: 100.0, color: 'var(--wants)' },
      { category: 'Savings', actual: 400000, target: 800000, percentage: 50.0, color: 'var(--savings)' },
      { category: 'Invest', actual: 600000, target: 1200000, percentage: 50.0, color: 'var(--invest)' },
      { category: 'Coins', actual: 200000, target: 400000, percentage: 50.0, color: 'var(--coins)' },
    ],
  },
  accounts: [
    { id: '1', name: 'Cash', type: 'cash', balance: 500000, currency: 'IDR' },
    { id: '2', name: 'BCA Giro', type: 'bank', balance: 3500000, currency: 'IDR' },
    { id: '3', name: 'OVO', type: 'wallet', balance: 800000, currency: 'IDR' },
    { id: '4', name: 'GoPay', type: 'wallet', balance: 500000, currency: 'IDR' },
  ],
  recentTransactions: [
    { id: '1', date: '2025-08-24', category: 'Makanan', amount: 75000, note: 'Lunch di warung', type: 'expense' },
    { id: '2', date: '2025-08-23', category: 'Transport', amount: 25000, note: 'Gojek ke kantor', type: 'expense' },
    { id: '3', date: '2025-08-22', category: 'Belanja', amount: 150000, note: 'Beli baju', type: 'expense' },
    { id: '4', date: '2025-08-21', category: 'Gaji', amount: 8500000, note: 'Gaji bulanan', type: 'income' },
    { id: '5', date: '2025-08-20', category: 'Investasi', amount: 500000, note: 'Reksadana', type: 'expense' },
  ],
  advisor: {
    message: 'Pengeluaran bulan ini sudah 87% dari target. Pertimbangkan untuk mengurangi belanja hiburan.',
    type: 'warning',
    action: 'Lihat detail budget',
  },
}

export const getMockDashboardData = (): Promise<DashboardData> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockDashboardData), 500)
  })
}
