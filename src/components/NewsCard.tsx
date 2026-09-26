import { motion } from 'framer-motion'
import { ExternalLink, Calendar, Zap } from 'lucide-react'
import { TagBadge } from './TagBadge'
import { relativeTime, fullDate, monthYear } from '../utils/dateUtils'
import { STATUS_META, statusStyle, statusColor } from '../utils/colorUtils'
import type { WhatsNewItem } from '../types/news'

interface NewsCardProps {
  item: WhatsNewItem
  index: number
}

export const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: Math.min((i % 30) * 0.025, 0.4),
      duration: 0.35,
      ease: [0.1, 0.9, 0.2, 1], // Fluent "decelerate"
    },
  }),
  exit: { opacity: 0, scale: 0.97, transition: { duration: 0.15 } },
}

function availability(item: WhatsNewItem): string | null {
  if (item.gaDate) return `GA · ${monthYear(item.gaDate)}`
  if (item.previewDate) return `Preview · ${monthYear(item.previewDate)}`
  return null
}

export function NewsCard({ item, index }: NewsCardProps) {
  const meta = STATUS_META[item.status]
  const avail = availability(item)

  return (
    <motion.a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      custom={index}
      className="group relative flex flex-col rounded-lg overflow-hidden bg-surface border border-border shadow-fluent-2
        hover:shadow-fluent-16 hover:border-accent/40 hover:-translate-y-0.5 transition-[box-shadow,border-color,transform] duration-200"
    >
      {/* Status accent bar */}
      <div className="h-[3px] w-full shrink-0" style={{ background: statusColor(item.status) }} />

      <div className="relative flex flex-col gap-3.5 p-5 flex-1">

        {/* Header row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="status-chip inline-flex items-center px-2 py-0.5 rounded border text-xs font-semibold"
              style={statusStyle(item.status)}>
              {meta.label}
            </span>
            {item.isNew && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold text-white bg-azure">
                <Zap className="w-3 h-3 fill-current" />
                NEW
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted shrink-0 whitespace-nowrap mt-0.5">
            <Calendar className="w-3.5 h-3.5" />
            <time dateTime={item.updatedAt} title={fullDate(item.updatedAt)}>{relativeTime(item.updatedAt)}</time>
          </div>
        </div>

        {/* Title */}
        <h2 className="font-display text-[15px] font-semibold leading-snug line-clamp-3 text-heading group-hover:text-accent transition-colors duration-150">
          {item.title}
        </h2>

        {/* Description */}
        <p className="text-sm leading-relaxed line-clamp-4 flex-1 text-muted">
          {item.description}
        </p>

        {/* Products */}
        {item.services.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap pt-3 border-t border-border">
            {item.services.slice(0, 4).map((svc) => (
              <TagBadge key={svc} tag={svc} active size="sm" />
            ))}
            {item.services.length > 4 && (
              <span className="text-xs text-muted">+{item.services.length - 4}</span>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-5 py-2.5 border-t border-border bg-surface-2/60 flex items-center justify-between gap-2 text-xs">
        <span className="text-muted truncate">
          {avail ?? item.categories[0] ?? fullDate(item.updatedAt)}
        </span>
        <span className="flex items-center gap-1 font-semibold text-accent shrink-0 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-150">
          Learn more <ExternalLink className="w-3 h-3" />
        </span>
      </div>
    </motion.a>
  )
}
