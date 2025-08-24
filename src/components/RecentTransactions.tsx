import { formatIDR, formatDateID } from '@/lib/format'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface Transaction {
  id: string
  date: string
  category: string
  amount: number
  note: string
  type: 'income' | 'expense'
}

interface RecentTransactionsProps {
  transactions: Transaction[]
  className?: string
}

export function RecentTransactions({ transactions, className }: RecentTransactionsProps) {
  return (
    <div className={className}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground">Recent Transactions</h3>
        <p className="text-sm text-muted-foreground">Transaksi terbaru bulan ini</p>
      </div>
      
      <div className="space-y-3">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="flex items-center justify-between p-3 rounded-lg border border-border bg-card hover:bg-muted transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${
                transaction.type === 'income' 
                  ? 'bg-[var(--success)] bg-opacity-20 text-[var(--success)]' 
                  : 'bg-[var(--danger)] bg-opacity-20 text-[var(--danger)]'
              }`}>
                {transaction.type === 'income' ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
              </div>
              <div>
                <div className="font-medium text-foreground">{transaction.category}</div>
                <div className="text-xs text-[var(--txt-low)]">{transaction.note}</div>
                <div className="text-xs text-[var(--txt-low)]">{formatDateID(transaction.date)}</div>
              </div>
            </div>
            <div className={`text-right font-semibold ${
              transaction.type === 'income' ? 'text-[var(--success)]' : 'text-foreground'
            }`}>
              {transaction.type === 'income' ? '+' : '-'}{formatIDR(Math.abs(transaction.amount))}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-4 border-t border-border">
        <button className="w-full py-2 px-4 text-sm text-[var(--primary)] hover:text-[var(--primary-hover)] hover:bg-muted rounded-lg transition-colors">
          Lihat Semua Transaksi →
        </button>
      </div>
    </div>
  )
}
