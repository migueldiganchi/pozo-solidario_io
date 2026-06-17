import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Winner } from '@/models'
import { maskName } from '@/lib/utils'

export const revalidate = 300

export async function GET() {
  try {
    await connectDB()
    const winners = await Winner.find({})
      .sort({ createdAt: -1 })
      .limit(20)
      .populate('prizeId', 'title sponsor value')
      .lean()

    const masked = winners.map((w: any) => ({
      ...w,
      name: maskName(w.name),
      email: undefined,
    }))

    return NextResponse.json({ winners: masked })
  } catch (error) {
    return NextResponse.json({ error: 'Error' }, { status: 500 })
  }
}
