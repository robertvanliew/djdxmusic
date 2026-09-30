import { Link } from 'react-router-dom';
import LocalLanding, { type FaqItem } from '../../components/LocalLanding';

// Noindex until the event placeholders below are filled with real, confirmed
// details. Then set NOINDEX to false and add the URL to public/sitemap.xml.
// Private clients are never named: describe them generically ("a 40th
// birthday in Harlem"), never by the guest of honor's name.
const NOINDEX = true;

const EVENTS = [
  '[BIRTHDAY EVENT 1: milestone, setting, neighborhood or town, month and year: fill in]',
  '[BIRTHDAY EVENT 2: milestone, setting, neighborhood or town, month and year: fill in]',
];

const CASE_STUDY = {
  title: '[BIRTHDAY CASE STUDY TITLE: fill in]',
  body: '[BIRTHDAY CASE STUDY: milestone, setting, guest count, the era the set was built around, and how the night went. No client names. Real event only: fill in]',
};

const FAQ: FaqItem[] = [
  { q: 'How much does a birthday party DJ cost in NYC and NJ?', a: 'DJ DX private parties, birthdays included, start at $2,200 in NYC. That covers professional sound, wireless mics for toasts, MC announcements, and a planning call about the music. Travel inside NYC is included; New Jersey, Long Island, Westchester, and Connecticut travel is quoted up front as its own line.' },
  { q: 'Can the music be built around one decade?', a: 'Yes, and for milestone birthdays that is usually the point. A 40th often wants the late 90s and 2000s, a 50th leans into the late 80s and 90s. The set is built from the years the guest of honor grew up in, then mixed with current songs so younger guests have a way in too.' },
  { q: 'What kind of music do you play at birthday parties?', a: 'R&B, hip-hop, old school, Afrobeats, dancehall, house, and whatever the guest of honor loves. Send a must-play list and a do-not-play list before the party, and requests on the night are welcome.' },
  { q: 'Can you make a custom intro or edit for the guest of honor?', a: 'Yes. DJ DX produces music, so a custom walk-in track, a birthday intro, or an edit of a favorite song can be made for the night. It is priced as an add-on on your quote.' },
  { q: 'Do you DJ birthday parties at home or in restaurants?', a: 'Yes. Home parties, restaurant buyouts, rooftops, and lounges are all common. The setup scales to the space, from a compact system in a living room to a full rig for a rented venue. Send the venue\'s rules on volume and end time and the night is planned around them.' },
];

export default function BirthdayPartyDJ() {
  return (
    <LocalLanding
      path="/birthday-party-dj-nyc-nj"
      title="Birthday Party DJ NYC & NJ: 30th, 40th, 50th & More"
      description="Birthday party DJ for milestone birthdays across NYC, NJ and the Tri-State. R&B, hip-hop, old school, Afrobeats. Published starting prices. Check your date."
      noindex={NOINDEX}
      heroImage="/epk-hero.jpg"
      heroAlt="Birthday party DJ DX performing"
      overline="NYC, NJ and the Tri-State"
      h1={<>Birthday Party DJ <span>in NYC and NJ</span></>}
      answer={<>
        DJ DX is a birthday party DJ for 30th, 40th, 50th and other milestone birthdays in NYC, New Jersey, and the Tri-State.
        Private parties start at $2,200 with sound, wireless mics, and MC announcements included. The music is built around
        the guest of honor, from old school and R&amp;B to hip-hop and Afrobeats.
      </>}
      localHeading={<>Built Around the <span>Guest of Honor</span></>}
      local={<>
        <p style={{ marginBottom: '16px' }}>
          A milestone birthday is one person's night, so the set starts with them. Before the party there is a call about the
          years they grew up in, the songs that meant something, and the ones that clear a room. A 30th might live in 2000s
          hip-hop and R&amp;B. A 40th usually wants the late 90s. A 50th is often old school, freestyle, and classic soul,
          with enough newer music mixed in that the younger guests dance too.
        </p>
        <p style={{ marginBottom: '16px' }}>
          Birthdays happen everywhere: <strong>home parties</strong> in a brownstone or a backyard, <strong>restaurant
          buyouts</strong> where the tables get pushed back after dinner, <strong>rooftops</strong> in summer, and
          <strong> lounges</strong> booked for the night. The setup is sized to the room, and the planning call covers the
          venue's volume limits and end time.
        </p>
        <p>
          <strong>Custom intro or edit.</strong> DJ DX is also a producer, so the night can open with a walk-in track or a
          birthday intro made for the guest of honor, or an edit of their favorite song. It is an add-on, quoted with the rest
          of the booking.
        </p>
      </>}
      venuesHeading="Recent birthday parties"
      venues={EVENTS}
      caseStudy={CASE_STUDY}
      included={[
        ['Sound system', 'Sized for a living room, restaurant, rooftop, or lounge'],
        ['Wireless microphones', 'For toasts, speeches, and the birthday moment'],
        ['MC announcements', 'Entrances, cake, toasts, and last song'],
        ['Planning call', 'The guest of honor\'s era, must-plays, and do-not-plays'],
        ['Custom intro or edit', 'Optional add-on, produced for your party'],
        ['Travel', 'Included in NYC; NJ, Long Island, Westchester, and CT quoted as its own line'],
      ]}
      faq={FAQ}
      links={<>
        More: <Link to="/private-party-dj-nyc-nj" style={{ color: 'var(--gold)' }}>private party DJ in NYC and NJ</Link>
        {' · '}<Link to="/sweet-16-dj-nyc-nj" style={{ color: 'var(--gold)' }}>sweet 16 DJ</Link>
        {' · '}<Link to="/rb-hip-hop-dj-nyc-nj" style={{ color: 'var(--gold)' }}>R&amp;B and hip-hop DJ</Link>
        {' · '}<Link to="/holiday-party-dj-nyc-nj-ct" style={{ color: 'var(--gold)' }}>holiday party DJ</Link>
      </>}
      bookingEventType="Private Party / Birthday"
      calcEvent="private"
      formName="birthday"
      serviceType="Birthday party DJ"
      areaServed={[
        { '@type': 'City', name: 'New York City' },
        { '@type': 'State', name: 'New Jersey' },
        { '@type': 'AdministrativeArea', name: 'Long Island' },
        { '@type': 'AdministrativeArea', name: 'Westchester County' },
        { '@type': 'State', name: 'Connecticut' },
      ]}
      breadcrumb={[
        { name: 'Private Party DJ', path: '/private-party-dj-nyc-nj' },
        { name: 'Birthday Party DJ', path: '/birthday-party-dj-nyc-nj' },
      ]}
    />
  );
}
