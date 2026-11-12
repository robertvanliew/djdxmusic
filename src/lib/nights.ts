import { useEffect, useState } from 'react';
import { BOOKED_DATES } from '../data/availability';

// Shared date logic for /open-dates and the date strips on service pages.
// Same rule everywhere: a date that is not booked or on hold is shown as
// "Ask", never as guaranteed open. DJ DX confirms every date within 24 hours.

export interface Night { iso: string; label: string; month: string; booked: boolean }

const DAY = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
export const isoDate = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

// Nights from tomorrow (a same-day booking is not realistic) through `end`,
// limited to the given weekdays. Thursday to Saturday are the party nights.
export function nightsBetween(from: Date, end: Date, weekdays: number[] = [4, 5, 6]): Night[] {
  const out: Night[] = [];
  for (const d = new Date(from.getFullYear(), from.getMonth(), from.getDate() + 1); d <= end; d.setDate(d.getDate() + 1)) {
    if (!weekdays.includes(d.getDay())) continue;
    const id = isoDate(d);
    out.push({
      iso: id,
      label: `${DAY[d.getDay()]} ${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
      month: d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      booked: BOOKED_DATES.includes(id),
    });
  }
  return out;
}

// Live 72-hour holds (dates only, no personal data), so a held date never looks open.
export function useHolds(): Record<string, number> {
  const [held, setHeld] = useState<Record<string, number>>({});
  useEffect(() => {
    fetch('/api/booking?holds=1').then(r => r.ok ? r.json() : { holds: [] })
      .then((d: { holds?: { date: string; expiresAt: number }[] }) => setHeld(Object.fromEntries((d.holds || []).map(h => [h.date, h.expiresAt]))))
      .catch(() => {});
  }, []);
  return held;
}
