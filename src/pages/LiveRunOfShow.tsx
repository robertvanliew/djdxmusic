import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion, useScroll, useTransform, useMotionValueEvent, type MotionValue } from 'motion/react';
import SiteNav from '../components/SiteNav';
import SiteFooter from '../components/SiteFooter';
import '../show.css';
import '../liveshow.css';

// /live-run-of-show: the two planner-facing tools, explained with scroll-driven
// 3D scenes (motion), plus the free "create a live run of show" form.
// The receipt shown here is a labelled sample, not a real event.

const URL = 'https://djdxmusic.com/live-run-of-show';
const EASE = [0.23, 1, 0.32, 1] as const;

const FAQ = [
  { q: 'What is a live run of show?', a: 'A run of show is the timeline of an event: doors, welcome, dinner, toasts, awards, dancing, last song. A live one is a link instead of a PDF. The planner edits it from a phone, and the DJ sees every change at the booth within seconds, with the time it was made.' },
  { q: 'Is the live run of show free?', a: 'Yes. Anyone planning an event can create one here, even without booking DJ DX. Clients who book DJ DX get one automatically when they send their music plan.' },
  { q: 'What is a Set Receipt?', a: 'After the last song, DJ DX sends the client a list of every song played, in order, with time stamps from his DJ software, checked against their must-play and do-not-play lists. It shows which must-plays were hit and confirms that no do-not-play song was played.' },
  { q: 'How does DJ DX know what he played?', a: 'His DJ software, Serato DJ Pro, records each track as it plays and publishes it to a live playlist. The Set Receipt is built from that record, so it reflects what actually played, not what was planned.' },
  { q: 'Does the Set Receipt work at every venue?', a: 'It needs an internet connection at the DJ booth, usually a phone hotspot. If a venue has no signal, the set is still recorded and the receipt is sent after the event.' },
];

export default function LiveRunOfShow() {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  const reduceMotion = !!useReducedMotion();
  const [small, setSmall] = useState(false);
  useEffect(() => { const m = window.matchMedia('(max-width: 900px)'); const f = () => setSmall(m.matches); f(); m.addEventListener('change', f); return () => m.removeEventListener('change', f); }, []);
  // Scroll-linked 3D only where the scenes pin (desktop) and motion is allowed
  const reduce = reduceMotion || small;
  const schema = [
    { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Live Run of Show', url: URL, applicationCategory: 'BusinessApplication', operatingSystem: 'Any (web browser)', offers: { '@type': 'Offer', price: 0, priceCurrency: 'USD' }, provider: { '@id': 'https://djdxmusic.com/#djdx' }, description: 'A free, shareable event timeline the planner edits from a phone and the DJ sees live at the booth, with timestamped changes.' },
    { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: FAQ.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) },
    { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: 'https://djdxmusic.com/' }, { '@type': 'ListItem', position: 2, name: 'Live Run of Show', item: URL }] },
  ];
  return (
    <>
      <Helmet>
        <title>Live Run of Show for Event Planners + DJ Set Receipt | DJ DX</title>
        <meta name="description" content="A free live run of show: edit the event timeline from your phone and the DJ sees each change at the booth. Plus a Set Receipt of every song played." />
        <link rel="canonical" href={URL} />
        <meta property="og:title" content="Live Run of Show + Set Receipt | DJ DX" />
        <meta property="og:url" content={URL} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </Helmet>
      <SiteNav />
      <main className="ls-main">
        <section className="ls-hero">
          <motion.p className="ls-over" initial={reduce ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE }}>For planners and clients</motion.p>
          <motion.h1 className="ls-h1" initial={reduce ? false : { y: 14 }} animate={{ y: 0 }} transition={{ duration: 0.6, ease: EASE, delay: 0.05 }}>
            Change the night from your phone. <span>Get proof of every song.</span>
          </motion.h1>
          <motion.p className="ls-lead" initial={reduce ? false : { y: 10 }} animate={{ y: 0 }} transition={{ duration: 0.6, delay: 0.15 }}>
            Two tools DJ DX built for the people running the event. A live run of show that reaches the DJ booth in seconds,
            and a Set Receipt that lists every song played against your must-play and do-not-play lists.
          </motion.p>
          <div className="ls-ctas">
            <a href="#create" className="btn-gold">Create a free run of show</a>
            <a href="#receipt" className="btn-ghost">See the Set Receipt</a>
          </div>
        </section>

        <PhoneScene reduce={reduce} />
        <ReceiptScene reduce={reduce} />

        <section className="ls-sec" id="create">
          <div className="ls-inner ls-narrow">
            <p className="ls-over">Free tool</p>
            <h2 className="ls-h2">Create a live run of show</h2>
            <p className="ls-p">No account. You get a private edit link by email, plus a read-only booth link to send your DJ or any vendor.</p>
            <CreateForm />
          </div>
        </section>

        <section className="ls-sec">
          <div className="ls-inner ls-narrow">
            <h2 className="ls-h2">Questions</h2>
            {FAQ.map(f => <div key={f.q} className="pl-faq"><h3>{f.q}</h3><p className="ls-p">{f.a}</p></div>)}
            <p className="ls-p">Booking DJ DX? Both tools are included. <Link to="/corporate-event-dj-nyc-nj-ct">Corporate events</Link> · <Link to="/wedding-dj-nyc-nj">Weddings</Link> · <Link to="/open-dates">Open dates</Link></p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

// ── Scene 1: the phone turns toward you; a change travels to the booth ──────
const TIMELINE = [
  { t: '6:00 PM', l: 'Doors open' },
  { t: '7:15 PM', l: 'CEO welcome', moved: '7:45 PM' },
  { t: '8:00 PM', l: 'Awards' },
  { t: '9:00 PM', l: 'Dance floor opens' },
];
function PhoneScene({ reduce }: { reduce: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const rotY = useTransform(scrollYProgress, [0, 0.35], [-28, 0]);
  const rotX = useTransform(scrollYProgress, [0, 0.35], [14, 0]);
  const boothY = useTransform(scrollYProgress, [0.45, 0.7], [60, 0]);
  const boothO = useTransform(scrollYProgress, [0.45, 0.62], [0, 1]);
  const [scrollStep, setStep] = useState(0);
  const stepRef = useRef(0);
  useMotionValueEvent(scrollYProgress, 'change', v => {
    const s = v < 0.3 ? 0 : v < 0.6 ? 1 : 2;
    if (s !== stepRef.current) { stepRef.current = s; setStep(s); }
  });
  // Without the pinned scroll scene (phones, reduced motion) show the finished story
  const step = reduce ? 2 : scrollStep;
  const STEPS = [
    ['Edit from your phone', 'The CEO is running late. Drag the welcome to 7:45 PM from the coat check, no call needed.'],
    ['It saves itself', 'No save button, no email thread. The change is stored the second you type it.'],
    ['The booth sees it in seconds', 'DJ DX\'s booth screen refreshes every 5 seconds and lights up what moved, with the time it changed.'],
  ];
  return (
    <section ref={ref} className="ls-scene" aria-label="How the live run of show works">
      <div className="ls-sticky">
        <div className="ls-copy">
          <p className="ls-over">Live run of show</p>
          <h2 className="ls-h2">Last-minute changes, <span>handled.</span></h2>
          <ol className="ls-steps">
            {STEPS.map(([h, p], i) => (
              <li key={h} className={i <= step ? 'is-on' : ''}><strong>{h}</strong><span>{p}</span></li>
            ))}
          </ol>
        </div>
        <div className="ls-stage">
          <motion.div className="ls-phone" style={reduce ? undefined : { rotateY: rotY, rotateX: rotX }}
            initial={reduce ? { opacity: 0, rotateX: 18, y: 30 } : false} whileInView={reduce ? { opacity: 1, rotateX: 0, y: 0 } : undefined} viewport={{ once: true, amount: 0.4 }} transition={{ duration: 0.6, ease: EASE }}>
            <div className="ls-phone-notch" />
            <p className="ls-phone-title">Acme Holiday Party</p>
            <ul>
              {TIMELINE.map(r => {
                const moved = r.moved && step >= 1;
                return (
                  <li key={r.l} className={moved ? 'is-moved' : ''}>
                    <motion.span key={moved ? 'm' : 'o'} initial={reduce ? false : { opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>{moved ? r.moved : r.t}</motion.span>
                    {r.l}
                  </li>
                );
              })}
            </ul>
            <p className="ls-phone-saved">{step >= 1 ? 'Saved · the DJ sees this' : 'Changes save automatically'}</p>
          </motion.div>
          <motion.div className="ls-booth" style={reduce ? undefined : { y: boothY, opacity: boothO }}>
            <span className="ls-booth-tag">DJ booth</span>
            <p><b>7:45 PM</b> CEO welcome <em>Changed just now</em></p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ── Scene 2: the receipt prints and tips up toward you ───────────────────────
const SAMPLE = [
  ['00:00', 'Bill Withers - Lovely Day', ''],
  ['00:04', 'Earth, Wind & Fire - September', 'MUST-PLAY'],
  ['00:08', 'Whitney Houston - I Wanna Dance with Somebody', 'MUST-PLAY'],
  ['00:12', 'Mark Ronson feat. Bruno Mars - Uptown Funk', ''],
  ['00:16', 'Beyoncé - Crazy in Love', 'MUST-PLAY'],
  ['00:20', 'Crystal Waters - Gypsy Woman', ''],
];
function Counter({ to, progress, at }: { to: number; progress: MotionValue<number>; at: [number, number] }) {
  const v = useTransform(progress, at, [0, to]);
  const el = useRef<HTMLSpanElement>(null);
  // Straight to the DOM: no React render on every scroll frame
  useMotionValueEvent(v, 'change', x => { if (el.current) el.current.textContent = String(Math.round(x)); });
  return <span ref={el}>0</span>;
}
function ReceiptScene({ reduce }: { reduce: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const rotX = useTransform(scrollYProgress, [0, 0.4], [58, 0]);
  const y = useTransform(scrollYProgress, [0, 0.4], [120, 0]);
  // Paper 'prints' as a cover slides away: transform only, no repaint
  const cover = useTransform(scrollYProgress, [0.1, 0.7], [1, 0]);
  return (
    <section ref={ref} className="ls-scene" id="receipt" aria-label="How the Set Receipt works">
      <div className="ls-sticky ls-sticky-rev">
        <div className="ls-copy">
          <p className="ls-over">Set Receipt</p>
          <h2 className="ls-h2">Every DJ promises to follow the list. <span>DJ DX sends proof.</span></h2>
          <p className="ls-p">
            His DJ software records every track as it plays. After the last song, you get a receipt: every song in order with
            time stamps, each must-play marked as played, and a count of do-not-play songs played. The number you want to see
            there is zero.
          </p>
          <p className="ls-fine">Sample receipt shown. Needs an internet connection at the booth; with no signal, it arrives after the event.</p>
        </div>
        <div className="ls-stage">
          <motion.div className="ls-receipt" style={reduce ? undefined : { rotateX: rotX, y }}
            initial={reduce ? { opacity: 0, rotateX: 30, y: 40 } : false} whileInView={reduce ? { opacity: 1, rotateX: 0, y: 0 } : undefined} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.7, ease: EASE }}>
            <p className="ls-r-head">SET RECEIPT <span>Sample</span></p>
            <div className="ls-r-stats">
              <div><b>{reduce ? 64 : <Counter to={64} progress={scrollYProgress} at={[0.3, 0.75]} />}</b><span>songs</span></div>
              <div><b>{reduce ? 12 : <Counter to={12} progress={scrollYProgress} at={[0.3, 0.75]} />}/12</b><span>must-plays</span></div>
              <div><b>0</b><span>do-not-plays</span></div>
            </div>
            <div className="ls-r-list">
              <ol>{SAMPLE.map(([t, s, tag]) => <li key={t}><time>{t}</time><span>{s}</span>{tag && <em>{tag}</em>}</li>)}</ol>
              {!reduce && <motion.div className="ls-r-cover" style={{ scaleY: cover }} aria-hidden="true" />}
            </div>
            <div className="ls-r-tear" aria-hidden="true" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function CreateForm() {
  const [f, setF] = useState({ title: '', date: '', email: '', name: '', website: '' });
  const [st, setSt] = useState<'idle' | 'sending' | 'error'>('idle');
  const [err, setErr] = useState('');
  const submit = async (e: FormEvent) => {
    e.preventDefault(); setSt('sending'); setErr('');
    try {
      const r = await fetch('/api/show', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'create', ...f }) });
      const d = await r.json();
      if (!r.ok) { setErr(d.error || 'Something went wrong.'); setSt('error'); return; }
      window.location.href = d.editUrl.replace('https://djdxmusic.com', '');
    } catch { setErr('No connection. Try again.'); setSt('error'); }
  };
  return (
    <form className="booking-form ls-form" onSubmit={submit}>
      <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px' }}><label htmlFor="ls-w">Leave blank</label><input id="ls-w" tabIndex={-1} autoComplete="off" value={f.website} onChange={e => setF({ ...f, website: e.target.value })} /></div>
      <div className="form-field"><label htmlFor="ls-title">Event name</label><input id="ls-title" required maxLength={120} placeholder="Acme Holiday Party" value={f.title} onChange={e => setF({ ...f, title: e.target.value })} /></div>
      <div className="form-row">
        <div className="form-field"><label htmlFor="ls-date">Event date</label><input id="ls-date" type="date" required value={f.date} onChange={e => setF({ ...f, date: e.target.value })} /></div>
        <div className="form-field"><label htmlFor="ls-email">Your email</label><input id="ls-email" type="email" required autoComplete="email" placeholder="you@company.com" value={f.email} onChange={e => setF({ ...f, email: e.target.value })} /></div>
      </div>
      {err && <p className="form-error" role="alert">{err}</p>}
      <button type="submit" className="form-submit" disabled={st === 'sending'}>{st === 'sending' ? 'Creating…' : 'Create my run of show'}</button>
    </form>
  );
}
