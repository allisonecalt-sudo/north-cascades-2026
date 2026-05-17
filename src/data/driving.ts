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
    tldr: 'As of May 15, 2026, WA-20 closed MP 130-156 through the park. WSDOT target reopen Jul 4 — "a goal, not a promise."',
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
