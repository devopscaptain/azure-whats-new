import { motion } from 'framer-motion'
import { SearchX, FilterX } from 'lucide-react'

interface EmptyStateProps {
  hasFilters: boolean
  onClear: () => void
}

export function EmptyState({ hasFilters, onClear }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-24 text-center"
    >
      <div className="w-16 h-16 rounded-lg bg-surface border border-border shadow-fluent-2 flex items-center justify-center mb-4">
        {hasFilters ? (
          <FilterX className="w-7 h-7 text-accent" />
        ) : (
          <SearchX className="w-7 h-7 text-accent" />
        )}
      </div>
      <h3 className="text-base font-semibold text-heading mb-1">No updates found</h3>
      <p className="text-sm text-muted max-w-xs mb-4">
        {hasFilters
          ? 'Try removing some filters to see more results.'
          : 'Try a different search term.'}
      </p>
      {hasFilters && (
        <button
          onClick={onClear}
          className="px-4 py-1.5 rounded-md text-sm font-semibold text-accent border border-accent/40 hover:bg-accent/10 transition-colors"
        >
          Clear all filters
        </button>
      )}
    </motion.div>
  )
}
