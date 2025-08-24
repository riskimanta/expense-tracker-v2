"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { formatIDR } from '@/lib/format'
import { formatDateID } from '@/lib/format'
import { 
  mockIncomeKPIs, 
  mockIncomeSources, 
  mockIncomeTransactions
} from '@/mock/income'
import { useToast } from '@/components/ToastProvider'

export default function IncomePage() {
  const [selectedMonth] = useState('2025-01')
  const [formData, setFormData] = useState({
    date: '2025-01-18',
    account: '',
    source: '',
    amount: '',
    description: ''
  })
  const { showToast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.account || !formData.source || !formData.amount || !formData.description) {
      showToast({
        title: 'Error',
        description: 'Semua field harus diisi',
        variant: 'destructive'
      })
      return
    }

    // Mock submission
    showToast({
      title: 'Sukses!',
      description: 'Pemasukan berhasil ditambahkan',
      variant: 'success'
    })

    // Reset form
    setFormData({
      date: '2025-01-18',
      account: '',
      source: '',
      amount: '',
      description: ''
    })
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
              {formatIDR(mockIncomeKPIs.totalIncome)}
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
              {formatIDR(mockIncomeKPIs.monthlyTarget)}
            </p>
            <p className="text-xs text-muted-foreground">
              {Math.round((mockIncomeKPIs.totalIncome / mockIncomeKPIs.monthlyTarget) * 100)}% tercapai
            </p>
          </div>
        </Card>
        
        <Card className="rounded-xl border border-border bg-card p-5">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Rata-rata Harian</p>
            <p className="text-2xl font-semibold text-[var(--primary)]">
              {formatIDR(mockIncomeKPIs.averageDaily)}
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
              {mockIncomeKPIs.topSource}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatIDR(mockIncomeKPIs.topSourceAmount)}
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
                  <Input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="h-11"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Akun</label>
                  <Select value={formData.account} onValueChange={(value) => setFormData({...formData, account: value})}>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Pilih akun" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="bca">BCA</SelectItem>
                      <SelectItem value="ovo">OVO</SelectItem>
                      <SelectItem value="gopay">GoPay</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <label className="text-sm text-muted-foreground">Sumber</label>
                <Select value={formData.source} onValueChange={(value) => setFormData({...formData, source: value})}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Pilih sumber" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockIncomeSources.map((source) => (
                      <SelectItem key={source.id} value={source.id}>
                        {source.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm text-muted-foreground">Jumlah</label>
                <Input
                  type="text"
                  placeholder="5000000"
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  className="h-11"
                />
                <p className="text-xs text-[var(--txt-low)] mt-1">
                  Contoh: 5000000 = Rp 5.000.000
                </p>
              </div>
              
              <div>
                <label className="text-sm text-muted-foreground">Catatan</label>
                <Textarea
                  placeholder="Deskripsi pemasukan..."
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="min-h-[88px]"
                />
              </div>
              
              <Button type="submit" className="w-full h-11">
                Simpan
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
              Transaksi bulan {selectedMonth}
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
                      Sumber
                    </th>
                    <th className="text-right py-3 px-4 text-xs uppercase font-medium text-muted-foreground">
                      Jumlah
                    </th>
                    <th className="text-left py-3 px-4 text-xs uppercase font-medium text-muted-foreground">
                      Catatan
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {mockIncomeTransactions.map((transaction, index) => (
                    <tr 
                      key={transaction.id}
                      className={`border-b border-border ${
                        index % 2 === 0 ? "bg-card" : "bg-muted"
                      }`}
                    >
                      <td className="py-3 px-4 text-sm text-foreground">
                        {formatDateID(transaction.date)}
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="outline" className="text-xs">
                          {transaction.account}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm text-foreground">
                          {transaction.source}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="text-sm font-medium text-[var(--success)]">
                          +{formatIDR(transaction.amount)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-foreground">
                        {transaction.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
