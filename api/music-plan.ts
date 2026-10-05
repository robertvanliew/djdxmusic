import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';
import { createHash } from 'crypto';

// Music planning form for booked clients (/plan). Emails the plan to
// bookings@ and a copy to the client. No database: email is the record.
//
// Self-contained on purpose: Vercel's builder here does not bundle relative
// imports inside api/ (see the note in api/booking.ts). Labels below are
// duplicated from src/pages/MusicPlan.tsx; keep the two in sync.

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.FROM_EMAIL || 'DJ DX <noreply@djdxmusic.com>';
const TO = 'bookings@djdxmusic.com';
const PHONE = '(551) 362-5131';
const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL || '';
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN || '';
const LIMIT_PER_HOUR = 10;
const MAX_BODY = 100_000;

const EVENT_TYPES: Record<string, string> = {
  wedding: 'Wedding', birthday: 'Birthday or milestone', corporate: 'Corporate or holiday party',
  mitzvah: 'Bar or Bat Mitzvah', sweet16: 'Sweet 16 or Quinceañera', private: 'Private party', other: 'Other',
};
const DUO: Record<string, string> = { yes: 'Yes', no: 'No', unsure: 'Not sure' };

// ── Input coercion: never trust the shape of the body ────────────────────────
type Obj = Record<string, unknown>;
const obj = (v: unknown): Obj => (v && typeof v === 'object' && !Array.isArray(v) ? (v as Obj) : {});
const str = (v: unknown, max = 2000) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const list = (v: unknown, max: number): Obj[] => (Array.isArray(v) ? v.slice(0, max).map(obj) : []);
const strs = (v: unknown, max: number) => (Array.isArray(v) ? v.slice(0, max).map(x => str(x, 200)).filter(Boolean) : []);

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

function prettyDate(iso: string, withYear = true) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return iso;
  const d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));
  return d.toLocaleDateString('en-US', withYear
    ? { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' }
    : { month: 'long', day: 'numeric', timeZone: 'UTC' });
}
function prettyTime(t: string) {
  const m = /^(\d{1,2}):(\d{2})/.exec(t);
  if (!m) return t;
  const h = +m[1];
  return `${((h + 11) % 12) + 1}:${m[2]} ${h < 12 ? 'AM' : 'PM'}`;
}
const songText = (s: Obj) => [str(s.song, 200), str(s.artist, 200)].filter(Boolean).join(', ');

// ── Build the plan as plain sections, then render to HTML and text ───────────
type Item = { label?: string; text?: string; list?: string[] };
type Section = { title: string; items: Item[] };

function buildPlan(b: Obj) {
  const type = str(b.type, 20);
  const typeLabel = EVENT_TYPES[type] || 'Other';
  const start = prettyTime(str(b.start, 10));
  const end = prettyTime(str(b.end, 10));
  const times = start && end ? `${start} to ${end}` : start ? `from ${start}` : end ? `until ${end}` : '';

  const summary: Item[] = [
    { label: 'Name', text: str(b.name, 200) },
    { label: 'Date', text: prettyDate(str(b.date, 10)) },
    { label: 'Event type', text: typeLabel },
    { label: 'Venue', text: str(b.venue, 200) },
    { label: 'Music', text: times },
    { label: 'Guests', text: str(b.guests, 40) },
    { label: 'Live violin and keys', text: DUO[str(b.duo, 10)] || '' },
    { label: 'Clean versions', text: str(b.clean, 80) },
    { label: 'Mic', text: str(b.mic, 80) },
  ];

  const sections: Section[] = [];
  const add = (title: string, items: Item[]) => {
    const kept = items.filter(i => (i.list ? i.list.length : i.text));
    if (kept.length) sections.push({ title, items: kept });
  };

  add('Your event', [
    { label: 'Email', text: str(b.email, 200) },
    { label: 'Phone', text: str(b.phone, 40) },
  ]);

  add('The crowd', [
    { label: 'About the crowd', text: str(b.crowd) },
    { label: 'Age mix', text: strs(b.ages, 10).join(', ') },
    { label: 'How the night should feel', text: str(b.feel, 120) },
    { label: 'Clean versions', text: str(b.clean, 80) },
  ]);

  const g = obj(b.genres);
  const by = (v: string) => Object.keys(g).filter(k => g[k] === v).map(k => k.slice(0, 80));
  add('Genres and eras', [
    { label: 'More', text: by('more').join(', ') },
    { label: 'Some', text: by('some').join(', ') },
    { label: 'Skip', text: by('skip').join(', ') },
  ]);

  add('Your songs', [
    { label: 'Must-play', list: list(b.mustPlay, 15).map(songText).filter(Boolean) },
    { label: 'Do not play', text: str(b.doNotPlay) },
    { label: 'Playlist', text: str(b.playlist, 500) },
  ]);

  // Key moments arrive already filtered to the chosen event type, with labels.
  const momentLine = (m: Obj) => {
    const who = str(m.who, 120);
    const label = str(m.label, 120) + (who ? ` (${who})` : '');
    const notes = str(m.notes, 500);
    let value = '';
    if (m.skipped === true) value = 'Skip';
    else if (str(m.choice, 80)) value = str(m.choice, 80);
    else if (m.dj === true) value = "DJ's choice";
    else value = songText(m);
    if (!value && !notes) return '';
    return `${label}: ${value || 'see notes'}${notes ? ` (${notes})` : ''}`;
  };
  const moments = list(b.moments, 20).map(momentLine).filter(Boolean);
  const intros = list(b.introductions, 30)
    .map(r => [str(r.name, 120), str(r.role, 40), str(r.pronounce, 120) && `pronounced ${str(r.pronounce, 120)}`].filter(Boolean).join(', '))
    .filter(Boolean);
  const candles = list(b.candles, 14)
    .map(r => { const who = str(r.who, 160); const s = songText(r); return who || s ? `${who || 'Candle'}: ${s || 'song to come'}` : ''; })
    .filter(Boolean);
  const others = list(b.otherMoments, 20)
    .map(r => { const n = str(r.name, 120); const s = songText(r); const notes = str(r.notes, 500); return n || s ? `${n || 'Moment'}: ${s || 'see notes'}${notes ? ` (${notes})` : ''}` : ''; })
    .filter(Boolean);
  const last = momentLine({ ...obj(b.lastSong), label: 'Last song of the night' });
  add('Key moments', [
    { list: moments },
    { label: 'Names for introductions', list: intros },
    { label: 'Candle lighting', list: candles },
    { label: 'Other moments', list: others },
    { text: last },
    { label: 'Songs to avoid for brand reasons', text: str(b.avoidBrand) },
  ]);

  add('Microphone and announcements', [
    { label: 'Mic', text: str(b.mic, 80) },
    { label: 'Speeches and toasts', list: list(b.speeches, 20).map(r => [str(r.who, 160), str(r.when, 160)].filter(Boolean).join(', ')).filter(Boolean) },
    { label: 'People to recognize', text: str(b.recognize) },
  ]);

  if (str(b.duo, 10) === 'yes') {
    const live = obj(b.live);
    add('Live violin and keys', [
      { label: 'Moments to feature live', text: strs(live.moments, 10).join(', ') },
      { label: 'Songs to hear live', list: list(live.songs, 8).map(songText).filter(Boolean) },
    ]);
  }

  const day = obj(b.dayOf);
  add('Day-of details', [
    { label: 'Day-of contact', text: [str(day.contactName, 120), str(day.contactPhone, 40)].filter(Boolean).join(', ') },
    { label: 'Venue coordinator', text: [str(day.coordName, 120), str(day.coordContact, 200)].filter(Boolean).join(', ') },
    { label: 'Load-in', text: str(day.loadIn) },
    { label: 'Anything else', text: str(day.anythingElse) },
  ]);

  return { typeLabel, summary: summary.filter(i => i.text), sections };
}

function renderText(summary: Item[], sections: Section[]) {
  const out: string[] = [];
  summary.forEach(i => out.push(`${i.label}: ${i.text}`));
  for (const s of sections) {
    out.push('', s.title.toUpperCase());
    for (const i of s.items) {
      if (i.list) {
        if (i.label) out.push(`${i.label}:`);
        i.list.forEach((l, n) => out.push(`${n + 1}. ${l}`));
      } else out.push(i.label ? `${i.label}: ${i.text}` : String(i.text));
    }
  }
  return out.join('\n');
}

function renderHtml(summary: Item[], sections: Section[], intro = '') {
  const e = escapeHtml;
  const row = (l: string, v: string) =>
    `<tr><td style="padding:6px 12px 6px 0;color:#888;font-size:12px;letter-spacing:.06em;text-transform:uppercase;vertical-align:top;white-space:nowrap">${e(l)}</td><td style="padding:6px 0;color:#111;font-size:15px">${e(v).replace(/\n/g, '<br>')}</td></tr>`;
  const item = (i: Item) => {
    if (i.list) {
      const ol = `<ol style="margin:4px 0 10px;padding-left:22px;color:#111;font-size:15px;line-height:1.6">${i.list.map(l => `<li>${e(l)}</li>`).join('')}</ol>`;
      return i.label ? `<p style="margin:10px 0 0;color:#888;font-size:12px;letter-spacing:.06em;text-transform:uppercase">${e(i.label)}</p>${ol}` : ol;
    }
    return i.label
      ? `<p style="margin:8px 0;font-size:15px;color:#111;line-height:1.6"><strong>${e(i.label)}:</strong> ${e(String(i.text)).replace(/\n/g, '<br>')}</p>`
      : `<p style="margin:8px 0;font-size:15px;color:#111;line-height:1.6">${e(String(i.text))}</p>`;
  };
  return `
<div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;background:#fff;border:1px solid #e5e5e5;border-radius:8px;overflow:hidden">
  <div style="background:#111;padding:24px 28px;border-bottom:3px solid #C9A84C">
    <h1 style="color:#C9A84C;font-size:20px;margin:0;letter-spacing:.04em">MUSIC PLAN</h1>
  </div>
  <div style="padding:24px 28px">
    ${intro}
    <table style="width:100%;border-collapse:collapse;margin-bottom:8px">${summary.map(i => row(i.label!, i.text!)).join('')}</table>
    ${sections.map(s => `<h2 style="font-size:14px;letter-spacing:.08em;text-transform:uppercase;color:#C9A84C;border-top:1px solid #eee;padding-top:16px;margin:20px 0 6px">${e(s.title)}</h2>${s.items.map(item).join('')}`).join('')}
  </div>
</div>`;
}

// ── Rate limit (Upstash REST). Fails open if storage is not configured. ──────
const clientIp = (req: VercelRequest) =>
  String(req.headers['x-real-ip'] || String(req.headers['x-forwarded-for'] || '').split(',')[0] || 'unknown').trim();

async function overLimit(ip: string): Promise<boolean> {
  if (!REDIS_URL || !REDIS_TOKEN) return false;
  // Same pattern as api/poll.ts: one key per IP per clock hour.
  const hour = Math.floor(Date.now() / 3_600_000);
  const key = `plan:rl:${createHash('sha256').update(ip).digest('hex').slice(0, 32)}:${hour}`;
  try {
    const r = await fetch(`${REDIS_URL}/pipeline`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${REDIS_TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify([['INCR', key], ['EXPIRE', key, '3600']]),
    });
    if (!r.ok) return false;
    const out = (await r.json()) as { result?: unknown }[];
    return Number(out[0]?.result) > LIMIT_PER_HOUR;
  } catch {
    return false;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const b = obj(req.body);
  if (JSON.stringify(b).length > MAX_BODY) return res.status(413).json({ error: 'Plan is too large' });

  // Honeypot: pretend it worked, send nothing.
  if (str(b.company_website, 200)) return res.status(200).json({ ok: true });

  const name = str(b.name, 200);
  const email = str(b.email, 200);
  const date = str(b.date, 10);
  const type = str(b.type, 20);
  const missing = [
    !name && 'name',
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && 'email',
    !/^\d{4}-\d{2}-\d{2}$/.test(date) && 'date',
    !EVENT_TYPES[type] && 'type',
  ].filter(Boolean);
  if (missing.length) return res.status(400).json({ error: 'Missing or invalid required fields', fields: missing });

  if (await overLimit(clientIp(req))) return res.status(429).json({ error: 'Too many submissions. Please try again later.' });

  const { typeLabel, summary, sections } = buildPlan(b);
  const submittedAt = new Date().toISOString();
  const raw = { ...b, company_website: undefined, submittedAt };
  const text = renderText(summary, sections);

  try {
    const { error } = await resend.emails.send({
      from: FROM,
      to: [TO],
      replyTo: email,
      subject: `Music Plan | ${name} | ${typeLabel} | ${date}`,
      html: renderHtml(summary, sections) +
        `<div style="font-family:monospace;font-size:11px;color:#666;max-width:640px;margin:16px auto 0;padding-top:12px;border-top:1px dashed #ccc;white-space:pre-wrap">${escapeHtml(JSON.stringify(raw, null, 2))}</div>`,
      text: `${text}\n\n----------\nRaw submission (${submittedAt}):\n${JSON.stringify(raw, null, 2)}`,
    });
    if (error) throw new Error(error.message);
  } catch (err) {
    console.error('music-plan: email to DJ DX failed', err);
    return res.status(500).json({ error: 'Could not send the plan' });
  }

  // Client copy. Best-effort: the plan already reached DJ DX.
  const first = name.split(/\s+/)[0];
  const greeting = `Hi ${first},\n\nThank you for sending your music plan. Here's a copy of everything you shared. I'll go through it before our planning call, and if anything changes you can send an update anytime from the same link.\n\nRobert Van Liew\nDJ DX\n${PHONE}\n${TO}`;
  try {
    const { error } = await resend.emails.send({
      from: FROM,
      to: [email],
      replyTo: TO,
      subject: `Your music plan for ${prettyDate(date, false)}`,
      html: renderHtml(summary, sections,
        `<div style="font-size:15px;color:#111;line-height:1.7;margin-bottom:20px">${escapeHtml(greeting).replace(/\n/g, '<br>')}</div>`),
      text: `${greeting}\n\n----------\n\n${text}`,
    });
    if (error) console.error('music-plan: client copy failed', error);
  } catch (err) {
    console.error('music-plan: client copy failed', err);
  }

  return res.status(200).json({ ok: true });
}
