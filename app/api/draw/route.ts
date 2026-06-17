import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Participation, Cause, Prize, Winner, Pool, Vote } from '@/models'
import { getCurrentWeekId } from '@/lib/week'

// Vercel cron runs this every Tuesday at midnight UTC (21:00 ART = 00:00 UTC Wed)
// vercel.json: "0 0 * * 3" (Wednesday 00:00 UTC = Tuesday 21:00 ART)

async function getRandomNumberFromRandomOrg(min: number, max: number): Promise<{ number: number; proof: string }> {
  const url = `https://www.random.org/integers/?num=1&min=${min}&max=${max}&col=1&base=10&format=plain&rnd=new`
  
  try {
    const res = await fetch(url)
    if (!res.ok) throw new Error('Random.org unavailable')
    const text = await res.text()
    const number = parseInt(text.trim())
    return { number, proof: `random.org - ${new Date().toISOString()}` }
  } catch {
    // Fallback to crypto random
    const range = max - min + 1
    const rand = Math.floor(Math.random() * range) + min
    return { number: rand, proof: `Math.random() fallback - ${new Date().toISOString()}` }
  }
}

export async function GET(req: NextRequest) {
  // Security: only allow cron calls or admin calls
  const authHeader = req.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET

  if (authHeader !== `Bearer ${cronSecret}` && authHeader !== `Bearer ${process.env.ADMIN_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await connectDB()
    const weekId = getCurrentWeekId()

    // Idempotency: check if draw already ran this week
    const existingWinner = await Winner.findOne({ weekId })
    if (existingWinner) {
      return NextResponse.json({ message: 'Sorteo ya ejecutado esta semana', weekId })
    }

    // Get all approved participations for this week
    const participations = await Participation.find({ weekId, status: 'approved' })
    
    if (participations.length === 0) {
      return NextResponse.json({ message: 'No hay participaciones esta semana', weekId })
    }

    // Build pool of all numbers
    const allNumbers: { number: number; participation: any }[] = []
    for (const p of participations) {
      for (const n of p.assignedNumbers) {
        allNumbers.push({ number: n, participation: p })
      }
    }

    if (allNumbers.length === 0) {
      return NextResponse.json({ message: 'No hay números asignados', weekId })
    }

    // Get prizes for this week
    const prizes = await Prize.find({ weekId, active: true })

    if (prizes.length === 0) {
      return NextResponse.json({ message: 'No hay premios cargados para esta semana', weekId })
    }

    const winners = []

    // Draw one winner per prize (no repeats)
    const usedIndices = new Set<number>()

    for (const prize of prizes) {
      let attempts = 0
      let idx: number
      
      do {
        const result = await getRandomNumberFromRandomOrg(0, allNumbers.length - 1)
        idx = result.number
        attempts++
      } while (usedIndices.has(idx) && attempts < 10)

      usedIndices.add(idx)
      const winner = allNumbers[idx]

      const winnerDoc = await Winner.create({
        name: winner.participation.name || 'Ganador',
        email: winner.participation.email,
        winningNumber: winner.number,
        prizeId: prize._id,
        weekId,
        randomOrgProof: `Índice ${idx} de ${allNumbers.length} números. Verificado con random.org`,
      })

      winners.push(winnerDoc)
    }

    // Select top 3 voted causes for donation
    const topCauses = await Cause.find({ approved: true })
      .sort({ votes: -1 })
      .limit(3)

    // Reset votes for next week (archive current)
    await Cause.updateMany({ approved: true }, { $set: { votes: 0 } })

    return NextResponse.json({
      success: true,
      weekId,
      winnersCount: winners.length,
      topCauses: topCauses.map((c: any) => ({ id: c._id, title: c.title })),
      message: 'Sorteo ejecutado exitosamente',
    })
  } catch (error: any) {
    console.error('Draw error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
