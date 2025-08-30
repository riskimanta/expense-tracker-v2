"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'

// Utility functions for formatting
const fmtIDR = (n: number) =>
  new Intl.NumberFormat("id-ID", { maximumFractionDigits: 0 }).format(n);

// Mock data types (adapt from existing data structure)
interface CashFlowData {
  date: string
  income: number
  expense: number
}

interface CategoryData {
  name: string
  value: number
  color: string
}

interface DashboardChartsProps {
  cashFlowData: CashFlowData[]
  categoryData: CategoryData[]
  selectedMonth: string
  selectedYear: string
}

export function DashboardCharts({ 
  cashFlowData, 
  categoryData, 
  selectedMonth, 
  selectedYear 
}: DashboardChartsProps) {
  // CSS Token colors
  const COLORS = {
    success: 'var(--success)',
    danger: 'var(--danger)',
    border: 'var(--border)',
    txtMed: 'var(--txt-med)',
    txtHigh: 'var(--txt-high)',
    surface: 'var(--surface)'
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Cash Flow Area Chart */}
      <Card className="rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)]" data-testid="chart-daily">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-[var(--txt-high)]">
            Arus Kas Harian
          </CardTitle>
          <p className="text-sm text-[var(--txt-med)]">
            Income vs Expense bulan {selectedMonth} {selectedYear}
          </p>
        </CardHeader>
        <CardContent>
          <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={cashFlowData}>
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke={COLORS.border}
                  opacity={0.3}
                />
                <XAxis 
                  dataKey="date" 
                  stroke={COLORS.txtMed}
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke={COLORS.txtMed}
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => fmtIDR(value)}
                  domain={[0, 'dataMax + 1000000']}
                  tickCount={6}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: COLORS.surface,
                    border: `1px solid ${COLORS.border}`,
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                  labelStyle={{ 
                    color: COLORS.txtHigh,
                    fontWeight: '600'
                  }}
                  formatter={(value: number, name: string) => [
                    `Rp ${fmtIDR(value)}`,
                    name === 'income' ? 'Income' : 'Expense'
                  ]}
                  labelFormatter={(label) => `Tanggal: ${label}`}
                />
                <Area 
                  type="monotone" 
                  dataKey="income" 
                  stackId="1"
                  stroke={COLORS.success} 
                  fill={COLORS.success} 
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
                <Area 
                  type="monotone" 
                  dataKey="expense" 
                  stackId="1"
                  stroke={COLORS.danger} 
                  fill={COLORS.danger} 
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Category Donut Chart */}
      <Card className="rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)]" data-testid="chart-donut">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-[var(--txt-high)]">
            Pengeluaran per Kategori
          </CardTitle>
          <p className="text-sm text-[var(--txt-med)]">
            Breakdown pengeluaran bulan {selectedMonth} {selectedYear}
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row items-center space-y-4 lg:space-y-0 lg:space-x-6">
            {/* Donut Chart */}
            <div className="w-[200px] h-[200px] flex-shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                    stroke={COLORS.border}
                    strokeWidth={1}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.color}
                        stroke={COLORS.border}
                        strokeWidth={1}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: COLORS.surface,
                      border: `1px solid ${COLORS.border}`,
                      borderRadius: '8px',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                    }}
                    formatter={(value: number) => [`${value}%`, 'Persentase']}
                    labelStyle={{ color: COLORS.txtHigh }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Legend */}
            <div className="flex-1 space-y-3 min-w-0">
              {categoryData.map((category, index) => (
                <div key={index} className="flex items-center justify-between group">
                  <div className="flex items-center space-x-3 min-w-0">
                    <div 
                      className="w-4 h-4 rounded-full flex-shrink-0 shadow-sm"
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="text-sm text-[var(--txt-high)] font-medium truncate">
                      {category.name}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-[var(--txt-high)] ml-2 flex-shrink-0">
                    {category.value}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
