"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/cn'

interface BudgetComplianceProps {
  data: Array<{
    category: string
    target: number
    actual: number
    percentage: number
    status: 'on-track' | 'over-budget' | 'under-budget'
  }>
}

export function BudgetCompliance({ data }: BudgetComplianceProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'over-budget':
        return 'text-[var(--danger)]'
      case 'under-budget':
        return 'text-[var(--success)]'
      default:
        return 'text-[var(--txt-high)]'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'over-budget':
        return '⚠️'
      case 'under-budget':
        return '✅'
      default:
        return '📊'
    }
  }

  return (
    <Card className="rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-[color:var(--txt-1)]">
          Budget Compliance
        </CardTitle>
        <p className="text-sm text-[color:var(--txt-2)]">
          Aturan 50/25/5/15/5 (Needs/Wants/Savings/Invest/Coins)
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {data.map((item, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm">{getStatusIcon(item.status)}</span>
                <span className={cn(
                  "text-sm font-medium",
                  getStatusColor(item.status)
                )}>
                  {item.category}
                </span>
              </div>
              <span className="text-sm text-[color:var(--txt-2)]">
                {item.percentage}%
              </span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-[color:var(--txt-2)]">
                <span>Target: {item.target}%</span>
                <span>Actual: {item.actual}%</span>
              </div>
              <Progress 
                value={item.actual} 
                max={item.target}
                className="h-2"
              />
            </div>
          </div>
        ))}
        
        <div className="mt-4 rounded-lg bg-[color:var(--surface-2)] p-3">
          <p className="text-xs text-[color:var(--txt-2)]">
            <strong>Ringkasan:</strong> {data.filter(d => d.status === 'over-budget').length} kategori over-budget, 
            {data.filter(d => d.status === 'under-budget').length} kategori under-budget, 
            {data.filter(d => d.status === 'on-track').length} kategori on-track.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
