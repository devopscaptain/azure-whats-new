import { useRef, useEffect, useCallback } from 'react'
import { Search, X } from 'lucide-react'

interface SearchBarProps {
  query: string
  onChange: (q: string) => void
  resultCount: number
}

export function SearchBar({ query, onChange, resultCount }: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value
      if (debounceRef.current) clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(() => onChange(val), 180)
    },
    [onChange]
  )

  // Keyboard shortcut: Cmd/Ctrl+K to focus, Escape to clear
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        inputRef.current?.focus()
      }
      if (e.key === 'Escape' && document.activeElement === inputRef.current) {
        inputRef.current?.blur()
        if (inputRef.current) inputRef.current.value = ''
        onChange('')
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onChange])

  return (
    <div className="relative w-full max-w-xl">
      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
      <input
        ref={inputRef}
        type="search"
        defaultValue={query}
        onChange={handleChange}
        placeholder="Search Azure updates…"
        aria-label="Search Azure updates"
        className="
          w-full bg-white border border-border-bright rounded-md
          pl-10 pr-20 py-2 text-sm text-body placeholder:text-muted
          border-b-2
          focus:outline-none focus:border-b-accent
          transition-colors duration-150
          [&::-webkit-search-cancel-button]:hidden
        "
      />
      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
        {query && (
          <>
            <span className="text-xs text-muted tabular-nums">{resultCount}</span>
            <button
              onClick={() => { onChange(''); if (inputRef.current) inputRef.current.value = '' }}
              className="text-muted hover:text-body transition-colors"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </>
        )}
        {!query && (
          <kbd className="hidden sm:flex items-center gap-0.5 px-1.5 py-0.5 bg-surface-2 border border-border rounded text-xs text-muted font-mono">
            ⌘K
          </kbd>
        )}
      </div>
    </div>
  )
}
