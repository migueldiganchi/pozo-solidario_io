import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Donation } from '@/models'

function checkAdmin(req: NextRequest) {
  return req.headers.get('x-admin-secret') === process.env.ADMIN_SECRET
}

export async function POST(req: NextRequest) {
  if (!checkAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await req.json()
    const { causeId, amount, proofText, proofImage, weekId } = body

    if (!causeId || !amount || !weekId) {
      return NextResponse.json({ error: 'Faltan datos' }, { status: 400 })
    }

    await connectDB()
    const donation = await Donation.create({ causeId, amount, proofText, proofImage, weekId })
    return NextResponse.json({ donation })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
