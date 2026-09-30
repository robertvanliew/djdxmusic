import { useLocation } from 'react-router-dom';
import { gigsForPage, namedClients, type GigEntry } from '../data/events';

// "Recent and upcoming events" for service pages, driven by src/data/events.ts.
// Renders nothing when the page has no live entries, so there is never an
// empty or placeholder section on the site.

const monthYear = (d: string) => {
  const [y, m] = d.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, 1)).toLocaleDateString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' });
};

function describe(g: GigEntry): string {
  const who = g.showClientName && g.clientName ? g.clientName : g.clientGeneric;
  const where = g.showVenueName && g.venueName && !g.venueName.startsWith('[') ? `${g.venueName}, ${g.venueCity}` : g.venueCity;
  return [g.eventType, who, where].filter(Boolean).join(', ');
}

function Row({ g }: { g: GigEntry }) {
  return (
    <li className="pb-item">
      <span className="pb-what">{describe(g)}</span>
      <span className="pb-when">{monthYear(g.date)}</span>
      {g.quote && (
        <blockquote className="pb-quote">
          <p>&ldquo;{g.quote}&rdquo;</p>
          {g.quoteAuthor && (
            <cite>{g.quoteAuthor}{g.showClientName && g.quoteCompany ? `, ${g.quoteCompany}` : ''}</cite>
          )}
        </blockquote>
      )}
    </li>
  );
}

export default function ProofBlock() {
  const { pathname } = useLocation();
  const { recent, upcoming } = gigsForPage(pathname);
  if (!recent.length && !upcoming.length) return null;
  return (
    <div className="pb" role="region" aria-label="Recent and upcoming events">
      <div className="pb-inner">
        <h2 className="pb-title">Recent and Upcoming Events</h2>
        {upcoming.length > 0 && (
          <>
            <h3 className="pb-sub">Upcoming</h3>
            <ul className="pb-list">{upcoming.map((g, i) => <Row key={`u${i}`} g={g} />)}</ul>
          </>
        )}
        {recent.length > 0 && (
          <>
            <h3 className="pb-sub">Recent</h3>
            <ul className="pb-list">{recent.map((g, i) => <Row key={`r${i}`} g={g} />)}</ul>
          </>
        )}
      </div>
    </div>
  );
}

// "Companies DJ DX has played for": only clients who have agreed to be named.
export function ClientNames() {
  const names = namedClients();
  if (!names.length) return null;
  return <p className="pb-clients"><span>Companies DJ DX has played for:</span> {names.join(' · ')}</p>;
}
