/**
 * The static hub page (ADR-165). One template, two destinations:
 *
 *   scripts/bundle-static.mjs   → dist/hub.html, shipped by the Vercel build
 *   scripts/export-portfolio.mjs → <portfolio>/public/game/hub.html
 *
 * It is deliberately plain HTML with no fetches: the dev hub (`hub.html` at the
 * repo root, ADR-163) reads `/__hub/info` and lists commands; this one only
 * links. `check-dist` skips this file by name (see INTENTIONAL_DEV_PAGES) so the
 * words "Test Playground" and "/playground.html" in it do not read as shipped
 * playground code.
 */
const LINKS = {
  game: './',
  mocks: './mocks/p6-style-board/p6-mock-board.html',
};

export function renderHub({ tools = '', eyebrow = 'Dev hub · static copy' } = {}) {
  const playground = tools ? `${tools}/playground.html` : '';
  const playgroundCard = playground
    ? `<a class="card" data-surface="playground" href="${playground}" target="_blank" rel="noopener noreferrer">
            <h3>Test Playground</h3>
            <span class="path">tools host</span>
            <p>Jump to any intro, scene or beat with everything earlier already done. Needs the dev server, so it lives on its own host.</p>
          </a>`
    : `<div class="card" data-surface="playground" aria-disabled="true">
            <h3>Test Playground</h3>
            <span class="path">dev server only</span>
            <p>Jump to any intro, scene or beat with everything earlier already done. Run <code>pnpm hub</code> in the game repo to open it locally.</p>
          </div>`;

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Bangalore Times — Dev Hub</title>
    <link rel="icon" type="image/png" href="./favicon.png" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Pixelify+Sans:wght@400;700&family=Atkinson+Hyperlegible:wght@400;700&display=swap" />
    <style>
      :root{color-scheme:dark;--bg:#0e0f0d;--panel:#161814;--panel-hi:#1c1f1a;--ink:#e9e6dc;--dim:#9d9c8f;--line:#2b2e27;--lcd:#c3c58f;--game:#e05454;--play:#e0a454;--mocks:#6fa8dc}
      *{box-sizing:border-box}html,body{margin:0}
      body{background:var(--bg);color:var(--ink);font:15px/1.55 "Atkinson Hyperlegible",system-ui,sans-serif;min-height:100vh}
      .wrap{max-width:1080px;margin:0 auto;padding:48px 20px 64px;display:grid;gap:40px}
      header{display:grid;gap:10px}
      .eyebrow{font-family:"Pixelify Sans",ui-monospace,monospace;color:var(--lcd);letter-spacing:.14em;text-transform:uppercase;font-size:12px}
      h1,h2{font-family:"Pixelify Sans",ui-monospace,monospace;font-weight:700;margin:0;text-wrap:balance}
      h1{font-size:clamp(28px,4.5vw,40px);line-height:1.05}
      h2{font-size:16px;letter-spacing:.08em;text-transform:uppercase;color:var(--lcd)}
      p{margin:0;max-width:70ch;color:var(--dim)}
      code{font-family:ui-monospace,monospace;color:var(--ink)}
      section{display:grid;gap:14px}
      .cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:16px}
      .card{position:relative;display:grid;gap:8px;padding:18px;background:var(--panel);border:2px solid var(--line);border-radius:2px;color:inherit;text-decoration:none;transition:background 120ms ease,border-color 120ms ease,transform 120ms ease}
      .card:hover,.card:focus-visible{background:var(--panel-hi);border-color:var(--accent);transform:translateY(-2px)}
      .card:focus-visible{outline:2px solid var(--lcd);outline-offset:2px}
      .card[aria-disabled="true"]{opacity:.72}
      .card h3{font-family:"Pixelify Sans",ui-monospace,monospace;font-size:20px;margin:0;color:var(--accent)}
      .card .path{font-family:ui-monospace,monospace;font-size:12.5px;color:var(--ink);background:#0b0c0a;border:1px solid var(--line);padding:3px 7px;justify-self:start;border-radius:2px}
      .card p{font-size:14px}
      .card[data-surface="game"]{--accent:var(--game)}
      .card[data-surface="playground"]{--accent:var(--play)}
      .card[data-surface="mocks"]{--accent:var(--mocks)}
      footer{display:grid;gap:6px;padding-top:8px;border-top:1px solid var(--line);font-size:13px;color:var(--dim)}
      @media (prefers-reduced-motion: reduce){.card{transition:none}.card:hover,.card:focus-visible{transform:none}}
    </style>
  </head>
  <body>
    <div class="wrap">
      <header>
        <span class="eyebrow">${eyebrow}</span>
        <h1>Bangalore Times</h1>
        <p>Everything this build can show you without a server: the game, and the mock boards it was designed against.</p>
      </header>
      <section>
        <h2>Open</h2>
        <div class="cards">
          <a class="card" data-surface="game" href="${LINKS.game}">
            <h3>Game</h3>
            <span class="path">./</span>
            <p>The real build: title screen, districts, story. This is what ships to web, PWA and the native shells.</p>
          </a>
          ${playgroundCard}
          <a class="card" data-surface="mocks" href="${LINKS.mocks}">
            <h3>Mock boards</h3>
            <span class="path">${LINKS.mocks}</span>
            <p>UI style boards from <code>docs/mocks/</code>: HUD, dialogue card, the phone, the map, the bag.</p>
          </a>
        </div>
      </section>
      <footer>
        <span>Generated by the build from the game repo — do not edit this file; edit <code>scripts/static-hub.mjs</code>.</span>
      </footer>
    </div>
  </body>
</html>
`;
}
