"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Save, RotateCcw, TrendingUp, ShoppingBag, PiggyBank, Coins } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { getBudgetRule, updateBudgetRule } from "@/api/budgets"
import { BudgetRule } from "@/types/admin"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

const budgetSchema = z.object({
  needs: z.number().min(0, "Nilai tidak boleh negatif").max(100, "Maksimal 100%"),
  wants: z.number().min(0, "Nilai tidak boleh negatif").max(100, "Maksimal 100%"),
  savings: z.number().min(0, "Nilai tidak boleh negatif").max(100, "Maksimal 100%"),
  invest: z.number().min(0, "Nilai tidak boleh negatif").max(100, "Maksimal 100%"),
  coins: z.number().min(0, "Nilai tidak boleh negatif").max(100, "Maksimal 100%"),
}).refine((data) => {
  const total = data.needs + data.wants + data.savings + data.invest + data.coins
  return total === 100
}, {
  message: "Total budget harus 100%",
  path: ["needs"]
})

type BudgetFormData = z.infer<typeof budgetSchema>

export default function AdminBudgetsPage() {
  const [isEditOpen, setIsEditOpen] = useState(false)
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const { data: budgetRule, isLoading } = useQuery({
    queryKey: ["budgetRule", "1"],
    queryFn: () => getBudgetRule("1"),
  })

  const updateMutation = useMutation({
    mutationFn: ({ userId, updates }: { userId: string; updates: Partial<BudgetRule> }) => updateBudgetRule(userId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budgetRule"] })
      toast({
        title: "Berhasil",
        description: "Budget rule berhasil diupdate",
      })
      setIsEditOpen(false)
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Gagal mengupdate budget rule",
        variant: "destructive",
      })
    },
  })

  const form = useForm<BudgetFormData>({
    resolver: zodResolver(budgetSchema),
    defaultValues: {
      needs: 50,
      wants: 30,
      savings: 10,
      invest: 5,
      coins: 5,
    },
  })

  const handleEdit = () => {
    if (budgetRule) {
      form.reset({
        needs: budgetRule.needs,
        wants: budgetRule.wants,
        savings: budgetRule.savings,
        invest: budgetRule.invest,
        coins: budgetRule.coins,
      })
    }
    setIsEditOpen(true)
  }

  const handlePreset = () => {
    form.reset({
      needs: 50,
      wants: 30,
      savings: 10,
      invest: 5,
      coins: 5,
    })
  }

  const onSubmit = (data: BudgetFormData) => {
    if (budgetRule) {
      updateMutation.mutate({ userId: "1", updates: data })
    }
  }

  const currentTotal = form.watch("needs") + form.watch("wants") + form.watch("savings") + form.watch("invest") + form.watch("coins")
  const isTotalValid = currentTotal === 100

  const getBudgetColor = (type: keyof BudgetFormData) => {
    switch (type) {
      case "needs":
        return "bg-[var(--needs)]"
      case "wants":
        return "bg-[var(--wants)]"
      case "savings":
        return "bg-[var(--savings)]"
      case "invest":
        return "bg-[var(--invest)]"
      case "coins":
        return "bg-[var(--coins)]"
      default:
        return "bg-[color:var(--txt-3)]"
    }
  }

  const getBudgetIcon = (type: keyof BudgetFormData) => {
    switch (type) {
      case "needs":
        return <TrendingUp className="w-4 h-4" />
      case "wants":
        return <ShoppingBag className="w-4 h-4" />
      case "savings":
        return <PiggyBank className="w-4 h-4" />
      case "invest":
        return <TrendingUp className="w-4 h-4" />
      case "coins":
        return <Coins className="w-4 h-4" />
      default:
        return <TrendingUp className="w-4 h-4" />
    }
  }

  const getBudgetLabel = (type: keyof BudgetFormData) => {
    switch (type) {
      case "needs":
        return "Kebutuhan (Needs)"
      case "wants":
        return "Keinginan (Wants)"
      case "savings":
        return "Tabungan (Savings)"
      case "invest":
        return "Investasi (Invest)"
      case "coins":
        return "Coins (Coins)"
      default:
        return type
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-[var(--surface2)] rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-[var(--surface2)] rounded w-1/2"></div>
        </div>
        <div className="animate-pulse">
          <div className="h-64 bg-[var(--surface2)] rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--txt-high)]">Kelola Budget Rules</h1>
          <p className="text-[var(--txt-med)]">Atur alokasi budget untuk User ID 1</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handlePreset} variant="outline" className="border-[var(--border)] text-[var(--txt-med)] hover:bg-[var(--surface)]">
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset ke Default
          </Button>
          <Button onClick={handleEdit} className="bg-[var(--primary)] hover:bg-[var(--primary)]/90">
            <Save className="w-4 h-4 mr-2" />
            Edit Budget
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-[var(--surface)] border-[var(--border)]">
          <CardHeader>
            <CardTitle className="text-[var(--txt-high)]">Budget Allocation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {budgetRule && (
              <>
                <div className="space-y-3">
                  {(["needs", "wants", "savings", "invest", "coins"] as const).map((type) => (
                    <div key={type} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${getBudgetColor(type)}`}></div>
                        <span className="text-sm text-[var(--txt-med)]">{getBudgetLabel(type)}</span>
                      </div>
                      <span className="font-mono text-[var(--txt-high)]">{budgetRule[type]}%</span>
                    </div>
                  ))}
                </div>
                <div className="pt-4 border-t border-[var(--border)]">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-[var(--txt-high)]">Total</span>
                    <span className={`font-mono font-bold ${budgetRule.needs + budgetRule.wants + budgetRule.savings + budgetRule.invest + budgetRule.coins === 100 ? 'text-[var(--success)]' : 'text-[var(--danger)]'}`}>
                      {budgetRule.needs + budgetRule.wants + budgetRule.savings + budgetRule.invest + budgetRule.coins}%
                    </span>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="bg-[var(--surface)] border-[var(--border)]">
          <CardHeader>
            <CardTitle className="text-[var(--txt-high)]">Visual Budget</CardTitle>
          </CardHeader>
          <CardContent>
            {budgetRule && (
              <div className="space-y-3">
                {(["needs", "wants", "savings", "invest", "coins"] as const).map((type) => (
                  <div key={type} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[var(--txt-med)]">{getBudgetLabel(type)}</span>
                      <span className="text-[var(--txt-high)]">{budgetRule[type]}%</span>
                    </div>
                    <div className="w-full bg-[var(--surface2)] rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${getBudgetColor(type)} transition-all duration-300`}
                        style={{ width: `${budgetRule[type]}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="bg-[var(--surface)] border-[var(--border)]">
        <CardHeader>
          <CardTitle className="text-[var(--txt-high)]">Edit Budget Rule</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(["needs", "wants", "savings", "invest", "coins"] as const).map((type) => (
                <div key={type}>
                  <label className="block text-sm font-medium text-[var(--txt-med)] mb-2">
                    {getBudgetLabel(type)}
                  </label>
                  <div className="relative">
                    <Input
                      type="number"
                      {...form.register(type, { valueAsNumber: true })}
                      placeholder="0"
                      className="bg-[var(--surface)] border-[var(--border)] text-[var(--txt-high)] pr-12"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--txt-low)]">
                      %
                    </div>
                  </div>
                  {form.formState.errors[type] && (
                    <p className="text-sm text-[var(--danger)] mt-1">
                      {form.formState.errors[type]?.message}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-[var(--border)]">
              <div className="flex items-center justify-between mb-4">
                <span className="font-medium text-[var(--txt-high)]">Total Budget</span>
                <span className={`font-mono font-bold text-lg ${isTotalValid ? 'text-[var(--success)]' : 'text-[var(--danger)]'}`}>
                  {currentTotal}%
                </span>
              </div>
              
              {!isTotalValid && (
                <div className="p-3 bg-[var(--danger)]/10 border border-[var(--danger)]/20 rounded-lg">
                  <p className="text-sm text-[var(--danger)]">
                    Total budget harus tepat 100%. Saat ini: {currentTotal}%
                  </p>
                </div>
              )}

              <div className="flex gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditOpen(false)}
                  className="flex-1 border-[var(--border)] text-[var(--txt-med)] hover:bg-[var(--surface)]"
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-[var(--primary)] hover:bg-[var(--primary)]/90"
                  disabled={!isTotalValid || updateMutation.isPending}
                >
                  {updateMutation.isPending ? "Menyimpan..." : "Simpan Budget"}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
