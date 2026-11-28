import { useMemo } from 'react';
import { BOOKED_DATES } from '../data/availability';
import { useHolds, isoDate } from '../lib/nights';
import { openBooking } from './BookingHost';

// Slim bar under the hero on the main service pages: "Now booking 2027 and
// 2028", the next two open Friday/Saturday nights as one-tap date chips, and
// a Check My Date button. Chips and button open the booking dialog in place
// (the button's #booking href is the no-JS fallback). Booked and held dates
// are skipped. Update the years here when the calendar moves.
export default function BookingPrompt() {
  const held = useHolds();
  const nights = useMemo(() => {
    const out: { iso: string; label: string }[] = [];
    const d = new Date();
    d.setHours(12, 0, 0, 0);
    for (let i = 1; i < 120 && out.length < 2; i++) {
      d.setDate(d.getDate() + 1);
      const day = d.getDay();
      if (day !== 5 && day !== 6) continue;
      const iso = isoDate(d);
      if (BOOKED_DATES.includes(iso) || held[iso]) continue;
      out.push({ iso, label: d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) });
    }
    return out;
  }, [held]);

  return (
    <div className="bp" role="region" aria-label="Check your date">
      <p className="bp-text"><span className="bx-dot" aria-hidden="true" />Now booking 2027 and 2028.</p>
      {nights.length > 0 && (
        <div className="bp-nights">
          <span className="bp-nights-label">Next open</span>
          {nights.map(n => (
            <button key={n.iso} type="button" className="bp-chip" onClick={() => openBooking({ date: n.iso, source: 'prompt_chip' })}>
              {n.label}
            </button>
          ))}
        </div>
      )}
      <a href="#booking" className="bp-btn">Check My Date</a>
    </div>
  );
}
