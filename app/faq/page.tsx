'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LegalLayout } from '@/components/LegalLayout'
import Link from 'next/link'

const FAQS = [
  {
    category: 'Participación',
    items: [
      {
        q: '¿Cómo participo?',
        a: 'Entrás al sitio, tocás PARTICIPAR, elegís cuántos números querés (1, 5, 10 o 25), pagás con Mercado Pago y el sistema te asigna tus números automáticamente. Sin registro, sin contraseña, sin fricción.',
      },
      {
        q: '¿Necesito crear una cuenta?',
        a: 'No. Nunca. El sistema crea automáticamente un identificador anónimo que se guarda en tu dispositivo. Con ese ID podés ver tus números, tus votos y tu historial. Es invisible para vos.',
      },
      {
        q: '¿Puedo participar desde el celular?',
        a: 'Sí, la plataforma está diseñada primero para móvil. Todo el flujo —pago, números, votos— funciona perfectamente en cualquier smartphone.',
      },
      {
        q: '¿Cuánto cuesta cada número?',
        a: `Cada número tiene un precio fijo que podés ver en la pantalla de participación. No hay costos ocultos ni cargos adicionales.`,
      },
      {
        q: '¿Puedo comprar más de un número?',
        a: 'Sí. Podés comprar 1, 5, 10 o 25 números por semana. Cada número aumenta tus posibilidades de ganar proporcionalmente.',
      },
      {
        q: '¿Cómo sé qué números me tocaron?',
        a: 'Después de pagar, te redirigimos a una página de confirmación donde aparecen tus números. También podés verlos en cualquier momento tocando el asistente y preguntando "mis números".',
      },
    ],
  },
  {
    category: 'El sorteo',
    items: [
      {
        q: '¿Cuándo se hace el sorteo?',
        a: 'Todos los martes a las 21:00 hora de Argentina. Es automático, no requiere intervención manual.',
      },
      {
        q: '¿Cómo sé que el sorteo es justo?',
        a: 'Usamos Random.org, un servicio reconocido mundialmente para generación de números verdaderamente aleatorios basados en ruido atmosférico. Cada sorteo queda documentado. Los resultados son públicamente verificables.',
      },
      {
        q: '¿Qué pasa si estoy en otro huso horario?',
        a: 'El sorteo siempre ocurre a las 21:00 hora de Argentina (UTC-3). Todos los números participan independientemente de dónde estés.',
      },
      {
        q: '¿Qué pasa si nadie participó esa semana?',
        a: 'Si no hay participaciones o no hay premios cargados, el sorteo no se ejecuta y el sistema lo registra. El pozo no se pierde.',
      },
      {
        q: '¿Cómo me avisan si gané?',
        a: 'El sistema notifica al ganador por email al correo que registró Mercado Pago durante el pago. También aparecerá en la sección pública de Ganadores (con nombre parcial para proteger la privacidad).',
      },
    ],
  },
  {
    category: 'Donaciones',
    items: [
      {
        q: '¿Cómo se elige qué causas reciben la donación?',
        a: 'Las causas se votan durante toda la semana. Las 3 más votadas reciben la ayuda. Cualquier persona puede votar con un click, sin registro.',
      },
      {
        q: '¿Cómo se entrega el dinero a las causas?',
        a: 'La plataforma administra el proceso: compra los productos o servicios necesarios para la causa, los entrega y documenta todo con imágenes y comprobantes que quedan visibles en la sección "Donaciones realizadas".',
      },
      {
        q: '¿Puedo proponer una causa?',
        a: 'Sí. En la sección de causas hay un botón "Proponer causa". Completás un formulario con el nombre, descripción, ciudad y redes sociales. El equipo lo revisa y lo aprueba en 24-48 horas.',
      },
      {
        q: '¿Las causas reciben dinero en efectivo?',
        a: 'No directamente. La plataforma compra lo que la causa necesita (alimentos, materiales, medicamentos, etc.) y lo entrega. Esto garantiza transparencia y destino correcto de los fondos.',
      },
    ],
  },
  {
    category: 'Premios',
    items: [
      {
        q: '¿Quién dona los premios?',
        a: 'Los premios los donan empresas y personas que se suman como sponsors semanales. Si querés donar un premio, escribinos desde la sección de Contacto.',
      },
      {
        q: '¿Cómo recibo el premio si gané?',
        a: 'El equipo se contacta por email para coordinar la entrega. Los premios físicos se envían a domicilio. Los digitales (giftcards, suscripciones) se envían directamente.',
      },
      {
        q: '¿Qué pasa si no reclamo el premio?',
        a: 'El premio se reserva por 30 días. Si no hay respuesta, el equipo intenta otro canal de contacto. Si tampoco hay respuesta, el premio puede ser reasignado.',
      },
    ],
  },
  {
    category: 'Pagos y seguridad',
    items: [
      {
        q: '¿Es seguro pagar?',
        a: 'Sí. Los pagos los procesa exclusivamente Mercado Pago. Nunca vemos ni almacenamos tus datos de tarjeta. La seguridad de los pagos es responsabilidad 100% de Mercado Pago.',
      },
      {
        q: '¿Puedo pedir un reembolso?',
        a: 'Los pagos son finales una vez procesados, ya que los fondos se incorporan inmediatamente al pozo semanal. En caso de error técnico documentado, evaluamos caso por caso. Escribinos.',
      },
      {
        q: '¿Mis datos personales están seguros?',
        a: 'No almacenamos datos sensibles. El email y nombre los obtenemos de Mercado Pago solo para asignarte números y notificarte si ganás. Ver nuestra Política de Privacidad para más detalle.',
      },
    ],
  },
  {
    category: 'Sistema viral',
    items: [
      {
        q: '¿Cómo funciona el sistema de referidos?',
        a: 'Cada usuario tiene un link único de referido. Cuando alguien participa desde tu link, se cuenta como una conversión. Por cada 10 conversiones, ganás 1 número gratis para el próximo sorteo.',
      },
      {
        q: '¿Cómo consigo mi link de referido?',
        a: 'Está en la sección "Compartí y ganá" de la página principal. Se genera automáticamente para cada usuario.',
      },
      {
        q: '¿Cuándo se acreditan los números gratis?',
        a: 'Los números gratis se calculan automáticamente. Podés verlos en la sección de referidos. Se pueden usar en el siguiente sorteo.',
      },
    ],
  },
]

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-white/5 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left py-5 flex items-start justify-between gap-6 group"
      > {/* FAQ Question */}
        <span className={`text-sm leading-relaxed transition-colors ${open ? 'text-text' : 'text-text-secondary group-hover:text-text'}`}>
          {q}
        </span>
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.2 }}
          className="shrink-0 mt-0.5 text-text-secondary/50 group-hover:text-text transition-colors text-lg leading-none"
        >
          +
        </motion.span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-text-secondary text-sm leading-relaxed">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const filtered = activeCategory
    ? FAQS.filter(g => g.category === activeCategory)
    : FAQS

  return (
    <LegalLayout
      title="Preguntas frecuentes"
      subtitle="Todo lo que necesitás saber antes de participar."
      badge="FAQ"
    >
      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-12">
        <button
          onClick={() => setActiveCategory(null)}
          className={`px-4 py-1.5 rounded-full text-xs border transition-all ${
            !activeCategory // Active state for "Todas" button
              ? 'border-text/20 text-text bg-surface-hover'
              : 'border-border text-text-secondary hover:border-text/15 hover:text-text'
          }`}
        >
          Todas
        </button>
        {FAQS.map(g => (
          <button
            key={g.category}
            onClick={() => setActiveCategory(activeCategory === g.category ? null : g.category)}
            className={`px-4 py-1.5 rounded-full text-xs border transition-all ${ // Category filter buttons
              activeCategory === g.category // Active state for category buttons
                ? 'border-primary/30 text-primary/80 bg-primary/[0.06]'
                : 'border-border text-text-secondary hover:border-text/15 hover:text-text'
            }`}
          >
            {g.category}
          </button>
        ))}
      </div>

      {/* FAQ groups */}
      <div className="space-y-12">
        {filtered.map((group, i) => (
          <motion.div
            key={group.category}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="space-y-1"
          > {/* FAQ Group */}
            <h2 className="font-display text-2xl text-text mb-5">{group.category}</h2>
            <div className="card-base px-6 divide-y divide-border"> {/* Apply card base styles */}
              {group.items.map(item => (
                <FAQItem key={item.q} {...item} />
              ))}
            </div>
          </motion.div>
        ))}
      </div> {/* End FAQ groups */}

      {/* CTA */}
      <div className="mt-16 card-base p-8 text-center space-y-4"> {/* CTA Card */}
        <p className="text-text-secondary text-sm">¿No encontraste lo que buscabas?</p>
        <Link
          href="/contacto"
          className="btn-secondary inline-block px-6 py-3 text-sm" // Apply secondary button styles
        >
          Escribirnos directamente →
        </Link>
      </div>

      {/* Final Brand Reference */}
      <div className="pt-24 pb-8 flex flex-col items-center gap-4 opacity-20">
        <img src="/logo.png" alt="Pozo Solidario" className="w-12 h-12 object-contain grayscale" />
        <p className="font-display text-sm text-text">Pozo Solidario</p>
      </div>
    </LegalLayout>
  )
}
