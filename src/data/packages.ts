// Three tiers confirmed by DJ DX on 2026-10-01. Essentials matches the
// published corporate floor in public/pricing.txt; Production includes the
// Soul Shades duo and videography, in line with the wedding package tiers.
export const CORP_PACKAGES = [
  { name: 'Essentials', price: 2800, hours: 'Up to 5 hours', blurb: 'The standard office party or client event.',
    includes: ['Professional sound sized to the room', 'Two wireless mics for speeches and awards', 'MC announcements and run of show', 'Planning call and do-not-play list', 'Contract, COI and W-9'] },
  { name: 'Signature', price: 4500, hours: 'Up to 5 hours', blurb: 'For galas, launches and parties with a program.',
    includes: ['Everything in Essentials', 'Uplighting and dance-floor lighting', 'A custom intro or edit produced for your event', 'Second sound zone for a dinner room or terrace'] },
  { name: 'Production', price: 8000, hours: 'Up to 6 hours', blurb: 'Full production with live music and video.',
    includes: ['Everything in Signature', 'Soul Shades: live violin or piano with the DJ set', 'Professional videography with an edited highlight reel', 'Full lighting design'] },
];
