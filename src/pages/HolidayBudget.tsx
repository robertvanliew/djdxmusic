import { useEffect, useMemo, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useSearchParams } from 'react-router-dom';
import SiteNav from '../components/SiteNav';
import SiteFooter from '../components/SiteFooter';
import StickyMobileCTA from '../components/StickyMobileCTA';
import AuthorBio from '../components/AuthorBio';
import BookingForm from '../components/BookingForm';
import { trackEvent } from '../lib/analytics';
import { CORP_PACKAGES } from '../data/packages';

// /office-holiday-party-budget-calculator: an editable NYC holiday party budget.
//
// RULES: every default comes from a source listed in SOURCES (checked Nov 2026)
// or from DJ DX's own published packages. Nothing is invented. Defaults are
// starting points the planner edits, and the page says so. If a source changes
// or 404s, update the number and its note together.

const URL = 'https://djdxmusic.com/office-holiday-party-budget-calculator';
const TITLE = 'Office Holiday Party Budget Calculator (NYC, 2026) | DJ DX';
const DESC = 'Plan an NYC office holiday party budget: food, open bar, service charge, 8.875% tax, DJ and photos, per guest and in total. Free, editable, printable.';

const SOURCES = {
  tagvenue: { name: 'Tagvenue, How Much Does a Holiday Party Cost in NYC? (Oct 2026)', url: 'https://www.tagvenue.com/blog/how-much-does-a-holiday-party-cost-in-nyc/' },
  zerocater: { name: 'ZeroCater, Office Catering Cost in New York City (2026)', url: 'https://zerocater.com/blog/office-catering-cost-new-york-city/' },
  lastword: { name: 'The Last Word, open bar price list on Tagvenue', url: 'https://www.tagvenue.com/us/rooms/new-york/57774/the-last-word/entire-venue' },
  ezcater: { name: 'ezCater 2025 Workplace Holiday Party Trends (BusinessWire, Nov 2025)', url: 'https://www.businesswire.com/news/home/20251112228610/en/' },
  nav: { name: 'Nav, Office Christmas Party Budget (2025)', url: 'https://www.nav.com/blog/office-christmas-party-budget-25705' },
  maher: { name: 'James Maher Photography, Event Photography Cost NYC (2026)', url: 'https://jamesmaherphotography.com/event-photography-cost-nyc/' },
} as const;

const FORMATS = [
  { key: 'reception', label: 'Cocktail reception (passed bites, stations)', food: 65, note: 'ZeroCater: $65-130 per person for client-facing events in NYC' },
  { key: 'dinner', label: 'Seated dinner', food: 95, note: 'ZeroCater: $95-130 per person for plated dinner with passed appetizers' },
] as const;
const BARS = [
  { key: 'none', label: 'No bar / cash bar', rate: 0 },
  { key: 'beerwine', label: 'Beer and wine', rate: 20 },
  { key: 'well', label: 'Full bar, well spirits', rate: 30 },
  { key: 'premium', label: 'Premium cocktails', rate: 50 },
] as const;
const DJS = [
  { key: 'none', label: 'No DJ', price: 0 },
  ...CORP_PACKAGES.map(p => ({ key: p.name.toLowerCase(), label: `DJ DX ${p.name} (${p.hours.toLowerCase()})`, price: p.price })),
  { key: 'other', label: 'Another DJ or band (enter amount)', price: 0 },
];
const TAX = 8.875;

type Inputs = { n: number; f: string; fp: number; b: string; bh: number; sc: number; dj: string; djx: number; ph: number; pr: number; v: number; o: number };
const DEFAULTS: Inputs = { n: 75, f: 'reception', fp: 65, b: 'beerwine', bh: 3, sc: 20, dj: 'essentials', djx: 0, ph: 0, pr: 300, v: 0, o: 0 };

const money = (x: number) => '$' + Math.round(x).toLocaleString('en-US');
const clamp = (x: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, Number.isFinite(x) ? x : lo));

// Tagvenue's NYC minimum-spend bands by group size
function minimumSpend(n: number): string {
  if (n <= 65) return 'about $2,750 on average for up to 65 guests';
  if (n <= 125) return '$2,500 to $7,000 for 65 to 125 guests';
  if (n <= 300) return 'from $5,000 for 125 to 300 guests';
  return 'from $10,000 for 300+ guests';
}

const FAQ = [
  { q: 'How much does an office holiday party cost in NYC per person?', a: 'Tagvenue puts NYC holiday parties at $65 to $200 per person in 2026: $30 to $70 at bars, $50 to $100 at restaurants (private dining averages about $65), and $55 to $105 for cocktail parties. Venue, food, drinks, service charge and tax are most of it; entertainment and photos are added on top.' },
  { q: 'How much should a company spend per employee on a holiday party?', a: 'Nav suggests about $75 to $200 per employee. ezCater\'s 2025 survey found companies spent an average of $59 per employee on food and drink alone, up 31% from 2024. In NYC, plan toward the upper half of those ranges.' },
  { q: 'What service charge and tax should I budget for in NYC?', a: 'Catering and venue service charges in NYC usually run 18% to 22% (ZeroCater), and New York City sales tax is 8.875%. Ask the venue whether its service charge is taxed and whether there is a separate admin fee; some add one.' },
  { q: 'What is a food and beverage minimum?', a: 'Many NYC venues waive a room fee if your food and drink spend reaches a set minimum. Tagvenue reports minimums averaging about $2,750 for up to 65 guests, $4,250 for 100 to 125 guests and $5,000 for 175 or more. If your food and bar total is below the minimum, you pay the difference anyway, so spend it on the menu.' },
  { q: 'How much is a DJ for an office holiday party in NYC?', a: 'DJ DX\'s corporate packages start at $2,800 for up to 5 hours, including professional sound, two wireless mics for speeches, MC announcements, a planning call, and a contract, COI and W-9. Signature is $4,500 with lighting and a second sound zone, and Production is $8,000 with live violin or piano and videography.' },
  { q: 'Is this calculator accurate for my party?', a: 'It is a starting budget, not a quote. Every default is editable and comes from the published sources listed on this page. Your venue\'s menu, minimum and fees decide the real number.' },
];

type SetFn = <K extends keyof Inputs>(k: K, x: Inputs[K]) => void;
function Num({ id, label, k, max, prefix, suffix, hint, v, set }: { id: string; label: string; k: keyof Inputs; max: number; prefix?: string; suffix?: string; hint?: string; v: Inputs; set: SetFn }) {
  // Only the maximum is enforced while typing, so a field can be cleared and retyped
  return (
    <div className="hb-field">
      <label htmlFor={id}>{label}</label>
      <div className="hb-num">{prefix && <span>{prefix}</span>}<input id={id} type="number" inputMode="decimal" min={0} max={max} placeholder="0" value={(v[k] as number) || ''} onChange={e => set(k, clamp(Number(e.target.value), 0, max) as never)} />{suffix && <span>{suffix}</span>}</div>
      {hint && <small>{hint}</small>}
    </div>
  );
}

export default function HolidayBudget() {
  const [sp, setSp] = useSearchParams();
  const fromUrl = useRef(sp.has('n'));
  const [v, setV] = useState<Inputs>(() => {
    if (!sp.has('n')) return DEFAULTS;
    const num = (k: keyof Inputs, lo: number, hi: number) => sp.has(k) ? clamp(Number(sp.get(k)), lo, hi) : DEFAULTS[k] as number;
    const pick = (k: keyof Inputs, ok: readonly string[]) => { const x = sp.get(k) || ''; return ok.includes(x) ? x : DEFAULTS[k] as string; };
    return {
      n: num('n', 5, 2000), f: pick('f', FORMATS.map(f => f.key)), fp: num('fp', 0, 1000), b: pick('b', BARS.map(b => b.key)), bh: num('bh', 0, 8),
      sc: num('sc', 0, 40), dj: pick('dj', DJS.map(d => d.key)), djx: num('djx', 0, 100000), ph: num('ph', 0, 12), pr: num('pr', 0, 2000), v: num('v', 0, 500000), o: num('o', 0, 500000),
    };
  });
  const [copied, setCopied] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const touched = useRef(false);

  useEffect(() => { if (!fromUrl.current) window.scrollTo(0, 0); else trackEvent('budget_opened_shared', {}); }, []);

  const set: SetFn = (k, x) => {
    if (!touched.current) { touched.current = true; trackEvent('budget_started', {}); }
    setV(cur => {
      const next = { ...cur, [k]: x };
      // Switching format resets food to that format's sourced default
      if (k === 'f') next.fp = FORMATS.find(f => f.key === x)?.food ?? cur.fp;
      return next;
    });
  };

  const r = useMemo(() => {
    const bar = BARS.find(b => b.key === v.b)!;
    const dj = DJS.find(d => d.key === v.dj)!;
    const food = v.n * v.fp;
    const drinks = v.n * bar.rate * (bar.rate ? v.bh : 0);
    const fb = food + drinks;
    const service = fb * v.sc / 100;
    const tax = fb * TAX / 100;
    const djCost = v.dj === 'other' ? v.djx : dj.price;
    const photo = v.ph * v.pr;
    const total = fb + service + tax + djCost + photo + v.v + v.o;
    const lines = [
      { k: 'Food', x: food }, { k: 'Open bar', x: drinks }, { k: `Service charge (${v.sc}%)`, x: service }, { k: `NYC sales tax (${TAX}%)`, x: tax },
      { k: 'Venue or room fee', x: v.v }, { k: 'DJ', x: djCost }, { k: 'Photographer', x: photo }, { k: 'Other (decor, gifts, rentals)', x: v.o },
    ].filter(l => l.x > 0);
    return { food, drinks, fb, service, tax, djCost, photo, total, per: total / Math.max(1, v.n), lines };
  }, [v]);

  const shareUrl = () => {
    const q = new URLSearchParams(Object.entries(v).map(([k, x]) => [k, String(x)]));
    return `${URL}?${q.toString()}`;
  };
  const share = async () => {
    const link = shareUrl();
    setSp(new URLSearchParams(link.split('?')[1]), { replace: true });
    try {
      if (navigator.share && window.matchMedia('(pointer: coarse)').matches) await navigator.share({ title: 'Holiday party budget', url: link });
      else { await navigator.clipboard.writeText(link); setCopied(true); setTimeout(() => setCopied(false), 2000); }
      trackEvent('budget_shared', { guests: v.n, total: Math.round(r.total) });
    } catch { /* share cancelled */ }
  };
  const message = `Holiday party budget from your calculator: ${v.n} guests, ${FORMATS.find(f => f.key === v.f)!.label.toLowerCase()}, ${BARS.find(b => b.key === v.b)!.label.toLowerCase()}. Estimated total ${money(r.total)} (${money(r.per)} per guest). DJ: ${DJS.find(d => d.key === v.dj)!.label}. Budget link: ${shareUrl()}`;
  const toBooking = () => {
    trackEvent('budget_to_booking', { guests: v.n, total: Math.round(r.total), dj: v.dj });
    setFormKey(k => k + 1);
    requestAnimationFrame(() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' }));
  };

  const printBudget = () => {
    trackEvent('budget_printed', {});
    document.body.classList.add('is-printing-budget');
    const done = () => { document.body.classList.remove('is-printing-budget'); window.removeEventListener('afterprint', done); };
    window.addEventListener('afterprint', done);
    window.print();
  };

  const schema = [
    { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Office Holiday Party Budget Calculator (NYC)', url: URL, applicationCategory: 'BusinessApplication', operatingSystem: 'Any (web browser)', offers: { '@type': 'Offer', price: 0, priceCurrency: 'USD' }, provider: { '@id': 'https://djdxmusic.com/#djdx' }, description: 'Free, editable NYC office holiday party budget: food, open bar, service charge, sales tax, DJ and photographer, per guest and in total, with sourced defaults.' },
    { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: FAQ.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) },
    { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://djdxmusic.com/' },
      { '@type': 'ListItem', position: 2, name: 'Holiday Party DJ', item: 'https://djdxmusic.com/holiday-party-dj-nyc-nj-ct' },
      { '@type': 'ListItem', position: 3, name: 'Holiday Party Budget Calculator', item: URL },
    ] },
  ];

  const fmt = FORMATS.find(f => f.key === v.f)!;
  const max = Math.max(...r.lines.map(l => l.x), 1);

  return (
    <>
      <Helmet>
        <title>{TITLE}</title>
        <meta name="description" content={DESC} />
        <link rel="canonical" href={URL} />
        <meta property="og:title" content="NYC Office Holiday Party Budget Calculator | DJ DX" />
        <meta property="og:description" content={DESC} />
        <meta property="og:url" content={URL} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </Helmet>
      <SiteNav />
      <main className="vn-main hb-main">
        <div className="vn-inner">
          <nav className="vn-crumbs" aria-label="Breadcrumb"><Link to="/holiday-party-dj-nyc-nj-ct">Holiday Party DJ</Link> / Budget Calculator</nav>
          <div className="sec-overline"><span className="sec-label">Free planning tool · NYC 2026</span></div>
          <h1 className="sec-title vn-h1">Office holiday party <span>budget calculator</span></h1>
          <p className="vn-p vn-lead">
            Set your headcount and format and get a full NYC budget: food, open bar, service charge, 8.875% sales tax, DJ and photos,
            in total and per guest. Every default is a published NYC figure, cited below, and every number is yours to change.
          </p>

          <div className="hb-grid">
            <form className="hb-form" onSubmit={e => e.preventDefault()} aria-label="Budget inputs">
              <fieldset>
                <legend>Guests and food</legend>
                <Num v={v} set={set} id="hb-n" label="Guests" k="n" max={2000} />
                <div className="hb-field">
                  <label htmlFor="hb-f">Format</label>
                  <select id="hb-f" value={v.f} onChange={e => set('f', e.target.value)}>{FORMATS.map(f => <option key={f.key} value={f.key}>{f.label}</option>)}</select>
                </div>
                <Num v={v} set={set} id="hb-fp" label="Food per guest" k="fp" max={1000} prefix="$" hint={fmt.note} />
              </fieldset>
              <fieldset>
                <legend>Open bar</legend>
                <div className="hb-field">
                  <label htmlFor="hb-b">Bar package</label>
                  <select id="hb-b" value={v.b} onChange={e => set('b', e.target.value)}>{BARS.map(b => <option key={b.key} value={b.key}>{b.label}{b.rate ? ` ($${b.rate} per guest per hour)` : ''}</option>)}</select>
                  <small>Per-hour rates from a published NYC venue price list (The Last Word)</small>
                </div>
                {v.b !== 'none' && <Num v={v} set={set} id="hb-bh" label="Bar hours" k="bh" max={8} />}
                <Num v={v} set={set} id="hb-sc" label="Service charge" k="sc" max={40} suffix="%" hint="NYC catering usually 18-22% (ZeroCater)" />
              </fieldset>
              <fieldset>
                <legend>Entertainment and extras</legend>
                <div className="hb-field">
                  <label htmlFor="hb-dj">DJ</label>
                  <select id="hb-dj" value={v.dj} onChange={e => set('dj', e.target.value)}>{DJS.map(d => <option key={d.key} value={d.key}>{d.label}{d.price ? `: ${money(d.price)}` : ''}</option>)}</select>
                </div>
                {v.dj === 'other' && <Num v={v} set={set} id="hb-djx" label="DJ or band amount" k="djx" max={100000} prefix="$" />}
                <Num v={v} set={set} id="hb-ph" label="Photographer hours" k="ph" max={12} hint="0 if you don't need one" />
                {v.ph > 0 && <Num v={v} set={set} id="hb-pr" label="Photographer rate" k="pr" max={2000} prefix="$" suffix="/hr" hint="Most NYC event photographers: $300-500 per hour (James Maher)" />}
                <Num v={v} set={set} id="hb-v" label="Venue or room fee" k="v" max={500000} prefix="$" hint="Often $0 when you meet the venue's food and drink minimum" />
                <Num v={v} set={set} id="hb-o" label="Other (decor, gifts, rentals)" k="o" max={500000} prefix="$" hint="Rentals if the venue doesn't supply them: $5-18 per guest (ZeroCater)" />
              </fieldset>
            </form>

            <aside className="hb-result" aria-live="polite" aria-label="Your budget">
              <p className="hb-print-only">NYC office holiday party budget · djdxmusic.com/office-holiday-party-budget-calculator</p>
              <p className="hb-over">Estimated total</p>
              <p className="hb-total">{money(r.total)}</p>
              <p className="hb-per">{money(r.per)} per guest · {v.n} guests</p>
              <ul className="hb-lines">
                {r.lines.map(l => (
                  <li key={l.k}><span>{l.k}</span><b>{money(l.x)}</b><i style={{ transform: `scaleX(${l.x / max})` }} aria-hidden="true" /></li>
                ))}
              </ul>
              <p className="hb-check">
                {r.per < 65 ? 'Below' : r.per > 200 ? 'Above' : 'Inside'} the $65-200 per person range Tagvenue reports for NYC holiday parties.
              </p>
              <p className="hb-check">Typical NYC food and drink minimum: {minimumSpend(v.n)}. Your food and bar: {money(r.fb)}.</p>
              <div className="hb-actions vs-noprint">
                <button type="button" className="btn-gold" onClick={toBooking}>Send this budget to DJ DX</button>
                <button type="button" className="btn-ghost" onClick={share}>{copied ? 'Link copied' : 'Share with finance'}</button>
                <button type="button" className="btn-ghost" onClick={printBudget}>Print</button>
              </div>
              <p className="hb-fine">A planning estimate, not a quote. Venue menus, minimums and fees set the final number.</p>
            </aside>
          </div>

          <section className="vn-sec">
            <h2 className="vn-h2">What an NYC office holiday party costs</h2>
            <p className="vn-p">
              Tagvenue's 2026 NYC numbers put a holiday party at <strong>$65 to $200 per person</strong>. Where you hold it moves that most:
              bars run about $30 to $70 per person, restaurants $50 to $100 (private dining averages about $65), and cocktail parties
              $55 to $105. Catering alone is $65 to $130 per person for a client-facing event and $85 to $225 or more for a large company
              holiday party, according to ZeroCater, before an 18 to 22% service charge and 8.875% sales tax.
            </p>
            <p className="vn-p">
              Nationally, ezCater's 2025 survey found companies spent an average of $59 per employee on holiday party food and drink,
              up 31% from 2024, and about half of decision makers planned to raise their budgets. Nav's rule of thumb is $75 to $200 per
              employee all in.
            </p>
          </section>

          <section className="vn-sec">
            <h2 className="vn-h2">Where the budget goes further</h2>
            <ul className="pl-list hb-tips">
              <li><strong>Meet the minimum on food, not fees.</strong><span>If the venue has a food and drink minimum, a richer menu often costs the same as paying the shortfall.</span></li>
              <li><strong>Beer and wine plus one signature cocktail.</strong><span>On the price list above, a full bar is $10 more per guest per hour than beer and wine. Over three hours for 75 guests that is $2,250 before service and tax.</span></li>
              <li><strong>Shorten the bar, not the party.</strong><span>Close the bar 30 minutes before the last song. People keep dancing.</span></li>
              <li><strong>One vendor for sound, mics and music.</strong><span>DJ DX's packages include the speech mics and the PA for toasts and awards, so there is no separate AV rental for a standard room.</span></li>
              <li><strong>Ask the team what they want to hear.</strong><span>The free <Link to="/office-party-music-poll">office party music poll</Link> gives you a crowd report in a day, so the music lands for the people who are actually there.</span></li>
            </ul>
          </section>

          <section className="vn-sec" id="faq">
            <h2 className="vn-h2">Questions planners ask</h2>
            {FAQ.map(f => <div key={f.q} className="pl-faq"><h3>{f.q}</h3><p className="vn-p">{f.a}</p></div>)}
          </section>

          <section className="vn-sec hb-sources">
            <h2 className="vn-h2">Sources</h2>
            <p className="vn-p">Figures checked November 2026. DJ prices are DJ DX's published <Link to="/corporate-event-dj-nyc-nj-ct">corporate packages</Link>.</p>
            <ul className="hb-src">{Object.values(SOURCES).map(s => <li key={s.url}><a href={s.url} target="_blank" rel="noopener noreferrer">{s.name}</a></li>)}</ul>
          </section>

          <section className="vn-sec vs-noprint">
            <h2 className="vn-h2">More for the holiday party</h2>
            <p className="vn-p">
              <Link to="/holiday-party-dj-nyc-nj-ct">Holiday party DJ in NYC, NJ and CT</Link> ·{' '}
              <Link to="/office-holiday-party-playlist">Office holiday party playlist</Link> ·{' '}
              <Link to="/office-party-music-poll">Office party music poll</Link> ·{' '}
              <Link to="/live-run-of-show">Live run of show</Link> ·{' '}
              <Link to="/song-request-qr-code">Song request QR code</Link> ·{' '}
              <Link to="/new-years-eve-dj-nyc">New Year's Eve DJ</Link>
            </p>
          </section>
        </div>
      </main>

      <section id="booking" className="booking vs-noprint" style={{ padding: '80px 24px' }}>
        <div className="section-inner">
          <div className="booking-layout">
            <div className="booking-left">
              <div className="sec-overline"><span className="sec-label">Check a Date</span></div>
              <h2 className="sec-title">Budget set? <span>Lock the DJ.</span></h2>
              <p style={{ color: 'rgba(242,242,242,0.55)', lineHeight: 1.8, marginTop: '16px' }}>
                Send your date and venue. Your budget goes in the message, and you hear back within 24 hours with availability and a fixed quote.
              </p>
            </div>
            <div className="booking-right">
              <BookingForm key={formKey} formName="holiday_budget" initial={formKey ? { eventType: 'Corporate Event / Holiday Party', message } : { eventType: 'Corporate Event / Holiday Party' }} />
            </div>
          </div>
        </div>
      </section>
      <AuthorBio />
      <StickyMobileCTA formName="holiday_budget_sticky" label="Check My Date" />
      <SiteFooter />
    </>
  );
}
