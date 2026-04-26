import { useState, useEffect } from 'react'
import type { Settings } from '../settings/types'
import { contentPresets } from '../settings/defaultSettings'
import { RichTextEditor } from './RichTextEditor'

interface Props {
    settings: Settings
    onSave: (settings: Settings) => void
    onClose: () => void
    onShowQR: () => void
    onCopyLink: () => void
}

export function SettingsDialog({ settings, onSave, onClose, onShowQR, onCopyLink }: Props) {
    const [draft, setDraft] = useState<Settings>({ ...settings })
    const [resetKey, setResetKey] = useState(0)

    function applyPreset(presetId: string) {
        const preset = contentPresets.find((p) => p.id === presetId)
        if (!preset) return
        setDraft((d) => ({
            ...d,
            mainText: preset.mainText,
            headerText: preset.headerText,
            footerText: preset.footerText,
            backgroundImage: preset.backgroundImage,
            interval: preset.interval,
        }))
        setResetKey((k) => k + 1)
    }

    function handleSave() {
        onSave({ ...draft })
    }

    useEffect(() => {
        function onKey(e: KeyboardEvent) {
            if (e.key === 'Escape') { onClose(); return }
            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { onSave({ ...draft }) }
        }
        document.addEventListener('keydown', onKey)
        return () => document.removeEventListener('keydown', onKey)
    }, [draft, onClose, onSave])

    function set<K extends keyof Settings>(key: K, value: Settings[K]) {
        setDraft((d) => ({ ...d, [key]: value }))
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 flex flex-col gap-5">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Settings</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-2xl leading-none">&times;</button>
                </div>

                {/* Presets */}
                <div>
                    <label className="block text-sm font-medium mb-1">Quick presets</label>
                    <p className="text-xs text-gray-400 mb-2">Fills in content, background and timer — adjust freely afterwards.</p>
                    <div className="flex flex-wrap gap-2">
                        {contentPresets.map((p) => (
                            <button
                                key={p.id}
                                onClick={() => applyPreset(p.id)}
                                className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                            >
                                {p.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main content — during timer */}
                <div>
                    <label className="block text-sm font-medium mb-1">
                        Text while timer is running
                    </label>
                    <RichTextEditor
                        key={`main-${resetKey}`}
                        value={draft.mainText}
                        onChange={(v) => set('mainText', v)}
                    />
                    <p className="mt-1 text-xs text-gray-400">
                        Use{' '}
                        <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">{'{{starttime}}'}</code>
                        {' '}and{' '}
                        <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">{'{{remaining}}'}</code>
                        {' '}(or{' '}
                        <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">{'{{remaining:b}}'}</code>
                        /{' '}
                        <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">{'{{remaining:x}}'}</code>
                        {' '}for geeks 🤓) to show the end time and minutes left. Delete them if you don't want a timer line.
                    </p>
                </div>

                {/* Text when time is up */}
                <div>
                    <label className="block text-sm font-medium mb-1">
                        Text when time is up
                    </label>
                    <RichTextEditor
                        key={`timeout-${resetKey}`}
                        value={draft.timeoutText}
                        onChange={(v) => set('timeoutText', v)}
                        minHeight="5rem"
                    />
                </div>

                {/* Header / Footer */}
                <div>
                    <label className="block text-sm font-medium mb-1">Header text</label>
                    <RichTextEditor
                        key={`header-${resetKey}`}
                        value={draft.headerText}
                        onChange={(v) => set('headerText', v)}
                        minHeight="4rem"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Footer text</label>
                    <RichTextEditor
                        key={`footer-${resetKey}`}
                        value={draft.footerText}
                        onChange={(v) => set('footerText', v)}
                        minHeight="4rem"
                    />
                </div>

                {/* Timer */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Timer
                        </label>
                        <input
                            type="text"
                            value={String(draft.interval)}
                            onChange={(e) => set('interval', e.target.value)}
                            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent px-3 py-2 text-sm"
                            placeholder="20"
                        />
                        <p className="mt-1 text-xs text-gray-400">Minutes (e.g. <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">20</code>), clock time (<code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">14:30</code>), or 12h (<code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">3pm</code>)</p>
                    </div>
                    <div className="flex items-end pb-2">
                        <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
                            <input
                                type="checkbox"
                                checked={draft.minuteRoundUp}
                                onChange={(e) => set('minuteRoundUp', e.target.checked)}
                                className="rounded"
                            />
                            Round up to nearest 5 min
                        </label>
                    </div>
                </div>

                {/* Zone colors */}
                <div>
                    <label className="block text-sm font-medium mb-2">Text colors</label>
                    <div className="grid grid-cols-3 gap-3">
                        {([
                            { key: 'mainColor' as const, label: 'Main' },
                            { key: 'headerColor' as const, label: 'Header' },
                            { key: 'footerColor' as const, label: 'Footer' },
                        ]).map(({ key, label }) => (
                            <div key={key} className="flex flex-col items-center gap-1">
                                <span className="text-xs text-gray-500">{label}</span>
                                <input
                                    type="color"
                                    value={draft[key] || '#ffffff'}
                                    onChange={(e) => set(key, e.target.value)}
                                    className="w-10 h-10 rounded cursor-pointer border-0 p-0"
                                />
                                <span className="text-xs text-gray-400">{draft[key] || '#ffffff'}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Font */}
                <div>
                    <label className="block text-sm font-medium mb-1">Font</label>
                    <select
                        value={draft.fontFamily}
                        onChange={(e) => set('fontFamily', e.target.value)}
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent px-3 py-2 text-sm"
                    >
                        <option value="Inter, system-ui, sans-serif">Inter (default)</option>
                        <option value="'Roboto', sans-serif">Roboto</option>
                        <option value="'Open Sans', sans-serif">Open Sans</option>
                        <option value="'Lato', sans-serif">Lato</option>
                        <option value="'Montserrat', sans-serif">Montserrat</option>
                        <option value="'Nunito', sans-serif">Nunito</option>
                        <option value="'Playfair Display', serif">Playfair Display</option>
                        <option value="'Merriweather', serif">Merriweather</option>
                        <option value="'Source Code Pro', monospace">Source Code Pro</option>
                    </select>
                </div>

                {/* Background image */}
                <div>
                    <label className="block text-sm font-medium mb-1">Background image URL</label>
                    <input
                        type="text"
                        value={draft.backgroundImage}
                        onChange={(e) => set('backgroundImage', e.target.value)}
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent px-3 py-2 text-sm"
                        placeholder="https://..."
                    />
                    <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                        <span className="text-gray-400">Free photo sites:</span>
                        {[
                            { label: 'Unsplash', url: 'https://unsplash.com' },
                            { label: 'Pexels', url: 'https://www.pexels.com' },
                            { label: 'Pixabay', url: 'https://pixabay.com' },
                            { label: 'StockSnap', url: 'https://stocksnap.io' },
                        ].map(({ label, url }) => (
                            <a key={label} href={url} target="_blank" rel="noopener noreferrer"
                                className="text-blue-500 hover:underline">{label}</a>
                        ))}
                    </div>
                    <p className="mt-1 text-xs text-gray-400">Tip: right-click an image → "Copy image address" and paste it above.</p>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex gap-2">
                        <button
                            onClick={onShowQR}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                            title="Show QR code for sharing"
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                                strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                                <rect x="3" y="3" width="7" height="7" />
                                <rect x="14" y="3" width="7" height="7" />
                                <rect x="3" y="14" width="7" height="7" />
                                <rect x="14" y="14" width="3" height="3" />
                                <rect x="19" y="14" width="2" height="2" />
                                <rect x="14" y="19" width="2" height="2" />
                                <rect x="18" y="18" width="3" height="3" />
                            </svg>
                            QR code
                        </button>
                        <button
                            onClick={onCopyLink}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                            title="Copy shareable link to clipboard"
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                                strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                            </svg>
                            Copy link
                        </button>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 rounded-lg text-sm border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="px-4 py-2 rounded-lg text-sm bg-blue-600 text-white hover:bg-blue-700 transition"
                        >
                            Save &amp; start
                        </button>
                    </div>
                </div>

                {/* Build info */}
                <p className="text-center text-xs text-gray-400 dark:text-gray-600 -mt-2">
                    Built: {new Date(__BUILD_DATE__).toLocaleString('en-GB', {
                        day: 'numeric', month: 'long', year: 'numeric',
                        hour: '2-digit', minute: '2-digit', timeZoneName: 'short',
                    })}
                </p>
            </div>
        </div>
    )
}
