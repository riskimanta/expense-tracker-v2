"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { formatIDR } from '@/lib/format'
import { useToast } from '@/components/ToastProvider'
import { useAccounts, useCreateAccount, useUpdateAccount, useDeleteAccount } from '@/hooks/useExpenses'
import type { Account } from '@/types/admin'

export default function AccountsPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingAccount, setEditingAccount] = useState<Account | null>(null)
  const { showToast } = useToast()
  
  const [newAccount, setNewAccount] = useState({
    name: '',
    type: 'cash',
    balance: '',
    icon: '💵'
  })

  // Use hooks for data management
  const { data: accounts = [], isLoading } = useAccounts('1')
  const createAccountMutation = useCreateAccount()
  const updateAccountMutation = useUpdateAccount()
  const deleteAccountMutation = useDeleteAccount()

  // Helper functions for number formatting
  const formatToIndonesianNumber = (num: number): string => {
    return new Intl.NumberFormat("id-ID").format(num)
  }

  const parseIndonesianNumber = (str: string): number => {
    return parseInt(str.replace(/\D/g, '')) || 0
  }

  const handleBalanceChange = (value: string, isEdit: boolean = false) => {
    const cleanValue = value.replace(/\D/g, '') // Hapus semua non-digit
    
    if (cleanValue === '') {
      setNewAccount(prev => ({ ...prev, balance: '' }))
      return
    }
    
    const numValue = parseInt(cleanValue)
    const formattedValue = formatToIndonesianNumber(numValue)
    
    setNewAccount(prev => ({ ...prev, balance: formattedValue }))
  }

  // Pre-fill edit form
  useEffect(() => {
    if (editingAccount) {
      setNewAccount({
        name: editingAccount.name,
        type: editingAccount.type,
        balance: formatToIndonesianNumber(editingAccount.balance),
        icon: editingAccount.icon || '💵'
      })
    }
  }, [editingAccount])

  const handleAddAccount = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newAccount.name || !newAccount.balance) {
      showToast({
        title: 'Error',
        description: 'Nama dan saldo awal harus diisi',
        variant: 'destructive'
      })
      return
    }

    const account: Omit<Account, 'id'> = {
      name: newAccount.name,
      type: newAccount.type,
      balance: parseIndonesianNumber(newAccount.balance),
      icon: newAccount.type === 'cash' ? '💵' : newAccount.type === 'bank' ? '🏦' : '📱'
    }

    try {
      const result = await createAccountMutation.mutateAsync(account)
      
      // Check if it's a conflict response (not an error)
      if (result && typeof result === 'object' && 'success' in result && !result.success) {
        // This is a conflict response, show informative message
        showToast({
          title: 'Tidak Dapat Dibuat',
          description: result.error || 'Akun tidak dapat dibuat karena konflik data',
          variant: 'destructive'
        })
        return
      }
      
      // Success
      showToast({
        title: 'Sukses!',
        description: 'Akun berhasil ditambahkan',
        variant: 'success'
      })

      // Reset form and close modal
      setNewAccount({
        name: '',
        type: 'cash',
        balance: '',
        icon: '💵'
      })
      setIsAddModalOpen(false)
    } catch (error) {
      showToast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Gagal menambahkan akun',
        variant: 'destructive'
      })
    }
  }

  const handleEditAccount = (account: Account) => {
    setEditingAccount(account)
    setIsEditModalOpen(true)
  }

  const handleUpdateAccount = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!editingAccount) return
    
    if (!newAccount.name || !newAccount.balance) {
      showToast({
        title: 'Error',
        description: 'Nama dan saldo awal harus diisi',
        variant: 'destructive'
      })
      return
    }

    const updatedAccount: Partial<Account> = {
      name: newAccount.name,
      type: newAccount.type,
      balance: parseIndonesianNumber(newAccount.balance),
      icon: newAccount.type === 'cash' ? '💵' : newAccount.type === 'bank' ? '🏦' : '📱'
    }

    try {
      const result = await updateAccountMutation.mutateAsync({
        id: editingAccount.id,
        data: updatedAccount
      })
      
      // Check if it's a conflict response (not an error)
      if (result && typeof result === 'object' && 'success' in result && !result.success) {
        // This is a conflict response, show informative message
        showToast({
          title: 'Tidak Dapat Diupdate',
          description: result.error || 'Akun tidak dapat diupdate karena konflik data',
          variant: 'destructive'
        })
        return
      }
      
      // Success
      showToast({
        title: 'Sukses!',
        description: 'Akun berhasil diupdate',
        variant: 'success'
      })

      // Reset form and close modal
      setNewAccount({
        name: '',
        type: 'cash',
        balance: '',
        icon: '💵'
      })
      setIsEditModalOpen(false)
      setEditingAccount(null)
    } catch (error) {
      showToast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Gagal mengupdate akun',
        variant: 'destructive'
      })
    }
  }

  const handleDeleteAccount = async (accountId: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus akun ini?')) return
    
    try {
      const result = await deleteAccountMutation.mutateAsync(accountId)
      
      // Check if it's a conflict response (not an error)
      if (result && typeof result === 'object' && 'success' in result && !result.success) {
        // This is a conflict response, show informative message
        showToast({
          title: 'Tidak Dapat Dihapus',
          description: result.error || 'Akun tidak dapat dihapus karena masih digunakan',
          variant: 'destructive'
        })
        return
      }
      
      // Success
      showToast({
        title: 'Sukses!',
        description: 'Akun berhasil dihapus',
        variant: 'success'
      })
    } catch (error) {
      showToast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Gagal menghapus akun',
        variant: 'destructive'
      })
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Memuat data akun...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Akun</h1>
          <p className="text-muted-foreground">Kelola akun keuangan Anda</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)}>
          Tambah Akun
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts.map((account: Account) => (
          <Card key={account.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{account.icon}</span>
                  <div>
                    <h3 className="font-semibold">{account.name}</h3>
                    <Badge variant="outline" className="text-xs">
                      {account.type}
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">
                    {formatIDR(account.balance)}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEditAccount(account)}
                  className="flex-1"
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDeleteAccount(account.id)}
                >
                  Hapus
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Account Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tambah Akun Baru</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddAccount} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Nama Akun</label>
              <Input
                value={newAccount.name}
                onChange={(e) => setNewAccount(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Contoh: Cash, BCA, OVO"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Tipe Akun</label>
              <Select
                value={newAccount.type}
                onValueChange={(value: 'cash' | 'bank' | 'ewallet') => 
                  setNewAccount(prev => ({ ...prev, type: value }))
                }
              >
                <SelectTrigger>
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
              <label className="text-sm font-medium">Saldo Awal</label>
              <Input
                type="text"
                value={newAccount.balance}
                onChange={(e) => handleBalanceChange(e.target.value)}
                placeholder="0"
                required
              />
            </div>
            <div className="flex gap-2 pt-4">
              <Button type="submit" className="flex-1">
                Tambah Akun
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddModalOpen(false)}
                className="flex-1"
              >
                Batal
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Account Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Akun</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdateAccount} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Nama Akun</label>
              <Input
                value={newAccount.name}
                onChange={(e) => setNewAccount(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Contoh: Cash, BCA, OVO"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Tipe Akun</label>
              <Select
                value={newAccount.type}
                onValueChange={(value: 'cash' | 'bank' | 'ewallet') => 
                  setNewAccount(prev => ({ ...prev, type: value }))
                }
              >
                <SelectTrigger>
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
              <label className="text-sm font-medium">Saldo</label>
              <Input
                type="text"
                value={newAccount.balance}
                onChange={(e) => handleBalanceChange(e.target.value, true)}
                placeholder="0"
                required
              />
            </div>
            <div className="flex gap-2 pt-4">
              <Button type="submit" className="flex-1">
                Update Akun
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsEditModalOpen(false)
                  setEditingAccount(null)
                }}
                className="flex-1"
              >
                Batal
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
