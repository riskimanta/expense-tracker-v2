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
import { useIncome, useIncomeKPIs, useCreateIncome, useIncomeCategories, useIncomeAccounts, useUpdateIncome, useDeleteIncome } from '@/hooks/useIncome'
import { useToast } from '@/components/ToastProvider'
import { EditTransactionDialog } from '@/components/EditTransactionDialog'

export default function IncomePage() {
  const [selectedMonth] = useState(new Date())
  const [formData, setFormData] = useState({
    date: new Date(),
    account: '',
    source: '',
    amount: null as number | null,
    description: ''
  })
  const [formErrors, setFormErrors] = useState({
    account: false,
    source: false,
    amount: false,
    description: false
  })
  const [editingTransaction, setEditingTransaction] = useState<{
    id: string;
    date: string;
    amount: number;
    description?: string;
    type?: string;
    category_id?: string;
    category_name?: string;
    account_id?: string;
    account_name?: string;
  } | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const { showToast } = useToast()

  // Use hooks for data fetching
  const { data: incomeTransactions = [], isLoading: isLoadingTransactions } = useIncome({
    userId: '1',
    month: selectedMonth
  })
  
  const { data: incomeKPIs = {
    totalIncome: 0,
    monthlyTarget: 10000000,
    averageDaily: 0,
    topSource: 'N/A',
    topSourceAmount: 0
  }, isLoading: isLoadingKPIs } = useIncomeKPIs({
    userId: '1',
    month: selectedMonth
  })
  
  const { data: categories = [] } = useIncomeCategories()
  const { data: accounts = [] } = useIncomeAccounts('1')
  const createIncomeMutation = useCreateIncome()
  const updateIncomeMutation = useUpdateIncome()
  const deleteIncomeMutation = useDeleteIncome()

  const validateForm = () => {
    const errors = {
      account: !formData.account,
      source: !formData.source,
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

    try {
      await createIncomeMutation.mutateAsync({
        date: formData.date.toISOString().split('T')[0],
        categoryId: formData.source,
        amount: formData.amount || 0,
        description: formData.description,
        accountId: formData.account,
        type: 'INCOME'
      })

      showToast({
        title: 'Sukses!',
        description: 'Pemasukan berhasil ditambahkan',
        variant: 'success'
      })

      // Reset form
      setFormData({
        date: new Date(),
        account: '',
        source: '',
        amount: null,
        description: ''
      })
      setFormErrors({
        account: false,
        source: false,
        amount: false,
        description: false
      })
    } catch (error) {
      console.error('Error creating income:', error)
      showToast({
        title: 'Error',
        description: 'Gagal menambahkan pemasukan',
        variant: 'destructive'
      })
    }
  }

  const handleEditTransaction = (transaction: {
    id: string;
    date: string;
    amount: number;
    description?: string;
    type?: string;
    category_id?: string;
    account_id?: string;
  }) => {
    setEditingTransaction(transaction)
    setIsEditDialogOpen(true)
  }

  const handleDeleteTransaction = async (transactionId: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus pemasukan ini?')) {
      try {
        await deleteIncomeMutation.mutateAsync(transactionId)
        showToast({
          title: 'Sukses!',
          description: 'Pemasukan berhasil dihapus',
          variant: 'success'
        })
      } catch (error) {
        console.error('Failed to delete income:', error)
        showToast({
          title: 'Error',
          description: 'Gagal menghapus pemasukan. Silakan coba lagi.',
          variant: 'destructive'
        })
      }
    }
  }

  const handleSaveEdit = async (data: {
    id: string;
    date: string;
    categoryId: string;
    amount: number;
    description: string;
    accountId: string;
    type: string;
  }) => {
    try {
      await updateIncomeMutation.mutateAsync({
        id: data.id,
        data: {
          date: data.date,
          categoryId: data.categoryId,
          amount: data.amount,
          description: data.description,
          accountId: data.accountId,
          type: data.type
        }
      })
      showToast({
        title: 'Sukses!',
        description: 'Pemasukan berhasil diperbarui',
        variant: 'success'
      })
      setIsEditDialogOpen(false)
      setEditingTransaction(null)
    } catch (error) {
      console.error('Failed to update income:', error)
      showToast({
        title: 'Error',
        description: 'Gagal memperbarui pemasukan. Silakan coba lagi.',
        variant: 'destructive'
      })
    }
  }

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false)
    setEditingTransaction(null)
  }

  return (
    <main className="mx-auto max-w-[1200px] p-6 space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-semibold text-foreground">Pemasukan</h1>
        <p className="mt-1 text-muted-foreground">Kelola pemasukan dan sumber penghasilan</p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="rounded-xl border border-border bg-card p-5">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Total Pemasukan</p>
            <p className="text-2xl font-semibold text-[var(--success)]">
              {formatIDR(incomeKPIs.totalIncome)}
            </p>
            <p className="text-xs text-muted-foreground">
              Bulan ini
            </p>
          </div>
        </Card>
        
        <Card className="rounded-xl border border-border bg-card p-5">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Target Bulanan</p>
            <p className="text-2xl font-semibold text-foreground">
              {formatIDR(incomeKPIs.monthlyTarget)}
            </p>
            <p className="text-xs text-muted-foreground">
              {Math.round((incomeKPIs.totalIncome / incomeKPIs.monthlyTarget) * 100)}% tercapai
            </p>
          </div>
        </Card>
        
        <Card className="rounded-xl border border-border bg-card p-5">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Rata-rata Harian</p>
            <p className="text-2xl font-semibold text-[var(--primary)]">
              {formatIDR(incomeKPIs.averageDaily)}
            </p>
            <p className="text-xs text-muted-foreground">
              Per hari
            </p>
          </div>
        </Card>
        
        <Card className="rounded-xl border border-border bg-card p-5">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Sumber Teratas</p>
            <p className="text-2xl font-semibold text-[var(--warning)]">
              {incomeKPIs.topSource}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatIDR(incomeKPIs.topSourceAmount)}
            </p>
          </div>
        </Card>
      </div>

      {/* Form + Table Section */}
      <div className="grid grid-cols-12 gap-6">
        {/* Form Card */}
        <Card className="col-span-12 lg:col-span-5 rounded-xl border border-border bg-card p-4">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-foreground">
              Tambah Pemasukan
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Catat pemasukan baru
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground">Tanggal</label>
                  <DateInput
                    value={formData.date}
                    onChange={(date) => setFormData({...formData, date: date || new Date()})}
                    placeholder="DD/MM/YYYY"
                  />
                </div>
                <div>
                  <label className={`text-sm ${formErrors.account ? 'text-red-500' : 'text-muted-foreground'}`}>
                    Akun {formErrors.account && <span className="text-red-500">*</span>}
                  </label>
                  <Select value={formData.account} onValueChange={(value) => {
                    setFormData({...formData, account: value})
                    if (formErrors.account) {
                      setFormErrors({...formErrors, account: false})
                    }
                  }}>
                    <SelectTrigger className={`h-11 ${formErrors.account ? 'border-red-500 focus:border-red-500' : ''}`}>
                      <SelectValue placeholder="Pilih akun" />
                    </SelectTrigger>
                    <SelectContent>
                      {accounts.map((account: Record<string, unknown>) => (
                        <SelectItem key={(account.id as string | number)?.toString() || ''} value={(account.id as string | number)?.toString() || ''}>
                          {account.name as string}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <label className={`text-sm ${formErrors.source ? 'text-red-500' : 'text-muted-foreground'}`}>
                  Sumber {formErrors.source && <span className="text-red-500">*</span>}
                </label>
                <Select value={formData.source} onValueChange={(value) => {
                  setFormData({...formData, source: value})
                  if (formErrors.source) {
                    setFormErrors({...formErrors, source: false})
                  }
                }}>
                  <SelectTrigger className={`h-11 ${formErrors.source ? 'border-red-500 focus:border-red-500' : ''}`}>
                    <SelectValue placeholder="Pilih sumber" />
                  </SelectTrigger>
                  <SelectContent>
                                        {categories.map((category: Record<string, unknown>) => (
                        <SelectItem key={(category.id as string | number)?.toString() || ''} value={(category.id as string | number)?.toString() || ''}>
                          {category.name as string}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              
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
                  placeholder="5000000"
                  className={`h-11 ${formErrors.amount ? 'border-red-500 focus:border-red-500' : ''}`}
                />
                <p className="text-xs text-[var(--txt-low)] mt-1">
                  Contoh: 5000000 = 5.000.000
                </p>
              </div>
              
              <div>
                <label className="text-sm text-muted-foreground">
                  Catatan (Opsional)
                </label>
                <Textarea
                  placeholder="Deskripsi pemasukan..."
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="min-h-[88px]"
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full h-11"
                disabled={createIncomeMutation.isPending}
              >
                {createIncomeMutation.isPending ? 'Menyimpan...' : 'Simpan'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Table Card */}
        <Card className="col-span-12 lg:col-span-7 rounded-xl border border-border bg-card p-4">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-foreground">
              Daftar Pemasukan
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Transaksi bulan {selectedMonth.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
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
                      Akun
                    </th>
                    <th className="text-left py-3 px-4 text-xs uppercase font-medium text-muted-foreground">
                      Kategori
                    </th>
                    <th className="text-right py-3 px-4 text-xs uppercase font-medium text-muted-foreground">
                      Jumlah
                    </th>
                    <th className="text-left py-3 px-4 text-xs uppercase font-medium text-muted-foreground">
                      Catatan
                    </th>
                    <th className="text-center py-3 px-4 text-xs uppercase font-medium text-muted-foreground">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {isLoadingTransactions ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-muted-foreground">
                        Loading...
                      </td>
                    </tr>
                  ) : incomeTransactions.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-muted-foreground">
                        Belum ada data pemasukan
                      </td>
                    </tr>
                  ) : (
                    incomeTransactions.map((transaction: Record<string, unknown>, index: number) => (
                      <tr 
                        key={(transaction.id as string) || index}
                        className={`border-b border-border ${
                          index % 2 === 0 ? "bg-card" : "bg-muted"
                        }`}
                      >
                        <td className="py-3 px-4 text-sm text-foreground">
                          {formatDateID(transaction.date as string)}
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant="outline" className="text-xs">
                            {transaction.accountName as string}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm text-foreground">
                            {transaction.category as string}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <span className="text-sm font-medium text-[var(--success)]">
                            +{formatIDR(transaction.amount as number)}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-foreground">
                          {transaction.description as string}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                console.log('Income page - Transaction data being sent to edit:', transaction);
                                console.log('Income page - Transaction fields:', {
                                  id: transaction.id,
                                  category_id: transaction.category_id,
                                  account_id: transaction.account_id,
                                  category: transaction.category,
                                  accountName: transaction.accountName,
                                  type: transaction.type
                                });
                                handleEditTransaction({
                                  id: transaction.id as string,
                                  date: transaction.date as string,
                                  amount: transaction.amount as number,
                                  description: transaction.description as string,
                                  type: transaction.type as string,
                                  category_id: transaction.category_id as string,
                                  account_id: transaction.account_id as string
                                });
                              }}
                              className="h-8 w-8 p-0"
                            >
                              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteTransaction(transaction.id as string)}
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
      </div>

      {/* Edit Transaction Dialog */}
      <EditTransactionDialog
        transaction={editingTransaction}
        isOpen={isEditDialogOpen}
        onClose={handleCloseEditDialog}
        onSave={handleSaveEdit}
      />
    </main>
  )
}
