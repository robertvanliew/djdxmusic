import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

// Booking business first, artist second (Sept 2026). Google tends to build
// sitelinks from the pages a site's menu promotes, and those used to be
// Albums / Soul Shades / News / EPK. The money pages now lead; every artist
// link still exists in the "Music" dropdown (rendered in the HTML at all
// times, so crawlers follow it) and in the footer. No URL changed.

const SpotifyIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.516 17.318a.75.75 0 0 1-1.032.25c-2.827-1.727-6.39-2.117-10.585-1.16a.75.75 0 0 1-.334-1.463c4.592-1.048 8.533-.597 11.701 1.341a.75.75 0 0 1 .25 1.032zm1.472-3.27a.937.937 0 0 1-1.288.308c-3.232-1.987-8.158-2.563-11.984-1.402a.937.937 0 1 1-.543-1.794c4.37-1.323 9.8-.682 13.507 1.6a.937.937 0 0 1 .308 1.288zm.127-3.408C15.37 8.39 9.386 8.2 5.896 9.26a1.124 1.124 0 1 1-.651-2.151c4.07-1.233 10.83-1.003 15.102 1.585a1.124 1.124 0 0 1-1.232 1.936z" />
  </svg>
);
const YouTubeIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);
const SPOTIFY = 'https://open.spotify.com/artist/4gGFdpDwEe8zIY1XSE3dGe';
const YOUTUBE = 'https://www.youtube.com/channel/UCqXcClmim62rc3Jqnzp855w';
const SHOP = 'https://www.djdxllc.com/';

type Item = { label: string; to?: string; hash?: string; external?: string };

const EVENTS: Item[] = [
  { label: 'Corporate Events', to: '/corporate-event-dj-nyc-nj-ct' },
  { label: 'Holiday Parties', to: '/holiday-party-dj-nyc-nj-ct' },
  { label: "New Year's Eve", to: '/new-years-eve-dj-nyc' },
];
const MUSIC: Item[] = [
  { label: 'Music Store', hash: '#catalog' },
  { label: 'Albums', to: '/music' },
  { label: 'Soul Shades', to: '/soul-shades' },
  { label: 'Videos', hash: '#videos' },
  { label: 'News & Press', to: '/news' },
  { label: 'EPK', to: '/epk' },
  { label: 'Shop', external: SHOP },
];

export default function SiteNav() {
  const { pathname } = useLocation();
  const isHome = pathname === '/';
  const [open, setOpen] = useState(false);
  const [dd, setDd] = useState<string | null>(null); // which desktop dropdown is open
  const navRef = useRef<HTMLElement>(null);

  const href = (hash: string) => (isHome ? hash : `/${hash}`);
  const close = () => { setOpen(false); setDd(null); };
  const toTop = () => { window.scrollTo(0, 0); close(); };

  // Close desktop dropdowns on outside click / Escape, and on navigation
  useEffect(() => {
    const onDown = (e: PointerEvent) => { if (!navRef.current?.contains(e.target as Node)) setDd(null); };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setDd(null); };
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('pointerdown', onDown); document.removeEventListener('keydown', onKey); };
  }, []);
  useEffect(() => { setDd(null); }, [pathname]);
  // While the phone menu is open, hide the sticky "Check My Date" bar and the
  // pricing card underneath it - they'd sit on top of the menu.
  useEffect(() => {
    document.body.classList.toggle('nav-open', open);
    return () => document.body.classList.remove('nav-open');
  }, [open]);

  const renderItem = (it: Item, onClick: () => void) =>
    it.external ? <a href={it.external} target="_blank" rel="noopener noreferrer" onClick={onClick}>{it.label}</a>
      : it.hash ? <a href={href(it.hash)} onClick={onClick}>{it.label}</a>
        : <Link to={it.to!} onClick={() => { window.scrollTo(0, 0); onClick(); }}>{it.label}</Link>;

  // A render function, not a nested component: a component defined inside
  // SiteNav would be a new type every render and remount on each click,
  // dropping keyboard focus from the toggle.
  const dropdown = (id: string, label: string, items: Item[]) => (
    <li key={id} className={`nav-dd${dd === id ? ' is-open' : ''}`}>
      <button type="button" className="nav-dd-btn" aria-expanded={dd === id} aria-controls={`nav-dd-${id}`}
        onClick={() => setDd(d => (d === id ? null : id))}>
        {label}<span className="nav-dd-caret" aria-hidden="true" />
      </button>
      <ul className="nav-dd-menu" id={`nav-dd-${id}`}>
        {items.map(it => <li key={it.label}>{renderItem(it, () => setDd(null))}</li>)}
      </ul>
    </li>
  );

  return (
    <>
      <nav className="nav" ref={navRef} aria-label="Main">
        <Link to="/" className="nav-logo" onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); close(); }}>DJ DX</Link>

        {/* Desktop links */}
        <ul className="nav-links">
          <li><Link to="/wedding-dj-nyc-nj" onClick={toTop}>Weddings</Link></li>
          {dropdown('events', 'Corporate & Holiday', EVENTS)}
          <li><Link to="/event-dj-cost-nyc-nj-ct#quote-calculator">Pricing</Link></li>
          <li><Link to="/office-party-music-poll" onClick={toTop}>Music Poll</Link></li>
          {dropdown('music', 'Music', MUSIC)}
          <li className="nav-link--anchor"><a href={href('#about')}>About</a></li>
          <li className="nav-stream-group">
            <a href={`${SPOTIFY}?autoplay_ok=1`} target="_blank" rel="noopener noreferrer" className="nav-stream-btn" aria-label="Listen on Spotify"><SpotifyIcon /></a>
            <a href={YOUTUBE} target="_blank" rel="noopener noreferrer" className="nav-stream-btn" aria-label="Watch on YouTube"><YouTubeIcon /></a>
          </li>
          <li><a href={href('#booking')} className="nav-book">Book Now</a></li>
        </ul>

        {/* Hamburger — mobile only */}
        <button
          className="nav-hamburger"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen(o => !o)}
        >
          <span className={`nav-ham-line${open ? ' nav-ham-line--open' : ''}`} />
          <span className={`nav-ham-line${open ? ' nav-ham-line--open' : ''}`} />
          <span className={`nav-ham-line${open ? ' nav-ham-line--open' : ''}`} />
        </button>
      </nav>

      {/* Mobile drawer: booking pages large, music/artist pages as a compact row */}
      {open && (
        <div className="nav-drawer" role="dialog" aria-label="Navigation menu">
          <div className="nav-drawer-backdrop" onClick={close} />
          <div className="nav-drawer-panel">
            <button className="nav-drawer-close" onClick={close} aria-label="Close menu">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <line x1="4" y1="4" x2="20" y2="20"/>
                <line x1="20" y1="4" x2="4" y2="20"/>
              </svg>
            </button>
            <ul className="nav-drawer-links">
              <li><Link to="/" onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); close(); }} className="nav-drawer-home">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ marginRight: '10px', verticalAlign: 'middle', opacity: 0.6 }}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                Home
              </Link></li>
              <li><Link to="/wedding-dj-nyc-nj" onClick={toTop}>Weddings</Link></li>
              <li><Link to="/corporate-event-dj-nyc-nj-ct" onClick={toTop}>Corporate</Link></li>
              <li><Link to="/holiday-party-dj-nyc-nj-ct" onClick={toTop}>Holiday Parties</Link></li>
              <li><Link to="/event-dj-cost-nyc-nj-ct#quote-calculator" onClick={close}>Pricing</Link></li>
              <li><Link to="/office-party-music-poll" onClick={toTop}>Music Poll <span className="nav-drawer-tag">Free</span></Link></li>
              <li><a href={href('#booking')} onClick={close} className="nav-drawer-book">Book Now</a></li>
            </ul>
            <ul className="nav-drawer-minor" aria-label="Music and more">
              <li><a href={href('#about')} onClick={close}>About</a></li>
              {MUSIC.map(it => <li key={it.label}>{renderItem(it, close)}</li>)}
              <li><Link to="/new-years-eve-dj-nyc" onClick={toTop}>New Year's Eve</Link></li>
            </ul>
            <div className="nav-drawer-streams">
              <a href={SPOTIFY} target="_blank" rel="noopener noreferrer" aria-label="Spotify"><svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.516 17.318a.75.75 0 0 1-1.032.25c-2.827-1.727-6.39-2.117-10.585-1.16a.75.75 0 0 1-.334-1.463c4.592-1.048 8.533-.597 11.701 1.341a.75.75 0 0 1 .25 1.032zm1.472-3.27a.937.937 0 0 1-1.288.308c-3.232-1.987-8.158-2.563-11.984-1.402a.937.937 0 1 1-.543-1.794c4.37-1.323 9.8-.682 13.507 1.6a.937.937 0 0 1 .308 1.288zm.127-3.408C15.37 8.39 9.386 8.2 5.896 9.26a1.124 1.124 0 1 1-.651-2.151c4.07-1.233 10.83-1.003 15.102 1.585a1.124 1.124 0 0 1-1.232 1.936z"/></svg></a>
              <a href={YOUTUBE} target="_blank" rel="noopener noreferrer" aria-label="YouTube"><svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg></a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
