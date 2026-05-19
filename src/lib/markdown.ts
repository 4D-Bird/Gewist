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
    // Strip any trailing `#` characters and inline markup for display text
    const raw = match[2].replace(/\s+#+\s*$/, '').trim()
    const base = slugify(raw)

    const count = usedSlugs.get(base) ?? 0
    const id = count === 0 ? base : `${base}-${count}`
    usedSlugs.set(base, count + 1)

    entries.push({ id, text: raw, level })
  }

  return entries
}

/** Count words in Markdown text (strips code blocks for accuracy). */
export function countWords(text: string): number {
  const cleaned = text
    .replace(/```[\s\S]*?```/g, '')  // fenced code blocks
    .replace(/`[^`]+`/g, '')         // inline code
  const words = cleaned.match(/[^\s]+/g)
  return words ? words.length : 0
}
