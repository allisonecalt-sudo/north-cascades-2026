/**
 * Trip paths — two materially different organizing structures.
 *
 * Per options.md (2026-05-16) + Allison's May 19 cut: Path C (Slow Winthrop
 * Base) was removed entirely — she's not using it, so it shouldn't take
 * visual real estate. Only Path A (locked fallback) + Path B (primary)
 * remain.
 *
 * Each path defines:
 *   - identity (id, name, tagline, snapshot bullets)
 *   - recommended lodging ids (filter view in Lodging section)
 *   - recommended hike ids (flag "in your path" in Hikes section)
 *   - itinerary day blueprint (each path has its own 5-day shape)
 *   - Seattle inclusion (Path A skips; Path B: optional Leavenworth lunch on return)
 *   - flight default (both share SEA RT — but path doc still binds it)
 *
 * "View all options" mode (selectedPath = null) shows everything ungated —
 * matches the prior site behavior so users can browse.
 */

import type { ItineraryDay } from './itinerary';

export type PathId = 'A' | 'B';

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
      { step: 'Land SEA AM', detail: 'Nonstop on United EWR→SEA from NYC (primary; Alaska EWR→BLI fallback). Morning arrival.' },
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
      { step: 'Evening flight', detail: 'Nonstop SEA → NYC on United (primary); Alaska SEA → BLI → EWR fallback.' },
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
      { step: 'Land SEA AM', detail: 'Nonstop on United EWR→SEA from NYC (primary, both have loyalty + Allison\'s travel credit); Alaska EWR→BLI fallback.' },
      { step: 'Rental pickup', detail: 'SEA on-site rentals.' },
      { step: 'Drive SEA → Marblemount', detail: '~2.5 hrs via I-5 → WA-20.', time: '~2.5 hrs' },
      { step: 'Check in (west)', detail: 'Nights 1-2 in the Marblemount cluster (Cascade River House, Glacier Peak Resort, or other Marblemount/Concrete/Rockport pick).' },
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
    title: 'Cascade Pass day (west signature) · Mt Baker side trip option',
    shape: 'Cascade Pass — moderate, alpine views. Back by 5-6 PM. Mt Baker / Park Butte available as the swap-in alternative.',
    stops: [
      { step: 'Pre-hike fuel', detail: 'Cabin breakfast + packed lunch + 2L water each.' },
      {
        step: 'Option A — Cascade Pass (default)',
        detail: 'Drive ~1 hr (last 13 mi dirt + gravel) · 7.0 mi RT · ~1,800 ft · 3.5-4 hrs. Pass only.',
        time: '~5 hrs total',
      },
      {
        step: 'Option B — Mt Baker / Park Butte (Erin May 18)',
        detail: 'Drive ~1 hr 15 min west to FR 13 off Baker Lake Rd · 7.5 mi RT · ~2,200 ft · ~5 hrs. Historic 1932 fire lookout with in-your-face Mt Baker views. NW Forest Pass required. Off WA-20 corridor — accessible even if WA-20 stays closed.',
        time: '~5 hrs total',
      },
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
// Paths array
// ============================================================
export const TRIP_PATHS: TripPath[] = [
  {
    id: 'A',
    name: 'Path A · West-Side Anchor (LOCKED FALLBACK)',
    tagline: 'One Marblemount cabin all 4 nights. The fallback if WA-20 stays closed.',
    bestIf:
      'WA-20 still closed by booking week. Erin May 18: "otherwise it\'s probably better to do Path A." This is the locked fallback if Path B falls through.',
    snapshot: [
      'Locked fallback (Erin May 18) — picks up if WA-20 stays closed',
      'One base, one cabin in the Marblemount cluster',
      'Cascade Pass + WA-20 viewpoints + Mt Baker swap-in option',
      'Skips the east side (no Maple Pass, no Winthrop)',
    ],
    lodgingIds: ['sauk-mountain-farmhouse', 'twin-cedars-treehouse', 'cascade-river-house', 'glacier-peak', 'ovenells'],
    hikeIds: ['ladder-creek', 'cascade-pass', 'thunder-knob', 'park-butte'],
    itinerary: PATH_A_ITINERARY,
    includeSeattle: false,
    seattleNote: 'Skip Seattle on inbound (drive straight to park). Outbound: airport only — default is just fly home.',
    lodgingShape: '4 nights, one west-side cabin (Marblemount/Rockport)',
    flightNote: 'United EWR→SEA nonstop primary (Allison\'s travel credit, both have loyalty); Alaska EWR→BLI fallback. Morning in Sun, evening out Thu.',
    tradeoff: 'Loses the east side entirely — no Maple Pass, no Washington Pass postcard, no Winthrop town flavor. Most weather-proof and road-proof of the three.',
  },
  {
    id: 'B',
    name: 'Path B · Both Sides, Balanced (PRIMARY PLAN)',
    tagline: 'Marblemount 2 nights → Winthrop 2 nights. The plan if WA-20 reopens.',
    bestIf:
      'WA-20 reopens by booking week. Erin May 18: "I\'d be down to do Path B but only once we know the road is opened." This is the primary plan, gated only on the road.',
    snapshot: [
      'Primary plan (Erin May 18) — gated on WA-20 reopen',
      'Both signature hikes: Cascade Pass + Maple Pass',
      'Both viewpoints + a real Winthrop town night',
      '2 nights west (Marblemount cluster) + 2 nights east — fits Erin\'s "max 2 places" rule',
      'Mt Baker / Park Butte available as Day 1.5 side trip',
    ],
    lodgingIds: [
      'sauk-mountain-farmhouse', 'twin-cedars-treehouse', 'cascade-river-house', 'glacier-peak',
      'methow-river', 'rivers-edge', 'freestone', 'chewuch', 'inn-at-mazama', 'spring-creek-ranch',
    ],
    hikeIds: ['ladder-creek', 'cascade-pass', 'thunder-knob', 'maple-pass', 'blue-lake', 'park-butte'],
    itinerary: PATH_B_ITINERARY,
    includeSeattle: true,
    seattleNote: 'Conditional Leavenworth lunch stop on the Day-5 scenic-US-2 return. Seattle itself = airport only.',
    lodgingShape: '2 nights west (Marblemount) + 2 nights east (Winthrop/Mazama)',
    flightNote: 'United EWR→SEA nonstop primary — same as Path A. Alaska EWR→BLI fallback.',
    tradeoff: 'Mid-trip lodging move costs a half-day of momentum. If WA-20 stays closed Aug 1, this whole path collapses to Path A or to a Stevens-Pass-loop-to-Winthrop variant. Highest reward, highest fragility.',
  },
];

export function getPathById(id: PathId | null): TripPath | null {
  if (!id) return null;
  return TRIP_PATHS.find((p) => p.id === id) ?? null;
}
