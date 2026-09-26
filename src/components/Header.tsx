import { Github, RefreshCw, Rss, Cloud } from 'lucide-react'
import { SearchBar } from './SearchBar'
import { lastSynced } from '../utils/dateUtils'

interface HeaderProps {
  query: string
  onSearch: (q: string) => void
  resultCount: number
  lastUpdated: string | null
  totalCount: number
  newCount: number
}

export function Header({ query, onSearch, resultCount, lastUpdated, totalCount, newCount }: HeaderProps) {
  const iconBtn =
    'p-2 rounded-md text-accent-bright hover:text-accent hover:bg-white border border-transparent hover:border-border-bright transition-colors duration-150'

  return (
    <header className="sticky top-0 z-50 border-b border-border-bright bg-surface-2/95 backdrop-blur-xl">
      {/* Azure brand band */}
      <div className="h-[3px] w-full bg-gradient-to-r from-azure via-[#1490df] to-azure-light" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-3 py-3.5">

          {/* Logo */}
          <a href="./" className="flex items-center gap-3 shrink-0 group">
            <div className="relative">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br from-azure to-azure-light shadow-fluent-8">
                <Cloud className="w-5 h-5 text-white fill-white" strokeWidth={2} />
              </div>
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-ga rounded-full border-2 border-surface-2 animate-pulse-slow" />
            </div>
            <div className="leading-tight">
              <div className="flex items-baseline gap-1.5 font-display">
                <span className="text-base font-bold tracking-tight text-accent">DevOps</span>
                <span className="text-base font-bold tracking-tight text-heading">Captain</span>
              </div>
              <p className="text-[11px] text-muted font-semibold tracking-[0.14em] uppercase">
                Azure What's New
              </p>
            </div>
          </a>

          {/* Search: full width on its own row on mobile, centered inline on larger screens */}
          <div className="order-last sm:order-none w-full sm:w-auto sm:flex-1 flex justify-center sm:px-4">
            <SearchBar query={query} onChange={onSearch} resultCount={resultCount} />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 shrink-0 ml-auto sm:ml-0">
            <a
              href="https://www.microsoft.com/releasecommunications/api/v2/azure/rss"
              target="_blank"
              rel="noopener noreferrer"
              className={iconBtn}
              title="Azure Updates RSS feed"
              aria-label="Azure Updates RSS feed"
            >
              <Rss className="w-4 h-4" />
            </a>
            <a
              href="https://github.com/devopscaptain"
              target="_blank"
              rel="noopener noreferrer"
              className={iconBtn}
              title="GitHub"
              aria-label="GitHub"
            >
              <Github className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Stats bar */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pb-3 text-xs">
          <span className="flex items-center gap-2">
            <span className="status-chip inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border font-semibold"
              style={{ '--c': 'var(--c-ga)' } as React.CSSProperties}>
              <span className="w-1.5 h-1.5 rounded-full bg-ga animate-pulse-slow" />
              {newCount} NEW
            </span>
            <span className="text-muted">this week</span>
          </span>
          <span className="text-muted">
            <span className="text-body font-semibold">{totalCount.toLocaleString()}</span> updates
          </span>
          {lastUpdated && (
            <span className="flex items-center gap-1.5 text-muted sm:ml-auto">
              <RefreshCw className="w-3 h-3" />
              Synced {lastSynced(lastUpdated)}
            </span>
          )}
        </div>
      </div>
    </header>
  )
}
