import { AreaChart as RechartsAreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { formatIDR, formatDateShort } from '@/lib/format'

interface ChartData {
  date: string
  income: number
  expense: number
}

interface AreaChartProps {
  data: ChartData[]
  className?: string
}

export function AreaChart({ data, className }: AreaChartProps) {
  return (
    <div className={className}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-[color:var(--txt-1)]">Income vs Expenses</h3>
        <p className="text-sm text-[color:var(--txt-2)]">Trend bulanan pemasukan dan pengeluaran</p>
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <RechartsAreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis 
            dataKey="date" 
            tickFormatter={formatDateShort}
            stroke="var(--txt-med)"
            fontSize={12}
          />
          <YAxis 
            stroke="var(--txt-med)"
            fontSize={12}
            tickFormatter={(value) => formatIDR(value).replace('IDR', '')}
            domain={[0, 'dataMax + 1000000']}
            tickCount={6}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              color: 'var(--txt-high)',
            }}
            formatter={(value: number, name: string) => [
              formatIDR(value),
              name === 'income' ? 'Income' : 'Expense'
            ]}
            labelFormatter={formatDateShort}
          />
          <Area
            type="monotone"
            dataKey="income"
            stackId="1"
            stroke="var(--success)"
            fill="var(--success)"
            fillOpacity={0.2}
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="expense"
            stackId="1"
            stroke="var(--danger)"
            fill="var(--danger)"
            fillOpacity={0.2}
            strokeWidth={2}
          />
        </RechartsAreaChart>
      </ResponsiveContainer>
    </div>
  )
}
