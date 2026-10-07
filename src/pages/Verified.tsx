import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import SiteNav from '../components/SiteNav';
import SiteFooter from '../components/SiteFooter';
import { buildPassport, DID } from '../data/passport';

// DJ DX at a glance: the human view of the signed Verified Business Passport.
// Same data as /.well-known/business.json (both come from buildPassport()), so
// the page and the machine-readable file can never disagree. The browser
// checks the passport's Ed25519 signature against the did:web key live.

type Check = 'checking' | 'valid' | 'invalid' | 'unsupported';
type Attestation = { event: string; venue: string; date: string; slug?: string; confirmedAt: string; displayName?: string; quote?: string };

const b64uToBytes = (s: string) => Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((s.length + 3) % 4)), c => c.charCodeAt(0));
const bytesToB64u = (b: Uint8Array) => btoa(String.fromCharCode(...b)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

async function verifyPassport(): Promise<Check> {
  try {
    if (!crypto?.subtle) return 'unsupported';
    const [body, jws, did] = await Promise.all([
      fetch('/.well-known/business.json', { cache: 'no-store' }).then(r => r.arrayBuffer()),
      fetch('/.well-known/business.jws', { cache: 'no-store' }).then(r => r.text()),
      fetch('/.well-known/did.json', { cache: 'no-store' }).then(r => r.json()),
    ]);
    const [h, , s] = jws.trim().split('.');
    const jwk = did.verificationMethod[0].publicKeyJwk;
    const key = await crypto.subtle.importKey('jwk', jwk, { name: 'Ed25519' }, false, ['verify']);
    const signingInput = new TextEncoder().encode(`${h}.${bytesToB64u(new Uint8Array(body))}`);
    return (await crypto.subtle.verify({ name: 'Ed25519' }, key, b64uToBytes(s), signingInput)) ? 'valid' : 'invalid';
  } catch (e) {
    return e instanceof Error && /Algorithm|NotSupported|Unrecognized/i.test(e.name + e.message) ? 'unsupported' : 'invalid';
  }
}

export default function Verified() {
  const p = buildPassport();
  const [check, setCheck] = useState<Check>('checking');
  const [attest, setAttest] = useState<Attestation[]>([]);
  useEffect(() => { window.scrollTo(0, 0); verifyPassport().then(setCheck); }, []);
  useEffect(() => { fetch('/api/attest').then(r => r.ok ? r.json() : { attestations: [] }).then(d => setAttest(d.attestations || [])).catch(() => {}); }, []);

  const money = (n: number) => `$${n.toLocaleString('en-US')}`;
  const sp = p.pricing.startingPrices;
  const schema = [
    {
      '@context': 'https://schema.org', '@type': 'ProfilePage', name: 'DJ DX at a glance', url: 'https://djdxmusic.com/verified',
      mainEntity: { '@id': 'https://djdxmusic.com/#djdx' }, about: { '@id': 'https://djdxmusic.com/#service' },
      significantLink: ['https://djdxmusic.com/.well-known/business.json', 'https://djdxmusic.com/.well-known/did.json', 'https://djdxmusic.com/.well-known/agent-card.json'],
    },
  ];

  return (
    <>
      <Helmet>
        <title>DJ DX at a Glance | Verified Business Facts</title>
        <meta name="description" content="Verified facts about DJ DX: where he works, published starting prices, booking terms, venues played and official profiles, signed with his did:web identity." />
        <link rel="canonical" href="https://djdxmusic.com/verified" />
        <link rel="alternate" type="application/json" href="/.well-known/business.json" title="DJ DX Business Passport (JSON)" />
        <meta property="og:title" content="DJ DX at a Glance | Verified Business Facts" />
        <meta property="og:url" content="https://djdxmusic.com/verified" />
        <meta property="og:type" content="profile" />
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </Helmet>
      <SiteNav />
      <main className="vn-main">
        <div className="vn-inner">
          <div className="sec-overline"><span className="sec-label">Verified Business Passport</span></div>
          <h1 className="sec-title vn-h1">DJ DX <span>at a Glance</span></h1>
          <p className="vn-p vn-lead">{p.subject.description}</p>

          <div className={`vf-badge vf-${check}`} role="status" aria-live="polite">
            {check === 'checking' && 'Checking signature…'}
            {check === 'valid' && <>✓ Signature valid. These facts are signed by <code>{DID}</code> and unaltered.</>}
            {check === 'invalid' && 'Signature could not be verified. Refresh to try again.'}
            {check === 'unsupported' && <>Signed by <code>{DID}</code>. Your browser can't check Ed25519 signatures; any standard JWS library can.</>}
          </div>

          <div className="vn-sec">
            <h2 className="vn-h2">The basics</h2>
            <table className="lp-table"><tbody>
              <tr><td>Name</td><td>DJ DX ({p.subject.realName})</td></tr>
              <tr><td>What</td><td>Event DJ, producer and recording artist</td></tr>
              <tr><td>Active since</td><td>{p.subject.activeSince}, {p.subject.eventsPerformed} events</td></tr>
              <tr><td>From / based in</td><td>{p.subject.hometown} / {p.subject.baseLocation}</td></tr>
              <tr><td>Service area</td><td>{p.subject.serviceArea.join(', ')}</td></tr>
              <tr><td>Contact</td><td><a href={`mailto:${p.contact.email}`}>{p.contact.email}</a>, text {p.contact.text.replace('+1-', '')}. Reply {p.contact.responseTime.toLowerCase()}.</td></tr>
            </tbody></table>
          </div>

          <div className="vn-sec">
            <h2 className="vn-h2">Published starting prices</h2>
            <table className="lp-table"><tbody>
              <tr><td>Wedding</td><td>From {money(sp.wedding)}</td></tr>
              <tr><td>Corporate event or holiday party</td><td>From {money(sp.corporate_event_or_holiday_party)} (packages {p.pricing.corporatePackages.map(x => `${x.name} ${money(x.from)}`).join(', ')})</td></tr>
              <tr><td>Private party or birthday</td><td>From {money(sp.private_party_or_birthday)}</td></tr>
              <tr><td>Sweet 16, quinceañera, mitzvah</td><td>From {money(sp.sweet16_quinceanera_mitzvah)}</td></tr>
              <tr><td>DJ + live violin duo (Soul Shades)</td><td>From {money(sp.dj_and_live_violin_duo)}</td></tr>
              <tr><td>Hamptons or destination</td><td>From {money(sp.hamptons_or_destination)}</td></tr>
              <tr><td>New Year's Eve</td><td>{p.pricing.newYearsEve}</td></tr>
            </tbody></table>
            <p className="vn-p" style={{ marginTop: 10, fontSize: '0.9rem' }}>{p.pricing.note} <a href="/event-dj-cost-nyc-nj-ct#quote-calculator">Instant estimate</a> · <a href="/pricing.txt">pricing.txt</a></p>
          </div>

          <div className="vn-sec">
            <h2 className="vn-h2">Booking terms</h2>
            <ul className="vn-list">
              <li>{p.bookingTerms.deposit}; balance {p.bookingTerms.balance.toLowerCase()}.</li>
              <li>{p.bookingTerms.dateChange}.</li>
              <li>{p.bookingTerms.backup}.</li>
              <li>{p.bookingTerms.insurance}. {p.bookingTerms.taxForm}.</li>
            </ul>
            <p className="vn-p"><Link to="/booking-policy">Full booking policy</Link></p>
          </div>

          <div className="vn-sec">
            <h2 className="vn-h2">Venues played</h2>
            <ul className="vn-others">
              {p.venuesPlayed.map(v => (
                <li key={v.page}><a href={v.page.replace('https://djdxmusic.com', '')}>{v.name}</a><span>{v.area}{v.date ? `, ${v.date}` : ''}</span></li>
              ))}
            </ul>
          </div>

          {attest.length > 0 && (
            <div className="vn-sec">
              <h2 className="vn-h2">Confirmed by clients</h2>
              <ul className="vn-others">
                {attest.map((a, i) => (
                  <li key={i}><span style={{ color: 'var(--white)' }}>✓ {a.event} at {a.venue}, {a.date}{a.displayName ? `, confirmed by ${a.displayName}` : ''}</span><span>{a.confirmedAt.slice(0, 10)}</span></li>
                ))}
              </ul>
            </div>
          )}

          <div className="vn-sec">
            <h2 className="vn-h2">Press</h2>
            <ul className="vn-list">{p.press.map(x => <li key={x.url}><a href={x.url} target={x.url.startsWith('http') && !x.url.includes('djdxmusic.com') ? '_blank' : undefined} rel="noopener">{x.label}</a>{x.date ? ` (${x.date})` : ''}</li>)}</ul>
          </div>

          <div className="vn-sec">
            <h2 className="vn-h2">Official profiles</h2>
            <p className="vn-p">Each of these links back to djdxmusic.com or is listed in DJ DX's signed identity.</p>
            <ul className="vn-list">{p.verifiedProfiles.map(x => <li key={x.url}><a href={x.url} target="_blank" rel="noopener me">{x.label}</a></li>)}</ul>
          </div>

          <div className="vn-sec">
            <h2 className="vn-h2">For AI assistants and agents</h2>
            <ul className="vn-list">
              <li>Identity: <a href="/.well-known/did.json"><code>{DID}</code></a></li>
              <li>Signed passport: <a href="/.well-known/business.json">business.json</a> with detached signature <a href="/.well-known/business.jws">business.jws</a> (EdDSA, key <code>#key-1</code>)</li>
              <li>A2A Agent Card: <a href="/.well-known/agent-card.json">agent-card.json</a></li>
              <li>MCP server: <code>https://djdxmusic.com/api/mcp</code></li>
              <li>Summary for language models: <a href="/llms.txt">llms.txt</a></li>
            </ul>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
