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
function pickImages(byScale, targetMime, preferAnimated) {
  return Object.keys(byScale)
    .map(Number)
    .sort((a, b) => a - b)
    .map((scale) => {
      const variants = byScale[scale]
      const webpVariants = variants.filter((i) => i.mime === targetMime)

      let pick
      if (webpVariants.length > 1) {
        // For WebP: prefer animated (frameCount > 1) or static depending on emote type
        pick = preferAnimated
          ? (webpVariants.find((i) => i.frameCount > 1) ?? webpVariants[0])
          : (webpVariants.find((i) => i.frameCount === 1) ?? webpVariants[0])
      } else {
        pick = webpVariants[0] ?? variants[0]
      }

      return {
        scale: pick.scale,
        url: pick.url,
        width: pick.width,
        frameCount: pick.frameCount,
        mime: pick.mime
      }
    })
}

function parseEmote(item) {
  const animated = item.images.some((img) => img.frameCount > 1)

  // Group by scale
  const byScale = {}
  for (const img of item.images) {
    const s = img.scale
    if (!byScale[s]) byScale[s] = []
    byScale[s].push(img)
  }

  // images: gif for animated, png for static (existing behaviour — no change)
  const targetMime = animated ? 'image/gif' : 'image/png'
  const images = pickImages(byScale, targetMime, false)

  // imagesBeta: animated webp for animated emotes, static webp for static emotes
  const imagesBeta = pickImages(byScale, 'image/webp', animated)

  return {
    id: item.id,
    name: item.defaultName,
    tags: item.tags ?? [],
    animated,
    images,
    imagesBeta
  }
}

async function main() {
  console.log(`\n7tv mask scraper`)
  console.log(`  Filter:  defaultZeroWidth=true (overlay emotes only)`)
  console.log(`  Sort:    ${SORT_BY}`)
  console.log(`  Target:  ${COUNT} emotes`)
  console.log(`  Output:  src/assets/data/masks.json\n`)

  // Fetch page 1 first to discover totalCount and pageCount from the API
  process.stdout.write(`Fetching page 1... `)
  const firstResult = await fetchPage(1)
  const apiTotal = firstResult.totalCount
  const apiPageCount = firstResult.pageCount
  const allEmotes = firstResult.items.map(parseEmote)
  process.stdout.write(
    `${allEmotes.length} emotes — API total: ${apiTotal} across ${apiPageCount} pages\n`
  )

  // Never request more pages than the API has
  const wantedPages = Math.ceil(COUNT / PER_PAGE)
  const maxPages = Math.min(wantedPages, apiPageCount)

  if (maxPages < wantedPages) {
    console.log(`  ⚠  Only ${apiTotal} emotes available with this filter (requested ${COUNT})`)
  }

  for (let page = 2; page <= maxPages; page++) {
    await sleep(DELAY_MS)
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
