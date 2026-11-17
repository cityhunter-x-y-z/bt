/**
 * Adds the static hub and the mock boards to `dist/` (ADR-165), so one deploy
 * serves the game, `/hub.html` and `/mocks/**` — the Vercel build needs no
 * second host for them.
 *
 *   node scripts/bundle-static.mjs [distDir]
 *
 * Runs after `vite build` and before `check-dist`. `check-dist` skips `hub.html`
 * and `mocks/**` by name: they are pages, not dev code (see INTENTIONAL_PAGES
 * there). The Test Playground is still not here — it is a dev server (ADR-104);
 * the hub links out to `TOOLS_URL` when that host exists.
 */
import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderHub } from './static-hub.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
const dist = resolve(process.argv[2] || join(root, 'dist'));
const mocks = join(root, 'docs/mocks');
const tools = process.env.TOOLS_URL || '';

if (!existsSync(join(dist, 'index.html'))) {
  console.error(`✗ ${dist}/index.html not found — run vite build first`);
  process.exit(1);
}

if (existsSync(mocks)) {
  cpSync(mocks, join(dist, 'mocks'), { recursive: true });
} else {
  console.warn('⚠ docs/mocks not found — the hub will 404 its mock-board card');
}

mkdirSync(dist, { recursive: true });
writeFileSync(join(dist, 'hub.html'), renderHub({ tools }));

console.log(`✓ static hub + mock boards added to ${dist}`);
console.log(`  /hub.html  /mocks/p6-style-board/p6-mock-board.html`);
console.log(tools ? `  playground → ${tools}/playground.html` : '  playground → local only (set TOOLS_URL to link a host)');
