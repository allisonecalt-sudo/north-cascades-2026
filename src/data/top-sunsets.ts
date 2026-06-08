/**
 * top-sunsets.ts — ranked sunset spots for the Aug 16-20 trip.
 *
 * Why this page exists (Allison brief, May 17, 2026):
 *   Erin goes to bed earlier than Allison. Sunset is Allison's solo
 *   wind-down window. Some lodging picks already deliver sunset off the
 *   porch (Ovenell's, Sun Mountain); the rest need a 5-30 min drive.
 *
 * Ranking axes:
 *   1. Sky openness — unobstructed western horizon
 *   2. Foreground story — lake reflection, alpenglow on peaks, ridge silhouette
 *   3. Effort — porch (0) vs short walk (1) vs drive (2-3)
 *   4. Allison-fit — solo wind-down, drive home before astro-dark
 *   5. Best-by-path — which paths can reach this spot
 *
 * Sunset times per data/sky.ts: Aug 16 8:26 PM → Aug 20 8:18 PM. Astro-dark
 * tracks ~1 hr 40 min later (10:01-10:10 PM).
 */

import { SKY_DAYS } from './sky';
import type { PathLetter } from './costs';

export interface SunsetPhoto {
  src: string;
  alt: string;
  credit?: string;
  creditUrl?: string;
  width: number;
  height: number;
}

export interface SunsetSpotRanked {
  rank: number;
  name: string;
  /** Lat/lng for quick map lookup. */
  coords: string;
  /** Where it is, plain prose. */
  where: string;
  /** Compass direction the view opens to. */
  viewDirection: string;
  /** Elevation if it's a notable factor. */
  elevation?: string;
  /** "From porch" / "5-min walk" / "30-min drive from Marblemount". */
  accessFromWest: string;
  accessFromEast: string;
  /** Why this rank — what makes it land here. */
  why: string;
  /** Allison-fit framing: solo wind-down, sunset-to-astro-dark continuity. */
  allisonFit: string;
  /** Which paths can comfortably reach this. */
  bestByPath: PathLetter[];
  /** Notes / caveats / Discover Pass requirements. */
  notes?: string;
  /** Whether this is a porch from a listed lodging. */
  fromLodging?: string;
  /** Source citation. */
  source: { name: string; url: string };
  /**
   * Optional photo carousel (2-4 photos). Added Wave 4 photo-curation pass,
   * May 17, 2026. Falls back to a single representative-spot photo when fewer
   * are available. Verified-summer / no-snow per the trip dates.
   */
  photos?: readonly SunsetPhoto[];
  /** "Verified on" date so the freshness shows on each card. */
  verifiedAsOf?: string;
}

export const TOP_SUNSETS: SunsetSpotRanked[] = [
  {
    rank: 1,
    name: 'Washington Pass Overlook',
    coords: '48.524°N, 120.654°W',
    where: 'MP 162 WA-20, ridge crest between Mazama and Rainy Pass',
    viewDirection: 'West-southwest over Liberty Bell + Early Winters Spires',
    elevation: '5,477 ft',
    accessFromWest: '~1 hr 35 min drive from Marblemount (Path B drive-day route, not realistic from Path A west base for sunset)',
    accessFromEast: '~40 min drive from Winthrop / ~25 min from Mazama',
    why: 'Highest paved overlook on WA-20 — last light hits Liberty Bell + Early Winters Spires as alpenglow. Photographers list it for both sunrise and sunset.',
    allisonFit: 'Drive up after dinner, watch the sunset, stay through astro-dark (~10:00 PM) for stars at the same pull-off. New moon Aug 18 = the dark-sky bonus is real here.',
    bestByPath: ['B'],
    notes: 'Park closes the gate at dusk in winter — in August the overlook stays accessible. Bring a layer; ridge is exposed.',
    source: {
      name: 'NPS · Washington Pass Overlook',
      url: 'https://www.nps.gov/noca/planyourvisit/things2do.htm',
    },
    verifiedAsOf: 'May 17, 2026',
    photos: [
      {
        src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Washington_pass_overlook.jpg?width=1280',
        alt: 'Washington Pass Overlook in summer with Liberty Bell and Early Winters Spires across the valley.',
        credit: 'Photo: Wikimedia · CC',
        creditUrl: 'https://commons.wikimedia.org/wiki/File:Washington_pass_overlook.jpg',
        width: 1600,
        height: 1067,
      },
      {
        src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Washington_Pass_and_Liberty_Bell_Mountain.JPG?width=1280',
        alt: 'Washington Pass and Liberty Bell Mountain in clear summer light.',
        credit: 'Photo: Wikimedia · CC',
        creditUrl: 'https://commons.wikimedia.org/wiki/File:Washington_Pass_and_Liberty_Bell_Mountain.JPG',
        width: 1600,
        height: 1067,
      },
      {
        src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Liberty_Bell_Group,_North_Cascades_Highway.jpg?width=1280',
        alt: 'Liberty Bell Group rising above the Washington Pass corridor.',
        credit: 'Photo: Wikimedia · CC',
        creditUrl: 'https://commons.wikimedia.org/wiki/File:Liberty_Bell_Group,_North_Cascades_Highway.jpg',
        width: 1600,
        height: 1067,
      },
      {
        src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Washington_Pass_at_North_Cascades_in_Washington_05.jpg?width=1280',
        alt: 'Washington Pass overlook view of the alpine ridge in summer.',
        credit: 'Photo: Wikimedia · CC',
        creditUrl: 'https://commons.wikimedia.org/wiki/File:Washington_Pass_at_North_Cascades_in_Washington_05.jpg',
        width: 1600,
        height: 1067,
      },
    ],
  },
  {
    rank: 2,
    name: 'Sun Mountain Lodge — Wolf Creek patio',
    coords: '48.467°N, 120.247°W',
    where: 'Sun Mountain Lodge ridge, 604 Patterson Lake Rd, Winthrop',
    viewDirection: '360° — west to Cascades, south to Methow Valley',
    elevation: '3,000 ft',
    accessFromWest: 'Not reachable for sunset from Marblemount (~2 hr 45 min one-way)',
    accessFromEast: '~10 min from Winthrop / ~45 min from Mazama',
    why: 'Open ridgetop at 3,000 ft — guests and the lodge itself call out sunset from the hot tub + main-lodge patio.',
    allisonFit: 'Even if you book a Patterson Lake Cabin, the ridge is a 5-min drive up. Non-guests: grab a drink at the Wolf Creek Bar and Grill and walk the patio at sunset — call (509) 996-2211 to confirm same-day open-to-public policy.',
    bestByPath: ['B'],
    fromLodging: 'Sun Mountain Lodge (if booked) — porch · otherwise 10-min drive from Winthrop',
    notes: 'Phone: (509) 996-2211. Allison-favorite kind of spot — chair, view, no one rushing.',
    source: {
      name: 'Sun Mountain Lodge',
      url: 'https://www.sunmountainlodge.com/',
    },
  },
  {
    rank: 3,
    name: "Ovenell's ranch acreage",
    coords: '48.521°N, 121.737°W',
    where: "Ovenell's Heritage Inn & Log Cabins, 580-acre cattle ranch, Concrete",
    viewDirection: 'West-southwest toward Mt. Baker',
    accessFromWest: 'From porch if staying here · ~25 min from Marblemount otherwise',
    accessFromEast: 'Not reachable for sunset from east bases',
    why: '580 acres of open pasture with Mt. Baker on the horizon. Reviewers call out the "Million Dollar View" lit at sunset — no tree cover blocks the western sky.',
    allisonFit: 'Porch sunset = zero driving. Watch the sun drop behind Mt. Baker from the cabin deck, walk back inside. Highest "Allison wind-down" fit if you book here.',
    bestByPath: ['A', 'B'],
    fromLodging: "Ovenell's log cabin porch — view IS the property",
    notes: 'Book a log cabin specifically (not a guesthouse room). 2BR cabins fit the 2-beds rule.',
    source: {
      name: "Ovenell's Heritage Inn",
      url: 'https://www.ovenells-inn.com/',
    },
  },
  {
    rank: 4,
    name: 'Diablo Lake Overlook',
    coords: '48.713°N, 121.092°W',
    where: 'MP 132 WA-20, west side of the park',
    viewDirection: 'South + west over the turquoise lake',
    accessFromWest: '~35 min drive from Marblemount',
    accessFromEast: 'Not reachable — east of the closure if WA-20 partially closed',
    why: 'Turquoise glacier-flour lake with the Cascades framing the west. Open to the south + west — sunset light bounces off the water. Wide pull-off, easy to linger.',
    allisonFit: 'Pair with dinner on the way back or stay through astro-dark for stars off the water (new moon Aug 18 — Milky Way reflects).',
    bestByPath: ['A', 'B'],
    notes: 'Requires WA-20 to be open through the park. As of May 15 the section MP 130-156 is closed. Re-check WSDOT before counting on this spot.',
    source: {
      name: 'NPS · Diablo Lake Overlook',
      url: 'https://www.nps.gov/noca/planyourvisit/things2do.htm',
    },
    verifiedAsOf: 'May 17, 2026',
    photos: [
      {
        src: 'img/diablo-lake-from-overlook-03.jpg',
        alt: 'Diablo Lake glowing turquoise from the WA-20 overlook in summer.',
        credit: 'Photo: Joe Mabel · CC BY-SA 4.0 (Wikimedia)',
        creditUrl: 'https://commons.wikimedia.org/wiki/File:Diablo_Lake_from_Overlook_03.jpg',
        width: 1200,
        height: 800,
      },
      {
        src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Diablo_Lake_(Washington_State).jpg?width=1280',
        alt: 'Diablo Lake turquoise water with the North Cascades framing the basin.',
        credit: 'Photo: Wikimedia · CC',
        creditUrl: 'https://commons.wikimedia.org/wiki/File:Diablo_Lake_(Washington_State).jpg',
        width: 1600,
        height: 1067,
      },
      {
        src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Diablo_Lake_with_Pinnacle_Peak.jpg?width=1280',
        alt: 'Diablo Lake with Pinnacle Peak above the basin.',
        credit: 'Photo: Wikimedia · CC',
        creditUrl: 'https://commons.wikimedia.org/wiki/File:Diablo_Lake_with_Pinnacle_Peak.jpg',
        width: 1600,
        height: 1067,
      },
    ],
  },
  {
    rank: 5,
    name: 'Patterson Lake — west shore',
    coords: '48.461°N, 120.247°W',
    where: 'Below Sun Mountain Lodge, ~15 min south of Winthrop',
    viewDirection: 'West over the lake toward the Cascade foothills',
    accessFromWest: 'Not reachable for sunset from Marblemount (~3 hr one-way)',
    accessFromEast: '~15 min from Winthrop · ~30 min from Mazama',
    why: 'Smaller, quieter alternative to Pearrygin. Lake faces the ridge to the west; Methow Valley dark-sky designation kicks in after sunset.',
    allisonFit: 'Lower-key than the Sun Mountain patio — bring a chair, sit by the water, drive back without crowds. Stay past 9:00 PM for the Milky Way on Aug 18.',
    bestByPath: ['B'],
    notes: 'Discover Pass required ($10/day or $30/year). No facilities at the launch — pack water.',
    source: {
      name: 'DarkSky International · Places finder',
      url: 'https://darksky.org/places/',
    },
  },
  {
    rank: 6,
    name: 'Pearrygin Lake State Park — boat launch',
    coords: '48.494°N, 120.156°W',
    where: '~10 min north of Winthrop',
    viewDirection: 'West over the water toward open sky',
    accessFromWest: 'Not reachable for sunset from west bases',
    accessFromEast: '~10 min from Winthrop · ~25 min from Mazama',
    why: 'Lake oriented east-west with open western sky over the water. Quiet, accessible, no climb. Picnic tables at the launch.',
    allisonFit: 'The most "porch swap" option — easiest after-dinner reach from Winthrop. Lower drama than Washington Pass but no driving home in the dark on a mountain road.',
    bestByPath: ['B'],
    notes: 'Discover Pass required ($10/day). Mosquitos real at dusk in August — DEET in the bag.',
    source: {
      name: 'Pearrygin Lake State Park',
      url: 'https://parks.wa.gov/find-parks/state-parks/pearrygin-lake-state-park',
    },
  },
  {
    rank: 7,
    name: 'Freestone Inn — lake-front cabin porch',
    coords: '48.591°N, 120.404°W',
    where: 'Freestone Lake, 31 Early Winters Dr, Mazama',
    viewDirection: 'West over the small alpine lake — Mazama sits between 7,000+ ft peaks so the sun drops behind the western ridge earlier than the calendar sunset',
    accessFromWest: 'Not reachable for sunset from Marblemount',
    accessFromEast: 'From porch if staying here',
    why: 'Cabins line a small alpine lake — water-foreground sunset reflections are likely from the lake-front decks. Sun drops behind the ridge earlier than the calendar 8:18-8:26 PM time.',
    allisonFit: 'Zero-effort sunset if you book the lake-front cabin. Lower drama than the Washington Pass drive but no driving + already home.',
    bestByPath: ['B'],
    fromLodging: 'Freestone Inn lake-front cabins — ask which cabin numbers face the lake at booking',
    notes: 'Sun drops behind the ridge ~30-45 min before the calendar sunset. The afterglow on the eastern peaks still lights up the lake at calendar sunset.',
    source: { name: 'Freestone Inn', url: 'https://www.freestoneinn.com/' },
  },
];

/**
 * Per-day sunset reference — pull from sky.ts so updates flow automatically.
 * Used by the page table that shows "what time is sunset on Aug X".
 */
export interface SunsetTimeRow {
  date: string;
  sunset: string;
  astroDark: string;
}

export const SUNSET_TIMES: SunsetTimeRow[] = SKY_DAYS.map((d) => ({
  date: d.date,
  sunset: d.sunset,
  astroDark: d.astronomicalDark,
}));

export const TOP_SUNSETS_INTRO = {
  why:
    "Erin goes to bed earlier than Allison. Sunset is Allison's solo wind-down window. Some cabins deliver it off the porch (Ovenell's, Sun Mountain, Freestone lake-front); the rest are a 10-30 min drive.",
  newMoon:
    'Tue Aug 18 is the new moon — the darkest sky of the month falls in the middle of the trip. Sunset spots that stay accessible through astro-dark (~10:00 PM) double as stargazing spots.',
  drivingHome:
    'Astro-dark hits ~10:00 PM. From Washington Pass to Winthrop is 40 min — plan the drive home with a layer and a headlamp.',
};
