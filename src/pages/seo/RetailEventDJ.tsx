import { Link } from 'react-router-dom';
import LocalLanding, { type FaqItem } from '../../components/LocalLanding';

// /store-opening-retail-event-dj-nyc: searches for "grand opening DJ NYC" and
// "DJ for store opening NYC" return DJ equipment shops and ticketed club nights
// (Nov 2026), so there is no real page answering them. The proof is the Saks
// Fifth Avenue private estate event in Water Mill (August 2026): a retail brand
// event, NOT a store opening. The copy never claims a past store opening.
// Saks photos are (c) Linsey Kromer and must carry her credit.

const FAQ: FaqItem[] = [
  { q: 'How much does a DJ cost for a store opening or retail event in NYC?', a: 'Corporate and brand events start at $2,800 in New York City for up to five hours, with professional sound, wireless microphones and MC announcements included. Shorter in-store events are quoted on the date, hours and setup. Send those and you will have a quote within 24 hours.' },
  { q: 'Have you played for retail brands?', a: 'Yes. In August 2026 DJ DX played a private evening event for Saks Fifth Avenue at an estate in Water Mill, New York, which included a jewelry showcase. Photos and video from that night are on the Hamptons page.' },
  { q: 'Can you set up inside a store without getting in the way?', a: 'Yes. The setup is one six-foot table and speakers sized to the space, so it fits beside a display or near the entrance. It needs two standard 15-amp circuits. Send a floor plan or photos and the position is agreed before the day.' },
  { q: 'Will the music fit our brand?', a: 'Yes. The planning call covers the mood you want customers to walk into, a do-not-play list, and how the energy should change across the event. Music is clean edits only, at a volume people can shop and talk over.' },
  { q: 'Can you make announcements, or keep quiet for our host?', a: 'Either. Wireless microphones are included for a ribbon cutting, a founder welcome or a raffle. If your own host is speaking, the music comes down for them and back up after.' },
  { q: 'Do you provide insurance for the landlord or the mall?', a: 'Yes. A certificate of insurance is available on request and is issued to match the landlord or property manager\'s requirements. A written contract and a W-9 come with every booking.' },
];

export default function RetailEventDJ() {
  return (
    <LocalLanding
      path="/store-opening-retail-event-dj-nyc"
      title="Store Opening & Retail Event DJ NYC | From $2,800 | DJ DX"
      description="DJ for store openings, pop-ups, trunk shows and in-store brand events in NYC and NJ. Played for Saks Fifth Avenue. Clean music, compact setup, COI ready."
      heroImage="/corporate-dj-manhattan-office-party-nyc.jpg"
      heroAlt="DJ DX on the decks at a company event in Manhattan"
      overline="Retail, fashion and brand events"
      h1={<>Store Opening and Retail Event DJ <span>in NYC</span></>}
      answer={<>
        DJ DX plays store openings, pop-ups, trunk shows and in-store brand events in New York City and New Jersey.
        In August 2026 he played a private evening event for Saks Fifth Avenue. Brand events start at $2,800 with sound,
        microphones and a certificate of insurance for the landlord.
      </>}
      localHeading={<>Music People Shop To, <span>Not Around</span></>}
      local={<>
        <p style={{ marginBottom: '16px' }}>
          A store event has a different job from a party. People are arriving and leaving the whole time, staff need to be
          heard at the counter, and the music is part of how the brand looks. Too loud and customers leave. Too flat and
          the opening feels like any other Thursday.
        </p>
        <p style={{ marginBottom: '16px' }}>
          DJ DX plans a retail set in three parts. Doors: warm and recognizable, so people walking past come in. The busy
          middle: steady house, soul and R&amp;B that keeps energy up without competing with conversation. The moment: a ribbon
          cutting, a founder welcome or a product reveal, with a microphone ready and the music timed around it.
        </p>
        <p>
          The setup is small on purpose. One table, speakers sized to the floor, clean cable runs and no light show unless
          you ask for one. For a launch that needs more, the <Link to="/corporate-event-dj-nyc-nj-ct#packages" style={{ color: 'var(--gold)' }}>Signature package</Link> adds
          lighting and a second sound zone, and <Link to="/violin-dj-duo-nyc-nj" style={{ color: 'var(--gold)' }}>live violin</Link> can play over the set.
        </p>
      </>}
      planning={{
        heading: <>Planning an In-Store <span>Event</span></>,
        items: [
          ['Pick the DJ position early.', 'Near the entrance pulls people in from the street. Near the back draws them through the store. Send a floor plan or a few photos.'],
          ['Check power and the landlord.', 'Two standard 15-amp circuits cover the setup. Ask the landlord or mall about sound limits, load-in doors and whether they need a certificate of insurance.'],
          ['Set the volume by zone.', 'The counter and fitting rooms need to stay easy to talk in. Speakers are aimed away from them.'],
          ['Time the moment.', 'Ribbon cutting, welcome or reveal: decide the minute, who speaks and what plays right after.'],
          ['Send a do-not-play list.', 'Brand guidelines often rule out explicit lyrics or particular artists. Clean edits are the default.'],
          ['Think about the sidewalk.', 'If doors are open, the music is your sign. If the block has noise rules, the speakers stay inside the threshold.'],
        ],
      }}
      proof={{
        overline: 'Retail brand event, August 2026',
        title: <>Saks Fifth Avenue, <span>Water Mill</span></>,
        image: { src: '/saks-dj-dx-booth-setup-water-mill-hamptons.jpg', alt: 'DJ DX and the full DJ booth setup under a sailcloth tent at a Saks Fifth Avenue private estate event in Water Mill, New York' },
        body: <>
          <p style={{ marginBottom: '16px' }}>
            In August 2026 DJ DX played a private evening event for Saks Fifth Avenue at an estate in Water Mill, New York.
            Guests moved between a jewelry showcase, a poolside lounge and a sailcloth tent, and the music ran from golden
            hour through a full dance floor after dark.
          </p>
          <p>
            It was a brand event rather than a store opening, but the brief was the same one a store gives: music that fits
            the label, stays out of the way of conversation, and builds when the room is ready.
            See the photos and video on the <Link to="/hamptons-luxury-dj" style={{ color: 'var(--gold)' }}>Hamptons page</Link>.
          </p>
        </>,
        note: <>Photo: Linsey Kromer.</>,
      }}
      included={[
        ['Sound system', 'Speakers sized to the sales floor, aimed away from the counter'],
        ['Wireless microphones', 'For a ribbon cutting, welcome or raffle'],
        ['Compact setup', 'One six-foot table; two standard 15-amp circuits'],
        ['Planning call', 'Brand mood, timeline and a do-not-play list'],
        ['Clean music', 'Radio edits only, at a volume people can shop and talk over'],
        ['Paperwork', 'Written contract, certificate of insurance and W-9'],
        ['Travel', 'Included in New York City; quoted up front as its own line elsewhere'],
      ]}
      faq={FAQ}
      links={<>
        More: <Link to="/corporate-event-dj-nyc-nj-ct" style={{ color: 'var(--gold)' }}>corporate event DJ in NYC</Link>
        {' · '}<Link to="/hamptons-luxury-dj" style={{ color: 'var(--gold)' }}>Hamptons events</Link>
        {' · '}<Link to="/planners" style={{ color: 'var(--gold)' }}>stage plot and power for planners</Link>
        {' · '}<Link to="/song-request-qr-code" style={{ color: 'var(--gold)' }}>song request QR card</Link>
      </>}
      bookingEventType="Corporate Event / Holiday Party"
      calcEvent="corporate"
      formName="retail_event"
      serviceType="DJ for store openings and retail brand events"
      areaServed={[
        { '@type': 'City', name: 'New York City' },
        { '@type': 'City', name: 'Brooklyn' },
        { '@type': 'City', name: 'Jersey City' },
        { '@type': 'State', name: 'New Jersey' },
      ]}
      breadcrumb={[
        { name: 'Corporate Event DJ', path: '/corporate-event-dj-nyc-nj-ct' },
        { name: 'Store Openings and Retail Events', path: '/store-opening-retail-event-dj-nyc' },
      ]}
    />
  );
}
