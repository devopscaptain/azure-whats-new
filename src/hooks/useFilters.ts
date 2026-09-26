import { useState, useCallback, useMemo } from 'react'
import type { UpdateStatus, WhatsNewItem } from '../types/news'

export type StatusFilter = UpdateStatus | 'all'

export function useFilters(items: WhatsNewItem[]) {
  const [activeFilters, setActiveFilters] = useState<Set<string>>(new Set())
  const [status, setStatus] = useState<StatusFilter>('all')

  // Product areas, most frequent first
  const allCategories = useMemo(() => {
    const counts = new Map<string, number>()
    for (const item of items) {
      for (const cat of item.categories) {
        counts.set(cat, (counts.get(cat) ?? 0) + 1)
      }
    }
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .map(([cat]) => cat)
  }, [items])

  const statusCounts = useMemo(() => {
    const counts: Record<StatusFilter, number> = {
      all: items.length, ga: 0, preview: 0, development: 0, retiring: 0, update: 0,
    }
    for (const item of items) counts[item.status]++
    return counts
  }, [items])

  const toggleFilter = useCallback((tag: string) => {
    setActiveFilters((prev) => {
      const next = new Set(prev)
      if (next.has(tag)) {
        next.delete(tag)
      } else {
        next.add(tag)
      }
      return next
    })
  }, [])

  const clearFilters = useCallback(() => {
    setActiveFilters(new Set())
    setStatus('all')
  }, [])

  const filtered = useMemo(() => {
    return items.filter((item) =>
      (status === 'all' || item.status === status) &&
      [...activeFilters].every(
        (f) => item.categories.includes(f) || item.services.includes(f) || item.tags.includes(f.toLowerCase())
      )
    )
  }, [items, activeFilters, status])

  return { activeFilters, allCategories, toggleFilter, clearFilters, status, setStatus, statusCounts, filtered }
}
