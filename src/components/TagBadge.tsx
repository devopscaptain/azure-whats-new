interface TagBadgeProps {
  tag: string
  active?: boolean
  size?: 'sm' | 'md'
}

export function TagBadge({ tag, active = false, size = 'sm' }: TagBadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center border rounded font-medium
        ${size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'}
        ${active ? 'bg-surface-2 text-accent-bright border-border-bright' : 'bg-surface-2 text-muted border-border'}
      `}
    >
      {tag}
    </span>
  )
}
