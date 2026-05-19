/**
 * Central application configuration.
 *
 * All tunable defaults and limits live here as static members of AppConfig.
 * In the future, getters can be swapped to read from localStorage, a JSON
 * settings file, or any other source without touching any consumer.
 */

export type ViewMode = 'split' | 'editor' | 'preview'

// Kept private to this module; exported through AppConfig.DEFAULT_CONTENT.
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

Happy writing!
`

export class AppConfig {
  // ── Editor defaults ────────────────────────────────────────────────────────

  static readonly DEFAULT_VIEW_MODE: ViewMode = 'split'
  static readonly DEFAULT_FILENAME = 'untitled.md'
  static readonly DEFAULT_SIDEBAR_OPEN = true
  /** Whether the Tab key indents text in the editor (vs. moving focus). */
  static readonly DEFAULT_TAB_INDENT = true

  // ── Theme ──────────────────────────────────────────────────────────────────

  /**
   * Reads the OS colour-scheme preference at call time.
   * Returns false in non-browser environments (e.g. tests / SSR).
   */
  static get DEFAULT_IS_DARK(): boolean {
    return typeof window !== 'undefined'
      ? (window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false)
      : false
  }

  // ── File I/O ───────────────────────────────────────────────────────────────

  /** Hard limit on files opened via the toolbar, in bytes. */
  static readonly MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024 // 5 MiB

  // ── Default document ───────────────────────────────────────────────────────

  static readonly DEFAULT_CONTENT = DEFAULT_CONTENT
}
