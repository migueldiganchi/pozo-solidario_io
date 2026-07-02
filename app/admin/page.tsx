'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { formatCurrency } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function AdminPage() {
  const [secret, setSecret] = useState('')
  const [authed, setAuthed] = useState(false)
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  // Prize form
  const [prizeForm, setPrizeForm] = useState({ title: '', sponsor: '', value: '', image: '' })

  const fetchData = async (s: string) => {
    const res = await fetch('/api/admin', {
      headers: { 'x-admin-secret': s },
    })
    if (!res.ok) throw new Error('Unauthorized')
    return res.json()
  }

  const handleAuth = async () => {
    try {
      const d = await fetchData(secret)
      setData(d)
      setAuthed(true)
    } catch {
      toast.error('Clave incorrecta')
    }
  }

  const action = async (body: object) => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-secret': secret },
        body: JSON.stringify(body),
      })
      const d = await res.json()
      if (!res.ok) throw new Error(d.error)
      toast.success('Listo')
      const updated = await fetchData(secret)
      setData(updated)
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setLoading(false)
    }
  }

  if (!authed) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6">
        <div className="w-full max-w-sm space-y-4">
          <h1 className="font-display text-3xl text-white text-center">Admin</h1>
          <input
            type="password"
            value={secret}
            onChange={e => setSecret(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAuth()}
            placeholder="Clave de administrador"
            className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white/80 text-sm placeholder:text-white/20 focus:outline-none focus:border-white/20"
          />
          <button
            onClick={handleAuth}
            className="w-full py-3 rounded-xl bg-white/5 text-white/70 hover:bg-white/10 transition-all font-medium"
          >
            Entrar
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen px-6 py-12 max-w-4xl mx-auto space-y-12">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl text-white">Admin · Pozo Solidario</h1>
        <span className="text-xs text-white/30">{data?.weekId}</span>
      </div>

      {/* Pool stats */}
      {data?.pool && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Pozo total', value: formatCurrency(data.pool.total) },
            { label: 'Donaciones', value: formatCurrency(data.pool.donationsAmount) },
            { label: 'Premios', value: formatCurrency(data.pool.prizesAmount) },
            { label: 'Participaciones', value: data.pool.participationCount },
          ].map(stat => (
            <div key={stat.label} className="border border-white/10 rounded-2xl p-4 space-y-1">
              <div className="text-white/30 text-xs">{stat.label}</div>
              <div className="text-white font-medium">{stat.value}</div>
            </div>
          ))}
        </div>
      )}

      {/* Pending causes */}
      <section className="space-y-4">
        <h2 className="text-white/60 font-medium">Causas pendientes ({data?.pendingCauses?.length || 0})</h2>
        {data?.pendingCauses?.length === 0 && <p className="text-white/20 text-sm">Sin causas pendientes.</p>}
        <div className="space-y-3">
          {data?.pendingCauses?.map((cause: any) => (
            <div key={cause._id} className="border border-white/10 rounded-2xl p-5 space-y-3">
              <div>
                <p className="text-white font-medium">{cause.title}</p>
                <p className="text-white/40 text-sm mt-1">{cause.description}</p>
                <p className="text-white/25 text-xs mt-2">{cause.city} · {cause.instagram}</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => action({ action: 'approve_cause', causeId: cause._id })}
                  disabled={loading}
                  className="px-4 py-2 rounded-xl bg-green-400/10 text-green-400 text-sm hover:bg-green-400/20 transition-all"
                >
                  Aprobar
                </button>
                <button
                  onClick={() => action({ action: 'reject_cause', causeId: cause._id })}
                  disabled={loading}
                  className="px-4 py-2 rounded-xl bg-red-400/10 text-red-400 text-sm hover:bg-red-400/20 transition-all"
                >
                  Rechazar
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Current Prizes */}
      <section className="space-y-4">
        <h2 className="text-white/60 font-medium">Premios de la semana ({data?.currentPrizes?.length || 0})</h2>
        {data?.currentPrizes?.length === 0 && <p className="text-white/20 text-sm">No hay premios cargados para esta semana.</p>}
        <div className="space-y-3">
          {data?.currentPrizes?.map((prize: any) => (
            <div key={prize._id} className="border border-white/10 rounded-2xl p-5 flex items-center justify-between">
              <div>
                <p className="text-white font-medium">{prize.title}</p>
                <p className="text-white/40 text-sm mt-1">por {prize.sponsor}</p>
              </div>
              <span className="text-green-400 font-medium">{formatCurrency(prize.value)}</span>
            </div>
          ))}
        </div>
        <p className="text-white/20 text-xs">El valor total de los premios se suma al "Pozo actual" y se refleja en "Premios" arriba.</p>
      </section>


      {/* Add prize */}
      <section className="space-y-4">
        <h2 className="text-white/60 font-medium">Agregar premio</h2>
        <div className="border border-white/10 rounded-2xl p-5 space-y-4">
          <div className="grid md:grid-cols-2 gap-3">
            {[
              { key: 'title', placeholder: 'Título del premio' },
              { key: 'sponsor', placeholder: 'Sponsor / donante' }, // Changed type to number for value input
              { key: 'value', placeholder: 'Valor estimado (ARS)' },
              { key: 'image', placeholder: 'URL de imagen (opcional)' },
            ].map(f => (
              <input
                key={f.key}
                type="text"
                value={(prizeForm as any)[f.key]}
                onChange={e => setPrizeForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                placeholder={f.placeholder}
                className="bg-white/[0.03] border border-white/8 rounded-xl px-4 py-3 text-white/80 text-sm placeholder:text-white/20 focus:outline-none focus:border-white/20"
              />
            ))}
          </div>
          <button
            onClick={() => action({
              action: 'add_prize',
              title: prizeForm.title,
              sponsor: prizeForm.sponsor,
              value: Number(prizeForm.value),
              image: prizeForm.image,
            })}
            disabled={loading || !prizeForm.title || !prizeForm.sponsor || !prizeForm.value}
            className="px-6 py-2 rounded-xl bg-white/5 text-white/70 text-sm hover:bg-white/10 transition-all disabled:opacity-30"
          >
            Agregar premio
          </button>
        </div>
      </section>

      {/* Run draw */}
      <section className="space-y-4">
        <h2 className="text-white/60 font-medium">Sorteo manual</h2>
        <button
          onClick={() => {
            if (!confirm('¿Ejecutar el sorteo ahora?')) return
            action({ action: 'run_draw' })
          }}
          disabled={loading}
          className="px-6 py-3 rounded-xl border border-red-400/20 text-red-400/70 text-sm hover:bg-red-400/5 transition-all disabled:opacity-30"
        >
          Ejecutar sorteo ahora
        </button>
        <p className="text-white/20 text-xs">Solo si no se ejecutó automáticamente. Idempotente.</p>
      </section>

      {/* Recent participations */}
      <section className="space-y-4">
        <h2 className="text-white/60 font-medium">Participaciones recientes ({data?.participations?.length || 0})</h2>
        <div className="space-y-2">
          {data?.participations?.slice(0, 10).map((p: any) => (
            <div key={p._id} className="flex items-center justify-between border border-white/5 rounded-xl px-4 py-3 text-sm">
              <div>
                <span className="text-white/60">{p.name || p.email}</span>
                <span className="text-white/25 ml-3">{p.quantity} números</span>
              </div>
              <span className="text-white/40">{formatCurrency(p.amount)}</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
