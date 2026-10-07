import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';
import { createPrivateKey, createPublicKey, sign, verify, createHash } from 'crypto';

// Verified client confirmations ("attestations").
//
// DJ DX creates a confirmation link per event with `npm run attest -- ...`
// (scripts/attest-link.mjs): the link carries the event details, signed with
// the did:web:djdxmusic.com key, so nobody can forge or edit one. The client
// opens /confirm, optionally adds a short quote, and confirms. This endpoint
// checks the signature, stores the confirmation once, counter-signs it, and
// emails DJ DX.
//
//   POST /api/attest   { token, quote?, showName?, displayName? }
//   GET  /api/attest   [?slug=venue-slug]   -> public list
//
// Self-contained (no local imports): see api/booking.ts.

const PUBLIC_JWK = { crv: 'Ed25519', x: 'IJMzG8qE90Wtqk1jy766ZN_PbqDQPnV0ATVMUDk1PYM', kty: 'OKP' };
const KID = 'did:web:djdxmusic.com#key-1';
const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL || '';
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN || '';
const FROM = process.env.FROM_EMAIL || 'DJ DX <noreply@djdxmusic.com>';
const resend = new Resend(process.env.RESEND_API_KEY);
const LIST = 'attest:list';

async function redis(cmds: (string | number)[][]): Promise<unknown[]> {
  if (!REDIS_URL || !REDIS_TOKEN) throw new Error('storage_not_configured');
  const r = await fetch(`${REDIS_URL}/pipeline`, {
    method: 'POST', headers: { Authorization: `Bearer ${REDIS_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(cmds.map(c => c.map(String))),
  });
  if (!r.ok) throw new Error(`redis_http_${r.status}`);
  const out = (await r.json()) as { result?: unknown; error?: string }[];
  const err = out.find(o => o.error); if (err) throw new Error(`redis_${err.error}`);
  return out.map(o => o.result);
}

const b64u = (b: Buffer | string) => Buffer.from(b).toString('base64url');
const str = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const escapeHtml = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

interface Claim { v: 1; nonce: string; client: string; event: string; venue: string; date: string; slug?: string; iat: string }

function readToken(token: string): Claim | null {
  const [payload, sig] = token.split('.');
  if (!payload || !sig) return null;
  const pub = createPublicKey({ key: PUBLIC_JWK, format: 'jwk' });
  if (!verify(null, Buffer.from(payload), pub, Buffer.from(sig, 'base64url'))) return null;
  try {
    const c = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    return c && c.v === 1 && c.nonce && c.event && c.venue && /^\d{4}-\d{2}-\d{2}$/.test(c.date) ? c : null;
  } catch { return null; }
}

function counterSign(record: object): string | null {
  const raw = process.env.DID_PRIVATE_KEY_JWK;
  if (!raw) return null;
  const key = createPrivateKey({ key: JSON.parse(raw), format: 'jwk' });
  const header = b64u(JSON.stringify({ alg: 'EdDSA', kid: KID, typ: 'JWT' }));
  const payload = b64u(JSON.stringify(record));
  return `${header}.${payload}.${b64u(sign(null, Buffer.from(`${header}.${payload}`), key))}`;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'GET') {
    try {
      const rows = (await redis([['LRANGE', LIST, 0, 199]]))[0] as string[] || [];
      const slug = str(req.query.slug, 80);
      const list = rows.map(r => JSON.parse(r)).filter(a => !slug || a.slug === slug);
      res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=3600');
      return res.status(200).json({ issuer: 'did:web:djdxmusic.com', attestations: list });
    } catch {
      return res.status(200).json({ issuer: 'did:web:djdxmusic.com', attestations: [] });
    }
  }
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const b = req.body && typeof req.body === 'object' ? req.body : {};
  const claim = readToken(str(b.token, 4000));
  if (!claim) return res.status(400).json({ error: 'This confirmation link is not valid.' });

  const quote = str(b.quote, 400);
  const displayName = b.showName === true ? str(b.displayName, 80) : '';
  const record = {
    type: 'EventConfirmation',
    issuer: 'did:web:djdxmusic.com',
    performer: 'DJ DX',
    event: claim.event, venue: claim.venue, date: claim.date, ...(claim.slug ? { slug: claim.slug } : {}),
    confirmedAt: new Date().toISOString(),
    ...(displayName ? { displayName } : {}),
    ...(quote ? { quote } : {}),
    claimId: createHash('sha256').update(claim.nonce).digest('hex').slice(0, 16),
  };
  const proof = counterSign(record);

  try {
    const fresh = (await redis([['SET', `attest:nonce:${claim.nonce}`, '1', 'NX']]))[0];
    if (fresh !== 'OK') return res.status(200).json({ ok: true, already: true });
    await redis([['LPUSH', LIST, JSON.stringify({ ...record, ...(proof ? { proof } : {}) })]]);
  } catch (e) {
    console.error('attest store failed', e);
    return res.status(500).json({ error: 'Could not save the confirmation. Please try again.' });
  }

  try {
    await resend.emails.send({
      from: FROM, to: ['bookings@djdxmusic.com'],
      subject: `Client confirmed: ${claim.event} at ${claim.venue} (${claim.date})`,
      html: `<p><strong>${escapeHtml(claim.client)}</strong> confirmed DJ DX played <strong>${escapeHtml(claim.event)}</strong> at <strong>${escapeHtml(claim.venue)}</strong> on ${claim.date}.</p>${quote ? `<blockquote>${escapeHtml(quote)}</blockquote>` : ''}<p>Shown publicly as: ${displayName ? escapeHtml(displayName) : 'no name (client chose not to be named)'}.</p><p>It now appears on the venue page and at djdxmusic.com/verified.</p>`,
    });
  } catch (e) { console.error('attest email failed', e); }

  return res.status(200).json({ ok: true, record });
}
