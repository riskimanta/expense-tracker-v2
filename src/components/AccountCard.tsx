import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatIDR } from "@/lib/format"

export type AccountType = "cash" | "checking" | "savings" | "credit" | "investment"

export interface Account {
  id: string
  name: string
  type: AccountType
  balance: number
  currency?: string
}

export interface AccountCardProps {
  account: Account
  rightSlot?: React.ReactNode
  onClick?: () => void
  className?: string
}

const typeLabel: Record<AccountType, string> = {
  cash: "Tunai",
  checking: "Giro",
  savings: "Tabungan",
  credit: "Kartu Kredit",
  investment: "Investasi",
}

export function AccountCard({ account, rightSlot, onClick, className }: AccountCardProps) {
  return (
    <Card className={className} onClick={onClick}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-medium flex items-center gap-2">
          {account.name}
          <Badge variant="outline">{typeLabel[account.type]}</Badge>
        </CardTitle>
        {rightSlot}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formatIDR(account.balance)}</div>
      </CardContent>
    </Card>
  )
}
