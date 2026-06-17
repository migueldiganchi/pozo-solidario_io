'use client'

import { useState, useRef } from 'react'
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

export function AIAssistant({ onAction }: AIProps) {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const send = async (text: string) => {
    if (!text.trim()) return

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

      // Dispatch action if any
      if (data.action && data.action !== 'none') {
        setTimeout(() => onAction(data.action), 300)
      }
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'No pude conectarme. Intentá de nuevo.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Floating button */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => { setOpen(true); setTimeout(() => inputRef.current?.focus(), 100) }}
            className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full bg-[hsl(0,0%,8%)] border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:border-white/20 shadow-xl shadow-black/30 transition-all"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-40 w-80 bg-[hsl(0,0%,6%)] border border-white/10 rounded-3xl shadow-2xl shadow-black/50 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-sm text-white/70 font-medium">Asistente</span>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-white/30 hover:text-white/70 transition-colors text-xs"
              >
                ✕
              </button>
            </div>

            {/* Messages */}
            <div className="h-64 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 && (
                <div className="text-white/25 text-xs text-center pt-4">
                  Preguntame lo que quieras
                </div>
              )}
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'text-white/80 bg-white/5 rounded-2xl px-3 py-2 ml-4'
                      : 'text-white/60 mr-4'
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

            {/* Suggestions */}
            {messages.length === 0 && (
              <div className="px-4 pb-3 flex flex-wrap gap-2">
                {SUGGESTIONS.map(s => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="text-xs text-white/40 border border-white/8 rounded-full px-3 py-1.5 hover:text-white/70 hover:border-white/15 transition-all"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="px-4 pb-4 flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && send(input)}
                placeholder="Preguntame algo..."
                className="flex-1 bg-white/[0.03] border border-white/8 rounded-xl px-3 py-2 text-sm text-white/80 placeholder:text-white/20 focus:outline-none focus:border-white/15"
              />
              <button
                onClick={() => send(input)}
                disabled={!input.trim() || loading}
                className="p-2 rounded-xl bg-white/5 text-white/50 hover:text-white hover:bg-white/10 transition-all disabled:opacity-30"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
