import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import SiteNav from '../components/SiteNav';
import SiteFooter from '../components/SiteFooter';
import BookingForm from '../components/BookingForm';
import AuthorBio from '../components/AuthorBio';
import StickyMobileCTA from '../components/StickyMobileCTA';

// For event planners, agencies and venue coordinators: everything they need
// to put DJ DX on a run of show without a phone call. Specs match the
// technical rider on /epk; prices match public/pricing.txt and the corporate
// packages. Keep all three in sync.

const RATES = [
  ['Corporate event', 'From $2,800', 'Essentials, Signature ($4,500) and Production ($8,000+) packages'],
  ['Office holiday party', 'From $2,800', 'December dates fill 90 to 120 days out'],
  ['Wedding', 'From $2,800', 'Ceremony through after-party'],
  ['Private party or birthday', 'From $2,200', 'Homes, restaurants, rooftops, lounges'],
  ['Sweet 16, quinceañera, mitzvah', 'From $1,500', 'Often shorter runtimes'],
  ['Soul Shades: DJ + live violin', 'From $2,400', 'Live violin or piano over the DJ set'],
  ['Live violin add-on', 'From $150/hour', 'Added to any DJ package'],
  ['Hamptons, destination, international', 'From $3,000', 'Travel and riders coordinated by DJ DX'],
];

const PLOT = [
  ['DJ position', 'Facing the room, near the dance floor, on a level floor. DJ DX brings a DJ booth with a façade to every event, so no table or linen is needed from the venue.'],
  ['Footprint', 'About 8 feet wide by 6 feet deep including speaker stands. Two speakers on stands either side of the booth, subwoofer at floor level.'],
  ['Sound', 'Self-contained: DJ DX brings a professional PA sized to the room and headcount, with subwoofer. No house system needed. Can also feed the house system (see input list).'],
  ['Power', 'Two dedicated 15-amp circuits within 25 feet of the DJ position. DJ DX brings surge protection and cabling.'],
  ['Microphones', 'Two wireless handheld mics and one stand, brought by DJ DX. Extra mics available on request.'],
  ['Lighting', 'Uplighting and dance-floor lighting available as an add-on (Signature and Production). Keep direct spotlights off the booth.'],
  ['Load-in', '60 minutes minimum before guests arrive for a standard setup; 90 minutes with lighting or a second sound zone. Loading dock or parking access, and the freight elevator booked if the building needs it.'],
  ['Outdoor', 'A covered, dry position for all equipment. Rooftops and terraces: please share the music cutoff time in advance.'],
  ['Live musicians', 'For Soul Shades bookings: one DI box, one outlet and a monitor mix per musician, plus a 4 by 4 foot space beside the booth.'],
];

const INPUTS = [
  ['1 and 2', 'DJ mix L/R', 'Rane One controller, line level, XLR or RCA'],
  ['3', 'Wireless handheld mic 1', 'XLR from receiver'],
  ['4', 'Wireless handheld mic 2', 'XLR from receiver'],
  ['5', 'Violin (Soul Shades only)', 'DI, XLR'],
  ['6 and 7', 'Piano or keys L/R (Soul Shades only)', 'Stereo DI, XLR'],
  ['Monitor', 'DJ monitor', 'One wedge or powered monitor at the booth when using house sound'],
];

const PAPERWORK = [
  ['Contract', 'A written contract on every booking: date, hours, fee, terms. Sent within 24 hours of confirming.'],
  ['Certificate of insurance', 'Issued to the venue or client on request. Send the certificate holder details and any additional insured wording.'],
  ['W-9', 'Available on request so accounts payable can set DJ DX up as a vendor.'],
  ['Invoicing', 'Deposit and balance invoices sent to whoever handles payment on your side.'],
  ['Deposit and balance', '50% deposit and the signed contract hold the date. Balance is due 14 days before the event.'],
  ['Date changes', 'One free date change to any date within 12 months, subject to availability. The deposit carries over.'],
  ['Backup', 'The DJ you book is the DJ who plays. In an emergency, a DJ personally vetted by DJ DX covers the event from the planning notes, with a partial refund or credit.'],
];

const FAQ = [
  { q: 'How fast do you turn around a quote?', a: 'Within 24 hours of receiving the date, venue, hours and headcount. Most quotes go out the same day.' },
  { q: 'Do you work from our run of show?', a: 'Yes. Send the run of show and DJ DX follows it: speaker intros, award walk-ups, timed reveals and the dance floor open. Changes on the night are fine.' },
  { q: 'Can you plug into the venue sound system?', a: 'Yes. See the input list. DJ DX brings a full PA as standard, so the house system is optional.' },
  { q: 'Do you have photos and a bio for our deck or program?', a: 'Yes. Approved photos, a short bio and the technical rider are on the press kit page.' },
  { q: 'Do you work with agencies on repeat events?', a: 'Yes. Several corporate clients rebook annually. Send a list of dates and DJ DX will hold what is open.' },
];

const SCHEMA = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Event Planner Resources: Stage Plot, Rates and Paperwork',
    url: 'https://djdxmusic.com/planners',
    about: { '@id': 'https://djdxmusic.com/#djdx' },
    description: 'Stage plot, input list, starting rates, insurance and booking paperwork for event planners and agencies booking DJ DX in NYC, NJ and CT.',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
  },
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://djdxmusic.com/' },
      { '@type': 'ListItem', position: 2, name: 'For Planners', item: 'https://djdxmusic.com/planners' },
    ],
  },
];

const h2 = { marginBottom: '18px' } as const;
const lead = { color: 'rgba(242,242,242,0.68)', fontSize: '1rem', lineHeight: 1.8, margin: '0 0 24px' } as const;

function Table({ rows, head }: { rows: string[][]; head: string[] }) {
  return (
    <table className="lp-table">
      <thead><tr>{head.map(h => <th key={h} scope="col">{h}</th>)}</tr></thead>
      <tbody>{rows.map(r => <tr key={r[0]}>{r.map((c, i) => <td key={i}>{c}</td>)}</tr>)}</tbody>
    </table>
  );
}

export default function Planners() {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <>
      <Helmet>
        <title>For Event Planners: Stage Plot, Rates &amp; COI | DJ DX</title>
        <meta name="description" content="Everything a planner or agency needs to book DJ DX: stage plot, input list, starting rates, certificate of insurance, W-9 and booking terms. Quote in 24 hours." />
        <link rel="canonical" href="https://djdxmusic.com/planners" />
        <meta property="og:title" content="For Event Planners: Stage Plot, Rates &amp; COI | DJ DX" />
        <meta property="og:description" content="Stage plot, input list, starting rates, COI, W-9 and booking terms for planners and agencies booking DJ DX in NYC, NJ and CT." />
        <meta property="og:url" content="https://djdxmusic.com/planners" />
        <meta property="og:image" content="https://djdxmusic.com/corporate-event-dj-booth-manhattan-nyc.jpg" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="For Event Planners: Stage Plot, Rates &amp; COI | DJ DX" />
        <meta name="twitter:description" content="Stage plot, input list, starting rates, COI, W-9 and booking terms for planners and agencies." />
        <meta name="twitter:image" content="https://djdxmusic.com/corporate-event-dj-booth-manhattan-nyc.jpg" />
        <script type="application/ld+json">{JSON.stringify(SCHEMA)}</script>
      </Helmet>

      <SiteNav />

      <section className="epk-hero" style={{ minHeight: '56vh', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
        <div className="epk-hero-bg" style={{ position: 'absolute', inset: 0 }}>
          <img src="/corporate-event-dj-booth-manhattan-nyc.jpg" alt="DJ DX booth set up for a corporate event in Manhattan" width="1920" height="1080" fetchPriority="high" loading="eager" decoding="async" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 40%' }} />
        </div>
        <div className="epk-hero-overlay" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(12,12,12,0.35) 0%, rgba(12,12,12,0.95) 100%)' }} />
        <div className="section-inner" style={{ position: 'relative', zIndex: 10, textAlign: 'center' }}>
          <div className="sec-overline" style={{ justifyContent: 'center' }}><span className="sec-label">Planners, Agencies and Venues</span></div>
          <h1 className="sec-title" style={{ fontSize: 'clamp(2.1rem, 5.6vw, 4rem)', marginBottom: '1.2rem' }}>Booking DJ DX: <span>What Planners Need</span></h1>
          <p style={{ maxWidth: '680px', margin: '0 auto 2rem', fontSize: '1.08rem', color: 'rgba(242,242,242,0.78)', lineHeight: 1.7 }}>
            One DJ, 25+ years, 500+ events across NYC, NJ and CT. Stage plot, input list, rates and paperwork are all on this page.
            Quotes within 24 hours. COI and W-9 on request. The DJ you book is the DJ who plays.
          </p>
          <div className="lp-cta" style={{ marginTop: 0 }}>
            <a href="#booking" className="btn-gold">Send a Date</a>
            <Link to="/epk" className="lp-cta-alt">Press kit, photos and bio</Link>
          </div>
        </div>
      </section>

      <section style={{ padding: '72px 24px' }}>
        <div className="section-inner" style={{ maxWidth: '900px' }}>
          <h2 className="sec-title" style={h2}>Starting <span>Rates</span></h2>
          <p style={lead}>Published starting prices. Final quotes depend on date, venue, hours and equipment. Travel outside New York City is quoted up front as its own line.</p>
          <Table head={['Event', 'Starting at', 'Notes']} rows={RATES} />
          <p style={{ ...lead, marginTop: '18px', fontSize: '0.92rem' }}>
            Corporate package details are on the <Link to="/corporate-event-dj-nyc-nj-ct#packages" style={{ color: 'var(--gold)' }}>corporate page</Link>.
            For a number in 30 seconds use the <Link to="/event-dj-cost-nyc-nj-ct#quote-calculator" style={{ color: 'var(--gold)' }}>instant price estimate</Link>.
          </p>
        </div>
      </section>

      <section style={{ padding: '0 24px 72px' }}>
        <div className="section-inner" style={{ maxWidth: '900px' }}>
          <h2 className="sec-title" style={h2}>Stage <span>Plot</span></h2>
          <p style={lead}>The standard setup, adjusted to the room. DJ DX brings the booth, sound, mics and cabling; the venue provides the position and the power.</p>
          <Table head={['Item', 'Spec']} rows={PLOT} />
        </div>
      </section>

      <section style={{ padding: '0 24px 72px' }}>
        <div className="section-inner" style={{ maxWidth: '900px' }}>
          <h2 className="sec-title" style={h2}>Input <span>List</span></h2>
          <p style={lead}>For venues and production companies running house sound. Lines 5 to 7 apply to Soul Shades bookings only.</p>
          <Table head={['Channel', 'Source', 'Connection']} rows={INPUTS} />
        </div>
      </section>

      <section style={{ padding: '72px 24px', background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(201,168,76,0.12)', borderBottom: '1px solid rgba(201,168,76,0.12)' }}>
        <div className="section-inner" style={{ maxWidth: '900px' }}>
          <h2 className="sec-title" style={h2}>Insurance and <span>Paperwork</span></h2>
          <p style={lead}>Everything your procurement or accounts payable team will ask for. Full terms are on the <Link to="/booking-policy" style={{ color: 'var(--gold)' }}>booking policy</Link>.</p>
          <Table head={['Item', 'Details']} rows={PAPERWORK} />
        </div>
      </section>

      <section style={{ padding: '72px 24px' }}>
        <div className="section-inner" style={{ maxWidth: '780px' }}>
          <h2 className="sec-title" style={{ textAlign: 'center' }}>Planner <span>Questions</span></h2>
          <div style={{ marginTop: '36px', display: 'flex', flexDirection: 'column', gap: '22px' }}>
            {FAQ.map(({ q, a }) => (
              <div key={q} style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', paddingBottom: '22px' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--white)', marginBottom: '10px' }}>{q}</h3>
                <p style={{ fontSize: '0.92rem', color: 'rgba(242,242,242,0.62)', lineHeight: 1.75 }}>{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <AuthorBio />

      <section id="booking" className="booking" style={{ padding: '80px 40px' }}>
        <div className="section-inner">
          <div className="booking-layout">
            <div className="booking-left">
              <div className="sec-overline"><span className="sec-label">Check a Date</span></div>
              <h2 className="sec-title">Send the <span>Date and Venue</span></h2>
              <p style={{ color: 'rgba(242,242,242,0.55)', lineHeight: 1.8, marginTop: '16px' }}>
                Date, venue, hours and headcount is enough. You will have availability and an itemized quote within 24 hours.
                Holding several dates for a client? List them in the message and DJ DX will reply with what is open.
              </p>
            </div>
            <div className="booking-right">
              <BookingForm formName="planners" initial={{ eventType: 'Corporate Event / Holiday Party' }} />
            </div>
          </div>
        </div>
      </section>

      <StickyMobileCTA formName="planners_sticky" label="Send a Date" />
      <SiteFooter />
    </>
  );
}
