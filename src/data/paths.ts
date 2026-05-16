/**
 * Trip paths — three materially different organizing structures.
 *
 * Per options.md (2026-05-16). Each path defines:
 *   - identity (id, name, tagline, snapshot bullets)
 *   - recommended lodging ids (filter view in Lodging section)
 *   - recommended hike ids (flag "in your path" in Hikes section)
 *   - itinerary day blueprint (each path has its own 5-day shape)
 *   - Seattle inclusion (Path A skips; Paths B+C: optional Leavenworth lunch on return)
 *   - flight default (all three share SEA RT — but path doc still binds it)
 *
 * "View all options" mode (selectedPath = null) shows everything ungated —
 * matches the prior site behavior so users can browse.
 */

import type { ItineraryDay } from './itinerary';

export type PathId = 'A' | 'B' | 'C';

export interface TripPath {
  id: PathId;
  name: string;
  tagline: string;
  /** "Best if" line — when this path wins. */
  bestIf: string;
  /** 3-4 snapshot bullets shown on the picker card. */
  snapshot: string[];
  /** Recommended lodging ids for this path (Terra Nova-tier + on-corridor). */
  lodgingIds: string[];
  /** Hike ids in this path's plan — flagged in the Hikes section. */
  hikeIds: string[];
  /** Per-path itinerary (5 days, path-specific). */
  itinerary: ItineraryDay[];
  /** True if path's Day-5 has a Leavenworth/Seattle stop worth surfacing. */
  includeSeattle: boolean;
  /** Single-line Seattle framing for this path. */
  seattleNote: string;
  /** Single-line lodging shape for the picker. */
  lodgingShape: string;
  /** Single-line flight framing. */
  flightNote: string;
  /** Honest tradeoff line — surfaces what you give up. */
  tradeoff: string;
}

// ============================================================
// Path A — West-Side Anchor (one base all 4 nights)
// ============================================================
const PATH_A_ITINERARY: ItineraryDay[] = [
  {
    day: 1,
    date: 'Sun Aug 16',
    title: 'SEA arrival, drive in, easy evening',
    shape: 'Morning SEA landing, drive to Marblemount, settle in, Ladder Creek Falls at dusk.',
    stops: [
      { step: 'Land SEA AM', detail: 'Nonstop on Alaska from NYC. Morning arrival.' },
      { step: 'Rental pickup', detail: 'SEA has every major rental on-site.' },
      {
        step: 'Drive SEA → Marblemount',
        detail: '~2 hrs via I-5 north → WA-20 east. Stock packaged kosher goods at a Trader Joe\'s / QFC / Whole Foods / Safeway on the way out of Seattle.',
        time: '~2 hrs',
      },
      { step: 'Check in', detail: 'Same base for all 4 nights — Cascade River House or one of the 2BR Terra Nova-tier cabins.' },
      {
        step: 'Ladder Creek Falls (easy)',
        detail: 'MP 120 · <0.5 mi paved loop behind Gorge Powerhouse, Newhalem. Lit at dusk.',
      },
    ],
    meals: { dinner: 'Cabin dinner from packaged kosher goods picked up en route.' },
  },
  {
    day: 2,
    date: 'Mon Aug 17',
    title: 'Cascade Pass day',
    shape: 'The signature west-side hike — moderate, big alpine views. Back by 4-5 PM.',
    stops: [
      { step: 'Pre-hike fuel', detail: 'Cabin breakfast + packed lunch + 2L water each.' },
      {
        step: 'Drive to Cascade Pass Trailhead',
        detail: 'End of Cascade River Rd · ~23 mi · ~1 hr from Marblemount. Last 13 mi compacted dirt + gravel.',
        time: '~1 hr',
      },
      { step: 'Cascade Pass (moderate)', detail: '7.0 mi RT · ~1,800 ft · 3.5-4 hrs (per WTA). Pass only — no Sahale extension.' },
      { step: 'Drive back', detail: '~1 hr to cabin.', time: '~1 hr' },
    ],
    meals: { dinner: 'Easy cabin dinner — pasta + sealed sauce.' },
  },
  {
    day: 3,
    date: 'Tue Aug 18',
    title: 'WA-20 viewpoint day',
    shape: 'String the viewpoints east along WA-20, light hike + picnic, back early.',
    stops: [
      { step: 'Gorge Creek Falls', detail: 'MP 123 · pull-out + footbridge · 5 min.' },
      { step: 'Diablo Lake Overlook', detail: 'MP 132 · turquoise glacier-flour lake · 20-30 min.' },
      { step: 'Ross Lake Overlook', detail: 'MP 135 · quick pull-off · 5 min.' },
      {
        step: 'Thunder Knob (easy-moderate)',
        detail: 'Colonial Creek South Campground · 3.6 mi RT · ~635 ft · 1.5-2 hrs.',
      },
      { step: 'Picnic lunch', detail: 'Colonial Creek picnic area, MP 130.' },
      { step: 'Back to Marblemount', detail: 'Home early.' },
    ],
    meals: { lunch: 'Picnic at Colonial Creek.', dinner: 'Cabin dinner.' },
  },
  {
    day: 4,
    date: 'Wed Aug 19',
    title: 'Slow day — Rainy Lake or Baker side trip',
    shape: 'Lower-effort day. Rainy Lake if WA-20 is open, otherwise Mt. Baker area.',
    stops: [
      {
        step: 'Option A — Rainy Lake (if WA-20 open)',
        detail: 'MP 158 · 1.8 mi paved · ~1 hr. Drive ~1.5 hrs east each way — turnaround day.',
      },
      {
        step: 'Option B — Mt. Baker side trip',
        detail: 'Park Butte (moderate, 7-8 mi) OR just the Baker Lake area for low-key viewpoints.',
      },
      { step: 'Concrete stop on return', detail: 'Cascadian Farm stand for snacks.' },
      { step: 'Home by 6 PM', detail: 'Easy evening at the cabin.' },
    ],
    meals: { dinner: 'Cabin dinner.' },
  },
  {
    day: 5,
    date: 'Thu Aug 20',
    title: 'Slow morning, drive to SEA',
    shape: 'Pack up, ~2 hr drive to SEA for the evening flight east.',
    stops: [
      { step: 'Slow morning', detail: 'Coffee on the porch, pack up.' },
      { step: 'Drive Marblemount → SEA', detail: '~2 hrs via WA-20 west → I-5 south.', time: '~2 hrs' },
      { step: 'Evening flight', detail: 'Nonstop SEA → NYC on Alaska.' },
    ],
    meals: {},
  },
];

// ============================================================
// Path B — Both Sides, Balanced
// ============================================================
const PATH_B_ITINERARY: ItineraryDay[] = [
  {
    day: 1,
    date: 'Sun Aug 16',
    title: 'SEA arrival, drive to Marblemount',
    shape: 'Morning SEA landing, drive in, Ladder Creek Falls evening.',
    stops: [
      { step: 'Land SEA AM', detail: 'Nonstop on Alaska from NYC.' },
      { step: 'Rental pickup', detail: 'SEA on-site rentals.' },
      { step: 'Drive SEA → Marblemount', detail: '~2 hrs via I-5 → WA-20.', time: '~2 hrs' },
      { step: 'Check in (west)', detail: 'Nights 1-2 at Cascade River House or Glacier Peak Resort.' },
      {
        step: 'Ladder Creek Falls',
        detail: 'MP 120 · <0.5 mi paved loop · lit at dusk.',
      },
    ],
    meals: { dinner: 'Cabin dinner from packaged kosher goods picked up en route.' },
  },
  {
    day: 2,
    date: 'Mon Aug 17',
    title: 'Cascade Pass day (west signature)',
    shape: 'Cascade Pass — moderate, alpine views. Back by 5-6 PM.',
    stops: [
      { step: 'Pre-hike fuel', detail: 'Cabin breakfast + packed lunch + 2L water each.' },
      { step: 'Drive to trailhead', detail: '~1 hr · last 13 mi dirt + gravel.', time: '~1 hr' },
      { step: 'Cascade Pass (moderate)', detail: '7.0 mi RT · ~1,800 ft · 3.5-4 hrs. Pass only.' },
      { step: 'Drive back', detail: '~1 hr to Marblemount.', time: '~1 hr' },
    ],
    meals: { dinner: 'Cabin dinner.' },
  },
  {
    day: 3,
    date: 'Tue Aug 18',
    title: 'Drive day — WA-20 viewpoints, transit east',
    shape: 'Pack up, work the viewpoints west → east, settle in Winthrop/Mazama by evening.',
    stops: [
      { step: 'Pack up, check out', detail: 'Moving east tonight.' },
      { step: 'Gorge Creek Falls', detail: 'MP 123 · 5 min stop.' },
      { step: 'Diablo Lake Overlook', detail: 'MP 132 · postcard view · 20-30 min.' },
      {
        step: 'Thunder Knob (optional)',
        detail: 'MP 130 · 3.6 mi RT · 1.5-2 hrs if energy.',
      },
      { step: 'Ross Lake Overlook', detail: 'MP 135 · 5 min stop.' },
      { step: 'Washington Pass Overlook', detail: 'MP 162 · 400-ft paved trail · 20 min. East-side postcard.' },
      { step: 'Drive to Winthrop/Mazama', detail: 'Washington Pass → Winthrop ~40 min.' },
      { step: 'Check in (east)', detail: 'Methow River Lodge (Winthrop) or Freestone (Mazama).' },
    ],
    meals: {
      lunch: 'Picnic at Colonial Creek picnic area, MP 130 — packaged kosher snacks from the cabin.',
      dinner: 'Cabin dinner at the new east-side base.',
    },
  },
  {
    day: 4,
    date: 'Wed Aug 19',
    title: 'Maple Pass day (east signature)',
    shape: 'Maple Pass Loop — moderate. Shorter alternate: Blue Lake. Decide morning-of.',
    stops: [
      { step: 'Pre-hike fuel', detail: 'Cabin breakfast, pack lunch + water.' },
      { step: 'Drive to Rainy Pass', detail: 'MP 158 · ~30 min from Winthrop / ~25 min from Mazama.', time: '~30 min' },
      { step: 'Maple Pass Loop (moderate)', detail: '7.2 mi loop · ~2,020 ft · 4-5 hrs. Counterclockwise is easier on knees.' },
      { step: 'Shorter option — Blue Lake', detail: '4.4 mi RT · ~1,050 ft · 2-3 hrs · easy-moderate.' },
      { step: 'Back to Winthrop', detail: 'Late afternoon walkabout — boardwalk + browse shops.' },
    ],
    meals: { dinner: 'Cabin dinner — restock at Winthrop\'s grocery for packaged kosher goods if running low.' },
  },
  {
    day: 5,
    date: 'Thu Aug 20',
    title: 'Slow Winthrop morning, drive to SEA',
    shape: 'Winthrop morning, ~4 hr drive via I-90 (faster) or US-2 / Stevens Pass (scenic + Leavenworth lunch).',
    stops: [
      { step: 'Slow morning', detail: 'Boardwalk + coffee.' },
      {
        step: 'Drive Winthrop → SEA',
        detail: '~4 hrs via WA-20 → US-97 → I-90, OR ~4.5 hrs scenic via US-2 / Stevens Pass.',
        time: '~4 hrs',
      },
      { step: 'Optional Leavenworth lunch', detail: 'Bavarian village on US-2. Only if taking the scenic route.' },
      { step: 'Evening flight', detail: 'Nonstop SEA → NYC.' },
    ],
    meals: { lunch: 'Leavenworth (if scenic route) or Cle Elum (on I-90).' },
  },
];

// ============================================================
// Path C — Slow Winthrop Base
// ============================================================
const PATH_C_ITINERARY: ItineraryDay[] = [
  {
    day: 1,
    date: 'Sun Aug 16',
    title: 'SEA arrival, one night Marblemount',
    shape: 'Break up the drive — one west-side night before pushing east.',
    stops: [
      { step: 'Land SEA AM', detail: 'Nonstop on Alaska.' },
      { step: 'Drive SEA → Marblemount', detail: '~2 hrs.', time: '~2 hrs' },
      { step: 'Light evening', detail: 'Ladder Creek Falls at dusk, or just check in + cabin time.' },
    ],
    meals: { dinner: 'Cabin dinner from packaged kosher goods picked up en route.' },
  },
  {
    day: 2,
    date: 'Mon Aug 17',
    title: 'Drive + viewpoints east',
    shape: 'Skip Cascade Pass entirely. Slow east-bound drive, viewpoints, settle in Winthrop.',
    stops: [
      { step: 'Pack up, check out', detail: 'Moving to Winthrop for 3 nights.' },
      { step: 'Gorge Creek Falls', detail: 'MP 123 · 5 min.' },
      { step: 'Diablo Lake Overlook', detail: 'MP 132 · postcard · 20-30 min.' },
      {
        step: 'Thunder Knob (optional)',
        detail: 'MP 130 · 3.6 mi RT · 1.5-2 hrs · the one hike of the day if she wants it.',
      },
      { step: 'Washington Pass Overlook', detail: 'MP 162 · 20 min.' },
      { step: 'Drive to Winthrop', detail: '~40 min from Washington Pass.' },
      { step: 'Check in (3 nights)', detail: 'Methow River Lodge or Freestone Inn.' },
      { step: 'Boardwalk walk', detail: 'Old-west boardwalk in evening light.' },
    ],
    meals: { dinner: 'Cabin dinner at the new Winthrop base.' },
  },
  {
    day: 3,
    date: 'Tue Aug 18',
    title: 'Maple Pass day (or Blue Lake)',
    shape: 'The big hike day. Long afternoon in Winthrop after — boardwalk + ice cream + nicer dinner.',
    stops: [
      { step: 'Drive to Rainy Pass', detail: 'MP 158 · ~30 min from Winthrop.', time: '~30 min' },
      { step: 'Maple Pass Loop (moderate)', detail: '7.2 mi · ~2,020 ft · 4-5 hrs.' },
      { step: 'Or Blue Lake (easy-mod)', detail: '4.4 mi RT · ~1,050 ft · 2-3 hrs.' },
      { step: 'Home by 4 PM', detail: 'Long afternoon in Winthrop.' },
      { step: 'Boardwalk walk', detail: 'Old-west boardwalk + Shafer Museum exterior in the late-afternoon light.' },
    ],
    meals: { dinner: 'Cabin dinner — nicer kosher meal cooked at home (steak + sealed sauce, or a packaged-prepared option from Seattle Kosher if you stocked up).' },
  },
  {
    day: 4,
    date: 'Wed Aug 19',
    title: 'Easy day — Rainy Lake or Methow lazy',
    shape: 'No big hike. Rainy Lake paved walk, or Patterson Lake kayaks, or just a Winthrop wander.',
    stops: [
      {
        step: 'Option A — Rainy Lake (easy)',
        detail: 'MP 158 · 1.8 mi paved · ~1 hr.',
      },
      {
        step: 'Option B — Patterson Lake kayaks',
        detail: 'Sun Mountain Lodge marina rental · 60-90 min.',
      },
      { step: 'Option C — Winthrop wander', detail: 'Boardwalk + shops + porch time.' },
      { step: 'Lazy lunch', detail: 'In town or a picnic.' },
      { step: 'Second town evening', detail: 'Boardwalk light walk before dinner.' },
    ],
    meals: { dinner: 'Cabin dinner — easy night, leftovers or pasta.' },
  },
  {
    day: 5,
    date: 'Thu Aug 20',
    title: 'Slow morning, drive to SEA',
    shape: '~4 hr drive via I-90 (faster) or US-2 / Stevens Pass (scenic + Leavenworth lunch).',
    stops: [
      { step: 'Slow morning', detail: 'Boardwalk + coffee.' },
      {
        step: 'Drive Winthrop → SEA',
        detail: '~4 hrs via WA-20 → US-97 → I-90, OR ~4.5 hrs scenic via US-2 / Stevens Pass.',
        time: '~4 hrs',
      },
      { step: 'Optional Leavenworth lunch', detail: 'On US-2 only.' },
      { step: 'Evening flight', detail: 'Nonstop SEA → NYC.' },
    ],
    meals: { lunch: 'Leavenworth or Cle Elum.' },
  },
];

// ============================================================
// Paths array
// ============================================================
export const TRIP_PATHS: TripPath[] = [
  {
    id: 'A',
    name: 'Path A · West-Side Anchor',
    tagline: 'One Marblemount cabin all 4 nights. Lowest WA-20 risk.',
    bestIf:
      'WA-20 reopen looks shaky in July — OR you want the simplest version with the least driving.',
    snapshot: [
      'One base, one cabin — no mid-trip move',
      'Cascade Pass + WA-20 viewpoints + slow days',
      'Skips the east side (no Maple Pass, no Winthrop)',
    ],
    lodgingIds: ['cascade-river-house', 'glacier-peak', 'rhody-house', 'nc-hideaway', 'nc-riverside', 'ovenells'],
    hikeIds: ['ladder-creek', 'cascade-pass', 'thunder-knob', 'park-butte'],
    itinerary: PATH_A_ITINERARY,
    includeSeattle: false,
    seattleNote: 'Skip Seattle on inbound (drive straight to park). Outbound: airport only — default is just fly home.',
    lodgingShape: '4 nights, one west-side cabin (Marblemount/Rockport)',
    flightNote: 'SEA roundtrip nonstop on Alaska — morning in Sun, evening out Thu.',
    tradeoff: 'Loses the east side entirely — no Maple Pass, no Washington Pass postcard, no Winthrop town flavor. Most weather-proof and road-proof of the three.',
  },
  {
    id: 'B',
    name: 'Path B · Both Sides, Balanced',
    tagline: 'Marblemount 2 nights → Winthrop 2 nights. The full park.',
    bestIf:
      'WA-20 looks solid by mid-July AND you want the full park — both signature hikes, both viewpoints, a Winthrop town night.',
    snapshot: [
      'Both signature hikes: Cascade Pass + Maple Pass',
      'Both viewpoints + a real Winthrop town night',
      'One mid-trip move — highest variety, highest road-risk',
    ],
    lodgingIds: [
      'cascade-river-house', 'glacier-peak', 'rhody-house',
      'methow-river', 'rivers-edge', 'freestone', 'chewuch', 'inn-at-mazama', 'spring-creek-ranch',
    ],
    hikeIds: ['ladder-creek', 'cascade-pass', 'thunder-knob', 'maple-pass', 'blue-lake'],
    itinerary: PATH_B_ITINERARY,
    includeSeattle: true,
    seattleNote: 'Conditional Leavenworth lunch stop on the Day-5 scenic-US-2 return. Seattle itself = airport only.',
    lodgingShape: '2 nights west (Marblemount) + 2 nights east (Winthrop/Mazama)',
    flightNote: 'SEA roundtrip nonstop on Alaska — same as Paths A + C.',
    tradeoff: 'Mid-trip lodging move costs a half-day of momentum. If WA-20 stays closed Aug 1, this whole path collapses to Path A or to a Stevens-Pass-loop-to-Winthrop variant. Highest reward, highest fragility.',
  },
  {
    id: 'C',
    name: 'Path C · Slow Winthrop Base',
    tagline: '1 night Marblemount + 3 nights Winthrop. Less driving, more porch.',
    bestIf:
      'Least driving, most evenings-at-the-cabin. Easy-to-moderate hikes only. More town time in Winthrop.',
    snapshot: [
      '3 nights in Winthrop — fewest packing days',
      'East-side hikes only — Maple Pass, Blue Lake, Rainy Lake',
      'Skips Cascade Pass (the biggest tradeoff)',
    ],
    lodgingIds: [
      'glacier-peak', 'rhody-house',
      'methow-river', 'rivers-edge', 'freestone', 'chewuch', 'inn-at-mazama', 'spring-creek-ranch',
    ],
    hikeIds: ['ladder-creek', 'rainy-lake', 'maple-pass', 'blue-lake', 'thunder-knob'],
    itinerary: PATH_C_ITINERARY,
    includeSeattle: true,
    seattleNote: 'Same as Path B — Leavenworth optional on US-2 return, SEA airport only.',
    lodgingShape: '1 night west (Marblemount) + 3 nights east (Winthrop/Mazama)',
    flightNote: 'SEA roundtrip nonstop on Alaska — Stevens Pass approach available if WA-20 still partially closed.',
    tradeoff: 'Loses Cascade Pass — the signature west-side hike — entirely. Gains two full Winthrop evenings and zero mid-trip packing.',
  },
];

export function getPathById(id: PathId | null): TripPath | null {
  if (!id) return null;
  return TRIP_PATHS.find((p) => p.id === id) ?? null;
}
