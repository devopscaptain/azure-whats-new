export function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5" aria-busy="true" aria-label="Loading updates">
      {Array.from({ length: 9 }).map((_, i) => (
        <div
          key={i}
          className="bg-surface border border-border rounded-lg overflow-hidden shadow-fluent-2 animate-pulse"
          style={{ animationDelay: `${i * 0.05}s` }}
        >
          <div className="h-[3px] bg-accent/30" />
          <div className="p-5 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <div className="h-5 w-24 rounded bg-surface-2" />
              <div className="h-5 w-12 rounded bg-surface-2" />
            </div>
            <div className="space-y-1.5">
              <div className="h-4 rounded bg-surface-2 w-full" />
              <div className="h-4 rounded bg-surface-2 w-4/5" />
            </div>
            <div className="space-y-1.5">
              <div className="h-3 rounded bg-surface-2 w-full" />
              <div className="h-3 rounded bg-surface-2 w-full" />
              <div className="h-3 rounded bg-surface-2 w-2/3" />
            </div>
            <div className="flex gap-1.5">
              <div className="h-5 w-20 rounded bg-surface-2" />
              <div className="h-5 w-16 rounded bg-surface-2" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
