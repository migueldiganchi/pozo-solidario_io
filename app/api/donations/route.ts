import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Donation } from '@/models'

export const revalidate = 300

export async function GET() {
  try {
    await connectDB()
    const donations = await Donation.find({})
      .sort({ createdAt: -1 })
      .limit(30)
      .populate('causeId', 'title city')
      .lean()

    return NextResponse.json({ donations })
  } catch (error) {
    return NextResponse.json({ error: 'Error' }, { status: 500 })
  }
}
