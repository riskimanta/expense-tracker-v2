"use client"

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { AdminTable } from '@/components/admin/AdminTable'
import { RowActions } from '@/components/admin/RowActions'
import { EditDrawer } from '@/components/admin/EditDrawer'
import { ConfirmDialog } from '@/components/admin/ConfirmDialog'
import { useToast } from '@/components/ToastProvider'
import { getCategories, createCategory, updateCategory, deleteCategory } from '@/api/categories'
import { Category } from '@/types/admin'
import { Plus, Palette } from 'lucide-react'

const categorySchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter'),
  type: z.enum(['expense', 'income']),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Color harus dalam format hex (#RRGGBB)'),
  icon: z.string().optional(),
  isDefault: z.boolean().default(false)
})

type CategoryFormData = z.infer<typeof categorySchema>

const defaultColors = [
  '#ef4444', '#f97316', '#eab308', '#84cc16', '#22c55e',
  '#10b981', '#06b6d4', '#3b82f6', '#6366f1', '#8b5cf6',
  '#a855f7', '#ec4899', '#f43f5e'
]

export default function AdminCategoriesPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null)
  const [selectedType, setSelectedType] = useState<'expense' | 'income' | 'all'>('all')
  const { showToast } = useToast()
  const queryClient = useQueryClient()

  // Fetch categories
  const { data: categories = [], isLoading, error } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: getCategories
  })

  // Filter categories by type
  const filteredCategories = categories.filter(cat => 
    selectedType === 'all' || cat.type === selectedType
  )

  // Create category mutation
  const createMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] })
      setIsCreateOpen(false)
      showToast({
        title: 'Berhasil',
        description: 'Kategori berhasil dibuat',
        variant: 'success'
      })
    },
    onError: (error) => {
      showToast({
        title: 'Error',
        description: error.message || 'Gagal membuat kategori',
        variant: 'error'
      })
    }
  })

  // Update category mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Category> }) => updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] })
      setEditingCategory(null)
      showToast({
        title: 'Berhasil',
        description: 'Kategori berhasil diupdate',
        variant: 'success'
      })
    },
    onError: (error) => {
      showToast({
        title: 'Error',
        description: error.message || 'Gagal mengupdate kategori',
        variant: 'error'
      })
    }
  })

  // Delete category mutation
  const deleteMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] })
      setDeletingCategory(null)
      showToast({
        title: 'Berhasil',
        description: 'Kategori berhasil dihapus',
        variant: 'success'
      })
    },
    onError: (error) => {
      showToast({
        title: 'Error',
        description: error.message || 'Gagal menghapus kategori',
        variant: 'error'
      })
    }
  })

  // Form for create/edit
  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      type: 'expense',
      color: '#667eea',
      icon: '',
      isDefault: false
    }
  })

  const handleCreate = () => {
    form.reset()
    setIsCreateOpen(true)
  }

  const handleEdit = (category: Category) => {
    form.reset({
      name: category.name,
      type: category.type,
      color: category.color || '#667eea',
      icon: category.icon || '',
      isDefault: category.isDefault || false
    })
    setEditingCategory(category)
  }

  const handleDelete = (category: Category) => {
    setDeletingCategory(category)
  }

  const onSubmit = (data: CategoryFormData) => {
    if (editingCategory) {
      updateMutation.mutate({ id: editingCategory.id, data })
    } else {
      createMutation.mutate(data)
    }
  }

  const tableColumns = [
    { key: 'name', label: 'Nama', sortable: true },
    { 
      key: 'type', 
      label: 'Tipe', 
      sortable: true,
      render: (value: string) => (
        <Badge variant={value === 'expense' ? 'outline' : 'default'} className="capitalize">
          {value === 'expense' ? 'Pengeluaran' : 'Pemasukan'}
        </Badge>
      )
    },
    { 
      key: 'color', 
      label: 'Warna', 
      render: (value: string) => (
        <div className="flex items-center gap-2">
          <div 
            className="w-4 h-4 rounded-full border border-border"
            style={{ backgroundColor: value }}
          />
          <span className="text-xs font-mono">{value}</span>
        </div>
      )
    },
    { 
      key: 'icon', 
      label: 'Icon', 
      render: (value: string) => value || '-' 
    },
    { 
      key: 'isDefault', 
      label: 'Default', 
      render: (value: boolean) => (
        <Badge variant={value ? 'default' : 'outline'} className={value ? 'bg-[var(--success)]' : ''}>
          {value ? 'Ya' : 'Tidak'}
        </Badge>
      )
    },
    {
      key: 'actions',
      label: 'Aksi',
      render: (_: any, category: Category) => (
        <RowActions
          onEdit={() => handleEdit(category)}
          onDelete={() => handleDelete(category)}
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
          <h1 className="text-3xl font-semibold text-foreground">Categories</h1>
          <p className="text-[var(--txt-med)] mt-1">Kelola kategori pengeluaran dan pemasukan</p>
        </div>
        <Button onClick={handleCreate} className="bg-[var(--primary)] hover:bg-[var(--primary)]/90">
          <Plus className="h-4 w-4 mr-2" />
          Tambah Kategori
        </Button>
      </div>

      {/* Type Filter Tabs */}
      <div className="flex gap-2">
        <Button
          variant={selectedType === 'all' ? 'default' : 'outline'}
          onClick={() => setSelectedType('all')}
          className={selectedType === 'all' ? 'bg-[var(--primary)]' : 'border-border text-foreground hover:bg-[var(--surface)]'}
        >
          Semua
        </Button>
        <Button
          variant={selectedType === 'expense' ? 'default' : 'outline'}
          onClick={() => setSelectedType('expense')}
          className={selectedType === 'expense' ? 'bg-[var(--primary)]' : 'border-border text-foreground hover:bg-[var(--surface)]'}
        >
          Pengeluaran
        </Button>
        <Button
          variant={selectedType === 'income' ? 'default' : 'outline'}
          onClick={() => setSelectedType('income')}
          className={selectedType === 'income' ? 'bg-[var(--primary)]' : 'border-border text-foreground hover:bg-[var(--surface)]'}
        >
          Pemasukan
        </Button>
      </div>

      {/* Categories Table */}
      <AdminTable
        data={filteredCategories}
        columns={tableColumns}
        searchKey="name"
        pageSize={10}
        emptyMessage="Belum ada kategori"
      />

      {/* Create Category Drawer */}
      <EditDrawer
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        title="Tambah Kategori Baru"
        onSave={form.handleSubmit(onSubmit)}
        loading={createMutation.isPending}
      >
        <form className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Nama Kategori</label>
            <Input
              {...form.register('name')}
              className="bg-background border-border text-foreground placeholder:text-[var(--txt-low)] focus:ring-[var(--primary)]"
              placeholder="Masukkan nama kategori"
            />
            {form.formState.errors.name && (
              <p className="text-sm text-[var(--danger)]">{form.formState.errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Tipe</label>
            <Select value={form.watch('type')} onValueChange={(value) => form.setValue('type', value as 'expense' | 'income')}>
              <SelectTrigger className="bg-background border-border text-foreground focus:ring-[var(--primary)]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="expense">Pengeluaran</SelectItem>
                <SelectItem value="income">Pemasukan</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Warna</label>
            <div className="flex items-center gap-3">
              <Input
                {...form.register('color')}
                className="bg-background border-border text-foreground placeholder:text-[var(--txt-low)] focus:ring-[var(--primary)]"
                placeholder="#667eea"
              />
              <div 
                className="w-8 h-8 rounded border border-border"
                style={{ backgroundColor: form.watch('color') }}
              />
            </div>
            {form.formState.errors.color && (
              <p className="text-sm text-[var(--danger)]">{form.formState.errors.color.message}</p>
            )}
            
            {/* Color Palette */}
            <div className="flex flex-wrap gap-2 mt-2">
              {defaultColors.map((color) => (
                <button
                  key={color}
                  type="button"
                  className="w-6 h-6 rounded border border-border hover:scale-110 transition-transform"
                  style={{ backgroundColor: color }}
                  onClick={() => form.setValue('color', color)}
                />
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Icon (Opsional)</label>
            <Input
              {...form.register('icon')}
              className="bg-background border-border text-foreground placeholder:text-[var(--txt-low)] focus:ring-[var(--primary)]"
              placeholder="🍽️, 🚗, 💰, dll"
            />
            <p className="text-xs text-[var(--txt-low)]">
              Gunakan emoji atau string untuk icon
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isDefault"
              checked={form.watch('isDefault')}
              onCheckedChange={(checked) => form.setValue('isDefault', checked)}
            />
            <label htmlFor="isDefault" className="text-sm font-medium text-foreground">
              Kategori Default
            </label>
          </div>
        </form>
      </EditDrawer>

      {/* Edit Category Drawer */}
      <EditDrawer
        open={!!editingCategory}
        onOpenChange={() => setEditingCategory(null)}
        title="Edit Kategori"
        onSave={form.handleSubmit(onSubmit)}
        loading={updateMutation.isPending}
      >
        <form className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Nama Kategori</label>
            <Input
              {...form.register('name')}
              className="bg-background border-border text-foreground placeholder:text-[var(--txt-low)] focus:ring-[var(--primary)]"
              placeholder="Masukkan nama kategori"
            />
            {form.formState.errors.name && (
              <p className="text-sm text-[var(--danger)]">{form.formState.errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Tipe</label>
            <Select value={form.watch('type')} onValueChange={(value) => form.setValue('type', value as 'expense' | 'income')}>
              <SelectTrigger className="bg-background border-border text-foreground focus:ring-[var(--primary)]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="expense">Pengeluaran</SelectItem>
                <SelectItem value="income">Pemasukan</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Warna</label>
            <div className="flex items-center gap-3">
              <Input
                {...form.register('color')}
                className="bg-background border-border text-foreground placeholder:text-[var(--txt-low)] focus:ring-[var(--primary)]"
                placeholder="#667eea"
              />
              <div 
                className="w-8 h-8 rounded border border-border"
                style={{ backgroundColor: form.watch('color') }}
              />
            </div>
            {form.formState.errors.color && (
              <p className="text-sm text-[var(--danger)]">{form.formState.errors.color.message}</p>
            )}
            
            {/* Color Palette */}
            <div className="flex flex-wrap gap-2 mt-2">
              {defaultColors.map((color) => (
                <button
                  key={color}
                  type="button"
                  className="w-6 h-6 rounded border border-border hover:scale-110 transition-transform"
                  style={{ backgroundColor: color }}
                  onClick={() => form.setValue('color', color)}
                />
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Icon (Opsional)</label>
            <Input
              {...form.register('icon')}
              className="bg-background border-border text-foreground placeholder:text-[var(--txt-low)] focus:ring-[var(--primary)]"
              placeholder="🍽️, 🚗, 💰, dll"
            />
            <p className="text-xs text-[var(--txt-low)]">
              Gunakan emoji atau string untuk icon
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isDefault"
              checked={form.watch('isDefault')}
              onCheckedChange={(checked) => form.setValue('isDefault', checked)}
            />
            <label htmlFor="isDefault" className="text-sm font-medium text-foreground">
              Kategori Default
            </label>
          </div>
        </form>
      </EditDrawer>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deletingCategory}
        onOpenChange={() => setDeletingCategory(null)}
        title="Hapus Kategori"
        description={`Apakah Anda yakin ingin menghapus kategori "${deletingCategory?.name}"? Tindakan ini tidak dapat dibatalkan.`}
        onConfirm={() => deletingCategory && deleteMutation.mutate(deletingCategory.id)}
        confirmText="Hapus"
        variant="danger"
      />
    </div>
  )
}
