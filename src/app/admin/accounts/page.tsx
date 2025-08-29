"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Plus, Edit, Trash2, Wallet, CreditCard, PiggyBank } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { AdminTable } from "@/components/admin/AdminTable"
import { RowActions } from "@/components/admin/RowActions"
import { EditDrawer } from "@/components/admin/EditDrawer"
import { ConfirmDialog } from "@/components/admin/ConfirmDialog"
import { getAccounts, createAccount, updateAccount, deleteAccount } from "@/api/accounts"
import { Account } from "@/types/admin"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

const accountSchema = z.object({
  name: z.string().min(1, "Nama akun harus diisi"),
  type: z.enum(["cash", "bank", "wallet"]),
  balance: z.number().min(0, "Balance tidak boleh negatif"),
})

type AccountFormData = z.infer<typeof accountSchema>

export default function AdminAccountsPage() {
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editingAccount, setEditingAccount] = useState<Account | null>(null)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [deletingAccount, setDeletingAccount] = useState<Account | null>(null)
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const { data: accounts = [], isLoading } = useQuery({
    queryKey: ["accounts"],
    queryFn: getAccounts,
  })

  const createMutation = useMutation({
    mutationFn: createAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] })
      toast({
        title: "Berhasil",
        description: "Akun berhasil dibuat",
      })
      setIsEditOpen(false)
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Gagal membuat akun",
        variant: "destructive",
      })
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Account> }) => updateAccount(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] })
      toast({
        title: "Berhasil",
        description: "Akun berhasil diupdate",
      })
      setIsEditOpen(false)
      setEditingAccount(null)
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Gagal mengupdate akun",
        variant: "destructive",
      })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] })
      toast({
        title: "Berhasil",
        description: "Akun berhasil dihapus",
      })
      setIsDeleteOpen(false)
      setDeletingAccount(null)
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Gagal menghapus akun",
        variant: "destructive",
      })
    },
  })

  const form = useForm<AccountFormData>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      name: "",
      type: "cash",
      balance: 0,
    },
  })

  const handleCreate = () => {
    setEditingAccount(null)
    form.reset()
    setIsEditOpen(true)
  }

  const handleEdit = (account: Account) => {
    setEditingAccount(account)
    form.reset({
      name: account.name,
      type: account.type,
      balance: account.balance,
    })
    setIsEditOpen(true)
  }

  const handleDelete = (account: Account) => {
    setDeletingAccount(account)
    setIsDeleteOpen(true)
  }

  const onSubmit = (data: AccountFormData) => {
    if (editingAccount) {
      updateMutation.mutate({ id: editingAccount.id, updates: data })
    } else {
      createMutation.mutate(data)
    }
  }

  const getAccountIcon = (type: string) => {
    switch (type) {
      case "cash":
        return <PiggyBank className="w-4 h-4" />
      case "bank":
        return <CreditCard className="w-4 h-4" />
      case "wallet":
        return <Wallet className="w-4 h-4" />
      default:
        return <Wallet className="w-4 h-4" />
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "cash":
        return "Cash"
      case "bank":
        return "Bank"
      case "wallet":
        return "Wallet"
      default:
        return type
    }
  }

  const columns = [
    {
      key: "name" as keyof Account,
      label: "Nama Akun",
      render: (value: string | number, account: Account) => (
        <div className="flex items-center gap-2">
          {getAccountIcon(account.type)}
          <span className="font-medium">{account.name}</span>
        </div>
      ),
    },
    {
      key: "type" as keyof Account,
      label: "Tipe",
      render: (value: string | number, account: Account) => (
        <span className="px-2 py-1 text-xs rounded-full bg-[var(--surface2)] text-[var(--txt-med)]">
          {getTypeLabel(account.type)}
        </span>
      ),
    },
    {
      key: "balance" as keyof Account,
      label: "Balance",
      render: (value: string | number, account: Account) => (
        <span className="font-mono text-[var(--txt-high)]">
          Rp {account.balance?.toLocaleString() || '0'}
        </span>
      ),
    },
    {
      key: "id" as keyof Account,
      label: "Aksi",
      render: (value: string | number, account: Account) => (
        <RowActions
          onEdit={() => handleEdit(account)}
          onDelete={() => handleDelete(account)}
        />
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--txt-high)]">Kelola Akun</h1>
          <p className="text-[var(--txt-med)]">Kelola semua akun keuangan</p>
        </div>
        <Button onClick={handleCreate} className="bg-[var(--primary)] hover:bg-[var(--primary)]/90">
          <Plus className="w-4 h-4 mr-2" />
          Tambah Akun
        </Button>
      </div>

      <Card className="bg-[var(--surface)] border-[var(--border)]">
        <CardHeader>
          <CardTitle className="text-[var(--txt-high)]">Daftar Akun</CardTitle>
        </CardHeader>
        <CardContent>
          <AdminTable
            data={accounts}
            columns={columns}
            isLoading={isLoading}
            searchPlaceholder="Cari akun..."
          />
        </CardContent>
      </Card>

      <EditDrawer
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        title={editingAccount ? "Edit Akun" : "Tambah Akun Baru"}
        onSave={() => form.handleSubmit(onSubmit)()}
        loading={createMutation.isPending || updateMutation.isPending}
      >
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--txt-med)] mb-2">
              Nama Akun
            </label>
            <Input
              {...form.register("name")}
              placeholder="Masukkan nama akun"
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
              Tipe Akun
            </label>
            <Select
              value={form.watch("type")}
              onValueChange={(value) => form.setValue("type", value as 'cash' | 'bank' | 'ewallet')}
            >
              <SelectTrigger className="bg-[var(--surface)] border-[var(--border)] text-[var(--txt-high)]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="bank">Bank</SelectItem>
                <SelectItem value="ewallet">E-Wallet</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--txt-med)] mb-2">
              Balance
            </label>
            <Input
              type="number"
              {...form.register("balance", { valueAsNumber: true })}
              placeholder="0"
              className="bg-[var(--surface)] border-[var(--border)] text-[var(--txt-high)]"
            />
            {form.formState.errors.balance && (
              <p className="text-sm text-[var(--danger)] mt-1">
                {form.formState.errors.balance.message}
              </p>
            )}
          </div>


        </form>
      </EditDrawer>

      <ConfirmDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title="Hapus Akun"
        description={`Apakah Anda yakin ingin menghapus akun "${deletingAccount?.name}"?`}
        confirmText="Hapus"
        onConfirm={() => {
          if (deletingAccount) {
            deleteMutation.mutate(deletingAccount.id)
          }
        }}
        variant="danger"
      />
    </div>
  )
}
