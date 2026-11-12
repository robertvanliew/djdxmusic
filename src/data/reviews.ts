// DJ DX's Google review link: Business Profile > "Ask for reviews" > copy link
// (it looks like https://g.page/r/XXXXXXXX/review).
//
// While this is empty, every review ask on the site stays hidden.
// Set the same link in api/agent.ts (REVIEW_URL in namespace Show, or the
// GOOGLE_REVIEW_URL environment variable) so the Set Receipt and guest
// set-list emails carry it too.
//
// Rules: everyone gets the same ask (clients, and guests on the set-list page).
// No incentive is offered and nobody is filtered by how happy they seem; both
// are against Google's review policy.
export const GOOGLE_REVIEW_URL = '';
