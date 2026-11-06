import { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useSearchParams } from 'react-router-dom';
import SiteNav from '../components/SiteNav';
import SiteFooter from '../components/SiteFooter';
import AuthorBio from '../components/AuthorBio';
import BookingForm from '../components/BookingForm';
import { trackEvent } from '../lib/analytics';
import { CORP_PACKAGES } from '../data/packages';
import { STARTING_PRICES, HAMPTONS_FLOOR, VIOLIN_HOURLY } from '../lib/pricing';

// /dj-proposal-for-planners: a planner or agency builds a one-page DJ DX
// proposal to forward to their client (print to PDF, or a share link).
//
// RULES: prices and terms come only from public/pricing.txt, src/lib/pricing.ts
// and src/data/packages.ts. Anything without a published price (travel outside
// NYC, extra hours) is written as "quoted", never estimated. Nothing the planner
// types is sent anywhere unless they press "Hold this date", which only fills
// the booking form for them to send.

const URL = 'https://djdxmusic.com/dj-proposal-for-planners';
const TITLE = 'DJ Proposal Builder for Event Planners (NYC) | DJ DX';
const DESC = 'Event planners and agencies: build a one-page DJ DX proposal for your client with packages, inclusions, COI and terms. Print to PDF or share a link.';

type Ev = 'corporate' | 'wedding' | 'private' | 'duo';
const EVENTS: { key: Ev; label: string }[] = [
  { key: 'corporate', label: 'Corporate event or holiday party' },
  { key: 'wedding', label: 'Wedding' },
  { key: 'private', label: 'Private party' },
  { key: 'duo', label: 'DJ + live violin (Soul Shades)' },
];
type Region = 'nyc' | 'tristate' | 'hamptons';
const REGIONS: { key: Region; label: string; travel: string }[] = [
  { key: 'nyc', label: 'New York City (5 boroughs)', travel: 'Travel included' },
  { key: 'tristate', label: 'NJ, Long Island, Westchester or CT', travel: 'Travel quoted upfront as a line item' },
  { key: 'hamptons', label: 'Hamptons or destination (US and Puerto Rico)', travel: `From ${'$' + HAMPTONS_FLOOR.toLocaleString('en-US')}; travel coordinated by DJ DX` },
];
const BASE_INCLUDES: Record<Exclude<Ev, 'corporate'>, string[]> = {
  wedding: ['Professional sound sized to the room', 'Wireless mics for toasts', 'MC announcements and grand entrance', 'Ceremony, cocktail hour, reception and after-party coverage available', 'Planning call, must-play and do-not-play lists'],
  private: ['Professional sound', 'Wireless mics', 'MC announcements', 'Custom playlist consultation'],
  duo: ['DJ DX with Julie Schatz on live violin over the DJ set', 'Ceremony, cocktail hour and reception', 'Professional sound and wireless mics', 'Planning call with both performers'],
};
const ALWAYS = ['Live run of show the planner edits from a phone; the DJ sees changes in seconds', 'Guest QR card: guests see what is playing and get the set list after', 'Set Receipt: every song played, checked against the must-play and do-not-play lists', 'Written contract; certificate of insurance (COI) and W-9 on request'];

const money = (x: number) => '$' + Math.round(x).toLocaleString('en-US');

export default function PlannerProposal() {
  const [sp] = useSearchParams();
  const pick = <T extends string>(k: string, ok: readonly T[], d: T): T => { const x = sp.get(k) as T; return ok.includes(x) ? x : d; };
  const [f, setF] = useState(() => ({
    ev: pick<Ev>('ev', EVENTS.map(e => e.key), 'corporate'),
    pkg: pick('pkg', CORP_PACKAGES.map(p => p.name), 'Essentials'),
    region: pick<Region>('r', REGIONS.map(r => r.key), 'nyc'),
    date: /^\d{4}-\d{2}-\d{2}$/.test(sp.get('d') || '') ? sp.get('d')! : '',
    guests: sp.get('g')?.replace(/\D/g, '').slice(0, 5) || '',
    vh: Math.min(8, Math.max(0, Number(sp.get('vh')) || 0)),
    planner: (sp.get('p') || '').slice(0, 80),
    client: (sp.get('c') || '').slice(0, 80),
    venue: (sp.get('v') || '').slice(0, 100),
  }));
  const [copied, setCopied] = useState(false);
  const [formKey, setFormKey] = useState(0);
  useEffect(() => { if (sp.has('ev')) trackEvent('proposal_opened_shared', {}); else window.scrollTo(0, 0); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const up = (k: keyof typeof f, x: string | number) => setF(cur => ({ ...cur, [k]: x }));

  const q = useMemo(() => {
    const region = REGIONS.find(r => r.key === f.region)!;
    let name: string, base: number, hours: string, includes: string[];
    if (f.ev === 'corporate') {
      const p = CORP_PACKAGES.find(x => x.name === f.pkg)!;
      name = `Corporate ${p.name}`; base = p.price; hours = p.hours; includes = p.includes;
    } else {
      name = f.ev === 'wedding' ? 'Wedding DJ' : f.ev === 'private' ? 'Private event DJ' : 'Soul Shades: DJ + live violin';
      base = STARTING_PRICES[f.ev]; hours = 'Hours set to your timeline'; includes = BASE_INCLUDES[f.ev];
    }
    if (f.region === 'hamptons') base = Math.max(base, HAMPTONS_FLOOR);
    // Production already includes live violin; the duo is built around it
    const violinOk = !(f.ev === 'duo' || (f.ev === 'corporate' && f.pkg === 'Production'));
    const violin = violinOk ? f.vh * VIOLIN_HOURLY : 0;
    return { name, base, hours, includes, violin, violinOk, total: base + violin, region };
  }, [f]);

  const link = () => {
    const p = new URLSearchParams({ ev: f.ev, r: f.region, ...(f.ev === 'corporate' ? { pkg: f.pkg } : {}), ...(f.date ? { d: f.date } : {}), ...(f.guests ? { g: f.guests } : {}), ...(f.vh ? { vh: String(f.vh) } : {}), ...(f.planner ? { p: f.planner } : {}), ...(f.client ? { c: f.client } : {}), ...(f.venue ? { v: f.venue } : {}) });
    return `${URL}?${p.toString()}`;
  };
  const share = async () => {
    try { await navigator.clipboard.writeText(link()); setCopied(true); setTimeout(() => setCopied(false), 2000); trackEvent('proposal_shared', { ev: f.ev }); } catch { /* clipboard blocked */ }
  };
  const print = () => { trackEvent('proposal_printed', { ev: f.ev, total: q.total }); document.body.classList.add('is-printing-proposal'); const done = () => { document.body.classList.remove('is-printing-proposal'); window.removeEventListener('afterprint', done); }; window.addEventListener('afterprint', done); window.print(); };
  const hold = () => {
    trackEvent('proposal_to_booking', { ev: f.ev, total: q.total });
    setFormKey(k => k + 1);
    requestAnimationFrame(() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' }));
  };
  const prettyDate = f.date ? new Date(`${f.date}T12:00:00`).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }) : 'Date to confirm';
  const eventType = f.ev === 'corporate' ? 'Corporate Event / Holiday Party' : f.ev === 'wedding' ? 'Wedding' : f.ev === 'private' ? 'Private Party / Birthday' : 'DJ + Live Violin (Soul Shades)';
  const message = `Planner proposal${f.planner ? ` from ${f.planner}` : ''}: ${q.name}, ${prettyDate}${f.venue ? `, ${f.venue}` : ''}, ${q.region.label}${f.guests ? `, ${f.guests} guests` : ''}${q.violin ? `, live violin ${f.vh} hr` : ''}. Proposal total from ${money(q.total)}. Please confirm availability. ${link()}`;

  const schema = [
    { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'DJ Proposal Builder for Event Planners', url: URL, applicationCategory: 'BusinessApplication', operatingSystem: 'Any (web browser)', offers: { '@type': 'Offer', price: 0, priceCurrency: 'USD' }, provider: { '@id': 'https://djdxmusic.com/#djdx' }, description: 'Event planners build a one-page DJ DX proposal for their client, with published packages, inclusions and booking terms, then print it or share a link.' },
    { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://djdxmusic.com/' },
      { '@type': 'ListItem', position: 2, name: 'For Planners', item: 'https://djdxmusic.com/planners' },
      { '@type': 'ListItem', position: 3, name: 'DJ Proposal Builder', item: URL },
    ] },
  ];

  return (
    <>
      <Helmet>
        <title>{TITLE}</title>
        <meta name="description" content={DESC} />
        <link rel="canonical" href={URL} />
        <meta property="og:title" content="DJ Proposal Builder for Event Planners | DJ DX" />
        <meta property="og:description" content={DESC} />
        <meta property="og:url" content={URL} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </Helmet>
      <SiteNav />
      <main className="vn-main pp-main">
        <div className="vn-inner">
          <nav className="vn-crumbs pp-noprint" aria-label="Breadcrumb"><Link to="/planners">For Planners</Link> / DJ Proposal Builder</nav>
          <div className="pp-noprint">
            <div className="sec-overline"><span className="sec-label">For planners and agencies</span></div>
            <h1 className="sec-title vn-h1">A DJ proposal <span>your client can sign off on</span></h1>
            <p className="vn-p vn-lead">
              Pick the event and package, add your name and your client's, and get a clean one-page proposal with published prices,
              what's included and the booking terms. Print it to PDF or send a link. It stays on your device until you choose to send it.
            </p>
          </div>

          <div className="pp-grid">
            <form className="hb-form pp-noprint" onSubmit={e => e.preventDefault()} aria-label="Proposal details">
              <fieldset>
                <legend>The event</legend>
                <div className="hb-field"><label htmlFor="pp-ev">Event</label>
                  <select id="pp-ev" value={f.ev} onChange={e => up('ev', e.target.value)}>{EVENTS.map(e => <option key={e.key} value={e.key}>{e.label}</option>)}</select></div>
                {f.ev === 'corporate' && <div className="hb-field"><label htmlFor="pp-pkg">Package</label>
                  <select id="pp-pkg" value={f.pkg} onChange={e => up('pkg', e.target.value)}>{CORP_PACKAGES.map(p => <option key={p.name} value={p.name}>{p.name}: {money(p.price)}</option>)}</select></div>}
                <div className="hb-field"><label htmlFor="pp-r">Where</label>
                  <select id="pp-r" value={f.region} onChange={e => up('region', e.target.value)}>{REGIONS.map(r => <option key={r.key} value={r.key}>{r.label}</option>)}</select></div>
                <div className="hb-field"><label htmlFor="pp-d">Date</label><input id="pp-d" type="date" value={f.date} onChange={e => up('date', e.target.value)} /></div>
                <div className="hb-field"><label htmlFor="pp-v">Venue (optional)</label><input id="pp-v" maxLength={100} value={f.venue} onChange={e => up('venue', e.target.value)} /></div>
                <div className="hb-field"><label htmlFor="pp-g">Guests (optional)</label><input id="pp-g" inputMode="numeric" maxLength={5} value={f.guests} onChange={e => up('guests', e.target.value.replace(/\D/g, ''))} /></div>
                {q.violinOk && <div className="hb-field"><label htmlFor="pp-vh">Add live violin (hours)</label><input id="pp-vh" type="number" min={0} max={8} value={f.vh} onChange={e => up('vh', Math.min(8, Math.max(0, Number(e.target.value) || 0)))} /><small>From {money(VIOLIN_HOURLY)} per hour, Julie Schatz</small></div>}
              </fieldset>
              <fieldset>
                <legend>Names on the proposal</legend>
                <div className="hb-field"><label htmlFor="pp-p">Your company (optional)</label><input id="pp-p" maxLength={80} value={f.planner} onChange={e => up('planner', e.target.value)} /></div>
                <div className="hb-field"><label htmlFor="pp-c">Prepared for (optional)</label><input id="pp-c" maxLength={80} value={f.client} onChange={e => up('client', e.target.value)} /></div>
              </fieldset>
            </form>

            <article className="pp-doc" aria-label="Proposal preview">
              <header className="pp-head">
                <p className="pp-brand">DJ DX <span>djdxmusic.com · (646) 470-3469 · bookings@djdxmusic.com</span></p>
                <h2>DJ proposal</h2>
                <p className="pp-meta">{f.client ? <>Prepared for <b>{f.client}</b></> : 'Prepared for your client'}{f.planner && <> by <b>{f.planner}</b></>}</p>
              </header>
              <dl className="pp-facts">
                <div><dt>Event</dt><dd>{EVENTS.find(e => e.key === f.ev)!.label}</dd></div>
                <div><dt>Date</dt><dd>{prettyDate}</dd></div>
                <div><dt>Where</dt><dd>{f.venue ? `${f.venue}, ` : ''}{q.region.label}</dd></div>
                {f.guests && <div><dt>Guests</dt><dd>{f.guests}</dd></div>}
              </dl>
              <section>
                <h3>{q.name}</h3>
                <p className="pp-hours">{q.hours}</p>
                <ul>{q.includes.map(i => <li key={i}>{i}</li>)}{ALWAYS.map(i => <li key={i}>{i}</li>)}</ul>
              </section>
              <table className="pp-price">
                <tbody>
                  <tr><td>{q.name}</td><td>{f.ev === 'corporate' ? '' : 'from '}{money(q.base)}</td></tr>
                  {q.violin > 0 && <tr><td>Live violin, {f.vh} hour{f.vh === 1 ? '' : 's'}</td><td>from {money(q.violin)}</td></tr>}
                  <tr><td>Travel</td><td>{q.region.travel}</td></tr>
                  <tr className="pp-total"><td>Total</td><td>from {money(q.total)}</td></tr>
                </tbody>
              </table>
              <section className="pp-terms">
                <h3>Booking terms</h3>
                <ul>
                  <li>50% deposit and a signed contract hold the date; the balance is due 14 days before the event.</li>
                  <li>One free date change to any date within 12 months, subject to availability.</li>
                  <li>The DJ you book is the DJ who plays.</li>
                  <li>Final price confirmed with availability, venue and hours, within 24 hours.</li>
                </ul>
                <p className="pp-fine">Published prices as of {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}. Full policy: djdxmusic.com/booking-policy · Stage plot and input list: djdxmusic.com/planners</p>
              </section>
            </article>
          </div>

          <div className="hb-actions pp-noprint pp-actions">
            <button type="button" className="btn-gold" onClick={hold}>Hold this date with DJ DX</button>
            <button type="button" className="btn-ghost" onClick={print}>Print or save as PDF</button>
            <button type="button" className="btn-ghost" onClick={share}>{copied ? 'Link copied' : 'Copy link for your client'}</button>
          </div>

          <section className="vn-sec pp-noprint">
            <h2 className="vn-h2">Why planners send DJ DX</h2>
            <p className="vn-p">
              The proposal answers the questions clients ask before they approve a vendor: what is included, what it costs, what
              the deposit is and what happens if the date moves. On the night, you get a <Link to="/live-run-of-show">live run of show</Link> you
              edit from your phone, and afterwards a Set Receipt of every song played. Stage plot, input list and the printable vendor sheet are
              on the <Link to="/planners">planner page</Link>.
            </p>
            <p className="vn-p">
              <Link to="/planners">Vendor sheet for planners</Link> · <Link to="/corporate-event-dj-nyc-nj-ct">Corporate event DJ</Link> ·{' '}
              <Link to="/office-holiday-party-budget-calculator">Holiday party budget calculator</Link> · <Link to="/venues">Venues DJ DX has played</Link> ·{' '}
              <Link to="/open-dates">Open dates</Link>
            </p>
          </section>
        </div>
      </main>

      <section id="booking" className="booking pp-noprint" style={{ padding: '80px 24px' }}>
        <div className="section-inner">
          <div className="booking-layout">
            <div className="booking-left">
              <div className="sec-overline"><span className="sec-label">Hold the Date</span></div>
              <h2 className="sec-title">Client said yes? <span>Lock it in.</span></h2>
              <p style={{ color: 'rgba(242,242,242,0.55)', lineHeight: 1.8, marginTop: '16px' }}>
                The proposal goes in the message. You hear back within 24 hours with availability and the contract.
              </p>
            </div>
            <div className="booking-right">
              <BookingForm key={formKey} formName="planner_proposal" initial={formKey ? { eventType, eventDate: f.date, message } : { eventType }} />
            </div>
          </div>
        </div>
      </section>
      <div className="pp-noprint"><AuthorBio /><SiteFooter /></div>
    </>
  );
}
