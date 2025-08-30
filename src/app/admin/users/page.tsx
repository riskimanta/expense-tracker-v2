"use client"

import { useState, useEffect } from 'react'
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
  const { data: initialUsers = [], isLoading, error } = useQuery({
    queryKey: ['admin-users'],
    queryFn: getUsers
  })

  // Local state untuk users yang bisa di-update
  const [users, setUsers] = useState<User[]>([])

  // Update local users ketika initialUsers berubah
  useEffect(() => {
    if (initialUsers && initialUsers.length > 0) {
      setUsers(initialUsers)
    }
  }, [initialUsers?.length]) // Use length instead of the entire array

  // Create user mutation
  const createMutation = useMutation({
    mutationFn: createUser,
    onSuccess: (newUser) => {
      console.log('Create success, new user:', newUser)
      // Tambah user baru ke local state
      setUsers(prevUsers => [newUser, ...prevUsers])
      // Invalidate query untuk refresh data
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
      setIsCreateOpen(false)
      // Reset form setelah berhasil create
      form.reset({
        name: '',
        email: '',
        role: 'user',
        status: 'active'
      })
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
        variant: 'destructive'
      })
    }
  })

  // Update user mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<User> }) => updateUser(id, data),
    onSuccess: (updatedUser) => {
      console.log('Update success, updated user:', updatedUser)
      // Update local state dengan user yang sudah diupdate
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === editingUser?.id ? { ...user, ...updatedUser } : user
        )
      )
      // Invalidate query untuk refresh data
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
        variant: 'destructive'
      })
    }
  })

  // Delete user mutation
  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: (deletedUserId) => {
      console.log('Delete success, user ID:', deletedUserId)
      // Hapus user dari local state
      setUsers(prevUsers => prevUsers.filter(user => user.id !== deletedUserId))
      // Invalidate query dashboard agar total user ter-update
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
        variant: 'destructive'
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
    // Reset form ke default values
    form.reset({
      name: '',
      email: '',
      role: 'user',
      status: 'active'
    })
    // Pastikan tidak ada user yang sedang diedit
    setEditingUser(null)
    setIsCreateOpen(true)
  }

  const handleEdit = (user: User) => {
    // Reset form dengan data user yang akan diedit
    form.reset({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status
    })
    setEditingUser(user)
    // Tutup modal create jika terbuka
    setIsCreateOpen(false)
  }

  const handleDelete = (user: User) => {
    console.log('Delete user requested:', user)
    setDeletingUser(user)
  }

  const onSubmit = (data: UserFormData) => {
    if (editingUser) {
      updateMutation.mutate({ id: editingUser.id, data })
    } else {
      createMutation.mutate(data)
    }
    // Reset form setelah submit
    form.reset({
      name: '',
      email: '',
      role: 'user',
      status: 'active'
    })
  }

  const tableColumns = [
    { key: 'name' as keyof User, label: 'Nama', sortable: true },
    { key: 'email' as keyof User, label: 'Email', sortable: true },
    { 
      key: 'role' as keyof User, 
      label: 'Role', 
      sortable: true,
      render: (value: string | number) => (
        <Badge variant={String(value) === 'admin' ? 'default' : 'outline'} className="capitalize">
          {String(value)}
        </Badge>
      )
    },
    { 
      key: 'status' as keyof User, 
      label: 'Status', 
      sortable: true,
      render: (value: string | number) => (
        <Badge 
          variant={String(value) === 'active' ? 'default' : 'outline'}
          className={String(value) === 'active' ? 'bg-[var(--success)]' : 'border-[var(--txt-low)] text-[var(--txt-low)]'}
        >
          {String(value) === 'active' ? 'Aktif' : 'Tidak Aktif'}
        </Badge>
      )
    },
    { 
      key: 'createdAt' as keyof User, 
      label: 'Dibuat', 
      sortable: true,
      render: (value: string | number) => new Date(String(value)).toLocaleDateString('id-ID') 
    },
    {
      key: 'id' as keyof User, // Use 'id' instead of 'actions' since it's a valid User property
      label: 'Aksi',
      render: (_: string | number, user: User) => (
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
          <h1 className="text-3xl font-semibold text-[color:var(--txt-1)]">Users</h1>
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
        searchKeys={["name"]}
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
            <label className="text-sm font-medium text-[color:var(--txt-1)]">Nama</label>
            <Input
              {...form.register('name')}
              className="bg-[color:var(--bg)] border-[color:var(--border)] text-[color:var(--txt-1)] placeholder:text-[var(--txt-low)] focus:ring-[var(--primary)]"
              placeholder="Masukkan nama lengkap"
            />
            {form.formState.errors.name && (
              <p className="text-sm text-[var(--danger)]">{form.formState.errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-[color:var(--txt-1)]">Email</label>
            <Input
              {...form.register('email')}
              type="email"
              className="bg-[color:var(--bg)] border-[color:var(--border)] text-[color:var(--txt-1)] placeholder:text-[var(--txt-low)] focus:ring-[var(--primary)]"
              placeholder="user@example.com"
            />
            {form.formState.errors.email && (
              <p className="text-sm text-[var(--danger)]">{form.formState.errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-[color:var(--txt-1)]">Role</label>
            <Select value={form.watch('role')} onValueChange={(value) => form.setValue('role', value as 'admin' | 'user')}>
              <SelectTrigger className="bg-[color:var(--bg)] border-[color:var(--border)] text-[color:var(--txt-1)] focus:ring-[var(--primary)]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-[color:var(--txt-1)]">Status</label>
            <Select value={form.watch('status')} onValueChange={(value) => form.setValue('status', value as 'active' | 'inactive')}>
              <SelectTrigger className="bg-[color:var(--bg)] border-[color:var(--border)] text-[color:var(--txt-1)] focus:ring-[var(--primary)]">
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
            <label className="text-sm font-medium text-[color:var(--txt-1)]">Nama</label>
            <Input
              {...form.register('name')}
              className="bg-[color:var(--bg)] border-[color:var(--border)] text-[color:var(--txt-1)] placeholder:text-[var(--txt-low)] focus:ring-[var(--primary)]"
              placeholder="Masukkan nama lengkap"
            />
            {form.formState.errors.name && (
              <p className="text-sm text-[var(--danger)]">{form.formState.errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-[color:var(--txt-1)]">Email</label>
            <Input
              {...form.register('email')}
              type="email"
              className="bg-[color:var(--bg)] border-[color:var(--border)] text-[color:var(--txt-1)] placeholder:text-[var(--txt-low)] focus:ring-[var(--primary)]"
              placeholder="user@example.com"
            />
            {form.formState.errors.email && (
              <p className="text-sm text-[var(--danger)]">{form.formState.errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-[color:var(--txt-1)]">Role</label>
            <Select value={form.watch('role')} onValueChange={(value) => form.setValue('role', value as 'admin' | 'user')}>
              <SelectTrigger className="bg-[color:var(--bg)] border-[color:var(--border)] text-[color:var(--txt-1)] focus:ring-[var(--primary)]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-[color:var(--txt-1)]">Status</label>
            <Select value={form.watch('status')} onValueChange={(value) => form.setValue('status', value as 'active' | 'inactive')}>
              <SelectTrigger className="bg-[color:var(--bg)] border-[color:var(--border)] text-[color:var(--txt-1)] focus:ring-[var(--primary)]">
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
        onConfirm={() => {
          console.log('Confirming delete for user:', deletingUser)
          if (deletingUser) {
            deleteMutation.mutate(deletingUser.id)
          }
        }}
        confirmText="Hapus"
        variant="danger"
      />
    </div>
  )
}
