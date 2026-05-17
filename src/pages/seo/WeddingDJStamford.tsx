import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import SiteNav from '../../components/SiteNav';
import SiteFooter from '../../components/SiteFooter';
import BookingForm from '../../components/BookingForm';

export default function WeddingDJStamford() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <>
      <Helmet>
        <title>Wedding DJ Stamford CT | Greenwich, New Canaan, Westport | DJ DX</title>
        <meta name="description" content="Stamford CT wedding DJ — DJ DX is available for Fairfield County venues including The Loading Dock, Riverside Yacht Club, Belle Haven Club, and Greenwich Country Club. R&B, Hip-Hop, Afrobeats." />
        <link rel="canonical" href="https://djdxmusic.com/wedding-dj-stamford-ct" />
        <meta property="og:title" content="Wedding DJ Stamford CT — DJ DX" />
        <meta property="og:description" content="Fairfield County wedding DJ. Available for Stamford, Greenwich, New Canaan, Westport, and Darien weddings. R&B, Hip-Hop, Afrobeats, and timeless blends." />
        <meta property="og:url" content="https://djdxmusic.com/wedding-dj-stamford-ct" />
        <meta property="og:image" content="https://djdxmusic.com/epk-hero.jpg" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">
          {`[
            {
              "@context": "https://schema.org",
              "@type": "Service",
              "name": "Wedding DJ Stamford CT — Fairfield County",
              "serviceType": "Wedding DJ",
              "url": "https://djdxmusic.com/wedding-dj-stamford-ct",
              "description": "DJ DX is a Stamford CT wedding DJ serving Fairfield County — including Greenwich, New Canaan, Westport, Darien, Norwalk, and Bridgeport. Available for weddings at Riverside Yacht Club, Belle Haven Club, Greenwich Country Club, The Loading Dock, and waterfront estates throughout the Connecticut Gold Coast.",
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
                {"@type": "City", "name": "Stamford"},
                {"@type": "City", "name": "Greenwich"},
                {"@type": "City", "name": "New Canaan"},
                {"@type": "City", "name": "Westport"},
                {"@type": "City", "name": "Darien"},
                {"@type": "City", "name": "Norwalk"},
                {"@type": "City", "name": "Fairfield"},
                {"@type": "City", "name": "Bridgeport"},
                {"@type": "AdministrativeArea", "name": "Fairfield County"},
                {"@type": "AdministrativeArea", "name": "Connecticut Gold Coast"},
                {"@type": "State", "name": "Connecticut"}
              ]
            },
            {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "How much does a wedding DJ cost in Stamford CT?",
                  "acceptedAnswer": {"@type": "Answer", "text": "Stamford CT and Fairfield County wedding DJ pricing typically ranges from $2,000 to $6,000+ depending on venue, duration, and package. Greenwich Gold Coast estates and private clubs command premium rates. DJ DX offers custom transparent quotes — contact bookings@djdxmusic.com for your CT wedding date."}
                },
                {
                  "@type": "Question",
                  "name": "Does DJ DX travel from NY to Connecticut for weddings?",
                  "acceptedAnswer": {"@type": "Answer", "text": "Yes. DJ DX regularly performs Fairfield County weddings — Stamford, Greenwich, New Canaan, Westport, Darien, and Bridgeport. Travel from NYC is short (45-60 minutes), and CT bookings include the same level of preparation, custom playlist building, and venue coordination as NYC weddings."}
                },
                {
                  "@type": "Question",
                  "name": "Is DJ DX available for Connecticut wedding venues?",
                  "acceptedAnswer": {"@type": "Answer", "text": "Yes. DJ DX is available for weddings at Fairfield County's premier venues — Riverside Yacht Club, Belle Haven Club, Greenwich Country Club, The Loading Dock (Stamford), The Waveny House (New Canaan), Lockwood-Mathews Mansion (Norwalk), and private estates throughout the CT Gold Coast. Setup and venue coordination are handled professionally for each booking."}
                },
                {
                  "@type": "Question",
                  "name": "How early should we book a Connecticut wedding DJ?",
                  "acceptedAnswer": {"@type": "Answer", "text": "For Fairfield County and CT Gold Coast weddings, book 8-12 months in advance. Peak season (May-October) and Greenwich Gold Coast estates book fastest. Reach out as early as possible to confirm your Saturday date."}
                }
              ]
            },
            {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              "itemListElement": [
                {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://djdxmusic.com/"},
                {"@type": "ListItem", "position": 2, "name": "Wedding DJ Stamford CT", "item": "https://djdxmusic.com/wedding-dj-stamford-ct"}
              ]
            }
          ]`}
        </script>
      </Helmet>

      <SiteNav />

      <section className="epk-hero" style={{ minHeight: '65vh', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
        <div className="epk-hero-bg" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
          <img src="/epk-hero.jpg" alt="Wedding DJ in Stamford Connecticut — DJ DX performing at reception" width="1920" height="1080" fetchPriority="high" loading="eager" decoding="async" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 20%', filter: 'contrast(1.05) saturate(1.1)' }} />
        </div>
        <div className="epk-hero-overlay" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to bottom, rgba(12,12,12,0.2) 0%, rgba(12,12,12,0.92) 100%)' }} />
        <div className="section-inner" style={{ position: 'relative', zIndex: 10, textAlign: 'center' }}>
          <div className="sec-overline" style={{ justifyContent: 'center' }}>
            <span className="sec-label">Stamford · Fairfield County · CT</span>
          </div>
          <h1 className="sec-title" style={{ fontSize: 'clamp(2.4rem, 6vw, 4.5rem)', marginBottom: '1.2rem' }}>
            Stamford CT Wedding DJ — <span>Serving the Connecticut Gold Coast</span>
          </h1>
          <p style={{ maxWidth: '640px', margin: '0 auto 2rem', fontSize: '1.1rem', color: 'rgba(242,242,242,0.72)', lineHeight: 1.7 }}>
            Greenwich. New Canaan. Westport. Darien. NYC-trained, CT-tuned.
            R&amp;B, Hip-Hop, Afrobeats, and refined blends for Connecticut couples.
          </p>
          <a href="#booking" className="btn-gold">Check Availability</a>
        </div>
      </section>

      <section className="about">
        <div className="section-inner">
          <div className="about-layout">
            <div>
              <div className="sec-header sr">
                <div className="sec-overline"><span className="sec-label">Connecticut Gold Coast Weddings</span></div>
                <h2 className="sec-title">Fairfield County Weddings <span>Have Their Own Standard</span></h2>
              </div>
              <div className="about-body sr" data-sr-delay="0.1s">
                <p>Connecticut Gold Coast weddings — Greenwich, New Canaan, Westport, Darien — bring a particular sophistication. Private clubs. Waterfront estates. Multi-generational families with sharply curated taste. The music has to match the room without ever feeling stiff.</p>
                <p>DJ DX brings NYC-level production with CT-tuned sensibility. The dance floor still has to move — Greenwich crowds love Afrobeats, Westport guests will surprise you with Hip-Hop deep cuts, and Stamford's younger downtown crowd wants the same house and R&B blends heard at Manhattan rooftops.</p>
                <p>Short hop from NYC (45 minutes), so logistics are clean. And travel doesn't blow up your quote — Fairfield County dates are priced fairly because it's part of the regular tri-state circuit, not an exotic trip.</p>
              </div>
            </div>
            <div className="about-aside">
              {[
                { num: '45min', label: 'NYC to Stamford', sub: 'Clean logistics, fair pricing' },
                { num: '8+', label: 'CT Towns Served', sub: 'Stamford to Westport to Greenwich' },
                { num: 'Yes', label: 'Private Clubs', sub: 'Yacht clubs, country clubs, estates' },
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
              <span className="sec-overline-line" /><span className="sec-label">Connecticut Venues</span><span className="sec-overline-line" />
            </div>
            <h2 className="sec-title">Available For <span>Fairfield County Venues</span></h2>
          </div>
          <div className="services-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', marginTop: '48px' }}>
            {[
              { title: 'Riverside Yacht Club', desc: 'Greenwich waterfront — refined receptions with sunset ceremonies.' },
              { title: 'Belle Haven Club', desc: 'Greenwich private club — multi-room receptions with multi-cultural guest lists.' },
              { title: 'Greenwich Country Club', desc: 'Classic CT private-club wedding — full-night entertainment programs.' },
              { title: 'The Loading Dock', desc: 'Stamford industrial-chic venue — modern weddings, downtown energy.' },
              { title: 'The Waveny House', desc: 'New Canaan landmark estate — outdoor ceremonies, ballroom receptions.' },
              { title: 'Lockwood-Mathews Mansion', desc: 'Norwalk historic estate — period architecture meets modern reception.' },
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
            <h2 className="sec-title">Stamford CT Wedding DJ <span>FAQ</span></h2>
          </div>
          <div style={{ marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {[
              { q: 'How much does a wedding DJ cost in Stamford CT?', a: 'Stamford CT and Fairfield County wedding DJ pricing typically ranges from $2,000 to $6,000+ depending on venue, duration, and package. Greenwich Gold Coast estates and private clubs command premium rates. DJ DX offers custom transparent quotes — contact bookings@djdxmusic.com.' },
              { q: 'Does DJ DX travel from NY to Connecticut for weddings?', a: 'Yes. DJ DX regularly performs Fairfield County weddings — Stamford, Greenwich, New Canaan, Westport, Darien, and Bridgeport. Travel from NYC is short (45-60 minutes), and CT bookings include the same level of preparation as NYC weddings.' },
              { q: 'Is DJ DX available for Connecticut wedding venues?', a: 'Yes. DJ DX is available for weddings at Fairfield County\'s premier venues — Riverside Yacht Club, Belle Haven Club, Greenwich Country Club, The Loading Dock (Stamford), The Waveny House (New Canaan), Lockwood-Mathews Mansion (Norwalk), and private estates throughout the CT Gold Coast. Setup and venue coordination are handled professionally for each booking.' },
              { q: 'How early should we book a Connecticut wedding DJ?', a: 'For Fairfield County and CT Gold Coast weddings, book 8-12 months in advance. Peak season (May-October) and Greenwich Gold Coast estates book fastest. Reach out as early as possible to confirm your Saturday date.' },
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
              <div className="sec-overline"><span className="sec-label">Book Your Connecticut Wedding</span></div>
              <h2 className="sec-title">Request a <span>Stamford CT Wedding DJ Quote</span></h2>
              <p style={{ color: 'rgba(242,242,242,0.55)', lineHeight: 1.8, marginTop: '16px' }}>
                Fill out the form and DJ DX will get back to you within 24 hours with availability and pricing for your Connecticut wedding date.
              </p>
            </div>
            <div className="booking-right">
              <BookingForm />
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
