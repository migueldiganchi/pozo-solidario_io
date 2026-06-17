'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { formatCurrency, PACKAGES, PRICE_PER_NUMBER } from '@/lib/utils'
import toast from 'react-hot-toast'

interface ParticipationModalProps {
  isOpen: boolean
  onClose: () => void
  visitorId: string
}

export function ParticipationModal({ isOpen, onClose, visitorId }: ParticipationModalProps) {
  const [selected, setSelected] = useState(1)
  const [loading, setLoading] = useState(false)

  const pkg = PACKAGES.find(p => p.quantity === selected) || PACKAGES[0]
  const total = Math.floor(selected * PRICE_PER_NUMBER * (1 - pkg.discount))

  const handlePay = async () => {
    if (!visitorId) {
      toast.error('Identificando usuario...')
      return
    }

    setLoading(true)
    try {
      const referralCode = typeof window !== 'undefined' ? localStorage.getItem('ps_ref') : null

      const res = await fetch('/api/participation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: selected, visitorId, referralCode }),
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.error || 'Error al crear el pago')

      // Redirect to Mercado Pago
      window.location.href = data.initPoint || data.sandboxInitPoint
    } catch (error: any) {
      toast.error(error.message || 'Error al procesar el pago')
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 md:inset-0 md:flex md:items-center md:justify-center z-50 pointer-events-none"
          >
            <div className="pointer-events-auto w-full md:max-w-md md:mx-auto bg-[hsl(0,0%,6%)] border border-white/10 rounded-t-3xl md:rounded-3xl p-8 space-y-8">

              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="font-display italic text-2xl text-white">Participar</h2>
                  <p className="text-white/40 text-sm mt-1">Elegí cuántos números querés</p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl text-white/30 hover:text-white/70 hover:bg-white/5 transition-all"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Package selector */}
              <div className="grid grid-cols-2 gap-3">
                {PACKAGES.map(pkg => (
                  <button
                    key={pkg.quantity}
                    onClick={() => setSelected(pkg.quantity)}
                    className={`relative p-4 rounded-2xl border text-left transition-all duration-200 ${
                      selected === pkg.quantity
                        ? 'border-green-400/50 bg-green-400/5'
                        : 'border-white/8 bg-white/[0.02] hover:border-white/15'
                    }`}
                  >
                    {pkg.discount > 0 && (
                      <span className="absolute top-2 right-2 text-[10px] bg-green-400/20 text-green-400 px-2 py-0.5 rounded-full">
                        -{pkg.discount * 100}%
                      </span>
                    )}
                    <div className="text-2xl font-display italic text-white">{pkg.quantity}</div>
                    <div className="text-xs text-white/40 mt-0.5">{pkg.label}</div>
                    <div className="text-sm text-white/70 mt-2 font-medium">
                      {formatCurrency(Math.floor(pkg.quantity * PRICE_PER_NUMBER * (1 - pkg.discount)))}
                    </div>
                  </button>
                ))}
              </div>

              {/* Total */}
              <div className="flex items-center justify-between py-4 border-t border-white/8">
                <div className="text-white/50 text-sm">Total a pagar</div>
                <div className="text-white font-semibold text-xl font-display italic">{formatCurrency(total)}</div>
              </div>

              {/* Breakdown */}
              <div className="space-y-2 text-xs text-white/30 bg-white/[0.02] rounded-xl p-4">
                <div className="flex justify-between">
                  <span>❤️ Va a donaciones</span>
                  <span>{formatCurrency(Math.floor(total * 0.5))}</span>
                </div>
                <div className="flex justify-between">
                  <span>🎁 Va a premios</span>
                  <span>{formatCurrency(Math.floor(total * 0.4))}</span>
                </div>
                <div className="flex justify-between">
                  <span>⚡ Plataforma</span>
                  <span>{formatCurrency(Math.floor(total * 0.1))}</span>
                </div>
              </div>

              {/* Pay button */}
              <button
                onClick={handlePay}
                disabled={loading}
                className="w-full py-4 rounded-2xl bg-[#009EE3] text-white font-semibold text-base hover:bg-[#008ED3] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {loading ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    Redirigiendo...
                  </>
                ) : (
                  <>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" fill="currentColor"/>
                    </svg>
                    PAGAR CON MERCADO PAGO
                  </>
                )}
              </button>

              <p className="text-center text-white/20 text-xs">
                Sin registro · Sin contraseña · 100% seguro
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
