'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center space-y-6">
      <div className="text-5xl">⚡</div>
      <div className="space-y-2">
        <h1 className="font-display italic text-3xl text-white">Algo salió mal</h1>
        <p className="text-white/30 text-sm">Ocurrió un error inesperado.</p>
      </div>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-white/60 hover:text-white transition-all text-sm"
        >
          Reintentar
        </button>
        <Link
          href="/"
          className="px-6 py-3 rounded-2xl bg-green-400/10 text-green-400 hover:bg-green-400/15 transition-all text-sm"
        >
          Volver al inicio
        </Link>
      </div>
    </main>
  )
}
