"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

interface FilterBarProps {
  selectedMonth: string
  selectedCategory: string
  categories: Array<{ id: string; name: string }>
  onMonthChange: (month: string) => void
  onCategoryChange: (category: string) => void
}

export function FilterBar({
  selectedMonth,
  selectedCategory,
  categories,
  onMonthChange,
  onCategoryChange,
}: FilterBarProps) {
  return (
    <Card className="rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)]">
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm text-[color:var(--txt-2)]">Bulan</label>
            <Input
              type="month"
              value={selectedMonth}
              onChange={(e) => onMonthChange(e.target.value)}
              className="h-11"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm text-[color:var(--txt-2)]">Filter Kategori</label>
            <Select value={selectedCategory} onValueChange={onCategoryChange}>
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Semua Kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Semua Kategori</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
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
