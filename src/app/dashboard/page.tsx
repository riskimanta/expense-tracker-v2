"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from 'recharts'
import { formatIDR } from '@/lib/format'
import { 
  mockDashboardKPIs, 
  mockAccountBalances, 
  mockRecentTransactions, 
  mockBudgetCompliance,
  mockCashFlowData,
  mockCategoryExpenses
} from '@/mock/dashboard'
import { BudgetCompliance } from '@/components/BudgetCompliance'
import { AccountBalance } from '@/components/AccountBalance'
import { RecentTransactions } from '@/components/RecentTransactions'
import { MiniAdvisor } from '@/components/MiniAdvisor'

export default function DashboardPage() {
  const COLORS = {
    needs: 'var(--needs)',
    wants: 'var(--wants)',
    savings: 'var(--savings)',
    invest: 'var(--invest)',
    coins: 'var(--coins)',
    success: 'var(--success)',
    danger: 'var(--danger)',
    primary: 'var(--primary)',
    muted: 'var(--txt-med)'
  }

  return (
    <main className="mx-auto max-w-[1200px] p-6 space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-semibold text-foreground">Dashboard Summary</h1>
        <p className="mt-1 text-muted-foreground">Ringkasan keuangan bulan Januari 2025</p>
      </div>

      {/* Toolbar */}
      <Card className="rounded-xl border border-border bg-card p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div>
              <label className="text-sm text-muted-foreground">Bulan</label>
              <Input type="month" defaultValue="2025-01" className="w-32" />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Akun</label>
              <Select defaultValue="all">
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Pilih akun" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua akun</SelectItem>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="bca">BCA</SelectItem>
                  <SelectItem value="ovo">OVO</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Badge variant="outline" className="text-[var(--txt-low)]">
            User = 1
          </Badge>
        </div>
      </Card>

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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cash Flow Area Chart */}
        <Card className="rounded-xl border border-border bg-card p-4">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-foreground">
              Arus Kas Harian
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Income vs Expense bulan ini
            </p>
          </CardHeader>
          <CardContent>
            <div className="w-full h-[300px]">
              <AreaChart width={800} height={300} data={mockCashFlowData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis 
                  dataKey="date" 
                  stroke="var(--txt-med)"
                  fontSize={12}
                />
                <YAxis 
                  stroke="var(--txt-med)"
                  fontSize={12}
                  tickFormatter={(value) => formatIDR(value).replace('Rp', '')}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: '12px'
                  }}
                  labelStyle={{ color: 'var(--txt-high)' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="income" 
                  stackId="1"
                  stroke={COLORS.success} 
                  fill={COLORS.success} 
                  fillOpacity={0.6}
                />
                <Area 
                  type="monotone" 
                  dataKey="expense" 
                  stackId="1"
                  stroke={COLORS.danger} 
                  fill={COLORS.danger} 
                  fillOpacity={0.6}
                />
              </AreaChart>
            </div>
          </CardContent>
        </Card>

        {/* Category Donut Chart */}
        <Card className="rounded-xl border border-border bg-card p-4">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-foreground">
              Pengeluaran per Kategori
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Breakdown pengeluaran bulan ini
            </p>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <div className="w-[200px] h-[200px]">
                <PieChart width={200} height={200}>
                  <Pie
                    data={mockCategoryExpenses}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {mockCategoryExpenses.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </div>
              <div className="flex-1 space-y-2">
                {mockCategoryExpenses.map((category, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                      <span className="text-sm text-foreground">{category.name}</span>
                    </div>
                    <span className="text-sm font-medium text-foreground">
                      {category.value}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

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
