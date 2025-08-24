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
  mockTransferTransactions, 
  mockAccounts
} from '@/mock/transfer'
import { useToast } from '@/components/ToastProvider'

export default function TransferPage() {
  const [formData, setFormData] = useState({
    fromAccount: '',
    toAccount: '',
    amount: '',
    fee: '0',
    date: '2025-01-18',
    description: ''
  })
  const { showToast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.fromAccount || !formData.toAccount || !formData.amount || !formData.description) {
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

    // Mock submission
    showToast({
      title: 'Sukses!',
      description: 'Transfer berhasil diproses',
      variant: 'success'
    })

    // Reset form
    setFormData({
      fromAccount: '',
      toAccount: '',
      amount: '',
      fee: '0',
      date: '2025-01-18',
      description: ''
    })
  }

  const getAccountBalance = (accountId: string) => {
    const account = mockAccounts.find(acc => acc.id === accountId)
    return account?.balance || 0
  }

  const getAccountName = (accountId: string) => {
    const account = mockAccounts.find(acc => acc.id === accountId)
    return account?.name || accountId
  }

  const amount = parseInt(formData.amount) || 0
  const fee = parseInt(formData.fee) || 0
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
                  <label className="text-sm text-muted-foreground">Dari Akun</label>
                  <Select value={formData.fromAccount} onValueChange={(value) => setFormData({...formData, fromAccount: value})}>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Pilih akun asal" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockAccounts.map((account) => (
                        <SelectItem key={account.id} value={account.id}>
                          {account.name} - {formatIDR(account.balance)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Ke Akun</label>
                  <Select value={formData.toAccount} onValueChange={(value) => setFormData({...formData, toAccount: value})}>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Pilih akun tujuan" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockAccounts.map((account) => (
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
                  <label className="text-sm text-muted-foreground">Jumlah</label>
                  <Input
                    type="text"
                    placeholder="1000000"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    className="h-11"
                  />
                  <p className="text-xs text-[var(--txt-low)] mt-1">
                    Contoh: 1000000 = Rp 1.000.000
                  </p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Biaya (Opsional)</label>
                  <Input
                    type="text"
                    placeholder="0"
                    value={formData.fee}
                    onChange={(e) => setFormData({...formData, fee: e.target.value})}
                    className="h-11"
                  />
                  <p className="text-xs text-[var(--txt-low)] mt-1">
                    Biaya transfer/admin
                  </p>
                </div>
              </div>
              
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
                <label className="text-sm text-muted-foreground">Catatan</label>
                <Textarea
                  placeholder="Alasan transfer..."
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="min-h-[88px]"
                />
              </div>
              
              <Button type="submit" className="w-full h-11">
                Proses Transfer
              </Button>
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
            {mockTransferTransactions.length} transfer terakhir
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
                </tr>
              </thead>
              <tbody>
                {mockTransferTransactions.map((transfer, index) => (
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
