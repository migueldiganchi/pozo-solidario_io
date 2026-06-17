import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Cause, Prize, Participation, Donation, Pool } from '@/models'
import { getCurrentWeekId } from '@/lib/week'

function checkAdmin(req: NextRequest) {
  const auth = req.headers.get('x-admin-secret')
  return auth === process.env.ADMIN_SECRET
}

// GET: dashboard data
export async function GET(req: NextRequest) {
  if (!checkAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    await connectDB()
    const weekId = getCurrentWeekId()

    const [pendingCauses, participations, pool, prizes] = await Promise.all([
      Cause.find({ approved: false }).sort({ createdAt: -1 }).lean(),
      Participation.find({ weekId, status: 'approved' }).sort({ createdAt: -1 }).limit(50).lean(),
      Pool.findOne({ weekId }),
      Prize.find({ weekId }).lean(),
    ])

    return NextResponse.json({
      weekId,
      pendingCauses,
      participations,
      pool,
      prizes,
    })
  } catch (error) {
    return NextResponse.json({ error: 'Error' }, { status: 500 })
  }
}

// POST: admin actions
export async function POST(req: NextRequest) {
  if (!checkAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    await connectDB()
    const body = await req.json()
    const { action, ...data } = body

    switch (action) {
      case 'approve_cause': {
        await Cause.findByIdAndUpdate(data.causeId, { approved: true })
        return NextResponse.json({ ok: true })
      }

      case 'reject_cause': {
        await Cause.findByIdAndDelete(data.causeId)
        return NextResponse.json({ ok: true })
      }

      case 'add_prize': {
        const weekId = getCurrentWeekId()
        const prize = await Prize.create({ ...data, weekId, active: true })
        return NextResponse.json({ prize })
      }

      case 'add_donation': {
        const { causeId, amount, proofText, proofImage } = data
        const weekId = getCurrentWeekId()
        const donation = await Donation.create({ causeId, amount, proofText, proofImage, weekId })
        return NextResponse.json({ donation })
      }

      case 'run_draw': {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/draw`, {
          headers: { authorization: `Bearer ${process.env.ADMIN_SECRET}` },
        })
        const result = await res.json()
        return NextResponse.json(result)
      }

      default:
        return NextResponse.json({ error: 'Acción desconocida' }, { status: 400 })
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
