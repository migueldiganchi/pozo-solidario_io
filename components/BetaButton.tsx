'use client'

import { useState } from 'react'
import { FlaskConical, X, MessageCircle } from 'lucide-react'
import Image from 'next/image'

const WHATSAPP_NUMBER = '5491135077622'
const WHATSAPP_MESSAGE = 'Me interesa saber del pozo solidario'
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`

export function BetaButton() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 left-6 z-40 flex items-center gap-2 rounded-full bg-surface border border-border px-4 py-3 text-text shadow-lg transition-transform hover:scale-105 active:scale-95"
        aria-label="Sobre la version Beta"
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary" />
        </span>
        <FlaskConical size={18} className="text-primary" />
        <span className="text-sm font-medium hidden sm:inline">Beta</span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative w-full max-w-md rounded-2xl bg-surface border border-border p-6 sm:p-8 animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 text-text-secondary hover:text-text transition-colors"
              aria-label="Cerrar"
            >
              <X size={20} />
            </button>

            <div className="flex flex-col items-center text-center gap-4">
              <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-background border border-border flex items-center justify-center">
                <Image src="/logo.png" alt="Pozo Solidario" fill className="object-contain p-2" />
              </div>

              <span className="badge-base border-primary/30 bg-primary/10 text-primary">
                <FlaskConical size={14} />
                Version Beta
              </span>

              <h3 className="font-display text-xl font-semibold text-text">
                Estamos en lanzamiento
              </h3>

              <p className="text-sm text-text-secondary leading-relaxed">
                Pozo Solidario esta en su etapa Beta: estamos ajustando cada
                detalle para que la experiencia sea 100% transparente y
                fluida. Si queres enterarte de novedades, sorteos y mejoras
                apenas salgan, sumate por WhatsApp.
              </p>

              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary w-full flex items-center justify-center gap-2 mt-2"
              >
                <MessageCircle size={18} />
                Quiero mantenerme informado
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  )
}