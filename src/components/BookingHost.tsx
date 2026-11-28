import { lazy, Suspense, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { trackEvent } from '../lib/analytics';

/* Site-wide "Check your date" launcher. Every link to #booking / /#booking
   (and anything with data-book, or a window "djdx:book" event) opens the
   booking dialog on the spot instead of scrolling away. Without JavaScript
   the links still jump to the page's booking form. The dialog itself is
   lazy-loaded on first open so it costs nothing on page load. */

const BookingDialog = lazy(() => import('./BookingDialog'));
const MessageDialog = lazy(() => import('./MessageDialog'));
type Topic = 'other' | 'press' | 'support';

export type BookOpts = { source?: string; eventType?: string; date?: string };

// Pre-select the event type from the page the visitor is on.
export function typeForPath(path: string): string | undefined {
  if (/wedding|violin|piano|destination|hamptons/.test(path)) return /violin/.test(path) ? 'DJ + Live Violin (Soul Shades)' : 'Wedding';
  if (/corporate|holiday|law-firm|store-opening|office-party/.test(path)) return 'Corporate Event / Holiday Party';
  if (/sweet-16|prom/.test(path)) return 'Sweet 16 / Quinceañera / Mitzvah';
  if (/birthday|private-party|dj-for-hire|rooftop|throwback|new-years/.test(path)) return 'Private Party / Birthday';
  return undefined;
}

export function openBooking(opts: BookOpts = {}) {
  window.dispatchEvent(new CustomEvent<BookOpts>('djdx:book', { detail: opts }));
}

export default function BookingHost() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [opts, setOpts] = useState<BookOpts>({});
  // On-screen email form for mailto:bookings@ links.
  const [msgOpen, setMsgOpen] = useState(false);
  const [msgMounted, setMsgMounted] = useState(false);
  const [msgTopic, setMsgTopic] = useState<Topic>('other');

  useEffect(() => {
    // Keep the visitor exactly where they are. The site uses smooth scrolling,
    // and locking the page for a dialog changes its width (no scrollbar),
    // which near the bottom of a page made the browser drift. Turn smooth
    // scrolling off while open and pin the position long enough to cover the
    // first open, when the dialog code is still downloading.
    const pinScroll = () => {
      const y = window.scrollY;
      document.documentElement.style.scrollBehavior = 'auto';
      const until = performance.now() + 1200;
      const pin = () => {
        if (Math.abs(window.scrollY - y) > 1) window.scrollTo(0, y);
        if (performance.now() < until) requestAnimationFrame(pin);
      };
      requestAnimationFrame(pin);
    };
    const show = (o: BookOpts) => {
      pinScroll();
      setOpts({ ...o, eventType: o.eventType ?? typeForPath(window.location.pathname) });
      setMounted(true);
      setOpen(true);
      trackEvent('booking_dialog_open', { source: o.source || 'unknown', path: window.location.pathname });
    };
    // Capture phase, so it runs before any in-page scroll handlers on the same link.
    const onClick = (e: MouseEvent) => {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const el = (e.target as HTMLElement).closest<HTMLElement>('a[href], [data-book]');
      if (!el || el.closest('.bk-panel')) return;
      const href = el.getAttribute('href') || '';
      // mailto:bookings@ opens the on-screen message form (keep the real link inside the form itself).
      if (/^mailto:bookings@djdxmusic\.com/i.test(href) && !el.hasAttribute('data-native-mail')) {
        e.preventDefault();
        pinScroll();
        const subj = decodeURIComponent((/[?&]subject=([^&]*)/i.exec(href) || [])[1] || '').toLowerCase();
        setMsgTopic(/press|photo|epk|media/.test(subj) ? 'press' : 'other');
        setMsgMounted(true);
        setMsgOpen(true);
        trackEvent('message_dialog_open', { path: window.location.pathname });
        return;
      }
      const dateLink = /^\/open-dates\?date=(\d{4}-\d{2}-\d{2})/.exec(href);
      const isLead = el.hasAttribute('data-book') || href === '#booking' || href === '/#booking' || href === '/contact' || !!dateLink;
      if (!isLead) return;
      e.preventDefault();
      show({
        source: (el.getAttribute('data-book') || el.getAttribute('aria-label') || el.textContent || '').trim().slice(0, 40),
        date: dateLink?.[1] ?? el.getAttribute('data-book-date') ?? undefined,
      });
      // Let in-page handlers (menu drawers, analytics) still run, but never the old scroll-to-form.
    };
    const onEvent = (e: Event) => show((e as CustomEvent<BookOpts>).detail || {});
    document.addEventListener('click', onClick, true);
    window.addEventListener('djdx:book', onEvent);
    return () => { document.removeEventListener('click', onClick, true); window.removeEventListener('djdx:book', onEvent); };
  }, []);

  // Hide the phone sticky bar while the dialog is open so it never covers the sheet.
  useEffect(() => {
    const anyOpen = open || msgOpen;
    document.body.classList.toggle('bk-open', anyOpen);
    // Restore the site's smooth scrolling once the dialogs have closed and the page settled.
    if (!anyOpen) { const t = setTimeout(() => { document.documentElement.style.scrollBehavior = ''; }, 400); return () => clearTimeout(t); }
  }, [open, msgOpen]);

  // Close on route change so the dialog never follows the visitor to a new page.
  useEffect(() => { setOpen(false); setMsgOpen(false); }, [pathname]);

  if (!mounted && !msgMounted) return null;
  return (
    <Suspense fallback={null}>
      {msgMounted && <MessageDialog open={msgOpen} onOpenChange={setMsgOpen} initialTopic={msgTopic} onBook={() => { setMsgOpen(false); setTimeout(() => openBooking({ source: 'message_dialog' }), 180); }} />}
      {mounted && <BookingDialog open={open} onOpenChange={setOpen} initialType={opts.eventType} initialDate={opts.date} source={opts.source} />}
    </Suspense>
  );
}
