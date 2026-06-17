import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Referral } from '@/models'
import { generateReferralCode } from '@/lib/utils'

export async function GET(req: NextRequest) {
  try {
    const visitorId = req.nextUrl.searchParams.get('visitorId')
    if (!visitorId) return NextResponse.json({ error: 'ID requerido' }, { status: 400 })

    await connectDB()

    let referral = await Referral.findOne({ visitorId })

    if (!referral) {
      // Create new referral code
      let code = generateReferralCode()
      let exists = await Referral.findOne({ referralCode: code })
      while (exists) {
        code = generateReferralCode()
        exists = await Referral.findOne({ referralCode: code })
      }

      referral = await Referral.create({
        referralCode: code,
        visitorId,
        visits: 0,
        conversions: 0,
        freeNumbersEarned: 0,
        freeNumbersRedeemed: 0,
      })
    }

    return NextResponse.json({
      referralCode: referral.referralCode,
      visits: referral.visits,
      conversions: referral.conversions,
      freeNumbersEarned: referral.freeNumbersEarned,
      freeNumbersRedeemed: referral.freeNumbersRedeemed,
      pendingFreeNumbers: referral.freeNumbersEarned - referral.freeNumbersRedeemed,
    })
  } catch (error) {
    return NextResponse.json({ error: 'Error' }, { status: 500 })
  }
}

// Track visit from referral link
export async function POST(req: NextRequest) {
  try {
    const { referralCode, visitorId } = await req.json()
    if (!referralCode) return NextResponse.json({ ok: true })

    await connectDB()

    await Referral.findOneAndUpdate(
      { referralCode },
      { $inc: { visits: 1 } }
    )

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: true })
  }
}
