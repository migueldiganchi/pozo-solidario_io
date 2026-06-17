'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface LegalLayoutProps {
  title: string
  subtitle?: string
  badge?: string
  lastUpdated?: string
  children: ReactNode
}

export function LegalLayout({ title, subtitle, badge, lastUpdated, children }: LegalLayoutProps) {
  return (
    <div className="min-h-screen">
      {/* Back nav */}
      <div className="fixed top-0 left-0 right-0 z-50 px-6 py-5">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-white/30 hover:text-white/70 text-sm transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Volver al inicio
        </Link>
      </div>

      {/* Header */}
      <div className="pt-28 pb-16 px-6 border-b border-white/5">
        <div className="max-w-3xl mx-auto">
          {badge && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 text-xs text-white/30 mb-6"
            >
              {badge}
            </motion.div>
          )}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="font-display italic text-4xl md:text-6xl text-white leading-tight"
          >
            {title}
          </motion.h1>
          {subtitle && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 }}
              className="text-white/40 mt-4 text-lg leading-relaxed max-w-xl"
            >
              {subtitle}
            </motion.p>
          )}
          {lastUpdated && (
            <p className="text-white/20 text-xs mt-6">Última actualización: {lastUpdated}</p>
          )}
        </div>
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="max-w-3xl mx-auto px-6 py-16"
      >
        {children}
      </motion.div>

      {/* Footer simple */}
      <div className="border-t border-white/5 py-10 px-6">
        <div className="max-w-3xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <Link href="/" className="font-display italic text-white/40 hover:text-white/70 transition-colors">
            Pozo Solidario
          </Link>
          <div className="flex gap-6 text-xs text-white/20">
            <Link href="/terminos" className="hover:text-white/50 transition-colors">Términos</Link>
            <Link href="/privacidad" className="hover:text-white/50 transition-colors">Privacidad</Link>
            <Link href="/cookies" className="hover:text-white/50 transition-colors">Cookies</Link>
            <Link href="/contacto" className="hover:text-white/50 transition-colors">Contacto</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

// Prose components for legal content
export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mb-12">
      <h2 className="font-display italic text-2xl text-white mb-4">{title}</h2>
      <div className="space-y-4 text-white/50 text-sm leading-relaxed">
        {children}
      </div>
    </section>
  )
}

export function P({ children }: { children: ReactNode }) {
  return <p className="text-white/50 text-sm leading-relaxed">{children}</p>
}

export function UL({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2 pl-4">
      {items.map((item, i) => (
        <li key={i} className="text-white/40 text-sm leading-relaxed flex gap-3">
          <span className="text-white/15 shrink-0 mt-0.5">—</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

export function Highlight({ children }: { children: ReactNode }) {
  return (
    <div className="border-l-2 border-green-400/30 pl-4 py-1 text-white/60 text-sm italic leading-relaxed">
      {children}
    </div>
  )
}
