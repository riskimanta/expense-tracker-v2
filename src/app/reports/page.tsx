"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { formatIDR } from '@/lib/format'
// Mock data moved inline
const mockMonthlyKPI = {
  totalIncome: 8000000,
  totalExpense: 5500000,
  netIncome: 2500000,
  savingsRate: 31.25,
  topCategory: 'Makanan',
  topCategoryAmount: 2000000
}

const mockCategoryBreakdown = [
  { name: 'Makanan', value: 2000000, color: '#ef4444', category: 'Makanan', amount: 2000000, percentage: 36.4 },
  { name: 'Transport', value: 800000, color: '#3b82f6', category: 'Transport', amount: 800000, percentage: 14.5 },
  { name: 'Hiburan', value: 500000, color: '#10b981', category: 'Hiburan', amount: 500000, percentage: 9.1 },
  { name: 'Belanja', value: 400000, color: '#f59e0b', category: 'Belanja', amount: 400000, percentage: 7.3 },
  { name: 'Lainnya', value: 200000, color: '#8b5cf6', category: 'Lainnya', amount: 200000, percentage: 3.6 }
]

const mockMonthlyData = [
  { month: 'Jan', income: 8000000, expense: 5500000 },
  { month: 'Feb', income: 7500000, expense: 5200000 },
  { month: 'Mar', income: 8200000, expense: 5800000 },
  { month: 'Apr', income: 7800000, expense: 5400000 },
  { month: 'Mei', income: 8100000, expense: 5600000 },
  { month: 'Jun', income: 7900000, expense: 5300000 }
]
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

export default function ReportsPage() {
  const COLORS = {
    needs: 'var(--needs)',
    wants: 'var(--wants)',
    savings: 'var(--savings)',
    invest: 'var(--invest)',
    coins: 'var(--coins)',
    success: 'var(--success)',
    danger: 'var(--danger)',
    primary: 'var(--primary)'
  }

  return (
    <main className="mx-auto max-w-[1200px] p-6 space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-semibold text-[color:var(--txt-1)]">Laporan</h1>
        <p className="mt-1 text-[color:var(--txt-2)]">Analisis keuangan dan laporan bulanan</p>
      </div>

      {/* Filter Bar */}
      <Card className="rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div>
              <label className="text-sm text-[color:var(--txt-2)]">Bulan</label>
              <Select defaultValue="2025-08">
                <SelectTrigger className="h-9 w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2025-08">Agustus 2025</SelectItem>
                  <SelectItem value="2025-07">Juli 2025</SelectItem>
                  <SelectItem value="2025-06">Juni 2025</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm text-[color:var(--txt-2)]">Akun</label>
              <Select defaultValue="all">
                <SelectTrigger className="h-9 w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Akun</SelectItem>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="bank">Bank</SelectItem>
                  <SelectItem value="ewallet">E-Wallet</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Badge variant="outline" className="text-xs">
            User = 1
          </Badge>
        </div>
      </Card>

      {/* Monthly KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-5">
          <div className="space-y-2">
            <p className="text-sm text-[color:var(--txt-2)]">Total Pemasukan</p>
            <p className="text-2xl font-semibold text-[var(--success)]">
              {formatIDR(mockMonthlyKPI.totalIncome)}
            </p>
          </div>
        </Card>
        
        <Card className="rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-5">
          <div className="space-y-2">
            <p className="text-sm text-[color:var(--txt-2)]">Total Pengeluaran</p>
            <p className="text-2xl font-semibold text-[var(--danger)]">
              {formatIDR(mockMonthlyKPI.totalExpense)}
            </p>
          </div>
        </Card>
        
        <Card className="rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-5">
          <div className="space-y-2">
            <p className="text-sm text-[color:var(--txt-2)]">Pendapatan Bersih</p>
            <p className="text-2xl font-semibold text-[var(--primary)]">
              {formatIDR(mockMonthlyKPI.netIncome)}
            </p>
          </div>
        </Card>
        
        <Card className="rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-5">
          <div className="space-y-2">
            <p className="text-sm text-[color:var(--txt-2)]">Tingkat Tabungan</p>
            <p className="text-2xl font-semibold text-[var(--success)]">
              {mockMonthlyKPI.savingsRate}%
            </p>
          </div>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-12 gap-6">
        {/* Category Donut Chart */}
        <Card className="col-span-12 lg:col-span-5 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-6">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Pengeluaran per Kategori</CardTitle>
            <p className="text-sm text-[color:var(--txt-2)]">
              Top category: {mockMonthlyKPI.topCategory} ({formatIDR(mockMonthlyKPI.topCategoryAmount)})
            </p>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-6">
              <div className="w-32 h-32">
                <PieChart width={128} height={128}>
                  <Pie
                    data={mockCategoryBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={60}
                    paddingAngle={2}
                    dataKey="amount"
                  >
                    {mockCategoryBreakdown.map((entry, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </div>
              
              <div className="flex-1 space-y-2">
                                 {mockCategoryBreakdown.map((category, index: number) => (
                   <div key={index} className="flex items-center justify-between">
                     <div className="flex items-center space-x-2">
                       <div 
                         className="w-3 h-3 rounded-full" 
                         style={{ backgroundColor: category.color }}
                       />
                       <span className="text-sm text-[color:var(--txt-1)]">{category.category}</span>
                     </div>
                     <div className="text-right">
                       <p className="text-sm font-medium text-[color:var(--txt-1)]">
                         {formatIDR(category.amount)}
                       </p>
                       <p className="text-xs text-[color:var(--txt-2)]">
                         {category.percentage}%
                       </p>
                     </div>
                   </div>
                 ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 12 Month Bar Chart */}
        <Card className="col-span-12 lg:col-span-7 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-6">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">12 Bulan Terakhir</CardTitle>
            <p className="text-sm text-[color:var(--txt-2)]">
              Tren pemasukan vs pengeluaran bulanan
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <BarChart width={600} height={256} data={mockMonthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis 
                  dataKey="month" 
                  stroke="var(--txt-med)"
                  fontSize={12}
                />
                <YAxis 
                  stroke="var(--txt-med)"
                  fontSize={12}
                  tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    color: 'var(--txt-high)'
                  }}
                  formatter={(value: number) => [formatIDR(value), '']}
                  labelStyle={{ color: 'var(--txt-med)' }}
                />
                <Legend />
                <Bar 
                  dataKey="income" 
                  fill={COLORS.success} 
                  name="Pemasukan"
                  radius={[4, 4, 0, 0]}
                />
                <Bar 
                  dataKey="expense" 
                  fill={COLORS.danger} 
                  name="Pengeluaran"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary Stats */}
      <Card className="rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-6">
        <CardHeader>
          <CardTitle className="text-lg">Ringkasan Analisis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-[var(--success)]">
                {mockMonthlyKPI.savingsRate}%
              </p>
              <p className="text-sm text-[color:var(--txt-2)]">Tingkat Tabungan</p>
              <p className="text-xs text-[var(--txt-low)] mt-1">
                {mockMonthlyKPI.savingsRate >= 20 ? 'Excellent' : mockMonthlyKPI.savingsRate >= 10 ? 'Good' : 'Needs improvement'}
              </p>
            </div>
            
            <div className="text-center">
              <p className="text-2xl font-bold text-[var(--warning)]">
                {mockMonthlyKPI.topCategory}
              </p>
              <p className="text-sm text-[color:var(--txt-2)]">Kategori Terbesar</p>
              <p className="text-xs text-[var(--txt-low)] mt-1">
                {formatIDR(mockMonthlyKPI.topCategoryAmount)} ({((mockMonthlyKPI.topCategoryAmount / mockMonthlyKPI.totalExpense) * 100).toFixed(1)}%)
              </p>
            </div>
            
            <div className="text-center">
              <p className="text-2xl font-bold text-[var(--primary)]">
                {formatIDR(mockMonthlyKPI.netIncome)}
              </p>
              <p className="text-sm text-[color:var(--txt-2)]">Pendapatan Bersih</p>
              <p className="text-xs text-[var(--txt-low)] mt-1">
                {((mockMonthlyKPI.netIncome / mockMonthlyKPI.totalIncome) * 100).toFixed(1)}% dari pemasukan
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
