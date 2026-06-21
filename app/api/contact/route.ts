import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

// Simple in-memory rate limit
const rateMap = new Map<string, { count: number; reset: number }>()

// Reutilizamos el transporter entre invocaciones (evita reconectar en cada request)
let transporter: nodemailer.Transporter | null = null

function getTransporter() {
  if (!transporter) {
    const user = process.env.GMAIL_USER
    const pass = process.env.GMAIL_APP_PASSWORD

    if (!user || !pass) {
      throw new Error('Faltan las variables de entorno GMAIL_USER / GMAIL_APP_PASSWORD')
    }

    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user, pass },
    })
  }
  return transporter
}

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

    const destino = process.env.GMAIL_USER

    await getTransporter().sendMail({
      from: `"Pozo Solidario" <${process.env.GMAIL_USER}>`,
      to: destino,
      replyTo: email,
      subject: `[Contacto] ${topic} — ${name}`,
      text: `De: ${name} <${email}>\nAsunto: ${topic}\n\n${message}`,
      html: `
        <div style="font-family: sans-serif; line-height: 1.6;">
          <p><strong>De:</strong> ${name} (${email})</p>
          <p><strong>Asunto:</strong> ${topic}</p>
          <hr />
          <p>${String(message).replace(/\n/g, '<br />')}</p>
        </div>
      `,
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Error al enviar el correo:', error)
    return NextResponse.json({ error: 'Error al procesar el mensaje' }, { status: 500 })
  }
}