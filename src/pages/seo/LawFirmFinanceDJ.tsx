import { Link } from 'react-router-dom';
import LocalLanding, { type FaqItem } from '../../components/LocalLanding';

// /law-firm-finance-event-dj-nyc: no competitor has a page for law firm or
// finance events (Nov 2026), and AI assistants do not name DJ DX for "DJ for a
// law firm holiday party in New York" on two of three engines. The proof here is
// real: NautaDutilh at 620 Loft & Garden (June 2, 2026, Soul Shades, 175 guests,
// quotes from the firm) and the LS Power in-office reception (September 2026).
// Both clients are already named on the site with permission. Do not add other
// firm names without the user's OK.

const FAQ: FaqItem[] = [
  { q: 'Do you DJ law firm holiday parties and partner events in New York?', a: 'Yes. In June 2026 DJ DX and violinist Julie Schatz played a 175-guest rooftop reception for the international law firm NautaDutilh at 620 Loft & Garden, Rockefeller Center. Holiday parties, summer associate events, client receptions and partner dinners are all covered, in the office or at a venue.' },
  { q: 'How much does a DJ cost for a law firm or finance event in NYC?', a: 'Corporate packages are published: Essentials is from $2,800 for up to 5 hours, Signature is from $4,500 with lighting and a second sound zone, and Production is from $8,000 for up to 6 hours with live violin or piano and videography. Travel inside New York City is included.' },
  { q: 'Is the music appropriate for partners, clients and staff in one room?', a: 'Yes. Corporate sets use radio edits only. The first part of the night stays at talking volume, and the dance floor opens only when the room is ready. You can send a do-not-play list, and after the event you get a Set Receipt listing every song that was played.' },
  { q: 'Can you work with our procurement and vendor onboarding?', a: 'Yes. Every booking has a written contract. A certificate of insurance is issued to match your building or venue requirements, and a W-9 is available for vendor setup. A 50% deposit holds the date and the balance is due 14 days before the event.' },
  { q: 'Can you set up inside our office?', a: 'Yes. In September 2026 DJ DX played an in-office reception for LS Power in its own Midtown Manhattan event space, with the full DJ setup and sound brought onto a working office floor. Send the building rules for load-in, freight elevators and end time, and the setup is planned around them.' },
  { q: 'Can we add live music for a client reception?', a: 'Yes. Soul Shades pairs the DJ set with live violin from Julie Schatz, and it is included in the Production package. It suits receptions where the first hour is conversation and the music needs to feel like part of the room.' },
];

export default function LawFirmFinanceDJ() {
  return (
    <LocalLanding
      path="/law-firm-finance-event-dj-nyc"
      title="Law Firm & Finance Event DJ NYC | Holiday Parties | DJ DX"
      description="DJ for law firm and finance holiday parties, client receptions and in-office events in NYC. Played for NautaDutilh and LS Power. From $2,800. COI and W-9 ready."
      heroImage="/nautadutilh-dj-dx-620-loft-garden-nyc.jpg"
      heroAlt="DJ DX performing at a law firm reception on the 620 Loft & Garden rooftop at Rockefeller Center, St. Patrick's Cathedral behind"
      overline="Law firms, finance and professional services"
      h1={<>Law Firm and Finance Event DJ <span>in New York City</span></>}
      answer={<>
        DJ DX plays holiday parties, client receptions and in-office events for law firms and financial firms in New York.
        Recent clients include the law firm NautaDutilh and the energy investment firm LS Power. Packages start at $2,800, with a
        contract, a certificate of insurance and a W-9 ready for your vendor file.
      </>}
      localHeading={<>A Room Full of Partners, Clients <span>and First-Years</span></>}
      local={<>
        <p style={{ marginBottom: '16px' }}>
          Firm events have a narrower margin for error than most parties. Partners are hosting clients. Associates are in
          the room with the people who review them. Nobody wants a DJ who talks too much, plays the unedited version, or
          turns it up before anyone has finished a conversation.
        </p>
        <p style={{ marginBottom: '16px' }}>
          So the night is built in stages. Arrival and the first hour are soul, house and R&amp;B at a level
          people can talk over. Remarks from the managing partner or the host get a clean microphone, a quiet room and an
          introduction. The dance floor opens later, and only if the room wants one.
        </p>
        <p>
          The paperwork is treated the same way. Rates are <Link to="/pricing" style={{ color: 'var(--gold)' }}>published</Link>,
          the contract is written, and the insurance certificate and W-9 are sent when your office asks for them.
          The <Link to="/planners" style={{ color: 'var(--gold)' }}>planner sheet</Link> has the stage plot, power and load-in needs for your facilities team.
        </p>
      </>}
      planning={{
        heading: <>Planning a Firm <span>Event</span></>,
        items: [
          ['Decide what the first hour is for.', 'If it is client conversation, say so. The volume and the music are set for it.'],
          ['List the remarks.', 'Who speaks, in what order, and whether they want walk-up music. Wireless microphones are included.'],
          ['Send a do-not-play list.', 'Artists, songs or whole genres. The Set Receipt after the event shows it was followed.'],
          ['Check the building.', 'Load-in window, freight elevator, security list and end time. A certificate of insurance is issued to match the building\'s wording.'],
          ['Ask the room what it wants.', 'The free office party music poll collects genres and requests anonymously, so the music fits the people who are actually coming.'],
          ['Keep the timeline live.', 'The run of show is a link the organizer edits from a phone. If the host runs late, the change reaches the DJ booth in seconds.'],
        ],
      }}
      proof={{
        overline: 'Law firm reception, June 2, 2026',
        title: <>NautaDutilh at <span>620 Loft &amp; Garden</span></>,
        image: { src: '/nautadutilh-dj-booth-cathedral-nyc.jpg', alt: "DJ DX at the booth during the NautaDutilh reception on the 620 Loft & Garden rooftop, with St. Patrick's Cathedral and the Manhattan skyline behind" },
        body: <>
          <p style={{ marginBottom: '16px' }}>
            On June 2, 2026, DJ DX and violinist Julie Schatz played a 175-guest reception for the international law firm
            NautaDutilh on the rooftop of 620 Loft &amp; Garden at Rockefeller Center, facing St. Patrick's Cathedral. They
            performed as Soul Shades, with live violin over the DJ set, from cocktail hour through the after-party.
          </p>
          <blockquote style={{ borderLeft: '2px solid var(--gold)', paddingLeft: '14px', margin: '0 0 16px' }}>
            <p style={{ fontStyle: 'italic', marginBottom: '6px' }}>&ldquo;Your performance set the tone for our event, and the addition of the violin amplified our guests' experience and made the evening memorable.&rdquo;</p>
            <cite style={{ fontStyle: 'normal', fontSize: '0.88rem', color: 'rgba(242,242,242,0.6)' }}>Anna Naraine, NautaDutilh New York P.C.</cite>
          </blockquote>
          <blockquote style={{ borderLeft: '2px solid var(--gold)', paddingLeft: '14px', margin: 0 }}>
            <p style={{ fontStyle: 'italic', marginBottom: '6px' }}>&ldquo;The music was just perfect and the vibe was great. I love the uniqueness of keyboard and violin together with DJing — I don't think there are a lot of DJs who come with this built into the duo.&rdquo;</p>
            <cite style={{ fontStyle: 'normal', fontSize: '0.88rem', color: 'rgba(242,242,242,0.6)' }}>Sue Krebs, NautaDutilh New York P.C.</cite>
          </blockquote>
        </>,
        note: <>Both quotes are about the Soul Shades DJ and live violin booking. More on the room: <Link to="/venues/620-loft-garden-rockefeller-center" style={{ color: 'var(--gold)' }}>620 Loft &amp; Garden</Link>.</>,
      }}
      included={[
        ['Sound system', 'Professional speakers sized to your room and headcount'],
        ['Wireless microphones', 'Two, for welcome remarks, toasts and awards'],
        ['MC announcements', 'Speaker introductions and run-of-show calls, kept brief'],
        ['Planning call', 'Timeline, do-not-play list and how the night should build'],
        ['Clean music', 'Radio edits only, at a volume people can talk over'],
        ['Set Receipt', 'Every song played, checked against your must-play and do-not-play lists'],
        ['Paperwork', 'Written contract, certificate of insurance and W-9'],
      ]}
      faq={FAQ}
      links={<>
        More: <Link to="/corporate-event-dj-nyc-nj-ct" style={{ color: 'var(--gold)' }}>corporate event DJ in NYC</Link>
        {' · '}<Link to="/holiday-party-dj-nyc-nj-ct" style={{ color: 'var(--gold)' }}>office holiday party DJ</Link>
        {' · '}<Link to="/office-holiday-party-budget-calculator" style={{ color: 'var(--gold)' }}>holiday party budget calculator</Link>
        {' · '}<Link to="/violin-dj-duo-nyc-nj" style={{ color: 'var(--gold)' }}>DJ and live violin duo</Link>
      </>}
      bookingEventType="Corporate Event / Holiday Party"
      calcEvent="corporate"
      formName="law_firm_finance"
      serviceType="Corporate event DJ for law firms and financial firms"
      areaServed={[
        { '@type': 'City', name: 'New York City' },
        { '@type': 'City', name: 'Manhattan' },
        { '@type': 'City', name: 'Jersey City' },
        { '@type': 'State', name: 'New Jersey' },
      ]}
      breadcrumb={[
        { name: 'Corporate Event DJ', path: '/corporate-event-dj-nyc-nj-ct' },
        { name: 'Law Firm and Finance Events', path: '/law-firm-finance-event-dj-nyc' },
      ]}
    >
      {/* ── SECOND REAL BOOKING: in-office reception ── */}
      <section style={{ padding: '72px 24px 0' }}>
        <div className="section-inner" style={{ maxWidth: '860px' }}>
          <div className="sec-overline"><span className="sec-label">In-office reception, September 2026</span></div>
          <h2 className="sec-title" style={{ marginBottom: '18px' }}>LS Power, <span>Midtown Manhattan</span></h2>
          <div style={{ color: 'rgba(242,242,242,0.68)', fontSize: '1rem', lineHeight: 1.8 }}>
            <p style={{ marginBottom: '16px' }}>
              In September 2026 DJ DX played an in-office reception for the energy investment firm LS Power in its own Midtown
              Manhattan event space. The full DJ setup and sound came onto a working office floor. The night opened with
              house and soul at talking volume and built into an open dance floor as the room filled.
            </p>
            <blockquote style={{ borderLeft: '2px solid var(--gold)', paddingLeft: '14px', margin: 0 }}>
              <p style={{ fontStyle: 'italic', marginBottom: '6px' }}>&ldquo;The music selection was well suited for the event, you read the crowd perfectly, and everyone had a great time.&rdquo;</p>
              <cite style={{ fontStyle: 'normal', fontSize: '0.88rem', color: 'rgba(242,242,242,0.6)' }}>Senior Office Manager, LS Power</cite>
            </blockquote>
          </div>
        </div>
      </section>
    </LocalLanding>
  );
}
