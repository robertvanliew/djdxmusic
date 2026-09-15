import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import SiteNav from '../../components/SiteNav';
import SiteFooter from '../../components/SiteFooter';
import RelatedServices from '../../components/RelatedServices';
import BookingForm from '../../components/BookingForm';

/*
 * Event DJ pricing report for the NYC tri-state market.
 *
 * Deliberately scoped to NON-wedding event types (corporate, private party,
 * Sweet 16, duo acts, destination) so it does not cannibalise
 * /wedding-dj-cost-nyc, which already ranks around position 9 for wedding
 * cost queries. Weddings get a one-line summary here and an internal link.
 *
 * Every published figure is either (a) DJ DX's own rate from
 * public/pricing.txt — keep the two in sync — or (b) third-party market data
 * with an attributed source. Do not add unsourced market claims.
 */

const LAST_UPDATED = 'September 15, 2026';

const RATE_TABLE = [
  { type: 'Corporate event / holiday party', djdx: '$2,800', market: '$1,500 – $5,000', note: 'Galas, office parties, brand activations, product launches' },
  { type: 'Private party (birthday, anniversary)', djdx: '$2,200', market: '$1,200 – $3,500', note: 'Milestone celebrations, house parties' },
  { type: 'Sweet 16 / Quinceañera / Mitzvah', djdx: '$1,500', market: '$1,000 – $3,000', note: 'Often shorter runtimes and earlier start times' },
  { type: 'DJ + live violin duo (Soul Shades)', djdx: '$2,400', market: 'Rarely published', note: 'Live strings over the DJ set — ceremony, cocktail hour, reception' },
  { type: 'Hamptons / destination', djdx: '$3,000', market: 'Custom-quoted', note: 'Travel, lodging, and technical riders coordinated separately' },
  { type: 'Wedding', djdx: '$2,800', market: '$2,000 – $4,000', note: 'See the dedicated wedding cost breakdown' },
];

const COST_DRIVERS = [
  { h: 'Date and season', p: 'A Saturday in peak season costs more than a Thursday in February — the same DJ, the same hours. December corporate dates and May–October Saturdays are the first to go, and they carry the least negotiating room.' },
  { h: 'Total hours on site', p: 'Most quotes assume four to five hours of performance. Ceremony coverage, an extended cocktail hour, or an after-party each add real time — and setup and breakdown are typically two to three hours on top of the hours you actually see.' },
  { h: 'Sound and coverage areas', p: 'One room needs one system. A ceremony outside, cocktails on a terrace, and dinner indoors is three zones, which means more speakers, more wiring, and often a second setup entirely.' },
  { h: 'Travel and load-in', p: 'Manhattan load-ins with no freight elevator, permit parking, or union venue rules cost more than a suburban ballroom with a loading dock. Distance matters less than access.' },
  { h: 'Add-ons', p: 'Live musicians, uplighting, extra wireless mics, and dance-floor lighting are priced separately. Live violin, for example, runs from $150/hour on top of the DJ package.' },
  { h: 'Who actually shows up', p: 'Agencies book the brand, then assign whichever DJ is free. Booking a DJ directly costs more per hour in some cases, but the person you heard and vetted is the person behind the decks.' },
];

const FAQ_ITEMS = [
  {
    q: 'How much does an event DJ cost in NYC?',
    a: 'Professional event DJs in New York City generally range from $1,500 to $5,000 depending on event type, total hours, and the number of sound zones required. That sits well above The Knot\'s national average of $1,800 for a wedding DJ, because NYC carries higher labour, travel, insurance, and venue-access costs. DJ DX publishes fixed starting rates: corporate events from $2,800, private parties from $2,200, and Sweet 16s from $1,500.',
  },
  {
    q: 'Why do NYC DJs cost more than the national average?',
    a: 'The Knot\'s Real Weddings Study, based on more than 10,000 US couples, puts the national average wedding DJ at $1,800, with most couples paying $1,000 to $2,500. Established New York City professionals typically quote $2,000 to $4,000 instead. The gap comes from venue access rules, union and freight-elevator requirements, parking and permits, liability insurance minimums that many Manhattan venues mandate, and the simple cost of operating in the market.',
  },
  {
    q: 'What should a DJ quote include before you compare prices?',
    a: 'Compare like for like. A quote should state performance hours, setup and breakdown time, how many sound zones are covered, what equipment is included, whether wireless microphones and MC announcements are part of the package, whether backup equipment is on site, and whether liability insurance and a COI for the venue are provided. Two quotes $1,000 apart often cover different things entirely.',
  },
  {
    q: 'When should you book an event DJ in NYC?',
    a: 'For December corporate holiday parties, most planners lock entertainment 90 to 120 days ahead, which means Manhattan dates are largely claimed through September and October. Peak-season Saturday weddings are commonly booked 9 to 12 months out. Off-peak weekday events can often be arranged with a few weeks of notice.',
  },
  {
    q: 'Is it cheaper to book through an agency or directly?',
    a: 'Agencies add a margin on top of the performer fee, so the same DJ booked directly is often less expensive. The larger difference is not price but certainty: agencies typically reserve the right to substitute performers, so the DJ you auditioned may not be the DJ who arrives. Booking directly means the person you vetted is the person who performs.',
  },
];

export default function EventDJCost() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <>
      <Helmet>
        <title>Event DJ Cost in NYC, NJ &amp; CT: Real 2026 Prices | DJ DX</title>
        <meta name="description" content="What event DJs actually cost in NYC, New Jersey, and Connecticut in 2026. Real published rates by event type, what drives the price, and how NYC compares to the national average. Corporate from $2,800, private parties from $2,200." />
        <link rel="canonical" href="https://djdxmusic.com/event-dj-cost-nyc-nj-ct" />
        <meta property="og:title" content="Event DJ Cost in NYC, NJ & CT: Real 2026 Prices" />
        <meta property="og:description" content="Published rates by event type, the factors that actually move a DJ quote, and how New York City pricing compares to the national average." />
        <meta property="og:url" content="https://djdxmusic.com/event-dj-cost-nyc-nj-ct" />
        <meta property="og:image" content="https://djdxmusic.com/epk-hero.jpg" />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@djdxmusic" />
        <meta name="twitter:title" content="Event DJ Cost in NYC, NJ & CT: Real 2026 Prices" />
        <meta name="twitter:description" content="Published event DJ rates for the New York tri-state market, plus what actually drives a quote." />
        <meta name="twitter:image" content="https://djdxmusic.com/epk-hero.jpg" />
        <script type="application/ld+json">
          {`[
            {
              "@context": "https://schema.org",
              "@type": "Article",
              "headline": "Event DJ Cost in NYC, NJ & CT: Real 2026 Prices",
              "description": "A pricing reference for event DJ services across New York City, New Jersey, and Connecticut — published starting rates by event type, the factors that move a quote, and how the New York market compares to the national average.",
              "datePublished": "2026-09-15",
              "dateModified": "2026-09-15",
              "url": "https://djdxmusic.com/event-dj-cost-nyc-nj-ct",
              "image": "https://djdxmusic.com/epk-hero.jpg",
              "author": {
                "@type": "Person",
                "name": "Robert Van Liew",
                "alternateName": "DJ DX",
                "jobTitle": "DJ, Producer and Recording Artist",
                "description": "Professional DJ since 1998 with 500+ events performed across New York, New Jersey, and Connecticut. Featured performer at TEDxYouth@RVA 2022.",
                "url": "https://djdxmusic.com/",
                "sameAs": [
                  "https://www.ted.com/talks/dj_dx_finally_moving",
                  "https://voyageatl.com/interview/life-work-with-robert-van-liew-of-national/",
                  "https://www.wikidata.org/wiki/Q17579958",
                  "https://musicbrainz.org/artist/8a6ee50a-8713-4828-a42f-8aa8f9579d6b"
                ]
              },
              "publisher": {
                "@type": "Organization",
                "name": "DJ DX",
                "url": "https://djdxmusic.com/"
              },
              "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": "https://djdxmusic.com/event-dj-cost-nyc-nj-ct"
              },
              "citation": [
                {
                  "@type": "CreativeWork",
                  "name": "The Knot Real Weddings Study — average wedding band and DJ cost",
                  "url": "https://www.theknot.com/content/average-cost-wedding-band-dj"
                }
              ]
            },
            {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                ${FAQ_ITEMS.map(f => `{
                  "@type": "Question",
                  "name": ${JSON.stringify(f.q)},
                  "acceptedAnswer": {"@type": "Answer", "text": ${JSON.stringify(f.a)}}
                }`).join(',\n                ')}
              ]
            },
            {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              "itemListElement": [
                {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://djdxmusic.com/"},
                {"@type": "ListItem", "position": 2, "name": "Event DJ Cost NYC NJ CT", "item": "https://djdxmusic.com/event-dj-cost-nyc-nj-ct"}
              ]
            }
          ]`}
        </script>
      </Helmet>

      <SiteNav />

      {/* ── HERO / DIRECT ANSWER ── */}
      <section style={{ minHeight: '46vh', display: 'flex', alignItems: 'center', background: 'var(--dark)', padding: '128px 24px 56px' }}>
        <div className="section-inner" style={{ textAlign: 'center', maxWidth: '860px' }}>
          <div className="sec-overline" style={{ justifyContent: 'center' }}>
            <span className="sec-overline-line" />
            <span className="sec-label">2026 Pricing Report</span>
            <span className="sec-overline-line" />
          </div>
          <h1 className="sec-title" style={{ fontSize: 'clamp(1.9rem, 4.6vw, 3.2rem)', marginBottom: '1.25rem' }}>
            What Event DJs Actually Cost in <span>NYC, NJ &amp; CT</span>
          </h1>
          {/* Direct answer in the first ~60 words — the block most likely to be
              lifted into an AI Overview or featured snippet. */}
          <p style={{ fontSize: '1.08rem', color: 'rgba(242,242,242,0.78)', lineHeight: 1.75, marginBottom: '1.25rem' }}>
            Professional event DJs in the New York tri-state area generally cost <strong style={{ color: 'var(--white)' }}>$1,500 to $5,000</strong>, depending on event type, total hours, and how many sound zones the venue needs. That is above the national average because New York carries higher labour, insurance, and venue-access costs.
          </p>
          <p style={{ fontSize: '0.92rem', color: 'rgba(242,242,242,0.5)', lineHeight: 1.7 }}>
            Published by DJ DX (Robert Van Liew), professional DJ since 1998.<br />
            Last updated {LAST_UPDATED}.
          </p>
        </div>
      </section>

      {/* ── RATE TABLE ── */}
      <section style={{ padding: '72px 24px', background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(201,168,76,0.12)', borderBottom: '1px solid rgba(201,168,76,0.12)' }}>
        <div className="section-inner" style={{ maxWidth: '1000px' }}>
          <h2 className="sec-title" style={{ textAlign: 'center', marginBottom: '12px' }}>
            Event DJ Rates by <span>Event Type</span>
          </h2>
          <p style={{ textAlign: 'center', color: 'rgba(242,242,242,0.6)', maxWidth: '680px', margin: '0 auto 36px', fontSize: '0.98rem', lineHeight: 1.7 }}>
            The left column is what DJ DX publishes as a starting rate. The right column is the broader range seen across established professionals in this market. All figures are floors, not final quotes.
          </p>

          <div style={{ overflowX: 'auto' }}>
            <table className="cost-table">
              <thead>
                <tr>
                  <th>Event type</th>
                  <th>DJ DX from</th>
                  <th>NYC market range</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {RATE_TABLE.map(r => (
                  <tr key={r.type}>
                    <td data-label="Event type"><strong>{r.type}</strong></td>
                    <td data-label="DJ DX from" style={{ color: 'var(--gold)', fontWeight: 700, whiteSpace: 'nowrap' }}>{r.djdx}</td>
                    <td data-label="NYC market range" style={{ whiteSpace: 'nowrap' }}>{r.market}</td>
                    <td data-label="Notes" style={{ color: 'rgba(242,242,242,0.6)' }}>{r.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.92rem', color: 'rgba(242,242,242,0.55)' }}>
            Planning a wedding specifically? See the{' '}
            <Link to="/wedding-dj-cost-nyc" style={{ color: 'var(--gold)' }}>full NYC wedding DJ cost breakdown</Link>.
          </p>
        </div>
      </section>

      {/* ── NYC VS NATIONAL ── */}
      <section style={{ padding: '72px 24px', background: 'var(--dark)' }}>
        <div className="section-inner" style={{ maxWidth: '760px' }}>
          <h2 className="sec-title" style={{ marginBottom: '20px' }}>
            Why New York Costs More Than the <span>National Average</span>
          </h2>
          {/* Self-contained ~150-word citable block with an attributed source. */}
          <p style={{ color: 'rgba(242,242,242,0.72)', lineHeight: 1.8, fontSize: '1rem', marginBottom: '18px' }}>
            The Knot&apos;s Real Weddings Study, based on responses from more than 10,000 US couples, puts the national average wedding DJ at <strong style={{ color: 'var(--white)' }}>$1,800</strong>, with most couples paying between $1,000 and $2,500. Established professionals in New York City typically quote <strong style={{ color: 'var(--white)' }}>$2,000 to $4,000</strong> instead — roughly 25% to 100% higher.
          </p>
          <p style={{ color: 'rgba(242,242,242,0.72)', lineHeight: 1.8, fontSize: '1rem', marginBottom: '18px' }}>
            The difference is not margin. It is venue access rules, freight elevators and union load-in requirements, parking and permits, the liability insurance and certificates of insurance that most Manhattan venues mandate before a vendor may enter the building, and the cost of storing and transporting equipment in a city where storage is expensive and parking is not guaranteed.
          </p>
          <p style={{ fontSize: '0.86rem', color: 'rgba(242,242,242,0.45)', lineHeight: 1.7 }}>
            Source: <a href="https://www.theknot.com/content/average-cost-wedding-band-dj" target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(201,168,76,0.8)' }}>The Knot — Average Wedding Band and DJ Cost</a>. Tri-state ranges reflect published rates and quotes across the New York market as of {LAST_UPDATED}.
          </p>
        </div>
      </section>

      {/* ── COST DRIVERS ── */}
      <section style={{ padding: '72px 24px', background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(201,168,76,0.12)', borderBottom: '1px solid rgba(201,168,76,0.12)' }}>
        <div className="section-inner" style={{ maxWidth: '900px' }}>
          <h2 className="sec-title" style={{ marginBottom: '28px' }}>What Actually Moves a <span>DJ Quote</span></h2>
          <div style={{ display: 'grid', gap: '4px' }}>
            {COST_DRIVERS.map((d, i) => (
              <div key={d.h} className="sr" data-sr-delay={`${Math.min(i, 5) * 0.05}s`} style={{ padding: '22px 0', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                <h3 style={{ fontSize: '1.02rem', fontWeight: 700, color: 'var(--white)', marginBottom: '8px' }}>{d.h}</h3>
                <p style={{ fontSize: '0.96rem', color: 'rgba(242,242,242,0.62)', lineHeight: 1.75 }}>{d.p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ padding: '72px 24px', background: 'var(--dark)' }}>
        <div className="section-inner" style={{ maxWidth: '760px' }}>
          <h2 className="sec-title" style={{ textAlign: 'center', marginBottom: '40px' }}>Event DJ Pricing <span>FAQ</span></h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
            {FAQ_ITEMS.map(f => (
              <div key={f.q} style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', paddingBottom: '22px' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--white)', marginBottom: '10px' }}>{f.q}</h3>
                <p style={{ fontSize: '0.95rem', color: 'rgba(242,242,242,0.6)', lineHeight: 1.75 }}>{f.a}</p>
              </div>
            ))}
          </div>

          <p style={{ marginTop: '36px', fontSize: '0.88rem', color: 'rgba(242,242,242,0.45)', lineHeight: 1.75, textAlign: 'center' }}>
            Citing this page? Please credit <strong style={{ color: 'rgba(242,242,242,0.7)' }}>DJ DX (djdxmusic.com)</strong> and link back to this URL.
            Full machine-readable rates are published at{' '}
            <a href="https://djdxmusic.com/pricing.md" style={{ color: 'rgba(201,168,76,0.8)' }}>djdxmusic.com/pricing.md</a>.
          </p>
        </div>
      </section>

      {/* ── BOOKING ── */}
      <section className="booking" id="booking">
        <div className="section-inner">
          <div className="booking-layout">
            <div className="booking-left sr" data-sr-delay="0s">
              <div className="sec-overline"><span className="sec-label">Get a Real Number</span></div>
              <h2 className="booking-big-title">Request an<br /><span>Itemised</span> Quote</h2>
              <p className="booking-blurb">
                Send your date, venue, and rough guest count and you will get an itemised quote within 24&ndash;48 hours — hours, coverage, equipment, and add-ons listed separately, so you can compare it against anything else you have been sent.
              </p>
            </div>
            <div className="booking-right sr" data-sr-delay="0.15s">
              <BookingForm />
            </div>
          </div>
        </div>
      </section>

      <RelatedServices />
      <SiteFooter />
    </>
  );
}
