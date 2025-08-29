"use client"

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { AdminTable } from '@/components/admin/AdminTable'
import { RowActions } from '@/components/admin/RowActions'
import { EditDrawer } from '@/components/admin/EditDrawer'
import { ConfirmDialog } from '@/components/admin/ConfirmDialog'
import { useToast } from '@/components/ToastProvider'
import { getUsers, createUser, updateUser, deleteUser } from '@/api/users'
import { User } from '@/types/admin'
import { Plus, User as UserIcon } from 'lucide-react'

const userSchema = z.object({
  name: z.string().min(3, 'Nama minimal 3 karakter'),
  email: z.string().email('Email tidak valid'),
  role: z.enum(['admin', 'user']),
  status: z.enum(['active', 'inactive'])
})

type UserFormData = z.infer<typeof userSchema>

export default function AdminUsersPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [deletingUser, setDeletingUser] = useState<User | null>(null)
  const { showToast } = useToast()
  const queryClient = useQueryClient()

  // Fetch users
  const { data: users = [], isLoading, error } = useQuery({
    queryKey: ['admin-users'],
    queryFn: getUsers
  })

  // Create user mutation
  const createMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
      setIsCreateOpen(false)
      showToast({
        title: 'Berhasil',
        description: 'User berhasil dibuat',
        variant: 'success'
      })
    },
    onError: (error) => {
      showToast({
        title: 'Error',
        description: error.message || 'Gagal membuat user',
        variant: 'error'
      })
    }
  })

  // Update user mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<User> }) => updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
      setEditingUser(null)
      showToast({
        title: 'Berhasil',
        description: 'User berhasil diupdate',
        variant: 'success'
      })
    },
    onError: (error) => {
      showToast({
        title: 'Error',
        description: error.message || 'Gagal mengupdate user',
        variant: 'error'
      })
    }
  })

  // Delete user mutation
  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
      setDeletingUser(null)
      showToast({
        title: 'Berhasil',
        description: 'User berhasil dihapus',
        variant: 'success'
      })
    },
    onError: (error) => {
      showToast({
        title: 'Error',
        description: error.message || 'Gagal menghapus user',
        variant: 'error'
      })
    }
  })

  // Form for create/edit
  const form = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: '',
      email: '',
      role: 'user',
      status: 'active'
    }
  })

  const handleCreate = () => {
    form.reset()
    setIsCreateOpen(true)
  }

  const handleEdit = (user: User) => {
    form.reset({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status
    })
    setEditingUser(user)
  }

  const handleDelete = (user: User) => {
    setDeletingUser(user)
  }

  const onSubmit = (data: UserFormData) => {
    if (editingUser) {
      updateMutation.mutate({ id: editingUser.id, data })
    } else {
      createMutation.mutate(data)
    }
  }

  const tableColumns = [
    { key: 'name', label: 'Nama', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { 
      key: 'role', 
      label: 'Role', 
      sortable: true,
      render: (value: string) => (
        <Badge variant={value === 'admin' ? 'default' : 'outline'} className="capitalize">
          {value}
        </Badge>
      )
    },
    { 
      key: 'status', 
      label: 'Status', 
      sortable: true,
      render: (value: string) => (
        <Badge 
          variant={value === 'active' ? 'default' : 'outline'}
          className={value === 'active' ? 'bg-[var(--success)]' : 'border-[var(--txt-low)] text-[var(--txt-low)]'}
        >
          {value === 'active' ? 'Aktif' : 'Tidak Aktif'}
        </Badge>
      )
    },
    { 
      key: 'createdAt', 
      label: 'Dibuat', 
      sortable: true,
      render: (value: string) => new Date(value).toLocaleDateString('id-ID') 
    },
    {
      key: 'actions',
      label: 'Aksi',
      render: (_: unknown, user: User) => (
        <RowActions
          onEdit={() => handleEdit(user)}
          onDelete={() => handleDelete(user)}
        />
      )
    }
  ]

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-[var(--danger)] mb-4">Error: {error.message}</p>
        <Button onClick={() => window.location.reload()}>Coba Lagi</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Users</h1>
          <p className="text-[var(--txt-med)] mt-1">Kelola user dan permission</p>
        </div>
        <Button onClick={handleCreate} className="bg-[var(--primary)] hover:bg-[var(--primary)]/90">
          <Plus className="h-4 w-4 mr-2" />
          Tambah User
        </Button>
      </div>

      {/* Users Table */}
      <AdminTable
        data={users}
        columns={tableColumns}
        searchKey="name"
        pageSize={10}
        emptyMessage="Belum ada user"
      />

      {/* Create User Drawer */}
      <EditDrawer
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        title="Tambah User Baru"
        onSave={form.handleSubmit(onSubmit)}
        loading={createMutation.isPending}
      >
        <form className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Nama</label>
            <Input
              {...form.register('name')}
              className="bg-background border-border text-foreground placeholder:text-[var(--txt-low)] focus:ring-[var(--primary)]"
              placeholder="Masukkan nama lengkap"
            />
            {form.formState.errors.name && (
              <p className="text-sm text-[var(--danger)]">{form.formState.errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Email</label>
            <Input
              {...form.register('email')}
              type="email"
              className="bg-background border-border text-foreground placeholder:text-[var(--txt-low)] focus:ring-[var(--primary)]"
              placeholder="user@example.com"
            />
            {form.formState.errors.email && (
              <p className="text-sm text-[var(--danger)]">{form.formState.errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Role</label>
            <Select value={form.watch('role')} onValueChange={(value) => form.setValue('role', value as 'admin' | 'user')}>
              <SelectTrigger className="bg-background border-border text-foreground focus:ring-[var(--primary)]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Status</label>
            <Select value={form.watch('status')} onValueChange={(value) => form.setValue('status', value as 'active' | 'inactive')}>
              <SelectTrigger className="bg-background border-border text-foreground focus:ring-[var(--primary)]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Aktif</SelectItem>
                <SelectItem value="inactive">Tidak Aktif</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </form>
      </EditDrawer>

      {/* Edit User Drawer */}
      <EditDrawer
        open={!!editingUser}
        onOpenChange={() => setEditingUser(null)}
        title="Edit User"
        onSave={form.handleSubmit(onSubmit)}
        loading={updateMutation.isPending}
      >
        <form className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Nama</label>
            <Input
              {...form.register('name')}
              className="bg-background border-border text-foreground placeholder:text-[var(--txt-low)] focus:ring-[var(--primary)]"
              placeholder="Masukkan nama lengkap"
            />
            {form.formState.errors.name && (
              <p className="text-sm text-[var(--danger)]">{form.formState.errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Email</label>
            <Input
              {...form.register('email')}
              type="email"
              className="bg-background border-border text-foreground placeholder:text-[var(--txt-low)] focus:ring-[var(--primary)]"
              placeholder="user@example.com"
            />
            {form.formState.errors.email && (
              <p className="text-sm text-[var(--danger)]">{form.formState.errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Role</label>
            <Select value={form.watch('role')} onValueChange={(value) => form.setValue('role', value as 'admin' | 'user')}>
              <SelectTrigger className="bg-background border-border text-foreground focus:ring-[var(--primary)]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Status</label>
            <Select value={form.watch('status')} onValueChange={(value) => form.setValue('status', value as 'active' | 'inactive')}>
              <SelectTrigger className="bg-background border-border text-foreground focus:ring-[var(--primary)]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Aktif</SelectItem>
                <SelectItem value="inactive">Tidak Aktif</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </form>
      </EditDrawer>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deletingUser}
        onOpenChange={() => setDeletingUser(null)}
        title="Hapus User"
        description={`Apakah Anda yakin ingin menghapus user "${deletingUser?.name}"? Tindakan ini tidak dapat dibatalkan.`}
        onConfirm={() => deletingUser && deleteMutation.mutate(deletingUser.id)}
        confirmText="Hapus"
        variant="danger"
      />
    </div>
  )
}
