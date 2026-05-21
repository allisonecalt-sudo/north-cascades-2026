export const TRIP = {
  name: 'North Cascades National Park',
  dates: 'Sun Aug 16 → Thu Aug 20, 2026',
  duration: '5 days · 4 nights',
  travelers: 'Allison + Erin',
  lodgingBases: 'Booked: west-side house (Sedro-Woolley / Arlington) · primary vs backup TBC',
  researchedOn: 'May 16, 2026',
} as const;

/**
 * Top-of-page "gist in 3 lines" — what this trip is about.
 * Read in 10 seconds, then explore. No hype, no must-dos.
 */
export const TRIP_GIST: readonly string[] = [
  'Five days of easy-to-moderate hiking with big alpine views, balanced pace, back to the house by 7-8pm.',
  'Flights + lodging are booked: United EWR⇄SEA (Aug 16 out, Aug 20 redeye back) and a west-side house in Sedro-Woolley / Arlington.',
  'Still open: confirm which booked house is primary (two are held), and whether WA-20 reopens to add the east-side stretch.',
];
