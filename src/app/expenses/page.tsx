'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { createExpense, updateExpense, deleteExpense } from '@/services/expenses'
import { Plus, Edit2, Trash2, X, Save, Wallet, TrendingUp, Calendar, Sparkles } from 'lucide-react'
import { useBaseSalary } from '@/hooks/useBaseSalary'


type Expense = {
  id: string
  description: string
  amount: number
  category: string
  date: string
  created_at: string
}

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: '',
    date: '',
  })
  const [formLoading, setFormLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { baseSalary, setBaseSalary, loading: salaryLoading } = useBaseSalary()
  const [salaryEdit, setSalaryEdit] = useState(false)


  useEffect(() => {
    loadExpenses()
  }, [])

  async function loadExpenses() {
    const { data } = await supabase
      .from('expenses')
      .select('*')
      .order('date', { ascending: false })

    setExpenses(data || [])
    setLoading(false)
  }

  function handleEdit(expense: Expense) {
    setEditingId(expense.id)
    setFormData({
      description: expense.description,
      amount: expense.amount.toString(),
      category: expense.category,
      date: expense.date,
    })
    setShowForm(true)
  }

  function handleCancel() {
    setShowForm(false)
    setEditingId(null)
    setFormData({
      description: '',
      amount: '',
      category: '',
      date: '',
    })
    setError(null)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setFormLoading(true)
    setError(null)

    try {
      if (editingId) {
        await updateExpense(editingId, {
          description: formData.description,
          amount: Number(formData.amount),
          category: formData.category,
          date: formData.date,
        })
      } else {
        await createExpense({
          description: formData.description,
          amount: Number(formData.amount),
          category: formData.category,
          date: formData.date,
        })
      }

      await loadExpenses()
      handleCancel()
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar despesa')
    } finally {
      setFormLoading(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Tem certeza que deseja excluir esta despesa?')) {
      return
    }

    try {
      await deleteExpense(id)
      await loadExpenses()
    } catch (err: any) {
      alert('Erro ao excluir despesa: ' + (err.message || 'Erro desconhecido'))
    }
  }

  const total = expenses.reduce((sum, item) => sum + item.amount, 0)

  // Cálculos relativos ao salário base
  const baseSalaryNumber = baseSalary
  const percentUsed = baseSalaryNumber ? (total / baseSalaryNumber) * 100 : 0
  const lastMonth = new Date().getMonth()
  const thisYear = new Date().getFullYear()
  const expensesThisMonth = expenses.filter(
    e => {
      const d = new Date(e.date)
      return d.getMonth() === lastMonth && d.getFullYear() === thisYear
    }
  )
  const totalThisMonth = expensesThisMonth.reduce((sum, item) => sum + item.amount, 0)
  const percentThisMonth = baseSalaryNumber ? (totalThisMonth / baseSalaryNumber) * 100 : 0

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <header className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-emerald-600/20 to-emerald-700/10 border border-emerald-600/30 rounded-xl">
            <Wallet className="w-8 h-8 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Gerenciar Gastos</h1>
            <p className="text-zinc-400 text-sm mt-1">
              Adicione, edite ou remova suas despesas
            </p>
          </div>
        </div>

        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 px-6 py-3 rounded-xl flex items-center gap-2 transition-all duration-200 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">Nova despesa</span>
          </button>
        )}
      </header>

      {/* SALARIO BASE */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 pb-3">
        <div className="flex items-center gap-4">
          <span className="font-semibold text-zinc-300">Salário base:</span>
          {salaryEdit ? (
            <>
              <input
                type="number"
                min="0"
                step="0.01"
                value={baseSalary || ''}
                onChange={e => setBaseSalary(Number(e.target.value))}
                className="bg-zinc-800 border border-zinc-600 px-4 py-2 rounded-lg outline-none focus:border-emerald-500"
                placeholder="Informe seu salário base"
                style={{ width: 140 }}
              />
              <button
                onClick={() => setSalaryEdit(false)}
                className="ml-2 px-3 py-2 rounded bg-emerald-700 text-xs hover:bg-emerald-600 transition-all"
              >
                OK
              </button>
            </>
          ) : (
            <>
              <span className="text-zinc-200 text-lg font-bold">{baseSalary ? `R$ ${Number(baseSalary).toLocaleString('pt-BR', {minimumFractionDigits:2, maximumFractionDigits:2})}` : <span className="text-zinc-500">Não informado</span>}</span>
              <button
                onClick={() => setSalaryEdit(true)}
                className="ml-2 px-3 py-2 rounded bg-zinc-800/60 border border-zinc-700 hover:bg-zinc-800 text-xs transition-all"
              >
                {baseSalary ? 'Editar' : 'Adicionar'}
              </button>
            </>
          )}
        </div>
        {baseSalary && (
          <div className="text-xs text-zinc-400 ml-1 mt-1">
            <span>
              Gastos totais representam <span className="font-bold text-emerald-400">{percentUsed.toLocaleString('pt-BR', { maximumFractionDigits: 1 })}%</span> do seu salário base.
            </span>
            {totalThisMonth > 0 && (
              <span className="ml-2">
                (<span className="font-bold text-emerald-300">{percentThisMonth.toLocaleString('pt-BR', { maximumFractionDigits: 1 })}%</span> usados este mês)
              </span>
            )}
          </div>
        )}
      </div>

      {/* RESUMO */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-emerald-600/20 to-emerald-700/10 border border-emerald-600/30 rounded-xl p-6 hover:shadow-lg hover:shadow-emerald-500/20 transition-all duration-300">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-emerald-600/20 rounded-lg">
              <Wallet className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="text-sm text-zinc-400">Total de Despesas</div>
          </div>
          <p className="text-3xl font-bold text-emerald-400">
            R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          {baseSalary && (
            <span className="text-xs text-zinc-400 font-medium">
              {percentUsed > 0 ? `${percentUsed.toLocaleString('pt-BR', {maximumFractionDigits:1})}% do salário base` : ''}
            </span>
          )}
        </div>

        <div className="bg-gradient-to-br from-blue-600/20 to-blue-700/10 border border-blue-600/30 rounded-xl p-6 hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-blue-600/20 rounded-lg">
              <TrendingUp className="w-5 h-5 text-blue-400" />
            </div>
            <div className="text-sm text-zinc-400">Quantidade</div>
          </div>
          <p className="text-3xl font-bold text-blue-400">{expenses.length}</p>
        </div>

        <div className="bg-gradient-to-br from-purple-600/20 to-purple-700/10 border border-purple-600/30 rounded-xl p-6 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-purple-600/20 rounded-lg">
              <Calendar className="w-5 h-5 text-purple-400" />
            </div>
            <div className="text-sm text-zinc-400">Média por Despesa</div>
          </div>
          <p className="text-3xl font-bold text-purple-400">
            R$ {expenses.length > 0 ? (total / expenses.length).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0,00'}
          </p>
          {baseSalary && expenses.length > 0 && (
            <span className="text-xs text-zinc-400 font-medium">
              {( (total/expenses.length)/baseSalaryNumber*100 ).toLocaleString('pt-BR', {maximumFractionDigits:1})}% do salário/despesa
            </span>
          )}
        </div>
      </div>

      {/* FORMULÁRIO */}
      {showForm && (
        <div className="bg-gradient-to-br from-zinc-900 to-zinc-900/50 border border-zinc-800 rounded-xl p-6 shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-600/20 rounded-lg">
                <Sparkles className="w-5 h-5 text-emerald-400" />
              </div>
              <h2 className="text-xl font-semibold">
                {editingId ? 'Editar Despesa' : 'Nova Despesa'}
              </h2>
            </div>
            <button
              onClick={handleCancel}
              className="text-zinc-400 hover:text-white hover:bg-zinc-800 p-2 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm text-zinc-400 font-medium mb-2 block">Descrição</label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                placeholder="Ex: Almoço no restaurante"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-zinc-400 font-medium mb-2 block">Valor</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  required
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="text-sm text-zinc-400 font-medium mb-2 block">Data</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-zinc-400 font-medium mb-2 block">Categoria</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
              >
                <option value="">Selecione uma categoria</option>
                <option value="Alimentação">Alimentação</option>
                <option value="Transporte">Transporte</option>
                <option value="Lazer">Lazer</option>
                <option value="Moradia">Moradia</option>
                <option value="Saúde">Saúde</option>
                <option value="Educação">Educação</option>
                <option value="Outros">Outros</option>
              </select>
            </div>

            {error && (
              <div className="bg-red-600/20 border border-red-600/30 rounded-lg p-4">
                <p className="text-red-400 text-sm font-medium">{error}</p>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-3 rounded-lg border border-zinc-700 hover:bg-zinc-800 hover:border-zinc-600 transition-all font-medium"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={formLoading}
                className="px-6 py-3 rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 flex items-center gap-2 transition-all disabled:opacity-50 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 font-medium"
              >
                <Save className="w-4 h-4" />
                {formLoading ? 'Salvando...' : editingId ? 'Atualizar' : 'Salvar'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* LISTA DE DESPESAS */}
      <section className="bg-gradient-to-br from-zinc-900 to-zinc-900/50 border border-zinc-800 rounded-xl p-6 shadow-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-600/20 rounded-lg">
            <TrendingUp className="w-5 h-5 text-blue-400" />
          </div>
          <h2 className="text-xl font-semibold">Lista de Despesas</h2>
          {expenses.length > 0 && (
            <span className="px-3 py-1 bg-zinc-800 rounded-full text-sm text-zinc-400">
              {expenses.length} {expenses.length === 1 ? 'despesa' : 'despesas'}
            </span>
          )}
        </div>

        {loading && (
          <p className="text-zinc-400">Carregando...</p>
        )}

        {!loading && expenses.length === 0 && (
          <div className="text-center py-16">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-zinc-800 rounded-full">
                <Wallet className="w-12 h-12 text-zinc-500" />
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-zinc-300">Nenhuma despesa cadastrada</h3>
            <p className="text-zinc-400 mb-6 max-w-md mx-auto">
              Comece registrando suas despesas para ter um controle completo dos seus gastos.
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 px-6 py-3 rounded-xl transition-all shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-105 font-medium"
            >
              <Plus className="w-5 h-5" />
              Adicionar primeira despesa
            </button>
          </div>
        )}

        {!loading && expenses.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="text-left py-4 px-4 text-sm font-semibold text-zinc-400 uppercase tracking-wider">Descrição</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-zinc-400 uppercase tracking-wider">Categoria</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-zinc-400 uppercase tracking-wider">Data</th>
                  <th className="text-right py-4 px-4 text-sm font-semibold text-zinc-400 uppercase tracking-wider">Valor</th>
                  {baseSalary && <th className="text-right py-4 px-4 text-sm font-semibold text-zinc-400 uppercase tracking-wider">% Salário</th>}
                  <th className="text-right py-4 px-4 text-sm font-semibold text-zinc-400 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((expense, index) => (
                  <tr
                    key={expense.id}
                    className="border-b border-zinc-800/50 hover:bg-zinc-800/20 transition-all duration-200 group"
                  >
                    <td className="py-4 px-4 font-medium group-hover:text-emerald-400 transition-colors">
                      {expense.description}
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-3 py-1.5 bg-gradient-to-r from-zinc-800 to-zinc-800/50 rounded-lg text-sm font-medium border border-zinc-700">
                        {expense.category}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm text-zinc-400">
                      {new Date(expense.date).toLocaleDateString('pt-BR', { 
                        day: '2-digit', 
                        month: 'short', 
                        year: 'numeric' 
                      })}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className="font-bold text-emerald-400">
                        R$ {expense.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </td>
                    {baseSalary && (
                      <td className="py-4 px-4 text-right text-xs text-zinc-400">
                        {baseSalaryNumber
                          ? ((expense.amount / baseSalaryNumber) * 100).toLocaleString('pt-BR', {maximumFractionDigits: 2}) + '%'
                          : '-'}
                      </td>
                    )}
                    <td className="py-4 px-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(expense)}
                          className="p-2.5 text-blue-400 hover:bg-blue-400/20 rounded-lg transition-all hover:scale-110 active:scale-95"
                          title="Editar"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(expense.id)}
                          className="p-2.5 text-red-400 hover:bg-red-400/20 rounded-lg transition-all hover:scale-110 active:scale-95"
                          title="Excluir"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}