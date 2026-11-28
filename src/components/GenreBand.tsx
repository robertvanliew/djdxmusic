import { createElement, useEffect, useRef, type ComponentType } from 'react';
import { Link } from 'react-router-dom';

/* Homepage "Genres & Services" as one band that glides across the screen.
   A native horizontal scroller (so it swipes, drags and wheel-scrolls) that
   auto-advances with requestAnimationFrame and loops seamlessly by rendering
   the list twice. It pauses on hover, keyboard focus, touch, while off
   screen and while the tab is hidden, resumes a moment after the visitor
   lets go, and stays still for prefers-reduced-motion. No animation library,
   so the homepage bundle does not grow. */

export type GenreItem = { name: string; desc: string; icon: ComponentType<{ size?: number; strokeWidth?: number }>; href?: string };

const SPEED = 38; // px per second
const RESUME_MS = 2600;

const Arrow = ({ dir }: { dir: 'left' | 'right' }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {dir === 'left' ? <polyline points="15 18 9 12 15 6" /> : <polyline points="9 18 15 12 9 6" />}
  </svg>
);

function Slide({ g, hidden }: { g: GenreItem; hidden?: boolean }) {
  const body = (
    <>
      <span className="gb-icon">{createElement(g.icon, { size: 26, strokeWidth: 1.5 })}</span>
      <span className="gb-name">{g.name}</span>
      <span className="gb-desc">{g.desc}</span>
      {g.href && <span className="gb-go">Explore <span aria-hidden="true">→</span></span>}
    </>
  );
  return (
    <li className="gb-slide" aria-hidden={hidden || undefined}>
      {g.href
        ? <Link to={g.href} className="gb-card" tabIndex={hidden ? -1 : undefined}>{body}</Link>
        : <div className="gb-card">{body}</div>}
    </li>
  );
}

export default function GenreBand({ items }: { items: GenreItem[] }) {
  const track = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    let pos = el.scrollLeft;
    let last = 0;
    let raf = 0;
    let paused = false;      // hover / focus / pointer down
    let visible = false;     // on screen
    let resumeAt = 0;        // after a manual scroll

    const tick = (t: number) => {
      raf = requestAnimationFrame(tick);
      const dt = last ? Math.min((t - last) / 1000, 0.05) : 0;
      last = t;
      if (paused || !visible || document.hidden || performance.now() < resumeAt) return;
      const half = el.scrollWidth / 2;
      if (half <= el.clientWidth) return;
      pos += SPEED * dt;
      if (pos >= half) pos -= half;
      el.scrollLeft = pos;
    };
    raf = requestAnimationFrame(tick);

    const onScroll = () => {
      // Our own auto-advance lands within a pixel of pos (browsers round scrollLeft).
      if (Math.abs(el.scrollLeft - pos) < 2) return;
      // The visitor scrolled: follow them, wrap the loop, then wait before resuming.
      const half = el.scrollWidth / 2;
      if (el.scrollLeft >= half) el.scrollLeft -= half;
      else if (el.scrollLeft <= 0) el.scrollLeft += half;
      pos = el.scrollLeft;
      resumeAt = performance.now() + RESUME_MS;
    };
    const pause = () => { paused = true; };
    const play = () => { paused = false; pos = el.scrollLeft; resumeAt = performance.now() + 400; };
    const onPointerEnter = (e: PointerEvent) => { if (e.pointerType === 'mouse') pause(); };
    const onPointerLeave = (e: PointerEvent) => { if (e.pointerType === 'mouse') play(); };
    const onFocusOut = (e: FocusEvent) => { if (!el.contains(e.relatedTarget as Node)) play(); };
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0.1 });
    io.observe(el);

    el.addEventListener('scroll', onScroll, { passive: true });
    el.addEventListener('pointerenter', onPointerEnter);
    el.addEventListener('pointerleave', onPointerLeave);
    el.addEventListener('pointerdown', pause);
    el.addEventListener('pointerup', play);
    el.addEventListener('pointercancel', play);
    el.addEventListener('focusin', pause);
    el.addEventListener('focusout', onFocusOut);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      el.removeEventListener('scroll', onScroll);
      el.removeEventListener('pointerenter', onPointerEnter);
      el.removeEventListener('pointerleave', onPointerLeave);
      el.removeEventListener('pointerdown', pause);
      el.removeEventListener('pointerup', play);
      el.removeEventListener('pointercancel', play);
      el.removeEventListener('focusin', pause);
      el.removeEventListener('focusout', onFocusOut);
    };
  }, []);

  const step = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>('.gb-slide');
    el.scrollBy({ left: dir * ((card?.offsetWidth ?? 320) + 16), behavior: 'smooth' });
  };

  return (
    <div className="gb" role="region" aria-roledescription="carousel" aria-label="Genres and services">
      <ul className="gb-track" ref={track}>
        {items.map(g => <Slide key={g.name} g={g} />)}
        {items.map(g => <Slide key={`${g.name}-loop`} g={g} hidden />)}
      </ul>
      <div className="gb-controls">
        <button type="button" className="gb-btn" onClick={() => step(-1)} aria-label="Previous genre"><Arrow dir="left" /></button>
        <button type="button" className="gb-btn" onClick={() => step(1)} aria-label="Next genre"><Arrow dir="right" /></button>
      </div>
    </div>
  );
}
