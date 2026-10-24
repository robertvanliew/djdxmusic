import { Link } from 'react-router-dom';
import LocalLanding, { type FaqItem } from '../../components/LocalLanding';

// Bilingual (English/Spanish) DJ and emcee. Facts used here are the ones
// already confirmed on the site: bilingual emcee, the "El Negro" name from the
// Hood Reggaeton series, DJing since 1998. Nothing else is claimed.

const FAQ: FaqItem[] = [
  { q: 'Do you emcee in both English and Spanish?', a: 'Yes. DJ DX is a bilingual DJ and emcee. Announcements, introductions, toasts and the moments that matter can be done in English, in Spanish, or in both, so every guest follows the night.' },
  { q: 'How much does a bilingual DJ and emcee cost in NYC?', a: 'Weddings, private parties and corporate events start at $2,800 for up to five hours in NYC, with sound, wireless mics and MC announcements included. Travel outside NYC is quoted up front as its own line. Mention that you want a bilingual emcee when you check your date.' },
  { q: 'What Latin music do you play?', a: 'Reggaeton, salsa, merengue, bachata, dembow and Latin pop, mixed with hip-hop, R&B, house and Afrobeats. DJ DX is known as "El Negro" from his Hood Reggaeton mix series, so Latin music is part of his own background, not an add-on.' },
  { q: 'Which events need a bilingual emcee?', a: 'Weddings where the two families speak different first languages, quinceañeras, sweet 16s, company parties with bilingual teams, and any event where some guests are more comfortable in Spanish. One emcee who switches naturally is smoother than reading everything twice.' },
  { q: 'Can you say names correctly in both languages?', a: 'Yes. The planning call covers every name that will be said on the mic, with pronunciation, so introductions and toasts land right the first time.' },
];

export default function BilingualEmceeDJ() {
  return (
    <LocalLanding
      path="/bilingual-dj-emcee-nyc-nj"
      title="Bilingual DJ & Emcee NYC & NJ: English and Spanish"
      description="Bilingual DJ and emcee in English and Spanish for weddings, quinceañeras and company events in NYC and NJ. Reggaeton to hip-hop. Published prices."
      heroImage="/epk-hero.jpg"
      heroAlt="DJ DX, bilingual DJ and emcee, performing"
      overline="English · Español · NYC and NJ"
      h1={<>Bilingual DJ &amp; Emcee, <span>English and Spanish</span></>}
      answer={<>
        DJ DX is a bilingual DJ and emcee for New York and New Jersey. He runs the microphone in English and Spanish, and plays
        reggaeton, salsa, bachata and dembow next to hip-hop, R&amp;B and house. Weddings, private parties and corporate events
        start at $2,800 for up to five hours.
      </>}
      localHeading={<>One Voice for <span>the Whole Room</span></>}
      local={<>
        <p style={{ marginBottom: '16px' }}>
          At a lot of New York and New Jersey events, half the room is more at home in Spanish. A wedding where one family
          speaks Spanish at home. A quinceañera with grandparents who came for the traditions. A company party where the
          kitchen team and the sales team speak different first languages. An emcee who only works in English leaves some of
          those guests watching instead of taking part.
        </p>
        <p style={{ marginBottom: '16px' }}>
          DJ DX switches between English and Spanish on the mic the way the room does: introductions, the entrance, toasts,
          the first dance, the cake, last call. Not every line twice, which drags, but each moment in the language that
          reaches the most people.
        </p>
        <p>
          The music side is the same. DJ DX is known as <strong>"El Negro"</strong> from his Hood Reggaeton mix series, and has
          been DJing since 1998. Reggaeton, salsa, merengue, bachata and dembow sit in the same set as hip-hop, R&amp;B, house
          and Afrobeats, because that is what these rooms actually dance to.
        </p>
      </>}
      planning={{
        heading: <>What to Send <span>Before the Event</span></>,
        items: [
          ['Which moments in which language.', 'Entrances, toasts, the first dance. English, Spanish or both, moment by moment.'],
          ['Every name on the mic.', 'With pronunciation, so nobody is introduced wrong.'],
          ['Traditions.', 'Quinceañera waltz, shoe ceremony, money dance, la hora loca: whatever is part of your night.'],
          ['The music balance.', 'How much Latin, how much hip-hop and R&B, how much current pop.'],
          ['Must-plays and do-not-plays.', 'In any language.'],
          ['Venue rules.', 'Volume limits, end time and where the DJ sets up.'],
        ],
      }}
      proof={{
        overline: 'Sample Plan',
        title: <>How a Bilingual <span>Night Runs</span></>,
        body: <>
          <ul className="lp-list" style={{ gridTemplateColumns: '1fr' }}>
            <li><strong>Welcome.</strong> One short welcome that moves between English and Spanish.</li>
            <li><strong>Entrances.</strong> Each name introduced the way the family says it.</li>
            <li><strong>Toasts.</strong> Speakers introduced in their language; the mic is handed off cleanly.</li>
            <li><strong>Traditions.</strong> Announced so both sides of the room know what is happening and why.</li>
            <li><strong>Dance floor.</strong> Reggaeton, bachata and salsa mixed with hip-hop, R&amp;B and house.</li>
          </ul>
        </>,
        note: <>This is a sample plan, not a specific past event. Yours is built on the planning call.</>,
      }}
      included={[
        ['Bilingual emcee', 'English and Spanish, moment by moment'],
        ['Sound system', 'Sized to the room'],
        ['Wireless microphones', 'For toasts, speeches and traditions'],
        ['Planning call', 'Languages, names, traditions and music balance'],
        ['Latin and open-format music', 'Reggaeton, salsa, bachata, dembow, hip-hop, R&B, house'],
        ['Travel', 'Included in NYC; NJ, Long Island, Westchester and CT quoted as its own line'],
      ]}
      faq={FAQ}
      links={<>
        More: <Link to="/wedding-dj-nyc-nj" style={{ color: 'var(--gold)' }}>wedding DJ</Link>
        {' · '}<Link to="/sweet-16-dj-nyc-nj" style={{ color: 'var(--gold)' }}>sweet 16 and quinceañera DJ</Link>
        {' · '}<Link to="/corporate-event-dj-nyc-nj-ct" style={{ color: 'var(--gold)' }}>corporate event DJ</Link>
        {' · '}<Link to="/private-party-dj-nyc-nj" style={{ color: 'var(--gold)' }}>private party DJ</Link>
      </>}
      bookingEventType="Wedding"
      calcEvent="private"
      formName="bilingual"
      serviceType="Bilingual DJ and emcee"
      areaServed={[
        { '@type': 'City', name: 'New York City' },
        { '@type': 'State', name: 'New Jersey' },
        { '@type': 'AdministrativeArea', name: 'Long Island' },
        { '@type': 'AdministrativeArea', name: 'Westchester County' },
        { '@type': 'State', name: 'Connecticut' },
      ]}
      breadcrumb={[
        { name: 'Bilingual DJ & Emcee', path: '/bilingual-dj-emcee-nyc-nj' },
      ]}
    />
  );
}
