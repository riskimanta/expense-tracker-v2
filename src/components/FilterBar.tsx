"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
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
    <Card className="rounded-xl border border-border bg-card">
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Bulan</label>
            <Input
              type="month"
              value={selectedMonth}
              onChange={(e) => onMonthChange(e.target.value)}
              className="h-11"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Filter Kategori</label>
            <Select
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="h-11"
            >
              <option value="">Semua Kategori</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
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
