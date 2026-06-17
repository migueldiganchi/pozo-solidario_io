import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Cause, Vote } from '@/models'
import { getCurrentWeekId } from '@/lib/week'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { causeId, visitorId, fingerprint } = body

    if (!causeId || !visitorId) {
      return NextResponse.json({ error: 'Datos requeridos' }, { status: 400 })
    }

    await connectDB()
    const weekId = getCurrentWeekId()

    // Check for existing vote (anti-spam)
    const existingVote = await Vote.findOne({ causeId, visitorId, weekId })
    if (existingVote) {
      return NextResponse.json({ error: 'Ya votaste por esta causa esta semana', alreadyVoted: true }, { status: 409 })
    }

    // Check fingerprint (extra protection)
    if (fingerprint) {
      const fpVote = await Vote.findOne({ causeId, fingerprint, weekId })
      if (fpVote) {
        return NextResponse.json({ error: 'Ya votaste por esta causa', alreadyVoted: true }, { status: 409 })
      }
    }

    // Create vote
    await Vote.create({ causeId, visitorId, fingerprint: fingerprint || '', weekId })

    // Increment vote count
    const cause = await Cause.findByIdAndUpdate(
      causeId,
      { $inc: { votes: 1 } },
      { new: true }
    )

    return NextResponse.json({ votes: cause?.votes, success: true })
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json({ error: 'Ya votaste esta semana', alreadyVoted: true }, { status: 409 })
    }
    return NextResponse.json({ error: 'Error al votar' }, { status: 500 })
  }
}
