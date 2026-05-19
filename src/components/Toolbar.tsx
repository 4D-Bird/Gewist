import { useRef } from 'react'
import type { ViewMode } from '../lib/config'
import { useStore } from '../store/useStore'
import { AppConfig } from '../lib/config'

interface ToolbarProps {
  viewMode: ViewMode
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
  fileName,
  wordCount,
  isSidebarOpen,
  onViewModeChange,
  onThemeToggle,
  onToggleSidebar,
  onLoadFile,
  onExport,
}: ToolbarProps) {
  // isDark and tab-indent setting are global — read directly from the store.
  const isDark = useStore((s) => s.isDark)
  const tabIndent = useStore((s) => s.tabIndent)
  const toggleTabIndent = useStore((s) => s.toggleTabIndent)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > AppConfig.MAX_FILE_SIZE_BYTES) {
      alert(
        `File is too large (${(file.size / 1_000_000).toFixed(1)} MB). ` +
        `Maximum allowed size is ${AppConfig.MAX_FILE_SIZE_BYTES / 1_000_000} MB.`,
      )
      e.target.value = ''
      return
    }

    const reader = new FileReader()
    reader.onload = (ev) => {
      const text = ev.target?.result
      if (typeof text === 'string') onLoadFile(text, file.name)
    }
    reader.onerror = () => {
      console.error('Failed to read file:', file.name)
      alert(`Could not read “${file.name}”. The file may be corrupted.`)
    }
    reader.readAsText(file)
    e.target.value = '' // allow re-loading the same file
  }

  // ── Style helpers ──────────────────────────────────────────────────────────

  const bar = 'bg-surface border-border'

  const divider = 'inline-block w-px h-4 mx-1 align-middle bg-border'

  const btn = (active?: boolean) =>
    [
      'px-2.5 py-1 text-sm rounded font-medium transition-colors select-none',
      active
        ? 'bg-accent text-white'
        : 'text-foreground-soft hover:text-foreground hover:bg-surface-hover',
    ].join(' ')

  const meta = 'text-foreground-muted'

  return (
    <header
      className={`flex items-center gap-1 px-3 py-1.5 border-b flex-shrink-0 ${bar}`}
    >
      {/* Brand */}
      <span className="text-sm font-bold tracking-tight mr-2">
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

      {/* Tab-indent toggle */}
      <button
        onClick={toggleTabIndent}
        className={btn(tabIndent)}
        title={tabIndent ? 'Tab key indents — click to disable (use Esc to leave editor)' : 'Tab key navigates — click to enable indentation'}
        aria-label={tabIndent ? 'Tab indentation on' : 'Tab indentation off'}
        aria-pressed={tabIndent}
      >
        Tab⇥
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
