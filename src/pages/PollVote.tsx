import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useParams } from 'react-router-dom';
import SiteNav from '../components/SiteNav';
import { ERAS, ENERGY_LABELS, pollApi, hasVoted, markVoted, type PublicPoll } from '../lib/poll';
import SongPicker, { type PickedSong } from '../components/SongPicker';
import { trackEvent } from '../lib/analytics';

// Voting page, opened from Slack/Teams/email - so phone first and fast: one
// screen, big tap targets, no account, no personal data collected.

type Song = PickedSong;
const EMPTY_SONG: Song = { artist: '', title: '' };

export default function PollVote() {
  const { pollId = '' } = useParams();
  const [poll, setPoll] = useState<PublicPoll | null>(null);
  const [state, setState] = useState<'loading' | 'missing' | 'ready' | 'voted' | 'done'>('loading');

  useEffect(() => {
    window.scrollTo(0, 0);
    pollApi<PublicPoll>('poll', { query: { id: pollId } })
      .then(p => { setPoll(p); setState(hasVoted(pollId) ? 'voted' : 'ready'); })
      .catch(() => setState('missing'));
  }, [pollId]);

  const heading = poll
    ? `Help pick the music for ${poll.company ? `${poll.company}'s ` : 'the '}${poll.eventType.toLowerCase()}`
    : 'Office party music poll';

  return (
    <>
      <Helmet>
        <title>{`${heading} | Music Poll`}</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <SiteNav />
      <main className="pv">
        <div className="pv-inner">
          {state === 'loading' && <p className="pv-status">Loading the poll…</p>}
          {state === 'missing' && (
            <div className="pv-msg">
              <h1>This poll doesn't exist</h1>
              <p>Double-check the link you were sent. If it's older than a few months, the poll may have been removed.</p>
              <Link to="/office-party-music-poll" className="btn-gold">Create your own free poll</Link>
            </div>
          )}
          {state === 'ready' && poll && !poll.open && (
            <div className="pv-msg">
              <h1>Voting has closed</h1>
              <p>The organizer has wrapped up this poll. Thanks for stopping by.</p>
              {poll.publicResults && <Link to={`/poll/${poll.id}/results`} className="btn-gold">See the results</Link>}
            </div>
          )}
          {state === 'ready' && poll && poll.open && <VoteForm poll={poll} heading={heading} onDone={() => setState('done')} />}
          {(state === 'done' || state === 'voted') && poll && (
            <div className="pv-msg pv-thanks">
              <div className="pv-check" aria-hidden="true">✓</div>
              <h1>{state === 'done' ? 'Thanks, your vote is in' : "You've already voted"}</h1>
              <p>Your picks go straight into the crowd report for the organizer.</p>
              {poll.publicResults && <p><Link to={`/poll/${poll.id}/results`}>See how everyone voted</Link></p>}
              <div className="pv-cta">
                <strong>Planning your own event?</strong>
                <span>Run a free poll like this one, or get a starting price from DJ DX.</span>
                <div className="pv-cta-links">
                  <Link to="/office-party-music-poll">Create a free poll</Link>
                  <Link to="/event-dj-cost-nyc-nj-ct#quote-calculator">Get a quote</Link>
                </div>
              </div>
            </div>
          )}
        </div>
        <footer className="pv-powered">
          <Link to="/office-party-music-poll">Powered by <strong>DJ DX</strong> · free music polls for office parties</Link>
        </footer>
      </main>
    </>
  );
}

function VoteForm({ poll, heading, onDone }: { poll: PublicPoll; heading: string; onDone: () => void }) {
  const [genres, setGenres] = useState<string[]>([]);
  const [eras, setEras] = useState<string[]>([]);
  const [energy, setEnergy] = useState(3);
  const [songs, setSongs] = useState<Song[]>([EMPTY_SONG]);
  const [dnp, setDnp] = useState<Song>(EMPTY_SONG);
  const [hp, setHp] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'error'>('idle');
  const [error, setError] = useState('');
  const mountedAt = useRef(Date.now());

  const toggleGenre = (g: string) =>
    setGenres(gs => (gs.includes(g) ? gs.filter(x => x !== g) : gs.length < 3 ? [...gs, g] : gs));
  const toggleEra = (e: string) => setEras(es => (es.includes(e) ? es.filter(x => x !== e) : [...es, e]));
  const setSong = (i: number, v: Song) => setSongs(ss => ss.map((s, j) => (j === i ? v : s)));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (genres.length === 0) { setError('Pick at least one genre.'); setStatus('error'); return; }
    setStatus('sending'); setError('');
    try {
      await pollApi('vote', {
        method: 'POST',
        body: { id: poll.id, genres, eras, energy, songs: poll.allowSongs ? songs : [], dnp: poll.allowDnp ? dnp : null, honeypot: hp, elapsedMs: Date.now() - mountedAt.current },
      });
      markVoted(poll.id);
      trackEvent('vote_cast', { poll_id: poll.id });
      window.scrollTo({ top: 0, behavior: 'smooth' });
      onDone();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      setStatus('error');
    }
  };

  return (
    <form className="pv-form" onSubmit={submit}>
      <div className="pv-head">
        <span className="pv-eyebrow">Music poll · under a minute · anonymous</span>
        <h1>{heading}</h1>
      </div>
      <div aria-hidden="true" className="opp-hp">
        <label htmlFor="pv-hp">Leave this field blank</label>
        <input id="pv-hp" tabIndex={-1} autoComplete="off" value={hp} onChange={e => setHp(e.target.value)} />
      </div>

      <fieldset className="pv-q">
        <legend><span className="pv-n">1</span>Pick your top 3 genres <em>{genres.length}/3</em></legend>
        <div className="pv-chips">
          {poll.genres.map(g => {
            const on = genres.includes(g);
            return (
              <label key={g} className={`pv-chip${on ? ' is-on' : ''}${!on && genres.length >= 3 ? ' is-full' : ''}`}>
                <input type="checkbox" checked={on} disabled={!on && genres.length >= 3} onChange={() => toggleGenre(g)} />{g}
              </label>
            );
          })}
        </div>
      </fieldset>

      <fieldset className="pv-q">
        <legend><span className="pv-n">2</span>Which eras do you want to hear?</legend>
        <div className="pv-chips">
          {ERAS.map(e => (
            <label key={e} className={`pv-chip${eras.includes(e) ? ' is-on' : ''}`}>
              <input type="checkbox" checked={eras.includes(e)} onChange={() => toggleEra(e)} />{e}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="pv-q">
        <legend><span className="pv-n">3</span>How much do you want to dance?</legend>
        <input className="pv-range" type="range" min={1} max={5} step={1} value={energy}
          aria-valuetext={ENERGY_LABELS[energy - 1]} onChange={e => setEnergy(Number(e.target.value))} aria-label="Dance-floor energy" />
        <div className="pv-range-ends" aria-hidden="true"><span>Background vibes</span><span>Keep me dancing all night</span></div>
        <p className="pv-range-now">{ENERGY_LABELS[energy - 1]}</p>
      </fieldset>

      {poll.allowSongs && (
        <fieldset className="pv-q">
          <legend><span className="pv-n">4</span>Request up to 3 songs <em>optional</em></legend>
          {songs.map((s, i) => (
            <div key={i} className="pv-pick">
              <SongPicker label={`Song ${i + 1}`} value={s} onChange={v => setSong(i, v)} />
            </div>
          ))}
          {songs.length < 3 && (songs[songs.length - 1].title || songs[songs.length - 1].artist) && (
            <button type="button" className="pv-add" onClick={() => setSongs(ss => [...ss, EMPTY_SONG])}>+ Add another song</button>
          )}
        </fieldset>
      )}

      {poll.allowDnp && (
        <fieldset className="pv-q">
          <legend><span className="pv-n">{poll.allowSongs ? 5 : 4}</span>One song you never want to hear <em>optional</em></legend>
          <SongPicker label="Do-not-play song" value={dnp} onChange={setDnp} placeholder="Search the song you never want to hear" />
        </fieldset>
      )}

      {poll.cleanOnly && <p className="pv-note">Heads-up: this is a work event, so the DJ will play clean versions only.</p>}
      {status === 'error' && <p className="form-error" role="alert">{error}</p>}
      <button type="submit" className="btn-gold pv-submit" disabled={status === 'sending'}>
        {status === 'sending' ? 'Sending…' : 'Submit My Vote'}
      </button>
    </form>
  );
}
