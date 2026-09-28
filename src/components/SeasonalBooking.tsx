import { Link } from 'react-router-dom';

// Seasonal entry point on the homepage. The homepage takes more organic
// clicks than every other page combined, but its body linked to no service
// page at all - the holiday and NYE pages were only reachable via the footer.
//
// Shows from September through December and switches itself off on Jan 1,
// so it can never advertise a season that's over. The date check runs at
// build (prerender) time and again in the browser, so a deploy in the season
// also bakes the links into the static HTML for crawlers.
function inSeason(d = new Date()) {
  return d.getMonth() >= 8; // Sep (8) .. Dec (11)
}

export default function SeasonalBooking() {
  if (!inSeason()) return null;
  const year = new Date().getFullYear();
  return (
    <div className="season">
      <div className="season-head">
        <span className="season-dot" aria-hidden="true" />
        <span className="season-label">Now booking December {year}</span>
      </div>
      <div className="season-grid">
        <Link to="/holiday-party-dj-nyc-nj-ct" className="season-card">
          <span className="season-kicker">From $2,800</span>
          <strong>Holiday &amp; Christmas Parties</strong>
          <span className="season-desc">Office Christmas parties, corporate holiday parties and private gatherings across NJ, NYC and CT.</span>
          <span className="season-go">See holiday dates <span aria-hidden="true">→</span></span>
        </Link>
        <Link to="/new-years-eve-dj-nyc" className="season-card">
          <span className="season-kicker">One booking per year</span>
          <strong>New Year’s Eve {year}</strong>
          <span className="season-desc">Private parties and corporate galas, built around a scripted midnight countdown.</span>
          <span className="season-go">Check NYE availability <span aria-hidden="true">→</span></span>
        </Link>
      </div>
    </div>
  );
}
