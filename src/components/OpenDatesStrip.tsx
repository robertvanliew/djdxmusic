import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { nightsBetween, useHolds, isoDate } from '../lib/nights';
import { BOOKED_DATES } from '../data/availability';
import { textHref, trackTextClick, TEXT_NUMBER_DISPLAY } from '../lib/textLink';
import { trackEvent } from '../lib/analytics';

// Date strips for service pages, fed by the same data as /open-dates
// (src/data/availability.ts + live holds). Tapping a date opens /open-dates
// with that date picked, where it can be held free for 72 hours.
//   december: Thursday to Saturday nights left in December (shown Sep to Dec only)
//   soon:     every night in the next three weeks, for last-minute bookings
// A date that is not booked or held reads "Ask" and is described as "open to
// requests": it is never promised as free. DJ DX confirms each one.

type Mode = 'december' | 'soon';

export default function OpenDatesStrip({ mode, source, heading }: { mode: Mode; source: string; heading?: string }) {
  const held = useHolds();
  const now = useMemo(() => new Date(), []);
  const nights = useMemo(() => {
    if (mode === 'soon') return nightsBetween(now, new Date(now.getFullYear(), now.getMonth(), now.getDate() + 21), [0, 1, 2, 3, 4, 5, 6]);
    if (now.getMonth() < 8) return []; // December planning season only
    return nightsBetween(now, new Date(now.getFullYear(), 11, 31)).filter(n => n.iso.slice(5, 7) === '12');
  }, [mode, now]);
  if (!nights.length) return null;

  const free = nights.filter(n => !n.booked && !held[n.iso]).length;
  const title = heading || (mode === 'december' ? `December ${now.getFullYear()} Party Nights` : 'The Next Three Weeks');

  return (
    <section className="ods" aria-label={title}>
      <div className="section-inner ods-inner">
        <div className="sec-overline"><span className="sec-label">Live availability</span></div>
        <h2 className="sec-title ods-title">{title}</h2>
        <p className="ods-lead">
          {mode === 'december' ? <>{nights.length} Thursday to Saturday nights are left in December. </> : null}
          <strong>{free} {free === 1 ? 'is' : 'are'} open to requests.</strong>{' '}
          Tap one to hold it free for 72 hours while your quote is prepared, or text <a href={textHref()} onClick={() => trackTextClick(`open_dates_${source}`)}>{TEXT_NUMBER_DISPLAY}</a>.
        </p>
        <ul className="od-grid">
          {nights.map(n => (
            <li key={n.iso}>
              {n.booked || held[n.iso]
                ? <span className="od-day od-booked" aria-label={`${n.label}: ${n.booked ? 'booked' : 'on hold'}`}><strong>{n.label}</strong><em>{n.booked ? 'Booked' : 'On hold'}</em></span>
                : <Link className="od-day" to={`/open-dates?date=${n.iso}`} onClick={() => trackEvent('open_date_click', { source, date: n.iso })} aria-label={`${n.label}: open to requests, ask about this date`}>
                    <strong>{n.label}</strong><em>Ask</em>
                  </Link>}
            </li>
          ))}
        </ul>
        <p className="ods-fine">
          Booked and held dates update automatically. Every date is confirmed by DJ DX within 24 hours.{' '}
          <Link to="/open-dates">See every date through New Year's Eve</Link>
        </p>
      </div>
    </section>
  );
}

// One line for the New Year's Eve page: is December 31 taken?
export function NyeStatus({ source }: { source: string }) {
  const held = useHolds();
  const now = useMemo(() => new Date(), []);
  // After New Year's Eve has passed there is nothing to show until next season
  const nye = new Date(now.getFullYear(), 11, 31);
  if (now.getMonth() < 8 || now >= nye) return null;
  const iso = isoDate(nye);
  const label = nye.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  const state = BOOKED_DATES.includes(iso) ? 'booked' : held[iso] ? 'held' : 'ask';
  return (
    <p className="ods-nye" role="status">
      <strong>{label}:</strong>{' '}
      {state === 'booked' ? 'booked. DJ DX takes one New Year\'s Eve event a year.'
        : state === 'held' ? 'on hold for another client. Ask to be next in line.'
        : <>open to requests. <Link to={`/open-dates?date=${iso}`} onClick={() => trackEvent('open_date_click', { source, date: iso })}>Hold it free for 72 hours</Link></>}
    </p>
  );
}
