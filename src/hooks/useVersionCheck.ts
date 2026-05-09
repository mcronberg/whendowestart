import { useState, useEffect } from 'react'

export function useVersionCheck(): boolean {
    const [updateAvailable, setUpdateAvailable] = useState(false)

    useEffect(() => {
        const appDate = typeof __BUILD_DATE__ !== 'undefined' ? __BUILD_DATE__ : null
        if (!appDate) return

        fetch('/version.json?_=' + Date.now(), { cache: 'no-store' })
            .then((r) => r.json())
            .then((data: { buildDate?: string }) => {
                if (data.buildDate && new Date(data.buildDate) > new Date(appDate)) {
                    setUpdateAvailable(true)
                }
            })
            .catch(() => { })
    }, [])

    return updateAvailable
}
