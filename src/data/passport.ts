// DJ DX Verified Business Passport: the single source for
//   - the human page at /verified (src/pages/Verified.tsx)
//   - the machine-readable passport at /.well-known/business.json, signed with
//     the did:web:djdxmusic.com key at build time (scripts/identity.mjs)
//   - the AI agent (api/mcp.ts and api/a2a.ts read the published JSON)
// Every fact links to where it can be checked. Only confirmed facts go here.

import { VENUES } from './venues';
import { GIGS, isLive } from './events';
import { CORP_PACKAGES } from './packages';
import { STARTING_PRICES, HAMPTONS_FLOOR, VIOLIN_HOURLY } from '../lib/pricing';
import { BOOKED_DATES } from './availability';

const SITE = 'https://djdxmusic.com';
export const DID = 'did:web:djdxmusic.com';

export interface Source { label: string; url: string }

export function buildPassport() {
  return {
    '@context': 'https://schema.org',
    type: 'BusinessPassport',
    version: 1,
    id: `${SITE}/.well-known/business.json`,
    issuer: DID,
    subject: {
      did: DID,
      name: 'DJ DX',
      realName: 'Robert Van Liew',
      alternateNames: ['DJDX', 'DJ DX Music', 'El Negro'],
      description: 'Event DJ, producer and recording artist from Jersey City, based in Brooklyn. Weddings, corporate events, holiday parties and private events across New York, New Jersey and Connecticut. DJing since 1998.',
      website: SITE,
      activeSince: 1998,
      hometown: 'Jersey City, NJ',
      baseLocation: 'Brooklyn, NY',
      serviceArea: ['New York City', 'Brooklyn', 'Manhattan', 'Queens', 'Jersey City', 'Hoboken', 'Northern New Jersey', 'Long Island', 'Westchester', 'Hudson Valley', 'Connecticut', 'The Hamptons'],
      eventsPerformed: '500+',
      schemaEntity: `${SITE}/#djdx`,
      businessEntity: `${SITE}/#service`,
    },
    contact: {
      email: 'bookings@djdxmusic.com',
      text: '+1-646-470-3469',
      bookingForm: `${SITE}/#booking`,
      responseTime: 'Within 24 hours',
    },
    pricing: {
      currency: 'USD',
      note: 'Published starting prices. Final quotes depend on date, venue, hours and guest count. Travel outside NYC is quoted as its own line.',
      startingPrices: {
        wedding: STARTING_PRICES.wedding,
        corporate_event_or_holiday_party: STARTING_PRICES.corporate,
        private_party_or_birthday: STARTING_PRICES.private,
        sweet16_quinceanera_mitzvah: STARTING_PRICES.sweet16,
        dj_and_live_violin_duo: STARTING_PRICES.duo,
        hamptons_or_destination: HAMPTONS_FLOOR,
        live_violin_add_on_per_hour: VIOLIN_HOURLY,
      },
      newYearsEve: 'Quoted individually',
      corporatePackages: CORP_PACKAGES.map(p => ({ name: p.name, from: p.price, hours: p.hours, includes: p.includes })),
      sources: [{ label: 'Pricing (plain text)', url: `${SITE}/pricing.txt` }, { label: 'Instant price estimate', url: `${SITE}/event-dj-cost-nyc-nj-ct#quote-calculator` }],
    },
    bookingTerms: {
      deposit: '50% deposit and a signed contract hold the date',
      balance: 'Due 14 days before the event',
      dateChange: 'One free date change within 12 months, subject to availability',
      backup: 'A DJ personally vetted by DJ DX covers emergencies',
      insurance: 'Certificate of insurance available on request',
      taxForm: 'W-9 available on request',
      source: `${SITE}/booking-policy`,
    },
    verifiedProfiles: [
      { label: 'Google Business Profile', url: 'https://maps.google.com/?cid=4966958562421956436' },
      { label: 'Google Knowledge Graph (business)', url: 'https://www.google.com/search?kgmid=/g/11clt9_xj_' },
      { label: 'Google Knowledge Graph (artist)', url: 'https://www.google.com/search?kgmid=/m/0h88rm_' },
      { label: 'Wikidata', url: 'https://www.wikidata.org/wiki/Q17579958' },
      { label: 'MusicBrainz', url: 'https://musicbrainz.org/artist/8a6ee50a-8713-4828-a42f-8aa8f9579d6b' },
      { label: 'ISNI', url: 'https://isni.org/isni/0000000466004223' },
      { label: 'Spotify', url: 'https://open.spotify.com/artist/4gGFdpDwEe8zIY1XSE3dGe' },
      { label: 'Apple Music', url: 'https://music.apple.com/us/artist/dj-dx/1035405039' },
      { label: 'Instagram', url: 'https://www.instagram.com/djdx' },
      { label: 'YouTube', url: 'https://www.youtube.com/@djdxmusic' },
      { label: 'TikTok', url: 'https://www.tiktok.com/@djdxmusic' },
      { label: 'Eventective', url: 'https://www.eventective.com/new-york-ny/dj-dx-805863.html' },
    ] as Source[],
    press: [
      { label: 'TEDxYouth@RVA performance (TED.com)', url: 'https://www.ted.com/talks/dj_dx_finally_moving', date: '2022' },
      { label: 'Voyage ATL: Life & Work with Robert Van Liew', url: 'https://voyageatl.com/interview/life-work-with-robert-van-liew-of-national/', date: '2026-09-10' },
      { label: 'Disrupt Magazine', url: 'https://disruptmagazine.com/dj-dx-leads-the-music-industry-into-the-metaverse/', date: '' },
      { label: 'The Jersey Journal: "DJ DX headlines at Groove on Grove this week" (Weekend Urge cover)', url: `${SITE}/news/groove-on-grove-jersey-journal`, date: '2014-08-01' },
    ],
    venuesPlayed: VENUES.map(v => ({
      name: v.name,
      area: v.area,
      summary: v.summary,
      date: v.event?.startDate || null,
      page: `${SITE}/venues/${v.slug}`,
      evidence: [v.photos?.length ? 'photos' : '', v.video ? 'video' : ''].filter(Boolean),
    })),
    recentEvents: GIGS.filter(isLive).map(g => ({
      eventType: g.eventType,
      client: g.showClientName && g.clientName ? g.clientName : g.clientGeneric || null,
      venue: g.showVenueName ? g.venueName || null : null,
      location: g.venueCity,
      date: g.date,
    })),
    availability: {
      booked: BOOKED_DATES,
      note: 'Dates listed here are booked. A date not listed is not guaranteed open; DJ DX confirms availability within 24 hours.',
      requestUrl: `${SITE}/#booking`,
    },
    ai: {
      agentCard: `${SITE}/.well-known/agent-card.json`,
      mcpServer: `${SITE}/api/mcp`,
      a2aEndpoint: `${SITE}/api/a2a`,
      llmsTxt: `${SITE}/llms.txt`,
      attestations: `${SITE}/api/attest`,
      didDocument: `${SITE}/.well-known/did.json`,
    },
  };
}

export type Passport = ReturnType<typeof buildPassport>;
