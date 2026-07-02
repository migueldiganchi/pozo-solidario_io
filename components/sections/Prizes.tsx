'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { formatCurrency } from '@/lib/utils'

interface Prize {
  _id: string
  title: string
  sponsor: string
  image?: string
  value: number
}

export function Prizes() {
  const [prizes, setPrizes] = useState<Prize[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/prizes')
      .then(r => r.json())
      .then(data => { setPrizes(data.prizes || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <section id="premios" className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="skeleton h-8 w-48 mb-12 rounded-xl" />
          <div className="grid md:grid-cols-3 gap-4">
            {[1,2,3].map(i => <div key={i} className="skeleton h-40 rounded-2xl" />)}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="premios" className="py-24 px-6">
      <div className="max-w-4xl mx-auto space-y-12">
        <div>
          <div className="text-xs text-yellow-400/60 uppercase tracking-widest mb-3 font-medium">Esta semana</div>
          <h2 className="font-display text-4xl md:text-5xl text-white">Premios</h2>
          <p className="text-white/40 text-sm mt-2">Sorteados el martes a las 21:00 entre todos los participantes.</p>
        </div>

        {prizes.length === 0 ? (
          <div className="text-center py-20 text-white/20 text-sm">
            Los premios de esta semana se anuncian pronto.
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-4">
            {prizes.map((prize, i) => (
              <motion.div
                key={prize._id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="border-gradient rounded-2xl overflow-hidden group"
              >
                <div className="aspect-video bg-white/[0.03] flex items-center justify-center text-5xl">
                  {prize.image ? (
                    <img src={prize.image} alt={prize.title} className="w-full h-full object-cover" />
                  ) : (
                    '🎁'
                  )}
                </div>
                <div className="p-5 space-y-2">
                  <h3 className="text-white font-medium">{prize.title}</h3>
                  <p className="text-white/30 text-xs">por {prize.sponsor}</p>
                  <p className="text-green-400/70 text-sm font-medium">{formatCurrency(prize.value)}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
