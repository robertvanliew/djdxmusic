// DJ DX technical rider: one source for the press kit (/epk) and the signed
// business passport (/.well-known/business.json), so AI agents and venues read
// the same requirements a person sees.
//
// The rider applies when the venue supplies the PA (clubs, concerts, some
// destination venues). Private and corporate bookings include DJ DX's own
// sound system and wireless microphones.

export interface RiderSection { title: string; rows: { item: string; spec: string }[] }

export const RIDER: RiderSection[] = [
  {
    title: 'Audio & Sound',
    rows: [
      { item: 'PA System', spec: 'Professional full-range PA with subwoofers capable of filling the venue. Complete coverage required.' },
      { item: 'DJ Monitor', spec: 'One floor wedge or monitor at the DJ booth for clear mix reference.' },
      { item: 'Mixer Input', spec: 'Line-level stereo input from Rane One controller. RCA or XLR accepted.' },
    ],
  },
  {
    title: 'DJ Setup',
    rows: [
      { item: 'Controller', spec: 'Rane One DJ controller — provided by DJ DX. Requires stable, level surface and 2 power outlets.' },
      { item: 'DJ Booth', spec: 'DJ DX brings a DJ booth with façade to every event. No table needed. DJ faces the crowd.' },
      { item: 'Power', spec: 'Two dedicated 15-amp surge-protected circuits. Surge protection provided by DJ DX.' },
    ],
  },
  {
    title: 'Stage & Comms',
    rows: [
      { item: 'Microphones', spec: 'Two wireless handheld mics + one mic stand for MC and announcements.' },
      { item: 'Lighting', spec: 'Stage or wash lighting toward DJ booth. Avoid direct spotlight into eyes.' },
      { item: 'Load-In', spec: 'Minimum 60 minutes before doors. Parking or loading dock access required.' },
    ],
  },
  {
    title: 'Logistics',
    rows: [
      { item: 'Outdoor', spec: 'All outdoor setups require a waterproof canopy covering equipment against sun, rain, and wind.' },
      { item: 'Hospitality', spec: 'Still water (6+ bottles) provided by venue. Healthy catering options appreciated.' },
      { item: 'Live Add-On', spec: 'For live violin/keys hybrid shows — additional DI boxes, outlets, and monitor mixes per musician.' },
    ],
  },
];

// Where DJ DX can work and how travel is priced. Confirmed by DJ DX 2026-10-24:
// authorized to work in all 50 states; Puerto Rico available now; outside the
// US is answered case by case.
export const TRAVEL = {
  includedArea: 'New York City (all five boroughs): travel included',
  regional: 'New Jersey, Long Island, Westchester, the Hudson Valley and Connecticut: travel quoted up front as its own line',
  destination: 'Anywhere in the United States and Puerto Rico: destination bookings start at $3,000, plus travel and lodging quoted up front',
  international: 'Outside the United States: send the destination and date; DJ DX confirms within 24 hours whether he can take it',
};

export const WORK_AUTHORIZATION = {
  authorizedToWorkIn: 'United States (all 50 states)',
  territories: ['Puerto Rico'],
};
