import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import SiteNav from '../../components/SiteNav';
import SiteFooter from '../../components/SiteFooter';
import BookingForm from '../../components/BookingForm';

export default function WeddingDJManhattan() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <>
      <Helmet>
        <title>Wedding DJ Manhattan NYC | R&B, Hip-Hop, Afrobeats | DJ DX</title>
        <meta name="description" content="Manhattan wedding DJ — DJ DX is available for premier NYC venues including Cipriani, Tribeca Rooftop, Pier Sixty, and Manhattan rooftops. R&B, Hip-Hop, Afrobeats, Old School. TED-featured. 500+ events." />
        <link rel="canonical" href="https://djdxmusic.com/wedding-dj-manhattan-nyc" />
        <meta property="og:title" content="Wedding DJ Manhattan NYC — DJ DX" />
        <meta property="og:description" content="Manhattan's premier wedding DJ. Available for top NYC venues — Cipriani, Tribeca Rooftop, Pier Sixty, and more. R&B, Hip-Hop, Afrobeats, and timeless blends." />
        <meta property="og:url" content="https://djdxmusic.com/wedding-dj-manhattan-nyc" />
        <meta property="og:image" content="https://djdxmusic.com/epk-hero.jpg" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">
          {`[
            {
              "@context": "https://schema.org",
              "@type": "Service",
              "name": "Wedding DJ Manhattan NYC — R&B, Hip-Hop, Afrobeats",
              "serviceType": "Wedding DJ",
              "url": "https://djdxmusic.com/wedding-dj-manhattan-nyc",
              "description": "DJ DX is a professional Manhattan wedding DJ specializing in R&B, Hip-Hop, Afrobeats, Old School, and custom blends. Available for weddings at premier NYC venues throughout Tribeca, SoHo, Chelsea, Midtown, the Upper East Side, the Upper West Side, the Financial District, and the Lower East Side.",
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
                {"@type": "City", "name": "Manhattan"},
                {"@type": "City", "name": "New York City"},
                {"@type": "Place", "name": "Tribeca"},
                {"@type": "Place", "name": "SoHo"},
                {"@type": "Place", "name": "Chelsea"},
                {"@type": "Place", "name": "Midtown Manhattan"},
                {"@type": "Place", "name": "Upper East Side"},
                {"@type": "Place", "name": "Upper West Side"},
                {"@type": "Place", "name": "Financial District"},
                {"@type": "Place", "name": "Lower East Side"}
              ]
            },
            {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "How much does a Manhattan wedding DJ cost?",
                  "acceptedAnswer": {"@type": "Answer", "text": "Manhattan wedding DJ pricing typically ranges from $2,500 to $7,500+ depending on venue, duration, and package. Manhattan weddings command premium rates due to venue load-in complexity, union requirements at some venues (like The Plaza and The Rainbow Room), and higher peak-season demand. DJ DX offers transparent custom quotes for Manhattan weddings — contact bookings@djdxmusic.com for availability."}
                },
                {
                  "@type": "Question",
                  "name": "Is DJ DX available for top Manhattan wedding venues?",
                  "acceptedAnswer": {"@type": "Answer", "text": "Yes. DJ DX is available for weddings at Manhattan's premier venues — Cipriani 25 Broadway, Tribeca Rooftop, Pier Sixty at Chelsea Piers, Capitale, The Bowery Hotel, 620 Loft & Garden, The Glasshouses, Tribeca 360, and Midtown hotel ballrooms. Setup is professional-grade, sound coordination is handled with venue staff in advance, and load-in is planned to match each venue's requirements."}
                },
                {
                  "@type": "Question",
                  "name": "Does DJ DX handle Manhattan venue sound restrictions?",
                  "acceptedAnswer": {"@type": "Answer", "text": "Yes. Many Manhattan rooftop and outdoor venues have strict decibel limits (often 85-90 dB) and curfews (typically 10pm-11pm for outdoor). DJ DX works closely with venue coordinators in advance to confirm sound specs, deliver compliant audio, and maximize energy within limits."}
                },
                {
                  "@type": "Question",
                  "name": "How early should we book a wedding DJ in Manhattan?",
                  "acceptedAnswer": {"@type": "Answer", "text": "For Manhattan weddings, book 9-14 months in advance — especially for fall (September-October) and spring (April-May) peak seasons. Saturday dates at top venues like The Plaza, Cipriani, and Tribeca Rooftop typically book DJs 12+ months out."}
                }
              ]
            },
            {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              "itemListElement": [
                {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://djdxmusic.com/"},
                {"@type": "ListItem", "position": 2, "name": "Wedding DJ Manhattan NYC", "item": "https://djdxmusic.com/wedding-dj-manhattan-nyc"}
              ]
            }
          ]`}
        </script>
      </Helmet>

      <SiteNav />

      <section className="epk-hero" style={{ minHeight: '65vh', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
        <div className="epk-hero-bg" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
          <img src="/epk-hero.jpg" alt="Wedding DJ in Manhattan NYC — DJ DX performing at reception" width="1920" height="1080" fetchPriority="high" loading="eager" decoding="async" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 20%', filter: 'contrast(1.05) saturate(1.1)' }} />
        </div>
        <div className="epk-hero-overlay" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to bottom, rgba(12,12,12,0.2) 0%, rgba(12,12,12,0.92) 100%)' }} />
        <div className="section-inner" style={{ position: 'relative', zIndex: 10, textAlign: 'center' }}>
          <div className="sec-overline" style={{ justifyContent: 'center' }}>
            <span className="sec-label">Manhattan · New York City</span>
          </div>
          <h1 className="sec-title" style={{ fontSize: 'clamp(2.4rem, 6vw, 4.5rem)', marginBottom: '1.2rem' }}>
            Manhattan Wedding DJ — <span>Built for the City That Never Sleeps</span>
          </h1>
          <p style={{ maxWidth: '640px', margin: '0 auto 2rem', fontSize: '1.1rem', color: 'rgba(242,242,242,0.72)', lineHeight: 1.7 }}>
            Tribeca rooftops. Ballroom receptions. Downtown lofts. 20+ years of NYC DJ experience.
            R&amp;B, Hip-Hop, Afrobeats, and blends that move every crowd.
          </p>
          <a href="#booking" className="btn-gold">Check Availability</a>
        </div>
      </section>

      <section className="about">
        <div className="section-inner">
          <div className="about-layout">
            <div>
              <div className="sec-header sr">
                <div className="sec-overline"><span className="sec-label">Why Manhattan Couples Choose DJ DX</span></div>
                <h2 className="sec-title">Manhattan Weddings <span>Demand More</span></h2>
              </div>
              <div className="about-body sr" data-sr-delay="0.1s">
                <p>A Manhattan wedding isn't just an event — it's a production. Strict venue curfews. Union requirements at landmark venues. Decibel limits on rooftop terraces. Guest lists that span every culture, generation, and music taste. The DJ has to deliver everything, perfectly, within tight constraints.</p>
                <p>DJ DX has spent over two decades working New York City events — performing at TEDxYouth@RVA, on tour throughout Latin America as "El Negro," and across NYC nightlife and private events. Every Manhattan venue has its own technical playbook, and the professional-grade setup is built to handle each room's load-in, curfew, and sound requirements.</p>
                <p>Music-wise, Manhattan crowds are sophisticated. They've heard the wedding-DJ Top 40 a thousand times. What gets them on the floor is a curated arc: open with Sade or Maxwell during cocktail hour, build through hip-hop classics, bring it home with Afrobeats and Amapiano for the late crowd. That's what DJ DX does.</p>
              </div>
            </div>
            <div className="about-aside">
              {[
                { num: '20+', label: 'Years in NYC', sub: 'DJing across New York City' },
                { num: 'TED', label: 'Featured Artist', sub: 'TEDxYouth@RVA 2022' },
                { num: '100+', label: 'Original Blends', sub: 'Custom for every couple' },
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
              <span className="sec-overline-line" /><span className="sec-label">Manhattan Venues</span><span className="sec-overline-line" />
            </div>
            <h2 className="sec-title">Available For <span>Manhattan's Premier Venues</span></h2>
          </div>
          <div className="services-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', marginTop: '48px' }}>
            {[
              { title: 'Cipriani 25 Broadway', desc: 'Landmark Financial District ballroom — built for grand-scale receptions with full-night DJ sets.' },
              { title: 'Tribeca Rooftop', desc: 'Skyline-view rooftop — curfew-aware mixing and decibel-compliant setups handled professionally.' },
              { title: 'Pier Sixty at Chelsea Piers', desc: 'Hudson River waterfront — DJ + emcee coverage from cocktail hour through last dance.' },
              { title: 'Capitale', desc: 'Bowery banking-hall ballroom — marble acoustics paired with signature blends.' },
              { title: 'The Bowery Hotel', desc: 'Boutique downtown receptions — intimate venues that still need high-energy programming.' },
              { title: '620 Loft & Garden', desc: 'Rockefeller Center rooftop — premium service for premium Midtown guest lists.' },
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
            <h2 className="sec-title">Manhattan Wedding DJ <span>FAQ</span></h2>
          </div>
          <div style={{ marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {[
              { q: 'How much does a Manhattan wedding DJ cost?', a: 'Manhattan wedding DJ pricing typically ranges from $2,500 to $7,500+ depending on venue, duration, and package. Manhattan weddings command premium rates due to venue load-in complexity, union requirements at some venues (like The Plaza and The Rainbow Room), and higher peak-season demand. DJ DX offers transparent custom quotes — contact bookings@djdxmusic.com.' },
              { q: 'Is DJ DX available for top Manhattan wedding venues?', a: 'Yes. DJ DX is available for weddings at Manhattan\'s premier venues — Cipriani 25 Broadway, Tribeca Rooftop, Pier Sixty at Chelsea Piers, Capitale, The Bowery Hotel, 620 Loft & Garden, The Glasshouses, Tribeca 360, and Midtown hotel ballrooms. Setup is professional-grade, sound coordination is handled with venue staff in advance, and load-in is planned to match each venue\'s requirements.' },
              { q: 'Does DJ DX handle Manhattan venue sound restrictions?', a: 'Yes. Many Manhattan rooftop and outdoor venues have strict decibel limits (often 85-90 dB) and curfews (typically 10pm-11pm for outdoor). DJ DX works closely with venue coordinators in advance to confirm sound specs and deliver compliant audio.' },
              { q: 'How early should we book a wedding DJ in Manhattan?', a: 'For Manhattan weddings, book 9-14 months in advance — especially for fall (September-October) and spring (April-May) peak seasons. Saturday dates at top venues typically book DJs 12+ months out.' },
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
              <div className="sec-overline"><span className="sec-label">Book Your Manhattan Wedding</span></div>
              <h2 className="sec-title">Request a <span>Manhattan Wedding DJ Quote</span></h2>
              <p style={{ color: 'rgba(242,242,242,0.55)', lineHeight: 1.8, marginTop: '16px' }}>
                Fill out the form and DJ DX will get back to you within 24 hours with availability and pricing for your Manhattan wedding date.
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
