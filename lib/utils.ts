import { clsx, type ClassValue } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat('es-AR').format(n)
}

export function getNextTuesday(): Date {
  const now = new Date()
  const day = now.getDay() // 0=Sun, 2=Tue
  const daysUntilTuesday = (2 - day + 7) % 7 || 7
  const next = new Date(now)
  next.setDate(now.getDate() + daysUntilTuesday)
  next.setHours(21, 0, 0, 0)
  return next
}

export function getCountdown(target: Date): {
  days: number
  hours: number
  minutes: number
  seconds: number
} {
  const now = new Date()
  const diff = target.getTime() - now.getTime()

  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)

  return { days, hours, minutes, seconds }
}

export function generateVisitorId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

export function generateReferralCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

export function maskName(name: string): string {
  if (!name) return 'Anónimo'
  const parts = name.trim().split(' ')
  return parts.map((p, i) => (i === 0 ? p : p[0] + '.') ).join(' ')
}

export const PRICE_PER_NUMBER = Number(process.env.NEXT_PUBLIC_PRICE_PER_NUMBER) || 1000

export const PACKAGES = [
  { quantity: 1, label: '1 número', discount: 0 },
  { quantity: 5, label: '5 números', discount: 0 },
  { quantity: 10, label: '10 números', discount: 0 },
  { quantity: 25, label: '25 números', discount: 0.1 },
]
