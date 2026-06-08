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
    why: 'Highest paved overlook on WA-20 — alpenglow on Liberty Bell at last light.',
    allisonFit: 'Drive up after dinner; stay through astro-dark for stars.',
    bestByPath: ['B'],
    notes: 'Exposed ridge — bring a layer.',
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
    why: 'Open ridgetop at 3,000 ft — sunset from the hot tub + lodge patio.',
    allisonFit: 'Non-guests: drink at the Wolf Creek Grill, walk the patio at sunset.',
    bestByPath: ['B'],
    fromLodging: 'Sun Mountain Lodge (if booked) — porch · otherwise 10-min drive from Winthrop',
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
    why: '580 acres of open pasture, Mt. Baker on the horizon — nothing blocking the west.',
    allisonFit: 'Porch sunset = zero driving. Sun drops behind Mt. Baker from the deck.',
    bestByPath: ['A', 'B'],
    fromLodging: "Ovenell's log cabin porch — view IS the property",
    notes: 'Book a log cabin (not a guesthouse room) — 2BR cabins fit the 2-beds rule.',
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
    why: 'Sunset light bounces off the turquoise water — open south + west, wide pull-off.',
    allisonFit: 'Pair with dinner back, or stay through astro-dark for stars off the water.',
    bestByPath: ['A', 'B'],
    notes: 'Requires WA-20 open through the park (MP 130-156 closed as of May).',
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
    why: 'Quieter alternative to Pearrygin — faces the western ridge, dark-sky after sunset.',
    allisonFit: 'Lower-key than the Sun Mountain patio. Stay past 9 PM for the Milky Way Aug 18.',
    bestByPath: ['B'],
    notes: 'Discover Pass ($10/day). No facilities — pack water.',
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
    why: 'Open western sky over the water, no climb, picnic tables at the launch.',
    allisonFit: 'Easiest after-dinner reach from Winthrop — no dark mountain-road drive home.',
    bestByPath: ['B'],
    notes: 'Discover Pass ($10/day). Mosquitos at dusk — pack DEET.',
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
    why: 'Cabins line a small alpine lake — water-reflection sunset from the lake-front decks.',
    allisonFit: 'Zero-effort sunset if you book the lake-front cabin — already home.',
    bestByPath: ['B'],
    fromLodging: 'Freestone Inn lake-front cabins — ask which face the lake at booking',
    notes: 'Sun drops behind the ridge ~30-45 min before calendar sunset; afterglow still lights the lake.',
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
    "Sunset is Allison's solo wind-down window. Some cabins deliver it off the porch (Ovenell's, Sun Mountain, Freestone); the rest are a 10-30 min drive.",
  newMoon:
    'Tue Aug 18 is the new moon — darkest sky of the trip. Spots open through astro-dark (~10 PM) double as stargazing.',
  drivingHome:
    'Astro-dark ~10 PM. Washington Pass to Winthrop is 40 min — bring a layer + headlamp.',
};
