import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import SiteNav from '../../components/SiteNav';
import SiteFooter from '../../components/SiteFooter';
import RelatedServices from '../../components/RelatedServices';
import BookingForm from '../../components/BookingForm';

import ProofBlock from '../../components/ProofBlock';
import AuthorBio from '../../components/AuthorBio';
import StickyMobileCTA from '../../components/StickyMobileCTA';
export default function DestinationDJ() {
  // Always start at top on load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Helmet>
        <title>Destination Wedding DJ: Puerto Rico, Hamptons & More | DJ DX</title>
        <meta name="description" content="Destination wedding DJ from New York for Puerto Rico, the Hamptons and anywhere in the US, live violin available. Bookings from $3,000 plus travel." />
        <link rel="canonical" href="https://djdxmusic.com/destination-wedding-dj" />
        <meta property="og:title" content="Destination Wedding DJ: Puerto Rico, Hamptons & More | DJ DX" />
        <meta property="og:description" content="A New York DJ for your wedding in Puerto Rico, the Hamptons or anywhere in the US. Destination bookings from $3,000 plus travel." />
        <meta property="og:url" content="https://djdxmusic.com/destination-wedding-dj" />
        <meta property="og:image" content="https://djdxmusic.com/destination-hero.jpg" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@djdxmusic" />
        <meta name="twitter:title" content="Destination Wedding DJ — DJ DX" />
        <meta name="twitter:description" content="A New York DJ for your wedding in Puerto Rico, the Hamptons or anywhere in the US." />
        <meta name="twitter:image" content="https://djdxmusic.com/destination-hero.jpg" />
        <script type="application/ld+json">
          {`[
            {
              "@context": "https://schema.org",
              "@type": "Service",
              "name": "Destination Wedding DJ: Puerto Rico and the US",
              "serviceType": "Destination Wedding DJ",
              "url": "https://djdxmusic.com/destination-wedding-dj",
              "description": "DJ DX is a New York destination wedding DJ who travels to Puerto Rico and anywhere in the United States. Weddings outside the US are considered on request. TEDxYouth@RVA performer with 500+ events since 1998.",
              "provider": {
                "@type": ["EntertainmentBusiness", "LocalBusiness"],
                "name": "DJ DX",
                "url": "https://djdxmusic.com/",
                "image": "https://djdxmusic.com/epk-hero.jpg",
                "email": "bookings@djdxmusic.com",
                "priceRange": "$$$$",
                "address": {
                  "@type": "PostalAddress",
                  "addressLocality": "New York",
                  "addressRegion": "NY",
                  "addressCountry": "US"
                }
              },
              "areaServed": [
                {"@type": "Country", "name": "United States"},
                {"@type": "Place", "name": "Puerto Rico"}
              ],
              "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "Destination Wedding DJ Packages",
                "itemListElement": [
                  {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "Destination Wedding DJ Puerto Rico"}},
                  {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "Hamptons Wedding DJ"}},
                  {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "Destination Wedding DJ, United States"}}
                ]
              }
            },
            {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "How much does a destination wedding DJ cost?",
                  "acceptedAnswer": {"@type": "Answer", "text": "Destination DJ bookings start at $3,000, with travel and lodging quoted separately based on location. Contact bookings@djdxmusic.com with your destination and dates for a custom quote."}
                },
                {
                  "@type": "Question",
                  "name": "Where does DJ DX travel for destination weddings?",
                  "acceptedAnswer": {"@type": "Answer", "text": "Anywhere in the United States and Puerto Rico. DJ DX is based in New York and is authorized to work in all 50 states. For a wedding outside the US, send the destination and date and he will tell you within 24 hours whether he can take it."}
                },
                {
                  "@type": "Question",
                  "name": "How does sound equipment work for a destination wedding?",
                  "acceptedAnswer": {"@type": "Answer", "text": "DJ DX coordinates directly with the venue's local AV company and your wedding planner in advance, over email and video call, to confirm the technical rider is met on-site before arrival."}
                },
                {
                  "@type": "Question",
                  "name": "How far in advance should I book a destination wedding DJ?",
                  "acceptedAnswer": {"@type": "Answer", "text": "As early as you can. Destination weddings need time to plan flights, lodging and the sound setup with the venue, so send your destination and date as soon as they are set."}
                }
              ]
            },
            {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              "itemListElement": [
                {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://djdxmusic.com/"},
                {"@type": "ListItem", "position": 2, "name": "Destination Wedding DJ", "item": "https://djdxmusic.com/destination-wedding-dj"}
              ]
            }
          ]`}
        </script>
      </Helmet>

      <SiteNav />

      {/* ── HERO ── */}
      <section className="epk-hero" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
        <div className="epk-hero-bg" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
          <img src="/destination-hero.jpg" alt="DJ DX, destination wedding DJ from New York City" width="1920" height="1080" fetchPriority="high" loading="eager" decoding="async" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 35%', filter: 'contrast(1.05) saturate(1.1)' }} />
        </div>
        <div className="epk-hero-overlay" style={{ 
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          background: 'radial-gradient(circle at bottom right, rgba(12,12,12,1) 0%, rgba(12,12,12,1) 8%, transparent 20%), linear-gradient(to bottom, rgba(12,12,12,0.1) 0%, rgba(12,12,12,0.95) 100%), radial-gradient(circle at 50% 30%, rgba(235, 191, 109, 0.2) 0%, transparent 60%)'
        }} />
        
        <div className="section-inner" style={{ position: 'relative', zIndex: 10, textAlign: 'center' }}>
          <div className="sec-overline" style={{ justifyContent: 'center' }}>
            <span className="sec-label">Puerto Rico · Hamptons · Anywhere in the US</span>
          </div>
          <h1 className="epk-title" style={{ fontSize: 'var(--text-6xl)', marginBottom: '1rem' }}>
            Destination Weddings &<br />Events Away From Home
          </h1>
          <p className="epk-lead" style={{ maxWidth: '600px', margin: '0 auto', fontSize: 'var(--text-lg)' }}>
            Getting married in Puerto Rico, the Hamptons or another state? Bring a New York DJ who
            already knows your music, instead of meeting the resort DJ on the day.
          </p>
          <div style={{ marginTop: '2rem' }}>
            <a href="#booking" className="btn-gold">Request Booking & Travel Estimate</a>
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
                  <span className="sec-label">Why Fly Us Out?</span>
                </div>
                <h2 className="sec-title">The Masterclass <span>Standard</span></h2>
              </div>
              <div className="about-body sr" data-sr-delay="0.12s">
                <p>
                  A destination wedding is the one time most couples hire a DJ they have never met: whoever the resort or venue works with. That DJ has not heard your playlist, does not know your families, and is meeting your crowd for the first time on the night.
                </p>
                <p>
                  <strong>Bring your own DJ instead.</strong> DJ DX has played more than 500 events since 1998, from New York lounges to a Saks Fifth Avenue estate event in Water Mill. He plans the night with you before you fly, and can bring <a href="/soul-shades" style={{ color: 'var(--gold)' }}>Soul Shades</a>, his duo with violinist Julie Schatz, for the ceremony and cocktail hour.
                </p>
                <p>
                  The music is open format: R&amp;B, hip-hop, house, Afrobeats, reggaeton and the classics your parents will dance to, built from your must-play and do-not-play lists. Available now anywhere in the US and in Puerto Rico; for a wedding outside the US, send the date and you will get a straight answer within 24 hours.
                </p>
              </div>
            </div>

            <div className="about-aside">
              <div className="stat-row sr" data-sr-delay="0.05s">
                <div className="stat-meta">
                  <div className="stat-label" style={{ color: 'var(--gold)' }}>Travel Handled</div>
                  <div className="stat-sub">DJ DX books his own flights and lodging and works out the sound setup with your venue or planner before the trip. Travel is quoted up front as its own line.</div>
                </div>
              </div>
              <div className="stat-row sr" data-sr-delay="0.15s">
                <div className="stat-meta">
                  <div className="stat-label" style={{ color: 'var(--gold)' }}>Rider & Tech Coordination</div>
                  <div className="stat-sub">We work directly with your destination planner and local AV companies over email and Zoom to ensure our technical rider is perfectly met upon arrival.</div>
                </div>
              </div>
              <div className="stat-row sr" data-sr-delay="0.25s">
                <div className="stat-meta">
                  <div className="stat-label" style={{ color: 'var(--gold)' }}>World-Class Peace of Mind</div>
                  <div className="stat-sub">Knowing exactly who is showing up to perform removes the biggest anxiety of throwing a destination party. We guarantee a packed dance floor, anywhere.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ padding: '80px 40px' }}>
        <div className="section-inner" style={{ maxWidth: '760px' }}>
          <div className="sec-header center sr">
            <h2 className="sec-title">Destination Wedding DJ <span>FAQ</span></h2>
          </div>
          <div style={{ marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {[
              { q: 'How much does a destination wedding DJ cost?', a: 'Destination DJ bookings start at $3,000, with travel and lodging quoted separately based on location. Contact bookings@djdxmusic.com with your destination and dates for a custom quote.' },
              { q: 'Where does DJ DX travel for destination weddings?', a: 'Anywhere in the United States and Puerto Rico. DJ DX is based in New York and is authorized to work in all 50 states. For a wedding outside the US, send the destination and date and he will tell you within 24 hours whether he can take it.' },
              { q: 'How does sound equipment work for a destination wedding?', a: "DJ DX coordinates directly with the venue's local AV company and your wedding planner in advance, over email and video call, to confirm the technical rider is met on-site before arrival." },
              { q: 'How far in advance should I book a destination wedding DJ?', a: 'As early as you can. Destination weddings need time to plan flights, lodging and the sound setup with the venue, so send your destination and date as soon as they are set.' },
            ].map(({ q, a }) => (
              <div key={q} style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', paddingBottom: '20px' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--white)', marginBottom: '8px' }}>{q}</h3>
                <p style={{ fontSize: '0.92rem', color: 'rgba(242,242,242,0.58)', lineHeight: 1.7 }}>{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BOOKING ── */}
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
                Reserve Your<br /><span>Destination Date</span>
              </h2>
              <p className="booking-blurb">
                Send your destination and date below. You will hear back within 24 hours with availability and a quote that lists the performance and the travel separately.
              </p>
            </div>

            <div className="booking-right sr" data-sr-delay="0.15s">
              <BookingForm />
            </div>
          </div>
        </div>
      </section>

      <RelatedServices />
      <StickyMobileCTA formName="destination_d_j_sticky" label="Check My Date" />
      <SiteFooter />
    </>
  );
}
