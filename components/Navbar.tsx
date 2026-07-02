'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

interface NavbarProps {
  onParticipate?: () => void
}

export function Navbar({ onParticipate }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'backdrop-blur-xl bg-black/60 border-b border-white/5' : ''
      }`}
    >
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <img src="/logo.png" alt="Logo Pozo Solidario" className="w-8 h-8 object-contain transition-transform group-hover:scale-105" />
          <span className="font-display text-lg text-text group-hover:text-primary transition-colors">
            Pozo Solidario
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8 text-sm text-white/50">
          <Link href="/#causas" className="hover:text-white/90 transition-colors">Causas</Link>
          <Link href="/#premios" className="hover:text-white/90 transition-colors">Premios</Link>
          <Link href="/#ganadores" className="hover:text-white/90 transition-colors">Ganadores</Link>
          <Link href="/#donaciones" className="hover:text-white/90 transition-colors">Donaciones</Link>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onParticipate}
            className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-green-400/10 text-green-400 text-sm font-medium hover:bg-green-400/20 transition-all border border-green-400/20"
          >
            Participar
          </button>

          {/* Mobile menu */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 text-white/60 hover:text-white"
          >
            <div className="w-5 space-y-1.5">
              <span className={`block h-px bg-current transition-all ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`block h-px bg-current transition-all ${menuOpen ? 'opacity-0' : ''}`} />
              <span className={`block h-px bg-current transition-all ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </div>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-black/90 backdrop-blur-xl border-b border-white/5"
          >
            <div className="px-6 py-4 space-y-4 text-sm text-white/60">
              <Link href="/#causas" className="block hover:text-white" onClick={() => setMenuOpen(false)}>Causas</Link>
              <Link href="/#premios" className="block hover:text-white" onClick={() => setMenuOpen(false)}>Premios</Link>
              <Link href="/#ganadores" className="block hover:text-white" onClick={() => setMenuOpen(false)}>Ganadores</Link>
              <Link href="/#donaciones" className="block hover:text-white" onClick={() => setMenuOpen(false)}>Donaciones</Link>
              <button
                onClick={() => { onParticipate?.(); setMenuOpen(false) }}
                className="w-full py-3 rounded-xl bg-green-400/10 text-green-400 font-medium"
              >
                Participar
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
