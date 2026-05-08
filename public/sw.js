// Service Worker — network-first for everything.
// Always fetches fresh content; cache is only used as offline fallback.

const CACHE_NAME = 'wdws-v1'

self.addEventListener('install', () => {
    self.skipWaiting()
})

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
            .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
            .then(() => self.clients.claim())
    )
})

self.addEventListener('fetch', (event) => {
    // Only handle GET requests
    if (event.request.method !== 'GET') return

    event.respondWith(
        fetch(event.request, { cache: 'no-store' })
            .then((response) => {
                if (response.ok) {
                    caches.open(CACHE_NAME).then((cache) => cache.put(event.request, response.clone()))
                }
                return response
            })
            .catch(() => caches.match(event.request))
    )
})
