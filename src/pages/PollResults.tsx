import { useCallback, useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import SiteNav from '../components/SiteNav';
import BookingForm from '../components/BookingForm';
import { BarList, EnergyMeter, SongList } from '../components/PollCharts';
import { pollApi, crowdProfile, type PollResults as Results } from '../lib/poll';
import { trackEvent } from '../lib/analytics';

// The conversion page. The planner arrives via their private link
// (?key=...); without a valid key the API returns 403 unless the planner
// turned on public results, in which case coworkers see a read-only tally.

const REFRESH_MS = 30000;

export default function PollResults() {
  const { pollId = '' } = useParams();
  const [params] = useSearchParams();
  const key = params.get('key') || '';
  const [r, setR] = useState<Results | null>(null);
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState('');
  const [copied, setCopied] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const viewed = useRef(false);

  const load = useCallback(() =>
    pollApi<Results>('results', { query: key ? { id: pollId, key } : { id: pollId } })
      .then(d => {
        setR(d); setErr('');
        if (!viewed.current) { viewed.current = true; trackEvent('results_viewed', { poll_id: pollId, admin: d.admin }); }
      })
      .catch(e => setErr(e instanceof Error ? e.message : 'Could not load results.')), [pollId, key]);

  useEffect(() => { window.scrollTo(0, 0); load(); }, [load]);

  // Keep the tally fresh while voting is open and the tab is visible
  useEffect(() => {
    if (!r?.open) return;
    const t = setInterval(() => { if (document.visibilityState === 'visible') load(); }, REFRESH_MS);
    return () => clearInterval(t);
  }, [r?.open, load]);

  const voteUrl = `https://djdxmusic.com/poll/${pollId}`;
  const manage = async (op: 'close' | 'public', value?: boolean) => {
    if (op === 'close' && !window.confirm('Close voting now? The link will stop accepting votes. Your report stays available.')) return;
    setBusy(op);
    try { await pollApi('manage', { method: 'POST', body: { id: pollId, key, op, value } }); await load(); }
    catch (e) { window.alert(e instanceof Error ? e.message : 'Could not update the poll.'); }
    finally { setBusy(''); }
  };
  const copyLink = async () => {
    try { await navigator.clipboard.writeText(voteUrl); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch { /* blocked */ }
    trackEvent('poll_shared', { method: 'copy_link_results' });
  };
  const openBooking = () => { trackEvent('book_cta_clicked', { poll_id: pollId }); dialogRef.current?.showModal(); };

  const title = r ? `${r.planner.company ? `${r.planner.company} ` : ''}${r.planner.eventType} crowd report` : 'Music poll results';
  const profile = r ? crowdProfile(r) : '';
  const bookingNote = r ? [
    `Crowd report from my music poll (${r.total} vote${r.total === 1 ? '' : 's'}):`,
    profile,
    r.songs.length ? `Top requests: ${r.songs.slice(0, 5).map(s => s.label).join('; ')}` : '',
    r.doNotPlay.length ? `Do not play: ${r.doNotPlay.slice(0, 5).map(s => s.label).join('; ')}` : '',
    r.planner.company ? `Company: ${r.planner.company}` : '',
    r.planner.headcount ? `Headcount: ${r.planner.headcount}` : '',
    r.planner.location ? `Location: ${r.planner.location}` : '',
    `Poll ID: ${r.id}`,
  ].filter(Boolean).join('\n').slice(0, 1900) : ''; // api/booking.ts caps message at 2000

  return (
    <>
      <Helmet>
        <title>{`${title} | DJ DX Music Poll`}</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="pr-noprint"><SiteNav /></div>
      {/* inner blocks are divs, not <section>: index.css forces 60px padding on every <section> on phones */}
      <main className="pr">
        <div className="pr-inner">
          {!r && !err && <p className="pv-status">Loading results…</p>}
          {err && (
            <div className="pv-msg">
              <h1>{/private/i.test(err) ? 'These results are private' : 'Results unavailable'}</h1>
              <p>{/private/i.test(err) ? 'Only the organizer can see this report. Use the private link from the email you received when you created the poll.' : err}</p>
              <Link to="/office-party-music-poll" className="btn-gold">Create your own free poll</Link>
            </div>
          )}

          {r && (
            <>
              <header className="pr-head">
                <div className="pr-print-logo" aria-hidden="true"><img src="/favicon-192x192.png" width="40" height="40" alt="" /> DJ DX · Music Poll</div>
                <span className="pv-eyebrow">{r.open ? 'Voting open' : 'Voting closed'} · {r.admin ? 'Private report' : 'Shared results'}</span>
                <h1 className="pr-title">{title}</h1>
                <p className="pr-meta">
                  <strong>{r.total}</strong> vote{r.total === 1 ? '' : 's'}
                  {r.lastVoteAt ? <> · last vote {new Date(r.lastVoteAt * 1000).toLocaleString([], { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</> : null}
                  {r.open && r.closesAt ? <> · closes {new Date(r.closesAt * 1000).toLocaleDateString([], { month: 'short', day: 'numeric' })}</> : null}
                </p>
              </header>

              <div className="pr-profile-card">
                <span className="pr-profile-label">Crowd profile</span>
                <p className="pr-profile">{profile}</p>
              </div>

              {r.admin && (
                <div className="pr-book pr-noprint">
                  <div>
                    <strong>Want this crowd read turned into a real night?</strong>
                    <span>DJ DX gets the full report with your inquiry, 25+ years and 500+ events behind it.</span>
                  </div>
                  <div className="pr-book-btns">
                    <button type="button" className="btn-gold" onClick={openBooking}>Book DJ DX to play this crowd</button>
                    <Link className="pr-secondary" to="/event-dj-cost-nyc-nj-ct?event=corporate#quote-calculator" onClick={() => trackEvent('results_price_clicked', { poll_id: pollId })}>Get your starting price</Link>
                  </div>
                </div>
              )}

              <div className="pr-grid">
                <BarList caption="Genre ranking" items={r.genres} total={r.total} />
                <BarList caption="Eras they want to hear" items={r.eras} total={r.total} />
                <EnergyMeter avg={r.energyAvg} />
                {r.settings.allowSongs && <SongList caption="Most-requested songs" items={r.songs} empty="No song requests yet." />}
                {r.admin && r.settings.allowDnp && <SongList caption="Do-not-play list" items={r.doNotPlay} empty="Nothing on the do-not-play list yet." />}
              </div>

              <div className="pr-actions pr-noprint">
                <button type="button" onClick={copyLink}>{copied ? 'Voting link copied' : 'Copy voting link'}</button>
                <button type="button" onClick={() => window.print()}>Print / Save as PDF</button>
                {r.admin && (
                  <>
                    <button type="button" disabled={busy === 'public'} onClick={() => manage('public', !r.publicResults)}>
                      {r.publicResults ? 'Make results private' : 'Share read-only results with team'}
                    </button>
                    {r.open && <button type="button" className="pr-danger" disabled={busy === 'close'} onClick={() => manage('close')}>Close voting</button>}
                  </>
                )}
              </div>
              {r.admin && r.publicResults && (
                <p className="pr-public-note pr-noprint">Read-only results are on: anyone with <code>djdxmusic.com/poll/{r.id}/results</code> can see the tally (not the do-not-play list or your details).</p>
              )}
              <p className="pr-footer">Report generated by the free Office Party Music Poll from DJ DX · djdxmusic.com/office-party-music-poll</p>
            </>
          )}
        </div>
      </main>

      {r?.admin && (
        <dialog ref={dialogRef} className="pr-dialog" aria-labelledby="pr-dialog-title" onClick={e => { if (e.target === dialogRef.current) dialogRef.current?.close(); }}>
          <div className="pr-dialog-inner">
            <div className="pr-dialog-head">
              <h2 id="pr-dialog-title">Book DJ DX for this crowd</h2>
              <button type="button" className="pr-dialog-x" aria-label="Close" onClick={() => dialogRef.current?.close()}>×</button>
            </div>
            <p className="pr-dialog-sub">Your crowd report and Poll ID are already in the message.</p>
            <BookingForm
              formName="booking_from_poll"
              pollId={r.id}
              initial={{
                name: r.planner.name || '',
                email: r.planner.email || '',
                eventType: 'Corporate Event / Holiday Party',
                eventDate: r.planner.eventDate || '',
                message: bookingNote,
              }}
            />
          </div>
        </dialog>
      )}
    </>
  );
}
