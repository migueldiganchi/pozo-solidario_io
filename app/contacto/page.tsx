'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LegalLayout } from '@/components/LegalLayout'

const TOPICS = [
  { value: 'participar', label: '🎟 Quiero participar / tengo dudas' },
  { value: 'causa', label: '❤️ Proponer una causa' },
  { value: 'sponsor', label: '🎁 Quiero ser sponsor / donar un premio' },
  { value: 'prensa', label: '📰 Prensa / medios' },
  { value: 'tecnico', label: '🔧 Problema técnico' },
  { value: 'otro', label: '💬 Otro' },
]

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', topic: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const set = (key: string, val: string) => setForm(prev => ({ ...prev, [key]: val }))

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.topic || !form.message) {
      setError('Completá todos los campos.')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError('El email no parece válido.')
      return
    }
    setError('')
    setLoading(true)

    // Send to API
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error()
      setSent(true)
    } catch {
      setError('No pudimos enviar el mensaje. Probá de nuevo o escribinos directamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <LegalLayout
      title="Contacto"
      subtitle="Respondemos todos los mensajes. Generalmente en menos de 24 horas."
      badge="Hablemos"
    >
      <div className="grid md:grid-cols-5 gap-12">
        {/* Form */}
        <div className="md:col-span-3">
          <AnimatePresence mode="wait">
            {sent ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="border border-green-400/20 bg-green-400/[0.04] rounded-3xl p-10 text-center space-y-4"
              >
                <div className="text-5xl">✅</div>
                <h2 className="font-display italic text-2xl text-white">¡Mensaje enviado!</h2>
                <p className="text-white/40 text-sm leading-relaxed">
                  Recibimos tu mensaje y te respondemos pronto a <span className="text-white/60">{form.email}</span>.
                </p>
                <button
                  onClick={() => { setSent(false); setForm({ name: '', email: '', topic: '', message: '' }) }}
                  className="mt-4 text-white/30 hover:text-white/60 text-sm transition-colors"
                >
                  Enviar otro mensaje
                </button>
              </motion.div>
            ) : (
              <motion.div key="form" className="space-y-5">
                {/* Name + Email */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs text-white/35 font-medium">Nombre <span className="text-green-400/50">*</span></label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={e => set('name', e.target.value)}
                      placeholder="Tu nombre"
                      className="w-full bg-white/[0.03] border border-white/8 rounded-xl px-4 py-3 text-white/80 text-sm placeholder:text-white/20 focus:outline-none focus:border-white/20 transition-colors"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-white/35 font-medium">Email <span className="text-green-400/50">*</span></label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={e => set('email', e.target.value)}
                      placeholder="tu@email.com"
                      className="w-full bg-white/[0.03] border border-white/8 rounded-xl px-4 py-3 text-white/80 text-sm placeholder:text-white/20 focus:outline-none focus:border-white/20 transition-colors"
                    />
                  </div>
                </div>

                {/* Topic */}
                <div className="space-y-1.5">
                  <label className="text-xs text-white/35 font-medium">Asunto <span className="text-green-400/50">*</span></label>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {TOPICS.map(t => (
                      <button
                        key={t.value}
                        onClick={() => set('topic', t.value)}
                        className={`text-left px-4 py-2.5 rounded-xl border text-sm transition-all ${
                          form.topic === t.value
                            ? 'border-green-400/40 bg-green-400/[0.06] text-white/80'
                            : 'border-white/6 bg-white/[0.02] text-white/35 hover:border-white/12 hover:text-white/55'
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-1.5">
                  <label className="text-xs text-white/35 font-medium">Mensaje <span className="text-green-400/50">*</span></label>
                  <textarea
                    value={form.message}
                    onChange={e => set('message', e.target.value)}
                    placeholder="Contanos en qué podemos ayudarte..."
                    rows={5}
                    className="w-full bg-white/[0.03] border border-white/8 rounded-xl px-4 py-3 text-white/80 text-sm placeholder:text-white/20 focus:outline-none focus:border-white/20 resize-none transition-colors leading-relaxed"
                  />
                </div>

                {/* Error */}
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-400/70 text-xs"
                  >
                    {error}
                  </motion.p>
                )}

                {/* Submit */}
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full py-4 rounded-2xl bg-green-400 text-black font-semibold text-base hover:bg-green-300 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    'Enviar mensaje'
                  )}
                </button>

                <p className="text-white/20 text-xs text-center">
                  No compartimos tu email con terceros. Ver{' '}
                  <a href="/privacidad" className="underline hover:text-white/40 transition-colors">política de privacidad</a>.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sidebar info */}
        <div className="md:col-span-2 space-y-8">
          <div className="space-y-6">
            <h3 className="font-display italic text-xl text-white">Otras formas de contacto</h3>

            {[
              {
                icon: '📧',
                title: 'Email directo',
                body: 'hola@pozosolidario.com',
                sub: 'Para temas urgentes',
              },
              {
                icon: '📸',
                title: 'Instagram',
                body: '@pozosolidario',
                sub: 'Novedades y ganadores',
              },
              {
                icon: '⏱️',
                title: 'Tiempo de respuesta',
                body: 'Menos de 24 horas',
                sub: 'En días hábiles',
              },
            ].map(item => (
              <div key={item.title} className="flex gap-4">
                <span className="text-xl shrink-0 mt-0.5">{item.icon}</span>
                <div>
                  <p className="text-white/60 text-sm font-medium">{item.title}</p>
                  <p className="text-white/40 text-sm">{item.body}</p>
                  <p className="text-white/20 text-xs mt-0.5">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-white/5 pt-6 space-y-3">
            <p className="text-white/25 text-xs leading-relaxed">
              ¿Querés proponer una causa? Podés hacerlo directamente desde la sección de causas en la plataforma.
            </p>
            <a href="/#causas" className="text-green-400/60 text-xs hover:text-green-400 transition-colors">
              Ir a causas →
            </a>
          </div>
        </div>
      </div>
    </LegalLayout>
  )
}
