import { useMemo } from 'react';
import { LazyMotion, MotionConfig } from 'motion/react';
import * as m from 'motion/react-m';
import { BOOKED_DATES } from '../data/availability';
import { useHolds, isoDate } from '../lib/nights';
import { openBooking } from './BookingHost';

// Yellow "Now booking" bar under the hero on the main service pages: the
// headline, the next two open Friday/Saturday nights as one-tap date chips,
// and a Check My Date button. Chips and button open the booking dialog in
// place (the button's #booking href is the no-JS fallback). Booked and held
// dates are skipped. Framer Motion (LazyMotion + m, features loaded on
// demand) handles the reveal, chip stagger and press feedback; motion is
// reduced automatically for prefers-reduced-motion. Update the years here
// when the calendar moves.

const loadFeatures = () => import('../lib/motionFeatures').then(r => r.default);
const EASE = [0.23, 1, 0.32, 1] as const;

export default function BookingPrompt() {
  const held = useHolds();
  const nights = useMemo(() => {
    const out: { iso: string; label: string }[] = [];
    const d = new Date();
    d.setHours(12, 0, 0, 0);
    for (let i = 1; i < 120 && out.length < 2; i++) {
      d.setDate(d.getDate() + 1);
      const day = d.getDay();
      if (day !== 5 && day !== 6) continue;
      const iso = isoDate(d);
      if (BOOKED_DATES.includes(iso) || held[iso]) continue;
      out.push({ iso, label: d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) });
    }
    return out;
  }, [held]);

  return (
    <LazyMotion features={loadFeatures} strict>
      <MotionConfig reducedMotion="user">
        <m.div
          className="bp"
          role="region"
          aria-label="Check your date"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '0px 0px -10% 0px' }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          <m.span
            className="bp-sheen"
            aria-hidden="true"
            initial={{ x: '-120%' }}
            whileInView={{ x: '120%' }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, ease: EASE, delay: 0.35 }}
          />
          <p className="bp-text"><span className="bp-dot" aria-hidden="true" />Now Booking 2027 and 2028</p>
          {nights.length > 0 && (
            <div className="bp-nights">
              <span className="bp-nights-label">Next open</span>
              {nights.map((n, i) => (
                <m.button
                  key={n.iso}
                  type="button"
                  className="bp-chip"
                  onClick={() => openBooking({ date: n.iso, source: 'prompt_chip' })}
                  initial={{ opacity: 0, scale: 0.94 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, ease: EASE, delay: 0.15 + i * 0.06 }}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.96 }}
                >
                  {n.label}
                </m.button>
              ))}
            </div>
          )}
          <m.a
            href="#booking"
            className="bp-btn"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', duration: 0.3, bounce: 0.2 }}
          >
            Check My Date
          </m.a>
        </m.div>
      </MotionConfig>
    </LazyMotion>
  );
}
