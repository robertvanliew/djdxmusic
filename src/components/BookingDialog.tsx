import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Heart, Briefcase, PartyPopper, Sparkles, Music, MessageCircle, ChevronLeft, ChevronRight, X, Check } from 'lucide-react';
import { BOOKED_DATES } from '../data/availability';
import { useHolds, isoDate } from '../lib/nights';
import { STARTING_PRICES, FORM_TYPE_TO_PRICE } from '../lib/pricing';
import { submitQuickInquiry } from '../lib/quickInquiry';
import { trackEvent } from '../lib/analytics';
import { textHref, trackTextClick, TEXT_NUMBER_DISPLAY } from '../lib/textLink';

/* "Check your date" dialog: three short steps that each give something back.
   1. Event type: six big tiles, one tap advances.
   2. Date: a live calendar showing booked and held nights. Picking a day
      answers instantly ("open to requests" / "on hold" / "booked") with the
      starting price for that event.
   3. Contact: name + phone or email. Email places a free 72-hour hold.
   Posts the same quick inquiry as the sticky-bar form (lib/quickInquiry).
   Centered card on desktop, bottom sheet on phones. State survives closing,
   so reopening picks up where the visitor left off. */

const TYPES = [
  { value: 'Wedding', label: 'Wedding', icon: Heart },
  { value: 'Corporate Event / Holiday Party', label: 'Corporate & Holiday', icon: Briefcase },
  { value: 'Private Party / Birthday', label: 'Birthday & Private', icon: PartyPopper },
  { value: 'Sweet 16 / Quinceañera / Mitzvah', label: 'Sweet 16 & Prom', icon: Sparkles },
  { value: 'DJ + Live Violin (Soul Shades)', label: 'DJ + Live Violin', icon: Music },
  { value: 'Other', label: 'Something else', icon: MessageCircle },
];
const PRICE_LINE: Record<string, string> = {
  wedding: 'Weddings start at $2,800 for up to 5 hours.',
  corporate: 'Corporate events start at $2,800 for up to 5 hours.',
  private: 'Private parties start at $2,800 for up to 5 hours.',
  sweet16: 'Sweet 16s and teen events start at $1,500.',
  duo: 'DJ with live violin starts at $3,500.',
};
const UNDECIDED = 'Date not decided';
const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

type Status = 'open' | 'held' | 'booked';

function Calendar({ value, onPick, held }: { value: string; onPick: (iso: string) => void; held: Record<string, number> }) {
  const today = useMemo(() => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; }, []);
  const [view, setView] = useState(() => {
    const d = value && value !== UNDECIDED ? new Date(`${value}T12:00:00`) : today;
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const min = new Date(today.getFullYear(), today.getMonth(), 1);
  const max = new Date(today.getFullYear() + 2, today.getMonth(), 1);
  const days = useMemo(() => {
    const first = new Date(view.getFullYear(), view.getMonth(), 1);
    const n = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
    const cells: (Date | null)[] = Array.from({ length: first.getDay() }, () => null);
    for (let i = 1; i <= n; i++) cells.push(new Date(view.getFullYear(), view.getMonth(), i));
    return cells;
  }, [view]);
  const shift = (d: number) => setView(v => new Date(v.getFullYear(), v.getMonth() + d, 1));
  const label = view.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="bk-cal">
      <div className="bk-cal-head">
        <button type="button" className="bk-icon-btn" onClick={() => shift(-1)} disabled={view <= min} aria-label="Previous month"><ChevronLeft size={18} /></button>
        <span className="bk-cal-month" aria-live="polite">{label}</span>
        <button type="button" className="bk-icon-btn" onClick={() => shift(1)} disabled={view >= max} aria-label="Next month"><ChevronRight size={18} /></button>
      </div>
      <div className="bk-cal-grid" role="grid" aria-label={label}>
        {WEEKDAYS.map((w, i) => <span key={i} className="bk-cal-dow" aria-hidden="true">{w}</span>)}
        {days.map((d, i) => {
          if (!d) return <span key={`e${i}`} />;
          const iso = isoDate(d);
          const past = d < today;
          const st: Status = BOOKED_DATES.includes(iso) ? 'booked' : held[iso] ? 'held' : 'open';
          const weekend = d.getDay() === 5 || d.getDay() === 6;
          return (
            <button
              key={iso}
              type="button"
              disabled={past}
              onClick={() => onPick(iso)}
              className={`bk-day bk-day--${st}${weekend ? ' is-weekend' : ''}${value === iso ? ' is-picked' : ''}`}
              aria-pressed={value === iso}
              aria-label={`${d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}${st === 'booked' ? ', booked' : st === 'held' ? ', on hold' : ''}`}
            >
              {d.getDate()}
            </button>
          );
        })}
      </div>
      <div className="bk-legend" aria-hidden="true">
        <span><i className="bk-dot bk-dot--open" />Open to requests</span>
        <span><i className="bk-dot bk-dot--held" />On hold</span>
        <span><i className="bk-dot bk-dot--booked" />Booked</span>
      </div>
    </div>
  );
}

export default function BookingDialog({ open, onOpenChange, initialType, source }: { open: boolean; onOpenChange: (o: boolean) => void; initialType?: string; source?: string }) {
  const held = useHolds();
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState<1 | -1>(1);
  const [type, setType] = useState('');
  const [date, setDate] = useState('');
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [hp, setHp] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'error'>('idle');
  const [heldUntil, setHeldUntil] = useState<number | null>(null);
  const startedAt = useRef(Date.now());
  const nameRef = useRef<HTMLInputElement>(null);

  // On each open: if the page implies an event type and none is chosen yet, skip straight to the calendar.
  useEffect(() => {
    if (!open) return;
    startedAt.current = Date.now();
    if (step === 3) { setStep(0); setType(''); setDate(''); setName(''); setContact(''); setHeldUntil(null); }
    if (!type && initialType && step === 0) { setType(initialType); setDir(1); setStep(1); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const go = (s: number) => {
    setDir(s > step ? 1 : -1);
    setStep(s);
    trackEvent('booking_dialog_step', { step: s, source: source || 'unknown' });
  };
  useEffect(() => { if (step === 2) setTimeout(() => nameRef.current?.focus(), 260); }, [step]);

  const status_: Status | null = date && date !== UNDECIDED ? (BOOKED_DATES.includes(date) ? 'booked' : held[date] ? 'held' : 'open') : null;
  const priceKey = FORM_TYPE_TO_PRICE[type];
  const priceLine = priceKey ? PRICE_LINE[priceKey] ?? `From $${STARTING_PRICES[priceKey].toLocaleString()}.` : '';
  const dateLabel = date && date !== UNDECIDED ? new Date(`${date}T12:00:00`).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }) : '';
  const typeLabel = TYPES.find(t => t.value === type)?.label ?? type;
  const isEmail = contact.includes('@');

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (status === 'sending') return;
    setStatus('sending');
    try {
      const r = await submitQuickInquiry(
        { name, contact, eventType: type, eventDate: date || UNDECIDED, company: hp },
        'booking_dialog',
        startedAt.current,
        { hold: isEmail && !!status_ && status_ === 'open', source: source || 'dialog' },
      );
      setHeldUntil(r.heldUntil);
      setStatus('idle');
      go(3);
    } catch {
      setStatus('error');
    }
  };

  const titles = ['What are you planning?', 'When is it?', 'Where should DJ DX reply?', ''];

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="bk-overlay" />
        <Dialog.Content className="bk-panel" aria-describedby={undefined}>
          <div className="bk-grab" aria-hidden="true" />
          <header className="bk-head">
            {step > 0 && step < 3
              ? <button type="button" className="bk-icon-btn" onClick={() => go(step - 1)} aria-label="Back"><ChevronLeft size={18} /></button>
              : <span className="bk-head-spacer" />}
            {step < 3 && (
              <ol className="bk-progress" aria-label={`Step ${step + 1} of 3`}>
                {[0, 1, 2].map(i => <li key={i} className={i <= step ? 'is-done' : ''} />)}
              </ol>
            )}
            <Dialog.Close className="bk-icon-btn" aria-label="Close"><X size={18} /></Dialog.Close>
          </header>

          <div className={`bk-step bk-step--${dir > 0 ? 'fwd' : 'back'}`} key={step}>
            {step < 3 && <Dialog.Title className="bk-title">{titles[step]}</Dialog.Title>}

            {step === 0 && (
              <>
                <p className="bk-sub">Pick one. It takes about 30 seconds, and you hear back within 24 hours.</p>
                <div className="bk-types">
                  {TYPES.map(t => (
                    <button key={t.value} type="button" className={`bk-type${type === t.value ? ' is-picked' : ''}`} onClick={() => { setType(t.value); go(1); }}>
                      <span className="bk-type-icon"><t.icon size={22} strokeWidth={1.6} /></span>
                      <span>{t.label}</span>
                    </button>
                  ))}
                </div>
              </>
            )}

            {step === 1 && (
              <>
                <p className="bk-sub">Tap a date to see if it&apos;s open. Friday and Saturday nights go first.</p>
                <Calendar value={date} onPick={iso => { setDate(iso); trackEvent('booking_dialog_date', { status: BOOKED_DATES.includes(iso) ? 'booked' : held[iso] ? 'held' : 'open' }); }} held={held} />
                {status_ && (
                  <div className={`bk-answer bk-answer--${status_}`} role="status" key={date}>
                    <strong>{dateLabel}</strong>
                    <span>
                      {status_ === 'open' && <>is open to requests. Hold it free for 72 hours while your quote is prepared.</>}
                      {status_ === 'held' && <>is on hold for another client. Ask to be next in line if it opens up.</>}
                      {status_ === 'booked' && <>is booked. Pick another date, or ask about a referral.</>}
                    </span>
                    {priceLine && <em>{priceLine}</em>}
                  </div>
                )}
                <div className="bk-actions">
                  <button type="button" className="bk-link" onClick={() => { setDate(UNDECIDED); go(2); }}>Not sure yet</button>
                  <button type="button" className="bk-primary" disabled={!date || date === UNDECIDED} onClick={() => go(2)}>
                    {status_ === 'open' ? 'Hold this date' : status_ === 'held' ? 'Get on the waitlist' : 'Continue'}
                  </button>
                </div>
              </>
            )}

            {step === 2 && (
              <form onSubmit={submit} className="bk-form">
                <div className="bk-chips">
                  <button type="button" className="bk-chip" onClick={() => go(0)}>{typeLabel}</button>
                  <button type="button" className="bk-chip" onClick={() => go(1)}>{dateLabel || 'Date to be decided'}</button>
                </div>
                <div aria-hidden="true" className="bk-hp">
                  <label htmlFor="bk-hp">Leave this field blank</label>
                  <input id="bk-hp" tabIndex={-1} autoComplete="off" value={hp} onChange={e => setHp(e.target.value)} />
                </div>
                <label className="bk-field">
                  <span>Your name</span>
                  <input ref={nameRef} required autoComplete="name" value={name} onChange={e => setName(e.target.value)} placeholder="Jane Smith" />
                </label>
                <label className="bk-field">
                  <span>Phone or email</span>
                  <input required autoComplete="email" inputMode="text" value={contact} onChange={e => setContact(e.target.value)} placeholder="(555) 000-0000 or jane@example.com" />
                  <small>{isEmail && status_ === 'open' ? 'Using email holds your date free for 72 hours.' : 'Email holds an open date free for 72 hours. A phone number gets a text back.'}</small>
                </label>
                {status === 'error' && <p className="bk-error" role="alert">That didn&apos;t send. Try again, or text {TEXT_NUMBER_DISPLAY}.</p>}
                <button type="submit" className="bk-primary bk-primary--full" disabled={status === 'sending'}>
                  {status === 'sending' ? 'Sending…' : 'Check My Date'}
                </button>
                <p className="bk-alt">Rather text? <a href={textHref()} onClick={() => trackTextClick('booking_dialog')}>Text {TEXT_NUMBER_DISPLAY}</a></p>
              </form>
            )}

            {step === 3 && (
              <div className="bk-done">
                <span className="bk-done-icon"><Check size={30} strokeWidth={2.4} /></span>
                <Dialog.Title className="bk-title">{heldUntil ? 'Your date is on hold' : 'Got it, thank you'}</Dialog.Title>
                <p className="bk-sub">
                  {heldUntil
                    ? <>Held for you, free, until <strong>{new Date(heldUntil).toLocaleString('en-US', { weekday: 'long', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</strong>. DJ DX will send your quote within 24 hours.</>
                    : <>DJ DX will reply within 24 hours{isEmail ? ' by email' : ' by text or call'}.</>}
                </p>
                <div className="bk-actions bk-actions--center">
                  <a className="bk-link" href="/work">See recent events</a>
                  <Dialog.Close className="bk-primary">Done</Dialog.Close>
                </div>
              </div>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
