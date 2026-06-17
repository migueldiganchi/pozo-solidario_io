import { format, startOfWeek, addDays } from 'date-fns'

/**
 * Returns the current week ID in format "2025-W01"
 * Week starts on Tuesday
 */
export function getCurrentWeekId(date: Date = new Date()): string {
  // Find the most recent Tuesday
  const day = date.getDay() // 0=Sun, 2=Tue
  const daysSinceTuesday = (day - 2 + 7) % 7
  const tuesday = new Date(date)
  tuesday.setDate(date.getDate() - daysSinceTuesday)
  tuesday.setHours(0, 0, 0, 0)
  
  const year = tuesday.getFullYear()
  const startOfYear = new Date(year, 0, 1)
  const weekNum = Math.ceil(((tuesday.getTime() - startOfYear.getTime()) / 86400000 + startOfYear.getDay() + 1) / 7)
  
  return `${year}-W${String(weekNum).padStart(2, '0')}`
}

export function getWeekLabel(weekId: string): string {
  // Returns "Semana del DD/MM/YYYY"
  return `Semana ${weekId}`
}
