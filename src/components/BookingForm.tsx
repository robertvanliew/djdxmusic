import { useRef, useState, type FormEvent } from 'react';
import { trackLead, trackFormSubmit, trackFormError } from '../lib/analytics';
import AddressAutocomplete from './AddressAutocomplete';

const Send = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

export default function BookingForm() {
  const [fields, setFields] = useState({ name: '', email: '', phone: '', eventType: '', eventDate: '', eventStartTime: '', eventEndTime: '', location: '', locationCity: '', locationState: '', locationCountry: '', message: '', company: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const mountedAt = useRef(Date.now());

  const set = (k: string, v: string) => setFields(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('sending');
    trackFormSubmit('booking_widget');
    const metaEventId = crypto.randomUUID();
    try {
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...fields,
          honeypot: fields.company,
          elapsedMs: Date.now() - mountedAt.current,
          metaEventId,
          pageUrl: window.location.href,
        }),
      });
      if (!res.ok) throw new Error(`http_${res.status}`);
      trackLead({ form: 'booking_widget', event_type: fields.eventType }, metaEventId);
      setStatus('sent');
      setFields({ name: '', email: '', phone: '', eventType: '', eventDate: '', eventStartTime: '', eventEndTime: '', location: '', locationCity: '', locationState: '', locationCountry: '', message: '', company: '' });
      mountedAt.current = Date.now();
    } catch (err) {
      trackFormError('booking_widget', err instanceof Error ? err.message : 'network_error');
      setStatus('error');
    }
  };

  if (status === 'sent') return (
    <div className="booking-success">
      <div className="booking-success-icon">✓</div>
      <h3>Inquiry sent!</h3>
      <p>You'll get a straight yes or no on your date within 24 hours. Check your inbox for a confirmation.</p>
    </div>
  );

  return (
    <form className="booking-form" onSubmit={handleSubmit}>
      {/* Honeypot — hidden from real visitors, bots fill it blindly.
          Deliberately NOT named/labeled "Company"/"Organization" — that
          matches a common saved browser autofill profile field, which was
          silently autofilling this and causing real (often corporate)
          submitters to get dropped as false-positive spam. */}
      <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', overflow: 'hidden' }}>
        <label htmlFor="bf-hp">Leave this field blank</label>
        <input id="bf-hp" name="bf-hp" type="text" tabIndex={-1} autoComplete="off" value={fields.company} onChange={e => set('company', e.target.value)} />
      </div>

      <div className="form-row">
        <div className="form-field">
          <label htmlFor="bf-name">Full Name</label>
          <input id="bf-name" type="text" placeholder="Jane Smith" required value={fields.name} onChange={e => set('name', e.target.value)} />
        </div>
        <div className="form-field">
          <label htmlFor="bf-email">Email Address</label>
          <input id="bf-email" type="email" placeholder="jane@example.com" required value={fields.email} onChange={e => set('email', e.target.value)} />
        </div>
      </div>
      <div className="form-row">
        <div className="form-field">
          <label htmlFor="bf-phone">Phone <span className="bf-opt">optional, fastest reply</span></label>
          <input id="bf-phone" type="tel" placeholder="+1 (555) 000-0000" autoComplete="tel" value={fields.phone} onChange={e => set('phone', e.target.value)} />
        </div>
        <div className="form-field">
          <label htmlFor="bf-event-date">Event Date</label>
          <input id="bf-event-date" type="date" required value={fields.eventDate} onChange={e => set('eventDate', e.target.value)} />
        </div>
      </div>
      <div className="form-row">
        <div className="form-field">
          <label htmlFor="bf-event-type">Event Type</label>
          <select id="bf-event-type" required value={fields.eventType} onChange={e => set('eventType', e.target.value)}>
            <option value="" disabled>Select type…</option>
            <option>Wedding</option>
            <option>Corporate Event / Holiday Party</option>
            <option>Private Party / Birthday</option>
            <option>Sweet 16 / Quinceañera / Mitzvah</option>
            <option>DJ + Live Violin (Soul Shades)</option>
            <option>Club / Venue Night</option>
            <option>Other</option>
          </select>
        </div>
        <AddressAutocomplete
          id="bf-location"
          label="Event Location (optional)"
          placeholder="Venue name, city, state"
          maxLength={200}
          value={fields.location}
          onChange={v => set('location', v)}
          onSelect={d => setFields(f => ({ ...f, locationCity: d.city, locationState: d.state, locationCountry: d.country }))}
        />
      </div>
      <details className="bf-more">
        <summary>Add times and details <span className="bf-opt">optional</span></summary>
        <div className="form-row">
          <div className="form-field">
            <label htmlFor="bf-event-start-time">Start Time</label>
            <input id="bf-event-start-time" type="time" value={fields.eventStartTime} onChange={e => set('eventStartTime', e.target.value)} />
          </div>
          <div className="form-field">
            <label htmlFor="bf-event-end-time">End Time</label>
            <input id="bf-event-end-time" type="time" value={fields.eventEndTime} onChange={e => set('eventEndTime', e.target.value)} />
          </div>
        </div>
        <div className="form-field">
          <label htmlFor="bf-message">Tell me about your event</label>
          <textarea id="bf-message" placeholder="Guest count, the vibe you're going for, must-plays, anything to avoid…" value={fields.message} onChange={e => set('message', e.target.value)} />
        </div>
      </details>

      {/* The five things people are actually afraid of when hiring a DJ,
          answered at the moment they decide. Every line is backed by the
          published rate card (public/pricing.txt) - nothing here promises a
          contingency or policy DJ DX hasn't committed to. */}
      <ul className="bf-promises">
        <li><strong>The DJ you book is the DJ who plays.</strong> One person, not an agency. If an emergency ever strikes, a DJ he personally vetted covers your night.</li>
        <li><strong>A real answer within 24 hours.</strong> A straight yes or no on your date.</li>
        <li><strong>Your music, your rules.</strong> Must-play and do-not-play lists built with you on the planning call.</li>
        <li><strong>No surprise pricing.</strong> Published starting rates; travel quoted upfront as its own line.</li>
        <li><strong>25+ years on the mic.</strong> Names and the run of show gone over with you before the night.</li>
        <li><strong>Everything in writing.</strong> A written contract on every booking; 50% deposit holds your date.</li>
      </ul>
      <a href="/booking-policy" className="bf-policy-link" target="_blank" rel="noopener">Read the full booking policy</a>
      {status === 'error' && <p className="form-error">Something went wrong. Please try again or email bookings@djdxmusic.com directly.</p>}
      <button type="submit" className="form-submit" disabled={status === 'sending'}>
        {status === 'sending' ? 'Sending…' : <><span>Send Inquiry</span> <Send /></>}
      </button>
      <p style={{ fontSize: '12px', color: 'rgba(242,242,242,0.45)', marginTop: '12px', textAlign: 'center' }}>
        Trouble with the form? Email <a href="mailto:bookings@djdxmusic.com" style={{ color: 'var(--gold)' }}>bookings@djdxmusic.com</a> directly.
      </p>
    </form>
  );
}
