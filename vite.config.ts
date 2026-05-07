import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            registerType: 'autoUpdate',
            injectRegister: 'auto',
            workbox: {
                globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
            },
            manifest: {
                name: 'When Do We Start?',
                short_name: 'WDWS',
                description: "The teacher's countdown timer",
                theme_color: '#1e293b',
                background_color: '#1e293b',
                display: 'standalone',
                scope: '/',
                start_url: '/',
            },
        }),
    ],
    base: '/',
    define: {
        __BUILD_DATE__: JSON.stringify(new Date().toISOString()),
    },
})
