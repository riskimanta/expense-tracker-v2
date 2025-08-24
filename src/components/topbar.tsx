"use client"

import { Search, ChevronLeft, ChevronRight } from "lucide-react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { ThemeToggle } from "@/components/theme-toggle"
import { formatMonthYear } from "@/lib/format"

export function Topbar() {
  const t = useTranslations()
  const currentMonth = formatMonthYear(new Date().toISOString())

  return (
    <div className="flex h-16 items-center justify-between border-b border-border px-6 bg-background">
      <div className="flex items-center space-x-4">
        {/* Month Switcher */}
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Bulan sebelumnya</span>
          </Button>
          <span className="text-sm font-medium">{currentMonth}</span>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Bulan berikutnya</span>
          </Button>
        </div>

        {/* Account Filter */}
        <Select defaultValue="all" className="w-40">
          <option value="all">Semua Akun</option>
          <option value="checking">Giro</option>
          <option value="savings">Tabungan</option>
          <option value="credit">Kartu Kredit</option>
        </Select>
      </div>

      <div className="flex items-center space-x-4">
        {/* Search */}
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t('form.search') + " transaksi..."}
            className="pl-9"
          />
        </div>

        {/* Theme Toggle */}
        <ThemeToggle />
      </div>
    </div>
  )
}
