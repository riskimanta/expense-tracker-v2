import type { Account } from "@/components/AccountCard"

export const mockAccounts: Account[] = [
  {
    id: "1",
    name: "BCA Giro",
    type: "checking",
    balance: 15000000,
    currency: "IDR",
  },
  {
    id: "2",
    name: "BCA Tabungan",
    type: "savings",
    balance: 50000000,
    currency: "IDR",
  },
  {
    id: "3",
    name: "BCA Kartu Kredit",
    type: "credit",
    balance: -2500000,
    currency: "IDR",
  },
  {
    id: "4",
    name: "Tunai",
    type: "cash",
    balance: 500000,
    currency: "IDR",
  },
  {
    id: "5",
    name: "Reksadana",
    type: "investment",
    balance: 25000000,
    currency: "IDR",
  },
]

export const mockAccountOptions = mockAccounts.map((a) => ({
  id: a.id,
  name: a.name,
}))

export const mockCategoryOptions = [
  { id: "food", name: "Makanan & Minuman" },
  { id: "transport", name: "Transportasi" },
  { id: "shopping", name: "Belanja" },
  { id: "entertainment", name: "Hiburan" },
  { id: "health", name: "Kesehatan" },
  { id: "education", name: "Pendidikan" },
  { id: "utilities", name: "Tagihan" },
  { id: "other", name: "Lainnya" },
]

export const mockIncomeSources = [
  { id: "salary", name: "Gaji" },
  { id: "bonus", name: "Bonus" },
  { id: "investment", name: "Investasi" },
  { id: "business", name: "Bisnis" },
  { id: "other", name: "Lainnya" },
]

