export interface TocEntry {
  id: string
  text: string
  level: number
}

/**
 * Convert a heading text to a URL-friendly slug.
 * Matches the behaviour used by the custom heading components in Preview.tsx
 * so TOC anchors and rendered IDs stay in sync.
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')   // strip non-word chars except spaces and hyphens
    .replace(/[\s_]+/g, '-')    // spaces / underscores → hyphen
    .replace(/^-+|-+$/g, '')    // trim leading / trailing hyphens
}

/**
 * Parse all ATX headings (# … ######) from raw Markdown and return
 * a flat list of TOC entries with de-duplicated IDs.
 */
export function extractToc(markdown: string): TocEntry[] {
  const headingRegex = /^(#{1,6})\s+(.+)$/gm
  const entries: TocEntry[] = []
  const usedSlugs = new Map<string, number>()

  let match: RegExpExecArray | null
  while ((match = headingRegex.exec(markdown)) !== null) {
    const level = match[1].length
    // Strip any trailing `#` characters; preserve inline markup for display
    const raw = match[2].replace(/\s+#+\s*$/, '').trim()
    const base = slugify(raw)

    // Walk the counter until we find an ID not yet taken by any heading
    // (including naturally-occurring ones like "Foo-1" that could collide
    // with the de-duplicated form of a repeated "Foo").
    let n = usedSlugs.get(base) ?? 0
    let candidate = n === 0 ? base : `${base}-${n}`
    while (usedSlugs.has(candidate)) {
      n++
      candidate = `${base}-${n}`
    }
    usedSlugs.set(candidate, 0)   // mark this exact id as taken
    usedSlugs.set(base, n + 1)    // advance the counter for next duplicate

    entries.push({ id: candidate, text: raw, level })
  }

  return entries
}

/** Count words in Markdown text (strips code blocks and link URLs for accuracy). */
export function countWords(text: string): number {
  const cleaned = text
    .replace(/```[\s\S]*?```/g, '')           // fenced code blocks
    .replace(/`[^`]+`/g, '')                  // inline code
    .replace(/!\[[^\]]*\]\([^)]+\)/g, '')     // images (not words)
    .replace(/\[([^\]]*)\]\([^)]+\)/g, '$1') // links → keep label text, drop URL
  const words = cleaned.match(/\S+/g)
  return words ? words.length : 0
}
