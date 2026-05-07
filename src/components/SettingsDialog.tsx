import { useState, useEffect } from 'react'
import type { Settings } from '../settings/types'
import { contentPresets } from '../settings/defaultSettings'
import { backgroundPresets } from '../settings/backgroundPresets'
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
    const [bgMode, setBgMode] = useState<'image' | 'video' | 'color'>(
        settings.backgroundVideo ? 'video' : settings.backgroundImage ? 'image' : 'color'
    )

    function applyPreset(presetId: string) {
        const preset = contentPresets.find((p) => p.id === presetId)
        if (!preset) return
        setDraft((d) => ({
            ...d,
            mainText: preset.mainText,
            headerText: preset.headerText,
            footerText: preset.footerText,
            timeoutText: preset.timeoutText,
            sideNote: preset.sideNote,
            backgroundImage: preset.backgroundImage,
            backgroundVideo: preset.backgroundVideo,
            interval: preset.interval,
        }))
        setBgMode(preset.backgroundVideo ? 'video' : preset.backgroundImage ? 'image' : 'color')
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
                    <select
                        defaultValue=""
                        onChange={(e) => { if (e.target.value) applyPreset(e.target.value) }}
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent px-3 py-2 text-sm"
                    >
                        <option value="" disabled>Select a preset…</option>
                        {contentPresets.map((p) => (
                            <option key={p.id} value={p.id}>{p.label}</option>
                        ))}
                    </select>
                </div>

                {/* Timer */}
                <div>
                    <label className="block text-sm font-medium mb-1">Timer</label>
                    <input
                        type="text"
                        value={String(draft.interval)}
                        onChange={(e) => set('interval', e.target.value)}
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent px-3 py-2 text-sm"
                        placeholder="20"
                    />
                    <p className="mt-1 text-xs text-gray-400">Minutes (e.g. <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">20</code>), clock time (<code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">14:30</code>), or 12h (<code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">3pm</code>)</p>
                    <label className="flex items-center gap-2 text-sm cursor-pointer select-none mt-2">
                        <input
                            type="checkbox"
                            checked={draft.minuteRoundUp}
                            onChange={(e) => set('minuteRoundUp', e.target.checked)}
                            className="rounded"
                        />
                        Round up to nearest 5 min
                    </label>
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

                {/* Side note */}
                <div>
                    <label className="block text-sm font-medium mb-1">Side note</label>
                    <RichTextEditor
                        key={`sidenote-${resetKey}`}
                        value={draft.sideNote}
                        onChange={(v) => set('sideNote', v)}
                        minHeight="4rem"
                    />
                    <p className="mt-1 text-xs text-gray-400">Shown in a panel on the right side — toggle with the note icon in the top-right corner. E.g. "Vi går til frokost kl. 12".</p>
                </div>

                {/* Header / Footer */}
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
                        <option value="system-ui, sans-serif">System default</option>
                        <option value="Arial, sans-serif">Arial</option>
                        <option value="'Segoe UI', sans-serif">Segoe UI (Windows)</option>
                        <option value="'Helvetica Neue', Helvetica, sans-serif">Helvetica</option>
                        <option value="Verdana, sans-serif">Verdana</option>
                        <option value="Trebuchet MS, sans-serif">Trebuchet MS</option>
                        <option value="Georgia, serif">Georgia</option>
                        <option value="'Times New Roman', serif">Times New Roman</option>
                        <option value="Palatino, serif">Palatino</option>
                        <option value="Impact, sans-serif">Impact</option>
                        <option value="'Courier New', monospace">Courier New</option>
                        <option value="'Consolas', monospace">Consolas (Windows)</option>
                    </select>
                </div>

                {/* Background */}
                <div>
                    <label className="block text-sm font-medium mb-2">Background</label>
                    <div className="flex gap-2 mb-3">
                        <button
                            type="button"
                            onClick={() => { setBgMode('image'); set('backgroundVideo', '') }}
                            className={`flex-1 py-1.5 rounded-lg border text-sm transition ${bgMode === 'image' ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-400 text-blue-600 dark:text-blue-300' : 'border-gray-300 dark:border-gray-600 text-gray-500'}`}
                        >
                            Image URL
                        </button>
                        <button
                            type="button"
                            onClick={() => { setBgMode('video'); set('backgroundImage', '') }}
                            className={`flex-1 py-1.5 rounded-lg border text-sm transition ${bgMode === 'video' ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-400 text-blue-600 dark:text-blue-300' : 'border-gray-300 dark:border-gray-600 text-gray-500'}`}
                        >
                            Video URL
                        </button>
                        <button
                            type="button"
                            onClick={() => { setBgMode('color'); set('backgroundImage', ''); set('backgroundVideo', '') }}
                            className={`flex-1 py-1.5 rounded-lg border text-sm transition ${bgMode === 'color' ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-400 text-blue-600 dark:text-blue-300' : 'border-gray-300 dark:border-gray-600 text-gray-500'}`}
                        >
                            Solid color
                        </button>
                    </div>

                    {bgMode === 'image' ? (
                        <>
                            {backgroundPresets.filter(p => p.type === 'image').length > 0 && (
                                <select
                                    value={backgroundPresets.find(p => p.value === draft.backgroundImage)?.id ?? ''}
                                    onChange={(e) => {
                                        const preset = backgroundPresets.find(p => p.id === e.target.value)
                                        if (preset) set('backgroundImage', preset.value)
                                    }}
                                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent px-3 py-2 text-sm mb-2"
                                >
                                    <option value="">— select a preset image —</option>
                                    {backgroundPresets.filter(p => p.type === 'image').map(p => (
                                        <option key={p.id} value={p.id}>{p.label}</option>
                                    ))}
                                </select>
                            )}
                            {draft.backgroundImage && backgroundPresets.find(p => p.value === draft.backgroundImage)?.credit && (
                                <p className="text-xs text-gray-400 mb-1 italic">{backgroundPresets.find(p => p.value === draft.backgroundImage)!.credit}</p>
                            )}
                            <input
                                type="text"
                                value={draft.backgroundImage}
                                onChange={(e) => set('backgroundImage', e.target.value)}
                                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent px-3 py-2 text-sm"
                                placeholder="https://..."
                            />
                            <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                                <span className="text-gray-400">Free photos:</span>
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
                        </>
                    ) : bgMode === 'video' ? (
                        <>
                            {backgroundPresets.filter(p => p.type === 'video').length > 0 && (
                                <select
                                    value={backgroundPresets.find(p => p.value === draft.backgroundVideo)?.id ?? ''}
                                    onChange={(e) => {
                                        const preset = backgroundPresets.find(p => p.id === e.target.value)
                                        if (preset) set('backgroundVideo', preset.value)
                                    }}
                                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent px-3 py-2 text-sm mb-2"
                                >
                                    <option value="">— select a preset video —</option>
                                    {backgroundPresets.filter(p => p.type === 'video').map(p => (
                                        <option key={p.id} value={p.id}>{p.label}</option>
                                    ))}
                                </select>
                            )}
                            {draft.backgroundVideo && backgroundPresets.find(p => p.value === draft.backgroundVideo)?.credit && (
                                <p className="text-xs text-gray-400 mb-1 italic">{backgroundPresets.find(p => p.value === draft.backgroundVideo)!.credit}</p>
                            )}
                            <input
                                type="text"
                                value={draft.backgroundVideo}
                                onChange={(e) => set('backgroundVideo', e.target.value)}
                                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent px-3 py-2 text-sm"
                                placeholder="https://...mp4"
                            />
                            <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                                <span className="text-gray-400">Free videos:</span>
                                {[
                                    { label: 'Pexels', url: 'https://www.pexels.com/videos/' },
                                    { label: 'Pixabay', url: 'https://pixabay.com/videos/' },
                                ].map(({ label, url }) => (
                                    <a key={label} href={url} target="_blank" rel="noopener noreferrer"
                                        className="text-blue-500 hover:underline">{label}</a>
                                ))}
                            </div>
                        </>
                    ) : (
                        <>
                            {backgroundPresets.filter(p => p.type === 'color').length > 0 && (
                                <select
                                    value={backgroundPresets.find(p => p.value === draft.backgroundColor)?.id ?? ''}
                                    onChange={(e) => {
                                        const preset = backgroundPresets.find(p => p.id === e.target.value)
                                        if (preset) set('backgroundColor', preset.value)
                                    }}
                                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent px-3 py-2 text-sm mb-2"
                                >
                                    <option value="">— select a preset colour —</option>
                                    {backgroundPresets.filter(p => p.type === 'color').map(p => (
                                        <option key={p.id} value={p.id}>{p.label} ({p.value})</option>
                                    ))}
                                </select>
                            )}
                            <div className="flex items-center gap-3">
                                <input
                                    type="color"
                                    value={draft.backgroundColor || '#1e293b'}
                                    onChange={(e) => set('backgroundColor', e.target.value)}
                                    className="w-10 h-10 rounded cursor-pointer border-0 p-0"
                                />
                                <span className="text-sm text-gray-500">{draft.backgroundColor || '#1e293b'}</span>
                            </div>
                        </>
                    )}
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
