/**
 * Lakes & water — destination-depth data for the lakes/water page.
 *
 * Why a separate file from activities.ts:
 *   Allison's ask (2026-05-17): *"Could destinations use more beefing up?
 *   Reference austria."* Austria split lake-swimming + water-activities into
 *   their own destination pages with carousel-per-stop, swim-vs-paddle filters,
 *   rental-concession naming + phone numbers. This file is the same shape for
 *   NC: each lake/river is a destination, not an "activity menu item."
 *
 *   The 6-9 activity rows in activities.ts (kayak-Patterson, kayak-Diablo,
 *   Ross-water-taxi, swim-Pearrygin, swim-Baker, Chelan-ferry, Skagit-dip)
 *   are still the operator-level *bookings* — surfaced as filter chips on the
 *   Activities page. This file is the *destination-level* version: come to
 *   Diablo Lake, here's what you can do, here are 3-5 photos, here's the rental
 *   concession by phone, here's the warm-vs-cold story.
 *
 * Coverage decisions:
 *   - Diablo Lake (signature turquoise — kayak via Rockport haul + Colonial
 *     Creek launch; no swim — glacier-cold + dam)
 *   - Ross Lake (water taxi from Ross Lake Resort, only on-water rentals in
 *     the corridor; deep cold; fly-fishing)
 *   - Patterson Lake (Sun Mountain marina kayak/SUP/rowboat; warm-summer
 *     alpine; swim friendly)
 *   - Pearrygin Lake State Park (THE warm swim story for mid-August)
 *   - Lake Chelan / Stehekin (long-day-trip ferry; included for completeness)
 *   - Methow River (tubing + careful dip; the moving-water option)
 *
 * Photos:
 *   Reuses Wikimedia URLs proven to load in activities.ts (verified 2026-05-17,
 *   HEAD 200 + image/jpeg). Per Allison's standing rule: SUMMER photos only,
 *   no snow/ice on the water.
 */
import type { CarouselPhoto } from '../sections/photo-carousel';

export type LakeBase = 'west' | 'east' | 'either';
export type LakeSwim = 'yes' | 'cold-dip-only' | 'no';
export type LakeRental = 'on-water' | 'self-haul' | 'none';

export interface DriveFromBase {
  from: string;
  minutes: string;
}

export interface RentalConcession {
  name: string;
  phone?: string;
  url?: string;
  notes?: string;
}

export interface Lake {
  id: string;
  name: string;
  /** 2-line lede shown above the carousel. */
  lede: string;
  /** Geo blurb — where it sits in the corridor. */
  where: string;
  /** Which side of the corridor it fits naturally. */
  base: LakeBase;
  /** Swim-friendliness — drives the at-a-glance pill + filter chips. */
  swim: LakeSwim;
  /** Why swim is/isn't on the table (one short sentence). */
  swimNote?: string;
  /** Kayak rental availability. */
  rental: LakeRental;
  /** Named rental concessions with phone + URL where known. */
  concessions?: RentalConcession[];
  /** Day-use fee shown verbatim — "Free", "$10 Discover Pass", etc. */
  fee: string;
  /** Boat ramp y/n. */
  boatRamp: boolean;
  /** Parking summary. */
  parking: string;
  /** Kid-friendly y/n — for filter + pill. */
  kidFriendly: boolean;
  /** Drive-time from each base side the reader might pick from. */
  driveFromBases: DriveFromBase[];
  /** Best window for mid-August (morning / afternoon swim / sunset). */
  bestWindow: string;
  /** Long description — paragraph + cross-link. */
  description: string;
  /** Reference link — operator / NPS / WA State Parks. */
  sourceUrl: string;
  sourceLabel: string;
  /** Cross-link to the activities entry where overlap exists. */
  activityAnchor?: string;
  /** Cross-link to the cool-sleeping entry if a stay is on this lake. */
  sleepAnchor?: string;
  /** When the listing was last spot-checked. */
  verifiedAsOf: string;
  /**
   * WA-20 through-route dependency. Same convention as `data/viewpoints.ts` /
   * `data/hikes.ts`. `true` = access road is inside or beyond the mid-pass
   * closure zone; render `↻ Needs WA-20 through` red pill. `false` = reachable
   * regardless. Added 2026-05-17 by the integration-audit pass.
   */
  needsWa20Through?: boolean;
  /** 3-5 carousel photos — first slide is also the card thumbnail. */
  photos: CarouselPhoto[];
  /**
   * Optional YouTube preview clip (May 17, 2026 buildout — Allison brief:
   * *"embed videos where helpful simple videos"*). Click-to-load embed via
   * `renderVideoEmbed`. See `sections/video-embed.ts` for constraints.
   */
  video?: {
    youtubeId: string;
    title: string;
    creator: string;
  };
}

// ----------------------------------------------------------------------------
// Photo helpers — same convention as data/activities.ts (Special:FilePath
// redirects auto-pull the current thumb URL).
// ----------------------------------------------------------------------------
const wm = (file: string, w = 1280): string =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${file}?width=${w}`;
const wmCredit = (file: string): string =>
  `https://commons.wikimedia.org/wiki/File:${file}`;

export const LAKES: Lake[] = [
  // ============================================================
  // PEARRYGIN — THE swim story for mid-August (lead).
  // ============================================================
  {
    id: 'pearrygin-lake',
    needsWa20Through: false,
    name: 'Pearrygin Lake State Park',
    lede:
      'The easy-swim story for mid-August — warm sandy-beach water 5 minutes from Winthrop.',
    where: '561 Bear Creek Rd · ~5 min northeast of Winthrop',
    base: 'east',
    swim: 'yes',
    swimNote: 'Warm enough to actually swim (rare in PNW). Sandy beach + raft.',
    rental: 'none',
    concessions: [
      {
        name: 'Pearrygin Lake State Park',
        phone: '(509) 996-2370',
        url: 'https://parks.wa.gov/find-parks/state-parks/pearrygin-lake-state-park',
        notes: 'No on-park rentals — bring inflatable or pick up in Winthrop. Hours 6:30am-dusk.',
      },
    ],
    fee: '$10 day-use Discover Pass (or $45/yr) · watercraft launch $7/day',
    boatRamp: true,
    parking: 'Big lot at day-use beach · fills mid-day August weekends',
    kidFriendly: true,
    driveFromBases: [
      { from: 'Winthrop', minutes: '5 min' },
      { from: 'Mazama', minutes: '25 min' },
      { from: 'Marblemount (west)', minutes: '~3 hr — east-side only' },
    ],
    bestWindow: 'Afternoon 2-6 pm (warmest). Sunset over water till ~8:15 pm.',
    description:
      'The one water stop if you do only one. Roped swim area + raft, warms to 70-72 °F. Two state-park cabins on the lake (see Cool sleeping).',
    sourceUrl: 'https://parks.wa.gov/find-parks/state-parks/pearrygin-lake-state-park',
    sourceLabel: 'WA State Parks · Pearrygin',
    activityAnchor: 'things-to-do.html#pearrygin-swim',
    sleepAnchor: 'lodging.html#cool-sleeping-places',
    verifiedAsOf: 'May 17, 2026',
    photos: [
      {
        src: wm('Pearrygin_Lake_State_Park.jpg'),
        alt: 'Pearrygin Lake State Park — calm green water and the surrounding Methow hills in summer.',
        credit: 'Photo: Wikimedia · CC',
        creditUrl: wmCredit('Pearrygin_Lake_State_Park.jpg'),
        width: 1280,
        height: 592,
      },
    ],
  },

  // ============================================================
  // DIABLO — the signature view + paddle (but no swim).
  // ============================================================
  {
    id: 'diablo-lake',
    needsWa20Through: true,
    name: 'Diablo Lake',
    lede:
      'The turquoise glacier-flour lake on the postcards — stunning to look at and paddle. NOT a swim lake.',
    where: 'WA-20 milepost 132 (overlook) · Colonial Creek launch at MP 130',
    base: 'west',
    swim: 'no',
    swimNote: 'Glacier-fed (~45 °F mid-August) + dam-controlled — wading only, not a swim.',
    rental: 'self-haul',
    concessions: [
      {
        name: 'North Cascade Kayaks (Rockport)',
        phone: '(360) 853-7777',
        url: 'https://northcascadekayaks.com/',
        notes: '~30 min from the launch — pick up + self-haul.',
      },
      {
        name: 'Colonial Creek South Campground launch',
        url: 'https://www.nps.gov/noca/planyourvisit/boating-and-fishing.htm',
        notes: 'Free launch. Lot fills by 9-10 am in August.',
      },
    ],
    fee: 'Free overlook + free launch',
    boatRamp: true,
    parking: 'Overlook: big lot + restrooms · Launch: Colonial Creek SC (arrive early)',
    kidFriendly: true,
    driveFromBases: [
      { from: 'Marblemount (west)', minutes: '~30 min to Colonial Creek launch' },
      { from: 'Concrete (west)', minutes: '~55 min' },
      { from: 'Winthrop (east)', minutes: '~2.5 hr (when WA-20 open)' },
    ],
    bestWindow: 'Mid-morning for the brightest turquoise.',
    description:
      'The signature North Cascades photo. MP 132 overlook = 20-30 min postcard stop; Colonial Creek launch = paddle under 7,000-ft walls.',
    sourceUrl: 'https://www.nps.gov/noca/learn/nature/index.htm',
    sourceLabel: 'NPS · North Cascades nature',
    activityAnchor: 'things-to-do.html#diablo-kayak',
    verifiedAsOf: 'May 17, 2026',
    video: {
      youtubeId: 'w_WGUL8Scsw',
      title: 'Hike & Paddle the North Cascades · Thunder Knob + Diablo Lake Kayaking',
      creator: 'Adventure Begins Outdoors',
    },
    photos: [
      {
        src: 'img/diablo-lake-from-overlook-03.jpg',
        alt: 'Diablo Lake glowing turquoise from a forested summer overlook.',
        credit: 'Photo: Joe Mabel · CC BY-SA 4.0',
        creditUrl: 'https://commons.wikimedia.org/wiki/File:Diablo_Lake_from_Overlook_03.jpg',
        width: 1200,
        height: 800,
      },
      {
        src: wm('Diablo_Lake_(Washington_State).jpg'),
        alt: 'Diablo Lake turquoise water ringed by green Cascade walls in summer.',
        credit: 'Photo: Wikimedia · CC',
        creditUrl: wmCredit('Diablo_Lake_(Washington_State).jpg'),
        width: 1280,
        height: 853,
      },
      {
        src: wm('Diablo_Lake_with_Pinnacle_Peak.jpg'),
        alt: 'Diablo Lake with Pinnacle Peak above — bright August blue.',
        credit: 'Photo: Wikimedia · CC',
        creditUrl: wmCredit('Diablo_Lake_with_Pinnacle_Peak.jpg'),
        width: 1280,
        height: 853,
      },
    ],
  },

  // ============================================================
  // ROSS — the water-taxi paddle day.
  // ============================================================
  {
    id: 'ross-lake',
    needsWa20Through: true,
    name: 'Ross Lake',
    lede:
      'The 23-mile-long wild reservoir north of Diablo. The only on-water rentals in the corridor — but takes a hike-down + boat to reach.',
    where: 'Trailhead: Diablo Dam end of Diablo Dam Rd · MP 134 then 1-mi descent',
    base: 'west',
    swim: 'cold-dip-only',
    swimNote: 'Deep + cold (~50 °F summer surface). Locals dip from the resort dock — not a swim destination.',
    rental: 'on-water',
    concessions: [
      {
        name: 'Ross Lake Resort',
        phone: '(206) 386-4437',
        url: 'https://www.rosslakeresort.com/equipment-rentals',
        notes:
          '2026: single kayak $90/day · double $120 · canoe $80 · motorboat $190 · rod $30. First-come, first-served. Arrive before 11am (winds pick up). No cell service on the lake.',
      },
    ],
    fee: 'Free trail + free dock access (boats are paid above)',
    boatRamp: false,
    parking: 'Diablo Dam trailhead lot — small · arrive by 8:30 am peak August',
    kidFriendly: true,
    driveFromBases: [
      { from: 'Marblemount (west)', minutes: '~1 hr to Diablo Dam trailhead' },
      { from: 'Concrete (west)', minutes: '~1 hr 30 min' },
    ],
    bestWindow: 'Paddle morning, hike or fish PM (water-taxi 8 am-7 pm).',
    description:
      'Worth the choreography to BE on the lake. Hike 1 mi down from Diablo Dam, water-taxi north, paddle back. Fly fishing + floating cabins (see Cool sleeping).',
    sourceUrl: 'https://www.rosslakeresort.com/equipment-rentals',
    sourceLabel: 'Ross Lake Resort',
    activityAnchor: 'things-to-do.html#ross-lake-watertaxi',
    sleepAnchor: 'lodging.html#cool-sleeping-places',
    verifiedAsOf: 'May 17, 2026',
    photos: [
      {
        src: wm('North_Cascades_Natnl_Pk_Washington_State_Ross_Lake_4311.jpg'),
        alt: 'Ross Lake stretching north between forested Cascade ridges in summer.',
        credit: 'Photo: USGS / NPS · public domain',
        creditUrl: wmCredit('North_Cascades_Natnl_Pk_Washington_State_Ross_Lake_4311.jpg'),
        width: 1280,
        height: 853,
      },
      {
        src: wm('North_Cascades_-_Ross_Lake_-_2017_8_29.jpg'),
        alt: 'Ross Lake in late August 2017 — bright summer blue, no snow on the water.',
        credit: 'Photo: Wikimedia · CC',
        creditUrl: wmCredit('North_Cascades_-_Ross_Lake_-_2017_8_29.jpg'),
        width: 1280,
        height: 853,
      },
    ],
  },

  // ============================================================
  // PATTERSON — Sun Mountain marina, warm + paddleable.
  // ============================================================
  {
    id: 'patterson-lake',
    needsWa20Through: false,
    name: 'Patterson Lake',
    lede:
      'The Sun Mountain Lodge lake — calm sub-alpine water, walk-up rentals at the marina. Warm enough to swim in August.',
    where: 'Sun Mountain Lodge marina · 604 Patterson Lake Rd · ~15 min south of Winthrop',
    base: 'east',
    swim: 'yes',
    swimNote: 'Warm-summer alpine lake (~68-70 °F August) — swim off the dock or marina beach.',
    rental: 'on-water',
    concessions: [
      {
        name: 'Sun Mountain Lodge Marina',
        phone: '(509) 996-2211',
        url: 'https://sunmountainlodge.com/adventure/water-activities/',
        notes: 'Kayak ~$30-50/hr · SUP, rowboat, pedalboat too. Walk-up, open to non-guests — call ahead in August.',
      },
    ],
    fee: 'Free if you stay at Sun Mountain · day-use fee at marina ($) for non-guests',
    boatRamp: true,
    parking: 'Marina lot · also Patterson Lake cabin pull-offs',
    kidFriendly: true,
    driveFromBases: [
      { from: 'Winthrop', minutes: '15 min' },
      { from: 'Mazama', minutes: '~30 min' },
      { from: 'Marblemount (west)', minutes: '~3 hr — east-side only' },
    ],
    bestWindow: 'Late-morning calm for paddling. Sunset over the west shore (#5 sunset rank).',
    description:
      'Easy beginner paddling on the Sun Mountain property — the east-side rest-day water option. Patterson Lake Cabins sit steps from the dock (Cool sleeping).',
    sourceUrl: 'https://sunmountainlodge.com/adventure/water-activities/',
    sourceLabel: 'Sun Mountain Lodge',
    activityAnchor: 'things-to-do.html#patterson-kayak',
    sleepAnchor: 'lodging.html#lodging-sun-mountain',
    verifiedAsOf: 'May 17, 2026',
    video: {
      youtubeId: 'jhzNSrPthL0',
      title: 'Patterson Lake',
      creator: 'Sun Mountain Lodge',
    },
    photos: [
      {
        src: wm('PattersonLake_Winthrop.jpg'),
        alt: 'Patterson Lake near Winthrop with a calm reflection of the Cascades in summer.',
        credit: 'Photo: Wikimedia · CC',
        creditUrl: wmCredit('PattersonLake_Winthrop.jpg'),
        width: 1280,
        height: 853,
      },
    ],
  },

  // ============================================================
  // LAKE CHELAN / STEHEKIN — long-day-trip option.
  // ============================================================
  {
    id: 'lake-chelan',
    needsWa20Through: false,
    name: 'Lake Chelan + Stehekin ferry',
    lede:
      'The 50-mile fjord at the south edge of the park. Winthrop → Chelan (~3 hr) then ferry to Stehekin (4 hr each way). Almost certainly cut.',
    where: 'Lady of the Lake terminal · 1418 W Woodin Ave · Chelan, WA',
    base: 'east',
    swim: 'yes',
    swimNote: 'Lake Chelan town beach swims warm in August. Stehekin end is colder, alpine.',
    rental: 'on-water',
    concessions: [
      {
        name: 'Lady of the Lake (passenger ferry)',
        phone: '(509) 682-4584',
        url: 'https://ladyofthelake.com/boat-schedules/',
        notes: 'Same-day RT ~$60-70/adult. ~8 am depart, ~5 pm return (~6 hr in Stehekin).',
      },
      {
        name: 'Stehekin Discovery Bikes + Buses',
        url: 'https://stehekin.com/lodging/',
        notes: 'Red bus + bike rentals at the landing. Confirm 2026 hours by phone.',
      },
    ],
    fee: 'Ferry RT $60-70/adult · no day-use fee for the lake itself',
    boatRamp: true,
    parking: 'Chelan ferry terminal · paid lot',
    kidFriendly: true,
    driveFromBases: [
      { from: 'Winthrop', minutes: '~3 hr to Chelan ferry' },
      { from: 'Marblemount (west)', minutes: '~4 hr' },
    ],
    bestWindow: 'Full-day commitment — only if an east-side day frees up.',
    description:
      'Boat-only village at the head of Lake Chelan (bakery, red school bus, Rainbow Falls). Listed for completeness — only worth it if a hike day collapses.',
    sourceUrl: 'https://ladyofthelake.com/boat-schedules/',
    sourceLabel: 'Lady of the Lake',
    activityAnchor: 'things-to-do.html#lake-chelan-stehekin',
    sleepAnchor: 'lodging.html#cool-sleeping-places',
    verifiedAsOf: 'May 17, 2026',
    photos: [
      {
        src: wm('Lake_Chelan_from_Castle_Rock_(8dd37d134c384714b322012c2ca66ca1).JPG'),
        alt: 'Lake Chelan seen from Castle Rock — blue summer water snaking between dry ridges.',
        credit: 'Photo: Wikimedia · CC',
        creditUrl: wmCredit('Lake_Chelan_from_Castle_Rock_(8dd37d134c384714b322012c2ca66ca1).JPG'),
        width: 1280,
        height: 960,
      },
      {
        src: wm('Stehekin_Chelan.JPG'),
        alt: 'Stehekin landing at the head of Lake Chelan in summer.',
        credit: 'Photo: Wikimedia · CC',
        creditUrl: wmCredit('Stehekin_Chelan.JPG'),
        width: 1280,
        height: 960,
      },
    ],
  },

  // ============================================================
  // METHOW RIVER — moving water, tubing + careful dip.
  // ============================================================
  {
    id: 'methow-river',
    needsWa20Through: false,
    name: 'Methow River',
    lede:
      'The east-side river — the warmest moving water on the trip. Tube it on a hot August afternoon; careful dip at gravel-bar edges.',
    where: 'Mile-by-mile along WA-20 through Winthrop + Twisp · accesses at Riverside Ave + Methow River Trail',
    base: 'east',
    swim: 'cold-dip-only',
    swimNote: 'River-current — wade at gravel bars only. Tubing is the swim equivalent.',
    rental: 'self-haul',
    concessions: [
      {
        name: 'Methow Cycle & Sport (Winthrop)',
        phone: '(509) 996-3645',
        url: 'https://methowcyclesport.com/',
        notes: 'Bikes + occasional tube rentals — call to confirm August stock.',
      },
      {
        name: 'Winthrop town shops',
        url: 'https://winthropwashington.com/',
        notes: 'Swim/picnic accesses along Riverside Ave + the river trail.',
      },
    ],
    fee: 'Free river access · paid town parking',
    boatRamp: false,
    parking: 'On-street Winthrop · trailhead pullouts along WA-20',
    kidFriendly: true,
    driveFromBases: [
      { from: 'Winthrop', minutes: 'In town' },
      { from: 'Mazama', minutes: '~25 min' },
      { from: 'Marblemount (west)', minutes: '~3 hr — east-side only' },
    ],
    bestWindow: 'Hot afternoon (2-6 pm). Runs lower + warmer mid-August than June.',
    description:
      'Warm by PNW standards (mid-60s °F), gentle through Winthrop — easy tube float on a hot afternoon. Picnic at the Riverside Ave parks.',
    sourceUrl: 'https://methowtrails.org/',
    sourceLabel: 'Methow Trails · Methow Valley',
    activityAnchor: 'things-to-do.html#methow-trail',
    verifiedAsOf: 'May 17, 2026',
    photos: [
      {
        src: wm('Methow_River.JPG'),
        alt: 'Methow River through summer hillside east of Winthrop.',
        credit: 'Photo: Wikimedia · CC',
        creditUrl: wmCredit('Methow_River.JPG'),
        width: 1280,
        height: 853,
      },
      {
        src: wm('Twisp_River_Valley_in_Twisp,_Washington.jpg'),
        alt: 'Methow / Twisp valley floor in summer — green river corridor.',
        credit: 'Photo: Wikimedia · CC',
        creditUrl: wmCredit('Twisp_River_Valley_in_Twisp,_Washington.jpg'),
        width: 1280,
        height: 720,
      },
    ],
  },
];

// ----------------------------------------------------------------------------
// Rule-outs — fail-loud about lakes that aren't on this trip and why.
// Matches the activities.ts pattern.
// ----------------------------------------------------------------------------
export interface LakeRuledOut {
  what: string;
  why: string;
}

export const LAKES_RULED_OUT: LakeRuledOut[] = [
  {
    what: 'Baker Lake (swim + free launch)',
    why: 'A Mt. Baker reservoir, not a park lake — kept on Activities.',
  },
  {
    what: 'Wallace Falls / Lake 22 / Hidden Lake',
    why: 'Hike-in alpine lakes — covered on the Hikes page.',
  },
  {
    what: 'Skagit River swim',
    why: 'On Activities as a careful wading spot — not a swim destination.',
  },
];
