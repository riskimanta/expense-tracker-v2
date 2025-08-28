"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { MonthYearPicker } from "@/components/ui/month-year-picker"

interface FilterBarProps {
  month: Date | null
  categoryId: string
  accountId: string
  categories: Array<{ id: string; name: string }>
  accounts: Array<{ id: string; name: string }>
  onMonthChange: (month: Date | null) => void
  onCategoryChange: (categoryId: string) => void
  onAccountChange: (accountId: string) => void
}

export function FilterBar({
  month,
  categoryId,
  accountId,
  categories,
  accounts,
  onMonthChange,
  onCategoryChange,
  onAccountChange,
}: FilterBarProps) {
  return (
    <Card className="rounded-xl border border-border bg-card">
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Bulan</label>
            <MonthYearPicker
              value={month}
              onChange={onMonthChange}
              placeholder="Pilih bulan"
              className="h-11"
              data-testid="period-trigger"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Filter Kategori</label>
            <Select value={categoryId} onValueChange={onCategoryChange}>
              <SelectTrigger className="h-11" data-testid="category-select">
                <SelectValue placeholder="Semua Kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Kategori</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Filter Akun</label>
            <Select value={accountId} onValueChange={onAccountChange}>
              <SelectTrigger className="h-11" data-testid="account-select">
                <SelectValue placeholder="Semua Akun" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Akun</SelectItem>
                {accounts.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    {account.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-end justify-end">
            <Badge variant="outline" className="text-[var(--txt-low)]">
              User = 1
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
