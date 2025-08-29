"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Plus, Edit, Trash2, Wallet, CreditCard, PiggyBank } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CurrencyInput } from "@/components/ui/currency-input"
import { useToast } from "@/hooks/use-toast"
import { AdminTable } from "@/components/admin/AdminTable"
import { RowActions } from "@/components/admin/RowActions"
import { EditDrawer } from "@/components/admin/EditDrawer"
import { ConfirmDialog } from "@/components/admin/ConfirmDialog"
import { LogoUpload } from "@/components/ui/logo-upload"
import { AccountFilter } from "@/components/admin/AccountFilter"
import { getAccounts, createAccount, updateAccount, deleteAccount } from "@/api/accounts"
import { getAccountTypes } from "@/api/accountTypes"
import { Account, AccountType } from "@/types/admin"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { formatNumberToIndonesian, parseIndonesianNumber } from "@/lib/format"

const accountSchema = z.object({
  name: z.string().min(1, "Nama akun harus diisi"),
  type: z.string().min(1, "Tipe akun harus dipilih"),
  balance: z.number().min(0, "Balance tidak boleh negatif"),
  logo_url: z.string().optional(),
})

type AccountFormData = z.infer<typeof accountSchema>

export default function AdminAccountsPage() {
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editingAccount, setEditingAccount] = useState<Account | null>(null)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [deletingAccount, setDeletingAccount] = useState<Account | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState("all")
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const { data: accounts = [], isLoading } = useQuery({
    queryKey: ["accounts"],
    queryFn: getAccounts,
  })

  // Filter accounts based on search term and selected type
  const filteredAccounts = accounts.filter(account => {
    const matchesSearch = searchTerm === "" || 
      account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.type.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesType = selectedType === "" || selectedType === "all" || account.type === selectedType
    
    return matchesSearch && matchesType
  })

  const { data: accountTypes = [] } = useQuery({
    queryKey: ["accountTypes"],
    queryFn: getAccountTypes,
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
      setEditingAccount(null)
      // Reset form setelah berhasil create
      form.reset({
        name: "",
        type: "",
        balance: 0,
        logo_url: "",
      })
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
      // Reset form setelah berhasil update
      form.reset({
        name: "",
        type: "",
        balance: 0,
        logo_url: "",
      })
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
    mutationFn: ({ id, force }: { id: string; force: boolean }) => deleteAccount(id, force),
    onSuccess: (data: { success: boolean; message: string }) => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] })
      const message = data?.message || "Akun berhasil dihapus"
      toast({
        title: "Berhasil",
        description: message,
      })
      setIsDeleteOpen(false)
      setDeletingAccount(null)
    },
    onError: (error: unknown) => {
      // Check if error is due to transactions
      const errorMessage = error instanceof Error ? error.message : String(error)
      const errorStatus = (error as { status?: number })?.status
      const transactionCount = (error as { transactionCount?: number })?.transactionCount
      
      if (errorMessage.includes('transaction') || errorStatus === 409) {
        // Show force delete confirmation
        if (confirm(`Akun "${deletingAccount?.name}" tidak bisa dihapus karena masih digunakan di ${transactionCount || 'beberapa'} transaksi. Apakah Anda ingin force delete akun ini? (Transaksi akan dihapus dan akun akan di-delete secara permanen)`)) {
          // Force delete with transaction cleanup
          deleteMutation.mutate({ id: deletingAccount?.id || '', force: true })
        }
      } else {
        toast({
          title: "Error",
          description: "Gagal menghapus akun",
          variant: "destructive",
        })
      }
    },
  })

  const form = useForm<AccountFormData>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      name: "",
      type: "",
      balance: 0,
      logo_url: "",
    },
  })

  const handleCreate = () => {
    setEditingAccount(null)
    // Reset form dengan default values yang kosong
    form.reset({
      name: "",
      type: "",
      balance: 0,
      logo_url: "",
    })
    setIsEditOpen(true)
  }

  const handleEdit = (account: Account) => {
    setEditingAccount(account)
    // Reset form dengan data akun yang akan diedit
    form.reset({
      name: account.name,
      type: account.type,
      balance: account.balance,
      logo_url: account.logo_url || "",
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
      case "ewallet":
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
      case "ewallet":
        return "E-Wallet"
      default:
        return type
    }
  }

  const columns = [
    {
      key: "name" as keyof Account,
      label: "Akun",
      render: (value: string | number, account: Account) => (
        <div className="flex items-center justify-start">
          {account.logo_url ? (
            <div className="relative w-20 h-20 rounded-lg overflow-hidden flex items-center justify-center">
              <img
                src={account.logo_url}
                alt={`${account.name} logo`}
                className="w-full h-full object-contain"
              />
            </div>
          ) : (
            <div className="w-20 h-20 rounded-lg bg-[var(--surface2)] border-2 border-[var(--border)] flex items-center justify-center">
              {getAccountIcon(account.type)}
            </div>
          )}
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
      label: "Saldo",
      sortable: true,
      render: (value: string | number, account: Account) => (
        <span className="font-mono text-[var(--txt-high)]">
          Rp {formatNumberToIndonesian(account.balance || 0)}
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
    <div className="mx-auto max-w-7xl p-6 space-y-6">
      {/* Header */}
      <section className="card p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[color:var(--txt-1)]">Kelola Akun</h1>
            <p className="text-[color:var(--txt-2)] mt-2">Kelola semua akun keuangan</p>
          </div>
          <Button onClick={handleCreate} className="btn btn-primary">
            <Plus className="w-4 h-4 mr-2" />
            Tambah Akun
          </Button>
        </div>
      </section>

      {/* Main Content */}
      <section className="card p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-[color:var(--txt-1)] mb-4">Daftar Akun</h2>
          
          {/* Filter Component */}
          <AccountFilter
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedType={selectedType}
            onTypeChange={setSelectedType}
            accountTypes={accountTypes}
          />
        </div>
        
        <AdminTable
          data={filteredAccounts}
          columns={columns}
          isLoading={isLoading}
          defaultSortKey="balance"
          defaultSortDirection="desc"
        />
      </section>

      <EditDrawer
        open={isEditOpen}
        onOpenChange={(open) => {
          if (!open) {
            // Cleanup form saat drawer ditutup
            setEditingAccount(null)
            form.reset({
              name: "",
              type: "",
              balance: 0,
              logo_url: "",
            })
          }
          setIsEditOpen(open)
        }}
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
              onValueChange={(value) => form.setValue("type", value)}
            >
              <SelectTrigger className="bg-[var(--surface)] border-[var(--border)] text-[var(--txt-high)]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {accountTypes.map((accountType) => (
                  <SelectItem key={accountType.id} value={accountType.name}>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-4 h-4 rounded bg-blue-500"
                      />
                      {accountType.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--txt-med)] mb-2">
              Balance
            </label>
            <CurrencyInput
              value={form.watch("balance") || 0}
              onChange={(value) => form.setValue("balance", value)}
              placeholder="0"
              className="bg-[var(--surface)] border-[var(--border)] text-[var(--txt-high)]"
            />
            {form.formState.errors.balance && (
              <p className="text-sm text-[var(--danger)] mt-1">
                {form.formState.errors.balance.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--txt-med)] mb-2">
              Logo Akun
            </label>
            <LogoUpload
              value={form.watch("logo_url")}
              onChange={(logoUrl) => form.setValue("logo_url", logoUrl)}
              className="mt-2"
            />
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
            // Try normal delete first, if it fails due to transactions, show force delete option
            deleteMutation.mutate({ id: deletingAccount.id, force: false })
          }
        }}
        variant="danger"
      />
    </div>
  )
}
