import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { getOrCreatePool } from '@/lib/pool'
import { getCurrentWeekId } from '@/lib/week'

export const revalidate = 30

export async function GET() {
  try {
    await connectDB()
    const weekId = getCurrentWeekId()
    const pool = await getOrCreatePool(weekId)
    
    return NextResponse.json({
      weekId,
      total: pool.total,
      donationsAmount: pool.donationsAmount,
      prizesAmount: pool.prizesAmount,
      platformAmount: pool.platformAmount,
      participationCount: pool.participationCount,
      lastNumberAssigned: pool.lastNumberAssigned,
    })
  } catch (error) {
    console.error('Pool error:', error)
    return NextResponse.json({ error: 'Error al obtener el pozo' }, { status: 500 })
  }
}
