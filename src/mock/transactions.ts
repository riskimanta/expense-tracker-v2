import type { Transaction } from "@/mock/data"

export const mockTransactions: Transaction[] = [
  {
    id: "1",
    date: "2024-12-15",
    category: "Makanan & Minuman",
    amount: -150000,
    note: "Makan siang di warung",
  },
  {
    id: "2",
    date: "2024-12-14",
    category: "Transportasi",
    amount: -25000,
    note: "Gojek ke kantor",
  },
  {
    id: "3",
    date: "2024-12-13",
    category: "Gaji",
    amount: 8000000,
    note: "Gaji bulanan",
  },
  {
    id: "4",
    date: "2024-12-12",
    category: "Belanja",
    amount: -500000,
    note: "Beli baju di mall",
    isSplit: true,
    splitCount: 3,
  },
  {
    id: "5",
    date: "2024-12-11",
    category: "Transfer",
    amount: -1000000,
    note: "Transfer ke tabungan",
  },
  {
    id: "6",
    date: "2024-12-10",
    category: "Hiburan",
    amount: -100000,
    note: "Nonton film",
  },
  {
    id: "7",
    date: "2024-12-09",
    category: "Investasi",
    amount: 500000,
    note: "Dividen reksadana",
  },
  {
    id: "8",
    date: "2024-12-08",
    category: "Kesehatan",
    amount: -300000,
    note: "Kontrol dokter",
  },
]

export const mockExpenseTransactions = mockTransactions.filter((t) => t.amount < 0)
export const mockIncomeTransactions = mockTransactions.filter((t) => t.amount > 0)
export const mockTransferTransactions = mockTransactions.filter((t) => t.category === "Transfer")

export const mockKPIData = {
  totalExpenses: 1125000,
  totalIncome: 8500000,
  avgDailySpending: 75000,
  savingsRate: 68.75,
}
