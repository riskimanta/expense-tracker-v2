import { formatIDR } from '@/lib/format'
import { Wallet, CreditCard, Smartphone } from 'lucide-react'

interface Account {
  id: string
  name: string
  type: string
  balance: number
  currency: string
}

interface AccountBalanceProps {
  accounts: Account[]
  className?: string
}

const getAccountIcon = (type: string) => {
  switch (type) {
    case 'cash':
      return <Wallet className="h-5 w-5" />
    case 'bank':
      return <CreditCard className="h-5 w-5" />
    case 'wallet':
      return <Smartphone className="h-5 w-5" />
    default:
      return <Wallet className="h-5 w-5" />
  }
}

export function AccountBalance({ accounts, className }: AccountBalanceProps) {
  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0)
  
  return (
    <div className={className}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground">Account Balance</h3>
        <p className="text-sm text-muted-foreground">Total saldo: {formatIDR(totalBalance)}</p>
      </div>
      
      <div className="space-y-3">
        {accounts.map((account) => (
          <div
            key={account.id}
            className="flex items-center justify-between p-3 rounded-lg border border-border bg-card hover:bg-muted transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-muted text-[var(--primary)]">
                {getAccountIcon(account.type)}
              </div>
              <div>
                <div className="font-medium text-foreground">{account.name}</div>
                <div className="text-xs text-[var(--txt-low)] capitalize">{account.type}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-semibold text-foreground">
                {formatIDR(account.balance)}
              </div>
              <div className="text-xs text-[var(--txt-low)]">{account.currency}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
