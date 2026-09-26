export type UpdateStatus = 'ga' | 'preview' | 'development' | 'retiring' | 'update'

export interface WhatsNewItem {
  id: string
  title: string
  description: string
  url: string
  publishedAt: string
  updatedAt: string
  status: UpdateStatus
  categories: string[]
  services: string[]
  updateTypes: string[]
  gaDate: string | null
  previewDate: string | null
  tags: string[]
  // Computed client-side so it stays accurate between data syncs
  isNew: boolean
}

export interface WhatsNewFeed {
  lastUpdated: string
  source: 'api' | 'rss'
  itemCount: number
  items: WhatsNewItem[]
}
