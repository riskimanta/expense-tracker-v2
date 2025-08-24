"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { KPIChip } from "@/components/KPIChip"
import { FilterBar } from "@/components/FilterBar"
import { ExpenseForm } from "@/components/ExpenseForm"
import { BudgetMeter } from "@/components/BudgetMeter"
import { TransactionsTable } from "@/components/TransactionsTable"
import { getTransactions, getCategories } from "@/mock/data"
import type { Transaction, Category } from "@/mock/data"

export default function ExpensesPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)
        const [transactionsData, categoriesData] = await Promise.all([
          getTransactions(),
          getCategories(),
        ])
        setTransactions(transactionsData)
        setCategories(categoriesData)
      } catch {
        setError("Gagal memuat data")
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  if (isLoading) {
    return (
      <main className="mx-auto max-w-[1200px] p-6 space-y-6">
        <div className="mb-6">
          <h1 className="text-3xl font-semibold text-foreground">Expenses</h1>
          <p className="mt-1 text-muted-foreground">Loading...</p>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="mx-auto max-w-[1200px] p-6 space-y-6">
        <div className="mb-6">
          <h1 className="text-3xl font-semibold text-foreground">Expenses</h1>
        </div>
        <div className="p-4 bg-[var(--danger)] bg-opacity-10 border border-[var(--danger)] rounded-lg">
          <p className="text-sm text-[var(--danger)] text-center">{error}</p>
        </div>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-[1200px] p-6 space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold text-foreground">Expenses</h1>
        <p className="mt-1 text-muted-foreground">Kelola dan monitor pengeluaran bulanan</p>
      </div>
      
      <div className="space-y-6">
        {/* KPI Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPIChip
            label="Total Pengeluaran"
            value="Rp 6.200.000"
            tone="warn"
          />
          <KPIChip
            label="Budget Tersisa"
            value="Rp 1.800.000"
            tone="ok"
          />
          <KPIChip
            label="Penghematan"
            value="Rp 800.000"
            tone="ok"
          />
          <KPIChip
            label="Overspending"
            value="Rp 0"
            tone="ok"
          />
        </div>

        {/* Filter Bar */}
        <FilterBar
          selectedMonth="2025-08"
          selectedCategory=""
          categories={categories}
          onMonthChange={() => {}}
          onCategoryChange={() => {}}
        />

        {/* Form + Budget Section */}
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-7">
            <Card className="rounded-xl border border-border bg-card">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg text-foreground">Tambah Pengeluaran</CardTitle>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">Split this transaction</span>
                  <div className="w-10 h-6 bg-muted rounded-full relative cursor-pointer">
                    <div className="w-4 h-4 bg-foreground rounded-full absolute top-1 left-1 transition-transform"></div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <ExpenseForm
                  categories={categories}
                  onSubmit={async () => {}}
                />
              </CardContent>
            </Card>
          </div>
          
          <div className="col-span-12 lg:col-span-5">
            <Card className="rounded-xl border border-border bg-card">
              <CardHeader>
                <CardTitle className="text-lg text-foreground">Budget Allocation</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <BudgetMeter />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Transactions Table */}
        <Card className="rounded-xl border border-border bg-card">
          <CardHeader>
            <CardTitle className="text-lg text-foreground">Daftar Transaksi</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <TransactionsTable transactions={transactions} />
          </CardContent>
        </Card>
      </div>
    </main>
  )
}