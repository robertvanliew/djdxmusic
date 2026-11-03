import { Link } from 'react-router-dom';

// Cross-link to the two wedding song finders from the wedding pages.
// Reuses the .ppromo styles from src/poll.css.
export default function SongFinderPromo() {
  return (
    <aside className="ppromo" aria-label="Free wedding song finders">
      <div className="ppromo-inner">
        <span className="ppromo-tag">Free tool</span>
        <div className="ppromo-copy">
          <strong>Still picking your entrance or last dance song?</strong>
          <span>Filter by vibe, genre and decade, save a shortlist and share it with your partner.</span>
        </div>
        <Link to="/wedding-entrance-songs" className="ppromo-btn">Entrance songs &rarr;</Link>
        <Link to="/last-dance-songs-wedding" className="ppromo-btn">Last dance &rarr;</Link>
      </div>
    </aside>
  );
}
