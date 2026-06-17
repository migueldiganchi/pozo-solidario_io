import { LegalLayout, Section, P, UL, Highlight } from '@/components/LegalLayout'

export const metadata = {
  title: 'Política de Privacidad — Pozo Solidario',
  description: 'Política de privacidad y manejo de datos personales de Pozo Solidario.',
}

export default function PrivacidadPage() {
  return (
    <LegalLayout
      title="Política de Privacidad"
      subtitle="Tu privacidad es importante. Te explicamos exactamente qué datos recopilamos, por qué y cómo los usamos."
      badge="Privacidad"
      lastUpdated="Enero 2025"
    >

      <Section title="1. Principios generales">
        <Highlight>
          Recopilamos el mínimo de datos necesario para operar. No vendemos, alquilamos ni compartimos datos personales con terceros con fines comerciales.
        </Highlight>
        <P>Esta política se aplica a todos los usuarios de la plataforma pozosolidario.com y sus subdominios.</P>
      </Section>

      <Section title="2. Datos que recopilamos">
        <P><strong className="text-white/60">2.1 Datos que recibimos de Mercado Pago</strong></P>
        <P>Cuando realizás un pago, Mercado Pago nos comparte los siguientes datos para procesar tu participación:</P>
        <UL items={[
          'Nombre y apellido del titular del pago.',
          'Dirección de email registrada en Mercado Pago.',
          'ID de pago de Mercado Pago.',
          'Monto de la transacción.',
        ]} />
        <P>No recibimos ni almacenamos datos de tarjetas de crédito, CVV, números bancarios ni contraseñas.</P>

        <P><strong className="text-white/60">2.2 Datos que generamos automáticamente</strong></P>
        <UL items={[
          'Identificador de visitante anónimo (generado localmente en tu dispositivo, almacenado en localStorage).',
          'Código de referido asociado a tu identificador.',
          'Registros de votos por causa (sin vinculación directa a tu identidad real).',
          'Logs de acceso estándar del servidor (IP, fecha, ruta).',
        ]} />

        <P><strong className="text-white/60">2.3 Datos que proporcionás voluntariamente</strong></P>
        <UL items={[
          'Si proponés una causa: nombre de la causa, descripción, ciudad, redes sociales, WhatsApp.',
          'Si nos contactás: nombre, email y mensaje.',
        ]} />
      </Section>

      <Section title="3. Cómo usamos tus datos">
        <P>Usamos los datos exclusivamente para:</P>
        <UL items={[
          'Asignarte números de sorteo una vez confirmado el pago.',
          'Notificarte por email si resultás ganador.',
          'Documentar donaciones para transparencia pública (sin datos identificatorios sensibles).',
          'Mostrarte tus números y tu historial de participaciones.',
          'Trackear referidos para acreditar números gratis.',
          'Responder tus consultas de contacto.',
          'Prevenir fraude y abuso de la plataforma.',
        ]} />
      </Section>

      <Section title="4. Almacenamiento y retención">
        <P>Los datos de participación (email, nombre, números asignados) se almacenan en nuestra base de datos MongoDB alojada en MongoDB Atlas (servidores en la región que configuremos, preferentemente São Paulo o EE.UU.).</P>
        <P>Conservamos los datos de participación mientras el sorteo al que correspondan esté activo, y hasta 2 años después para registros históricos y ante requerimientos legales.</P>
        <P>Los datos de contacto (consultas enviadas) se conservan por 1 año y luego se eliminan.</P>
      </Section>

      <Section title="5. Identificador anónimo">
        <P>Para operar sin requerir registro, usamos un identificador único almacenado en el localStorage de tu navegador (clave: <code className="text-white/50 bg-white/5 px-1.5 py-0.5 rounded text-xs">ps_user_id</code>). Este ID es:</P>
        <UL items={[
          'Generado aleatoriamente en tu dispositivo.',
          'No vinculado a tu identidad real hasta que realizás un pago.',
          'Eliminable en cualquier momento borrando el localStorage de tu navegador.',
          'Específico de cada dispositivo y navegador.',
        ]} />
      </Section>

      <Section title="6. Compartición de datos con terceros">
        <P>Compartimos datos únicamente con:</P>
        <UL items={[
          'Mercado Pago S.A.: para procesar pagos. Sus políticas de privacidad aplican a esa interacción.',
          'Vercel Inc.: infraestructura de hosting. Reciben logs de acceso estándar.',
          'MongoDB Atlas: almacenamiento de base de datos.',
          'Google (Gemini API): los mensajes que enviás al asistente de IA se procesan por la API de Gemini. No incluyen datos de pago ni datos personales identificatorios.',
          'Random.org: solo el rango de números para generar el ganador. No recibe datos de usuarios.',
        ]} />
        <P>No compartimos datos con empresas de publicidad, redes sociales, brokers de datos ni ningún tercero con fines comerciales.</P>
      </Section>

      <Section title="7. Seguridad">
        <P>Implementamos medidas técnicas y organizativas para proteger tus datos:</P>
        <UL items={[
          'Comunicaciones cifradas con HTTPS/TLS.',
          'Acceso a la base de datos restringido por IP y credenciales.',
          'Variables de entorno para claves de acceso (nunca en el código fuente).',
          'Rate limiting en endpoints de API.',
          'Panel de administración protegido por clave secreta.',
        ]} />
      </Section>

      <Section title="8. Tus derechos">
        <P>Tenés derecho a:</P>
        <UL items={[
          'Acceder a los datos que tenemos sobre vos.',
          'Solicitar corrección de datos incorrectos.',
          'Solicitar la eliminación de tus datos (derecho al olvido).',
          'Solicitar la portabilidad de tus datos.',
          'Oponerte al procesamiento de tus datos.',
        ]} />
        <P>Para ejercer estos derechos, escribinos a hola@pozosolidario.com con el asunto "Privacidad — [tu solicitud]". Respondemos en un plazo de 15 días hábiles.</P>
      </Section>

      <Section title="9. Cookies y almacenamiento local">
        <P>Ver nuestra <a href="/cookies" className="text-white/60 underline hover:text-white transition-colors">Política de Cookies</a> para información detallada sobre el uso de cookies y localStorage.</P>
      </Section>

      <Section title="10. Menores de edad">
        <P>La plataforma no está dirigida a menores de 18 años. Si tenés menos de esa edad, no podés participar. Si como padre o tutor detectás que un menor usó la plataforma, contactanos para eliminar sus datos.</P>
      </Section>

      <Section title="11. Cambios a esta política">
        <P>Podemos actualizar esta política periódicamente. Los cambios se publican en esta página con la fecha de actualización. Si los cambios son significativos, lo comunicamos mediante un aviso en la plataforma.</P>
      </Section>

      <Section title="12. Contacto">
        <P>Para consultas sobre privacidad: hola@pozosolidario.com o a través del formulario en la sección de Contacto.</P>
      </Section>

    </LegalLayout>
  )
}
