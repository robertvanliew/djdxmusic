import { Link } from 'react-router-dom';

// Cross-link to the free music poll from the corporate and holiday pages -
// the planners reading those pages are exactly who the tool is for.
export default function PollPromo() {
  return (
    <aside className="ppromo" aria-label="Free office party music poll">
      <div className="ppromo-inner">
        <span className="ppromo-tag">Free tool</span>
        <div className="ppromo-copy">
          <strong>Not sure what your crowd wants to hear?</strong>
          <span>Let your team vote on the music before the party. One link, anonymous, a crowd report in minutes.</span>
        </div>
        <Link to="/office-party-music-poll" className="ppromo-btn">Create a music poll &rarr;</Link>
      </div>
    </aside>
  );
}
