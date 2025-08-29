"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AdminTable } from "@/components/admin/AdminTable"
import { EditDrawer } from "@/components/admin/EditDrawer"
import { ConfirmDialog } from "@/components/admin/ConfirmDialog"
import { RowActions } from "@/components/admin/RowActions"
import { getAccountTypes, createAccountType, updateAccountType, deleteAccountType } from "@/api/accountTypes"
import { AccountType } from "@/types/admin"
import { useToast } from "@/hooks/use-toast"

const accountTypeSchema = z.object({
  name: z.string().min(1, "Nama tipe akun harus diisi"),
})

type AccountTypeFormData = z.infer<typeof accountTypeSchema>

export default function AccountTypesPage() {
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editingAccountType, setEditingAccountType] = useState<AccountType | null>(null)
  const [deletingAccountType, setDeletingAccountType] = useState<AccountType | null>(null)
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const { data: accountTypes = [], isLoading } = useQuery({
    queryKey: ["accountTypes"],
    queryFn: getAccountTypes,
  })

  const createMutation = useMutation({
    mutationFn: createAccountType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accountTypes"] })
      setIsEditOpen(false)
      toast({
        title: "Berhasil",
        description: "Tipe akun berhasil dibuat",
      })
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Gagal membuat tipe akun",
        variant: "destructive",
      })
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: number; updates: Partial<AccountType> }) => updateAccountType(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accountTypes"] })
      setIsEditOpen(false)
      setEditingAccountType(null)
      toast({
        title: "Berhasil",
        description: "Tipe akun berhasil diupdate",
      })
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Gagal mengupdate tipe akun",
        variant: "destructive",
      })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteAccountType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accountTypes"] })
      setDeletingAccountType(null)
      toast({
        title: "Berhasil",
        description: "Tipe akun berhasil dihapus",
      })
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Gagal menghapus tipe akun",
        variant: "destructive",
      })
    },
  })

  const form = useForm<AccountTypeFormData>({
    resolver: zodResolver(accountTypeSchema),
    defaultValues: {
      name: "",
    },
  })

  const handleCreate = () => {
    setEditingAccountType(null)
    setIsEditOpen(true)
  }

  const handleEdit = (accountType: AccountType) => {
    setEditingAccountType(accountType)
    form.reset({
      name: accountType.name,
    })
    setIsEditOpen(true)
  }

  const handleDelete = (accountType: AccountType) => {
    setDeletingAccountType(accountType)
  }

  const onSubmit = (data: AccountTypeFormData) => {
    if (editingAccountType) {
      updateMutation.mutate({ id: editingAccountType.id, updates: data })
    } else {
      createMutation.mutate(data)
    }
  }

  const onConfirmDelete = () => {
    if (deletingAccountType) {
      deleteMutation.mutate(deletingAccountType.id)
    }
  }

  // Generate color automatically based on name - ensure unique and contrasting colors
  const getAutoColor = (name: string): string => {
    const colors = [
      "var(--brand)", // Brand green
      "#3B82F6", // Blue
      "#8B5CF6", // Purple
      "#F59E0B", // Yellow
      "#EF4444", // Red
      "#06B6D4", // Cyan
      "#84CC16", // Lime
      "#F97316", // Orange
      "#8B5A2B", // Brown
      "#6366F1", // Indigo
      "#14B8A6", // Teal
      "#A855F7", // Violet
      "#EC4899", // Pink
      "#F43F5E", // Rose
      "var(--brand-600)", // Brand green darker
      "#F59E0B", // Amber
    ]
    
    // Use hash of the full name to get more unique distribution
    let hash = 0
    for (let i = 0; i < name.length; i++) {
      const char = name.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32-bit integer
    }
    
    // Ensure positive index and get unique color
    const index = Math.abs(hash) % colors.length
    return colors[index]
  }

  const tableColumns = [
    {
      key: "name" as keyof AccountType,
      label: "Nama Tipe Akun",
      render: (value: string | number, accountType: AccountType) => (
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
            style={{ backgroundColor: getAutoColor(accountType.name) }}
          >
            {accountType.name.charAt(0).toUpperCase()}
          </div>
          <span className="font-medium">{accountType.name}</span>
        </div>
      ),
    },
    {
      key: "created_at" as keyof AccountType,
      label: "Dibuat",
      render: (value: string | number) => (
        <span className="text-[color:var(--txt-2)]">
          {new Date(value as string).toLocaleDateString("id-ID")}
        </span>
      ),
    },
    {
      key: "actions" as keyof AccountType,
      label: "Aksi",
      render: (_: string | number, accountType: AccountType) => (
        <RowActions
          onEdit={() => handleEdit(accountType)}
          onDelete={() => handleDelete(accountType)}
        />
      ),
    },
  ]

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="mx-auto max-w-7xl p-6 space-y-6">
      {/* Header */}
      <section className="card p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-[color:var(--txt-1)]">Kelola Tipe Akun</h1>
            <p className="text-[color:var(--txt-2)] mt-2">Kelola tipe-tipe akun yang tersedia</p>
          </div>
          <Button onClick={handleCreate} className="btn btn-primary">
            <Plus className="w-4 h-4 mr-2" />
            Tambah Tipe Akun
          </Button>
        </div>
      </section>

      {/* Main Content */}
      <section className="card p-6">

        <AdminTable
          data={accountTypes}
          columns={tableColumns}
          searchKeys={["name"]}
          searchPlaceholder="Cari tipe akun..."
        />
      </section>

      <EditDrawer
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        title={editingAccountType ? "Edit Tipe Akun" : "Tambah Tipe Akun"}
        onSave={() => form.handleSubmit(onSubmit)()}
        onCancel={() => {
          setEditingAccountType(null)
          form.reset()
        }}
        saveText={editingAccountType ? "Update" : "Simpan"}
        loading={createMutation.isPending || updateMutation.isPending}
      >
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="name" className="text-[color:var(--txt-1)]">
              Nama Tipe Akun
            </Label>
            <Input
              {...form.register("name")}
              placeholder="Contoh: Cash, Bank, E-Wallet"
              className="mt-2"
            />
            {form.formState.errors.name && (
              <p className="text-sm text-[color:var(--danger)] mt-1">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>
        </form>
      </EditDrawer>

      <ConfirmDialog
        open={!!deletingAccountType}
        onOpenChange={(open) => !open && setDeletingAccountType(null)}
        onConfirm={onConfirmDelete}
        title="Hapus Tipe Akun"
        description={`Apakah Anda yakin ingin menghapus tipe akun "${deletingAccountType?.name}"?`}
        confirmText="Hapus"
        cancelText="Batal"
      />
    </div>
  )
}
