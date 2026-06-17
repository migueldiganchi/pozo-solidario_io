import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Prize } from '@/models'
import { getCurrentWeekId } from '@/lib/week'

export const revalidate = 300

export async function GET() {
  try {
    await connectDB()
    const weekId = getCurrentWeekId()
    const prizes = await Prize.find({ weekId, active: true }).lean()
    return NextResponse.json({ prizes })
  } catch (error) {
    return NextResponse.json({ error: 'Error' }, { status: 500 })
  }
}
