import { useRef } from 'react'
import type { ViewMode } from '../store/useStore'

interface ToolbarProps {
  viewMode: ViewMode
  isDark: boolean
  fileName: string
  wordCount: number
  isSidebarOpen: boolean
  onViewModeChange: (mode: ViewMode) => void
  onThemeToggle: () => void
  onToggleSidebar: () => void
  onLoadFile: (content: string, name: string) => void
  onExport: () => void
}

export default function Toolbar({
  viewMode,
  isDark,
  fileName,
  wordCount,
  isSidebarOpen,
  onViewModeChange,
  onThemeToggle,
  onToggleSidebar,
  onLoadFile,
  onExport,
}: ToolbarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const text = ev.target?.result
      if (typeof text === 'string') onLoadFile(text, file.name)
    }
    reader.readAsText(file)
    e.target.value = '' // allow re-loading the same file
  }

  // ── Style helpers ──────────────────────────────────────────────────────────

  const bar = isDark
    ? 'bg-[#21252b] border-gray-700 text-gray-300'
    : 'bg-white border-gray-200 text-gray-700'

  const divider = `inline-block w-px h-4 mx-1 align-middle ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`

  const btn = (active?: boolean) =>
    [
      'px-2.5 py-1 text-sm rounded font-medium transition-colors select-none',
      active
        ? isDark
          ? 'bg-blue-600 text-white'
          : 'bg-blue-500 text-white'
        : isDark
        ? 'text-gray-400 hover:text-gray-100 hover:bg-gray-700'
        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100',
    ].join(' ')

  const meta = isDark ? 'text-gray-500' : 'text-gray-400'

  return (
    <header
      className={`flex items-center gap-1 px-3 py-1.5 border-b flex-shrink-0 ${bar}`}
    >
      {/* Brand */}
      <span
        className={`text-sm font-bold tracking-tight mr-2 ${
          isDark ? 'text-gray-100' : 'text-gray-800'
        }`}
      >
        Gewist
      </span>

      {/* Sidebar toggle */}
      <button
        onClick={onToggleSidebar}
        className={btn(isSidebarOpen)}
        title="Toggle sidebar"
        aria-label="Toggle sidebar"
      >
        ☰
      </button>

      <span className={divider} />

      {/* View mode */}
      <button onClick={() => onViewModeChange('editor')} className={btn(viewMode === 'editor')} title="Editor only">
        Edit
      </button>
      <button onClick={() => onViewModeChange('split')} className={btn(viewMode === 'split')} title="Split view">
        Split
      </button>
      <button onClick={() => onViewModeChange('preview')} className={btn(viewMode === 'preview')} title="Preview only">
        Preview
      </button>

      <span className={divider} />

      {/* File I/O */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".md,.markdown,.txt"
        onChange={handleFileChange}
        className="hidden"
        aria-hidden="true"
      />
      <button onClick={() => fileInputRef.current?.click()} className={btn()} title="Open Markdown file">
        Open
      </button>
      <button onClick={onExport} className={btn()} title="Download as .md">
        Download
      </button>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Meta info */}
      <span className={`text-xs ${meta}`}>
        {wordCount.toLocaleString()} {wordCount === 1 ? 'word' : 'words'}
      </span>

      <span className={divider} />

      <span
        className={`text-xs font-mono max-w-[140px] truncate ${meta}`}
        title={fileName}
      >
        {fileName}
      </span>

      <span className={divider} />

      {/* Theme toggle */}
      <button
        onClick={onThemeToggle}
        className={btn()}
        title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        aria-label="Toggle theme"
      >
        {isDark ? '☀' : '☾'}
      </button>
    </header>
  )
}
