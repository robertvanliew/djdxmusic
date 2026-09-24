import { useEffect, useRef, useState } from 'react';
import { trackEvent } from '../lib/analytics';

// Replaces the "See instant pricing" text link that sat in the hero. Wedged
// against the top edge of the stats box it read as a stray label, and on
// mobile it was a fourth call-to-action stacked on one screen.
//
// Instead, a small card slides in ONCE per visit, at the moment it's useful:
// when the visitor scrolls past the hero (so they're engaged and the hero
// buttons are already off screen). It hides itself after a few seconds,
// never returns once dismissed, and never shows while the calculator itself
// is on screen. On phones it sits above the sticky "Check My Date" bar
// rather than covering it.

const SEEN_KEY = 'djdx_pricing_nudge_seen';
const VISIBLE_MS = 10000;

export default function PricingNudge({ heroId = 'hero', targetId = 'quote-calculator' }: { heroId?: string; targetId?: string }) {
  const [state, setState] = useState<'hidden' | 'in' | 'out'>('hidden');
  const hideTimer = useRef<number | undefined>(undefined);
  const calcOnScreen = useRef(false);

  const dismiss = (reason: string) => {
    window.clearTimeout(hideTimer.current);
    setState(s => (s === 'in' ? 'out' : s));
    if (reason !== 'auto') trackEvent('pricing_nudge', { action: reason });
  };

  useEffect(() => {
    let seen = false;
    try { seen = sessionStorage.getItem(SEEN_KEY) === '1'; } catch { /* storage blocked: just show it */ }
    if (seen) return;

    const hero = document.getElementById(heroId);
    const calc = document.getElementById(targetId);
    if (!hero || !calc) return;

    const calcObs = new IntersectionObserver(([e]) => {
      calcOnScreen.current = e.isIntersecting;
      if (e.isIntersecting) dismiss('auto'); // pointless once they can see the real thing
    }, { threshold: 0.15 });
    calcObs.observe(calc);

    let armed = false;
    const heroObs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { armed = true; return; } // must start on the hero, not deep-linked past it
      if (!armed || calcOnScreen.current) return;
      heroObs.disconnect();
      try { sessionStorage.setItem(SEEN_KEY, '1'); } catch { /* ignore */ }
      setState('in');
      trackEvent('pricing_nudge', { action: 'shown' });
      hideTimer.current = window.setTimeout(() => dismiss('auto'), VISIBLE_MS);
    }, { threshold: 0 });
    heroObs.observe(hero);

    return () => { heroObs.disconnect(); calcObs.disconnect(); window.clearTimeout(hideTimer.current); };
  }, [heroId, targetId]);

  const go = () => {
    dismiss('clicked');
    const el = document.getElementById(targetId);
    if (!el) return;
    const nav = document.querySelector('.nav') as HTMLElement | null;
    const top = el.getBoundingClientRect().top + window.scrollY - ((nav?.offsetHeight ?? 70) + 12);
    window.scrollTo({ top, behavior: 'smooth' });
  };

  if (state === 'hidden') return null;

  return (
    <div
      className={`pnudge pnudge--${state}`}
      role="complementary"
      aria-label="Instant pricing"
      onAnimationEnd={e => { if (e.target === e.currentTarget && state === 'out') setState('hidden'); }}
    >
      <button type="button" className="pnudge-body" onClick={go}>
        <span className="pnudge-eyebrow">Instant estimate</span>
        <span className="pnudge-text">Price your event in 30 seconds</span>
        <span className="pnudge-arrow" aria-hidden="true">→</span>
      </button>
      <button type="button" className="pnudge-close" aria-label="Dismiss" onClick={() => dismiss('dismissed')}>×</button>
      <span className="pnudge-timer" aria-hidden="true" style={{ animationDuration: `${VISIBLE_MS}ms` }} />
    </div>
  );
}
