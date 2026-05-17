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
      'The easy-swim story for mid-August — warm sandy-beach water 5 minutes from Winthrop. The PNW lake that doesn\'t feel like a PNW lake.',
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
        notes: 'No on-park rentals — bring inflatable or pick up at Winthrop shops.',
      },
    ],
    fee: '$10 day-use Discover Pass (or $30/yr)',
    boatRamp: true,
    parking: 'Big lot at day-use beach · fills mid-day August weekends',
    kidFriendly: true,
    driveFromBases: [
      { from: 'Winthrop', minutes: '5 min' },
      { from: 'Mazama', minutes: '25 min' },
      { from: 'Marblemount (west)', minutes: '~3 hr — east-side only' },
    ],
    bestWindow:
      'Afternoon 2-6 pm (water warmest, Methow Valley peaks at 85 °F). Sunset over water if you stay till ~8:15 pm.',
    description:
      'The August-perfect swim destination. 1,186-acre state park, 11,000 ft of waterfront, sandy beach with a roped-off swim area and a floating swim raft. Picnic tables, restrooms with changing rooms, lifeguarded day-use beach in peak season. Lake warms to 70-72 °F in August — actually pleasant, not the gasp-cold of glacial lakes. Also has a 5.3-mile Rex Derr loop trail if a walk first sounds right. Two state-park cabins on the lake (book FAR ahead — see Cool sleeping). If you only do one water thing on this trip, do this.',
    sourceUrl: 'https://parks.wa.gov/find-parks/state-parks/pearrygin-lake-state-park',
    sourceLabel: 'WA State Parks · Pearrygin',
    activityAnchor: 'activities.html#pearrygin-swim',
    sleepAnchor: 'for-erin.html#cool-sleeping',
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
      'The turquoise glacier-flour lake on the postcards. Stunning to look at and paddle on. NOT a swim lake — glacier-cold and dam-controlled.',
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
        notes: '~30 min from Colonial Creek launch — pick up + self-haul to the lake.',
      },
      {
        name: 'Colonial Creek South Campground launch',
        url: 'https://www.nps.gov/noca/planyourvisit/boating-and-fishing.htm',
        notes: 'Free launch — no on-lake outfitter. Lot fills by 9-10 am in August.',
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
    bestWindow:
      'Mid-morning for the brightest turquoise. Sunset bouncing off the walls if WA-20 stays open through the closure.',
    description:
      "The signature North Cascades photo. Glacier-flour suspended in the meltwater scatters blue+green light, hence the unreal turquoise. From the MP 132 overlook: 20-30 min stop, easy postcard hit. From Colonial Creek launch (MP 130): paddle out onto the lake with 7,000-ft walls on every side. No on-lake rentals — pre-2026 Ross Lake Resort had a Diablo tie-in but that's gone; North Cascade Kayaks in Rockport is the current path (rent there, self-haul to the launch). Water sits ~45 °F all summer — feet only. The lake is what makes a Path-A or Path-B day complete.",
    sourceUrl: 'https://www.nps.gov/noca/learn/nature/diablo-lake.htm',
    sourceLabel: 'NPS · Diablo Lake',
    activityAnchor: 'activities.html#diablo-kayak',
    verifiedAsOf: 'May 17, 2026',
    video: {
      youtubeId: 'w_WGUL8Scsw',
      title: 'Hike & Paddle the North Cascades · Thunder Knob + Diablo Lake Kayaking',
      creator: 'Adventure Begins Outdoors',
    },
    photos: [
      {
        src: 'https://upload.wikimedia.org/wikipedia/commons/3/3f/Diablo_Lake_from_Overlook_03.jpg',
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
      'The 23-mile-long wild reservoir north of Diablo. Only outfit with on-water rentals — Ross Lake Resort runs a water taxi + kayak fleet, but takes a hike-down + boat to reach.',
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
          'Eddyline Nighthawk kayak $60/day · canoe $50/day · water-taxi shuttle $4/person each way · drop-off camping $30 RT. Portage service Jun 11 - Oct 31, 2026. Call ahead for any shoulder windows.',
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
    bestWindow:
      'Half-day or full-day on the lake (8 am-7 pm water-taxi window). Wind picks up afternoons — paddle morning, hike or fish PM.',
    description:
      "Worth the choreography if you want to BE ON Ross Lake, not just look at it from the overlook. The only outfitter with on-water rentals in the entire NC corridor. Get there by hiking the 1-mile trail down from Diablo Dam (or take the NPS shuttle when running), then water-taxi north up the lake — drop off at one of the camps and paddle back, or rent a kayak/canoe right at the resort. Fly fishing is the other reason locals come (rainbow + cutthroat). Resort itself is rustic — floating cabins with no road access, see Cool sleeping if the lottery comes through.",
    sourceUrl: 'https://www.rosslakeresort.com/equipment-rentals',
    sourceLabel: 'Ross Lake Resort',
    activityAnchor: 'activities.html#ross-lake-watertaxi',
    sleepAnchor: 'for-erin.html#cool-sleeping',
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
      'The Sun Mountain Lodge lake — calm sub-alpine water, walk-up kayak/SUP/rowboat rentals at the marina. Warm enough to swim in August.',
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
        notes:
          'Kayak ~$30-50/hr · SUP, rowboat, pedalboat also available. Walk-up rentals — call ahead in peak August. Open to non-guests.',
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
    bestWindow:
      'Late morning calm for paddling. Sunset over the west shore (#5 on the sunset rank).',
    description:
      'Sub-alpine reservoir on the Sun Mountain Lodge property. Calm water, mountain backdrop, easy beginner paddling — exactly the rest-day water option for Path B or Path C. Marina is open to the public, not guests-only. Patterson is also the most photographed reflection on the east side outside Pearrygin. Sun Mountain Patterson Lake Cabins (Cool sleeping) put you steps from the dock.',
    sourceUrl: 'https://sunmountainlodge.com/adventure/water-activities/',
    sourceLabel: 'Sun Mountain Lodge',
    activityAnchor: 'activities.html#patterson-kayak',
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
      'The 50-mile fjord at the south edge of the park. Long day trip — drive Winthrop → Chelan (~3 hr) then ferry to Stehekin (4 hr each way). Worth flagging, almost certainly cut.',
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
        notes:
          'Lady Liberty same-day RT ~$60-70/adult — verify on site. ~8 am depart, ~5 pm return (~6 hr layover in Stehekin).',
      },
      {
        name: 'Stehekin Discovery Bikes + Buses',
        url: 'https://www.stehekinvalley.com/red-bus.html',
        notes: 'Red school bus to the Stehekin valley · bike rentals at the landing.',
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
    bestWindow:
      'Full-day commitment — only worth it if a Path-C day frees up. Otherwise admire from the map.',
    description:
      'Boat-only village at the head of 50-mile-long Lake Chelan, inside the North Cascades NRA. Stehekin is the legend — the bakery, the red school bus, the Stehekin Valley road, the Rainbow Falls hike from the landing. But: this is a 3-hour drive south to Chelan, then a 4-hour boat each way. On a 4-night trip with hikes already committed, this almost always falls off the plan. Listed for completeness in case a hike day collapses and you want a "real boat day" instead.',
    sourceUrl: 'https://ladyofthelake.com/boat-schedules/',
    sourceLabel: 'Lady of the Lake',
    activityAnchor: 'activities.html#lake-chelan-stehekin',
    sleepAnchor: 'for-erin.html#cool-sleeping',
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
      'The east-side river — not a lake, but the warmest moving water on the trip. Tube it on a hot August afternoon, picnic at the riverside parks, careful dip at gravel-bar edges.',
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
        notes: 'Town swim/picnic accesses along Riverside Ave + Methow River Trail.',
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
    bestWindow:
      'Hot afternoon (PM 2-6) when the air hits 85 °F. River runs lower + warmer mid-August than June.',
    description:
      'The Methow runs warm by PNW standards (mid-60s °F August), and the gentle gradient through Winthrop makes for an easy float on a hot afternoon. Bring or rent a tube. Pack the picnic to the riverside parks on Riverside Ave. Wade at the gravel-bar edges, do not swim out into the current. Pairs naturally with a Winthrop boardwalk afternoon or an Old Schoolhouse Brewery dinner on the deck. Note: water levels drop through August — earlier in the month is fuller.',
    sourceUrl: 'https://winthropwashington.com/things-to-do/water-activities/',
    sourceLabel: 'Winthrop tourism · water',
    activityAnchor: 'activities.html#methow-trail',
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
    why:
      'Surfaced on the Activities page (sandy swim beach at Horseshoe Cove, ~1 hr from Marblemount). Useful as a Path-A west-side rest-day option, but it\'s a Mt. Baker reservoir, not a North Cascades park lake — kept on Activities, not promoted here.',
  },
  {
    what: 'Wallace Falls / Lake 22 / Hidden Lake',
    why:
      'Hike-in alpine lakes — covered (or rule-outed) on the Hikes page, not as destination lakes. Listing them here would double-count and dilute the "drive-up + paddle + swim" filter.',
  },
  {
    what: 'Skagit River swim',
    why:
      'On Activities as a careful wading spot (Marblemount Boat Launch). Not a swim destination — the river runs hard and glacially cold. Kept narrow there, not promoted to lake-tier here.',
  },
];
