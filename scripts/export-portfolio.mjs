/**
 * Portfolio export (ADR-165). Builds the game for a sub-path and copies it into
 * the portfolio's static `public/` folder, the way `public/docs/gazelle.html`
 * ships: Netlify/Vercel build the site and serve these files untouched.
 *
 *   corepack pnpm export:portfolio            # → ../pf26/packages/personal-doc/public/game
 *   node scripts/export-portfolio.mjs [target]
 *
 * `vite build --base=/game/` is what makes this work: the built index.html
 * references its assets absolutely, so a copy at `/game/` would 404 without it.
 *
 * The Test Playground is not here: it is a dev-server surface (ADR-104) and the
 * static copy cannot answer its /__pg calls. The hub links to the tools host
 * (TOOLS_URL) for it instead.
 */
import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderHub } from './static-hub.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
const built = join(root, 'dist-portfolio');
const mocks = join(root, 'docs/mocks');
const tools = process.env.TOOLS_URL || 'https://bangalore-times.onrender.com';
// The portfolio sits beside this repo (E:\Projects\pf26 next to
// E:\Projects\bangalore-nights\game), so it is two levels up from `game/`.
// Override with the first argument or PORTFOLIO_GAME_DIR.
const target = resolve(
  process.argv[2] || process.env.PORTFOLIO_GAME_DIR || join(root, '../../pf26/packages/personal-doc/public/game'),
);

if (!existsSync(join(built, 'index.html'))) {
  console.error(`✗ ${built}/index.html not found — run: vite build --base=/game/ --outDir dist-portfolio`);
  process.exit(1);
}

// Replace, never merge: a stale asset from an old build would otherwise linger.
rmSync(target, { recursive: true, force: true });
mkdirSync(target, { recursive: true });
cpSync(built, target, { recursive: true });
// Mock boards live outside the Vite root, so the dev hub serves them with
// middleware (ADR-163); statically they are just files.
cpSync(mocks, join(target, 'mocks'), { recursive: true });
// The service worker stays: its navigation fallback already refuses /hub.html
// and /mocks/** (vite.config.ts navigateFallbackDenylist), so it cannot shadow
// either page — at /game/ or at a deploy root.

writeFileSync(join(target, 'hub.html'), renderHub({ tools }));

function size(dir) {
  let bytes = 0;
  let files = 0;
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    const st = statSync(path);
    if (st.isDirectory()) {
      const inner = size(path);
      bytes += inner.bytes;
      files += inner.files;
    } else {
      bytes += st.size;
      files += 1;
    }
  }
  return { bytes, files };
}

const { bytes, files } = size(target);
console.log(`✓ exported ${files} files (${(bytes / 1024 / 1024).toFixed(1)} MB) → ${target}`);
console.log(`  game:       ./index.html`);
console.log(`  hub:        ./hub.html`);
console.log(`  mocks:      ./mocks/p6-style-board/p6-mock-board.html`);
console.log(`  playground: ${tools}/playground.html (tools host, dev server)`);
