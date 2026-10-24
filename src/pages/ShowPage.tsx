import { useCallback, useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import '../show.css';

// /show/:id?t=<token>: one event, two views (see api/agent.ts namespace Show).
//   edit  -> planner/client edits the run of show from a phone, autosaved
//   booth -> DJ DX's read-only booth screen: refreshes every 5 s, highlights
//            what just changed, shows now playing, sends the Set Receipt.

interface Item { id: string; time: string; label: string; note: string }
interface Track { at: string; artist: string; title: string; raw: string }
interface Receipt { createdAt: number; tracks: Track[]; mustPlay: { song: { artist: string; title: string }; playedAt: string | null }[]; doNotPlayHits: { entry: string; track: Track }[] }
interface Show {
  id: string; role: 'edit' | 'booth'; title: string; date: string; clientName: string;
  items: Item[]; log: { at: number; text: string }[]; plan: { mustPlay: { artist: string; title: string }[]; doNotPlay: string[] };
  seratoUrl: string; receipt: Receipt | null; updatedAt: number; boothUrl?: string;
}

const ago = (ms: number) => {
  const s = Math.max(0, Math.round((Date.now() - ms) / 1000));
  if (s < 60) return 'just now';
  if (s < 3600) return `${Math.round(s / 60)} min ago`;
  if (s < 86400) return `${Math.round(s / 3600)} h ago`;
  return new Date(ms).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};
const prettyDate = (d: string) => new Date(`${d}T12:00:00`).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
const newId = () => Math.random().toString(36).slice(2, 10);
const Icon = ({ d }: { d: string }) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d} /></svg>;
const UP = 'M18 15l-6-6-6 6', DOWN = 'M6 9l6 6 6-6', X = 'M18 6L6 18M6 6l12 12';

export default function ShowPage() {
  const { id = '' } = useParams();
  const [sp] = useSearchParams();
  const t = sp.get('t') || '';
  const reduce = useReducedMotion();
  const [show, setShow] = useState<Show | null>(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [changed, setChanged] = useState<Record<string, number>>({});
  const prevItems = useRef<Item[] | null>(null);
  const saveTimer = useRef<number | undefined>(undefined);

  const load = useCallback(async () => {
    try {
      const r = await fetch(`/api/show?id=${encodeURIComponent(id)}&t=${encodeURIComponent(t)}`, { cache: 'no-store' });
      if (!r.ok) { setError('This link is not valid or has expired.'); return; }
      const s: Show = await r.json();
      // Booth: mark items that changed since the last refresh
      if (prevItems.current && s.role === 'booth') {
        const before = new Map(prevItems.current.map(i => [i.id, i]));
        const marks: Record<string, number> = {};
        for (const i of s.items) { const o = before.get(i.id); if (!o || o.time !== i.time || o.label !== i.label || o.note !== i.note) marks[i.id] = Date.now(); }
        if (Object.keys(marks).length) setChanged(c => ({ ...c, ...marks }));
      }
      prevItems.current = s.items;
      setShow(s);
    } catch { setError('Could not load. Check your connection.'); }
  }, [id, t]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => {
    if (show?.role !== 'booth') return;
    const iv = window.setInterval(load, 5000);
    return () => window.clearInterval(iv);
  }, [show?.role, load]);

  // Edit: autosave shortly after the last keystroke
  const update = (items: Item[]) => {
    if (!show) return;
    setShow({ ...show, items });
    setSaving('saving');
    window.clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(async () => {
      try {
        const r = await fetch('/api/show', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'update', id, t, items }) });
        if (!r.ok) throw new Error();
        const s: Show = await r.json();
        setShow(cur => cur ? { ...cur, log: s.log, updatedAt: s.updatedAt } : s);
        setSaving('saved');
      } catch { setSaving('error'); }
    }, 700);
  };

  if (error) return <div className="sh-wrap"><p className="sh-empty">{error}</p></div>;
  if (!show) return <div className="sh-wrap"><p className="sh-empty" aria-live="polite">Loading the run of show…</p></div>;

  return (
    <div className={`sh-wrap sh-${show.role}`}>
      <Helmet>
        <title>{`${show.title} | Run of Show`}</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <header className="sh-head">
        <span className="sh-badge">{show.role === 'booth' ? 'DJ booth · live' : 'Live run of show'}</span>
        <h1>{show.title}</h1>
        <p>{prettyDate(show.date)}</p>
      </header>

      {show.role === 'edit'
        ? <Editor show={show} update={update} saving={saving} />
        : <Booth show={show} changed={changed} reduce={!!reduce} id={id} t={t} onUpdate={s => { prevItems.current = s.items; setShow(s); }} />}

      {show.receipt && <ReceiptView r={show.receipt} />}

      <section className="sh-card">
        <h2>Change log</h2>
        <ul className="sh-log">
          {[...show.log].reverse().slice(0, 15).map((l, i) => <li key={l.at + '-' + i}><time>{ago(l.at)}</time><span>{l.text}</span></li>)}
        </ul>
      </section>
      <p className="sh-foot">Run of show by <a href="/">DJ DX</a> · <a href="/live-run-of-show">How this works</a></p>
    </div>
  );
}

function Editor({ show, update, saving }: { show: Show; update: (i: Item[]) => void; saving: string }) {
  const [copied, setCopied] = useState(false);
  const set = (idx: number, k: keyof Item, v: string) => update(show.items.map((it, i) => i === idx ? { ...it, [k]: v } : it));
  const move = (idx: number, d: -1 | 1) => {
    const j = idx + d; if (j < 0 || j >= show.items.length) return;
    const next = [...show.items]; [next[idx], next[j]] = [next[j], next[idx]]; update(next);
  };
  return (
    <>
      <div className="sh-status" aria-live="polite">
        {saving === 'saving' ? 'Saving…' : saving === 'saved' ? `Saved · DJ DX sees this at the booth` : saving === 'error' ? 'Not saved. Check your connection.' : 'Changes save automatically'}
      </div>
      <ol className="sh-items">
        {show.items.map((it, idx) => (
          <li key={it.id} className="sh-item">
            <input className="sh-time" aria-label="Time" placeholder="7:30 PM" value={it.time} onChange={e => set(idx, 'time', e.target.value)} maxLength={20} />
            <div className="sh-fields">
              <input className="sh-label" aria-label="Moment" placeholder="What happens" value={it.label} onChange={e => set(idx, 'label', e.target.value)} maxLength={120} />
              <input className="sh-note" aria-label="Note for the DJ" placeholder="Note for the DJ (song, who speaks, mic)" value={it.note} onChange={e => set(idx, 'note', e.target.value)} maxLength={300} />
            </div>
            <div className="sh-tools">
              <button type="button" onClick={() => move(idx, -1)} aria-label={`Move ${it.label || 'item'} earlier`} disabled={idx === 0}><Icon d={UP} /></button>
              <button type="button" onClick={() => move(idx, 1)} aria-label={`Move ${it.label || 'item'} later`} disabled={idx === show.items.length - 1}><Icon d={DOWN} /></button>
              <button type="button" onClick={() => update(show.items.filter((_, i) => i !== idx))} aria-label={`Remove ${it.label || 'item'}`}><Icon d={X} /></button>
            </div>
          </li>
        ))}
      </ol>
      <button type="button" className="sh-add" onClick={() => update([...show.items, { id: newId(), time: '', label: '', note: '' }])} disabled={show.items.length >= 40}>+ Add a moment</button>
      {show.boothUrl && (
        <section className="sh-card">
          <h2>Your DJ's booth link</h2>
          <p className="sh-muted">DJ DX already has it. If another vendor needs to follow the timeline, send them this read-only link.</p>
          <button type="button" className="sh-copy" onClick={async () => { try { await navigator.clipboard.writeText(show.boothUrl!); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch { /* clipboard blocked */ } }}>
            {copied ? 'Copied' : 'Copy booth link'}
          </button>
        </section>
      )}
    </>
  );
}

function Booth({ show, changed, reduce, id, t, onUpdate }: { show: Show; changed: Record<string, number>; reduce: boolean; id: string; t: string; onUpdate: (s: Show) => void }) {
  const [np, setNp] = useState<{ live: boolean; url: string; recent: Track[] } | null>(null);
  const [url, setUrl] = useState(show.seratoUrl);
  const [busy, setBusy] = useState('');
  const [msg, setMsg] = useState('');
  useEffect(() => {
    let alive = true;
    const get = () => fetch(`/api/show?id=${encodeURIComponent(id)}&t=${encodeURIComponent(t)}&now=1`, { cache: 'no-store' }).then(r => r.ok ? r.json() : null).then(d => { if (alive && d) setNp(d); }).catch(() => {});
    get(); const iv = window.setInterval(get, 20000);
    return () => { alive = false; window.clearInterval(iv); };
  }, [id, t]);
  const post = async (body: object, label: string) => {
    setBusy(label); setMsg('');
    try {
      const r = await fetch('/api/show', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, t, ...body }) });
      const d = await r.json();
      if (!r.ok) setMsg(d.error || 'Something went wrong'); else { onUpdate(d); setMsg(label === 'receipt' ? 'Set Receipt sent to the client.' : 'Saved.'); }
    } catch { setMsg('No connection.'); }
    setBusy('');
  };
  const recent = Date.now() - 10 * 60 * 1000;
  return (
    <>
      <p className="sh-status">Updates every 5 seconds · last change {ago(show.updatedAt)}</p>
      <ol className="sh-items sh-booth-items">
        <AnimatePresence initial={false}>
          {show.items.map(it => {
            const fresh = (changed[it.id] || 0) > recent;
            return (
              <motion.li key={it.id} layout={!reduce} className={`sh-item${fresh ? ' sh-fresh' : ''}`}
                initial={reduce ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={reduce ? undefined : { opacity: 0, x: -20 }}
                transition={{ type: 'spring', stiffness: 380, damping: 32 }}>
                <span className="sh-time-big">{it.time || '—'}</span>
                <div><strong>{it.label}</strong>{it.note && <span className="sh-note-big">{it.note}</span>}</div>
                {fresh && <span className="sh-pill">Changed {ago(changed[it.id])}</span>}
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ol>

      <section className="sh-card">
        <h2>Now playing</h2>
        {np?.live
          ? <ul className="sh-np">{np.recent.map((tr, i) => <li key={tr.at + i} className={i === 0 ? 'sh-np-now' : ''}><time>{tr.at}</time>{tr.raw}</li>)}</ul>
          : <p className="sh-muted">Waiting for Serato. Start a Live Playlist in Serato DJ Pro (History panel) with internet on.</p>}
        <form className="sh-serato" onSubmit={e => { e.preventDefault(); post({ action: 'serato', url }, 'serato'); }}>
          <label htmlFor="sh-serato">Serato playlist link (optional, newest playlist is used otherwise)</label>
          <div><input id="sh-serato" value={url} onChange={e => setUrl(e.target.value)} placeholder="https://serato.com/playlists/you/…" /><button type="submit" disabled={!!busy}>Save</button></div>
        </form>
      </section>

      <section className="sh-card">
        <h2>Set Receipt</h2>
        <p className="sh-muted">After the last song, send the client every track played, checked against {show.plan.mustPlay.length} must-plays and {show.plan.doNotPlay.length} do-not-plays.</p>
        <button type="button" className="sh-receipt-btn" disabled={!!busy} onClick={() => { if (window.confirm('Send the Set Receipt to the client now?')) post({ action: 'receipt' }, 'receipt'); }}>
          {busy === 'receipt' ? 'Building receipt…' : show.receipt ? 'Resend Set Receipt' : 'End set · send Set Receipt'}
        </button>
        {msg && <p className="sh-msg" role="status">{msg}</p>}
      </section>
    </>
  );
}

function ReceiptView({ r }: { r: Receipt }) {
  const hit = r.mustPlay.filter(m => m.playedAt).length;
  return (
    <section className="sh-card sh-receipt">
      <h2>Set Receipt</h2>
      <div className="sh-stats">
        <div><strong>{r.tracks.length}</strong><span>songs played</span></div>
        <div><strong>{hit}/{r.mustPlay.length}</strong><span>must-plays hit</span></div>
        <div className={r.doNotPlayHits.length ? 'sh-bad' : ''}><strong>{r.doNotPlayHits.length}</strong><span>do-not-plays played</span></div>
      </div>
      {r.mustPlay.length > 0 && <ul className="sh-mp">{r.mustPlay.map((m, i) => <li key={i} className={m.playedAt ? 'sh-ok' : 'sh-miss'}><span>{m.playedAt ? `Played at ${m.playedAt}` : 'Not played'}</span>{m.song.title}{m.song.artist ? `, ${m.song.artist}` : ''}</li>)}</ul>}
      <details><summary>Every song, in order ({r.tracks.length})</summary><ol className="sh-np">{r.tracks.map((tr, i) => <li key={i}><time>{tr.at}</time>{tr.raw}</li>)}</ol></details>
    </section>
  );
}
