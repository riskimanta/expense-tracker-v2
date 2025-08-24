"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatIDR } from '@/lib/format'
import { formatDateShort } from '@/lib/format'
import { cn } from '@/lib/cn'

interface RecentTransactionsProps {
  data: Array<{
    id: string
    date: string
    description: string
    amount: number
    type: 'income' | 'expense' | 'transfer'
    account: string
    category?: string
  }>
}

export function RecentTransactions({ data }: RecentTransactionsProps) {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'income':
        return '📈'
      case 'expense':
        return '📉'
      case 'transfer':
        return '🔄'
      default:
        return '📊'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'income':
        return 'text-[var(--success)]'
      case 'expense':
        return 'text-[var(--danger)]'
      case 'transfer':
        return 'text-[var(--warning)]'
      default:
        return 'text-foreground'
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'income':
        return 'Pemasukan'
      case 'expense':
        return 'Pengeluaran'
      case 'transfer':
        return 'Transfer'
      default:
        return 'Unknown'
    }
  }

  return (
    <Card className="rounded-xl border border-border bg-card p-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-foreground">
          Transaksi Terbaru
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {data.length} transaksi terakhir
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {data.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center space-x-3 p-3 rounded-lg border border-border bg-muted hover:bg-card transition-colors"
            >
              <div className="text-lg">{getTypeIcon(transaction.type)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground truncate">
                      {transaction.description}
                    </p>
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <span>{formatDateShort(transaction.date)}</span>
                      <span>•</span>
                      <span>{transaction.account}</span>
                      {transaction.category && (
                        <>
                          <span>•</span>
                          <span>{transaction.category}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="text-right ml-3">
                    <p className={cn(
                      "text-sm font-semibold",
                      getTypeColor(transaction.type)
                    )}>
                      {transaction.type === 'expense' ? '-' : '+'}
                      {formatIDR(Math.abs(transaction.amount))}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {getTypeLabel(transaction.type)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {data.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Belum ada transaksi</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
