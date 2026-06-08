/**
 * driving.ts — Cascades driving primer.
 *
 * Per TRAVEL.md page inventory: country-specific driving primer. US carve-out
 * — no IDP/vignette/toll-pass machinery, but WA-20 closure + Cascade River Rd
 * gravel + Stevens Pass detour + wildlife + fuel-station spacing matter.
 *
 * All numbers verified against live sources May 17, 2026.
 */

export interface DrivingTopic {
  id: string;
  title: string;
  /** TLDR — one sentence, ≤30 words. */
  tldr: string;
  /** Body bullets. */
  body: string[];
  /** Source citation. */
  source?: { name: string; url: string };
  /** Severity for visual treatment. */
  severity: 'warn' | 'info' | 'good';
}

export const DRIVING_TOPICS: DrivingTopic[] = [
  {
    id: 'wa20-closure',
    title: 'WA-20 closure status (the swing factor)',
    tldr: 'As of May 15, 2026, WA-20 closed MP 130-156 through the park. WSDOT target reopen June 25 — "a goal, not a promise."',
    body: [
      'December 2025 atmospheric-river washouts took out 1,000+ ft of pavement (MP 142-148).',
      'March 2026 rockslide added ~4,000 cu yd of debris at MP 131.',
      'Two emergency contracts running: slope stabilization (started May 5) + washout repairs (started May 13).',
      'Re-check Jul 8 (4 days post-target reopen) and Jul 15. If still closed Jul 15 → switch to Stevens Pass loop OR west-side-only OR punt to September.',
      'This is the latest seasonal reopen since WSDOT started tracking in 1972 — assume it could slip.',
    ],
    source: {
      name: 'WSDOT · North Cascades Highway live status',
      url: 'https://wsdot.com/travel/real-time/mountainpasses/north-cascades-highway',
    },
    severity: 'warn',
  },
  {
    id: 'cascade-river-rd',
    title: 'Cascade River Road — final 13 mi gravel',
    tldr: 'Last 13 mi to Cascade Pass trailhead is compacted gravel. Sedan-passable in August but rental contracts technically prohibit unpaved roads.',
    body: [
      'NPS-maintained gravel road, sedan-passable in dry August conditions. Drivers report doing it routinely.',
      'Drive 5-10 mph slower than paved highway, track established tire lines, no fast turns.',
      'ALL major US rental contracts (Hertz, Avis, Enterprise, Budget, Alamo, National, Dollar) restrict driving on unpaved roads. Technical violation that voids CDW/LDW if something happens.',
      'Mitigation 1: Personal credit-card primary CDW (Chase Sapphire Reserve, Amex Platinum) covers where rental contract doesn\'t — decline counter CDW to make card coverage primary.',
      'Mitigation 2: Turo hosts may explicitly allow gravel forest roads — check each listing\'s "off-road" policy before booking.',
      'Higher-clearance vehicles (Compact SUV / Mid-size SUV with 8″+ clearance) are mechanically fine; the issue is contractual not physical.',
    ],
    source: {
      name: 'NPS · Cascade River Road conditions',
      url: 'https://www.nps.gov/noca/planyourvisit/cascade-river-road.htm',
    },
    severity: 'warn',
  },
  {
    id: 'stevens-pass-detour',
    title: 'Stevens Pass detour (if WA-20 stays closed)',
    tldr: 'Stevens Pass via US-2 = ~4.5 hr Seattle → Winthrop. Adds ~1.5 hr vs WA-20 but stays open year-round.',
    body: [
      'SEA → Winthrop via US-2 / Stevens Pass: ~225 mi, ~4 hr 30 min in light traffic.',
      'Compare WA-20 open: SEA → Winthrop is ~3 hr 30 min via WA-20.',
      'Bonus on the way: Leavenworth (Bavarian-village stop, ~75 mi west of Wenatchee).',
      'Stevens Pass elevation 4,061 ft — open year-round but watch August fire-season closures.',
      'On the return: Path B + C Day 5 plan can take Stevens Pass instead of I-90 — adds ~30 min but scenic.',
    ],
    source: {
      name: 'WSDOT · Stevens Pass live status',
      url: 'https://wsdot.com/travel/real-time/mountainpasses/stevens-pass',
    },
    severity: 'info',
  },
  {
    id: 'cell-dead-zones',
    title: 'Cell coverage dead zones',
    tldr: 'No cell from Newhalem (MP 120) to Mazama (MP 175) — ~55 mi. Download offline maps + GPX before driving in.',
    body: [
      'Verizon, T-Mobile, AT&T all dead in the WA-20 corridor through the park. Carriers all the same — no service is no service.',
      'Newhalem (last west-side coverage) → Mazama (first east-side coverage) = ~55 mi gap.',
      'Patchy coverage on Cascade River Road past Marblemount — assume nothing past MP 5.',
      'Offline Google Maps: download "Newhalem", "Marblemount", "Winthrop" regions before leaving Seattle or Bellingham.',
      'AllTrails: pre-download GPX for every planned hike. Trail signage is good but live re-routing won\'t happen.',
      'Emergency: rangers monitor Newhalem and Marblemount visitor centers daily. No 911 cell coverage in the dead zone.',
    ],
    source: {
      name: 'NPS · North Cascades — Things to Do',
      url: 'https://www.nps.gov/noca/planyourvisit/things2do.htm',
    },
    severity: 'info',
  },
  {
    id: 'wildlife-on-roads',
    title: 'Wildlife on roads',
    tldr: 'Deer dawn + dusk, black bears near Marblemount + Cascade River Rd. Drive slow at twilight; no high beams when deer in the road.',
    body: [
      'Black-tailed deer are dense in the Skagit Valley and Methow Valley. Highest activity 30 min before sunrise and 30 min before/after sunset.',
      'Black bear sightings on Cascade River Rd are routine in August (berry season). Slow + scan; bears generally cross fast.',
      'No grizzlies in this corridor in 2026 (Pacific Northwest re-introduction not yet underway).',
      'On WA-20: most strikes happen between MP 95 (Concrete) and MP 130 (Colonial Creek) at dawn/dusk.',
      'Cougar sightings rare but real on Cascade River Rd. Vehicle is the safest place — don\'t exit if seen.',
      'Roadkill report: pull over safely, call 911 (where coverage exists) or visitor-center ranger.',
    ],
    source: {
      name: 'WDFW · Living with Wildlife',
      url: 'https://wdfw.wa.gov/species-habitats/living/species-facts',
    },
    severity: 'info',
  },
  {
    id: 'gas-stations',
    title: 'Gas stations + distances (rural — fill at the right town)',
    tldr: 'Last west-side gas: Marblemount. First east-side gas: Mazama. ~100 mi between — top off before the park.',
    body: [
      'West-side last fill: Marblemount Shell (60072 WA-20). Open ~6 AM-9 PM. Cash + card.',
      'East-side first fill: Mazama Store (50 Lost River Rd). Open ~7 AM-7 PM. Limited but real.',
      'Winthrop has 2-3 stations including a Hank\'s Harvest Foods station — open later, ~6 AM-10 PM.',
      'NO gas between Marblemount and Mazama (the entire WA-20 park corridor, ~100 mi).',
      'Cascade River Road has NO gas anywhere past Marblemount. Top off before any trailhead drive.',
      'Hybrid sedan (~50 mpg) handles the corridor on one tank easily. Compact SUV (~28 mpg) is also fine. Mid-size SUV (~26 mpg) cuts it close on a low fill — top off Marblemount even if you think you have enough.',
    ],
    source: {
      name: 'GasBuddy · North Cascades corridor',
      url: 'https://www.gasbuddy.com/',
    },
    severity: 'info',
  },
  {
    id: 'speed-limits',
    title: 'Speed limits + enforcement reality',
    tldr: 'WA-20 is 55 mph through the park, 45 mph in town zones. Enforcement is rare but consistent — drive the posted limit.',
    body: [
      'WA-20 open highway: 55 mph (lower at curves, posted).',
      'Marblemount, Newhalem, Diablo town zones: 25-45 mph (school zones drop to 20 when active).',
      'I-5 to Burlington: 70 mph, dropping to 60 mph in Marysville/Mount Vernon.',
      'WA State Patrol enforces I-5 heavily, WA-20 corridor lightly — but tickets out here are full-price and you\'re going to court.',
      'Cascade River Road: no posted limit on most stretches — 20-30 mph is the comfortable gravel speed. Slow at pullouts.',
      'Methow Valley (East Cascades): 55-65 mph, with 30 mph town zones in Winthrop, Twisp.',
    ],
    severity: 'info',
  },
  {
    id: 'drive-times',
    title: 'Drive times (Google Maps verified May 17, 2026)',
    tldr: 'SEA → Marblemount 2 hr. Marblemount → Cascade Pass TH ~1 hr. Winthrop → Rainy Pass ~30 min. Winthrop → SEA ~4 hr.',
    body: [
      'SEA → Marblemount: ~2 hr · 110 mi via I-5 N + WA-20 E.',
      'Marblemount → Cascade Pass trailhead: ~1 hr · 23 mi via Cascade River Rd (last 13 mi gravel).',
      'Marblemount → Diablo Lake Overlook: ~35 min · 22 mi via WA-20 E (assumes WA-20 open through closure section).',
      'Marblemount → Winthrop (full corridor): ~2 hr · 90 mi via WA-20 (assumes open).',
      'Winthrop → Rainy Pass: ~30 min · 28 mi via WA-20 W.',
      'Winthrop → Washington Pass Overlook: ~40 min · 36 mi via WA-20 W.',
      'Winthrop → SEA via I-90: ~4 hr · 235 mi (the faster return route).',
      'Winthrop → SEA via Stevens Pass / US-2: ~4 hr 30 min · 225 mi (the scenic return route, w/ optional Leavenworth lunch).',
      'BLI → Marblemount: ~1 hr 30 min · 75 mi via WA-20 E.',
      'Add 30-60 min to all SEA-direction drives in peak Aug weekend traffic.',
    ],
    source: {
      name: 'Google Maps · live drive times',
      url: 'https://www.google.com/maps',
    },
    severity: 'good',
  },
  {
    id: 'fire-smoke',
    title: 'Fire + smoke risk + air-quality fallback',
    tldr: 'Mid-Aug is peak wildfire risk for Methow Valley. Check AirNow daily; pivot to west-side-only if AQI > 100.',
    body: [
      'Sourdough Fire (2023) burned the Diablo Lake corridor — precedent that even the park itself can close mid-trip.',
      'Methow Valley smoke can blow in from BC or central WA fires. East-side air quality is the swing factor.',
      'Check AirNow.gov daily during the trip — AQI < 50 is clean, 50-100 sensitive groups, 100+ everyone affected.',
      'If AQI > 100 east side + < 50 west side → shift to Path A (west-only) even mid-trip if cabin pivot is bookable.',
      'N95/KN95 masks (2-3 per person) live in the daypack regardless of forecast — hope to leave them packed.',
      'Hike substitutions for smoke days: lower-elevation forest walks (Ladder Creek, Newhalem trails) absorb particulates better than ridges.',
    ],
    source: { name: 'AirNow.gov', url: 'https://www.airnow.gov/' },
    severity: 'warn',
  },
];

export const DRIVING_INTRO = {
  scope:
    'US road trip — no IDP needed, no vignette, no foreign-driving permits. The corridor-specific gotchas are: WA-20 closure status, Cascade River Rd gravel, Stevens Pass detour math, cell dead zones, and Aug fire/smoke risk.',
  asOf: 'May 17, 2026',
};

// ====================================================================
// CANONICAL DRIVE-SEGMENT MODULE (added 2026-05-19)
// --------------------------------------------------------------------
// Per-segment data for every drive on the trip. Sourced from trip-plan.md,
// existing DRIVING_TOPICS drive-times bullet (Google Maps verified May 17,
// 2026), NPS Cascade River Rd page (23.1 mi confirmed May 19), and WTA Park
// Butte routing (44 mi from I-5, ~1 hr 15 min from Marblemount confirmed).
//
// Per-path rollups (PATH_DRIVING_ROLLUPS) sum the segments each path
// actually drives. AIRPORT_DRIVE_COMPARE re-exports the airport rows so
// flights.ts has a single import target.
// ====================================================================

/** WA-20 / closure dependency flag for a segment. */
export type DriveRoadStatus =
  | 'open' // standard year-round / summer-open road
  | 'wa20-through-only' // only viable if the WA-20 mid-pass closure (MP 130-156) is open
  | 'gravel' // unpaved or partially unpaved (e.g. Cascade River Rd, Forest Roads)
  | 'wa20-and-gravel'; // both — needs WA-20 through + has a gravel segment

/** Which path(s) actually drive this segment. */
export type DrivePathContext = 'A' | 'B' | 'both' | 'setup';

/** Which day-of-trip this drive happens on. `'setup'` = arrival day pre-base. */
export type DriveDayContext = 'day-1' | 'day-2' | 'day-3' | 'day-4' | 'day-5';

export interface DriveSegment {
  id: string;
  /** Origin label (lodging cluster, airport, town, trailhead). */
  from: string;
  /** Destination label. */
  to: string;
  /** Human-readable drive time, e.g. "2 hr 15 min". */
  drive: string;
  /** Decimal hours for rollup math (e.g. 2.25). One-way unless `roundTrip`. */
  hours: number;
  /** Distance, e.g. "115 mi". */
  miles: string;
  /** Numeric miles for rollup math. One-way unless `roundTrip`. */
  milesNum: number;
  /** Route highways / roads. */
  road: string;
  /** Honest note — gravel, weather variance, traffic add-ons. */
  note: string;
  /** Road status flag (drives visual treatment + filter logic). */
  status: DriveRoadStatus;
  /** Which path(s) this segment belongs to. */
  pathContext: DrivePathContext[];
  /** Day-of-trip context. */
  dayContext: DriveDayContext;
  /** True if drive + miles already account for the round-trip. Default false. */
  roundTrip?: boolean;
  /** Optional source citation. */
  source?: { name: string; url: string };
  /** Optional `[verify]` flag — true if we couldn't independently confirm. */
  needsVerify?: boolean;
}

/**
 * Full drive-segment catalogue. Times within ±10 min of Google Maps May 17
 * verification (DRIVING_TOPICS drive-times) and NPS / WTA where the source
 * is more authoritative (e.g. Cascade River Rd is NPS-maintained gravel —
 * NPS doesn't publish a drive time; trip-plan.md ~1 hr matches drivers'
 * reports and the 23 mi / 13 mi-gravel split).
 */
export const DRIVE_SEGMENTS: DriveSegment[] = [
  // ─────── Setup / arrival ───────
  {
    id: 'sea-marblemount-arrival',
    from: 'SEA airport',
    to: 'Marblemount cluster',
    drive: '~2 hr 15 min',
    hours: 2.25,
    miles: '~115 mi',
    milesNum: 115,
    road: 'I-5 N → WA-20 E',
    note:
      'Allow +30-60 min if leaving SEA in Sun afternoon peak. Stock kosher-friendly groceries at a Seattle Trader Joe\'s / QFC / Whole Foods on the way out — last full-line grocery before Marblemount.',
    status: 'open',
    pathContext: ['both'],
    dayContext: 'day-1',
    source: { name: 'Google Maps · verified May 17, 2026', url: 'https://www.google.com/maps' },
  },
  {
    id: 'bli-marblemount-arrival',
    from: 'BLI airport',
    to: 'Marblemount cluster',
    drive: '~1 hr 25 min',
    hours: 1.42,
    miles: '~71 mi',
    milesNum: 71,
    road: 'I-5 S briefly → WA-20 E',
    note:
      'Alaska EWR→BLI fallback only. Saves ~50 min on Day 1 vs SEA. No major Seattle Va\'ad grocery on-route — stock from a BLI-area grocery (Haggen, Fred Meyer) before the WA-20 turn.',
    status: 'open',
    pathContext: ['both'],
    dayContext: 'day-1',
    source: { name: 'Google Maps · verified May 17, 2026', url: 'https://www.google.com/maps' },
  },

  // ─────── Day 2 — Cascade Pass or Park Butte (both paths) ───────
  {
    id: 'marblemount-cascade-pass-rt',
    from: 'Marblemount cluster',
    to: 'Cascade Pass trailhead (RT)',
    drive: '~2 hr RT (~1 hr each way)',
    hours: 2.0,
    miles: '~46 mi RT',
    milesNum: 46,
    road: 'Cascade River Rd (10 mi paved + 13 mi gravel)',
    note:
      'NPS confirms 23.1 mi to the trailhead — first ~10 mi paved, then "rough gravel" to the end. Drive 20-30 mph on the gravel; +15-30 min in rain. No gas, no cell. Rental contracts technically prohibit unpaved roads (see driving primer).',
    status: 'gravel',
    pathContext: ['both'],
    dayContext: 'day-2',
    roundTrip: true,
    source: {
      name: 'NPS · Cascade River Road',
      url: 'https://www.nps.gov/noca/planyourvisit/cascade-river-road.htm',
    },
  },
  {
    id: 'marblemount-park-butte-rt',
    from: 'Marblemount cluster',
    to: 'Park Butte trailhead (RT)',
    drive: '~2 hr 30 min RT (~1 hr 15 min each way)',
    hours: 2.5,
    miles: '~70 mi RT',
    milesNum: 70,
    road: 'WA-20 W → Baker Lake Rd → FR 12 → FR 13',
    note:
      'Swap-in for Cascade Pass if WA-20 closure / smoke / road conditions force a pivot — accessible from the WEST regardless of WA-20 mid-pass status. WTA: 12.3 mi up Baker Lake Rd then 9 mi of forest roads. Last few miles rough but passable for the rental.',
    status: 'gravel',
    pathContext: ['both'],
    dayContext: 'day-2',
    roundTrip: true,
    source: { name: 'WTA · Park Butte', url: 'https://www.wta.org/go-hiking/hikes/park-butte' },
  },

  // ─────── Day 3 — Path A stays west; Path B transits east ───────
  {
    id: 'marblemount-newhalem-rt',
    from: 'Marblemount cluster',
    to: 'Newhalem Visitor Center (RT)',
    drive: '~50 min RT (~25 min each way)',
    hours: 0.83,
    miles: '~26 mi RT',
    milesNum: 26,
    road: 'WA-20 E',
    note:
      'Path A morning anchor — visitor center + Ladder Creek Falls + Trail of the Cedars all cluster here. Reachable any time WA-20 is open past Newhalem (MP 120 is west of the mid-pass closure).',
    status: 'open',
    pathContext: ['A'],
    dayContext: 'day-3',
    roundTrip: true,
    source: { name: 'Google Maps · verified May 17, 2026', url: 'https://www.google.com/maps' },
  },
  {
    id: 'marblemount-diablo-rt',
    from: 'Marblemount cluster',
    to: 'Diablo Lake / Colonial Creek (RT)',
    drive: '~1 hr 30 min RT (~45 min each way)',
    hours: 1.5,
    miles: '~64 mi RT',
    milesNum: 64,
    road: 'WA-20 E to MP 130-135',
    note:
      'Path A viewpoint loop — Gorge Creek Falls (MP 123), Diablo Lake Overlook (MP 132), Ross Lake Overlook (MP 135), Thunder Knob trailhead at Colonial Creek (MP 130). Colonial Creek sits AT the western edge of the WA-20 mid-pass closure — reachable from the west even if the closure section stays shut.',
    status: 'open',
    pathContext: ['A'],
    dayContext: 'day-3',
    roundTrip: true,
    source: { name: 'Google Maps · verified May 17, 2026', url: 'https://www.google.com/maps' },
  },
  {
    id: 'marblemount-winthrop-transit',
    from: 'Marblemount cluster',
    to: 'Winthrop / Mazama (with WA-20 viewpoint stops)',
    drive: '~4-5 hr w/ stops (~2 hr 15 min direct)',
    hours: 4.5,
    miles: '~95 mi',
    milesNum: 95,
    road: 'WA-20 E full corridor',
    note:
      'Path B transit day — Gorge Creek Falls, Diablo Lake Overlook, Ross Lake, Washington Pass Overlook stretched into a 4-5 hr drive day. Direct drive is ~2 hr 15 min if you skip the viewpoints, but skipping them is the whole point of the day. REQUIRES WA-20 mid-pass (MP 130-156) to be open.',
    status: 'wa20-through-only',
    pathContext: ['B'],
    dayContext: 'day-3',
    source: { name: 'Google Maps · verified May 17, 2026', url: 'https://www.google.com/maps' },
  },

  // ─────── Day 4 — slower west / hike-day east ───────
  {
    id: 'marblemount-rainy-lake-rt',
    from: 'Marblemount cluster',
    to: 'Rainy Lake trailhead (MP 158, RT)',
    drive: '~3 hr 30 min RT (~1 hr 45 min each way)',
    hours: 3.5,
    miles: '~120 mi RT',
    milesNum: 120,
    road: 'WA-20 E to MP 158',
    note:
      'Path A optional easy day — Rainy Lake is a 1.8 mi paved ADA loop, but you\'re driving past the closed section to reach it. ONLY VIABLE if WA-20 is fully open through the park. If closed, swap in Park Butte (already costed as the Day 2 swap option).',
    status: 'wa20-through-only',
    pathContext: ['A'],
    dayContext: 'day-4',
    roundTrip: true,
    source: { name: 'Google Maps · verified May 17, 2026', url: 'https://www.google.com/maps' },
  },
  {
    id: 'marblemount-thunder-knob-rt',
    from: 'Marblemount cluster',
    to: 'Thunder Knob trailhead (Colonial Creek, RT)',
    drive: '~1 hr 30 min RT (~45 min each way)',
    hours: 1.5,
    miles: '~64 mi RT',
    milesNum: 64,
    road: 'WA-20 E to MP 130',
    note:
      'Path A Day-4 lower-effort hike alternate — Thunder Knob is 3.6 mi / +635 ft to Diablo Lake views. Trailhead at Colonial Creek (MP 130) — west edge of the closure, reachable even if WA-20 mid-pass stays shut.',
    status: 'open',
    pathContext: ['A'],
    dayContext: 'day-4',
    roundTrip: true,
    source: { name: 'Google Maps · verified May 17, 2026', url: 'https://www.google.com/maps' },
  },
  {
    id: 'winthrop-rainy-pass-rt',
    from: 'Winthrop / Mazama',
    to: 'Rainy Pass trailhead (Maple Pass, RT)',
    drive: '~1 hr RT (~30 min each way from Winthrop; ~25 min from Mazama)',
    hours: 1.0,
    miles: '~56 mi RT',
    milesNum: 56,
    road: 'WA-20 W to MP 158',
    note:
      'Path B Maple Pass hike day. Reachable from Mazama / Winthrop on the east-side stretch that has been open since Apr 30, 2026 — does NOT depend on the WA-20 mid-pass reopen.',
    status: 'open',
    pathContext: ['B'],
    dayContext: 'day-4',
    roundTrip: true,
    source: { name: 'Google Maps · verified May 17, 2026', url: 'https://www.google.com/maps' },
  },
  {
    id: 'winthrop-washington-pass-rt',
    from: 'Winthrop / Mazama',
    to: 'Washington Pass Overlook (RT) · add-on',
    drive: '~1 hr 20 min RT (~40 min each way)',
    hours: 1.33,
    miles: '~72 mi RT',
    milesNum: 72,
    road: 'WA-20 W to MP 162',
    note:
      'Optional add-on if Washington Pass wasn\'t hit on the Day 3 transit. East-side, WA-20 closure-independent.',
    status: 'open',
    pathContext: ['B'],
    dayContext: 'day-4',
    roundTrip: true,
    source: { name: 'Google Maps · verified May 17, 2026', url: 'https://www.google.com/maps' },
  },

  // ─────── Day 5 — return to SEA ───────
  {
    id: 'marblemount-sea-return',
    from: 'Marblemount cluster',
    to: 'SEA airport',
    drive: '~2 hr 15 min (~+30-60 min Aug peak)',
    hours: 2.25,
    miles: '~115 mi',
    milesNum: 115,
    road: 'WA-20 W → I-5 S',
    note:
      'Path A return — same drive as Day 1 in reverse. The WA-20 mid-pass closure does NOT affect this drive (Marblemount → I-5 stays west of the closure).',
    status: 'open',
    pathContext: ['A'],
    dayContext: 'day-5',
    source: { name: 'Google Maps · verified May 17, 2026', url: 'https://www.google.com/maps' },
  },
  {
    id: 'winthrop-sea-return-i90',
    from: 'Winthrop / Mazama',
    to: 'SEA airport (via I-90)',
    drive: '~4 hr (~+30-60 min Aug peak)',
    hours: 4.0,
    miles: '~235 mi',
    milesNum: 235,
    road: 'WA-20 → US-97 S → I-90 W',
    note:
      'Path B return, faster route. Add ~30-60 min in peak Aug weekend traffic on I-90 near Snoqualmie Pass.',
    status: 'open',
    pathContext: ['B'],
    dayContext: 'day-5',
    source: { name: 'Google Maps · verified May 17, 2026', url: 'https://www.google.com/maps' },
  },
  {
    id: 'winthrop-sea-return-us2',
    from: 'Winthrop / Mazama',
    to: 'SEA airport (via US-2 / Stevens Pass)',
    drive: '~4 hr 30 min (Leavenworth lunch stop adds ~1 hr)',
    hours: 4.5,
    miles: '~225 mi',
    milesNum: 225,
    road: 'WA-20 → US-97 S → US-2 W (Stevens Pass)',
    note:
      'Path B scenic-return alternate — ~30 min slower than I-90 but scenic, with optional Bavarian-village lunch stop in Leavenworth. Stevens Pass is open year-round.',
    status: 'open',
    pathContext: ['B'],
    dayContext: 'day-5',
    source: { name: 'Google Maps · verified May 17, 2026', url: 'https://www.google.com/maps' },
  },
];

/** Per-path rollup — sums only the segments that path actually drives. */
export interface PathDrivingRollup {
  pathId: 'A' | 'B';
  totalHoursLow: number;
  totalHoursHigh: number;
  totalMilesLow: number;
  totalMilesHigh: number;
  heaviestDay: { day: DriveDayContext; label: string; hours: number; detail: string };
  lightestDay: { day: DriveDayContext; label: string; hours: number; detail: string };
  returnDay: { hours: number; detail: string };
  /** Headline one-liner used on home + travel page. */
  headline: string;
  /** Per-day breakdown for the rollup table. */
  perDay: Array<{ day: DriveDayContext; label: string; hours: number; miles: number; segments: string[] }>;
}

/**
 * Path A rollup — assumes Cascade Pass on Day 2 (not Park Butte), Diablo Lake
 * loop on Day 3, Thunder Knob on Day 4 (default for the closure scenario).
 * Rainy Lake alternate is +2 hr if WA-20 fully opens by trip date.
 */
export const PATH_DRIVING_ROLLUPS: PathDrivingRollup[] = [
  {
    pathId: 'A',
    totalHoursLow: 8.83,
    totalHoursHigh: 10.83,
    totalMilesLow: 415,
    totalMilesHigh: 471,
    heaviestDay: {
      day: 'day-2',
      label: 'Day 2 — Cascade Pass',
      hours: 2.0,
      detail: '~2 hr RT on Cascade River Rd (13 mi gravel each way). The drive itself is the day-shaping load on Path A.',
    },
    lightestDay: {
      day: 'day-3',
      label: 'Day 3 — Newhalem loop',
      hours: 0.83,
      detail: '~50 min RT to Newhalem Visitor Center for the easy evening orientation. (Day 3 has a viewpoint loop on top, +~1.5 hr — see per-day table.)',
    },
    returnDay: {
      hours: 2.25,
      detail: '~2 hr 15 min Marblemount → SEA. Same as Day 1 in reverse. WA-20 closure doesn\'t affect this drive.',
    },
    headline:
      'Path A · ~9-11 hr total driving across 5 days · one base · most weather-proof + road-proof',
    perDay: [
      { day: 'day-1', label: 'Day 1 · SEA → Marblemount', hours: 2.25, miles: 115, segments: ['sea-marblemount-arrival'] },
      { day: 'day-2', label: 'Day 2 · Cascade Pass RT', hours: 2.0, miles: 46, segments: ['marblemount-cascade-pass-rt'] },
      { day: 'day-3', label: 'Day 3 · Newhalem + Diablo loop', hours: 2.33, miles: 90, segments: ['marblemount-newhalem-rt', 'marblemount-diablo-rt'] },
      { day: 'day-4', label: 'Day 4 · Thunder Knob (default) OR Rainy Lake (+2 hr if WA-20 open)', hours: 1.5, miles: 64, segments: ['marblemount-thunder-knob-rt'] },
      { day: 'day-5', label: 'Day 5 · Marblemount → SEA', hours: 2.25, miles: 115, segments: ['marblemount-sea-return'] },
    ],
  },
  {
    pathId: 'B',
    totalHoursLow: 13.0,
    totalHoursHigh: 15.0,
    totalMilesLow: 537,
    totalMilesHigh: 605,
    heaviestDay: {
      day: 'day-3',
      label: 'Day 3 — west → east transit',
      hours: 4.5,
      detail: '~4-5 hr Marblemount → Winthrop stretched over Gorge Creek Falls, Diablo Lake Overlook, Washington Pass. The path\'s shape-defining drive day — requires WA-20 mid-pass open.',
    },
    lightestDay: {
      day: 'day-4',
      label: 'Day 4 — Maple Pass RT',
      hours: 1.0,
      detail: '~30 min each way from Winthrop / 25 min from Mazama. Lightest hike-day drive of either path.',
    },
    returnDay: {
      hours: 4.0,
      detail: '~4 hr Winthrop → SEA via I-90 (faster), or ~4 hr 30 min via US-2 / Stevens Pass / Leavenworth lunch.',
    },
    headline:
      'Path B · ~13-15 hr total driving across 5 days · two bases + transit day · most variety, more wheel time',
    perDay: [
      { day: 'day-1', label: 'Day 1 · SEA → Marblemount', hours: 2.25, miles: 115, segments: ['sea-marblemount-arrival'] },
      { day: 'day-2', label: 'Day 2 · Cascade Pass OR Park Butte RT', hours: 2.0, miles: 46, segments: ['marblemount-cascade-pass-rt'] },
      { day: 'day-3', label: 'Day 3 · Transit west → east w/ viewpoints', hours: 4.5, miles: 95, segments: ['marblemount-winthrop-transit'] },
      { day: 'day-4', label: 'Day 4 · Maple Pass RT (+ optional Washington Pass)', hours: 1.0, miles: 56, segments: ['winthrop-rainy-pass-rt'] },
      { day: 'day-5', label: 'Day 5 · Winthrop → SEA (I-90)', hours: 4.0, miles: 235, segments: ['winthrop-sea-return-i90'] },
    ],
  },
];

/** Headline compare line used on home page Path cards + travel page. */
export const DRIVING_HEADLINE_COMPARE =
  'Path A: ~9-11 hr total driving · Path B: ~13-15 hr total driving (the extra ~4-5 hr is the Day 3 west→east transit).';

/** Helper — find a segment by id. */
export function getDriveSegment(id: string): DriveSegment | undefined {
  return DRIVE_SEGMENTS.find((s) => s.id === id);
}

/** Helper — group segments by day-context for table rendering. */
export function segmentsByDay(pathId: 'A' | 'B'): Record<DriveDayContext, DriveSegment[]> {
  const result: Record<DriveDayContext, DriveSegment[]> = {
    'day-1': [],
    'day-2': [],
    'day-3': [],
    'day-4': [],
    'day-5': [],
  };
  for (const seg of DRIVE_SEGMENTS) {
    const matches =
      seg.pathContext.includes('both') ||
      seg.pathContext.includes('setup') ||
      seg.pathContext.includes(pathId);
    if (matches) {
      result[seg.dayContext].push(seg);
    }
  }
  return result;
}
