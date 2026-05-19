import { useMemo, useEffect } from 'react'
import { useStore } from './store/useStore'
import { extractToc, countWords } from './lib/markdown'
import Toolbar from './components/Toolbar'
import Sidebar from './components/Sidebar'
import Editor from './components/Editor'
import Preview from './components/Preview'

export default function App() {
  const {
    content,
    viewMode,
    isDark,
    fileName,
    isSidebarOpen,
    setContent,
    setViewMode,
    toggleTheme,
    toggleSidebar,
    loadFile,
    exportFile,
  } = useStore()

  const toc = useMemo(() => extractToc(content), [content])
  const words = useMemo(() => countWords(content), [content])

  // Apply dark class to <html> for Tailwind dark mode
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
  }, [isDark])

  const showEditor = viewMode === 'editor' || viewMode === 'split'
  const showPreview = viewMode === 'preview' || viewMode === 'split'

  const paneBorder = isDark ? 'border-gray-700' : 'border-gray-200'

  return (
    <div
      className={`flex flex-col h-screen overflow-hidden ${
        isDark ? 'bg-dark-base text-gray-200' : 'bg-white text-gray-900'
      }`}
    >
      {/* ── Toolbar ────────────────────────────────────────────────────────── */}
      <Toolbar
        viewMode={viewMode}
        fileName={fileName}
        wordCount={words}
        isSidebarOpen={isSidebarOpen}
        onViewModeChange={setViewMode}
        onThemeToggle={toggleTheme}
        onToggleSidebar={toggleSidebar}
        onLoadFile={loadFile}
        onExport={exportFile}
      />

      {/* ── Body ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        {isSidebarOpen && <Sidebar entries={toc} />}

        {/* Main pane(s) */}
        <main className="flex flex-1 overflow-hidden">
          {showEditor && (
            <div
              className={`flex-1 overflow-hidden ${
                showPreview ? `border-r ${paneBorder}` : ''
              }`}
            >
              <Editor content={content} onChange={setContent} />
            </div>
          )}

          {showPreview && (
            <div className="flex-1 overflow-hidden">
              <Preview content={content} isDark={isDark} />
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
