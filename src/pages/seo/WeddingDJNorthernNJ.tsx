import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import SiteNav from '../../components/SiteNav';
import SiteFooter from '../../components/SiteFooter';
import BookingForm from '../../components/BookingForm';

export default function WeddingDJNorthernNJ() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <>
      <Helmet>
        <title>Wedding DJ Northern NJ | Newark, Jersey City, Hoboken, Bergen County | DJ DX</title>
        <meta name="description" content="Northern New Jersey wedding DJ — DJ DX performs at premier NJ venues including The Venetian, Liberty House, Park Avenue Club, and The Tides Estate. R&B, Hip-Hop, Afrobeats, Latin." />
        <link rel="canonical" href="https://djdxmusic.com/wedding-dj-northern-nj" />
        <meta property="og:title" content="Wedding DJ Northern NJ — DJ DX" />
        <meta property="og:description" content="Northern New Jersey's go-to wedding DJ. Performances in Newark, Jersey City, Hoboken, Bergen County, and Essex County. Multi-cultural NJ weddings done right." />
        <meta property="og:url" content="https://djdxmusic.com/wedding-dj-northern-nj" />
        <meta property="og:image" content="https://djdxmusic.com/epk-hero.jpg" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">
          {`[
            {
              "@context": "https://schema.org",
              "@type": "Service",
              "name": "Wedding DJ Northern New Jersey — Newark, Jersey City, Hoboken, Bergen County",
              "serviceType": "Wedding DJ",
              "url": "https://djdxmusic.com/wedding-dj-northern-nj",
              "description": "DJ DX is a Northern New Jersey wedding DJ serving Newark, Jersey City, Hoboken, Bergen County, Essex County, and Union County. Performances at premier NJ venues including The Venetian (Garfield), Liberty House (Jersey City), Park Avenue Club (Florham Park), and The Tides Estate (North Haledon).",
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
                {"@type": "City", "name": "Newark"},
                {"@type": "City", "name": "Jersey City"},
                {"@type": "City", "name": "Hoboken"},
                {"@type": "City", "name": "Paterson"},
                {"@type": "City", "name": "Clifton"},
                {"@type": "City", "name": "Elizabeth"},
                {"@type": "City", "name": "Union City"},
                {"@type": "AdministrativeArea", "name": "Bergen County"},
                {"@type": "AdministrativeArea", "name": "Essex County"},
                {"@type": "AdministrativeArea", "name": "Union County"},
                {"@type": "AdministrativeArea", "name": "Hudson County"},
                {"@type": "AdministrativeArea", "name": "Passaic County"}
              ]
            },
            {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "How much does a wedding DJ cost in Northern NJ?",
                  "acceptedAnswer": {"@type": "Answer", "text": "Northern New Jersey wedding DJ pricing typically ranges from $1,500 to $4,500+ depending on venue, duration, and package. Premier venues like The Venetian, Liberty House, and Park Avenue Club command higher rates due to event scale. DJ DX offers custom transparent quotes — contact djdxbusiness@gmail.com."}
                },
                {
                  "@type": "Question",
                  "name": "What Northern NJ wedding venues does DJ DX know?",
                  "acceptedAnswer": {"@type": "Answer", "text": "DJ DX has experience at Northern NJ wedding venues including The Venetian (Garfield), Liberty House (Jersey City — Manhattan skyline views), Park Avenue Club (Florham Park), The Tides Estate (North Haledon), Maritime Parc (Jersey City), The Brownstone (Paterson), and Eagle Oaks Country Club. Multi-cultural NJ weddings are a specialty."}
                },
                {
                  "@type": "Question",
                  "name": "Does DJ DX handle multi-cultural and bilingual NJ weddings?",
                  "acceptedAnswer": {"@type": "Answer", "text": "Yes — and this is one of the strongest fits for Northern NJ. As 'El Negro' across Latin America, DJ DX brings deep Reggaeton, Spanish, Bachata, and Latin Hip-Hop catalog. Combined with R&B, Afrobeats, Old School, and traditional wedding sets, DJ DX serves Hispanic, Caribbean, African, and multi-cultural NJ couples with authentic music — not generic playlists."}
                },
                {
                  "@type": "Question",
                  "name": "How early should we book a Northern NJ wedding DJ?",
                  "acceptedAnswer": {"@type": "Answer", "text": "Book 6-12 months in advance for Northern NJ weddings. Peak season (May-October) Saturday dates at premier venues fill 9-12 months out. Reach out as early as possible to confirm availability."}
                }
              ]
            },
            {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              "itemListElement": [
                {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://djdxmusic.com/"},
                {"@type": "ListItem", "position": 2, "name": "Wedding DJ Northern NJ", "item": "https://djdxmusic.com/wedding-dj-northern-nj"}
              ]
            }
          ]`}
        </script>
      </Helmet>

      <SiteNav />

      <section className="epk-hero" style={{ minHeight: '65vh', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
        <div className="epk-hero-bg" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
          <img src="/epk-hero.jpg" alt="Wedding DJ in Northern New Jersey — DJ DX performing at reception" width="1920" height="1080" fetchPriority="high" loading="eager" decoding="async" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 20%', filter: 'contrast(1.05) saturate(1.1)' }} />
        </div>
        <div className="epk-hero-overlay" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to bottom, rgba(12,12,12,0.2) 0%, rgba(12,12,12,0.92) 100%)' }} />
        <div className="section-inner" style={{ position: 'relative', zIndex: 10, textAlign: 'center' }}>
          <div className="sec-overline" style={{ justifyContent: 'center' }}>
            <span className="sec-label">Northern NJ · Newark · Jersey City · Bergen</span>
          </div>
          <h1 className="sec-title" style={{ fontSize: 'clamp(2.4rem, 6vw, 4.5rem)', marginBottom: '1.2rem' }}>
            Northern NJ Wedding DJ — <span>Built for Multi-Cultural Celebrations</span>
          </h1>
          <p style={{ maxWidth: '640px', margin: '0 auto 2rem', fontSize: '1.1rem', color: 'rgba(242,242,242,0.72)', lineHeight: 1.7 }}>
            The Venetian. Liberty House. Park Avenue Club. The Tides.
            R&amp;B, Hip-Hop, Afrobeats, Latin, Reggaeton — the music NJ weddings actually want.
          </p>
          <a href="#booking" className="btn-gold">Check Availability</a>
        </div>
      </section>

      <section className="about">
        <div className="section-inner">
          <div className="about-layout">
            <div>
              <div className="sec-header sr">
                <div className="sec-overline"><span className="sec-label">Why Northern NJ Couples Book DJ DX</span></div>
                <h2 className="sec-title">Northern NJ Weddings Are <span>The Whole World on One Dance Floor</span></h2>
              </div>
              <div className="about-body sr" data-sr-delay="0.1s">
                <p>Northern New Jersey has the most diverse wedding scene in America. One reception will mix Dominican families from Paterson, Nigerian guests from Newark, Italian grandparents from Bergen County, Indian aunties from Edison, and Brooklyn-bred millennials all on the same floor. The DJ has to play all of them.</p>
                <p>DJ DX brings exactly that fluency. Known across Latin America as <strong>El Negro</strong> through the Hood Reggaeton series, with deep Afrobeats and Amapiano catalogs, plus R&amp;B, Hip-Hop, Old School, and traditional reception staples. The dance floor never empties because somebody always recognizes the next song.</p>
                <p>Premier NJ venues — The Venetian, Liberty House with Manhattan skyline views, Park Avenue Club, The Tides Estate — are part of the regular booking circuit. DJ DX knows the rooms, the load-in patterns, the catering teams, and how to coordinate with NJ wedding planners.</p>
              </div>
            </div>
            <div className="about-aside">
              {[
                { num: 'Multi', label: 'Cultural Fluency', sub: 'Latin · African · Caribbean · NYC' },
                { num: '20+', label: 'Years in NJ', sub: 'Newark to Bergen County' },
                { num: 'Bilingual', label: 'English & Spanish', sub: 'Emcee in both languages' },
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
              <span className="sec-overline-line" /><span className="sec-label">NJ Venues</span><span className="sec-overline-line" />
            </div>
            <h2 className="sec-title">Northern NJ <span>Wedding Venues</span></h2>
          </div>
          <div className="services-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', marginTop: '48px' }}>
            {[
              { title: 'The Venetian', desc: 'Garfield landmark — grand ballroom weddings with full-event entertainment programs.' },
              { title: 'Liberty House', desc: 'Jersey City waterfront — Manhattan skyline ceremonies with curfew-aware mixing.' },
              { title: 'Park Avenue Club', desc: 'Florham Park elegance — refined ballroom receptions for Bergen and Morris County couples.' },
              { title: 'The Tides Estate', desc: 'North Haledon estate — outdoor ceremonies and grand reception spaces.' },
              { title: 'Maritime Parc', desc: 'Jersey City waterfront restaurant — boutique modern weddings.' },
              { title: 'The Brownstone', desc: 'Paterson historic venue — multi-cultural NJ wedding home base.' },
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
            <h2 className="sec-title">Northern NJ Wedding DJ <span>FAQ</span></h2>
          </div>
          <div style={{ marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {[
              { q: 'How much does a wedding DJ cost in Northern NJ?', a: 'Northern New Jersey wedding DJ pricing typically ranges from $1,500 to $4,500+ depending on venue, duration, and package. Premier venues like The Venetian, Liberty House, and Park Avenue Club command higher rates. DJ DX offers custom transparent quotes — contact djdxbusiness@gmail.com.' },
              { q: 'What Northern NJ wedding venues does DJ DX know?', a: 'DJ DX has experience at Northern NJ wedding venues including The Venetian (Garfield), Liberty House (Jersey City), Park Avenue Club (Florham Park), The Tides Estate (North Haledon), Maritime Parc (Jersey City), The Brownstone (Paterson), and Eagle Oaks Country Club.' },
              { q: 'Does DJ DX handle multi-cultural and bilingual NJ weddings?', a: 'Yes — and this is one of the strongest fits for Northern NJ. As "El Negro" across Latin America, DJ DX brings deep Reggaeton, Spanish, Bachata, and Latin Hip-Hop catalog. Combined with R&B, Afrobeats, Old School, and traditional wedding sets, DJ DX serves Hispanic, Caribbean, African, and multi-cultural NJ couples authentically.' },
              { q: 'How early should we book a Northern NJ wedding DJ?', a: 'Book 6-12 months in advance for Northern NJ weddings. Peak season (May-October) Saturday dates at premier venues fill 9-12 months out. Reach out as early as possible to confirm availability.' },
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
              <div className="sec-overline"><span className="sec-label">Book Your NJ Wedding</span></div>
              <h2 className="sec-title">Request a <span>Northern NJ Wedding DJ Quote</span></h2>
              <p style={{ color: 'rgba(242,242,242,0.55)', lineHeight: 1.8, marginTop: '16px' }}>
                Fill out the form and DJ DX will get back to you within 24 hours with availability and pricing for your Northern NJ wedding date.
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
