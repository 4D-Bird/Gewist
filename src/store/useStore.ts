import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { AppConfig } from '../lib/config'
import type { ViewMode } from '../lib/config'

interface GewistState {
  content: string
  viewMode: ViewMode
  isDark: boolean
  fileName: string
  isSidebarOpen: boolean
  tabIndent: boolean

  setContent: (content: string) => void
  setViewMode: (mode: ViewMode) => void
  toggleTheme: () => void
  toggleSidebar: () => void
  toggleTabIndent: () => void
  loadFile: (content: string, name: string) => void
  exportFile: () => void
}

export const useStore = create<GewistState>()(
  persist(
    (set, get) => ({
      content: AppConfig.DEFAULT_CONTENT,
      viewMode: AppConfig.DEFAULT_VIEW_MODE,
      isDark: AppConfig.DEFAULT_IS_DARK,
      fileName: AppConfig.DEFAULT_FILENAME,
      isSidebarOpen: AppConfig.DEFAULT_SIDEBAR_OPEN,
      tabIndent: AppConfig.DEFAULT_TAB_INDENT,

      setContent: (content) => set({ content }),
      setViewMode: (viewMode) => set({ viewMode }),
      toggleTheme: () => set((state) => ({ isDark: !state.isDark })),
      toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
      toggleTabIndent: () => set((state) => ({ tabIndent: !state.tabIndent })),

      loadFile: (content, name) => set({ content, fileName: name }),

      exportFile: () => {
        const { content, fileName } = get()
        const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' })
        const url = URL.createObjectURL(blob)
        const anchor = document.createElement('a')
        anchor.href = url
        anchor.download = fileName
        //document.body.appendChild(anchor)
        anchor.click()
        //document.body.removeChild(anchor)
        URL.revokeObjectURL(url)
      },
    }),
    {
      name: 'gewist-state',
      // Only persist user-facing state, not derived/action members.
      partialize: (state) => ({
        content: state.content,
        viewMode: state.viewMode,
        isDark: state.isDark,
        fileName: state.fileName,
        isSidebarOpen: state.isSidebarOpen,
        tabIndent: state.tabIndent,
      }),
    },
  ),
)
