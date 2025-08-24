"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatIDR } from '@/lib/format'
import { cn } from '@/lib/cn'

interface AccountBalanceProps {
  data: Array<{
    id: string
    name: string
    type: 'cash' | 'bank' | 'ewallet'
    balance: number
    currency: string
    icon: string
  }>
}

export function AccountBalance({ data }: AccountBalanceProps) {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'cash':
        return 'border-[var(--success)] bg-[var(--success)]/10'
      case 'bank':
        return 'border-[var(--primary)] bg-[var(--primary)]/10'
      case 'ewallet':
        return 'border-[var(--warning)] bg-[var(--warning)]/10'
      default:
        return 'border-border bg-muted'
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'cash':
        return 'Cash'
      case 'bank':
        return 'Bank'
      case 'ewallet':
        return 'E-Wallet'
      default:
        return 'Unknown'
    }
  }

  return (
    <Card className="rounded-xl border border-border bg-card p-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-foreground">
          Saldo Akun
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Total saldo: {formatIDR(data.reduce((sum, acc) => sum + acc.balance, 0))}
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {data.map((account) => (
            <div
              key={account.id}
              className={cn(
                "flex items-center space-x-3 p-3 rounded-lg border",
                getTypeColor(account.type)
              )}
            >
              <div className="text-2xl">{account.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground truncate">
                      {account.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {getTypeLabel(account.type)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-foreground">
                      {formatIDR(account.balance)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {account.currency}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
