import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Helmet } from 'react-helmet-async';
import SiteNav from '../components/SiteNav';
import SiteFooter from '../components/SiteFooter';

// Private music planning form for booked clients: djdxmusic.com/plan.
// Unlisted (not in nav, footer or sitemap), noindex, disallowed in robots.txt,
// X-Robots-Tag in vercel.json. main.tsx strips the prefill query string from
// the address bar before any analytics runs, and skips the ad pixels here, so
// client names never reach a tracker. Answers go to /api/music-plan, which
// emails them; nothing is stored server-side. Labels are duplicated in
// api/music-plan.ts: keep the two in sync.

const PHONE = '(551) 362-5131';

const EVENT_TYPES = [
  ['wedding', 'Wedding'],
  ['birthday', 'Birthday or milestone'],
  ['corporate', 'Corporate or holiday party'],
  ['mitzvah', 'Bar or Bat Mitzvah'],
  ['sweet16', 'Sweet 16 or Quinceañera'],
  ['private', 'Private party'],
  ['other', 'Other'],
] as const;
type EventType = (typeof EVENT_TYPES)[number][0] | '';

const GUESTS = ['Under 50', '50 to 100', '100 to 150', '150 to 250', 'Over 250'];
const AGES = ['Kids', 'Teens', '20s and 30s', '40s and 50s', '60s and up'];
const FEELS = ['Background and conversation all night', 'Starts relaxed, builds to dancing', 'Dance floor most of the night'];
const CLEAN = ['Yes, clean only', 'Mostly clean, a little edge is fine', 'No restrictions'];
const GENRES = ['Motown and Soul', '70s Disco and Funk', '80s', '90s and 2000s R&B and Hip-Hop', '2000s Throwbacks', 'Current Top 40',
  'House and Dance', 'Afrobeats and Amapiano', 'Reggae and Dancehall', 'Latin (Reggaetón, Salsa, Bachata)', 'Classic Rock',
  'Country and Line Dance', 'Jazz and Lounge'];
const GENRE_OPTS = [['more', 'More of this'], ['some', 'Some is fine'], ['skip', 'Skip it']] as const;
const MIC = ['Full MC, run the program', 'Key announcements only', 'Music only, no announcements'];
const LIVE_MOMENTS = ['Arrival and greetings', 'Ceremony', 'Cocktail hour or dinner', 'Grand entrance', 'First dance or a special dedication',
  'Toast or cake', 'A peak dance moment', 'Last song'];
const ROLES = ['Wedding party', 'Parent', 'Couple', 'Other'];

type MomentDef = { key: string; label: string; kind?: 'song' | 'radio' | 'textarea'; options?: string[]; who?: string; skip?: boolean; help?: string };
const PARTY: MomentDef[] = [
  { key: 'honoree', label: 'Guest of honor entrance', help: "If it's a surprise, tell me how the reveal works in the notes." },
  { key: 'toasts', label: 'Toast or speeches' },
  { key: 'cake', label: 'Cake' },
  { key: 'dedication', label: 'Dedication song', who: 'For whom' },
];
const MOMENTS: Record<Exclude<EventType, ''>, MomentDef[]> = {
  wedding: [
    { key: 'processional', label: 'Ceremony: wedding party processional' },
    { key: 'partnerEntrance', label: 'Ceremony: partner entrance' },
    { key: 'recessional', label: 'Ceremony: recessional' },
    { key: 'cocktailFeel', label: 'Cocktail hour feel', kind: 'radio', options: ['Live violin', 'Jazz and lounge', 'Soul and R&B', 'Your choice'] },
    { key: 'grandEntrance', label: 'Grand entrance of the couple' },
    { key: 'firstDance', label: 'First dance' },
    { key: 'parent1', label: 'Parent dance 1', who: 'Who' },
    { key: 'parent2', label: 'Parent dance 2', who: 'Who' },
    { key: 'cakeCutting', label: 'Cake cutting' },
    { key: 'toss', label: 'Bouquet or garter toss', skip: true },
  ],
  mitzvah: [
    { key: 'mitzvahEntrance', label: 'Grand entrance' },
    { key: 'hora', label: 'Hora', kind: 'radio', options: ['Yes', 'No'] },
  ],
  birthday: PARTY, private: PARTY, sweet16: PARTY, other: PARTY,
  corporate: [
    { key: 'doorsOpen', label: 'Opening song when doors open' },
    { key: 'walkUp', label: 'Walk-up song for speakers or award winners' },
    { key: 'brandSongs', label: 'Company or brand songs to feature' },
  ],
};

type Song = { song: string; artist: string };
type Moment = Song & { dj: boolean; notes: string; who: string; choice: string; skipped: boolean };
const song = (): Song => ({ song: '', artist: '' });
const moment = (): Moment => ({ song: '', artist: '', dj: false, notes: '', who: '', choice: '', skipped: false });

const EMPTY = {
  name: '', email: '', phone: '', date: '', type: '' as EventType, venue: '', start: '', end: '', guests: '', duo: '',
  crowd: '', ages: [] as string[], feel: '', clean: '', cleanTouched: false,
  genres: {} as Record<string, string>,
  mustPlay: [song(), song(), song()], doNotPlay: '', playlist: '',
  moments: {} as Record<string, Moment>,
  introductions: [{ name: '', role: '', pronounce: '' }, { name: '', role: '', pronounce: '' }],
  candles: [{ who: '', ...song() }, { who: '', ...song() }, { who: '', ...song() }],
  otherMoments: [{ name: '', ...song(), notes: '' }],
  lastSong: moment(), avoidBrand: '',
  mic: '', speeches: [{ who: '', when: '' }], recognize: '',
  liveMoments: [] as string[], liveSongs: [song()],
  contactName: '', contactPhone: '', coordName: '', coordContact: '', loadIn: '', anythingElse: '',
};
type Plan = typeof EMPTY;

// ── Storage: every access guarded, the page works without it ────────────────
const store = {
  get(k: string) { try { return window.localStorage.getItem(k); } catch { return null; } },
  set(k: string, v: string) { try { window.localStorage.setItem(k, v); } catch { /* storage unavailable */ } },
  del(k: string) { try { window.localStorage.removeItem(k); } catch { /* storage unavailable */ } },
};
const LAST = 'djdx-plan:last';

function readQuery(): URLSearchParams {
  const w = window as unknown as { __planQuery?: string };
  return new URLSearchParams(w.__planQuery ?? window.location.search);
}

function initialState(): { plan: Plan; key: string; query: string } {
  const q = readQuery();
  const query = q.toString();
  const name = (q.get('name') || '').slice(0, 120);
  const date = /^\d{4}-\d{2}-\d{2}$/.test(q.get('date') || '') ? q.get('date')! : '';
  const typeParam = q.get('type') || '';
  const type = (EVENT_TYPES.some(([v]) => v === typeParam) ? typeParam : '') as EventType;
  const key = name || date ? `djdx-plan:${name}|${date}` : (store.get(LAST) || 'djdx-plan:|');
  if (name || date) store.set(LAST, key);

  const saved = store.get(key);
  if (saved) {
    try { return { plan: { ...EMPTY, ...JSON.parse(saved) }, key, query }; } catch { /* corrupt draft: start fresh */ }
  }
  const plan: Plan = { ...EMPTY, name, date, type, venue: (q.get('venue') || '').slice(0, 160), duo: q.get('duo') === '1' ? 'yes' : '' };
  if (type === 'mitzvah' || type === 'sweet16') plan.clean = CLEAN[0];
  return { plan, key, query };
}

// ── Small building blocks ────────────────────────────────────────────────────
function Field({ label, req, help, children, error, id }: { label: string; req?: boolean; help?: string; children: ReactNode; error?: string; id?: string }) {
  return (
    <div className="opp-field mp-field">
      <label htmlFor={id}><span>{label}{req && <em>Required</em>}</span></label>
      {children}
      {help && <small className="mp-help">{help}</small>}
      {error && <small className="mp-err" id={`${id}-err`}>{error}</small>}
    </div>
  );
}

function Pills({ legend, name, options, value, onChange, labels }: { legend: string; name: string; options: readonly string[]; value: string; onChange: (v: string) => void; labels?: readonly string[] }) {
  return (
    <fieldset className="mp-pills">
      <legend>{legend}</legend>
      <div className="opp-chips">
        {options.map((o, i) => (
          <label key={o} className={`opp-chip${value === o ? ' is-on' : ''}`}>
            <input type="radio" name={name} value={o} checked={value === o} onChange={() => onChange(o)} />
            {labels ? labels[i] : o}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function Checks({ legend, options, values, onChange }: { legend: string; options: string[]; values: string[]; onChange: (v: string[]) => void }) {
  return (
    <fieldset className="mp-pills">
      <legend>{legend}</legend>
      <div className="opp-chips">
        {options.map(o => {
          const on = values.includes(o);
          return (
            <label key={o} className={`opp-chip${on ? ' is-on' : ''}`}>
              <input type="checkbox" checked={on} onChange={() => onChange(on ? values.filter(v => v !== o) : [...values, o])} />
              {o}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

function SongInputs({ value, onChange, disabled, idBase }: { value: Song; onChange: (s: Song) => void; disabled?: boolean; idBase: string }) {
  return (
    <div className="mp-song">
      <label className="opp-field"><span className="mp-mini">Song</span>
        <input id={`${idBase}-song`} value={value.song} disabled={disabled} onChange={e => onChange({ ...value, song: e.target.value })} maxLength={200} />
      </label>
      <label className="opp-field"><span className="mp-mini">Artist</span>
        <input value={value.artist} disabled={disabled} onChange={e => onChange({ ...value, artist: e.target.value })} maxLength={200} />
      </label>
    </div>
  );
}

function Rows<T>({ items, max, onChange, make, addLabel, render }: {
  items: T[]; max: number; onChange: (v: T[]) => void; make: () => T; addLabel: string;
  render: (item: T, set: (v: T) => void, i: number) => ReactNode;
}) {
  return (
    <div className="mp-rows">
      {items.map((it, i) => (
        <div className="mp-row" key={i}>
          <div className="mp-row-body">{render(it, v => onChange(items.map((x, j) => (j === i ? v : x))), i)}</div>
          <button type="button" className="mp-remove" aria-label={`Remove row ${i + 1}`} onClick={() => onChange(items.filter((_, j) => j !== i))}>Remove</button>
        </div>
      ))}
      {items.length < max && <button type="button" className="mp-add" onClick={() => onChange([...items, make()])}>+ {addLabel}</button>}
    </div>
  );
}

function MomentRow({ def, value, onChange }: { def: MomentDef; value: Moment; onChange: (m: Moment) => void }) {
  const id = `m-${def.key}`;
  if (def.kind === 'radio') {
    return (
      <div className="mp-moment">
        <Pills legend={def.label} name={id} options={def.options!} value={value.choice} onChange={choice => onChange({ ...value, choice })} />
      </div>
    );
  }
  const off = value.dj || value.skipped;
  return (
    <fieldset className="mp-moment">
      <legend>{def.label}</legend>
      {def.help && <p className="mp-help">{def.help}</p>}
      {def.who && (
        <label className="opp-field"><span className="mp-mini">{def.who}</span>
          <input value={value.who} onChange={e => onChange({ ...value, who: e.target.value })} maxLength={120} />
        </label>
      )}
      <SongInputs idBase={id} value={value} disabled={off} onChange={s => onChange({ ...value, ...s })} />
      <div className="mp-moment-opts">
        <label className="opp-check"><input type="checkbox" checked={value.dj} disabled={value.skipped} onChange={e => onChange({ ...value, dj: e.target.checked })} />Your choice, DJ</label>
        {def.skip && <label className="opp-check"><input type="checkbox" checked={value.skipped} onChange={e => onChange({ ...value, skipped: e.target.checked })} />Skip this</label>}
      </div>
      <label className="opp-field"><span className="mp-mini">Notes</span>
        <input value={value.notes} onChange={e => onChange({ ...value, notes: e.target.value })} maxLength={500} />
      </label>
    </fieldset>
  );
}

function Card({ id, title, open, onToggle, started, children }: { id: string; title: string; open: boolean; onToggle: () => void; started: boolean; children: ReactNode }) {
  return (
    <div className={`mp-card${open ? ' is-open' : ''}`} id={`card-${id}`}>
      <h2 className="mp-card-h">
        <button type="button" aria-expanded={open} aria-controls={`panel-${id}`} onClick={onToggle}>
          <span>{title}</span>
          <span className="mp-card-meta">{started && <span className="mp-dot" aria-label="started" />}<span className="mp-chev" aria-hidden="true">{open ? '−' : '+'}</span></span>
        </button>
      </h2>
      <div id={`panel-${id}`} className="mp-panel" hidden={!open}>{children}</div>
    </div>
  );
}

// ── What counts as "started" for the progress line ──────────────────────────
const filled = (v: unknown): boolean =>
  typeof v === 'string' ? v.trim() !== '' : typeof v === 'boolean' ? v : Array.isArray(v) ? v.some(filled) : v && typeof v === 'object' ? Object.values(v).some(filled) : false;

// ── The page ─────────────────────────────────────────────────────────────────
export default function MusicPlan() {
  const init = useMemo(initialState, []);
  const [plan, setPlan] = useState<Plan>(init.plan);
  const [open, setOpen] = useState<Record<string, boolean>>({ event: true });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [announce, setAnnounce] = useState('');
  const hp = useRef<HTMLInputElement>(null);

  useEffect(() => { window.scrollTo(0, 0); }, []);
  useEffect(() => { if (status !== 'sent') store.set(init.key, JSON.stringify(plan)); }, [plan, init.key, status]);

  const set = <K extends keyof Plan>(k: K, v: Plan[K]) => setPlan(p => ({ ...p, [k]: v }));
  const setType = (t: EventType) => setPlan(p => ({
    ...p, type: t,
    clean: !p.cleanTouched && (t === 'mitzvah' || t === 'sweet16') ? CLEAN[0] : p.clean,
  }));
  const getMoment = (k: string) => plan.moments[k] || moment();
  const setMoment = (k: string, m: Moment) => setPlan(p => ({ ...p, moments: { ...p.moments, [k]: m } }));

  const type = plan.type;
  const showLive = plan.duo === 'yes';
  const momentDefs = type ? MOMENTS[type] : [];

  const sections = [
    { id: 'event', title: 'Your event', started: filled([plan.name, plan.email, plan.phone, plan.date, plan.type, plan.venue, plan.start, plan.end, plan.guests, plan.duo]) },
    { id: 'crowd', title: 'The crowd', started: filled([plan.crowd, plan.ages, plan.feel, plan.cleanTouched ? plan.clean : '']) },
    { id: 'genres', title: 'Genres and eras', started: filled(Object.values(plan.genres)) },
    { id: 'songs', title: 'Your songs', started: filled([plan.mustPlay, plan.doNotPlay, plan.playlist]) },
    { id: 'moments', title: 'Key moments', started: filled([momentDefs.map(d => plan.moments[d.key]), plan.otherMoments, plan.lastSong, plan.avoidBrand, type === 'wedding' ? plan.introductions : [], type === 'mitzvah' ? plan.candles : []]) },
    { id: 'mic', title: 'Microphone and announcements', started: filled([plan.mic, plan.speeches, plan.recognize]) },
    ...(showLive ? [{ id: 'live', title: 'Live violin and keys', started: filled([plan.liveMoments, plan.liveSongs]) }] : []),
    { id: 'dayof', title: 'Day-of details', started: filled([plan.contactName, plan.contactPhone, plan.coordName, plan.coordContact, plan.loadIn, plan.anythingElse]) },
  ];
  const startedCount = sections.filter(s => s.started).length;
  const toggle = (id: string) => setOpen(o => ({ ...o, [id]: !o[id] }));

  function validate() {
    const e: Record<string, string> = {};
    if (!plan.name.trim()) e.name = 'Please add your name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(plan.email.trim())) e.email = 'Please add an email address so I can send you a copy.';
    if (!plan.date) e.date = 'Please add the event date.';
    if (!plan.type) e.type = 'Please choose the event type.';
    return e;
  }

  async function submit(ev: React.FormEvent) {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    const first = ['name', 'email', 'date', 'type'].find(k => e[k]);
    if (first) {
      setOpen(o => ({ ...o, event: true }));
      setAnnounce(`Please check ${Object.keys(e).length === 1 ? 'one field' : `${Object.keys(e).length} fields`} in Your event.`);
      setTimeout(() => {
        const el = document.getElementById(`f-${first}`);
        el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el?.focus({ preventScroll: true });
      }, 50);
      return;
    }
    setStatus('sending');
    setAnnounce('Sending your music plan.');
    const keep = <T,>(arr: T[]) => arr.filter(filled);
    const body = {
      name: plan.name, email: plan.email, phone: plan.phone, date: plan.date, type: plan.type, venue: plan.venue,
      start: plan.start, end: plan.end, guests: plan.guests, duo: plan.duo,
      crowd: plan.crowd, ages: plan.ages, feel: plan.feel, clean: plan.clean,
      genres: plan.genres,
      mustPlay: keep(plan.mustPlay), doNotPlay: plan.doNotPlay, playlist: plan.playlist,
      moments: momentDefs.map(d => ({ label: d.label, ...getMoment(d.key) })),
      introductions: type === 'wedding' ? keep(plan.introductions) : [],
      candles: type === 'mitzvah' ? keep(plan.candles) : [],
      otherMoments: keep(plan.otherMoments),
      lastSong: plan.lastSong,
      avoidBrand: type === 'corporate' ? plan.avoidBrand : '',
      mic: plan.mic, speeches: keep(plan.speeches), recognize: plan.recognize,
      live: showLive ? { moments: plan.liveMoments, songs: keep(plan.liveSongs) } : undefined,
      dayOf: { contactName: plan.contactName, contactPhone: plan.contactPhone, coordName: plan.coordName, coordContact: plan.coordContact, loadIn: plan.loadIn, anythingElse: plan.anythingElse },
      company_website: hp.current?.value || '',
      query: init.query,
    };
    try {
      const r = await fetch('/api/music-plan', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      if (!r.ok) throw new Error(String(r.status));
      store.del(init.key);
      setStatus('sent');
      setAnnounce('');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      setStatus('error');
      setAnnounce('Something went wrong sending your plan. Your answers are still here, so please try again.');
    }
  }

  const textInput = (k: keyof Plan, label: string, props: Record<string, unknown> = {}) => (
    <Field label={label} id={`f-${String(k)}`} req={props.req as boolean} error={errors[String(k)]} help={props.help as string}>
      <input id={`f-${String(k)}`} type={(props.type as string) || 'text'} value={plan[k] as string} placeholder={props.placeholder as string}
        onChange={e => set(k, e.target.value as never)} maxLength={(props.max as number) || 200}
        aria-invalid={errors[String(k)] ? true : undefined} aria-describedby={errors[String(k)] ? `f-${String(k)}-err` : undefined}
        autoComplete={props.auto as string} inputMode={props.mode as never} />
    </Field>
  );
  const area = (k: keyof Plan, label: string, placeholder?: string) => (
    <Field label={label} id={`f-${String(k)}`}>
      <textarea id={`f-${String(k)}`} rows={4} value={plan[k] as string} placeholder={placeholder} onChange={e => set(k, e.target.value as never)} maxLength={2000} />
    </Field>
  );

  return (
    <div className="mp">
      <Helmet>
        <title>Plan Your Music | DJ DX</title>
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href="https://djdxmusic.com/plan" />
        <meta name="description" content="Music planning form for booked DJ DX clients." />
      </Helmet>
      <SiteNav />

      <main className="mp-main">
        <div className="mp-inner">
          {status === 'sent' ? (
            <div className="mp-done" role="status">
              <h1 className="mp-title">Got it, thank you.</h1>
              <p>Your music plan is on its way to me, and a copy is in your inbox. I'll go through everything before our planning call. If anything changes, come back to this page anytime and send an update.</p>
              <p className="mp-sign">Robert</p>
            </div>
          ) : (
            <>
              <header className="mp-head">
                <h1 className="mp-title">Let's plan your music</h1>
                <p>This is where we build your night. Fill in what you know now and leave the rest blank. Nothing here is final, and we'll go through all of it together on our planning call. It takes about ten minutes.</p>
                <p className="mp-progress" aria-live="polite">{startedCount} of {sections.length} sections started</p>
                <div className="mp-bar" aria-hidden="true"><span style={{ width: `${(startedCount / sections.length) * 100}%` }} /></div>
              </header>

              <form onSubmit={submit} noValidate>
                <input ref={hp} type="text" name="company_website" className="opp-hp" tabIndex={-1} autoComplete="off" aria-hidden="true" />

                {sections.map(s => (
                  <Card key={s.id} id={s.id} title={s.title} open={!!open[s.id]} onToggle={() => toggle(s.id)} started={s.started}>
                    {s.id === 'event' && (
                      <>
                        {textInput('name', 'Your name', { req: true, auto: 'name', max: 120 })}
                        <div className="opp-row mp-two">
                          {textInput('email', 'Email', { req: true, type: 'email', auto: 'email', help: 'Your confirmation copy goes here.' })}
                          {textInput('phone', 'Phone', { type: 'tel', auto: 'tel', max: 40 })}
                        </div>
                        <div className="opp-row mp-two">
                          {textInput('date', 'Event date', { req: true, type: 'date', max: 10 })}
                          <Field label="Event type" req id="f-type" error={errors.type}>
                            <select id="f-type" value={plan.type} onChange={e => setType(e.target.value as EventType)}
                              aria-invalid={errors.type ? true : undefined} aria-describedby={errors.type ? 'f-type-err' : undefined}>
                              <option value="">Choose one</option>
                              {EVENT_TYPES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                            </select>
                          </Field>
                        </div>
                        {textInput('venue', 'Venue', { max: 160 })}
                        <div className="opp-row mp-two">
                          {textInput('start', 'Music start time', { type: 'time', max: 10 })}
                          {textInput('end', 'Music end time', { type: 'time', max: 10 })}
                        </div>
                        <Field label="Approximate guests" id="f-guests">
                          <select id="f-guests" value={plan.guests} onChange={e => set('guests', e.target.value)}>
                            <option value="">Choose one</option>
                            {GUESTS.map(g => <option key={g}>{g}</option>)}
                          </select>
                        </Field>
                        <Pills legend="Is live violin and keys part of your booking?" name="duo" options={['yes', 'no', 'unsure']} labels={['Yes', 'No', 'Not sure']} value={plan.duo} onChange={v => set('duo', v)} />
                      </>
                    )}

                    {s.id === 'crowd' && (
                      <>
                        {area('crowd', 'Tell me about your crowd', "Who's coming, what gets them on the floor, any family or work dynamics I should know about.")}
                        <Checks legend="Age mix" options={AGES} values={plan.ages} onChange={v => set('ages', v)} />
                        <Pills legend="How should the night feel?" name="feel" options={FEELS} value={plan.feel} onChange={v => set('feel', v)} />
                        <Pills legend="Clean versions only?" name="clean" options={CLEAN} value={plan.clean} onChange={v => setPlan(p => ({ ...p, clean: v, cleanTouched: true }))} />
                      </>
                    )}

                    {s.id === 'genres' && (
                      <div className="mp-genres">
                        <p className="mp-help">Pick one for each, or leave any blank.</p>
                        {GENRES.map((g, i) => (
                          <Pills key={g} legend={g} name={`genre-${i}`} options={GENRE_OPTS.map(o => o[0])} labels={GENRE_OPTS.map(o => o[1])}
                            value={plan.genres[g] || ''} onChange={v => set('genres', { ...plan.genres, [g]: v })} />
                        ))}
                      </div>
                    )}

                    {s.id === 'songs' && (
                      <>
                        <fieldset className="mp-group">
                          <legend>Must-play songs</legend>
                          <p className="mp-help">The songs that have to happen. I'll make sure they land at the right moment.</p>
                          <Rows items={plan.mustPlay} max={15} make={song} addLabel="Add another song" onChange={v => set('mustPlay', v)}
                            render={(it, upd, i) => <SongInputs idBase={`must-${i}`} value={it} onChange={upd} />} />
                        </fieldset>
                        {area('doNotPlay', 'Do not play', 'Songs, artists, or whole genres to avoid.')}
                        {textInput('playlist', 'Playlist link', { type: 'url', max: 500, mode: 'url', help: 'Spotify, Apple Music, or YouTube playlist that captures your taste. Optional but very helpful.' })}
                      </>
                    )}

                    {s.id === 'moments' && (
                      <>
                        {!type && <p className="mp-help">Choose your event type in Your event and the moments for your kind of event will show here.</p>}
                        {momentDefs.map(d => <MomentRow key={d.key} def={d} value={getMoment(d.key)} onChange={m => setMoment(d.key, m)} />)}

                        {type === 'wedding' && (
                          <fieldset className="mp-group">
                            <legend>Names for introductions</legend>
                            <Rows items={plan.introductions} max={30} make={() => ({ name: '', role: '', pronounce: '' })} addLabel="Add another name"
                              onChange={v => set('introductions', v)}
                              render={(it, upd) => (
                                <div className="mp-three">
                                  <label className="opp-field"><span className="mp-mini">Name</span><input value={it.name} onChange={e => upd({ ...it, name: e.target.value })} maxLength={120} /></label>
                                  <label className="opp-field"><span className="mp-mini">Role</span>
                                    <select value={it.role} onChange={e => upd({ ...it, role: e.target.value })}><option value="">Choose</option>{ROLES.map(r => <option key={r}>{r}</option>)}</select>
                                  </label>
                                  <label className="opp-field"><span className="mp-mini">How to pronounce it</span><input value={it.pronounce} onChange={e => upd({ ...it, pronounce: e.target.value })} maxLength={120} /></label>
                                </div>
                              )} />
                          </fieldset>
                        )}

                        {type === 'mitzvah' && (
                          <fieldset className="mp-group">
                            <legend>Candle lighting</legend>
                            <p className="mp-help">Usually 13 candles, each dedicated to a person or group with its own song.</p>
                            <Rows items={plan.candles} max={14} make={() => ({ who: '', ...song() })} addLabel="Add another candle"
                              onChange={v => set('candles', v)}
                              render={(it, upd, i) => (
                                <>
                                  <label className="opp-field"><span className="mp-mini">Honoree or group</span><input value={it.who} onChange={e => upd({ ...it, who: e.target.value })} maxLength={160} /></label>
                                  <SongInputs idBase={`candle-${i}`} value={it} onChange={sv => upd({ ...it, ...sv })} />
                                </>
                              )} />
                          </fieldset>
                        )}

                        {type === 'corporate' && area('avoidBrand', 'Songs to avoid for brand reasons')}

                        {type && (
                          <>
                            <fieldset className="mp-group">
                              <legend>Other moments</legend>
                              <Rows items={plan.otherMoments} max={20} make={() => ({ name: '', ...song(), notes: '' })} addLabel="Add another moment"
                                onChange={v => set('otherMoments', v)}
                                render={(it, upd, i) => (
                                  <>
                                    <label className="opp-field"><span className="mp-mini">Moment</span><input value={it.name} onChange={e => upd({ ...it, name: e.target.value })} maxLength={120} /></label>
                                    <SongInputs idBase={`other-${i}`} value={it} onChange={sv => upd({ ...it, ...sv })} />
                                    <label className="opp-field"><span className="mp-mini">Notes</span><input value={it.notes} onChange={e => upd({ ...it, notes: e.target.value })} maxLength={500} /></label>
                                  </>
                                )} />
                            </fieldset>
                            <MomentRow def={{ key: 'last', label: 'Last song of the night' }} value={plan.lastSong} onChange={m => set('lastSong', m)} />
                          </>
                        )}
                      </>
                    )}

                    {s.id === 'mic' && (
                      <>
                        <Pills legend="How much should I be on the mic?" name="mic" options={MIC} value={plan.mic} onChange={v => set('mic', v)} />
                        <fieldset className="mp-group">
                          <legend>Speeches and toasts</legend>
                          <Rows items={plan.speeches} max={20} make={() => ({ who: '', when: '' })} addLabel="Add another speech" onChange={v => set('speeches', v)}
                            render={(it, upd) => (
                              <div className="mp-song">
                                <label className="opp-field"><span className="mp-mini">Who's speaking</span><input value={it.who} onChange={e => upd({ ...it, who: e.target.value })} maxLength={160} /></label>
                                <label className="opp-field"><span className="mp-mini">Roughly when</span><input value={it.when} placeholder="after dinner, around 8:30" onChange={e => upd({ ...it, when: e.target.value })} maxLength={160} /></label>
                              </div>
                            )} />
                        </fieldset>
                        {area('recognize', 'People to recognize', 'Anyone I should welcome or shout out. Add how to pronounce names.')}
                      </>
                    )}

                    {s.id === 'live' && (
                      <>
                        <p className="mp-help">Julie plays violin and keys live over the set at a few key moments. Tell us where you'd love to hear her.</p>
                        <Checks legend="Moments to feature live" options={LIVE_MOMENTS} values={plan.liveMoments} onChange={v => set('liveMoments', v)} />
                        <fieldset className="mp-group">
                          <legend>Songs you'd love to hear live</legend>
                          <Rows items={plan.liveSongs} max={8} make={song} addLabel="Add another song" onChange={v => set('liveSongs', v)}
                            render={(it, upd, i) => <SongInputs idBase={`live-${i}`} value={it} onChange={upd} />} />
                        </fieldset>
                      </>
                    )}

                    {s.id === 'dayof' && (
                      <>
                        <div className="opp-row mp-two">
                          {textInput('contactName', 'Day-of contact name', { placeholder: 'Who I should find when I arrive', max: 120 })}
                          {textInput('contactPhone', 'Day-of contact phone', { type: 'tel', max: 40 })}
                        </div>
                        <div className="opp-row mp-two">
                          {textInput('coordName', 'Venue coordinator name', { max: 120 })}
                          {textInput('coordContact', 'Venue coordinator phone or email')}
                        </div>
                        {area('loadIn', 'Load-in notes', 'Elevator, loading dock, parking, building rules, noise limits.')}
                        {area('anythingElse', 'Anything else I should know', 'Surprises, songs with a story, anything that would make the night feel like yours.')}
                      </>
                    )}
                  </Card>
                ))}

                <div className="mp-submit">
                  <p className="mp-note">You can come back and send an update anytime before the event. I'll always work from the most recent version.</p>
                  <div aria-live="polite" className="mp-live">
                    {status === 'error'
                      ? <p className="mp-error">Something went wrong sending your plan. Your answers are still here, so please try again. If it keeps happening, email <a href="mailto:bookings@djdxmusic.com">bookings@djdxmusic.com</a> or call <a href={`tel:${PHONE.replace(/\D/g, '')}`}>{PHONE}</a>.</p>
                      : Object.keys(errors).length > 0 ? <p className="mp-error">{announce}</p> : <span className="opp-sr">{announce}</span>}
                  </div>
                  <button type="submit" className="btn-gold mp-send" disabled={status === 'sending'}>
                    {status === 'sending' ? 'Sending…' : 'Send my music plan'}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
