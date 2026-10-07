import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import SiteNav from '../components/SiteNav';
import SiteFooter from '../components/SiteFooter';
import StickyMobileCTA from '../components/StickyMobileCTA';
import { VENUES } from '../data/venues';

// Hub for /venues. Venue pages come from src/data/venues.ts; the two rows
// below are not booking pages (a press appearance and a closed venue).
export default function Venues() {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  const schema = [
    {
      '@context': 'https://schema.org', '@type': 'ItemList', name: 'Venues DJ DX has played',
      itemListElement: VENUES.map((v, i) => ({ '@type': 'ListItem', position: i + 1, url: `https://djdxmusic.com/venues/${v.slug}`, name: v.name })),
    },
    {
      '@context': 'https://schema.org', '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://djdxmusic.com/' },
        { '@type': 'ListItem', position: 2, name: 'Venues', item: 'https://djdxmusic.com/venues' },
      ],
    },
  ];
  return (
    <>
      <Helmet>
        <title>Venues DJ DX Has Played | NYC, Long Island &amp; NJ</title>
        <meta name="description" content="Lounges, ballrooms, festivals and landmark spaces across NYC, Long Island and New Jersey where DJ DX has played. See the room, then check your date." />
        <link rel="canonical" href="https://djdxmusic.com/venues" />
        <meta property="og:title" content="Venues DJ DX Has Played | NYC, Long Island &amp; NJ" />
        <meta property="og:url" content="https://djdxmusic.com/venues" />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </Helmet>
      <SiteNav />
      <main className="vn-main">
        <div className="vn-inner">
          <div className="sec-overline"><span className="sec-label">Venues</span></div>
          <h1 className="sec-title vn-h1">Venues I've Played</h1>
          <p className="vn-p vn-lead">Booked your venue already? There's a good chance DJ DX knows the room. Each page covers what the event was, how the space works, and what to plan for.</p>

          <ul className="vn-hub">
            {VENUES.map(v => (
              <li key={v.slug}>
                <Link to={`/venues/${v.slug}`} className="season-card">
                  <span className="season-kicker">{v.area}</span>
                  <strong>{v.name}</strong>
                  <span className="season-desc">{v.summary}</span>
                  <span className="season-go">See the venue <span aria-hidden="true">→</span></span>
                </Link>
              </li>
            ))}
            <li>
              <Link to="/news/groove-on-grove-jersey-journal" className="season-card">
                <span className="season-kicker">Jersey City, NJ</span>
                <strong>Groove on Grove</strong>
                <span className="season-desc">Headliner, August 2014. Jersey Journal weekend cover</span>
                <span className="season-go">Read the story <span aria-hidden="true">→</span></span>
              </Link>
            </li>
          </ul>

          <div className="vn-sec">
            <h2 className="vn-h2">Past venues</h2>
            <p className="vn-p">
              <strong>LITM, Downtown Jersey City (closed 2020).</strong> From 2007 to 2009, DJ DX played LITM, the
              Newark Avenue art bar that anchored Downtown Jersey City nightlife for 17 years. More on his Jersey City roots in
              the <a href="https://jerseycitysound.com/entry-dj-dx.html" target="_blank" rel="noopener">Jersey City Sound archive</a>.
            </p>
          </div>

          <div className="vn-sec">
            <p className="vn-p">Don't see your venue? DJ DX has played more than 500 events across the tri-state area. <a href="/#booking">Check your date</a>.</p>
          </div>
        </div>
      </main>
      <StickyMobileCTA formName="venues_hub_sticky" label="Check My Date" />
      <SiteFooter />
    </>
  );
}
