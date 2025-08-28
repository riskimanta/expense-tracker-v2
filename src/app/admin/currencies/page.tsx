"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Plus, Edit, Trash2, DollarSign, Euro, PoundSterling, Pen, WaypointsIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { AdminTable } from "@/components/admin/AdminTable"
import { RowActions } from "@/components/admin/RowActions"
import { EditDrawer } from "@/components/admin/EditDrawer"
import { ConfirmDialog } from "@/components/admin/ConfirmDialog"
import { getCurrencies, createCurrency, updateCurrency, deleteCurrency } from "@/api/currencies"
import { Currency } from "@/types/admin"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

const currencySchema = z.object({
  code: z.string().min(1, "Kode mata uang harus diisi").max(3, "Kode maksimal 3 karakter"),
  name: z.string().min(1, "Nama mata uang harus diisi"),
  symbol: z.string().min(1, "Symbol harus diisi"),
  rateToIDR: z.number().min(0.000001, "Rate harus lebih dari 0"),
})

type CurrencyFormData = z.infer<typeof currencySchema>

export default function AdminCurrenciesPage() {
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editingCurrency, setEditingCurrency] = useState<Currency | null>(null)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [deletingCurrency, setDeletingCurrency] = useState<Currency | null>(null)
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const { data: currencies = [], isLoading } = useQuery({
    queryKey: ["currencies"],
    queryFn: getCurrencies,
  })

  const createMutation = useMutation({
    mutationFn: createCurrency,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currencies"] })
      toast({
        title: "Berhasil",
        description: "Mata uang berhasil dibuat",
      })
      setIsEditOpen(false)
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Gagal membuat mata uang",
        variant: "destructive",
      })
    },
  })

  const updateMutation = useMutation({
    mutationFn: updateCurrency,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currencies"] })
      toast({
        title: "Berhasil",
        description: "Mata uang berhasil diupdate",
      })
      setIsEditOpen(false)
      setEditingCurrency(null)
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Gagal mengupdate mata uang",
        variant: "destructive",
      })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteCurrency,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currencies"] })
      toast({
        title: "Berhasil",
        description: "Mata uang berhasil dihapus",
      })
      setIsDeleteOpen(false)
      setDeletingCurrency(null)
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Gagal menghapus mata uang",
        variant: "destructive",
      })
    },
  })

  const form = useForm<CurrencyFormData>({
    resolver: zodResolver(currencySchema),
    defaultValues: {
      code: "",
      name: "",
      symbol: "",
      rateToIDR: 0,
    },
  })

  const handleCreate = () => {
    setEditingCurrency(null)
    form.reset()
    setIsEditOpen(true)
  }

  const handleEdit = (currency: Currency) => {
    setEditingCurrency(currency)
    form.reset({
      code: currency.code,
      name: currency.name,
      symbol: currency.symbol,
      rateToIDR: currency.rateToIDR,
    })
    setIsEditOpen(true)
  }

  const handleDelete = (currency: Currency) => {
    setDeletingCurrency(currency)
    setIsDeleteOpen(true)
  }

  const onSubmit = (data: CurrencyFormData) => {
    if (editingCurrency) {
      updateMutation.mutate(editingCurrency.code, data)
    } else {
      createMutation.mutate(data)
    }
  }

  const getCurrencyIcon = (code: string | undefined) => {
    if (!code) return <DollarSign className="w-4 h-4" />
    
    switch (code.toUpperCase()) {
      case "USD":
        return <DollarSign className="w-4 h-4" />
      case "EUR":
        return <Euro className="w-4 h-4" />
      case "GBP":
        return <PoundSterling className="w-4 h-4" />
      case "JPY":
        return <Pen className="w-4 h-4" />
      case "KRW":
        return <WaypointsIcon className="w-4 h-4" />
      default:
        return <DollarSign className="w-4 h-4" />
    }
  }

  const columns = [
    {
      key: "code",
      label: "Kode",
      render: (currency: Currency) => (
        <div className="flex items-center gap-2">
          {getCurrencyIcon(currency.code)}
          <span className="font-mono font-medium text-[var(--txt-high)]">{currency.code || 'N/A'}</span>
        </div>
      ),
    },
    {
      key: "name",
      label: "Nama",
      render: (currency: Currency) => (
        <span className="text-[var(--txt-high)]">{currency.name}</span>
      ),
    },
    {
      key: "symbol",
      label: "Symbol",
      render: (currency: Currency) => (
        <span className="font-mono text-[var(--txt-med)]">{currency.symbol}</span>
      ),
    },
    {
      key: "rateToIDR",
      label: "Rate ke IDR",
      render: (currency: Currency) => (
        <span className="font-mono text-[var(--txt-high)]">
          1 {currency.code || 'N/A'} = Rp {currency.rateToIDR?.toLocaleString() || '0'}
        </span>
      ),
    },
    {
      key: "updatedAt",
      label: "Update Terakhir",
      render: (currency: Currency) => (
        <span className="text-sm text-[var(--txt-low)]">
          {currency.updatedAt ? new Date(currency.updatedAt).toLocaleDateString("id-ID") : 'N/A'}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Aksi",
      render: (currency: Currency) => {
        if (!currency || !currency.code) return null
        return (
          <RowActions
            onEdit={() => handleEdit(currency)}
            onDelete={() => handleDelete(currency)}
            disableDelete={currency.code === "IDR"}
          />
        )
      },
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--txt-high)]">Kelola Mata Uang</h1>
          <p className="text-[var(--txt-med)]">Kelola semua mata uang dan rate konversi</p>
        </div>
        <Button onClick={handleCreate} className="bg-[var(--primary)] hover:bg-[var(--primary)]/90">
          <Plus className="w-4 h-4 mr-2" />
          Tambah Mata Uang
        </Button>
      </div>

      <Card className="bg-[var(--surface)] border-[var(--border)]">
        <CardHeader>
          <CardTitle className="text-[var(--txt-high)]">Daftar Mata Uang</CardTitle>
        </CardHeader>
        <CardContent>
          <AdminTable
            data={currencies.filter(currency => currency && currency.code)}
            columns={columns}
            isLoading={isLoading}
            searchPlaceholder="Cari mata uang..."
          />
        </CardContent>
      </Card>

      <EditDrawer
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        title={editingCurrency ? "Edit Mata Uang" : "Tambah Mata Uang Baru"}
        onSave={() => form.handleSubmit(onSubmit)()}
        loading={createMutation.isPending || updateMutation.isPending}
      >
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--txt-med)] mb-2">
              Kode Mata Uang
            </label>
            <Input
              {...form.register("code")}
              placeholder="USD, EUR, GBP, dll"
              className="bg-[var(--surface)] border-[var(--border)] text-[var(--txt-high)]"
              maxLength={3}
            />
            {form.formState.errors.code && (
              <p className="text-sm text-[var(--danger)] mt-1">
                {form.formState.errors.code.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--txt-med)] mb-2">
              Nama Mata Uang
            </label>
            <Input
              {...form.register("name")}
              placeholder="US Dollar, Euro, Pound Sterling, dll"
              className="bg-[var(--surface)] border-[var(--border)] text-[var(--txt-high)]"
            />
            {form.formState.errors.name && (
              <p className="text-sm text-[var(--danger)] mt-1">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--txt-med)] mb-2">
              Symbol
            </label>
            <Input
              {...form.register("symbol")}
              placeholder="$, €, £, ¥, dll"
              className="bg-[var(--surface)] border-[var(--border)] text-[var(--txt-high)]"
            />
            {form.formState.errors.symbol && (
              <p className="text-sm text-[var(--danger)] mt-1">
                {form.formState.errors.symbol.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--txt-med)] mb-2">
              Rate ke IDR
            </label>
            <Input
              type="number"
              step="0.000001"
              {...form.register("rateToIDR", { valueAsNumber: true })}
              placeholder="15000"
              className="bg-[var(--surface)] border-[var(--border)] text-[var(--txt-high)]"
            />
            {form.formState.errors.rateToIDR && (
              <p className="text-sm text-[var(--danger)] mt-1">
                {form.formState.errors.rateToIDR.message}
              </p>
            )}
            <p className="text-xs text-[var(--txt-low)] mt-1">
              Contoh: 1 USD = 15000 IDR, maka rate = 15000
            </p>
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditOpen(false)}
              className="flex-1 border-[var(--border)] text-[var(--txt-med)] hover:bg-[var(--surface)]"
            >
              Batal
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-[var(--primary)] hover:bg-[var(--primary)]/90"
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {createMutation.isPending || updateMutation.isPending ? "Menyimpan..." : "Simpan"}
            </Button>
          </div>
        </form>
      </EditDrawer>

      <ConfirmDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title="Hapus Mata Uang"
        description={`Apakah Anda yakin ingin menghapus mata uang "${deletingCurrency?.code}"?`}
        confirmText="Hapus"
        onConfirm={() => {
          if (deletingCurrency) {
            deleteMutation.mutate(deletingCurrency.id)
          }
        }}
        variant="danger"
      />
    </div>
  )
}
