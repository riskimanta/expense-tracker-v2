"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, FolderOpen, Wallet, PiggyBank, Coins, TrendingUp } from 'lucide-react'

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-foreground">Admin Dashboard</h1>
        <p className="text-[var(--txt-med)] mt-1">Ringkasan sistem dan statistik</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="rounded-xl border border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[var(--txt-med)]">
              Total Users
            </CardTitle>
            <Users className="h-4 w-4 text-[var(--txt-low)]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">3</div>
            <p className="text-xs text-[var(--txt-low)]">
              +2 dari bulan lalu
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-xl border border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[var(--txt-med)]">
              Categories
            </CardTitle>
            <FolderOpen className="h-4 w-4 text-[var(--txt-low)]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">5</div>
            <p className="text-xs text-[var(--txt-low)]">
              3 expense, 2 income
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-xl border border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[var(--txt-med)]">
              Accounts
            </CardTitle>
            <Wallet className="h-4 w-4 text-[var(--txt-low)]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">4</div>
            <p className="text-xs text-[var(--txt-low)]">
              1 cash, 2 bank, 1 wallet
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-xl border border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[var(--txt-med)]">
              Budget Rules
            </CardTitle>
            <PiggyBank className="h-4 w-4 text-[var(--txt-low)]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">1</div>
            <p className="text-xs text-[var(--txt-low)]">
              Default 50/25/15/5/5
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-xl border border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[var(--txt-med)]">
              Currencies
            </CardTitle>
            <Coins className="h-4 w-4 text-[var(--txt-low)]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">4</div>
            <p className="text-xs text-[var(--txt-low)]">
              IDR, USD, EUR, SGD
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-xl border border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[var(--txt-med)]">
              System Status
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-[var(--txt-low)]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[var(--success)]">Online</div>
            <p className="text-xs text-[var(--txt-low)]">
              Semua sistem berjalan normal
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="rounded-xl border border-border bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border border-border rounded-lg hover:bg-[var(--surface)] transition-colors cursor-pointer">
              <h3 className="font-medium text-foreground mb-2">Tambah User Baru</h3>
              <p className="text-sm text-[var(--txt-med)]">Buat akun user baru</p>
            </div>
            <div className="p-4 border border-border rounded-lg hover:bg-[var(--surface)] transition-colors cursor-pointer">
              <h3 className="font-medium text-foreground mb-2">Buat Category</h3>
              <p className="text-sm text-[var(--txt-med)]">Tambah kategori baru</p>
            </div>
            <div className="p-4 border border-border rounded-lg hover:bg-[var(--surface)] transition-colors cursor-pointer">
              <h3 className="font-medium text-foreground mb-2">Update Budget</h3>
              <p className="text-sm text-[var(--txt-med)]">Ubah aturan budget</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
