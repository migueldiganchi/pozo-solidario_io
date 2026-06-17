import { NextRequest, NextResponse } from 'next/server'
import { createPreference } from '@/lib/mercadopago'
import { getCurrentWeekId } from '@/lib/week'
import { getOrCreatePool } from '@/lib/pool'

const VALID_QUANTITIES = [1, 5, 10, 25]

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { quantity, visitorId, referralCode } = body

    if (!VALID_QUANTITIES.includes(quantity)) {
      return NextResponse.json({ error: 'Cantidad inválida' }, { status: 400 })
    }

    if (!visitorId) {
      return NextResponse.json({ error: 'Identificador requerido' }, { status: 400 })
    }

    const weekId = getCurrentWeekId()
    await getOrCreatePool(weekId)

    const preference = await createPreference({
      quantity,
      visitorId,
      referralCode,
      weekId,
    })

    return NextResponse.json({
      preferenceId: preference.id,
      initPoint: preference.init_point,
      sandboxInitPoint: preference.sandbox_init_point,
    })
  } catch (error: any) {
    console.error('Participation error:', error)
    return NextResponse.json({ error: error.message || 'Error al crear el pago' }, { status: 500 })
  }
}
