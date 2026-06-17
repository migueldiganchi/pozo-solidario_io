import { LegalLayout, Section, P, UL, Highlight } from '@/components/LegalLayout'

export const metadata = {
  title: 'Política de Cookies — Pozo Solidario',
  description: 'Política de uso de cookies y almacenamiento local de Pozo Solidario.',
}

export default function CookiesPage() {
  return (
    <LegalLayout
      title="Política de Cookies"
      subtitle="Explicamos qué guardamos en tu navegador y para qué."
      badge="Cookies"
      lastUpdated="Enero 2025"
    >

      <Section title="1. ¿Qué son las cookies?">
        <P>Las cookies son pequeños archivos de texto que los sitios web almacenan en tu dispositivo cuando los visitás. Sirven para recordar información entre visitas y mejorar la experiencia de uso.</P>
        <P>Además de cookies tradicionales, también usamos <strong className="text-white/60">localStorage</strong>, un mecanismo similar pero más moderno disponible en todos los navegadores actuales.</P>
      </Section>

      <Section title="2. Lo que usamos en Pozo Solidario">
        <Highlight>
          Pozo Solidario no usa cookies de seguimiento, publicidad ni analítica de terceros. Solo usamos lo estrictamente necesario para que la plataforma funcione.
        </Highlight>

        <P><strong className="text-white/60">localStorage (almacenamiento local del navegador)</strong></P>
        <P>Usamos exclusivamente localStorage, no cookies HTTP tradicionales. Esto significa que los datos no se envían automáticamente al servidor en cada request.</P>

        <div className="overflow-x-auto">
          <table className="w-full text-xs mt-4">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 pr-6 text-white/30 font-medium">Clave</th>
                <th className="text-left py-3 pr-6 text-white/30 font-medium">Contenido</th>
                <th className="text-left py-3 pr-6 text-white/30 font-medium">Propósito</th>
                <th className="text-left py-3 text-white/30 font-medium">Duración</th>
              </tr>
            </thead>
            <tbody className="text-white/40">
              {[
                {
                  key: 'ps_user_id',
                  content: 'ID aleatorio (ej: AX82K9JM)',
                  purpose: 'Identificar tu sesión anónima para mostrar tus números, votos y referidos',
                  duration: 'Permanente hasta que limpies el storage',
                },
                {
                  key: 'ps_ref',
                  content: 'Código de referido (ej: BK2J4)',
                  purpose: 'Trackear de qué link de referido llegaste, para acreditar la conversión al referente',
                  duration: 'Hasta tu primera compra o 30 días',
                },
                {
                  key: 'ps_voted',
                  content: 'Array de IDs de causas votadas',
                  purpose: 'Recordar qué causas ya apoyaste para no mostrarte el botón de votar nuevamente',
                  duration: 'Permanente hasta limpiar storage',
                },
                {
                  key: 'ps_cookie_ok',
                  content: 'true / false',
                  purpose: 'Recordar que aceptaste este aviso de cookies',
                  duration: '365 días',
                },
              ].map(row => (
                <tr key={row.key} className="border-b border-white/5 last:border-0">
                  <td className="py-3 pr-6 font-mono text-white/50">{row.key}</td>
                  <td className="py-3 pr-6">{row.content}</td>
                  <td className="py-3 pr-6">{row.purpose}</td>
                  <td className="py-3 text-white/25">{row.duration}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="3. Cookies de terceros">
        <P><strong className="text-white/60">Mercado Pago</strong></P>
        <P>Cuando hacés click en "Pagar con Mercado Pago", te redirigimos a la plataforma de Mercado Pago, que tiene sus propias cookies y política de privacidad. No controlamos ese proceso.</P>

        <P><strong className="text-white/60">Google Fonts</strong></P>
        <P>Cargamos tipografías de Google Fonts. Google puede registrar la solicitud de fuentes. No cargamos scripts de Google Analytics, Google Ads ni ningún pixel de seguimiento de Google.</P>

        <P><strong className="text-white/60">Lo que NO usamos</strong></P>
        <UL items={[
          'Google Analytics ni ninguna herramienta de analítica de terceros.',
          'Facebook Pixel ni herramientas de Meta.',
          'Cookies publicitarias.',
          'Scripts de redes sociales embebidos.',
          'Herramientas de heatmaps (Hotjar, etc.).',
          'CDNs de terceros para scripts (todos los scripts son propios o de npm).',
        ]} />
      </Section>

      <Section title="4. Cómo controlar o eliminar las cookies">
        <P>Podés gestionar el almacenamiento local de tu navegador desde las herramientas de desarrollo:</P>
        <UL items={[
          'Chrome: F12 → Application → Local Storage → pozosolidario.com',
          'Firefox: F12 → Storage → Local Storage → pozosolidario.com',
          'Safari: Desarrollador → Almacenamiento web',
          'O simplemente: Configuración del navegador → Borrar datos de navegación → Datos de sitios web',
        ]} />
        <P>Si eliminás el localStorage, tu identificador anónimo desaparece. Podés seguir usando la plataforma normalmente, pero perderás el historial de votos y el acceso visual a tus números previos. Los datos de participación (para el sorteo) siguen en nuestra base de datos vinculados a tu email de Mercado Pago.</P>
      </Section>

      <Section title="5. Banner de cookies">
        <P>La primera vez que visitás la plataforma, mostramos un aviso de cookies. Al cerrarlo o continuar navegando, registramos tu aceptación en localStorage (clave <code className="text-white/50 bg-white/5 px-1.5 py-0.5 rounded text-xs">ps_cookie_ok</code>). Podés revocar esa aceptación eliminando ese item del localStorage.</P>
      </Section>

      <Section title="6. Actualizaciones">
        <P>Si modificamos el uso de cookies de manera significativa, actualizamos esta página y podemos mostrar un nuevo aviso en la plataforma. La fecha de última actualización está siempre visible al inicio de esta página.</P>
      </Section>

      <Section title="7. Contacto">
        <P>¿Tenés dudas sobre nuestro uso de cookies? Escribinos a hola@pozosolidario.com.</P>
      </Section>

    </LegalLayout>
  )
}
