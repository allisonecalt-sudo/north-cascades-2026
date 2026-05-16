export const TRIP = {
  name: 'North Cascades National Park',
  dates: 'Sun Aug 16 → Thu Aug 20, 2026',
  duration: '5 days · 4 nights',
  travelers: 'Allison + Erin',
  lodgingBases: 'West side (Marblemount/Rockport) · East side (Winthrop/Mazama)',
  researchedOn: 'May 16, 2026',
} as const;

/**
 * Top-of-page "gist in 3 lines" — what this trip is about.
 * Read in 10 seconds, then explore. No hype, no must-dos.
 */
export const TRIP_GIST: readonly string[] = [
  'Five days of easy-to-moderate hiking with big alpine views, balanced pace, back to the cabin by 7-8pm.',
  'Two scenic bases: west side (Marblemount) for the Cascade Pass area, east side (Winthrop/Mazama) for Maple Pass + Methow Valley.',
  'This page is a menu of options — pick what fits the day. Nothing here is locked.',
];
