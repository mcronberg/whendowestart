import { useState, useEffect, useCallback } from 'react'
import { defaultSettings } from './settings/defaultSettings'
import { settingsFromUrl, settingsToUrl } from './settings/urlParams'
import { useCountdown } from './hooks/useCountdown'
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
            if (saved) return { ...defaultSettings, ...JSON.parse(saved) }
        } catch { /* ignore */ }
        return { ...defaultSettings }
    })
    const [showSettings, setShowSettings] = useState(false)
    const [showQR, setShowQR] = useState(false)
    const [showQrCorner, setShowQrCorner] = useState(false)
    const [shareUrl, setShareUrl] = useState('')
    const [showAbout, setShowAbout] = useState(false)

    const countdown = useCountdown(settings.interval, settings.minuteRoundUp)

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
            ? `⏱ 00:00 — ${activity}`
            : `⏱ ${mm}:${ss} — ${activity}`
    }, [countdown, settings.mainText, settings.headerText])

    const handleSave = useCallback((updated: Settings) => {
        setSettings(updated)
        try { localStorage.setItem('whendowestart:settings', JSON.stringify(updated)) } catch { /* ignore */ }
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

    return (
        <>
            <MainDisplay countdown={countdown} settings={settings} qrUrl={settingsToUrl(settings, countdown.endTime)} showQrCorner={showQrCorner} />

            {/* Top-right controls */}
            <div className="fixed top-4 right-4 z-40 flex items-center gap-2">
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
                    onSave={handleSave}
                    onClose={() => setShowSettings(false)}
                    onShowQR={handleShowQR}
                    onCopyLink={handleCopyLink}
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
