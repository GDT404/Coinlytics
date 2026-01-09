import { Expense } from '@/domain/finance/expense'
import { FinanceSummary } from '@/domain/finance/summary'

export function calculateSummary(
  income: number,
  expenses: Expense[]
): FinanceSummary {
  const totalExpenses = expenses.reduce(
    (acc, curr) => acc + curr.amount,
    0
  )

  const balance = income - totalExpenses
  const expenseRatio =
    income > 0 ? (totalExpenses / income) * 100 : 0

  return {
    totalIncome: income,
    totalExpenses,
    balance,
    expenseRatio
  }
}
