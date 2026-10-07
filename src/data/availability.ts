// Booked dates, published in the passport (/.well-known/business.json) so AI
// agents can tell someone a date is taken. Add "YYYY-MM-DD" entries as dates
// book. No client details here: dates only.
//
// A date NOT listed is never presented as open; the agent always says DJ DX
// confirms within 24 hours. Connecting a calendar later can replace this list.
export const BOOKED_DATES: string[] = [
  '2026-10-13', // The Glasshouse (corporate)
];
