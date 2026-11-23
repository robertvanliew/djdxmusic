import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import SiteNav from '../components/SiteNav';
import SiteFooter from '../components/SiteFooter';
import { CASE_STUDIES } from '../data/caseStudies';

// /work: index of case studies in src/data/caseStudies.ts.
const URL = 'https://djdxmusic.com/work';
const TITLE = 'Case Studies: Corporate and Brand Events | DJ DX';
const DESC = 'How DJ DX ran real events for Saks Fifth Avenue and NautaDutilh: the room, the music, the setup and what the client said. Photos and video from each night.';

export default function Work() {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  const schema = [
    {
      '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'DJ DX Case Studies', url: URL, description: DESC,
      isPartOf: { '@id': 'https://djdxmusic.com/#website' },
      mainEntity: {
        '@type': 'ItemList',
        itemListElement: CASE_STUDIES.map((c, i) => ({ '@type': 'ListItem', position: i + 1, url: `${URL}/${c.slug}`, name: c.h1 })),
      },
    },
    {
      '@context': 'https://schema.org', '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://djdxmusic.com/' },
        { '@type': 'ListItem', position: 2, name: 'Case Studies', item: URL },
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
        <meta property="og:type" content="website" />
        <meta property="og:image" content={`https://djdxmusic.com${CASE_STUDIES[0].photos[0].src}`} />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </Helmet>
      <SiteNav />
      <main className="vn-main">
        <div className="vn-inner">
          <div className="sec-overline"><span className="sec-label">Case studies</span></div>
          <h1 className="sec-title vn-h1">Real Events, <span>Start to Finish</span></h1>
          <p className="vn-p vn-lead">
            What happened at recent DJ DX bookings: the room, how the music moved through the night, the setup, and what the
            client said afterward. For venues on their own, see <Link to="/venues">venues DJ DX has played</Link>.
          </p>
          <ul className="cs-list">
            {CASE_STUDIES.map(c => (
              <li key={c.slug}>
                <Link to={`/work/${c.slug}`} className="cs-card">
                  <img src={c.photos[0].src} alt={c.photos[0].alt} width={c.photos[0].w} height={c.photos[0].h} loading="lazy" decoding="async" />
                  <span className="cs-card-body">
                    <span className="cs-card-meta">{c.dateLabel} · {c.venueName ? `${c.venueName}, ` : ''}{c.venueArea}</span>
                    <strong>{c.client}</strong>
                    <span>{c.summary}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
