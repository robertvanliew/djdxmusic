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
  // Gallery photos live in public/venues/<name>.jpg and .webp; give the base path without extension.
  photos?: { src: string; alt: string; w: number; h: number }[];
  // Self-hosted highlight reel (public/videos). Emitted as VideoObject schema and listed in the video sitemap.
  video?: { src: string; poster: string; name: string; description: string; uploadDate: string; duration: string; w: number; h: number };
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
    summary: "New Year's Eve 2025 and a Recognize company event with Crystal Waters live",
    title: "The Argyle NYC DJ | New Year's Eve & Private Events | DJ DX",
    description: "DJ DX has played The Argyle in Chelsea twice: the lounge's New Year's Eve party and a Recognize company event with Crystal Waters live. Book the same setup.",
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
          "The Argyle booked DJ DX for its New Year's Eve party on December 31, 2025, with Julie Schatz on live violin as Soul Shades. The night built from cocktail-hour soul and R&B into open-format dance sets, then a countdown into midnight and a dance floor that stayed full well past it.",
          "Planning a New Year's Eve party in a lounge or private room? See [New Year's Eve DJ NYC](/new-years-eve-dj-nyc).",
        ],
      },
      {
        h2: 'Recognize company event with Crystal Waters',
        paras: [
          "For a 2025 company event for Recognize, the technology investment firm co-founded by Charles Phillips (former president of Oracle and CEO of Infor), DJ DX handled both the DJ sets and the full sound for Crystal Waters' live performance. That meant one point of contact for the whole night: music before and after her set, and a clean, tuned sound system for a headline vocalist in an intimate lounge.",
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
    photos: [
      { src: '/venues/argyle-new-years-eve-dance-floor-chelsea', alt: "Full dance floor at The Argyle's New Year's Eve party in Chelsea, NYC, with DJ DX on the decks", w: 611, h: 814 },
      { src: '/venues/argyle-crystal-waters-live-chelsea', alt: 'Crystal Waters performing live at a Recognize company event at The Argyle, Chelsea, with sound by DJ DX', w: 530, h: 942 },
      { src: '/venues/argyle-lounge-chelsea-nyc', alt: 'The Argyle cocktail lounge beneath Markette in Chelsea, NYC, before guests arrive', w: 1600, h: 1200 },
    ],
    video: {
      src: '/videos/argyle-new-years-eve-2025-dj-dx-soul-shades.mp4',
      poster: '/videos/argyle-new-years-eve-2025-dj-dx-soul-shades-poster.jpg',
      name: "New Year's Eve 2025 at The Argyle, Chelsea NYC | DJ DX and Soul Shades",
      description: "Highlights from The Argyle's New Year's Eve party in Chelsea, NYC, December 31, 2025: DJ DX on the decks with Julie Schatz on live violin, and a full dance floor past midnight.",
      uploadDate: '2026-10-07T18:00:00-04:00',
      duration: 'PT44S',
      w: 720, h: 1280,
    },
    event: { name: "New Year's Eve at The Argyle", startDate: '2025-12-31' },
    pages: [NYE, CORPORATE, HOLIDAY],
  },
  {
    slug: '620-loft-garden-rockefeller-center',
    name: '620 Loft & Garden',
    area: 'Rockefeller Center, Manhattan',
    summary: 'Soul Shades rooftop reception for NautaDutilh, June 2, 2026',
    title: '620 Loft & Garden DJ | Rockefeller Center Rooftop | DJ DX',
    description: 'DJ DX and Soul Shades played the 620 Loft & Garden rooftop at Rockefeller Center. DJ with live violin and keys for corporate, holiday and private events.',
    h1: 'DJ at 620 Loft & Garden, Rockefeller Center',
    overline: 'Venue: 620 Loft & Garden, Fifth Avenue',
    address: { street: '620 5th Ave', locality: 'New York', region: 'NY', postalCode: '10020' },
    image: { src: '/nautadutilh-dj-dx-620-loft-garden-nyc.jpg', alt: "DJ DX performing on the 620 Loft & Garden rooftop at Rockefeller Center, with St. Patrick's Cathedral behind" },
    intro: [
      "620 Loft & Garden is the rooftop garden above Fifth Avenue at Rockefeller Center, facing St. Patrick's Cathedral. On June 2, 2026, DJ DX brought [Soul Shades](/soul-shades) to the rooftop for a 175-guest reception for the international law firm NautaDutilh: DJ mixing with live violin from Julie Schatz layered on top, from cocktail hour through the after-party.",
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
    event: { name: 'NautaDutilh reception with Soul Shades at 620 Loft & Garden', startDate: '2026-06-02' },
    pages: [CORPORATE, HOLIDAY, '/violin-dj-duo-nyc-nj', '/rooftop-party-dj-nyc'],
  },
  {
    slug: 'coral-house-baldwin-ny',
    name: 'Coral House',
    area: 'Baldwin, Long Island',
    summary: 'Private birthday celebration for 300 guests, 2025',
    title: 'Coral House Baldwin DJ | Long Island Party DJ | DJ DX',
    description: 'DJ DX played a 300-guest private birthday at the Coral House in Baldwin, NY in 2025. Long Island birthday, milestone and private party DJ.',
    h1: 'DJ at the Coral House, Baldwin NY',
    overline: 'Venue: Coral House, Milburn Lake',
    address: { street: '70 Milburn Ave', locality: 'Baldwin', region: 'NY', postalCode: '11510' },
    intro: [
      "The Coral House is the waterfront event venue on Milburn Lake in Baldwin, on Long Island's South Shore. In 2025 DJ DX played a private birthday celebration there for 300 guests, a family-and-friends crowd that spanned generations.",
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
    photos: [
      { src: '/venues/coral-house-dj-dx-booth-baldwin-ny', alt: 'DJ DX at his DJ booth with keys at a private birthday at the Coral House, Baldwin, NY', w: 611, h: 814 },
      { src: '/venues/coral-house-ballroom-from-dj-booth-baldwin', alt: 'View from the DJ booth across the Coral House ballroom in Baldwin, Long Island, during a 300-guest birthday', w: 611, h: 814 },
      { src: '/venues/coral-house-ballroom-baldwin-ny', alt: 'The Coral House ballroom in Baldwin, NY set for a private birthday celebration', w: 611, h: 814 },
    ],
    pages: ['/birthday-party-dj-nyc-nj', '/private-party-dj-nyc-nj', '/wedding-dj-long-island-ny'],
  },
  {
    slug: 'culture-lab-lic',
    name: 'Culture Lab LIC',
    area: 'Long Island City, Queens',
    summary: 'Culture Lab Festival, Soul Shades set, October 2024',
    title: 'Culture Lab LIC DJ | Soul Shades Festival Set | DJ DX',
    description: 'DJ DX and Soul Shades played the Culture Lab Festival at Culture Lab LIC in Long Island City, Queens, in October 2024. Festival and outdoor event DJ.',
    h1: 'DJ DX and Soul Shades at Culture Lab LIC, Long Island City',
    overline: 'Venue: Culture Lab LIC, 46th Avenue',
    address: { street: '5-25 46th Ave', locality: 'Long Island City', region: 'NY', postalCode: '11101' },
    intro: [
      'Culture Lab LIC is a nonprofit gallery, performance venue and community hub at 5-25 46th Avenue in Long Island City, Queens, with an outdoor lot that hosts free concerts and festivals. On October 27, 2024, Culture Lab booked DJ DX for the Culture Lab Festival on its outdoor stage, performing as Soul Shades with Julie Schatz on violin and keys for an all-ages, walk-in crowd.',
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
          "DJ DX plays gallery openings, galas, fundraisers and public festivals across NYC and New Jersey. He made the cover of the Jersey Journal's weekend section when he headlined [Groove on Grove](/news/groove-on-grove-jersey-journal) in Jersey City. See [corporate and gala DJ](/corporate-event-dj-nyc-nj-ct) and [house and Jersey Club DJ](/house-jersey-club-dj-nyc-nj).",
        ],
      },
    ],
    cta: 'Running a festival, block party or gala? Send the date and format, and you will hear back within 24 hours. A certificate of insurance and W-9 are available for nonprofits and municipalities.',
    bookingEventType: 'Corporate Event / Holiday Party',
    photos: [
      { src: '/venues/culture-lab-lic-soul-shades-stage', alt: 'Soul Shades on the Culture Lab LIC outdoor stage: Julie Schatz on violin and DJ DX on keys, Long Island City, Queens', w: 788, h: 870 },
      { src: '/venues/culture-lab-lic-festival-lot-crowd-queens', alt: 'Festival crowd and vendor tents in the Culture Lab LIC lot, Long Island City, October 2024', w: 977, h: 1302 },
    ],
    video: {
      src: '/videos/culture-lab-lic-soul-shades-2024.mp4',
      poster: '/videos/culture-lab-lic-soul-shades-2024-poster.jpg',
      name: 'Soul Shades live at the Culture Lab Festival, Long Island City (October 2024)',
      description: 'DJ DX and Julie Schatz (Soul Shades) performing on the outdoor stage at Culture Lab LIC, Long Island City, Queens, on October 27, 2024.',
      uploadDate: '2026-10-07T18:00:00-04:00',
      duration: 'PT24S',
      w: 720, h: 1280,
    },
    event: { name: 'Culture Lab Festival', startDate: '2024-10-27' },
    pages: [CORPORATE, '/house-jersey-club-dj-nyc-nj', '/violin-dj-duo-nyc-nj'],
  },
  {
    slug: 'santacruzan-festival-jersey-city',
    name: 'Santacruzan Festival',
    area: 'Manila Avenue, Jersey City',
    summary: '37th Santacruzan & Flores de Mayo Festival, May 2015',
    title: 'Santacruzan Festival Jersey City | DJ DX Live (2015) | DJ DX',
    description: 'DJ DX performed at the 37th Santacruzan & Flores de Mayo Festival on Manila Avenue in Jersey City, May 24, 2015. Video and photos from the stage.',
    h1: 'DJ DX at the Santacruzan Festival, Jersey City',
    overline: 'Festival: Manila Avenue, Jersey City',
    address: { street: 'Manila Ave', locality: 'Jersey City', region: 'NJ', postalCode: '07302' },
    intro: [
      'The Santacruzan & Flores de Mayo Festival is the largest and longest-running Santacruzan celebration on the East Coast, held every May on Manila Avenue in Downtown Jersey City by the Filipino community. On May 24, 2015, at the 37th edition, DJ DX took the stage in his hometown.',
    ],
    sections: [
      {
        h2: 'A Jersey City stage',
        paras: [
          'Jersey City is where DJ DX started DJing in 1998, and its street festivals are where a lot of the city hears live music for the first time each year. The year before, he headlined [Groove on Grove](/news/groove-on-grove-jersey-journal) at the Grove Street PATH Plaza.',
          'Planning an event in Hudson County? See [corporate event DJ in Jersey City](/corporate-event-dj-jersey-city-nj) and [private party DJ](/private-party-dj-nyc-nj).',
        ],
      },
      {
        h2: 'What a street festival set takes',
        bullets: [
          'A set that works for every age on the block, from families to the evening crowd.',
          'Quick changeovers on a shared stage with other performers.',
          'Sound that carries down the street without drowning out the vendors.',
        ],
      },
    ],
    cta: 'Running a street festival, block party or community event in Jersey City? Send the date and format, and you will hear back within 24 hours.',
    bookingEventType: 'Corporate Event / Holiday Party',
    photos: [
      { src: '/venues/santacruzan-festival-jersey-city-2015-stage', alt: 'DJ DX performing at the 37th Santacruzan & Flores de Mayo Festival stage on Manila Avenue, Jersey City, May 2015', w: 640, h: 640 },
      { src: '/venues/santacruzan-festival-jersey-city-2015-keys', alt: 'DJ DX on stage with a keyboard player at the Santacruzan Festival in Jersey City, 2015', w: 640, h: 640 },
    ],
    video: {
      src: '/videos/santacruzan-festival-jersey-city-2015-dj-dx.mp4',
      poster: '/videos/santacruzan-festival-jersey-city-2015-dj-dx-poster.jpg',
      name: 'DJ DX live at the 37th Santacruzan & Flores de Mayo Festival, Jersey City (May 24, 2015)',
      description: 'DJ DX performing at the 37th Santacruzan & Flores de Mayo Festival on Manila Avenue in Jersey City, NJ, on May 24, 2015.',
      uploadDate: '2026-10-07T19:00:00-04:00',
      duration: 'PT38S',
      w: 568, h: 320,
    },
    event: { name: '37th Santacruzan & Flores de Mayo Festival', startDate: '2015-05-24' },
    pages: ['/corporate-event-dj-jersey-city-nj'],
  },
];

export const venueBySlug = (slug: string) => VENUES.find(v => v.slug === slug);
export const venuesForPage = (path: string) => VENUES.filter(v => v.pages.includes(path));

// Closed venues, shown in the "Past venues" section of /venues and listed in
// the signed passport. Only add venues DJ DX has confirmed.
export interface PastVenue { name: string; area: string; summary: string; period: string | null }
export const PAST_VENUES: PastVenue[] = [
  {
    name: 'Rebel NYC (Club Rebel)',
    area: 'Midtown Manhattan (251 West 30th Street, near Madison Square Garden)',
    summary: 'Three-level Midtown nightclub; DJ DX played there before it closed in April 2013.',
    period: null,
  },
  {
    name: 'LITM',
    area: 'Downtown Jersey City (Newark Avenue)',
    summary: 'Art bar that anchored Downtown Jersey City nightlife for 17 years; DJ DX played there 2007 to 2009.',
    period: '2007/2009',
  },
];
