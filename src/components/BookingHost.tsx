import { lazy, Suspense, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { trackEvent } from '../lib/analytics';

/* Site-wide "Check your date" launcher. Every link to #booking / /#booking
   (and anything with data-book, or a window "djdx:book" event) opens the
   booking dialog on the spot instead of scrolling away. Without JavaScript
   the links still jump to the page's booking form. The dialog itself is
   lazy-loaded on first open so it costs nothing on page load. */

const BookingDialog = lazy(() => import('./BookingDialog'));

export type BookOpts = { source?: string; eventType?: string };

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

  useEffect(() => {
    const show = (o: BookOpts) => {
      setOpts({ ...o, eventType: o.eventType ?? typeForPath(window.location.pathname) });
      setMounted(true);
      setOpen(true);
      trackEvent('booking_dialog_open', { source: o.source || 'unknown', path: window.location.pathname });
    };
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const el = (e.target as HTMLElement).closest<HTMLElement>('a[href], [data-book]');
      if (!el || el.closest('.bk-panel')) return;
      const href = el.getAttribute('href');
      if (!el.hasAttribute('data-book') && href !== '#booking' && href !== '/#booking') return;
      e.preventDefault();
      show({ source: (el.getAttribute('data-book') || el.textContent || '').trim().slice(0, 40) });
    };
    const onEvent = (e: Event) => show((e as CustomEvent<BookOpts>).detail || {});
    document.addEventListener('click', onClick);
    window.addEventListener('djdx:book', onEvent);
    return () => { document.removeEventListener('click', onClick); window.removeEventListener('djdx:book', onEvent); };
  }, []);

  // Hide the phone sticky bar while the dialog is open so it never covers the sheet.
  useEffect(() => { document.body.classList.toggle('bk-open', open); }, [open]);

  // Close on route change so the dialog never follows the visitor to a new page.
  useEffect(() => { setOpen(false); }, [pathname]);

  if (!mounted) return null;
  return (
    <Suspense fallback={null}>
      <BookingDialog open={open} onOpenChange={setOpen} initialType={opts.eventType} source={opts.source} />
    </Suspense>
  );
}
