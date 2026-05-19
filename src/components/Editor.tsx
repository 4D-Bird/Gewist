import { useEffect, useRef } from 'react'
import {
  EditorView,
  keymap,
  lineNumbers,
  highlightActiveLine,
  highlightActiveLineGutter,
  drawSelection,
} from '@codemirror/view'
import { EditorState, Compartment } from '@codemirror/state'
import {
  defaultKeymap,
  history,
  historyKeymap,
  indentWithTab,
} from '@codemirror/commands'
import { markdown, markdownLanguage } from '@codemirror/lang-markdown'
import { oneDark } from '@codemirror/theme-one-dark'
import {
  syntaxHighlighting,
  defaultHighlightStyle,
  bracketMatching,
  indentOnInput,
} from '@codemirror/language'
import { useStore } from '../store/useStore'

// ── Light theme ──────────────────────────────────────────────────────────────

const lightTheme = EditorView.theme(
  {
    '&': { backgroundColor: '#ffffff', color: '#1e293b' },
    '.cm-content': { padding: '16px', caretColor: '#2563eb' },
    '.cm-gutters': {
      backgroundColor: '#f8fafc',
      color: '#94a3b8',
      border: 'none',
      borderRight: '1px solid #e2e8f0',
    },
    '.cm-activeLineGutter': { backgroundColor: '#f1f5f9' },
    '.cm-activeLine': { backgroundColor: '#f8faff' },
    '.cm-selectionBackground, ::selection': { backgroundColor: '#bfdbfe !important' },
    '&.cm-focused .cm-selectionBackground': { backgroundColor: '#93c5fd !important' },
    '.cm-cursor': { borderLeftColor: '#2563eb' },
  },
  { dark: false },
)

// ── Base layout extension (applied regardless of colour theme) ────────────────

const baseLayout = EditorView.theme({
  '&': { height: '100%' },
  '.cm-scroller': { overflow: 'auto' },
})

// ── Escape-to-exit: always active regardless of tab-indent setting ─────────────
// Blurs the editor so keyboard users can Tab away to other UI elements.

const escapeKeymap = keymap.of([{
  key: 'Escape',
  run: (view) => {
    view.contentDOM.blur()
    return true
  },
}])

// ── Component ─────────────────────────────────────────────────────────────────

interface EditorProps {
  content: string
  onChange: (value: string) => void
}

export default function Editor({ content, onChange }: EditorProps) {
  const isDark = useStore((s) => s.isDark)
  const tabIndent = useStore((s) => s.tabIndent)

  const containerRef = useRef<HTMLDivElement>(null)
  const viewRef = useRef<EditorView | null>(null)
  // Keep stable Compartment instances across renders
  const themeCompartment = useRef(new Compartment())
  const keymapCompartment = useRef(new Compartment())
  // Flag to prevent echoing external updates back to the store
  const isExternalUpdate = useRef(false)

  // ── Mount editor once ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!containerRef.current) return

    const view = new EditorView({
      state: EditorState.create({
        doc: content,
        extensions: [
          lineNumbers(),
          highlightActiveLineGutter(),
          highlightActiveLine(),
          drawSelection(),
          history(),
          indentOnInput(),
          bracketMatching(),
          syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
          markdown({ base: markdownLanguage }),
          themeCompartment.current.of(isDark ? oneDark : lightTheme),
          baseLayout,
          keymap.of([...defaultKeymap, ...historyKeymap]),
          keymapCompartment.current.of(tabIndent ? keymap.of([indentWithTab]) : []),
          escapeKeymap,
          EditorView.updateListener.of((update) => {
            if (update.docChanged && !isExternalUpdate.current) {
              onChange(update.state.doc.toString())
            }
          }),
        ],
      }),
      parent: containerRef.current,
    })

    viewRef.current = view
    return () => {
      view.destroy()
      viewRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Sync externally-changed content (e.g. file load) ──────────────────────
  useEffect(() => {
    const view = viewRef.current
    if (!view) return
    const current = view.state.doc.toString()
    if (content !== current) {
      isExternalUpdate.current = true
      view.dispatch({
        changes: { from: 0, to: current.length, insert: content },
      })
      isExternalUpdate.current = false
    }
  }, [content])

  // ── Sync tab-indent keymap ─────────────────────────────────────────────────
  useEffect(() => {
    viewRef.current?.dispatch({
      effects: keymapCompartment.current.reconfigure(
        tabIndent ? keymap.of([indentWithTab]) : [],
      ),
    })
  }, [tabIndent])

  // ── Sync theme ─────────────────────────────────────────────────────────────
  useEffect(() => {
    viewRef.current?.dispatch({
      effects: themeCompartment.current.reconfigure(isDark ? oneDark : lightTheme),
    })
  }, [isDark])

  return <div ref={containerRef} className="h-full w-full overflow-hidden" />
}
