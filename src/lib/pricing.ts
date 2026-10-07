// Published starting prices: the single source for the quote calculator, the
// instant estimate shown after an inquiry, and the AI agent. Keep in sync with
// public/pricing.txt and the corporate packages in src/data/packages.ts.
export const STARTING_PRICES = {
  wedding: 2800,
  corporate: 2800,
  private: 2800,
  sweet16: 1500,
  duo: 3500,
} as const;
export type PriceKey = keyof typeof STARTING_PRICES;
export const HAMPTONS_FLOOR = 3000;
export const VIOLIN_HOURLY = 150;

// Booking form event types -> price keys. Club nights and "Other" have no
// published rate, so no instant estimate is shown for them.
export const FORM_TYPE_TO_PRICE: Record<string, PriceKey | undefined> = {
  'Wedding': 'wedding',
  'Corporate Event / Holiday Party': 'corporate',
  'Private Party / Birthday': 'private',
  'Sweet 16 / Quinceañera / Mitzvah': 'sweet16',
  'DJ + Live Violin (Soul Shades)': 'duo',
};
