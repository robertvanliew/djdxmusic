// Publishes DJ DX's verifiable identity into dist/.well-known/ after prerender:
//
//   did.json            did:web:djdxmusic.com DID document (public key, services)
//   business.json       the Verified Business Passport (src/data/passport.ts)
//   business.jws        detached JWS (EdDSA) over business.json, signed with the DID key
//   agent-card.json     A2A Agent Card (spec 0.3.0), signed in its `signatures` field
//
// The private key comes from DID_PRIVATE_KEY_JWK (Vercel env, production) or
// .env.local when building locally. Without it the files are still written,
// unsigned, and the build continues with a warning.
import * as esbuild from 'esbuild';
import { createPrivateKey, createPublicKey, sign } from 'node:crypto';
import { readFileSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(ROOT, 'dist');
const WK = join(DIST, '.well-known');
const SITE = 'https://djdxmusic.com';
const DID = 'did:web:djdxmusic.com';
const KID = `${DID}#key-1`;
const PUBLIC_JWK = JSON.parse(readFileSync(join(ROOT, 'scripts', 'did-public.json'), 'utf8'));

const b64u = buf => Buffer.from(buf).toString('base64url');

// RFC 8785-style canonical JSON (sorted keys, no whitespace). Our data has no
// floats, so plain JSON number output is already canonical.
function canonical(v) {
  if (Array.isArray(v)) return `[${v.map(canonical).join(',')}]`;
  if (v && typeof v === 'object') return `{${Object.keys(v).sort().filter(k => v[k] !== undefined).map(k => `${JSON.stringify(k)}:${canonical(v[k])}`).join(',')}}`;
  return JSON.stringify(v);
}

function loadPrivateKey() {
  let raw = process.env.DID_PRIVATE_KEY_JWK;
  if (!raw && existsSync(join(ROOT, '.env.local'))) {
    const line = readFileSync(join(ROOT, '.env.local'), 'utf8').split('\n').find(l => l.startsWith('DID_PRIVATE_KEY_JWK='));
    if (line) raw = line.slice('DID_PRIVATE_KEY_JWK='.length).trim();
  }
  if (!raw) return null;
  const key = createPrivateKey({ key: JSON.parse(raw), format: 'jwk' });
  const pub = createPublicKey(key).export({ format: 'jwk' });
  if (pub.x !== PUBLIC_JWK.x) throw new Error('DID_PRIVATE_KEY_JWK does not match scripts/did-public.json');
  return key;
}

// Compact JWS with an unencoded-detached-friendly layout: header.payload.signature
function jws(payloadBytes, key, extraHeader = {}) {
  const header = b64u(JSON.stringify({ alg: 'EdDSA', kid: KID, typ: 'JWT', ...extraHeader }));
  const payload = b64u(payloadBytes);
  const sig = b64u(sign(null, Buffer.from(`${header}.${payload}`), key));
  return { header, payload, sig, compact: `${header}.${payload}.${sig}`, detached: `${header}..${sig}` };
}

async function loadPassport() {
  const out = join(ROOT, '.tmp-identity', 'passport.mjs');
  await esbuild.build({ entryPoints: [join(ROOT, 'src/data/passport.ts')], bundle: true, platform: 'node', format: 'esm', outfile: out, logLevel: 'error' });
  const mod = await import(pathToFileURL(out).href + `?t=${Date.now()}`);
  return mod.buildPassport();
}

const didDocument = {
  '@context': ['https://www.w3.org/ns/did/v1', 'https://w3id.org/security/suites/jws-2020/v1'],
  id: DID,
  alsoKnownAs: [`${SITE}/#djdx`, `${SITE}/#service`, 'https://www.wikidata.org/wiki/Q17579958'],
  verificationMethod: [{ id: KID, type: 'JsonWebKey2020', controller: DID, publicKeyJwk: PUBLIC_JWK }],
  authentication: [KID],
  assertionMethod: [KID],
  service: [
    { id: `${DID}#website`, type: 'LinkedDomains', serviceEndpoint: SITE },
    { id: `${DID}#passport`, type: 'BusinessPassport', serviceEndpoint: `${SITE}/.well-known/business.json` },
    { id: `${DID}#agent`, type: 'A2AAgentCard', serviceEndpoint: `${SITE}/.well-known/agent-card.json` },
    { id: `${DID}#mcp`, type: 'MCPServer', serviceEndpoint: `${SITE}/api/mcp` },
    { id: `${DID}#attestations`, type: 'VerifiedAttestations', serviceEndpoint: `${SITE}/api/attest` },
  ],
};

const agentCard = {
  protocolVersion: '0.3.0',
  name: 'DJ DX Booking Agent',
  description: "The official agent for DJ DX, a NYC, New Jersey and Connecticut event DJ (weddings, corporate events, holiday parties, private parties). It answers with DJ DX's published prices, booking terms, venues played and verified profiles, and can start a date check that DJ DX answers within 24 hours.",
  url: `${SITE}/api/a2a`,
  preferredTransport: 'JSONRPC',
  additionalInterfaces: [{ url: `${SITE}/api/a2a`, transport: 'JSONRPC' }],
  provider: { organization: 'DJ DX', url: SITE },
  iconUrl: `${SITE}/favicon-512x512.png`,
  version: '1.0.0',
  documentationUrl: `${SITE}/verified`,
  capabilities: { streaming: false, pushNotifications: false, stateTransitionHistory: false },
  defaultInputModes: ['text/plain'],
  defaultOutputModes: ['text/plain'],
  supportsAuthenticatedExtendedCard: false,
  skills: [
    { id: 'price_estimate', name: 'Price estimate', description: 'Published starting prices for weddings, corporate events, holiday parties, private parties, Sweet 16s and the DJ + live violin duo.', tags: ['pricing', 'dj', 'nyc'], examples: ['How much is a corporate holiday party DJ in NYC?', 'What does DJ DX charge for a wedding?'] },
    { id: 'business_facts', name: 'Verified business facts', description: 'Who DJ DX is, service area, booking terms, insurance and verified profiles, from the signed business passport.', tags: ['identity', 'verification'], examples: ['Is DJ DX insured?', 'Where does DJ DX work?'] },
    { id: 'venues_played', name: 'Venues played', description: 'Venues DJ DX has played, with dates and pages.', tags: ['venues', 'experience'], examples: ['Has DJ DX played The Argyle?', 'Venues DJ DX has played in Manhattan'] },
    { id: 'date_check', name: 'Date check', description: 'Whether a date is listed as booked, and how to request it. DJ DX confirms availability within 24 hours.', tags: ['availability', 'booking'], examples: ['Is DJ DX available December 12, 2026?'] },
  ],
};

async function main() {
  mkdirSync(WK, { recursive: true });
  const key = loadPrivateKey();
  if (!key) console.warn('identity: no DID_PRIVATE_KEY_JWK; writing unsigned files');

  writeFileSync(join(WK, 'did.json'), JSON.stringify(didDocument, null, 2));

  const passport = { ...(await loadPassport()), issuedAt: new Date().toISOString(), verificationMethod: KID, signature: `${SITE}/.well-known/business.jws` };
  const passportText = JSON.stringify(passport, null, 2);
  writeFileSync(join(WK, 'business.json'), passportText);
  if (key) writeFileSync(join(WK, 'business.jws'), jws(Buffer.from(passportText, 'utf8'), key, { cty: 'application/json' }).detached);

  const card = { ...agentCard };
  if (key) {
    const s = jws(Buffer.from(canonical(card), 'utf8'), key, { typ: 'JOSE', jku: `${SITE}/.well-known/did.json` });
    card.signatures = [{ protected: s.header, signature: s.sig }];
  }
  writeFileSync(join(WK, 'agent-card.json'), JSON.stringify(card, null, 2));

  console.log(`identity: wrote did.json, business.json${key ? ' + business.jws (signed)' : ''}, agent-card.json${key ? ' (signed)' : ''}`);
}

main().catch(e => { console.error(e); process.exit(1); });
