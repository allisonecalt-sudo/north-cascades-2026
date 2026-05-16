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

export const DARK_SKY_SPOTS: DarkSkySpot[] = [
  {
    name: 'Washington Pass Overlook',
    where: 'MP 162 WA-20 (east side)',
    why:
      'Highest-elevation paved overlook on WA-20 (5,477 ft). Open to the south. Already a planned daytime stop — easy after-dinner return for stars if you stay east side.',
    note: 'No services after dusk. Bring layers; pass-level temps drop into the 40s.',
  },
  {
    name: 'Diablo Lake Overlook',
    where: 'MP 132 WA-20 (west side)',
    why:
      'South-facing, water-foreground composition for Milky Way photos. The Cascade peaks frame the sky.',
    note: 'Easy 5-min walk to the overlook from parking. Stay vehicle-side for the full sky.',
  },
  {
    name: 'Patterson Lake (Sun Mountain area)',
    where: '~15 min south of Winthrop',
    why:
      'Methow Valley is an International Dark Sky community (designated 2023). Lake reflects stars in calm conditions.',
    note: 'Quieter than Washington Pass. Mosquitos are real in August — DEET.',
  },
  {
    name: 'Hart\'s Pass (advanced)',
    where: 'End of Hart\'s Pass Rd, ~1.5 hr north of Mazama',
    why:
      'Highest road-accessible point in Washington (~6,200 ft). Premier dark-sky site for serious astrophotography.',
    note: 'Last 12 mi is narrow gravel with cliff-side stretches; not for the rental SUV mission. Skip unless someone is committed.',
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
    why:
      'Highest paved overlook on WA-20 — at sunset the last light hits Liberty Bell + Early Winters Spires as alpenglow. Photographers list it for both sunrise and sunset.',
    note: 'Already a planned daytime stop. Stay through sunset = same pull-off, no extra driving.',
  },
  {
    name: 'Diablo Lake Overlook',
    where: 'MP 132 WA-20 (west side)',
    why:
      'Turquoise glacier-flour lake with the Cascades framing the west. Open to the south + west — sunset light bounces off the water. Wide pull-off, easy to linger.',
  },
  {
    name: 'Sun Mountain Lodge — ridge (open to non-guests)',
    where: '604 Patterson Lake Rd, Winthrop · 3,000 ft',
    why:
      '360° ridgetop with Cascade + Methow Valley views. Non-guests can grab a drink at the Wolf Creek Bar and Grill and walk the patio at sunset — confirm current public-access policy by phone.',
    note: 'Phone: (509) 996-2211. ~45 min from Mazama, ~10 min from Winthrop.',
  },
  {
    name: 'Pearrygin Lake State Park — boat launch',
    where: '~10 min north of Winthrop',
    why:
      'Lake oriented east-west with open western sky over the water — Discover Pass required ($10/day). Quiet, accessible, no climb.',
  },
  {
    name: 'Patterson Lake — west shore',
    where: 'Below Sun Mountain Lodge · ~15 min south of Winthrop',
    why:
      'Smaller, quieter alternative to Pearrygin. Lake faces the ridge to the west; methow-valley dark-sky designation kicks in after sunset for a stargaze chaser.',
  },
];

export const SKY_NOTES = {
  newMoonNote:
    'NEW MOON is Tue Aug 18, 2026 — the darkest sky of the month falls in the middle of the trip. If stars matter at all, this is the window.',
  perseidsTail:
    'Perseid meteor shower peaks Aug 12-13 (just before the trip) but residual meteors run through Aug 24. Worth a glance any clear night.',
};
