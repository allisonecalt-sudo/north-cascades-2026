/**
 * Activity add-ons — non-hike worth-considering items.
 *
 * Surfaces things the corridor offers besides hikes + viewpoints:
 *   - Kayak / paddle (Patterson Lake, Diablo Lake, Ross Lake)
 *   - Swimming (Pearrygin Lake, Patterson Lake, Skagit dipping spots)
 *   - Wildlife viewing windows
 *   - Stargazing — see Sky section
 *   - Hot springs — checked, none reasonable from this corridor
 *
 * Not "must-do." Just menu items to choose from on a rest day or evening.
 */

export interface Activity {
  id: string;
  name: string;
  where: string;
  cost: string;
  time: string;
  /** Which path(s) this fits naturally. */
  pathFit: string;
  description: string;
  /** Source link — operator site, NPS, etc. */
  sourceUrl?: string;
  sourceLabel?: string;
  /** Grouping bucket. Defaults to 'general' if omitted. */
  category?: 'water' | 'town' | 'wildlife' | 'general';
}

export const ACTIVITIES: Activity[] = [
  // ---------- Water + lakes ----------
  {
    id: 'patterson-kayak',
    name: 'Kayak / SUP / rowboat Patterson Lake',
    where: 'Sun Mountain Lodge Marina · 604 Patterson Lake Rd · 15 min south of Winthrop',
    cost: '~$30-50 / hr kayak · SUP, rowboat, pedalboat also available',
    time: '60-90 min',
    pathFit: 'Path B + Path C (east side)',
    description:
      'Calm sub-alpine lake, mountain backdrop, easy beginner paddling. Walk-up rentals at the lodge marina — call ahead in peak August (509-996-2211). Already on Path C Day 4 as an option.',
    sourceUrl: 'https://sunmountainlodge.com/adventure/water-activities/',
    sourceLabel: 'Sun Mountain Lodge',
    category: 'water',
  },
  {
    id: 'diablo-kayak',
    name: 'Kayak Diablo Lake (self-launch)',
    where: 'Pick up rental at North Cascade Kayaks (Rockport, ~30 min west of Diablo) · launch at Colonial Creek South Campground · MP 130',
    cost: '~$100/day single · ~$150/day double (North Cascade Kayaks) · launch is free',
    time: 'Half to full day',
    pathFit: 'All paths (west side · WA-20 corridor)',
    description:
      "No rentals on Diablo Lake itself — pre-2026 there was a Ross Lake Resort tie-in, but the on-lake rental option is North Cascade Kayaks in Rockport (self-haul) plus a Colonial Creek launch. Turquoise glacier-flour water, ringed by 7,000-ft walls. The launch lot fills by 9-10 am in August — start early.",
    sourceUrl: 'https://northcascadekayaks.com/',
    sourceLabel: 'North Cascade Kayaks',
    category: 'water',
  },
  {
    id: 'ross-lake-watertaxi',
    name: 'Ross Lake water taxi + kayak day',
    where: 'Ross Lake Resort · access via Diablo Dam trail or NPS shuttle',
    cost: 'Water-taxi shuttle $4 / person each way · Eddyline Nighthawk kayak $60/day · drop-off camping $30 RT',
    time: 'Half to full day',
    pathFit: 'Path A + Path B (west side · need full day, not a viewpoint detour)',
    description:
      'The only outfit with on-water rentals in the corridor. Reach the resort by hiking the 1-mile trail down from Diablo Dam (or NPS shuttle when running), then water-taxi 8 am-7 pm on demand. Worth the choreography if you want to be ON Ross Lake, not just look at it. Portage service June 11 - Oct 31 in 2026.',
    sourceUrl: 'https://www.rosslakeresort.com/equipment-rentals',
    sourceLabel: 'Ross Lake Resort',
    category: 'water',
  },
  {
    id: 'pearrygin-swim',
    name: 'Swim at Pearrygin Lake State Park',
    where: '~5 min northeast of Winthrop · 561 Bear Creek Rd',
    cost: 'Discover Pass $10/day or $30/year',
    time: '1-2 hrs',
    pathFit: 'Path B + Path C (east side)',
    description:
      'Warm-water swimming lake (unusual in the PNW). Sandy beach, swimming raft, picnic tables, 11,000 ft of waterfront. Easy after-hike cool-off in the 85 F Methow afternoons. 1,186-acre state park — also has a 5.3-mi Rex Derr loop trail if you want a walk first.',
    sourceUrl: 'https://parks.wa.gov/find-parks/state-parks/pearrygin-lake-state-park',
    sourceLabel: 'WA State Parks',
    category: 'water',
  },
  {
    id: 'baker-lake-swim',
    name: 'Baker Lake — swim + free launch',
    where: 'Horseshoe Cove Campground day-use · 27 mi south of Mt. Baker on Baker Lake Rd · ~1 hr from Marblemount',
    cost: '$5 day-use boat ramp · swim free',
    time: '1-3 hrs',
    pathFit: 'Path A (west-side rest-day option) · Path B Day 1 detour',
    description:
      "Large reservoir under Mt. Baker with a real sandy swim beach at Horseshoe Cove. Cold but not glacial like Diablo — actually swimmable. Bring-your-own kayak crowd; rentals are scarce locally. Day-use season mid-May through September. Good Path-A backup if Cascade Pass weather turns.",
    sourceUrl: 'https://www.fs.usda.gov/recarea/mbs/recarea/?recid=17856',
    sourceLabel: 'Mt. Baker-Snoqualmie NF',
    category: 'water',
  },
  {
    id: 'lake-chelan-stehekin',
    name: 'Lake Chelan ferry to Stehekin (long detour)',
    where: 'Lady of the Lake terminal · Chelan, WA · ~3 hr drive from Winthrop',
    cost: 'Lady Liberty same-day RT ~$60-70/adult (verify on site) · Frequent-Traveler $351/10-rides',
    time: 'Full day — 8 am depart, ~5 pm return (~6 hr layover in Stehekin)',
    pathFit: 'Path C only — and only if you commit a full day away from Winthrop',
    description:
      'Boat-only village at the head of 50-mile-long Lake Chelan, inside North Cascades NRA. Stehekin is famous (the bakery, the red school bus, the Stehekin valley). But: this is a 3-hr drive south to Chelan, then a 4-hr boat each way. Worth flagging — almost certainly cut from this 5-day trip, but if Day-4 turns into "we want a real boat day" this is it.',
    sourceUrl: 'https://ladyofthelake.com/boat-schedules/',
    sourceLabel: 'Lady of the Lake',
    category: 'water',
  },
  {
    id: 'skagit-riverside',
    name: 'Skagit River — riverside picnic + careful dip',
    where: 'Marblemount Boat Launch · MP 105 (west)',
    cost: 'Free',
    time: '30-60 min',
    pathFit: 'All paths (Marblemount stop)',
    description:
      "Not a swim destination — the Skagit runs hard and glacially cold. But it's a beautiful river-walk + lunch spot a few minutes from the Marblemount lodging cluster. Wading at the gravel-bar edges is fine on a warm day. Don't swim out into the current.",
    sourceUrl: 'https://www.nps.gov/noca/planyourvisit/boating-and-fishing.htm',
    sourceLabel: 'NPS · Skagit paddling',
    category: 'water',
  },

  // ---------- Land + town ----------
  {
    id: 'methow-trail',
    name: 'Methow Valley Trail bike rental',
    where: 'Winthrop town (multiple shops)',
    cost: '~$45-65 / day cruiser; e-bikes more',
    time: '1-3 hrs',
    pathFit: 'Path B + Path C (east side)',
    description:
      'Paved + gravel community trail along the river. Easy ride for a relaxed afternoon. Methow Cycle & Sport rents on Riverside Ave.',
    category: 'town',
  },
  {
    id: 'wildlife',
    name: 'Wildlife viewing windows',
    where: 'Cascade Pass corridor + Washington Pass + Methow Valley',
    cost: 'Free',
    time: 'Dawn / dusk',
    pathFit: 'All paths',
    description:
      'Marmots + pikas reliable on Cascade Pass + Maple Pass meadows mid-day. Mountain goats sometimes visible on Cascade Pass ridge across the valley (binoculars help). Black bears occasional on Cascade River Rd at dawn. Mule deer common in Methow Valley at dusk.',
    category: 'wildlife',
  },
  {
    id: 'leavenworth',
    name: 'Leavenworth side stop (Bavarian-themed town)',
    where: 'US-2 east of Stevens Pass · on the scenic Day-5 return',
    cost: 'Free to walk; food costs vary',
    time: '1-2 hrs lunch + walk',
    pathFit: 'Path B + Path C Day 5 only',
    description:
      'Bavarian alpine-village theme — touristy in a knowing way. Worth a stop for a stretch + walk if returning via US-2 / Stevens Pass. No kosher restaurants here — pack snacks or pick up at the bakery (note: packaged hechsher only).',
    category: 'town',
  },
  {
    id: 'twisp',
    name: 'Twisp side stop (art galleries)',
    where: '~12 min south of Winthrop on WA-20',
    cost: 'Free',
    time: '1-2 hrs',
    pathFit: 'Path B + Path C — east-side rest-day option',
    description:
      'Quieter, more local feel than Winthrop. Confluence Gallery + Twisp River Pub area + Methow Valley Riverbank trail. Worth it if Winthrop feels too tourist-cute.',
    category: 'town',
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
