import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import SiteNav from '../components/SiteNav';
import SiteFooter from '../components/SiteFooter';

// Unknown URLs. Prerendered to dist/404.html, which Vercel serves with a real
// 404 status (vercel.json has no catch-all rewrite), so made-up URLs are not
// soft 404s that duplicate the homepage.
export default function NotFound() {
  return (
    <>
      <Helmet>
        <title>Page Not Found | DJ DX</title>
        <meta name="robots" content="noindex" />
        <meta name="description" content="This page does not exist. Find DJ DX wedding, corporate, holiday and private party DJ pages, pricing and venues." />
      </Helmet>
      <SiteNav />
      <main className="nf-main">
        <h1 className="sec-title">Page not <span>found</span></h1>
        <p className="vn-p">That page doesn't exist or has moved. These are the pages people usually look for:</p>
        <nav className="nf-links" aria-label="Popular pages">
          <Link to="/">Home</Link>
          <Link to="/wedding-dj-nyc-nj">Weddings</Link>
          <Link to="/corporate-event-dj-nyc-nj-ct">Corporate events</Link>
          <Link to="/holiday-party-dj-nyc-nj-ct">Holiday parties</Link>
          <Link to="/event-dj-cost-nyc-nj-ct">Pricing</Link>
          <Link to="/venues">Venues</Link>
          <Link to="/contact">Contact</Link>
        </nav>
      </main>
      <SiteFooter />
    </>
  );
}
