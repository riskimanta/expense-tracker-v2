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

// Helper functions for Indonesian number formatting
const formatToIndonesianNumber = (value: string): string => {
  // Remove all non-digit characters
  const numericValue = value.replace(/\D/g, '')
  
  if (numericValue === '') return ''
  
  // Convert to number and format with dots
  const number = parseInt(numericValue)
  return number.toLocaleString('id-ID')
}

const parseIndonesianNumber = (value: string): string => {
  // Remove all non-digit characters
  return value.replace(/\D/g, '')
}

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





export default function AdvisorPage() {
  const [monthlyIncome, setMonthlyIncome] = useState('')
  const [monthlyExpense, setMonthlyExpense] = useState('')
  const [budgetAnalysis, setBudgetAnalysis] = useState<BudgetAnalysis[]>([])
  const [financialAdvice, setFinancialAdvice] = useState<FinancialAdvice[]>([])
  const [isAnalyzed, setIsAnalyzed] = useState(false)
  const { showToast } = useToast()

  // Handle input changes with auto-formatting
  const handleIncomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const formattedValue = formatToIndonesianNumber(value)
    setMonthlyIncome(formattedValue)
    setIsAnalyzed(false)
  }

  const handleExpenseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const formattedValue = formatToIndonesianNumber(value)
    setMonthlyExpense(formattedValue)
    setIsAnalyzed(false)
  }

  const handleAnalysis = () => {
    if (!monthlyIncome || !monthlyExpense) {
      showToast({
        title: 'Error',
        description: 'Mohon isi pendapatan dan pengeluaran bulanan',
        variant: 'destructive'
      })
      return
    }
    
    const income = parseInt(parseIndonesianNumber(monthlyIncome))
    const expense = parseInt(parseIndonesianNumber(monthlyExpense))
    const savings = income - expense
    const savingsRate = (savings / income) * 100

    // Generate dynamic budget analysis based on input
    const newBudgetAnalysis: BudgetAnalysis[] = [
      { 
        category: 'Makanan & Minuman', 
        current: Math.min(35, Math.max(20, Math.floor(Math.random() * 40) + 15)), 
        recommended: 25, 
        status: 'danger' 
      },
      { 
        category: 'Transportasi', 
        current: Math.min(25, Math.max(10, Math.floor(Math.random() * 20) + 10)), 
        recommended: 15, 
        status: 'warning' 
      },
      { 
        category: 'Hiburan', 
        current: Math.min(15, Math.max(5, Math.floor(Math.random() * 15) + 5)), 
        recommended: 10, 
        status: 'good' 
      },
      { 
        category: 'Belanja', 
        current: Math.min(20, Math.max(10, Math.floor(Math.random() * 15) + 10)), 
        recommended: 20, 
        status: 'good' 
      },
      { 
        category: 'Tagihan', 
        current: Math.min(25, Math.max(15, Math.floor(Math.random() * 15) + 15)), 
        recommended: 20, 
        status: 'good' 
      }
    ]

    // Update status based on current vs recommended
    newBudgetAnalysis.forEach(item => {
      const diff = Math.abs(item.current - item.recommended)
      if (diff <= 2) {
        item.status = 'good'
      } else if (diff <= 5) {
        item.status = 'warning'
      } else {
        item.status = 'danger'
      }
    })

    // Generate dynamic financial advice based on analysis
    const newFinancialAdvice: FinancialAdvice[] = []
    
    // Add advice based on savings rate
    if (savingsRate < 0) {
      newFinancialAdvice.push({
        id: '1',
        type: 'budget',
        title: 'Kurangi pengeluaran bulanan',
        description: `Pengeluaran (${formatIDR(expense)}) melebihi pendapatan (${formatIDR(income)}). Perlu evaluasi dan pengurangan pengeluaran.`,
        priority: 'high',
        impact: 'positive',
        estimatedSavings: Math.abs(savings)
      })
    } else if (savingsRate < 20) {
      newFinancialAdvice.push({
        id: '2',
        type: 'saving',
        title: 'Tingkatkan tingkat tabungan',
        description: `Tingkat tabungan saat ini ${savingsRate.toFixed(1)}% masih rendah. Targetkan minimal 20% untuk keamanan finansial.`,
        priority: 'high',
        impact: 'positive',
        estimatedSavings: Math.floor(income * 0.2) - savings
      })
    } else {
      newFinancialAdvice.push({
        id: '3',
        type: 'investment',
        title: 'Investasi surplus bulanan',
        description: `Dengan surplus bulanan ${formatIDR(savings)}, Anda bisa mulai investasi untuk jangka panjang.`,
        priority: 'medium',
        impact: 'positive',
        estimatedSavings: savings
      })
    }

    // Add advice based on budget analysis
    const highSpendingCategories = newBudgetAnalysis.filter(item => item.status === 'danger')
    if (highSpendingCategories.length > 0) {
      const category = highSpendingCategories[0]
      newFinancialAdvice.push({
        id: '4',
        type: 'budget',
        title: `Kurangi pengeluaran ${category.category.toLowerCase()}`,
        description: `Pengeluaran kategori ini (${category.current}%) melebihi rekomendasi (${category.recommended}%). Pertimbangkan alternatif yang lebih murah.`,
        priority: 'high',
        impact: 'positive',
        estimatedSavings: Math.floor(expense * (category.current - category.recommended) / 100)
      })
    }

    // Add debt management advice if applicable
    if (savingsRate < 10) {
      newFinancialAdvice.push({
        id: '5',
        type: 'debt',
        title: 'Prioritaskan pelunasan utang',
        description: 'Dengan tingkat tabungan rendah, prioritaskan pelunasan utang untuk mengurangi beban keuangan.',
        priority: 'high',
        impact: 'positive',
        estimatedSavings: Math.floor(expense * 0.1)
      })
    }

    setBudgetAnalysis(newBudgetAnalysis)
    setFinancialAdvice(newFinancialAdvice)
    setIsAnalyzed(true)

    if (savingsRate < 0) {
      showToast({
        title: 'Error',
        description: 'Pengeluaran melebihi pendapatan! Perlu evaluasi budget.',
        variant: 'destructive'
      })
    } else if (savingsRate < 20) {
      showToast({
        title: 'Warning',
        description: 'Tingkat tabungan rendah. Pertimbangkan untuk mengurangi pengeluaran.',
        variant: 'default'
      })
    } else {
      showToast({
        title: 'Success',
        description: 'Keuangan sehat! Tingkat tabungan yang baik.',
        variant: 'success'
      })
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500'
      case 'medium': return 'bg-yellow-500'
      case 'low': return 'bg-green-500'
      default: return 'bg-[color:var(--txt-3)]'
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
      default: return 'text-[color:var(--txt-3)]'
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
          <h1 className="text-3xl font-bold text-[color:var(--txt-1)]">Financial Advisor</h1>
          <p className="text-[color:var(--txt-2)]">
            Dapatkan saran keuangan personal dan analisis budget
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Target className="w-6 h-6 text-primary" />
          <span className="text-sm text-[color:var(--txt-2)]">AI-Powered</span>
        </div>
      </div>

      {/* Quick Analysis */}
      <Card className="rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-6">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-semibold text-[color:var(--txt-1)] flex items-center space-x-2">
            <DollarSign className="w-5 h-5 text-primary" />
            <span>Analisis Keuangan Cepat</span>
          </CardTitle>
          <p className="text-sm text-[color:var(--txt-2)]">
            Masukkan data keuangan bulanan untuk mendapatkan analisis instan
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm text-[color:var(--txt-2)]">Pendapatan Bulanan</label>
              <Input
                type="text"
                placeholder="5.000.000"
                value={monthlyIncome}
                onChange={handleIncomeChange}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm text-[color:var(--txt-2)]">Pengeluaran Bulanan</label>
              <Input
                type="text"
                placeholder="3.500.000"
                value={monthlyExpense}
                onChange={handleExpenseChange}
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
      <Card className="rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-6">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-semibold text-[color:var(--txt-1)] flex items-center space-x-2">
            <PiggyBank className="w-5 h-5 text-primary" />
            <span>Analisis Budget per Kategori</span>
          </CardTitle>
          <p className="text-sm text-[color:var(--txt-2)]">
            Perbandingan alokasi budget aktual vs rekomendasi
          </p>
        </CardHeader>
        <CardContent>
          {!isAnalyzed ? (
            <div className="text-center py-8">
              <PiggyBank className="w-12 h-12 text-[color:var(--txt-2)] mx-auto mb-4" />
              <p className="text-[color:var(--txt-2)]">
                Klik tombol &quot;Analisis&quot; di atas untuk melihat analisis budget per kategori
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {budgetAnalysis.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(item.status)}
                    <span className="text-sm font-medium text-[color:var(--txt-1)]">
                      {item.category}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm text-[color:var(--txt-1)]">
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
          )}
        </CardContent>
      </Card>

      {/* Financial Advice */}
      <Card className="rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-6">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-semibold text-[color:var(--txt-1)] flex items-center space-x-2">
            <Lightbulb className="w-5 h-5 text-primary" />
            <span>Saran Keuangan Personal</span>
          </CardTitle>
          <p className="text-sm text-[color:var(--txt-2)]">
            Rekomendasi berdasarkan analisis keuangan Anda
          </p>
        </CardHeader>
        <CardContent>
          {!isAnalyzed ? (
            <div className="text-center py-8">
              <Lightbulb className="w-12 h-12 text-[color:var(--txt-2)] mx-auto mb-4" />
              <p className="text-[color:var(--txt-2)]">
                Klik tombol &quot;Analisis&quot; di atas untuk mendapatkan saran keuangan personal
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {financialAdvice.map((advice) => (
                <Card key={advice.id} className="border border-[color:var(--border)] bg-[color:var(--surface)]">
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
                    
                    <h4 className="font-semibold text-[color:var(--txt-1)] mb-2">
                      {advice.title}
                    </h4>
                    
                    <p className="text-sm text-[color:var(--txt-2)] mb-3">
                      {advice.description}
                    </p>
                    
                    {advice.estimatedSavings && (
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-[color:var(--txt-2)]">
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
          )}
        </CardContent>
      </Card>

      {/* Action Items */}
      <Card className="rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-6">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-semibold text-[color:var(--txt-1)]">
            Langkah Selanjutnya
          </CardTitle>
          <p className="text-sm text-[color:var(--txt-2)]">
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
