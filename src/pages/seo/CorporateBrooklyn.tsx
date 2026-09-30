import { Link } from 'react-router-dom';
import LocalLanding, { type FaqItem } from '../../components/LocalLanding';

// Noindex until the venue and case study placeholders below are filled with
// real, confirmed details. Then set NOINDEX to false and add the URL to
// public/sitemap.xml.
const NOINDEX = true;

const VENUES = [
  '[VENUE NAME: fill in], [NEIGHBORHOOD: fill in]',
  '[VENUE NAME: fill in], [NEIGHBORHOOD: fill in]',
  '[VENUE NAME: fill in], [NEIGHBORHOOD: fill in]',
];

const CASE_STUDY = {
  title: '[BROOKLYN CASE STUDY TITLE: fill in]',
  body: '[BROOKLYN CASE STUDY: event type, venue or neighborhood, guest count, what the night needed, and how it went. Real event only: fill in]',
};

const FAQ: FaqItem[] = [
  { q: 'How much does a corporate event DJ cost in Brooklyn?', a: 'DJ DX corporate events start at $2,800, and travel inside the five boroughs is included in the quoted total. That price covers professional sound, a wireless microphone for speeches, MC announcements, and a planning call.' },
  { q: 'Can you handle loft and warehouse venues with tricky load-in?', a: 'Yes. A lot of Brooklyn event space sits in converted industrial buildings with freight elevators, narrow stairs, or set load-in windows. Send the venue\'s load-in rules and the setup is planned around them before the day.' },
  { q: 'Do you play rooftop office parties?', a: 'Yes. Rooftops in Williamsburg, DUMBO, and Downtown Brooklyn are some of the most requested spaces for summer parties. Outdoor rooms need the sound set up differently, and many rooftops have a hard music cutoff, so both are covered on the planning call.' },
  { q: 'Is the music clean for a work crowd?', a: 'Yes. Corporate sets use radio edits only, at a volume people can talk over during the reception. Send a do-not-play list if you have one, and it will be followed.' },
  { q: 'Do you provide a COI for Brooklyn venues?', a: 'Yes. Many Brooklyn event spaces ask vendors for a certificate of insurance. Send the venue\'s requirements and the COI is issued to match. A W-9 is also available for your accounts payable team.' },
];

export default function CorporateBrooklyn() {
  return (
    <LocalLanding
      path="/corporate-event-dj-brooklyn-ny"
      title="Corporate Event DJ Brooklyn, NY | Office Parties & Events"
      description="Brooklyn-based corporate event DJ for office parties, client events and holiday parties in DUMBO, Williamsburg, Navy Yard and beyond. Quote in 24 hours."
      noindex={NOINDEX}
      heroImage="/corporate-event-dj-booth-manhattan-nyc.jpg"
      heroAlt="Corporate event DJ booth set up for a company party"
      overline="Brooklyn, NY"
      h1={<>Corporate Event DJ <span>in Brooklyn</span></>}
      answer={<>
        DJ DX is a Brooklyn-based corporate event DJ for office parties, client events, and holiday parties across the borough.
        Corporate events start at $2,800, with sound, a wireless mic, and MC announcements included and travel inside NYC
        already in the price. You get a quote within 24 hours.
      </>}
      localHeading={<>Based in <span>Brooklyn</span></>}
      local={<>
        <p style={{ marginBottom: '16px' }}>
          Brooklyn company parties rarely happen in a standard ballroom. They happen in lofts, converted warehouses, rooftops,
          and the company's own floor. Each of those comes with its own problems: a freight elevator you have to book, a
          concrete room that echoes, a rooftop with a 10pm sound cutoff. Being based in Brooklyn means DJ DX plans for those
          before the day, not during it.
        </p>
        <p>
          Corporate work here covers <strong>DUMBO</strong> loft spaces under the bridges, <strong>Williamsburg</strong> rooftops
          and waterfront rooms, event space at the <strong>Brooklyn Navy Yard</strong>, office towers in <strong>Downtown
          Brooklyn</strong>, the converted warehouses of <strong>Industry City</strong>, and <strong>Greenpoint</strong> studios
          and bars. Rooftop and loft venues across the borough are the most common requests, from summer parties in June to
          holiday parties in December.
        </p>
      </>}
      venuesHeading="Brooklyn venues DJ DX has played"
      venues={VENUES}
      caseStudy={CASE_STUDY}
      included={[
        ['Sound system', 'Sized for the room, including concrete lofts and open rooftops'],
        ['Wireless microphone', 'For welcome remarks, toasts, and awards'],
        ['MC announcements', 'Speaker intros and run-of-show calls'],
        ['Planning call', 'Load-in, sound cutoff, timeline, and do-not-play list'],
        ['Clean music', 'Radio edits only, at a volume people can talk over'],
        ['Paperwork', 'Written contract, COI and W-9 on request'],
        ['Travel', 'Included for all five boroughs'],
      ]}
      faq={FAQ}
      links={<>
        More: <Link to="/corporate-event-dj-nyc-nj-ct" style={{ color: 'var(--gold)' }}>corporate event DJ in NYC, NJ and CT</Link>
        {' · '}<Link to="/holiday-party-dj-nyc-nj-ct" style={{ color: 'var(--gold)' }}>office holiday party DJ</Link>
        {' · '}<Link to="/corporate-event-dj-jersey-city-nj" style={{ color: 'var(--gold)' }}>corporate event DJ in Jersey City</Link>
      </>}
      bookingEventType="Corporate Event / Holiday Party"
      calcEvent="corporate"
      formName="corporate_brooklyn"
      serviceType="Corporate event DJ"
      areaServed={[
        { '@type': 'City', name: 'Brooklyn' },
        { '@type': 'City', name: 'New York City' },
        { '@type': 'State', name: 'New York' },
      ]}
      breadcrumb={[
        { name: 'Corporate Event DJ', path: '/corporate-event-dj-nyc-nj-ct' },
        { name: 'Brooklyn', path: '/corporate-event-dj-brooklyn-ny' },
      ]}
    />
  );
}
