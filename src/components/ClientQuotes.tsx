import { useEffect, useRef, useState } from 'react';

/* Homepage "What Clients Say": one large quote at a time on a stage, a thin
   gold progress line per quote (stories-style), and the client names as a
   selector. Auto-advances every 7s, pauses on hover/focus and while the
   section is off screen, and stays still for prefers-reduced-motion.
   Quotes are only ones the clients sent; no star ratings are shown because
   none were given. */

const QUOTES = [
  { text: 'The music selection was well suited for the event, you read the crowd perfectly, and everyone had a great time.', name: 'Senior Office Manager', org: 'LS Power', event: 'In-office reception, Midtown Manhattan' },
  { text: "Your performance set the tone for our event, and the addition of the violin amplified our guests' experience and made the evening memorable.", name: 'Anna Naraine', org: 'NautaDutilh New York P.C.', event: 'Rooftop reception with live violin, 620 Loft & Garden' },
  { text: "The music was just perfect and the vibe was great. I love the uniqueness of keyboard and violin together with DJing. I don't think there are a lot of DJs who come with this built into the duo.", name: 'Sue Krebs', org: 'NautaDutilh New York P.C.', event: 'Rooftop reception with live violin, 620 Loft & Garden' },
];
const DWELL = 7000;

export default function ClientQuotes() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(false);
  const [reduce, setReduce] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    setReduce(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const running = visible && !paused && !reduce;
  useEffect(() => {
    if (!running) return;
    const t = setTimeout(() => setI(n => (n + 1) % QUOTES.length), DWELL);
    return () => clearTimeout(t);
  }, [i, running]);

  const q = QUOTES[i];
  return (
    <section
      ref={ref}
      className="cq"
      aria-label="Client testimonials for DJ DX"
      onPointerEnter={e => { if (e.pointerType === 'mouse') setPaused(true); }}
      onPointerLeave={e => { if (e.pointerType === 'mouse') setPaused(false); }}
      onFocus={() => setPaused(true)}
      onBlur={e => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setPaused(false); }}
    >
      <div className="section-inner cq-inner">
        <div className="sec-overline"><span className="sec-overline-line" /><span className="sec-label">Client Feedback</span></div>
        <div className="cq-stage">
          <span className="cq-mark" aria-hidden="true">&ldquo;</span>
          <figure className="cq-quote" key={i} aria-live="polite">
            <blockquote><p>{q.text}</p></blockquote>
            <figcaption>
              <strong>{q.name}</strong>, {q.org}
              <span>{q.event}</span>
            </figcaption>
          </figure>
        </div>
        <div className="cq-picker" role="tablist" aria-label="Choose a testimonial">
          {QUOTES.map((x, n) => (
            <button
              key={x.name}
              type="button"
              role="tab"
              aria-selected={n === i}
              className="cq-pick"
              onClick={() => setI(n)}
            >
              <span className="cq-bar" aria-hidden="true">
                <span className={n === i ? (running ? 'is-running' : 'is-full') : n < i ? 'is-full' : ''} style={{ animationDuration: `${DWELL}ms` }} key={`${i}-${running}`} />
              </span>
              <span className="cq-pick-name">{x.name}</span>
              <span className="cq-pick-org">{x.org}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
