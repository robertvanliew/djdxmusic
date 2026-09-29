/**
 * Post-build prerenderer — snapshots every route to static HTML.
 *
 * Why: the site is a Vite/React SPA. Without this step every URL serves an
 * empty <div id="root"> shell, so AI crawlers (GPTBot, ClaudeBot,
 * PerplexityBot, Bingbot) see zero content and Google receives duplicate
 * homepage metadata on all 30+ routes. This script boots the built app in
 * headless Chrome, waits for each route to render (react-helmet-async head
 * included), and writes the resulting HTML to dist/<route>/index.html.
 * Vercel serves those static files before the SPA rewrite kicks in, and the
 * React bundle still hydrates on top for interactivity.
 *
 * Runs automatically via the npm "postbuild" hook.
 */
import { createServer } from 'node:http';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync, readFileSync } from 'node:fs';
import { extname, join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

// Local builds use the full puppeteer package (bundled Chrome). Vercel build
// containers can't run that binary reliably, so there we launch
// @sparticuz/chromium (compiled for Amazon Linux) via puppeteer-core.
async function launchBrowser() {
  if (process.env.VERCEL) {
    const { default: chromium } = await import('@sparticuz/chromium');
    const { default: puppeteer } = await import('puppeteer-core');
    return puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: true,
    });
  }
  const { default: puppeteer } = await import('puppeteer');
  return puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  });
}

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(ROOT, 'dist');
const PORT = 4173 + Math.floor(Math.random() * 500);

// Routes mirror src/main.tsx. /admin is intentionally excluded (robots-blocked,
// login-gated). /thank-you is included so its noindex tag ships statically.
const STATIC_ROUTES = [
  '/',
  '/music',
  '/epk',
  '/soul-shades',
  '/pricing',
  '/terms',
  '/privacy',
  '/refunds',
  '/booking-policy',
  '/office-party-music-poll',
  '/faq',
  '/contact',
  '/thank-you',
  '/news',
  '/corporate-event-dj-nyc-nj-ct',
  '/violin-dj-duo-nyc-nj',
  '/piano-dj-duo-nyc-nj',
  '/hamptons-luxury-dj',
  '/destination-wedding-dj',
  '/wedding-dj-nyc-nj',
  '/wedding-entertainment-package-nyc-nj',
  '/wedding-dj-cost-nyc',
  '/event-dj-cost-nyc-nj-ct',
  '/wedding-dj-manhattan-nyc',
  '/wedding-dj-long-island-ny',
  '/wedding-dj-stamford-ct',
  '/wedding-dj-northern-nj',
  '/wedding-dj-westchester-ny',
  '/afrobeats-amapiano-dj-nyc-nj',
  '/rb-hip-hop-dj-nyc-nj',
  '/dj-for-hire-nyc',
  '/new-years-eve-dj-nyc',
  '/holiday-party-dj-nyc-nj-ct',
  '/private-party-dj-nyc-nj',
  '/hip-hop-dj-nyc-nj',
  '/sweet-16-dj-nyc-nj',
  '/sweet-16-dj-hudson-valley-ny',
  '/rooftop-party-dj-nyc',
  '/rb-dj-nyc-nj',
  '/house-jersey-club-dj-nyc-nj',
];

// News slugs come from the data source so future posts prerender automatically.
function newsRoutes() {
  const src = readFileSync(join(ROOT, 'src', 'news.ts'), 'utf8');
  return [...src.matchAll(/slug:\s*['"]([^'"]+)['"]/g)].map(m => `/news/${m[1]}`);
}

const MIME = {
  '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript',
  '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.webp': 'image/webp', '.gif': 'image/gif', '.ico': 'image/x-icon',
  '.mp3': 'audio/mpeg', '.wav': 'audio/wav', '.woff': 'font/woff',
  '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.txt': 'text/plain',
  '.xml': 'application/xml', '.md': 'text/markdown', '.pdf': 'application/pdf',
};

// Minimal static server over dist with SPA fallback. /api/* 404s so client
// fetches fail fast and components fall back to bundled defaults.
function serveDist() {
  const shell = readFileSync(join(DIST, 'index.html'));
  const server = createServer(async (req, res) => {
    const url = new URL(req.url, `http://localhost:${PORT}`);
    if (url.pathname.startsWith('/api/')) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      return res.end('{"error":"no api during prerender"}');
    }
    const filePath = join(DIST, decodeURIComponent(url.pathname));
    if (existsSync(filePath) && extname(filePath)) {
      try {
        const body = await readFile(filePath);
        res.writeHead(200, { 'Content-Type': MIME[extname(filePath)] || 'application/octet-stream' });
        return res.end(body);
      } catch { /* fall through */ }
    }
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(shell);
  });
  return new Promise(ok => server.listen(PORT, () => ok(server)));
}

// Music poll links (/poll/:id, /poll/:id/results) are per-poll and can't be
// prerendered, so they'd otherwise fall back to dist/index.html - which by then
// is the prerendered HOMEPAGE, head tags and all. Slack/Teams/iMessage don't run
// JS, so a shared voting link would unfurl as the homepage card, and the page
// would carry the homepage's index,follow alongside its own noindex.
// Instead, vercel.json rewrites /poll/* to this: the untouched Vite shell (it
// has no title/robots/og tags) plus poll-specific preview tags. Must run before
// dist/index.html is overwritten below.
async function writePollShell() {
  const raw = await readFile(join(DIST, 'index.html'), 'utf8');
  const head = [
    '<title>Vote on the music | Office Party Music Poll by DJ DX</title>',
    '<meta name="description" content="Help pick the music for the office party. It takes under a minute, it\'s anonymous, and there\'s no sign-up." />',
    '<meta name="robots" content="noindex, nofollow" />',
    '<meta property="og:type" content="website" />',
    '<meta property="og:site_name" content="DJ DX" />',
    '<meta property="og:title" content="Vote on the music for the office party" />',
    '<meta property="og:description" content="Pick your top genres and request a song. Under a minute, anonymous, no sign-up." />',
    '<meta property="og:image" content="https://djdxmusic.com/og-image.jpg" />',
    '<meta name="twitter:card" content="summary_large_image" />',
  ].join('\n    ');
  if (!raw.includes('</head>')) throw new Error('prerender: no </head> in dist/index.html');
  await writeFile(join(DIST, 'poll-shell.html'), raw.replace('</head>', `    ${head}\n  </head>`));
  console.log('prerender: wrote dist/poll-shell.html');
}

async function prerender() {
  if (!existsSync(join(DIST, 'index.html'))) {
    console.error('prerender: dist/index.html not found — run vite build first');
    process.exit(1);
  }

  await writePollShell();

  const routes = [...STATIC_ROUTES, ...newsRoutes()];
  const server = await serveDist();
  const browser = await launchBrowser();

  const results = new Map();
  const failures = [];
  const CONCURRENCY = 4;
  const queue = [...routes];

  async function worker() {
    const page = await browser.newPage();
    // Reduced motion keeps the scroll-reveal hook from hiding content
    // (opacity:0) in the captured HTML.
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
    // Keep prerender hits out of GA4 and skip heavy third-party embeds.
    await page.setRequestInterception(true);
    page.on('request', r => {
      const u = r.url();
      if (u.includes('googletagmanager.com') || u.includes('google-analytics.com') ||
          u.includes('youtube.com') || u.includes('youtube-nocookie.com') || u.includes('tiktok.com')) {
        return r.abort();
      }
      r.continue();
    });

    while (queue.length) {
      const route = queue.shift();
      try {
        await page.goto(`http://localhost:${PORT}${route}`, { waitUntil: 'networkidle2', timeout: 45000 });
        // Lazy routes resolve after the shell paints — wait for real content.
        await page.waitForFunction(
          () => (document.querySelector('#root')?.textContent?.length ?? 0) > 200,
          { timeout: 20000 },
        );
        const html = await page.evaluate(() => '<!doctype html>\n' + document.documentElement.outerHTML);
        results.set(route, html);
        console.log(`prerendered ${route} (${(html.length / 1024).toFixed(0)} KB)`);
      } catch (err) {
        failures.push(route);
        console.error(`FAILED ${route}: ${err.message}`);
      }
    }
    await page.close();
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, worker));
  await browser.close();
  server.close();

  // Flush after the crawl so overwriting dist/index.html can't poison the
  // SPA fallback that other routes were served from.
  for (const [route, html] of results) {
    const outFile = route === '/' ? join(DIST, 'index.html') : join(DIST, route.slice(1), 'index.html');
    await mkdir(dirname(outFile), { recursive: true });
    await writeFile(outFile, html);
  }

  console.log(`\nprerender: ${results.size}/${routes.length} routes written`);
  if (failures.length) {
    console.error(`prerender: failed routes: ${failures.join(', ')}`);
    process.exit(1);
  }
}

prerender().catch(err => { console.error(err); process.exit(1); });
