import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, useSearchParams } from 'react-router-dom';
import { trackEvent } from '../lib/analytics';
import '../show.css';

// /live/:id?g=<guestToken>: the page guests open from the QR card at the booth
// (see api/agent.ts namespace Show). Now playing while the set runs, the full
// set list once the DJ sends the Set Receipt, optional song requests, and an
// opt-in "email me the set list". Private by design: noindex, no client name
// (guests see guestTitle, which defaults to "Live set").

interface Track { at: string; artist: string; title: string; raw: string }
interface Guest { id: string; title: string; date: string; dj: 'djdx' | 'other'; djName: string; requestsOn: boolean; ended: boolean; tracks: Track[] }
interface NowPlaying { live: boolean; ended: boolean; recent: Track[] }

const prettyDate = (d: string) => new Date(`${d}T12:00:00`).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
const spotify = (t: Track) => `https://open.spotify.com/search/${encodeURIComponent(t.raw)}`;
const apple = (t: Track) => `https://music.apple.com/us/search?term=${encodeURIComponent(t.raw)}`;

function SongLinks({ t, id }: { t: Track; id: string }) {
  return (
    <span className="gl-links">
      <a href={spotify(t)} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent('live_song_saved', { show: id, app: 'spotify' })}>Spotify</a>
      <a href={apple(t)} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent('live_song_saved', { show: id, app: 'apple' })}>Apple Music</a>
    </span>
  );
}

export default function GuestLive() {
  const { id = '' } = useParams();
  const [sp] = useSearchParams();
  const g = sp.get('g') || '';
  const [show, setShow] = useState<Guest | null>(null);
  const [np, setNp] = useState<NowPlaying | null>(null);
  const [error, setError] = useState('');
  const counted = useRef(false);

  const load = useCallback(async () => {
    try {
      const r = await fetch(`/api/show?id=${encodeURIComponent(id)}&t=${encodeURIComponent(g)}`, { cache: 'no-store' });
      if (!r.ok) { setError('This link is not valid or has expired.'); return; }
      const s: Guest = await r.json();
      setShow(s);
      if (!counted.current) { counted.current = true; trackEvent('live_page_open', { show: s.id, ended: s.ended }); }
    } catch { setError('Could not load. Check your connection.'); }
  }, [id, g]);

  // First load on the next tick (not synchronously inside the effect)
  useEffect(() => { const t0 = window.setTimeout(load, 0); return () => window.clearTimeout(t0); }, [load]);

  // Now playing: every 15 s while the set runs; stop once it has ended
  useEffect(() => {
    if (!show || show.ended) return;
    let alive = true;
    const get = () => fetch(`/api/show?id=${encodeURIComponent(id)}&t=${encodeURIComponent(g)}&now=1`, { cache: 'no-store' })
      .then(r => r.ok ? r.json() : null)
      .then((d: NowPlaying | null) => { if (!alive || !d) return; setNp(d); if (d.ended) load(); })
      .catch(() => {});
    get();
    const iv = window.setInterval(() => { if (document.visibilityState === 'visible') get(); }, 15000);
    return () => { alive = false; window.clearInterval(iv); };
  }, [show, id, g, load]);

  if (error) return <div className="sh-wrap"><p className="sh-empty">{error}</p></div>;
  if (!show) return <div className="sh-wrap"><p className="sh-empty" aria-live="polite">Loading…</p></div>;

  const dx = show.dj === 'djdx';
  const by = dx ? 'DJ DX' : (show.djName || 'the DJ');
  const now = np?.recent[0];
  const camp = `utm_source=live&utm_medium=qr&utm_campaign=${show.id}`;

  return (
    <div className="sh-wrap gl-wrap">
      <Helmet>
        <title>{`${show.title} · What's playing | ${dx ? 'DJ DX' : 'Live set'}`}</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <header className="sh-head">
        <span className="sh-badge">{show.ended ? 'Set list' : np?.live ? 'Live now' : 'Live set'}</span>
        <h1>{show.title}</h1>
        <p>{prettyDate(show.date)} · {by}</p>
      </header>

      {show.ended ? (
        <section className="sh-card" aria-labelledby="gl-list">
          <h2 id="gl-list">Every song from the night</h2>
          <p className="sh-muted">{show.tracks.length} songs, in the order they played. Times are minutes into the set.</p>
          <ol className="gl-list">
            {show.tracks.map((t, i) => <li key={i}><time>{t.at}</time><span className="gl-song">{t.raw}<SongLinks t={t} id={show.id} /></span></li>)}
          </ol>
        </section>
      ) : (
        <section className="sh-card gl-now" aria-live="polite" aria-labelledby="gl-now">
          <h2 id="gl-now">What song is this?</h2>
          {now ? (
            <>
              <p className="gl-now-title">{now.title || now.raw}</p>
              {now.artist && <p className="gl-now-artist">{now.artist}</p>}
              <SongLinks t={now} id={show.id} />
              {np!.recent.length > 1 && (
                <>
                  <h3 className="gl-h3">Just played</h3>
                  <ol className="gl-list">
                    {np!.recent.slice(1).map((t, i) => <li key={t.at + i}><time>{t.at}</time><span className="gl-song">{t.raw}<SongLinks t={t} id={show.id} /></span></li>)}
                  </ol>
                </>
              )}
            </>
          ) : <p className="sh-muted">{np ? 'The music starts soon. This page updates by itself.' : 'Checking the DJ booth…'}</p>}
        </section>
      )}

      {show.requestsOn && !show.ended && <RequestForm id={id} g={g} by={by} />}
      <NotifyForm id={id} g={g} ended={show.ended} />

      {dx ? (
        <section className="sh-card gl-cta">
          <h2>Planning your own event?</h2>
          <p className="sh-muted">DJ DX plays corporate events, holiday parties, weddings and private parties in NYC, NJ and CT. Every client gets this live song page, plus a Set Receipt of every song played.</p>
          <a className="sh-copy gl-btn" href={`/open-dates?${camp}`} onClick={() => trackEvent('live_cta_click', { show: show.id, to: 'open-dates' })}>Check your date</a>
          <a className="gl-text" href={`/?${camp}`} onClick={() => trackEvent('live_cta_click', { show: show.id, to: 'home' })}>See DJ DX</a>
        </section>
      ) : (
        <p className="sh-foot">Free live song page by <a href={`/song-request-qr-code?${camp}`} onClick={() => trackEvent('live_cta_click', { show: show.id, to: 'tool' })}>DJ DX</a> · make one for your event</p>
      )}
    </div>
  );
}

function RequestForm({ id, g, by }: { id: string; g: string; by: string }) {
  const [song, setSong] = useState('');
  const [name, setName] = useState('');
  const [hp, setHp] = useState('');
  const [st, setSt] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [msg, setMsg] = useState('');
  const submit = async (e: FormEvent) => {
    e.preventDefault(); setSt('sending'); setMsg('');
    try {
      const r = await fetch('/api/show', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'request', id, t: g, song, name, website: hp }) });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) { setMsg(d.error || 'Could not send.'); setSt('error'); return; }
      trackEvent('live_song_request', { show: id });
      setSong(''); setSt('sent'); setMsg(`Sent to ${by}. No promises, but it's on the screen at the booth.`);
    } catch { setMsg('No connection.'); setSt('error'); }
  };
  return (
    <section className="sh-card">
      <h2>Request a song</h2>
      <form className="gl-form" onSubmit={submit}>
        <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px' }}><label htmlFor="gl-w">Leave blank</label><input id="gl-w" tabIndex={-1} autoComplete="off" value={hp} onChange={e => setHp(e.target.value)} /></div>
        <label htmlFor="gl-song">Song and artist</label>
        <input id="gl-song" required minLength={2} maxLength={120} placeholder="September, Earth Wind & Fire" value={song} onChange={e => setSong(e.target.value)} />
        <label htmlFor="gl-name">Your first name (optional)</label>
        <input id="gl-name" maxLength={40} autoComplete="given-name" value={name} onChange={e => setName(e.target.value)} />
        <button type="submit" className="sh-copy" disabled={st === 'sending'}>{st === 'sending' ? 'Sending…' : 'Send request'}</button>
        {msg && <p className={st === 'error' ? 'form-error' : 'sh-msg'} role="status">{msg}</p>}
      </form>
    </section>
  );
}

function NotifyForm({ id, g, ended }: { id: string; g: string; ended: boolean }) {
  const [email, setEmail] = useState('');
  const [hp, setHp] = useState('');
  const [st, setSt] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const [msg, setMsg] = useState('');
  const submit = async (e: FormEvent) => {
    e.preventDefault(); setSt('sending'); setMsg('');
    try {
      const r = await fetch('/api/show', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'notify', id, t: g, email, website: hp }) });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) { setMsg(d.error || 'Could not save.'); setSt('error'); return; }
      trackEvent('live_setlist_signup', { show: id, sent: !!d.sent });
      setSt('done'); setMsg(d.sent ? 'Sent. Check your inbox.' : "Done. You'll get every song from tonight after the last one plays.");
    } catch { setMsg('No connection.'); setSt('error'); }
  };
  return (
    <section className="sh-card">
      <h2>{ended ? 'Email me this set list' : "Email me tonight's set list"}</h2>
      <p className="sh-muted">One email with every song and links to save them. Your address isn't added to any list.</p>
      {st === 'done' ? <p className="sh-msg" role="status">{msg}</p> : (
        <form className="gl-form gl-inline" onSubmit={submit}>
          <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px' }}><label htmlFor="gl-w2">Leave blank</label><input id="gl-w2" tabIndex={-1} autoComplete="off" value={hp} onChange={e => setHp(e.target.value)} /></div>
          <label htmlFor="gl-email" className="gl-sr">Email</label>
          <input id="gl-email" type="email" required autoComplete="email" placeholder="you@email.com" value={email} onChange={e => setEmail(e.target.value)} />
          <button type="submit" className="sh-copy" disabled={st === 'sending'}>{st === 'sending' ? '…' : ended ? 'Send it' : 'Email me'}</button>
          {msg && <p className="form-error" role="alert">{msg}</p>}
        </form>
      )}
    </section>
  );
}
