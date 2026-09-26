// Shared normalization for Azure update records, whichever source they came from.

// Azure's own product-area taxonomy (azure.microsoft.com/products). Anything in a
// raw category list that matches one of these is a product area; the rest are
// products or update types.
export const PRODUCT_AREAS = new Set([
  'AI + machine learning', 'Analytics', 'Compute', 'Containers', 'Databases',
  'DevOps', 'Developer tools', 'Hybrid + multicloud', 'Identity', 'Integration',
  'Internet of Things', 'Management and governance', 'Media', 'Migration',
  'Mixed reality', 'Mobile', 'Networking', 'Security', 'Storage',
  'Virtual desktop infrastructure', 'Web', 'Microsoft Foundry',
])

// Update-type tags Azure attaches to each announcement
export const UPDATE_TYPES = new Set([
  'Feature', 'Features', 'Services', 'Retirements', 'Announcement', 'Compliance',
  'Management', 'Pricing & Offerings', 'Regions & Datacenters', 'SDK and Tools',
  'Open Source', 'Operating System', 'Gallery', 'Microsoft Build', 'Microsoft Ignite',
  'Microsoft Inspire', 'Customer Stories', 'Security',
])

export const STATUSES = new Set(['Launched', 'In preview', 'In development'])

export function decodeEntities(str) {
  return str
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&rsquo;|&lsquo;/g, "'")
    .replace(/&ldquo;|&rdquo;/g, '"')
    .replace(/&ndash;/g, '–')
    .replace(/&mdash;/g, '—')
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&amp;/g, '&')
}

export function stripHtml(html) {
  return decodeEntities(html ?? '')
    .replace(/<\/(p|li|h\d)>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/\s+([.,;:!?])/g, '$1')
    .trim()
}

// Map Azure's status + tags onto a small, filterable set
function deriveStatus(rawStatus, updateTypes, title) {
  if (updateTypes.includes('Retirements') || /^retirement/i.test(title)) return 'retiring'
  if (rawStatus === 'Launched') return 'ga'
  if (rawStatus === 'In preview') return 'preview'
  if (rawStatus === 'In development') return 'development'
  return 'update'
}

// "[Launched] Generally Available: Foo" → "Generally Available: Foo"
function cleanTitle(title) {
  return decodeEntities(title).replace(/^\s*\[[^\]]+\]\s*/, '').trim()
}

function normalizeUpdateTypes(tags) {
  return [...new Set(tags.map((t) => (t === 'Features' ? 'Feature' : t)))]
}

export function normalizeItem({
  id, title, description, rawStatus, categories, products, updateTypes,
  created, modified, gaDate, previewDate,
}) {
  const types = normalizeUpdateTypes(updateTypes)
  const cleanedTitle = cleanTitle(title)
  const status = deriveStatus(rawStatus, types, cleanedTitle)
  const cats = [...new Set(categories)]
  const svcs = [...new Set(products)]

  return {
    id: String(id),
    title: cleanedTitle,
    description: stripHtml(description).slice(0, 600),
    url: `https://azure.microsoft.com/updates?id=${encodeURIComponent(id)}`,
    publishedAt: new Date(created).toISOString(),
    updatedAt: new Date(modified ?? created).toISOString(),
    status,
    categories: cats,
    services: svcs,
    updateTypes: types,
    gaDate: gaDate ?? null,
    previewDate: previewDate ?? null,
    tags: [...new Set([...cats, ...svcs, ...types].map((t) => t.toLowerCase()))],
  }
}
