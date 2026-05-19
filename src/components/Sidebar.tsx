import ReactMarkdown from 'react-markdown'
import type { TocEntry } from '../lib/markdown'
import { useStore } from '../store/useStore'

interface SidebarProps {
  entries: TocEntry[]
  // isDark is read directly from the store
}

// Render heading text with inline markdown (bold, italic, code, strikethrough).
// The <p> wrapper react-markdown adds by default is stripped via the component override.
const InlineMarkdown = ({ text }: { text: string }) => (
  <ReactMarkdown components={{ p: ({ children }) => <>{children}</> }}>
    {text}
  </ReactMarkdown>
)

// ── Component ─────────────────────────────────────────────────────────────────

export default function Sidebar({ entries }: SidebarProps) {
  const viewMode = useStore((s) => s.viewMode)
  const setViewMode = useStore((s) => s.setViewMode)

  const scrollToHeading = (id: string) => {
    // If the preview pane isn't visible, switch to split first so the
    // target element exists in the DOM before we try to scroll to it.
    if (viewMode === 'editor') {
      setViewMode('split')
      // Yield to the next paint so the preview pane is mounted.
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 50)
      return
    }
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <aside className="w-56 flex-shrink-0 border-r flex flex-col overflow-hidden bg-gray-50 dark:bg-dark-elevated border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300">
      <div className="px-4 pt-4 pb-2 flex-shrink-0">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
          Contents
        </p>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 pb-4">
        {entries.length === 0 ? (
          <p className="text-xs px-2 mt-1 text-gray-400 dark:text-gray-600">No headings found.</p>
        ) : (
          entries.map((entry) => (
            <button
              key={`${entry.level}-${entry.id}`}
              onClick={() => scrollToHeading(entry.id)}
              title={entry.text}
              className="w-full text-left text-xs py-1 px-2 rounded transition-colors truncate hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100"
              style={{ paddingLeft: `${(entry.level - 1) * 10 + 8}px` }}
            >
              {entry.level === 1 ? (
                <span className="font-semibold"><InlineMarkdown text={entry.text} /></span>
              ) : (
                <InlineMarkdown text={entry.text} />
              )}
            </button>
          ))
        )}
      </nav>
    </aside>
  )
}
