"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

import { FilterBar } from '@/app/(dashboard)/_components/FilterBar'
// Mock data moved inline
const mockDashboardKPIs = [
  { icon: '💰', label: 'Total Saldo', value: 'Rp 12.500.000', change: '+5.2%', changeType: 'increase' },
  { icon: '📈', label: 'Pemasukan', value: 'Rp 8.000.000', change: '+12.1%', changeType: 'increase' },
  { icon: '📉', label: 'Pengeluaran', value: 'Rp 5.500.000', change: '-2.3%', changeType: 'decrease' },
  { icon: '🎯', label: 'Tabungan', value: 'Rp 3.000.000', change: '+8.7%', changeType: 'increase' }
]

const mockAccountBalances = [
  { id: '1', name: 'Cash', type: 'cash' as const, balance: 2500000, currency: 'IDR', icon: '💵' },
  { id: '2', name: 'BCA', type: 'bank' as const, balance: 8500000, currency: 'IDR', icon: '🏦' },
  { id: '3', name: 'OVO', type: 'ewallet' as const, balance: 1500000, currency: 'IDR', icon: '📱' }
]

const mockRecentTransactions = [
  { id: '1', date: '2024-01-15', description: 'Makan Siang', amount: -50000, type: 'expense' as const, account: 'Cash', category: 'Makanan' },
  { id: '2', date: '2024-01-15', description: 'Gaji Bulanan', amount: 8000000, type: 'income' as const, account: 'BCA', category: 'Gaji' },
  { id: '3', date: '2024-01-14', description: 'Transport', amount: -25000, type: 'expense' as const, account: 'Cash', category: 'Transport' }
]

const mockBudgetCompliance = [
  { category: 'Kebutuhan', target: 4000000, actual: 3000000, percentage: 75, status: 'on-track' as const },
  { category: 'Keinginan', target: 2000000, actual: 1500000, percentage: 75, status: 'on-track' as const },
  { category: 'Tabungan', target: 2000000, actual: 2000000, percentage: 100, status: 'on-track' as const }
]

const mockCashFlowData = [
  { date: '2024-01-01', month: 'Jan', income: 8000000, expense: 5500000 },
  { date: '2024-02-01', month: 'Feb', income: 7500000, expense: 5200000 },
  { date: '2024-03-01', month: 'Mar', income: 8200000, expense: 5800000 }
]

const mockCategoryExpenses = [
  { name: 'Makanan', value: 2000000, category: 'Makanan', color: '#ef4444' },
  { name: 'Transport', value: 800000, category: 'Transport', color: '#3b82f6' },
  { name: 'Hiburan', value: 500000, category: 'Hiburan', color: '#10b981' }
]
import { BudgetCompliance } from '@/components/BudgetCompliance'
import { AccountBalance } from '@/components/AccountBalance'
import { RecentTransactions } from '@/components/RecentTransactions'
import { MiniAdvisor } from '@/components/MiniAdvisor'
import { DashboardCharts } from '@/components/DashboardCharts'

export default function DashboardPage() {
  // State untuk selector bulan dan tahun
  const [selectedMonthYear, setSelectedMonthYear] = useState<Date>(() => {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth(), 1)
  })

  // State untuk filter akun
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null)

  // Data akun untuk filter
  const accounts = [
    { id: 'cash', name: 'Cash' },
    { id: 'bca', name: 'BCA' },
    { id: 'ovo', name: 'OVO' },
    { id: 'gopay', name: 'GoPay' }
  ]

  // Function untuk update header text
  const getHeaderText = () => {
    if (!selectedMonthYear) return 'Ringkasan keuangan'
    const month = selectedMonthYear.toLocaleDateString('id-ID', { month: 'long' })
    const year = selectedMonthYear.getFullYear()
    return `Ringkasan keuangan bulan ${month} ${year}`
  }

  return (
    <main className="mx-auto max-w-[1200px] p-6 space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-semibold text-foreground">Dashboard Summary</h1>
        <p className="mt-1 text-muted-foreground">{getHeaderText()}</p>
      </div>

      {/* Filter Bar */}
      <FilterBar
        period={selectedMonthYear}
        onPeriodChange={(date) => date && setSelectedMonthYear(date)}
        account={selectedAccount}
        onAccountChange={setSelectedAccount}
        accounts={accounts}
      />

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {mockDashboardKPIs.map((kpi, index) => (
          <Card key={index} className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center space-x-3">
              <div className="text-2xl">{kpi.icon}</div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">{kpi.label}</p>
                <p className="text-2xl font-semibold text-foreground">{kpi.value}</p>
                <p className={`text-xs ${
                  kpi.changeType === 'increase' ? 'text-[var(--success)]' : 
                  kpi.changeType === 'decrease' ? 'text-[var(--danger)]' : 
                  'text-muted-foreground'
                }`}>
                  {kpi.change}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <DashboardCharts 
        cashFlowData={mockCashFlowData}
        categoryData={mockCategoryExpenses}
        selectedMonth={selectedMonthYear ? selectedMonthYear.toLocaleDateString('id-ID', { month: 'long' }) : 'Januari'}
        selectedYear={selectedMonthYear ? selectedMonthYear.getFullYear().toString() : '2025'}
      />

      {/* Budget Compliance */}
      <BudgetCompliance data={mockBudgetCompliance} />

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Account Balances */}
        <AccountBalance data={mockAccountBalances} />

        {/* Recent Transactions */}
        <RecentTransactions data={mockRecentTransactions} />

        {/* Mini Advisor */}
        <MiniAdvisor safeToSpend={2500000} />
      </div>
    </main>
  )
}
