import { NextRequest, NextResponse } from 'next/server'

// Simple in-memory rate limit
const rateMap = new Map<string, { count: number; reset: number }>()

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || 'unknown'
  const now = Date.now()
  const entry = rateMap.get(ip)

  if (entry && now < entry.reset) {
    if (entry.count >= 3) {
      return NextResponse.json({ error: 'Demasiados mensajes. Intentá más tarde.' }, { status: 429 })
    }
    entry.count++
  } else {
    rateMap.set(ip, { count: 1, reset: now + 3600000 })
  }

  try {
    const { name, email, topic, message } = await req.json()

    if (!name || !email || !topic || !message) {
      return NextResponse.json({ error: 'Campos requeridos' }, { status: 400 })
    }
    if (message.length > 2000) {
      return NextResponse.json({ error: 'Mensaje demasiado largo' }, { status: 400 })
    }

    // In production: send email via Resend, SendGrid, Nodemailer, etc.
    // For now we log it — replace with your email provider
    console.log('📧 Nuevo contacto:', { name, email, topic, message: message.slice(0, 100) })

    // Example with Resend (uncomment and install resend):
    // const { Resend } = require('resend')
    // const resend = new Resend(process.env.RESEND_API_KEY)
    // await resend.emails.send({
    //   from: 'contacto@pozosolidario.com',
    //   to: 'hola@pozosolidario.com',
    //   subject: `[Contacto] ${topic} — ${name}`,
    //   text: `De: ${name} <${email}>\nAsunto: ${topic}\n\n${message}`,
    // })

    return NextResponse.json({ ok: true })
  } catch (error) {
    return NextResponse.json({ error: 'Error al procesar el mensaje' }, { status: 500 })
  }
}
