import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useParams } from 'react-router-dom';
import SiteNav from '../components/SiteNav';
import SiteFooter from '../components/SiteFooter';
import BookingForm from '../components/BookingForm';
import AuthorBio from '../components/AuthorBio';
import StickyMobileCTA from '../components/StickyMobileCTA';
import RichText from '../components/RichText';
import { caseStudyBySlug, CASE_STUDIES } from '../data/caseStudies';

// One template for every /work/<slug> case study. Content lives in
// src/data/caseStudies.ts. Uses the venue page styles (vn-*) in service.css.
export default function CaseStudy() {
  const { slug = '' } = useParams();
  const c = caseStudyBySlug(slug);
  useEffect(() => { window.scrollTo(0, 0); }, [slug]);

  if (!c) {
    return (
      <>
        <Helmet><title>Case study not found | DJ DX</title><meta name="robots" content="noindex" /></Helmet>
        <SiteNav />
        <main className="vn-main"><div className="vn-inner"><h1 className="sec-title">Case study not found</h1>
          <p className="vn-p">See <Link to="/work">all DJ DX case studies</Link>.</p></div></main>
        <SiteFooter />
      </>
    );
  }

  const url = `https://djdxmusic.com/work/${c.slug}`;
  const place = {
    '@type': 'Place',
    name: c.venueName || c.venueArea,
    ...(c.venueAddress
      ? { address: { '@type': 'PostalAddress', streetAddress: c.venueAddress.street, addressLocality: c.venueAddress.locality, addressRegion: c.venueAddress.region, postalCode: c.venueAddress.postalCode, addressCountry: 'US' } }
      : { address: { '@type': 'PostalAddress', addressLocality: c.venueArea.split(',')[0], addressRegion: 'NY', addressCountry: 'US' } }),
  };
  const schema: object[] = [
    {
      '@context': 'https://schema.org', '@type': 'Article', headline: c.h1, description: c.description, url,
      mainEntityOfPage: url, image: `https://djdxmusic.com${c.photos[0].src}`,
      author: { '@id': 'https://djdxmusic.com/#djdx' }, publisher: { '@id': 'https://djdxmusic.com/#service' },
      datePublished: '2026-11-23', isPartOf: { '@id': 'https://djdxmusic.com/#website' },
      about: { '@type': 'Organization', name: c.client },
    },
    {
      '@context': 'https://schema.org', '@type': 'MusicEvent', name: `${c.client} event${c.venueName ? ` at ${c.venueName}` : ''}`,
      startDate: c.date, eventStatus: 'https://schema.org/EventScheduled', eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
      location: place,
      performer: c.soulShades
        ? [{ '@id': 'https://djdxmusic.com/#djdx' }, { '@type': 'MusicGroup', '@id': 'https://soulshadesmusic.com/#soulshades', name: 'Soul Shades', url: 'https://soulshadesmusic.com/' }]
        : { '@id': 'https://djdxmusic.com/#djdx' },
    },
    {
      '@context': 'https://schema.org', '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://djdxmusic.com/' },
        { '@type': 'ListItem', position: 2, name: 'Case Studies', item: 'https://djdxmusic.com/work' },
        { '@type': 'ListItem', position: 3, name: c.client, item: url },
      ],
    },
    ...c.photos.map(ph => ({
      '@context': 'https://schema.org', '@type': 'ImageObject', contentUrl: `https://djdxmusic.com${ph.src}`, caption: ph.alt,
      ...(ph.credit
        ? { creator: { '@type': 'Person', name: ph.credit }, creditText: ph.credit, copyrightNotice: `© ${ph.credit}. Used by DJ DX with permission.` }
        : { creator: { '@id': 'https://djdxmusic.com/#djdx' }, copyrightHolder: { '@id': 'https://djdxmusic.com/#djdx' } }),
    })),
  ];
  const credit = [...new Set(c.photos.map(p => p.credit).filter(Boolean))];
  const others = CASE_STUDIES.filter(o => o.slug !== c.slug);

  return (
    <>
      <Helmet>
        <title>{c.title}</title>
        <meta name="description" content={c.description} />
        <link rel="canonical" href={url} />
        <meta property="og:title" content={c.title} />
        <meta property="og:description" content={c.description} />
        <meta property="og:url" content={url} />
        <meta property="og:type" content="article" />
        <meta property="og:image" content={`https://djdxmusic.com${c.photos[0].src}`} />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </Helmet>
      <SiteNav />

      <main className="vn-main">
        <div className="vn-inner">
          <nav className="vn-crumbs" aria-label="Breadcrumb"><Link to="/work">Case Studies</Link> <span aria-hidden="true">/</span> {c.client}</nav>
          <div className="sec-overline"><span className="sec-label">{c.overline}</span></div>
          <h1 className="sec-title vn-h1">{c.h1}</h1>
          {c.intro.map((p, i) => <p className="vn-p vn-lead" key={i}><RichText text={p} /></p>)}

          <dl className="cs-facts">
            {c.facts.map(([k, v]) => (
              <div key={k}><dt>{k}</dt><dd>{k === 'Venue' && c.venueLink ? <Link to={c.venueLink}>{v}</Link> : v}</dd></div>
            ))}
          </dl>

          <img className="vn-img" src={c.photos[0].src} alt={c.photos[0].alt} width={c.photos[0].w} height={c.photos[0].h} loading="eager" decoding="async" />

          {c.sections.map(s => (
            <div className="vn-sec" key={s.h2}>
              <h2 className="vn-h2">{s.h2}</h2>
              {s.paras?.map((p, i) => <p className="vn-p" key={i}><RichText text={p} /></p>)}
              {s.bullets && <ul className="vn-list">{s.bullets.map(b => <li key={b}><RichText text={b} /></li>)}</ul>}
            </div>
          ))}

          {c.quotes && c.quotes.length > 0 && (
            <div className="vn-sec">
              <h2 className="vn-h2">What the client said</h2>
              {c.quotes.map(q => (
                <blockquote className="cs-quote" key={q.name}>
                  <p>&ldquo;{q.quote}&rdquo;</p>
                  <cite>{q.name}, {q.company}</cite>
                </blockquote>
              ))}
            </div>
          )}

          <div className="vn-sec">
            <h2 className="vn-h2">Photos{c.videos?.length ? ' and video' : ''}</h2>
            {c.videos?.map(v => (
              <figure className="vn-video" key={v.src}>
                <video controls playsInline preload="none" poster={v.poster} src={v.src} aria-label={v.label} width={v.w} height={v.h} style={{ aspectRatio: `${v.w} / ${v.h}` }} />
                <figcaption>{v.label}</figcaption>
              </figure>
            ))}
            <div className="vn-gallery">
              {c.photos.slice(1).map(ph => (
                <img key={ph.src} src={ph.src} alt={ph.alt} width={ph.w} height={ph.h} loading="lazy" decoding="async" />
              ))}
            </div>
            {credit.length > 0 && <p className="vn-p cs-credit">Photos: {credit.join(', ')}.</p>}
          </div>

          <div className="vn-sec">
            <h2 className="vn-h2">Related services</h2>
            <ul className="vn-others">
              {c.related.map(r => <li key={r.path}><Link to={r.path}>{r.label}</Link></li>)}
            </ul>
          </div>

          {others.length > 0 && (
            <div className="vn-sec">
              <h2 className="vn-h2">More case studies</h2>
              <ul className="vn-others">
                {others.map(o => <li key={o.slug}><Link to={`/work/${o.slug}`}>{o.client}</Link><span>{o.dateLabel}</span></li>)}
              </ul>
            </div>
          )}
        </div>
      </main>

      <AuthorBio />

      <section id="booking" className="booking" style={{ padding: '80px 40px' }}>
        <div className="section-inner">
          <div className="booking-layout">
            <div className="booking-left">
              <div className="sec-overline"><span className="sec-label">Book DJ DX</span></div>
              <h2 className="sec-title">Check Your <span>Date</span></h2>
              <p style={{ color: 'rgba(242,242,242,0.6)', lineHeight: 1.8, marginTop: '16px' }}>{c.cta}</p>
            </div>
            <div className="booking-right"><BookingForm initial={{ eventType: c.bookingEventType }} /></div>
          </div>
        </div>
      </section>

      <StickyMobileCTA formName={`work_${c.slug.replace(/-/g, '_')}_sticky`} label="Check My Date" />
      <SiteFooter />
    </>
  );
}
