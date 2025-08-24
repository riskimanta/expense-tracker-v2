"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

interface ExpenseFormProps {
  categories: Array<{ id: string; name: string }>
  onSubmit: (data: {
    date: string
    category: string
    amount: number
    note: string
  }) => Promise<void>
}

export function ExpenseForm({ categories, onSubmit }: ExpenseFormProps) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    category: "",
    amount: "",
    note: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.date || !formData.category || !formData.amount) return

    setIsLoading(true)
    try {
      await onSubmit({
        date: formData.date,
        category: formData.category,
        amount: Number(formData.amount),
        note: formData.note,
      })
      // Reset form
      setFormData({
        date: new Date().toISOString().split('T')[0],
        category: "",
        amount: "",
        note: "",
      })
    } catch (error) {
      console.error("Error submitting expense:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleTestLoading = () => {
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 2000)
  }

  const handleTestError = () => {
    // Simulate error state
    console.error("Test error triggered")
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="date" className="text-sm text-muted-foreground">
          Tanggal
        </Label>
        <Input
          id="date"
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          className="h-11"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category" className="text-sm text-muted-foreground">
          Kategori
        </Label>
        <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
          <SelectTrigger className="h-11">
            <SelectValue placeholder="Pilih Kategori" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="amount" className="text-sm text-muted-foreground">
          Jumlah
        </Label>
        <Input
          id="amount"
          type="number"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          placeholder="0"
          className="h-11"
          required
        />
        <p className="text-xs text-[var(--txt-low)]">
          Contoh: 50000 = Rp 50.000
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="note" className="text-sm text-muted-foreground">
          Catatan
        </Label>
        <Textarea
          id="note"
          value={formData.note}
          onChange={(e) => setFormData({ ...formData, note: e.target.value })}
          placeholder="Catatan tambahan (opsional)"
          className="min-h-[88px]"
        />
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full h-11"
      >
        {isLoading ? "Menyimpan..." : "Simpan"}
      </Button>

      <div className="grid grid-cols-2 gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={handleTestLoading}
          className="h-11"
        >
          Test Loading
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={handleTestError}
          className="h-11"
        >
          Test Error
        </Button>
      </div>
    </form>
  )
}