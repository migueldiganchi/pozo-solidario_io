'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface AIProps {
  onAction: (action: string) => void
}

const SUGGESTIONS = [
  'Quiero participar',
  '¿Cómo funciona?',
  'Ver premios',
  'Ver causas',
]

interface Message {
  role: 'user' | 'assistant'
  content: string
}

// Altura compartida por el input y el botón de enviar, para que coincidan siempre.
const CONTROL_HEIGHT = 44

export function AIAssistant({ onAction }: AIProps) {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const [justSent, setJustSent] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const updateScrollState = useCallback(() => {
    const el = suggestionsRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 4)
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4)
  }, [])

  useEffect(() => {
    const el = suggestionsRef.current
    if (!el) return
    updateScrollState()
    el.addEventListener('scroll', updateScrollState, { passive: true })
    const ro = new ResizeObserver(updateScrollState)
    ro.observe(el)
    return () => {
      el.removeEventListener('scroll', updateScrollState)
      ro.disconnect()
    }
  }, [updateScrollState, open])

  const scrollSuggestions = (dir: 'left' | 'right') => {
    const el = suggestionsRef.current
    if (!el) return
    el.scrollBy({ left: dir === 'left' ? -120 : 120, behavior: 'smooth' })
  }

  const send = async (text: string) => {
    if (!text.trim()) return

    setJustSent(true)
    setTimeout(() => setJustSent(false), 400)

    const userMsg: Message = { role: 'user', content: text }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: messages.slice(-4).map(m => ({ role: m.role, content: m.content })),
        }),
      })

      const data = await res.json()
      const assistantMsg: Message = { role: 'assistant', content: data.message || 'Error al responder.' }
      setMessages(prev => [...prev, assistantMsg])

      if (data.action && data.action !== 'none') {
        setTimeout(() => onAction(data.action), 300)
      }
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'No pude conectarme. Intentá de nuevo.' }])
    } finally {
      setLoading(false)
    }
  }

  const canSend = input.trim().length > 0 && !loading

  return (
    <>
      {/* Floating button */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            onClick={() => { setOpen(true); setTimeout(() => inputRef.current?.focus(), 150) }}
            className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-gradient-to-br from-[hsl(0,0%,12%)] to-[hsl(0,0%,5%)] border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:border-white/20 shadow-[0_8px_30px_rgba(0,0,0,0.5)] transition-colors"
          >
            <span className="absolute inset-0 rounded-full bg-emerald-400/10 blur-md -z-10" />
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            className="fixed bottom-6 right-6 z-40 w-[22rem] bg-[hsl(0,0%,6%)] border border-white/10 rounded-[28px] shadow-[0_20px_60px_rgba(0,0,0,0.55)] overflow-hidden"
          >
            {/* Ambient glow */}
            <div className="pointer-events-none absolute -top-16 -right-16 w-48 h-48 bg-emerald-400/[0.06] rounded-full blur-3xl" />

            {/* Header */}
            <div className="relative flex items-center justify-between px-5 py-4 border-b border-white/5">
              <div className="flex items-center gap-2.5">
                <span className="relative flex w-2 h-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60 animate-ping" />
                  <span className="relative inline-flex rounded-full w-2 h-2 bg-emerald-400" />
                </span>
                <span className="text-sm text-white/70 font-medium tracking-tight">Asistente</span>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Cerrar"
                className="w-7 h-7 flex items-center justify-center rounded-full text-white/30 hover:text-white/80 hover:bg-white/5 transition-colors text-xs"
              >
                ✕
              </button>
            </div>

            {/* Messages */}
            <div className="relative h-72 overflow-y-auto p-4 space-y-3 scroll-smooth chat-scroll">
              {messages.length === 0 && (
                <div className="text-white/25 text-xs text-center pt-8">
                  Preguntame lo que quieras
                </div>
              )}
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className={`text-sm leading-relaxed max-w-[85%] ${msg.role === 'user'
                      ? 'text-white/85 bg-white/[0.06] rounded-2xl rounded-br-md px-3.5 py-2 ml-auto'
                      : 'text-white/60 mr-auto'
                    }`}
                >
                  {msg.content}
                </motion.div>
              ))}
              {loading && (
                <div className="flex gap-1 pl-1">
                  {[0, 0.15, 0.3].map((d, i) => (
                    <motion.span
                      key={i}
                      className="w-1.5 h-1.5 bg-white/30 rounded-full"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ repeat: Infinity, duration: 1, delay: d }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Suggestions — carrusel horizontal de una sola línea */}
            <div className="relative flex items-center gap-1 pl-2 pr-2 pb-3">
              <button
                onClick={() => scrollSuggestions('left')}
                disabled={!canScrollLeft}
                aria-label="Ver sugerencias anteriores"
                className="shrink-0 w-6 h-6 flex items-center justify-center rounded-full text-white/40 hover:text-white/80 hover:bg-white/5 disabled:opacity-0 disabled:pointer-events-none transition-all"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>

              <div className="relative flex-1 min-w-0">
                {canScrollLeft && (
                  <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-[hsl(0,0%,6%)] to-transparent z-10" />
                )}
                <div
                  ref={suggestionsRef}
                  className="flex gap-2 overflow-x-auto scroll-smooth snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                >
                  {SUGGESTIONS.map(s => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      className="snap-start shrink-0 text-xs text-white/40 border border-white/8 rounded-full px-3 py-1.5 whitespace-nowrap hover:text-white/70 hover:border-white/20 hover:bg-white/[0.03] transition-all"
                    >
                      {s}
                    </button>
                  ))}
                </div>
                {canScrollRight && (
                  <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-[hsl(0,0%,6%)] to-transparent z-10" />
                )}
              </div>

              <button
                onClick={() => scrollSuggestions('right')}
                disabled={!canScrollRight}
                aria-label="Ver más sugerencias"
                className="shrink-0 w-6 h-6 flex items-center justify-center rounded-full text-white/40 hover:text-white/80 hover:bg-white/5 disabled:opacity-0 disabled:pointer-events-none transition-all"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>

            {/* Input row — input y botón comparten la misma altura exacta */}
            <div className="px-4 pb-4 flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && send(input)}
                placeholder="Preguntame algo..."
                style={{ height: CONTROL_HEIGHT }}
                className="flex-1 appearance-none bg-white/[0.04] border border-white/10 rounded-full px-4 text-sm text-white/85 placeholder:text-white/25 focus:outline-none focus:ring-0 focus:rounded-full focus:border-emerald-400/40 focus:bg-white/[0.06] transition-colors"
              />
              <motion.button
                onClick={() => send(input)}
                disabled={!canSend}
                whileTap={canSend ? { scale: 0.9 } : {}}
                animate={justSent ? { scale: [1, 0.85, 1] } : {}}
                style={{ width: CONTROL_HEIGHT, height: CONTROL_HEIGHT }}
                className={`shrink-0 rounded-full flex items-center justify-center transition-all ${canSend
                    ? 'bg-emerald-400 text-black shadow-[0_4px_16px_rgba(52,211,153,0.35)] hover:bg-emerald-300'
                    : 'bg-white/[0.05] text-white/25'
                  } disabled:cursor-not-allowed`}
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .chat-scroll::-webkit-scrollbar {
          width: 6px;
        }
        .chat-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .chat-scroll::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.08);
          border-radius: 999px;
        }
        .chat-scroll:hover::-webkit-scrollbar-thumb {
          background: rgba(52, 211, 153, 0.35);
        }
        .chat-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(52, 211, 153, 0.55);
        }
        .chat-scroll {
          scrollbar-width: thin;
          scrollbar-color: rgba(255, 255, 255, 0.08) transparent;
        }
      `}</style>
    </>
  )
}