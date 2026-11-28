import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { textHref, trackTextClick, TEXT_NUMBER_DISPLAY } from '../lib/textLink';

/* Site footer. Three layers:
   1. A closing call to action (date check, text, email with one-tap copy).
   2. "Find your event": every service page grouped into five short lists.
      On phones each group is a <details> that opens on tap; on desktop they
      are open columns. Every link is always in the HTML for search engines.
   3. Explore + social, the "As seen in" strip, and a slim bottom bar with
      legal links and back-to-top.
   Hover motion is gated to mouse pointers; nothing animates for keyboard
   actions or under prefers-reduced-motion. */

type L = { to: string; label: string };

const GROUPS: { title: string; links: L[] }[] = [
  {
    title: 'Weddings',
    links: [
      { to: '/wedding-dj-nyc-nj', label: 'Wedding DJ NYC & NJ' },
      { to: '/wedding-entertainment-package-nyc-nj', label: 'Entertainment Package' },
      { to: '/wedding-dj-cost-nyc', label: 'Wedding DJ Cost Guide' },
      { to: '/violin-dj-duo-nyc-nj', label: 'Violin + DJ Duo' },
      { to: '/piano-dj-duo-nyc-nj', label: 'Piano + DJ Duo' },
      { to: '/hamptons-luxury-dj', label: 'Hamptons Luxury DJ' },
      { to: '/destination-wedding-dj', label: 'Destination Weddings' },
    ],
  },
  {
    title: 'Corporate',
    links: [
      { to: '/corporate-event-dj-nyc-nj-ct', label: 'Corporate DJ NYC' },
      { to: '/corporate-event-dj-jersey-city-nj', label: 'Corporate DJ Jersey City' },
      { to: '/corporate-event-dj-brooklyn-ny', label: 'Corporate DJ Brooklyn' },
      { to: '/holiday-party-dj-nyc-nj-ct', label: 'Office Holiday Party DJ' },
      { to: '/law-firm-finance-event-dj-nyc', label: 'Law Firm & Finance Events' },
      { to: '/how-to-hire-corporate-event-dj-nyc', label: 'How to Hire a Corporate DJ' },
    ],
  },
  {
    title: 'Parties',
    links: [
      { to: '/dj-for-hire-nyc', label: 'DJ for Hire NYC' },
      { to: '/private-party-dj-nyc-nj', label: 'Private Party DJ' },
      { to: '/birthday-party-dj-nyc-nj', label: 'Birthday Party DJ' },
      { to: '/sweet-16-dj-nyc-nj', label: 'Sweet 16 DJ' },
      { to: '/prom-dj-nyc-nj', label: 'Prom DJ' },
      { to: '/rooftop-party-dj-nyc', label: 'Rooftop Party DJ' },
      { to: '/new-years-eve-dj-nyc', label: "New Year's Eve DJ" },
      { to: '/80s-90s-throwback-party-dj-nyc-nj', label: '80s & 90s Throwback' },
      { to: '/bilingual-dj-emcee-nyc-nj', label: 'Bilingual DJ & Emcee' },
    ],
  },
  {
    title: 'Sound',
    links: [
      { to: '/rb-hip-hop-dj-nyc-nj', label: 'R&B and Hip-Hop' },
      { to: '/hip-hop-dj-nyc-nj', label: 'Hip-Hop DJ' },
      { to: '/rb-dj-nyc-nj', label: 'R&B DJ' },
      { to: '/afrobeats-amapiano-dj-nyc-nj', label: 'Afrobeats & Amapiano' },
      { to: '/house-jersey-club-dj-nyc-nj', label: 'House & Jersey Club' },
    ],
  },
  {
    title: 'Plan & Prices',
    links: [
      { to: '/event-dj-cost-nyc-nj-ct#quote-calculator', label: 'Instant Price Estimate' },
      { to: '/event-dj-cost-nyc-nj-ct', label: 'Event DJ Pricing Report' },
      { to: '/open-dates', label: 'Open Dates' },
      { to: '/live-run-of-show', label: 'Live Run of Show' },
      { to: '/office-party-music-poll', label: 'Office Party Music Poll' },
      { to: '/wedding-entrance-songs', label: 'Wedding Entrance Songs' },
      { to: '/last-dance-songs-wedding', label: 'Last Dance Songs' },
    ],
  },
];

const EXPLORE: L[] = [
  { to: '/#about', label: 'About' },
  { to: '/#services', label: 'Genres' },
  { to: '/#catalog', label: 'Music' },
  { to: '/#videos', label: 'Videos' },
  { to: '/venues', label: 'Venues' },
  { to: '/work', label: 'Case Studies' },
  { to: '/news', label: 'News' },
  { to: '/epk', label: 'Press Kit' },
  { to: '/verified', label: 'Verified Facts' },
  { to: '/faq', label: 'FAQ' },
  { to: '/contact', label: 'Contact' },
  { to: '/booking-policy', label: 'Booking Policy' },
  { to: '/plan', label: 'Plan Your Music' },
  { to: '/planners', label: 'For Planners' },
];

const SOCIAL = [
  { href: 'https://Instagram.com/djdx', label: 'Instagram' },
  { href: 'https://www.tiktok.com/@djdxmusic', label: 'TikTok' },
  { href: 'https://www.youtube.com/c/djdxmusic', label: 'YouTube' },
  { href: 'https://twitter.com/djdxmusic', label: 'X' },
  { href: 'https://facebook.com/djdxmusic', label: 'Facebook' },
];

const LEGAL: L[] = [
  { to: '/pricing', label: 'Music Store Pricing' },
  { to: '/terms', label: 'Terms' },
  { to: '/privacy', label: 'Privacy' },
  { to: '/refunds', label: 'Refunds' },
];

const Arrow = () => (
  <svg className="ft-arrow" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="13 6 19 12 13 18" /></svg>
);

// Desktop shows every group open; phones start closed. Links are in the DOM either way.
function useWide() {
  const [wide, setWide] = useState(true);
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 901px)');
    const on = () => setWide(mq.matches);
    on();
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return wide;
}

function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1600);
    return () => clearTimeout(t);
  }, [copied]);
  return (
    <button
      type="button"
      className={`ft-copy${copied ? ' is-copied' : ''}`}
      onClick={() => { navigator.clipboard?.writeText(email).then(() => setCopied(true)).catch(() => {}); }}
      aria-label={copied ? 'Email address copied' : `Copy ${email}`}
    >
      <span className="ft-copy-label" key={copied ? 'y' : 'n'}>{copied ? 'Copied' : 'Copy'}</span>
    </button>
  );
}

export default function SiteFooter({ email = 'bookings@djdxmusic.com', bookLabel = 'Check Your Date', bookHref = '/#booking' }: { email?: string; bookLabel?: string; bookHref?: string }) {
  const wide = useWide();
  const toTop = () => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
  };

  return (
    <footer className="footer ft">
      <div className="footer-inner">

        {/* 1. Closing call to action */}
        <section className="ft-cta" aria-label="Book DJ DX">
          <div className="ft-cta-copy">
            <p className="ft-kicker">DJ DX · New York and New Jersey</p>
            <h2 className="ft-cta-title">Let&apos;s plan <span>your night.</span></h2>
            <p className="ft-cta-sub">Weddings, corporate events and private parties across the US and Puerto Rico. Send your date and hear back within 24 hours.</p>
          </div>
          <div className="ft-cta-actions">
            <a href={bookHref} className="ft-btn ft-btn--gold">{bookLabel.replace(/\s*→$/, '')}</a>
            <a href={textHref()} onClick={() => trackTextClick('footer')} className="ft-btn">Text {TEXT_NUMBER_DISPLAY}</a>
            <div className="ft-mail">
              <a href={`mailto:${email}`} className="ft-mail-link">{email}</a>
              <CopyEmail email={email} />
            </div>
            <a href="tel:+16464703469" className="ft-call">or call {TEXT_NUMBER_DISPLAY}</a>
          </div>
        </section>

        {/* 2. Find your event */}
        <nav className="ft-dir" aria-label="DJ services">
          {GROUPS.map(g => (
            <details key={g.title} className="ft-group" open={wide || undefined}>
              <summary className="ft-group-head" tabIndex={wide ? -1 : 0} onClick={e => { if (wide) e.preventDefault(); }}>
                <span>{g.title}</span>
                <span className="ft-count" aria-hidden="true">{g.links.length}</span>
                <svg className="ft-chev" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9" /></svg>
              </summary>
              <ul className="ft-links">
                {g.links.map(l => <li key={l.to}><Link to={l.to} className="ft-link"><span>{l.label}</span><Arrow /></Link></li>)}
              </ul>
            </details>
          ))}
        </nav>

        {/* 3. Explore + social */}
        <div className="ft-meta">
          <nav className="ft-explore" aria-label="Explore">
            <span className="ft-meta-label">Explore</span>
            <ul>
              {EXPLORE.map(l => <li key={l.to}><Link to={l.to}>{l.label}</Link></li>)}
              <li><a href="https://soulshadesmusic.com/">Soul Shades</a></li>
            </ul>
          </nav>
          <nav className="ft-social" aria-label="Social">
            <span className="ft-meta-label">Follow</span>
            <ul>
              {SOCIAL.map(s => <li key={s.label}><a href={s.href} target="_blank" rel="noopener noreferrer" className="ft-pill">{s.label}</a></li>)}
            </ul>
          </nav>
        </div>

        <div className="footer-recognized" aria-label="Recognized by">
          <span className="footer-recognized-label">As Seen In &amp; Recognized By</span>
          <div className="footer-recognized-strip" role="list">
            <a href="https://www.ted.com/talks/dj_dx_finally_moving" target="_blank" rel="noopener noreferrer" className="footer-partner footer-partner--icon" aria-label="TED" role="listitem">
              <svg viewBox="0 0 24 24" className="footer-logo-svg" aria-hidden="true"><path d="M0 7.664v2.223h2.43v6.449H5.1v-6.45h2.43V7.665zm7.945 0v8.672h7.31v-2.223h-4.638v-1.08h4.637v-2.066h-4.637v-1.08h4.637V7.664zm7.759 0v8.672h3.863c3.024 0 4.433-1.688 4.433-4.349 0-2.185-1.021-4.323-3.912-4.323zm2.672 2.223h.85c1.931 0 2.102 1.518 2.102 2.063 0 .815-.243 2.163-1.907 2.163h-1.045z"/></svg>
            </a>
            <a href="https://www.ted.com/tedx/events/52176" target="_blank" rel="noopener noreferrer" className="footer-partner" aria-label="TEDx" role="listitem">TEDx</a>
            <a href="https://www.wikidata.org/wiki/Q17579958" target="_blank" rel="noopener noreferrer" className="footer-partner footer-partner--icon" aria-label="Wikidata" role="listitem">
              <svg viewBox="0 0 24 24" className="footer-logo-svg" aria-hidden="true"><path d="M0 4.583v14.833h.865V4.583zm1.788 0v14.833h2.653V4.583zm3.518 0v14.832H7.96V4.583zm3.547 0v14.834h.866V4.583zm1.789 0v14.833h.865V4.583zm1.759 0v14.834h2.653V4.583zm3.518 0v14.834h.923V4.583zm1.788 0v14.833h2.653V4.583zm3.64 0v14.834h.865V4.583zm1.788 0v14.834H24V4.583Z"/></svg>
              <span>Wikidata</span>
            </a>
            <a href="https://musicbrainz.org/artist/8a6ee50a-8713-4828-a42f-8aa8f9579d6b" target="_blank" rel="noopener noreferrer" className="footer-partner footer-partner--icon" aria-label="MusicBrainz" role="listitem">
              <img src="https://simpleicons.org/icons/musicbrainz.svg" className="footer-logo-img" alt="MusicBrainz" />
              <span>MusicBrainz</span>
            </a>
            <a href="https://disruptmagazine.com/dj-dx-leads-the-music-industry-into-the-metaverse/" target="_blank" rel="noopener noreferrer" className="footer-partner" aria-label="Disrupt Magazine" role="listitem">Disrupt Mag</a>
            <a href="https://www.nj.com/hudson/2014/07/jersey_city_rapper_dj_dx_shares_stories_through_old_new_school_sounds.html" target="_blank" rel="noopener noreferrer" className="footer-partner" aria-label="NJ.com" role="listitem">NJ.com</a>
            <a href="https://rvamag.com/music/keeping-it-real-in-the-south-an-interview-with-dj-dx.html" target="_blank" rel="noopener noreferrer" className="footer-partner" aria-label="RVA Magazine" role="listitem">RVA Mag</a>
            <a href="https://www.youtube.com/watch?v=V2uWYlWhv64" target="_blank" rel="noopener noreferrer" className="footer-partner" aria-label="HearRVA" role="listitem">HearRVA</a>
            <a href="https://www.hourglasssessions.com/" target="_blank" rel="noopener noreferrer" className="footer-partner" aria-label="Hourglass Sessions" role="listitem">Hourglass Sessions</a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="ft-bottom">
          <p className="ft-copyright">© {new Date().getFullYear()} FRANKPELLA LLC</p>
          <ul className="ft-legal">
            {LEGAL.map(l => <li key={l.to}><Link to={l.to}>{l.label}</Link></li>)}
            <li><a href="mailto:support@djdxmusic.com">Support</a></li>
            <li><a href="https://robertvanliew.com" target="_blank" rel="noopener noreferrer">Site design</a></li>
          </ul>
          <button type="button" className="ft-top" onClick={toTop} aria-label="Back to top">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="18 15 12 9 6 15" /></svg>
          </button>
        </div>

      </div>
    </footer>
  );
}
