// Creates a signed client confirmation link for one event.
//
//   npm run attest -- --client "Jane Smith, Acme" --event "Holiday party" \
//     --venue "The Argyle" --date 2026-12-11 [--slug the-argyle-chelsea]
//
// Send the printed link to the client. When they confirm, the event shows as
// "Confirmed by the client" on the venue page and at /verified. The link is
// signed with the did:web key, so it can't be forged or edited. The client's
// name stays private unless they choose to show it.
import { createPrivateKey, sign, randomBytes } from 'node:crypto';
import { readFileSync, existsSync } from 'node:fs';

const args = Object.fromEntries(process.argv.slice(2).reduce((acc, a, i, all) => (a.startsWith('--') ? [...acc, [a.slice(2), all[i + 1]]] : acc), []));
const need = ['client', 'event', 'venue', 'date'];
const missing = need.filter(k => !args[k]);
if (missing.length || !/^\d{4}-\d{2}-\d{2}$/.test(args.date || '')) {
  console.error(`Missing or invalid: ${missing.join(', ') || 'date (use YYYY-MM-DD)'}\nUsage: npm run attest -- --client "Name" --event "Holiday party" --venue "The Argyle" --date 2026-12-11 [--slug the-argyle-chelsea]`);
  process.exit(1);
}

let raw = process.env.DID_PRIVATE_KEY_JWK;
if (!raw && existsSync('.env.local')) {
  const line = readFileSync('.env.local', 'utf8').split('\n').find(l => l.startsWith('DID_PRIVATE_KEY_JWK='));
  if (line) raw = line.slice('DID_PRIVATE_KEY_JWK='.length).trim();
}
if (!raw) { console.error('No DID_PRIVATE_KEY_JWK in the environment or .env.local'); process.exit(1); }
const key = createPrivateKey({ key: JSON.parse(raw), format: 'jwk' });

const claim = {
  v: 1, nonce: randomBytes(12).toString('base64url'),
  client: args.client, event: args.event, venue: args.venue, date: args.date,
  ...(args.slug ? { slug: args.slug } : {}), iat: new Date().toISOString(),
};
const payload = Buffer.from(JSON.stringify(claim)).toString('base64url');
const sig = sign(null, Buffer.from(payload), key).toString('base64url');
console.log(`\nConfirmation link for ${args.client}:\n\nhttps://djdxmusic.com/confirm?t=${payload}.${sig}\n`);
