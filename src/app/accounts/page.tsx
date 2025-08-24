"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AccountCard } from "@/components/AccountCard"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { useAccounts } from "@/hooks/use-mock-data"
import { formatIDR } from "@/lib/format"
import { ClientOnly } from "@/components/ClientOnly"
import type { AccountType } from "@/components/AccountCard"

// Force dynamic rendering to prevent SSR issues with TanStack Query
export const dynamic = 'force-dynamic'

function AccountsPageContent() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [newAccount, setNewAccount] = useState({
    name: "",
    type: "checking" as AccountType,
    balance: 0,
  })

  const { data: accounts, isLoading } = useAccounts()

  const handleAddAccount = () => {
    console.log("Adding account:", newAccount)
    // TODO: Implement account creation
    setIsAddModalOpen(false)
    setNewAccount({ name: "", type: "checking", balance: 0 })
  }

  const totalBalance = accounts?.reduce((sum, acc) => sum + acc.balance, 0) || 0

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Akun</h1>
          <p className="text-muted-foreground">
            Kelola akun keuangan Anda
          </p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)}>
          Tambah Akun
        </Button>
      </div>

      {/* Total Balance */}
      <Card>
        <CardHeader>
          <CardTitle>Total Saldo Semua Akun</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{formatIDR(totalBalance)}</div>
        </CardContent>
      </Card>

      {/* Accounts Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {accounts?.map((account) => (
          <AccountCard
            key={account.id}
            account={account}
            rightSlot={
              <div className="flex gap-2">
                <Button variant="outline" size="sm">Edit</Button>
                <Button variant="outline" size="sm" className="text-destructive">Hapus</Button>
              </div>
            }
          />
        ))}
      </div>

      {/* Add Account Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tambah Akun Baru</DialogTitle>
            <DialogDescription>
              Tambahkan akun keuangan baru untuk melacak saldo dan transaksi.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="accountName">Nama Akun</Label>
              <Input
                id="accountName"
                value={newAccount.name}
                onChange={(e) => setNewAccount({ ...newAccount, name: e.target.value })}
                placeholder="Contoh: BCA Tabungan"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="accountType">Jenis Akun</Label>
              <Select
                value={newAccount.type}
                onChange={(e) => setNewAccount({ ...newAccount, type: e.target.value as AccountType })}
              >
                <option value="checking">Giro</option>
                <option value="savings">Tabungan</option>
                <option value="credit">Kartu Kredit</option>
                <option value="cash">Tunai</option>
                <option value="investment">Investasi</option>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="accountBalance">Saldo Awal</Label>
              <Input
                id="accountBalance"
                type="number"
                step="0.01"
                value={newAccount.balance}
                onChange={(e) => setNewAccount({ ...newAccount, balance: Number(e.target.value) })}
                placeholder="0"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="secondary" onClick={() => setIsAddModalOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleAddAccount}>
              Tambah Akun
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default function AccountsPage() {
  return (
    <ClientOnly fallback={<div>Loading...</div>}>
      <AccountsPageContent />
    </ClientOnly>
  )
}
