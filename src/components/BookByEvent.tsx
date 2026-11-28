import { useRef, useState, type PointerEvent } from 'react';
import { Link } from 'react-router-dom';

/* Homepage "Book by Event": one editorial index instead of card grids.
   Each row is a single big link (name, one line, starting price, arrow) with
   a few small search-worded links tucked under it. On a desktop pointer, a
   photo from a real event floats beside the cursor while a row is hovered;
   on touch screens each row shows a small thumbnail instead.

   The holiday + New Year's row shows September through December only and
   switches itself off on January 1, so it never advertises a past season.
   Replaces the old four-card grid, the "Also:" link line and the separate
   December cards (SeasonalBooking). */

type Row = {
  id: string;
  name: string;
  line: string;
  price: string;
  to: string;
  img: string;
  alt: string;
  tags?: { label: string; to: string }[];
  season?: string;
};

function inSeason(d = new Date()) {
  return d.getMonth() >= 8; // Sep .. Dec
}

export default function BookByEvent() {
  const year = new Date().getFullYear();
  const rows: Row[] = [
    {
      id: 'weddings', name: 'Weddings', line: 'Ceremony through after-party, with live violin or piano if you want it.',
      price: 'From $2,800', to: '/wedding-dj-nyc-nj', img: '/home/book-weddings.webp', alt: 'DJ DX with live violin at a wedding reception',
      tags: [{ label: 'What a wedding DJ costs', to: '/wedding-dj-cost-nyc' }, { label: 'Manhattan weddings', to: '/wedding-dj-manhattan-nyc' }],
    },
    {
      id: 'corporate', name: 'Corporate Events', line: 'Office parties, galas and client receptions. COI and W-9 ready.',
      price: 'From $2,800', to: '/corporate-event-dj-nyc-nj-ct', img: '/home/book-corporate.webp', alt: 'DJ DX at a law firm reception on a Rockefeller Center rooftop',
      tags: [{ label: 'Corporate events in Jersey City', to: '/corporate-event-dj-jersey-city-nj' }, { label: 'Corporate events in Brooklyn', to: '/corporate-event-dj-brooklyn-ny' }],
    },
    {
      id: 'private', name: 'Birthdays & Private Parties', line: 'Milestone birthdays, home parties, rooftops and Sweet 16s.',
      price: 'From $2,800', to: '/birthday-party-dj-nyc-nj', img: '/home/book-private.webp', alt: 'DJ DX booth set up for a private event at Hutong NYC',
      tags: [{ label: 'Sweet 16s', to: '/sweet-16-dj-nyc-nj' }, { label: 'Sweet 16s in the Hudson Valley', to: '/sweet-16-dj-hudson-valley-ny' }],
    },
    ...(inSeason() ? [{
      id: 'holiday', name: `Holidays & New Year's ${year}`, line: "Office holiday parties all December, and one New Year's Eve booking.",
      price: 'From $2,800', to: '/holiday-party-dj-nyc-nj-ct', img: '/home/book-holiday.webp', alt: 'An office holiday party in a Manhattan event space',
      tags: [{ label: "New Year's Eve", to: '/new-years-eve-dj-nyc' }, { label: 'Holiday party budget calculator', to: '/office-holiday-party-budget-calculator' }],
      season: `Now booking December ${year}`,
    }] : []),
  ];

  const list = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<number | null>(null);
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse' || !list.current) return;
    const r = list.current.getBoundingClientRect();
    list.current.style.setProperty('--px', `${e.clientX - r.left}px`);
    list.current.style.setProperty('--py', `${e.clientY - r.top}px`);
  };

  return (
    <nav className="bx" aria-labelledby="bx-title">
      <div className="bx-head">
        <div className="sec-overline"><span className="sec-overline-line" /><span className="sec-label">Book by Event</span></div>
        <h2 className="bx-title" id="bx-title">What are you <span>planning?</span></h2>
      </div>

      <div className={`bx-stage${hover !== null ? ' is-hovering' : ''}`} ref={list} onPointerMove={onMove} onPointerLeave={() => setHover(null)}>
      <ol className="bx-list">
        {rows.map((r, i) => (
          <li key={r.id} className={`bx-row${r.season ? ' bx-row--season' : ''}${hover === i ? ' is-active' : ''}`} onPointerEnter={e => { if (e.pointerType === 'mouse') setHover(i); }}>
            <Link to={r.to} className="bx-link" aria-label={`${r.name}, ${r.price.toLowerCase()}`}>
              <span className="bx-num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
              <img className="bx-thumb" src={r.img} alt="" width="480" height="600" loading="lazy" decoding="async" />
              <span className="bx-text">
                {r.season && <span className="bx-season"><span className="bx-dot" aria-hidden="true" />{r.season}</span>}
                <span className="bx-name">{r.name}</span>
                <span className="bx-line">{r.line}</span>
              </span>
              <span className="bx-price">{r.price}</span>
              <span className="bx-arrow" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="13 6 19 12 13 18" /></svg>
              </span>
            </Link>
            {r.tags && (
              <span className="bx-tags">
                {r.tags.map(t => <Link key={t.to} to={t.to} className="bx-tag">{t.label}</Link>)}
              </span>
            )}
          </li>
        ))}
      </ol>
      <div className="bx-preview" aria-hidden="true">
        {rows.map((r, i) => <img key={r.id} src={r.img} alt="" className={hover === i ? 'is-on' : ''} loading="lazy" decoding="async" />)}
      </div>
      </div>

      <div className="bx-foot">
        <p>Not sure what it should cost? Pick your event and hours, and see a starting price in about 30 seconds.</p>
        <Link to="/event-dj-cost-nyc-nj-ct#quote-calculator" className="bx-estimate">Get an instant estimate <span aria-hidden="true">→</span></Link>
      </div>
    </nav>
  );
}
