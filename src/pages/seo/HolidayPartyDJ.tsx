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
import { Link } from 'react-router-dom';

import ProofBlock from '../../components/ProofBlock';
import AuthorBio from '../../components/AuthorBio';
// Client name for the most recent corporate booking shown on this page. Kept as
// a single constant so the showcase can be anonymised ("a national energy
// company") in one edit, matching the pattern used on the corporate page.
const RECENT_CLIENT = 'LS Power';

// This page exists because Search Console shows real, unserved demand that the
// corporate page was never going to capture: "holiday party dj" (170
// impressions, position 30), "holiday party dj nj" (position 8.9), plus a
// cluster of conversational, assistant-style queries that are all New Jersey
// specific. New Jersey is weighted first throughout for that reason.
//
// Scope split against /corporate-event-dj-nyc-nj-ct: that page is the corporate
// hub and owns "corporate event dj". This page owns the seasonal head term
// "holiday party dj" and covers private and family holiday parties, which the
// corporate page does not address at all.

const FAQ_ITEMS = [
  {
    q: 'What are the best corporate entertainment providers in New Jersey for holiday parties?',
    a: 'New Jersey corporate holiday party entertainment generally falls into three tiers. Full-service entertainment agencies subcontract the actual performer, which means the DJ who shows up is rarely the person you spoke to. Multi-op DJ companies assign whoever is free that night. Independent professional DJs perform the event themselves, which is what most planners actually want for a party where leadership is in the room. DJ DX is the third kind: the DJ you book is the DJ who plays, with 25+ years of experience across Northern New Jersey, Jersey City, Hoboken, Newark, and Bergen County. Corporate holiday parties start at $2,800 and include the full sound system, wireless microphones for speeches and awards, and MC announcements. The practical filter for any provider: ask whether the named performer is contractually guaranteed, and ask what happens if they get sick.',
  },
  {
    q: 'Which entertainment services in New Jersey are most effective for corporate holiday parties?',
    a: 'Effectiveness at a corporate holiday party is measured differently than at a wedding or a club night. The room is mixed by age, seniority, and willingness to dance, and half the guests did not choose to be there. A DJ works better than a band for most corporate holiday parties because a DJ can span five decades of music in an hour, adjust in real time when the room is not moving, and drop the volume instantly for a speech or an award presentation. Live bands commit you to one genre and a fixed set. The most effective setup for a New Jersey corporate holiday party is a single professional DJ handling music, microphone duties, and the run of show, with cocktail-hour background music early, a built dance floor after dinner, and clean audio for whatever leadership needs to say.',
  },
  {
    q: 'How much does a holiday party DJ cost in NJ, NYC, and CT?',
    a: 'Corporate holiday party DJ rates across New Jersey, New York City, and Connecticut typically run $1,500 to $5,000 depending on hours, guest count, venue, and equipment. DJ DX corporate holiday parties start at $2,800, which covers the full reception: professional sound sized to the room, wireless microphones for speeches, toasts and awards, MC announcements, and a planning call before the event. Private and family holiday parties start lower depending on scope and duration. December Saturdays carry premium pricing because they are the single most contested dates of the year. Travel outside the immediate NYC and Northern New Jersey area is quoted upfront as a line item rather than buried in the total. For an itemized quote, email bookings@djdxmusic.com with your date, venue, expected guest count, and whether you need microphones for a program.',
  },
  {
    q: 'Do you DJ office Christmas parties?',
    a: 'Yes. Plenty of December office parties are called exactly that, and the format is the same as any corporate holiday party: professional sound sized to your room, wireless microphones for speeches and toasts, MC announcements, and a set that moves from background music over dinner to a full dance floor. For mixed teams the music can lean festive, stay neutral, or blend the two, and that is agreed on the planning call before the night. Office Christmas parties start at $2,800 across New Jersey, New York City, and Connecticut, with travel outside NYC quoted upfront as its own line item. Email bookings@djdxmusic.com with your date and venue to check availability.',
  },
  {
    q: 'When do December holiday party dates book up?',
    a: 'Most corporate planners lock in holiday party entertainment 90 to 120 days out, which means December dates in Manhattan and Northern New Jersey get claimed through September and October. The first two Saturdays of December are usually gone first, followed by the Friday nights around them. By mid-November the remaining availability is typically weeknights and the week between Christmas and New Year. If you are planning an office holiday party, a year-end client reception, a company celebration, or a private holiday gathering anywhere in NYC, New Jersey, or Connecticut, the earlier you reach out the more likely your preferred date is still open. Email bookings@djdxmusic.com with your date and venue and you will get a straight yes or no on availability within 24 hours.',
  },
  {
    q: 'Can you handle speeches, awards, and announcements?',
    a: 'Yes. Corporate holiday parties almost always include a program: a welcome from leadership, a year-in-review, service awards, or a toast. Every DJ DX corporate booking includes wireless handheld microphones and MC announcements as standard, not as an upsell. The practical part matters more than the equipment: knowing to bring the music down gradually rather than cutting it dead, holding the room quiet until the speaker actually has attention, and getting the energy back up immediately afterward instead of letting the floor empty. The run of show is agreed on a planning call before the event so the timing of each segment is known in advance and nobody is improvising in front of the whole company.',
  },
  {
    q: 'Do you play private and family holiday parties, not just corporate?',
    a: 'Yes. Alongside corporate bookings, DJ DX plays private holiday gatherings, family celebrations, Hanukkah parties, Friendsgiving and year-end house parties across NYC, New Jersey, and Connecticut. These are often smaller and more relaxed than corporate events, and the music brief is usually broader, spanning multiple generations in one room. The setup scales to the space: a compact system for an apartment or home, a full rig for a rented venue or loft. Requests are welcome and a shared song list before the event is encouraged. Email bookings@djdxmusic.com with your date, location, and approximate guest count for a quote.',
  },
  {
    q: 'How do we hold a December date?',
    a: 'Every booking has a written contract, and a 50% deposit holds the date. The balance is due 14 days before the party. A certificate of insurance and a W-9 are available on request for your venue and your accounts payable team. Send your date and venue and you will hear back within 24 hours.',
  },
  {
    q: 'What if our holiday party date changes?',
    a: 'You get one free date change to any date within 12 months of the original, subject to availability, and your deposit carries over. If the party moves from December into January, that is covered.',
  },
  {
    q: 'Is the music clean enough for a work party?',
    a: 'Yes. Office parties get radio edits only, and you can send a do-not-play list before the night. The planning call also covers how festive you want the music: full holiday classics, none at all, or a mix.',
  },
];

export default function HolidayPartyDJ() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const year = new Date().getFullYear();

  return (
    <>
      <Helmet>
        <title>Office Holiday Party DJ NYC &amp; NJ | Book December 2026</title>
        <meta name="description" content="Office holiday party and corporate Christmas party DJ across NYC, NJ and CT. December 2026 dates filling now. Published starting rates. Check your date." />
        <link rel="canonical" href="https://djdxmusic.com/holiday-party-dj-nyc-nj-ct" />
        <meta property="og:title" content="Office Holiday Party DJ NYC &amp; NJ | Book December 2026" />
        <meta property="og:description" content="Office holiday party and corporate Christmas party DJ across NYC, NJ and CT. December 2026 dates filling now. Published starting rates. Check your date." />
        <meta property="og:url" content="https://djdxmusic.com/holiday-party-dj-nyc-nj-ct" />
        <meta property="og:image" content="https://djdxmusic.com/corporate-dj-manhattan-office-party-nyc.jpg" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@djdxmusic" />
        <meta name="twitter:title" content="Office Holiday Party DJ NYC &amp; NJ | Book December 2026" />
        <meta name="twitter:description" content="Office holiday party DJ across NYC, NJ and CT. December 2026 dates filling now. Published starting rates." />
        <meta name="twitter:image" content="https://djdxmusic.com/corporate-dj-manhattan-office-party-nyc.jpg" />
        <script type="application/ld+json">
          {`[
            {
              "@context": "https://schema.org",
              "@type": "Service",
              "name": "Holiday Party DJ — New Jersey, NYC & Connecticut",
              "serviceType": "Holiday Party DJ",
              "url": "https://djdxmusic.com/holiday-party-dj-nyc-nj-ct",
              "description": "DJ DX provides corporate and private holiday party DJ services across New Jersey, New York City, and Connecticut. Office holiday parties, year-end client receptions, company celebrations, and private holiday gatherings. Corporate holiday parties from $2,800 including professional sound, wireless microphones for speeches and awards, and MC announcements. 25+ years experience.",
              "provider": {
                "@type": ["EntertainmentBusiness", "LocalBusiness"],
                "name": "DJ DX",
                "url": "https://djdxmusic.com/",
                "image": "https://djdxmusic.com/corporate-dj-manhattan-office-party-nyc.jpg",
                "email": "bookings@djdxmusic.com",
                "priceRange": "$$$-$$$$",
                "sameAs": [
                  "https://djdxmusic.com/",
                  "https://open.spotify.com/artist/4gGFdpDwEe8zIY1XSE3dGe",
                  "https://www.ted.com/talks/dj_dx_finally_moving",
                  "https://voyageatl.com/interview/life-work-with-robert-van-liew-of-national/"
                ],
                "address": {
                  "@type": "PostalAddress",
                  "addressLocality": "New York",
                  "addressRegion": "NY",
                  "addressCountry": "US"
                }
              },
              "areaServed": [
                {"@type": "State", "name": "New Jersey"},
                {"@type": "City", "name": "Jersey City"},
                {"@type": "City", "name": "Hoboken"},
                {"@type": "City", "name": "Newark"},
                {"@type": "AdministrativeArea", "name": "Bergen County"},
                {"@type": "City", "name": "New York City"},
                {"@type": "City", "name": "Manhattan"},
                {"@type": "City", "name": "Brooklyn"},
                {"@type": "State", "name": "Connecticut"},
                {"@type": "AdministrativeArea", "name": "Tri-State Area"}
              ],
              "offers": {
                "@type": "Offer",
                "priceCurrency": "USD",
                "price": "2800",
                "priceSpecification": {
                  "@type": "PriceSpecification",
                  "priceCurrency": "USD",
                  "minPrice": "2800",
                  "description": "Corporate holiday party DJ from $2,800 — professional sound, wireless microphones for speeches and awards, MC announcements, and a pre-event planning call."
                }
              },
              "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "Holiday Party DJ Services",
                "itemListElement": [
                  {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "Corporate Holiday Party DJ New Jersey"}},
                  {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "Office Holiday Party DJ NYC"}},
                  {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "Year-End Client Reception DJ"}},
                  {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "Private Holiday Party DJ NJ NYC CT"}},
                  {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "Hanukkah and Multi-Faith Holiday Celebration DJ"}},
                  {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "Restaurant and Venue Holiday Night DJ"}}
                ]
              }
            },
            {
              "@context": "https://schema.org",
              "@type": "VideoObject",
              "name": "Corporate Holiday Party DJ — ${RECENT_CLIENT} Office Reception Highlights, Midtown Manhattan",
              "description": "Highlights from a September 2026 in-office corporate reception for ${RECENT_CLIENT} in Midtown Manhattan, with DJ DX on the decks — the same format used for corporate holiday parties across NYC and New Jersey.",
              "thumbnailUrl": "https://djdxmusic.com/corporate-dj-manhattan-office-party-nyc-poster.jpg",
              "uploadDate": "2026-09-15T12:00:00-04:00",
              "contentUrl": "https://djdxmusic.com/videos/corporate-dj-manhattan-office-party-nyc.mp4"
            },
            {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                ${FAQ_ITEMS.map(f => `{
                  "@type": "Question",
                  "name": ${JSON.stringify(f.q)},
                  "acceptedAnswer": { "@type": "Answer", "text": ${JSON.stringify(f.a)} }
                }`).join(',\n                ')}
              ]
            },
            {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              "itemListElement": [
                {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://djdxmusic.com/"},
                {"@type": "ListItem", "position": 2, "name": "Corporate Event DJ", "item": "https://djdxmusic.com/corporate-event-dj-nyc-nj-ct"},
                {"@type": "ListItem", "position": 3, "name": "Holiday Party DJ", "item": "https://djdxmusic.com/holiday-party-dj-nyc-nj-ct"}
              ]
            }
          ]`}
        </script>
      </Helmet>

      <SiteNav />

      {/* ── HERO ── */}
      <section className="epk-hero" style={{ minHeight: '65vh', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
        <div className="epk-hero-bg" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
          <img src="/corporate-dj-manhattan-office-party-nyc.jpg" alt="Holiday party DJ — DJ DX behind the decks at a corporate office party in Midtown Manhattan with skyline windows behind the booth" width="1920" height="1080" fetchPriority="high" loading="eager" decoding="async" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 30%', filter: 'contrast(1.05) saturate(1.1)' }} />
        </div>
        <div className="epk-hero-overlay" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to bottom, rgba(12,12,12,0.25) 0%, rgba(12,12,12,0.93) 100%)' }} />
        <div className="section-inner" style={{ position: 'relative', zIndex: 10, textAlign: 'center' }}>
          <div className="sec-overline" style={{ justifyContent: 'center' }}>
            <span className="sec-label">Office Holiday Party DJ: New York, New Jersey &amp; Connecticut</span>
          </div>
          <h1 className="sec-title" style={{ fontSize: 'clamp(2.1rem, 5.6vw, 4rem)', marginBottom: '1.2rem' }}>
            Office Holiday Party DJ <span>in NYC, NJ and CT</span>
          </h1>
          <p style={{ maxWidth: '640px', margin: '0 auto 1rem', fontSize: '1.1rem', color: 'rgba(242,242,242,0.72)', lineHeight: 1.7 }}>
            An office holiday party DJ for corporate Christmas parties, year-end client events, and
            private holiday gatherings. One DJ, 25+ years, full sound and microphones included.
          </p>
          <p style={{ maxWidth: '540px', margin: '0 auto 2rem', fontSize: '0.9rem', color: 'var(--gold)', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase' }}>
            From $2,800 · December {year} dates booking now
          </p>
          <a href="#booking" className="btn-gold">Check December Availability</a>
        </div>
      </section>

      {/* ── WHY HOLIDAY PARTIES ARE DIFFERENT ── */}
      <section className="about">
        <div className="section-inner">
          <div className="about-layout">
            <div>
              <div className="sec-header sr">
                <div className="sec-overline"><span className="sec-label">The Hardest Room of the Year</span></div>
                <h2 className="sec-title">A Holiday Party Is Not <span>a Wedding or a Club Night</span></h2>
              </div>
              <div className="about-body sr" data-sr-delay="0.1s">
                <p>At a wedding, everyone chose to be there and everyone wants the same thing. At a holiday party, half the room is there because it is on the calendar. You have a twenty-four-year-old analyst and a sixty-year-old managing director standing ten feet apart, and both of them have to feel like the music was picked for them. Nobody dances first. Everybody watches to see who does.</p>
                <p>That is a reading problem, not a playlist problem. The early hour is deliberately restrained — soul, house, and R&amp;B at conversation volume while people arrive, get a drink, and find the colleagues they actually like. The floor does not open because a big song plays. It opens because the right song plays at the moment enough people have relaxed, and knowing where that moment is takes years of watching rooms rather than a prepared set.</p>
                <p>Then there is the program. Almost every corporate holiday party has one: a welcome from leadership, a year-in-review, service awards, a toast. Handling that badly kills a night. Music cut dead mid-song, a microphone that feeds back, a speaker starting before the room is quiet, or worse — a dance floor that empties during the speech and never comes back. Every booking here includes wireless microphones and MC announcements as standard, and the run of show is agreed on a call beforehand so nobody is improvising in front of the entire company.</p>
              </div>
            </div>
            <div className="about-aside">
              {[
                { label: 'From $2,800', sub: 'Corporate holiday parties include full sound sized to the room, wireless mics for speeches and awards, MC announcements, and a planning call before the event.' },
                { label: 'One DJ, Not an Agency', sub: 'The DJ you book is the DJ who plays. No subcontracting, no "whoever is available that night" — which is how most multi-op companies staff December.' },
                { label: 'December Books by October', sub: 'Corporate planners lock in entertainment 90 to 120 days out. The first two Saturdays of December go first, then the Fridays around them.' },
              ].map(s => (
                <div className="stat-row sr" key={s.label}>
                  <div className="stat-meta">
                    <div className="stat-label" style={{ color: 'var(--gold)' }}>{s.label}</div>
                    <div className="stat-sub">{s.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── RECENT CORPORATE BOOKING ── */}
      <section className="corporate-booking" style={{ padding: '80px 40px' }}>
        <div className="section-inner">
          <div className="sec-overline" style={{ justifyContent: 'center' }}>
            <span className="sec-overline-line" />
            <span className="sec-label">Recent Corporate Booking</span>
            <span className="sec-overline-line" />
          </div>
          <h2 className="sec-title" style={{ textAlign: 'center', marginBottom: '12px' }}>
            {RECENT_CLIENT} — <span>In-Office Reception, Midtown Manhattan</span>
          </h2>
          <p style={{ textAlign: 'center', color: 'rgba(242,242,242,0.62)', maxWidth: '720px', margin: '0 auto 48px', fontSize: '1rem', lineHeight: 1.7 }}>
            September 2026 — a corporate reception for {RECENT_CLIENT} held in their own Midtown Manhattan
            event space overlooking the city. This is the same format most office holiday parties take:
            a full DJ setup and sound system brought into a working office, cocktail-hour house and soul
            early, building into an open floor as the room filled.
          </p>

          <div className="cb-hero-shot cb-hero-shot--tall sr" data-sr-delay="0s">
            <img
              src="/corporate-dj-manhattan-office-party-nyc.jpg"
              alt="Corporate holiday party DJ setup in Manhattan — DJ DX on the decks at an in-office company reception in Midtown NYC"
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
                aria-label={`Corporate holiday party DJ — highlights from the ${RECENT_CLIENT} office reception in Midtown Manhattan`}
              />
            </div>
            <div className="cb-shot sr" data-sr-delay="0.1s">
              <img
                src="/corporate-event-dj-booth-manhattan-nyc.jpg"
                alt="Holiday party DJ booth setup for a Manhattan office party — DJ DX behind the decks in a Midtown NYC corporate event space"
                loading="lazy"
              />
            </div>
            <div className="cb-shot sr" data-sr-delay="0.15s">
              <img
                src="/corporate-event-venue-manhattan-skyline-nyc.jpg"
                alt="Manhattan office event space with skyline views set up for a company holiday party with DJ sound and lighting"
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
        </div>
      </section>

      {/* ── EVENT TYPES ── */}
      <section className="services">
        <div className="section-inner">
          <div className="sec-header center sr">
            <div className="sec-overline" style={{ justifyContent: 'center' }}>
              <span className="sec-overline-line" /><span className="sec-label">Holiday Events</span><span className="sec-overline-line" />
            </div>
            <h2 className="sec-title">What Gets <span>Booked in December</span></h2>
          </div>
          <div className="services-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', marginTop: '48px' }}>
            {[
              { title: 'Corporate Holiday & Christmas Party', desc: 'Company-wide December celebrations at hotels, event spaces, and restaurants across Northern New Jersey, Manhattan, and Fairfield County.' },
              { title: 'Office Christmas Party', desc: 'Full DJ rig and sound brought into your own office floor or event space — the format shown above, and the most common ask in NYC and Jersey City.' },
              { title: 'Year-End Client Reception', desc: 'Lower-volume, higher-polish entertainment for client-facing events where conversation matters more than the dance floor.' },
              { title: 'Private Holiday Gathering', desc: 'Family parties, Friendsgiving, and house parties across NJ, NYC, and CT. Setup scales from an apartment system to a full venue rig.' },
              { title: 'Hanukkah & Multi-Faith Events', desc: 'December rooms are rarely one tradition. Music briefs that span multiple celebrations in one guest list, handled without defaulting to novelty tracks.' },
              { title: 'Restaurant & Venue Holiday Nights', desc: 'Seasonal DJ nights for restaurants, lounges, and venues running their own December programming.' },
            ].map(s => (
              <div key={s.title} className="service-cell sr">
                <div className="service-name">{s.title}</div>
                <p className="service-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DECEMBER AVAILABILITY ── */}
      <section style={{ padding: '80px 24px' }}>
        <div className="section-inner" style={{ maxWidth: '860px' }}>
          <div className="sec-header center sr">
            <div className="sec-overline" style={{ justifyContent: 'center' }}>
              <span className="sec-overline-line" /><span className="sec-label">December {year}</span><span className="sec-overline-line" />
            </div>
            <h2 className="sec-title">December {year} <span>Availability</span></h2>
          </div>
          <ul className="lp-list" style={{ marginTop: '28px' }}>
            <li><strong>Busiest nights:</strong> Thursdays, Fridays, and Saturdays from the first week of December through the weekend before Christmas. These go first every year.</li>
            <li><strong>More room:</strong> Monday to Wednesday nights, lunchtime and afternoon parties, and the week between Christmas and New Year.</li>
            <li><strong>January parties:</strong> plenty of offices move the party to January to get a better venue and a better date. Same pricing, same setup.</li>
            <li><strong>Holding a date:</strong> a written contract and a 50% deposit. You get a yes or no on your date within 24 hours of asking.</li>
          </ul>
          <p style={{ textAlign: 'center', color: 'rgba(242,242,242,0.62)', margin: '28px auto 0', fontSize: '0.98rem', lineHeight: 1.75 }}>
            Planning something outside the holidays too? See <Link to="/corporate-event-dj-nyc-nj-ct" style={{ color: 'var(--gold)' }}>corporate event DJ in NYC</Link> for
            client events, galas, launches, and summer parties.
          </p>
          <div className="lp-cta">
            <a href="#booking" className="btn-gold">Check My December Date</a>
            <a href="#quote-calculator" className="lp-cta-alt">Get an instant starting price</a>
          </div>
        </div>
      </section>

      {/* ── COVERAGE ── */}
      <section style={{ padding: '80px 40px' }}>
        <div className="section-inner" style={{ maxWidth: '860px' }}>
          <div className="sec-header center sr">
            <div className="sec-overline" style={{ justifyContent: 'center' }}>
              <span className="sec-overline-line" /><span className="sec-label">Where</span><span className="sec-overline-line" />
            </div>
            <h2 className="sec-title">Holiday Parties Across <span>the Tri-State Area</span></h2>
          </div>
          <p style={{ textAlign: 'center', color: 'rgba(242,242,242,0.62)', margin: '28px auto 0', fontSize: '1rem', lineHeight: 1.8 }}>
            <strong style={{ color: 'var(--white)' }}>New Jersey</strong> — Jersey City, Hoboken, Newark, Bergen County,
            Morris County, and the Northern New Jersey corporate corridor.
            <br /><br />
            <strong style={{ color: 'var(--white)' }}>New York</strong> — Manhattan, Brooklyn, Queens, Westchester,
            and Long Island.
            <br /><br />
            <strong style={{ color: 'var(--white)' }}>Connecticut</strong> — Stamford, Greenwich, Norwalk, and the
            Fairfield County Gold Coast.
            <br /><br />
            Travel outside the immediate NYC and Northern New Jersey area is quoted upfront as a line
            item, never buried in the total.
          </p>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ padding: '80px 40px' }}>
        <div className="section-inner" style={{ maxWidth: '780px' }}>
          <div className="sec-header center sr">
            <h2 className="sec-title">Holiday Party DJ <span>FAQ</span></h2>
          </div>
          <div style={{ marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '22px' }}>
            {FAQ_ITEMS.map(({ q, a }) => (
              <div key={q} style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', paddingBottom: '22px' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--white)', marginBottom: '10px' }}>{q}</h3>
                <p style={{ fontSize: '0.92rem', color: 'rgba(242,242,242,0.58)', lineHeight: 1.75 }}>{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BOOKING ── */}
      <PollPromo />
      <ProcurementNote />

      <ProofBlock />
      <AuthorBio />

      <section id="booking" className="booking" style={{ padding: '80px 40px' }}>
        <div className="section-inner">
          <div className="booking-layout">
            <div className="booking-left">
              <div className="sec-overline"><span className="sec-label">December {year} Bookings</span></div>
              <h2 className="sec-title">Check Your <span>December Date</span></h2>
              <p style={{ color: 'rgba(242,242,242,0.55)', lineHeight: 1.8, marginTop: '16px' }}>
                Send your date, venue, expected guest count, and whether you need microphones for a
                program. You will get a straight yes or no on availability and an itemized quote within
                24 hours — no packages to decode, no agency in between.
              </p>
            </div>
            <div className="booking-right">
              <BookingForm initial={{ eventType: 'Corporate Event / Holiday Party' }} />
            </div>
          </div>
        </div>
      </section>

      <QuoteCalculator formName="holiday_party" defaultEvent="corporate" />
      <RelatedServices />
      <StickyMobileCTA formName="holiday_sticky" label="Check December Dates" />
      <SiteFooter />
    </>
  );
}
