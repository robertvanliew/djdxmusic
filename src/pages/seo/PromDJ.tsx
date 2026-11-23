import { Link } from 'react-router-dom';
import LocalLanding, { type FaqItem } from '../../components/LocalLanding';

// /prom-dj-nyc-nj: school proms and private proms / after-proms.
// Search Console (Aug-Nov 2026): "prom djs for hire new york" and "prom djs
// new york" had ~360 impressions at positions 38-55 with no page aimed at them.
// DJ DX has not played a prom yet (confirmed with the user 2026-11-23), so the
// page makes NO claim of past proms. The proof section is a clearly labelled
// example timeline, not an event. Price: from $1,500, the published teen-event
// rate in public/pricing.txt, confirmed for proms by the user.

const FAQ: FaqItem[] = [
  { q: 'How much does a prom DJ cost in NYC?', a: 'DJ DX proms start at $1,500, the same starting rate as Sweet 16s and other teen events, with sound sized to the venue, wireless mics and announcements included. Our 2026 pricing report puts teen event DJ quotes across NYC, New Jersey and Connecticut at $1,000 to $3,000. Send the date, venue, headcount and hours for an itemized quote within 24 hours.' },
  { q: 'Is the music clean?', a: 'Yes. Prom sets use radio edits only, every song. The school or host can send a do-not-play list, and requests that are not appropriate for the room are skipped without a scene.' },
  { q: 'Can you work with our school\'s paperwork?', a: 'Yes. A written contract, an itemized invoice the school can pay, a W-9, and a certificate of insurance issued to match the venue or the district\'s wording.' },
  { q: 'Can students request songs?', a: 'Yes. Students can send requests before the night through the planning form, and on the night a song request QR code on each table lets them see what is playing and ask for the next one. Every request is screened for clean versions.' },
  { q: 'Do you DJ private proms and after-proms?', a: 'Yes. Families and groups of students host their own prom or after-prom at a house, a rented room or a venue. The same clean-edit rule applies, and the parent or host on the contract sets the end time and volume.' },
  { q: 'Can you announce prom court?', a: 'Yes. Wireless mics and MC announcements are included, so the DJ can run the grand entrance, the prom court announcement and the last dance, or hand the mic to a teacher or student host.' },
  { q: 'How far ahead should we book a prom DJ?', a: 'Aim for three to six months out. Prom season runs April through June, and Friday and Saturday nights in May fill first. A written contract and a 50% deposit hold your date.' },
  { q: 'Do you travel to New Jersey and the Hudson Valley?', a: 'Yes. Travel within New York City is included. New Jersey, Long Island, Westchester and Hudson Valley proms have travel quoted up front as its own line.' },
];

export default function PromDJ() {
  return (
    <LocalLanding
      path="/prom-dj-nyc-nj"
      title="Prom DJ for Hire NYC & NJ, From $1,500 | DJ DX"
      description="Prom DJ for New York and New Jersey schools and private after-proms. Clean edits only, current hits, COI and W-9 for the school. From $1,500."
      heroImage="/epk-hero.jpg"
      heroAlt="DJ DX performing behind the decks"
      overline="School proms and after-proms"
      h1={<>Prom DJ for Hire in <span>NYC and NJ</span></>}
      answer={<>
        DJ DX plays school proms and private after-proms in New York and New Jersey, with clean edits only and the songs
        students are actually listening to. Proms start at $1,500 with sound, wireless mics and announcements included,
        plus a certificate of insurance and W-9 for the school. Send your date and you will have a quote within 24 hours.
      </>}
      localHeading={<>Two Kinds of <span>Prom</span></>}
      local={<>
        <p style={{ marginBottom: '16px' }}>
          <strong>School proms</strong> are booked by a student council, a PTA or an administrator, and they come with rules:
          a venue contract, a district insurance requirement, a hard end time, chaperones, and a principal who will hear every
          lyric. The music is radio edits only. The volume leaves room for teachers to talk. The paperwork, an invoice, a W-9 and
          a certificate of insurance in the district&apos;s wording, arrives before anyone has to chase it.
        </p>
        <p style={{ marginBottom: '16px' }}>
          <strong>Private proms and after-proms</strong> are thrown by families or a group of students at a house, a rented room or
          a venue. The parent on the contract sets the rules, and the night runs later and looser while staying clean.
        </p>
        <p>
          Either way, the set is current: hip-hop, pop, Afrobeats, Latin and the songs blowing up this month, with a few
          throwbacks for the chaperones. It is the same clean, current approach DJ DX brings to{' '}
          <Link to="/sweet-16-dj-nyc-nj" style={{ color: 'var(--gold)' }}>Sweet 16s</Link>.
        </p>
      </>}
      planning={{
        heading: <>Planning a <span>Prom</span></>,
        items: [
          ['Book early.', 'Prom season runs April through June, and May Fridays and Saturdays go first. Three to six months out is safe.'],
          ['Get the venue rules.', 'Load-in time, power, sound limits and the end time. Send them over and the setup is planned around them.'],
          ['Sort the paperwork once.', 'Ask the district or venue what the certificate of insurance has to say, and who pays the invoice.'],
          ['Collect requests early.', 'Students send songs before the night. Clean versions are checked in advance, so nothing gets cut off mid-song.'],
          ['Script the big moments.', 'Grand entrance, prom court, a slow dance, the last song. Decide who is on the mic for each.'],
          ['Plan the end.', 'Buses, rides and curfews set the real end time. The last song is planned for it.'],
        ],
      }}
      proof={{
        overline: 'Example timeline, not a past event',
        title: <>A Sample <span>Four-Hour Prom</span></>,
        image: { src: '/epk-hero.jpg', alt: 'DJ DX performing behind the decks' },
        body: <>
          <ul className="vn-list" style={{ marginBottom: '16px' }}>
            <li><strong>7:00</strong> Arrivals and photos, music at talking volume</li>
            <li><strong>7:45</strong> Grand entrance on the mic</li>
            <li><strong>8:00</strong> Dinner or buffet, background mix</li>
            <li><strong>8:45</strong> Dance floor opens</li>
            <li><strong>10:00</strong> Prom court announcement and their dance</li>
            <li><strong>10:45</strong> Last dance and send-off</li>
          </ul>
          <p>
            This is an example, built with the school or host on a planning call. Share it as a live{' '}
            <Link to="/live-run-of-show" style={{ color: 'var(--gold)' }}>run of show</Link> so changes on the night reach the DJ booth.
          </p>
        </>,
      }}
      included={[
        ['Sound system', 'Speakers sized to the venue and headcount'],
        ['Wireless microphones', 'For the grand entrance, prom court and announcements'],
        ['MC announcements', 'Run by the DJ, or hand the mic to a student host'],
        ['Planning call', 'Timeline, request list and do-not-play list'],
        ['Clean music', 'Radio edits only, every song'],
        ['Song requests', 'Free request QR code for the tables'],
        ['Paperwork', 'Written contract, invoice, W-9 and COI'],
      ]}
      faq={FAQ}
      links={<>
        More: <Link to="/sweet-16-dj-nyc-nj" style={{ color: 'var(--gold)' }}>Sweet 16 DJ</Link>
        {' · '}<Link to="/sweet-16-dj-hudson-valley-ny" style={{ color: 'var(--gold)' }}>Hudson Valley Sweet 16 DJ</Link>
        {' · '}<Link to="/song-request-qr-code" style={{ color: 'var(--gold)' }}>song request QR code</Link>
        {' · '}<Link to="/private-party-dj-nyc-nj" style={{ color: 'var(--gold)' }}>private party DJ</Link>
      </>}
      bookingEventType="Prom / School Dance"
      calcEvent="sweet16"
      formName="prom_dj"
      serviceType="Prom DJ"
      areaServed={[
        { '@type': 'City', name: 'New York City' },
        { '@type': 'State', name: 'New Jersey' },
        { '@type': 'AdministrativeArea', name: 'Long Island' },
        { '@type': 'AdministrativeArea', name: 'Westchester County' },
        { '@type': 'AdministrativeArea', name: 'Hudson Valley' },
      ]}
      breadcrumb={[
        { name: 'Sweet 16 DJ', path: '/sweet-16-dj-nyc-nj' },
        { name: 'Prom DJ', path: '/prom-dj-nyc-nj' },
      ]}
    />
  );
}
