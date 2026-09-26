import { useState, useEffect } from 'react'
import type { WhatsNewFeed } from '../types/news'

const DATA_URL = `${import.meta.env.BASE_URL}data/whats-new.json`
const WEEK_MS = 7 * 24 * 60 * 60 * 1000

export function useNewsData() {
  const [feed, setFeed] = useState<WhatsNewFeed | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch(DATA_URL)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json() as Promise<WhatsNewFeed>
      })
      .then((data) => {
        const now = Date.now()
        setFeed({
          ...data,
          items: data.items.map((i) => ({ ...i, isNew: now - Date.parse(i.updatedAt) < WEEK_MS })),
        })
        setLoading(false)
      })
      .catch((err: Error) => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  return { feed, loading, error }
}
