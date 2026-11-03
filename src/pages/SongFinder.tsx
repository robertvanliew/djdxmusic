import { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useSearchParams } from 'react-router-dom';
import SiteNav from '../components/SiteNav';
import SiteFooter from '../components/SiteFooter';
import StickyMobileCTA from '../components/StickyMobileCTA';
import AuthorBio from '../components/AuthorBio';
import BookingForm from '../components/BookingForm';
import { trackEvent } from '../lib/analytics';
import { ENTRANCE, LAST_DANCE, ENTRANCE_VIBES, LAST_VIBES, type WSong, type Genre } from '../data/weddingSongs';

// Two wedding song finders built from one component:
//   /wedding-entrance-songs     (grand entrance + wedding party intros)
//   /last-dance-songs-wedding   (the final song of the night)
// The whole list is in the prerendered HTML so search engines read every song;
// filters only hide rows. A couple's picks live in the URL (?list=e01,e14) so
// they can send the list to a partner, the wedding party or their DJ.

type Kind = 'entrance' | 'last';
interface Cfg {
  path: string; title: string; description: string; h1: [string, string]; over: string; lead: string;
  songs: WSong[]; vibes: readonly string[]; other: { to: string; label: string };
  howH2: string; how: string[]; faq: { q: string; a: string }[]; event: string;
}

const CFG: Record<Kind, Cfg> = {
  entrance: {
    path: '/wedding-entrance-songs',
    title: 'Wedding Entrance Songs: 40+ Picks by Vibe & Genre | DJ DX',
    description: 'Find your wedding grand entrance song: 42 picks filtered by vibe, genre and decade, with clean edits marked. Save a list and send it to your DJ.',
    h1: ['Wedding Entrance', 'Song Finder'],
    over: 'Free song finder',
    lead: 'The grand entrance is the moment the party starts. Filter by vibe, genre and decade, tap the songs you love, and send the list to your partner, your wedding party or your DJ. Every pick here has worked on a real dance floor, and the ones with explicit originals are played as clean edits.',
    songs: ENTRANCE, vibes: ENTRANCE_VIBES,
    other: { to: '/last-dance-songs-wedding', label: 'Last dance song finder' },
    howH2: 'How to pick an entrance song that works',
    how: [
      'Pick for the hook, not the whole song. An entrance lasts 30 to 60 seconds, so the DJ starts the track at the part everyone knows. A song with a long, quiet intro needs a cue point, which is normal: tell your DJ the moment you want to walk in on.',
      'Match the room you want after you walk in. A hype song tells guests the dance floor is about to open. A classy or romantic song suits a formal dinner that starts right after. If dinner comes first, a feel-good song bridges both.',
      'Give the wedding party a different song from yours. The usual order is parents, then the wedding party in pairs, then the couple. One upbeat track for the wedding party and a bigger moment for the two of you keeps it from dragging.',
      'Send the name pronunciations with the song. The emcee reads every name over the music, so the list of names in walk-in order matters as much as the song.',
    ],
    faq: [
      { q: 'How long should a wedding entrance song play?', a: 'About 30 to 60 seconds for the couple, a little longer if the whole wedding party walks in on the same song. The DJ starts at the most recognizable part and fades into the next moment, usually the first dance or the welcome.' },
      { q: 'Can we walk in to a song with explicit lyrics?', a: 'Yes, as a clean edit. Songs marked "Clean edit" here have explicit originals, and DJ DX plays the radio version at every wedding. The hook is the same; the words grandparents would notice are not.' },
      { q: 'Should the wedding party and the couple have different songs?', a: 'Usually, yes. A separate song for the couple makes your entrance its own moment. Some couples use one song for everyone and have the DJ hold the big drop for when they walk in.' },
      { q: 'What if our venue does a formal introduction?', a: 'Pick a classy or romantic song and the emcee introduces you over it. You can still switch to something upbeat once you reach the dance floor.' },
    ],
    event: 'entrance',
  },
  last: {
    path: '/last-dance-songs-wedding',
    title: 'Last Dance Songs for a Wedding: 32 Picks by Vibe | DJ DX',
    description: 'Find your wedding last dance song: 32 sing-alongs, slow dances and upbeat send-offs, filtered by genre and decade. Save a list and send it to your DJ.',
    h1: ['Last Dance', 'Song Finder'],
    over: 'Free song finder',
    lead: 'The last song is what guests sing on the way to the car. Choose a sing-along, a slow dance or an upbeat send-off, filter by genre and decade, then send your shortlist to your partner or your DJ.',
    songs: LAST_DANCE, vibes: LAST_VIBES,
    other: { to: '/wedding-entrance-songs', label: 'Entrance song finder' },
    howH2: 'How to pick a last dance song',
    how: [
      'Decide what you want the last memory to be. A sing-along puts the whole room in one circle. A slow dance gives the two of you a quiet moment with everyone watching. An upbeat send-off sends people out still dancing.',
      'Plan the last two songs, not one. Many couples pair them: a big sing-along for everyone, then a slow song for the couple to end on, or the other way around.',
      'Know the hard stop. Venues end music at a fixed time, so the last song has to start a few minutes before it. Your DJ should time it from the venue cutoff, not from the clock on the wall.',
      'Tell the DJ about the exit. If there is a sparkler or bubble exit, the last song may play outside or loop while guests line up. That changes which song works.',
    ],
    faq: [
      { q: 'What is the most popular last dance song at weddings?', a: 'Sing-alongs like Don\'t Stop Believin\', Sweet Caroline and Livin\' on a Prayer are the most common in the New York area because the whole room knows the words. For a quieter ending, Can\'t Help Falling in Love and At Last are classics.' },
      { q: 'Should the last dance be slow or fast?', a: 'Either works. Fast keeps the energy up until the lights come on. Slow gives you one more moment together. Pairing them as the last two songs gives you both.' },
      { q: 'When should the last song start?', a: 'A few minutes before the venue\'s music cutoff, so it finishes on time. The DJ times it from the contracted end time and lets you know when it is coming.' },
      { q: 'Can the last song be a surprise for guests?', a: 'Yes. Tell the DJ privately and keep it off the shared plan. Announcing "last song" right before it starts brings everyone back to the floor.' },
    ],
    event: 'last_dance',
  },
};

const GENRES: Genre[] = ['R&B & Soul', 'Hip-Hop', 'Pop', 'Rock', 'Latin', 'Afrobeats', 'House & Dance', 'Classics'];
const decade = (y: number) => `${Math.floor(y / 10) * 10}s`;
const store = (k: string) => { try { return (localStorage.getItem(k) || '').split(',').filter(Boolean); } catch { return []; } };
const keep = (k: string, v: string[]) => { try { localStorage.setItem(k, v.join(',')); } catch { /* storage blocked */ } };

export default function SongFinder({ kind }: { kind: Kind }) {
  const c = CFG[kind];
  const URL = `https://djdxmusic.com${c.path}`;
  const KEY = `djdx-songs-${kind}`;
  const valid = useMemo(() => new Set(c.songs.map(s => s.id)), [c.songs]);
  const [params] = useSearchParams();
  const shared = (params.get('list') || '').split(',').filter(id => valid.has(id));

  const [vibe, setVibe] = useState('');
  const [genre, setGenre] = useState('');
  const [dec, setDec] = useState('');
  const [cleanOnly, setCleanOnly] = useState(false);
  const [list, setList] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const [formKey, setFormKey] = useState(0);

  useEffect(() => { window.scrollTo(0, 0); }, [kind]);
  // Load saved picks after hydration (prerendered HTML never has them), merging a shared link
  useEffect(() => {
    const saved = store(KEY).filter(id => valid.has(id));
    setList([...new Set([...shared, ...saved])]);
    if (shared.length) trackEvent('song_list_opened', { finder: c.event, count: shared.length });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [KEY]);

  const decades = useMemo(() => [...new Set(c.songs.map(s => decade(s.year)))].sort(), [c.songs]);
  const shown = c.songs.filter(s => (!vibe || s.vibe === vibe) && (!genre || s.genre === genre) && (!dec || decade(s.year) === dec) && (!cleanOnly || !s.edit));
  const picked = c.songs.filter(s => list.includes(s.id));

  const toggle = (id: string) => {
    const next = list.includes(id) ? list.filter(x => x !== id) : [...list, id];
    setList(next); keep(KEY, next);
    if (!list.includes(id)) trackEvent('song_added', { finder: c.event, song: id });
  };
  const shareUrl = `${URL}?list=${picked.map(s => s.id).join(',')}`;
  const share = async () => {
    trackEvent('song_list_shared', { finder: c.event, count: picked.length });
    try {
      if (navigator.share) await navigator.share({ title: `Our ${kind === 'entrance' ? 'entrance' : 'last dance'} song shortlist`, url: shareUrl });
      else { await navigator.clipboard.writeText(shareUrl); setCopied(true); setTimeout(() => setCopied(false), 2000); }
    } catch { /* cancelled */ }
  };
  const message = picked.length
    ? `Our ${kind === 'entrance' ? 'entrance' : 'last dance'} song shortlist:\n${picked.map(s => `- ${s.title}, ${s.artist}`).join('\n')}`
    : '';
  const sendToDJ = () => {
    trackEvent('song_list_to_booking', { finder: c.event, count: picked.length });
    setFormKey(k => k + 1);
    document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });
  };

  const schema = [
    {
      '@context': 'https://schema.org', '@type': 'ItemList', '@id': `${URL}#songs`, name: `${c.h1.join(' ')}`, numberOfItems: c.songs.length,
      itemListElement: c.songs.map((s, i) => ({ '@type': 'ListItem', position: i + 1, item: { '@type': 'MusicRecording', name: s.title, byArtist: { '@type': 'MusicGroup', name: s.artist }, genre: s.genre, datePublished: String(s.year) } })),
    },
    { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: c.faq.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) },
    {
      '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://djdxmusic.com/' },
        { '@type': 'ListItem', position: 2, name: 'Wedding DJ', item: 'https://djdxmusic.com/wedding-dj-nyc-nj' },
        { '@type': 'ListItem', position: 3, name: c.h1.join(' '), item: URL },
      ],
    },
  ];

  const Chip = ({ on, label, onClick }: { on: boolean; label: string; onClick: () => void }) => (
    <button type="button" className={`sf-chip${on ? ' is-on' : ''}`} aria-pressed={on} onClick={onClick}>{label}</button>
  );

  return (
    <>
      <Helmet>
        <title>{c.title}</title>
        <meta name="description" content={c.description} />
        <link rel="canonical" href={URL} />
        <meta property="og:title" content={c.title} />
        <meta property="og:description" content={c.description} />
        <meta property="og:url" content={URL} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </Helmet>
      <SiteNav />
      <main className="vn-main">
        <div className="vn-inner">
          <nav className="vn-crumbs" aria-label="Breadcrumb"><Link to="/wedding-dj-nyc-nj">Wedding DJ</Link> / {c.h1.join(' ')}</nav>
          <div className="sec-overline"><span className="sec-label">{c.over}</span></div>
          <h1 className="sec-title vn-h1">{c.h1[0]} <span>{c.h1[1]}</span></h1>
          <p className="vn-p vn-lead">{c.lead}</p>

          <div className="sf-filters" role="group" aria-label="Filter songs">
            <div className="sf-row"><span className="sf-lab">Vibe</span>
              <Chip on={!vibe} label="All" onClick={() => setVibe('')} />
              {c.vibes.map(v => <Chip key={v} on={vibe === v} label={v} onClick={() => setVibe(vibe === v ? '' : v)} />)}
            </div>
            <div className="sf-row"><span className="sf-lab">Genre</span>
              <Chip on={!genre} label="All" onClick={() => setGenre('')} />
              {GENRES.filter(g => c.songs.some(s => s.genre === g)).map(g => <Chip key={g} on={genre === g} label={g} onClick={() => setGenre(genre === g ? '' : g)} />)}
            </div>
            <div className="sf-row"><span className="sf-lab">Decade</span>
              <Chip on={!dec} label="All" onClick={() => setDec('')} />
              {decades.map(d => <Chip key={d} on={dec === d} label={d} onClick={() => setDec(dec === d ? '' : d)} />)}
            </div>
            <label className="sf-clean"><input type="checkbox" checked={cleanOnly} onChange={e => setCleanOnly(e.target.checked)} /> Only songs with clean originals</label>
          </div>

          <p className="sf-count" aria-live="polite">{shown.length} of {c.songs.length} songs{list.length ? ` · ${list.length} on your list` : ''}</p>
          <ul className="sf-list">
            {shown.map(s => {
              const on = list.includes(s.id);
              return (
                <li key={s.id} className={on ? 'is-on' : ''}>
                  <div className="sf-song">
                    <strong>{s.title}</strong>
                    <span>{s.artist}</span>
                    <small>{s.year} · {s.genre} · {s.vibe}{s.edit ? ' · ' : ''}{s.edit && <em>Clean edit</em>}</small>
                  </div>
                  <button type="button" className="sf-add" aria-pressed={on} aria-label={`${on ? 'Remove' : 'Add'} ${s.title} ${on ? 'from' : 'to'} your list`} onClick={() => toggle(s.id)}>
                    {on ? 'Added' : '+ Add'}
                  </button>
                </li>
              );
            })}
            {!shown.length && <li className="sf-empty">No songs match all of those. Clear a filter.</li>}
          </ul>

          <section className="vn-sec sf-mine" id="my-list" aria-label="Your list">
            <h2 className="vn-h2">Your shortlist</h2>
            {picked.length ? (
              <>
                <ol className="pl-list">{picked.map(s => <li key={s.id}><strong>{s.title}</strong><span>{s.artist}</span></li>)}</ol>
                <div className="sf-actions">
                  <button type="button" className="btn-gold" onClick={share}>{copied ? 'Link copied' : 'Share this list'}</button>
                  <button type="button" className="btn-ghost" onClick={sendToDJ}>Send it to DJ DX with my date</button>
                </div>
                <p className="vn-p sf-fine">The share link opens this page with your songs already picked, so your partner can add to it.</p>
              </>
            ) : <p className="vn-p">Tap <strong>+ Add</strong> on any song. Your picks stay on this device and you can share them as a link.</p>}
          </section>

          <section className="vn-sec">
            <h2 className="vn-h2">{c.howH2}</h2>
            {c.how.map(p => <p className="vn-p" key={p.slice(0, 24)}>{p}</p>)}
          </section>

          <section className="vn-sec" id="faq">
            <h2 className="vn-h2">Questions couples ask</h2>
            {c.faq.map(f => <div key={f.q} className="pl-faq"><h3>{f.q}</h3><p className="vn-p">{f.a}</p></div>)}
          </section>

          <section className="vn-sec">
            <h2 className="vn-h2">More for the music plan</h2>
            <p className="vn-p">
              <Link to={c.other.to}>{c.other.label}</Link> · <Link to="/plan">Full wedding music plan</Link> ·{' '}
              <Link to="/wedding-entertainment-package-nyc-nj">Ceremony violin and reception DJ, one booking</Link> ·{' '}
              <Link to="/wedding-dj-nyc-nj">Wedding DJ in NYC and NJ</Link>
            </p>
            <p className="vn-p">
              Still choosing your first dance? Violinist Julie Schatz has a <a href="https://julieschatzmusic.com/first-dance-song-finder/">first dance song finder</a>, plus finders for the <a href="https://julieschatzmusic.com/walking-down-the-aisle-song-finder/">walk down the aisle</a> and <a href="https://julieschatzmusic.com/parent-dance-song-finder/">parent dances</a>.
              She and DJ DX perform together as <Link to="/soul-shades">Soul Shades</Link>.
            </p>
          </section>
        </div>
      </main>

      <section id="booking" className="booking" style={{ padding: '80px 24px' }}>
        <div className="section-inner">
          <div className="booking-layout">
            <div className="booking-left">
              <div className="sec-overline"><span className="sec-label">Check a Date</span></div>
              <h2 className="sec-title">Want these <span>mixed live?</span></h2>
              <p style={{ color: 'rgba(242,242,242,0.55)', lineHeight: 1.8, marginTop: '16px' }}>
                Send your date and venue. Your shortlist goes in the message, and you hear back within 24 hours.
              </p>
            </div>
            <div className="booking-right">
              <BookingForm key={formKey} formName={`song_finder_${c.event}`} initial={{ eventType: 'Wedding', message }} />
            </div>
          </div>
        </div>
      </section>
      <AuthorBio />
      <StickyMobileCTA formName={`song_finder_${c.event}_sticky`} label="Check My Date" />
      <SiteFooter />
    </>
  );
}
