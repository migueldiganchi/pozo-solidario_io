import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center space-y-6">
      <p className="font-display italic text-[8rem] leading-none text-white/5">404</p>
      <div className="space-y-2 -mt-8">
        <h1 className="font-display italic text-3xl text-white">Página no encontrada</h1>
        <p className="text-white/30 text-sm">Esta página no existe o fue movida.</p>
      </div>
      <Link
        href="/"
        className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/8 transition-all text-sm"
      >
        Volver al inicio
      </Link>
    </main>
  )
}
