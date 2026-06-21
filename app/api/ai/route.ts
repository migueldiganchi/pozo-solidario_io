import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

const SYSTEM_PROMPT = `Sos un asistente de Pozo Solidario, una plataforma de sorteos solidarios en Argentina. Tu objetivo es informar y guiar al usuario de forma breve y cálida, ofreciendo acciones relevantes.`

const PRIMER_MESSAGE = `
Aquí tienes información detallada sobre la plataforma y cómo debes responder:

**SOBRE LA PLATAFORMA:**
- Hay un único pozo semanal compartido entre todos los participantes.
- Cada aporte se divide: 50% donaciones, 40% premios, 10% plataforma.
- El sorteo es automático todos los martes a las 21:00.
- Las 3 causas más votadas reciben donaciones de ese pozo.
- No se necesita cuenta ni registro.

**CÓMO PARTICIPAR:**
1. Elegí cuántos números querés (1, 5, 10 o 25).
2. Pagás con Mercado Pago.
3. Se asignan números automáticamente.
4. El martes 21:00 se sortea.

**ACCIONES QUE PODÉS DISPARAR (y cómo mapearlas):**
- "participar" / "comprar" / "números" → "open_participation"
- "causas" / "donar" / "ayudar" → "scroll_causes"
- "premios" / "regalos" / "sorteo" → "scroll_prizes"
- "ganadores" / "resultados" → "scroll_winners"
- "compartir" / "referido" / "link" → "show_share"
- "proponer causa" / "postular" → "open_propose_cause"
- "mis números" → "show_my_numbers"

**FORMATO DE RESPUESTA:**
- Sé muy breve (2-3 líneas máximo).
- Sin emojis en exceso.
- Tono cálido y directo.
- Si no entendés, preguntá brevemente.
- Devolvé SIEMPRE un JSON con este formato exacto:
  \`\`\`json
  {
    "message": "tu respuesta al usuario",
    "action": "none" | "open_participation" | "scroll_causes" | "scroll_prizes" | "scroll_winners" | "scroll_donations" | "open_propose_cause" | "show_my_numbers" | "show_share",
    "actionLabel": "texto del botón si hay acción"
  }
  \`\`\`
- Solo JSON, sin markdown, sin texto extra.
`

// Rate limiting simple en memoria (para producción usar Redis/Upstash)
const requestCounts = new Map<string, { count: number; resetAt: number }>()

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = requestCounts.get(ip)

  if (!entry || now > entry.resetAt) {
    requestCounts.set(ip, { count: 1, resetAt: now + 60000 })
    return true
  }

  if (entry.count >= 20) return false
  entry.count++
  return true
}

// El SDK de Gemini SOLO acepta los roles "user" y "model" en el history.
// El frontend puede estar mandando "assistant" (estilo OpenAI) u otros valores,
// así que normalizamos: cualquier cosa que no sea "user" se convierte en "model".
function normalizeRole(role: string): 'user' | 'model' {
  return role === 'user' ? 'user' : 'model'
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || 'unknown'
    if (!checkRateLimit(ip)) {
      return NextResponse.json({ error: 'Demasiadas consultas' }, { status: 429 })
    }

    const { message, history = [] } = await req.json()

    if (!message || message.length > 500) {
      return NextResponse.json({ error: 'Mensaje inválido' }, { status: 400 })
    }

    // systemInstruction debe pasarse en getGenerativeModel (no en startChat),
    // y como objeto Content { role, parts } — no como string plano.
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction: {
        role: 'system',
        parts: [{ text: SYSTEM_PROMPT }],
      },
    })

    const chat = model.startChat({
      history: [
        // Primer message to set up the model's behavior and context
        {
          role: 'user',
          parts: [{ text: PRIMER_MESSAGE }],
        },
        {
          role: 'model',
          parts: [{ text: 'Entendido. Estoy listo para ayudar.' }], // Acknowledge the primer
        },
        // Actual conversation history, limited to recent turns, con roles normalizados
        ...history.slice(-6).map((h: any) => ({
          role: normalizeRole(h.role),
          parts: [{ text: h.content }],
        })),
      ],
    })

    const result = await chat.sendMessage(message)
    const text = result.response.text()

    // Parse JSON response
    try {
      const clean = text.replace(/```json|```/g, '').trim()
      const parsed = JSON.parse(clean)
      return NextResponse.json(parsed)
    } catch {
      return NextResponse.json({
        message: text.slice(0, 300),
        action: 'none',
      })
    }
  } catch (error: any) {
    console.error('AI error:', error)
    return NextResponse.json({
      message: 'Ahora mismo no puedo responder. Intentá de nuevo.',
      action: 'none',
    })
  }
}