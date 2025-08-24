"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { PieChart, Pie, Cell } from 'recharts'
import { formatIDR } from '@/lib/format'
import { getCurrencyOptions } from '@/lib/currency'
import { formatDateID } from '@/lib/format'
import { 
  mockExpenseKPIs, 
  mockExpenseCategories, 
  mockExpenseTransactions,
  mockBudgetAllocation
} from '@/mock/expenses'
import { useToast } from '@/components/ToastProvider'

export default function ExpensesPage() {
  const [selectedMonth, setSelectedMonth] = useState('2025-01')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [isSplitMode, setIsSplitMode] = useState(false)
  const [formData, setFormData] = useState({
    date: '2025-01-18',
    category: '',
    amount: '',
    description: '',
    account: '1',
    currency: 'IDR'
  })
  const { showToast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.category || !formData.amount || !formData.description) {
      showToast({
        title: 'Error',
        description: 'Semua field harus diisi',
        variant: 'destructive'
      })
      return
    }

    // Mock submission
    showToast({
      title: 'Sukses!',
      description: 'Pengeluaran berhasil ditambahkan',
      variant: 'success'
    })

    // Reset form
    setFormData({
      date: '2025-01-18',
      category: '',
      amount: '',
      description: '',
      account: '1',
      currency: 'IDR'
    })
  }



  return (
    <main className="mx-auto max-w-[1200px] p-6 space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-semibold text-foreground">Pengeluaran</h1>
        <p className="mt-1 text-muted-foreground">Kelola pengeluaran dan budget bulanan</p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="rounded-xl border border-border bg-card p-5">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Total Pengeluaran</p>
            <p className="text-2xl font-semibold text-[var(--danger)]">
              {formatIDR(mockExpenseKPIs.totalSpent)}
            </p>
            <p className="text-xs text-muted-foreground">
              {mockExpenseKPIs.daysRemaining} hari tersisa
            </p>
          </div>
        </Card>
        
        <Card className="rounded-xl border border-border bg-card p-5">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Budget Bulanan</p>
            <p className="text-2xl font-semibold text-foreground">
              {formatIDR(mockExpenseKPIs.monthlyBudget)}
            </p>
            <p className="text-xs text-muted-foreground">
              Sisa: {formatIDR(mockExpenseKPIs.remainingBudget)}
            </p>
          </div>
        </Card>
        
        <Card className="rounded-xl border border-border bg-card p-5">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Kategori Teratas</p>
            <p className="text-2xl font-semibold text-[var(--needs)]">
              {mockExpenseKPIs.topCategory}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatIDR(mockExpenseKPIs.topCategoryAmount)}
            </p>
          </div>
        </Card>
        
        <Card className="rounded-xl border border-border bg-card p-5">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Rata-rata Harian</p>
            <p className="text-2xl font-semibold text-foreground">
              {formatIDR(mockExpenseKPIs.averageDaily)}
            </p>
            <p className="text-xs text-muted-foreground">
              Per hari
            </p>
          </div>
        </Card>
      </div>

      {/* Filter Bar */}
      <Card className="rounded-xl border border-border bg-card p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div>
              <label className="text-sm text-muted-foreground">Bulan</label>
              <Input 
                type="month" 
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-32" 
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Filter Kategori</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Semua kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua kategori</SelectItem>
                  {mockExpenseCategories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Badge variant="outline" className="text-[var(--txt-low)]">
            User = 1
          </Badge>
        </div>
      </Card>

      {/* Form + Budget Section */}
      <div className="grid grid-cols-12 gap-6">
        {/* Form Card */}
        <Card className="col-span-12 lg:col-span-7 rounded-xl border border-border bg-card p-4">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-foreground">
                Tambah Pengeluaran
              </CardTitle>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">Split this transaction</span>
                <Switch 
                  checked={isSplitMode}
                  onCheckedChange={setIsSplitMode}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground">Tanggal</label>
                  <Input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="h-11"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Kategori</label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Pilih kategori" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockExpenseCategories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground">Jumlah</label>
                  <Input
                    type="text"
                    placeholder="50000"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    className="h-11"
                  />
                  <p className="text-xs text-[var(--txt-low)] mt-1">
                    Contoh: 50000 = Rp 50.000
                  </p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Mata Uang</label>
                  <Select value={formData.currency || 'IDR'} onValueChange={(value) => setFormData({...formData, currency: value})}>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Pilih mata uang" />
                    </SelectTrigger>
                    <SelectContent>
                      {getCurrencyOptions().map((currency) => (
                        <SelectItem key={currency.value} value={currency.value}>
                          {currency.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <label className="text-sm text-muted-foreground">Catatan</label>
                <Textarea
                  placeholder="Deskripsi pengeluaran..."
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="min-h-[88px]"
                />
              </div>
              
              <Button type="submit" className="w-full h-11">
                Simpan
              </Button>
              
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="h-9"
                  onClick={() => showToast({
                    title: 'Loading...',
                    description: 'Simulasi loading state',
                    variant: 'default'
                  })}
                >
                  Test Loading
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  className="h-9"
                  onClick={() => showToast({
                    title: 'Error',
                    description: 'Simulasi error state',
                    variant: 'destructive'
                  })}
                >
                  Test Error
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Budget Allocation Card */}
        <Card className="col-span-12 lg:col-span-5 rounded-xl border border-border bg-card p-4">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-foreground">
              Budget Allocation
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Aturan 50/25/5/15/5
            </p>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <div className="w-[140px] h-[140px]">
                <PieChart width={140} height={140}>
                  <Pie
                    data={mockBudgetAllocation}
                    cx="50%"
                    cy="50%"
                    innerRadius={42}
                    outerRadius={70}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {mockBudgetAllocation.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </div>
              <div className="flex-1 space-y-2">
                {mockBudgetAllocation.slice(0, 3).map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm text-foreground">{item.name}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {item.value}%
                    </span>
                  </div>
                ))}
                <div className="text-xs text-[var(--txt-low)]">
                  +2 more 20%
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transactions Table */}
      <Card className="rounded-xl border border-border bg-card p-4">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-foreground">
            Daftar Transaksi
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Transaksi bulan {selectedMonth}
          </p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-xs uppercase font-medium text-muted-foreground">
                    Tanggal
                  </th>
                  <th className="text-left py-3 px-4 text-xs uppercase font-medium text-muted-foreground">
                    Kategori
                  </th>
                  <th className="text-right py-3 px-4 text-xs uppercase font-medium text-muted-foreground">
                    Jumlah
                  </th>
                  <th className="text-left py-3 px-4 text-xs uppercase font-medium text-muted-foreground">
                    Catatan
                  </th>
                  <th className="text-left py-3 px-4 text-xs uppercase font-medium text-muted-foreground">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {mockExpenseTransactions.map((transaction, index) => (
                  <tr 
                    key={transaction.id}
                    className={`border-b border-border ${
                      index % 2 === 0 ? "bg-card" : "bg-muted"
                    }`}
                  >
                    <td className="py-3 px-4 text-sm text-foreground">
                      {formatDateID(transaction.date)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-foreground">
                          {transaction.category}
                        </span>
                        {transaction.splitCount && transaction.splitCount > 1 && (
                          <Badge variant="outline" className="text-xs">
                            Split ×{transaction.splitCount}
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-sm font-medium text-[var(--danger)]">
                        -{formatIDR(transaction.amount)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-foreground">
                      {transaction.description}
                    </td>
                    <td className="py-3 px-4">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        🗑️
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}