import { useState, useEffect, useCallback } from 'react'
import { defaultSettings } from './settings/defaultSettings'
import { settingsFromUrl, settingsToUrl } from './settings/urlParams'
import { useCountdown, parseEndTime } from './hooks/useCountdown'
import { usePresets } from './hooks/usePresets'
import { useVersionCheck } from './hooks/useVersionCheck'
import { MainDisplay } from './components/MainDisplay'
import { SettingsDialog } from './components/SettingsDialog'
import { QROverlay } from './components/QROverlay'
import { AboutDialog } from './components/AboutDialog'
import type { Settings } from './settings/types'

export default function App() {

    const [settings, setSettings] = useState<Settings>(() => {
        const urlOverrides = settingsFromUrl()
        // If URL has settings, use those (shareable link). Otherwise load from localStorage.
        if (Object.keys(urlOverrides).length > 0) {
            return { ...defaultSettings, ...urlOverrides }
        }
        try {
            const saved = localStorage.getItem('whendowestart:settings')
            if (saved) {
                const parsed: Settings = { ...defaultSettings, ...JSON.parse(saved) }
                // Convert any leftover relative minutes to absolute clock time
                const isRelative =
                    typeof parsed.interval === 'number' ||
                    (typeof parsed.interval === 'string' && /^\d+$/.test(parsed.interval.trim()))
                if (isRelative) {
                    const endTime = parseEndTime(parsed.interval, parsed.minuteRoundUp)
                    const h = String(endTime.getHours()).padStart(2, '0')
                    const m = String(endTime.getMinutes()).padStart(2, '0')
                    parsed.interval = `${h}:${m}`
                }
                return parsed
            }
        } catch { /* ignore */ }
        return { ...defaultSettings }
    })
    const [showSettings, setShowSettings] = useState(false)
    const [showQR, setShowQR] = useState(false)
    const [showQrCorner, setShowQrCorner] = useState(false)
    const [showSideNote, setShowSideNote] = useState(false)
    const [shareUrl, setShareUrl] = useState('')
    const [showAbout, setShowAbout] = useState(false)

    const countdown = useCountdown(settings.interval, settings.minuteRoundUp)
    const { backgroundPresets, contentPresets } = usePresets()
    const hasUpdate = useVersionCheck()
    const [updateDismissed, setUpdateDismissed] = useState(false)
    const updateAvailable = hasUpdate && !updateDismissed

    // Ctrl+S opens settings
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.key === 's') {
                e.preventDefault()
                setShowSettings(true)
            }
        }
        window.addEventListener('keydown', handler)
        return () => window.removeEventListener('keydown', handler)
    }, [])

    // Browser tab title — shows MM:SS so it works as a hidden timer in a background tab
    useEffect(() => {
        const rawActivity = settings.headerText || settings.mainText.replace(/#+\s*/g, '').split('\n')[0]
        // Strip markdown links [text](url) → text, and leftover markdown syntax
        const activity = rawActivity.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/[*_`#]/g, '').trim()
        const mm = String(countdown.minutesLeft).padStart(2, '0')
        const ss = String(countdown.secondsLeft % 60).padStart(2, '0')
        document.title = countdown.expired
            ? `00:00 — ${activity}`
            : `${mm}:${ss} — ${activity}`
    }, [countdown, settings.mainText, settings.headerText])

    const handleSave = useCallback((updated: Settings) => {
        // Convert relative minutes to absolute clock time so subsequent edits don't shift the timer
        const isRelativeMinutes =
            typeof updated.interval === 'number' ||
            (typeof updated.interval === 'string' && /^\d+$/.test(updated.interval.trim()))
        if (isRelativeMinutes) {
            const endTime = parseEndTime(updated.interval, updated.minuteRoundUp)
            const h = String(endTime.getHours()).padStart(2, '0')
            const m = String(endTime.getMinutes()).padStart(2, '0')
            updated = { ...updated, interval: `${h}:${m}` }
        }
        setSettings(updated)
        try { localStorage.setItem('whendowestart:settings', JSON.stringify(updated)) } catch { /* ignore */ }
        setShowSettings(false)
    }, [])

    const handleReset = useCallback(() => {
        try { localStorage.clear() } catch { /* ignore */ }
        window.history.replaceState({}, '', window.location.pathname)
        setSettings({ ...defaultSettings })
        setShowSettings(false)
    }, [])

    const handleShowQR = useCallback(() => {
        const url = settingsToUrl(settings, countdown.endTime)
        setShareUrl(url)
        setShowQR(true)
        setShowSettings(false)
    }, [settings, countdown.endTime])

    const handleCopyLink = useCallback(() => {
        const url = settingsToUrl(settings)
        navigator.clipboard.writeText(url).catch(() => { })
        window.location.href = url
    }, [settings, countdown.endTime])

    const buildDate = typeof __BUILD_DATE__ !== 'undefined'
        ? new Date(__BUILD_DATE__).toLocaleString('da-DK', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' })
        : null

    return (
        <>
            <MainDisplay countdown={countdown} settings={settings} qrUrl={settingsToUrl(settings, countdown.endTime)} showQrCorner={showQrCorner} showSideNote={showSideNote} />

            {/* Build date — top-left */}
            {buildDate && (
                <div className="fixed top-2 left-2 z-40 text-white/50 text-[10px] select-none pointer-events-none" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>
                    Build: {buildDate}
                </div>
            )}

            {/* Update available banner */}
            {updateAvailable && (
                <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-yellow-400 text-yellow-900 rounded-xl shadow-xl px-5 py-3 flex items-start gap-3 max-w-sm w-full mx-4">
                    <span className="text-xl mt-0.5">🔄</span>
                    <div className="flex-1 text-sm">
                        <p className="font-semibold">En ny version er tilgængelig!</p>
                        <p className="mt-0.5">Tryk <kbd className="bg-yellow-200 border border-yellow-500 rounded px-1 font-mono text-xs">Ctrl+F5</kbd> for at hente den nyeste version.</p>
                        <p className="mt-0.5 text-xs text-yellow-800">Du kan også nulstille dine indstillinger via <em>Settings → Reset all</em>.</p>
                    </div>
                    <button
                        onClick={() => setUpdateDismissed(true)}
                        className="text-yellow-700 hover:text-yellow-900 text-xl leading-none mt-0.5"
                        title="Luk"
                    >&times;</button>
                </div>
            )}

            {/* Top-right controls */}
            <div className="fixed top-4 right-4 z-40 flex items-center gap-2">
                {/* +5 / +10 min */}
                <button
                    onClick={() => countdown.addMinutes(5)}
                    className="p-2 rounded-full bg-black/30 hover:bg-black/50 text-white transition text-xs font-semibold w-9 h-9 flex items-center justify-center"
                    title="Add 5 minutes"
                >+5</button>
                <button
                    onClick={() => countdown.addMinutes(10)}
                    className="p-2 rounded-full bg-black/30 hover:bg-black/50 text-white transition text-xs font-semibold w-9 h-9 flex items-center justify-center"
                    title="Add 10 minutes"
                >+10</button>

                {/* Side note toggle */}
                {settings.sideNote && (
                    <button
                        onClick={() => setShowSideNote((v) => !v)}
                        className={`p-2 rounded-full transition text-white ${showSideNote ? 'bg-blue-500/70 hover:bg-blue-500/90' : 'bg-black/30 hover:bg-black/50'}`}
                        title={showSideNote ? 'Hide side note' : 'Show side note'}
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                            strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                            <rect x="3" y="3" width="18" height="18" rx="2" />
                            <line x1="8" y1="8" x2="16" y2="8" />
                            <line x1="8" y1="12" x2="16" y2="12" />
                            <line x1="8" y1="16" x2="12" y2="16" />
                        </svg>
                    </button>
                )}

                {/* QR corner toggle */}
                <button
                    onClick={() => setShowQrCorner((v) => !v)}
                    className={`p-2 rounded-full transition text-white ${showQrCorner ? 'bg-blue-500/70 hover:bg-blue-500/90' : 'bg-black/30 hover:bg-black/50'}`}
                    title={showQrCorner ? 'Hide QR code' : 'Show QR code'}
                >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                        strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                        <rect x="3" y="3" width="7" height="7" />
                        <rect x="14" y="3" width="7" height="7" />
                        <rect x="3" y="14" width="7" height="7" />
                        <rect x="14" y="14" width="3" height="3" />
                        <rect x="19" y="14" width="2" height="2" />
                        <rect x="14" y="19" width="2" height="2" />
                        <rect x="18" y="18" width="3" height="3" />
                    </svg>
                </button>

                {/* About */}
                <button
                    onClick={() => setShowAbout(true)}
                    className="p-2 rounded-full bg-black/30 hover:bg-black/50 text-white transition"
                    title="About"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                        className="w-5 h-5">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="16" x2="12" y2="12" />
                        <line x1="12" y1="8" x2="12.01" y2="8" />
                    </svg>
                </button>

                {/* GitHub */}
                <a
                    href="https://github.com/mcronberg/whendowestart"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-black/30 hover:bg-black/50 text-white transition"
                    title="GitHub"
                >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57
              0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695
              -.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99
              .105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225
              -.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405
              c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225
              0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3
              0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
                    </svg>
                </a>

                {/* Settings burger */}
                <button
                    onClick={() => setShowSettings(true)}
                    className="p-2 rounded-full bg-black/30 hover:bg-black/50 text-white transition"
                    title="Settings (Ctrl+S)"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                        className="w-5 h-5">
                        <line x1="3" y1="6" x2="21" y2="6" />
                        <line x1="3" y1="12" x2="21" y2="12" />
                        <line x1="3" y1="18" x2="21" y2="18" />
                    </svg>
                </button>
            </div>

            {showSettings && (
                <SettingsDialog
                    settings={settings}
                    backgroundPresets={backgroundPresets}
                    contentPresets={contentPresets}
                    onSave={handleSave}
                    onClose={() => setShowSettings(false)}
                    onShowQR={handleShowQR}
                    onCopyLink={handleCopyLink}
                    onReset={handleReset}
                />
            )}

            {showQR && (
                <QROverlay url={shareUrl} onClose={() => setShowQR(false)} />
            )}

            {showAbout && (
                <AboutDialog onClose={() => setShowAbout(false)} />
            )}
        </>
    )
}
