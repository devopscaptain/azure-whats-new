#!/usr/bin/env node
import https from 'https'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { normalizeItem } from './normalize.js'
import { parseRSS } from './parse-rss.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUTPUT_PATH = path.join(__dirname, '..', 'public', 'data', 'whats-new.json')

// Primary: the JSON API behind azure.microsoft.com/updates (structured status/products/dates).
// Fallback: the official Azure Updates RSS feed (latest ~200 items).
const API_URL = 'https://www.microsoft.com/releasecommunications/api/v2/azure'
const RSS_URL = 'https://www.microsoft.com/releasecommunications/api/v2/azure/rss'
const PAGE_SIZE = 100
const MAX_ITEMS = 500
const MAX_RETRIES = 3

function fetchURL(url, retries = MAX_RETRIES) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, {
      timeout: 20000,
      headers: { 'User-Agent': 'azure-whats-new (+https://github.com/devopscaptain)' },
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchURL(new URL(res.headers.location, url).href, retries).then(resolve).catch(reject)
      }
      if (res.statusCode !== 200) {
        res.resume()
        return reject(new Error(`HTTP ${res.statusCode} for ${url}`))
      }
      const chunks = []
      res.on('data', (chunk) => chunks.push(chunk))
      res.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8').replace(/^﻿/, '')))
      res.on('error', reject)
    })
    req.on('timeout', () => {
      req.destroy()
      reject(new Error('Request timed out'))
    })
    req.on('error', reject)
  }).catch((err) => {
    if (retries > 0) {
      const delay = (MAX_RETRIES - retries + 1) * 2000
      console.warn(`  Retry in ${delay}ms (${retries} left): ${err.message}`)
      return new Promise((r) => setTimeout(r, delay)).then(() => fetchURL(url, retries - 1))
    }
    throw err
  })
}

async function fetchFromApi() {
  const items = []
  for (let skip = 0; skip < MAX_ITEMS; skip += PAGE_SIZE) {
    const url = `${API_URL}?$top=${PAGE_SIZE}&$skip=${skip}&$orderby=${encodeURIComponent('modified desc')}`
    const page = JSON.parse(await fetchURL(url))
    const records = page.value ?? []
    for (const r of records) {
      if (!r.id || !r.title) continue
      items.push(normalizeItem({
        id: r.id,
        title: r.title,
        description: r.description,
        rawStatus: r.status,
        categories: r.productCategories ?? [],
        products: r.products ?? [],
        updateTypes: r.tags ?? [],
        created: r.created,
        modified: r.modified,
        gaDate: r.generalAvailabilityDate,
        previewDate: r.previewAvailabilityDate,
      }))
    }
    if (records.length < PAGE_SIZE) break
  }
  if (items.length === 0) throw new Error('API returned no items')
  return items
}

async function main() {
  console.log("→ Fetching Azure What's New...")

  let newItems
  let source
  try {
    newItems = await fetchFromApi()
    source = 'api'
  } catch (err) {
    console.warn(`  API failed (${err.message}), falling back to RSS`)
    newItems = parseRSS(await fetchURL(RSS_URL))
    source = 'rss'
  }
  console.log(`  Got ${newItems.length} items from ${source}`)

  // Merge with existing data so history survives beyond the source window
  let existingItems = []
  if (fs.existsSync(OUTPUT_PATH)) {
    try {
      existingItems = JSON.parse(fs.readFileSync(OUTPUT_PATH, 'utf-8')).items ?? []
    } catch {
      console.warn('  Could not read existing data, starting fresh')
    }
  }

  // Deduplicate by id; fresh items win, but keep API-only fields if RSS was the source
  const byId = new Map(existingItems.map((i) => [i.id, i]))
  for (const item of newItems) {
    const prev = byId.get(item.id)
    byId.set(item.id, prev && source === 'rss'
      ? { ...item, gaDate: prev.gaDate, previewDate: prev.previewDate }
      : item)
  }

  const items = [...byId.values()]
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, MAX_ITEMS)

  const feed = {
    lastUpdated: new Date().toISOString(),
    source,
    itemCount: items.length,
    items,
  }

  // Atomic write: write to .tmp then rename
  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true })
  const tmp = OUTPUT_PATH + '.tmp'
  fs.writeFileSync(tmp, JSON.stringify(feed, null, 2), 'utf-8')
  fs.renameSync(tmp, OUTPUT_PATH)

  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
  console.log(`✓ Wrote ${items.length} items to public/data/whats-new.json`)
  console.log(`  Updated this week: ${items.filter((i) => new Date(i.updatedAt) > weekAgo).length}`)
}

main().catch((err) => {
  console.error('✗ Fetch failed:', err.message)
  process.exit(1)
})
