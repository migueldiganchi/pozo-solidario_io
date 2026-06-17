'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { formatCurrency } from '@/lib/utils'

interface Winner {
  _id: string
  name: string
  winningNumber: number
  prizeId: { title: string; sponsor: string; value: number }
  weekId: string
  createdAt: string
}

export function Winners() {
  const [winners, setWinners] = useState<Winner[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/winners')
      .then(r => r.json())
      .then(data => { setWinners(data.winners || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  return (
    <section id="ganadores" className="py-24 px-6">
      <div className="max-w-4xl mx-auto space-y-12">
        <div>
          <div className="text-xs text-white/30 uppercase tracking-widest mb-3 font-medium">Historial</div>
          <h2 className="font-display italic text-4xl md:text-5xl text-white">Ganadores</h2>
          <p className="text-white/40 text-sm mt-2">Sorteos verificados con Random.org.</p>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1,2,3].map(i => <div key={i} className="skeleton h-16 rounded-2xl" />)}
          </div>
        ) : winners.length === 0 ? (
          <div className="text-center py-20 text-white/20 text-sm">
            Aún no hay ganadores. ¡El próximo podrías ser vos!
          </div>
        ) : (
          <div className="space-y-3">
            {winners.map((winner, i) => (
              <motion.div
                key={winner._id}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center justify-between border-gradient rounded-2xl px-6 py-4"
              >
                <div className="flex items-center gap-4">
                  <div className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-sm font-medium text-white/60">
                    {winner.name[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p className="text-white/80 text-sm font-medium">{winner.name}</p>
                    <p className="text-white/30 text-xs">Número #{winner.winningNumber}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white/70 text-sm">{winner.prizeId?.title || 'Premio'}</p>
                  {winner.prizeId?.value && (
                    <p className="text-green-400/60 text-xs">{formatCurrency(winner.prizeId.value)}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {winners.length > 0 && (
          <p className="text-center text-white/20 text-xs">
            Sorteos realizados con <a href="https://random.org" target="_blank" className="hover:text-white/40 underline">Random.org</a>
          </p>
        )}
      </div>
    </section>
  )
}
