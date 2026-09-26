import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { NewsCard } from './NewsCard'
import { EmptyState } from './EmptyState'
import type { WhatsNewItem } from '../types/news'

const PAGE_SIZE = 48

interface NewsGridProps {
  items: WhatsNewItem[]
  hasFilters: boolean
  onClearFilters: () => void
}

export function NewsGrid({ items, hasFilters, onClearFilters }: NewsGridProps) {
  const [visible, setVisible] = useState(PAGE_SIZE)

  // Reset paging whenever the result set changes
  useEffect(() => setVisible(PAGE_SIZE), [items])

  if (items.length === 0) {
    return <EmptyState hasFilters={hasFilters} onClear={onClearFilters} />
  }

  const shown = items.slice(0, visible)

  return (
    <>
      <motion.div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        <AnimatePresence mode="popLayout">
          {shown.map((item, i) => (
            <NewsCard key={item.id} item={item} index={i} />
          ))}
        </AnimatePresence>
      </motion.div>

      {visible < items.length && (
        <div className="flex justify-center mt-10">
          <button
            onClick={() => setVisible((v) => v + PAGE_SIZE)}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-md text-sm font-semibold text-white bg-azure hover:bg-azure-dark shadow-fluent-2 transition-colors"
          >
            Show more
            <span className="font-normal opacity-80">({items.length - visible} remaining)</span>
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      )}
    </>
  )
}
