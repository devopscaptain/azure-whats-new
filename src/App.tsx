import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle } from 'lucide-react'
import { Header } from './components/Header'
import { FilterBar } from './components/FilterBar'
import { NewsGrid } from './components/NewsGrid'
import { LoadingSkeleton } from './components/LoadingSkeleton'
import { useNewsData } from './hooks/useNewsData'
import { useSearch } from './hooks/useSearch'
import { useFilters } from './hooks/useFilters'

export default function App() {
  const { feed, loading, error } = useNewsData()
  const items = useMemo(() => feed?.items ?? [], [feed])
  const newCount = useMemo(() => items.filter(i => i.isNew).length, [items])

  const { query, setQuery, results: searchResults } = useSearch(items)
  const {
    activeFilters, allCategories, toggleFilter, clearFilters,
    status, setStatus, statusCounts, filtered,
  } = useFilters(searchResults)

  return (
    <div className="min-h-screen relative">

      {/* Light-blue wash fading into the white page */}
      <div className="absolute inset-x-0 top-0 h-[480px] pointer-events-none"
        style={{ background: 'linear-gradient(180deg, rgb(var(--c-surface-2)) 0%, rgb(var(--c-page)) 100%)' }} />

      <Header
        query={query}
        onSearch={setQuery}
        resultCount={filtered.length}
        lastUpdated={feed?.lastUpdated ?? null}
        totalCount={items.length}
        newCount={newCount}
      />

      {!loading && !error && (
        <FilterBar
          categories={allCategories}
          activeFilters={activeFilters}
          onToggle={toggleFilter}
          onClear={clearFilters}
          status={status}
          onStatus={setStatus}
          statusCounts={statusCounts}
          totalCount={searchResults.length}
          filteredCount={filtered.length}
        />
      )}

      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {loading && <LoadingSkeleton />}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-32 text-center"
          >
            <div className="w-16 h-16 rounded-lg bg-surface border border-retire/30 flex items-center justify-center mb-4">
              <AlertTriangle className="w-7 h-7 text-retire" />
            </div>
            <h3 className="text-base font-semibold text-heading mb-2">Failed to load data</h3>
            <p className="text-sm text-muted max-w-sm">
              Run <code className="font-mono text-accent bg-accent/10 px-1.5 py-0.5 rounded">npm run fetch</code> to generate data.
            </p>
          </motion.div>
        )}

        {!loading && !error && (
          <NewsGrid
            items={filtered}
            hasFilters={activeFilters.size > 0 || status !== 'all' || query.length > 0}
            onClearFilters={() => { clearFilters(); setQuery('') }}
          />
        )}
      </main>

      <footer className="relative border-t border-border mt-16 py-8 px-4 text-center space-y-1.5">
        <p className="text-xs text-muted">
          Built by{' '}
          <a href="https://devopscaptain.com" target="_blank" rel="noopener noreferrer"
            className="font-semibold text-gradient-azure">
            DevOps Captain
          </a>
          {' '}· Data from{' '}
          <a href="https://azure.microsoft.com/updates" target="_blank" rel="noopener noreferrer"
            className="text-accent hover:underline">
            Azure Updates
          </a>
          {' '}· Updated daily
        </p>
        <p className="text-[11px] text-muted/80">
          Community project, not affiliated with or endorsed by Microsoft. Azure is a trademark of Microsoft Corporation.
        </p>
      </footer>
    </div>
  )
}
