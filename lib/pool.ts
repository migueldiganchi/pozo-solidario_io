import { connectDB } from './mongodb'
import { Pool } from '../models'
import { getCurrentWeekId } from './week'

export async function getOrCreatePool(weekId?: string) {
  await connectDB()
  const wid = weekId || getCurrentWeekId()

  let pool = await Pool.findOne({ weekId: wid })
  if (!pool) {
    pool = await Pool.create({
      weekId: wid,
      total: 0,
      donationsAmount: 0,
      prizesAmount: 0,
      platformAmount: 0,
      participationCount: 0,
      lastNumberAssigned: 10000,
    })
  }

  return pool
}

export async function addToPool(amount: number, weekId: string) {
  await connectDB()

  const donations = Math.floor(amount * 0.5)
  const prizes = Math.floor(amount * 0.4)
  const platform = amount - donations - prizes

  const pool = await Pool.findOneAndUpdate(
    { weekId },
    {
      $inc: {
        total: amount,
        donationsAmount: donations,
        prizesAmount: prizes,
        platformAmount: platform,
        participationCount: 1,
      },
    },
    { new: true, upsert: true }
  )

  return pool
}

export async function assignNumbers(quantity: number, weekId: string): Promise<number[]> {
  await connectDB()

  const pool = await Pool.findOneAndUpdate(
    { weekId },
    { $inc: { lastNumberAssigned: quantity } },
    { new: true, upsert: true }
  )

  const last = pool.lastNumberAssigned
  const numbers: number[] = []
  for (let i = quantity; i >= 1; i--) {
    numbers.push(last - i + 1)
  }

  return numbers
}
