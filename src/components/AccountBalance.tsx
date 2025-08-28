"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatIDR } from '@/lib/format'
import { AccountCard } from '@/components/accounts/AccountCard'

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

// Helper function to map account type to AccountCard props
const mapAccountType = (type: string) => {
  switch (type) {
    case 'cash':
      return { type: 'Cash' as const, tone: 'green' as const }
    case 'bank':
      return { type: 'Bank' as const, tone: 'blue' as const }
    case 'ewallet':
      return { type: 'E-Wallet' as const, tone: 'orange' as const }
    default:
      return { type: 'Cash' as const, tone: 'gray' as const }
  }
}

export function AccountBalance({ data }: AccountBalanceProps) {

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
          {data.map((account) => {
            const { type, tone } = mapAccountType(account.type)
            return (
              <AccountCard
                key={account.id}
                name={account.name}
                type={type}
                balance={account.balance}
                currency={account.currency}
                icon={account.icon}
                tone={tone}
              />
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
