export type ExpenseCategory =
  | 'moradia'
  | 'alimentacao'
  | 'transporte'
  | 'lazer'
  | 'saude'
  | 'outros'

export interface Expense {
  id: string
  description: string
  amount: number
  category: ExpenseCategory
  date: string
}
