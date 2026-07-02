'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { formatCurrency, getNextTuesday, getCountdown } from '@/lib/utils'

interface PoolData {
  total: number
  donationsAmount: number
  prizesAmount: number
  platformAmount: number
  participationCount: number
}

interface HeroProps {
  onParticipate: () => void
}

function AnimatedNumber({ value, prefix = '' }: { value: number; prefix?: string }) {
  const [displayed, setDisplayed] = useState(0)
  const prevRef = useRef(0)

  useEffect(() => {
    const start = prevRef.current
    const end = value
    const duration = 1200
    const startTime = performance.now()

    const animate = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3) // easeOutCubic
      setDisplayed(Math.floor(start + (end - start) * eased))
      if (progress < 1) requestAnimationFrame(animate)
      else prevRef.current = end
    }

    requestAnimationFrame(animate)
  }, [value])

  return <span>{prefix}{formatCurrency(displayed)}</span>
}

function Countdown() {
  const [cd, setCd] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const update = () => setCd(getCountdown(getNextTuesday()))
    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [])

  const pad = (n: number) => String(n).padStart(2, '0')

  return (
    <div className="flex items-center gap-1 font-mono text-sm text-white/40">
      <span>{pad(cd.days)}d</span>
      <span className="opacity-50">:</span>
      <span>{pad(cd.hours)}h</span>
      <span className="opacity-50">:</span>
      <span>{pad(cd.minutes)}m</span>
      <span className="opacity-50">:</span>
      <span className="text-white/60">{pad(cd.seconds)}s</span>
    </div>
  )
}

export function Hero({ onParticipate }: HeroProps) {
  const [pool, setPool] = useState<PoolData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/pool')
      .then(r => r.json())
      .then(data => { setPool(data); setLoading(false) })
      .catch(() => setLoading(false))

    // Refresh every 30s
    const interval = setInterval(() => {
      fetch('/api/pool').then(r => r.json()).then(setPool).catch(() => {})
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-20">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-green-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-2xl w-full mx-auto text-center space-y-12">

        {/* Logo grande y centrado */}
        <motion.img
          src="/logo.png"
          alt="Pozo Solidario Logo"
          initial={{ opacity: 0, y: -21 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.6 }}
          className="w-[123px] h-[123px] object-contain mx-auto"
        />

        {/* Week badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 text-xs text-white/40 bg-white/[0.03]"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          Semana activa · Sorteo el martes 21:00
        </motion.div>

        {/* Main number */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="space-y-3"
        >
          <div className="font-display text-[clamp(3.5rem,12vw,7rem)] leading-none text-white text-glow">
            {loading ? (
              <span className="opacity-20">$0</span>
            ) : (
              <AnimatedNumber value={pool?.total || 0} />
            )}
          </div>
          <p className="text-white/30 text-lg tracking-widest uppercase text-sm font-medium">
            Pozo actual
          </p>
        </motion.div>

        {/* Split breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="grid grid-cols-3 gap-3"
        >
          {[
            { icon: '❤️', label: 'Donaciones', value: pool?.donationsAmount || 0, color: 'text-red-400/70' },
            { icon: '🎁', label: 'Premios', value: pool?.prizesAmount || 0, color: 'text-yellow-400/70' },
            { icon: '⚡', label: 'Plataforma', value: pool?.platformAmount || 0, color: 'text-blue-400/70' },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.07 }}
              className="border-gradient rounded-2xl p-4 text-center space-y-1"
            >
              <span className="text-lg">{item.icon}</span>
              <div className="text-white/80 font-medium text-sm">
                {loading ? <span className="skeleton block h-4 w-16 mx-auto" /> : formatCurrency(item.value)}
              </div>
              <div className={`text-xs ${item.color}`}>{item.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Countdown */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex items-center justify-center gap-3 text-white/30 text-sm"
        >
          <span>⏳ Sorteo en</span>
          <Countdown />
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="space-y-4"
        >
          <button
            onClick={onParticipate}
            className="group relative w-full max-w-xs mx-auto flex items-center justify-center gap-3 py-5 px-8 rounded-2xl bg-green-400 text-black font-semibold text-lg hover:bg-green-300 active:scale-[0.98] transition-all duration-200"
          >
            <span>PARTICIPAR</span>
            <motion.span
              className="text-xl"
              animate={{ x: [0, 4, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >→</motion.span>
          </button>

          <p className="text-white/25 text-sm">
            Comprás un número, ayudás y participás.
          </p>

          {pool?.participationCount ? (
            <p className="text-white/20 text-xs">
              {pool.participationCount} persona{pool.participationCount !== 1 ? 's' : ''} ya participaron esta semana
            </p>
          ) : null}
        </motion.div>

        {/* How it works mini */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="pt-4 border-t border-white/5"
        >
          <div className="flex justify-center gap-8 text-xs text-white/25">
            <div className="text-center space-y-1">
              <div className="text-2xl">1</div>
              <div>Comprás números</div>
            </div>
            <div className="text-white/10 self-center">→</div>
            <div className="text-center space-y-1">
              <div className="text-2xl">2</div>
              <div>El pozo crece</div>
            </div>
            <div className="text-white/10 self-center">→</div>
            <div className="text-center space-y-1">
              <div className="text-2xl">3</div>
              <div>Martes sorteo</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
