import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import SiteNav from '../../components/SiteNav';
import SiteFooter from '../../components/SiteFooter';
import BookingForm from '../../components/BookingForm';

export default function WeddingDJWestchester() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <>
      <Helmet>
        <title>Wedding DJ Westchester NY | Tarrytown, Rye, Scarsdale | DJ DX</title>
        <meta name="description" content="Westchester County wedding DJ — DJ DX performs at premier venues including Tappan Hill Mansion, The Briarcliff Manor, Sleepy Hollow Country Club, and The Castle Hotel. R&B, Hip-Hop, Afrobeats." />
        <link rel="canonical" href="https://djdxmusic.com/wedding-dj-westchester-ny" />
        <meta property="og:title" content="Wedding DJ Westchester NY — DJ DX" />
        <meta property="og:description" content="Westchester County's premier wedding DJ. Performances in Tarrytown, Rye, Scarsdale, Yonkers, and White Plains. Refined receptions with NYC-level production." />
        <meta property="og:url" content="https://djdxmusic.com/wedding-dj-westchester-ny" />
        <meta property="og:image" content="https://djdxmusic.com/epk-hero.jpg" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">
          {`[
            {
              "@context": "https://schema.org",
              "@type": "Service",
              "name": "Wedding DJ Westchester County NY",
              "serviceType": "Wedding DJ",
              "url": "https://djdxmusic.com/wedding-dj-westchester-ny",
              "description": "DJ DX is a Westchester County wedding DJ serving Tarrytown, Rye, Scarsdale, Yonkers, White Plains, and Hudson Valley. Performances at Tappan Hill Mansion, The Briarcliff Manor, Sleepy Hollow Country Club, The Castle Hotel, and historic estates throughout Westchester.",
              "provider": {
                "@type": ["EntertainmentBusiness", "LocalBusiness"],
                "name": "DJ DX",
                "url": "https://djdxmusic.com/",
                "image": "https://djdxmusic.com/epk-hero.jpg",
                "email": "djdxbusiness@gmail.com",
                "priceRange": "$$-$$$",
                "address": {
                  "@type": "PostalAddress",
                  "addressLocality": "New York",
                  "addressRegion": "NY",
                  "addressCountry": "US"
                }
              },
              "areaServed": [
                {"@type": "City", "name": "Tarrytown"},
                {"@type": "City", "name": "Rye"},
                {"@type": "City", "name": "Scarsdale"},
                {"@type": "City", "name": "Yonkers"},
                {"@type": "City", "name": "White Plains"},
                {"@type": "City", "name": "New Rochelle"},
                {"@type": "City", "name": "Bronxville"},
                {"@type": "City", "name": "Mount Kisco"},
                {"@type": "City", "name": "Chappaqua"},
                {"@type": "City", "name": "Briarcliff Manor"},
                {"@type": "AdministrativeArea", "name": "Westchester County"},
                {"@type": "AdministrativeArea", "name": "Hudson Valley"}
              ]
            },
            {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "How much does a wedding DJ cost in Westchester County?",
                  "acceptedAnswer": {"@type": "Answer", "text": "Westchester County wedding DJ pricing typically ranges from $1,800 to $5,500+ depending on venue, duration, and package. Premier venues like Tappan Hill Mansion, Sleepy Hollow Country Club, and The Castle Hotel command higher rates. DJ DX offers custom transparent quotes — contact djdxbusiness@gmail.com."}
                },
                {
                  "@type": "Question",
                  "name": "What Westchester wedding venues does DJ DX know?",
                  "acceptedAnswer": {"@type": "Answer", "text": "DJ DX has experience at Westchester County wedding venues including Tappan Hill Mansion (Tarrytown), The Briarcliff Manor, Sleepy Hollow Country Club, The Castle Hotel & Spa (Tarrytown), Glen Island Harbour Club (New Rochelle), Crabtree's Kittle House (Chappaqua), and various Hudson Valley estates."}
                },
                {
                  "@type": "Question",
                  "name": "How long is the drive from NYC to Westchester?",
                  "acceptedAnswer": {"@type": "Answer", "text": "Most Westchester wedding venues are 30-45 minutes from Manhattan via the Henry Hudson Parkway or I-87. DJ DX includes Westchester in the regular tri-state circuit — no travel fees added for venues within 50 miles of NYC."}
                },
                {
                  "@type": "Question",
                  "name": "How early should we book a Westchester wedding DJ?",
                  "acceptedAnswer": {"@type": "Answer", "text": "Book 8-12 months in advance for Westchester County weddings. Peak season (May-October) Saturday dates at top venues like Tappan Hill, Sleepy Hollow Country Club, and The Castle Hotel fill 12+ months out."}
                }
              ]
            },
            {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              "itemListElement": [
                {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://djdxmusic.com/"},
                {"@type": "ListItem", "position": 2, "name": "Wedding DJ Westchester NY", "item": "https://djdxmusic.com/wedding-dj-westchester-ny"}
              ]
            }
          ]`}
        </script>
      </Helmet>

      <SiteNav />

      <section className="epk-hero" style={{ minHeight: '65vh', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
        <div className="epk-hero-bg" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
          <img src="/epk-hero.jpg" alt="Wedding DJ in Westchester County NY — DJ DX performing at reception" width="1920" height="1080" fetchPriority="high" loading="eager" decoding="async" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 20%', filter: 'contrast(1.05) saturate(1.1)' }} />
        </div>
        <div className="epk-hero-overlay" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to bottom, rgba(12,12,12,0.2) 0%, rgba(12,12,12,0.92) 100%)' }} />
        <div className="section-inner" style={{ position: 'relative', zIndex: 10, textAlign: 'center' }}>
          <div className="sec-overline" style={{ justifyContent: 'center' }}>
            <span className="sec-label">Westchester County · Hudson Valley</span>
          </div>
          <h1 className="sec-title" style={{ fontSize: 'clamp(2.4rem, 6vw, 4.5rem)', marginBottom: '1.2rem' }}>
            Westchester Wedding DJ — <span>Hudson Valley Refined</span>
          </h1>
          <p style={{ maxWidth: '640px', margin: '0 auto 2rem', fontSize: '1.1rem', color: 'rgba(242,242,242,0.72)', lineHeight: 1.7 }}>
            Tappan Hill. The Castle Hotel. Sleepy Hollow Country Club. Briarcliff Manor.
            NYC-trained DJ, Westchester polish.
          </p>
          <a href="#booking" className="btn-gold">Check Availability</a>
        </div>
      </section>

      <section className="about">
        <div className="section-inner">
          <div className="about-layout">
            <div>
              <div className="sec-header sr">
                <div className="sec-overline"><span className="sec-label">Why Westchester Couples Book DJ DX</span></div>
                <h2 className="sec-title">Westchester Weddings <span>Want Both</span></h2>
              </div>
              <div className="about-body sr" data-sr-delay="0.1s">
                <p>Westchester County couples want NYC-level production with Hudson Valley elegance. The venues — Tappan Hill Mansion, The Castle Hotel, Sleepy Hollow Country Club — are some of the most beautiful in the region. The music has to live up to the room without overwhelming it.</p>
                <p>DJ DX brings 20+ years of NYC wedding experience to Westchester. The same custom-curated approach, the same R&amp;B and Hip-Hop deep cuts, the same Afrobeats and Old School blends — delivered with the polish that Hudson Valley couples expect.</p>
                <p>Westchester is part of the regular tri-state circuit. 30-45 minutes from Manhattan via the Henry Hudson or I-87. No travel premium added — Westchester rates match NYC rates for venues within 50 miles.</p>
              </div>
            </div>
            <div className="about-aside">
              {[
                { num: '45min', label: 'NYC to Tarrytown', sub: 'Clean tri-state logistics' },
                { num: '20+', label: 'Years Experience', sub: 'Hudson Valley + NYC weddings' },
                { num: 'Premier', label: 'Venue Network', sub: 'Castles, mansions, country clubs' },
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
              <span className="sec-overline-line" /><span className="sec-label">Westchester Venues</span><span className="sec-overline-line" />
            </div>
            <h2 className="sec-title">Hudson Valley <span>Wedding Venues</span></h2>
          </div>
          <div className="services-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', marginTop: '48px' }}>
            {[
              { title: 'Tappan Hill Mansion', desc: 'Tarrytown landmark — hilltop estate weddings with Hudson River views.' },
              { title: 'The Castle Hotel & Spa', desc: 'Tarrytown castle — fairytale ceremonies with refined receptions.' },
              { title: 'Sleepy Hollow Country Club', desc: 'Briarcliff Manor — private-club elegance with full-night entertainment.' },
              { title: 'The Briarcliff Manor', desc: 'Multi-cultural Westchester weddings with grand reception spaces.' },
              { title: 'Glen Island Harbour Club', desc: 'New Rochelle waterfront — sunset ceremonies, evening receptions.' },
              { title: 'Crabtree\'s Kittle House', desc: 'Chappaqua boutique inn — intimate weddings with curated experiences.' },
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
            <h2 className="sec-title">Westchester Wedding DJ <span>FAQ</span></h2>
          </div>
          <div style={{ marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {[
              { q: 'How much does a wedding DJ cost in Westchester County?', a: 'Westchester County wedding DJ pricing typically ranges from $1,800 to $5,500+ depending on venue, duration, and package. Premier venues like Tappan Hill Mansion, Sleepy Hollow Country Club, and The Castle Hotel command higher rates. DJ DX offers custom transparent quotes — contact djdxbusiness@gmail.com.' },
              { q: 'What Westchester wedding venues does DJ DX know?', a: 'DJ DX has experience at Westchester County wedding venues including Tappan Hill Mansion (Tarrytown), The Briarcliff Manor, Sleepy Hollow Country Club, The Castle Hotel & Spa (Tarrytown), Glen Island Harbour Club (New Rochelle), Crabtree\'s Kittle House (Chappaqua), and various Hudson Valley estates.' },
              { q: 'How long is the drive from NYC to Westchester?', a: 'Most Westchester wedding venues are 30-45 minutes from Manhattan via the Henry Hudson Parkway or I-87. DJ DX includes Westchester in the regular tri-state circuit — no travel fees added for venues within 50 miles of NYC.' },
              { q: 'How early should we book a Westchester wedding DJ?', a: 'Book 8-12 months in advance for Westchester County weddings. Peak season (May-October) Saturday dates at top venues like Tappan Hill, Sleepy Hollow Country Club, and The Castle Hotel fill 12+ months out.' },
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
              <div className="sec-overline"><span className="sec-label">Book Your Westchester Wedding</span></div>
              <h2 className="sec-title">Request a <span>Westchester Wedding DJ Quote</span></h2>
              <p style={{ color: 'rgba(242,242,242,0.55)', lineHeight: 1.8, marginTop: '16px' }}>
                Fill out the form and DJ DX will get back to you within 24 hours with availability and pricing for your Westchester County wedding date.
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
