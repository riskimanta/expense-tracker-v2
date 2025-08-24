export function calcSafeToSpend(income: number, expenses: number, savings: number): number {
  return income - expenses - savings
}

export function calcBudgetCompliance(actual: number, target: number): number {
  if (target === 0) return 0
  return Math.min((actual / target) * 100, 100)
}

export function calcSavingsRate(income: number, expenses: number): number {
  if (income === 0) return 0
  return ((income - expenses) / income) * 100
}

export function calcDailyAverage(amount: number, days: number): number {
  if (days === 0) return 0
  return amount / days
}

export function calcMonthlyTrend(current: number, previous: number): number {
  if (previous === 0) return 0
  return ((current - previous) / previous) * 100
}
