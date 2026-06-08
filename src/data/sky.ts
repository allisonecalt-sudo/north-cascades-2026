/**
 * Sunrise · sunset · darkness · stargazing for Aug 16-20, 2026.
 *
 * Times sourced from astronomical lookup for Marblemount (48.53°N, 121.43°W)
 * and Winthrop (48.48°N, 120.18°W) — both clocks essentially track within
 * 4-5 min, so a single set of times covers the corridor.
 *
 * Why this matters:
 *   - Golden hour photo planning at Diablo Lake + Washington Pass + Maple
 *     Pass ridge.
 *   - Headlamp / hike-finish risk for ambitious days.
 *   - Stargazing — North Cascades + Methow Valley are International Dark Sky
 *     Association recognized (Methow Valley designated 2023). NEW MOON is
 *     Tue Aug 18, 2026 — a coincidence that puts the darkest sky of the
 *     month right in the middle of this trip.
 */

export interface SkyDay {
  date: string;
  sunrise: string;
  sunset: string;
  goldenHourPM: string;
  astronomicalDark: string;
}

export const SKY_DAYS: SkyDay[] = [
  {
    date: 'Sun Aug 16',
    sunrise: '~6:00 AM',
    sunset: '~8:26 PM',
    goldenHourPM: '~7:35 PM-8:26 PM',
    astronomicalDark: '~10:10 PM',
  },
  {
    date: 'Mon Aug 17',
    sunrise: '~6:01 AM',
    sunset: '~8:24 PM',
    goldenHourPM: '~7:33 PM-8:24 PM',
    astronomicalDark: '~10:07 PM',
  },
  {
    date: 'Tue Aug 18 (NEW MOON)',
    sunrise: '~6:03 AM',
    sunset: '~8:22 PM',
    goldenHourPM: '~7:31 PM-8:22 PM',
    astronomicalDark: '~10:04 PM',
  },
  {
    date: 'Wed Aug 19',
    sunrise: '~6:04 AM',
    sunset: '~8:20 PM',
    goldenHourPM: '~7:29 PM-8:20 PM',
    astronomicalDark: '~10:01 PM',
  },
  {
    date: 'Thu Aug 20',
    sunrise: '~6:05 AM',
    sunset: '~8:18 PM',
    goldenHourPM: '~7:27 PM-8:18 PM',
    astronomicalDark: '~9:58 PM',
  },
];

export interface DarkSkySpot {
  name: string;
  where: string;
  why: string;
  note?: string;
}

// Dark-sky only — sunset-overlap spots (Washington Pass, Diablo Lake) live in
// SUNSET_SPOTS; if a guest goes there at sunset, staying through astro-dark
// gets her stars from the same pull-off. This list is the "stars-specific"
// additions: a Methow Valley site + the advanced Hart's Pass option.
export const DARK_SKY_SPOTS: DarkSkySpot[] = [
  {
    name: 'Patterson Lake (Sun Mountain area)',
    where: '~15 min south of Winthrop',
    why: 'Certified Dark Sky community (2023). Lake reflects stars on calm nights.',
    note: 'Bring DEET — August mosquitos.',
  },
  {
    name: 'Hart\'s Pass (advanced)',
    where: 'End of Hart\'s Pass Rd, ~1.5 hr north of Mazama',
    why: 'Highest road-accessible point in WA (~6,200 ft). Premier astrophotography.',
    note: 'Last 12 mi: narrow cliff-side gravel — not for the rental. Skip unless committed.',
  },
];

/**
 * Sunset spots — non-lodging-tied viewpoints worth a deliberate visit at golden
 * hour. Added May 16, 2026 alongside the per-property sunset flags so a guest
 * staying at a non-sunset cabin still has a 10-min drive to a real sunset.
 */
export interface SunsetSpot {
  name: string;
  where: string;
  why: string;
  note?: string;
}

export const SUNSET_SPOTS: SunsetSpot[] = [
  {
    name: 'Washington Pass Overlook',
    where: 'MP 162 WA-20 (east side) · 5,477 ft',
    why: 'Highest paved overlook on WA-20 — sunset alpenglow on Liberty Bell + Early Winters Spires.',
  },
  {
    name: 'Diablo Lake Overlook',
    where: 'MP 132 WA-20 (west side)',
    why: 'Sunset light bounces off the turquoise water. Wide pull-off.',
  },
  {
    name: 'Sun Mountain Lodge — ridge (open to non-guests)',
    where: '604 Patterson Lake Rd, Winthrop · 3,000 ft',
    why: '360° ridgetop over the Cascades + Methow. Non-guests welcome at the patio at sunset.',
    note: 'Confirm access: (509) 996-2211. ~10 min from Winthrop.',
  },
  {
    name: 'Pearrygin Lake State Park — boat launch',
    where: '~10 min north of Winthrop',
    why: 'Open western sky over the water — quiet, no climb. Discover Pass ($10/day).',
  },
  {
    name: 'Patterson Lake — west shore',
    where: 'Below Sun Mountain Lodge · ~15 min south of Winthrop',
    why: 'Quieter than Pearrygin. Faces the western ridge; dark-sky after dusk.',
  },
];

export const SKY_NOTES = {
  newMoonNote: 'Tue Aug 18 — darkest sky of the month, mid-trip. The window if stars matter.',
  perseidsTail: 'Perseids peak Aug 12-13; stragglers run through Aug 24. Worth a glance any clear night.',
};
