export const normalizeMediaUrl = (input: unknown, fallback: string) => {
  if (!input || typeof input !== 'string') return fallback

  if (input.startsWith('/media/')) {
    return `/api${input}`
  }

  if (input.startsWith('http://') || input.startsWith('https://')) {
    try {
      const url = new URL(input)
      if (url.pathname.startsWith('/media/')) {
        return `/api${url.pathname}${url.search}`
      }
    } catch {
      // Keep the original string when URL parsing fails.
    }
  }

  return input
}
