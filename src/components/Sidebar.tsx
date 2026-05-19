import type { TocEntry } from '../lib/markdown'

interface SidebarProps {
  entries: TocEntry[]
  isDark: boolean
}

export default function Sidebar({ entries, isDark }: SidebarProps) {
  const scrollToHeading = (id: string) => {
    // Prefer scrolling within the preview pane when it's visible
    const target = document.getElementById(id)
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const base = isDark
    ? 'bg-[#21252b] border-gray-700 text-gray-300'
    : 'bg-gray-50 border-gray-200 text-gray-700'

  const labelStyle = isDark ? 'text-gray-500' : 'text-gray-400'
  const emptyStyle = isDark ? 'text-gray-600' : 'text-gray-400'
  const btnHover = isDark ? 'hover:bg-gray-700 hover:text-gray-100' : 'hover:bg-gray-200 hover:text-gray-900'

  return (
    <aside className={`w-56 flex-shrink-0 border-r flex flex-col overflow-hidden ${base}`}>
      <div className="px-4 pt-4 pb-2 flex-shrink-0">
        <p className={`text-[10px] font-semibold uppercase tracking-widest ${labelStyle}`}>
          Contents
        </p>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 pb-4">
        {entries.length === 0 ? (
          <p className={`text-xs px-2 mt-1 ${emptyStyle}`}>No headings found.</p>
        ) : (
          entries.map((entry, i) => (
            <button
              key={i}
              onClick={() => scrollToHeading(entry.id)}
              title={entry.text}
              className={`
                w-full text-left text-xs py-1 px-2 rounded transition-colors truncate
                ${btnHover}
              `}
              style={{ paddingLeft: `${(entry.level - 1) * 10 + 8}px` }}
            >
              {entry.level === 1 ? (
                <span className="font-semibold">{entry.text}</span>
              ) : (
                entry.text
              )}
            </button>
          ))
        )}
      </nav>
    </aside>
  )
}
