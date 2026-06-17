import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Participation } from '@/models'
import { getCurrentWeekId } from '@/lib/week'

export async function GET(req: NextRequest) {
  try {
    const visitorId = req.nextUrl.searchParams.get('visitorId')
    if (!visitorId) return NextResponse.json({ numbers: [] })

    await connectDB()
    const weekId = getCurrentWeekId()

    const participations = await Participation.find({
      visitorId,
      weekId,
      status: 'approved',
    }).select('assignedNumbers quantity createdAt').lean()

    const numbers = participations.flatMap((p: any) => p.assignedNumbers)

    return NextResponse.json({ numbers, participations })
  } catch (error) {
    return NextResponse.json({ error: 'Error' }, { status: 500 })
  }
}
