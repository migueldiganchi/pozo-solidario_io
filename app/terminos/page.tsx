import { LegalLayout, Section, P, UL, Highlight } from '@/components/LegalLayout'

export const metadata = {
  title: 'Términos y Condiciones — Pozo Solidario',
  description: 'Términos y condiciones de uso de la plataforma Pozo Solidario.',
}

export default function TerminosPage() {
  return (
    <LegalLayout
      title="Términos y Condiciones"
      subtitle="Por favor leé estos términos antes de participar. Al usar la plataforma, aceptás estos términos."
      badge="Legal"
      lastUpdated="Enero 2025"
    >

      <Section title="1. Descripción del servicio">
        <P>Pozo Solidario es una plataforma digital que organiza sorteos solidarios semanales. Los participantes adquieren números mediante pago a través de Mercado Pago. Una parte del monto recaudado se destina a donaciones a causas solidarias seleccionadas por votación comunitaria, otra parte a premios sorteados entre los participantes, y el resto al mantenimiento de la plataforma.</P>
        <Highlight>La plataforma no es un juego de azar con fines de lucro exclusivo. Su propósito principal es la generación de fondos para causas solidarias.</Highlight>
      </Section>

      <Section title="2. Participación">
        <P>Para participar, el usuario debe:</P>
        <UL items={[
          'Tener mayoría de edad según la legislación aplicable en su lugar de residencia.',
          'Realizar el pago correspondiente a través de Mercado Pago.',
          'Aceptar estos Términos y Condiciones.',
          'No requerir registro previo ni creación de cuenta.',
        ]} />
        <P>La asignación de números es automática y secuencial. Los números no son elegibles por el usuario. Cada número tiene la misma probabilidad de ganar.</P>
      </Section>

      <Section title="3. Precio y pagos">
        <P>El precio por número se muestra claramente antes de confirmar la compra. Los precios pueden modificarse entre semanas, pero nunca durante una semana en curso.</P>
        <P>Los pagos son procesados exclusivamente por Mercado Pago S.A. Pozo Solidario no almacena datos de tarjetas de crédito ni débito. Al pagar, el usuario acepta también los términos y condiciones de Mercado Pago.</P>
        <P>Los pagos son finales e irrevocables una vez confirmados, dado que los fondos se incorporan de inmediato al pozo semanal. Solo se considerarán reembolsos ante comprobados errores técnicos atribuibles a la plataforma.</P>
      </Section>

      <Section title="4. Distribución del pozo">
        <P>El monto total recaudado cada semana se distribuye de la siguiente manera:</P>
        <UL items={[
          '50% destinado a donaciones a las 3 causas más votadas de la semana.',
          '40% destinado a premios para los ganadores del sorteo.',
          '10% destinado al mantenimiento y operación de la plataforma.',
        ]} />
        <P>Esta distribución es fija e inmutable. No puede ser modificada retroactivamente por ningún evento ni por decisión unilateral del operador.</P>
      </Section>

      <Section title="5. El sorteo">
        <P>El sorteo se realiza automáticamente todos los martes a las 21:00 horas (GMT-3, Argentina). El proceso es:</P>
        <UL items={[
          'Un sistema automatizado (cron job de Vercel) inicia el proceso.',
          'Se consulta Random.org para obtener un número verdaderamente aleatorio.',
          'Se identifica al titular del número ganador en la base de datos.',
          'El resultado se publica automáticamente en la plataforma.',
          'Se notifica al ganador por email.',
        ]} />
        <P>El sorteo es verificable públicamente. Los resultados se publican con el número ganador y la referencia a Random.org. Pozo Solidario se reserva el derecho de realizar un nuevo sorteo si se detecta una falla técnica verificable.</P>
      </Section>

      <Section title="6. Premios">
        <P>Los premios son donados por empresas o personas (sponsors) que colaboran voluntariamente con la plataforma. Los premios se describen tal como los proporciona el sponsor. El valor estimado es referencial.</P>
        <P>El ganador tiene 30 días corridos desde la notificación para reclamar el premio. Pasado ese plazo sin respuesta, el premio puede ser reasignado o devuelto al sponsor.</P>
        <P>Pozo Solidario no es responsable por defectos o problemas con los productos donados por sponsors. En caso de inconvenientes, actuamos como intermediarios de buena fe.</P>
      </Section>

      <Section title="7. Donaciones">
        <P>Las donaciones no se transfieren en efectivo a las causas. La plataforma gestiona la compra de productos o servicios necesarios, su entrega y la documentación del proceso. Toda entrega queda registrada con comprobantes en la sección pública "Donaciones realizadas".</P>
        <P>El operador puede rechazar una causa propuesta si considera que no cumple con los requisitos de legitimidad, verificabilidad o finalidad solidaria.</P>
      </Section>

      <Section title="8. Votación de causas">
        <P>Cada usuario puede votar una vez por causa por semana. El sistema utiliza identificadores anónimos almacenados localmente para prevenir votos múltiples. Esta protección es técnica y no absoluta; el operador puede anular votos que considere fraudulentos.</P>
      </Section>

      <Section title="9. Sistema de referidos">
        <P>El sistema de referidos es un programa voluntario de recompensas. Por cada 10 participaciones generadas desde el link de referido de un usuario, ese usuario recibe 1 número gratis en el próximo sorteo. Los números gratuitos no tienen valor monetario ni son canjeables por dinero.</P>
      </Section>

      <Section title="10. Conducta prohibida">
        <P>Queda prohibido:</P>
        <UL items={[
          'Intentar manipular el sorteo o el sistema de votación mediante medios técnicos o fraudulentos.',
          'Usar la plataforma para actividades ilegales.',
          'Crear múltiples identidades para multiplicar votos o referidos.',
          'Proponer causas ficticias o con fines de lucro personal.',
          'Usar bots o sistemas automatizados no autorizados.',
        ]} />
      </Section>

      <Section title="11. Limitación de responsabilidad">
        <P>Pozo Solidario no garantiza disponibilidad ininterrumpida del servicio. Nos comprometemos a mantener el servicio activo y a comunicar interrupciones programadas con anticipación.</P>
        <P>No somos responsables por pérdidas indirectas, daños consecuentes ni lucro cesante relacionados con el uso de la plataforma.</P>
      </Section>

      <Section title="12. Modificaciones">
        <P>Pozo Solidario puede modificar estos Términos en cualquier momento. Los cambios se comunicarán con al menos 7 días de anticipación mediante aviso en la plataforma. El uso continuado después de esa fecha implica aceptación de los nuevos términos.</P>
      </Section>

      <Section title="13. Ley aplicable">
        <P>Estos términos se rigen por las leyes de la República Argentina. Ante cualquier disputa, las partes se someten a la jurisdicción de los tribunales ordinarios de la Ciudad Autónoma de Buenos Aires.</P>
      </Section>

      <Section title="14. Contacto">
        <P>Para consultas sobre estos términos, podés escribirnos en la sección de Contacto o al email hola@pozosolidario.com.</P>
      </Section>

      {/* Final Brand Reference */}
      <div className="pt-24 pb-8 flex flex-col items-center gap-4 opacity-20">
        <img src="/logo.png" alt="Pozo Solidario" className="w-12 h-12 object-contain grayscale" />
        <p className="font-display italic text-sm text-text">Pozo Solidario</p>
      </div>
    </LegalLayout>
  )
}
