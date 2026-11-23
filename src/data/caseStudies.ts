// Case studies: one entry per /work/<slug> page, rendered by src/pages/CaseStudy.tsx.
//
// RULES
// - Every fact here must already be confirmed: named in DJ DX's own posts, in
//   src/data/events.ts with showClientName: true, or in a client quote the
//   client sent. Do not add guest counts, budgets or set lengths that were not
//   confirmed. Leave a fact out rather than estimate it.
// - Saks photos are (c) Linsey Kromer and must keep `credit` wherever used.
// - Text fields accept [link text](/path) links (see components/RichText).

export interface CaseStudy {
  slug: string;
  client: string;
  title: string;              // <title>, under 62 characters
  description: string;        // meta description, under 156 characters
  h1: string;
  overline: string;
  summary: string;            // one line for the /work index and llms.txt
  date: string;               // ISO, for schema
  dateLabel: string;
  venueName?: string;
  venueArea: string;
  venueAddress?: { street: string; locality: string; region: string; postalCode: string };
  venueLink?: string;
  facts: [string, string][];  // label, value
  intro: string[];
  sections: { h2: string; paras?: string[]; bullets?: string[] }[];
  quotes?: { quote: string; name: string; company: string }[];
  photos: { src: string; alt: string; w: number; h: number; credit?: string }[];
  videos?: { src: string; poster: string; w: number; h: number; label: string }[];
  soulShades?: boolean;
  bookingEventType: string;
  cta: string;
  related: { label: string; path: string }[];
}

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: 'nautadutilh-620-loft-garden',
    client: 'NautaDutilh',
    title: 'NautaDutilh Rooftop Reception, 620 Loft & Garden | DJ DX',
    description: 'How DJ DX and live violin ran a 175-guest law firm reception on the 620 Loft & Garden rooftop at Rockefeller Center, from cocktail hour to after-party.',
    h1: 'NautaDutilh: A 175-Guest Rooftop Reception at 620 Loft & Garden',
    overline: 'Case study · Law firm reception',
    summary: '175-guest law firm reception on the 620 Loft & Garden rooftop, Rockefeller Center. DJ with live violin, cocktail hour through after-party.',
    date: '2026-06-02',
    dateLabel: 'June 2, 2026',
    venueName: '620 Loft & Garden',
    venueArea: 'Rockefeller Center, Manhattan',
    venueAddress: { street: '620 5th Ave', locality: 'New York', region: 'NY', postalCode: '10020' },
    venueLink: '/venues/620-loft-garden-rockefeller-center',
    facts: [
      ['Client', 'NautaDutilh New York P.C., an international law firm'],
      ['Date', 'June 2, 2026'],
      ['Venue', '620 Loft & Garden, 620 Fifth Avenue, Rockefeller Center'],
      ['Guests', '175'],
      ['Act', 'Soul Shades: DJ DX on the decks, Julie Schatz on live violin'],
      ['Coverage', 'Cocktail hour through the after-party'],
    ],
    intro: [
      "On June 2, 2026, the international law firm NautaDutilh held a 175-guest reception on the rooftop of 620 Loft & Garden, the garden above Fifth Avenue at Rockefeller Center that faces St. Patrick's Cathedral. DJ DX played it as [Soul Shades](https://soulshadesmusic.com/), his duo with violinist Julie Schatz: a full DJ set with live violin layered on top, from cocktail hour through the after-party.",
    ],
    sections: [
      {
        h2: 'The room',
        paras: [
          '620 Loft & Garden has two spaces with very different sound: an open-air rooftop garden and an indoor loft. Outdoors, sound disappears into the sky and the city, so the speakers have to carry without getting harsh for the people standing next to them. Indoors, the room reflects, so the same volume reads louder.',
          "The setting does a lot of the work. With St. Patrick's Cathedral and the Midtown skyline behind the booth, the music for the first hour stays at a level where guests can talk and take it in.",
        ],
      },
      {
        h2: 'How the night ran',
        paras: [
          'DJ DX covered the whole evening, from cocktail hour through the after-party, mixing on the decks while Julie Schatz layered live violin over the set. Guests heard keyboard and violin alongside the DJ mix, which is what both client quotes below single out.',
        ],
      },
      {
        h2: 'Why a law firm booked a duo',
        paras: [
          'A firm reception has partners, associates, clients and guests in one room, and most of them came to talk. Live violin gives the night something people notice and remember without turning it into a concert, and the DJ side keeps the music moving when the room is ready to dance.',
          'For a firm event without live music, the same DJ setup, clean edits and planning call come with every [law firm and finance event](/law-firm-finance-event-dj-nyc).',
        ],
      },
    ],
    quotes: [
      { quote: "Your performance set the tone for our event, and the addition of the violin amplified our guests' experience and made the evening memorable.", name: 'Anna Naraine', company: 'NautaDutilh New York P.C.' },
      { quote: "The music was just perfect and the vibe was great. I love the uniqueness of keyboard and violin together with DJing. I don't think there are a lot of DJs who come with this built into the duo.", name: 'Sue Krebs', company: 'NautaDutilh New York P.C.' },
    ],
    photos: [
      { src: '/nautadutilh-dj-dx-620-loft-garden-nyc.jpg', alt: "DJ DX performing on the 620 Loft & Garden rooftop at Rockefeller Center, with St. Patrick's Cathedral behind", w: 1600, h: 2133 },
      { src: '/nautadutilh-violin-skyline-nyc.jpg', alt: "Live violin over the DJ set with the Manhattan skyline and St. Patrick's Cathedral, 620 Loft & Garden rooftop", w: 1600, h: 2133 },
      { src: '/nautadutilh-soul-shades-violin-nyc.jpg', alt: 'Soul Shades violin and DJ performance at the NautaDutilh rooftop reception, 620 Loft & Garden', w: 1600, h: 2133 },
      { src: '/nautadutilh-dj-booth-cathedral-nyc.jpg', alt: "DJ DX at the booth during the NautaDutilh reception, with St. Patrick's Cathedral and the Manhattan skyline behind", w: 1920, h: 720 },
      { src: '/nautadutilh-julie-violin-cathedral-nyc.jpg', alt: "Julie Schatz performing live violin at the NautaDutilh rooftop reception, St. Patrick's Cathedral behind", w: 1920, h: 720 },
      { src: '/nautadutilh-group-photo-cathedral-nyc.jpg', alt: "NautaDutilh reception guests in the rooftop garden with St. Patrick's Cathedral and the Manhattan skyline", w: 1920, h: 720 },
    ],
    videos: [
      { src: '/videos/nautadutilh-rooftop-night-nyc.mp4', poster: '/nautadutilh-rooftop-night-poster.jpg', w: 540, h: 960, label: 'DJ DX rooftop setup at night, NautaDutilh reception at 620 Loft & Garden' },
    ],
    soulShades: true,
    bookingEventType: 'Corporate Event / Holiday Party',
    cta: 'Planning a firm reception, holiday party or client event? Corporate events start at $2,800, and DJ with live violin starts at $3,500. Send your date and you will hear back within 24 hours.',
    related: [
      { label: 'Law firm and finance event DJ', path: '/law-firm-finance-event-dj-nyc' },
      { label: 'Live violin and DJ duo', path: '/violin-dj-duo-nyc-nj' },
      { label: 'Corporate event DJ in NYC', path: '/corporate-event-dj-nyc-nj-ct' },
      { label: 'Rooftop party DJ', path: '/rooftop-party-dj-nyc' },
    ],
  },
  {
    slug: 'saks-fifth-avenue-water-mill',
    client: 'Saks Fifth Avenue',
    title: 'Saks Fifth Avenue Estate Event, Water Mill NY | DJ DX',
    description: 'How DJ DX scored a Saks Fifth Avenue private estate event in Water Mill: a Jared Lehr jewelry showcase, golden-hour set and a dance floor after dark.',
    h1: 'Saks Fifth Avenue: A Private Estate Event in Water Mill',
    overline: 'Case study · Retail brand event',
    summary: 'Saks Fifth Avenue private estate event in Water Mill, NY with a Jared Lehr jewelry showcase. Golden-hour set under a sailcloth tent into a dance floor after dark.',
    date: '2026-08',
    dateLabel: 'August 2026',
    venueArea: 'Water Mill, NY (the Hamptons)',
    facts: [
      ['Client', 'Saks Fifth Avenue'],
      ['Date', 'August 2026'],
      ['Location', 'Private estate, Water Mill, NY'],
      ['Event', 'Evening jewelry showcase featuring Jared Lehr'],
      ['Cause', "A portion of the evening's sales supported St. Jude Children's Research Hospital"],
      ['Setup', 'DJ booth and sound under a sailcloth tent'],
    ],
    intro: [
      "In August 2026, Saks Fifth Avenue hosted a private evening event at an estate in Water Mill, New York: an intimate jewelry showcase featuring Jared Lehr, with a portion of the evening's sales supporting St. Jude Children's Research Hospital. DJ DX played a golden-hour open-air set under a sailcloth tent, and the night moved from cocktail-hour house and disco into a full late-set groove as the sky went from gold to navy.",
    ],
    sections: [
      {
        h2: 'The brief',
        paras: [
          'A brand event has a job to do before anyone dances. Guests came to see the jewelry and talk with the people showing it, so the music had to fit the label and stay out of the way of conversation at the showcase, the poolside lounge and the bar.',
        ],
      },
      {
        h2: 'How the night ran',
        bullets: [
          'Golden hour: an open-air set of house and disco as guests moved between the jewelry showcase, the poolside lounge and the sailcloth tent.',
          'After dark: under string lights in the tent, the set built into a late groove and a full dance floor.',
        ],
      },
      {
        h2: 'What a store or brand event can take from it',
        paras: [
          'A store opening, trunk show or pop-up has the same brief: music people shop to, not around, that builds when the room is ready. The setup is compact enough to sit beside a display, and a certificate of insurance is issued to match the landlord or venue. See [store opening and retail event DJ](/store-opening-retail-event-dj-nyc) and [Hamptons luxury DJ](/hamptons-luxury-dj).',
        ],
      },
    ],
    photos: [
      { src: '/saks-dj-dx-dancefloor-water-mill-hamptons.jpg', alt: 'Guests dancing as DJ DX performs at a Saks Fifth Avenue private estate event in Water Mill, New York', w: 1400, h: 2099, credit: 'Linsey Kromer' },
      { src: '/saks-golden-hour-tent-water-mill-hamptons.jpg', alt: 'Golden-hour sailcloth tent reception at a Saks Fifth Avenue private estate event in Water Mill, New York', w: 1400, h: 933, credit: 'Linsey Kromer' },
      { src: '/saks-jared-lehr-showcase-water-mill-hamptons.jpg', alt: 'Jared Lehr jewelry showcase and guests at a Saks Fifth Avenue private estate event in Water Mill, New York', w: 1400, h: 934, credit: 'Linsey Kromer' },
      { src: '/saks-dj-dx-booth-setup-water-mill-hamptons.jpg', alt: 'DJ DX and the full DJ booth setup with speakers under the sailcloth tent at a Saks Fifth Avenue private estate event in Water Mill, New York', w: 1400, h: 2099, credit: 'Linsey Kromer' },
      { src: '/saks-estate-poolside-water-mill-hamptons.jpg', alt: 'Poolside lounge and sailcloth tent at a Saks Fifth Avenue private estate event in Water Mill, New York', w: 1400, h: 933, credit: 'Linsey Kromer' },
      { src: '/saks-tent-night-water-mill-hamptons.jpg', alt: 'Sailcloth tent lit up at night during a Saks Fifth Avenue private estate event in Water Mill, New York', w: 1400, h: 934, credit: 'Linsey Kromer' },
      { src: '/saks-jared-lehr-place-card-water-mill-hamptons.jpg', alt: 'Saks Fifth Avenue and Jared Lehr co-branded place card beside florals at a private estate event in Water Mill, New York', w: 1400, h: 2099, credit: 'Linsey Kromer' },
      { src: '/saks-dj-dx-mixing-water-mill-hamptons.jpg', alt: 'DJ DX mixing during a Saks Fifth Avenue private estate reception in Water Mill, New York', w: 900, h: 1200, credit: 'Linsey Kromer' },
    ],
    videos: [
      { src: '/videos/saks-watermill-djing-clip.mp4', poster: '/saks-watermill-video-poster.jpg', w: 1080, h: 1920, label: 'DJ DX djing under a sailcloth tent at a Saks Fifth Avenue private estate event in Water Mill, New York' },
    ],
    bookingEventType: 'Corporate Event / Holiday Party',
    cta: 'Planning a brand event, store opening or Hamptons party? Corporate and brand events start at $2,800 for up to five hours. Send your date and you will hear back within 24 hours.',
    related: [
      { label: 'Store opening and retail event DJ', path: '/store-opening-retail-event-dj-nyc' },
      { label: 'Hamptons luxury DJ', path: '/hamptons-luxury-dj' },
      { label: 'Corporate event DJ in NYC', path: '/corporate-event-dj-nyc-nj-ct' },
    ],
  },
];

export const caseStudyBySlug = (slug: string) => CASE_STUDIES.find(c => c.slug === slug);
