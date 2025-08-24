import { formatIDR } from '@/lib/format'

interface BudgetData {
  category: string
  actual: number
  target: number
  percentage: number
  color: string
}

interface BudgetComplianceProps {
  data: BudgetData[]
  className?: string
}

export function BudgetCompliance({ data, className }: BudgetComplianceProps) {
  return (
    <div className={className}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground">Budget Compliance</h3>
        <p className="text-sm text-muted-foreground">Kepatuhan terhadap alokasi budget 50/25/5/15/5</p>
      </div>
      
      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{item.category}</span>
              <span className="text-sm font-medium text-foreground">
                {item.percentage.toFixed(1)}%
              </span>
            </div>
            
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min(item.percentage, 100)}%`,
                  backgroundColor: item.color,
                }}
              />
            </div>
            
            <div className="flex justify-between text-xs text-[var(--txt-low)]">
              <span>Actual: {formatIDR(item.actual)}</span>
              <span>Target: {formatIDR(item.target)}</span>
            </div>
          </div>
        ))}
        
        <div className="pt-4 border-t border-border">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Overall Compliance</span>
            <span className="text-lg font-semibold text-[var(--success)]">
              {data.reduce((sum, item) => sum + item.percentage, 0) / data.length}%
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
