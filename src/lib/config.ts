/**
 * Central application configuration.
 *
 * All tunable defaults and limits live here as static members of AppConfig.
 * In the future, getters can be swapped to read from localStorage, a JSON
 * settings file, or any other source without touching any consumer.
 */

import defaultContent from '../resources/default-content.md?raw'

export type ViewMode = 'split' | 'editor' | 'preview'

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

  static readonly DEFAULT_CONTENT = defaultContent
}
