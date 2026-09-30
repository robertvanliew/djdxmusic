// IndexNow: tells Bing (and Yandex, Seznam, Naver) that pages changed, so they
// recrawl in hours instead of weeks. Bing's index feeds ChatGPT search and
// Microsoft Copilot, so this is also how new pages reach AI answers.
// Google does NOT support IndexNow - Google gets the sitemap instead.
//
// Ownership is proven by public/<KEY>.txt, whose content is the key itself.
//
// Usage (after a deploy is live):
//   npm run indexnow -- /holiday-party-dj-nyc-nj-ct /office-party-music-poll   specific pages
//   npm run indexnow -- --all                                                  every URL in the sitemap
// Only submit pages that actually changed; blanket resubmits of unchanged
// pages are discouraged by the protocol.
import { readFileSync } from 'node:fs';

const KEY = 'fb53fd48e084c8044646ae379ff7f217';
const HOST = 'djdxmusic.com';
const args = process.argv.slice(2);

let urls;
if (args.includes('--all')) {
  const xml = readFileSync(new URL('../public/sitemap.xml', import.meta.url), 'utf8');
  urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1].trim());
} else {
  urls = args.map(a => (a.startsWith('http') ? a : `https://${HOST}${a.startsWith('/') ? '' : '/'}${a}`));
}
if (!urls.length) { console.error('indexnow: pass paths/URLs or --all'); process.exit(1); }

const keyCheck = await fetch(`https://${HOST}/${KEY}.txt`);
if (!keyCheck.ok || (await keyCheck.text()).trim() !== KEY) {
  console.error(`indexnow: key file https://${HOST}/${KEY}.txt is not live yet - deploy first`);
  process.exit(1);
}

const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList: urls }),
});
// 200 = accepted, 202 = accepted (key validation pending); anything else is a problem
console.log(`indexnow: HTTP ${res.status} for ${urls.length} URL(s)`);
if (res.status !== 200 && res.status !== 202) { console.error(await res.text()); process.exit(1); }
