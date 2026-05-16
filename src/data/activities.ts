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
}

export const ACTIVITIES: Activity[] = [
  {
    id: 'patterson-kayak',
    name: 'Kayak / paddleboard Patterson Lake',
    where: 'Sun Mountain Lodge Marina · 15 min south of Winthrop',
    cost: '~$30-50 / hr for kayaks · ~$40-60 for SUP',
    time: '60-90 min',
    pathFit: 'Path B + Path C (east side)',
    description:
      'Calm alpine lake, mountain backdrop, easy beginner paddling. Already on Path C Day 4 as an option — bumping it up here in case it gets overlooked.',
  },
  {
    id: 'diablo-kayak',
    name: 'Kayak Diablo Lake',
    where: 'Ross Lake Resort (water-taxi access) OR self-launch at Colonial Creek',
    cost: '~$60-80 / day rentals · self-launch free',
    time: 'Half-day',
    pathFit: 'All paths (west side · WA-20 corridor)',
    description:
      'Turquoise glacier-flour water. Self-launch at Colonial Creek South Campground is the cheap way; Ross Lake Resort rents pre-positioned kayaks but the logistics are involved (water taxi from Diablo Dam). Worth it if Diablo Lake is high on the want-list.',
  },
  {
    id: 'pearrygin-swim',
    name: 'Swim at Pearrygin Lake State Park',
    where: '~5 min northeast of Winthrop',
    cost: 'Discover Pass $10/day or $30/year',
    time: '1-2 hrs',
    pathFit: 'Path B + Path C (east side)',
    description:
      'Warm-water swimming lake (unusual in the PNW). Sandy beach, swimming raft, picnic tables. Easy after-hike cool-off in the 85°F afternoons.',
  },
  {
    id: 'methow-trail',
    name: 'Methow Valley Trail bike rental',
    where: 'Winthrop town (multiple shops)',
    cost: '~$45-65 / day cruiser; e-bikes more',
    time: '1-3 hrs',
    pathFit: 'Path B + Path C (east side)',
    description:
      'Paved + gravel community trail along the river. Easy ride for a relaxed afternoon. Methow Cycle & Sport rents on Riverside Ave.',
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
