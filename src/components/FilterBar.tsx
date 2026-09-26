import { motion, AnimatePresence } from 'framer-motion'
import { SlidersHorizontal, X } from 'lucide-react'
import { STATUS_META, statusColor } from '../utils/colorUtils'
import type { StatusFilter } from '../hooks/useFilters'

const STATUS_TABS: StatusFilter[] = ['all', 'ga', 'preview', 'development', 'retiring']

interface FilterBarProps {
  categories: string[]
  activeFilters: Set<string>
  onToggle: (cat: string) => void
  onClear: () => void
  status: StatusFilter
  onStatus: (s: StatusFilter) => void
  statusCounts: Record<StatusFilter, number>
  totalCount: number
  filteredCount: number
}

export function FilterBar({
  categories,
  activeFilters,
  onToggle,
  onClear,
  status,
  onStatus,
  statusCounts,
  totalCount,
  filteredCount,
}: FilterBarProps) {
  const hasFilters = activeFilters.size > 0 || status !== 'all'

  return (
    <div className="relative border-b border-border bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Status pivot (Fluent-style tabs) */}
        <div role="tablist" aria-label="Filter by status"
          className="flex items-center gap-1 overflow-x-auto overflow-y-hidden -mx-1 px-1 border-b border-border [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {STATUS_TABS.map((s) => {
            const active = status === s
            const label = s === 'all' ? 'All updates' : STATUS_META[s].label
            return (
              <button
                key={s}
                role="tab"
                aria-selected={active}
                onClick={() => onStatus(s)}
                className={`relative shrink-0 flex items-center gap-2 px-3 py-3 text-sm transition-colors ${
                  active ? 'text-heading font-semibold' : 'text-muted hover:text-body'
                }`}
              >
                {s !== 'all' && (
                  <span className="w-2 h-2 rounded-full" style={{ background: statusColor(s) }} />
                )}
                {label}
                <span className={`text-xs tabular-nums px-1.5 rounded ${active ? 'bg-accent/15 text-accent' : 'bg-surface-2 text-muted'}`}>
                  {statusCounts[s]}
                </span>
                {active && (
                  <motion.span
                    layoutId="status-underline"
                    className="absolute left-2 right-2 bottom-0 h-[3px] rounded-full bg-accent"
                  />
                )}
              </button>
            )
          })}
        </div>

        {/* Product area chips */}
        <div className="flex items-start gap-4 py-3.5">
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted shrink-0 pt-1.5 font-semibold">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Product area
          </div>

          <div className="flex items-center gap-2 flex-nowrap sm:flex-wrap overflow-x-auto sm:overflow-visible flex-1 min-w-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {categories.map((cat) => {
              const active = activeFilters.has(cat)
              return (
                <button
                  key={cat}
                  onClick={() => onToggle(cat)}
                  aria-pressed={active}
                  className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition-colors duration-150 select-none ${
                    active
                      ? 'bg-accent text-white border-accent shadow-fluent-2'
                      : 'bg-surface-2 text-accent-bright border-border hover:bg-tint hover:border-border-bright'
                  }`}
                >
                  {active && <span className="w-1.5 h-1.5 rounded-full shrink-0 bg-white" />}
                  {cat}
                </button>
              )
            })}
          </div>

          <div className="flex items-center gap-3 shrink-0 pt-1">
            <AnimatePresence>
              {hasFilters && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.85 }}
                  onClick={onClear}
                  className="flex items-center gap-1 text-xs font-semibold text-accent hover:text-accent-bright transition-colors"
                >
                  <X className="w-3 h-3" />
                  Clear
                </motion.button>
              )}
            </AnimatePresence>
            <span className="text-xs text-muted tabular-nums whitespace-nowrap">
              {filteredCount === totalCount
                ? <><span className="text-body font-semibold">{totalCount.toLocaleString()}</span> items</>
                : <><span className="text-accent font-semibold">{filteredCount.toLocaleString()}</span> of {totalCount.toLocaleString()}</>
              }
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
