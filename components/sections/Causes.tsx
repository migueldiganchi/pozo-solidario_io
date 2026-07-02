'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'

interface Cause {
  _id: string
  title: string
  description: string
  city: string
  images: string[]
  votes: number
  instagram?: string
  whatsapp?: string
}

interface CausesProps {
  visitorId: string
}

export function Causes({ visitorId }: CausesProps) {
  const [causes, setCauses] = useState<Cause[]>([])
  const [loading, setLoading] = useState(true)
  const [votedIds, setVotedIds] = useState<Set<string>>(new Set())
  const [voting, setVoting] = useState<string | null>(null)
  const [showPropose, setShowPropose] = useState(false)

  useEffect(() => {
    fetch('/api/causes')
      .then(r => r.json())
      .then(data => {
        setCauses(data.causes || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))

    // Load voted causes from localStorage
    const voted = JSON.parse(localStorage.getItem('ps_voted') || '[]')
    setVotedIds(new Set(voted))
  }, [])

  const handleVote = async (causeId: string) => {
    if (votedIds.has(causeId)) return
    if (!visitorId) return

    setVoting(causeId)
    try {
      const res = await fetch('/api/votes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ causeId, visitorId }),
      })

      const data = await res.json()

      if (data.alreadyVoted) {
        toast('Ya apoyaste esta causa esta semana')
        setVotedIds(prev => new Set([...Array.from(prev), causeId]))
        return
      }

      if (!res.ok) throw new Error(data.error)

      setCauses(prev => prev.map(c =>
        c._id === causeId ? { ...c, votes: data.votes } : c
      ))

      const newVoted = [...Array.from(votedIds), causeId]
      setVotedIds(new Set(newVoted))
      localStorage.setItem('ps_voted', JSON.stringify(newVoted))

      toast.success('¡Gracias por apoyar esta causa!')
    } catch (error: any) {
      toast.error(error.message || 'Error al votar')
    } finally {
      setVoting(null)
    }
  }

  if (loading) {
    return (
      <section id="causas" className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="skeleton h-8 w-48 mb-12 rounded-xl" />
          <div className="grid md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="skeleton h-48 rounded-2xl" />
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="causas" className="py-24 px-6">
      <div className="max-w-4xl mx-auto space-y-12">

        <div className="flex items-end justify-between">
          <div>
            <div className="text-xs text-green-400/60 uppercase tracking-widest mb-3 font-medium">Esta semana</div>
            <h2 className="font-display text-4xl md:text-5xl text-white">Causas</h2>
            <p className="text-white/40 text-sm mt-2">Las 3 más votadas reciben ayuda real.</p>
          </div>
          <button
            onClick={() => setShowPropose(true)}
            className="text-sm text-white/40 hover:text-white/80 border border-white/10 hover:border-white/20 px-4 py-2 rounded-xl transition-all"
          >
            Proponer causa
          </button>
        </div>

        {causes.length === 0 ? (
          <div className="text-center py-20 text-white/20 text-sm">
            No hay causas activas esta semana.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {causes.map((cause, i) => (
              <motion.div
                key={cause._id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="border-gradient rounded-2xl p-6 space-y-4 group hover:bg-white/[0.02] transition-all"
              >
                {i < 3 && (
                  <span className="inline-block text-xs text-green-400/60 bg-green-400/10 px-2 py-0.5 rounded-full">
                    #{i + 1} más votada
                  </span>
                )}

                <div>
                  <h3 className="text-white font-medium text-lg leading-tight">{cause.title}</h3>
                  <p className="text-white/40 text-sm mt-2 leading-relaxed line-clamp-3">{cause.description}</p>
                </div>

                <div className="flex items-center gap-2 text-xs text-white/30">
                  <span>📍</span>
                  <span>{cause.city}</span>
                  {cause.instagram && (
                    <>
                      <span>·</span>
                      <a href={`https://instagram.com/${cause.instagram}`} target="_blank" className="hover:text-white/60 transition-colors">
                        @{cause.instagram}
                      </a>
                    </>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-white/30 text-sm">
                    <span className="font-medium text-white/60">{cause.votes}</span> apoyos
                  </span>

                  <button
                    onClick={() => handleVote(cause._id)}
                    disabled={votedIds.has(cause._id) || voting === cause._id}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      votedIds.has(cause._id)
                        ? 'bg-green-400/10 text-green-400/50 cursor-default'
                        : 'bg-white/5 text-white/70 hover:bg-green-400/10 hover:text-green-400 active:scale-95'
                    }`}
                  >
                    {voting === cause._id ? (
                      <span className="w-4 h-4 border border-green-400/30 border-t-green-400 rounded-full animate-spin" />
                    ) : votedIds.has(cause._id) ? (
                      '✓ Apoyado'
                    ) : (
                      '♥ Apoyar'
                    )}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <ProposeModal isOpen={showPropose} onClose={() => setShowPropose(false)} />
    </section>
  )
}

// Propose cause modal
function ProposeModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [form, setForm] = useState({ title: '', description: '', instagram: '', whatsapp: '', city: '' })
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async () => {
    if (!form.title || !form.description || !form.city) {
      toast.error('Completá título, descripción y ciudad')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/causes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (!res.ok) throw new Error('Error al enviar')
      setSent(true)
    } catch {
      toast.error('Error al enviar la causa')
    } finally {
      setLoading(false)
    }
  }

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
            <div className="pointer-events-auto w-full md:max-w-lg md:mx-auto bg-[hsl(0,0%,6%)] border border-white/10 rounded-t-3xl md:rounded-3xl p-8 max-h-[90vh] overflow-y-auto">
              {sent ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8 space-y-4"
                >
                  <div className="text-5xl">✅</div>
                  <h3 className="font-display text-2xl text-white">¡Recibido!</h3>
                  <p className="text-white/40 text-sm">Tu causa fue enviada y será revisada pronto.</p>
                  <button onClick={onClose} className="mt-4 text-white/50 hover:text-white text-sm">Cerrar</button>
                </motion.div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="font-display text-2xl text-white">Proponer causa</h2>
                    <button onClick={onClose} className="text-white/30 hover:text-white/70">✕</button>
                  </div>

                  {[
                    { key: 'title', label: 'Nombre de la causa', placeholder: 'Ej: Comedor Los Piletones', required: true },
                    { key: 'description', label: 'Descripción breve', placeholder: 'Contanos para qué se usaría la ayuda...', required: true, multiline: true },
                    { key: 'city', label: 'Ciudad', placeholder: 'Buenos Aires', required: true },
                    { key: 'instagram', label: 'Instagram (opcional)', placeholder: '@tucausa' },
                    { key: 'whatsapp', label: 'WhatsApp (opcional)', placeholder: '+549...' },
                  ].map(field => (
                    <div key={field.key} className="space-y-1.5">
                      <label className="text-xs text-white/40 font-medium">
                        {field.label} {field.required && <span className="text-green-400/60">*</span>}
                      </label>
                      {field.multiline ? (
                        <textarea
                          value={(form as any)[field.key]}
                          onChange={e => setForm(prev => ({ ...prev, [field.key]: e.target.value }))}
                          placeholder={field.placeholder}
                          rows={3}
                          className="w-full bg-white/[0.03] border border-white/8 rounded-xl px-4 py-3 text-white/80 text-sm placeholder:text-white/20 focus:outline-none focus:border-green-400/30 resize-none"
                        />
                      ) : (
                        <input
                          type="text"
                          value={(form as any)[field.key]}
                          onChange={e => setForm(prev => ({ ...prev, [field.key]: e.target.value }))}
                          placeholder={field.placeholder}
                          className="w-full bg-white/[0.03] border border-white/8 rounded-xl px-4 py-3 text-white/80 text-sm placeholder:text-white/20 focus:outline-none focus:border-green-400/30"
                        />
                      )}
                    </div>
                  ))}

                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full py-4 rounded-2xl bg-green-400 text-black font-semibold hover:bg-green-300 active:scale-[0.98] transition-all disabled:opacity-50"
                  >
                    {loading ? 'Enviando...' : 'Proponer causa'}
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}