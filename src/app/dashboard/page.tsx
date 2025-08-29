"use client"

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

import { FilterBar } from '@/app/(dashboard)/_components/FilterBar'
import { getAccounts } from '@/api/accounts'

// Helper function to get default icon based on account type
const getDefaultIcon = (type: string): string => {
  switch (type) {
    case 'cash':
      return '💵'
    case 'bank':
      return '🏦'
    case 'ewallet':
      return '📱'
    default:
      return '💰'
  }
}
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

  // Fetch real accounts data from database
  const { data: accountsData = [], isLoading: accountsLoading } = useQuery({
    queryKey: ['accounts'],
    queryFn: getAccounts,
  })

  // Transform accounts data for filter
  const accounts = accountsData.map(account => ({
    id: account.id.toString(),
    name: account.name
  }))

  // Transform accounts data for AccountBalance component
  const realAccountBalances = accountsData.map(account => ({
    id: account.id.toString(),
    name: account.name,
    type: account.type as 'cash' | 'bank' | 'ewallet',
    balance: account.balance,
    currency: 'IDR',
    icon: account.logo_url || getDefaultIcon(account.type)
  }))

  // Function untuk update header text
  const getHeaderText = () => {
    if (!selectedMonthYear) return 'Ringkasan keuangan'
    const month = selectedMonthYear.toLocaleDateString('id-ID', { month: 'long' })
    const year = selectedMonthYear.getFullYear()
    return `Ringkasan keuangan bulan ${month} ${year}`
  }

  return (
    <main className="mx-auto max-w-7xl p-6 space-y-6">
      {/* Header */}
      <section className="card p-6">
        <h1 className="text-3xl font-semibold text-[color:var(--txt-1)]">Dashboard Summary</h1>
        <p className="mt-2 text-[color:var(--txt-2)]">{getHeaderText()}</p>
      </section>

      {/* Filter Bar */}
      <section className="card p-5">
        <FilterBar
          period={selectedMonthYear}
          onPeriodChange={(date) => date && setSelectedMonthYear(date)}
          account={selectedAccount}
          onAccountChange={setSelectedAccount}
          accounts={accounts}
        />
      </section>

      {/* KPI Row */}
      <section className="card p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {mockDashboardKPIs.map((kpi, index) => (
            <div key={index} className="p-4 rounded-lg bg-[color:var(--surface-2)] border border-[color:var(--border)]">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">{kpi.icon}</div>
                <div className="flex-1">
                  <p className="text-sm text-[color:var(--txt-2)]">{kpi.label}</p>
                  <p className="text-2xl font-semibold text-[color:var(--txt-1)]">{kpi.value}</p>
                  <p className={`text-xs ${
                    kpi.changeType === 'increase' ? 'text-[color:var(--success)]' : 
                    kpi.changeType === 'decrease' ? 'text-[color:var(--danger)]' : 
                    'text-[color:var(--txt-3)]'
                  }`}>
                    {kpi.change}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Charts Row */}
      <section className="card p-5">
        <DashboardCharts 
          cashFlowData={mockCashFlowData}
          categoryData={mockCategoryExpenses}
          selectedMonth={selectedMonthYear ? selectedMonthYear.toLocaleDateString('id-ID', { month: 'long' }) : 'Januari'}
          selectedYear={selectedMonthYear ? selectedMonthYear.getFullYear().toString() : '2025'}
        />
      </section>

      {/* Budget Compliance */}
      <section className="card p-5">
        <BudgetCompliance data={mockBudgetCompliance} />
      </section>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Account Balances */}
        <section className="card p-5">
          <AccountBalance data={realAccountBalances} />
        </section>

        {/* Recent Transactions */}
        <section className="card p-5">
          <RecentTransactions data={mockRecentTransactions} />
        </section>

        {/* Mini Advisor */}
        <section className="card p-5">
          <MiniAdvisor safeToSpend={2500000} />
        </section>
      </div>
    </main>
  )
}
