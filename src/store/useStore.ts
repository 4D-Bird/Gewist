import { create } from 'zustand'

export type ViewMode = 'split' | 'editor' | 'preview'

const DEFAULT_CONTENT = `# Welcome to Gewist

Gewist is a lightweight, local-first Markdown workspace for technical and creative writing.

## Getting Started

Start typing in the editor, or **Open** an existing \`.md\` file from the toolbar above.
Switch between **Edit**, **Split**, and **Preview** modes to find your preferred layout.

### Features

- **Live preview** — rendered Markdown updates as you type
- **Split view** — editor and preview side-by-side
- **Table of contents** — document outline in the sidebar
- **File import / export** — load and save \`.md\` files locally
- **Light / dark theme** — toggle with the button in the top-right corner

---

## Markdown Showcase

### Formatting

**Bold**, *italic*, ~~strikethrough~~, and \`inline code\`.

> A blockquote example.
> Multi-line quotes work too.

### Code

\`\`\`ts
function greet(name: string): string {
  return \`Hello, \${name}!\`
}

console.log(greet('world'))
\`\`\`

### Lists

- Item one
- Item two
  - Nested item
  - Another nested item
- Item three

1. First
2. Second
3. Third

### Table

| Feature        | Status |
|----------------|--------|
| Editor         | ✅     |
| Preview        | ✅     |
| TOC sidebar    | ✅     |
| File I/O       | ✅     |
| Dark mode      | ✅     |

### Links

[Visit GitHub](https://github.com) — links open in a new tab.

---

Happy writing! ✍️
`

interface GewistState {
  content: string
  viewMode: ViewMode
  isDark: boolean
  fileName: string
  isSidebarOpen: boolean

  setContent: (content: string) => void
  setViewMode: (mode: ViewMode) => void
  toggleTheme: () => void
  toggleSidebar: () => void
  loadFile: (content: string, name: string) => void
  exportFile: () => void
}

export const useStore = create<GewistState>((set, get) => ({
  content: DEFAULT_CONTENT,
  viewMode: 'split',
  isDark: false,
  fileName: 'untitled.md',
  isSidebarOpen: true,

  setContent: (content) => set({ content }),
  setViewMode: (viewMode) => set({ viewMode }),
  toggleTheme: () => set((state) => ({ isDark: !state.isDark })),
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),

  loadFile: (content, name) => set({ content, fileName: name }),

  exportFile: () => {
    const { content, fileName } = get()
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = fileName
    anchor.click()
    URL.revokeObjectURL(url)
  },
}))
