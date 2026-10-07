import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import SiteNav from '../../components/SiteNav';
import SiteFooter from '../../components/SiteFooter';
import RelatedServices from '../../components/RelatedServices';
import ProcurementNote from '../../components/ProcurementNote';
import PollPromo from '../../components/PollPromo';
import StickyMobileCTA from '../../components/StickyMobileCTA';
import QuoteCalculator from '../../components/QuoteCalculator';
import BookingForm from '../../components/BookingForm';
import HeroPhotoSlideshow from '../../components/HeroPhotoSlideshow';
import { Link } from 'react-router-dom';
import ProofBlock, { ClientNames } from '../../components/ProofBlock';
import { CORP_PACKAGES } from '../../data/packages';
import AuthorBio from '../../components/AuthorBio';

// Client name for the most recent booking. Kept as a single constant so the
// showcase can be anonymised ("a national energy company") in one edit if the
// client's contract restricts vendor name use. Asset filenames deliberately do
// NOT contain the client name, so switching this needs no media changes.
const RECENT_CLIENT = 'LS Power';

// Real corporate event photos — add more here as they come in.
const CORPORATE_HERO_PHOTOS = [
  { src: '/nautadutilh-dj-booth-cathedral-nyc.jpg', alt: 'DJ DX at the DJ booth, NautaDutilh corporate reception rooftop, NYC skyline and St. Patrick\'s Cathedral' },
  { src: '/nautadutilh-julie-violin-cathedral-nyc.jpg', alt: 'Julie Schatz performing live violin, NautaDutilh rooftop reception, St. Patrick\'s Cathedral backdrop' },
  { src: '/nautadutilh-group-photo-cathedral-nyc.jpg', alt: 'NautaDutilh corporate reception guests, rooftop garden with St. Patrick\'s Cathedral and Manhattan skyline' },
];

// One list drives both the visible FAQ and the FAQPage schema, so they always match.
const CORP_FAQ = [
  { q: 'What makes DJ DX different from other corporate event DJs in NYC?', a: 'DJ DX brings 25+ years of professional experience, a TEDx performance credit, and 500+ events across New York, New Jersey, and Connecticut to every corporate booking. That means clean playlist curation, a professional MC voice, and the ability to read a room, moving from background music during networking to a full dance floor at the end of the night.' },
  { q: 'How much does a corporate event DJ cost in New York City?', a: 'Corporate event DJ pricing in NYC typically runs $2,800 to $8,000+ depending on hours, guest count, and add-ons like the Soul Shades violin duo. DJ DX corporate events start at $2,800, and you get an itemized quote within 24 hours. Send your date, venue, and guest count to bookings@djdxmusic.com.' },
  { q: 'How far ahead should we book a DJ for an office holiday party?', a: 'Book 90 to 120 days out if you can. December Thursdays, Fridays, and Saturdays in Manhattan are the first dates to go, and most of them are claimed in September and October. If your party is in December, check your date now.' },
  { q: 'Do you provide sound and microphones for speeches?', a: 'Yes. Every corporate booking includes professional sound sized to the room and a wireless microphone for speeches, toasts, and award announcements. DJ DX can also MC: introducing the CEO, calling award winners, and keeping the run of show on time.' },
  { q: 'Does DJ DX provide clean, work-appropriate playlists for corporate events?', a: 'Yes. Corporate sets use radio edits only, at a volume people can talk over during the reception, then build to a dance floor for the social part of the night. You can also send a do-not-play list, and it will be followed.' },
  { q: 'Are you insured?', a: 'Yes. A certificate of insurance (COI) is available for your venue and your risk team. Send the venue\'s requirements and the COI is issued to match.' },
  { q: 'How does billing work for companies?', a: 'Every booking has a written contract. A 50% deposit holds the date and the balance is due 14 days before the event. A W-9 is available on request so accounts payable can set DJ DX up as a vendor, and invoices go to whoever handles payment on your side.' },
  { q: 'What types of corporate events does DJ DX perform at?', a: 'Holiday parties, client events, galas, product launches, summer parties, retreats, and award nights across NYC, NJ, and CT. The Soul Shades violin and DJ duo is a popular upgrade for gala dinners and brand events.' },
  { q: 'Do you DJ corporate events in Brooklyn?', a: 'Yes. DJ DX is based in Brooklyn and plays corporate events across the borough, including DUMBO loft spaces, Brooklyn Navy Yard venues, Williamsburg rooftops, and Industry City. Load-in is planned ahead so there are no day-of surprises with freight elevators or load-in windows.' },
  { q: 'Do you DJ corporate events in Jersey City and Hoboken?', a: 'Yes. DJ DX was born and raised in Jersey City, and Jersey City and Hoboken are core service areas. Travel outside NYC is quoted up front as its own line, so the total is clear before you sign.' },
  { q: 'Do you travel to New Jersey and Connecticut?', a: 'Yes. DJ DX plays corporate events across New Jersey, Westchester, Long Island, and Connecticut, including Stamford and Greenwich. Travel outside NYC is quoted up front as its own line on your quote.' },
];


const CORP_SCHEMA = [
  {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Corporate Event DJ NYC, Brooklyn & Jersey City',
    serviceType: 'Corporate event DJ',
    url: 'https://djdxmusic.com/corporate-event-dj-nyc-nj-ct',
    description: 'Corporate event and office party DJ for holiday parties, client events, galas, product launches, summer parties, retreats, and award nights in NYC, Brooklyn, Jersey City, and the NY/NJ/CT region. Corporate events start at $2,800.',
    provider: { '@id': 'https://djdxmusic.com/#djdx' },
    areaServed: [
      { '@type': 'City', name: 'New York City' },
      { '@type': 'City', name: 'Manhattan' },
      { '@type': 'City', name: 'Brooklyn' },
      { '@type': 'City', name: 'Queens' },
      { '@type': 'City', name: 'Jersey City' },
      { '@type': 'City', name: 'Hoboken' },
      { '@type': 'AdministrativeArea', name: 'Westchester County' },
      { '@type': 'AdministrativeArea', name: 'Long Island' },
      { '@type': 'City', name: 'Stamford' },
      { '@type': 'City', name: 'Greenwich' },
      { '@type': 'State', name: 'New York' },
      { '@type': 'State', name: 'New Jersey' },
      { '@type': 'State', name: 'Connecticut' },
    ],
    offers: { '@type': 'Offer', price: '2800', priceCurrency: 'USD', description: 'Starting price for a corporate event DJ booking' },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Corporate DJ Packages',
      itemListElement: CORP_PACKAGES.map(t => ({
        '@type': 'Offer', name: `${t.name} Package`, priceCurrency: 'USD', price: String(t.price),
        priceSpecification: { '@type': 'PriceSpecification', minPrice: String(t.price), priceCurrency: 'USD' },
        description: `${t.hours}. ${t.includes.join('. ')}.`,
        itemOffered: { '@type': 'Service', name: `Corporate Event DJ, ${t.name}` },
      })),
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: CORP_FAQ.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
  },
  {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: `Corporate Event DJ Manhattan: ${RECENT_CLIENT} Office Party Highlights, Midtown NYC`,
    description: `Highlights from a September 2026 in-office corporate reception for ${RECENT_CLIENT} in Midtown Manhattan, with DJ DX on the decks and full DJ setup and sound brought into a corporate event space overlooking the NYC skyline.`,
    thumbnailUrl: 'https://djdxmusic.com/corporate-dj-manhattan-office-party-nyc-poster.jpg',
    uploadDate: '2026-09-14T12:00:00-04:00',
    duration: 'PT29S',
    contentUrl: 'https://djdxmusic.com/videos/corporate-dj-manhattan-office-party-nyc.mp4',
  },
  ...[
    ['Corporate Event DJ Manhattan: DJ DX at an in-office company party, Midtown NYC', 'corporate-dj-manhattan-office-party-nyc.jpg'],
    ['Corporate Event DJ Booth Setup: Manhattan Office Party, Midtown NYC', 'corporate-event-dj-booth-manhattan-nyc.jpg'],
    ['Manhattan Corporate Event Space with Skyline Views: Company Party, Midtown NYC', 'corporate-event-venue-manhattan-skyline-nyc.jpg'],
  ].map(([name, file]) => ({
    '@context': 'https://schema.org',
    '@type': 'ImageObject',
    name,
    contentUrl: `https://djdxmusic.com/${file}`,
    uploadDate: '2026-09-14T12:00:00-04:00',
  })),
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://djdxmusic.com/' },
      { '@type': 'ListItem', position: 2, name: 'Corporate Event DJ NYC NJ CT', item: 'https://djdxmusic.com/corporate-event-dj-nyc-nj-ct' },
    ],
  },
];

const EVENT_TYPES: { name: string; key: string; desc: string }[] = [
  { key: 'holiday', name: 'Holiday parties', desc: 'December office parties and year-end celebrations. See the office holiday party DJ page for dates and details.' },
  { key: 'client', name: 'Client events', desc: 'Receptions and appreciation nights where the music stays under the conversation.' },
  { key: 'gala', name: 'Galas', desc: 'Dinner sets, award walk-ups, and a dance floor after the program.' },
  { key: 'launch', name: 'Product launches', desc: 'Music timed to reveals and speakers, with a sound check before doors.' },
  { key: 'summer', name: 'Summer parties', desc: 'Rooftops, terraces, and outdoor company days.' },
  { key: 'retreat', name: 'Retreats', desc: 'Off-site evenings in Westchester, Connecticut, and beyond.' },
  { key: 'awards', name: 'Award nights', desc: 'Walk-up music, MC calls for each winner, and a clean run of show.' },
];

export default function Corporate() {
  // Always start at top on load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Helmet>
        <title>Corporate Event DJ NYC, Brooklyn &amp; Jersey City | DJ DX</title>
        <meta name="description" content="Corporate event and office party DJ for NYC, Brooklyn, Jersey City and the Tri-State. Law firm and luxury retail clients. COI and W-9 ready. Quote in 24 hours." />
        <link rel="canonical" href="https://djdxmusic.com/corporate-event-dj-nyc-nj-ct" />
        <meta property="og:title" content="Corporate Event DJ NYC, Brooklyn &amp; Jersey City | DJ DX" />
        <meta property="og:description" content="Corporate event and office party DJ for NYC, Brooklyn, Jersey City and the Tri-State. Law firm and luxury retail clients. COI and W-9 ready. Quote in 24 hours." />
        <meta property="og:url" content="https://djdxmusic.com/corporate-event-dj-nyc-nj-ct" />
        <meta property="og:image" content="https://djdxmusic.com/latest-corporate-hero.jpg" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@djdxmusic" />
        <meta name="twitter:title" content="Corporate Event DJ NYC, Brooklyn &amp; Jersey City | DJ DX" />
        <meta name="twitter:description" content="Corporate event and office party DJ for NYC, Brooklyn, Jersey City and the Tri-State. COI and W-9 ready. Quote in 24 hours." />
        <meta name="twitter:image" content="https://djdxmusic.com/latest-corporate-hero.jpg" />
        <script type="application/ld+json">{JSON.stringify(CORP_SCHEMA)}</script>
      </Helmet>

      <SiteNav />

      {/* ── HERO ── */}
      <section className="epk-hero" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
        <div className="epk-hero-bg" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
          <HeroPhotoSlideshow photos={CORPORATE_HERO_PHOTOS} />
        </div>
        <div className="epk-hero-overlay" style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          background: 'radial-gradient(circle at bottom right, rgba(12,12,12,1) 0%, rgba(12,12,12,1) 8%, transparent 20%), linear-gradient(to bottom, rgba(12,12,12,0.1) 0%, rgba(12,12,12,0.95) 100%), radial-gradient(circle at 50% 30%, rgba(235, 191, 109, 0.2) 0%, transparent 60%)'
        }} />

        <div className="section-inner" style={{ position: 'relative', zIndex: 10, textAlign: 'center' }}>
          <div className="sec-overline" style={{ justifyContent: 'center' }}>
            <span className="sec-label">Corporate Entertainment</span>
          </div>
          <h1 className="epk-title" style={{ fontSize: 'var(--text-6xl)', marginBottom: '1rem' }}>
            Corporate Event DJ in NYC, Brooklyn and Jersey City
          </h1>
          <p className="epk-lead" style={{ maxWidth: '600px', margin: '0 auto', fontSize: 'var(--text-lg)' }}>
            DJ DX is a corporate event DJ for office parties, client events, and galas in NYC, Brooklyn, Jersey City,
            and across New York, New Jersey, and Connecticut. Clean sets, a clear MC voice, and paperwork your finance
            team can approve. Corporate events start at $2,800.
          </p>
          <div style={{ marginTop: '2rem' }}>
            <a href="#booking" className="btn-gold">Request Quote</a>
          </div>
        </div>
      </section>

      {/* ── THE DIFFERENCE ── */}
      <section className="about">
        <div className="section-inner">
          <div className="about-layout">
            <div>
              <div className="sec-header sr" data-sr-delay="0s">
                <div className="sec-overline">
                  <span className="sec-label">Why DJ DX / Soul Shades?</span>
                </div>
                <h2 className="sec-title">The Corporate <span>Standard</span></h2>
              </div>
              <div className="about-body sr" data-sr-delay="0.12s">
                <p>
                  Hiring a corporate event DJ in NYC is different from booking a club night or a wedding. A good corporate party DJ keeps the
                  volume right for networking, follows your run of show, and handles speeches and awards without fuss, then opens up a
                  dance floor when the room is ready.
                </p>
                <p>
                  <strong>No cheesy gimmicks, no inappropriate playlists.</strong> Whether you book DJ DX individually or the high-energy live DJ/Producer duo Soul Shades, expect music chosen for your crowd and your brand: easy background music during dinner and cocktails, then a packed dance floor to close out the night.
                </p>
                <p>
                  DJ DX has been DJing since 1998, with 500+ events across the NYC, NJ, and CT tri-state area, a TEDxYouth@RVA performance, and features in Disrupt Magazine and NJ.com.
                </p>
                <p>
                  Recent booking: the <strong>NautaDutilh</strong> reception at <strong>620 Loft &amp; Garden</strong>, a rooftop garden space overlooking St. Patrick's Cathedral and the Rockefeller Center skyline. 175 guests, full evening coverage from cocktail hour through the after-party — DJ DX on the decks with Soul Shades violinist Julie Schatz layering live strings over the set.
                </p>
              </div>
            </div>

            <div className="about-aside">
              <div className="stat-row sr" data-sr-delay="0.05s">
                <div className="stat-meta">
                  <div className="stat-label" style={{ color: 'var(--gold)' }}>Clean Corporate Playlists</div>
                  <div className="stat-sub">Radio-edited, HR-approved music that keeps the dance floor packed while staying appropriate for the workplace.</div>
                </div>
              </div>
              <div className="stat-row sr" data-sr-delay="0.15s">
                <div className="stat-meta">
                  <div className="stat-label" style={{ color: 'var(--gold)' }}>MC Duties & Announcements</div>
                  <div className="stat-sub">Need someone to announce awards or introduce the CEO? We handle all MC duties with a clear, professional voice.</div>
                </div>
              </div>
              <div className="stat-row sr" data-sr-delay="0.25s">
                <div className="stat-meta">
                  <div className="stat-label" style={{ color: 'var(--gold)' }}>Premium Sound & Lighting</div>
                  <div className="stat-sub">We provide full-scale audio and lighting add-ons tailored to your venue size, ensuring a pristine auditory and visual experience without the hassle of third-party rentals.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── EVENT TYPES ── */}
      <section style={{ padding: '72px 24px' }}>
        <div className="section-inner" style={{ maxWidth: '1000px' }}>
          <div className="sec-overline" style={{ justifyContent: 'center' }}>
            <span className="sec-overline-line" /><span className="sec-label">Event Types</span><span className="sec-overline-line" />
          </div>
          <h2 className="sec-title" style={{ textAlign: 'center', marginBottom: '28px' }}>
            Corporate Events <span>DJ DX Plays</span>
          </h2>
          <ul className="lp-list">
            {EVENT_TYPES.map(t => (
              <li key={t.key}>
                <strong>{t.name}</strong>{' '}
                {t.key === 'holiday'
                  ? <>December office parties and year-end celebrations. See the <Link to="/holiday-party-dj-nyc-nj-ct">office holiday party DJ</Link> page for dates and details.</>
                  : t.desc}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── PACKAGES ── */}
      <section style={{ padding: '72px 24px', background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(201,168,76,0.12)', borderBottom: '1px solid rgba(201,168,76,0.12)' }} id="packages">
        <div className="section-inner" style={{ maxWidth: '1100px' }}>
          <div className="sec-overline" style={{ justifyContent: 'center' }}>
            <span className="sec-overline-line" /><span className="sec-label">Packages</span><span className="sec-overline-line" />
          </div>
          <h2 className="sec-title" style={{ textAlign: 'center', marginBottom: '12px' }}>
            Corporate DJ <span>Packages</span>
          </h2>
          <p style={{ textAlign: 'center', color: 'rgba(242,242,242,0.62)', maxWidth: '680px', margin: '0 auto 40px', fontSize: '1rem', lineHeight: 1.7 }}>
            Starting prices for New York City. Travel outside NYC is quoted up front as its own line. Every package comes with a written contract.
          </p>
          <div className="pkg-grid">
            {CORP_PACKAGES.map(t => (
              <div className="pkg" key={t.name}>
                <div className="pkg-name">{t.name}</div>
                <div className="pkg-price">From ${t.price.toLocaleString('en-US')}{t.name === 'Production' ? '+' : ''}</div>
                <div className="pkg-hours">{t.hours}</div>
                <p className="pkg-blurb">{t.blurb}</p>
                <ul className="pkg-list">{t.includes.map(i => <li key={i}>{i}</li>)}</ul>
                <a href="#booking" className="btn-gold pkg-cta">Check My Date</a>
              </div>
            ))}
          </div>
          <p style={{ textAlign: 'center', color: 'rgba(242,242,242,0.55)', margin: '28px auto 0', fontSize: '0.92rem', lineHeight: 1.7, maxWidth: '680px' }}>
            Not sure which fits? <a href="#quote-calculator" style={{ color: 'var(--gold)' }}>Get an instant starting price</a> or
            send your date and headcount and you will have a quote within 24 hours. Planners and agencies: see the <Link to="/planners" style={{ color: 'var(--gold)' }}>planner page</Link> for the stage plot, input list and paperwork.
          </p>
        </div>
      </section>

      {/* ── RECENT BOOKING SHOWCASE ── */}
      {/* ── MOST RECENT BOOKING — Manhattan corporate office reception ── */}
      <section style={{ padding: '80px 24px', background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(201,168,76,0.12)', borderBottom: '1px solid rgba(201,168,76,0.12)' }}>
        <div className="section-inner" style={{ maxWidth: '1100px' }}>
          <div className="sec-overline" style={{ justifyContent: 'center' }}>
            <span className="sec-overline-line" />
            <span className="sec-label">Most Recent Booking</span>
            <span className="sec-overline-line" />
          </div>
          <h2 className="sec-title" style={{ textAlign: 'center', marginBottom: '12px' }}>
            {RECENT_CLIENT} — <span>Corporate Office Party, Midtown Manhattan</span>
          </h2>
          <p style={{ textAlign: 'center', color: 'rgba(242,242,242,0.62)', maxWidth: '720px', margin: '0 auto 48px', fontSize: '1rem', lineHeight: 1.7 }}>
            September 2026 — an in-office corporate reception for {RECENT_CLIENT} in Midtown Manhattan, held in their own floor-to-ceiling-window event space overlooking the city. Full DJ setup and sound brought into a working office: cocktail-hour house and soul early, building into an open dance floor as the room filled.
          </p>

          <div className="cb-hero-shot cb-hero-shot--tall sr" data-sr-delay="0s">
            <img
              src="/corporate-dj-manhattan-office-party-nyc.jpg"
              alt="Corporate event DJ in Manhattan — DJ DX on the decks at an in-office company party in Midtown NYC, skyline windows behind the booth"
              loading="lazy"
            />
            <span className="cb-hero-tag">Midtown Manhattan — NYC</span>
          </div>

          <div className="cb-gallery">
            <div className="cb-shot cb-shot--vertical-video sr" data-sr-delay="0.05s">
              <video
                src="/videos/corporate-dj-manhattan-office-party-nyc.mp4"
                poster="/corporate-dj-manhattan-office-party-nyc-poster.jpg"
                controls
                playsInline
                preload="none"
                aria-label={`Corporate event DJ Manhattan — highlights from the ${RECENT_CLIENT} office party in Midtown NYC`}
              />
            </div>
            <div className="cb-shot sr" data-sr-delay="0.1s">
              <img
                src="/corporate-event-dj-booth-manhattan-nyc.jpg"
                alt="Corporate event DJ booth setup for a Manhattan office party — DJ DX behind the decks in a Midtown NYC corporate event space"
                loading="lazy"
              />
            </div>
            <div className="cb-shot sr" data-sr-delay="0.15s">
              <img
                src="/corporate-event-venue-manhattan-skyline-nyc.jpg"
                alt="Manhattan corporate event space with skyline views set up for a company party with DJ sound and lighting, Midtown NYC"
                loading="lazy"
              />
            </div>
          </div>

          {/* Client testimonial. Attributed by role, not by name, at the
              client's preference — see RECENT_CLIENT note above. */}
          <div className="cb-quotes cb-quotes--single">
            <div className="cb-quote sr" data-sr-delay="0.05s">
              <span className="cb-quote-mark" aria-hidden="true">&ldquo;</span>
              <p className="cb-quote-text">
                The music selection was well suited for the event, you read the crowd perfectly, and everyone had a great time.
              </p>
              <div className="cb-quote-name">
                Senior Office Manager<span> — {RECENT_CLIENT}</span>
              </div>
            </div>
          </div>

          <h3 style={{ textAlign: 'center', fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1.45rem', fontWeight: 800, color: 'var(--white)', margin: '56px 0 12px' }}>
            Booking a Corporate Holiday Party DJ in NYC for {new Date().getFullYear()}
          </h3>
          <p style={{ textAlign: 'center', color: 'rgba(242,242,242,0.62)', maxWidth: '720px', margin: '0 auto', fontSize: '0.98rem', lineHeight: 1.75 }}>
            Most corporate planners lock in holiday party entertainment 90 to 120 days out, which means December dates in Manhattan get claimed through September and October. If you are planning an office holiday party, a year-end client reception, or a company celebration anywhere in NYC, New Jersey, or Connecticut, the earlier you reach out the more likely your date is still open. Full details, pricing, and December availability are on the <a href="/holiday-party-dj-nyc-nj-ct" style={{ color: 'var(--gold)' }}>holiday party DJ page</a>.
          </p>
        </div>
      </section>

      <section style={{ padding: '80px 24px', background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(201,168,76,0.12)', borderBottom: '1px solid rgba(201,168,76,0.12)' }}>
        <div className="section-inner" style={{ maxWidth: '1100px' }}>
          <div className="sec-overline" style={{ justifyContent: 'center' }}>
            <span className="sec-overline-line" />
            <span className="sec-label">Recent Booking</span>
            <span className="sec-overline-line" />
          </div>
          <h2 className="sec-title" style={{ textAlign: 'center', marginBottom: '12px' }}>
            NautaDutilh Reception — <span>620 Loft &amp; Garden</span>
          </h2>
          <p style={{ textAlign: 'center', color: 'rgba(242,242,242,0.62)', maxWidth: '680px', margin: '0 auto 48px', fontSize: '1rem', lineHeight: 1.7 }}>
            June 2026 — a 175-guest rooftop reception for the international law firm NautaDutilh, steps from Rockefeller Center with St. Patrick's Cathedral as the backdrop.
          </p>

          <div className="cb-hero-shot sr" data-sr-delay="0s">
            <img
              src="/nautadutilh-violin-skyline-nyc.jpg"
              alt="Live violin and DJ duo performance with Manhattan skyline and St. Patrick's Cathedral, 620 Loft & Garden rooftop, NYC"
              loading="lazy"
            />
            <span className="cb-hero-tag">620 Loft &amp; Garden — NYC</span>
          </div>

          <div className="cb-gallery">
            <div className="cb-shot sr" data-sr-delay="0.05s">
              <video
                src="/videos/nautadutilh-rooftop-night-nyc.mp4"
                poster="/nautadutilh-rooftop-night-poster.jpg"
                autoPlay
                muted
                loop
                playsInline
                aria-label="DJ DX rooftop setup at night, Manhattan skyline, NautaDutilh reception at 620 Loft & Garden"
              />
            </div>
            <div className="cb-shot sr" data-sr-delay="0.1s">
              <img
                src="/nautadutilh-dj-dx-620-loft-garden-nyc.jpg"
                alt="DJ DX performing at the NautaDutilh corporate reception, 620 Loft & Garden rooftop, NYC, with St. Patrick's Cathedral in the background"
                loading="lazy"
              />
            </div>
            <div className="cb-shot sr" data-sr-delay="0.15s">
              <img
                src="/nautadutilh-soul-shades-violin-nyc.jpg"
                alt="Soul Shades violinist Julie Schatz performing live at the NautaDutilh rooftop reception, 620 Loft & Garden, NYC"
                loading="lazy"
              />
            </div>
          </div>

          <p className="duo-pointer">
            This booking was Soul Shades, the DJ and live violin duo.{' '}
            <a href="/soul-shades">See what NautaDutilh said about the duo</a>.
          </p>
        </div>
      </section>

      {/* ── CASE STUDY PLACEHOLDER: Saks Fifth Avenue, Water Mill ──
          Pending client permission. Do not publish until Saks approves use of
          its name. When approved, build as a section like the ones above:
            Event type: luxury retail client event
            Setting: garden event, Water Mill (Hamptons), NY
            Talent: solo DJ (DJ DX)
            Length: 3-hour garden event
            Media: embedded vertical video (add the file under /public/videos/
            and use the cb-shot--vertical-video layout)
          [SAKS CASE STUDY: fill in once permission is confirmed] */}

      {/* ── VENUES & INDUSTRIES ── */}
      <section style={{ padding: '80px 24px', background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(201,168,76,0.12)', borderBottom: '1px solid rgba(201,168,76,0.12)' }}>
        <div className="section-inner" style={{ maxWidth: '1100px' }}>
          <div className="sec-overline" style={{ justifyContent: 'center' }}>
            <span className="sec-overline-line" />
            <span className="sec-label">Venues & Industries</span>
            <span className="sec-overline-line" />
          </div>
          <h2 className="sec-title" style={{ textAlign: 'center', marginBottom: '12px' }}>
            Where DJ DX <span>Performs</span>
          </h2>
          <p style={{ textAlign: 'center', color: 'rgba(242,242,242,0.62)', maxWidth: '720px', margin: '0 auto 56px', fontSize: '1rem', lineHeight: 1.7 }}>
            Two decades of corporate work across the tri-state means familiarity with the venues, AV teams, and production cadences planners already know.
          </p>

          <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1.15rem', fontWeight: 700, color: 'var(--gold)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '14px', textAlign: 'center' }}>
            Service Areas
          </h3>
          <ul className="lp-list" style={{ marginBottom: '24px' }}>
            <li><strong>Manhattan:</strong> Midtown, Downtown, Chelsea, and rooftop venues across the island.</li>
            <li><strong><Link to="/corporate-event-dj-brooklyn-ny">Brooklyn</Link>:</strong> DUMBO, Williamsburg, Navy Yard, and Industry City. DJ DX is based here.</li>
            <li><strong>Queens:</strong> Long Island City and waterfront event spaces.</li>
            <li><strong><Link to="/corporate-event-dj-jersey-city-nj">Jersey City</Link>:</strong> Downtown, Newport, and Exchange Place. DJ DX was born and raised here.</li>
            <li><strong>Hoboken:</strong> waterfront and hotel event spaces.</li>
            <li><strong>Westchester:</strong> offices, hotels, and retreat venues.</li>
            <li><strong>Long Island:</strong> corporate campuses, hotels, and summer events.</li>
            <li><strong>Connecticut:</strong> Stamford, Greenwich, and the Gold Coast.</li>
          </ul>
          <ClientNames />
          <div style={{ marginBottom: '48px' }} />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px', marginBottom: '48px' }}>
            <div>
              <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1.15rem', fontWeight: 700, color: 'var(--gold)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '14px' }}>
                Manhattan Venues
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: 'rgba(242,242,242,0.72)', fontSize: '0.95rem', lineHeight: 2 }}>
                <li>Pier Sixty &amp; Pier 61 (Chelsea Piers)</li>
                <li>Cipriani — Wall Street, 25 Broadway, 42nd</li>
                <li>Tribeca Rooftop</li>
                <li>Edison Ballroom</li>
                <li>The Plaza Hotel</li>
                <li>620 Loft &amp; Garden</li>
                <li>Brooklyn Navy Yard event spaces</li>
              </ul>
            </div>
            <div>
              <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1.15rem', fontWeight: 700, color: 'var(--gold)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '14px' }}>
                NJ &amp; CT Venues
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: 'rgba(242,242,242,0.72)', fontSize: '0.95rem', lineHeight: 2 }}>
                <li>Maritime Parc — Jersey City</li>
                <li>Liberty House — Jersey City</li>
                <li>The Newark Club</li>
                <li>Stamford Hilton &amp; Marriott</li>
                <li>Greenwich Country Club</li>
                <li>Hoboken waterfront spaces</li>
                <li>Bergen County corporate campuses</li>
              </ul>
            </div>
            <div>
              <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1.15rem', fontWeight: 700, color: 'var(--gold)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '14px' }}>
                Industries Served
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: 'rgba(242,242,242,0.72)', fontSize: '0.95rem', lineHeight: 2 }}>
                <li>Finance &amp; investment banking</li>
                <li>Tech &amp; SaaS product launches</li>
                <li>Fashion &amp; lifestyle activations</li>
                <li>Hospitality &amp; hotel openings</li>
                <li>Law firms &amp; consulting partners</li>
                <li>Non-profits &amp; foundation galas</li>
                <li>Media, agencies &amp; publishing</li>
              </ul>
            </div>
          </div>

          <div style={{ textAlign: 'center', padding: '32px', background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.22)', borderRadius: '10px' }}>
            <div style={{ fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '14px', fontWeight: 700 }}>
              What's Included
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px', textAlign: 'left' }}>
              {[
                { label: 'Full DJ rig', desc: 'Pioneer / Rane setup, professional mixer, backup gear on-site.' },
                { label: 'PA & monitors', desc: 'QSC or comparable line array sized to room and headcount.' },
                { label: 'MC services', desc: 'Award announcements, speaker intros, run-of-show calls.' },
                { label: 'Set planning call', desc: 'Walkthrough of timeline, do-not-play list, energy curve.' },
                { label: 'Insurance', desc: 'COI provided for any venue that requires it.' },
                { label: 'Soul Shades upgrade', desc: 'Add live violin / live producer duo for galas.' },
              ].map(item => (
                <div key={item.label}>
                  <div style={{ color: 'var(--white)', fontWeight: 700, fontSize: '0.95rem', marginBottom: '4px' }}>{item.label}</div>
                  <div style={{ color: 'rgba(242,242,242,0.55)', fontSize: '0.85rem', lineHeight: 1.6 }}>{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ padding: '80px 40px' }}>
        <div className="section-inner" style={{ maxWidth: '760px' }}>
          <div className="sec-header center sr">
            <h2 className="sec-title">Corporate DJ <span>FAQ</span></h2>
          </div>
          <div style={{ marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {CORP_FAQ.map(({ q, a }) => (
              <div key={q} style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', paddingBottom: '20px' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--white)', marginBottom: '8px' }}>{q}</h3>
                <p style={{ fontSize: '0.92rem', color: 'rgba(242,242,242,0.58)', lineHeight: 1.7 }}>{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BOOKING ── */}
      <PollPromo />
      <ProcurementNote heading="Working with procurement and AP" />

      <ProofBlock />
      <AuthorBio />

      <section className="booking" id="booking">
        <div className="section-inner">
          <div className="booking-layout">
            <div className="booking-left sr" data-sr-delay="0s">
              <div className="sec-overline">
                <span className="sec-label">Bookings</span>
              </div>
              <h2 className="booking-big-title">
                Secure Your Date<br />in the <span>Tri-State</span>
              </h2>
              <p className="booking-blurb">
                Whether you're planning a massive product launch in Manhattan, an executive retreat in Connecticut, or a holiday gala in New Jersey, fill out the form and you will hear back within 24 hours with availability and pricing.
              </p>
              <p className="booking-blurb"><a href="#quote-calculator" style={{ color: 'var(--gold)' }}>Want a number first? Get an instant starting price</a></p>
            </div>

            <div className="booking-right sr" data-sr-delay="0.15s">
              <BookingForm initial={{ eventType: 'Corporate Event / Holiday Party' }} />
            </div>
          </div>
        </div>
      </section>

      <QuoteCalculator formName="corporate" defaultEvent="corporate" />
      <RelatedServices />
      <StickyMobileCTA formName="corporate_sticky" label="Check My Date" />
      <SiteFooter />
    </>
  );
}
