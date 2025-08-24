"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { formatIDR } from "@/lib/format"

interface Transaction {
  id: string
  date: string
  category: string
  amount: number
  note?: string
  splitCount?: number
}

interface TransactionsTableProps {
  transactions: Transaction[]
}

export function TransactionsTable({ transactions }: TransactionsTableProps) {
  if (!transactions || transactions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Belum ada transaksi</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="border-b border-border">
          <tr>
            <th className="text-left p-3 text-xs uppercase font-medium text-muted-foreground">
              Tanggal
            </th>
            <th className="text-left p-3 text-xs uppercase font-medium text-muted-foreground">
              Kategori
            </th>
            <th className="text-right p-3 text-xs uppercase font-medium text-muted-foreground">
              Jumlah
            </th>
            <th className="text-left p-3 text-xs uppercase font-medium text-muted-foreground">
              Catatan
            </th>
            <th className="text-center p-3 text-xs uppercase font-medium text-muted-foreground">
              Aksi
            </th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction, index) => (
            <tr
              key={transaction.id}
              className={`border-b border-border ${
                index % 2 === 0 ? "bg-card" : "bg-muted"
              }`}
            >
              <td className="p-3 text-sm text-foreground">
                {transaction.date}
              </td>
              <td className="p-3 text-sm text-foreground">
                <div className="flex items-center space-x-2">
                  <span>{transaction.category}</span>
                  {transaction.splitCount && transaction.splitCount > 1 && (
                    <Badge variant="outline" className="text-xs">
                      Split ×{transaction.splitCount}
                    </Badge>
                  )}
                </div>
              </td>
              <td className="p-3 text-sm text-right">
                <span className={transaction.amount > 0 ? "text-[var(--success)]" : "text-foreground"}>
                  {transaction.amount > 0 ? "+" : ""}{formatIDR(Math.abs(transaction.amount))}
                </span>
              </td>
              <td className="p-3 text-sm text-foreground">
                {transaction.note || "-"}
              </td>
              <td className="p-3 text-center">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                  onClick={() => console.log("Delete transaction:", transaction.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}