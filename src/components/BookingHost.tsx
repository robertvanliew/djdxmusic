import { lazy, Suspense, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { trackEvent } from '../lib/analytics';

/* Site-wide "Check your date" launcher. Every link to #booking / /#booking
   (and anything with data-book, or a window "djdx:book" event) opens the
   booking dialog on the spot instead of scrolling away. Without JavaScript
   the links still jump to the page's booking form. The dialog itself is
   lazy-loaded on first open so it costs nothing on page load. */

const BookingDialog = lazy(() => import('./BookingDialog'));

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

  useEffect(() => {
    const show = (o: BookOpts) => {
      // Keep the visitor exactly where they are. The site uses smooth scrolling,
      // and locking the page for the dialog changes its width (no scrollbar),
      // which near the bottom of a page made the browser drift. Turn smooth
      // scrolling off while open and pin the position for a few frames.
      const y = window.scrollY;
      document.documentElement.style.scrollBehavior = 'auto';
      // Pin long enough to cover the first open, when the dialog code is still downloading.
      const until = performance.now() + 1200;
      const pin = () => {
        if (Math.abs(window.scrollY - y) > 1) window.scrollTo(0, y);
        if (performance.now() < until) requestAnimationFrame(pin);
      };
      requestAnimationFrame(pin);
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
    document.body.classList.toggle('bk-open', open);
    // Restore the site's smooth scrolling once the dialog has closed and the page settled.
    if (!open) { const t = setTimeout(() => { document.documentElement.style.scrollBehavior = ''; }, 400); return () => clearTimeout(t); }
  }, [open]);

  // Close on route change so the dialog never follows the visitor to a new page.
  useEffect(() => { setOpen(false); }, [pathname]);

  if (!mounted) return null;
  return (
    <Suspense fallback={null}>
      <BookingDialog open={open} onOpenChange={setOpen} initialType={opts.eventType} initialDate={opts.date} source={opts.source} />
    </Suspense>
  );
}
