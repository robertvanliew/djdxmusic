import { Link } from 'react-router-dom';
import LocalLanding, { type FaqItem } from '../../components/LocalLanding';

// 80s & 90s throwback parties. Built from a real inquiry pattern (Nov 2026:
// "throwback 80s-90s dance, hip hop, want people dancing"). Song names below
// are examples of the eras, not a claim about any specific past party.

const FAQ: FaqItem[] = [
  { q: 'How much does an 80s and 90s throwback party DJ cost in NYC?', a: 'DJ DX private parties start at $2,800 for up to five hours in NYC, with professional sound, wireless mics for toasts and MC announcements included. Corporate throwback nights use the same starting price. Travel inside NYC is included; New Jersey, Long Island, Westchester and Connecticut travel is quoted up front as its own line.' },
  { q: 'Do you play 80s and 90s hip-hop clean?', a: 'Yes, when the room calls for it. Clean or radio edits are the default at corporate events and family parties. At a private adult party, the host decides. Tell DJ DX on the planning call and it will be followed.' },
  { q: 'Can you mix 80s and 90s music with current songs?', a: 'Yes, and most throwback parties should. The night is built around the decade, but a few current songs that sample those records, or share their tempo, keep younger guests on the floor and make the throwbacks hit harder.' },
  { q: 'Do you play freestyle and old school R&B?', a: 'Yes. Freestyle is a New York and New Jersey sound, and it belongs at any 80s or 90s party here. So do new jack swing, house classics, and 90s R&B slow jams for the moment the room wants to sing.' },
  { q: 'Is a throwback party a good idea for a 40th or 50th birthday?', a: 'It is usually the best idea. A 40th grew up on 90s hip-hop and R&B; a 50th on 80s freestyle, early hip-hop and new jack swing. Building the set from the years the guest of honor was in high school and college is what gets the whole room singing.' },
];

export default function ThrowbackDJ() {
  return (
    <LocalLanding
      path="/80s-90s-throwback-party-dj-nyc-nj"
      title="80s & 90s Throwback Party DJ NYC & NJ | DJ DX"
      description="80s and 90s throwback party DJ for NYC and NJ: old school hip-hop, R&B, freestyle, new jack swing and house classics, mixed live. Private parties from $2,800."
      heroImage="/epk-hero.jpg"
      heroAlt="DJ DX mixing at a throwback party"
      overline="NYC, NJ and the Tri-State"
      h1={<>80s &amp; 90s Throwback <span>Party DJ</span></>}
      answer={<>
        DJ DX is an 80s and 90s throwback party DJ for New York and New Jersey: old school hip-hop, R&amp;B, freestyle, new jack
        swing and house classics, mixed live and read off the room. He has been DJing since 1998 and built his name on hip-hop
        and R&amp;B mixtapes in Jersey City, so these records are not a theme night for him. Private parties start at $2,800 for
        up to five hours.
      </>}
      localHeading={<>He Was There <span>the First Time</span></>}
      local={<>
        <p style={{ marginBottom: '16px' }}>
          A throwback party works when the DJ knows the records, not just the hits. DJ DX started DJing in 1998 and made his
          name in Jersey City on hip-hop and R&amp;B mixtapes, so the 90s are where he learned to read a room. That matters
          on the night: knowing which deep cut makes a 45-year-old run to the floor, and which radio hit makes them go back
          to the bar.
        </p>
        <p style={{ marginBottom: '16px' }}>
          The New York and New Jersey version of a throwback night is its own thing. It has <strong>freestyle</strong> (the
          Latin dance-pop sound New York made its own in the 80s), <strong>new jack swing</strong>, <strong>golden-era
          hip-hop</strong>, <strong>90s R&amp;B</strong> and <strong>house classics</strong>, often in the same hour. A good
          set moves between them instead of playing one decade in order.
        </p>
        <p>
          Examples of what the eras sound like: <em>It Takes Two</em> (Rob Base &amp; DJ E-Z Rock), <em>Push It</em>
          (Salt-N-Pepa), <em>I Wonder If I Take You Home</em> (Lisa Lisa &amp; Cult Jam), <em>Poison</em> (Bell Biv DeVoe),
          <em> Jump Around</em> (House of Pain), <em>This Is How We Do It</em> (Montell Jordan), <em>No Diggity</em>
          (Blackstreet), <em>Gypsy Woman</em> (Crystal Waters) and <em>Show Me Love</em> (Robin S). Your must-play list
          comes first; these are just the language of the night.
        </p>
      </>}
      planning={{
        heading: <>What to Send <span>Before the Party</span></>,
        items: [
          ['The years that matter.', 'High school and college years of the guest of honor or the crowd. That sets the center of the night.'],
          ['Ten must-plays.', 'The real favorites, including the deep cuts nobody else would think of.'],
          ['The do-not-play list.', 'Overplayed songs, songs with bad memories, anything too explicit for the room.'],
          ['Clean or not.', 'Corporate and family parties default to clean edits. At an adult private party, you decide.'],
          ['Toasts and moments.', 'Who speaks, the entrance song, and the last song of the night.'],
          ['Venue rules.', 'Volume limits, end time, and where the DJ sets up.'],
        ],
      }}
      proof={{
        overline: 'Sample Plan',
        title: <>How a Throwback <span>Night Runs</span></>,
        body: <>
          <ul className="lp-list" style={{ gridTemplateColumns: '1fr' }}>
            <li><strong>Arrival.</strong> 80s and 90s R&amp;B and soul at talking volume while people find each other.</li>
            <li><strong>Food and toasts.</strong> Mid-tempo grooves, then the music drops cleanly for speeches on a wireless mic.</li>
            <li><strong>First dance set.</strong> New jack swing and freestyle to pull every generation onto the floor.</li>
            <li><strong>Peak hour.</strong> Golden-era and 90s hip-hop, house classics, the room's biggest singalongs.</li>
            <li><strong>Last call.</strong> A few 90s slow jams and one last anthem, chosen by the host.</li>
          </ul>
        </>,
        note: <>This is a sample plan, not a specific past party. Yours is built on the planning call.</>,
      }}
      included={[
        ['Sound system', 'Sized for a home, restaurant, lounge or ballroom'],
        ['Wireless microphones', 'For toasts and the birthday or company moment'],
        ['MC announcements', 'Entrances, toasts and last song'],
        ['Planning call', 'Your era, must-plays and do-not-plays'],
        ['Clean edits on request', 'Default at corporate and family events'],
        ['Travel', 'Included in NYC; NJ, Long Island, Westchester and CT quoted as its own line'],
      ]}
      faq={FAQ}
      links={<>
        More: <Link to="/birthday-party-dj-nyc-nj" style={{ color: 'var(--gold)' }}>birthday party DJ</Link>
        {' · '}<Link to="/rb-hip-hop-dj-nyc-nj" style={{ color: 'var(--gold)' }}>R&amp;B and hip-hop DJ</Link>
        {' · '}<Link to="/house-jersey-club-dj-nyc-nj" style={{ color: 'var(--gold)' }}>house and Jersey Club DJ</Link>
        {' · '}<Link to="/private-party-dj-nyc-nj" style={{ color: 'var(--gold)' }}>private party DJ</Link>
      </>}
      bookingEventType="Private Party / Birthday"
      calcEvent="private"
      formName="throwback"
      serviceType="80s and 90s throwback party DJ"
      areaServed={[
        { '@type': 'City', name: 'New York City' },
        { '@type': 'State', name: 'New Jersey' },
        { '@type': 'AdministrativeArea', name: 'Long Island' },
        { '@type': 'AdministrativeArea', name: 'Westchester County' },
        { '@type': 'State', name: 'Connecticut' },
      ]}
      breadcrumb={[
        { name: 'Private Party DJ', path: '/private-party-dj-nyc-nj' },
        { name: '80s & 90s Throwback Party DJ', path: '/80s-90s-throwback-party-dj-nyc-nj' },
      ]}
    />
  );
}
