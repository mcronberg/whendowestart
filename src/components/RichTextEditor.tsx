import type { Editor } from '@tiptap/react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Markdown } from 'tiptap-markdown'

/* ── Toolbar ── */

interface BtnProps {
    active: boolean
    onClick: () => void
    title: string
    children: React.ReactNode
}

function Btn({ active, onClick, title, children }: BtnProps) {
    return (
        <button
            type="button"
            title={title}
            onMouseDown={(e) => {
                e.preventDefault() // keep editor focused
                onClick()
            }}
            className={`px-2 py-0.5 rounded text-xs font-semibold transition-colors ${active
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
        >
            {children}
        </button>
    )
}

function Divider() {
    return <span className="w-px self-stretch bg-gray-300 dark:bg-gray-600 mx-0.5" />
}

function Toolbar({ editor }: { editor: Editor | null }) {
    if (!editor) return null

    return (
        <div className="flex flex-wrap items-center gap-1 px-2 py-1.5 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-t-lg">
            <Btn
                active={editor.isActive('bold')}
                onClick={() => editor.chain().focus().toggleBold().run()}
                title="Bold (Ctrl+B)"
            >
                <strong>B</strong>
            </Btn>
            <Btn
                active={editor.isActive('italic')}
                onClick={() => editor.chain().focus().toggleItalic().run()}
                title="Italic (Ctrl+I)"
            >
                <em>I</em>
            </Btn>

            <Divider />

            <Btn
                active={editor.isActive('heading', { level: 1 })}
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                title="Heading 1"
            >
                H1
            </Btn>
            <Btn
                active={editor.isActive('heading', { level: 2 })}
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                title="Heading 2"
            >
                H2
            </Btn>
            <Btn
                active={editor.isActive('heading', { level: 3 })}
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                title="Heading 3"
            >
                H3
            </Btn>

            <Divider />

            <Btn
                active={editor.isActive('bulletList')}
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                title="Bullet list"
            >
                • List
            </Btn>
            <Btn
                active={editor.isActive('orderedList')}
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                title="Numbered list"
            >
                1. List
            </Btn>

            <Divider />

            <Btn
                active={false}
                onClick={() => editor.chain().focus().setHorizontalRule().run()}
                title="Horizontal rule"
            >
                ─
            </Btn>
        </div>
    )
}

/* ── Editor ── */

interface Props {
    value: string
    onChange: (value: string) => void
    minHeight?: string
}

export function RichTextEditor({ value, onChange, minHeight = '8rem' }: Props) {
    const editor = useEditor({
        extensions: [StarterKit, Markdown],
        content: value,
        onUpdate({ editor }) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onChange((editor.storage as any).markdown.getMarkdown() as string)
        },
    })

    return (
        <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500">
            <Toolbar editor={editor} />
            <div
                style={{ minHeight }}
                className="rte-content px-3 py-2 prose prose-sm dark:prose-invert max-w-none cursor-text"
                onClick={() => editor?.commands.focus()}
            >
                <EditorContent editor={editor} />
            </div>
        </div>
    )
}
