"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

interface AccountFilterProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  selectedType: string
  onTypeChange: (value: string) => void
  accountTypes: Array<{ id: number; name: string }>
}

export function AccountFilter({
  searchTerm,
  onSearchChange,
  selectedType,
  onTypeChange,
  accountTypes
}: AccountFilterProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--txt-3)]" />
        <Input
          placeholder="Cari nama akun atau tipe akun..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="input-base pl-10 text-[color:var(--txt-1)] placeholder:text-[color:var(--txt-3)] focus:ring-[color:var(--primary)]"
        />
      </div>

      {/* Type Filter Dropdown */}
      <div>
        <Select value={selectedType} onValueChange={onTypeChange}>
          <SelectTrigger className="input-base text-[color:var(--txt-1)] focus:ring-[color:var(--primary)]">
            <SelectValue placeholder="Semua Tipe Akun" />
          </SelectTrigger>
          <SelectContent className="bg-[color:var(--surface)] border-[color:var(--border)] shadow-md">
            <SelectItem value="all">Semua Tipe Akun</SelectItem>
            {accountTypes.map((type) => (
              <SelectItem key={type.id} value={type.name}>
                {type.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
