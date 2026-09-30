import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import SiteNav from '../components/SiteNav';
import SiteFooter from '../components/SiteFooter';
import { BarList, EnergyMeter, SongList } from '../components/PollCharts';
import { GENRES, EVENT_TYPES, HEADCOUNTS, LOCATIONS, pollApi, type PollResults, crowdProfile } from '../lib/poll';
import { trackEvent, trackLead } from '../lib/analytics';

// Free lead-generation tool for corporate planners. Prerendered (it's in
// STATIC_ROUTES) so crawlers get the full page; the form only needs JS to
// submit. Voting (/poll/:id) and results (/poll/:id/results) are separate,
// noindexed routes.

const FAQ = [
  { q: 'Is the office party music poll really free?', a: 'Yes. Creating a poll, sharing it with your team, and getting the crowd report costs nothing, and there is no limit on how many coworkers can vote. It is a free tool from DJ DX, a New York and New Jersey event DJ, and you are under no obligation to book anything.' },
  { q: 'Do my coworkers need to sign up to vote?', a: 'No. Voters open the link, tap their answers, and submit. There is no account, no email address, and no app to install. On a phone it takes under a minute: top three genres, the eras they want to hear, how much they want to dance, and up to three song requests.' },
  { q: 'Is the voting anonymous?', a: 'Yes. The poll collects no names or contact details from voters, only their music answers. The planner who created the poll sees combined results, such as genre rankings and the most-requested songs, never who voted for what.' },
  { q: 'Can I use the poll if I hire a different DJ?', a: 'Yes. The crowd report is yours to use however you like. Print it or save it as a PDF and hand it to whoever is playing your party. If you would like DJ DX to play it, the results page has a button that sends the report along with a booking inquiry.' },
  { q: 'How long does the poll stay open?', a: 'Polls stay open for 60 days from the day you create them, which covers most planning timelines. After a poll closes, the vote data is kept for 180 days so you can still view the report, then it is deleted automatically.' },
  { q: 'Can I close the poll early?', a: 'Yes. Your private results page has a "Close voting" button. Once closed, the voting link stops accepting answers and your report stays available. You can also choose to share a read-only version of the results with your team.' },
];

// Clearly labelled sample data for the "what you get" preview.
const EXAMPLE: PollResults = {
  id: 'example', admin: false, open: true, closesAt: 0, publicResults: true,
  settings: { genres: [...GENRES], allowSongs: true, allowDnp: true, cleanOnly: true },
  planner: { company: 'Example Co.', eventType: 'Holiday party' },
  total: 42, lastVoteAt: null,
  genres: [
    { label: 'R&B/Soul', count: 27 }, { label: 'Hip-Hop', count: 23 }, { label: 'Old School/Classic', count: 19 },
    { label: 'House/Dance', count: 14 }, { label: 'Pop', count: 12 }, { label: 'Afrobeats/Amapiano', count: 9 },
  ],
  eras: [
    { label: '90s', count: 31 }, { label: '2000s', count: 26 }, { label: 'Today', count: 15 },
    { label: '80s', count: 11 }, { label: '2010s', count: 10 }, { label: '70s', count: 4 },
  ],
  energyAvg: 4.1,
  songs: [
    { label: 'Before I Let Go (Frankie Beverly & Maze)', count: 6 },
    { label: 'Crazy in Love (Beyoncé)', count: 4 },
    { label: 'September (Earth, Wind & Fire)', count: 3 },
  ],
  doNotPlay: [],
};

type Created = { pollId: string; adminKey: string; eventType: string; company: string; emailed: boolean };

export default function OfficePartyPoll() {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  const [created, setCreated] = useState<Created | null>(null);

  return (
    <>
      <Helmet>
        <title>Free Office Party Music Poll: Let Your Team Vote</title>
        <meta name="description" content="Let your team vote on the music before the office party. Share one link, get a crowd report of genres, eras and song requests in minutes. Free." />
        <link rel="canonical" href="https://djdxmusic.com/office-party-music-poll" />
        <meta property="og:title" content="Free Office Party Music Poll — DJ DX" />
        <meta property="og:description" content="Share one link, let your team vote on the music, and get a crowd report in minutes. Free, no sign-up for voters." />
        <meta property="og:url" content="https://djdxmusic.com/office-party-music-poll" />
        <meta property="og:image" content="https://djdxmusic.com/corporate-dj-manhattan-office-party-nyc.jpg" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@djdxmusic" />
        <script type="application/ld+json">
          {JSON.stringify([
            {
              '@context': 'https://schema.org',
              '@type': 'WebApplication',
              name: 'Office Party Music Poll',
              url: 'https://djdxmusic.com/office-party-music-poll',
              applicationCategory: 'EntertainmentApplication',
              operatingSystem: 'Any (web browser)',
              description: 'A free tool for office party planners: create a music poll, share one link with coworkers, and get a crowd report of favorite genres, eras, dance-floor energy and song requests.',
              offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
              provider: { '@type': 'EntertainmentBusiness', name: 'DJ DX', url: 'https://djdxmusic.com/' },
            },
            {
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: FAQ.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
            },
            {
              '@context': 'https://schema.org',
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://djdxmusic.com/' },
                { '@type': 'ListItem', position: 2, name: 'Office Party Music Poll', item: 'https://djdxmusic.com/office-party-music-poll' },
              ],
            },
          ])}
        </script>
      </Helmet>

      <SiteNav />

      <main className="opp">
        {/* ── HERO + FORM ── */}
        <section className="opp-hero">
          <div className="opp-hero-inner">
            <div className="opp-intro">
              <div className="sec-overline"><span className="sec-label">Free Tool for Planners</span></div>
              <h1 className="sec-title opp-h1">Free Office Party <span>Music Poll</span></h1>
              <p className="opp-sub">Let your team vote on the music before the party. Share one link, get a crowd report in minutes.</p>
              <ol className="opp-steps">
                <li><span>1</span><div><strong>Create</strong>Pick the genres and options. Takes a minute.</div></li>
                <li><span>2</span><div><strong>Share</strong>Send one link over email, Slack or Teams, or print the QR code.</div></li>
                <li><span>3</span><div><strong>Get results</strong>A crowd report of genres, eras, energy and song requests.</div></li>
              </ol>
              <p className="opp-fine">No sign-up for voters. Anonymous. Free, whether or not you book a DJ.</p>
            </div>
            <div className="opp-card" id="create">
              {created ? <PollCreated c={created} onReset={() => setCreated(null)} /> : <CreatePollForm onCreated={setCreated} />}
            </div>
          </div>
        </section>

        {/* ── EXAMPLE REPORT ── */}
        <section className="opp-example">
          <div className="opp-narrow">
            <div className="sec-overline" style={{ justifyContent: 'center' }}>
              <span className="sec-overline-line" /><span className="sec-label">What You Get</span><span className="sec-overline-line" />
            </div>
            <h2 className="sec-title opp-center">A Crowd Report, <span>Not a Guess</span></h2>
            <div className="opp-example-card" aria-label="Example crowd report with sample data">
              <div className="opp-example-tag">Example report · sample data</div>
              <p className="pr-profile">{crowdProfile(EXAMPLE)}</p>
              <div className="pr-grid">
                <BarList caption="Top genres" items={EXAMPLE.genres} total={EXAMPLE.total} max={6} />
                <BarList caption="Eras they want to hear" items={EXAMPLE.eras} total={EXAMPLE.total} />
                <EnergyMeter avg={EXAMPLE.energyAvg} />
                <SongList caption="Most-requested songs" items={EXAMPLE.songs} empty="" />
              </div>
            </div>
          </div>
        </section>

        {/* ── WHO'S BEHIND IT ── */}
        <section className="opp-about">
          <div className="opp-narrow">
            <h2 className="sec-title opp-center">Built by a DJ Who <span>Reads Rooms for a Living</span></h2>
            <p className="opp-about-text">
              DJ DX has spent 25+ years and 500+ events figuring out what a room actually wants to hear, from Manhattan
              office floors to company galas across New Jersey and Connecticut. The hardest part of any office party is
              the mix of people: different ages, different tastes, and half the room not sure they want to dance. This poll
              gives you that read before the night instead of during it.
            </p>
            <div className="opp-about-links">
              <Link to="/corporate-event-dj-nyc-nj-ct">Corporate event DJ</Link>
              <Link to="/holiday-party-dj-nyc-nj-ct">Holiday party DJ</Link>
              <Link to="/event-dj-cost-nyc-nj-ct#quote-calculator">Instant price estimate</Link>
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="opp-faq">
          <div className="opp-narrow">
            <h2 className="sec-title opp-center">Music Poll <span>FAQ</span></h2>
            <div className="opp-faq-list">
              {FAQ.map(f => (
                <div key={f.q} className="opp-faq-item">
                  <h3>{f.q}</h3>
                  <p>{f.a}</p>
                </div>
              ))}
            </div>
            <div className="opp-bottom-cta">
              <a href="#create" className="btn-gold">Create Your Free Poll</a>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}

// ── Create form ──────────────────────────────────────────────────────────────
function CreatePollForm({ onCreated }: { onCreated: (c: Created) => void }) {
  const [f, setF] = useState({
    name: '', email: '', company: '', eventType: 'Holiday party', eventDate: '', headcount: '', location: '',
    allowSongs: true, allowDnp: true, cleanOnly: true, sendLinks: true, marketingConsent: false, honeypot: '',
  });
  const [genres, setGenres] = useState<string[]>([...GENRES]);
  const [status, setStatus] = useState<'idle' | 'sending' | 'error'>('idle');
  const [error, setError] = useState('');
  const mountedAt = useRef(Date.now());
  const set = <K extends keyof typeof f>(k: K, v: (typeof f)[K]) => setF(x => ({ ...x, [k]: v }));
  const toggleGenre = (g: string) => setGenres(gs => (gs.includes(g) ? gs.filter(x => x !== g) : [...gs, g]));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (genres.length < 3) { setError('Keep at least 3 genres so voters can pick their top 3.'); setStatus('error'); return; }
    setStatus('sending'); setError('');
    try {
      const r = await pollApi<{ pollId: string; adminKey: string }>('create', {
        method: 'POST',
        body: { ...f, genres, elapsedMs: Date.now() - mountedAt.current },
      });
      trackEvent('poll_created', { event_type: f.eventType, headcount: f.headcount || 'unknown' });
      trackLead({ form: 'music_poll', event_type: f.eventType });
      onCreated({ pollId: r.pollId, adminKey: r.adminKey, eventType: f.eventType, company: f.company, emailed: f.sendLinks });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      setStatus('error');
    }
  };

  return (
    <form className="opp-form" onSubmit={submit} noValidate={false}>
      <h2 className="opp-form-title">Create your poll</h2>
      <div aria-hidden="true" className="opp-hp">
        <label htmlFor="opp-hp">Leave this field blank</label>
        <input id="opp-hp" tabIndex={-1} autoComplete="off" value={f.honeypot} onChange={e => set('honeypot', e.target.value)} />
      </div>

      <div className="opp-row">
        <label className="opp-field"><span>Your name</span>
          <input required autoComplete="name" value={f.name} onChange={e => set('name', e.target.value)} placeholder="Jane Smith" />
        </label>
        <label className="opp-field"><span>Work email</span>
          <input required type="email" autoComplete="email" value={f.email} onChange={e => set('email', e.target.value)} placeholder="jane@company.com" />
        </label>
      </div>
      <div className="opp-row">
        <label className="opp-field"><span>Company <em>optional</em></span>
          <input autoComplete="organization" value={f.company} onChange={e => set('company', e.target.value)} placeholder="Company name" />
        </label>
        <label className="opp-field"><span>Event type</span>
          <select value={f.eventType} onChange={e => set('eventType', e.target.value)}>
            {EVENT_TYPES.map(t => <option key={t}>{t}</option>)}
          </select>
        </label>
      </div>

      <details className="opp-more">
        <summary>Event details <em>optional</em></summary>
        <div className="opp-row">
          <label className="opp-field"><span>Event date</span>
            <input type="date" value={f.eventDate} onChange={e => set('eventDate', e.target.value)} />
          </label>
          <label className="opp-field"><span>Headcount</span>
            <select value={f.headcount} onChange={e => set('headcount', e.target.value)}>
              <option value="">Not sure yet</option>
              {HEADCOUNTS.map(h => <option key={h}>{h}</option>)}
            </select>
          </label>
        </div>
        <label className="opp-field"><span>Location</span>
          <select value={f.location} onChange={e => set('location', e.target.value)}>
            <option value="">Choose one</option>
            {LOCATIONS.map(l => <option key={l}>{l}</option>)}
          </select>
        </label>
      </details>

      <fieldset className="opp-genres">
        <legend>Genres voters can choose from</legend>
        <div className="opp-chips">
          {GENRES.map(g => (
            <label key={g} className={`opp-chip${genres.includes(g) ? ' is-on' : ''}`}>
              <input type="checkbox" checked={genres.includes(g)} onChange={() => toggleGenre(g)} />{g}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="opp-opts">
        <legend>Poll options</legend>
        <label className="opp-check"><input type="checkbox" checked={f.allowSongs} onChange={e => set('allowSongs', e.target.checked)} />Let voters suggest songs</label>
        <label className="opp-check"><input type="checkbox" checked={f.allowDnp} onChange={e => set('allowDnp', e.target.checked)} />Let voters name one song to never play</label>
        <label className="opp-check"><input type="checkbox" checked={f.cleanOnly} onChange={e => set('cleanOnly', e.target.checked)} />Tell voters clean versions only</label>
      </fieldset>

      <fieldset className="opp-opts opp-consent">
        <legend className="opp-sr">Email preferences</legend>
        <label className="opp-check"><input type="checkbox" checked={f.sendLinks} onChange={e => set('sendLinks', e.target.checked)} />Email me my voting link and private results link</label>
        <label className="opp-check"><input type="checkbox" checked={f.marketingConsent} onChange={e => set('marketingConsent', e.target.checked)} />Send me occasional event tips from DJ DX</label>
      </fieldset>

      {status === 'error' && <p className="form-error" role="alert">{error}</p>}
      <button type="submit" className="btn-gold opp-submit" disabled={status === 'sending'}>
        {status === 'sending' ? 'Creating…' : 'Create My Free Poll'}
      </button>
      <p className="opp-fine">Your details go to DJ DX only. Voters stay anonymous. <Link to="/privacy">Privacy</Link></p>
    </form>
  );
}

// ── Success screen ───────────────────────────────────────────────────────────
function PollCreated({ c, onReset }: { c: Created; onReset: () => void }) {
  const voteUrl = `https://djdxmusic.com/poll/${c.pollId}`;
  const resultsUrl = `https://djdxmusic.com/poll/${c.pollId}/results?key=${c.adminKey}`;
  const what = c.company ? `${c.company}'s ${c.eventType.toLowerCase()}` : `our ${c.eventType.toLowerCase()}`;
  const shareText = `Help pick the music for ${what}! It takes under a minute, no sign-up, and it's anonymous: ${voteUrl}`;
  const [copied, setCopied] = useState('');
  const [qr, setQr] = useState('');

  useEffect(() => {
    // QR library is only needed here, so it loads on demand, not with the page
    let alive = true;
    import('qrcode').then(QR => QR.toDataURL(voteUrl, { width: 640, margin: 2, color: { dark: '#0a0805', light: '#ffffff' } }))
      .then(url => { if (alive) setQr(url); }).catch(() => {});
    return () => { alive = false; };
  }, [voteUrl]);

  const copy = async (text: string, what: string) => {
    try { await navigator.clipboard.writeText(text); setCopied(what); setTimeout(() => setCopied(''), 2000); } catch { /* clipboard blocked */ }
    trackEvent('poll_shared', { method: `copy_${what}` });
  };
  const nativeShare = async () => {
    trackEvent('poll_shared', { method: 'native' });
    try { await navigator.share({ title: 'Office party music poll', text: shareText, url: voteUrl }); } catch { /* cancelled */ }
  };
  const canShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function';

  return (
    <div className="opp-done" aria-live="polite">
      <div className="opp-done-badge">Poll created</div>
      <h2 className="opp-form-title">Your poll is live</h2>
      <p className="opp-done-sub">{c.emailed ? 'Both links are on their way to your inbox too.' : 'Save both links below, they were not emailed.'}</p>

      <div className="opp-linkbox">
        <span className="opp-linkbox-label">Voting link: share with your team</span>
        <div className="opp-linkrow">
          <code>{voteUrl.replace('https://', '')}</code>
          <button type="button" onClick={() => copy(voteUrl, 'link')}>{copied === 'link' ? 'Copied' : 'Copy'}</button>
        </div>
      </div>

      <div className="opp-share">
        <button type="button" className="btn-gold" onClick={() => copy(shareText, 'message')}>{copied === 'message' ? 'Message copied' : 'Copy message for Slack / Teams'}</button>
        <a className="opp-share-alt" href={`mailto:?subject=${encodeURIComponent('Vote on the music for ' + what)}&body=${encodeURIComponent(shareText)}`} onClick={() => trackEvent('poll_shared', { method: 'email' })}>Email it</a>
        {canShare && <button type="button" className="opp-share-alt" onClick={nativeShare}>Share…</button>}
      </div>

      <div className="opp-qr">
        {qr ? <img src={qr} width="120" height="120" alt={`QR code for the voting link ${voteUrl}`} /> : <span className="opp-qr-ph" />}
        <div>
          <strong>Printing flyers?</strong>
          <p>Put the QR code on a poster in the break room.</p>
          {qr && <a href={qr} download={`djdx-music-poll-${c.pollId}.png`} onClick={() => trackEvent('poll_shared', { method: 'qr_download' })}>Download QR code (PNG)</a>}
        </div>
      </div>

      <div className="opp-linkbox opp-linkbox--private">
        <span className="opp-linkbox-label">Your private results link: don't share this one</span>
        <div className="opp-linkrow">
          <a href={resultsUrl}>Open results</a>
          <button type="button" onClick={() => copy(resultsUrl, 'results')}>{copied === 'results' ? 'Copied' : 'Copy'}</button>
        </div>
      </div>

      <button type="button" className="opp-reset" onClick={onReset}>Create another poll</button>
    </div>
  );
}
