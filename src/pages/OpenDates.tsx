import { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import SiteNav from '../components/SiteNav';
import SiteFooter from '../components/SiteFooter';
import BookingForm from '../components/BookingForm';
import { BOOKED_DATES } from '../data/availability';

// /open-dates: Thursdays, Fridays and Saturdays through the end of the year,
// marked from src/data/availability.ts. A date that is not booked is shown as
// "Ask", never as guaranteed open: DJ DX confirms every date within 24 hours,
// the same rule the passport and the AI agent follow.

const URL = 'https://djdxmusic.com/open-dates';
const DAY = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

// Party nights (Thu-Sat) from today through December 31 of this year.
function partyNights(from: Date) {
  const out: { iso: string; label: string; month: string; booked: boolean }[] = [];
  const end = new Date(from.getFullYear(), 11, 31);
  // Start tomorrow: a same-day booking is not realistic.
  for (const d = new Date(from.getFullYear(), from.getMonth(), from.getDate() + 1); d <= end; d.setDate(d.getDate() + 1)) {
    if (![4, 5, 6].includes(d.getDay())) continue;
    const id = iso(d);
    out.push({
      iso: id,
      label: `${DAY[d.getDay()]} ${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
      month: d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      booked: BOOKED_DATES.includes(id),
    });
  }
  return out;
}

export default function OpenDates() {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  const nights = useMemo(() => partyNights(new Date()), []);
  const months = useMemo(() => [...new Set(nights.map(n => n.month))], [nights]);
  const [picked, setPicked] = useState('');
  // Live 72-hour holds (no personal data), so a held date never looks open
  const [held, setHeld] = useState<Record<string, number>>({});
  useEffect(() => {
    fetch('/api/booking?holds=1').then(r => r.ok ? r.json() : { holds: [] })
      .then((d: { holds?: { date: string; expiresAt: number }[] }) => setHeld(Object.fromEntries((d.holds || []).map(h => [h.date, h.expiresAt]))))
      .catch(() => {});
  }, []);
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
        <meta property="og:title" content={`DJ Dates for Holiday Parties ${year}: NYC & NJ | DJ DX`} />
        <meta property="og:url" content={URL} />
        <meta property="og:type" content="website" />
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
