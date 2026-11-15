import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import SiteNav from '../components/SiteNav';
import SiteFooter from '../components/SiteFooter';
import StickyMobileCTA from '../components/StickyMobileCTA';
import AuthorBio from '../components/AuthorBio';
import BookingForm from '../components/BookingForm';
import ShowCreateForm, { type ShowItem } from '../components/ShowCreateForm';
import { trackEvent } from '../lib/analytics';
import '../show.css';
import '../liveshow.css';

// /office-holiday-party-run-of-show: three sample timelines an office manager
// can copy, print, or open as a live run of show (the create form sends the
// chosen timeline as the starting items). The search results for "office holiday
// party run of show timeline" are solo entertainers' blog posts (Nov 2026).
// These are planning samples, labelled as such; they describe no real client.

const URL = 'https://djdxmusic.com/office-holiday-party-run-of-show';
const TITLE = 'Office Holiday Party Run of Show: 3 Sample Timelines';
const DESC = 'Free office holiday party run of show templates for 2, 3 and 4 hour parties. Copy one, print it, or open it as a live link your DJ and venue can follow.';

const TIMELINES: { key: string; label: string; blurb: string; items: ShowItem[] }[] = [
  {
    key: '2h', label: '2 hours: after-work reception', blurb: 'In the office or a bar near it. One short welcome, no formal program.',
    items: [
      { time: '5:30 PM', label: 'Doors open', note: 'Soul and R&B at talking volume while people arrive' },
      { time: '5:45 PM', label: 'Food and bar open', note: '' },
      { time: '6:15 PM', label: 'Welcome from the host', note: 'Mic 1. Two minutes. Music fades down, then back up' },
      { time: '6:20 PM', label: 'Toast', note: '' },
      { time: '6:30 PM', label: 'Open mingling', note: 'Music up a notch: songs everyone knows' },
      { time: '7:00 PM', label: 'Raffle or a short dance set', note: 'Optional. Only if the room is ready' },
      { time: '7:10 PM', label: 'Last call at the bar', note: 'Announced once, briefly' },
      { time: '7:25 PM', label: 'Last song', note: '' },
      { time: '7:30 PM', label: 'End', note: 'Hard stop if the building requires one' },
    ],
  },
  {
    key: '3h', label: '3 hours: party with remarks', blurb: 'The most common office party: a welcome from leadership, then a dance floor.',
    items: [
      { time: '6:00 PM', label: 'Doors open', note: 'Background music at talking volume' },
      { time: '6:10 PM', label: 'Bar and passed appetizers', note: '' },
      { time: '6:45 PM', label: 'Welcome from leadership', note: 'Mic 1. Walk-up song optional' },
      { time: '6:55 PM', label: 'Year in review or team shout-outs', note: 'Slides? Confirm who runs them and where the sound comes from' },
      { time: '7:10 PM', label: 'Toast, food stations open', note: '' },
      { time: '7:15 PM', label: 'Dinner and mingling', note: 'Music back to talking volume' },
      { time: '8:00 PM', label: 'Dance floor opens', note: 'Start with songs every age group knows' },
      { time: '8:40 PM', label: 'Last call at the bar', note: '' },
      { time: '8:55 PM', label: 'Last song', note: '' },
      { time: '9:00 PM', label: 'End', note: '' },
    ],
  },
  {
    key: '4h', label: '4 hours: dinner and awards', blurb: 'A seated dinner with recognitions, then dancing. Usually at a venue.',
    items: [
      { time: '6:00 PM', label: 'Doors and cocktail hour', note: 'Background music; second sound zone if cocktails are in another room' },
      { time: '7:00 PM', label: 'Guests seated, welcome', note: 'Mic 1' },
      { time: '7:10 PM', label: 'Dinner service', note: 'Low volume' },
      { time: '7:45 PM', label: 'Awards and recognitions', note: 'List of names with pronunciations. Short music sting per award is optional' },
      { time: '8:15 PM', label: 'Toast and dessert', note: '' },
      { time: '8:20 PM', label: 'Dance floor opens', note: 'Open straight after the toast, while everyone is still in the room' },
      { time: '9:15 PM', label: 'Group photo or raffle', note: 'Announce five minutes before' },
      { time: '9:40 PM', label: 'Last call at the bar', note: '' },
      { time: '9:55 PM', label: 'Last song', note: '' },
      { time: '10:00 PM', label: 'End', note: '' },
    ],
  },
];

const RULES: [string, string][] = [
  ['Put the remarks 30 to 45 minutes in.', 'Late enough that most people have arrived, early enough that the room is still quiet and nobody has to be pulled off a dance floor.'],
  ['Keep the whole program under 20 minutes.', 'Welcome, recognitions and toast together. Past that, people drift to the bar and the room is hard to win back.'],
  ['Open the dance floor right after the last planned moment.', 'A toast with everyone standing is the easiest point to start. Once people sit back down it takes much longer.'],
  ['Close the bar 15 to 20 minutes before the last song.', 'The venue gets a calm close, and the night ends on music instead of a queue.'],
  ['Give one person the authority to change the timeline.', 'Speakers run late and food comes out early. One person decides, and the DJ, venue and caterer follow that one version.'],
];

const FAQ = [
  { q: 'What is a run of show for an office holiday party?', a: 'It is the timeline of the night, written down: doors, bar, welcome, toast, dinner, dance floor, last call and end. The venue, the caterer, the DJ and whoever is speaking all work from the same list, so nobody is guessing when the remarks start.' },
  { q: 'How long should an office holiday party be?', a: 'Two to four hours covers most office parties. An after-work reception runs about two hours. A party with remarks and a dance floor runs about three. A seated dinner with awards runs about four.' },
  { q: 'When should speeches happen at a holiday party?', a: 'About 30 to 45 minutes after doors open. Most guests have arrived and have a drink, and the room is still quiet enough to listen. Keep the welcome, recognitions and toast under 20 minutes in total.' },
  { q: 'What should be on a corporate holiday party checklist?', a: 'Date and venue, headcount, a budget per person, food and bar package, the run of show, who is speaking, music and a do-not-play list, the venue\'s end time, and insurance paperwork if the building asks vendors for a certificate of insurance.' },
  { q: 'Can I use these timelines with any DJ or venue?', a: 'Yes. They are free to copy or print. If you open one as a live run of show, choose "Another DJ or band" and send them the booth link; they see every change you make within seconds.' },
  { q: 'What happens when the timeline changes on the night?', a: 'It usually does. With a live run of show you move the item from your phone and the DJ booth screen updates, with a note of what changed and when. No one has to walk across the room to pass the message.' },
];

export default function HolidayRunOfShow() {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  const [pick, setPick] = useState('3h');
  const [copied, setCopied] = useState(false);
  const t = TIMELINES.find(x => x.key === pick)!;

  const copy = async () => {
    const text = t.items.map(i => `${i.time}\t${i.label}${i.note ? `\t${i.note}` : ''}`).join('\n');
    try { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); trackEvent('ros_template_copied', { template: t.key }); } catch { /* clipboard blocked */ }
  };
  const print = () => {
    trackEvent('ros_template_printed', { template: t.key });
    document.body.classList.add('is-printing-timeline');
    const done = () => { document.body.classList.remove('is-printing-timeline'); window.removeEventListener('afterprint', done); };
    window.addEventListener('afterprint', done);
    window.print();
  };

  const schema = [
    { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: FAQ.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) },
    { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://djdxmusic.com/' },
      { '@type': 'ListItem', position: 2, name: 'Holiday Party DJ', item: 'https://djdxmusic.com/holiday-party-dj-nyc-nj-ct' },
      { '@type': 'ListItem', position: 3, name: 'Holiday Party Run of Show', item: URL },
    ] },
  ];

  return (
    <>
      <Helmet>
        <title>{TITLE}</title>
        <meta name="description" content={DESC} />
        <link rel="canonical" href={URL} />
        <meta property="og:title" content={TITLE} />
        <meta property="og:description" content={DESC} />
        <meta property="og:url" content={URL} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://djdxmusic.com/corporate-holiday-party-dj-manhattan-nyc.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </Helmet>
      <SiteNav />
      <main className="vn-main">
        <div className="vn-inner">
          <nav className="vn-crumbs" aria-label="Breadcrumb"><Link to="/holiday-party-dj-nyc-nj-ct">Holiday Party DJ</Link> / Run of Show</nav>
          <div className="sec-overline"><span className="sec-label">Free template</span></div>
          <h1 className="sec-title vn-h1">Office holiday party <span>run of show</span></h1>
          <p className="vn-p vn-lead">
            Three sample timelines for a 2, 3 or 4 hour office holiday party, with the notes a DJ and a venue need next to
            each moment. Copy one, print it, or open it as a live link you can edit from your phone on the night.
          </p>

          <section className="vn-sec" aria-label="Sample timelines">
            <div className="sf-filters" role="group" aria-label="Choose a timeline">
              <div className="sf-row">
                {TIMELINES.map(x => (
                  <button key={x.key} type="button" className={`sf-chip${pick === x.key ? ' is-on' : ''}`} aria-pressed={pick === x.key} onClick={() => { setPick(x.key); trackEvent('ros_template_picked', { template: x.key }); }}>{x.label}</button>
                ))}
              </div>
            </div>
            <div className="ros-print">
              <h2 className="vn-h2">{t.label}</h2>
              <p className="vn-p">{t.blurb} A sample to adapt, not a record of a real event.</p>
              <table className="lp-table ros-table">
                <thead><tr><th scope="col">Time</th><th scope="col">Moment</th><th scope="col">Note for the DJ and venue</th></tr></thead>
                <tbody>{t.items.map(i => <tr key={i.time + i.label}><td>{i.time}</td><td>{i.label}</td><td>{i.note}</td></tr>)}</tbody>
              </table>
              <p className="ros-print-foot">Free template from DJ DX · djdxmusic.com/office-holiday-party-run-of-show</p>
            </div>
            <div className="sf-actions">
              <a href="#create" className="btn-gold">Open it as a live run of show</a>
              <button type="button" className="btn-ghost" onClick={copy}>{copied ? 'Copied' : 'Copy the timeline'}</button>
              <button type="button" className="btn-ghost" onClick={print}>Print</button>
            </div>
          </section>

          <section className="vn-sec">
            <h2 className="vn-h2">Five rules that keep a holiday party on time</h2>
            <ol className="pl-list">{RULES.map(([k, v]) => <li key={k}><strong>{k}</strong><span>{v}</span></li>)}</ol>
          </section>

          <section className="vn-sec" id="create">
            <h2 className="vn-h2">Make it a live run of show</h2>
            <p className="vn-p">
              Free, no account. It starts with the <strong>{t.label.split(':')[0]}</strong> timeline above. You get a private link to edit it,
              a read-only link for your DJ and venue, and a QR card for guests. Works with DJ DX or any DJ.
            </p>
            <ShowCreateForm key={t.key} idp="ros" cta="Create my run of show" source="holiday-run-of-show" items={t.items} />
          </section>

          <section className="vn-sec" id="faq">
            <h2 className="vn-h2">Questions planners ask</h2>
            {FAQ.map(f => <div key={f.q} className="pl-faq"><h3>{f.q}</h3><p className="vn-p">{f.a}</p></div>)}
          </section>

          <section className="vn-sec">
            <h2 className="vn-h2">More for the holiday party</h2>
            <p className="vn-p">
              <Link to="/office-holiday-party-budget-calculator">Holiday party budget calculator</Link> ·{' '}
              <Link to="/office-party-music-poll">Office party music poll</Link> ·{' '}
              <Link to="/office-holiday-party-playlist">Office holiday party playlist</Link> ·{' '}
              <Link to="/live-run-of-show">How the live run of show works</Link> ·{' '}
              <Link to="/holiday-party-dj-nyc-nj-ct">Holiday party DJ in NYC, NJ and CT</Link> ·{' '}
              <Link to="/open-dates">Open December dates</Link>
            </p>
          </section>
        </div>
      </main>

      <section id="booking" className="booking" style={{ padding: '80px 24px' }}>
        <div className="section-inner">
          <div className="booking-layout">
            <div className="booking-left">
              <div className="sec-overline"><span className="sec-label">Check a Date</span></div>
              <h2 className="sec-title">Timeline done? <span>Book the DJ.</span></h2>
              <p style={{ color: 'rgba(242,242,242,0.55)', lineHeight: 1.8, marginTop: '16px' }}>
                Office holiday parties start at $2,800 for up to five hours in NYC, with sound, wireless microphones and MC announcements included. Send your date and you hear back within 24 hours.
              </p>
            </div>
            <div className="booking-right">
              <BookingForm formName="holiday_run_of_show" initial={{ eventType: 'Corporate Event / Holiday Party' }} />
            </div>
          </div>
        </div>
      </section>
      <AuthorBio />
      <StickyMobileCTA formName="holiday_run_of_show_sticky" label="Check My Date" />
      <SiteFooter />
    </>
  );
}
