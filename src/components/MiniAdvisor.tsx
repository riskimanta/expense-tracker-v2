"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { formatIDR } from '@/lib/currency'
import { CurrencyInput } from '@/components/ui/currency-input'
import { formatDateID } from '@/lib/format'

interface MiniAdvisorProps {
  safeToSpend: number
  onCheck?: (price: number) => void
}

export function MiniAdvisor({ safeToSpend, onCheck }: MiniAdvisorProps) {
  const [priceNumber, setPriceNumber] = useState<number>(0)
  const [result, setResult] = useState<{
    canAfford: boolean
    message: string
    reason: string
    recommendation: string
    safeDate?: string
  } | null>(null)





  const handleCheck = () => {
    if (priceNumber <= 0) return

    const canAfford = priceNumber <= safeToSpend
    const newResult = {
      canAfford,
      message: canAfford ? 'Aman! Kamu bisa beli ini.' : 'Tunda dulu, belum aman.',
      reason: canAfford 
        ? `Sisa aman bulan ini: ${formatIDR(safeToSpend)}`
        : `Kurang ${formatIDR(priceNumber - safeToSpend)} dari sisa aman`,
      recommendation: canAfford 
        ? 'Beli sekarang atau tunggu promo'
        : 'Tunggu gaji berikutnya atau kurangi pengeluaran lain',
      safeDate: canAfford ? undefined : '2025-02-01' // Mock date
    }
    
    setResult(newResult)
    onCheck?.(priceNumber)
  }

  return (
    <Card className="rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-[color:var(--txt-1)]">
          Bisa Beli Nggak? 💡
        </CardTitle>
        <p className="text-sm text-[color:var(--txt-2)]">
          Cek apakah kamu bisa beli barang impian
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex space-x-2">
          <CurrencyInput
            value={priceNumber}
            onChange={(value) => setPriceNumber(value || 0)}
            placeholder="Masukkan harga (contoh: 500.000)"
            className="flex-1"
            data-testid="canbuy-input"
          />
                  <Button onClick={handleCheck} disabled={priceNumber <= 0} data-testid="canbuy-submit">
          Cek
        </Button>
        </div>

        {result && (
          <div className={`p-4 rounded-lg border ${
            result.canAfford 
              ? 'border-[var(--success)] bg-[var(--success)]/10' 
              : 'border-[var(--danger)] bg-[var(--danger)]/10'
          }`} data-testid="canbuy-result">
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
                <p className="text-sm text-[color:var(--txt-2)] mt-1">
                  {result.reason}
                </p>
                <p className="text-sm text-[color:var(--txt-2)] mt-1">
                  {result.recommendation}
                </p>
                {result.safeDate && (
                  <p className="text-sm text-[color:var(--txt-2)] mt-1">
                    Estimasi aman: {formatDateID(result.safeDate)}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="text-xs text-[color:var(--txt-2)]">
          💡 Sisa aman bulan ini: {formatIDR(safeToSpend)}
        </div>
      </CardContent>
    </Card>
  )
}
