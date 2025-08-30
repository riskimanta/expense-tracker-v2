"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DateInput } from "@/components/ui/date-input"
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
    date: new Date(),
    category: "",
    amount: "",
    note: "",
  })
  const [formErrors, setFormErrors] = useState({
    category: false,
    amount: false,
    note: false
  })
  const [isLoading, setIsLoading] = useState(false)

  const validateForm = () => {
    const errors = {
      category: !formData.category,
      amount: !formData.amount || Number(formData.amount) <= 0,
      note: false // Note is optional
    }
    setFormErrors(errors)
    return !Object.values(errors).some(error => error)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsLoading(true)
    try {
      await onSubmit({
        date: formData.date.toISOString().split('T')[0], // Convert Date to YYYY-MM-DD format
        category: formData.category,
        amount: Number(formData.amount),
        note: formData.note,
      })
      // Reset form
      setFormData({
        date: new Date(),
        category: "",
        amount: "",
        note: "",
      })
      setFormErrors({
        category: false,
        amount: false,
        note: false
      })
    } catch (error) {
      console.error("Error submitting expense:", error)
    } finally {
      setIsLoading(false)
    }
  }



  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="date" className="text-sm text-[color:var(--txt-2)]">
          Tanggal
        </Label>
        <DateInput
          value={formData.date}
          onChange={(date) => setFormData({ ...formData, date: date || new Date() })}
          placeholder="DD/MM/YYYY"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category" className={`text-sm ${formErrors.category ? 'text-red-500' : 'text-[color:var(--txt-2)]'}`}>
          Kategori {formErrors.category && <span className="text-red-500">*</span>}
        </Label>
        <Select value={formData.category} onValueChange={(value) => {
          setFormData({ ...formData, category: value })
          if (formErrors.category) {
            setFormErrors({...formErrors, category: false})
          }
        }}>
          <SelectTrigger className={`h-11 ${formErrors.category ? 'border-red-500 focus:border-red-500' : ''}`}>
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
        <Label htmlFor="amount" className={`text-sm ${formErrors.amount ? 'text-red-500' : 'text-[color:var(--txt-2)]'}`}>
          Jumlah {formErrors.amount && <span className="text-red-500">*</span>}
        </Label>
        <Input
          id="amount"
          type="number"
          value={formData.amount}
          onChange={(e) => {
            setFormData({ ...formData, amount: e.target.value })
            if (formErrors.amount) {
              setFormErrors({...formErrors, amount: false})
            }
          }}
          placeholder="0"
          className={`h-11 ${formErrors.amount ? 'border-red-500 focus:border-red-500' : ''}`}
          required
        />
        <p className="text-xs text-[var(--txt-low)]">
          Contoh: 50000 = Rp 50.000
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="note" className="text-sm text-[color:var(--txt-2)]">
          Catatan (Opsional)
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


    </form>
  )
}