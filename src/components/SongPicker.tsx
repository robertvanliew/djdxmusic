import { useEffect, useId, useRef, useState } from 'react';

// Search-as-you-type song picker backed by Apple's public iTunes Search API
// (no key, no account; CORS is open, so each voter's browser searches
// directly and there's no shared server-side rate limit). Voters tap a real
// song instead of typing, which gives clean, matchable requests.
//
// If search fails (offline, rate-limited) or the song isn't in Apple's
// catalog, "type it in" falls back to free-text title/artist inputs, so
// voting never depends on Apple being reachable.

export interface PickedSong { title: string; artist: string; art?: string; explicit?: boolean }
interface Hit { id: number; title: string; artist: string; art: string; explicit: boolean }

const SEARCH = 'https://itunes.apple.com/search';

export default function SongPicker({ value, onChange, label, placeholder = 'Search a song or artist' }: {
  value: PickedSong; onChange: (s: PickedSong) => void; label: string; placeholder?: string;
}) {
  const [q, setQ] = useState('');
  const [hits, setHits] = useState<Hit[]>([]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [state, setState] = useState<'idle' | 'loading' | 'error' | 'none'>('idle');
  const [manual, setManual] = useState(false);
  const listId = useId();
  const abort = useRef<AbortController | null>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const picked = !!(value.title || value.artist);

  // Debounced search; stale requests are aborted so results never arrive out of order
  useEffect(() => {
    if (manual || q.trim().length < 2) { setHits([]); setState('idle'); return; }
    const t = setTimeout(async () => {
      abort.current?.abort();
      const ctl = new AbortController(); abort.current = ctl;
      setState('loading');
      try {
        const u = `${SEARCH}?${new URLSearchParams({ term: q.trim(), entity: 'song', limit: '15', country: 'US' })}`;
        const r = await fetch(u, { signal: ctl.signal });
        if (!r.ok) throw new Error(String(r.status));
        const d = await r.json();
        const list: Hit[] = (d.results || []).filter((x: { kind?: string }) => x.kind === 'song').map((x: Record<string, unknown>) => ({
          id: Number(x.trackId), title: String(x.trackName || ''), artist: String(x.artistName || ''),
          art: String(x.artworkUrl100 || '').replace('100x100bb', '120x120bb'), explicit: x.trackExplicitness === 'explicit',
        }));
        // One row per song: the same track appears once per album/compilation it's on
        const seen = new Set<string>();
        const unique = list.filter(h => { const k = `${h.title}|${h.artist}`.toLowerCase(); if (seen.has(k)) return false; seen.add(k); return true; }).slice(0, 6);
        setHits(unique); setActive(unique.length ? 0 : -1); setOpen(true); setState(unique.length ? 'idle' : 'none');
      } catch (e) {
        // Search unreachable: drop straight into typing, keeping what they typed as the title
        if ((e as Error).name !== 'AbortError') { setState('error'); setOpen(false); setManual(true); onChange({ title: q.trim().slice(0, 100), artist: '' }); }
      }
    }, 300);
    return () => clearTimeout(t);
  }, [q, manual]);

  // close the list on outside tap
  useEffect(() => {
    const off = (e: PointerEvent) => { if (!boxRef.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('pointerdown', off);
    return () => document.removeEventListener('pointerdown', off);
  }, []);

  const choose = (h: Hit) => { onChange({ title: h.title, artist: h.artist, art: h.art, explicit: h.explicit }); setQ(''); setHits([]); setOpen(false); };
  const onKey = (e: React.KeyboardEvent) => {
    if (!open || !hits.length) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive(i => (i + 1) % hits.length); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(i => (i - 1 + hits.length) % hits.length); }
    else if (e.key === 'Enter' && active >= 0) { e.preventDefault(); choose(hits[active]); }
    else if (e.key === 'Escape') { setOpen(false); }
  };

  if (picked && !manual) {
    return (
      <div className="sp-picked">
        {value.art ? <img src={value.art} width="44" height="44" alt="" /> : <span className="sp-noart" aria-hidden="true">♪</span>}
        <span className="sp-picked-text"><strong>{value.title}</strong><span>{value.artist}</span></span>
        <button type="button" className="sp-clear" aria-label={`Remove ${value.title}`} onClick={() => onChange({ title: '', artist: '' })}>×</button>
      </div>
    );
  }

  if (manual) {
    return (
      <div className="sp-manual">
        <div className="pv-song">
          <input aria-label={`${label} title`} placeholder="Song title" maxLength={100} value={value.title} onChange={e => onChange({ ...value, title: e.target.value, art: undefined })} />
          <input aria-label={`${label} artist`} placeholder="Artist" maxLength={80} value={value.artist} onChange={e => onChange({ ...value, artist: e.target.value, art: undefined })} />
        </div>
        <button type="button" className="sp-toggle" onClick={() => { setManual(false); onChange({ title: '', artist: '' }); }}>Search instead</button>
      </div>
    );
  }

  return (
    <div className="sp" ref={boxRef}>
      <input
        className="sp-input" type="search" role="combobox" aria-label={label} aria-expanded={open} aria-controls={listId}
        aria-autocomplete="list" aria-activedescendant={open && active >= 0 ? `${listId}-${active}` : undefined}
        placeholder={placeholder} value={q} autoComplete="off" enterKeyHint="search"
        onChange={e => setQ(e.target.value)} onKeyDown={onKey}
        onFocus={e => {
          // On phones the keyboard covers the lower half of the screen; lift the
          // field to the top (scroll-margin clears the nav) so results fit between.
          if (window.matchMedia('(max-width: 700px)').matches) e.currentTarget.scrollIntoView({ block: 'start', behavior: 'smooth' });
          if (hits.length) setOpen(true);
        }}
      />
      {state === 'loading' && <span className="sp-spin" aria-hidden="true" />}
      {open && hits.length > 0 && (
        <ul className="sp-list" id={listId} role="listbox" aria-label={`${label} results`}>
          {hits.map((h, i) => (
            <li key={h.id} id={`${listId}-${i}`} role="option" aria-selected={i === active}
              className={i === active ? 'is-active' : ''} onPointerDown={e => { e.preventDefault(); choose(h); }} onMouseEnter={() => setActive(i)}>
              <img src={h.art} width="40" height="40" alt="" loading="lazy" />
              <span className="sp-hit"><strong>{h.title}</strong><span>{h.artist}</span></span>
              {h.explicit && <span className="sp-e" title="Explicit version (the DJ plays the clean edit)">E</span>}
            </li>
          ))}
        </ul>
      )}
      <div className="sp-foot" aria-live="polite">
        {state === 'none' && <span>No matches. </span>}
        {state === 'error' && <span>Song search isn't available right now. </span>}
        <button type="button" className="sp-toggle" onClick={() => { setManual(true); setOpen(false); }}>
          {state === 'error' || state === 'none' ? 'Type it in instead' : "Can't find it? Type it in"}
        </button>
        <span className="sp-credit">Search by Apple Music</span>
      </div>
    </div>
  );
}
