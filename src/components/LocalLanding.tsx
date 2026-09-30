import { useEffect, type ReactNode } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import SiteNav from './SiteNav';
import SiteFooter from './SiteFooter';
import RelatedServices from './RelatedServices';
import StickyMobileCTA from './StickyMobileCTA';
import QuoteCalculator from './QuoteCalculator';
import BookingForm from './BookingForm';
import ProofBlock from './ProofBlock';
import AuthorBio from './AuthorBio';

// Shared layout for the local landing pages (corporate Jersey City, corporate
// Brooklyn, birthday). Each page supplies its own copy; this file only owns
// the structure so every page gets the same sections in the same order.
//
// Placeholders: any string containing "[... fill in]" is treated as not yet
// filled. Venue lists and case studies skip placeholder entries, so visitors
// never see bracketed text. Keep the page `noindex` until they are filled,
// then flip `noindex` off and add the URL to public/sitemap.xml.

const isFilled = (s: string) => !/\[[^\]]*fill in[^\]]*\]/i.test(s);

export type FaqItem = { q: string; a: string };

type Props = {
  path: string;
  title: string;
  description: string;
  noindex: boolean;
  heroImage: string;
  heroAlt: string;
  overline: string;
  h1: ReactNode;
  answer: ReactNode;           // 2-3 sentence direct answer with the starting price
  localHeading: ReactNode;
  local: ReactNode;            // unique local copy
  venues: string[];            // placeholders are skipped
  venuesHeading: string;
  caseStudy: { title: string; body: string };
  children?: ReactNode;        // extra unique sections
  included: [string, string][];
  faq: FaqItem[];
  links: ReactNode;            // parent, holiday page, sibling
  bookingEventType: string;
  calcEvent: 'corporate' | 'private';
  formName: string;
  serviceType: string;
  areaServed: { '@type': string; name: string }[];
  breadcrumb: { name: string; path: string }[];
};

export default function LocalLanding(p: Props) {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  const url = `https://djdxmusic.com${p.path}`;
  const venues = p.venues.filter(isFilled);
  const showCase = isFilled(p.caseStudy.title) && isFilled(p.caseStudy.body);

  const schema = [
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: p.title.replace(/ \| DJ DX$/, ''),
      serviceType: p.serviceType,
      url,
      description: p.description,
      provider: { '@id': 'https://djdxmusic.com/#djdx' },
      areaServed: p.areaServed,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: p.faq.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [{ name: 'Home', path: '/' }, ...p.breadcrumb].map((b, i) => ({
        '@type': 'ListItem', position: i + 1, name: b.name, item: `https://djdxmusic.com${b.path}`,
      })),
    },
  ];

  const textStyle = { color: 'rgba(242,242,242,0.68)', fontSize: '1rem', lineHeight: 1.8 };

  return (
    <>
      <Helmet>
        <title>{p.title}</title>
        <meta name="description" content={p.description} />
        {p.noindex && <meta name="robots" content="noindex, follow" />}
        <link rel="canonical" href={url} />
        <meta property="og:title" content={p.title} />
        <meta property="og:description" content={p.description} />
        <meta property="og:url" content={url} />
        <meta property="og:image" content={`https://djdxmusic.com${p.heroImage}`} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@djdxmusic" />
        <meta name="twitter:title" content={p.title} />
        <meta name="twitter:description" content={p.description} />
        <meta name="twitter:image" content={`https://djdxmusic.com${p.heroImage}`} />
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </Helmet>

      <SiteNav />

      {/* ── HERO + DIRECT ANSWER ── */}
      <section className="epk-hero" style={{ minHeight: '72vh', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
        <div className="epk-hero-bg" style={{ position: 'absolute', inset: 0 }}>
          <img src={p.heroImage} alt={p.heroAlt} width="1920" height="1080" fetchPriority="high" loading="eager" decoding="async" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 30%' }} />
        </div>
        <div className="epk-hero-overlay" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(12,12,12,0.3) 0%, rgba(12,12,12,0.94) 100%)' }} />
        <div className="section-inner" style={{ position: 'relative', zIndex: 10, textAlign: 'center' }}>
          <div className="sec-overline" style={{ justifyContent: 'center' }}><span className="sec-label">{p.overline}</span></div>
          <h1 className="sec-title" style={{ fontSize: 'clamp(2.1rem, 5.6vw, 4rem)', marginBottom: '1.2rem' }}>{p.h1}</h1>
          <p style={{ maxWidth: '680px', margin: '0 auto 2rem', fontSize: '1.08rem', color: 'rgba(242,242,242,0.78)', lineHeight: 1.7 }}>{p.answer}</p>
          <div className="lp-cta" style={{ marginTop: 0 }}>
            <a href="#booking" className="btn-gold">Check My Date</a>
            <a href="#quote-calculator" className="lp-cta-alt">Get an instant starting price</a>
          </div>
        </div>
      </section>

      {/* ── LOCAL ── */}
      <section style={{ padding: '80px 24px' }}>
        <div className="section-inner" style={{ maxWidth: '860px' }}>
          <h2 className="sec-title" style={{ marginBottom: '24px' }}>{p.localHeading}</h2>
          <div style={textStyle}>{p.local}</div>
          {venues.length > 0 && (
            <>
              <h3 className="pb-sub" style={{ marginTop: '32px' }}>{p.venuesHeading}</h3>
              <ul className="lp-list">{venues.map(v => <li key={v}>{v}</li>)}</ul>
            </>
          )}
        </div>
      </section>

      {/* ── CASE STUDY (hidden until the placeholder is filled) ── */}
      {showCase && (
        <section style={{ padding: '72px 24px', background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(201,168,76,0.12)', borderBottom: '1px solid rgba(201,168,76,0.12)' }}>
          <div className="section-inner" style={{ maxWidth: '860px' }}>
            <div className="sec-overline"><span className="sec-label">Case Study</span></div>
            <h2 className="sec-title" style={{ marginBottom: '18px' }}>{p.caseStudy.title}</h2>
            <p style={textStyle}>{p.caseStudy.body}</p>
          </div>
        </section>
      )}

      {p.children}

      {/* ── WHAT'S INCLUDED ── */}
      <section style={{ padding: '72px 24px' }}>
        <div className="section-inner" style={{ maxWidth: '860px' }}>
          <h2 className="sec-title" style={{ marginBottom: '18px' }}>What's <span>Included</span></h2>
          <table className="lp-table">
            <thead><tr><th scope="col">Item</th><th scope="col">Details</th></tr></thead>
            <tbody>
              {p.included.map(([k, v]) => <tr key={k}><td>{k}</td><td>{v}</td></tr>)}
            </tbody>
          </table>
          <div className="lp-cta">
            <a href="#booking" className="btn-gold">Get a Quote in 24 Hours</a>
            <a href="#quote-calculator" className="lp-cta-alt">Or estimate your price now</a>
          </div>
        </div>
      </section>

      <ProofBlock />

      {/* ── FAQ ── */}
      <section style={{ padding: '80px 24px' }}>
        <div className="section-inner" style={{ maxWidth: '780px' }}>
          <h2 className="sec-title" style={{ textAlign: 'center' }}>Questions <span>and Answers</span></h2>
          <div style={{ marginTop: '36px', display: 'flex', flexDirection: 'column', gap: '22px' }}>
            {p.faq.map(({ q, a }) => (
              <div key={q} style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', paddingBottom: '22px' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--white)', marginBottom: '10px' }}>{q}</h3>
                <p style={{ fontSize: '0.92rem', color: 'rgba(242,242,242,0.62)', lineHeight: 1.75 }}>{a}</p>
              </div>
            ))}
          </div>
          <p style={{ ...textStyle, textAlign: 'center', marginTop: '32px', fontSize: '0.95rem' }}>{p.links}</p>
        </div>
      </section>

      <AuthorBio />

      {/* ── BOOKING ── */}
      <section id="booking" className="booking" style={{ padding: '80px 40px' }}>
        <div className="section-inner">
          <div className="booking-layout">
            <div className="booking-left">
              <div className="sec-overline"><span className="sec-label">Book Your Date</span></div>
              <h2 className="sec-title">Check Your <span>Date</span></h2>
              <p style={{ color: 'rgba(242,242,242,0.55)', lineHeight: 1.8, marginTop: '16px' }}>
                Send your date, venue, and guest count. You will hear back within 24 hours with availability and an itemized quote.
                Every booking has a written contract, and a 50% deposit holds the date.
              </p>
              <p style={{ marginTop: '14px' }}>
                <a href="#quote-calculator" style={{ color: 'var(--gold)' }}>Want a number first? Get an instant starting price</a>
              </p>
              <p style={{ marginTop: '8px', fontSize: '0.9rem' }}>
                <Link to="/booking-policy" style={{ color: 'rgba(242,242,242,0.6)' }}>Read the booking policy</Link>
              </p>
            </div>
            <div className="booking-right">
              <BookingForm initial={{ eventType: p.bookingEventType }} />
            </div>
          </div>
        </div>
      </section>

      <QuoteCalculator formName={p.formName} defaultEvent={p.calcEvent} />
      <RelatedServices />
      <StickyMobileCTA formName={`${p.formName}_sticky`} label="Check My Date" />
      <SiteFooter />
    </>
  );
}
