import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6">
      <h1 className="text-4xl font-bold">Coinlytics 🚀</h1>

      <Link
        href="/expenses"
        className="bg-black text-white px-6 py-3 rounded"
      >
        Ir para Controle de Gastos
      </Link>
    </main>
  )
}
