import { useMemo, useState, useCallback } from 'react'
import Fuse, { type IFuseOptions } from 'fuse.js'
import type { WhatsNewItem } from '../types/news'

const FUSE_OPTIONS: IFuseOptions<WhatsNewItem> = {
  threshold: 0.35,
  ignoreLocation: true,
  keys: [
    { name: 'title', weight: 2 },
    { name: 'description', weight: 1 },
    { name: 'services', weight: 1.5 },
    { name: 'tags', weight: 1.2 },
    { name: 'categories', weight: 1 },
  ],
}

export function useSearch(items: WhatsNewItem[]) {
  const [query, setQuery] = useState('')

  const fuse = useMemo(() => new Fuse(items, FUSE_OPTIONS), [items])

  const results = useMemo(() => {
    if (!query.trim()) return items
    return fuse.search(query).map((r) => r.item)
  }, [fuse, items, query])

  const handleQuery = useCallback((q: string) => {
    setQuery(q)
  }, [])

  return { query, setQuery: handleQuery, results }
}
