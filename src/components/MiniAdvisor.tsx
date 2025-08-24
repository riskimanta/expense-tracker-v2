"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { formatIDR } from '@/lib/format'
import { formatDateID } from '@/lib/format'

interface MiniAdvisorProps {
  safeToSpend: number
  onCheck?: (price: number) => void
}

export function MiniAdvisor({ safeToSpend, onCheck }: MiniAdvisorProps) {
  const [price, setPrice] = useState('')
  const [result, setResult] = useState<{
    canAfford: boolean
    message: string
    reason: string
    recommendation: string
    safeDate?: string
  } | null>(null)

  const handleCheck = () => {
    const priceNum = parseInt(price.replace(/\D/g, ''))
    if (isNaN(priceNum) || priceNum <= 0) return

    const canAfford = priceNum <= safeToSpend
    const newResult = {
      canAfford,
      message: canAfford ? 'Aman! Kamu bisa beli ini.' : 'Tunda dulu, belum aman.',
      reason: canAfford 
        ? `Sisa aman bulan ini: ${formatIDR(safeToSpend)}`
        : `Kurang ${formatIDR(priceNum - safeToSpend)} dari sisa aman`,
      recommendation: canAfford 
        ? 'Beli sekarang atau tunggu promo'
        : 'Tunggu gaji berikutnya atau kurangi pengeluaran lain',
      safeDate: canAfford ? undefined : '2025-02-01' // Mock date
    }
    
    setResult(newResult)
    onCheck?.(priceNum)
  }

  return (
    <Card className="rounded-xl border border-border bg-card p-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-foreground">
          Bisa Beli Nggak? 💡
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Cek apakah kamu bisa beli barang impian
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex space-x-2">
          <Input
            type="text"
            placeholder="Masukkan harga (contoh: 500000)"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="flex-1"
          />
          <Button onClick={handleCheck} disabled={!price.trim()}>
            Cek
          </Button>
        </div>

        {result && (
          <div className={`p-4 rounded-lg border ${
            result.canAfford 
              ? 'border-[var(--success)] bg-[var(--success)]/10' 
              : 'border-[var(--danger)] bg-[var(--danger)]/10'
          }`}>
            <div className="flex items-start space-x-3">
              <div className="text-2xl">
                {result.canAfford ? '✅' : '❌'}
              </div>
              <div className="flex-1">
                <h4 className={`font-semibold ${
                  result.canAfford ? 'text-[var(--success)]' : 'text-[var(--danger)]'
                }`}>
                  {result.message}
                </h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {result.reason}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {result.recommendation}
                </p>
                {result.safeDate && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Estimasi aman: {formatDateID(result.safeDate)}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="text-xs text-muted-foreground">
          💡 Sisa aman bulan ini: {formatIDR(safeToSpend)}
        </div>
      </CardContent>
    </Card>
  )
}
