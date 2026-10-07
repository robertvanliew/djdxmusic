import { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import SiteNav from '../components/SiteNav';
import SiteFooter from '../components/SiteFooter';

// Client confirmation page for a signed event link (scripts/attest-link.mjs).
// Unlisted and noindex. The server re-checks the signature in /api/attest.

interface Claim { event: string; venue: string; date: string; client: string }

function readClaim(): Claim | null {
  try {
    const t = new URLSearchParams(window.location.search).get('t') || '';
    const payload = t.split('.')[0];
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((payload.length + 3) % 4));
    const c = JSON.parse(decodeURIComponent(escape(json)));
    return c.event && c.venue && c.date ? c : null;
  } catch { return null; }
}

const prettyDate = (d: string) => new Date(`${d}T12:00:00`).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

export default function Confirm() {
  const claim = useMemo(() => (typeof window !== 'undefined' ? readClaim() : null), []);
  const [quote, setQuote] = useState('');
  const [showName, setShowName] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const [err, setErr] = useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('sending');
    try {
      const token = new URLSearchParams(window.location.search).get('t') || '';
      const r = await fetch('/api/attest', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token, quote, showName, displayName }) });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) { setErr(d.error || 'Something went wrong.'); setStatus('error'); return; }
      setStatus('done');
    } catch { setErr('Something went wrong. Please try again.'); setStatus('error'); }
  }

  return (
    <>
      <Helmet>
        <title>Confirm Your Event | DJ DX</title>
        <meta name="robots" content="noindex, nofollow" />
        <meta name="description" content="Confirm an event DJ DX played for you." />
        <link rel="canonical" href="https://djdxmusic.com/confirm" />
      </Helmet>
      <SiteNav />
      <main className="vn-main">
        <div className="vn-inner" style={{ maxWidth: 620 }}>
          <h1 className="sec-title vn-h1">Confirm your <span>event</span></h1>
          {!claim && <p className="vn-p">This page needs the personal link DJ DX sent you. If you have it, open it again from your email or text.</p>}
          {claim && status === 'done' && (
            <div className="bf-estimate" role="status">
              <span className="bf-estimate-label">Confirmed</span>
              <strong>Thank you.</strong>
              <span>Your confirmation is recorded and signed. It helps other people booking DJ DX know the event was real.</span>
            </div>
          )}
          {claim && status !== 'done' && (
            <form onSubmit={submit} className="booking-form" style={{ marginTop: 10 }}>
              <p className="vn-p vn-lead">
                Please confirm that DJ DX played your <strong>{claim.event}</strong> at <strong>{claim.venue}</strong> on <strong>{prettyDate(claim.date)}</strong>.
              </p>
              <div className="form-field">
                <label htmlFor="cf-quote">A sentence about the night <span className="bf-opt">optional</span></label>
                <textarea id="cf-quote" maxLength={400} value={quote} onChange={e => setQuote(e.target.value)} placeholder="How did the music go for your crowd?" />
              </div>
              <label className="opp-check" style={{ marginTop: 6 }}>
                <input type="checkbox" checked={showName} onChange={e => setShowName(e.target.checked)} />
                Show my name with this confirmation (otherwise it shows without a name)
              </label>
              {showName && (
                <div className="form-field">
                  <label htmlFor="cf-name">Name to show</label>
                  <input id="cf-name" maxLength={80} value={displayName} onChange={e => setDisplayName(e.target.value)} placeholder="e.g. Jane S., Acme Corp" />
                </div>
              )}
              {status === 'error' && <p className="mp-error" role="alert">{err}</p>}
              <button type="submit" className="btn-gold" disabled={status === 'sending'} style={{ marginTop: 12, width: '100%' }}>
                {status === 'sending' ? 'Confirming…' : 'Yes, confirm this event'}
              </button>
              <p className="vn-p" style={{ fontSize: '0.85rem', marginTop: 12 }}>Only the event type, venue, date, and anything you choose to add above are shown publicly.</p>
            </form>
          )}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
