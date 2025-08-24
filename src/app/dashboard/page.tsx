"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { KPIChip } from "@/components/KPIChip"
import { AreaChart } from "@/components/AreaChart"
import { CategoryDonut } from "@/components/CategoryDonut"
import { BudgetCompliance } from "@/components/BudgetCompliance"
import { AccountBalance } from "@/components/AccountBalance"
import { RecentTransactions } from "@/components/RecentTransactions"
import { MiniAdvisor } from "@/components/MiniAdvisor"
import { formatIDR } from "@/lib/format"
import { getMockDashboardData } from "@/mock/dashboard"
import type { DashboardData } from "@/api/dashboard"

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setIsLoading(true)
        const data = await getMockDashboardData()
        setDashboardData(data)
      } catch {
        setError("Gagal memuat data dashboard")
      } finally {
        setIsLoading(false)
      }
    }

    loadDashboardData()
  }, [])

  if (isLoading) {
    return (
      <main className="page">
        <div className="mb-6">
          <h1 className="text-3xl font-semibold text-foreground">Dashboard Summary</h1>
          <p className="mt-1 text-muted-foreground">Loading dashboard data...</p>
        </div>
      </main>
    )
  }

  if (error || !dashboardData) {
    return (
      <main className="page">
        <div className="mb-6">
          <h1 className="text-3xl font-semibold text-foreground">Dashboard Summary</h1>
        </div>
        <div className="p-4 bg-[var(--danger)] bg-opacity-10 border border-[var(--danger)] rounded-lg">
          <p className="text-sm text-[var(--danger)] text-center">{error || "Data tidak tersedia"}</p>
        </div>
      </main>
    )
  }

  const { kpis, charts, accounts, recentTransactions, advisor } = dashboardData

  return (
    <main className="page">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold text-foreground">Dashboard Summary</h1>
        <p className="mt-1 text-muted-foreground">Ringkasan lengkap keuangan dan analisis bulanan</p>
      </div>
      
      <div className="space-y-6">
        {/* KPI Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPIChip
            label="Total Income"
            value={formatIDR(kpis.totalIncome)}
            tone="ok"
          />
          <KPIChip
            label="Total Expenses"
            value={formatIDR(kpis.totalExpenses)}
            tone="warn"
          />
          <KPIChip
            label="Safe to Spend"
            value={formatIDR(kpis.safeToSpend)}
            tone="ok"
          />
          <KPIChip
            label="Balance"
            value={formatIDR(kpis.balance)}
            tone="ok"
          />
        </div>

        {/* Additional KPI Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <KPIChip
            label="Savings Rate"
            value={`${kpis.savingsRate.toFixed(1)}%`}
            tone="ok"
          />
          <KPIChip
            label="Budget Compliance"
            value={`${kpis.budgetCompliance.toFixed(1)}%`}
            tone={kpis.budgetCompliance >= 80 ? "ok" : "warn"}
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-foreground">Income vs Expenses Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <AreaChart data={charts.incomeExpense} />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-foreground">Category Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <CategoryDonut data={charts.categoryBreakdown} />
            </CardContent>
          </Card>
        </div>

        {/* Budget Compliance */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-foreground">Budget Compliance</CardTitle>
          </CardHeader>
          <CardContent>
            <BudgetCompliance data={charts.budgetAllocation} />
          </CardContent>
        </Card>

        {/* Bottom Row - Accounts, Transactions, Advisor */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-foreground">Account Balances</CardTitle>
            </CardHeader>
            <CardContent>
              <AccountBalance accounts={accounts} />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-foreground">Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <RecentTransactions transactions={recentTransactions} />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-foreground">Financial Advisor</CardTitle>
            </CardHeader>
            <CardContent>
              <MiniAdvisor data={advisor} />
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
