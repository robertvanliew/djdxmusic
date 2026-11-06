import { useState, type FormEvent } from 'react';
import { trackEvent } from '../lib/analytics';

// The free "create a live run of show" form, used on /live-run-of-show and
// /song-request-qr-code. Creates the record and opens its edit link.

export default function ShowCreateForm({ idp = 'ls', cta = 'Create my run of show', source = 'live-run-of-show' }: { idp?: string; cta?: string; source?: string }) {
  const [f, setF] = useState({ title: '', date: '', email: '', name: '', website: '', dj: 'djdx', djName: '' });
  const [st, setSt] = useState<'idle' | 'sending' | 'error'>('idle');
  const [err, setErr] = useState('');
  const submit = async (e: FormEvent) => {
    e.preventDefault(); setSt('sending'); setErr('');
    try {
      const r = await fetch('/api/show', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'create', ...f }) });
      const d = await r.json();
      if (!r.ok) { setErr(d.error || 'Something went wrong.'); setSt('error'); return; }
      trackEvent('show_created', { source, dj: f.dj });
      window.location.href = d.editUrl.replace('https://djdxmusic.com', '');
    } catch { setErr('No connection. Try again.'); setSt('error'); }
  };
  return (
    <form className="booking-form ls-form" onSubmit={submit}>
      <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px' }}><label htmlFor={`${idp}-w`}>Leave blank</label><input id={`${idp}-w`} tabIndex={-1} autoComplete="off" value={f.website} onChange={e => setF({ ...f, website: e.target.value })} /></div>
      <div className="form-field"><label htmlFor={`${idp}-title`}>Event name</label><input id={`${idp}-title`} required maxLength={120} placeholder="Acme Holiday Party" value={f.title} onChange={e => setF({ ...f, title: e.target.value })} /></div>
      <div className="form-row">
        <div className="form-field"><label htmlFor={`${idp}-date`}>Event date</label><input id={`${idp}-date`} type="date" required value={f.date} onChange={e => setF({ ...f, date: e.target.value })} /></div>
        <div className="form-field"><label htmlFor={`${idp}-email`}>Your email</label><input id={`${idp}-email`} type="email" required autoComplete="email" placeholder="you@company.com" value={f.email} onChange={e => setF({ ...f, email: e.target.value })} /></div>
      </div>
      <div className="form-row">
        <div className="form-field"><label htmlFor={`${idp}-dj`}>Who is DJing?</label>
          <select id={`${idp}-dj`} value={f.dj} onChange={e => setF({ ...f, dj: e.target.value })}>
            <option value="djdx">DJ DX</option>
            <option value="other">Another DJ or band</option>
          </select>
        </div>
        {f.dj === 'other' && <div className="form-field"><label htmlFor={`${idp}-djname`}>Their name (optional)</label><input id={`${idp}-djname`} maxLength={80} placeholder="DJ or band name" value={f.djName} onChange={e => setF({ ...f, djName: e.target.value })} /></div>}
      </div>
      {err && <p className="form-error" role="alert">{err}</p>}
      <button type="submit" className="form-submit" disabled={st === 'sending'}>{st === 'sending' ? 'Creating…' : cta}</button>
    </form>
  );
}
