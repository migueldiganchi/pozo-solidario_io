'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'

function ThanksContent() {
  const params = useSearchParams()
  const status = params.get('status')
  const [numbers, setNumbers] = useState<number[]>([])

  useEffect(() => {
    const visitorId = localStorage.getItem('ps_user_id')
    if (!visitorId || status !== 'success') return

    // Poll for numbers (webhook may take a few seconds)
    let attempts = 0
    const poll = () => {
      fetch(`/api/participation/my?visitorId=${visitorId}`)
        .then(r => r.json())
        .then(data => {
          if (data.numbers?.length > 0) {
            setNumbers(data.numbers)
          } else if (attempts < 8) {
            attempts++
            setTimeout(poll, 2000)
          }
        })
        .catch(() => {})
    }
    setTimeout(poll, 1500)
  }, [status])

  if (status === 'failure') {
    return (
      <div className="text-center space-y-6">
        <div className="text-5xl">😔</div>
        <h1 className="font-display text-4xl text-white">Pago no completado</h1>
        <p className="text-white/40">No se realizó ningún cargo.</p>
        <Link href="/" className="inline-block mt-4 px-6 py-3 rounded-2xl bg-white/5 text-white/70 hover:bg-white/10 transition-all">
          Volver al inicio
        </Link>
      </div>
    )
  }

  if (status === 'pending') {
    return (
      <div className="text-center space-y-6">
        <div className="text-5xl">⏳</div>
        <h1 className="font-display text-4xl text-white">Pago pendiente</h1>
        <p className="text-white/40">Tu pago está siendo procesado.<br />Te notificaremos cuando se confirme.</p>
        <Link href="/" className="inline-block mt-4 px-6 py-3 rounded-2xl bg-white/5 text-white/70 hover:bg-white/10 transition-all">
          Volver al inicio
        </Link>
      </div>
    )
  }

  return (
    <div className="text-center space-y-8">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', damping: 12 }}
        className="text-6xl"
      >
        ✅
      </motion.div>

      <div className="space-y-3">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="font-display text-4xl md:text-5xl text-white"
        >
          Gracias por ayudar.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="text-white/40"
        >
          Participás del sorteo del martes a las 21:00.
        </motion.p>
      </div>

      {numbers.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="border border-white/10 rounded-2xl p-6 max-w-xs mx-auto space-y-4"
        >
          <p className="text-white/50 text-sm">🎟 Tus números</p>
          <div className="grid grid-cols-3 gap-2">
            {numbers.map((n, i) => (
              <motion.div
                key={n}
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + i * 0.07 }}
                className="bg-white/5 rounded-xl py-2.5 text-center text-white/80 text-sm font-mono"
              >
                #{n}
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {numbers.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex items-center justify-center gap-2 text-white/25 text-sm"
        >
          <span className="w-3 h-3 border border-white/20 border-t-white/50 rounded-full animate-spin" />
          Asignando números...
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <Link
          href="/"
          className="inline-block px-8 py-4 rounded-2xl bg-green-400/10 text-green-400 font-medium hover:bg-green-400/15 transition-all"
        >
          Volver al inicio
        </Link>
      </motion.div>
    </div>
  )
}

export default function ThanksPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-green-500/5 rounded-full blur-[100px]" />
      </div>
      <Suspense fallback={<div />}>
        <ThanksContent />
      </Suspense>
    </main>
  )
}
