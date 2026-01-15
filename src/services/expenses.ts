import { supabase } from '@/lib/supabase'

export async function createExpense(data: {
  description: string
  amount: number
  category: string
  date: string
}) {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Usuário não autenticado')
  }

  const { error } = await supabase.from('expenses').insert({
    user_id: user.id,
    description: data.description,
    amount: data.amount,
    category: data.category,
    date: data.date,
  })

  if (error) {
    throw error
  }
}
