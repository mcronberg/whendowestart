import { defaultSettings } from './defaultSettings'
import type { Settings } from './types'

/**
 * Parse URL query params into a partial Settings object.
 * Keys are matched case-insensitively.
 */
export function settingsFromUrl(): Partial<Settings> {
    const params = new URLSearchParams(window.location.search)
    const result: Partial<Settings> = {}

    const defaults = defaultSettings as unknown as Record<string, unknown>

    for (const [rawKey, value] of params.entries()) {
        const key = Object.keys(defaults).find(
            (k) => k.toLowerCase() === rawKey.toLowerCase()
        )
        if (!key) continue

        const defaultValue = defaults[key]

        if (typeof defaultValue === 'boolean') {
            ; (result as Record<string, unknown>)[key] = value.toLowerCase() === 'true'
        } else if (typeof defaultValue === 'number') {
            const n = Number(value)
            if (!isNaN(n)) {
                ; (result as Record<string, unknown>)[key] = n
            } else {
                // Allow string times like "HH:mm" for interval
                ; (result as Record<string, unknown>)[key] = value
            }
        } else {
            ; (result as Record<string, unknown>)[key] = value
        }
    }

    return result
}

/**
 * Encode settings as a shareable URL.
 * - Without endTime: keeps interval as-is (reusable instructor link).
 * - With endTime: overrides interval with absolute ISO timestamp (QR code for participants).
 */
export function settingsToUrl(settings: Settings, endTime?: Date): string {
    const params = new URLSearchParams()
    const defaults = defaultSettings as unknown as Record<string, unknown>
    const s = settings as unknown as Record<string, unknown>

    for (const key of Object.keys(defaults)) {
        const value = s[key]
        if (value === undefined || value === null) continue
        // Always include the value, even if empty string — so recipients don't
        // fall back to a different default (e.g. backgroundVideo)
        params.set(key.toLowerCase(), String(value))
    }

    if (endTime) {
        params.set('interval', endTime.toISOString())
    }

    const base = `${window.location.origin}${window.location.pathname}`
    return `${base}?${params.toString()}`
}
