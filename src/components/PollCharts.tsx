import type { Ranked } from '../lib/poll';
import { ENERGY_LABELS } from '../lib/poll';

// Chart pieces for the music poll report. Plain CSS bars rather than a chart
// library: nothing extra to download, they print cleanly, and every bar
// carries its count and percentage as real text for screen readers.

export function BarList({ items, total, max = 11, caption }: { items: Ranked[]; total: number; max?: number; caption: string }) {
  const shown = items.slice(0, max);
  const top = Math.max(1, ...shown.map(i => i.count));
  return (
    <figure className="pc-bars">
      <figcaption className="pc-caption">{caption}</figcaption>
      <ul>
        {shown.map(i => {
          const pct = total ? Math.round((i.count / total) * 100) : 0;
          return (
            <li key={i.label} className={i.count === 0 ? 'is-zero' : ''}>
              <span className="pc-label">{i.label}</span>
              <span className="pc-track" aria-hidden="true">
                <span className="pc-fill" style={{ width: `${(i.count / top) * 100}%` }} />
              </span>
              <span className="pc-value">
                {i.count}<span className="pc-pct"> · {pct}%</span>
              </span>
            </li>
          );
        })}
      </ul>
    </figure>
  );
}

export function EnergyMeter({ avg }: { avg: number | null }) {
  if (avg == null) return <p className="pc-empty">No votes yet.</p>;
  const idx = Math.min(4, Math.max(0, Math.round(avg) - 1));
  return (
    <figure className="pc-energy">
      <figcaption className="pc-caption">Dance-floor energy</figcaption>
      <div className="pc-energy-row">
        <span className="pc-energy-num">{avg.toFixed(1)}<span>/5</span></span>
        <span className="pc-energy-label">{ENERGY_LABELS[idx]}</span>
      </div>
      <div className="pc-energy-track" role="img" aria-label={`Average energy ${avg.toFixed(1)} out of 5: ${ENERGY_LABELS[idx]}`}>
        <span className="pc-energy-fill" style={{ width: `${((avg - 1) / 4) * 100}%` }} />
      </div>
      <div className="pc-energy-ends" aria-hidden="true"><span>Background vibes</span><span>Dancing all night</span></div>
    </figure>
  );
}

export function SongList({ items, empty, caption }: { items: Ranked[]; empty: string; caption: string }) {
  return (
    <figure className="pc-songs">
      <figcaption className="pc-caption">{caption}</figcaption>
      {items.length === 0 ? (
        <p className="pc-empty">{empty}</p>
      ) : (
        <ol>
          {items.map(s => (
            <li key={s.label}>
              {s.art ? <img className="pc-art" src={s.art} width="36" height="36" alt="" loading="lazy" /> : <span className="pc-art pc-art--none" aria-hidden="true">♪</span>}
              <span className="pc-song">{s.label}</span>
              <span className="pc-song-count">{s.count} {s.count === 1 ? 'vote' : 'votes'}</span>
            </li>
          ))}
        </ol>
      )}
    </figure>
  );
}
