import { Expense } from './expense'

export interface FinanceSummary {
  totalIncome: number
  totalExpenses: number
  balance: number
  expenseRatio: number
}
