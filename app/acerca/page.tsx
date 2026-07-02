'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'

// ─── Data ─────────────────────────────────────────────────────────────────────

const STATS = [
  { value: '50%', label: 'del pozo va a donaciones reales' },
  { value: '100%', label: 'transparente y verificable' },
  { value: 'Random.org', label: 'sorteos auditables públicamente' },
  { value: '0', label: 'cuentas necesarias para participar' },
]

const HOW_ITEMS = [
  {
    num: '01',
    title: 'Comprás un número',
    body: 'Elegís cuántos números querés (1, 5, 10 o 25) y pagás con Mercado Pago. Sin registro, sin contraseña.',
  },
  {
    num: '02',
    title: 'Tu aporte se divide',
    body: '50% va directo a las causas más votadas. 40% al pozo de premios. 10% al mantenimiento de la plataforma.',
  },
  {
    num: '03',
    title: 'Votás causas reales',
    body: 'Cada semana hay causas solidarias propuestas por la comunidad. Un click para apoyar la que más te mueve.',
  },
  {
    num: '04',
    title: 'El martes se sortea',
    body: 'A las 21:00 del martes, un cron automático consulta Random.org y selecciona los ganadores. Transparente y verificable.',
  },
]

const FAQS_PREVIEW = [
  {
    q: '¿Es seguro pagar?',
    a: 'Sí. Los pagos los procesa Mercado Pago, la plataforma de pagos más usada de Latinoamérica. Nunca tocamos tus datos de tarjeta.',
  },
  {
    q: '¿Cómo sé que el sorteo es justo?',
    a: 'Usamos Random.org, un servicio de generación de números aleatorios verificables. Cada sorteo queda documentado públicamente.',
  },
  {
    q: '¿Cómo llega la ayuda a las causas?',
    a: 'La plataforma administra la compra, entrega y documentación. Todo queda registrado con comprobantes en la sección "Donaciones".',
  },
]

const TEAM = [
  { name: 'Plataforma', role: 'Desarrollo & operaciones', emoji: '⚡' },
  { name: 'Comunidad', role: 'Causas propuestas por usuarios', emoji: '❤️' },
  { name: 'Sponsors', role: 'Empresas que donan premios', emoji: '🎁' },
]

// ─── Sub-components ───────────────────────────────────────────────────────────

function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const observed = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !observed.current) {
          observed.current = true
          const start = performance.now()
          const dur = 1800
          const animate = (now: number) => {
            const p = Math.min((now - start) / dur, 1)
            const ease = 1 - Math.pow(1 - p, 4)
            setCount(Math.floor(ease * target))
            if (p < 1) requestAnimationFrame(animate)
          }
          requestAnimationFrame(animate)
        }
      },
      { threshold: 0.5 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [target])

  return <span ref={ref}>{count}{suffix}</span>
}

function NavBar() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', h)
    return () => window.removeEventListener('scroll', h)
  }, [])

  return (
    <motion.nav
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'backdrop-blur-xl bg-black/60 border-b border-white/5' : ''
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <img src="/logo.png" alt="Logo" className="w-8 h-8 object-contain" />
          <span className="font-display text-text group-hover:text-primary transition-colors text-lg">
            Pozo Solidario
          </span>
        </Link>
        <div className="hidden md:flex items-center gap-8 text-sm text-white/40">
          <a href="#como-funciona" className="hover:text-white/80 transition-colors">Cómo funciona</a>
          <a href="#numeros" className="hover:text-white/80 transition-colors">Números</a>
          <a href="#faq" className="hover:text-white/80 transition-colors">FAQ</a>
          <Link href="/contacto" className="hover:text-white/80 transition-colors">Contacto</Link>
        </div>
        <Link
          href="/"
          className="px-5 py-2 rounded-full bg-green-400/10 text-green-400 text-sm font-medium hover:bg-green-400/20 border border-green-400/20 transition-all"
        >
          Participar →
        </Link>
      </div>
    </motion.nav>
  )
}

// ─── Main page ─────────────────────────────────────────────────────────────────

export default function AcercaPage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: containerRef })
  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, -60])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0])

  return (
    <div ref={containerRef} className="min-h-screen overflow-x-hidden">
      <NavBar />

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 text-center overflow-hidden">
        {/* Layered background glows */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] w-[700px] h-[700px] bg-green-500/[0.06] rounded-full blur-[140px]" />
          <div className="absolute top-1/2 left-[30%] -translate-y-1/2 w-[300px] h-[300px] bg-emerald-400/[0.04] rounded-full blur-[80px]" />
          {/* Grid lines */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)',
              backgroundSize: '80px 80px',
            }}
          />
        </div>

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative max-w-4xl space-y-8">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-primary/20 bg-primary/[0.06] text-xs text-primary/80"
          >
            <img src="/logo.png" alt="" className="w-3.5 h-3.5 object-contain" />
            Argentina · Plataforma solidaria semanal
          </motion.div>

          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="space-y-2 text-text"
          >
            <h1 className="font-display text-[clamp(2rem,7vw,3rem)] leading-[0.9] text-white tracking-tight">
              Internet unido
            </h1>
            <h1 className="font-display text-[clamp(2rem,7vw,3rem)] leading-[0.9] tracking-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-light to-primary-dark">
                generando ayuda real.
              </span>
            </h1>
          </motion.div>

          {/* Subhead */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-text-secondary text-xl leading-relaxed max-w-xl mx-auto"
          >
            Un sorteo solidario semanal donde cada peso se divide de forma automática y transparente entre donaciones, premios y plataforma.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 10 }} // Initial state for animation
            animate={{ opacity: 1, y: 0 }} // Animation to final state
            transition={{ delay: 0.55 }} // Delay before animation starts
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <Link // Primary button
              href="/" // Link destination
              className="btn-primary" // Apply primary button styles
            >
              Participar ahora
            </Link>
            <a
              href="#como-funciona"
              className="btn-secondary"
            >
              Ver cómo funciona
            </a>
          </motion.div>
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.8 }}
            className="w-px h-10 bg-gradient-to-b from-text/20 to-transparent"
          />
        </motion.div>
      </section>

      {/* ── STATS ─────────────────────────────────────────────────────────── */}
      <section id="numeros" className="py-24 px-6 border-y border-white/5">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="text-center space-y-2"
            >
              <div className="font-display text-4xl md:text-5xl text-text text-glow">
                {stat.value}
              </div>
              <p className="text-text-secondary text-xs leading-relaxed">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CONCEPTO ──────────────────────────────────────────────────────── */}
      <section className="py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="text-xs text-green-400/60 uppercase tracking-widest font-medium">El concepto</div>
              <h2 className="font-display text-4xl md:text-5xl text-white leading-tight">
                Un solo pozo.<br />Todos adentro.
              </h2>
              <div className="space-y-4 text-white/45 text-sm leading-relaxed">
                <p>
                  No hay distintos planes, ni niveles, ni VIP. Hay un único pozo semanal y todos comparten el mismo sorteo. El participante con 1 número tiene las mismas chances proporcionalmente que el que compró 25.
                </p>
                <p>
                  Cada aporte se divide de forma automática e inmutable: <span className="text-white/70">50% a donaciones, 40% a premios, 10% a plataforma</span>. No hay forma de cambiar esa proporción.
                </p>
                <p>
                  Las causas que reciben ayuda son elegidas por la comunidad mediante votación abierta y verificable.
                </p>
              </div>
            </motion.div>

            {/* Visual breakdown */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-3"
            >
              {[
                { pct: 50, label: 'Donaciones', color: 'bg-red-400/70', icon: '❤️', desc: 'Causas solidarias seleccionadas por la comunidad' },
                { pct: 40, label: 'Premios', color: 'bg-yellow-400/70', icon: '🎁', desc: 'Sorteados entre todos los participantes' },
                { pct: 10, label: 'Plataforma', color: 'bg-blue-400/60', icon: '⚡', desc: 'Mantenimiento, infraestructura y operaciones' },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="border-gradient rounded-2xl p-5"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{item.icon}</span>
                      <div>
                        <p className="text-white/80 text-sm font-medium">{item.label}</p>
                        <p className="text-white/30 text-xs">{item.desc}</p>
                      </div>
                    </div>
                    <span className="font-display text-2xl text-white">{item.pct}%</span>
                  </div>
                  {/* Progress bar */}
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${item.pct}%` }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + i * 0.1, duration: 0.8, ease: 'easeOut' }}
                      className={`h-full ${item.color} rounded-full`}
                    />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── CÓMO FUNCIONA ─────────────────────────────────────────────────── */}
      <section id="como-funciona" className="py-32 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <div className="text-xs text-white/25 uppercase tracking-widest font-medium">El proceso</div>
            <h2 className="font-display text-4xl md:text-5xl text-white">Cómo funciona</h2>
            <p className="text-white/35 max-w-md mx-auto text-sm leading-relaxed">
              Diseñado para entenderse en segundos y completarse en menos de 2 minutos.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {HOW_ITEMS.map((item, i) => (
              <motion.div
                key={item.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="border-gradient rounded-2xl p-7 space-y-4 hover:bg-white/[0.02] transition-all group"
              >
                <div className="flex items-start justify-between">
                  <span className="font-mono text-xs text-white/15">{item.num}</span>
                  <div className="w-8 h-8 rounded-full border border-white/8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/40">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
                <h3 className="font-display text-xl text-white">{item.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{item.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRANSPARENCIA ─────────────────────────────────────────────────── */}
      <section className="py-32 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="text-xs text-green-400/60 uppercase tracking-widest font-medium">Sin letra chica</div>
              <h2 className="font-display text-4xl md:text-5xl text-white leading-tight">
                Transparencia<br />total.
              </h2>
              <div className="space-y-4 text-white/45 text-sm leading-relaxed">
                <p>El sorteo es 100% automático. Un cron job de Vercel consulta Random.org cada martes a las 21:00 y selecciona al ganador. El proceso queda registrado y es públicamente verificable.</p>
                <p>Todas las donaciones se documentan con comprobantes, imágenes y texto en la sección pública "Donaciones realizadas".</p>
                <p>El estado del pozo se actualiza en tiempo real. Cualquier persona puede ver cuánto hay, cómo se divide y cuándo se sortea.</p>
              </div>
              <div className="flex gap-4 pt-2">
                <Link href="/" className="text-green-400/70 text-sm hover:text-green-400 transition-colors flex items-center gap-1">
                  Ver donaciones →
                </Link>
              </div>
            </motion.div>

            {/* Proof panel */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="border border-white/8 rounded-3xl p-6 bg-white/[0.02] space-y-4 font-mono text-xs"
            >
              <div className="flex items-center gap-2 pb-3 border-b border-white/5">
                <div className="flex gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-red-500/40" />
                  <span className="w-3 h-3 rounded-full bg-yellow-500/40" />
                  <span className="w-3 h-3 rounded-full bg-green-500/40" />
                </div>
                <span className="text-white/20 ml-2">sorteo.log</span>
              </div>
              {[
                { time: '21:00:00', text: 'Iniciando sorteo semana 2025-W22', color: 'text-white/30' },
                { time: '21:00:01', text: 'Consultando random.org/integers...', color: 'text-blue-400/60' },
                { time: '21:00:01', text: 'Respuesta: 48392 (de 10001 a 58741)', color: 'text-green-400/70' },
                { time: '21:00:02', text: 'Ganador: número #48392', color: 'text-green-400' },
                { time: '21:00:02', text: 'Premio: Smart TV 55" (Sponsor: TechStore)', color: 'text-white/50' },
                { time: '21:00:03', text: 'Notificando por email...', color: 'text-white/30' },
                { time: '21:00:03', text: '✓ Semana archivada. Pozo reiniciado.', color: 'text-green-400/80' },
              ].map((line, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.08 }}
                  className="flex gap-4"
                >
                  <span className="text-white/15 shrink-0">{line.time}</span>
                  <span className={line.color}>{line.text}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── PARA SPONSORS ─────────────────────────────────────────────────── */}
      <section className="py-32 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <div className="text-xs text-yellow-400/60 uppercase tracking-widest font-medium">Para empresas</div>
            <h2 className="font-display text-4xl md:text-5xl text-white">¿Tenés algo para donar como premio?</h2>
            <p className="text-white/35 max-w-lg mx-auto text-sm leading-relaxed">
              Las empresas y marcas pueden donar productos o servicios como premios semanales. Tu marca aparece en la plataforma frente a miles de personas con intención real de participar.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {[
              { icon: '👁️', title: 'Visibilidad orgánica', body: 'Tu marca aparece en la sección de premios y en las notificaciones del sorteo, sin publicidad invasiva.' },
              { icon: '❤️', title: 'Imagen solidaria', body: 'Asociarte con una plataforma que dona el 50% del pozo a causas reales genera una percepción de marca genuina.' },
              { icon: '📊', title: 'Audiencia comprometida', body: 'Las personas que participan están emocionalmente conectadas con el proceso. Son el público más receptivo.' },
            ].map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="border-gradient rounded-2xl p-6 space-y-3"
              >
                <span className="text-3xl">{card.icon}</span>
                <h3 className="text-white font-medium">{card.title}</h3>
                <p className="text-white/35 text-sm leading-relaxed">{card.body}</p>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/contacto"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl border border-white/10 text-white/60 hover:text-white hover:border-white/20 transition-all text-sm"
            >
              Contactar para ser sponsor →
            </Link>
          </div>
        </div>
      </section>

      {/* ── FAQ PREVIEW ───────────────────────────────────────────────────── */}
      <section id="faq" className="py-32 px-6 border-t border-white/5">
        <div className="max-w-3xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <h2 className="font-display text-4xl md:text-5xl text-white">Preguntas frecuentes</h2>
          </div>

          <div className="space-y-4">
            {FAQS_PREVIEW.map((faq, i) => (
              <motion.div
                key={faq.q}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="border-gradient rounded-2xl p-6 space-y-3"
              >
                <h3 className="text-white/80 font-medium">{faq.q}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{faq.a}</p>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/faq"
              className="text-white/30 hover:text-white/60 text-sm transition-colors"
            >
              Ver todas las preguntas frecuentes →
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ─────────────────────────────────────────────────────── */}
      <section className="py-32 px-6 border-t border-white/5">
        <div className="max-w-3xl mx-auto text-center space-y-8 relative">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-green-500/[0.04] rounded-3xl blur-2xl" />
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative space-y-6"
          >
            <h2 className="font-display text-4xl md:text-6xl text-white leading-tight">
              Esto puede crecer a<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-emerald-500">
                millones de usuarios.
              </span>
            </h2>
            <p className="text-white/35 max-w-md mx-auto leading-relaxed">
              Cada semana hay un nuevo pozo, nuevas causas, nuevos ganadores. El modelo escala infinitamente con la comunidad.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href="/"
                className="px-8 py-4 rounded-2xl bg-green-400 text-black font-semibold text-base hover:bg-green-300 active:scale-[0.98] transition-all"
              >
                Participar ahora
              </Link>
              <Link
                href="/contacto"
                className="px-8 py-4 rounded-2xl border border-white/10 text-white/50 hover:text-white hover:border-white/20 text-base transition-all"
              >
                Escribirnos
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────────────── */}
      <footer className="border-t border-white/5 py-16 px-6">
        <div className="max-w-5xl mx-auto text-text-secondary">
          <div className="flex flex-col md:flex-row items-start justify-between gap-10">
            <div className="space-y-4">
              <img src="/logo.png" alt="Logo" className="w-10 h-10 object-contain opacity-50" />
              <p className="font-display text-2xl text-text">Pozo Solidario</p>
              <p className="text-text-secondary text-xs max-w-xs leading-relaxed">
                Sorteo solidario semanal. Transparente, verificable, comunitario.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-16 gap-y-4 text-xs text-white/25">
              <div className="space-y-3">
                <p className="text-white/15 uppercase tracking-widest text-[10px]">Plataforma</p>
                <Link href="/" className="block hover:text-white/60 transition-colors">Inicio</Link>
                <Link href="/acerca" className="block hover:text-white/60 transition-colors">Acerca</Link>
                <Link href="/faq" className="block hover:text-white/60 transition-colors">FAQ</Link>
              </div>
              <div className="space-y-3">
                <p className="text-white/15 uppercase tracking-widest text-[10px]">Legal</p>
                <Link href="/terminos" className="block hover:text-white/60 transition-colors">Términos</Link>
                <Link href="/privacidad" className="block hover:text-white/60 transition-colors">Privacidad</Link>
                <Link href="/cookies" className="block hover:text-white/60 transition-colors">Cookies</Link>
              </div>
              <div className="space-y-3">
                <p className="text-white/15 uppercase tracking-widest text-[10px]">Contacto</p>
                <Link href="/contacto" className="block hover:text-white/60 transition-colors">Escribirnos</Link>
                <a href="https://instagram.com/pozosolidario" target="_blank" className="block hover:text-white/60 transition-colors">Instagram</a>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-3 text-[11px] text-white/15">
            <p>© {new Date().getFullYear()} Pozo Solidario. Todos los derechos reservados.</p>
            <p>Sorteos verificados con Random.org · Argentina</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
