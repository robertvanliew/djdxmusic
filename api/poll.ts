import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';
import { createHash, randomBytes, timingSafeEqual } from 'crypto';

// Office Party Music Poll backend. One function, several actions (?a=...):
//   POST create   planner creates a poll        -> { pollId, adminKey }
//   GET  poll     public voting config          -> genres/flags, no planner data
//   POST vote     a coworker votes              -> { ok }
//   GET  results  tally (admin key, or public link if the planner enabled it)
//   POST manage   close early / toggle public results (admin key)
//
// Self-contained on purpose: Vercel's builder here does not bundle cross-file
// imports under api/ (see the note in api/booking.ts). One file also keeps the
// project well under the Hobby function limit.
//
// Storage is Upstash Redis over its REST API (plain fetch, no client library).
// Votes are aggregated atomically with HINCRBY, so results are a handful of
// reads no matter how many people vote. Every key carries an absolute expiry
// of close + 180 days, which IS the retention policy - no cleanup job exists
// or is needed. Planner lead details are also emailed to bookings@, so the
// lead outlives the poll data.

const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL || '';
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN || '';
const SITE = 'https://djdxmusic.com';
const FROM = process.env.FROM_EMAIL || 'DJ DX <noreply@djdxmusic.com>';
const resend = new Resend(process.env.RESEND_API_KEY);

const DAY = 86400;
const OPEN_DAYS = 60;        // polls auto-close 60 days after creation
const RETAIN_DAYS = 180;     // vote data deleted 180 days after close
const CREATE_LIMIT_PER_HOUR = 6;
// A soft cap, not one-vote-per-IP: a whole office often shares one public IP
// and identical managed laptops, so IP+UA collides for real coworkers. This
// only stops a single machine flooding a poll. The per-device check is the
// localStorage flag on the client.
const VOTE_SOFT_LIMIT = 20;
const MIN_CREATE_MS = 1500;
const MIN_VOTE_MS = 2000;

// Keep in sync with src/lib/poll.ts (duplicated because api/ can't import src/).
const GENRES = ['R&B/Soul', 'Hip-Hop', 'Pop', 'House/Dance', 'Afrobeats/Amapiano', 'Latin/Reggaeton', 'Old School/Classic', 'Disco/Funk', 'Rock', 'Country', 'Jersey Club'];
const ERAS = ['70s', '80s', '90s', '2000s', '2010s', 'Today'];
const EVENT_TYPES = ['Holiday party', 'Office party', 'Company celebration', 'Team offsite', 'Other'];
const HEADCOUNTS = ['Under 50', '50-100', '100-250', '250+'];
const LOCATIONS = ['NYC', 'NJ', 'Long Island/Westchester', 'CT', 'Other'];

// ── Redis (REST pipeline) ────────────────────────────────────────────────────
type Cmd = (string | number)[];
async function redis(cmds: Cmd[]): Promise<unknown[]> {
  if (!REDIS_URL || !REDIS_TOKEN) throw new Error('storage_not_configured');
  const r = await fetch(`${REDIS_URL}/pipeline`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${REDIS_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(cmds.map(c => c.map(String))),
  });
  if (!r.ok) throw new Error(`redis_http_${r.status}`);
  const out = (await r.json()) as { result?: unknown; error?: string }[];
  const err = out.find(o => o.error);
  if (err) throw new Error(`redis_${err.error}`);
  return out.map(o => o.result);
}
const hashToObj = (arr: unknown): Record<string, string> => {
  const a = (arr as string[]) || [];
  const o: Record<string, string> = {};
  for (let i = 0; i < a.length; i += 2) o[a[i]] = a[i + 1];
  return o;
};

// ── Helpers ──────────────────────────────────────────────────────────────────
const sha = (s: string) => createHash('sha256').update(s).digest('hex');
const now = () => Math.floor(Date.now() / 1000);
const clientIp = (req: VercelRequest) =>
  String(req.headers['x-real-ip'] || String(req.headers['x-forwarded-for'] || '').split(',')[0] || 'unknown').trim();
const str = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function pollId(): string {
  // 8 chars from an unambiguous alphabet (no 0/O/1/l/I) - short enough to read out loud
  const alphabet = 'abcdefghjkmnpqrstuvwxyz23456789';
  const bytes = randomBytes(8);
  return Array.from(bytes, b => alphabet[b % alphabet.length]).join('');
}

function keyMatches(given: string, storedHash: string): boolean {
  if (!given || !storedHash) return false;
  const a = Buffer.from(sha(given), 'hex');
  const b = Buffer.from(storedHash, 'hex');
  return a.length === b.length && timingSafeEqual(a, b);
}

// Basic profanity filter for free text. Deliberately short: the goal is to
// keep obvious slurs and explicit words out of a report a planner may share
// at work, not to police song titles (plenty of real tracks are "explicit").
const BLOCKED = ['fuck', 'shit', 'bitch', 'cunt', 'nigger', 'nigga', 'faggot', 'fag', 'retard', 'whore', 'slut', 'dick', 'pussy', 'cock', 'asshole', 'motherf'];
const isProfane = (s: string) => {
  const t = s.toLowerCase().replace(/[^a-z]/g, '');
  return BLOCKED.some(w => t.includes(w));
};

// "Drake feat. Rihanna – Take Care!!" and "drake ft rihanna take care" should
// count as one song. Drop featuring credits, punctuation, case and spacing.
function normalizeSong(artist: string, title: string): string {
  const clean = (s: string) =>
    s.toLowerCase()
      .replace(/\s*[([]?\s*(feat\.?|ft\.?|featuring|with)\s+[^)\]]*[)\]]?/g, ' ')
      .replace(/&/g, ' and ')
      .replace(/[^a-z0-9 ]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  return `${clean(artist)}|${clean(title)}`;
}
const displaySong = (artist: string, title: string) =>
  artist && title ? `${title} (${artist})` : title || artist;

interface Meta {
  id: string;
  adminKeyHash: string;
  createdAt: number;
  closesAt: number;
  status: 'open' | 'closed';
  publicResults: boolean;
  settings: { genres: string[]; allowSongs: boolean; allowDnp: boolean; cleanOnly: boolean };
  planner: { name: string; email: string; company: string; eventType: string; eventDate: string; headcount: string; location: string; marketingConsent: boolean };
}
const keys = (id: string) => ({
  meta: `poll:${id}:meta`,
  stats: `poll:${id}:stats`,
  genre: `poll:${id}:genre`,
  era: `poll:${id}:era`,
  energy: `poll:${id}:energy`,
  songs: `poll:${id}:songs`,
  songLabel: `poll:${id}:songlabel`,
  dnp: `poll:${id}:dnp`,
  dnpLabel: `poll:${id}:dnplabel`,
});
const expireAt = (m: Meta) => m.closesAt + RETAIN_DAYS * DAY;
const isOpen = (m: Meta) => m.status === 'open' && now() < m.closesAt;

async function loadMeta(id: string): Promise<Meta | null> {
  if (!/^[a-z0-9]{6,12}$/.test(id)) return null;
  const [raw] = await redis([['GET', keys(id).meta]]);
  return raw ? (JSON.parse(String(raw)) as Meta) : null;
}

// ── Actions ──────────────────────────────────────────────────────────────────
async function create(req: VercelRequest, res: VercelResponse) {
  const b = req.body || {};
  if (typeof b.honeypot === 'string' && b.honeypot.trim()) return res.status(200).json({ pollId: 'ok', adminKey: 'ok' }); // don't teach bots
  if (typeof b.elapsedMs !== 'number' || b.elapsedMs < MIN_CREATE_MS) return res.status(400).json({ error: 'Please take a moment and try again.' });

  const name = str(b.name, 80);
  const email = str(b.email, 120).toLowerCase();
  if (!name) return res.status(400).json({ error: 'Your name is required.' });
  if (!EMAIL_RE.test(email)) return res.status(400).json({ error: 'A valid work email is required.' });

  const genres = Array.isArray(b.genres) ? GENRES.filter(g => b.genres.includes(g)) : GENRES;
  if (genres.length < 3) return res.status(400).json({ error: 'Keep at least 3 genres so voters can pick their top 3.' });

  const ip = sha(`create|${clientIp(req)}`);
  const hourKey = `rl:create:${ip}:${Math.floor(now() / 3600)}`;
  const [count] = await redis([['INCR', hourKey], ['EXPIRE', hourKey, 3600]]);
  if (Number(count) > CREATE_LIMIT_PER_HOUR) return res.status(429).json({ error: 'Too many polls from this network. Try again in an hour.' });

  const adminKey = randomBytes(24).toString('base64url');
  const t = now();
  const planner = {
    name,
    email,
    company: str(b.company, 100),
    eventType: EVENT_TYPES.includes(b.eventType) ? b.eventType : 'Office party',
    eventDate: /^\d{4}-\d{2}-\d{2}$/.test(str(b.eventDate, 10)) ? str(b.eventDate, 10) : '',
    headcount: HEADCOUNTS.includes(b.headcount) ? b.headcount : '',
    location: LOCATIONS.includes(b.location) ? b.location : '',
    marketingConsent: b.marketingConsent === true,
  };
  let id = '';
  let meta: Meta | null = null;
  for (let i = 0; i < 4 && !id; i++) {
    const candidate = pollId();
    meta = {
      id: candidate, adminKeyHash: sha(adminKey), createdAt: t, closesAt: t + OPEN_DAYS * DAY,
      status: 'open', publicResults: false,
      settings: { genres, allowSongs: b.allowSongs !== false, allowDnp: b.allowDnp !== false, cleanOnly: b.cleanOnly !== false },
      planner,
    };
    const [ok] = await redis([['SET', keys(candidate).meta, JSON.stringify(meta), 'NX', 'EXAT', expireAt(meta)]]);
    if (ok === 'OK') id = candidate;
  }
  if (!id || !meta) return res.status(500).json({ error: 'Could not create the poll. Please try again.' });

  const voteUrl = `${SITE}/poll/${id}`;
  const resultsUrl = `${SITE}/poll/${id}/results?key=${adminKey}`;

  // Emails are best-effort: the success screen shows both links regardless,
  // so a mail hiccup never loses the planner their poll.
  const jobs: Promise<unknown>[] = [
    sendLead(meta, voteUrl).catch(e => console.error('poll lead email failed', e)),
  ];
  if (b.sendLinks !== false) jobs.push(sendPlanner(meta, voteUrl, resultsUrl).catch(e => console.error('poll planner email failed', e)));
  await Promise.all(jobs);

  return res.status(200).json({ pollId: id, adminKey });
}

async function publicPoll(req: VercelRequest, res: VercelResponse) {
  const m = await loadMeta(str(req.query.id, 20));
  if (!m) return res.status(404).json({ error: 'Poll not found.' });
  return res.status(200).json({
    id: m.id,
    company: m.planner.company,
    eventType: m.planner.eventType,
    genres: m.settings.genres,
    allowSongs: m.settings.allowSongs,
    allowDnp: m.settings.allowDnp,
    cleanOnly: m.settings.cleanOnly,
    open: isOpen(m),
    publicResults: m.publicResults,
  });
}

async function vote(req: VercelRequest, res: VercelResponse) {
  const b = req.body || {};
  const m = await loadMeta(str(b.id, 20));
  if (!m) return res.status(404).json({ error: 'Poll not found.' });
  if (!isOpen(m)) return res.status(409).json({ error: 'This poll is closed.' });
  if (typeof b.honeypot === 'string' && b.honeypot.trim()) return res.status(200).json({ ok: true });
  if (typeof b.elapsedMs !== 'number' || b.elapsedMs < MIN_VOTE_MS) return res.status(400).json({ error: 'Please take a moment and try again.' });

  const genres = Array.isArray(b.genres) ? [...new Set(b.genres as string[])].filter(g => m.settings.genres.includes(g)).slice(0, 3) : [];
  const eras = Array.isArray(b.eras) ? [...new Set(b.eras as string[])].filter(e => ERAS.includes(e)) : [];
  const energy = Math.round(Number(b.energy));
  if (genres.length < 1) return res.status(400).json({ error: 'Pick at least one genre.' });
  if (!(energy >= 1 && energy <= 5)) return res.status(400).json({ error: 'Set the energy level.' });

  const k = keys(m.id);
  const dedupeKey = `poll:${m.id}:dd:${sha(`${m.id}|${clientIp(req)}|${String(req.headers['user-agent'] || '')}`).slice(0, 32)}`;
  const [seen] = await redis([['INCR', dedupeKey], ['EXPIREAT', dedupeKey, expireAt(m)]]);
  if (Number(seen) > VOTE_SOFT_LIMIT) return res.status(429).json({ error: 'Too many votes from this device.' });

  const cmds: Cmd[] = [
    ['HINCRBY', k.stats, 'total', 1],
    ['HSET', k.stats, 'last', now()],
    ['HINCRBY', k.energy, 'sum', energy],
    ['HINCRBY', k.energy, 'n', 1],
    ...genres.map(g => ['HINCRBY', k.genre, g, 1] as Cmd),
    ...eras.map(e => ['HINCRBY', k.era, e, 1] as Cmd),
  ];
  if (m.settings.allowSongs && Array.isArray(b.songs)) {
    for (const s of (b.songs as { artist?: unknown; title?: unknown }[]).slice(0, 3)) {
      const artist = str(s?.artist, 80), title = str(s?.title, 100);
      if ((!artist && !title) || isProfane(`${artist} ${title}`)) continue;
      const nk = normalizeSong(artist, title);
      if (nk === '|') continue;
      cmds.push(['HINCRBY', k.songs, nk, 1], ['HSETNX', k.songLabel, nk, displaySong(artist, title)]);
    }
  }
  if (m.settings.allowDnp && b.dnp && typeof b.dnp === 'object') {
    const artist = str(b.dnp.artist, 80), title = str(b.dnp.title, 100);
    if ((artist || title) && !isProfane(`${artist} ${title}`)) {
      const nk = normalizeSong(artist, title);
      if (nk !== '|') cmds.push(['HINCRBY', k.dnp, nk, 1], ['HSETNX', k.dnpLabel, nk, displaySong(artist, title)]);
    }
  }
  const ex = expireAt(m);
  for (const key of [k.stats, k.genre, k.era, k.energy, k.songs, k.songLabel, k.dnp, k.dnpLabel]) cmds.push(['EXPIREAT', key, ex]);
  await redis(cmds);
  return res.status(200).json({ ok: true });
}

async function results(req: VercelRequest, res: VercelResponse) {
  const m = await loadMeta(str(req.query.id, 20));
  if (!m) return res.status(404).json({ error: 'Poll not found.' });
  const admin = keyMatches(str(req.query.key, 64), m.adminKeyHash);
  if (!admin && !m.publicResults) return res.status(403).json({ error: 'This results link is private.' });

  const k = keys(m.id);
  const [stats, genre, era, energy, songs, songLabel, dnp, dnpLabel] = await redis([
    ['HGETALL', k.stats], ['HGETALL', k.genre], ['HGETALL', k.era], ['HGETALL', k.energy],
    ['HGETALL', k.songs], ['HGETALL', k.songLabel], ['HGETALL', k.dnp], ['HGETALL', k.dnpLabel],
  ]);
  const st = hashToObj(stats), en = hashToObj(energy);
  const tally = (h: unknown, order: string[]) => {
    const o = hashToObj(h);
    return order.map(label => ({ label, count: Number(o[label] || 0) })).sort((a, b) => b.count - a.count);
  };
  const ranked = (h: unknown, labels: unknown, limit: number) => {
    const o = hashToObj(h), l = hashToObj(labels);
    return Object.entries(o).map(([nk, c]) => ({ label: l[nk] || nk.replace('|', ' - '), count: Number(c) }))
      .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label)).slice(0, limit);
  };
  const n = Number(en.n || 0);
  return res.status(200).json({
    id: m.id,
    admin,
    open: isOpen(m),
    closesAt: m.closesAt,
    publicResults: m.publicResults,
    settings: m.settings,
    // planner details only for the planner themselves
    planner: admin ? m.planner : { company: m.planner.company, eventType: m.planner.eventType },
    total: Number(st.total || 0),
    lastVoteAt: st.last ? Number(st.last) : null,
    genres: tally(genre, m.settings.genres),
    eras: tally(era, ERAS),
    energyAvg: n ? Number(en.sum) / n : null,
    songs: ranked(songs, songLabel, 15),
    doNotPlay: admin ? ranked(dnp, dnpLabel, 10) : [],
  });
}

async function manage(req: VercelRequest, res: VercelResponse) {
  const b = req.body || {};
  const m = await loadMeta(str(b.id, 20));
  if (!m) return res.status(404).json({ error: 'Poll not found.' });
  if (!keyMatches(str(b.key, 64), m.adminKeyHash)) return res.status(403).json({ error: 'Not authorized.' });
  if (b.op === 'close') {
    m.status = 'closed';
    m.closesAt = Math.min(m.closesAt, now());
  } else if (b.op === 'public') {
    m.publicResults = b.value === true;
  } else {
    return res.status(400).json({ error: 'Unknown action.' });
  }
  const k = keys(m.id);
  const ex = expireAt(m);
  await redis([
    ['SET', k.meta, JSON.stringify(m), 'EXAT', ex],
    ...[k.stats, k.genre, k.era, k.energy, k.songs, k.songLabel, k.dnp, k.dnpLabel].map(key => ['EXPIREAT', key, ex] as Cmd),
  ]);
  return res.status(200).json({ ok: true, open: isOpen(m), publicResults: m.publicResults });
}

// ── Email ────────────────────────────────────────────────────────────────────
function row(label: string, value: string) {
  return `<tr style="border-top:1px solid #eee;"><td style="padding:9px 0;color:#888;font-size:11px;letter-spacing:.08em;text-transform:uppercase;width:130px;vertical-align:top;">${label}</td><td style="padding:9px 0;color:#111;font-size:15px;">${value || '&mdash;'}</td></tr>`;
}

async function sendLead(m: Meta, voteUrl: string) {
  const p = m.planner;
  const e = (s: string) => escapeHtml(s);
  await resend.emails.send({
    from: FROM,
    to: ['bookings@djdxmusic.com'],
    replyTo: p.email,
    subject: `New Poll Lead — ${p.company || p.name} | ${p.eventType}${p.eventDate ? ` | ${p.eventDate}` : ''}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#fff;color:#111;border:1px solid #e5e5e5;border-radius:8px;overflow:hidden;">
        <div style="background:#111;padding:26px 32px;border-bottom:3px solid #C9A84C;">
          <h1 style="color:#C9A84C;font-size:21px;margin:0;letter-spacing:.04em;">NEW MUSIC POLL LEAD</h1>
          <p style="color:rgba(255,255,255,.5);margin:4px 0 0;font-size:13px;">A planner created an Office Party Music Poll on djdxmusic.com</p>
        </div>
        <div style="padding:24px 32px;">
          <table style="width:100%;border-collapse:collapse;">
            ${row('Name', `<strong>${e(p.name)}</strong>`)}
            ${row('Email', `<a href="mailto:${e(p.email)}" style="color:#C9A84C;text-decoration:none;">${e(p.email)}</a>`)}
            ${row('Company', e(p.company))}
            ${row('Event type', e(p.eventType))}
            ${row('Event date', e(p.eventDate))}
            ${row('Headcount', e(p.headcount))}
            ${row('Location', e(p.location))}
            ${row('Marketing OK', p.marketingConsent ? 'Yes, opted in to event tips' : 'No - results email only')}
            ${row('Poll ID', `<code>${e(m.id)}</code>`)}
            ${row('Voting link', `<a href="${voteUrl}" style="color:#C9A84C;">${voteUrl}</a>`)}
          </table>
          <p style="margin:18px 0 0;color:#666;font-size:13px;line-height:1.6;">The planner holds the private results link. If they book, the inquiry will include this Poll ID.</p>
        </div>
      </div>`,
  });
}

async function sendPlanner(m: Meta, voteUrl: string, resultsUrl: string) {
  const p = m.planner;
  const first = escapeHtml(p.name.split(' ')[0] || 'there');
  const label = p.company ? `${escapeHtml(p.company)}'s ${escapeHtml(p.eventType.toLowerCase())}` : `your ${escapeHtml(p.eventType.toLowerCase())}`;
  await resend.emails.send({
    from: FROM,
    to: [p.email],
    replyTo: 'bookings@djdxmusic.com',
    subject: `Your music poll is live${p.company ? ` — ${p.company}` : ''}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0c0c0c;color:#fff;padding:36px;border-radius:12px;">
        <h1 style="color:#C9A84C;font-size:24px;margin:0 0 14px;">Your music poll is live.</h1>
        <p style="color:rgba(255,255,255,.78);font-size:16px;line-height:1.7;margin:0 0 22px;">Hi ${first}, here are the two links for ${label}.</p>
        <p style="margin:0 0 6px;color:#C9A84C;font-size:12px;letter-spacing:.12em;text-transform:uppercase;font-weight:bold;">1. Share with your team</p>
        <p style="margin:0 0 22px;"><a href="${voteUrl}" style="color:#fff;font-size:16px;">${voteUrl}</a></p>
        <p style="margin:0 0 6px;color:#C9A84C;font-size:12px;letter-spacing:.12em;text-transform:uppercase;font-weight:bold;">2. Your private results (keep this one to yourself)</p>
        <p style="margin:0 0 24px;"><a href="${resultsUrl}" style="color:#fff;font-size:14px;word-break:break-all;">${resultsUrl}</a></p>
        <p style="color:rgba(255,255,255,.6);font-size:14px;line-height:1.7;margin:0 0 26px;">Voting takes about a minute and nobody needs an account. The poll stays open for ${OPEN_DAYS} days, and you can close it early from the results page.</p>
        <div style="border-top:1px solid rgba(255,255,255,.12);padding-top:20px;color:rgba(255,255,255,.45);font-size:13px;line-height:1.6;">
          Want the crowd report turned into a real night? DJ DX has played 500+ events across NYC, NJ and CT.
          <a href="${SITE}/corporate-event-dj-nyc-nj-ct" style="color:#C9A84C;">See corporate events</a>
        </div>
      </div>`,
  });
}

// ── Router ───────────────────────────────────────────────────────────────────
export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Robots-Tag', 'noindex');
  const a = str(req.query.a, 20);
  try {
    if (req.method === 'POST' && a === 'create') return await create(req, res);
    if (req.method === 'GET' && a === 'poll') return await publicPoll(req, res);
    if (req.method === 'POST' && a === 'vote') return await vote(req, res);
    if (req.method === 'GET' && a === 'results') return await results(req, res);
    if (req.method === 'POST' && a === 'manage') return await manage(req, res);
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'unknown';
    console.error('poll api error', a, msg);
    if (msg === 'storage_not_configured') return res.status(503).json({ error: 'Polls are being set up. Please try again shortly.' });
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
}
