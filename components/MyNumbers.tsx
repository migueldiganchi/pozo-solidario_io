'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface MyNumbersProps {
  visitorId: string
  isOpen: boolean
  onClose: () => void
}

export function MyNumbers({ visitorId, isOpen, onClose }: MyNumbersProps) {
  const [numbers, setNumbers] = useState<number[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isOpen || !visitorId) return
    setLoading(true)
    fetch(`/api/participation/my?visitorId=${visitorId}`)
      .then(r => r.json())
      .then(data => { setNumbers(data.numbers || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [isOpen, visitorId])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            className="fixed bottom-0 left-0 right-0 md:inset-0 md:flex md:items-center md:justify-center z-50 pointer-events-none"
          >
            <div className="pointer-events-auto w-full md:max-w-md md:mx-auto bg-[hsl(0,0%,6%)] border border-white/10 rounded-t-3xl md:rounded-3xl p-8 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display text-2xl text-white">Mis números</h2>
                  <p className="text-white/30 text-xs mt-1">Semana actual</p>
                </div>
                <button onClick={onClose} className="text-white/30 hover:text-white/70">✕</button>
              </div>

              {loading ? (
                <div className="space-y-2">
                  {[1,2,3].map(i => <div key={i} className="skeleton h-10 rounded-xl" />)}
                </div>
              ) : numbers.length === 0 ? (
                <div className="text-center py-8 text-white/30 text-sm space-y-2">
                  <div className="text-4xl">🎟</div>
                  <p>Aún no tenés números esta semana.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-white/40 text-sm">{numbers.length} número{numbers.length !== 1 ? 's' : ''} asignado{numbers.length !== 1 ? 's' : ''}</p>
                  <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto">
                    {numbers.map((n, i) => (
                      <motion.div
                        key={n}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.04 }}
                        className="bg-white/[0.04] border border-white/8 rounded-xl py-3 text-center number-badge text-white/70 text-sm"
                      >
                        #{n}
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
