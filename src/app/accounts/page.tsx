"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { formatIDR } from '@/lib/format'
import { useToast } from '@/components/ToastProvider'

interface Account {
  id: string
  name: string
  type: 'cash' | 'bank' | 'ewallet'
  balance: number
  currency: string
  icon: string
  accountNumber?: string
}

const mockAccounts: Account[] = [
  {
    id: '1',
    name: 'Cash',
    type: 'cash',
    balance: 2500000,
    currency: 'IDR',
    icon: '💵'
  },
  {
    id: '2',
    name: 'BCA',
    type: 'bank',
    balance: 8500000,
    currency: 'IDR',
    icon: '🏦',
    accountNumber: '1234567890'
  },
  {
    id: '3',
    name: 'OVO',
    type: 'ewallet',
    balance: 1500000,
    currency: 'IDR',
    icon: '📱',
    accountNumber: '08123456789'
  },
  {
    id: '4',
    name: 'GoPay',
    type: 'ewallet',
    balance: 800000,
    currency: 'IDR',
    icon: '📱',
    accountNumber: '08123456789'
  }
]

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>(mockAccounts)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [newAccount, setNewAccount] = useState({
    name: '',
    type: 'cash' as 'cash' | 'bank' | 'ewallet',
    balance: '',
    currency: 'IDR',
    accountNumber: ''
  })
  const { showToast } = useToast()

  const handleAddAccount = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newAccount.name || !newAccount.balance) {
      showToast({
        title: 'Error',
        description: 'Nama dan saldo awal harus diisi',
        variant: 'destructive'
      })
      return
    }

    const account: Account = {
      id: Date.now().toString(),
      name: newAccount.name,
      type: newAccount.type,
      balance: parseInt(newAccount.balance),
      currency: newAccount.currency,
      icon: newAccount.type === 'cash' ? '💵' : newAccount.type === 'bank' ? '🏦' : '📱',
      accountNumber: newAccount.accountNumber || undefined
    }

    setAccounts([...accounts, account])
    
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
      currency: 'IDR',
      accountNumber: ''
    })
    setIsAddModalOpen(false)
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'cash':
        return 'Cash'
      case 'bank':
        return 'Bank'
      case 'ewallet':
        return 'E-Wallet'
      default:
        return 'Unknown'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'cash':
        return 'border-[var(--success)] bg-[var(--success)]/10'
      case 'bank':
        return 'border-[var(--primary)] bg-[var(--primary)]/10'
      case 'ewallet':
        return 'border-[var(--warning)] bg-[var(--warning)]/10'
      default:
        return 'border-border bg-muted'
    }
  }

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0)

  return (
    <main className="mx-auto max-w-[1200px] p-6 space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-semibold text-foreground">Akun</h1>
        <p className="mt-1 text-muted-foreground">Kelola akun dan saldo keuangan</p>
      </div>

      {/* Total Balance */}
      <Card className="rounded-xl border border-border bg-card p-6">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Total Saldo Semua Akun</p>
          <p className="text-4xl font-bold text-[var(--success)]">
            {formatIDR(totalBalance)}
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            {accounts.length} akun aktif
          </p>
        </div>
      </Card>

      {/* Add Account Button */}
      <div className="flex justify-end">
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button className="h-11 px-6">
              + Tambah Akun
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Tambah Akun Baru</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddAccount} className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground">Nama Akun</label>
                <Input
                  placeholder="Contoh: BCA Giro"
                  value={newAccount.name}
                  onChange={(e) => setNewAccount({...newAccount, name: e.target.value})}
                  className="h-11"
                />
              </div>
              
              <div>
                <label className="text-sm text-muted-foreground">Tipe Akun</label>
                <Select value={newAccount.type} onValueChange={(value: 'cash' | 'bank' | 'ewallet') => setNewAccount({...newAccount, type: value})}>
                  <SelectTrigger className="h-11">
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
                <label className="text-sm text-muted-foreground">Saldo Awal</label>
                <Input
                  type="text"
                  placeholder="1000000"
                  value={newAccount.balance}
                  onChange={(e) => setNewAccount({...newAccount, balance: e.target.value})}
                  className="h-11"
                />
                <p className="text-xs text-[var(--txt-low)] mt-1">
                  Contoh: 1000000 = Rp 1.000.000
                </p>
              </div>
              
              {(newAccount.type === 'bank' || newAccount.type === 'ewallet') && (
                <div>
                  <label className="text-sm text-muted-foreground">
                    {newAccount.type === 'bank' ? 'Nomor Rekening' : 'Nomor HP'}
                  </label>
                  <Input
                    placeholder={newAccount.type === 'bank' ? '1234567890' : '08123456789'}
                    value={newAccount.accountNumber}
                    onChange={(e) => setNewAccount({...newAccount, accountNumber: e.target.value})}
                    className="h-11"
                  />
                </div>
              )}
              
              <div className="flex space-x-2 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1"
                >
                  Batal
                </Button>
                <Button type="submit" className="flex-1">
                  Tambah Akun
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Accounts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts.map((account) => (
          <Card 
            key={account.id} 
            className={`rounded-xl border p-4 transition-all hover:shadow-lg ${getTypeColor(account.type)}`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="text-3xl">{account.icon}</div>
                <Badge variant="outline" className="text-xs">
                  {getTypeLabel(account.type)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  {account.name}
                </h3>
                {account.accountNumber && (
                  <p className="text-sm text-muted-foreground">
                    {account.accountNumber}
                  </p>
                )}
              </div>
              
              <div className="text-right">
                <p className="text-2xl font-bold text-foreground">
                  {formatIDR(account.balance)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {account.currency}
                </p>
              </div>
              
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="flex-1 h-8">
                  Edit
                </Button>
                <Button variant="outline" size="sm" className="flex-1 h-8">
                  Transfer
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {accounts.length === 0 && (
        <Card className="rounded-xl border border-border bg-card p-12">
          <div className="text-center">
            <div className="text-4xl mb-4">🏦</div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Belum ada akun
            </h3>
            <p className="text-muted-foreground mb-4">
              Mulai dengan menambahkan akun pertama Anda
            </p>
            <Button onClick={() => setIsAddModalOpen(true)}>
              + Tambah Akun Pertama
            </Button>
          </div>
        </Card>
      )}
    </main>
  )
}
