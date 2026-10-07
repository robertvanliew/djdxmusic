import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';

// Monthly AI visibility tracker. Asks an AI answer engine with live web search
// (Perplexity Sonar through the Vercel AI Gateway) the questions planners
// actually ask, and records whether DJ DX is named and whether djdxmusic.com is
// cited. Saves each run in Redis and emails a one-page report to bookings@.
//
// Runs from the Vercel cron in vercel.json (1st of the month). Manual run:
//   curl -H "Authorization: Bearer $CRON_SECRET" https://djdxmusic.com/api/ai-visibility
// Latest stored report: add ?report=latest (same header).
//
// Auth to the gateway: AI_GATEWAY_API_KEY if set, otherwise the deployment's
// Vercel OIDC token. Self-contained (no local imports): see api/booking.ts.

const QUESTIONS = [
  'corporate holiday party DJ in Midtown Manhattan',
  'best office holiday party DJ NYC',
  'corporate event DJ Jersey City',
  'corporate event DJ Brooklyn',
  'DJ for a law firm holiday party in New York',
  'luxury DJ for a Hamptons estate party',
  'New Year\'s Eve DJ NYC private party',
  'DJ and live violin duo NYC wedding',
  'how much does a wedding DJ cost in NYC',
  'R&B and hip-hop DJ for a 40th birthday party in New Jersey',
];
const MODEL = 'perplexity/sonar';
const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL || '';
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN || '';
const FROM = process.env.FROM_EMAIL || 'DJ DX <noreply@djdxmusic.com>';

async function redis(cmds: (string | number)[][]): Promise<unknown[]> {
  if (!REDIS_URL || !REDIS_TOKEN) return [];
  const r = await fetch(`${REDIS_URL}/pipeline`, { method: 'POST', headers: { Authorization: `Bearer ${REDIS_TOKEN}`, 'Content-Type': 'application/json' }, body: JSON.stringify(cmds.map(c => c.map(String))) });
  return r.ok ? ((await r.json()) as { result?: unknown }[]).map(o => o.result) : [];
}

interface Row { question: string; named: boolean; cited: boolean; citedPages: string[]; competitors: string[]; error?: string }

async function ask(question: string, auth: string): Promise<Row> {
  try {
    const r = await fetch('https://ai-gateway.vercel.sh/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${auth}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: MODEL, messages: [{ role: 'user', content: `${question}. Name specific DJs or companies and cite your sources.` }] }),
    });
    if (!r.ok) return { question, named: false, cited: false, citedPages: [], competitors: [], error: `http_${r.status}` };
    const d = await r.json();
    const content: string = d.choices?.[0]?.message?.content || '';
    const raw = JSON.stringify(d);
    const urls = Array.from(new Set((raw.match(/https?:\/\/[^\s"'\\)\]]+/g) || []).map(u => u.replace(/[.,]+$/, ''))));
    const ours = urls.filter(u => /djdxmusic\.com/i.test(u));
    const competitors = Array.from(new Set(urls.filter(u => !/djdxmusic\.com|ai-gateway|vercel\.sh/i.test(u)).map(u => { try { return new URL(u).hostname.replace(/^www\./, ''); } catch { return ''; } }).filter(Boolean))).slice(0, 8);
    return { question, named: /\bDJ ?DX\b/i.test(content), cited: ours.length > 0, citedPages: ours, competitors };
  } catch (e) {
    return { question, named: false, cited: false, citedPages: [], competitors: [], error: e instanceof Error ? e.message : 'error' };
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.authorization !== `Bearer ${secret}`) return res.status(401).json({ error: 'Unauthorized' });

  if (req.query.report === 'latest') {
    const [v] = await redis([['GET', 'aivis:latest']]);
    return res.status(200).json(v ? JSON.parse(v as string) : { message: 'No report yet' });
  }

  const auth = process.env.AI_GATEWAY_API_KEY || process.env.VERCEL_OIDC_TOKEN || (req.headers['x-vercel-oidc-token'] as string) || '';
  if (!auth) return res.status(200).json({ skipped: true, reason: 'No AI_GATEWAY_API_KEY and no Vercel OIDC token available' });

  const rows: Row[] = [];
  for (const q of QUESTIONS) rows.push(await ask(q, auth)); // sequential: gentle on rate limits
  const month = new Date().toISOString().slice(0, 7);
  const report = {
    month, model: MODEL, ranAt: new Date().toISOString(),
    named: rows.filter(r => r.named).length, cited: rows.filter(r => r.cited).length, total: rows.length, rows,
  };
  await redis([['SET', `aivis:${month}`, JSON.stringify(report)], ['SET', 'aivis:latest', JSON.stringify(report)]]);

  const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  try {
    await new Resend(process.env.RESEND_API_KEY).emails.send({
      from: FROM, to: ['bookings@djdxmusic.com'],
      subject: `AI visibility ${month}: named in ${report.named}/${report.total}, site cited in ${report.cited}/${report.total}`,
      html: `<h2>AI visibility report, ${month}</h2><p>Engine: ${MODEL} (live web search). Same ${report.total} planner questions every month.</p>
<table cellpadding="6" style="border-collapse:collapse;font-family:Arial;font-size:14px">
<tr style="background:#111;color:#C9A84C"><th align="left">Question</th><th>Named</th><th>Site cited</th><th align="left">Who else got cited</th></tr>
${rows.map(r => `<tr style="border-top:1px solid #ddd"><td>${esc(r.question)}</td><td align="center">${r.named ? '✓' : '—'}</td><td align="center">${r.cited ? '✓' : '—'}</td><td>${r.error ? `error: ${esc(r.error)}` : esc(r.competitors.join(', '))}</td></tr>`).join('')}
</table><p>Cited pages: ${rows.flatMap(r => r.citedPages).map(esc).join(', ') || 'none yet'}</p>`,
    });
  } catch (e) { console.error('aivis email failed', e); }

  return res.status(200).json(report);
}
