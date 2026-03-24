#!/usr/bin/env node
/**
 * Fetches trending emotes from 7tv.app API and generates src/assets/data/masks.json
 *
 * Usage:
 *   node scripts/generate-masks-json.mjs
 *   node scripts/generate-masks-json.mjs --count 500 --sort TRENDING_WEEKLY
 *   node scripts/generate-masks-json.mjs --count 200 --sort TOP_ALL_TIME
 *
 * Options:
 *   --count  Total number of emotes to fetch (default: 500)
 *   --sort   SortBy: TRENDING_WEEKLY | TOP_ALL_TIME | NEWEST (default: TRENDING_WEEKLY)
 *   --delay  Delay in ms between requests (default: 300)
 */

import { writeFileSync, mkdirSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT_FILE = resolve(__dirname, '../src/assets/data/masks.json')

const args = process.argv.slice(2)
const getArg = (flag, fallback) => {
  const idx = args.indexOf(flag)
  return idx !== -1 && args[idx + 1] ? args[idx + 1] : fallback
}

const COUNT = parseInt(getArg('--count', '500'), 10)
const SORT_BY = getArg('--sort', 'TRENDING_WEEKLY')
const DELAY_MS = parseInt(getArg('--delay', '300'), 10)
const PER_PAGE = 100

const API_URL = 'https://api.7tv.app/v4/gql'

const QUERY = `
query EmoteSearch($query: String, $tags: [String!]!, $sortBy: SortBy!, $filters: Filters, $page: Int, $perPage: Int!) {
  emotes {
    search(
      query: $query
      tags: {tags: $tags, match: ANY}
      sort: {sortBy: $sortBy, order: DESCENDING}
      filters: $filters
      page: $page
      perPage: $perPage
    ) {
      items {
        id
        defaultName
        tags
        deleted
        flags { publicListed }
        imagesPending
        images {
          url
          mime
          size
          scale
          width
          frameCount
        }
        ranking(ranking: TRENDING_WEEKLY)
      }
      totalCount
      pageCount
    }
  }
}
`

const HEADERS = {
  accept: 'application/graphql-response+json, application/json',
  'content-type': 'application/json',
  origin: 'https://7tv.app',
  referer: 'https://7tv.app/',
  'user-agent':
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36'
}

async function fetchPage(page) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: HEADERS,
    body: JSON.stringify({
      operationName: 'EmoteSearch',
      query: QUERY,
      variables: {
        filters: {
          defaultZeroWidth: true
        },
        page,
        perPage: PER_PAGE,
        query: null,
        sortBy: SORT_BY,
        tags: []
      }
    })
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`)
  const json = await res.json()
  if (json.errors) throw new Error(`GraphQL: ${JSON.stringify(json.errors)}`)
  return json.data.emotes.search
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

// ── Parse emote from API response ─────────────────────────────────────────────
function parseEmote(item) {
  // Group images by scale, keep all scales
  const images = item.images
    .filter(
      (img) => img.mime === 'image/gif' || img.mime === 'image/png' || img.mime === 'image/webp'
    )
    .map((img) => ({
      scale: img.scale,
      url: img.url,
      width: img.width,
      frameCount: img.frameCount,
      mime: img.mime
    }))
    .sort((a, b) => a.scale - b.scale)

  const animated = images.some((img) => img.frameCount > 1)

  return {
    id: item.id,
    name: item.defaultName,
    tags: item.tags ?? [],
    animated,
    images
  }
}

async function main() {
  console.log(`\n7tv mask scraper`)
  console.log(`  Sort:    ${SORT_BY}`)
  console.log(`  Target:  ${COUNT} emotes`)
  console.log(`  Output:  src/assets/data/masks.json\n`)

  const maxPages = Math.ceil(COUNT / PER_PAGE)
  const allEmotes = []

  for (let page = 1; page <= maxPages; page++) {
    if (page > 1) await sleep(DELAY_MS)
    process.stdout.write(`Fetching page ${page}/${maxPages}... `)
    try {
      const result = await fetchPage(page)
      const parsed = result.items.map(parseEmote)
      allEmotes.push(...parsed)
      process.stdout.write(`${parsed.length} emotes (total: ${allEmotes.length})\n`)
    } catch (err) {
      process.stdout.write(`FAILED: ${err.message}\n`)
      break
    }
  }

  const trimmed = allEmotes.slice(0, COUNT)
  console.log(`\nSaving ${trimmed.length} emotes...`)

  mkdirSync(resolve(__dirname, '../src/assets/data'), { recursive: true })
  writeFileSync(OUT_FILE, JSON.stringify(trimmed, null, 2), 'utf-8')
  console.log(`Saved → src/assets/data/masks.json`)
}

main().catch((err) => {
  console.error('Fatal:', err)
  process.exit(1)
})
