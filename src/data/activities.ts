/**
 * Activity add-ons — non-hike worth-considering items.
 *
 * Surfaces things the corridor offers besides hikes + viewpoints:
 *   - Kayak / paddle (Patterson Lake, Diablo Lake, Ross Lake)
 *   - Swimming (Pearrygin Lake, Patterson Lake, Skagit dipping spots)
 *   - Bike + town walks
 *   - Wildlife viewing windows
 *
 * Promoted from a buried "Details" sub-section to its own top-level page on
 * 2026-05-17 — Allison's live-site note: *"Add activities and also a lot of
 * missing photos."* Each activity now carries a photo carousel + Booking-style
 * at-a-glance pills + filter chips + verified-DATE badges.
 *
 * Not "must-do." Menu items to choose from on a rest day or evening.
 */
import type { CarouselPhoto } from '../sections/photo-carousel';

export type ActivityCategory = 'water' | 'town' | 'wildlife' | 'general';
export type ActivityCost = 'free' | 'low' | 'mid' | 'high';

export interface Activity {
  id: string;
  name: string;
  where: string;
  cost: string;
  /** Bucket for the cost filter chip — derived per item, not from `cost` text. */
  costTier: ActivityCost;
  time: string;
  /** Which path(s) this fits naturally. */
  pathFit: string;
  description: string;
  /** Source link — operator site, NPS, etc. */
  sourceUrl?: string;
  sourceLabel?: string;
  /** Grouping bucket. Defaults to 'general' if omitted. */
  category?: ActivityCategory;
  /** Side filter chip behavior — same convention as hikes. */
  side?: 'west' | 'east' | 'either';
  /** Drive-time from the base of the side it pairs with. */
  driveFromBase?: string;
  /** Equipment / gear needed (free-text — surfaces in pill row). */
  equipment?: string;
  /** Whether this is reasonable with kids in tow. */
  kidFriendly?: boolean;
  /** Whether on-water rentals exist at the activity (vs self-haul). */
  rentalsOnSite?: boolean;
  /** When the listing was last spot-checked. */
  verifiedAsOf?: string;
  /**
   * WA-20 through-route dependency. Same convention as `data/viewpoints.ts` /
   * `data/hikes.ts` / `data/lakes.ts`. `true` = render `↻ Needs WA-20 through`
   * red pill. Added 2026-05-17 by the integration-audit pass.
   */
  needsWa20Through?: boolean;
  /** Carousel photos — first slide is also the card thumbnail. */
  photos?: CarouselPhoto[];
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
// Photo URLs — Special:FilePath redirects auto-pull the latest thumb so we
// don't have to track filename-hash prefix changes. Used the same way in
// data/hikes.ts and data/viewpoints.ts. All SUMMER (no snow/ice) — verified
// captioned summer or shoulder-season shots.
// ----------------------------------------------------------------------------

const wm = (file: string, w = 1280): string =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${file}?width=${w}`;

const wmCredit = (file: string): string =>
  `https://commons.wikimedia.org/wiki/File:${file}`;

export const ACTIVITIES: Activity[] = [
  // ============== Water + lakes ==============
  {
    id: 'patterson-kayak',
    needsWa20Through: false,
    name: 'Kayak / SUP / rowboat Patterson Lake',
    where: 'Sun Mountain Lodge Marina · 604 Patterson Lake Rd · 15 min south of Winthrop',
    cost: '~$30-50 / hr kayak · SUP, rowboat, pedalboat also available',
    costTier: 'mid',
    time: '60-90 min',
    pathFit: 'Path B (east side)',
    side: 'east',
    driveFromBase: '~15 min from Winthrop',
    equipment: 'Rentals on-site — walk-up at marina',
    kidFriendly: true,
    rentalsOnSite: true,
    verifiedAsOf: 'May 17, 2026',
    description:
      'Calm sub-alpine lake, mountain backdrop, easy beginner paddling. Walk-up rentals at the lodge marina — call ahead in peak August (509-996-2211). Solid rest-day option for the east-side leg of Path B.',
    sourceUrl: 'https://sunmountainlodge.com/adventure/water-activities/',
    sourceLabel: 'Sun Mountain Lodge',
    category: 'water',
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
  {
    id: 'diablo-kayak',
    needsWa20Through: true,
    name: 'Kayak Diablo Lake (self-launch)',
    where: 'Pick up rental at North Cascade Kayaks (Rockport, ~30 min west of Diablo) · launch at Colonial Creek South Campground · MP 130',
    cost: '~$100/day single · ~$150/day double (North Cascade Kayaks) · launch is free',
    costTier: 'high',
    time: 'Half to full day',
    pathFit: 'All paths (west side · WA-20 corridor)',
    side: 'west',
    driveFromBase: '~30 min Rockport → Colonial Creek',
    equipment: 'Self-haul kayak from Rockport — no on-lake rentals',
    kidFriendly: false,
    rentalsOnSite: false,
    verifiedAsOf: 'May 17, 2026',
    description:
      "No rentals on Diablo Lake itself — pre-2026 there was a Ross Lake Resort tie-in, but the on-lake rental option is North Cascade Kayaks in Rockport (self-haul) plus a Colonial Creek launch. Turquoise glacier-flour water, ringed by 7,000-ft walls. The launch lot fills by 9-10 am in August — start early.",
    sourceUrl: 'https://northcascadekayaks.com/',
    sourceLabel: 'North Cascade Kayaks',
    category: 'water',
    video: {
      youtubeId: 'fY2HaIimbA8',
      title: 'Diablo Lake Kayaking and Paddleboarding',
      creator: 'Wandering Through Time and Place',
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
  {
    id: 'ross-lake-watertaxi',
    needsWa20Through: true,
    name: 'Ross Lake water taxi + kayak day',
    where: 'Ross Lake Resort · access via Diablo Dam trail or NPS shuttle',
    cost: '2026 rates (verified May 17): single kayak $90/day · double $120 · canoe $80 · motorboat $190 · fly/spin rod $30/day · water-taxi ~$4/person each way (verify when booking)',
    costTier: 'mid',
    time: 'Half to full day',
    pathFit: 'Path A + Path B (west side · need full day, not a viewpoint detour)',
    side: 'west',
    driveFromBase: '~1 hr Marblemount → Diablo Dam trailhead',
    equipment: 'On-water rentals at the resort',
    kidFriendly: true,
    rentalsOnSite: true,
    verifiedAsOf: 'May 17, 2026',
    description:
      'The only outfit with on-water rentals in the corridor. Reach the resort by hiking the 1-mile trail down from Diablo Dam (or NPS shuttle when running), then water-taxi 8 am-7 pm on demand. Worth the choreography if you want to be ON Ross Lake, not just look at it. Portage service June 11 - Oct 31 in 2026.',
    sourceUrl: 'https://www.rosslakeresort.com/equipment-rentals',
    sourceLabel: 'Ross Lake Resort',
    category: 'water',
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
  {
    id: 'pearrygin-swim',
    needsWa20Through: false,
    name: 'Swim at Pearrygin Lake State Park',
    where: '~5 min northeast of Winthrop · 561 Bear Creek Rd',
    cost: 'Discover Pass $10/day or $45/year (verified May 17, 2026) · watercraft launch $7/day separate',
    costTier: 'low',
    time: '1-2 hrs',
    pathFit: 'Path B (east side)',
    side: 'east',
    driveFromBase: '~5 min from Winthrop',
    equipment: 'Bring suit, towel, sunscreen',
    kidFriendly: true,
    rentalsOnSite: false,
    verifiedAsOf: 'May 17, 2026',
    description:
      'Warm-water swimming lake (unusual in the PNW). Sandy beach, swimming raft, picnic tables, 11,000 ft of waterfront. Easy after-hike cool-off in the 85 F Methow afternoons. 1,186-acre state park — also has a 5.3-mi Rex Derr loop trail if you want a walk first.',
    sourceUrl: 'https://parks.wa.gov/find-parks/state-parks/pearrygin-lake-state-park',
    sourceLabel: 'WA State Parks',
    category: 'water',
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
  {
    id: 'baker-lake-swim',
    needsWa20Through: false,
    name: 'Baker Lake — swim + free launch',
    where: 'Horseshoe Cove Campground day-use · 27 mi south of Mt. Baker on Baker Lake Rd · ~1 hr from Marblemount',
    cost: '$5 day-use boat ramp · swim free',
    costTier: 'low',
    time: '1-3 hrs',
    pathFit: 'Path A (west-side rest-day option) · Path B Day 1 detour',
    side: 'west',
    driveFromBase: '~1 hr from Marblemount',
    equipment: 'Bring suit + own kayak if paddling',
    kidFriendly: true,
    rentalsOnSite: false,
    verifiedAsOf: 'May 17, 2026',
    description:
      "Large reservoir under Mt. Baker with a real sandy swim beach at Horseshoe Cove. Cold but not glacial like Diablo — actually swimmable. Bring-your-own kayak crowd; rentals are scarce locally. Day-use season mid-May through September. Good Path-A backup if Cascade Pass weather turns.",
    sourceUrl: 'https://www.fs.usda.gov/recarea/mbs/recarea/?recid=17856',
    sourceLabel: 'Mt. Baker-Snoqualmie NF',
    category: 'water',
    photos: [
      {
        src: wm('Mt_Shuksan_from_Baker_Lake.jpg'),
        alt: 'Baker Lake with Mt. Shuksan above — green summer ridges, no snow on the lake.',
        credit: 'Photo: Wikimedia · CC',
        creditUrl: wmCredit('Mt_Shuksan_from_Baker_Lake.jpg'),
        width: 1280,
        height: 823,
      },
      {
        src: wm('Baker_Lake_from_Mount_Baker.jpeg'),
        alt: 'Baker Lake seen from Mount Baker in summer — long forested reservoir.',
        credit: 'Photo: Wikimedia · CC',
        creditUrl: wmCredit('Baker_Lake_from_Mount_Baker.jpeg'),
        width: 1280,
        height: 848,
      },
    ],
  },
  {
    id: 'lake-chelan-stehekin',
    needsWa20Through: false,
    name: 'Lake Chelan ferry to Stehekin (long detour)',
    where: 'Lady of the Lake terminal · Chelan, WA · ~3 hr drive from Winthrop',
    cost: 'Lady Liberty same-day RT ~$60-70/adult (verify on site) · Frequent-Traveler $351/10-rides',
    costTier: 'mid',
    time: 'Full day — 8 am depart, ~5 pm return (~6 hr layover in Stehekin)',
    pathFit: 'Path B only — and only if a Day-4 slot frees up for a full day away from Winthrop',
    side: 'east',
    driveFromBase: '~3 hr Winthrop → Chelan',
    equipment: 'Pack snacks, layers, lunch',
    kidFriendly: true,
    rentalsOnSite: false,
    verifiedAsOf: 'May 17, 2026',
    description:
      'Boat-only village at the head of 50-mile-long Lake Chelan, inside North Cascades NRA. Stehekin is famous (the bakery, the red school bus, the Stehekin valley). But: this is a 3-hr drive south to Chelan, then a 4-hr boat each way. Worth flagging — almost certainly cut from this 5-day trip, but if Day-4 turns into "we want a real boat day" this is it.',
    sourceUrl: 'https://ladyofthelake.com/boat-schedules/',
    sourceLabel: 'Lady of the Lake',
    category: 'water',
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
  {
    id: 'skagit-riverside',
    needsWa20Through: false,
    name: 'Skagit River — riverside picnic + careful dip',
    where: 'Marblemount Boat Launch · MP 105 (west)',
    cost: 'Free',
    costTier: 'free',
    time: '30-60 min',
    pathFit: 'All paths (Marblemount stop)',
    side: 'west',
    driveFromBase: 'In Marblemount',
    equipment: 'Picnic + water shoes',
    kidFriendly: true,
    rentalsOnSite: false,
    verifiedAsOf: 'May 17, 2026',
    description:
      "Not a swim destination — the Skagit runs hard and glacially cold. But it's a beautiful river-walk + lunch spot a few minutes from the Marblemount lodging cluster. Wading at the gravel-bar edges is fine on a warm day. Don't swim out into the current.",
    sourceUrl: 'https://www.nps.gov/noca/planyourvisit/boating-and-fishing.htm',
    sourceLabel: 'NPS · Skagit paddling',
    category: 'water',
    photos: [
      {
        src: wm("Skagit_River_-_Marblemount_to_O'Brien-Riggs_State_Park_07.jpg"),
        alt: 'Skagit River near Marblemount — gravel bar and clear summer water.',
        credit: 'Photo: Wikimedia · CC',
        creditUrl: wmCredit("Skagit_River_-_Marblemount_to_O'Brien-Riggs_State_Park_07.jpg"),
        width: 1280,
        height: 837,
      },
    ],
  },

  // ============== Land + town ==============
  {
    id: 'methow-trail',
    needsWa20Through: false,
    name: 'Methow Valley Trail bike rental',
    where: 'Winthrop town (multiple shops)',
    cost: '~$45-65 / day cruiser; e-bikes more',
    costTier: 'mid',
    time: '1-3 hrs',
    pathFit: 'Path B (east side)',
    side: 'east',
    driveFromBase: 'In Winthrop',
    equipment: 'Rentals on Riverside Ave',
    kidFriendly: true,
    rentalsOnSite: true,
    verifiedAsOf: 'May 17, 2026',
    description:
      'Paved + gravel community trail along the river. Easy ride for a relaxed afternoon. Methow Cycle & Sport rents on Riverside Ave.',
    category: 'town',
    sourceUrl: 'https://methowcyclesport.com/',
    sourceLabel: 'Methow Cycle & Sport',
    photos: [
      {
        src: wm('Methow_River.JPG'),
        alt: 'Methow River through summer hillside near the Methow Valley Trail.',
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
  {
    id: 'wildlife',
    needsWa20Through: false,
    name: 'Wildlife viewing windows',
    where: 'Cascade Pass corridor + Washington Pass + Methow Valley',
    cost: 'Free',
    costTier: 'free',
    time: 'Dawn / dusk',
    pathFit: 'All paths',
    side: 'either',
    driveFromBase: 'Anywhere along WA-20',
    equipment: 'Binoculars help · quiet shoes',
    kidFriendly: true,
    rentalsOnSite: false,
    verifiedAsOf: 'May 17, 2026',
    description:
      'Marmots + pikas reliable on Cascade Pass + Maple Pass meadows mid-day. Mountain goats sometimes visible on Cascade Pass ridge across the valley (binoculars help). Black bears occasional on Cascade River Rd at dawn. Mule deer common in Methow Valley at dusk.',
    category: 'wildlife',
    sourceUrl: 'https://www.nps.gov/noca/learn/nature/animals.htm',
    sourceLabel: 'NPS · Wildlife',
    photos: [
      {
        src: wm('Hoary_Marmot_in_Glacier_National_Park.jpg'),
        alt: 'Hoary marmot on a summer meadow — same species seen at Cascade Pass.',
        credit: 'Photo: Wikimedia · CC',
        creditUrl: wmCredit('Hoary_Marmot_in_Glacier_National_Park.jpg'),
        width: 1280,
        height: 853,
      },
    ],
  },
  {
    id: 'leavenworth',
    needsWa20Through: false,
    name: 'Leavenworth side stop (Bavarian-themed town)',
    where: 'US-2 east of Stevens Pass · on the scenic Day-5 return',
    cost: 'Free to walk; food costs vary',
    costTier: 'free',
    time: '1-2 hrs lunch + walk',
    pathFit: 'Path B Day 5 only',
    side: 'either',
    driveFromBase: 'Detour on US-2 return',
    equipment: 'Walking shoes',
    kidFriendly: true,
    rentalsOnSite: false,
    verifiedAsOf: 'May 17, 2026',
    description:
      'Bavarian alpine-village theme — touristy in a knowing way. Worth a stop for a stretch + walk if returning via US-2 / Stevens Pass. No kosher restaurants here — pack snacks or pick up at the bakery (note: packaged hechsher only).',
    category: 'town',
    sourceUrl: 'https://leavenworth.org/',
    sourceLabel: 'Leavenworth.org',
    photos: [
      {
        src: wm('Main_street_in_Leavenworth,_Washington_(2023-06-18).jpg'),
        alt: 'Main street in Leavenworth WA in June 2023 — Bavarian-style facades in summer light.',
        credit: 'Photo: Wikimedia · CC',
        creditUrl: wmCredit('Main_street_in_Leavenworth,_Washington_(2023-06-18).jpg'),
        width: 1280,
        height: 853,
      },
    ],
  },
  {
    id: 'twisp',
    needsWa20Through: false,
    name: 'Twisp side stop (art galleries)',
    where: '~12 min south of Winthrop on WA-20',
    cost: 'Free',
    costTier: 'free',
    time: '1-2 hrs',
    pathFit: 'Path B — east-side rest-day option',
    side: 'east',
    driveFromBase: '~12 min from Winthrop',
    equipment: 'Walking shoes',
    kidFriendly: true,
    rentalsOnSite: false,
    verifiedAsOf: 'May 17, 2026',
    description:
      'Quieter, more local feel than Winthrop. Confluence Gallery + Twisp River Pub area + Methow Valley Riverbank trail. Worth it if Winthrop feels too tourist-cute.',
    category: 'town',
    sourceUrl: 'https://twispwa.com/',
    sourceLabel: 'Twisp town site',
    photos: [
      {
        src: wm('Twisp_River_Valley_in_Twisp,_Washington.jpg'),
        alt: 'Twisp River valley in summer — quiet alternative to Winthrop.',
        credit: 'Photo: Wikimedia · CC',
        creditUrl: wmCredit('Twisp_River_Valley_in_Twisp,_Washington.jpg'),
        width: 1280,
        height: 720,
      },
    ],
  },
];

export interface RuledOut {
  what: string;
  why: string;
}

export const RULED_OUT: RuledOut[] = [
  {
    what: 'Hot springs (Goldmyer, Baker, Sol Duc, etc.)',
    why:
      'Goldmyer is permit-only + 6 mi hike-in (overkill). Baker Hot Springs is closed/unmaintained. Sol Duc is 4+ hr drive from the corridor. No reasonable hot springs from this trip — not worth the detour. (Confirmed May 16, 2026.)',
  },
  {
    what: 'Sahale Arm + Cutthroat Pass extensions',
    why:
      'Ruled out by the brief — too hard. Listed in Hikes under "Ambitious add-ons" if energy + early start coincide, but not in any path itinerary.',
  },
  {
    what: 'Museums',
    why: 'Ruled out by the brief. Shafer exterior is the closest the trip gets to one.',
  },
];
