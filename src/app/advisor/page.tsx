'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  DollarSign,
  PiggyBank,
  Target,
  Lightbulb
} from 'lucide-react'
import { formatIDR } from '@/lib/format'
import { useToast } from '@/components/ToastProvider'

interface FinancialAdvice {
  id: string
  type: 'budget' | 'saving' | 'investment' | 'debt'
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
  impact: 'positive' | 'negative' | 'neutral'
  estimatedSavings?: number
}

interface BudgetAnalysis {
  category: string
  current: number
  recommended: number
  status: 'good' | 'warning' | 'danger'
}

const mockFinancialAdvice: FinancialAdvice[] = [
  {
    id: '1',
    type: 'budget',
    title: 'Kurangi pengeluaran makanan & minuman',
    description: 'Pengeluaran kategori ini melebihi 30% dari total budget. Pertimbangkan untuk memasak sendiri atau mencari alternatif yang lebih murah.',
    priority: 'high',
    impact: 'positive',
    estimatedSavings: 150000
  },
  {
    id: '2',
    type: 'saving',
    title: 'Tingkatkan alokasi dana darurat',
    description: 'Dana darurat saat ini hanya mencakup 2 bulan pengeluaran. Targetkan minimal 6 bulan untuk keamanan finansial.',
    priority: 'high',
    impact: 'positive',
    estimatedSavings: 2000000
  },
  {
    id: '3',
    type: 'investment',
    title: 'Mulai investasi reksadana',
    description: 'Dengan surplus bulanan Rp 500.000, Anda bisa mulai investasi reksadana untuk jangka panjang.',
    priority: 'medium',
    impact: 'positive',
    estimatedSavings: 500000
  },
  {
    id: '4',
    type: 'debt',
    title: 'Prioritaskan pelunasan kartu kredit',
    description: 'Bunga kartu kredit 18% per tahun lebih tinggi dari return investasi. Lunasi segera untuk menghemat biaya.',
    priority: 'high',
    impact: 'positive',
    estimatedSavings: 300000
  }
]

const mockBudgetAnalysis: BudgetAnalysis[] = [
  { category: 'Makanan & Minuman', current: 35, recommended: 25, status: 'danger' },
  { category: 'Transportasi', current: 20, recommended: 15, status: 'warning' },
  { category: 'Hiburan', current: 10, recommended: 10, status: 'good' },
  { category: 'Belanja', current: 15, recommended: 20, status: 'good' },
  { category: 'Tagihan', current: 20, recommended: 20, status: 'good' }
]

export default function AdvisorPage() {
  const [monthlyIncome, setMonthlyIncome] = useState('')
  const [monthlyExpense, setMonthlyExpense] = useState('')
  const { showToast } = useToast()

  const handleAnalysis = () => {
    if (!monthlyIncome || !monthlyExpense) {
      showToast('error', 'Mohon isi pendapatan dan pengeluaran bulanan')
      return
    }
    
    const income = parseInt(monthlyIncome)
    const expense = parseInt(monthlyExpense)
    const savings = income - expense
    const savingsRate = (savings / income) * 100

    if (savingsRate < 0) {
      showToast('error', 'Pengeluaran melebihi pendapatan! Perlu evaluasi budget.')
    } else if (savingsRate < 20) {
      showToast('warning', 'Tingkat tabungan rendah. Pertimbangkan untuk mengurangi pengeluaran.')
    } else {
      showToast('success', 'Keuangan sehat! Tingkat tabungan yang baik.')
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500'
      case 'medium': return 'bg-yellow-500'
      case 'low': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'positive': return <TrendingUp className="w-4 h-4 text-green-500" />
      case 'negative': return <TrendingDown className="w-4 h-4 text-red-500" />
      case 'neutral': return <AlertTriangle className="w-4 h-4 text-yellow-500" />
      default: return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-500'
      case 'warning': return 'text-yellow-500'
      case 'danger': return 'text-red-500'
      default: return 'text-gray-500'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good': return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500" />
      case 'danger': return <AlertTriangle className="w-4 h-4 text-red-500" />
      default: return null
    }
  }

  return (
    <main className="mx-auto max-w-[1200px] p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Financial Advisor</h1>
          <p className="text-muted-foreground">
            Dapatkan saran keuangan personal dan analisis budget
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Target className="w-6 h-6 text-primary" />
          <span className="text-sm text-muted-foreground">AI-Powered</span>
        </div>
      </div>

      {/* Quick Analysis */}
      <Card className="rounded-xl border border-border bg-card p-6">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-semibold text-foreground flex items-center space-x-2">
            <DollarSign className="w-5 h-5 text-primary" />
            <span>Analisis Keuangan Cepat</span>
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Masukkan data keuangan bulanan untuk mendapatkan analisis instan
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm text-muted-foreground">Pendapatan Bulanan</label>
              <Input
                type="number"
                placeholder="5000000"
                value={monthlyIncome}
                onChange={(e) => setMonthlyIncome(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Pengeluaran Bulanan</label>
              <Input
                type="number"
                placeholder="3500000"
                value={monthlyExpense}
                onChange={(e) => setMonthlyExpense(e.target.value)}
                className="mt-1"
              />
            </div>
            <div className="flex items-end">
              <Button onClick={handleAnalysis} className="w-full">
                Analisis
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Budget Analysis */}
      <Card className="rounded-xl border border-border bg-card p-6">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-semibold text-foreground flex items-center space-x-2">
            <PiggyBank className="w-5 h-5 text-primary" />
            <span>Analisis Budget per Kategori</span>
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Perbandingan alokasi budget aktual vs rekomendasi
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockBudgetAnalysis.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(item.status)}
                  <span className="text-sm font-medium text-foreground">
                    {item.category}
                  </span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm text-foreground">
                      {item.current}% vs {item.recommended}%
                    </p>
                    <p className={`text-xs ${getStatusColor(item.status)}`}>
                      {item.status === 'good' ? 'Optimal' : 
                       item.status === 'warning' ? 'Perlu perhatian' : 'Perlu perbaikan'}
                    </p>
                  </div>
                  <div className="w-24">
                    <Progress value={item.current} className="h-2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Financial Advice */}
      <Card className="rounded-xl border border-border bg-card p-6">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-semibold text-foreground flex items-center space-x-2">
            <Lightbulb className="w-5 h-5 text-primary" />
            <span>Saran Keuangan Personal</span>
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Rekomendasi berdasarkan analisis keuangan Anda
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {mockFinancialAdvice.map((advice) => (
              <Card key={advice.id} className="border border-border bg-card">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${getPriorityColor(advice.priority)}`} />
                      <Badge variant="outline" className="text-xs">
                        {advice.type.toUpperCase()}
                      </Badge>
                    </div>
                    {getImpactIcon(advice.impact)}
                  </div>
                  
                  <h4 className="font-semibold text-foreground mb-2">
                    {advice.title}
                  </h4>
                  
                  <p className="text-sm text-muted-foreground mb-3">
                    {advice.description}
                  </p>
                  
                  {advice.estimatedSavings && (
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        Estimasi penghematan:
                      </span>
                      <span className="text-sm font-medium text-green-500">
                        {formatIDR(advice.estimatedSavings)}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Items */}
      <Card className="rounded-xl border border-border bg-card p-6">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-semibold text-foreground">
            Langkah Selanjutnya
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Tindakan yang disarankan untuk meningkatkan kesehatan keuangan
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-auto p-4 flex-col space-y-2">
              <Target className="w-6 h-6 text-primary" />
              <span className="text-sm">Set Budget Target</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex-col space-y-2">
              <TrendingUp className="w-6 h-6 text-primary" />
              <span className="text-sm">Track Progress</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex-col space-y-2">
              <PiggyBank className="w-6 h-6 text-primary" />
              <span className="text-sm">Set Savings Goal</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
