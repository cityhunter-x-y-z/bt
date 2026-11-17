import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
// Dev-only Test Playground endpoints (ADR-104); `apply: 'serve'` keeps it out of builds.
import { playgroundPlugin } from './scripts/vite-playground.mjs';
// Dev-only hub page + mock boards on one server (ADR-163); `apply: 'serve'` too.
// `authPlugin` is null unless HUB_PASSWORD is set, which only the hosted
// showcase sets (ADR-164).
import { authPlugin, hubPlugin } from './scripts/vite-hub.mjs';
import pkg from './package.json' with { type: 'json' };

// Standalone build for the game. When consumed as a library, the host's bundler
// (personal-doc's Vite) transpiles src/index.ts directly — this config isn't used.
// Hosted showcase (ADR-164): the host provides PORT. Unset locally, so `pnpm dev`
// keeps its pinned 6174. When hosted we bind publicly, drop the HMR websocket
// (the platform's TLS proxy would break it) and accept the platform's Host header.
const hostedPort = Number(process.env.PORT) || null;
const auth = authPlugin();

export default defineConfig({
  // Repo guardrail: no ports starting with 4 or 5 (Vite's 5173 default is out).
  server: {
    port: hostedPort ?? 6174,
    strictPort: true,
    ...(hostedPort ? { host: true, allowedHosts: true, hmr: false } : {}),
  },
  // Settings → About shows this.
  define: { __APP_VERSION__: JSON.stringify(pkg.version) },
  plugins: [
    ...(auth ? [auth] : []),
    react(),
    playgroundPlugin(),
    hubPlugin(),
    // Phase 1 of the v1.0 distribution plan: ship as an installable PWA before
    // any native wrapper. Workbox precaches the bundle and the sprite/tilemap
    // assets so a returning player gets an offline-capable launch.
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.png'],
      manifest: {
        name: 'Bangalore Times',
        short_name: 'Bangalore Times',
        description: 'A top-down pixel RPG set in Bengaluru.',
        theme_color: '#0e0f13',
        background_color: '#0e0f13',
        display: 'fullscreen',
        orientation: 'landscape',
        start_url: '.',
        scope: '.',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          {
            src: 'maskable-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,jpg,svg,woff2,json,tmj}'],
        // Phaser alone clears the 2 MiB default; tilesets will push it further.
        maximumFileSizeToCacheInBytes: 8 * 1024 * 1024,
        // The hub and the mock boards are pages next to the game, not part of
        // it: without this the SW's navigation fallback answers them with the
        // game shell (ADR-165). Base-agnostic, so /game/hub.html matches too.
        navigateFallbackDenylist: [/\/hub\.html$/, /\/mocks\//],
        // Audio is not precached (≈9 MB would weigh on a first visit): each file is cached the first time it plays (ADR-139).
        runtimeCaching: [{ urlPattern: /\.(?:wav|ogg|m4a)$/, handler: 'CacheFirst', options: { cacheName: 'audio', expiration: { maxEntries: 600 } } }],
      },
    }),
  ],
  build: {
    target: 'es2020',
    // Pixel art must not be inlined as base64 — keep asset files addressable so
    // Workbox can precache them.
    assetsInlineLimit: 0,
    // The game page only. playground.html is served by `vite dev` and is never
    // an input here — scripts/check-dist.mjs fails the build if it leaks in.
    rollupOptions: { input: 'index.html' },
  },
});
