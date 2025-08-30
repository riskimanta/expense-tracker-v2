"use client"

import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, FolderOpen, Wallet, PiggyBank, Coins, TrendingUp } from 'lucide-react'
import { getUsers } from '@/api/users'
import { getCategories } from '@/api/categories'
import { getAccounts } from '@/api/accounts'
import { getBudgetRules } from '@/api/budgets'
import { getCurrencies } from '@/api/currencies'

export default function AdminDashboardPage() {
  // Fetch real data
  const { data: users = [] } = useQuery({
    queryKey: ['admin-users'],
    queryFn: getUsers
  })

  const { data: categories = [] } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: getCategories
  })

  const { data: accounts = [] } = useQuery({
    queryKey: ['admin-accounts'],
    queryFn: getAccounts
  })

  const { data: budgetRules = [] } = useQuery({
    queryKey: ['admin-budgets'],
    queryFn: getBudgetRules
  })

  const { data: currencies = [] } = useQuery({
    queryKey: ['admin-currencies'],
    queryFn: getCurrencies
  })

  // Calculate stats
  const totalUsers = users.length
  const totalCategories = categories.length
  const totalAccounts = accounts.length
  const totalBudgetRules = budgetRules.length
  const totalCurrencies = currencies.length

  // Calculate category breakdown
  const expenseCategories = categories.filter(cat => cat.type === 'expense').length
  const incomeCategories = categories.filter(cat => cat.type === 'income').length

  // Calculate account breakdown
  const cashAccounts = accounts.filter(acc => acc.type === 'cash').length
  const bankAccounts = accounts.filter(acc => acc.type === 'bank').length
  const walletAccounts = accounts.filter(acc => acc.type === 'ewallet').length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-[color:var(--txt-1)]">Admin Dashboard</h1>
        <p className="text-[var(--txt-med)] mt-1">Ringkasan sistem dan statistik</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[var(--txt-med)]">
              Total Users
            </CardTitle>
            <Users className="h-4 w-4 text-[var(--txt-low)]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[color:var(--txt-1)]">{totalUsers}</div>
            <p className="text-xs text-[var(--txt-low)]">
              {totalUsers > 0 ? `${totalUsers} user aktif` : 'Belum ada user'}
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[var(--txt-med)]">
              Categories
            </CardTitle>
            <FolderOpen className="h-4 w-4 text-[var(--txt-low)]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[color:var(--txt-1)]">{totalCategories}</div>
            <p className="text-xs text-[var(--txt-low)]">
              {expenseCategories} expense, {incomeCategories} income
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[var(--txt-med)]">
              Accounts
            </CardTitle>
            <Wallet className="h-4 w-4 text-[var(--txt-low)]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[color:var(--txt-1)]">{totalAccounts}</div>
            <p className="text-xs text-[var(--txt-low)]">
              {cashAccounts} cash, {bankAccounts} bank, {walletAccounts} wallet
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[var(--txt-med)]">
              Budget Rules
            </CardTitle>
            <PiggyBank className="h-4 w-4 text-[var(--txt-low)]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[color:var(--txt-1)]">{totalBudgetRules}</div>
            <p className="text-xs text-[var(--txt-low)]">
              {totalBudgetRules > 0 ? 'Default 50/25/15/5/5' : 'Belum ada budget rule'}
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[var(--txt-med)]">
              Currencies
            </CardTitle>
            <Coins className="h-4 w-4 text-[var(--txt-low)]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[color:var(--txt-1)]">{totalCurrencies}</div>
            <p className="text-xs text-[var(--txt-low)]">
              {totalCurrencies > 0 ? `${totalCurrencies} mata uang aktif` : 'Belum ada currency'}
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)]">
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
      <Card className="rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)]">
        <CardHeader>
          <CardTitle className="text-[color:var(--txt-1)]">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border border-[color:var(--border)] rounded-lg hover:bg-[var(--surface)] transition-colors cursor-pointer">
              <h3 className="font-medium text-[color:var(--txt-1)] mb-2">Tambah User Baru</h3>
              <p className="text-sm text-[var(--txt-med)]">Buat akun user baru</p>
            </div>
            <div className="p-4 border border-[color:var(--border)] rounded-lg hover:bg-[var(--surface)] transition-colors cursor-pointer">
              <h3 className="font-medium text-[color:var(--txt-1)] mb-2">Buat Category</h3>
              <p className="text-sm text-[var(--txt-med)]">Tambah kategori baru</p>
            </div>
            <div className="p-4 border border-[color:var(--border)] rounded-lg hover:bg-[var(--surface)] transition-colors cursor-pointer">
              <h3 className="font-medium text-[color:var(--txt-1)] mb-2">Update Budget</h3>
              <p className="text-sm text-[var(--txt-med)]">Ubah aturan budget</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
