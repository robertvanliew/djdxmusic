import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import SiteNav from '../../components/SiteNav';
import SiteFooter from '../../components/SiteFooter';
import RelatedServices from '../../components/RelatedServices';
import BookingForm from '../../components/BookingForm';

export default function WeddingDJLongIsland() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <>
      <Helmet>
        <title>Wedding DJ Long Island NY | Nassau & Suffolk | DJ DX</title>
        <meta name="description" content="Long Island wedding DJ — DJ DX is available for Nassau and Suffolk venues including Oheka Castle, The Garden City Hotel, Crest Hollow, Bourne Mansion, and the Hamptons. R&B, Hip-Hop, Afrobeats." />
        <link rel="canonical" href="https://djdxmusic.com/wedding-dj-long-island-ny" />
        <meta property="og:title" content="Wedding DJ Long Island NY — DJ DX" />
        <meta property="og:description" content="Long Island wedding DJ for Nassau and Suffolk County. Available for Oheka Castle, Crest Hollow, Bourne Mansion, and Hamptons weddings." />
        <meta property="og:url" content="https://djdxmusic.com/wedding-dj-long-island-ny" />
        <meta property="og:image" content="https://djdxmusic.com/epk-hero.jpg" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">
          {`[
            {
              "@context": "https://schema.org",
              "@type": "Service",
              "name": "Wedding DJ Long Island NY — Nassau & Suffolk County",
              "serviceType": "Wedding DJ",
              "url": "https://djdxmusic.com/wedding-dj-long-island-ny",
              "description": "DJ DX is a Long Island wedding DJ serving Nassau and Suffolk County — including Garden City, Huntington, Oyster Bay, Great Neck, Smithtown, Babylon, Riverhead, Southampton, East Hampton, and Montauk. Available for premier venues across the island. R&B, Hip-Hop, Afrobeats, and Old School blends.",
              "provider": {
                "@type": ["EntertainmentBusiness", "LocalBusiness"],
                "name": "DJ DX",
                "url": "https://djdxmusic.com/",
                "image": "https://djdxmusic.com/epk-hero.jpg",
                "email": "bookings@djdxmusic.com",
                "priceRange": "$$-$$$",
                "address": {
                  "@type": "PostalAddress",
                  "addressLocality": "New York",
                  "addressRegion": "NY",
                  "addressCountry": "US"
                }
              },
              "areaServed": [
                {"@type": "City", "name": "Long Island"},
                {"@type": "AdministrativeArea", "name": "Nassau County"},
                {"@type": "AdministrativeArea", "name": "Suffolk County"},
                {"@type": "City", "name": "Garden City"},
                {"@type": "City", "name": "Huntington"},
                {"@type": "City", "name": "Oyster Bay"},
                {"@type": "City", "name": "Great Neck"},
                {"@type": "City", "name": "Smithtown"},
                {"@type": "City", "name": "Babylon"},
                {"@type": "City", "name": "Riverhead"},
                {"@type": "City", "name": "Southampton"},
                {"@type": "City", "name": "East Hampton"},
                {"@type": "City", "name": "Montauk"}
              ]
            },
            {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "How much does a Long Island wedding DJ cost?",
                  "acceptedAnswer": {"@type": "Answer", "text": "Long Island wedding DJ pricing typically ranges from $1,800 to $5,500+ depending on venue, duration, and Nassau vs Suffolk location. Hamptons weddings (East Hampton, Southampton, Montauk) command premium rates due to travel and overnight accommodations. DJ DX offers custom transparent quotes — contact bookings@djdxmusic.com for your date."}
                },
                {
                  "@type": "Question",
                  "name": "Is DJ DX available for Long Island wedding venues?",
                  "acceptedAnswer": {"@type": "Answer", "text": "Yes. DJ DX is available for weddings at Long Island's premier venues — Oheka Castle (Huntington), The Garden City Hotel, Crest Hollow Country Club (Woodbury), Bourne Mansion (Oakdale), The Inn at Great Neck, and Hamptons venues including Topping Rose House and Gurney's Montauk. Travel and setup are planned around each venue's requirements."}
                },
                {
                  "@type": "Question",
                  "name": "Do you travel to Eastern Long Island and The Hamptons?",
                  "acceptedAnswer": {"@type": "Answer", "text": "Yes. DJ DX regularly performs Hamptons and Eastern Long Island weddings — Southampton, East Hampton, Sag Harbor, Bridgehampton, Montauk, and Shelter Island. Travel and overnight accommodations are factored into the quote for venues over 60 miles from NYC."}
                },
                {
                  "@type": "Question",
                  "name": "How far in advance should we book a Long Island wedding DJ?",
                  "acceptedAnswer": {"@type": "Answer", "text": "Book 8-12 months in advance for Long Island weddings — peak summer (June-August) and fall (September-October) book fastest. Hamptons weekends and holiday weekends fill 12-18 months out at top venues."}
                }
              ]
            },
            {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              "itemListElement": [
                {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://djdxmusic.com/"},
                {"@type": "ListItem", "position": 2, "name": "Wedding DJ Long Island NY", "item": "https://djdxmusic.com/wedding-dj-long-island-ny"}
              ]
            }
          ]`}
        </script>
      </Helmet>

      <SiteNav />

      <section className="epk-hero" style={{ minHeight: '65vh', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
        <div className="epk-hero-bg" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
          <img src="/epk-hero.jpg" alt="Wedding DJ on Long Island NY — DJ DX performing at reception" width="1920" height="1080" fetchPriority="high" loading="eager" decoding="async" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 20%', filter: 'contrast(1.05) saturate(1.1)' }} />
        </div>
        <div className="epk-hero-overlay" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to bottom, rgba(12,12,12,0.2) 0%, rgba(12,12,12,0.92) 100%)' }} />
        <div className="section-inner" style={{ position: 'relative', zIndex: 10, textAlign: 'center' }}>
          <div className="sec-overline" style={{ justifyContent: 'center' }}>
            <span className="sec-label">Long Island · Nassau & Suffolk</span>
          </div>
          <h1 className="sec-title" style={{ fontSize: 'clamp(2.4rem, 6vw, 4.5rem)', marginBottom: '1.2rem' }}>
            Long Island Wedding DJ — <span>From Garden City to Montauk</span>
          </h1>
          <p style={{ maxWidth: '640px', margin: '0 auto 2rem', fontSize: '1.1rem', color: 'rgba(242,242,242,0.72)', lineHeight: 1.7 }}>
            Available for Long Island's premier venues — Oheka Castle, Crest Hollow, Bourne Mansion, and Hamptons summer weddings.
            R&amp;B, Hip-Hop, Afrobeats, and the blends Long Island couples actually want.
          </p>
          <a href="#booking" className="btn-gold">Check Availability</a>
        </div>
      </section>

      <section className="about">
        <div className="section-inner">
          <div className="about-layout">
            <div>
              <div className="sec-header sr">
                <div className="sec-overline"><span className="sec-label">Why Long Island Couples Book DJ DX</span></div>
                <h2 className="sec-title">A Long Island Wedding Has <span>Its Own Rhythm</span></h2>
              </div>
              <div className="about-body sr" data-sr-delay="0.1s">
                <p>Long Island weddings are a different animal. Grand catering halls. Multi-cultural guest lists. Italian families from Massapequa, multigenerational R&B fans from Hempstead, hip-hop heads from Brentwood, and tasteful house lovers driving in from the Hamptons. The DJ has to read every room within the same room.</p>
                <p>DJ DX brings 20+ years of DJing experience — built on listening, not just playing tracks. Whether it's a grand ballroom at Oheka Castle or a tented Hamptons affair in Sagaponack, every set is custom-built around the couple, the venue, and the guest mix.</p>
                <p>And for couples doing a destination-feel wedding out east — Montauk, East Hampton, Bridgehampton — DJ DX travels the LIE without inflating the quote. Long Island is part of the regular tri-state circuit, not an exotic trip.</p>
              </div>
            </div>
            <div className="about-aside">
              {[
                { num: '20+', label: 'Years DJing', sub: 'Across the tri-state area' },
                { num: 'Yes', label: 'Hamptons Travel', sub: 'East End weddings welcomed' },
                { num: 'TED', label: 'Featured Artist', sub: 'TEDxYouth@RVA 2022' },
              ].map(s => (
                <div className="stat-row sr" key={s.label}>
                  <div className="stat-num">{s.num}</div>
                  <div className="stat-meta">
                    <div className="stat-label">{s.label}</div>
                    <div className="stat-sub">{s.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="services">
        <div className="section-inner">
          <div className="sec-header center sr">
            <div className="sec-overline" style={{ justifyContent: 'center' }}>
              <span className="sec-overline-line" /><span className="sec-label">Long Island Venues</span><span className="sec-overline-line" />
            </div>
            <h2 className="sec-title">Available For <span>Long Island's Premier Venues</span></h2>
          </div>
          <div className="services-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', marginTop: '48px' }}>
            {[
              { title: 'Oheka Castle', desc: 'Huntington landmark — built for castle ballroom receptions and sweeping staircase moments.' },
              { title: 'Crest Hollow Country Club', desc: 'Woodbury staple — designed for multi-cultural Long Island weddings.' },
              { title: 'The Garden City Hotel', desc: 'Nassau County classic — refined ballroom weddings with elevated music programs.' },
              { title: 'Bourne Mansion', desc: 'Oakdale waterfront estate — grand outdoor and indoor reception spaces.' },
              { title: 'Hamptons Estates', desc: 'East Hampton, Sagaponack, Bridgehampton — tented weddings and waterfront ceremonies.' },
              { title: 'Gurney\'s Montauk', desc: 'East End oceanfront — sunset receptions with curfew-aware mixing handled professionally.' },
            ].map(s => (
              <div key={s.title} className="service-cell sr">
                <div className="service-name">{s.title}</div>
                <p className="service-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '80px 40px' }}>
        <div className="section-inner" style={{ maxWidth: '760px' }}>
          <div className="sec-header center sr">
            <h2 className="sec-title">Long Island Wedding DJ <span>FAQ</span></h2>
          </div>
          <div style={{ marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {[
              { q: 'How much does a Long Island wedding DJ cost?', a: 'Long Island wedding DJ pricing typically ranges from $1,800 to $5,500+ depending on venue, duration, and Nassau vs Suffolk location. Hamptons weddings command premium rates due to travel and overnight accommodations. DJ DX offers custom transparent quotes — contact bookings@djdxmusic.com.' },
              { q: 'Is DJ DX available for Long Island wedding venues?', a: 'Yes. DJ DX is available for weddings at Long Island\'s premier venues — Oheka Castle (Huntington), The Garden City Hotel, Crest Hollow Country Club (Woodbury), Bourne Mansion (Oakdale), The Inn at Great Neck, and Hamptons venues including Topping Rose House and Gurney\'s Montauk. Travel and setup are planned around each venue\'s requirements.' },
              { q: 'Do you travel to Eastern Long Island and The Hamptons?', a: 'Yes. DJ DX regularly performs Hamptons and Eastern Long Island weddings — Southampton, East Hampton, Sag Harbor, Bridgehampton, Montauk, and Shelter Island. Travel and overnight accommodations are factored into the quote for venues over 60 miles from NYC.' },
              { q: 'How far in advance should we book a Long Island wedding DJ?', a: 'Book 8-12 months in advance for Long Island weddings — peak summer (June-August) and fall (September-October) book fastest. Hamptons weekends and holiday weekends fill 12-18 months out at top venues.' },
            ].map(({ q, a }) => (
              <div key={q} style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', paddingBottom: '20px' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--white)', marginBottom: '8px' }}>{q}</h3>
                <p style={{ fontSize: '0.92rem', color: 'rgba(242,242,242,0.58)', lineHeight: 1.7 }}>{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="booking" className="booking" style={{ padding: '80px 40px' }}>
        <div className="section-inner">
          <div className="booking-layout">
            <div className="booking-left">
              <div className="sec-overline"><span className="sec-label">Book Your Long Island Wedding</span></div>
              <h2 className="sec-title">Request a <span>Long Island Wedding DJ Quote</span></h2>
              <p style={{ color: 'rgba(242,242,242,0.55)', lineHeight: 1.8, marginTop: '16px' }}>
                Fill out the form and DJ DX will get back to you within 24 hours with availability and pricing for your Long Island wedding date.
              </p>
            </div>
            <div className="booking-right">
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
