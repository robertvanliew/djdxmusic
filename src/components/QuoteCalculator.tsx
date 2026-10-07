import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { useLocation } from 'react-router-dom';
import { trackEvent, trackLead, trackFormSubmit, trackFormError } from '../lib/analytics';

// Instant estimate + lead capture, embedded on the pages that already rank for
// cost queries rather than living at its own URL. Those pages sit at position
// 1-9 across ~30 "how much does a DJ cost" searches and convert almost none of
// it, so the job here is to turn cost research into a named lead on the page
// the searcher already landed on - not to create another URL competing with
// them.
//
// EVERY number below comes from public/pricing.txt, which is the canonical
// rate card. Nothing here is invented. Anything DJ DX has not published a
// price for is surfaced as "quoted" rather than given a made-up figure, which
// also turns the add-on list into demand research: the submitted quote says
// exactly which extras the client wanted.

import { STARTING_PRICES, HAMPTONS_FLOOR as HAMPTONS_MIN, VIOLIN_HOURLY as VIOLIN_RATE } from '../lib/pricing';

type EventKey = 'wedding' | 'corporate' | 'private' | 'sweet16' | 'duo';

const EVENT_TYPES: { key: EventKey; label: string; base: number; blurb: string }[] = [
  { key: 'wedding',   label: 'Wedding',                          base: STARTING_PRICES.wedding, blurb: 'Ceremony, cocktail hour, reception, after-party' },
  { key: 'corporate', label: 'Corporate event / holiday party',  base: STARTING_PRICES.corporate, blurb: 'Galas, office parties, brand activations, product launches' },
  { key: 'private',   label: 'Private party',                    base: STARTING_PRICES.private, blurb: 'Birthdays, anniversaries, house parties, milestones' },
  { key: 'sweet16',   label: 'Sweet 16 / Quinceañera / Mitzvah', base: STARTING_PRICES.sweet16, blurb: 'Often shorter runtimes and earlier start times' },
  { key: 'duo',       label: 'DJ + live violin duo (Soul Shades)', base: STARTING_PRICES.duo, blurb: 'Live violin over the DJ set, ceremony through reception' },
];

// pricing.txt: NYC travel is included in the quoted total; NJ / Long Island /
// Westchester / CT are quoted on request; Hamptons and destination events
// start at $3,000 regardless of event type.
type RegionKey = 'nyc' | 'tristate' | 'hamptons';
const REGIONS: { key: RegionKey; label: string; note: string }[] = [
  { key: 'nyc',      label: 'New York City (5 boroughs)', note: 'Travel included in the quoted total' },
  { key: 'tristate', label: 'NJ, Long Island, Westchester or CT', note: 'Travel quoted upfront as a line item' },
  { key: 'hamptons', label: 'Hamptons, destination or international', note: 'Starts at $3,000; travel and riders coordinated separately' },
];

const HAMPTONS_FLOOR = HAMPTONS_MIN;
const VIOLIN_HOURLY = VIOLIN_RATE; // pricing.txt: "From $150/hour added to any DJ package"
const INCLUDED_HOURS = 5;  // EventDJCost: "Most quotes assume four to five hours"

// Extras DJ DX has not published a flat price for. Shown as interest
// checkboxes so the estimate stays honest and the inquiry still tells him what
// the client actually wants. The first two exist because he produces music and
// edits video himself - almost no competing DJ can offer either.
const QUOTED_EXTRAS = [
  { key: 'custom-edit',    label: 'Custom intro or edit produced for your event', hint: 'A bespoke first-dance edit, walk-in track, or company anthem, produced from scratch' },
  { key: 'highlight-reel', label: 'Highlight reel from the night',                hint: 'Edited video from your event, cut and delivered after' },
  { key: 'ceremony-sound', label: 'Separate ceremony or second-zone sound',       hint: 'A second system for an outdoor ceremony or terrace cocktail hour' },
  { key: 'uplighting',     label: 'Uplighting and dance-floor lighting',          hint: 'Room uplighting in your colors, plus floor lighting' },
  { key: 'extra-mics',     label: 'Extra wireless mics for speeches or awards',   hint: 'Beyond the wireless mics already included' },
];

const money = (n: number) => '$' + n.toLocaleString('en-US');

export default function QuoteCalculator({ formName = 'quote_calculator', defaultEvent = 'wedding' }: { formName?: string; defaultEvent?: EventKey }) {
  const [eventKey, setEventKey] = useState<EventKey>(defaultEvent);
  const [region, setRegion] = useState<RegionKey>('nyc');
  const [hours, setHours] = useState(5);
  const [violinHours, setViolinHours] = useState(0);
  const [extras, setExtras] = useState<string[]>([]);

  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [company, setCompany] = useState(''); // honeypot
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const mountedAt = useRef(Date.now());

  const selected = EVENT_TYPES.find(e => e.key === eventKey)!;

  // Nav, footer and hero links point at #quote-calculator, but every page
  // runs window.scrollTo(0, 0) on mount - and parent effects run after this
  // child's, so a plain hash jump gets undone. Scroll after the page settles,
  // and again on hash changes, since a router Link to the same page doesn't
  // remount anything.
  const location = useLocation();

  // ?event=corporate (or wedding/private/sweet16/duo) preselects the event type,
  // e.g. from a music poll's "Get your starting price" link. Applied after
  // mount so the prerendered HTML (no query string) still hydrates cleanly.
  useEffect(() => {
    const ev = new URLSearchParams(location.search).get('event');
    if (ev && EVENT_TYPES.some(t => t.key === ev)) setEventKey(ev as EventKey);
  }, [location.search]);
  useEffect(() => {
    if (location.hash !== '#quote-calculator') return;
    const jump = () => {
      const el = document.getElementById('quote-calculator');
      if (!el) return;
      const nav = document.querySelector('.nav') as HTMLElement | null;
      const top = el.getBoundingClientRect().top + window.scrollY - ((nav?.offsetHeight ?? 70) + 12);
      window.scrollTo({ top, behavior: 'smooth' });
    };
    const t1 = setTimeout(jump, 180);
    const t2 = setTimeout(jump, 900); // re-aim once images above it have loaded and shifted layout
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [location.key, location.hash]);

  const quote = useMemo(() => {
    const lines: { label: string; value: string }[] = [];

    // The Hamptons / destination floor replaces the base rate when it is higher
    const base = region === 'hamptons' ? Math.max(selected.base, HAMPTONS_FLOOR) : selected.base;
    lines.push({
      label: region === 'hamptons' && base === HAMPTONS_FLOOR
        ? `${selected.label} — Hamptons / destination rate`
        : selected.label,
      value: 'starting at ' + money(base),
    });

    let total = base;

    if (violinHours > 0) {
      const violin = violinHours * VIOLIN_HOURLY;
      total += violin;
      lines.push({ label: `Live violin — ${violinHours} hour${violinHours > 1 ? 's' : ''} × ${money(VIOLIN_HOURLY)}`, value: 'starting at ' + money(violin) });
    }
    if (hours > INCLUDED_HOURS) {
      lines.push({ label: `Additional hours beyond ${INCLUDED_HOURS} (${hours - INCLUDED_HOURS})`, value: 'quoted' });
    }
    if (region === 'tristate') {
      lines.push({ label: 'Travel outside NYC', value: 'quoted' });
    }
    for (const k of extras) {
      const x = QUOTED_EXTRAS.find(e => e.key === k);
      if (x) lines.push({ label: x.label, value: 'quoted' });
    }
    return { total, lines, hasQuoted: lines.some(l => l.value === 'quoted') };
  }, [selected, region, hours, violinHours, extras]);

  const toggleExtra = (k: string) =>
    setExtras(xs => (xs.includes(k) ? xs.filter(x => x !== k) : [...xs, k]));

  const summary = () => {
    const l = [
      `Instant estimate from the site calculator`,
      ``,
      `Event type: ${selected.label}`,
      `Region: ${REGIONS.find(r => r.key === region)!.label}`,
      `Hours on site: ${hours}`,
      violinHours > 0 ? `Live violin: ${violinHours} hour(s)` : null,
      extras.length ? `Extras requested: ${extras.map(k => QUOTED_EXTRAS.find(e => e.key === k)?.label).join('; ')}` : null,
      ``,
      `Starting price shown: ${money(quote.total)}+${quote.hasQuoted ? ' plus items marked quoted' : ''} (not a final quote)`,
    ].filter(Boolean);
    return l.join('\n');
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('sending');
    trackFormSubmit(formName);
    const metaEventId = crypto.randomUUID();
    const isEmail = contact.includes('@');
    try {
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quick: true,
          name,
          email: isEmail ? contact : '',
          phone: isEmail ? '' : contact,
          eventType: selected.label,
          eventDate,
          location: REGIONS.find(r => r.key === region)!.label,
          message: summary(),
          honeypot: company,
          elapsedMs: Date.now() - mountedAt.current,
          metaEventId,
          pageUrl: window.location.href,
        }),
      });
      if (!res.ok) throw new Error(`http_${res.status}`);
      trackLead({ form: formName, event_type: selected.label, value: quote.total }, metaEventId);
      setStatus('sent');
    } catch (err) {
      trackFormError(formName, err instanceof Error ? err.message : 'network_error');
      setStatus('error');
    }
  };

  return (
    <section className="qc" id="quote-calculator">
      <div className="qc-inner">
        <div className="sec-overline" style={{ justifyContent: 'center' }}>
          <span className="sec-overline-line" />
          <span className="sec-label">Instant Estimate</span>
          <span className="sec-overline-line" />
        </div>
        <h2 className="sec-title qc-title">See Your <span>Starting Price</span></h2>
        <p className="qc-sub">
          Starting prices from the same rate card DJ DX quotes from. Your final quote depends on
          your date, venue, hours, and guest count. Anything without a published flat rate is
          marked “quoted” instead of guessed at.
        </p>

        <div className="qc-grid">
          {/* ── CONTROLS ── */}
          <div className="qc-controls">
            <div className="qc-field">
              <label className="qc-label" htmlFor="qc-type">Event type</label>
              <select id="qc-type" className="qc-select" value={eventKey} onChange={e => { setEventKey(e.target.value as EventKey); trackEvent('quote_config', { field: 'event_type', value: e.target.value }); }}>
                {EVENT_TYPES.map(t => <option key={t.key} value={t.key}>{t.label}</option>)}
              </select>
              <p className="qc-hint">{selected.blurb}</p>
            </div>

            <div className="qc-field">
              <label className="qc-label" htmlFor="qc-region">Where is it?</label>
              <select id="qc-region" className="qc-select" value={region} onChange={e => setRegion(e.target.value as RegionKey)}>
                {REGIONS.map(r => <option key={r.key} value={r.key}>{r.label}</option>)}
              </select>
              <p className="qc-hint">{REGIONS.find(r => r.key === region)!.note}</p>
            </div>

            <div className="qc-field">
              <label className="qc-label" htmlFor="qc-hours">Hours on site: <strong>{hours}</strong></label>
              <input id="qc-hours" className="qc-range" type="range" min={3} max={10} step={1} value={hours} onChange={e => setHours(Number(e.target.value))} />
              <p className="qc-hint">Base covers up to {INCLUDED_HOURS} hours of performance. Setup and breakdown are on top and not billed as event hours.</p>
            </div>

            {eventKey !== 'duo' && (
              <div className="qc-field">
                <label className="qc-label" htmlFor="qc-violin">Live violin: <strong>{violinHours === 0 ? 'none' : `${violinHours} hr`}</strong></label>
                <input id="qc-violin" className="qc-range" type="range" min={0} max={5} step={1} value={violinHours} onChange={e => setViolinHours(Number(e.target.value))} />
                <p className="qc-hint">Live violin played over the DJ set, from {money(VIOLIN_HOURLY)}/hour. Most couples add it for the ceremony and cocktail hour.</p>
              </div>
            )}

            <div className="qc-field">
              <span className="qc-label">Anything else? (quoted with your estimate)</span>
              <div className="qc-extras">
                {QUOTED_EXTRAS.map(x => (
                  <label key={x.key} className={`qc-extra${extras.includes(x.key) ? ' is-on' : ''}`}>
                    <input type="checkbox" checked={extras.includes(x.key)} onChange={() => toggleExtra(x.key)} />
                    <span>
                      <strong>{x.label}</strong>
                      <em>{x.hint}</em>
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* ── RESULT ── */}
          <div className="qc-result">
            <div className="qc-total">
              {/* Starting price, never a final one - the label sits right on the
                  number and the "+" repeats it for anyone who only glances. */}
              <span className="qc-total-label">Starting at</span>
              <span className="qc-total-num">{money(quote.total)}<span className="qc-total-plus">+</span></span>
              <span className="qc-total-note">
                Your final quote depends on your date, venue, hours, and guest count
                {quote.hasQuoted ? ', plus the items marked “quoted” below' : ''}.
              </span>
            </div>

            <ul className="qc-lines">
              {quote.lines.map((l, i) => (
                <li key={i}><span>{l.label}</span><span className={l.value === 'quoted' ? 'qc-quoted' : ''}>{l.value}</span></li>
              ))}
            </ul>

            <div className="qc-included">
              <strong>Included in every booking</strong>
              <p>Professional sound sized to the room, wireless microphones, MC announcements, and a planning consultation before the event.</p>
            </div>

            {status === 'sent' ? (
              <div className="booking-success qc-success">
                <div className="booking-success-icon">✓</div>
                <h3>Estimate sent</h3>
                <p>Your configuration went straight to DJ DX. You’ll get a firm, itemized quote and a yes or no on your date within 24 hours.</p>
              </div>
            ) : (
              <form className="qc-form" onSubmit={handleSubmit}>
                <p className="qc-form-lead">Get this as a firm quote with your date checked:</p>
                <input className="qc-input" type="text" required placeholder="Your name" value={name} onChange={e => setName(e.target.value)} autoComplete="name" />
                <input className="qc-input" type="text" required placeholder="Email or phone" value={contact} onChange={e => setContact(e.target.value)} autoComplete="email" />
                <input className="qc-input" type="date" required aria-label="Event date" value={eventDate} onChange={e => setEventDate(e.target.value)} />
                <input type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" className="qc-hp" value={company} onChange={e => setCompany(e.target.value)} />
                <button className="btn-gold qc-submit" type="submit" disabled={status === 'sending'}>
                  {status === 'sending' ? 'Sending…' : 'Send me this quote'}
                </button>
                {status === 'error' && <p className="form-error">That didn’t go through. Email bookings@djdxmusic.com and it’ll get handled the same day.</p>}
                <p className="qc-fineprint">Starting prices. Final quotes depend on date, venue, hours, and equipment. No spam, no list.</p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
