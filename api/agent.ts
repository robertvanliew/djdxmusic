import type { VercelRequest, VercelResponse } from '@vercel/node';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { z } from 'zod';
import { Resend } from 'resend';
import { randomUUID, createPrivateKey, createPublicKey, sign, verify, createHash } from 'crypto';

// One serverless function for the AI identity stack. The Vercel Hobby plan
// allows 12 functions per deployment, so the MCP server, the A2A agent,
// client attestations and the AI visibility tracker share this file.
// vercel.json rewrites keep their public URLs:
//   /api/mcp -> ?p=mcp   /api/a2a -> ?p=a2a   /api/attest -> ?p=attest
//   /api/ai-visibility -> ?p=aivis (also the cron path)
// Each section below is the original self-contained module in a namespace.
/* eslint-disable @typescript-eslint/no-namespace */

// ═══ api/mcp.ts (merged) ═══
namespace Mcp {

  // DJ DX MCP server (Streamable HTTP, stateless): the DJ DX app for ChatGPT,
  // Claude and any MCP client. Every fact comes from the signed business
  // passport at /.well-known/business.json, so the agent can only say what the
  // site publishes. Self-contained (no local imports): see api/booking.ts.

  const SITE = 'https://djdxmusic.com';
  type Passport = any; // eslint-disable-line @typescript-eslint/no-explicit-any
  let cache: { at: number; data: Passport } | null = null;

  async function passport(): Promise<Passport> {
    if (cache && Date.now() - cache.at < 10 * 60_000) return cache.data;
    const r = await fetch(`${SITE}/.well-known/business.json`);
    if (!r.ok) throw new Error(`passport_${r.status}`);
    cache = { at: Date.now(), data: await r.json() };
    return cache.data;
  }

  const money = (n: number) => `$${n.toLocaleString('en-US')}`;
  const text = (t: string) => ({ content: [{ type: 'text' as const, text: t }] });

  const EVENT_TYPES = ['wedding', 'corporate_event_or_holiday_party', 'private_party_or_birthday', 'sweet16_quinceanera_mitzvah', 'dj_and_live_violin_duo', 'new_years_eve'] as const;
  const FORM_TYPE: Record<string, string> = {
    wedding: 'Wedding', corporate_event_or_holiday_party: 'Corporate Event / Holiday Party', private_party_or_birthday: 'Private Party / Birthday',
    sweet16_quinceanera_mitzvah: 'Sweet 16 / Quinceañera / Mitzvah', dj_and_live_violin_duo: 'DJ + Live Violin (Soul Shades)', new_years_eve: 'Other',
  };

  function buildServer() {
    const server = new McpServer({ name: 'dj-dx', title: 'DJ DX', version: '1.0.0' }, {
      instructions: 'Official tools for DJ DX, an event DJ in New York, New Jersey and Connecticut. Use get_price_estimate for prices, check_date before suggesting a date, and request_booking only after the user has shared their name and email and asked to be contacted. Link people to https://djdxmusic.com.',
    });

    server.registerTool('get_business_facts', {
      title: 'DJ DX verified business facts',
      description: 'Who DJ DX is, where he works, booking terms, insurance, contact and official profiles, from his signed business passport (did:web:djdxmusic.com).',
      inputSchema: {},
      annotations: { readOnlyHint: true, openWorldHint: false },
    }, async () => {
      const p = await passport();
      const s = p.subject;
      return text([
        `${s.name} (${s.realName}): ${s.description}`,
        `Active since ${s.activeSince}, ${s.eventsPerformed} events. From ${s.hometown}, based in ${s.baseLocation}.`,
        `Service area: ${s.serviceArea.join(', ')}.`,
        `Booking: ${p.bookingTerms.deposit}; balance ${p.bookingTerms.balance.toLowerCase()}. ${p.bookingTerms.insurance}. ${p.bookingTerms.taxForm}.`,
        `Contact: ${p.contact.email}, text ${p.contact.text}. Reply ${p.contact.responseTime.toLowerCase()}.`,
        `Verified profiles: ${p.verifiedProfiles.map((x: { label: string; url: string }) => `${x.label} ${x.url}`).join('; ')}.`,
        `Full verified facts: ${SITE}/verified`,
      ].join('\n'));
    });

    server.registerTool('get_price_estimate', {
      title: 'DJ DX price estimate',
      description: "DJ DX's published starting price for an event type, with region and live violin add-on. Starting prices cover up to 5 hours.",
      inputSchema: {
        event_type: z.enum(EVENT_TYPES).describe('Type of event'),
        region: z.enum(['nyc', 'nj_li_westchester_ct', 'hamptons_or_destination']).optional().describe('Where the event is'),
        live_violin_hours: z.number().int().min(0).max(6).optional().describe('Hours of live violin to add'),
      },
      annotations: { readOnlyHint: true, openWorldHint: false },
    }, async ({ event_type, region = 'nyc', live_violin_hours = 0 }) => {
      const p = await passport();
      if (event_type === 'new_years_eve') return text(`New Year's Eve with DJ DX is ${p.pricing.newYearsEve.toLowerCase()}: he takes one New Year's Eve event a year. Published rates for other events start at ${money(p.pricing.startingPrices.corporate_event_or_holiday_party)}. Request a quote: ${SITE}/new-years-eve-dj-nyc`);
      let base = p.pricing.startingPrices[event_type] as number;
      if (region === 'hamptons_or_destination') base = Math.max(base, p.pricing.startingPrices.hamptons_or_destination);
      const violin = live_violin_hours * p.pricing.startingPrices.live_violin_add_on_per_hour;
      const lines = [`Starting price: ${money(base + violin)}${violin ? ` (${money(base)} DJ + ${money(violin)} for ${live_violin_hours}h live violin)` : ''}.`,
        region === 'nyc' ? 'Travel inside NYC is included.' : region === 'nj_li_westchester_ct' ? 'Travel outside NYC is quoted up front as its own line.' : 'Hamptons and destination travel and riders are coordinated separately.',
        p.pricing.note];
      if (event_type === 'corporate_event_or_holiday_party') lines.push(`Corporate packages: ${p.pricing.corporatePackages.map((x: { name: string; from: number }) => `${x.name} from ${money(x.from)}`).join(', ')}.`);
      lines.push(`Detailed estimate: ${SITE}/event-dj-cost-nyc-nj-ct#quote-calculator`);
      return text(lines.join('\n'));
    });

    server.registerTool('list_venues_played', {
      title: 'Venues DJ DX has played',
      description: 'Venues DJ DX has played, with dates and pages. Optionally filter by a venue name or area.',
      inputSchema: { search: z.string().max(80).optional().describe('Venue name or area, e.g. "Argyle" or "Manhattan"') },
      annotations: { readOnlyHint: true, openWorldHint: false },
    }, async ({ search }) => {
      const p = await passport();
      const q = (search || '').toLowerCase();
      const list = p.venuesPlayed.filter((v: { name: string; area: string }) => !q || `${v.name} ${v.area}`.toLowerCase().includes(q));
      if (!list.length) return text(`No listed venue matches "${search}". DJ DX has played 500+ events; ask him directly: ${SITE}/#booking. All venues: ${SITE}/venues`);
      return text(list.map((v: { name: string; area: string; summary: string; date: string | null; page: string }) => `${v.name} (${v.area}${v.date ? `, ${v.date}` : ''}): ${v.summary}. ${v.page}`).join('\n'));
    });

    server.registerTool('check_date', {
      title: 'Check a date',
      description: 'Whether a date is listed as booked. A date not listed is not guaranteed open; DJ DX confirms availability within 24 hours.',
      inputSchema: { date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).describe('Event date as YYYY-MM-DD') },
      annotations: { readOnlyHint: true, openWorldHint: false },
    }, async ({ date }) => {
      const p = await passport();
      if (p.availability.booked.includes(date)) return text(`${date} is already booked for DJ DX. Other dates: ${SITE}/#booking`);
      return text(`${date} is not listed as booked. DJ DX confirms availability within 24 hours; use request_booking (with the user's permission) or ${SITE}/#booking to hold it. A written contract and 50% deposit hold the date.`);
    });

    server.registerTool('request_booking', {
      title: 'Send DJ DX a booking inquiry',
      description: "Sends an inquiry email to DJ DX on the user's behalf. Only call when the user has given their name and email and asked DJ DX to contact them. DJ DX replies within 24 hours.",
      inputSchema: {
        name: z.string().min(2).max(100), email: z.string().email().max(254),
        event_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), event_type: z.enum(EVENT_TYPES),
        guests: z.string().max(40).optional(), location: z.string().max(200).optional(), notes: z.string().max(1500).optional(),
      },
      annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: true },
    }, async ({ name, email, event_date, event_type, guests, location, notes }) => {
      const r = await fetch(`${SITE}/api/booking`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name, email, eventDate: event_date, eventType: FORM_TYPE[event_type], location: location || '', guests: guests || '',
          message: `${notes || ''}\n\n(Sent through the DJ DX AI agent${event_type === 'new_years_eve' ? ' — New Year\'s Eve' : ''}.)`.trim(),
          heard: 'ChatGPT or another AI assistant', aiReferral: 'AI agent (MCP)', aiLanding: '/api/mcp',
          honeypot: '', elapsedMs: 5000, pageUrl: `${SITE}/api/mcp`,
        }),
      });
      if (!r.ok) return { ...text(`The inquiry could not be sent (${r.status}). Please use ${SITE}/#booking or email bookings@djdxmusic.com.`), isError: true };
      return text(`Sent. DJ DX will reply to ${email} within 24 hours about ${event_date}. A written contract and a 50% deposit hold the date.`);
    });

    server.registerTool('start_music_plan', {
      title: 'Start a music plan',
      description: "Returns a link to DJ DX's music planning form (must-plays, do-not-plays, key moments), prefilled for a booked client.",
      inputSchema: {
        name: z.string().max(100).optional(), date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
        event_type: z.enum(['wedding', 'birthday', 'corporate', 'mitzvah', 'sweet16', 'private', 'other']).optional(),
        venue: z.string().max(120).optional(), live_violin: z.boolean().optional(),
      },
      annotations: { readOnlyHint: true, openWorldHint: false },
    }, async ({ name, date, event_type, venue, live_violin }) => {
      const q = new URLSearchParams();
      if (name) q.set('name', name); if (date) q.set('date', date); if (event_type) q.set('type', event_type);
      if (venue) q.set('venue', venue); if (live_violin) q.set('duo', '1');
      return text(`Music plan form: ${SITE}/plan${q.toString() ? `?${q}` : ''}\nIt saves as you go and sends the plan to DJ DX with a copy to you.`);
    });

    server.registerTool('office_party_music_poll', {
      title: 'Office party music poll',
      description: 'Link to the free tool where coworkers vote on the music for an office or holiday party.',
      inputSchema: {},
      annotations: { readOnlyHint: true, openWorldHint: false },
    }, async () => text(`Free office party music poll: ${SITE}/office-party-music-poll\nCreate a poll, share one link, and get a crowd report of genres, eras and song requests.`));

    return server;
  }

  export async function handler(req: VercelRequest, res: VercelResponse) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept, Mcp-Session-Id, Mcp-Protocol-Version, Authorization');
    res.setHeader('Access-Control-Expose-Headers', 'Mcp-Session-Id');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    if (req.method === 'OPTIONS') return res.status(204).end();
    if (req.method !== 'POST') {
      return res.status(405).json({ jsonrpc: '2.0', error: { code: -32000, message: 'Use POST (MCP Streamable HTTP, stateless). See https://djdxmusic.com/verified' }, id: null });
    }
    const server = buildServer();
    const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined, enableJsonResponse: true });
    res.on('close', () => { transport.close(); server.close(); });
    try {
      await server.connect(transport);
      await transport.handleRequest(req, res, req.body);
    } catch (e) {
      console.error('mcp error', e);
      if (!res.headersSent) res.status(500).json({ jsonrpc: '2.0', error: { code: -32603, message: 'Internal error' }, id: null });
    }
  }

}

// ═══ api/a2a.ts (merged) ═══
namespace A2a {

  // DJ DX A2A agent (Agent2Agent protocol 0.3.0, JSON-RPC 2.0 transport).
  // Advertised by the signed Agent Card at /.well-known/agent-card.json.
  // Supports `message/send`; answers come only from the signed business
  // passport at /.well-known/business.json. It never books anything itself: it
  // points to the booking form, where DJ DX confirms within 24 hours.
  // Self-contained (no local imports): see api/booking.ts.

  const SITE = 'https://djdxmusic.com';
  type Passport = any; // eslint-disable-line @typescript-eslint/no-explicit-any
  let cache: { at: number; data: Passport } | null = null;
  async function passport(): Promise<Passport> {
    if (cache && Date.now() - cache.at < 10 * 60_000) return cache.data;
    const r = await fetch(`${SITE}/.well-known/business.json`);
    if (!r.ok) throw new Error(`passport_${r.status}`);
    cache = { at: Date.now(), data: await r.json() };
    return cache.data;
  }
  const money = (n: number) => `$${n.toLocaleString('en-US')}`;

  const MONTHS = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
  function findDate(t: string): string | null {
    const iso = t.match(/\b(20\d{2})-(\d{2})-(\d{2})\b/);
    if (iso) return iso[0];
    const m = t.toLowerCase().match(/\b(january|february|march|april|may|june|july|august|september|october|november|december)\s+(\d{1,2})(?:st|nd|rd|th)?(?:,?\s+(20\d{2}))?/);
    if (!m) return null;
    const now = new Date();
    const month = MONTHS.indexOf(m[1]) + 1, day = +m[2];
    let year = m[3] ? +m[3] : now.getFullYear();
    if (!m[3] && new Date(year, month - 1, day) < now) year += 1;
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  }

  async function answer(q: string): Promise<string> {
    const p = await passport();
    const t = q.toLowerCase();
    const sp = p.pricing.startingPrices;
    const date = findDate(q);

    if (date || /\b(available|availability|open|free on|book(ed)?|date)\b/.test(t)) {
      if (!date) return `Send a date (for example 2026-12-12) and I'll check it. DJ DX confirms availability within 24 hours: ${SITE}/#booking`;
      return p.availability.booked.includes(date)
        ? `${date} is already booked for DJ DX. Other dates: ${SITE}/#booking`
        : `${date} is not listed as booked. DJ DX confirms availability within 24 hours. Request it at ${SITE}/#booking (a written contract and a 50% deposit hold the date).`;
    }
    if (/new year|nye/.test(t)) return `New Year's Eve with DJ DX is quoted individually (one NYE event a year). Other events start at ${money(sp.corporate_event_or_holiday_party)}. ${SITE}/new-years-eve-dj-nyc`;
    if (/(price|cost|charge|rate|how much|budget|fee)/.test(t)) {
      if (/wedding/.test(t)) return `DJ DX weddings start at ${money(sp.wedding)} for up to 5 hours, with sound, wireless mics, MC and a planning call. ${SITE}/wedding-dj-cost-nyc`;
      if (/(corporate|holiday|office|company|gala)/.test(t)) return `DJ DX corporate events and office holiday parties start at ${money(sp.corporate_event_or_holiday_party)} for up to 5 hours. Packages: ${p.pricing.corporatePackages.map((x: { name: string; from: number }) => `${x.name} from ${money(x.from)}`).join(', ')}. ${SITE}/corporate-event-dj-nyc-nj-ct#packages`;
      if (/(sweet ?16|quince|mitzvah)/.test(t)) return `Sweet 16, quinceañera and mitzvah DJ from ${money(sp.sweet16_quinceanera_mitzvah)}. ${SITE}/sweet-16-dj-nyc-nj`;
      if (/(violin|duo|soul shades)/.test(t)) return `DJ + live violin duo (Soul Shades) from ${money(sp.dj_and_live_violin_duo)}; live violin add-on ${money(sp.live_violin_add_on_per_hour)}/hour. ${SITE}/violin-dj-duo-nyc-nj`;
      if (/(hampton|destination)/.test(t)) return `Hamptons and destination events from ${money(sp.hamptons_or_destination)}. ${SITE}/hamptons-luxury-dj`;
      if (/(birthday|private|party)/.test(t)) return `Private parties and birthdays from ${money(sp.private_party_or_birthday)} for up to 5 hours. ${SITE}/birthday-party-dj-nyc-nj`;
      return `DJ DX starting prices: weddings ${money(sp.wedding)}, corporate and holiday parties ${money(sp.corporate_event_or_holiday_party)}, private parties ${money(sp.private_party_or_birthday)}, Sweet 16 ${money(sp.sweet16_quinceanera_mitzvah)}, DJ + violin duo ${money(sp.dj_and_live_violin_duo)}, Hamptons ${money(sp.hamptons_or_destination)}. ${p.pricing.note} Estimate: ${SITE}/event-dj-cost-nyc-nj-ct#quote-calculator`;
    }
    if (/(venue|played|argyle|loft|coral|culture lab|santacruzan|groove|hutong|glasshouse)/.test(t)) {
      const list = p.venuesPlayed.filter((v: { name: string }) => {
        const word = v.name.toLowerCase().replace(/^the\s+/, '').split(/\s+/)[0].replace(/[^a-z0-9]/g, '');
        return word.length > 2 && t.includes(word);
      });
      const show = list.length ? list : p.venuesPlayed;
      return show.map((v: { name: string; area: string; date: string | null; page: string }) => `${v.name} (${v.area}${v.date ? `, ${v.date}` : ''}) ${v.page}`).join('\n') + `\nAll venues: ${SITE}/venues`;
    }
    if (/(insur|coi|w-?9|contract|deposit|cancel|backup|terms|policy)/.test(t)) {
      const b = p.bookingTerms;
      return `${b.deposit}; balance ${b.balance.toLowerCase()}. ${b.dateChange}. ${b.backup}. ${b.insurance}. ${b.taxForm}. ${b.source}`;
    }
    if (/(contact|email|phone|text|reach)/.test(t)) return `Email ${p.contact.email} or text ${p.contact.text}. DJ DX replies ${p.contact.responseTime.toLowerCase()}. Form: ${SITE}/#booking`;
    const s = p.subject;
    return `${s.name}: ${s.description} Active since ${s.activeSince}, ${s.eventsPerformed} events. Verified facts: ${SITE}/verified. Ask me about prices, a date, venues played or booking terms.`;
  }

  export async function handler(req: VercelRequest, res: VercelResponse) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, A2A-Version');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    if (req.method === 'OPTIONS') return res.status(204).end();
    if (req.method === 'GET') return res.redirect(307, '/.well-known/agent-card.json');
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const body = req.body && typeof req.body === 'object' ? req.body : {};
    const id = body.id ?? null;
    const fail = (code: number, message: string) => res.status(200).json({ jsonrpc: '2.0', id, error: { code, message } });
    if (body.jsonrpc !== '2.0' || typeof body.method !== 'string') return fail(-32600, 'Invalid Request');
    if (body.method !== 'message/send') return fail(-32601, `Method not found: ${body.method}. This agent supports message/send.`);

    const msg = body.params?.message;
    const parts: { kind?: string; text?: string }[] = Array.isArray(msg?.parts) ? msg.parts : [];
    const q = parts.filter(p => p.kind === 'text' && typeof p.text === 'string').map(p => p.text).join('\n').slice(0, 2000);
    if (!q.trim()) return fail(-32602, 'Invalid params: message.parts needs a text part');

    try {
      const reply = await answer(q);
      return res.status(200).json({
        jsonrpc: '2.0', id,
        result: {
          kind: 'message', role: 'agent', messageId: randomUUID(),
          ...(msg?.contextId ? { contextId: msg.contextId } : {}),
          parts: [{ kind: 'text', text: reply }],
        },
      });
    } catch (e) {
      console.error('a2a error', e);
      return fail(-32603, 'Internal error');
    }
  }

}

// ═══ api/attest.ts (merged) ═══
namespace Attest {

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

  export async function handler(req: VercelRequest, res: VercelResponse) {
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

}

// ═══ api/ai-visibility.ts (merged) ═══
namespace AiVis {

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
      if (!r.ok) return { question, named: false, cited: false, citedPages: [], competitors: [], error: `http_${r.status}: ${(await r.text()).slice(0, 160)}` };
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

  export async function handler(req: VercelRequest, res: VercelResponse) {
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

}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const p = String(req.query.p || '');
  if (p === 'mcp') return Mcp.handler(req, res);
  if (p === 'a2a') return A2a.handler(req, res);
  if (p === 'attest') return Attest.handler(req, res);
  if (p === 'aivis') return AiVis.handler(req, res);
  return res.status(404).json({ error: 'Not found' });
}
