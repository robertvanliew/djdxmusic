import { Link } from 'react-router-dom';
import LocalLanding, { type FaqItem } from '../../components/LocalLanding';
import OpenDatesStrip from '../../components/OpenDatesStrip';
import { textHref, trackTextClick, TEXT_NUMBER_DISPLAY } from '../../lib/textLink';

// /last-minute-dj-nyc: for people booking inside three weeks. Search results for
// "last minute DJ NYC" are almost all directories (Nov 2026), and December brings a
// "last minute dj nyc december" spike. The page's job is to show real dates and
// the real steps. Nothing here promises a date is open: the strip reads from
// src/data/availability.ts and live holds, and every date is confirmed by DJ DX.

const FAQ: FaqItem[] = [
  { q: 'Can I book a DJ in NYC for this weekend?', a: 'Sometimes. The dates on this page come straight from DJ DX\'s calendar, so you can see which nights are open to requests before you ask. Tap a date or text 646-470-3469 with your date, venue and hours. You hear back within 24 hours.' },
  { q: 'How fast can a last-minute booking be confirmed?', a: 'A reply comes within 24 hours with availability and a quote. The date is confirmed once the contract is signed and the 50% deposit is paid. Requesting a date holds it for you, free, for 72 hours in the meantime.' },
  { q: 'Does a last-minute DJ cost more?', a: 'No rush fee is published. Events start at $2,800 in New York City for up to five hours, with sound, wireless microphones and MC announcements included. The quote depends on the date, venue, hours and equipment, the same as any other booking.' },
  { q: 'What do you need from me to quote quickly?', a: 'The date, start and end time, venue name and address, guest count, and the kind of event. If the venue needs a certificate of insurance or has load-in rules, send those at the same time so nothing holds up the booking.' },
  { q: 'Our DJ cancelled. Can you step in?', a: 'If the date is open, yes. Send the timeline and any music notes you already gave the other DJ. A planning call is set up as soon as the date is confirmed, and the run of show can be built as a live link you edit from your phone.' },
  { q: 'Is there time to plan the music?', a: 'Yes. Even a short planning call covers the timeline, must-play songs, a do-not-play list and who speaks when. For office parties, the free music poll collects what your team wants to hear in a day.' },
];

export default function LastMinuteDJ() {
  return (
    <LocalLanding
      path="/last-minute-dj-nyc"
      title="Last-Minute DJ NYC & NJ | Open Dates This Month | DJ DX"
      description="Need a DJ in NYC or NJ in the next three weeks? See which dates DJ DX is taking requests for, hold one free for 72 hours, and get a quote within 24 hours."
      heroImage="/corporate-dj-manhattan-office-party-nyc.jpg"
      heroAlt="DJ DX behind the decks at a company party in Manhattan"
      overline="Booking inside three weeks"
      h1={<>Last-Minute DJ in <span>NYC and NJ</span></>}
      answer={<>
        Need a DJ in the next three weeks? The dates below come straight from DJ DX's calendar. Tap one to hold it free for
        72 hours, or text <a href={textHref("Hi DJ DX, I need a DJ on short notice. Date, venue and hours: ")} onClick={() => trackTextClick('last_minute_hero')} style={{ color: 'var(--gold)' }}>{TEXT_NUMBER_DISPLAY}</a>.
        Events start at $2,800 with sound, microphones and MC included.
      </>}
      afterHero={<OpenDatesStrip mode="soon" source="last_minute" heading="Dates in the Next Three Weeks" />}
      localHeading={<>How a Short-Notice Booking <span>Works</span></>}
      local={<>
        <p style={{ marginBottom: '16px' }}>
          Most last-minute searches end on a directory page with fifty profiles and no dates. This page shows the
          calendar first. If the night you need is not marked booked or on hold, request it and it is held for you while
          the quote is prepared.
        </p>
        <p style={{ marginBottom: '16px' }}>
          <strong>Step one:</strong> tap the date, or text it with the venue and the hours. <strong>Step two:</strong> you get a reply
          within 24 hours with a quote and a contract. <strong>Step three:</strong> a signed contract and a 50% deposit confirm the
          date. For events less than two weeks away, payment timing is set out in the contract.
        </p>
        <p>
          The DJ you book is the DJ who plays. DJ DX is based in Brooklyn and was born and raised in Jersey City, so a
          short-notice booking in Manhattan, Brooklyn, Queens, Jersey City or Hoboken does not depend on anyone flying in.
        </p>
      </>}
      planning={{
        heading: <>Send These Five Things <span>First</span></>,
        items: [
          ['Date and hours.', 'Start time, end time, and when the room opens for setup.'],
          ['Venue name and address.', 'Plus a contact there if you have one. Load-in, elevators and power get checked directly.'],
          ['Guest count and the kind of event.', 'An office party of 60 and a birthday of 200 need different sound.'],
          ['Insurance and building rules.', 'If the venue or building asks for a certificate of insurance, say so right away. It is available on request and is issued to match their requirements.'],
          ['Anything already planned.', 'A timeline, speeches, a first dance, a do-not-play list. Whatever exists gets folded into the run of show.'],
        ],
      }}
      proof={{
        overline: 'An example, not a past event',
        title: <>What a One-Week Booking <span>Looks Like</span></>,
        body: <>
          <p style={{ marginBottom: '16px' }}>
            This is a sample schedule so you can see the steps. It is not a description of a specific client.
          </p>
          <ul className="lp-list">
            <li><strong>Monday.</strong> You text the date, venue and hours. The date is placed on a free 72-hour hold.</li>
            <li><strong>Tuesday.</strong> Quote and contract arrive by email. You sign and pay the deposit, which confirms the date.</li>
            <li><strong>Wednesday.</strong> Planning call: timeline, speeches, must-plays and do-not-plays. You get a live run of show link you can edit from your phone.</li>
            <li><strong>Thursday.</strong> Venue details are confirmed: load-in time, power, and a certificate of insurance if the building needs one.</li>
            <li><strong>Saturday.</strong> Setup before guests arrive. After the last song you get a Set Receipt listing every song played.</li>
          </ul>
        </>,
      }}
      included={[
        ['Sound system', 'Professional speakers sized to your room and headcount'],
        ['Wireless microphones', 'For toasts, speeches and announcements'],
        ['MC announcements', 'Introductions and timeline calls'],
        ['Planning call', 'Timeline, must-plays and a do-not-play list, even on a short runway'],
        ['Live run of show', 'A link you edit from your phone; changes reach the DJ booth in seconds'],
        ['Paperwork', 'Written contract, COI and W-9 on request'],
        ['Travel', 'Included in New York City; quoted up front as its own line elsewhere'],
      ]}
      faq={FAQ}
      links={<>
        More: <Link to="/open-dates" style={{ color: 'var(--gold)' }}>every open date through New Year's Eve</Link>
        {' · '}<Link to="/holiday-party-dj-nyc-nj-ct" style={{ color: 'var(--gold)' }}>office holiday party DJ</Link>
        {' · '}<Link to="/dj-for-hire-nyc" style={{ color: 'var(--gold)' }}>DJ for hire in NYC</Link>
        {' · '}<Link to="/live-run-of-show" style={{ color: 'var(--gold)' }}>live run of show</Link>
      </>}
      bookingEventType=""
      calcEvent="private"
      formName="last_minute"
      serviceType="Event DJ, short-notice bookings"
      areaServed={[
        { '@type': 'City', name: 'New York City' },
        { '@type': 'City', name: 'Jersey City' },
        { '@type': 'City', name: 'Hoboken' },
        { '@type': 'State', name: 'New Jersey' },
      ]}
      breadcrumb={[
        { name: 'DJ for Hire NYC', path: '/dj-for-hire-nyc' },
        { name: 'Last-Minute DJ', path: '/last-minute-dj-nyc' },
      ]}
    />
  );
}
