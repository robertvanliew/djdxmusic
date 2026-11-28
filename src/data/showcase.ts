import type { Media } from '../components/EventMedia';

// "Where I've Played" on the homepage: recent events as short case studies
// with photos and video (src/components/WherePlayed.tsx). Newest first.
//
// RULES (same as src/data/events.ts and src/data/venues.ts)
// - Only confirmed facts. Clients named only with their OK (Contentsquare,
//   NautaDutilh, Saks Fifth Avenue are approved; the Hutong client is not).
// - Saks photos are (c) Linsey Kromer: keep `credit` on every one.
// - Keep these in step with the venue and case study pages they link to.

export type Showcase = {
  id: string;
  date: string;
  title: string;
  venue: string;
  sub: string;
  specs: [string, string][];
  href: string;
  hrefLabel: string;
  media: Media[];
};

const V = (name: string) => `/videos/${name}.mp4`;
const P = (name: string) => `/videos/${name}-poster.jpg`;

export const SHOWCASE: Showcase[] = [
  {
    id: 'hutong',
    date: 'November 21, 2026',
    title: 'Private Event',
    venue: 'Hutong NYC',
    sub: 'A private event inside Bloomberg Tower in Midtown. Speeches on the mic, then a dance floor that filled the room in front of the bar.',
    specs: [
      ['Event', 'Private event'],
      ['Venue', 'Hutong, Bloomberg Tower, 731 Lexington Avenue'],
      ['Area', 'Midtown Manhattan'],
    ],
    href: '/venues/hutong-nyc',
    hrefLabel: 'See every photo and clip from Hutong',
    media: [
      { kind: 'video', src: V('hutong-nyc-dance-floor-opens'), poster: P('hutong-nyc-dance-floor-opens'), alt: 'The dance floor filling up at a private event at Hutong NYC', cap: 'The dance floor opens' },
      { kind: 'img', src: '/venues/hutong-nyc-dj-dx-booth-private-event.jpg', webp: '/venues/hutong-nyc-dj-dx-booth-private-event.webp', alt: 'DJ DX setup at Hutong NYC private event, lit DJ booth with speakers and keyboard by the windows', cap: 'The booth by the windows', w: 1200, h: 1600 },
      { kind: 'video', src: V('hutong-nyc-dance-floor-by-the-bar'), poster: P('hutong-nyc-dance-floor-by-the-bar'), alt: 'Guests dancing in front of the bar at Hutong NYC', cap: 'In front of the bar' },
      { kind: 'video', src: V('hutong-nyc-violin-over-the-dj-set'), poster: P('hutong-nyc-violin-over-the-dj-set'), alt: 'Violin over the DJ set beside the booth at Hutong NYC', cap: 'Violin over the set' },
      { kind: 'video', src: V('hutong-nyc-view-from-the-booth'), poster: P('hutong-nyc-view-from-the-booth'), alt: 'The view from the DJ booth over the dance floor at Hutong NYC', cap: 'View from the booth' },
    ],
  },
  {
    id: 'contentsquare',
    date: 'October 13, 2026',
    title: 'Contentsquare CX Circle NYC',
    venue: 'The Glasshouse',
    sub: "DJ DX and violinist Julie Schatz played the evening reception of Contentsquare's customer-experience conference, as the sun went down over the Hudson behind the booth.",
    specs: [
      ['Client', 'Contentsquare'],
      ['Venue', "The Glasshouse, Hell's Kitchen"],
      ['Guests', '1,000+'],
      ['Set', 'Evening reception, 5 to 7 pm, DJ with live violin'],
    ],
    href: '/venues/the-glasshouse-hells-kitchen',
    hrefLabel: 'Read about The Glasshouse',
    media: [
      { kind: 'img', src: '/venues/glasshouse-dj-dx-contentsquare-cx-circle-hells-kitchen.jpg', webp: '/venues/glasshouse-dj-dx-contentsquare-cx-circle-hells-kitchen.webp', alt: "DJ DX at the decks at Contentsquare's CX Circle NYC 2026, The Glasshouse, with the Hudson River at sunset behind him", cap: 'Sunset over the Hudson', w: 1200, h: 1600 },
      { kind: 'video', src: V('glasshouse-contentsquare-cx-circle-2026-dj-dx'), poster: P('glasshouse-contentsquare-cx-circle-2026-dj-dx'), alt: "The crowd at CX Circle NYC 2026, then DJ DX at the decks, The Glasshouse", cap: 'On the floor during the reception' },
      { kind: 'img', src: '/venues/glasshouse-event-space-hudson-views-hells-kitchen-nyc.jpg', webp: '/venues/glasshouse-event-space-hudson-views-hells-kitchen-nyc.webp', alt: "The Glasshouse event space at 660 12th Avenue with floor-to-ceiling windows, before guests arrived", cap: 'The Glasshouse, 660 12th Avenue', w: 1200, h: 1600 },
      { kind: 'img', src: '/venues/glasshouse-dj-booth-setup-12th-avenue-nyc.jpg', webp: '/venues/glasshouse-dj-booth-setup-12th-avenue-nyc.webp', alt: 'The DJ DX booth set up at The Glasshouse for Contentsquare CX Circle', cap: 'The booth', w: 1200, h: 1600 },
    ],
  },
  {
    id: 'saks',
    date: 'August 2026',
    title: 'Saks Fifth Avenue',
    venue: 'Water Mill Estate',
    sub: "A private estate evening for Saks Fifth Avenue with a Jared Lehr jewelry showcase, a portion of sales supporting St. Jude. A golden-hour set under a sailcloth tent that turned into a dance floor after dark.",
    specs: [
      ['Client', 'Saks Fifth Avenue'],
      ['Venue', 'Private estate, Water Mill, NY'],
      ['Event', 'Jared Lehr jewelry showcase'],
      ['Set', 'Golden hour through a late dance floor'],
    ],
    href: '/work/saks-fifth-avenue-water-mill',
    hrefLabel: 'Read the Saks case study',
    media: [
      { kind: 'img', src: '/saks-dj-dx-dancefloor-water-mill-hamptons.jpg', alt: 'Guests dancing as DJ DX performs at a Saks Fifth Avenue private estate event in Water Mill, New York', cap: 'Packed floor under the tent', credit: 'Linsey Kromer', w: 1400, h: 2099 },
      { kind: 'video', src: V('saks-watermill-djing-clip'), poster: '/saks-watermill-video-poster.jpg', alt: 'DJ DX djing under a sailcloth tent at a Saks Fifth Avenue private estate event in Water Mill, New York', cap: 'Live on the decks' },
      { kind: 'img', src: '/saks-golden-hour-tent-water-mill-hamptons.jpg', alt: 'Golden-hour sailcloth tent reception at a Saks Fifth Avenue private estate event in Water Mill, New York', cap: 'Golden hour', credit: 'Linsey Kromer', w: 1400, h: 933 },
      { kind: 'img', src: '/saks-jared-lehr-showcase-water-mill-hamptons.jpg', alt: 'Jared Lehr jewelry showcase at a Saks Fifth Avenue private estate event in Water Mill, New York', cap: 'The Jared Lehr showcase', credit: 'Linsey Kromer', w: 1400, h: 934 },
      { kind: 'img', src: '/saks-tent-night-water-mill-hamptons.jpg', alt: 'Sailcloth tent lit up at night during a Saks Fifth Avenue private estate event in Water Mill, New York', cap: 'After dark', credit: 'Linsey Kromer', w: 1400, h: 934 },
    ],
  },
  {
    id: 'nautadutilh',
    date: 'June 2, 2026',
    title: 'NautaDutilh Reception',
    venue: '620 Loft & Garden',
    sub: "A 175-guest law firm reception on the rooftop at Rockefeller Center, St. Patrick's Cathedral behind the booth. DJ DX on the decks with Julie Schatz on live violin, cocktail hour through the after-party.",
    specs: [
      ['Client', 'NautaDutilh New York P.C.'],
      ['Venue', '620 Loft & Garden, Rockefeller Center'],
      ['Guests', '175'],
      ['Set', 'DJ with live violin, cocktail hour to after-party'],
    ],
    href: '/work/nautadutilh-620-loft-garden',
    hrefLabel: 'Read the NautaDutilh case study',
    media: [
      { kind: 'img', src: '/nautadutilh-violin-skyline-nyc.jpg', alt: "Live violin over the DJ set with the Manhattan skyline and St. Patrick's Cathedral, 620 Loft & Garden rooftop", cap: 'Live violin, skyline behind', w: 1600, h: 2133 },
      { kind: 'video', src: V('nautadutilh-rooftop-night-nyc'), poster: '/nautadutilh-rooftop-night-poster.jpg', alt: 'The rooftop setup at night, Manhattan skyline, NautaDutilh reception at 620 Loft & Garden', cap: 'After dark on the rooftop' },
      { kind: 'img', src: '/nautadutilh-dj-dx-620-loft-garden-nyc.jpg', alt: "DJ DX performing on the 620 Loft & Garden rooftop at Rockefeller Center, with St. Patrick's Cathedral behind", cap: 'DJ DX at the booth', w: 1600, h: 2133 },
      { kind: 'img', src: '/nautadutilh-dj-booth-cathedral-nyc.jpg', alt: "DJ DX at the booth during the NautaDutilh reception, with St. Patrick's Cathedral and the Manhattan skyline behind", cap: "St. Patrick's Cathedral", w: 1920, h: 720 },
    ],
  },
];
