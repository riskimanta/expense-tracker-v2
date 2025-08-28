"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CurrencyInput } from '@/components/ui/currency-input'
import { DateInput } from '@/components/ui/date-input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { formatIDR } from '@/lib/format'
import { formatDateID } from '@/lib/format'
import { 
  mockTransferTransactions
} from '@/mock/transfer'
import { getAccounts, updateAccountBalances, type Account } from '@/lib/accountStorage'
import { useEffect } from 'react'

// Create a copy of mock data that we can modify
const initialTransferHistory = [...mockTransferTransactions]
const initialAccounts = getAccounts()
import { useToast } from '@/components/ToastProvider'

export default function TransferPage() {
  const [formData, setFormData] = useState({
    fromAccount: '',
    toAccount: '',
    amount: null as number | null,
    fee: null as number | null,
    date: new Date(),
    description: ''
  })
  const [formErrors, setFormErrors] = useState({
    fromAccount: false,
    toAccount: false,
    amount: false,
    description: false
  })
  
  // State untuk transfer history
  const [transferHistory, setTransferHistory] = useState(initialTransferHistory)
  
  // State untuk accounts yang bisa di-update
  const [accounts, setAccounts] = useState(initialAccounts)
  
  // State untuk mode edit
  const [isEditMode, setIsEditMode] = useState(false)
  const [editingTransferId, setEditingTransferId] = useState<string | null>(null)
  
  // Sync accounts from localStorage when component mounts and when storage changes
  useEffect(() => {
    const syncAccounts = () => {
      const storedAccounts = getAccounts()
      setAccounts(storedAccounts)
    }
    
    // Initial sync
    syncAccounts()
    
    // Listen for storage changes (when other pages update accounts)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'expense-tracker-accounts') {
        syncAccounts()
      }
    }
    
    window.addEventListener('storage', handleStorageChange)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])
  
  const { showToast } = useToast()

  const validateForm = () => {
    const errors = {
      fromAccount: !formData.fromAccount,
      toAccount: !formData.toAccount,
      amount: formData.amount == null || formData.amount <= 0,
      description: false // Description is optional
    }
    setFormErrors(errors)
    return !Object.values(errors).some(error => error)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      showToast({
        title: 'Error',
        description: 'Semua field wajib harus diisi',
        variant: 'destructive'
      })
      return
    }

    if (formData.fromAccount === formData.toAccount) {
      showToast({
        title: 'Error',
        description: 'Akun asal dan tujuan tidak boleh sama',
        variant: 'destructive'
      })
      return
    }

    if (isEditMode && editingTransferId) {
      // Update existing transfer
      setTransferHistory(prev => prev.map(t => 
        t.id === editingTransferId 
          ? {
              ...t,
              date: formData.date.toISOString().split('T')[0],
              fromAccount: getAccountName(formData.fromAccount),
              toAccount: getAccountName(formData.toAccount),
              amount: formData.amount || 0,
              fee: formData.fee || 0,
              description: formData.description || ''
            }
          : t
      ))
      
      // Exit edit mode
      setIsEditMode(false)
      setEditingTransferId(null)
      
      showToast({
        title: 'Sukses!',
        description: 'Transfer berhasil diupdate',
        variant: 'success'
      })
    } else {
      // Create new transfer record
      const newTransfer = {
        id: Date.now().toString(), // Simple ID generation
        date: formData.date.toISOString().split('T')[0],
        fromAccount: getAccountName(formData.fromAccount),
        toAccount: getAccountName(formData.toAccount),
        amount: formData.amount || 0,
        fee: formData.fee || 0,
        description: formData.description || '',
        status: 'completed' as const
      }

      // Add to transfer history
      setTransferHistory(prev => [newTransfer, ...prev])
      
      showToast({
        title: 'Sukses!',
        description: 'Transfer berhasil diproses',
        variant: 'success'
      })
    }

    // Update account balances using localStorage
    const updatedAccounts = updateAccountBalances(
      formData.fromAccount,
      formData.toAccount,
      formData.amount || 0,
      formData.fee || 0
    )
    
    // Update local state to reflect changes immediately
    setAccounts(updatedAccounts)
    
    // Force refresh accounts from localStorage to ensure consistency
    setTimeout(() => {
      const freshAccounts = getAccounts()
      setAccounts(freshAccounts)
    }, 100)



    // Reset form
    setFormData({
      fromAccount: '',
      toAccount: '',
      amount: null,
      fee: null,
      date: new Date(),
      description: ''
    })
    setFormErrors({
      fromAccount: false,
      toAccount: false,
      amount: false,
      description: false
    })
  }

  const getAccountBalance = (accountId: string) => {
    const account = accounts.find(acc => acc.id === accountId)
    return account?.balance || 0
  }

  const getAccountName = (accountId: string) => {
    const account = accounts.find(acc => acc.id === accountId)
    return account?.name || accountId
  }
  
  // Function to refresh accounts from localStorage
  const refreshAccounts = () => {
    const freshAccounts = getAccounts()
    setAccounts(freshAccounts)
  }

  // Function to handle edit transfer
  const handleEditTransfer = (transfer: any) => {
    // Set form data for editing
    setFormData({
      fromAccount: accounts.find(acc => acc.name === transfer.fromAccount)?.id || '',
      toAccount: accounts.find(acc => acc.name === transfer.toAccount)?.id || '',
      amount: transfer.amount,
      fee: transfer.fee,
      date: new Date(transfer.date),
      description: transfer.description
    })
    
    // Set edit mode
    setIsEditMode(true)
    setEditingTransferId(transfer.id)
    
    showToast({
      title: 'Edit Mode',
      description: 'Transfer data telah dimuat ke form',
      variant: 'default'
    })
  }

  // Function to handle delete transfer
  const handleDeleteTransfer = (transferId: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus transfer ini?')) {
      setTransferHistory(prev => prev.filter(t => t.id !== transferId))
      
      showToast({
        title: 'Sukses!',
        description: 'Transfer berhasil dihapus',
        variant: 'success'
      })
    }
  }

  const amount = formData.amount || 0
  const fee = formData.fee || 0
  const total = amount + fee

  return (
    <main className="mx-auto max-w-[1200px] p-6 space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-semibold text-foreground">Transfer</h1>
        <p className="mt-1 text-muted-foreground">Transfer antar akun dan e-wallet</p>
      </div>

      {/* Form + Preview Section */}
      <div className="grid grid-cols-12 gap-6">
        {/* Form Card */}
        <Card className="col-span-12 lg:col-span-7 rounded-xl border border-border bg-card p-4">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-foreground">
              Transfer antar Akun
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Pindahkan dana antar akun
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`text-sm ${formErrors.fromAccount ? 'text-red-500' : 'text-muted-foreground'}`}>
                    Dari Akun {formErrors.fromAccount && <span className="text-red-500">*</span>}
                  </label>
                  <Select value={formData.fromAccount} onValueChange={(value) => {
                    setFormData({...formData, fromAccount: value, toAccount: ''})
                    if (formErrors.fromAccount) {
                      setFormErrors({...formErrors, fromAccount: false})
                    }
                    if (formErrors.toAccount) {
                      setFormErrors({...formErrors, toAccount: false})
                    }
                  }}>
                    <SelectTrigger className={`h-11 ${formErrors.fromAccount ? 'border-red-500 focus:border-red-500' : ''}`}>
                      <SelectValue placeholder="Pilih akun asal" />
                    </SelectTrigger>
                    <SelectContent>
                      {accounts.map((account) => (
                        <SelectItem key={account.id} value={account.id}>
                          {account.name} - {formatIDR(account.balance)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                    <div className="text-xs text-muted-foreground mt-1">
                      Debug: {accounts.length} accounts loaded
                    </div>
                  </Select>
                </div>
                <div>
                  <label className={`text-sm ${formErrors.toAccount ? 'text-red-500' : 'text-muted-foreground'}`}>
                    Ke Akun {formErrors.toAccount && <span className="text-red-500">*</span>}
                  </label>
                  <Select value={formData.toAccount} onValueChange={(value) => {
                    setFormData({...formData, toAccount: value})
                    if (formErrors.toAccount) {
                      setFormErrors({...formErrors, toAccount: false})
                    }
                  }}>
                    <SelectTrigger className={`h-11 ${formErrors.toAccount ? 'border-red-500 focus:border-red-500' : ''}`}>
                      <SelectValue placeholder="Pilih akun tujuan" />
                    </SelectTrigger>
                    <SelectContent>
                      {accounts
                        .filter((account) => account.id !== formData.fromAccount)
                        .map((account) => (
                          <SelectItem key={account.id} value={account.id}>
                            {account.name} - {formatIDR(account.balance)}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`text-sm ${formErrors.amount ? 'text-red-500' : 'text-muted-foreground'}`}>
                    Jumlah {formErrors.amount && <span className="text-red-500">*</span>}
                  </label>
                  <CurrencyInput
                    value={formData.amount}
                    onValueChange={(value) => {
                      setFormData({...formData, amount: value})
                      if (formErrors.amount) {
                        setFormErrors({...formErrors, amount: false})
                      }
                    }}
                    placeholder="1000000"
                    className={`h-11 ${formErrors.amount ? 'border-red-500 focus:border-red-500' : ''}`}
                  />
                  <p className="text-xs text-[var(--txt-low)] mt-1">
                    Contoh: 1000000 = 1.000.000
                  </p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Biaya (Opsional)</label>
                  <CurrencyInput
                    value={formData.fee}
                    onValueChange={(value) => setFormData({...formData, fee: value})}
                    placeholder="0"
                    className="h-11"
                  />
                  <p className="text-xs text-[var(--txt-low)] mt-1">
                    Biaya transfer/admin
                  </p>
                </div>
              </div>
              
              <div>
                <label className="text-sm text-muted-foreground">Tanggal</label>
                <DateInput
                  value={formData.date}
                  onChange={(date) => setFormData({...formData, date: date || new Date()})}
                  placeholder="DD/MM/YYYY"
                />
              </div>
              
              <div>
                <label className="text-sm text-muted-foreground">
                  Catatan (Opsional)
                </label>
                <Textarea
                  placeholder="Alasan transfer..."
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="min-h-[88px]"
                />
              </div>
              
              <div className="flex space-x-3">
                <Button 
                  type="submit" 
                  className="flex-1 h-11"
                  disabled={!formData.fromAccount || !formData.toAccount || !formData.amount || formData.amount <= 0}
                >
                  {isEditMode ? 'Update Transfer' : 'Proses Transfer'}
                </Button>
                {isEditMode && (
                  <Button 
                    type="button"
                    variant="outline"
                    className="h-11 px-6"
                    onClick={() => {
                      setIsEditMode(false)
                      setEditingTransferId(null)
                      setFormData({
                        fromAccount: '',
                        toAccount: '',
                        amount: null,
                        fee: null,
                        date: new Date(),
                        description: ''
                      })
                      setFormErrors({
                        fromAccount: false,
                        toAccount: false,
                        amount: false,
                        description: false
                      })
                    }}
                  >
                    Batal
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Preview Card */}
        <Card className="col-span-12 lg:col-span-5 rounded-xl border border-border bg-card p-4">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-foreground">
              Preview Transfer
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Ringkasan transaksi
            </p>
          </CardHeader>
          <CardContent>
            {formData.fromAccount && formData.toAccount && formData.amount ? (
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-muted">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Dari:</span>
                    <span className="text-sm font-medium text-foreground">
                      {getAccountName(formData.fromAccount)}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-semibold text-[var(--danger)]">
                      -{formatIDR(amount)}
                    </span>
                    <p className="text-xs text-muted-foreground">
                      Saldo: {formatIDR(getAccountBalance(formData.fromAccount))}
                    </p>
                  </div>
                </div>

                <div className="text-center text-2xl">⬇️</div>

                <div className="p-4 rounded-lg bg-muted">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Ke:</span>
                    <span className="text-sm font-medium text-foreground">
                      {getAccountName(formData.toAccount)}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-semibold text-[var(--success)]">
                      +{formatIDR(amount)}
                    </span>
                    <p className="text-xs text-muted-foreground">
                      Saldo: {formatIDR(getAccountBalance(formData.toAccount))}
                    </p>
                  </div>
                </div>

                {fee > 0 && (
                  <div className="p-3 rounded-lg border border-border">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Biaya Transfer:</span>
                      <span className="text-sm font-medium text-[var(--warning)]">
                        {formatIDR(fee)}
                      </span>
                    </div>
                  </div>
                )}

                <div className="p-3 rounded-lg bg-[var(--primary)]/10 border border-[var(--primary)]">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-[var(--primary)]">Total:</span>
                    <span className="text-lg font-semibold text-[var(--primary)]">
                      {formatIDR(total)}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>Pilih akun dan jumlah untuk melihat preview</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Transfer History Table */}
      <Card className="rounded-xl border border-border bg-card p-4">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-foreground">
            Riwayat Transfer
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {transferHistory.length} transfer terakhir
          </p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-xs uppercase font-medium text-muted-foreground">
                    Tanggal
                  </th>
                  <th className="text-left py-3 px-4 text-xs uppercase font-medium text-muted-foreground">
                    Dari → Ke
                  </th>
                  <th className="text-right py-3 px-4 text-xs uppercase font-medium text-muted-foreground">
                    Jumlah
                  </th>
                  <th className="text-right py-3 px-4 text-xs uppercase font-medium text-muted-foreground">
                    Biaya
                  </th>
                  <th className="text-left py-3 px-4 text-xs uppercase font-medium text-muted-foreground">
                    Catatan
                  </th>
                  <th className="text-center py-3 px-4 text-xs uppercase font-medium text-muted-foreground">
                    Status
                  </th>
                  <th className="text-center py-3 px-4 text-xs uppercase font-medium text-muted-foreground">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {transferHistory.map((transfer, index) => (
                  <tr 
                    key={transfer.id}
                    className={`border-b border-border ${
                      index % 2 === 0 ? "bg-card" : "bg-muted"
                    }`}
                  >
                    <td className="py-3 px-4 text-sm text-foreground">
                      {formatDateID(transfer.date)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs">
                          {transfer.fromAccount}
                        </Badge>
                        <span className="text-muted-foreground">→</span>
                        <Badge variant="outline" className="text-xs">
                          {transfer.toAccount}
                        </Badge>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-sm font-medium text-foreground">
                        {formatIDR(transfer.amount)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-sm text-muted-foreground">
                        {transfer.fee > 0 ? formatIDR(transfer.fee) : '-'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-foreground">
                      {transfer.description}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Badge 
                        variant="outline"
                        className={`text-xs ${
                          transfer.status === 'completed' ? 'bg-[var(--success)] text-[var(--txt-high)] border-[var(--success)]' :
                          transfer.status === 'pending' ? 'bg-[var(--warning)] text-[var(--txt-high)] border-[var(--warning)]' :
                          'bg-[var(--danger)] text-[var(--txt-high)] border-[var(--danger)]'
                        }`}
                      >
                        {transfer.status === 'completed' ? 'Selesai' :
                         transfer.status === 'pending' ? 'Pending' : 'Gagal'}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditTransfer(transfer)}
                          className="h-8 px-3 text-xs"
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteTransfer(transfer.id)}
                          className="h-8 px-3 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          Hapus
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
