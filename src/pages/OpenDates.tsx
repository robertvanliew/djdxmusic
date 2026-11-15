import { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useSearchParams } from 'react-router-dom';
import SiteNav from '../components/SiteNav';
import SiteFooter from '../components/SiteFooter';
import BookingForm from '../components/BookingForm';
import { nightsBetween, useHolds } from '../lib/nights';

// /open-dates: Thursdays, Fridays and Saturdays through the end of the year,
// marked from src/data/availability.ts. A date that is not booked is shown as
// "Ask", never as guaranteed open: DJ DX confirms every date within 24 hours,
// the same rule the passport and the AI agent follow.

const URL = 'https://djdxmusic.com/open-dates';
export default function OpenDates() {
  const [sp] = useSearchParams();
  // Party nights (Thu-Sat) from tomorrow through December 31 of this year
  const nights = useMemo(() => { const now = new Date(); return nightsBetween(now, new Date(now.getFullYear(), 11, 31)); }, []);
  const months = useMemo(() => [...new Set(nights.map(n => n.month))], [nights]);
  // A date strip on a service page links here as /open-dates?date=YYYY-MM-DD
  const fromLink = /^\d{4}-\d{2}-\d{2}$/.test(sp.get('date') || '') ? sp.get('date')! : '';
  const [picked, setPicked] = useState(fromLink);
  useEffect(() => {
    if (!fromLink) { window.scrollTo(0, 0); return; }
    const t = window.setTimeout(() => document.getElementById('od-form')?.scrollIntoView({ block: 'start' }), 60);
    return () => window.clearTimeout(t);
  }, [fromLink]);
  // Live 72-hour holds (no personal data), so a held date never looks open
  const held = useHolds();
  const pick = (d: string) => {
    setPicked(d);
    requestAnimationFrame(() => document.getElementById('od-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  };
  const year = new Date().getFullYear();

  return (
    <>
      <Helmet>
        <title>{`DJ Dates for Holiday Parties ${year}: NYC & NJ | DJ DX`}</title>
        <meta name="description" content={`Thursday to Saturday party nights DJ DX still has for ${year} holiday and company parties in NYC and NJ. Booked dates marked; replies within 24 hours.`} />
        <link rel="canonical" href={URL} />
        <meta property="og:description" content={`Thursday to Saturday party nights DJ DX still has for ${year} holiday and company parties in NYC and NJ. Booked dates marked; replies within 24 hours.`} />
        <meta property="og:title" content={`DJ Dates for Holiday Parties ${year}: NYC & NJ | DJ DX`} />
        <meta property="og:url" content={URL} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://djdxmusic.com/corporate-holiday-party-dj-manhattan-nyc.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
      <SiteNav />
      <main className="vn-main">
        <div className="vn-inner">
          <div className="sec-overline"><span className="sec-label">Availability</span></div>
          <h1 className="sec-title vn-h1">Open Dates <span>{year}</span></h1>
          <p className="vn-p vn-lead">
            Party nights from now through New Year's Eve. <strong>Booked</strong> dates are taken and <strong>On hold</strong> dates
            are held for another client. Tap any other date to request it: it is held for you, free, for 72 hours while DJ DX
            sends your quote. December Fridays and Saturdays go first.
          </p>

          {months.map(m => (
            <section className="vn-sec od-month" key={m}>
              <h2 className="vn-h2">{m}</h2>
              <ul className="od-grid">
                {nights.filter(n => n.month === m).map(n => (
                  <li key={n.iso}>
                    {n.booked
                      ? <span className="od-day od-booked" aria-label={`${n.label}: booked`}><strong>{n.label}</strong><em>Booked</em></span>
                      : held[n.iso]
                      ? <span className="od-day od-booked" aria-label={`${n.label}: on hold`}><strong>{n.label}</strong><em>On hold</em></span>
                      : <button type="button" className={`od-day${picked === n.iso ? ' od-picked' : ''}`} onClick={() => pick(n.iso)} aria-label={`${n.label}: not booked yet, ask about this date`}>
                          <strong>{n.label}</strong><em>Ask</em>
                        </button>}
                  </li>
                ))}
              </ul>
            </section>
          ))}

          <section className="vn-sec">
            <h2 className="vn-h2">How holding a date works</h2>
            <ul className="vn-list">
              <li>Request a date and it is held for you, free, for 72 hours. Nobody else can book it while you decide.</li>
              <li>You hear back within 24 hours with your quote and contract.</li>
              <li>A signed contract and a 50% deposit confirm the date. The balance is due 14 days before the event. If the hold runs out first, the date opens up again.</li>
              <li>Office holiday parties and private parties start at $2,800 for up to five hours in NYC. See <Link to="/holiday-party-dj-nyc-nj-ct">holiday party DJ</Link> and <Link to="/event-dj-cost-nyc-nj-ct">event DJ cost</Link>.</li>
              <li>Planning for {year + 1}? The same form works for any date. Weddings and peak Saturdays book months ahead.</li>
            </ul>
          </section>

          <div id="od-form" className="vn-sec">
            <h2 className="vn-h2">{picked ? 'Check this date' : 'Check a date'}</h2>
            <BookingForm key={picked || 'none'} formName="open_dates" initial={picked ? { eventDate: picked, eventType: 'Corporate Event / Holiday Party' } : undefined} />
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
