export interface NewsPost {
  slug: string;
  headline: string;
  subheadline: string;
  datePublished: string;       // ISO 8601 for schema
  dateModified: string;
  displayDate: string;         // Human-readable
  category: 'Release' | 'Event' | 'Press' | 'Behind The Scenes';
  excerpt: string;
  seoTitle?: string;           // <title> when the headline is too long (60 char limit)
  metaDescription?: string;    // meta description when the excerpt is over 160 chars
  image: string;
  imageAlt: string;
  body: string;                // HTML string
  tags: string[];
  // Press posts: the outside feature this post is about (emitted as schema citation)
  source?: { publisher: string; publisherUrl: string; headline: string; url: string; datePublished: string };
}

export const newsPosts: NewsPost[] = [
  {
    slug: 'groove-on-grove-jersey-journal',
    headline: 'DJ DX Performs at Groove on Grove, Makes the Jersey Journal Front Page',
    seoTitle: 'DJ DX at Groove on Grove | Jersey Journal Front Page',
    subheadline: 'A Jersey City native, DJing since 1998, on the front page of his hometown paper.',
    datePublished: '2026-10-07T12:00:00-04:00',
    dateModified: '2026-10-07T12:00:00-04:00',
    displayDate: 'October 7, 2026',
    category: 'Press',
    excerpt: 'Jersey City native DJ DX performed as a featured artist at Groove on Grove and made the front page and arts section of the Jersey Journal.',
    metaDescription: 'Jersey City native DJ DX performed as a featured artist at Groove on Grove and made the front page and arts section of the Jersey Journal.',
    image: '/epk-hero.jpg',
    imageAlt: 'DJ DX (Robert Van Liew), Jersey City DJ, featured artist at Groove on Grove',
    tags: ['Press', 'Jersey Journal', 'Groove on Grove', 'Jersey City', 'DJ DX'],
    body: `
<p class="news-lede">In 2015, <strong>DJ DX</strong> took the stage as a featured artist at <strong>Groove on Grove</strong>, the free summer concert series at the Grove Street PATH Plaza in Downtown Jersey City. The performance put him on the front page of the <strong>Jersey Journal</strong> and in its arts section.</p>

<p>Groove on Grove has brought local musicians to Grove Street every summer since 2008. For a Jersey City native who has been DJing since 1998, playing it was a homecoming: the same streets where he started, now on the front page of the hometown paper.</p>

<p>See the front page in <a href="https://www.instagram.com/p/2b9zGOMKw4/" target="_blank" rel="noopener">his Instagram post from May 2015</a>, and read more about his Jersey City roots in the <a href="https://jerseycitysound.com/entry-dj-dx.html" target="_blank" rel="noopener">Jersey City Sound archive</a>.</p>

<p>Planning an event in Jersey City? See <a href="/corporate-event-dj-jersey-city-nj">corporate event DJ in Jersey City</a>, the <a href="/venues">venues DJ DX has played</a>, or the <a href="/epk">press kit</a>.</p>
`,
  },
  {
    slug: 'voyage-atl-feature',
    headline: 'DJ DX Featured in Voyage ATL: From Jersey City Mixtapes to the TED Stage',
    seoTitle: 'DJ DX in Voyage ATL: Jersey City Mixtapes to the TED Stage',
    metaDescription: 'Voyage ATL interviews DJ DX (Robert Van Liew) on Jersey City mixtapes in 1998, producing, the TED stage, and building a career independently.',
    subheadline: "Voyage ATL's Life & Work series sat down with Robert Van Liew, better known as DJ DX, to talk about 25+ years behind the decks, going independent, and why he publishes his prices.",
    datePublished: '2026-09-30T12:00:00-04:00',
    dateModified: '2026-09-30T12:00:00-04:00',
    displayDate: 'September 30, 2026',
    category: 'Press',
    excerpt: "In a September 2026 interview with Voyage ATL, DJ DX (Robert Van Liew) talks about starting with Jersey City mixtapes in 1998, becoming a producer, performing on the TED stage, and building his career independently.",
    image: '/epk-hero.jpg',
    imageAlt: 'DJ DX (Robert Van Liew), New York and New Jersey DJ and producer, featured in Voyage ATL',
    tags: ['Press', 'Voyage ATL', 'Interview', 'Robert Van Liew', 'DJ DX', 'TEDxYouth@RVA'],
    source: {
      publisher: 'Voyage ATL',
      publisherUrl: 'https://voyageatl.com/',
      headline: 'Life & Work with Robert Van Liew',
      url: 'https://voyageatl.com/interview/life-work-with-robert-van-liew-of-national/',
      datePublished: '2026-09-10',
    },
    body: `
<p class="news-lede">On September 10, 2026, <strong>Voyage ATL</strong> featured Robert Van Liew, better known as <strong>DJ DX</strong>, in its <em>Life &amp; Work</em> interview series. The conversation covers where it all started, the turn from DJ to producer, the TED stage, and what it has taken to build a career independently.</p>

<h2>Where it started: Jersey City, 1998</h2>

<blockquote><p>I grew up in Jersey City, New Jersey and that's really where all of this started — I've been DJing since 1998.</p></blockquote>

<p>It began with mixtapes: Hip-Hop and R&amp;B blends passed around the neighborhood and online, long before "going viral" was a phrase. A run in Reggaeton came next, and with it the nickname "El Negro."</p>

<h2>From curating to creating</h2>

<blockquote><p>In 2011 I started writing and producing my own music instead of just playing other people's. That shift changed everything for me — I wasn't just curating anymore, I was creating.</p></blockquote>

<p>Since then he has released over 100 original tracks, blends, and remixes, with listeners as far from New Jersey as Latin America and the UK.</p>

<h2>The TED stage</h2>

<p>The professional moment he points to first: performing at <strong>TEDxYouth@RVA in 2022</strong>, where he was the only DJ featured that year. Coverage in Disrupt Magazine, NJ.com, and RVA Magazine followed. But he is clear about what he is proudest of:</p>

<blockquote><p>That kind of trust doesn't come from a good set — it comes from showing up, over and over, and doing right by people.</p></blockquote>

<h2>Building it independently</h2>

<p>The interview is candid about the road. On staying independent in an industry that rarely backs its talent:</p>

<blockquote><p>Nobody's coming to save your career for you.</p></blockquote>

<p>And on the perfectionism that keeps a finished track on the shelf until it is right:</p>

<blockquote><p>I'd rather be slow and proud of it than fast and embarrassed by it.</p></blockquote>

<h2>What sets DJ DX apart</h2>

<p>Asked what makes his work different, he names range first (R&amp;B, hip-hop, house, Afrobeats, Amapiano, Jersey Club, reggaeton, and old school) and then how clients actually book him:</p>

<blockquote><p>When someone books DJ DX, they get DJ DX, not whichever DJ an agency happens to have free that weekend.</p></blockquote>

<p>He also points to published pricing, starting rates for weddings, corporate events, private parties, and the Soul Shades duo, so clients can see what fits their budget before the first conversation.</p>

<p class="news-source">Read the full interview: <a href="https://voyageatl.com/interview/life-work-with-robert-van-liew-of-national/" target="_blank" rel="noopener">Life &amp; Work with Robert Van Liew</a>, Voyage ATL, September 10, 2026.</p>

<div class="news-cta-block">
  <a href="https://voyageatl.com/interview/life-work-with-robert-van-liew-of-national/" target="_blank" rel="noopener" class="news-cta-btn">Read on Voyage ATL</a>
  <a href="/event-dj-cost-nyc-nj-ct" class="news-cta-btn news-cta-btn--outline">See pricing</a>
</div>
`,
  },
  {
    slug: 'buzz-in-london-soul-shades',
    headline: 'How "Buzz In London" Was Born: The Story Behind Soul Shades\' Breakout Single',
    seoTitle: 'How "Buzz In London" Was Born | Soul Shades | DJ DX',
    metaDescription: 'How DJ DX and Julie Schatz built the Soul Shades sound: soulful, hip-hop-tinged, jazzy and made for the dance floor. The story of "Buzz In London".',
    subheadline: 'A minor 9 chord, a Sting classic, and a duo finding their sound — the making of Soul Shades\' debut release.',
    datePublished: '2026-04-12T10:00:00+00:00',
    dateModified: '2026-04-12T10:00:00+00:00',
    displayDate: 'April 12, 2026',
    category: 'Behind The Scenes',
    excerpt: 'When DJ DX and Julie Schatz formed Soul Shades, they knew their sound had to be something different — soulful, hip-hop-tinged, jazzy, and built for the dance floor. "Buzz In London" was the moment that vision clicked into place.',
    image: '/covers/buzz-in-london-dj-dx-julie-schatz-soul-shades.jpg',
    imageAlt: 'Soul Shades — Buzz In London single artwork',
    tags: ['Soul Shades', 'Buzz In London', 'Behind The Scenes', 'Deep House', 'Afro House'],
    body: `
<p class="news-lede">When DJ DX and Julie Schatz formed <strong>Soul Shades</strong>, they had a clear vision: music that lived at the intersection of soul, hip-hop, jazz, and dance — a sound that felt timeless but moved a room. Finding that sound on the very first try, though, was something neither of them fully expected.</p>

<p>"Buzz In London" wasn't planned. It arrived.</p>

<h2>Inspired by Bonobo</h2>

<p>The day they made the track, they had been listening to British producer <strong>Bonobo</strong> — known for his ability to weave jazz, soul, and electronic music into something that feels both intimate and expansive. That energy was in the room when Julie sat down at the keys.</p>

<p>"I wanted to lay down some chords that would give the track a swing and a wavy vibe," Julie recalls. "When I went to lay them down, it just felt right instantly — a <strong>minor 9 voicing with the 9 on top</strong>, and just staying there." That single chord voicing became the foundation of everything. It created space without emptiness, tension without chaos — the perfect bed for what was about to come.</p>

<h2>The Jazz Trumpet & DJ DX's Vocals</h2>

<p>With that harmonic foundation locked in, the rest of the track built itself around it. A jazz trumpet melody wove through the chord, giving the record the sophisticated, cosmopolitan character that Soul Shades was going for. Then DJ DX stepped up to the mic.</p>

<p>The verses flowed naturally over the groove, with the hook arriving from a place that felt both spontaneous and inevitable — because it drew from something the duo had just experienced in the streets of the internet.</p>

<h2>Going Viral First — Then Finding the Lyric</h2>

<p>Right before making the track, Soul Shades had gone viral mixing <strong>Sting's "Englishman in New York"</strong> with British electronic producer <strong>Nimino</strong> popular record <em>"I Only Smoke When I Drink."</em> The response was massive. The British energy was undeniable.</p>

<p>That momentum was still in the air when they entered the session. "DJ DX quickly created the verses to flow on top," Julie says, "with the hook speaking about having a 'buzz in London.'" The lyric captured the feeling perfectly — the excitement, the elevation, the vibe of being in a city that pulses with culture. <strong>"Buzz In London" was born.</strong></p>

<h2>A Sound That Represents Soul Shades</h2>

<p>More than a debut single, "Buzz In London" became the sonic blueprint for what Soul Shades is — a duo that refuses genre boxes. Deep house structure. Jazz harmonic language. Hip-hop cadence. Soul as the emotional core. It's the kind of music that works in a rooftop lounge in Manhattan, a sunset set in Ibiza, or a late-night session in London.</p>

<p>The track is available now on all streaming platforms. Stream it, share it, and if you feel that buzz — you know exactly where it came from.</p>

<div class="news-cta-block">
  <a href="/soul-shades" class="news-cta-btn">Explore Soul Shades</a>
  <a href="https://open.spotify.com/artist/2GES5fSFNcx25lv9RFcQjP" target="_blank" rel="noopener noreferrer" class="news-cta-btn news-cta-btn--outline">Stream on Spotify</a>
</div>
`,
  },
];
