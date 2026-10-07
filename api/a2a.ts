import type { VercelRequest, VercelResponse } from '@vercel/node';
import { randomUUID } from 'crypto';

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

export default async function handler(req: VercelRequest, res: VercelResponse) {
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
