import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import SiteNav from '../components/SiteNav';
import SiteFooter from '../components/SiteFooter';
import StickyMobileCTA from '../components/StickyMobileCTA';
import AuthorBio from '../components/AuthorBio';
import BookingForm from '../components/BookingForm';
import ShowCreateForm from '../components/ShowCreateForm';
import '../show.css';
import '../liveshow.css';

// /song-request-qr-code: the public, indexable explainer for the guest QR page
// (/live/:id, noindex). Creating one makes a live run of show; the QR card is
// printed from its edit or booth link. The phone preview is a labelled sample.

const URL = 'https://djdxmusic.com/song-request-qr-code';
const TITLE = 'Song Request QR Code for Weddings & Events (Free) | DJ DX';
const DESC = 'A free QR card for your event: guests scan to see what song is playing, save it to Spotify or Apple Music, request songs and get the set list after.';

const FAQ = [
  { q: 'Is the song request QR code free?', a: 'Yes. It is part of the free live run of show from DJ DX. Create one below, open your link, and print the table card. You do not need to book DJ DX to use it.' },
  { q: 'Do guests need to download an app?', a: 'No. The QR code opens a web page in the phone camera. Guests see the song that is playing, tap to open it in Spotify or Apple Music, and can send a request if you have requests turned on.' },
  { q: 'How does the page know what song is playing?', a: 'It reads the DJ\'s Serato DJ Pro Live Playlist, which records each track as it plays. DJ DX sets this up for every event he plays. If your DJ uses Serato, they paste their public Live Playlist link on the booth screen. Song requests and the set list email work either way.' },
  { q: 'Can I turn song requests off?', a: 'Yes. Requests are off until you or the DJ switch them on. Many office parties and galas leave them off and use the page only for "what song is this?" and the set list.' },
  { q: 'Will guests see our company or couple\'s name?', a: 'Only if you choose to. Guests see "Live set" and the date unless you type a different name for the guest page. The page is private: it is not listed on Google and only people with the QR code can open it.' },
  { q: 'What do guests get after the event?', a: 'When the DJ sends the Set Receipt after the last song, the same QR link turns into the full set list, every song in order. Guests who left their email get it once, with links to save each song. Their addresses are not kept or added to any list.' },
];

export default function SongRequestQR() {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  const schema = [
    { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Song Request QR Code', url: URL, applicationCategory: 'EntertainmentApplication', operatingSystem: 'Any (web browser)', offers: { '@type': 'Offer', price: 0, priceCurrency: 'USD' }, provider: { '@id': 'https://djdxmusic.com/#djdx' }, description: 'A free printable QR card for events. Guests see the song the DJ is playing, save it to Spotify or Apple Music, send song requests and get the full set list after the event.' },
    { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: FAQ.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) },
    { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://djdxmusic.com/' },
      { '@type': 'ListItem', position: 2, name: 'Live Run of Show', item: 'https://djdxmusic.com/live-run-of-show' },
      { '@type': 'ListItem', position: 3, name: 'Song Request QR Code', item: URL },
    ] },
  ];
  return (
    <>
      <Helmet>
        <title>{TITLE}</title>
        <meta name="description" content={DESC} />
        <link rel="canonical" href={URL} />
        <meta property="og:title" content="Song Request QR Code for Weddings & Events | DJ DX" />
        <meta property="og:description" content={DESC} />
        <meta property="og:url" content={URL} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </Helmet>
      <SiteNav />
      <main className="vn-main">
        <div className="vn-inner">
          <nav className="vn-crumbs" aria-label="Breadcrumb"><Link to="/live-run-of-show">Live Run of Show</Link> / Song Request QR Code</nav>
          <div className="sec-overline"><span className="sec-label">Free for any event</span></div>
          <h1 className="sec-title vn-h1">Song request QR code <span>for weddings and events</span></h1>
          <p className="vn-p vn-lead">
            Put one card on the bar or the DJ booth. Guests scan it to see what song is playing, save it to Spotify or Apple Music
            in one tap, send a request, and get the full set list after the last song. No app, no sign-up.
          </p>
          <p className="vn-p"><a href="#create" className="btn-gold">Make my QR card</a></p>

          <section className="vn-sec" aria-label="Sample guest page">
            <div className="sq-demo">
              <div className="sh-card gl-now">
                <span className="sh-badge">Sample · Live now</span>
                <h2 className="gl-h3">What song is this?</h2>
                <p className="gl-now-title">Lovely Day</p>
                <p className="gl-now-artist">Bill Withers</p>
                <span className="gl-links"><span>Spotify</span><span>Apple Music</span></span>
                <h3 className="gl-h3">Just played</h3>
                <ol className="gl-list">
                  <li><time>00:41</time><span className="gl-song">Earth, Wind &amp; Fire - September</span></li>
                  <li><time>00:37</time><span className="gl-song">Whitney Houston - I Wanna Dance with Somebody</span></li>
                </ol>
              </div>
              <div className="sq-steps">
                <h2 className="vn-h2">How it works</h2>
                <ol className="pl-list">
                  <li><strong>Create it below</strong><span>Event name, date and your email. You get a private link to your live run of show.</span></li>
                  <li><strong>Print the table card</strong><span>Your link has a QR code and a one-tap print button. Put it on the booth, the bar or each table.</span></li>
                  <li><strong>Guests scan</strong><span>They see the song playing now and the last few, and can request songs if you switch requests on.</span></li>
                  <li><strong>After the last song</strong><span>The same QR link becomes the night's set list, and guests who asked get it by email.</span></li>
                </ol>
              </div>
            </div>
          </section>

          <section className="vn-sec">
            <h2 className="vn-h2">Why guests use it</h2>
            <p className="vn-p">
              At every party someone walks up to the booth to ask what song is playing. Usually it is the one record the room went
              loudest for. With the card, they find it themselves, save it, and the DJ keeps mixing. After the event, people come
              back looking for "that song around 10:40", and the set list has it with the time it played.
            </p>
            <p className="vn-p">
              For the host, requests arrive on the DJ's booth screen instead of over their shoulder, and you decide whether requests
              are on at all. Office parties often leave them off. Weddings often turn them on after dinner.
            </p>
          </section>

          <section className="vn-sec" id="create">
            <h2 className="vn-h2">Create your song request QR code</h2>
            <p className="vn-p">Free. Works with DJ DX or any DJ. Your QR card and the requests switch are on the page this opens.</p>
            <ShowCreateForm idp="sq" cta="Create my QR card" source="song-request-qr" />
          </section>

          <section className="vn-sec" id="faq">
            <h2 className="vn-h2">Questions</h2>
            {FAQ.map(f => <div key={f.q} className="pl-faq"><h3>{f.q}</h3><p className="vn-p">{f.a}</p></div>)}
          </section>

          <section className="vn-sec">
            <h2 className="vn-h2">More free planning tools</h2>
            <p className="vn-p">
              <Link to="/live-run-of-show">Live run of show and Set Receipt</Link> ·{' '}
              <Link to="/office-party-music-poll">Office party music poll</Link> ·{' '}
              <Link to="/office-holiday-party-budget-calculator">Office holiday party budget planner</Link> ·{' '}
              <Link to="/wedding-entrance-songs">Wedding entrance song finder</Link> ·{' '}
              <Link to="/last-dance-songs-wedding">Last dance song finder</Link>
            </p>
          </section>
        </div>
      </main>

      <section id="booking" className="booking" style={{ padding: '80px 24px' }}>
        <div className="section-inner">
          <div className="booking-layout">
            <div className="booking-left">
              <div className="sec-overline"><span className="sec-label">Check a Date</span></div>
              <h2 className="sec-title">Want a DJ who <span>sets it all up?</span></h2>
              <p style={{ color: 'rgba(242,242,242,0.55)', lineHeight: 1.8, marginTop: '16px' }}>
                Every DJ DX event includes the guest QR card, the live run of show and a Set Receipt of every song played. Send your date and you hear back within 24 hours.
              </p>
            </div>
            <div className="booking-right">
              <BookingForm formName="song_request_qr" />
            </div>
          </div>
        </div>
      </section>
      <AuthorBio />
      <StickyMobileCTA formName="song_request_qr_sticky" label="Check My Date" />
      <SiteFooter />
    </>
  );
}
