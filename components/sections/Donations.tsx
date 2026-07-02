'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { formatCurrency } from '@/lib/utils'

interface Donation {
  _id: string
  causeId: { title: string; city: string } | null
  amount: number
  proofText: string
  proofImage?: string
  weekId: string
  createdAt: string
}

export function Donations() {
  const [donations, setDonations] = useState<Donation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/donations')
      .then(r => r.json())
      .then(data => { setDonations(data.donations || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  return (
    <section id="donaciones" className="py-24 px-6">
      <div className="max-w-4xl mx-auto space-y-12">
        <div>
          <div className="text-xs text-red-400/60 uppercase tracking-widest mb-3 font-medium">Transparencia</div>
          <h2 className="font-display text-4xl md:text-5xl text-white">Donaciones realizadas</h2>
          <p className="text-white/40 text-sm mt-2">Cada peso que entra, se documenta y se entrega.</p>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => <div key={i} className="skeleton h-24 rounded-2xl" />)}
          </div>
        ) : donations.length === 0 ? (
          <div className="text-center py-20 text-white/20 text-sm space-y-2">
            <div className="text-4xl">❤️</div>
            <p>Las donaciones se publican después de cada sorteo.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {donations.map((donation, i) => (
              <motion.div
                key={donation._id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="border-gradient rounded-2xl p-6 space-y-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="text-white font-medium">
                      {donation.causeId?.title || 'Causa solidaria'}
                    </h3>
                    {donation.causeId?.city && (
                      <p className="text-white/30 text-xs">📍 {donation.causeId.city}</p>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-green-400 font-semibold text-lg font-display italic">
                      {formatCurrency(donation.amount)}
                    </p>
                    <p className="text-white/25 text-xs">{donation.weekId}</p>
                  </div>
                </div>

                {donation.proofText && (
                  <p className="text-white/40 text-sm leading-relaxed border-l-2 border-white/10 pl-4">
                    {donation.proofText}
                  </p>
                )}

                {donation.proofImage && (
                  <img
                    src={donation.proofImage}
                    alt="Comprobante"
                    className="w-full max-w-sm rounded-xl object-cover border border-white/10"
                  />
                )}

                <div className="flex items-center gap-2 text-white/20 text-xs">
                  <span>✓</span>
                  <span>Documentado · {new Date(donation.createdAt).toLocaleDateString('es-AR')}</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
