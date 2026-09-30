import { Link } from 'react-router-dom';
import LocalLanding, { type FaqItem } from '../../components/LocalLanding';

const FAQ: FaqItem[] = [
  { q: 'How much does a corporate event DJ cost in Jersey City?', a: 'DJ DX corporate events start at $2,800. That covers professional sound sized to the room, a wireless microphone for speeches, MC announcements, and a planning call. New Jersey travel is quoted up front as its own line, so the full total is clear before you sign.' },
  { q: 'Do you know Jersey City venues and office buildings?', a: 'Yes. DJ DX was born and raised in Jersey City and has been DJing in the city since 1998. Downtown, Newport, Exchange Place, Journal Square, and the Liberty State Park side of town are all home turf, as is nearby Hoboken.' },
  { q: 'Can you set up inside our office for a holiday party?', a: 'Yes. Plenty of Jersey City companies hold the party on their own floor. Send the building\'s rules for load-in, freight elevators, and noise, and the setup is planned around them. A certificate of insurance is available if building management asks for one.' },
  { q: 'Is the music clean for a work crowd?', a: 'Yes. Corporate sets use radio edits only, and the volume stays at talking level during the reception. You can send a do-not-play list, and the dance floor part of the night is built around your crowd.' },
  { q: 'How far ahead should we book for December?', a: 'Aim for 90 to 120 days out. December Thursdays, Fridays, and Saturdays go first. A written contract and a 50% deposit hold your date, and you hear back within 24 hours of asking.' },
];

export default function CorporateJerseyCity() {
  return (
    <LocalLanding
      path="/corporate-event-dj-jersey-city-nj"
      title="Corporate Event DJ Jersey City, NJ | DJ DX"
      description="Corporate event and office party DJ in Jersey City and Hudson County, born and raised here. Downtown, Newport, Exchange Place. Clear rates. Quote in 24 hours."
      heroImage="/corporate-dj-manhattan-office-party-nyc.jpg"
      heroAlt="Corporate event DJ DX behind the decks at an office party with city views"
      overline="Jersey City and Hudson County"
      h1={<>Corporate Event DJ in <span>Jersey City, NJ</span></>}
      answer={<>
        DJ DX is a corporate event DJ in Jersey City, NJ, born and raised here and DJing in the city since 1998.
        Corporate events start at $2,800 with sound, a wireless mic for speeches, and MC announcements included.
        Send your date and you will have a quote within 24 hours.
      </>}
      localHeading={<>Born and Raised in <span>Jersey City</span></>}
      local={<>
        <p style={{ marginBottom: '16px' }}>
          Most corporate DJs who play Jersey City are coming in from somewhere else. DJ DX grew up here and started DJing in the
          city in 1998, and has watched the waterfront grow into one of the busiest spots in the region for company
          parties. That means knowing how these buildings work: loading docks, freight
          elevators, building security, and which rooms swallow sound.
        </p>
        <p style={{ marginBottom: '16px' }}>
          Corporate work here covers the whole city. <strong>Downtown</strong> and <strong>Exchange Place</strong> host
          finance and law firm events with a skyline view across the Hudson. <strong>Newport</strong> brings office towers
          and waterfront event rooms. <strong>Journal Square</strong> has a growing set of venues and restaurants for team
          nights. <strong>Liberty State Park</strong> works for summer outings and outdoor company days, and
          nearby <strong>Hoboken</strong> adds hotel and waterfront rooms a few minutes north.
        </p>
        <p>
          See also <a href="https://jerseycitysound.com" target="_blank" rel="noopener" style={{ color: 'var(--gold)' }}>Jersey City Sound</a>.
        </p>
      </>}
      planning={{
        heading: <>Planning a Jersey City <span>Office Party</span></>,
        items: [
          ['Building rules first.', 'Ask building management for load-in times, freight elevator booking, and any after-hours rules. Send them over and the setup is planned around them.'],
          ['COI for the building.', 'Office towers often ask vendors for a certificate of insurance before load-in. It is available on request, issued to match the building\'s requirements.'],
          ['Start at talking volume.', 'Office parties usually start right after work, with people arriving in waves. The first hour stays low so colleagues can actually talk.'],
          ['Plan the speeches.', 'Decide who speaks, when, and where. The wireless mic is set, the music comes down gradually, and the room is quiet before anyone starts.'],
          ['Know the end time.', 'Shared buildings often have a hard stop. The last song is planned for it, so nobody has to pull the plug mid-track.'],
          ['Book December early.', 'Holiday party dates go 90 to 120 days out. A written contract and a 50% deposit hold your date.'],
        ],
      }}
      proof={{
        overline: 'Recent Corporate Booking',
        title: <>An In-Office Reception, <span>Midtown Manhattan</span></>,
        image: { src: '/corporate-dj-manhattan-office-party-nyc.jpg', alt: 'DJ DX on the decks at an in-office company reception with floor-to-ceiling windows, Midtown Manhattan' },
        body: <>
          <p style={{ marginBottom: '16px' }}>
            In September 2026 DJ DX played an in-office reception for an energy investment firm in its own Midtown Manhattan event
            space. The full DJ setup and sound came into a working office floor. The night opened with house and soul at talking
            volume and built into an open dance floor as the room filled.
          </p>
          <blockquote style={{ borderLeft: '2px solid var(--gold)', paddingLeft: '14px', margin: 0 }}>
            <p style={{ fontStyle: 'italic', marginBottom: '6px' }}>&ldquo;The music selection was well suited for the event, you read the crowd perfectly, and everyone had a great time.&rdquo;</p>
            <cite style={{ fontStyle: 'normal', fontSize: '0.88rem', color: 'rgba(242,242,242,0.6)' }}>Senior Office Manager, energy investment firm</cite>
          </blockquote>
        </>,
        note: <>This booking was in Manhattan. It is the same setup used for office parties in the Newport and Exchange Place towers across the river.</>,
      }}
      included={[
        ['Sound system', 'Professional speakers sized to your room and headcount'],
        ['Wireless microphone', 'For welcome remarks, toasts, and awards'],
        ['MC announcements', 'Speaker intros and run-of-show calls'],
        ['Planning call', 'Timeline, do-not-play list, and how the night should build'],
        ['Clean music', 'Radio edits only, at a volume people can talk over'],
        ['Paperwork', 'Written contract, COI and W-9 on request'],
        ['Travel', 'New Jersey travel quoted up front as its own line'],
      ]}
      faq={FAQ}
      links={<>
        More: <Link to="/corporate-event-dj-nyc-nj-ct" style={{ color: 'var(--gold)' }}>corporate event DJ in NYC, NJ and CT</Link>
        {' · '}<Link to="/holiday-party-dj-nyc-nj-ct" style={{ color: 'var(--gold)' }}>office holiday party DJ</Link>
        {' · '}<Link to="/corporate-event-dj-brooklyn-ny" style={{ color: 'var(--gold)' }}>corporate event DJ in Brooklyn</Link>
      </>}
      bookingEventType="Corporate Event / Holiday Party"
      calcEvent="corporate"
      formName="corporate_jersey_city"
      serviceType="Corporate event DJ"
      areaServed={[
        { '@type': 'City', name: 'Jersey City' },
        { '@type': 'City', name: 'Hoboken' },
        { '@type': 'AdministrativeArea', name: 'Hudson County' },
        { '@type': 'State', name: 'New Jersey' },
      ]}
      breadcrumb={[
        { name: 'Corporate Event DJ', path: '/corporate-event-dj-nyc-nj-ct' },
        { name: 'Jersey City', path: '/corporate-event-dj-jersey-city-nj' },
      ]}
    />
  );
}
