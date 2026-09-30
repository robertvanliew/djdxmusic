import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import SiteNav from '../components/SiteNav';
import SiteFooter from '../components/SiteFooter';

// Booking terms for DJ services. Every term on this page was chosen by DJ DX
// (Sept 2026) - deposit, balance timing, date changes, cancellation, the
// backup-DJ contingency, and the paperwork he can provide. Do not add terms
// here (payment methods, net-30 invoicing, refunds on the balance) that he
// has not explicitly agreed to: this page is a public commitment.
//
// Deliberately indexable, unlike /refunds (music store only). "What happens
// if the DJ cancels" is one of the most-asked questions when hiring a DJ, and
// a plain answer is both a trust signal and a citable page.

const SUMMARY = [
  { k: '50% deposit', v: 'holds your date' },
  { k: 'Balance due', v: '14 days before the event' },
  { k: 'One free date change', v: 'within 12 months' },
  { k: 'Vetted backup DJ', v: 'if an emergency ever strikes' },
  { k: 'Written contract', v: 'on every booking' },
  { k: 'COI and W-9', v: 'available on request' },
];

const SECTIONS: { h: string; body: React.ReactNode }[] = [
  {
    h: 'Holding your date',
    body: (
      <>
        <p>Your date is reserved once two things are in: the signed contract and a <strong>50% deposit</strong>. Until then, dates are available to anyone, so if you have a date in mind, it's worth locking it in early. December Saturdays and peak wedding weekends go first.</p>
      </>
    ),
  },
  {
    h: 'Paying the balance',
    body: (
      <p>The remaining <strong>50% is due 14 days before your event</strong>. That leaves the final two weeks for planning, not paperwork.</p>
    ),
  },
  {
    h: 'If you need to change your date',
    body: (
      <p>Plans change. You can move your booking to a new date <strong>once, at no charge</strong>, as long as the new date falls within 12 months of the original and DJ DX is available. Your deposit carries over to the new date in full.</p>
    ),
  },
  {
    h: 'If you cancel',
    body: (
      <p>The deposit is <strong>non-refundable</strong>. When your date is reserved, it's taken off the calendar and other inquiries for that date are turned away, so the deposit covers that held date. If you're unsure, consider the free date change above before cancelling.</p>
    ),
  },
  {
    h: 'If DJ DX can’t perform',
    body: (
      <>
        <p>The DJ you book is the DJ who plays. DJ DX is one person, not an agency, and there's no "whoever is free that night."</p>
        <p>In the rare case of illness or a genuine emergency, your event is covered by a <strong>DJ personally vetted by DJ DX</strong>. They work from your planning notes: your must-play and do-not-play lists, your run of show, and the names to announce. You'll receive a <strong>partial refund or credit on your fee</strong>. Your event goes ahead either way.</p>
      </>
    ),
  },
  {
    h: 'Contracts and paperwork',
    body: (
      <>
        <p>Every booking comes with a <strong>written contract</strong> covering your date, hours, fee, deposit, and these terms. No handshake deals.</p>
        <p>For venues and corporate clients, a <strong>certificate of insurance (COI)</strong> is available, and a <strong>W-9</strong> can be provided for your accounts payable team on request. Bookings are contracted through FRANKPELLA LLC.</p>
      </>
    ),
  },
  {
    h: 'Pricing',
    body: (
      <p>Starting rates are published on the <Link to="/event-dj-cost-nyc-nj-ct" style={{ color: 'var(--gold)' }}>pricing report</Link>, and you can build an instant estimate with the calculator on that page. Travel outside New York City is always quoted upfront as its own line item, never folded into the total.</p>
    ),
  },
];

export default function BookingPolicy() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <>
      <Helmet>
        <title>Booking Policy: Deposits, Date Changes &amp; Backup DJ | DJ DX</title>
        <meta name="description" content="How booking DJ DX works: a 50% deposit holds your date, balance due 14 days before, one free date change, a vetted backup DJ, and a written contract." />
        <link rel="canonical" href="https://djdxmusic.com/booking-policy" />
        <meta property="og:title" content="Booking Policy — DJ DX" />
        <meta property="og:description" content="50% deposit, balance 14 days out, one free date change, vetted backup DJ, written contract on every booking. COI and W-9 available." />
        <meta property="og:url" content="https://djdxmusic.com/booking-policy" />
        <meta property="og:image" content="https://djdxmusic.com/epk-hero.jpg" />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">
          {`{
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "DJ DX Booking Policy",
            "url": "https://djdxmusic.com/booking-policy",
            "description": "Booking terms for DJ DX event DJ services: 50% deposit to hold the date, balance due 14 days before the event, one free date change within 12 months, a vetted backup DJ in case of emergency, and a written contract on every booking. Certificate of insurance and W-9 available on request.",
            "isPartOf": { "@type": "WebSite", "name": "DJ DX", "url": "https://djdxmusic.com/" },
            "breadcrumb": {
              "@type": "BreadcrumbList",
              "itemListElement": [
                {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://djdxmusic.com/"},
                {"@type": "ListItem", "position": 2, "name": "Booking Policy", "item": "https://djdxmusic.com/booking-policy"}
              ]
            }
          }`}
        </script>
      </Helmet>

      <SiteNav />

      <section className="bp">
        <div className="bp-inner">
          <div className="sec-overline"><span className="sec-label">Booking Policy</span></div>
          <h1 className="sec-title bp-title">How Booking <span>DJ DX Works</span></h1>
          <p className="bp-lead">
            Plain terms, written down before you pay anything. If a term here isn't clear,
            email <a href="mailto:bookings@djdxmusic.com">bookings@djdxmusic.com</a> and you'll get a straight answer within 24 hours.
          </p>

          <div className="bp-summary">
            {SUMMARY.map(s => (
              <div key={s.k} className="bp-sum-item">
                <strong>{s.k}</strong>
                <span>{s.v}</span>
              </div>
            ))}
          </div>

          {SECTIONS.map(s => (
            <div key={s.h} className="bp-section">
              <h2>{s.h}</h2>
              {s.body}
            </div>
          ))}

          <div className="bp-cta">
            <p>Ready to check your date?</p>
            <Link to="/#booking" className="btn-gold">Check Availability</Link>
          </div>

          <p className="bp-updated">Last updated September 24, 2026 · FRANKPELLA LLC</p>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
