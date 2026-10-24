import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';
import { createHash } from 'crypto';

// NOTE: everything this function needs is inlined below (no local relative
// imports). Vercel's builder here does not bundle cross-file imports even
// within api/ subdirectories — a prior version imported from ../src/lib and
// then from ./_lib/, and both hard-crashed every request in production with
// ERR_MODULE_NOT_FOUND. Confirmed via production logs before this fix.

const resend = new Resend(process.env.RESEND_API_KEY);

// ── Spam guard ────────────────────────────────────────────────────────────────
const SPAM_URL_RE = /https?:\/\//gi;
// Was 2500ms — real users with browser autofill/password managers fill every
// field in well under a second and were being silently dropped as spam (fake
// 200 returned, no email ever sent, no error shown). The honeypot field is
// the primary bot signal; this is now just a backstop against sub-200ms
// scripted submissions, not a real "did a human fill this out" check.
const MIN_FILL_MS = 200;
const MAX_LINKS = 2;

function isSpamSubmission({ honeypot, elapsedMs, message }: { honeypot: unknown; elapsedMs: unknown; message: string }): { spam: boolean; reason?: string } {
  if (typeof honeypot === 'string' && honeypot.trim() !== '') return { spam: true, reason: 'honeypot' };
  if (typeof elapsedMs !== 'number' || !Number.isFinite(elapsedMs) || elapsedMs < MIN_FILL_MS) return { spam: true, reason: 'too_fast' };
  const linkCount = (message.match(SPAM_URL_RE) || []).length;
  if (linkCount > MAX_LINKS) return { spam: true, reason: 'link_spam' };
  return { spam: false };
}

// ── Retargeting conversion reporting (best-effort, never blocks the response) ─
function sha256(value: string): string {
  return createHash('sha256').update(value.trim().toLowerCase()).digest('hex');
}

interface LeadEventInput {
  email: string;
  phone: string;
  eventSourceUrl: string;
  eventId?: string;
  clientIp?: string;
  userAgent?: string;
}

async function sendMetaLeadEvent(input: LeadEventInput): Promise<void> {
  const pixelId = process.env.VITE_META_PIXEL_ID;
  const accessToken = process.env.META_CAPI_ACCESS_TOKEN;
  if (!pixelId || !accessToken) return;

  const digitsOnlyPhone = input.phone.replace(/\D/g, '');
  const payload = {
    data: [{
      event_name: 'Lead',
      event_time: Math.floor(Date.now() / 1000),
      event_id: input.eventId,
      action_source: 'website',
      event_source_url: input.eventSourceUrl,
      user_data: {
        em: input.email ? [sha256(input.email)] : undefined,
        ph: digitsOnlyPhone ? [sha256(digitsOnlyPhone)] : undefined,
        client_ip_address: input.clientIp,
        client_user_agent: input.userAgent,
      },
    }],
  };

  try {
    await fetch(`https://graph.facebook.com/v20.0/${pixelId}/events?access_token=${accessToken}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    console.error('Meta CAPI error:', err);
  }
}

function normalizeTikTokPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith('1')) return `+${digits}`;
  return `+${digits}`;
}

async function sendTikTokLeadEvent(input: LeadEventInput): Promise<void> {
  const pixelId = process.env.VITE_TIKTOK_PIXEL_ID;
  const accessToken = process.env.TIKTOK_EVENTS_API_ACCESS_TOKEN;
  if (!pixelId || !accessToken) return;

  const payload = {
    event_source: 'web',
    event_source_id: pixelId,
    data: [{
      event: 'SubmitForm',
      event_time: Math.floor(Date.now() / 1000),
      event_id: input.eventId,
      user: {
        email: input.email ? [sha256(input.email)] : undefined,
        phone: input.phone ? [sha256(normalizeTikTokPhone(input.phone))] : undefined,
        ip: input.clientIp,
        user_agent: input.userAgent,
      },
      page: { url: input.eventSourceUrl },
    }],
  };

  try {
    await fetch('https://business-api.tiktok.com/open_api/v1.3/event/track/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Access-Token': accessToken },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    console.error('TikTok Events API error:', err);
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX = { name: 120, email: 254, phone: 30, eventType: 100, eventDate: 40, eventTime: 10, location: 200, message: 2000 };

// ── Free 72-hour date holds ────────────────────────────────────────────────
// Requesting a date (with an email) holds it automatically for 72 hours, so a
// client cannot ghost a date into limbo and DJ DX quotes while they are still
// committed. A signed contract and 50% deposit confirm it; otherwise it
// releases by itself. DJ DX gets a one-click release link.
//   hold:<date>      JSON { email, name, token, expiresAt, reminded } (TTL 72h)
//   holdtok:<token>  date (TTL 72h)
//   holds:index      sorted set of dates scored by expiry (pruned on read)
// GET ?holds=1 lists held dates (no personal data), GET ?release=<token>
// releases one, GET ?cron=holds (CRON_SECRET) sends the last-day reminder.
const SITE = 'https://djdxmusic.com';
const FROM = process.env.FROM_EMAIL || 'DJ DX <noreply@djdxmusic.com>';
const HOLD_SECONDS = 72 * 3600;
const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL || '';
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN || '';
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

async function redis(cmds: (string | number)[][]): Promise<unknown[]> {
  if (!REDIS_URL || !REDIS_TOKEN) return [];
  const r = await fetch(`${REDIS_URL}/pipeline`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${REDIS_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(cmds.map(c => c.map(String))),
  });
  return r.ok ? ((await r.json()) as { result?: unknown }[]).map(o => o.result) : [];
}

const fmtExpiry = (ms: number) => new Date(ms).toLocaleString('en-US', { timeZone: 'America/New_York', weekday: 'long', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit' }) + ' ET';
const fmtDate = (iso: string) => new Date(`${iso}T12:00:00Z`).toLocaleDateString('en-US', { timeZone: 'UTC', weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

async function bookedDates(): Promise<string[]> {
  try {
    const r = await fetch(`${SITE}/.well-known/business.json`);
    const j = await r.json() as { availability?: { booked?: string[] } };
    return j.availability?.booked || [];
  } catch { return []; }
}

async function activeHolds(): Promise<{ date: string; expiresAt: number }[]> {
  const now = Date.now();
  const [, list] = await redis([['ZREMRANGEBYSCORE', 'holds:index', 0, now], ['ZRANGE', 'holds:index', 0, -1, 'WITHSCORES']]) as [unknown, string[] | undefined];
  const out: { date: string; expiresAt: number }[] = [];
  for (let i = 0; list && i < list.length; i += 2) out.push({ date: list[i], expiresAt: Number(list[i + 1]) });
  return out;
}

type HoldResult = { status: 'held' | 'taken' | 'booked' | 'unavailable'; expiresAt?: number; token?: string };

async function placeHold(date: string, email: string, name: string): Promise<HoldResult> {
  if (!ISO_DATE.test(date) || !email || !REDIS_URL) return { status: 'unavailable' };
  const today = new Date().toISOString().slice(0, 10);
  if (date <= today) return { status: 'unavailable' };
  if ((await bookedDates()).includes(date)) return { status: 'booked' };
  const token = Array.from(crypto.getRandomValues(new Uint8Array(18)), b => b.toString(16).padStart(2, '0')).join('');
  const expiresAt = Date.now() + HOLD_SECONDS * 1000;
  const [set] = await redis([['SET', `hold:${date}`, JSON.stringify({ email, name, token, expiresAt, reminded: false }), 'NX', 'EX', HOLD_SECONDS]]);
  if (set === 'OK') {
    await redis([['SET', `holdtok:${token}`, date, 'EX', HOLD_SECONDS], ['ZADD', 'holds:index', expiresAt, date]]);
    return { status: 'held', expiresAt, token };
  }
  const [cur] = await redis([['GET', `hold:${date}`]]);
  try {
    const h = JSON.parse(String(cur)) as { email: string; expiresAt: number; token: string };
    if (h.email.toLowerCase() === email.toLowerCase()) return { status: 'held', expiresAt: h.expiresAt, token: h.token };
    return { status: 'taken', expiresAt: h.expiresAt };
  } catch { return { status: 'unavailable' }; }
}

async function handleGet(req: VercelRequest, res: VercelResponse) {
  if (req.query.holds) {
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json({ holds: await activeHolds() });
  }
  if (typeof req.query.release === 'string' && /^[a-f0-9]{36}$/.test(req.query.release)) {
    const tok = req.query.release;
    const [date] = await redis([['GET', `holdtok:${tok}`]]) as [string | null];
    if (date) await redis([['DEL', `hold:${date}`, `holdtok:${tok}`], ['ZREM', 'holds:index', date]]);
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(200).send(`<!doctype html><meta name="viewport" content="width=device-width"><meta name="robots" content="noindex"><body style="font-family:Arial;background:#0c0c0c;color:#fff;padding:40px"><h1 style="color:#C9A84C">${date ? `Hold released: ${escapeHtml(fmtDate(date))}` : 'This hold already ended'}</h1><p>${date ? 'The date shows as open again on djdxmusic.com.' : 'It expired or was released earlier. Nothing else to do.'}</p></body>`);
  }
  if (req.query.cron === 'holds') {
    const secret = process.env.CRON_SECRET;
    if (!secret || req.headers.authorization !== `Bearer ${secret}`) return res.status(401).json({ error: 'Unauthorized' });
    // Last-day reminder: holds ending within the next 30 hours, sent once.
    const soon = (await activeHolds()).filter(h => h.expiresAt - Date.now() < 30 * 3600 * 1000);
    let sent = 0;
    for (const h of soon) {
      const [raw] = await redis([['GET', `hold:${h.date}`]]);
      if (!raw) continue;
      const hold = JSON.parse(String(raw)) as { email: string; name: string; token: string; expiresAt: number; reminded: boolean };
      if (hold.reminded) continue;
      await resend.emails.send({
        from: FROM, to: [hold.email], replyTo: 'bookings@djdxmusic.com',
        subject: `Your hold on ${fmtDate(h.date)} ends soon — DJ DX`,
        html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0c0c0c;color:#fff;padding:40px;border-radius:12px"><h1 style="color:#C9A84C;font-size:22px;margin:0 0 16px">Your date is still held, ${escapeHtml(hold.name.split(' ')[0])}.</h1><p style="color:rgba(255,255,255,0.8);font-size:16px;line-height:1.7">${escapeHtml(fmtDate(h.date))} is held for you until <strong>${escapeHtml(fmtExpiry(hold.expiresAt))}</strong>. To keep it, reply to this email or sign the contract and send the 50% deposit. After that the date opens up for other clients.</p><p style="color:rgba(255,255,255,0.5);font-size:13px">DJ DX · djdxmusic.com · bookings@djdxmusic.com</p></div>`,
      });
      const ttl = Math.max(60, Math.round((hold.expiresAt - Date.now()) / 1000));
      await redis([['SET', `hold:${h.date}`, JSON.stringify({ ...hold, reminded: true }), 'EX', ttl]]);
      sent++;
    }
    return res.status(200).json({ checked: soon.length, reminded: sent });
  }
  return res.status(405).json({ error: 'Method not allowed' });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') return handleGet(req, res);
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // "quick" is the stripped-down 4-field sticky-CTA form (name, phone-or-email,
  // event date, event type) — everything else gets a sensible placeholder so
  // the same email pipeline handles both, and DJ DX follows up by phone for
  // the missing details.
  const quick = req.body.quick === true;
  const { name, eventType, eventDate, honeypot, elapsedMs, metaEventId, pageUrl } = req.body;
  // Set when the inquiry comes from a music poll's "Book DJ DX to play this crowd" button
  const pollId = typeof req.body.pollId === 'string' && /^[a-z0-9]{6,12}$/.test(req.body.pollId) ? req.body.pollId : '';
  let { email, phone, eventStartTime, eventEndTime, location, message } = req.body;
  // Optional qualifiers (full form) and auto-detected AI referral (any form)
  const opt = (v: unknown, max = 80) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
  const guests = opt(req.body.guests), budget = opt(req.body.budget), heard = opt(req.body.heard);
  const aiReferral = opt(req.body.aiReferral, 40), aiLanding = opt(req.body.aiLanding, 200);

  if (quick) {
    if (!name || !eventType || !eventDate || (!email && !phone)) {
      return res.status(400).json({ error: 'Name, contact info, event date, and event type are required' });
    }
    email = email || '';
    phone = phone || '';
    eventStartTime = eventStartTime || 'TBD';
    eventEndTime = eventEndTime || 'TBD';
    location = location || 'Not provided (quick inquiry)';
    message = message || '(Quick inquiry — submitted via sticky CTA, no additional details provided.)';
  } else {
    // The full form used to require all nine fields, including exact start
    // and end times most people don't know yet when they first inquire.
    // Analytics showed ~half of everyone who started the form abandoned it.
    // Only what's needed to answer "is my date open?" is required now; the
    // rest is gathered on the follow-up call.
    if (!name || !email || !eventType || !eventDate) {
      return res.status(400).json({ error: 'Name, email, event date, and event type are required' });
    }
    phone = phone || '';
    eventStartTime = eventStartTime || 'TBD';
    eventEndTime = eventEndTime || 'TBD';
    location = location || 'Not provided yet';
    message = message || '(No additional details provided.)';
  }

  const spamCheck = isSpamSubmission({ honeypot, elapsedMs, message });
  if (spamCheck.spam) {
    console.warn('Booking submission flagged as spam', { reason: spamCheck.reason, elapsedMs, email });
    // Fake success so bots don't learn to route around this
    return res.status(200).json({ success: true });
  }

  // Type and length validation
  if (
    typeof name !== 'string' || name.length > MAX.name ||
    typeof email !== 'string' || email.length > MAX.email ||
    typeof phone !== 'string' || phone.length > MAX.phone ||
    typeof eventType !== 'string' || eventType.length > MAX.eventType ||
    typeof eventDate !== 'string' || eventDate.length > MAX.eventDate ||
    typeof eventStartTime !== 'string' || eventStartTime.length > MAX.eventTime ||
    typeof eventEndTime !== 'string' || eventEndTime.length > MAX.eventTime ||
    typeof location !== 'string' || location.length > MAX.location ||
    typeof message !== 'string' || message.length > MAX.message
  ) {
    return res.status(400).json({ error: 'Invalid input' });
  }

  if (email && !EMAIL_RE.test(email)) {
    return res.status(400).json({ error: 'Invalid email address' });
  }
  if (!quick && !email) {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  // Free 72-hour hold (needs an email to confirm it to the client)
  const hold: HoldResult | null = req.body.hold === true && email ? await placeHold(String(eventDate), email, String(name)).catch(() => ({ status: 'unavailable' as const })) : null;
  const holdTag = hold?.status === 'held' ? '[HELD 72h] ' : hold?.status === 'taken' ? '[DATE ON HOLD FOR SOMEONE ELSE] ' : hold?.status === 'booked' ? '[DATE ALREADY BOOKED] ' : '';

  // Escape all fields before HTML interpolation
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safePhone = escapeHtml(phone);
  const safeEventType = escapeHtml(eventType);
  const safeEventDate = escapeHtml(eventDate);
  const safeEventStartTime = escapeHtml(eventStartTime);
  const safeEventEndTime = escapeHtml(eventEndTime);
  const safeLocation = escapeHtml(location);
  const safeMessage = escapeHtml(message);

  try {
    await resend.emails.send({
      from: process.env.FROM_EMAIL || 'DJ DX <noreply@djdxmusic.com>',
      to: ['bookings@djdxmusic.com'],
      replyTo: email || undefined,
      subject: `${holdTag}${aiReferral ? `[AI: ${escapeHtml(aiReferral)}] ` : ''}${quick ? 'Quick Inquiry' : 'New Booking Inquiry'}${pollId ? ' (from Music Poll)' : ''} — ${safeEventType} | ${safeEventDate}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; color: #111; padding: 0; border-radius: 8px; overflow: hidden; border: 1px solid #e5e5e5;">
          <div style="background: #111111; padding: 28px 32px; border-bottom: 3px solid #C9A84C;">
            <h1 style="color: #C9A84C; font-size: 22px; margin: 0; letter-spacing: 0.04em;">${quick ? 'QUICK INQUIRY' : 'NEW BOOKING INQUIRY'}</h1>
            <p style="color: rgba(255,255,255,0.5); margin: 4px 0 0; font-size: 13px;">via djdxmusic.com${quick ? ' — sticky CTA, follow up by phone for full details' : ''}</p>
          </div>

          <div style="padding: 28px 32px;">
            ${hold?.status === 'held' && hold.token && hold.expiresAt ? `<div style="margin: 0 0 18px; padding: 14px 16px; background: #fbf6e8; border: 1px solid #C9A84C; border-radius: 6px; font-size: 14px; line-height: 1.6; color: #111;">
              <strong>Date held for this client until ${escapeHtml(fmtExpiry(hold.expiresAt))}.</strong> Send the quote and contract while they are committed. Can't take it, or spam?
              <a href="${SITE}/api/booking?release=${hold.token}" style="color: #8a6d1f; font-weight: 700;">Release the hold</a>
            </div>` : hold && hold.status !== 'unavailable' ? `<div style="margin: 0 0 18px; padding: 14px 16px; background: #f4f4f4; border-radius: 6px; font-size: 14px; color: #111;">${hold.status === 'booked' ? 'This date is already on your booked list.' : `This date is already on hold for another client until ${escapeHtml(fmtExpiry(hold.expiresAt || Date.now()))}.`}</div>` : ''}
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; color: #888; font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; width: 120px; vertical-align: top;">Name</td>
                <td style="padding: 10px 0; color: #111; font-size: 15px; font-weight: 600;">${safeName}</td>
              </tr>
              <tr style="border-top: 1px solid #eee;">
                <td style="padding: 10px 0; color: #888; font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; vertical-align: top;">Email</td>
                <td style="padding: 10px 0; font-size: 15px;">${safeEmail ? `<a href="mailto:${safeEmail}" style="color: #C9A84C; text-decoration: none;">${safeEmail}</a>` : '—'}</td>
              </tr>
              <tr style="border-top: 1px solid #eee;">
                <td style="padding: 10px 0; color: #888; font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; vertical-align: top;">Phone</td>
                <td style="padding: 10px 0; color: #111; font-size: 15px;">${safePhone ? `<a href="tel:${safePhone}" style="color: #C9A84C; text-decoration: none;">${safePhone}</a>` : '—'}</td>
              </tr>
              <tr style="border-top: 1px solid #eee;">
                <td style="padding: 10px 0; color: #888; font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; vertical-align: top;">Event Type</td>
                <td style="padding: 10px 0; color: #111; font-size: 15px;">${safeEventType}</td>
              </tr>${pollId ? `
              <tr style="border-top: 1px solid #eee;">
                <td style="padding: 10px 0; color: #888; font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; vertical-align: top;">Music Poll</td>
                <td style="padding: 10px 0; color: #111; font-size: 15px;"><code>${pollId}</code> — the planner's crowd report is in the message below</td>
              </tr>` : ''}
              <tr style="border-top: 1px solid #eee;">
                <td style="padding: 10px 0; color: #888; font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; vertical-align: top;">Event Date</td>
                <td style="padding: 10px 0; color: #111; font-size: 15px;">${safeEventDate}</td>
              </tr>
              <tr style="border-top: 1px solid #eee;">
                <td style="padding: 10px 0; color: #888; font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; vertical-align: top;">Event Time</td>
                <td style="padding: 10px 0; color: #111; font-size: 15px;">${safeEventStartTime} – ${safeEventEndTime}</td>
              </tr>
              <tr style="border-top: 1px solid #eee;">
                <td style="padding: 10px 0; color: #888; font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; vertical-align: top;">Location</td>
                <td style="padding: 10px 0; color: #111; font-size: 15px;">${safeLocation}</td>
              </tr>
${[guests ? `              <tr style="border-top: 1px solid #eee;">
                <td style="padding: 10px 0; color: #888; font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; vertical-align: top;">Guests</td>
                <td style="padding: 10px 0; color: #111; font-size: 15px;">${escapeHtml(guests)}</td>
              </tr>` : '', budget ? `              <tr style="border-top: 1px solid #eee;">
                <td style="padding: 10px 0; color: #888; font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; vertical-align: top;">Budget</td>
                <td style="padding: 10px 0; color: #111; font-size: 15px;">${escapeHtml(budget)}</td>
              </tr>` : '', heard ? `              <tr style="border-top: 1px solid #eee;">
                <td style="padding: 10px 0; color: #888; font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; vertical-align: top;">Heard about us</td>
                <td style="padding: 10px 0; color: #111; font-size: 15px;">${escapeHtml(heard)}</td>
              </tr>` : '', aiReferral ? `              <tr style="border-top: 1px solid #eee;">
                <td style="padding: 10px 0; color: #888; font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; vertical-align: top;">AI referral</td>
                <td style="padding: 10px 0; color: #111; font-size: 15px;">${escapeHtml(aiReferral) + (aiLanding ? ' → ' + escapeHtml(aiLanding) : '') + ' (auto-detected)'}</td>
              </tr>` : ''].join('')}
              <tr style="border-top: 1px solid #eee;">
                <td style="padding: 10px 0; color: #888; font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; vertical-align: top;">Message</td>
                <td style="padding: 10px 0; color: #111; font-size: 15px; line-height: 1.7;">${safeMessage.replace(/\n/g, '<br>')}</td>
              </tr>
            </table>

            <div style="margin-top: 28px; padding-top: 20px; border-top: 1px solid #eee;">
              ${safeEmail ? `
              <a href="mailto:${safeEmail}" style="display: inline-block; background: #C9A84C; color: #111; padding: 12px 28px; border-radius: 6px; text-decoration: none; font-weight: 700; font-size: 13px; letter-spacing: 0.06em;">
                REPLY TO ${safeName.split(' ')[0].toUpperCase()}
              </a>` : `
              <a href="tel:${safePhone}" style="display: inline-block; background: #C9A84C; color: #111; padding: 12px 28px; border-radius: 6px; text-decoration: none; font-weight: 700; font-size: 13px; letter-spacing: 0.06em;">
                CALL ${safeName.split(' ')[0].toUpperCase()}
              </a>`}
            </div>
          </div>
        </div>
      `,
    });

    // Send confirmation to the person who inquired — only possible if we have their email
    if (email) {
      await resend.emails.send({
        from: process.env.FROM_EMAIL || 'DJ DX <noreply@djdxmusic.com>',
        to: [email],
        subject: `Got your inquiry, ${safeName.split(' ')[0]} — DJ DX`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0c0c0c; color: #fff; padding: 40px; border-radius: 12px;">
            <h1 style="color: #C9A84C; font-size: 24px; margin: 0 0 16px;">Thanks for reaching out.</h1>
            <p style="color: rgba(255,255,255,0.75); font-size: 16px; line-height: 1.7; margin: 0 0 24px;">
              Hey ${safeName.split(' ')[0]}, your booking inquiry for <strong style="color:#fff;">${safeEventType}</strong> on <strong style="color:#fff;">${safeEventDate}</strong>${quick ? '' : ` from <strong style="color:#fff;">${safeEventStartTime} to ${safeEventEndTime}</strong>`} has been received.
            </p>
            ${hold?.status === 'held' && hold.expiresAt ? `<div style="margin: 0 0 24px; padding: 16px 18px; border: 1px solid #C9A84C; border-radius: 8px; background: rgba(201,168,76,0.08);">
              <p style="color: #C9A84C; font-size: 13px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; margin: 0 0 6px;">Your date is on hold</p>
              <p style="color: #fff; font-size: 16px; line-height: 1.6; margin: 0;">${escapeHtml(fmtDate(String(eventDate)))} is held for you, free, until <strong>${escapeHtml(fmtExpiry(hold.expiresAt))}</strong>. Nobody else can book it in that time. A signed contract and a 50% deposit lock it in.</p>
            </div>` : hold?.status === 'taken' ? `<p style="color: rgba(255,255,255,0.75); font-size: 15px; line-height: 1.7; margin: 0 0 24px;">Heads up: this date is on hold for another client right now. If their hold ends, you will be the first to know.</p>` : ''}
            <p style="color: rgba(255,255,255,0.75); font-size: 16px; line-height: 1.7; margin: 0 0 32px;">
              DJ DX will review your request and get back to you within <strong style="color:#C9A84C;">24 hours</strong> with ${hold?.status === 'held' ? 'your quote and contract' : 'availability and pricing'}.
            </p>
            <div style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 24px; color: rgba(255,255,255,0.4); font-size: 13px;">
              DJ DX · djdxmusic.com · New York / New Jersey
            </div>
          </div>
        `,
      });
    }

    const eventSourceUrl = typeof pageUrl === 'string' && pageUrl.startsWith('https://djdxmusic.com') ? pageUrl : 'https://djdxmusic.com/';
    const clientIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim();
    const userAgent = req.headers['user-agent'];
    const eventId = typeof metaEventId === 'string' ? metaEventId : undefined;

    await Promise.all([
      sendMetaLeadEvent({ email, phone, eventSourceUrl, eventId, clientIp, userAgent }),
      sendTikTokLeadEvent({ email, phone, eventSourceUrl, eventId, clientIp, userAgent }),
    ]);

    return res.status(200).json({ success: true, ...(hold && hold.status !== 'unavailable' ? { hold: { status: hold.status, expiresAt: hold.expiresAt } } : {}) });
  } catch (err) {
    console.error('Booking email error:', err);
    return res.status(500).json({ error: 'Failed to send inquiry' });
  }
}
