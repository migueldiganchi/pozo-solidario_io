import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-white/5 py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1 space-y-4">
            <img src="/logo.png" alt="Logo" className="w-10 h-10 object-contain opacity-70 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500" />
            <p className="font-display text-xl text-text">Pozo Solidario</p>
            <p className="text-text-secondary text-xs leading-relaxed">
              Internet unido generando ayuda real.
            </p>
          </div>

          {/* Plataforma */}
          <div className="space-y-3 text-xs">
            <p className="text-white/15 uppercase tracking-widest text-[10px] font-medium">Plataforma</p>
            <div className="space-y-2">
              <Link href="/" className="block text-white/30 hover:text-white/60 transition-colors">Participar</Link>
              <Link href="/#causas" className="block text-white/30 hover:text-white/60 transition-colors">Causas</Link>
              <Link href="/#premios" className="block text-white/30 hover:text-white/60 transition-colors">Premios</Link>
              <Link href="/#ganadores" className="block text-white/30 hover:text-white/60 transition-colors">Ganadores</Link>
              <Link href="/acerca" className="block text-white/30 hover:text-white/60 transition-colors">Acerca del proyecto</Link>
            </div>
          </div>

          {/* Ayuda */}
          <div className="space-y-3 text-xs">
            <p className="text-white/15 uppercase tracking-widest text-[10px] font-medium">Ayuda</p>
            <div className="space-y-2">
              <Link href="/faq" className="block text-white/30 hover:text-white/60 transition-colors">Preguntas frecuentes</Link>
              <Link href="/contacto" className="block text-white/30 hover:text-white/60 transition-colors">Contacto</Link>
              <a href="mailto:hola@pozosolidario.com" className="block text-white/30 hover:text-white/60 transition-colors">hola@pozosolidario.com</a>
            </div>
          </div>

          {/* Legal */}
          <div className="space-y-3 text-xs">
            <p className="text-white/15 uppercase tracking-widest text-[10px] font-medium">Legal</p>
            <div className="space-y-2">
              <Link href="/terminos" className="block text-white/30 hover:text-white/60 transition-colors">Términos y condiciones</Link>
              <Link href="/privacidad" className="block text-white/30 hover:text-white/60 transition-colors">Política de privacidad</Link>
              <Link href="/cookies" className="block text-white/30 hover:text-white/60 transition-colors">Política de cookies</Link>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-3 text-[11px] text-white/15">
          <p>© {new Date().getFullYear()} Pozo Solidario · Argentina</p>
          <div className="flex items-center gap-4">
            <p>Sorteos verificados con Random.org</p>
            <span>·</span>
            <p>50% donaciones · 40% premios · 10% plataforma</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
