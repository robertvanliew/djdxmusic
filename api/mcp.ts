import type { VercelRequest, VercelResponse } from '@vercel/node';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { z } from 'zod';

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

export default async function handler(req: VercelRequest, res: VercelResponse) {
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
