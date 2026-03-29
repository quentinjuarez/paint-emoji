#!/usr/bin/env node
/**
 * Fetches all custom Slack emojis via emoji.adminList and regenerates
 * packages/shared/src/assets/data/custom-emojis.json
 *
 * Usage:
 *   node scripts/generate-custom-emojis-json.mjs --token xoxc-... --cookie-d xoxd-...
 *   node scripts/generate-custom-emojis-json.mjs --token xoxc-... --cookie-d xoxd-... --count 100 --delay 500
 *
 * Options:
 *   --token     Slack xoxc token (required, or SLACK_TOKEN env var)
 *   --cookie-d  Slack d cookie value (required, or SLACK_COOKIE_D env var)
 *   --cookie-b  Slack b cookie value (optional, or SLACK_COOKIE_B env var)
 *   --team-id   Slack team ID (default: TSTD7B5L5)
 *   --origin    Slack workspace origin (default: https://maydayfamily.slack.com)
 *   --count     Number of emojis per page (default: 100)
 *   --delay     Delay in ms between page requests (default: 300)
 */

import { writeFileSync, mkdirSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT_FILE = resolve(__dirname, '../packages/shared/src/assets/data/custom-emojis.json')

const args = process.argv.slice(2)
const getArg = (flag, fallback) => {
  const idx = args.indexOf(flag)
  return idx !== -1 && args[idx + 1] ? args[idx + 1] : fallback
}

const TOKEN = getArg('--token', process.env.SLACK_TOKEN ?? '')
const COOKIE_D = getArg('--cookie-d', process.env.SLACK_COOKIE_D ?? '')
const COOKIE_B = getArg('--cookie-b', process.env.SLACK_COOKIE_B ?? '')
const TEAM_ID = getArg('--team-id', 'TSTD7B5L5')
const ORIGIN = getArg('--origin', 'https://maydayfamily.slack.com')
const COUNT = parseInt(getArg('--count', '100'), 10)
const DELAY_MS = parseInt(getArg('--delay', '300'), 10)

if (!TOKEN) {
  console.error('Error: --token is required (or set SLACK_TOKEN env var)')
  process.exit(1)
}
if (!COOKIE_D) {
  console.error('Error: --cookie-d is required (or set SLACK_COOKIE_D env var)')
  process.exit(1)
}

const API_URL = `${ORIGIN}/api/emoji.adminList?_x_id=copilot-script&slack_route=${TEAM_ID}&_x_version_ts=noversion&fp=4a&_x_num_retries=0`

function buildCookieHeader() {
  const parts = []
  if (COOKIE_B) parts.push(`b=${COOKIE_B.startsWith('.') ? COOKIE_B : '.' + COOKIE_B}`)
  parts.push(`d=${COOKIE_D}`)
  return parts.join('; ')
}

const BASE_HEADERS = {
  accept: '*/*',
  'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8,fr;q=0.7',
  'cache-control': 'no-cache',
  cookie: buildCookieHeader(),
  origin: ORIGIN,
  pragma: 'no-cache',
  'user-agent':
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36'
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

function buildFormData(page) {
  const boundary = '----WebKitFormBoundaryfG9bfWLefjzgqwkm'
  const fields = [
    ['token', TOKEN],
    ['page', String(page)],
    ['count', String(COUNT)],
    ['sort_by', 'created'],
    ['sort_dir', 'desc'],
    ['_x_reason', 'customize-emoji-next-page'],
    ['_x_mode', 'online']
  ]
  const body = fields
    .map(
      ([name, value]) =>
        `--${boundary}\r\nContent-Disposition: form-data; name="${name}"\r\n\r\n${value}`
    )
    .join('\r\n')
  return {
    body: `${body}\r\n--${boundary}--\r\n`,
    contentType: `multipart/form-data; boundary=${boundary}`
  }
}

async function fetchPage(page) {
  const { body, contentType } = buildFormData(page)
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { ...BASE_HEADERS, 'content-type': contentType },
    body
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`)
  const json = await res.json()
  if (!json.ok) throw new Error(`Slack API error: ${json.error ?? JSON.stringify(json)}`)
  return json
}

async function main() {
  console.log(`\nSlack custom emoji fetcher (emoji.adminList)`)
  console.log(`  Team:    ${TEAM_ID}`)
  console.log(`  Count:   ${COUNT} per page`)
  console.log(`  Delay:   ${DELAY_MS} ms`)
  console.log(`  Output:  packages/shared/src/assets/data/custom-emojis.json\n`)

  process.stdout.write(`Fetching page 1... `)
  const first = await fetchPage(1)
  const totalPages = first.paging?.pages ?? 1
  const total = first.paging?.total ?? first.emoji?.length ?? 0
  const allEmojis = [...(first.emoji ?? [])]
  process.stdout.write(`${allEmojis.length} emojis — total: ${total} across ${totalPages} pages\n`)

  for (let page = 2; page <= totalPages; page++) {
    await sleep(DELAY_MS)
    process.stdout.write(`Fetching page ${page}/${totalPages}... `)
    try {
      const result = await fetchPage(page)
      const batch = result.emoji ?? []
      allEmojis.push(...batch)
      process.stdout.write(`${batch.length} emojis (total so far: ${allEmojis.length})\n`)
    } catch (err) {
      process.stdout.write(`FAILED: ${err.message}\n`)
      break
    }
  }

  // Sort alphabetically for a deterministic, diff-friendly output
  allEmojis.sort((a, b) => a.name.localeCompare(b.name))

  console.log(`\nSaving ${allEmojis.length} emojis...`)
  mkdirSync(resolve(__dirname, '../packages/shared/src/assets/data'), { recursive: true })
  writeFileSync(OUT_FILE, JSON.stringify({ emojis: allEmojis }, null, 2), 'utf-8')
  console.log(`Saved → packages/shared/src/assets/data/custom-emojis.json`)
}

main().catch((err) => {
  console.error('Fatal:', err)
  process.exit(1)
})
