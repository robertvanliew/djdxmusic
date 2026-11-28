import { useRef, useState, type KeyboardEvent } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import EventMedia from './EventMedia';
import { SHOWCASE } from '../data/showcase';

/* Homepage "Where I've Played": recent events as switchable case studies.
   A rail of events (tabs; a swipeable chip row on phones) drives one panel
   with the story, a spec list and a photo/video gallery that opens full
   screen. One event shows at a time so the homepage stays compact.
   Content: src/data/showcase.ts. */

const EASE = [0.23, 1, 0.32, 1] as const;

export default function WherePlayed() {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const reduce = useReducedMotion();
  const g = SHOWCASE[active];

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const d = e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : e.key === 'ArrowUp' || e.key === 'ArrowLeft' ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const n = (active + d + SHOWCASE.length) % SHOWCASE.length;
    setActive(n);
    tabs.current[n]?.focus();
  };

  return (
    <section className="wp" id="where-played" aria-labelledby="wp-title">
      <div className="section-inner wp-inner">
        <div className="sec-overline"><span className="sec-overline-line" /><span className="sec-label">Recent Events</span></div>
        <div className="wp-top">
          <h2 className="sec-title" id="wp-title">Where I&apos;ve <span>Played</span></h2>
          <p className="wp-lead">Real rooms, real crowds. Pick an event, then tap any photo or clip to see it full screen.</p>
        </div>

        <div className="wp-layout">
          <div className="wp-rail" role="tablist" aria-label="Recent events" aria-orientation="vertical" onKeyDown={onKey}>
            {SHOWCASE.map((s, i) => (
              <button
                key={s.id}
                ref={el => { tabs.current[i] = el; }}
                type="button"
                role="tab"
                id={`wp-tab-${s.id}`}
                aria-selected={i === active}
                aria-controls={`wp-panel-${s.id}`}
                tabIndex={i === active ? 0 : -1}
                className="wp-tab"
                onClick={() => setActive(i)}
              >
                <span className="wp-tab-date">{s.date}</span>
                <span className="wp-tab-title">{s.title}</span>
                <span className="wp-tab-venue">{s.venue}</span>
                {i === active && <motion.span layoutId="wp-tab-glow" className="wp-tab-glow" transition={{ duration: reduce ? 0 : 0.35, ease: EASE }} />}
              </button>
            ))}
          </div>

          <div className="wp-stage">
            <AnimatePresence mode="wait" initial={false}>
              <motion.article
                key={g.id}
                id={`wp-panel-${g.id}`}
                role="tabpanel"
                aria-labelledby={`wp-tab-${g.id}`}
                className="wp-panel"
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 18, filter: 'blur(6px)' }}
                animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, y: -10, filter: 'blur(4px)' }}
                transition={{ duration: 0.4, ease: EASE }}
              >
                <header className="wp-head">
                  <div>
                    <p className="wp-meta">{g.date}</p>
                    <h3 className="wp-title">{g.title} <span>at {g.venue}</span></h3>
                    <p className="wp-sub">{g.sub}</p>
                    {g.quote && (
                      <blockquote className="wp-quote">
                        <p>&ldquo;{g.quote.text}&rdquo;</p>
                        <cite>{g.quote.by}</cite>
                      </blockquote>
                    )}
                    <Link to={g.href} className="wp-more">{g.hrefLabel} <span aria-hidden="true">→</span></Link>
                  </div>
                  <dl className="wp-specs">
                    {g.specs.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
                  </dl>
                </header>
                <EventMedia items={g.media} label={`${g.title} at ${g.venue}: photos and video`} />
              </motion.article>
            </AnimatePresence>
          </div>
        </div>

        <div className="wp-cta">
          <div>
            <h3>Planning something like these?</h3>
            <p>Send your date and you will hear back within 24 hours. <Link to="/venues">See every venue</Link> or <Link to="/work">read the case studies</Link>.</p>
          </div>
          <a href="#booking" className="btn-gold">Check Your Date</a>
        </div>
      </div>
    </section>
  );
}
