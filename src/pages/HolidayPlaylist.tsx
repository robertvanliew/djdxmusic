import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import SiteNav from '../components/SiteNav';
import SiteFooter from '../components/SiteFooter';
import StickyMobileCTA from '../components/StickyMobileCTA';
import PollPromo from '../components/PollPromo';
import AuthorBio from '../components/AuthorBio';
import { STARTING_PRICES } from '../lib/pricing';

// /office-holiday-party-playlist: a clean, non-religious office holiday
// playlist in the order the night runs. Song picks are DJ DX's (approved by
// him before publishing), shaped by 2025 request data (DJ Intelligence,
// uRequest corporate data) and what people search for ("office holiday party
// playlist", "christmas party playlist clean", "r&b christmas songs",
// "christmas hip hop songs clean", "non religious holiday songs").

interface Song { artist: string; title: string }
interface Part { id: string; h2: string; when: string; note: string; songs: Song[] }

const PARTS: Part[] = [
  {
    id: 'arrival', h2: 'Arrival and cocktail hour', when: 'First 45 to 60 minutes, at conversation level',
    note: 'Low enough that people can actually talk. Soul, smooth R&B and a few warm holiday classics so the room never feels empty.',
    songs: [
      { artist: 'Bill Withers', title: 'Lovely Day' },
      { artist: 'Al Green', title: "Let's Stay Together" },
      { artist: 'Donny Hathaway', title: 'This Christmas' },
      { artist: 'Nat King Cole', title: 'The Christmas Song' },
      { artist: 'Mark Ronson feat. Amy Winehouse', title: 'Valerie' },
      { artist: 'Dean Martin', title: 'Let It Snow! Let It Snow! Let It Snow!' },
      { artist: 'Stevie Wonder', title: "Signed, Sealed, Delivered I'm Yours" },
      { artist: 'Charles Brown', title: 'Merry Christmas Baby' },
      { artist: 'Luther Vandross', title: 'Every Year, Every Christmas' },
      { artist: 'José Feliciano', title: 'Feliz Navidad' },
    ],
  },
  {
    id: 'rnb-hip-hop-christmas', h2: 'R&B and hip-hop Christmas songs (clean)', when: 'Mixed in through the night',
    note: 'The holiday songs most office playlists forget: old-school R&B and hip-hop Christmas records that every generation in the room knows.',
    songs: [
      { artist: 'Run-DMC', title: 'Christmas in Hollis' },
      { artist: 'Kurtis Blow', title: "Christmas Rappin'" },
      { artist: 'Boyz II Men', title: 'Let It Snow' },
      { artist: "Destiny's Child", title: '8 Days of Christmas' },
      { artist: 'Stevie Wonder', title: 'What Christmas Means to Me' },
      { artist: 'Ariana Grande', title: 'Santa Tell Me' },
      { artist: 'Justin Bieber', title: 'Mistletoe' },
      { artist: 'Chuck Berry', title: 'Run Rudolph Run' },
    ],
  },
  {
    id: 'dinner', h2: 'Dinner and speeches', when: 'Through the meal and any toasts',
    note: 'Familiar grooves between courses, then the music drops out cleanly for the CEO toast or awards and comes back up after.',
    songs: [
      { artist: 'Earth, Wind & Fire', title: 'September' },
      { artist: 'Marvin Gaye & Tammi Terrell', title: "Ain't No Mountain High Enough" },
      { artist: 'Lionel Richie', title: 'All Night Long (All Night)' },
      { artist: 'Bruno Mars', title: 'Treasure' },
      { artist: 'Daft Punk feat. Pharrell Williams', title: 'Get Lucky' },
      { artist: 'Bobby Helms', title: 'Jingle Bell Rock' },
      { artist: 'Kelly Clarkson', title: 'Underneath the Tree' },
      { artist: 'Justin Timberlake', title: "Can't Stop the Feeling!" },
    ],
  },
  {
    id: 'dance-floor', h2: 'Dance floor', when: 'After dinner, the main set',
    note: 'Open format, mixed live: the songs that fill dance floors at company parties, plus R&B, hip-hop, house and Afrobeats. Once the floor is full, a holiday song every third or fourth track keeps it festive without turning into a carol sing-along.',
    songs: [
      { artist: 'Whitney Houston', title: 'I Wanna Dance with Somebody (Who Loves Me)' },
      { artist: 'Mark Ronson feat. Bruno Mars', title: 'Uptown Funk' },
      { artist: 'Walk the Moon', title: 'Shut Up and Dance' },
      { artist: 'Michael Jackson', title: 'Billie Jean' },
      { artist: 'Mariah Carey', title: 'All I Want for Christmas Is You' },
      { artist: 'Beyoncé feat. Jay-Z', title: 'Crazy in Love' },
      { artist: 'Montell Jordan', title: 'This Is How We Do It' },
      { artist: 'Mark Morrison', title: 'Return of the Mack' },
      { artist: 'The Killers', title: 'Mr. Brightside' },
      { artist: 'Wham!', title: 'Last Christmas' },
      { artist: 'Crystal Waters', title: "Gypsy Woman (She's Homeless)" },
      { artist: 'Robin S', title: 'Show Me Love' },
      { artist: 'Beyoncé', title: 'Break My Soul' },
      { artist: 'Drake feat. Wizkid & Kyla', title: 'One Dance' },
      { artist: 'Rema & Selena Gomez', title: 'Calm Down' },
      { artist: 'Tyla', title: 'Water' },
      { artist: 'Dua Lipa', title: 'Levitating' },
      { artist: 'Rihanna', title: "Please Don't Stop the Music" },
      { artist: 'OutKast', title: 'Hey Ya!' },
      { artist: 'ABBA', title: 'Dancing Queen' },
      { artist: 'Kool & The Gang', title: 'Celebration' },
      { artist: 'Cupid', title: 'Cupid Shuffle' },
      { artist: 'Marcia Griffiths', title: 'Electric Boogie (Electric Slide)' },
    ],
  },
  {
    id: 'last-call', h2: 'Last call', when: 'Final 20 minutes',
    note: 'Everyone singing, then a clear ending so the night closes on a high instead of fading out.',
    songs: [
      { artist: 'Brenda Lee', title: "Rockin' Around the Christmas Tree" },
      { artist: 'Neil Diamond', title: 'Sweet Caroline' },
      { artist: 'Bon Jovi', title: "Livin' on a Prayer" },
      { artist: 'Journey', title: "Don't Stop Believin'" },
      { artist: 'Jay-Z feat. Alicia Keys', title: 'Empire State of Mind' },
      { artist: 'Frank Sinatra', title: 'Theme from New York, New York' },
    ],
  },
];

// Answer-first questions people ask when planning office party music.
const FAQ: { q: string; a: string }[] = [
  { q: 'What music should you play at an office holiday party?',
    a: 'Familiar, clean songs that work for every age in the room: soul and R&B while people arrive, upbeat classics over dinner, then a dance set of crowd favorites from Motown to current hits. Mix in secular holiday songs rather than religious carols so every employee feels included.' },
  { q: 'Should a work Christmas party play Christmas music?',
    a: 'Some, not all. Most offices want the season to feel festive, but a whole night of Christmas music wears thin and religious carols can leave people out. A good balance is a holiday song every third or fourth track once the dance floor is going.' },
  { q: 'How loud should the music be at an office party?',
    a: 'Quiet enough to talk during arrival and dinner, then louder only once people are dancing. If guests have to shout to hear each other at the bar, it is too loud. A DJ should adjust volume to the room and to the host, not to a fixed level.' },
  { q: 'How many songs do you need for an office party?',
    a: 'Roughly 15 to 20 songs per hour when a DJ is mixing, a little fewer with full-length tracks. A four-hour party uses 60 to 80 songs, which is why a live DJ reading the room beats a fixed playlist.' },
  { q: 'Are these songs clean?',
    a: 'Every song on this page is played as a clean or radio edit. Explicit versions are never played at a corporate event.' },
];

const URL = 'https://djdxmusic.com/office-holiday-party-playlist';
const COUNT = PARTS.reduce((n, p) => n + p.songs.length, 0);
const money = (n: number) => `$${n.toLocaleString('en-US')}`;

export default function HolidayPlaylist() {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  const schema = [
    {
      '@context': 'https://schema.org', '@type': 'MusicPlaylist', '@id': `${URL}#playlist`,
      name: 'Clean Office Holiday Party Playlist (2026)', url: URL, numTracks: COUNT,
      author: { '@id': 'https://djdxmusic.com/#djdx' },
      track: PARTS.flatMap(p => p.songs).map(s => ({ '@type': 'MusicRecording', name: s.title, byArtist: { '@type': 'MusicGroup', name: s.artist } })),
    },
    {
      '@context': 'https://schema.org', '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://djdxmusic.com/' },
        { '@type': 'ListItem', position: 2, name: 'Office Holiday Party DJ', item: 'https://djdxmusic.com/holiday-party-dj-nyc-nj-ct' },
        { '@type': 'ListItem', position: 3, name: 'Office Holiday Party Playlist', item: URL },
      ],
    },
  ];
  return (
    <>
      <Helmet>
        <title>Office Holiday Party Playlist 2026: Clean Work Party Songs</title>
        <meta name="description" content={`${COUNT} clean, non-religious songs for a work Christmas party, in the order the night runs, including R&B and hip-hop Christmas songs. From an NYC event DJ.`} />
        <link rel="canonical" href={URL} />
        <meta property="og:title" content="Office Holiday Party Playlist 2026: Clean Work Party Songs" />
        <meta property="og:url" content={URL} />
        <meta property="og:type" content="article" />
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </Helmet>
      <SiteNav />
      <main className="vn-main">
        <div className="vn-inner">
          <nav className="vn-crumbs" aria-label="Breadcrumb"><Link to="/holiday-party-dj-nyc-nj-ct">Office Holiday Party DJ</Link> / Playlist</nav>
          <div className="sec-overline"><span className="sec-label">Free playlist</span></div>
          <h1 className="sec-title vn-h1">Office Holiday Party <span>Playlist</span></h1>
          <p className="vn-p vn-lead">
            {COUNT} clean songs for a company holiday party or work Christmas party, in the order the night actually runs.
            Picked by DJ DX from more than 500 events, including office parties across NYC and New Jersey. Every song is played
            as a clean or radio edit, and the holiday songs are secular, with no religious carols, so every team feels included.
          </p>
          <ul className="pl-jump" aria-label="Jump to a part of the night">
            {PARTS.map(p => <li key={p.id}><a href={`#${p.id}`}>{p.h2}</a></li>)}
          </ul>

          {PARTS.map(p => (
            <section className="vn-sec" id={p.id} key={p.id}>
              <h2 className="vn-h2">{p.h2}</h2>
              <p className="pl-when">{p.when}</p>
              <p className="vn-p">{p.note}</p>
              <ol className="pl-list">
                {p.songs.map(s => <li key={s.artist + s.title}><strong>{s.title}</strong><span>{s.artist}</span></li>)}
              </ol>
            </section>
          ))}

          <section className="vn-sec" id="faq">
            <h2 className="vn-h2">Office party music questions</h2>
            {FAQ.map(f => (
              <div key={f.q} className="pl-faq">
                <h3>{f.q}</h3>
                <p className="vn-p">{f.a}</p>
              </div>
            ))}
          </section>

          <section className="vn-sec">
            <h2 className="vn-h2">Why a playlist is not the same as a DJ</h2>
            <p className="vn-p">
              A playlist plays in order. A DJ reads the room: when the dance floor is full, when the finance team is still at the bar,
              when the toast is about to start. DJ DX mixes this kind of set live, keeps the volume at conversation level until people
              are ready to dance, takes requests, and runs the microphones for speeches. Office holiday parties start
              at {money(STARTING_PRICES.corporate)} for up to five hours in NYC.
              See <Link to="/holiday-party-dj-nyc-nj-ct">office holiday party DJ</Link> or <a href="/#booking">check your date</a>.
            </p>
          </section>
        </div>
      </main>
      <PollPromo />
      <AuthorBio />
      <StickyMobileCTA formName="holiday_playlist_sticky" label="Check My Date" />
      <SiteFooter />
    </>
  );
}
