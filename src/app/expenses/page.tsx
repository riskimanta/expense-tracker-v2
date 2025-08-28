"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { PieChart, Pie, Cell } from 'recharts'
import { formatIDR } from '@/lib/currency'
import { CurrencyInput } from '@/components/ui/currency-input'
import { DateInput } from '@/components/ui/date-input'
import { getCurrencyOptions } from '@/lib/currency'

import { FilterBar } from '@/components/expenses/FilterBar'
import { useExpenses, useExpenseCategories, useCreateExpense, useAccounts, useUpdateTransaction, useDeleteTransaction } from '@/hooks/useExpenses'
import { TransactionsTable } from '@/components/TransactionsTable'
import { EditTransactionDialog } from '@/components/EditTransactionDialog'
import { calculateKPIs, calculateBudgetAllocation } from '@/mock/expenses'
import { useToast } from '@/components/ToastProvider'

export default function ExpensesPage() {
  const [month, setMonth] = useState<Date | null>(() => {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth(), 1)
  })
  const [categoryId, setCategoryId] = useState('all')
  const [accountId, setAccountId] = useState('all')
  const [isSplitMode, setIsSplitMode] = useState(false)
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
  const [formData, setFormData] = useState({
    date: new Date(),
    category: '',
    amountNumber: 0,
    description: '',
    account: '1',
    currency: 'IDR'
  })
  const [formErrors, setFormErrors] = useState({
    category: false,
    amountNumber: false,
    description: false
  })
  
  const { showToast } = useToast()
  
  // Fetch data using hooks
  const { data: expenses = [], isLoading: expensesLoading } = useExpenses({
    userId: '1',
    month,
    categoryId,
    accountId
  })
  
  const { data: categories = [], isLoading: categoriesLoading } = useExpenseCategories()
  const { data: accounts = [], isLoading: accountsLoading } = useAccounts('1')
  
  // Create expense mutation
  const createExpenseMutation = useCreateExpense()
  const updateTransactionMutation = useUpdateTransaction()
  const deleteTransactionMutation = useDeleteTransaction()
  
  // Calculate KPIs and budget allocation based on filtered data
  const kpis = calculateKPIs(expenses)
  const budgetAllocation = calculateBudgetAllocation(expenses)
  
  // Loading states
  if (expensesLoading || categoriesLoading || accountsLoading) {
    return (
      <main className="mx-auto max-w-[1200px] p-6 space-y-6">
        <div className="mb-6">
          <h1 className="text-3xl font-semibold text-foreground">Pengeluaran</h1>
          <p className="mt-1 text-muted-foreground">Kelola pengeluaran dan budget bulanan</p>
        </div>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </main>
    )
  }

  const validateForm = () => {
    const errors = {
      category: !formData.category,
      amountNumber: formData.amountNumber <= 0,
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
        description: 'Semua field wajib harus diisi dan jumlah harus lebih dari 0',
        variant: 'destructive'
      })
      return
    }

    try {
      await createExpenseMutation.mutateAsync({
        date: formData.date.toISOString().split('T')[0], // Convert Date to YYYY-MM-DD format
        categoryId: formData.category,
        amount: formData.amountNumber,
        description: formData.description,
        accountId: formData.account,
        userId: '1'
      })

      showToast({
        title: 'Sukses!',
        description: 'Pengeluaran berhasil ditambahkan',
        variant: 'success'
      })

      // Reset form
      setFormData({
        date: new Date(),
        category: '',
        amountNumber: 0,
        description: '',
        account: '1',
        currency: 'IDR'
      })
      setFormErrors({
        category: false,
        amountNumber: false,
        description: false
      })
    } catch (error) {
      console.error('Failed to create expense:', error)
      showToast({
        title: 'Error',
        description: 'Gagal menambahkan pengeluaran. Silakan coba lagi.',
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
    if (confirm('Apakah Anda yakin ingin menghapus transaksi ini?')) {
      try {
        await deleteTransactionMutation.mutateAsync(transactionId)
        showToast({
          title: 'Sukses!',
          description: 'Transaksi berhasil dihapus',
          variant: 'success'
        })
      } catch (error) {
        console.error('Failed to delete transaction:', error)
        showToast({
          title: 'Error',
          description: 'Gagal menghapus transaksi. Silakan coba lagi.',
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
    await updateTransactionMutation.mutateAsync(data)
  }

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false)
    setEditingTransaction(null)
  }



  return (
    <main className="mx-auto max-w-[1200px] p-6 space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-semibold text-foreground">Pengeluaran</h1>
        <p className="mt-1 text-muted-foreground">Kelola pengeluaran dan budget bulanan</p>
      </div>

      {/* Filter Bar */}
      <FilterBar
        month={month}
        categoryId={categoryId}
        accountId={accountId}
        categories={categories}
        accounts={accounts}
        onMonthChange={setMonth}
        onCategoryChange={setCategoryId}
        onAccountChange={setAccountId}
      />

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="rounded-xl border border-border bg-card p-5">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Total Pengeluaran</p>
            <p className="text-2xl font-semibold text-[var(--danger)]">
              {formatIDR(kpis.totalSpent)}
            </p>
            <p className="text-xs text-muted-foreground">
              {kpis.daysRemaining} hari tersisa
            </p>
          </div>
        </Card>
        
        <Card className="rounded-xl border border-border bg-card p-5">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Budget Bulanan</p>
            <p className="text-2xl font-semibold text-foreground">
              {formatIDR(kpis.monthlyBudget)}
            </p>
            <p className="text-xs text-muted-foreground">
              Sisa: {formatIDR(kpis.remainingBudget)}
            </p>
          </div>
        </Card>
        
        <Card className="rounded-xl border border-border bg-card p-5">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Kategori Teratas</p>
            <p className="text-2xl font-semibold text-[var(--needs)]">
              {kpis.topCategory}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatIDR(kpis.topCategoryAmount)}
            </p>
          </div>
        </Card>
        
        <Card className="rounded-xl border border-border bg-card p-5">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Rata-rata Harian</p>
            <p className="text-2xl font-semibold text-foreground">
              {formatIDR(kpis.averageDaily)}
            </p>
            <p className="text-xs text-muted-foreground">
              Per hari
            </p>
          </div>
        </Card>
      </div>

      {/* Form + Budget Section */}
      <div className="grid grid-cols-12 gap-6">
        {/* Form Card */}
        <Card className="col-span-12 lg:col-span-7 rounded-xl border border-border bg-card p-4">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-foreground">
                Tambah Pengeluaran
              </CardTitle>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">Split this transaction</span>
                <Switch 
                  checked={isSplitMode}
                  onCheckedChange={setIsSplitMode}
                />
              </div>
            </div>
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
                    data-testid="tx-date"
                  />
                </div>
                <div>
                  <label className={`text-sm ${formErrors.category ? 'text-red-500' : 'text-muted-foreground'}`}>
                    Kategori {formErrors.category && <span className="text-red-500">*</span>}
                  </label>
                  <Select value={formData.category} onValueChange={(value) => {
                    setFormData({...formData, category: value})
                    if (formErrors.category) {
                      setFormErrors({...formErrors, category: false})
                    }
                  }}>
                    <SelectTrigger className={`h-11 ${formErrors.category ? 'border-red-500 focus:border-red-500' : ''}`} data-testid="tx-category">
                      <SelectValue placeholder="Pilih kategori" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat: { id: string; name: string }) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`text-sm ${formErrors.amountNumber ? 'text-red-500' : 'text-muted-foreground'}`}>
                    Jumlah {formErrors.amountNumber && <span className="text-red-500">*</span>}
                  </label>
                  <CurrencyInput
                    value={formData.amountNumber}
                    onValueChange={(value) => {
                      setFormData({...formData, amountNumber: value || 0})
                      if (formErrors.amountNumber) {
                        setFormErrors({...formErrors, amountNumber: false})
                      }
                    }}
                    placeholder="50.000"
                    className={`h-11 ${formErrors.amountNumber ? 'border-red-500 focus:border-red-500' : ''}`}
                    data-testid="amount-input"
                  />
                  <p className="text-xs text-[var(--txt-low)] mt-1">
                    Format otomatis: 50000 → 50.000
                  </p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Mata Uang</label>
                  <Select value={formData.currency || 'IDR'} onValueChange={(value) => setFormData({...formData, currency: value})}>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Pilih mata uang" />
                    </SelectTrigger>
                    <SelectContent>
                      {getCurrencyOptions().map((currency) => (
                        <SelectItem key={currency.value} value={currency.value}>
                          {currency.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground">Akun</label>
                  <Select value={formData.account} onValueChange={(value) => setFormData({...formData, account: value})}>
                    <SelectTrigger className="h-11" data-testid="tx-account">
                      <SelectValue placeholder="Pilih akun" />
                    </SelectTrigger>
                    <SelectContent>
                      {accounts.map((acc: { id: string; name: string; type: string; balance: number }) => (
                        <SelectItem key={acc.id} value={acc.id}>
                          {acc.name} - {formatIDR(acc.balance)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">
                    Catatan (Opsional)
                  </label>
                  <Textarea
                    placeholder="Deskripsi pengeluaran..."
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="min-h-[88px]"
                    data-testid="tx-note"
                  />
                </div>
              </div>
              
              <Button type="submit" className="w-full h-11" data-testid="tx-submit">
                Simpan
              </Button>
              

            </form>
          </CardContent>
        </Card>

        {/* Budget Allocation Card */}
        <Card className="col-span-12 lg:col-span-5 rounded-xl border border-border bg-card p-4">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-foreground">
              Budget Allocation
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Aturan 50/25/5/15/5
            </p>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <div className="w-[140px] h-[140px]">
                <PieChart width={140} height={140}>
                  <Pie
                    data={budgetAllocation}
                    cx="50%"
                    cy="50%"
                    innerRadius={42}
                    outerRadius={70}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {budgetAllocation.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </div>
              <div className="flex-1 space-y-2">
                {budgetAllocation.slice(0, 3).map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm text-foreground">{item.name}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {item.value}%
                    </span>
                  </div>
                ))}
                <div className="text-xs text-[var(--txt-low)]">
                  +2 more 20%
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transactions Table */}
      <Card className="rounded-xl border border-border bg-card p-4" data-testid="tx-table">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-foreground">
            Daftar Transaksi
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Transaksi bulan {month ? month.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }) : 'Semua periode'}
          </p>
        </CardHeader>
        <CardContent>
          <TransactionsTable
            transactions={expenses}
            onEdit={handleEditTransaction}
            onDelete={handleDeleteTransaction}
            onAccountClick={(accountId) => setAccountId(accountId)}
          />
        </CardContent>
      </Card>

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