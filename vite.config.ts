import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'node:fs'
import path from 'node:path'

// Plugin: write public/version.json with the build timestamp on every build
function writeVersionJson(): import('vite').Plugin {
    const buildDate = new Date().toISOString()
    return {
        name: 'write-version-json',
        buildStart() {
            const dest = path.resolve(__dirname, 'public', 'version.json')
            fs.writeFileSync(dest, JSON.stringify({ buildDate }, null, 2))
        },
    }
}

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        writeVersionJson(),
    ],
    base: '/',
    define: {
        __BUILD_DATE__: JSON.stringify(new Date().toISOString()),
    },
})
