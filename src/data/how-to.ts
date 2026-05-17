/**
 * how-to.ts — decision-tree data for the "How to do this trip" page.
 *
 * Allison's ask (2026-05-17): *"this one should be giving possible paths — how
 * to do the trip."* Then: *"what do you think is best."*
 *
 * This is the LAY-IT-OUT surface — given the trip's constraints, walk through
 * the realistic ways to do it. Lives alongside the path picker on home + the
 * interactive map.
 *
 * Top branch: WA-20 status
 *   - "If WA-20 opens by July 4" (default branch — existing Paths A/B/C)
 *   - "If WA-20 stays closed past July 4" (Plan B routings — Paths D/E/F)
 *
 * Each PathOption carries:
 *   - shape ("4 nights west" / "2+2 split" / etc.) — the structural skeleton
 *   - whereYouSleep — night-by-night lodging shape
 *   - recommendedLodgings — 2-3 picks with kitchen + nature flag
 *   - daySkeleton — 5-day hike + viewpoint hit-list (lighter than the full
 *     itinerary; this page is a planner not an itinerary)
 *   - costRange — flights + lodging + rental + food estimate
 *   - bestFor / tradeoff — the "why pick this" vs "what you lose" pair
 *   - wa20Branch — which top branch this lives under
 *   - tags — drives the pick-by-question widget filter
 *
 * Question tags (drives the pick-by-question UX):
 *   - 'drive-min' / 'scenery-max' — driving appetite
 *   - 'hike-daily' / 'rest-days' — pacing
 *   - 'wants-winthrop' — east-side town night required
 *   - 'wa20-independent' — works regardless of WA-20 status
 *
 * Filter logic: a path is shown if every active filter chip matches one of
 * the path's tags. (Empty filter = show everything.) See `matchesFilters()`.
 */

export type Wa20Branch = 'open' | 'closed';

export type QuestionTag =
  | 'drive-min'
  | 'scenery-max'
  | 'hike-daily'
  | 'rest-days'
  | 'wants-winthrop'
  | 'wa20-independent';

export interface DaySkeleton {
  /** "Day 1" / "Day 2" etc. */
  label: string;
  /** Short one-line shape ("Arrive, settle, easy evening"). */
  shape: string;
  /** Marquee items for the day — hikes, viewpoints, town stops. */
  hits: readonly string[];
}

export interface PathLodgingPick {
  /** Lodging id from `data/lodging.ts` — for cross-link via /lodging.html#<id>. */
  id: string;
  /** Display name (kept short for the card). */
  name: string;
  /** Base location ("Marblemount" / "Winthrop" / "Mazama"). */
  base: string;
  /** Kitchen scope — full / kitchenette / none — surfaces the kosher fit. */
  kitchen: 'full' | 'kitchenette' | 'none';
  /** One-line why-this-pick. */
  why: string;
}

export interface PathOption {
  /** Stable id. A/B/C reuse existing path ids — D/E/F are Plan B additions. */
  id: 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
  /** Which top branch this option lives under. */
  wa20Branch: Wa20Branch;
  /** Short name shown on the card head ("Path A · West-Side Anchor"). */
  name: string;
  /** One-line tagline under the name. */
  tagline: string;
  /** "Best for" badge text — what reader earns by picking this. */
  bestFor: string;
  /** "Tradeoff" badge text — what reader gives up. */
  tradeoff: string;
  /** Shape diagram — 4 night-cells per path. e.g.
   *  [{ nights: '1-4', base: 'Marblemount' }] for single-base;
   *  [{ nights: '1-2', base: 'Marblemount' }, { nights: '3-4', base: 'Winthrop' }] for split. */
  shape: readonly { nights: string; base: string }[];
  /** Lodging picks — 2-3 properties. */
  lodgings: readonly PathLodgingPick[];
  /** Day-by-day skeleton — 5 entries (Day 1-5). */
  days: readonly DaySkeleton[];
  /** Drive total — rough end-to-end. */
  driveTotal: string;
  /** Hike count — marquee hikes in the plan. */
  hikeCount: number;
  /** Total cost range ($) — flights + rental + lodging + food. */
  costRange: string;
  /** WA-20 dependency — does the path collapse if WA-20 stays closed? */
  wa20Dependency: 'none' | 'connector-only' | 'high';
  /** Question tags — drives the pick-by-question filter. */
  tags: readonly QuestionTag[];
  /** Optional flag — F (skip / shift) is last-resort. */
  lastResort?: boolean;
}

// ============================================================
// Question chip definitions — drive the pick-by-question widget
// ============================================================

export interface QuestionChip {
  tag: QuestionTag;
  /** Question this answers (shown above the chips). */
  question: string;
  /** Chip text. */
  label: string;
  /** Short hint shown under the chip on hover / mobile. */
  hint: string;
}

export const QUESTION_CHIPS: readonly QuestionChip[] = [
  {
    tag: 'drive-min',
    question: 'Driving',
    label: 'Drive minimum',
    hint: 'Favors single-base — fewer packing days, less corridor time.',
  },
  {
    tag: 'scenery-max',
    question: 'Driving',
    label: 'Scenery max',
    hint: 'Favors split bases — see both sides + both signature hikes.',
  },
  {
    tag: 'hike-daily',
    question: 'Pacing',
    label: 'Hike most days',
    hint: 'Path A or B fit — marquee hikes back-to-back.',
  },
  {
    tag: 'rest-days',
    question: 'Pacing',
    label: 'Want rest days',
    hint: 'Single-base paths (A or C) leave room for cabin afternoons.',
  },
  {
    tag: 'wants-winthrop',
    question: 'Town nights',
    label: 'Want a Winthrop town night',
    hint: 'Narrows to east-side-night paths (B, C, E).',
  },
  {
    tag: 'wa20-independent',
    question: 'Risk',
    label: 'Don\'t want WA-20 risk',
    hint: 'Narrows to paths that work even if WA-20 stays closed (A, D, E).',
  },
];

// ============================================================
// PATH A — West-Side Anchor (WA-20 open)
// ============================================================

const PATH_A: PathOption = {
  id: 'A',
  wa20Branch: 'open',
  name: 'Path A · West-Side Anchor',
  tagline: 'One Marblemount cabin all 4 nights. Lowest WA-20 risk.',
  bestFor: 'Simplest version · fewest packing days · WA-20-independent',
  tradeoff: 'Loses Maple Pass + Winthrop town flavor entirely.',
  shape: [{ nights: 'Nights 1-4', base: 'Marblemount' }],
  lodgings: [
    {
      id: 'cascade-river-house',
      name: 'Cascade River House',
      base: 'Marblemount',
      kitchen: 'full',
      why: 'Full kitchen + on-corridor + Terra Nova-tier cabin feel.',
    },
    {
      id: 'rhody-house',
      name: 'The Rhody House',
      base: 'Marblemount',
      kitchen: 'full',
      why: 'Bright 2BR, well-reviewed, room to spread out.',
    },
    {
      id: 'nc-riverside',
      name: 'NC Riverside Retreat',
      base: 'Concrete',
      kitchen: 'full',
      why: 'Skagit riverside · hot tub · the nature pick if you want water sound.',
    },
  ],
  days: [
    {
      label: 'Day 1 · Sun Aug 16',
      shape: 'SEA → Marblemount, settle, easy evening.',
      hits: ['Drive in', 'Ladder Creek Falls at dusk'],
    },
    {
      label: 'Day 2 · Mon Aug 17',
      shape: 'Cascade Pass — the signature west-side hike.',
      hits: ['Cascade Pass (7 mi · 1,800 ft)'],
    },
    {
      label: 'Day 3 · Tue Aug 18',
      shape: 'WA-20 viewpoint day — string the postcards east.',
      hits: ['Diablo Lake Overlook', 'Thunder Knob', 'Ross Lake Overlook'],
    },
    {
      label: 'Day 4 · Wed Aug 19',
      shape: 'Slow day — Rainy Lake or Mt. Baker side trip.',
      hits: ['Rainy Lake (paved) OR Park Butte (Baker)'],
    },
    {
      label: 'Day 5 · Thu Aug 20',
      shape: 'Slow morning, drive to SEA.',
      hits: ['Marblemount → SEA (~2 hr)'],
    },
  ],
  driveTotal: '~280 mi total · ~6.5 hrs in the car across 5 days',
  hikeCount: 3,
  costRange: '$2,400-3,400 / pair',
  wa20Dependency: 'none',
  tags: ['drive-min', 'rest-days', 'wa20-independent'],
};

// ============================================================
// PATH B — Both Sides, Balanced (WA-20 open)
// ============================================================

const PATH_B: PathOption = {
  id: 'B',
  wa20Branch: 'open',
  name: 'Path B · Both Sides, Balanced',
  tagline: 'Marblemount 2 nights → Winthrop 2 nights. The full park.',
  bestFor: 'Both signature hikes · Diablo + Washington Pass · a real Winthrop night',
  tradeoff: 'Mid-trip move costs a half-day. Collapses if WA-20 stays closed.',
  shape: [
    { nights: 'Nights 1-2', base: 'Marblemount' },
    { nights: 'Nights 3-4', base: 'Winthrop/Mazama' },
  ],
  lodgings: [
    {
      id: 'cascade-river-house',
      name: 'Cascade River House',
      base: 'Marblemount (nights 1-2)',
      kitchen: 'full',
      why: 'West-side base — full kitchen, on-corridor.',
    },
    {
      id: 'methow-river',
      name: 'Methow River Lodge & Cabins',
      base: 'Winthrop (nights 3-4)',
      kitchen: 'full',
      why: 'Walkable to Winthrop boardwalk, riverside, full kitchen.',
    },
    {
      id: 'spring-creek-ranch',
      name: 'Spring Creek Ranch',
      base: 'Winthrop (nights 3-4)',
      kitchen: 'full',
      why: 'Ranch-acreage stay, quiet, Terra Nova-tier.',
    },
  ],
  days: [
    {
      label: 'Day 1 · Sun Aug 16',
      shape: 'SEA → Marblemount, settle, easy evening.',
      hits: ['Drive in', 'Ladder Creek Falls'],
    },
    {
      label: 'Day 2 · Mon Aug 17',
      shape: 'Cascade Pass day (west signature).',
      hits: ['Cascade Pass (7 mi · 1,800 ft)'],
    },
    {
      label: 'Day 3 · Tue Aug 18',
      shape: 'Drive day — viewpoints west → east, settle Winthrop.',
      hits: ['Diablo Lake', 'Washington Pass', 'Check-in east'],
    },
    {
      label: 'Day 4 · Wed Aug 19',
      shape: 'Maple Pass day (east signature) + Winthrop afternoon.',
      hits: ['Maple Pass Loop (7.2 mi · 2,020 ft)', 'Boardwalk evening'],
    },
    {
      label: 'Day 5 · Thu Aug 20',
      shape: 'Slow morning, ~4 hr drive to SEA.',
      hits: ['Winthrop → SEA via I-90 or US-2 / Leavenworth'],
    },
  ],
  driveTotal: '~440 mi total · ~10 hrs in the car across 5 days',
  hikeCount: 4,
  costRange: '$2,600-3,800 / pair',
  wa20Dependency: 'high',
  tags: ['scenery-max', 'hike-daily', 'wants-winthrop'],
};

// ============================================================
// PATH C — Slow Winthrop Base (WA-20 open)
// ============================================================

const PATH_C: PathOption = {
  id: 'C',
  wa20Branch: 'open',
  name: 'Path C · Slow Winthrop Base',
  tagline: '1 night Marblemount + 3 nights Winthrop. Less driving, more porch.',
  bestFor: 'Least driving · most porch time · east-side hikes only',
  tradeoff: 'Skips Cascade Pass — the marquee west-side hike — entirely.',
  shape: [
    { nights: 'Night 1', base: 'Marblemount' },
    { nights: 'Nights 2-4', base: 'Winthrop/Mazama' },
  ],
  lodgings: [
    {
      id: 'glacier-peak',
      name: 'Glacier Peak Resort',
      base: 'Rockport (night 1)',
      kitchen: 'full',
      why: 'One-night west pause — cabin + winery, easy in/out.',
    },
    {
      id: 'spring-creek-ranch',
      name: 'Spring Creek Ranch',
      base: 'Winthrop (nights 2-4)',
      kitchen: 'full',
      why: 'Ranch-acreage 3-night base, quiet, Terra Nova-tier.',
    },
    {
      id: 'rivers-edge',
      name: 'River\'s Edge Resort',
      base: 'Winthrop (nights 2-4)',
      kitchen: 'full',
      why: 'Methow riverside chalet · full kitchen confirmed.',
    },
  ],
  days: [
    {
      label: 'Day 1 · Sun Aug 16',
      shape: 'SEA → Marblemount, one west-side night.',
      hits: ['Drive in', 'Ladder Creek Falls'],
    },
    {
      label: 'Day 2 · Mon Aug 17',
      shape: 'Drive + viewpoints east, settle Winthrop.',
      hits: ['Diablo Lake', 'Washington Pass', 'Check-in east'],
    },
    {
      label: 'Day 3 · Tue Aug 18',
      shape: 'Maple Pass day — long Winthrop afternoon after.',
      hits: ['Maple Pass Loop', 'Boardwalk evening'],
    },
    {
      label: 'Day 4 · Wed Aug 19',
      shape: 'Easy day — Rainy Lake, Patterson kayaks, or porch.',
      hits: ['Rainy Lake OR Patterson Lake kayak OR town wander'],
    },
    {
      label: 'Day 5 · Thu Aug 20',
      shape: 'Slow morning, ~4 hr drive to SEA.',
      hits: ['Winthrop → SEA via I-90 or US-2 / Leavenworth'],
    },
  ],
  driveTotal: '~420 mi total · ~9 hrs in the car across 5 days',
  hikeCount: 2,
  costRange: '$2,500-3,600 / pair',
  wa20Dependency: 'connector-only',
  tags: ['rest-days', 'wants-winthrop'],
};

// ============================================================
// PATH D — West-Only (WA-20 stays closed)
// ============================================================

const PATH_D: PathOption = {
  id: 'D',
  wa20Branch: 'closed',
  name: 'Path D · West-Only (Plan B)',
  tagline: '4 nights Marblemount. Cascade Pass + Mt. Baker. Skip east side entirely.',
  bestFor: 'WA-20 stays closed · west-side cabin time · Mt. Baker bonus',
  tradeoff: 'No Maple Pass · no Winthrop · no Washington Pass · no Diablo Overlook.',
  shape: [{ nights: 'Nights 1-4', base: 'Marblemount' }],
  lodgings: [
    {
      id: 'cascade-river-house',
      name: 'Cascade River House',
      base: 'Marblemount',
      kitchen: 'full',
      why: 'Full kitchen + on-corridor for the 4-night anchor.',
    },
    {
      id: 'rhody-house',
      name: 'The Rhody House',
      base: 'Marblemount',
      kitchen: 'full',
      why: 'Bright 2BR, well-reviewed, room to spread out.',
    },
    {
      id: 'nc-riverside',
      name: 'NC Riverside Retreat',
      base: 'Concrete',
      kitchen: 'full',
      why: 'Skagit riverside · hot tub · nature pick.',
    },
  ],
  days: [
    {
      label: 'Day 1 · Sun Aug 16',
      shape: 'SEA → Marblemount, settle.',
      hits: ['Drive in', 'Ladder Creek Falls'],
    },
    {
      label: 'Day 2 · Mon Aug 17',
      shape: 'Cascade Pass (Cascade River Rd — separate access, west of closure).',
      hits: ['Cascade Pass (7 mi · 1,800 ft)'],
    },
    {
      label: 'Day 3 · Tue Aug 18',
      shape: 'Mt. Baker day — Heliotrope Ridge or Park Butte.',
      hits: ['Park Butte (7-8 mi) OR Heliotrope Ridge'],
    },
    {
      label: 'Day 4 · Wed Aug 19',
      shape: 'Easy day — Newhalem stops + Sauk Mountain OR cabin time.',
      hits: ['Newhalem · Trail of the Cedars · Sauk Mt (optional)'],
    },
    {
      label: 'Day 5 · Thu Aug 20',
      shape: 'Slow morning, ~2 hr drive to SEA.',
      hits: ['Marblemount → SEA'],
    },
  ],
  driveTotal: '~320 mi total · ~7.5 hrs in the car across 5 days',
  hikeCount: 3,
  costRange: '$2,400-3,400 / pair',
  wa20Dependency: 'none',
  tags: ['drive-min', 'rest-days', 'wa20-independent'],
};

// ============================================================
// PATH E — East-Only via Stevens Pass (WA-20 stays closed)
// ============================================================

const PATH_E: PathOption = {
  id: 'E',
  wa20Branch: 'closed',
  name: 'Path E · East-Only via Stevens Pass',
  tagline: '4 nights Winthrop · access Methow + Maple Pass + Cutthroat. Adds ~4 hr drive each way.',
  bestFor: 'WA-20 stays closed · still want Maple Pass + Methow + Winthrop town',
  tradeoff: 'No Cascade Pass · no Diablo · ~4 hr Stevens Pass drive each way.',
  shape: [{ nights: 'Nights 1-4', base: 'Winthrop/Mazama' }],
  lodgings: [
    {
      id: 'spring-creek-ranch',
      name: 'Spring Creek Ranch',
      base: 'Winthrop',
      kitchen: 'full',
      why: 'Ranch-acreage, quiet, Terra Nova-tier, full kitchen.',
    },
    {
      id: 'rivers-edge',
      name: 'River\'s Edge Resort',
      base: 'Winthrop',
      kitchen: 'full',
      why: 'Methow riverside chalet · full kitchen confirmed.',
    },
    {
      id: 'methow-river',
      name: 'Methow River Lodge & Cabins',
      base: 'Winthrop',
      kitchen: 'full',
      why: 'Walkable to boardwalk, riverside, full kitchen.',
    },
  ],
  days: [
    {
      label: 'Day 1 · Sun Aug 16',
      shape: 'SEA → US-2 over Stevens Pass → Winthrop (~5.5 hr).',
      hits: ['Long drive via Wenatchee', 'Leavenworth lunch'],
    },
    {
      label: 'Day 2 · Mon Aug 17',
      shape: 'Maple Pass Loop (east signature).',
      hits: ['Maple Pass Loop (7.2 mi · 2,020 ft)'],
    },
    {
      label: 'Day 3 · Tue Aug 18',
      shape: 'Cutthroat Pass OR Blue Lake + Mazama Store + Patterson kayaks.',
      hits: ['Cutthroat (10 mi) OR Blue Lake (4.4 mi)', 'Mazama Store lunch'],
    },
    {
      label: 'Day 4 · Wed Aug 19',
      shape: 'Slow day — Pearrygin Lake swim + Winthrop boardwalk.',
      hits: ['Pearrygin swim', 'Sun Mountain trails', 'Boardwalk evening'],
    },
    {
      label: 'Day 5 · Thu Aug 20',
      shape: 'Winthrop → SEA via Stevens Pass (~5.5 hr).',
      hits: ['Leavenworth lunch on return'],
    },
  ],
  driveTotal: '~580 mi total · ~13 hrs in the car across 5 days',
  hikeCount: 3,
  costRange: '$2,600-3,800 / pair',
  wa20Dependency: 'none',
  tags: ['wants-winthrop', 'hike-daily', 'wa20-independent'],
};

// ============================================================
// PATH F — Skip / shift / different destination (last resort)
// ============================================================

const PATH_F: PathOption = {
  id: 'F',
  wa20Branch: 'closed',
  name: 'Path F · Punt — shift dates or destination',
  tagline: 'Last resort. Move the trip to September, or swap to Olympics / Glacier.',
  bestFor: 'WA-20 closed AND smoke flares AND Cascade River Rd is gated.',
  tradeoff: 'You skip the trip you came to do. Reschedule energy is real.',
  shape: [{ nights: 'TBD', base: 'TBD — depends on swap' }],
  lodgings: [],
  days: [
    {
      label: 'Option 1',
      shape: 'Punt to mid-September. WA-20 normally clear, crowds drop.',
      hits: ['Re-book same itinerary 4 weeks later'],
    },
    {
      label: 'Option 2',
      shape: 'Swap to Olympics (Hurricane Ridge + Hoh) — fly SEA RT, same dates.',
      hits: ['Olympic peninsula 4-night loop'],
    },
    {
      label: 'Option 3',
      shape: 'Swap to Glacier NP (Montana) — fly FCA, same dates.',
      hits: ['Going-to-the-Sun + Many Glacier'],
    },
  ],
  driveTotal: 'Varies — depends on destination',
  hikeCount: 0,
  costRange: 'Varies — flights may resell, lodging cancellations apply',
  wa20Dependency: 'none',
  tags: ['wa20-independent'],
  lastResort: true,
};

// ============================================================
// Exports
// ============================================================

export const HOW_TO_PATHS: readonly PathOption[] = [
  PATH_A,
  PATH_B,
  PATH_C,
  PATH_D,
  PATH_E,
  PATH_F,
];

/**
 * Filter a list of paths by the active set of question chips.
 * Empty set = show everything. Otherwise: AT LEAST ONE chip per question
 * category must be matched by the path. (Within a category, chips are OR;
 * across categories, AND.)
 *
 * For this minimal implementation we use a simpler rule: a path passes if
 * every active chip's tag is present in the path's tags. (Reader-friendly:
 * "all your answers apply to this path.")
 */
export function matchesFilters(
  path: PathOption,
  activeTags: ReadonlySet<QuestionTag>
): boolean {
  if (activeTags.size === 0) return true;
  for (const tag of activeTags) {
    if (!path.tags.includes(tag)) return false;
  }
  return true;
}

/** TLDR shown at top of the page. */
export const HOW_TO_TLDR = {
  open:
    'There are 3 realistic ways to do this if WA-20 opens by July 4. Path A anchors west (lowest risk), Path B splits both sides (most variety), Path C anchors east (most porch time).',
  closed:
    'There are 2 realistic ways to do this if WA-20 stays closed. Path D anchors west (Cascade Pass + Mt. Baker). Path E anchors east via Stevens Pass (Maple Pass + Methow). Path F is the punt — last resort.',
};

export const HOW_TO_PAGE_META = {
  lede:
    'Given the trip\'s constraints — 5 days, 2 travelers, kosher kitchen required, WA-20 mid-corridor under repair — these are the realistic ways to do it. Pick by answering a few questions, or scan the path cards.',
  asOf: 'May 17, 2026',
} as const;
