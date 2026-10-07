// Venues DJ DX has played: one entry per /venues/<slug> page, plus the hub at
// /venues and the "Venues DJ DX has played" row on service pages
// (VenuesPlayed in src/components/ProofBlock.tsx).
//
// RULES
// - Only facts that are confirmed: by DJ DX, his public posts, or the venue's
//   own public information. No invented details, crowd sizes or quotes.
// - Private clients are never named (Coral House) unless they said yes.
// - Text supports [link text](/path) links; nothing else is parsed.
// - Adding a venue: add an entry, then add its path to STATIC_ROUTES in
//   scripts/prerender.mjs and to public/sitemap.xml.

export interface VenueSection { h2: string; paras?: string[]; bullets?: string[] }
export interface Venue {
  slug: string;
  name: string;
  area: string;                 // shown on the hub and in the service-page row
  summary: string;              // one line for the hub and service-page row
  title: string;                // <title>, 60 chars max
  description: string;          // meta description, 160 chars max
  h1: string;
  overline: string;
  address?: { street: string; locality: string; region: string; postalCode: string };
  image?: { src: string; alt: string };
  intro: string[];
  sections: VenueSection[];
  cta: string;
  bookingEventType: string;
  event?: { name: string; startDate: string };  // only when the date is confirmed
  pages: string[];              // service pages that list this venue
}

const CORPORATE = '/corporate-event-dj-nyc-nj-ct';
const HOLIDAY = '/holiday-party-dj-nyc-nj-ct';
const NYE = '/new-years-eve-dj-nyc';

export const VENUES: Venue[] = [
  {
    slug: 'the-argyle-chelsea',
    name: 'The Argyle',
    area: 'Chelsea, Manhattan',
    summary: "New Year's Eve party and a private company event with Crystal Waters live",
    title: "The Argyle NYC DJ | New Year's Eve & Private Events | DJ DX",
    description: "DJ DX has played The Argyle in Chelsea twice: the lounge's New Year's Eve party and a private company event with Crystal Waters live. Book the same setup.",
    h1: 'DJ at The Argyle, Chelsea',
    overline: 'Venue: The Argyle, 326 7th Avenue',
    address: { street: '326 7th Ave', locality: 'New York', region: 'NY', postalCode: '10001' },
    intro: [
      "The Argyle is the cocktail lounge beneath Markette at 326 7th Avenue in Chelsea, a few blocks south of Madison Square Garden and Penn Station. DJ DX has played the room twice: The Argyle's own New Year's Eve party, and a private company event where he DJed the night and ran the sound for a live performance by house music icon Crystal Waters.",
    ],
    sections: [
      {
        h2: "New Year's Eve at The Argyle",
        paras: [
          "The Argyle booked DJ DX for its New Year's Eve party on December 31, 2025. The night built from cocktail-hour soul and R&B into open-format dance sets, then a countdown into midnight and a full dance floor after the drop.",
          "Planning a New Year's Eve party in a lounge or private room? See [New Year's Eve DJ NYC](/new-years-eve-dj-nyc).",
        ],
      },
      {
        h2: 'Private company event with Crystal Waters',
        paras: [
          "For a private 2025 company event hosted by one of New York's best-known technology investors, DJ DX handled both the DJ sets and the full sound for Crystal Waters' live performance. That meant one point of contact for the whole night: music before and after her set, and a clean, tuned sound system for a headline vocalist in an intimate lounge.",
          'If your event includes a live performer, a speaker or a toast, DJ DX can supply and run the sound for it. See [corporate event DJ in NYC](/corporate-event-dj-nyc-nj-ct).',
        ],
      },
      {
        h2: 'Soul Shades at The Argyle',
        paras: ['DJ DX has also brought [Soul Shades](/soul-shades), his duo with Julie Schatz, to The Argyle.'],
      },
      {
        h2: 'Planning notes for The Argyle',
        bullets: [
          'An intimate lounge of about 50 seats: sound is sized to the room, not the guest count, so it is full without being harsh.',
          'A good fit for holiday parties, New Year\'s Eve, after-work company events and private buyouts.',
        ],
      },
    ],
    cta: 'Already booked The Argyle or Markette for your event? DJ DX knows the room. Send your date and you will hear back within 24 hours.',
    bookingEventType: 'Corporate Event / Holiday Party',
    event: { name: "New Year's Eve at The Argyle", startDate: '2025-12-31' },
    pages: [NYE, CORPORATE, HOLIDAY],
  },
  {
    slug: '620-loft-garden-rockefeller-center',
    name: '620 Loft & Garden',
    area: 'Rockefeller Center, Manhattan',
    summary: 'Soul Shades rooftop reception for NautaDutilh, 2026',
    title: '620 Loft & Garden DJ | Rockefeller Center Rooftop | DJ DX',
    description: 'DJ DX and Soul Shades played the 620 Loft & Garden rooftop at Rockefeller Center. DJ with live violin and keys for corporate, holiday and private events.',
    h1: 'DJ at 620 Loft & Garden, Rockefeller Center',
    overline: 'Venue: 620 Loft & Garden, Fifth Avenue',
    address: { street: '620 5th Ave', locality: 'New York', region: 'NY', postalCode: '10020' },
    image: { src: '/nautadutilh-dj-dx-620-loft-garden-nyc.jpg', alt: "DJ DX performing on the 620 Loft & Garden rooftop at Rockefeller Center, with St. Patrick's Cathedral behind" },
    intro: [
      "620 Loft & Garden is the rooftop garden above Fifth Avenue at Rockefeller Center, facing St. Patrick's Cathedral. In 2026 DJ DX brought [Soul Shades](/soul-shades) to the rooftop for a 175-guest reception for the international law firm NautaDutilh: DJ mixing with live violin from Julie Schatz layered on top, from cocktail hour through the after-party.",
    ],
    sections: [
      {
        h2: 'Planning notes for 620 Loft & Garden',
        bullets: [
          'Rooftop garden and indoor loft: plan the sound for open air outside and a more reflective room inside.',
          'Rockefeller Center is the busiest place in New York from late November through New Year\'s. Book holiday dates early and plan load-in around tree-season crowds.',
          'A good fit for holiday parties, client receptions, product launches and private events.',
        ],
      },
      {
        h2: 'DJ solo, or with live violin',
        paras: [
          'Book DJ DX on his own, or add live violin and keys with Soul Shades. See the [violin and DJ duo](/violin-dj-duo-nyc-nj), [office holiday party DJ](/holiday-party-dj-nyc-nj-ct) and [corporate event DJ in NYC](/corporate-event-dj-nyc-nj-ct).',
        ],
      },
    ],
    cta: 'Hosting a holiday party, product launch or private event at 620 Loft & Garden? Send your date and you will hear back within 24 hours.',
    bookingEventType: 'Corporate Event / Holiday Party',
    pages: [CORPORATE, HOLIDAY, '/violin-dj-duo-nyc-nj', '/rooftop-party-dj-nyc'],
  },
  {
    slug: 'coral-house-baldwin-ny',
    name: 'Coral House',
    area: 'Baldwin, Long Island',
    summary: 'Private birthday celebration',
    title: 'Coral House Baldwin DJ | Long Island Party DJ | DJ DX',
    description: 'DJ DX has played a private birthday celebration at the Coral House in Baldwin, NY. Long Island birthday, milestone and private party DJ. Quote in 24 hours.',
    h1: 'DJ at the Coral House, Baldwin NY',
    overline: 'Venue: Coral House, Milburn Lake',
    address: { street: '70 Milburn Ave', locality: 'Baldwin', region: 'NY', postalCode: '11510' },
    intro: [
      "The Coral House is the waterfront event venue on Milburn Lake in Baldwin, on Long Island's South Shore. DJ DX played a private birthday celebration there, for a family-and-friends crowd that spanned generations.",
      'A room like that is where open-format DJing pays off: classic soul and R&B for the elders, hip-hop and current hits for everyone else, and one DJ reading the floor all night instead of one playlist on shuffle.',
    ],
    sections: [
      {
        h2: 'What a Coral House birthday needs',
        bullets: [
          'A DJ who also emcees: entrances, toasts, cake, and the moments the family wants on camera.',
          'Music that works for every age in the room.',
          'Sound sized to the ballroom, set up and tested before guests arrive.',
        ],
      },
      {
        h2: 'Other Long Island events',
        paras: ['DJ DX plays birthdays, milestone parties and weddings across Nassau and Suffolk. See [birthday party DJ](/birthday-party-dj-nyc-nj), [private party DJ](/private-party-dj-nyc-nj) and [Long Island wedding DJ](/wedding-dj-long-island-ny).'],
      },
    ],
    cta: 'Celebrating at the Coral House? Send your date and guest count, and you will hear back within 24 hours with availability and pricing.',
    bookingEventType: 'Private Party / Birthday',
    pages: ['/birthday-party-dj-nyc-nj', '/private-party-dj-nyc-nj', '/wedding-dj-long-island-ny'],
  },
  {
    slug: 'culture-lab-lic',
    name: 'Culture Lab LIC',
    area: 'Long Island City, Queens',
    summary: 'Festival DJ',
    title: 'Culture Lab LIC DJ | Festival & Outdoor Event DJ | DJ DX',
    description: 'DJ DX was the festival DJ at Culture Lab LIC in Long Island City, Queens. Festival, outdoor and arts-event DJ with his own sound, across NYC and NJ.',
    h1: 'Festival DJ at Culture Lab LIC, Long Island City',
    overline: 'Venue: Culture Lab LIC, 46th Avenue',
    address: { street: '5-25 46th Ave', locality: 'Long Island City', region: 'NY', postalCode: '11101' },
    intro: [
      'Culture Lab LIC is a nonprofit gallery, performance venue and community hub at 5-25 46th Avenue in Long Island City, Queens, with an outdoor lot that hosts free concerts and festivals. Culture Lab booked DJ DX as the festival DJ, to carry the day between acts and keep an all-ages, walk-in crowd moving.',
    ],
    sections: [
      {
        h2: 'What a festival set takes',
        bullets: [
          'Reading a crowd that changes every hour: families in the afternoon, a dance crowd by evening.',
          'Smooth handoffs around live performers, speakers and announcements.',
          'Outdoor-ready sound that carries across the lot without blasting the neighbors.',
        ],
      },
      {
        h2: 'Other arts and community events',
        paras: [
          'DJ DX plays gallery openings, galas, fundraisers and public festivals across NYC and New Jersey. He made the front page of the Jersey Journal for his [Groove on Grove](/news/groove-on-grove-jersey-journal) performance in Jersey City. See [corporate and gala DJ](/corporate-event-dj-nyc-nj-ct) and [house and Jersey Club DJ](/house-jersey-club-dj-nyc-nj).',
        ],
      },
    ],
    cta: 'Running a festival, block party or gala? Send the date and format, and you will hear back within 24 hours. A certificate of insurance and W-9 are available for nonprofits and municipalities.',
    bookingEventType: 'Corporate Event / Holiday Party',
    pages: [CORPORATE, '/house-jersey-club-dj-nyc-nj'],
  },
];

export const venueBySlug = (slug: string) => VENUES.find(v => v.slug === slug);
export const venuesForPage = (path: string) => VENUES.filter(v => v.pages.includes(path));
