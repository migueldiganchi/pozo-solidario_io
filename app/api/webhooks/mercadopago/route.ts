import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Participation } from '@/models'
import { getPayment } from '@/lib/mercadopago'
import { addToPool, assignNumbers } from '@/lib/pool'
import { getCurrentWeekId } from '@/lib/week'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    
    // MP sends different notification types
    if (body.type !== 'payment') {
      return NextResponse.json({ ok: true })
    }

    const paymentId = body.data?.id
    if (!paymentId) return NextResponse.json({ ok: true })

    await connectDB()

    // Idempotency: check if already processed
    const existing = await Participation.findOne({ paymentId: String(paymentId) })
    if (existing && existing.status === 'approved') {
      return NextResponse.json({ ok: true })
    }

    // Fetch payment from MP
    const payment = await getPayment(paymentId)

    if (payment.status !== 'approved') {
      if (existing) {
        existing.status = payment.status === 'rejected' ? 'rejected' : 'pending'
        await existing.save()
      }
      return NextResponse.json({ ok: true })
    }

    const { metadata } = payment
    const { visitorId, quantity, weekId, referralCode } = metadata || {}
    const resolvedWeekId = weekId || getCurrentWeekId()

    // Assign numbers
    const assignedNumbers = await assignNumbers(Number(quantity) || 1, resolvedWeekId)

    // Update pool
    await addToPool(payment.transaction_amount, resolvedWeekId)

    // Save participation
    if (existing) {
      existing.status = 'approved'
      existing.assignedNumbers = assignedNumbers
      existing.name = `${payment.payer?.first_name || ''} ${payment.payer?.last_name || ''}`.trim()
      await existing.save()
    } else {
      await Participation.create({
        paymentId: String(paymentId),
        email: payment.payer?.email || '',
        name: `${payment.payer?.first_name || ''} ${payment.payer?.last_name || ''}`.trim(),
        quantity: Number(quantity) || 1,
        assignedNumbers,
        amount: payment.transaction_amount,
        status: 'approved',
        weekId: resolvedWeekId,
        visitorId: visitorId || '',
        referralCode: referralCode || '',
      })
    }

    // Track referral conversion
    if (referralCode) {
      const { Referral } = await import('@/models')
      await Referral.findOneAndUpdate(
        { referralCode },
        { $inc: { conversions: 1 } }
      )

      // Award free numbers: 1 free number per 10 conversions
      const referral = await Referral.findOne({ referralCode })
      if (referral) {
        const earned = Math.floor(referral.conversions / 10)
        if (earned > referral.freeNumbersEarned) {
          await Referral.findOneAndUpdate(
            { referralCode },
            { freeNumbersEarned: earned }
          )
        }
      }
    }

    return NextResponse.json({ ok: true })
  } catch (error: any) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
