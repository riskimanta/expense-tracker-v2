"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatIDR } from "@/lib/format"
import { getTransactions, getCategories } from "@/mock/data"
import type { Transaction, Category } from "@/mock/data"

export default function ReportsPage() {
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
      <main className="page">
        <div className="mb-6">
          <h1 className="text-3xl font-semibold text-foreground">Reports</h1>
          <p className="mt-1 text-muted-foreground">Loading reports...</p>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="page">
        <div className="mb-6">
          <h1 className="text-3xl font-semibold text-foreground">Reports</h1>
        </div>
        <div className="p-4 bg-[var(--danger)] bg-opacity-10 border border-[var(--danger)] rounded-lg">
          <p className="text-sm text-[var(--danger)] text-center">{error}</p>
        </div>
      </main>
    )
  }

  return (
    <main className="page">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold text-foreground">Reports</h1>
        <p className="mt-1 text-muted-foreground">Analisis dan laporan keuangan</p>
      </div>
      
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-foreground">Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <p>Reports feature coming soon...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
