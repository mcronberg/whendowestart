import { useState, useEffect } from 'react'
import type { BackgroundPreset } from '../settings/backgroundPresets'
import type { ContentPreset } from '../settings/types'

interface Presets {
    backgroundPresets: BackgroundPreset[]
    contentPresets: ContentPreset[]
}

export function usePresets(): Presets {
    const [backgroundPresets, setBackgroundPresets] = useState<BackgroundPreset[]>([])
    const [contentPresets, setContentPresets] = useState<ContentPreset[]>([])

    useEffect(() => {
        fetch('/backgroundPresets.json')
            .then((r) => r.json())
            .then(setBackgroundPresets)
            .catch(() => { })

        fetch('/contentPresets.json')
            .then((r) => r.json())
            .then(setContentPresets)
            .catch(() => { })
    }, [])

    return { backgroundPresets, contentPresets }
}
