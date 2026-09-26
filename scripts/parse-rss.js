import { normalizeItem, PRODUCT_AREAS, UPDATE_TYPES, STATUSES, decodeEntities } from './normalize.js'

function extractTag(xml, tag) {
  const re = new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tag}>`, 'i')
  const m = xml.match(re)
  if (!m) return ''
  return m[1].replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').trim()
}

function extractAllTags(xml, tag) {
  const re = new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tag}>`, 'gi')
  const results = []
  let m
  while ((m = re.exec(xml)) !== null) {
    const val = m[1].replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').trim()
    if (val) results.push(decodeEntities(val))
  }
  return results
}

// The Azure RSS feed flattens status, product areas, products and update types
// into one <category> list, so split them back apart using the known taxonomies.
function splitCategories(raw) {
  let rawStatus = null
  const categories = []
  const products = []
  const updateTypes = []

  for (const c of raw) {
    if (STATUSES.has(c)) rawStatus = c
    else if (PRODUCT_AREAS.has(c)) categories.push(c)
    else if (UPDATE_TYPES.has(c)) updateTypes.push(c)
    else products.push(c)
  }
  return { rawStatus, categories, products, updateTypes }
}

export function parseRSS(xml) {
  const items = []
  const itemRegex = /<item>([\s\S]*?)<\/item>/gi
  let m

  while ((m = itemRegex.exec(xml)) !== null) {
    const raw = m[1]
    const id = extractTag(raw, 'guid')
    const title = extractTag(raw, 'title')
    if (!id || !title) continue

    const pubDate = extractTag(raw, 'pubDate')
    const updated = extractTag(raw, 'a10:updated')

    items.push(normalizeItem({
      id,
      title,
      description: extractTag(raw, 'description'),
      ...splitCategories(extractAllTags(raw, 'category')),
      created: pubDate || updated || new Date().toISOString(),
      modified: updated || pubDate || new Date().toISOString(),
    }))
  }

  return items
}
