// Recent and upcoming events: the single source for the proof block on
// service pages (src/components/ProofBlock.tsx) and the "Companies DJ DX has
// played for" line on the corporate page.
//
// RULES
// - An entry only renders once `date` is a real date ("2026-11" or
//   "2026-11-14"). Anything else, like "[DATE: fill in]", is a draft and stays
//   hidden, so a half-filled entry never shows on the site.
// - Past dates show under "Recent", today and later under "Upcoming". This
//   switches by itself; nothing to move by hand.
// - Private clients are never named. Set showClientName: true ONLY after the
//   client has said yes; until then `clientGeneric` is shown instead.
// - Venue names show only when showVenueName is true and the name is filled in.
// - `pages` lists the URL paths the entry appears on.
// - quote / quoteAuthor / quoteCompany are optional; add them after a gig.
// - No Review or AggregateRating schema is generated from this file (Google
//   does not allow self-serving review markup for local businesses).

export interface GigEntry {
  eventType: string;          // "Corporate event", "Holiday party", "Birthday party"
  venueName?: string;
  venueCity: string;          // "Manhattan, NY", "Jersey City, NJ"
  date: string;               // "YYYY-MM" or "YYYY-MM-DD"; placeholders stay hidden
  showVenueName: boolean;
  clientName?: string;
  showClientName?: boolean;   // default false
  clientGeneric?: string;     // shown when the client name is hidden, e.g. "energy investment firm"
  pages: string[];
  quote?: string;
  quoteAuthor?: string;       // a role is fine, e.g. "Senior Office Manager"
  quoteCompany?: string;      // only rendered when showClientName is true
}

const CORPORATE = '/corporate-event-dj-nyc-nj-ct';
const HOLIDAY = '/holiday-party-dj-nyc-nj-ct';
const JERSEY_CITY = '/corporate-event-dj-jersey-city-nj';
const BROOKLYN = '/corporate-event-dj-brooklyn-ny';

export const GIGS: GigEntry[] = [
  {
    eventType: 'Corporate and private event',
    venueName: 'Hutong New York',
    venueCity: 'Manhattan, NY',
    date: '[DATE: fill in]',
    showVenueName: true,
    pages: [CORPORATE, HOLIDAY, BROOKLYN, JERSEY_CITY],
  },
  // The four below are public: named in DJ DX's own posts and already on the
  // site (corporate, holiday, Hamptons and violin pages). Added 2026-10-07.
  {
    eventType: 'In-office corporate reception',
    clientName: 'LS Power',
    showClientName: true,
    venueCity: 'Midtown Manhattan',
    date: '2026-09',
    showVenueName: false,
    pages: [CORPORATE, HOLIDAY],
  },
  {
    eventType: 'Private estate event',
    clientName: 'Saks Fifth Avenue',
    showClientName: true,
    venueCity: 'Water Mill, NY',
    date: '2026-08',
    showVenueName: false,
    pages: [CORPORATE, '/hamptons-luxury-dj'],
  },
  {
    eventType: 'Rooftop reception with Soul Shades',
    clientName: 'NautaDutilh',
    showClientName: true,
    venueName: '620 Loft & Garden',
    venueCity: 'Rockefeller Center, Manhattan',
    date: '2026-06-02',
    showVenueName: true,
    pages: [CORPORATE, HOLIDAY, '/violin-dj-duo-nyc-nj', '/rooftop-party-dj-nyc'],
  },
  {
    eventType: 'Culture Lab Festival, Soul Shades set',
    venueName: 'Culture Lab LIC',
    venueCity: 'Long Island City, Queens',
    date: '2024-10-27',
    showVenueName: true,
    pages: [CORPORATE, '/house-jersey-club-dj-nyc-nj'],
  },
  {
    eventType: "New Year's Eve party",
    venueName: 'The Argyle',
    venueCity: 'Chelsea, Manhattan',
    date: '2025-12-31',
    showVenueName: true,
    pages: ['/new-years-eve-dj-nyc', CORPORATE, HOLIDAY],
  },
  // {
  //   eventType: 'Holiday party',
  //   venueName: '',
  //   venueCity: '',
  //   date: '2026-12-',
  //   showVenueName: false,
  //   clientGeneric: 'law firm',
  //   pages: [CORPORATE, HOLIDAY],
  // },
  // {
  //   eventType: 'Birthday party',
  //   venueCity: 'Brooklyn, NY',
  //   date: '',
  //   showVenueName: false,
  //   pages: ['/birthday-party-dj-nyc-nj', '/private-party-dj-nyc-nj'],
  // },
];

const DATE_RE = /^\d{4}-(0[1-9]|1[0-2])(-(0[1-9]|[12]\d|3[01]))?$/;
export const isLive = (g: GigEntry) => DATE_RE.test(g.date);

export function gigsForPage(path: string): { recent: GigEntry[]; upcoming: GigEntry[] } {
  const today = new Date().toISOString().slice(0, 10);
  const list = GIGS.filter(g => isLive(g) && g.pages.includes(path));
  // a month-only date counts as upcoming for that whole month
  const end = (d: string) => (d.length === 7 ? `${d}-31` : d);
  return {
    recent: list.filter(g => end(g.date) < today).sort((a, b) => b.date.localeCompare(a.date)),
    upcoming: list.filter(g => end(g.date) >= today).sort((a, b) => a.date.localeCompare(b.date)),
  };
}

export const namedClients = () =>
  [...new Set(GIGS.filter(g => g.showClientName && g.clientName && isLive(g)).map(g => g.clientName!))];
