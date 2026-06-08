/**
 * Roadside viewpoints along WA-20.
 *
 * Neutral framing — no "postcard" hierarchy. Diablo Lake + Washington Pass are
 * still the bigger stops (longer durations, more facilities) so they lead the
 * list; the rest are quick pull-offs.
 */

export interface ViewpointPhoto {
  src: string;
  alt: string;
  credit?: string;
  creditUrl?: string;
  width: number;
  height: number;
}

export interface Viewpoint {
  milepost: number;
  name: string;
  description: string;
  /** Approx visit time — helps the reader picture the day. */
  timeNeeded: string;
  /** Bigger stops get a photo; pull-offs don't. */
  featured?: boolean;
  photo?: ViewpointPhoto;
}

export const VIEWPOINTS: Viewpoint[] = [
  {
    milepost: 132,
    name: 'Diablo Lake Overlook',
    description:
      'Large parking, restrooms, interpretive shelter. The glacier-flour turquoise lake from above — the signature North Cascades view.',
    timeNeeded: '20-30 min',
    featured: true,
    photo: {
      src: 'img/diablo-lake-from-overlook-03.jpg',
      alt: 'Turquoise Diablo Lake from the WA-20 overlook, surrounded by forested peaks.',
      credit: 'Photo: Joe Mabel · CC BY-SA 4.0 (Wikimedia)',
      creditUrl: 'https://commons.wikimedia.org/wiki/File:Diablo_Lake_from_Overlook_03.jpg',
      width: 1200,
      height: 800,
    },
  },
  {
    milepost: 162,
    name: 'Washington Pass Overlook',
    description:
      '400-ft paved trail to a ledge view of Liberty Bell, Early Winters Spires, and Kangaroo Ridge. Fully accessible.',
    timeNeeded: '20 min',
    featured: true,
    photo: {
      src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Liberty_Bell_Group,_North_Cascades_Highway.jpg?width=1280',
      alt: 'Liberty Bell Mountain and Early Winters Spires above the WA-20 hairpin from Washington Pass Overlook on a summer day.',
      credit: 'Photo: Laurel F · CC BY-SA 2.0 (Wikimedia)',
      creditUrl: 'https://commons.wikimedia.org/wiki/File:Liberty_Bell_Group,_North_Cascades_Highway.jpg',
      width: 1280,
      height: 860,
    },
  },
  {
    milepost: 119,
    name: 'Goodell Creek Overlook',
    description: 'Quick pull-off.',
    timeNeeded: '5 min',
  },
  {
    milepost: 120,
    name: 'Ladder Creek Falls (Gorge Powerhouse)',
    description: 'Short paved loop, lit at night dusk-to-11 pm.',
    timeNeeded: '15 min',
  },
  {
    milepost: 123,
    name: 'Gorge Creek Falls',
    description: 'Pull-out + footbridge over the gorge.',
    timeNeeded: '5-10 min',
  },
  {
    milepost: 130,
    name: 'Colonial Creek South Campground',
    description: 'Trailhead for Thunder Knob; picnic area for a drive-day lunch.',
    timeNeeded: 'Picnic / hike stop',
  },
  {
    milepost: 135,
    name: 'Ross Lake Overlook',
    description: 'Quick pull-off.',
    timeNeeded: '5 min',
  },
  {
    milepost: 158,
    name: 'Rainy Pass / Rainy Lake Trailhead',
    description: 'Paved 1.8 mi RT walk to Rainy Lake; also the trailhead for Maple Pass + Cutthroat Pass.',
    timeNeeded: 'Hike stop',
  },
];

/**
 * Mt. Baker corridor (WA-542) viewpoints — bonus, off-WA-20.
 *
 * Only realistic on Path A (west-side anchor) or on a Day 1 detour from BLI.
 * Surfaced separately so they don\'t pollute the WA-20 mileage list.
 */
export interface BakerViewpoint {
  name: string;
  where: string;
  description: string;
  timeNeeded: string;
}

export const BAKER_VIEWPOINTS: BakerViewpoint[] = [
  {
    name: 'Picture Lake',
    where: 'WA-542 end · Heather Meadows · ~1 hr east of Bellingham',
    description:
      'Maybe the most-photographed scene in Washington — Mt. Shuksan mirrored in the lake. Easy 0.5 mi paved loop around the water. Iconic at sunrise + sunset.',
    timeNeeded: '30-45 min',
  },
  {
    name: 'Artist Point',
    where: 'End of WA-542 · ~5 min past Picture Lake',
    description:
      'Drive-up panorama of Mt. Baker + Mt. Shuksan. Multiple short walks from the parking area. Road closes by snow late October; mid-August always open.',
    timeNeeded: '30-60 min',
  },
  {
    name: 'Heather Meadows',
    where: 'WA-542 · ~10 min before Artist Point',
    description:
      'Wildflower meadows in August, easy walking trails, alpine tarns. Pair with Chain Lakes hike (6-7 mi loop, see Hikes).',
    timeNeeded: '1-2 hrs',
  },
];

export const BAKER_NOTE =
  'These are off WA-20 — they sit on the Mt. Baker corridor (WA-542) east of Bellingham. Best fit: Path A (west-side anchor) Day 4 swap-in, OR a Day 1 detour from BLI before driving to Marblemount.';

// ===========================================================================
// Viewpoint destinations — rich page data (May 17, 2026 buildout)
// ---------------------------------------------------------------------------
// Allison brief: *"Could destinations use more beefing up? Reference austria"*.
// The compact WA-20 timeline above lives on the Hikes page as a quick
// reference. This richer structure feeds the dedicated /viewpoints page so
// the drive-up postcard spots get the same Airbnb-tier treatment that lodging
// and hikes already get: 3-5 photo carousel, at-a-glance pills, 2-line lede,
// drive times from BOTH bases (Marblemount = west, Winthrop = east).
//
// Distinction vs hikes: viewpoints are drive-up or ultra-short-walk (<=10 min
// from car). If it takes a real hike to get there, it lives on the hikes page.
//
// Photo URLs: `Special:FilePath` redirects to whatever the current thumbnail
// is — the proven pattern in this codebase (see data/activities.ts wm()
// helper). All SUMMER-season shots — no snow, no winter. Erin profile:
// drive-up viewpoints are high-value because she's not a high-mileage hiker.
// ===========================================================================

const wmPhoto = (file: string, w = 1280): string =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${file}?width=${w}`;
const wmFile = (file: string): string =>
  `https://commons.wikimedia.org/wiki/File:${file}`;

/** Effort to reach the viewpoint from the parking lot. */
export type ViewpointEffort = 'drive-up' | 'short-walk';

/** Best window of day for the photograph + experience. */
export type ViewpointBestTime =
  | 'sunrise'
  | 'morning'
  | 'midday'
  | 'golden-hour'
  | 'sunset'
  | 'anytime';

export type ViewpointCorridor = 'wa-20' | 'mt-baker' | 'methow';

export interface ViewpointDestination {
  id: string;
  name: string;
  /** Where it sits (e.g. "MP 132 · WA-20 · ~25 min east of Newhalem"). */
  where: string;
  /** Corridor — drives the filter chip. */
  corridor: ViewpointCorridor;
  /** Effort to reach from the parking lot. */
  effort: ViewpointEffort;
  /** Approx parking situation — surfaces in a pill. */
  parking: string;
  /** Roughly what season the road/pullout is open. */
  openSeason: string;
  /** Best time of day for the experience. */
  bestTime: ViewpointBestTime;
  /** Whether WA-20 is required to reach (Y/N) — drives a chip + closure hint. */
  needsWa20: boolean;
  /** Approx visit length so the reader can budget time. */
  timeNeeded: string;
  /** Optional milepost (WA-20 only). */
  milepost?: number;
  /** Optional restroom flag — useful info on a drive day. */
  restrooms?: boolean;
  /** Optional accessibility flag (paved / ADA). */
  ada?: boolean;
  /** 2-line lede — Allison-voice, why-this-is-worth-the-stop. */
  lede: string;
  /** Drive time from the west-side base (Marblemount). */
  driveFromMarblemount: string;
  /** Drive time from the east-side base (Winthrop). */
  driveFromWinthrop: string;
  /** Carousel photos — 3-5 where curation reached. First slide is the lead. */
  photos: ViewpointPhoto[];
  /** Optional external source link (e.g. NPS / WTA / official). */
  sourceUrl?: string;
  sourceLabel?: string;
  /** When the listing was last spot-checked. */
  verifiedAsOf: string;
  /** Optional caveat — fail-loud, e.g. cell-dead-zone, gravel road, etc. */
  caveat?: string;
  /**
   * Optional YouTube preview clip (May 17, 2026 buildout — Allison brief:
   * *"embed videos where helpful simple videos"*). Click-to-load embed via
   * `renderVideoEmbed`. See `sections/video-embed.ts` for constraints
   * (summer, 1-5 min preferred, recent, no autoplay).
   */
  video?: {
    youtubeId: string;
    title: string;
    creator: string;
  };
}

export const VIEWPOINT_DESTINATIONS: ViewpointDestination[] = [
  {
    id: 'diablo-lake-overlook',
    name: 'Diablo Lake Overlook',
    where: 'MP 132 · WA-20 · ~12 min east of Newhalem',
    corridor: 'wa-20',
    effort: 'drive-up',
    parking: 'Large lot · restrooms · interpretive shelter',
    openSeason: 'WA-20 open window (typically Jul-Oct in normal years)',
    bestTime: 'midday',
    needsWa20: true,
    timeNeeded: '20-30 min',
    milepost: 132,
    restrooms: true,
    ada: true,
    lede:
      'The signature North Cascades view — turquoise glacier-flour water from above. The classic postcard photo you have probably already seen.',
    driveFromMarblemount: '~50 min',
    driveFromWinthrop: '~70 min (when WA-20 is open through)',
    photos: [
      {
        src: 'img/diablo-lake-from-overlook-03.jpg',
        alt: 'Turquoise Diablo Lake from the WA-20 overlook, surrounded by forested peaks.',
        credit: 'Photo: Joe Mabel · CC BY-SA 4.0 (Wikimedia)',
        creditUrl: 'https://commons.wikimedia.org/wiki/File:Diablo_Lake_from_Overlook_03.jpg',
        width: 1280,
        height: 853,
      },
      {
        src: wmPhoto('Diablo_Lake_(Washington_State).jpg'),
        alt: 'Diablo Lake turquoise water with the North Cascades framing the basin.',
        credit: 'Photo: Wikimedia · CC',
        creditUrl: wmFile('Diablo_Lake_(Washington_State).jpg'),
        width: 1600,
        height: 1067,
      },
      {
        src: wmPhoto('Pyramid_Peak_reflected_in_Diablo_Lake.jpg'),
        alt: 'Pyramid Peak reflected in the turquoise water of Diablo Lake in summer.',
        credit: 'Photo: Ron Clausen · CC BY-SA 4.0 (Wikimedia)',
        creditUrl: wmFile('Pyramid_Peak_reflected_in_Diablo_Lake.jpg'),
        width: 1600,
        height: 1067,
      },
    ],
    sourceUrl: 'https://www.nps.gov/noca/planyourvisit/things2do.htm',
    sourceLabel: 'NPS · Things to Do (incl. Diablo Lake Overlook)',
    verifiedAsOf: 'May 17, 2026',
    caveat:
      'Requires WA-20 through the closure zone — re-check WSDOT before counting on it (see closure banner).',
    video: {
      youtubeId: 'TzW6nDSOFZc',
      title: 'Diablo Lake Overlook · North Cascades National Park',
      creator: 'Discover with Don',
    },
  },
  {
    id: 'washington-pass-overlook',
    name: 'Washington Pass Overlook',
    where: 'MP 162 · WA-20 · 5,477 ft · highest point on the highway',
    corridor: 'wa-20',
    effort: 'short-walk',
    parking: 'Paved lot · restrooms · paved 0.25 mi walk to ledge',
    openSeason: 'Jul-Oct typical · WA-20 east section opens late Apr most years',
    bestTime: 'sunset',
    needsWa20: true,
    timeNeeded: '20 min',
    milepost: 162,
    restrooms: true,
    ada: true,
    lede:
      'Granite spires of Liberty Bell + Early Winters Spires + Kangaroo Ridge dropping into the WA-20 hairpin below. Sunset alpenglow on the spires is the moment.',
    driveFromMarblemount: '~1 hr 45 min (when WA-20 is open through)',
    driveFromWinthrop: '~40 min',
    photos: [
      {
        src: wmPhoto('Liberty_Bell_Group,_North_Cascades_Highway.jpg'),
        alt: 'Liberty Bell Mountain and Early Winters Spires above the WA-20 hairpin on a summer day.',
        credit: 'Photo: Wikimedia · CC',
        creditUrl: wmFile('Liberty_Bell_Group,_North_Cascades_Highway.jpg'),
        width: 1280,
        height: 860,
      },
      {
        src: wmPhoto('Washington_pass_overlook.jpg'),
        alt: 'Washington Pass Overlook on WA-20 with Liberty Bell Mountain behind.',
        credit: 'Photo: Wikimedia · CC',
        creditUrl: wmFile('Washington_pass_overlook.jpg'),
        width: 1600,
        height: 1067,
      },
      {
        src: wmPhoto('North_Cascades_Highway_from_Burgundy_Col.jpg'),
        alt: 'WA-20 corridor seen from above with the North Cascades in summer.',
        credit: 'Photo: Wikimedia · CC',
        creditUrl: wmFile('North_Cascades_Highway_from_Burgundy_Col.jpg'),
        width: 1600,
        height: 1067,
      },
    ],
    sourceUrl: 'https://www.fs.usda.gov/recarea/okawen/recarea/?recid=59140',
    sourceLabel: 'USFS · Washington Pass Observation Site',
    verifiedAsOf: 'May 17, 2026',
    video: {
      youtubeId: 'bb-Y8zp-RqU',
      title: 'Washington Pass Overlook · Washington USA',
      creator: 'World Travel Hops',
    },
  },
  {
    id: 'picture-lake',
    name: 'Picture Lake',
    where: 'Mt. Baker Hwy (WA-542) past Heather Meadows · ~1 hr east of Bellingham',
    corridor: 'mt-baker',
    effort: 'short-walk',
    parking: 'Free pullout lot · paved 0.5 mi loop around the water',
    openSeason: 'Jul-Oct typical · road closes by snow late Oct',
    bestTime: 'sunrise',
    needsWa20: false,
    timeNeeded: '30-45 min',
    restrooms: true,
    ada: true,
    lede:
      'Mt. Shuksan mirror-reflects in a tiny tarn — said to be one of the most-photographed scenes in America. The "calendar cover" angle is from the wooden boardwalk on the loop\'s north side.',
    driveFromMarblemount: '~2 hr (via WA-9 north then WA-542 east)',
    driveFromWinthrop: '~5 hr (requires south via I-90 + I-5 — Day-1-from-BLI only)',
    photos: [
      {
        src: 'img/mountshuksanpicturelake.jpg',
        alt: 'Mount Shuksan reflected in Picture Lake on a calm summer morning.',
        credit: 'Photo: Siradia · Public domain (Wikimedia)',
        creditUrl: 'https://commons.wikimedia.org/wiki/File:MountShuksanPictureLake.JPG',
        width: 1600,
        height: 1200,
      },
      {
        src: wmPhoto('Mount_Shuksan_tarn.jpg'),
        alt: 'Mount Shuksan reflected in an alpine tarn in the Heather Meadows area.',
        credit: 'Photo: Wikimedia · CC',
        creditUrl: wmFile('Mount_Shuksan_tarn.jpg'),
        width: 1600,
        height: 1067,
      },
      {
        src: wmPhoto('Mount_Baker,_Mount_Shuksan,_Washington_State.png'),
        alt: 'Mount Baker and Mount Shuksan rising side by side from the Heather Meadows area in summer.',
        credit: 'Photo: Wikimedia · CC',
        creditUrl: wmFile('Mount_Baker,_Mount_Shuksan,_Washington_State.png'),
        width: 1600,
        height: 900,
      },
    ],
    sourceUrl: 'https://www.wta.org/go-hiking/hikes/picture-lake',
    sourceLabel: 'WTA · Picture Lake',
    verifiedAsOf: 'May 17, 2026',
    caveat:
      'Mt. Baker Hwy (WA-542) — separate corridor from WA-20. Only realistic as a Day-1 detour from BLI or on a west-side anchor day.',
    video: {
      youtubeId: 'EJk9xfzvfLg',
      title: "Mount Shuksan · Washington's Most Photographed Mountain · Picture Lake & Artist Point",
      creator: 'Hiking Bisons',
    },
  },
  {
    id: 'artist-point',
    name: 'Heather Meadows / Artist Point',
    where: 'End of WA-542 · 5,140 ft · ~5 min past Picture Lake',
    corridor: 'mt-baker',
    effort: 'short-walk',
    parking: 'Paved lot at road-end · multiple short walks from the lot',
    openSeason: 'Late Jul-Oct · snow lingers into July most years',
    bestTime: 'golden-hour',
    needsWa20: false,
    timeNeeded: '30-60 min',
    restrooms: true,
    ada: false,
    lede:
      '360° drive-up alpine panorama — Mt. Baker, Mt. Shuksan, Table Mountain, the Coleman Glacier. Plenty of paved-to-easy short walks from the lot if you want to wander.',
    driveFromMarblemount: '~2 hr 10 min (via WA-9 + WA-542)',
    driveFromWinthrop: '~5 hr (Day-1-from-BLI only)',
    photos: [
      {
        src: wmPhoto('Artist_Point_at_North_Cascades_in_WA.jpg'),
        alt: 'Artist Point at the end of Mt. Baker Highway with alpine peaks and meadows.',
        credit: 'Photo: Wikimedia · CC',
        creditUrl: wmFile('Artist_Point_at_North_Cascades_in_WA.jpg'),
        width: 1600,
        height: 1067,
      },
      {
        src: wmPhoto('Mount_Baker,_Mount_Shuksan,_Washington_State.png'),
        alt: 'Mount Baker and Mount Shuksan from the Heather Meadows / Artist Point area in summer.',
        credit: 'Photo: Wikimedia · CC',
        creditUrl: wmFile('Mount_Baker,_Mount_Shuksan,_Washington_State.png'),
        width: 1600,
        height: 900,
      },
      {
        src: wmPhoto('Mount_Shuksan_tarn.jpg'),
        alt: 'Mt. Shuksan reflected in an alpine tarn at Heather Meadows.',
        credit: 'Photo: Wikimedia · CC',
        creditUrl: wmFile('Mount_Shuksan_tarn.jpg'),
        width: 1600,
        height: 1067,
      },
    ],
    sourceUrl: 'https://www.fs.usda.gov/recarea/mbs/recarea/?recid=17828',
    sourceLabel: 'USFS · Mt. Baker Wilderness',
    verifiedAsOf: 'May 17, 2026',
    caveat:
      'WA-542 only — separate corridor from WA-20. Northwest Forest Pass required ($5/day or covered by America the Beautiful).',
    video: {
      youtubeId: '_UdFgQxL1S4',
      title: 'Hiking Near Mount Baker & Mount Shuksan · Artist Point & Picture Lake',
      creator: 'Cody & Jocelyn',
    },
  },
  {
    id: 'newhalem-trestle-cedars',
    name: 'Newhalem trestle + Trail of the Cedars',
    where: 'End of Main St, Newhalem · MP 120 WA-20',
    corridor: 'wa-20',
    effort: 'short-walk',
    parking: 'Free pullout in Newhalem · suspension bridge over Skagit · 0.3 mi loop',
    openSeason: 'Year-round (paved/gravel)',
    bestTime: 'anytime',
    needsWa20: false,
    timeNeeded: '20-30 min',
    milepost: 120,
    restrooms: true,
    ada: true,
    lede:
      'Walk the iconic wood-and-cable suspension bridge over the Skagit, then drift through a short interpretive loop of old-growth Western red cedar. Easy add-on to any Newhalem stop.',
    driveFromMarblemount: '~20 min',
    driveFromWinthrop: '~2 hr (when WA-20 is open through)',
    photos: [
      {
        src: wmPhoto('Suspension_bridge_at_Newhalem,_WA.jpg'),
        alt: 'Suspension bridge for foot traffic at Newhalem, WA over the Skagit River.',
        credit: 'Photo: Ron Clausen · CC BY-SA 4.0 (Wikimedia)',
        creditUrl: wmFile('Suspension_bridge_at_Newhalem,_WA.jpg'),
        width: 1280,
        height: 960,
      },
      {
        src: wmPhoto('Suspension_bridge_Newhalem.jpg'),
        alt: 'A wood and metal suspension bridge leading to the Trail of the Cedars in Newhalem.',
        credit: 'Photo: Wikimedia · CC',
        creditUrl: wmFile('Suspension_bridge_Newhalem.jpg'),
        width: 1600,
        height: 1067,
      },
    ],
    sourceUrl: 'https://www.wta.org/go-hiking/hikes/trail-of-the-cedars',
    sourceLabel: 'WTA · Trail of the Cedars',
    verifiedAsOf: 'May 17, 2026',
    video: {
      youtubeId: '0QHIVWWmF_Y',
      title: 'Trail of the Cedars · North Cascades',
      creator: 'PNW Trail Talk',
    },
  },
  {
    id: 'goodell-creek-pyramid',
    name: 'Goodell Creek / Pyramid Peak view',
    where: 'MP 119 WA-20 · pullout near Newhalem',
    corridor: 'wa-20',
    effort: 'drive-up',
    parking: 'Roadside pullout · no facilities',
    openSeason: 'Year-round',
    bestTime: 'morning',
    needsWa20: false,
    timeNeeded: '5-10 min',
    milepost: 119,
    restrooms: false,
    ada: false,
    lede:
      'Quick roadside pull-off looking up at Pyramid + Pinnacle Peaks rising above Goodell Creek. The "I drove past it and had to stop" view that anchors the Newhalem approach.',
    driveFromMarblemount: '~20 min',
    driveFromWinthrop: '~2 hr (when WA-20 is open through)',
    photos: [
      {
        src: wmPhoto('Pyramid_and_Pinnacle_Peaks,_North_Cascades.jpg'),
        alt: 'Pyramid and Pinnacle Peaks rising above the WA-20 corridor near Newhalem in summer.',
        credit: 'Photo: Ron Clausen · CC BY-SA 4.0 (Wikimedia)',
        creditUrl: wmFile('Pyramid_and_Pinnacle_Peaks,_North_Cascades.jpg'),
        width: 1600,
        height: 1067,
      },
      {
        src: wmPhoto('Goodell_Creek_-_panoramio.jpg'),
        alt: 'Goodell Creek near Newhalem on a summer day.',
        credit: 'Photo: Panoramio · CC BY-SA 3.0 (Wikimedia)',
        creditUrl: wmFile('Goodell_Creek_-_panoramio.jpg'),
        width: 1600,
        height: 1067,
      },
    ],
    verifiedAsOf: 'May 17, 2026',
  },
  {
    id: 'cutthroat-pass-pullout',
    name: 'Cutthroat Pass drive-up vista',
    where: 'MP 167 WA-20 · pullouts on the east side of Washington Pass',
    corridor: 'wa-20',
    effort: 'drive-up',
    parking: 'Roadside pullouts · no formal lot',
    openSeason: 'Jul-Oct (WA-20 open window)',
    bestTime: 'golden-hour',
    needsWa20: true,
    timeNeeded: '10-15 min',
    milepost: 167,
    restrooms: false,
    ada: false,
    lede:
      'Drive-up portion of the Cutthroat corridor — the same big-granite backdrop the Cutthroat Pass hike earns, but seen from WA-20 pullouts a few minutes east of Washington Pass.',
    driveFromMarblemount: '~1 hr 50 min (when WA-20 is open through)',
    driveFromWinthrop: '~35 min',
    photos: [
      {
        src: wmPhoto('Cutthroat_Pass_at_North_Cascades_in_Washington_27.jpg'),
        alt: 'Cutthroat Pass corridor at North Cascades in Washington — alpine larches and granite peaks in golden light.',
        credit: 'Photo: Wikimedia · CC',
        creditUrl: wmFile('Cutthroat_Pass_at_North_Cascades_in_Washington_27.jpg'),
        width: 1600,
        height: 1067,
      },
      {
        src: wmPhoto('Between_Rainy_and_Washington_Pass_(36871032836).jpg'),
        alt: 'Alpine peak and meadows in the Rainy Pass / Washington Pass corridor along WA-20 in summer.',
        credit: 'Photo: Robert Ashworth · CC BY 2.0 (Wikimedia)',
        creditUrl: wmFile('Between_Rainy_and_Washington_Pass_(36871032836).jpg'),
        width: 2048,
        height: 1536,
      },
    ],
    verifiedAsOf: 'May 17, 2026',
    caveat:
      'Not a labeled NPS overlook — informal pullouts. If full, the Washington Pass Overlook lot (MP 162) gives the same orientation 5 min west.',
  },
  {
    id: 'sun-mountain-viewpoint',
    name: 'Sun Mountain Lodge viewpoint',
    where: '604 Patterson Lake Rd, Winthrop · 3,000 ft · ~15 min south of Winthrop',
    corridor: 'methow',
    effort: 'drive-up',
    parking: 'Lodge lot · open to non-guests for the view + lunch',
    openSeason: 'Year-round (the road is plowed)',
    bestTime: 'sunset',
    needsWa20: false,
    timeNeeded: '20-30 min',
    restrooms: true,
    ada: true,
    lede:
      'Ridge-top patio at 3,000 ft with a 360° sweep — west to the Cascades, south down the Methow Valley. Open to non-guests; can pair with a coffee or lunch stop at the lodge.',
    driveFromMarblemount: '~3 hr (via WA-20 when open through)',
    driveFromWinthrop: '~15 min',
    photos: [
      {
        src: wmPhoto('PattersonLake_Winthrop.jpg'),
        alt: 'Patterson Lake near Winthrop with a calm reflection of the Cascades in summer.',
        credit: 'Photo: Wikimedia · CC',
        creditUrl: wmFile('PattersonLake_Winthrop.jpg'),
        width: 1280,
        height: 853,
      },
    ],
    sourceUrl: 'https://sunmountainlodge.com/',
    sourceLabel: 'Sun Mountain Lodge',
    verifiedAsOf: 'May 17, 2026',
    caveat:
      'Already listed on the lodging page as a stay option — this is the non-guest stop. Sunset perk is the lodge\'s big draw.',
  },
];

/** Effort label for the pill row. */
export const VIEWPOINT_EFFORT_LABEL: Record<ViewpointEffort, string> = {
  'drive-up': 'Drive-up',
  'short-walk': 'Short walk (<10 min)',
};

/** Best-time label for the pill + filter. */
export const VIEWPOINT_BESTTIME_LABEL: Record<ViewpointBestTime, string> = {
  sunrise: 'Sunrise',
  morning: 'Morning',
  midday: 'Midday',
  'golden-hour': 'Golden hour',
  sunset: 'Sunset',
  anytime: 'Anytime',
};

/** Corridor label for grouping + filter. */
export const VIEWPOINT_CORRIDOR_LABEL: Record<ViewpointCorridor, string> = {
  'wa-20': 'WA-20 corridor',
  'mt-baker': 'Mt. Baker corridor (WA-542)',
  methow: 'Methow Valley',
};
