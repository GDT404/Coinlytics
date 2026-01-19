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

export async function updateExpense(id: string, data: {
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

  const { error } = await supabase
    .from('expenses')
    .update({
      description: data.description,
      amount: data.amount,
      category: data.category,
      date: data.date,
    })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    throw error
  }
}

export async function deleteExpense(id: string) {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Usuário não autenticado')
  }

  const { error } = await supabase
    .from('expenses')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    throw error
  }
}