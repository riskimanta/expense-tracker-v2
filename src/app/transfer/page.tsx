"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CurrencyInput } from '@/components/ui/currency-input'
import { DateInput } from '@/components/ui/date-input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { formatIDR } from '@/lib/format'
import { formatDateID } from '@/lib/format'
import { accountService } from '@/lib/accountService'
import type { Account } from '@/types/admin'
import { useToast } from '@/components/ToastProvider'

interface Transfer {
  id: string
  fromAccount: string
  toAccount: string
  amount: number
  fee: number
  date: string
  description: string
}

export default function TransferPage() {
  const { showToast } = useToast()
  
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
  const [transferHistory, setTransferHistory] = useState<Transfer[]>([])
  
  // State untuk accounts yang bisa di-update
  const [accounts, setAccounts] = useState<Account[]>([])
  
  // State untuk mode edit
  const [isEditMode, setIsEditMode] = useState(false)
  const [editingTransferId, setEditingTransferId] = useState<string | null>(null)

  // Load accounts from service when component mounts
  useEffect(() => {
    const loadAccounts = async () => {
      try {
        const storedAccounts = await accountService.getAccounts()
        setAccounts(storedAccounts)
      } catch (error) {
        console.error('Error loading accounts:', error)
        showToast({
          title: 'Error',
          description: 'Gagal memuat data akun',
          variant: 'destructive'
        })
      }
    }
    
    loadAccounts()
  }, [showToast])

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

    try {
      // Update account balances
      await accountService.updateAccountBalances(
        formData.fromAccount,
        formData.toAccount,
        formData.amount || 0,
        formData.fee || 0
      )

      // Create transfer record
      const newTransfer: Transfer = {
        id: Date.now().toString(),
        fromAccount: accounts.find(acc => acc.id === formData.fromAccount)?.name || '',
        toAccount: accounts.find(acc => acc.id === formData.toAccount)?.name || '',
        amount: formData.amount || 0,
        fee: formData.fee || 0,
        date: formData.date.toISOString().split('T')[0],
        description: formData.description
      }

      setTransferHistory(prev => [newTransfer, ...prev])

      // Refresh accounts
      const freshAccounts = await accountService.getAccounts()
      setAccounts(freshAccounts)

      // Reset form
      setFormData({
        fromAccount: '',
        toAccount: '',
        amount: null,
        fee: null,
        date: new Date(),
        description: ''
      })

      showToast({
        title: 'Sukses!',
        description: 'Transfer berhasil dilakukan',
        variant: 'success'
      })
    } catch (error) {
      showToast({
        title: 'Error',
        description: 'Gagal melakukan transfer',
        variant: 'destructive'
      })
    }
  }

  // Function to handle edit transfer
  const handleEditTransfer = (transfer: Transfer) => {
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
        <h1 className="text-3xl font-semibold text-[color:var(--txt-1)]">Transfer</h1>
        <p className="mt-1 text-[color:var(--txt-2)]">Transfer antar akun dan e-wallet</p>
      </div>

      {/* Form + Preview Section */}
      <div className="grid grid-cols-12 gap-6">
        {/* Form Card */}
        <Card className="col-span-12 lg:col-span-7 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-[color:var(--txt-1)]">
              Transfer antar Akun
            </CardTitle>
            <p className="text-sm text-[color:var(--txt-2)]">
              Pindahkan dana antar akun
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`text-sm ${formErrors.fromAccount ? 'text-red-500' : 'text-[color:var(--txt-2)]'}`}>
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
                  </Select>
                </div>
                <div>
                  <label className={`text-sm ${formErrors.toAccount ? 'text-red-500' : 'text-[color:var(--txt-2)]'}`}>
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
                        .filter(acc => acc.id !== formData.fromAccount)
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
                  <label className={`text-sm ${formErrors.amount ? 'text-red-500' : 'text-[color:var(--txt-2)]'}`}>
                    Jumlah {formErrors.amount && <span className="text-red-500">*</span>}
                  </label>
                  <CurrencyInput
                    value={formData.amount || 0}
                    onChange={(value) => {
                      setFormData({...formData, amount: value})
                      if (formErrors.amount) {
                        setFormErrors({...formErrors, amount: false})
                      }
                    }}
                    placeholder="1000000"
                    className={`h-11 ${formErrors.amount ? 'border-red-500 focus:border-red-500' : ''}`}
                  />
                </div>
                <div>
                  <label className="text-sm text-[color:var(--txt-2)]">
                    Biaya Transfer
                  </label>
                  <CurrencyInput
                    value={formData.fee || 0}
                    onChange={(value) => setFormData({...formData, fee: value})}
                    placeholder="0"
                    className="h-11"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-[color:var(--txt-2)]">
                  Tanggal Transfer
                </label>
                                  <DateInput
                    value={formData.date}
                    onChange={(date) => setFormData({...formData, date: date || new Date()})}
                    className="h-11"
                  />
              </div>

              <div>
                <label className="text-sm text-[color:var(--txt-2)]">
                  Catatan (Opsional)
                </label>
                <Textarea
                  placeholder="Deskripsi transfer..."
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="min-h-[88px]"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full h-11"
              >
                {isEditMode ? 'Update Transfer' : 'Lakukan Transfer'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Preview Card */}
        <Card className="col-span-12 lg:col-span-5 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-[color:var(--txt-1)]">
              Preview Transfer
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-[color:var(--txt-2)]">Dari Akun:</span>
                <span className="text-sm font-medium">
                  {accounts.find(acc => acc.id === formData.fromAccount)?.name || '-'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-[color:var(--txt-2)]">Ke Akun:</span>
                <span className="text-sm font-medium">
                  {accounts.find(acc => acc.id === formData.toAccount)?.name || '-'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-[color:var(--txt-2)]">Jumlah:</span>
                <span className="text-sm font-medium text-[var(--danger)]">
                  -{formatIDR(amount)}
                </span>
              </div>
              {fee && fee > 0 && (
                <div className="flex justify-between">
                  <span className="text-sm text-[color:var(--txt-2)]">Biaya:</span>
                  <span className="text-sm font-medium text-[var(--danger)]">
                    -{formatIDR(fee)}
                  </span>
                </div>
              )}
              <div className="border-t pt-3">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Total:</span>
                  <span className="text-sm font-bold text-[var(--danger)]">
                    -{formatIDR(total)}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transfer History */}
      <Card className="rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-[color:var(--txt-1)]">
            Riwayat Transfer
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[color:var(--border)]">
                  <th className="text-left py-3 px-4 text-xs uppercase font-medium text-[color:var(--txt-2)]">
                    Tanggal
                  </th>
                  <th className="text-left py-3 px-4 text-xs uppercase font-medium text-[color:var(--txt-2)]">
                    Dari
                  </th>
                  <th className="text-left py-3 px-4 text-xs uppercase font-medium text-[color:var(--txt-2)]">
                    Ke
                  </th>
                  <th className="text-right py-3 px-4 text-xs uppercase font-medium text-[color:var(--txt-2)]">
                    Jumlah
                  </th>
                  <th className="text-right py-3 px-4 text-xs uppercase font-medium text-[color:var(--txt-2)]">
                    Biaya
                  </th>
                  <th className="text-left py-3 px-4 text-xs uppercase font-medium text-[color:var(--txt-2)]">
                    Catatan
                  </th>
                  <th className="text-center py-3 px-4 text-xs uppercase font-medium text-[color:var(--txt-2)]">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {transferHistory.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-[color:var(--txt-2)]">
                      Belum ada riwayat transfer
                    </td>
                  </tr>
                ) : (
                  transferHistory.map((transfer) => (
                    <tr key={transfer.id} className="border-b border-[color:var(--border)]">
                      <td className="py-3 px-4 text-sm text-[color:var(--txt-1)]">
                        {formatDateID(transfer.date)}
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="outline" className="text-xs">
                          {transfer.fromAccount}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="outline" className="text-xs">
                          {transfer.toAccount}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="text-sm font-medium text-[var(--danger)]">
                          -{formatIDR(transfer.amount)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="text-sm text-[color:var(--txt-2)]">
                          {transfer.fee > 0 ? `-${formatIDR(transfer.fee)}` : '-'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-[color:var(--txt-1)]">
                        {transfer.description || '-'}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditTransfer(transfer)}
                            className="h-8 w-8 p-0"
                          >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteTransfer(transfer.id)}
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
