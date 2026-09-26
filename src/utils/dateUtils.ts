import { formatDistanceToNow, format, isToday, isYesterday, parseISO } from 'date-fns'

export function relativeTime(iso: string): string {
  const date = parseISO(iso)
  if (isToday(date)) return formatDistanceToNow(date, { addSuffix: true })
  if (isYesterday(date)) return 'Yesterday'
  return formatDistanceToNow(date, { addSuffix: true })
}

export function fullDate(iso: string): string {
  return format(parseISO(iso), 'MMM d, yyyy')
}

export function lastSynced(iso: string): string {
  return formatDistanceToNow(parseISO(iso), { addSuffix: true })
}

// "2026-09" → "Sep 2026"
export function monthYear(ym: string): string {
  const [y, m] = ym.split('-').map(Number)
  if (!y || !m) return ym
  return format(new Date(y, m - 1, 1), 'MMM yyyy')
}
