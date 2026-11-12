import { Link } from 'react-router-dom';
import LocalLanding, { type FaqItem } from '../../components/LocalLanding';

// /wedding-welcome-party-after-party-dj-nyc-nj: "wedding welcome party DJ NYC",
// "rehearsal dinner DJ NYC" and "wedding after party DJ" return only directory
// pages (Nov 2026); no DJ in the market has a page for the events around the
// wedding. No past wedding is described here because none is documented on the
// site yet: the proof block is a clearly labelled sample plan. Replace it with a
// real wedding weekend when DJ DX supplies one. Prices: only the published
// private-event floor; add-ons to a wedding are "quoted", never estimated.

const FAQ: FaqItem[] = [
  { q: 'Do you DJ wedding welcome parties and rehearsal dinners in NYC and NJ?', a: 'Yes. DJ DX plays welcome parties, rehearsal dinners and after-parties as their own events or alongside the wedding itself. They are usually smaller rooms with a shorter set, so the setup is compact and the volume starts at conversation level.' },
  { q: 'How much does a welcome party or after-party DJ cost?', a: 'A standalone private event starts at $2,800 in New York City for up to five hours, with sound and wireless microphones included. If DJ DX is also playing your wedding, the welcome party or after-party is quoted together with it, so you see one total. Send your dates and you will have the quote within 24 hours.' },
  { q: 'Can the same DJ play the whole wedding weekend?', a: 'Yes, and that is the reason to do it. One planning call covers every event, and the music can build across the weekend without repeating itself: the welcome party does not use up the songs you are saving for the reception.' },
  { q: 'How late can a wedding after-party run?', a: 'That depends on the venue and the local sound rules, not the DJ. Tell DJ DX the room and its cutoff and the set is planned to end on time. Many hotel after-parties move to a lower volume after a set hour, and the music is chosen to work at that level.' },
  { q: 'Can we have live music for the rehearsal dinner instead?', a: 'Yes. Violinist Julie Schatz plays dinners and cocktail hours solo, and she and DJ DX perform together as Soul Shades when you want live violin over a DJ set.' },
  { q: 'What kind of music works for a welcome party?', a: 'Music people can talk over that still sounds like the two of you: soul, R&B, Afrobeats, classic hip-hop, Latin or house, depending on the crowd. Guests are meeting each other for the first time, so the first hour is for conversation and the dancing comes later if the room wants it.' },
];

export default function WeddingWeekendDJ() {
  return (
    <LocalLanding
      path="/wedding-welcome-party-after-party-dj-nyc-nj"
      title="Wedding Welcome Party & After-Party DJ NYC & NJ | DJ DX"
      description="DJ for wedding welcome parties, rehearsal dinners and after-parties in NYC and NJ. One DJ for the whole weekend, or just one night. Private events from $2,800."
      heroImage="/epk-hero.jpg"
      heroAlt="DJ DX performing at a private event in New York"
      overline="Welcome party, rehearsal dinner, after-party"
      h1={<>Wedding Welcome Party and After-Party DJ <span>in NYC and NJ</span></>}
      answer={<>
        DJ DX plays the events around the wedding: the welcome party, the rehearsal dinner and the after-party, in New York
        City and New Jersey. Book one night or the whole weekend with one planning call. Private events start at $2,800,
        and add-ons to a wedding he is already playing are quoted together with it.
      </>}
      localHeading={<>Three Rooms, <span>Three Different Jobs</span></>}
      local={<>
        <p style={{ marginBottom: '16px' }}>
          <strong>The welcome party</strong> is where two families and several friend groups meet. The music is there to
          make that easy. It stays under conversation, it sounds like the couple, and it gives people something to nod
          along to while they find each other. If a dance floor happens, it happens late.
        </p>
        <p style={{ marginBottom: '16px' }}>
          <strong>The rehearsal dinner</strong> is about the toasts. A clean wireless microphone and a quiet room matter
          more than the playlist. Dinner music sits low: soul and classic R&amp;B, or
          a <a href="https://julieschatzmusic.com/" style={{ color: 'var(--gold)' }}>live violinist</a> if you would rather have strings.
        </p>
        <p>
          <strong>The after-party</strong> is the opposite. Everyone who is still standing wants the songs that did not fit
          the reception: the club records, the throwbacks, the guilty pleasures. It is usually a smaller room with a
          sound cutoff, so the set is built to hit hard at a volume the venue allows.
        </p>
      </>}
      planning={{
        heading: <>Planning the Wedding <span>Weekend</span></>,
        items: [
          ['Save songs for the right night.', 'Decide which songs belong to the reception and keep them out of the welcome party. One DJ across the weekend makes that easy.'],
          ['Ask each venue for its sound cutoff.', 'Restaurants, hotel suites and rooftops all have different rules. The after-party set is planned around the real end time.'],
          ['Keep the setup small.', 'A welcome party in a restaurant or a hotel lounge needs compact speakers and one table, not a full reception rig.'],
          ['Plan the toasts.', 'Who speaks at the rehearsal dinner, in what order, and for how long. Wireless microphones are included.'],
          ['Tell the DJ who is coming.', 'A welcome party with grandparents and college friends in one room needs music both groups know.'],
          ['Use one timeline.', 'The live run of show covers every event in one link you can edit from your phone.'],
        ],
      }}
      proof={{
        overline: 'A sample plan, not a past wedding',
        title: <>What a Weekend <span>Can Look Like</span></>,
        body: <>
          <p style={{ marginBottom: '16px' }}>
            This is an example to help you plan. It is not a description of a specific couple's wedding.
          </p>
          <ul className="lp-list">
            <li><strong>Thursday, welcome party.</strong> Three hours in a hotel lounge. Soul, R&amp;B and Afrobeats at talking volume, then a short dance set for the last hour.</li>
            <li><strong>Friday, rehearsal dinner.</strong> Live violin during dinner. A wireless microphone for six toasts. No dancing planned.</li>
            <li><strong>Saturday, wedding.</strong> Ceremony music, cocktail hour, dinner and the reception, built from your must-play list.</li>
            <li><strong>Saturday late, after-party.</strong> Ninety minutes in a smaller room: the records that were too loud or too fast for the main floor.</li>
          </ul>
        </>,
        note: <>For the wedding day itself, see <Link to="/wedding-dj-nyc-nj" style={{ color: 'var(--gold)' }}>wedding DJ in NYC and NJ</Link> and the <Link to="/wedding-entertainment-package-nyc-nj" style={{ color: 'var(--gold)' }}>ceremony violin and reception DJ package</Link>.</>,
      }}
      included={[
        ['Sound system', 'Sized to the room, from a restaurant corner to a hotel ballroom'],
        ['Wireless microphones', 'For welcome remarks and rehearsal dinner toasts'],
        ['One planning call', 'Covers every event you book, so nothing is repeated'],
        ['Must-play and do-not-play lists', 'Kept per event, so the right songs land on the right night'],
        ['Live run of show', 'One link for the whole weekend, editable from your phone'],
        ['Paperwork', 'Written contract; certificate of insurance on request for each venue'],
        ['Travel', 'Included in New York City; quoted up front as its own line elsewhere'],
      ]}
      faq={FAQ}
      links={<>
        More: <Link to="/wedding-dj-nyc-nj" style={{ color: 'var(--gold)' }}>wedding DJ in NYC and NJ</Link>
        {' · '}<Link to="/wedding-dj-cost-nyc" style={{ color: 'var(--gold)' }}>wedding DJ cost</Link>
        {' · '}<Link to="/violin-dj-duo-nyc-nj" style={{ color: 'var(--gold)' }}>DJ and live violin duo</Link>
        {' · '}<Link to="/wedding-entrance-songs" style={{ color: 'var(--gold)' }}>entrance song finder</Link>
        {' · '}<Link to="/last-dance-songs-wedding" style={{ color: 'var(--gold)' }}>last dance song finder</Link>
      </>}
      bookingEventType="Wedding"
      calcEvent="private"
      formName="wedding_weekend"
      serviceType="DJ for wedding welcome parties, rehearsal dinners and after-parties"
      areaServed={[
        { '@type': 'City', name: 'New York City' },
        { '@type': 'State', name: 'New Jersey' },
        { '@type': 'AdministrativeArea', name: 'Westchester County' },
        { '@type': 'AdministrativeArea', name: 'Long Island' },
      ]}
      breadcrumb={[
        { name: 'Wedding DJ', path: '/wedding-dj-nyc-nj' },
        { name: 'Welcome Party and After-Party', path: '/wedding-welcome-party-after-party-dj-nyc-nj' },
      ]}
    />
  );
}
