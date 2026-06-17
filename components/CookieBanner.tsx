'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

export function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const accepted = localStorage.getItem('ps_cookie_ok')
    if (!accepted) {
      // Delay showing to not distract on first paint
      const t = setTimeout(() => setVisible(true), 1800)
      return () => clearTimeout(t)
    }
  }, [])

  const accept = () => {
    localStorage.setItem('ps_cookie_ok', 'true')
    setVisible(false)
  }

  const dismiss = () => {
    // Accept but just close (same effect)
    accept()
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ type: 'spring', damping: 24, stiffness: 280 }}
          className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-3rem)] max-w-lg"
        >
          <div className="bg-[hsl(0,0%,8%)] border border-white/10 rounded-2xl p-5 shadow-2xl shadow-black/60">
            <div className="flex items-start gap-4">
              <span className="text-xl shrink-0 mt-0.5">🍪</span>
              <div className="flex-1 space-y-1">
                <p className="text-white/70 text-sm leading-relaxed">
                  Usamos localStorage para recordar tu sesión anónima. Sin cookies de publicidad ni tracking.{' '}
                  <Link href="/cookies" className="text-white/40 underline hover:text-white/60 transition-colors">
                    Ver política de cookies
                  </Link>
                  .
                </p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 mt-4">
              <button
                onClick={dismiss}
                className="text-xs text-white/30 hover:text-white/50 transition-colors"
              >
                Rechazar no esenciales
              </button>
              <button
                onClick={accept}
                className="px-4 py-2 rounded-xl bg-white/8 text-white/70 text-xs hover:bg-white/12 hover:text-white transition-all font-medium"
              >
                Entendido ✓
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
