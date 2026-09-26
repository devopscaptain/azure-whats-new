import type { CSSProperties } from 'react'
import type { UpdateStatus } from '../types/news'

export const STATUS_META: Record<UpdateStatus, { label: string; short: string; token: string }> = {
  ga:          { label: 'Generally available', short: 'GA',          token: '--c-ga' },
  preview:     { label: 'Preview',             short: 'Preview',     token: '--c-preview' },
  development: { label: 'In development',      short: 'In dev',      token: '--c-dev' },
  retiring:    { label: 'Retirement',          short: 'Retiring',    token: '--c-retire' },
  update:      { label: 'Update',              short: 'Update',      token: '--c-accent' },
}

// Style object for an element using the .status-chip class
export function statusStyle(status: UpdateStatus): CSSProperties {
  return { '--c': `var(${STATUS_META[status].token})` } as CSSProperties
}

export function statusColor(status: UpdateStatus, alpha = 1): string {
  return `rgb(var(${STATUS_META[status].token}) / ${alpha})`
}
