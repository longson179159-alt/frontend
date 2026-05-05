// Small type for one caption track from YouTube player response.
type CaptionTrack = {
  // URL to download caption XML.
  baseUrl: string
  // Language code of this track (example: "en", "th").
  languageCode?: string
}

type CaptionFetchResult = {
  body: string
  format: 'xml' | 'json3' | 'vtt'
}

// Final output shape for each subtitle item.
export type TranscriptItem = {
  // Start time in seconds.
  start: number
  // Duration in seconds.
  duration: number
  // Subtitle text content.
  text: string
}

// STEP 1: Extract `videoId` from incoming YouTube URL.
function extractVideoId(videoUrl: string): string {
  // Parse the input URL safely.
  const url = new URL(videoUrl)

  // Handle short URL format: https://youtu.be/<id>
  if (url.hostname === 'youtu.be') {
    const shortId = url.pathname.split('/').filter(Boolean)[0]
    if (shortId) {
      return shortId
    }
  }

  // Handle watch URL format: https://www.youtube.com/watch?v=<id>
  const watchId = url.searchParams.get('v')
  if (watchId) {
    return watchId
  }

  // Split path for other formats like /embed/<id> or /shorts/<id>.
  const parts = url.pathname.split('/').filter(Boolean)

  // Handle embed URL format.
  const embedIndex = parts.indexOf('embed')
  if (embedIndex >= 0 && parts[embedIndex + 1]) {
    return parts[embedIndex + 1]
  }

  // Handle shorts URL format.
  const shortsIndex = parts.indexOf('shorts')
  if (shortsIndex >= 0 && parts[shortsIndex + 1]) {
    return parts[shortsIndex + 1]
  }

  // If no known pattern matched, stop here.
  throw new Error('Could not extract YouTube videoId from URL')
}

// STEP 2: Fetch YouTube watch-page HTML for one specific video.
async function fetchWatchPageHtml(videoId: string): Promise<string> {
  const response = await fetch(`https://www.youtube.com/watch?v=${videoId}`, {
    headers: {
      'Accept-Language': 'en-US,en;q=0.9'
    }
  })
  if (!response.ok) {
    throw new Error(`Failed to fetch YouTube watch page: ${response.status}`)
  }
  return response.text()
}

// STEP 3: Parse ytInitialPlayerResponse JSON from watch-page HTML.
function extractPlayerResponseFromWatchHtml(html: string): any {
  const match = html.match(/ytInitialPlayerResponse\s*=\s*(\{[\s\S]*?\});/)
  if (!match?.[1]) {
    throw new Error('ytInitialPlayerResponse not found in watch page HTML')
  }
  return JSON.parse(match[1])
}
// STEP 4: Read captionTracks from player response.
function getCaptionTracks(playerResponse: any): CaptionTrack[] {
  // Safely access nested path; return empty array if missing.
  return playerResponse?.captions?.playerCaptionsTracklistRenderer?.captionTracks ?? []
}

// STEP 5: Pick one caption track (prefer exact language match).
function pickCaptionTrack(tracks: CaptionTrack[], lang?: string): CaptionTrack {
  // No tracks means we cannot continue.
  if (!tracks.length) {
    throw new Error('No caption tracks found for this video')
  }

  // If no language requested, use first track.
  if (!lang) {
    return tracks[0]
  }

  // Try exact language code match (case-insensitive).
  const target = lang.toLowerCase()
  const exactTrack = tracks.find((track) => track.languageCode?.toLowerCase() === target)
  if (exactTrack) {
    return exactTrack
  }

  // Fallback: allow prefix match (example: "en" matches "en-US").
  const prefixTrack = tracks.find((track) => track.languageCode?.toLowerCase().startsWith(target))
  if (prefixTrack) {
    return prefixTrack
  }

  // Fallback to first track if exact match not found.
  return tracks[0]
}

// STEP 6: Fetch caption XML from selected track `baseUrl`.
async function fetchCaptionWithFallback(baseUrl: string): Promise<CaptionFetchResult> {
  const attempts: Array<{ format: CaptionFetchResult['format']; url: string }> = [
    { format: 'xml', url: baseUrl },
    { format: 'json3', url: `${baseUrl}&fmt=json3` },
    { format: 'vtt', url: `${baseUrl}&fmt=vtt` }
  ]
  const debug: string[] = []

  for (const attempt of attempts) {
    const response = await fetch(attempt.url)
    const contentType = response.headers.get('content-type') || 'unknown'

    if (!response.ok) {
      debug.push(`${attempt.format}: status=${response.status}, contentType=${contentType}`)
      continue
    }

    const body = await response.text()
    const bodyLength = body.trim().length
    if (bodyLength > 0) {
      return { body, format: attempt.format }
    }
    debug.push(`${attempt.format}: status=${response.status}, contentType=${contentType}, body=empty`)
  }

  throw new Error(
    `Failed to fetch caption content. All subtitle formats returned empty or failed. Details: ${debug.join(' | ')}`
  )
}

// Helper: decode common XML entities to normal text.
function decodeXmlText(text: string): string {
  return text
    // Convert escaped ampersand.
    .replace(/&amp;/g, '&')
    // Convert escaped less-than.
    .replace(/&lt;/g, '<')
    // Convert escaped greater-than.
    .replace(/&gt;/g, '>')
    // Convert escaped double quote.
    .replace(/&quot;/g, '"')
    // Convert escaped single quote (numeric entity).
    .replace(/&#39;/g, "'")
    // Convert escaped single quote (named entity).
    .replace(/&apos;/g, "'")
}

// STEP 7: Parse XML <text start="..." dur="..."> into transcript items.
function parseCaptionXml(xml: string): TranscriptItem[] {
  // Store parsed output.
  const items: TranscriptItem[] = []
  // Match each <text ...>...</text> block.
  const textTagRegex = /<text([^>]*)>([\s\S]*?)<\/text>/g

  // Loop through all text nodes.
  for (const match of xml.matchAll(textTagRegex)) {
    // Attributes part, example: start="1.2" dur="2.5"
    const attrs = match[1] ?? ''
    // Raw inner text from the XML node.
    const rawText = match[2] ?? ''

    // Extract start attribute.
    const startMatch = attrs.match(/start="([^"]+)"/)
    // Extract duration attribute.
    const durMatch = attrs.match(/dur="([^"]+)"/)

    // Convert to number; fallback to 0 if missing.
    const start = Number(startMatch?.[1] ?? '0')
    // Convert to number; fallback to 0 if missing.
    const duration = Number(durMatch?.[1] ?? '0')

    // Push one subtitle item.
    items.push({
      start,
      duration,
      // Decode entities so text is readable.
      text: decodeXmlText(rawText)
    })
  }

  // Return all parsed subtitle items.
  return items
}

// STEP 7 (fallback): Parse JSON3 caption payload into transcript items.
function parseCaptionJson3(json3: string): TranscriptItem[] {
  const payload = JSON.parse(json3)
  const events = Array.isArray(payload?.events) ? payload.events : []
  const items: TranscriptItem[] = []

  for (const event of events) {
    const segs = Array.isArray(event?.segs) ? event.segs : []
    const text = segs
      .map((seg: any) => String(seg?.utf8 ?? ''))
      .join('')
      .replace(/\n+/g, ' ')
      .trim()
    if (!text) {
      continue
    }

    const start = Number(event?.tStartMs ?? 0) / 1000
    const duration = Number(event?.dDurationMs ?? 0) / 1000
    items.push({ start, duration, text })
  }

  return items
}

function parseVttTimestamp(value: string): number {
  const match = value.trim().match(/(?:(\d+):)?(\d{2}):(\d{2})\.(\d{3})/)
  if (!match) {
    return 0
  }

  const hours = Number(match[1] ?? '0')
  const minutes = Number(match[2] ?? '0')
  const seconds = Number(match[3] ?? '0')
  const millis = Number(match[4] ?? '0')
  return hours * 3600 + minutes * 60 + seconds + millis / 1000
}

// STEP 7 (fallback): Parse VTT into transcript items.
function parseCaptionVtt(vtt: string): TranscriptItem[] {
  const normalized = vtt.replace(/\r/g, '')
  const blocks = normalized.split('\n\n')
  const items: TranscriptItem[] = []

  for (const block of blocks) {
    const lines = block
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
    if (!lines.length) {
      continue
    }

    const timeLineIndex = lines.findIndex((line) => line.includes('-->'))
    if (timeLineIndex < 0) {
      continue
    }

    const timeLine = lines[timeLineIndex]
    const timing = timeLine.match(/(.+?)\s+-->\s+(.+?)(?:\s|$)/)
    if (!timing?.[1] || !timing?.[2]) {
      continue
    }

    const start = parseVttTimestamp(timing[1])
    const end = parseVttTimestamp(timing[2])
    const duration = Math.max(0, end - start)
    const text = lines
      .slice(timeLineIndex + 1)
      .join(' ')
      .trim()

    if (!text) {
      continue
    }

    items.push({ start, duration, text })
  }

  return items
}

function parseCaptionByFormat(payload: CaptionFetchResult): TranscriptItem[] {
  if (payload.format === 'json3') {
    return parseCaptionJson3(payload.body)
  }
  if (payload.format === 'vtt') {
    return parseCaptionVtt(payload.body)
  }
  return parseCaptionXml(payload.body)
}

// Public function: run STEP 1 -> STEP 7 in order.
export async function getTranscript(videoUrl: string, lang?: string): Promise<TranscriptItem[]> {
  // STEP 1
  const videoId = extractVideoId(videoUrl)
  // STEP 2
  const watchHtml = await fetchWatchPageHtml(videoId)
  // STEP 2
  // STEP 3
  const playerResponse = extractPlayerResponseFromWatchHtml(watchHtml)
  // STEP 4
  const captionTracks = getCaptionTracks(playerResponse)
  // STEP 5
  const selectedTrack = pickCaptionTrack(captionTracks, lang)
  // STEP 6
  const captionPayload = await fetchCaptionWithFallback(selectedTrack.baseUrl)
  // STEP 7
  const items = parseCaptionByFormat(captionPayload)
  if (!items.length) {
    throw new Error(`Caption content was downloaded as ${captionPayload.format} but parsed to 0 transcript items`)
  }
  return items
}
