import { useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import Lightbox from './Lightbox';

/* Photo and video tiles for past events: a bento grid where the first tile is
   the hero, every tile carries a caption and an expand badge, and a click
   opens the full-screen viewer (Lightbox). Videos are muted loops that only
   play while on screen and never download until they are near the viewport,
   so a page with a dozen clips stays light. Used on the homepage ("Where I've
   Played") and every /venues/<slug> page. */

export type Media = {
  kind: 'img' | 'video';
  src: string;           // image: full path incl. extension; video: mp4 path
  webp?: string;         // optional WebP copy of an image
  poster?: string;       // video poster
  alt: string;           // screen-reader text, also the viewer caption
  cap: string;           // short label printed on the tile
  credit?: string;       // photographer credit, added to the caption
  w?: number;
  h?: number;
};

const EASE = [0.23, 1, 0.32, 1] as const;

const PlayGlyph = () => (
  <svg width="9" height="9" viewBox="0 0 10 10" fill="currentColor" aria-hidden="true"><path d="M2 1l7 4-7 4z" /></svg>
);

function InViewVideo({ m }: { m: Media }) {
  const ref = useRef<HTMLVideoElement>(null);
  const reduce = useReducedMotion();
  useEffect(() => {
    const v = ref.current;
    if (!v || reduce || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { v.preload = 'auto'; v.play().catch(() => {}); }
      else v.pause();
    }, { rootMargin: '200px 0px', threshold: 0.25 });
    io.observe(v);
    return () => io.disconnect();
  }, [reduce]);
  return (
    <video
      ref={ref}
      data-lb
      src={m.src}
      poster={m.poster}
      muted
      loop
      playsInline
      preload="none"
      aria-label={m.credit ? `${m.alt}. Video: ${m.credit}` : m.alt}
    />
  );
}

function Tile({ m, i, lead }: { m: Media; i: number; lead: boolean }) {
  const reduce = useReducedMotion();
  const caption = m.credit ? `${m.alt}. Photo: ${m.credit}` : m.alt;
  return (
    <motion.figure
      className={`em-tile${lead ? ' em-tile--lead' : ''}`}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
      whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -8% 0px' }}
      transition={{ duration: 0.6, delay: Math.min(i, 6) * 0.06, ease: EASE }}
    >
      <button type="button" className="lb-hit" aria-label={`View full screen: ${m.cap}`} />
      {m.kind === 'video' ? (
        <InViewVideo m={m} />
      ) : (
        <picture>
          {m.webp && <source type="image/webp" srcSet={m.webp} />}
          <img data-lb data-full={m.src} src={m.src} alt={caption} width={m.w} height={m.h} loading={lead ? 'eager' : 'lazy'} decoding="async" />
        </picture>
      )}
      {m.kind === 'video' && <span className="em-badge"><PlayGlyph /> Video</span>}
      <figcaption className="em-cap" aria-hidden="true">
        {m.cap}{m.credit && <span className="em-credit">Photo: {m.credit}</span>}
      </figcaption>
    </motion.figure>
  );
}

export default function EventMedia({ items, label, variant = 'bento' }: { items: Media[]; label: string; variant?: 'bento' | 'grid' }) {
  return (
    <Lightbox label={label}>
      <div className={`em-grid em-grid--${variant}`} data-count={items.length}>
        {items.map((m, i) => <Tile key={m.src} m={m} i={i} lead={variant === 'bento' && i === 0} />)}
      </div>
    </Lightbox>
  );
}
