import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/Strudl-app/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Strudl',
        short_name: 'Strudl',
        description: 'Your loyalty, beautifully simple.',
        theme_color: '#EDE8DF',
        background_color: '#EDE8DF',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/Strudl-app/',
        scope: '/Strudl-app/',
        icons: [
          { src: '/Strudl-app/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/Strudl-app/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }
        ]
      }
    })
  ]
})
