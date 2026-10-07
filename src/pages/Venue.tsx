import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useParams } from 'react-router-dom';
import SiteNav from '../components/SiteNav';
import SiteFooter from '../components/SiteFooter';
import BookingForm from '../components/BookingForm';
import AuthorBio from '../components/AuthorBio';
import StickyMobileCTA from '../components/StickyMobileCTA';
import RichText from '../components/RichText';
import { venueBySlug, VENUES } from '../data/venues';

// One template for every /venues/<slug> page. Content lives in
// src/data/venues.ts.
export default function Venue() {
  const { slug = '' } = useParams();
  const v = venueBySlug(slug);
  useEffect(() => { window.scrollTo(0, 0); }, [slug]);

  if (!v) {
    return (
      <>
        <Helmet><title>Venue not found | DJ DX</title><meta name="robots" content="noindex" /></Helmet>
        <SiteNav />
        <main className="vn-main"><div className="vn-inner"><h1 className="sec-title">Venue not found</h1>
          <p className="vn-p">See <Link to="/venues">all venues DJ DX has played</Link>.</p></div></main>
        <SiteFooter />
      </>
    );
  }

  const url = `https://djdxmusic.com/venues/${v.slug}`;
  const place = {
    '@type': 'Place',
    name: v.name,
    ...(v.address ? { address: { '@type': 'PostalAddress', streetAddress: v.address.street, addressLocality: v.address.locality, addressRegion: v.address.region, postalCode: v.address.postalCode, addressCountry: 'US' } } : {}),
  };
  const schema: object[] = [
    { '@context': 'https://schema.org', '@type': 'WebPage', name: v.h1, url, description: v.description, about: place, mentions: { '@id': 'https://djdxmusic.com/#djdx' } },
    {
      '@context': 'https://schema.org', '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://djdxmusic.com/' },
        { '@type': 'ListItem', position: 2, name: 'Venues', item: 'https://djdxmusic.com/venues' },
        { '@type': 'ListItem', position: 3, name: v.name, item: url },
      ],
    },
  ];
  if (v.photos?.length) {
    schema.push(...v.photos.map(ph => ({
      '@context': 'https://schema.org', '@type': 'ImageObject', contentUrl: `https://djdxmusic.com${ph.src}.jpg`,
      caption: ph.alt, creator: { '@id': 'https://djdxmusic.com/#djdx' }, copyrightHolder: { '@id': 'https://djdxmusic.com/#djdx' },
    })));
  }
  if (v.video) {
    schema.push({
      '@context': 'https://schema.org', '@type': 'VideoObject', name: v.video.name, description: v.video.description,
      thumbnailUrl: `https://djdxmusic.com${v.video.poster}`, contentUrl: `https://djdxmusic.com${v.video.src}`,
      uploadDate: v.video.uploadDate, duration: v.video.duration, creator: { '@id': 'https://djdxmusic.com/#djdx' },
      contentLocation: place,
    });
  }
  if (v.event) {
    schema.push({
      '@context': 'https://schema.org', '@type': 'MusicEvent', name: v.event.name, startDate: v.event.startDate,
      eventStatus: 'https://schema.org/EventScheduled', eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
      location: place, performer: { '@id': 'https://djdxmusic.com/#djdx' },
    });
  }
  const others = VENUES.filter(o => o.slug !== v.slug);

  return (
    <>
      <Helmet>
        <title>{v.title}</title>
        <meta name="description" content={v.description} />
        <link rel="canonical" href={url} />
        <meta property="og:title" content={v.title} />
        <meta property="og:description" content={v.description} />
        <meta property="og:url" content={url} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={`https://djdxmusic.com${v.image?.src || (v.photos?.[0] ? `${v.photos[0].src}.jpg` : '/epk-hero.jpg')}`} />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </Helmet>
      <SiteNav />

      <main className="vn-main">
        <div className="vn-inner">
          <nav className="vn-crumbs" aria-label="Breadcrumb"><Link to="/venues">Venues</Link> <span aria-hidden="true">/</span> {v.name}</nav>
          <div className="sec-overline"><span className="sec-label">{v.overline}</span></div>
          <h1 className="sec-title vn-h1">{v.h1}</h1>
          {v.intro.map((p, i) => <p className="vn-p vn-lead" key={i}><RichText text={p} /></p>)}
          {v.image && <img className="vn-img" src={v.image.src} alt={v.image.alt} width="1200" height="800" loading="eager" decoding="async" />}
          {v.video && (
            <figure className={`vn-video${v.video.w > v.video.h ? ' vn-video--wide' : ''}`}>
              <video controls playsInline preload="none" poster={v.video.poster} src={v.video.src} aria-label={v.video.name} width={v.video.w} height={v.video.h} style={{ aspectRatio: `${v.video.w} / ${v.video.h}` }} />
              <figcaption>{v.video.name}</figcaption>
            </figure>
          )}
          {v.photos && v.photos.length > 0 && (
            <div className="vn-gallery">
              {v.photos.map((ph, i) => (
                <picture key={ph.src}>
                  <source type="image/webp" srcSet={`${ph.src}.webp`} />
                  <img src={`${ph.src}.jpg`} alt={ph.alt} width={ph.w} height={ph.h} loading={i === 0 ? 'eager' : 'lazy'} decoding="async" />
                </picture>
              ))}
            </div>
          )}

          {v.sections.map(s => (
            <div className="vn-sec" key={s.h2}>
              <h2 className="vn-h2">{s.h2}</h2>
              {s.paras?.map((p, i) => <p className="vn-p" key={i}><RichText text={p} /></p>)}
              {s.bullets && <ul className="vn-list">{s.bullets.map(b => <li key={b}><RichText text={b} /></li>)}</ul>}
            </div>
          ))}

          <div className="vn-sec">
            <h2 className="vn-h2">Other venues DJ DX has played</h2>
            <ul className="vn-others">
              {others.map(o => <li key={o.slug}><Link to={`/venues/${o.slug}`}>{o.name}</Link><span>{o.area}</span></li>)}
              <li><Link to="/venues">All venues</Link><span>NYC, Long Island and New Jersey</span></li>
            </ul>
          </div>
        </div>
      </main>

      <AuthorBio />

      <section id="booking" className="booking" style={{ padding: '80px 40px' }}>
        <div className="section-inner">
          <div className="booking-layout">
            <div className="booking-left">
              <div className="sec-overline"><span className="sec-label">Book DJ DX</span></div>
              <h2 className="sec-title">Check Your <span>Date</span></h2>
              <p style={{ color: 'rgba(242,242,242,0.6)', lineHeight: 1.8, marginTop: '16px' }}>{v.cta}</p>
            </div>
            <div className="booking-right"><BookingForm initial={{ eventType: v.bookingEventType }} /></div>
          </div>
        </div>
      </section>

      <StickyMobileCTA formName={`venue_${v.slug.replace(/-/g, '_')}_sticky`} label="Check My Date" />
      <SiteFooter />
    </>
  );
}
