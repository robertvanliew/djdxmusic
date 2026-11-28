import { useEffect, useRef, useState, type FormEvent } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X, Check, MessageCircle, Newspaper, ShoppingBag } from 'lucide-react';
import { trackFormSubmit, trackLead, trackFormError, trackEvent } from '../lib/analytics';

/* "Message DJ DX": an on-screen email form that replaces mailto: links.
   Posts to /api/contact (Resend), which routes the topic to the right inbox
   and sends the visitor a confirmation. Same look as the booking dialog
   (bk-* styles). Opened by BookingHost for any mailto:bookings@ link.
   The draft survives closing, so reopening picks up where they left off. */

export type MessageTopic = 'other' | 'press' | 'support';
const TOPICS: { value: MessageTopic; label: string; icon: typeof MessageCircle }[] = [
  { value: 'other', label: 'General question', icon: MessageCircle },
  { value: 'press', label: 'Press & media', icon: Newspaper },
  { value: 'support', label: 'Music store order', icon: ShoppingBag },
];
const MAX = 1000;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function MessageDialog({ open, onOpenChange, initialTopic, onBook }: { open: boolean; onOpenChange: (o: boolean) => void; initialTopic?: MessageTopic; onBook: () => void }) {
  const [topic, setTopic] = useState<MessageTopic>(initialTopic ?? 'other');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [hp, setHp] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [error, setError] = useState('');
  const [emailTouched, setEmailTouched] = useState(false);
  const [copied, setCopied] = useState(false);
  const startedAt = useRef(Date.now());

  useEffect(() => {
    if (!open) return;
    startedAt.current = Date.now();
    if (initialTopic) setTopic(initialTopic);
    if (status === 'sent') { setStatus('idle'); setMessage(''); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);
  useEffect(() => { if (!copied) return; const t = setTimeout(() => setCopied(false), 1600); return () => clearTimeout(t); }, [copied]);

  const emailBad = emailTouched && email.length > 0 && !EMAIL_RE.test(email);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (status === 'sending') return;
    if (!EMAIL_RE.test(email)) { setEmailTouched(true); return; }
    setStatus('sending');
    setError('');
    trackFormSubmit('message_dialog');
    const metaEventId = crypto.randomUUID();
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, subject: topic, message, honeypot: hp, elapsedMs: Date.now() - startedAt.current, metaEventId }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error((data as { error?: string }).error || 'Failed to send');
      }
      trackLead({ form: 'message_dialog', subject: topic }, metaEventId);
      setStatus('sent');
    } catch (err) {
      const reason = err instanceof Error ? err.message : 'network_error';
      trackFormError('message_dialog', reason);
      setError(reason === 'Invalid email address' ? 'That email address doesn’t look right.' : 'That didn’t send. Try again in a moment.');
      setStatus('error');
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="bk-overlay" />
        <Dialog.Content className="bk-panel" aria-describedby={undefined}>
          <div className="bk-grab" aria-hidden="true" />
          <header className="bk-head">
            <span className="bk-head-spacer" />
            <Dialog.Close className="bk-icon-btn" aria-label="Close"><X size={18} /></Dialog.Close>
          </header>

          {status === 'sent' ? (
            <div className="bk-done bk-step--fwd">
              <span className="bk-done-icon"><Check size={30} strokeWidth={2.4} /></span>
              <Dialog.Title className="bk-title">Message sent</Dialog.Title>
              <p className="bk-sub">Thanks, {name.split(' ')[0] || 'friend'}. DJ DX will reply to <strong>{email}</strong> within 24 hours. A copy is on its way to your inbox.</p>
              <div className="bk-actions bk-actions--center">
                <Dialog.Close className="bk-primary">Done</Dialog.Close>
              </div>
            </div>
          ) : (
            <form className="bk-step--fwd msg-form" onSubmit={submit} noValidate>
              <Dialog.Title className="bk-title">Message DJ DX</Dialog.Title>
              <p className="bk-sub">Goes straight to DJ DX&apos;s inbox. Replies within 24 hours.</p>

              <div className="msg-topics" role="radiogroup" aria-label="Topic">
                {TOPICS.map(t => (
                  <button key={t.value} type="button" role="radio" aria-checked={topic === t.value} className={`msg-topic${topic === t.value ? ' is-picked' : ''}`} onClick={() => setTopic(t.value)}>
                    <t.icon size={16} strokeWidth={1.8} aria-hidden="true" />{t.label}
                  </button>
                ))}
              </div>
              <button type="button" className="msg-book" onClick={() => { trackEvent('message_to_booking', {}); onBook(); }}>
                Planning an event? <span>Check your date instead &rarr;</span>
              </button>

              <div aria-hidden="true" className="bk-hp">
                <label htmlFor="msg-hp">Leave this field blank</label>
                <input id="msg-hp" tabIndex={-1} autoComplete="off" value={hp} onChange={e => setHp(e.target.value)} />
              </div>
              <div className="msg-row">
                <label className="bk-field">
                  <span>Your name</span>
                  <input required autoComplete="name" value={name} onChange={e => setName(e.target.value)} placeholder="Jane Smith" />
                </label>
                <label className="bk-field">
                  <span>Email</span>
                  <input required type="email" autoComplete="email" inputMode="email" value={email} onChange={e => setEmail(e.target.value)} onBlur={() => setEmailTouched(true)} placeholder="jane@example.com" aria-invalid={emailBad || undefined} />
                  {emailBad && <small className="msg-err">Check the email address so DJ DX can reply.</small>}
                </label>
              </div>
              <label className="bk-field">
                <span>Phone <em className="msg-opt">optional</em></span>
                <input type="tel" autoComplete="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="(555) 000-0000" />
              </label>
              <label className="bk-field">
                <span>Message</span>
                <textarea required maxLength={MAX} rows={5} value={message} onChange={e => setMessage(e.target.value)} placeholder="What can DJ DX help with?" />
                <small className="msg-count" aria-live="polite">{message.length} / {MAX}</small>
              </label>

              {status === 'error' && <p className="bk-error" role="alert">{error}</p>}
              <button type="submit" className="bk-primary bk-primary--full" disabled={status === 'sending' || !name.trim() || !message.trim() || !email}>
                {status === 'sending' ? 'Sending…' : 'Send Message'}
              </button>
              <p className="bk-alt">
                Prefer your own email app? <a href="mailto:bookings@djdxmusic.com" data-native-mail>bookings@djdxmusic.com</a>
                <button type="button" className="msg-copy" onClick={() => { navigator.clipboard?.writeText('bookings@djdxmusic.com').then(() => setCopied(true)).catch(() => {}); }}>{copied ? 'Copied' : 'Copy'}</button>
              </p>
            </form>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
