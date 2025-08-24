import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { formatIDR } from '@/lib/format'

interface CategoryData {
  category: string
  amount: number
  percentage: number
  color: string
}

interface CategoryDonutProps {
  data: CategoryData[]
  className?: string
}

export function CategoryDonut({ data, className }: CategoryDonutProps) {
  return (
    <div className={className}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground">Category Breakdown</h3>
        <p className="text-sm text-muted-foreground">Distribusi pengeluaran per kategori</p>
      </div>
      
      <div className="flex items-center space-x-6">
        <div className="flex-shrink-0">
          <ResponsiveContainer width={160} height={160}>
            <PieChart>
              <Pie
                data={data}
                cx={80}
                cy={80}
                innerRadius={48}
                outerRadius={80}
                paddingAngle={2}
                dataKey="amount"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => [formatIDR(value), 'Amount']}
                contentStyle={{
                  backgroundColor: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  color: 'var(--txt-high)',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="flex-1 space-y-3">
          {data.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-muted-foreground">{item.category}</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-foreground">
                  {formatIDR(item.amount)}
                </div>
                <div className="text-xs text-[var(--txt-low)]">
                  {item.percentage.toFixed(1)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
