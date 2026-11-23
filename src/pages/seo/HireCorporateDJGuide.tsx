import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import SiteNav from '../../components/SiteNav';
import SiteFooter from '../../components/SiteFooter';
import RelatedServices from '../../components/RelatedServices';
import StickyMobileCTA from '../../components/StickyMobileCTA';
import QuoteCalculator from '../../components/QuoteCalculator';
import BookingForm from '../../components/BookingForm';
import ProofBlock from '../../components/ProofBlock';
import AuthorBio from '../../components/AuthorBio';

// /how-to-hire-corporate-event-dj-nyc: buyer's guide for office managers,
// EAs and HR planning a corporate event or holiday party.
// Search Console (Aug-Nov 2026) showed question searches like "which new york
// djs specialize in high-end corporate functions?" and "best corporate
// entertainment providers in new jersey for holiday parties", which list-style
// guides from other DJs win. The service page /corporate-event-dj-nyc-nj-ct
// keeps the "corporate event dj nyc" head terms; this page links to it.
// Facts: market range from the 2026 pricing report (/event-dj-cost-nyc-nj-ct),
// packages from public/pricing.txt, clients from src/data/events.ts
// (showClientName: true only). No competitor is named.

const PATH = '/how-to-hire-corporate-event-dj-nyc';
const URL = `https://djdxmusic.com${PATH}`;
const TITLE = "How to Hire a Corporate Event DJ in NYC: A Buyer's Guide";
const DESC = 'What NYC corporate DJs charge, the questions to ask before you sign, COI and building rules, and when to book December. Written by a DJ who plays them.';
const IMAGE = '/nautadutilh-dj-booth-cathedral-nyc.jpg';

const QUESTIONS: [string, string][] = [
  ['Will you be the DJ at our event?', 'Agencies often sell one name and send whichever DJ on their roster is free. Ask for the name of the person who will be behind the decks, and talk to that person before you sign.'],
  ['Is the music clean edits only?', 'For a work crowd the answer should be yes, without you having to ask twice. Ask how they handle a request for an explicit track on the night.'],
  ['Can you send a COI that matches our building?', 'Office towers and many Manhattan venues require a certificate of insurance naming them before load-in. A professional sends one in the wording the building asks for. Ask for a W-9 at the same time.'],
  ['What exactly is in the price?', 'Get the list in writing: hours of performance, sound sized to your headcount, how many wireless mics, MC announcements, a planning call, travel. A single number with no list is how surprise fees happen.'],
  ['How do you run speeches and awards?', 'Someone has to bring the music down, hand off the mic, and bring the room back. Ask who does it, and how they know when the speaker is ready.'],
  ['What volume do you start at?', 'Office parties start right after work with people arriving in waves. The first hour should be at talking volume. A DJ who plays the first hour like the last will empty the room.'],
  ['Can we see a recent corporate event?', 'Ask for photos, video or a client quote from a company event in the last year, ideally a room like yours. Wedding footage tells you less about how they handle a work crowd.'],
  ['What happens if we run late?', 'Hosts run late and buildings have hard stops. Ask how the timeline is shared on the night and what the overtime rate is, agreed in writing before the event.'],
  ['What holds the date, and what if we cancel?', 'Read the deposit and cancellation terms before you need them. Ask how long a date can be held while you get internal approval.'],
];

const RED_FLAGS = [
  'A price with no list of what it includes.',
  'No certificate of insurance, or "we will sort it out on the day."',
  'An agency quote that never names the DJ.',
  'No recent corporate event they can show you.',
  'No written contract, or a contract with no end time and no overtime rate.',
];

const TIMELINE: [string, string][] = [
  ['90 to 120 days out', 'Book December Thursdays, Fridays and Saturdays. They go first, and most planners lock entertainment in September and October.'],
  ['When you shortlist', 'Ask for a written, itemized quote. With DJ DX it comes within 24 hours, and a date can be held free for 72 hours while you get sign-off.'],
  ['When you sign', 'A written contract and a 50% deposit confirm the date. Send the building or venue rules so the COI and load-in can be prepared.'],
  ['A month out', 'Planning call: timeline, speeches, do-not-play list, and how the night should build. Running a music poll for the team helps here.'],
  ['The week of', 'Confirm load-in time, freight elevator booking, the end time, and who on your side is the contact on the night.'],
];

const FAQ_ITEMS = [
  {
    q: 'How much does a corporate event DJ cost in NYC?',
    a: 'Our 2026 event DJ pricing report puts corporate event and holiday party DJ quotes across NYC, New Jersey and Connecticut at $1,500 to $5,000. DJ DX corporate events start at $2,800 for up to five hours with sound sized to the room, two wireless mics, MC announcements and a planning call. Signature packages with lighting and a second sound zone start at $4,500, and Production packages with live violin or piano, videography and full lighting design start at $8,000.',
  },
  {
    q: 'Which New York DJs specialize in high-end corporate functions?',
    a: 'Look for a DJ who can name recent corporate clients, show a company event in a room like yours, send a certificate of insurance in your building\'s wording, and play clean edits by default. DJ DX has played for Contentsquare, Saks Fifth Avenue, LS Power and the law firm NautaDutilh, and has been DJing in the New York area since 1998.',
  },
  {
    q: 'What is the best entertainment for a corporate holiday party in New Jersey?',
    a: 'For most office parties of 50 to 300 people a DJ covers the most ground: background music for the first hour, speeches on a wireless mic, then a dance floor. A band costs several times more. DJ with live violin is the middle option when you want live music without band pricing. DJ DX is from Jersey City and plays Hudson County offices and venues, with New Jersey travel quoted up front as its own line.',
  },
  {
    q: 'How far in advance should we book a DJ for a December office party?',
    a: '90 to 120 days ahead. December Thursdays, Fridays and Saturdays go first, and in Manhattan most dates are claimed in September and October. Off-peak weeknights and January parties can often be booked a few weeks out.',
  },
  {
    q: 'Can a DJ set up inside our office?',
    a: 'Yes. Plenty of companies hold the party on their own floor. Send the building\'s rules for load-in, freight elevators, noise and end time, and ask building management whether they need a certificate of insurance before the DJ arrives.',
  },
  {
    q: 'Do we need an MC as well as a DJ?',
    a: 'Usually not. A corporate DJ should handle welcome remarks, speaker introductions, awards and last call on a wireless mic as part of the package. Ask whether MC announcements are included before you compare quotes.',
  },
  {
    q: 'How do we pick music everyone at work will like?',
    a: 'Ask the people who are coming. A free office party music poll collects genres, eras and song requests anonymously and gives the DJ a crowd report. Add a do-not-play list, and keep the first hour at talking volume.',
  },
  {
    q: 'What paperwork should a corporate DJ provide?',
    a: 'A written contract with the date, hours, end time, overtime rate and cancellation terms; an itemized quote; a certificate of insurance if the venue or building asks for one; and a W-9 for your accounts payable team.',
  },
];

const card = { padding: '24px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px' } as const;
const h3 = { fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1.15rem', fontWeight: 700, color: 'var(--gold)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' } as const;
const body = { color: 'rgba(242,242,242,0.68)', fontSize: '0.95rem', lineHeight: 1.75, margin: 0 } as const;
const gold = { color: 'var(--gold)' } as const;

export default function HireCorporateDJGuide() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const schema = [
    {
      '@context': 'https://schema.org', '@type': 'Article', headline: TITLE, description: DESC, url: URL, mainEntityOfPage: URL,
      image: `https://djdxmusic.com${IMAGE}`, datePublished: '2026-11-23', dateModified: '2026-11-23', inLanguage: 'en-US',
      author: { '@type': 'Person', '@id': 'https://djdxmusic.com/#djdx', name: 'DJ DX', url: 'https://djdxmusic.com/' },
      publisher: { '@id': 'https://djdxmusic.com/#service' }, isPartOf: { '@id': 'https://djdxmusic.com/#website' },
    },
    {
      '@context': 'https://schema.org', '@type': 'FAQPage',
      mainEntity: FAQ_ITEMS.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
    },
    {
      '@context': 'https://schema.org', '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://djdxmusic.com/' },
        { '@type': 'ListItem', position: 2, name: 'Corporate Event DJ', item: 'https://djdxmusic.com/corporate-event-dj-nyc-nj-ct' },
        { '@type': 'ListItem', position: 3, name: 'How to Hire a Corporate DJ', item: URL },
      ],
    },
  ];

  return (
    <>
      <Helmet>
        <title>{TITLE}</title>
        <meta name="description" content={DESC} />
        <link rel="canonical" href={URL} />
        <meta property="og:title" content={TITLE} />
        <meta property="og:description" content={DESC} />
        <meta property="og:url" content={URL} />
        <meta property="og:type" content="article" />
        <meta property="og:image" content={`https://djdxmusic.com${IMAGE}`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={TITLE} />
        <meta name="twitter:description" content={DESC} />
        <meta name="twitter:image" content={`https://djdxmusic.com${IMAGE}`} />
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </Helmet>

      <SiteNav />

      {/* ── HERO ── */}
      <section style={{ minHeight: '48vh', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden', paddingTop: '120px', paddingBottom: '48px', background: 'var(--dark)' }}>
        <img src={IMAGE} alt="DJ DX at the booth during a law firm reception on a Rockefeller Center rooftop, with St. Patrick's Cathedral behind" width="1920" height="720" loading="eager" decoding="async"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 40%', opacity: 0.3 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(12,12,12,0.55) 0%, rgba(12,12,12,0.97) 100%)' }} />
        <div className="section-inner" style={{ position: 'relative', zIndex: 10, textAlign: 'center' }}>
          <div className="sec-overline" style={{ justifyContent: 'center' }}><span className="sec-label">Buyer's Guide</span></div>
          <h1 className="sec-title" style={{ fontSize: 'clamp(1.9rem, 4.6vw, 3.2rem)', marginBottom: '1rem', maxWidth: '900px', marginLeft: 'auto', marginRight: 'auto' }}>
            How to Hire a Corporate Event DJ <span>in NYC</span>
          </h1>
          <p style={{ maxWidth: '700px', margin: '0 auto', fontSize: '1.08rem', color: 'rgba(242,242,242,0.75)', lineHeight: 1.75 }}>
            Book 90 to 120 days out for December. Budget <strong style={gold}>$1,500 to $5,000</strong>, the range most NYC, NJ and CT
            corporate DJs quote. Before you sign, get the DJ's name, an itemized quote, a certificate of insurance in your building's
            wording, and a written end time and overtime rate. The rest of this guide covers what to ask and what to watch for.
          </p>
          <p style={{ marginTop: '14px', fontSize: '12px', color: 'rgba(242,242,242,0.55)', letterSpacing: '0.08em' }}>
            Updated November 23, 2026 · Written by DJ DX · DJing since 1998 · Corporate clients include Contentsquare, Saks Fifth Avenue and LS Power
          </p>
        </div>
      </section>

      {/* ── COST ── */}
      <section style={{ padding: '72px 24px', background: 'var(--dark)' }}>
        <div className="section-inner" style={{ maxWidth: '860px' }}>
          <h2 className="sec-title" style={{ marginBottom: '14px' }}>What It <span>Costs</span></h2>
          <p style={{ ...body, marginBottom: '28px' }}>
            Our <Link to="/event-dj-cost-nyc-nj-ct" style={gold}>2026 event DJ pricing report</Link> puts corporate event and holiday party
            quotes across the tri-state area at $1,500 to $5,000. Where a quote lands depends on the date, hours on site, how many
            rooms need sound, building access, and add-ons like lighting or live musicians. For comparison, these are DJ DX's
            published corporate packages:
          </p>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.98rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid rgba(201,168,76,0.4)' }}>
                  {['Package', 'From', 'What it adds'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '14px 12px', color: 'var(--gold)', fontSize: '12px', letterSpacing: '0.14em', textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ['Essentials', '$2,800', 'Up to 5 hours, sound sized to the room, two wireless mics, MC announcements, planning call'],
                  ['Signature', '$4,500', 'Adds uplighting and dance-floor lighting, a custom intro or edit made for the event, and a second sound zone'],
                  ['Production', '$8,000', 'Adds Soul Shades live violin or piano, videography with a highlight reel, and full lighting design; up to 6 hours'],
                ].map(([pkg, price, desc]) => (
                  <tr key={pkg} style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                    <td style={{ padding: '16px 12px', color: 'var(--white)', fontWeight: 600 }}>{pkg}</td>
                    <td style={{ padding: '16px 12px', color: 'var(--gold)', fontWeight: 700, whiteSpace: 'nowrap' }}>{price}</td>
                    <td style={{ padding: '16px 12px', color: 'rgba(242,242,242,0.6)', lineHeight: 1.6 }}>{desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ marginTop: '18px', fontSize: '0.9rem', color: 'rgba(242,242,242,0.55)' }}>
            Travel within NYC is included. New Jersey and Connecticut travel is quoted up front as its own line. COI and W-9 on request.
            Planning the whole budget? Try the free <Link to="/office-holiday-party-budget-calculator" style={gold}>holiday party budget calculator</Link>.
          </p>
        </div>
      </section>

      {/* ── QUESTIONS ── */}
      <section style={{ padding: '72px 24px', background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(201,168,76,0.12)', borderBottom: '1px solid rgba(201,168,76,0.12)' }}>
        <div className="section-inner" style={{ maxWidth: '860px' }}>
          <h2 className="sec-title" style={{ marginBottom: '12px' }}>Nine Questions to Ask <span>Before You Sign</span></h2>
          <p style={{ ...body, marginBottom: '28px' }}>Send these to every DJ on your shortlist. The answers sort them faster than any demo video.</p>
          <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
            {QUESTIONS.map(([q, a], i) => (
              <li key={q} style={card}>
                <h3 style={h3}>{i + 1}. {q}</h3>
                <p style={body}>{a}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── RED FLAGS + ROOM ── */}
      <section style={{ padding: '72px 24px', background: 'var(--dark)' }}>
        <div className="section-inner" style={{ maxWidth: '860px' }}>
          <div style={{ padding: '32px', background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.25)', borderRadius: '12px', marginBottom: '56px' }}>
            <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1.6rem', fontWeight: 800, color: 'var(--white)', marginBottom: '14px' }}>Red flags in a corporate DJ quote</h2>
            <ul className="vn-list" style={{ margin: 0 }}>
              {RED_FLAGS.map(f => <li key={f} style={{ color: 'rgba(242,242,242,0.75)', lineHeight: 1.7 }}>{f}</li>)}
            </ul>
          </div>

          <h2 className="sec-title" style={{ marginBottom: '20px' }}>Office Floor or <span>Venue?</span></h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
            <div style={card}>
              <h3 style={h3}>In the office</h3>
              <p style={body}>
                Cheaper and easier for people to attend. Ask building management for load-in times, freight elevator booking, the
                insurance wording they need, and the hard stop. Expect people to arrive in waves, so plan a quiet first hour.
              </p>
            </div>
            <div style={card}>
              <h3 style={h3}>At a venue</h3>
              <p style={body}>
                The venue handles bar and food, and the night feels like an event. Ask the venue for its vendor rules, sound limits
                and end time, and whether rooftops or outdoor spaces need a weather plan. See <Link to="/venues" style={gold}>venues DJ DX has played</Link>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── TIMELINE ── */}
      <section style={{ padding: '72px 24px', background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(201,168,76,0.12)', borderBottom: '1px solid rgba(201,168,76,0.12)' }}>
        <div className="section-inner" style={{ maxWidth: '860px' }}>
          <h2 className="sec-title" style={{ marginBottom: '24px' }}>When to Do <span>What</span></h2>
          <ol style={{ listStyle: 'none', margin: 0, padding: 0, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            {TIMELINE.map(([when, what]) => (
              <li key={when} style={{ display: 'grid', gridTemplateColumns: 'minmax(120px, 180px) 1fr', gap: '16px', padding: '18px 0', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <strong style={{ color: 'var(--gold)', fontSize: '0.95rem' }}>{when}</strong>
                <span style={body}>{what}</span>
              </li>
            ))}
          </ol>
          <p style={{ ...body, marginTop: '24px' }}>
            Free tools for planners: the <Link to="/office-party-music-poll" style={gold}>office party music poll</Link>, a{' '}
            <Link to="/office-holiday-party-run-of-show" style={gold}>holiday party run of show</Link> for 2, 3 and 4 hour parties, and a{' '}
            <Link to="/office-holiday-party-playlist" style={gold}>clean holiday party playlist</Link>.
          </p>
        </div>
      </section>

      {/* ── PROOF ── */}
      <section style={{ padding: '72px 24px', background: 'var(--dark)' }}>
        <div className="section-inner" style={{ maxWidth: '860px' }}>
          <h2 className="sec-title" style={{ marginBottom: '20px' }}>What a Corporate Booking <span>Looks Like</span></h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
            <Link to="/work/nautadutilh-620-loft-garden" style={{ ...card, display: 'block', textDecoration: 'none' }}>
              <h3 style={h3}>NautaDutilh, 620 Loft &amp; Garden</h3>
              <p style={body}>A 175-guest law firm reception on a Rockefeller Center rooftop, DJ with live violin from cocktail hour through the after-party. Read the case study.</p>
            </Link>
            <Link to="/work/saks-fifth-avenue-water-mill" style={{ ...card, display: 'block', textDecoration: 'none' }}>
              <h3 style={h3}>Saks Fifth Avenue, Water Mill</h3>
              <p style={body}>A private estate event with a Jared Lehr jewelry showcase, from a golden-hour set to a dance floor after dark. Read the case study.</p>
            </Link>
          </div>
          <p style={{ ...body, marginTop: '24px' }}>
            Ready to compare? See the <Link to="/corporate-event-dj-nyc-nj-ct" style={gold}>corporate event DJ</Link>,{' '}
            <Link to="/holiday-party-dj-nyc-nj-ct" style={gold}>office holiday party DJ</Link> and{' '}
            <Link to="/law-firm-finance-event-dj-nyc" style={gold}>law firm and finance event</Link> pages, or{' '}
            <Link to="/corporate-event-dj-jersey-city-nj" style={gold}>corporate events in Jersey City</Link>.
          </p>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ padding: '72px 24px', background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(201,168,76,0.12)' }}>
        <div className="section-inner" style={{ maxWidth: '780px' }}>
          <h2 className="sec-title" style={{ textAlign: 'center', marginBottom: '40px' }}>Hiring a Corporate DJ: <span>FAQ</span></h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
            {FAQ_ITEMS.map(({ q, a }) => (
              <div key={q} style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', paddingBottom: '22px' }}>
                <h3 style={{ fontSize: '1.02rem', fontWeight: 700, color: 'var(--white)', marginBottom: '8px' }}>{q}</h3>
                <p style={{ fontSize: '0.93rem', color: 'rgba(242,242,242,0.6)', lineHeight: 1.75, margin: 0 }}>{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ProofBlock />
      <AuthorBio />

      <section className="booking" id="booking">
        <div className="section-inner">
          <div className="booking-layout">
            <div className="booking-left">
              <div className="sec-overline"><span className="sec-label">Get Your Number</span></div>
              <h2 className="booking-big-title">An Itemized Quote<br />Within <span>24 Hours</span></h2>
              <p className="booking-blurb">
                Send the date, the venue or office address, headcount and hours. You get an itemized quote with the DJ's name on it,
                and the date can be held free for 72 hours while you get approval.
              </p>
            </div>
            <div className="booking-right">
              <BookingForm initial={{ eventType: 'Corporate Event / Holiday Party' }} formName="hire_corporate_guide" />
            </div>
          </div>
        </div>
      </section>

      <QuoteCalculator formName="hire_corporate_guide_calc" defaultEvent="corporate" />
      <RelatedServices />
      <StickyMobileCTA formName="hire_corporate_guide_sticky" label="Check My Date" />
      <SiteFooter />
    </>
  );
}
