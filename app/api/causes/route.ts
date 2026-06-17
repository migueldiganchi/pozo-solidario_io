import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Cause } from '@/models'
import { getCurrentWeekId } from '@/lib/week'

export const revalidate = 60

export async function GET(req: NextRequest) {
  try {
    await connectDB()
    const causes = await Cause.find({ approved: true })
      .sort({ votes: -1 })
      .lean()

    return NextResponse.json({ causes })
  } catch (error) {
    return NextResponse.json({ error: 'Error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { title, description, instagram, facebook, whatsapp, city, images } = body

    if (!title || !description || !city) {
      return NextResponse.json({ error: 'Campos requeridos: título, descripción, ciudad' }, { status: 400 })
    }

    await connectDB()

    const cause = await Cause.create({
      title: title.trim().slice(0, 100),
      description: description.trim().slice(0, 500),
      instagram: instagram?.trim() || '',
      facebook: facebook?.trim() || '',
      whatsapp: whatsapp?.trim() || '',
      city: city.trim(),
      images: images || [],
      votes: 0,
      approved: false,
    })

    return NextResponse.json({ cause, message: 'Tu causa fue enviada y será revisada pronto.' })
  } catch (error) {
    return NextResponse.json({ error: 'Error al enviar la causa' }, { status: 500 })
  }
}
