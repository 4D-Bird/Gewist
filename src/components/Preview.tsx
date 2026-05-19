import React, { useMemo } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { Components } from 'react-markdown'
import { slugify } from '../lib/markdown'

// ── Utility ──────────────────────────────────────────────────────────────────

function nodeToText(node: React.ReactNode): string {
  if (node === null || node === undefined) return ''
  if (typeof node === 'string') return node
  if (typeof node === 'number' || typeof node === 'boolean') return String(node)
  if (Array.isArray(node)) return node.map(nodeToText).join('')
  if (React.isValidElement(node)) {
    return nodeToText((node.props as { children?: React.ReactNode }).children)
  }
  return ''
}

// ── Custom heading components that add stable anchor IDs ─────────────────────
// IDs are derived with the same slugify() used in extractToc() so that
// TOC links and rendered headings always stay in sync.

type HeadingTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
const HEADING_TAGS: Record<number, HeadingTag> = {
  1: 'h1', 2: 'h2', 3: 'h3', 4: 'h4', 5: 'h5', 6: 'h6',
}

function makeHeading(level: 1 | 2 | 3 | 4 | 5 | 6) {
  const Tag = HEADING_TAGS[level]
  return function Heading({ children }: { children?: React.ReactNode }) {
    const id = useMemo(() => slugify(nodeToText(children)), [children])
    return <Tag id={id}>{children}</Tag>
  }
}

const headingComponents = {
  h1: makeHeading(1),
  h2: makeHeading(2),
  h3: makeHeading(3),
  h4: makeHeading(4),
  h5: makeHeading(5),
  h6: makeHeading(6),
} satisfies Partial<Components>

// Only allow safe URL schemes; reject javascript:, data:, vbscript:, etc.
const SAFE_HREF = /^(https?:\/\/|mailto:|ftp:\/\/|\/|#)/i

const linkComponent: Components['a'] = ({ href, children, ...props }) => {
  const safeHref = href && SAFE_HREF.test(href) ? href : undefined
  const isExternal = safeHref?.startsWith('http')
  return (
    <a
      href={safeHref}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      {...props}
    >
      {children}
    </a>
  )
}

const components: Partial<Components> = {
  ...headingComponents,
  a: linkComponent,
}

// ── Component ─────────────────────────────────────────────────────────────────

interface PreviewProps {
  content: string
  isDark: boolean
}

export default function Preview({ content, isDark }: PreviewProps) {
  return (
    <div
      id="preview-pane"
      className={`h-full overflow-auto ${isDark ? 'bg-[#282c34]' : 'bg-white'}`}
    >
      <div
        className={[
          'prose max-w-3xl mx-auto py-10 px-10',
          isDark ? 'prose-invert' : 'prose-slate',
        ].join(' ')}
      >
        <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
          {content}
        </ReactMarkdown>
      </div>
    </div>
  )
}
