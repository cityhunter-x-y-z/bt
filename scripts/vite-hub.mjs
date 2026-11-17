/**
 * Dev hub plugin (ADR-163). `apply: 'serve'`: it exists only under `vite dev` —
 * never in a build, like the Test Playground (ADR-104).
 *
 * One server, every surface. `pnpm hub` starts the normal game dev server on
 * 6174 and opens `/hub.html`, which lists the three dev surfaces and the CLI
 * commands. The game keeps `/`, the Playground keeps `/playground.html`
 * (Vite serves any root HTML), and this plugin adds the one thing Vite can't:
 * the mock boards, which live outside the server root in `docs/mocks/`.
 *
 *   GET /mocks/**      → docs/mocks/** (UI mock boards; dev only)
 *   GET /__hub/info    → { name, version, node, root } for the hub header
 *
 * Nothing here is reachable in a production build: `rollupOptions.input` is
 * `index.html` only, and `scripts/check-dist.mjs` fails a build that leaks
 * "hub.html".
 */
import { createReadStream, existsSync, readFileSync, statSync } from 'node:fs';
import { timingSafeEqual } from 'node:crypto';
import { dirname, extname, join, normalize, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
export const MOCKS_DIR = join(root, 'docs/mocks');

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
  '.md': 'text/plain; charset=utf-8',
};

/**
 * Map a `/mocks/...` URL onto a real file in docs/mocks, or null. Refuses
 * anything that escapes the directory, and anything that isn't a file.
 */
export function mockFile(urlPath, dir = MOCKS_DIR) {
  const rel = decodeURIComponent(urlPath.replace(/^\/mocks\/?/, ''));
  if (!rel) return null;
  // normalize() collapses ".."; the prefix check then rejects anything that
  // still points outside docs/mocks.
  const path = resolve(dir, normalize(rel));
  if (path !== dir && !path.startsWith(dir.endsWith(sep) ? dir : dir + sep)) return null;
  if (!existsSync(path) || !statSync(path).isFile()) return null;
  return path;
}

export function hubPlugin() {  return {
    name: 'bangalore-times-hub',
    apply: 'serve',
    configureServer(server) {
      // Before Vite's own middlewares: /mocks/* would otherwise 404 (it is
      // outside the server root) or be swallowed by the SPA fallback.
      server.middlewares.use((req, res, next) => {
        const url = req.url ?? '';
        if (!url.startsWith('/mocks')) return next();

        if (req.method !== 'GET' && req.method !== 'HEAD') {
          res.statusCode = 405;
          res.setHeader('allow', 'GET, HEAD');
          return res.end('Method Not Allowed');
        }

        const path = mockFile(url.split('?')[0]);
        if (!path) {
          res.statusCode = 404;
          res.setHeader('content-type', 'text/plain; charset=utf-8');
          return res.end(`No mock board at ${url}\n\nAvailable: /mocks/p6-style-board/p6-mock-board.html\n`);
        }

        res.statusCode = 200;
        res.setHeader('content-type', TYPES[extname(path).toLowerCase()] ?? 'application/octet-stream');
        res.setHeader('cache-control', 'no-store');
        if (req.method === 'HEAD') return res.end();
        createReadStream(path).pipe(res);
      });

      server.middlewares.use('/__hub/info', (req, res) => {
        let version = null;
        try {
          version = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8')).version ?? null;
        } catch { /* the header just shows "unknown" */ }
        res.statusCode = 200;
        res.setHeader('content-type', 'application/json');
        res.setHeader('cache-control', 'no-store');
        res.end(JSON.stringify({ name: 'Bangalore Times', version, node: process.version, port: server.config.server.port ?? null }));
      });
    },
  };
}

/**
 * Optional HTTP Basic gate for the hosted showcase (ADR-164). Only registers
 * when HUB_PASSWORD is set, so local dev is untouched.
 *
 * It guards writes only (anything that is not GET/HEAD). Reading is public, so a
 * portfolio visitor can play the game, open the playground and the mock boards;
 * saving a preset / exporting a scene needs the password, because the host runs
 * the real dev server and `/__pg/export` writes into src/data.
 */
export function authPlugin(password = process.env.HUB_PASSWORD) {
  if (!password) return null;
  const user = process.env.HUB_USER || 'demo';
  const expected = Buffer.from(`${user}:${password}`);
  const ok = (header) => {
    if (typeof header !== 'string' || !header.startsWith('Basic ')) return false;
    const got = Buffer.from(header.slice(6), 'base64');
    return got.length === expected.length && timingSafeEqual(got, expected);
  };

  return {
    name: 'bangalore-times-auth',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const read = req.method === 'GET' || req.method === 'HEAD';
        if (read || ok(req.headers.authorization)) return next();
        res.statusCode = 401;
        res.setHeader('www-authenticate', 'Basic realm="Bangalore Times showcase", charset="UTF-8"');
        res.setHeader('content-type', 'text/plain; charset=utf-8');
        res.end('Password required to change anything on the hosted build.\n');
      });
    },
  };
}
