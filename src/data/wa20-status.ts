/**
 * wa20-status.ts — source-of-truth data for the WA-20 deep-dive page.
 *
 * Why this file exists (May 17, 2026):
 *   Home banner + page-shell closure-banner is the TEASER. This file backs the
 *   DEEP page (`/wa20-status.html`) Erin can be linked to in the morning of any
 *   travel-decision call. Banner data lives in `closure.ts` (CLOSURE_ALERT) and
 *   is intentionally short; this file expands the same situation with sources,
 *   history, affected destinations, and contingency routing.
 *
 *   Per `nc-improvement-plan-2026-05-17.md` "Pages NC needs but Austria
 *   doesn't" — NC has a live road-closure spanning the whole trip arc; Austria
 *   never did.
 *
 * What's in here:
 *   - STATUS         — current closure pill + last-verified timestamps per
 *                       source (the fail-loud reconciliation)
 *   - TLDR_BULLETS   — 3 lines: what this means for the trip
 *   - SOURCES        — WSDOT live page, NPS road-conditions, recent news,
 *                       each with what-it-says + last-verified date
 *   - PHONE_PROTOCOL — exact script for the WSDOT 1-800 call (booking week +
 *                       day-of)
 *   - AFFECTED       — hikes / lakes / activities / hidden-gems that go
 *                       unreachable when the MP 130-156 mid-corridor is
 *                       closed. Hand-curated from the `needsWa20Through === true`
 *                       data scattered across `data/{hikes,lakes,activities,
 *                       hidden-gems,viewpoints}.ts`. Pages cross-linked.
 *   - CONTINGENCY    — Stevens Pass detour math + west-only / east-only plan
 *                       adjustments + when to switch
 *   - TIMELINE       — Dec 2025 washout → today, the 5-event sequence so a
 *                       fresh reader gets why this is a long closure, not a
 *                       weekend snowdrift
 */

import { CLOSURE_ALERT } from './closure';

// ====================================================================
// CURRENT STATUS PILL
// ====================================================================

export interface Wa20Status {
  /** Big pill label — what the badge actually says ("CLOSED" / "OPEN" / etc.). */
  state: 'closed' | 'open' | 'partial';
  /** Headline summary — short enough to live in a red pill. */
  headline: string;
  /** Closed milepost range — "MP 130-156" or "Open through" if open. */
  range: string;
  /** Plain-language as-of date the site author last verified. */
  asOfLabel: string;
  /** ISO date matching asOfLabel — used for staleness math if needed later. */
  asOfIso: string;
  /** Reuses CLOSURE_ALERT.detail so the banner + page stay in sync. */
  detail: string;
  /** Reuses CLOSURE_ALERT.target. */
  target: string;
}

export const WA20_STATUS: Wa20Status = {
  state: 'closed',
  headline: 'CLOSED through the park',
  range: 'MP 130 (Colonial Creek) → MP 156 (Porcupine Creek)',
  asOfLabel: 'May 17, 2026',
  asOfIso: '2026-05-17',
  detail: CLOSURE_ALERT.detail,
  target: CLOSURE_ALERT.target,
};

// ====================================================================
// TLDR — three bullets above the fold
// ====================================================================

export const WA20_TLDR: readonly string[] = [
  'The 3 trip paths still work. Path A (west-side anchor) + Path C (east-side anchor) were sized for this closure; Path B (split) adds Stevens Pass on the connector day.',
  'Sahale Arm + Cascade Pass are reachable from the WEST (Cascade River Rd, separate access). Maple Pass + Cutthroat Pass + Blue Lake are reachable from the EAST (Mazama → Rainy Pass). The losses are mid-corridor: Diablo Lake Overlook, Thunder Knob, Ross Lake water-taxi, Diablo kayak launch at Colonial Creek.',
  'If you need to drive west-to-east (or back) and WA-20 is still closed: Stevens Pass (US-2) adds ~4 hours one-way. Plan to do it once, not as a daily commute.',
];

// ====================================================================
// SOURCE-BY-SOURCE STATUS — fail-loud reconciliation
// ====================================================================

export interface Wa20Source {
  id: string;
  authority: string;
  /** What the source page says, verbatim or near-verbatim. */
  whatItSays: string;
  /** Date this audit last fetched + read the page. */
  lastVerified: string;
  /** URL the source lives at. */
  url: string;
  /** Reliability marker — green/yellow/red so the reader scans tone first. */
  trust: 'high' | 'medium' | 'low';
  /** Why trust is what it is. One short line. */
  trustNote: string;
}

export const WA20_SOURCES: readonly Wa20Source[] = [
  {
    id: 'wsdot-live',
    authority: 'WSDOT · North Cascades Highway live status',
    whatItSays:
      'Closed MP 130-156. Target reopen: July 4, 2026 — "a goal, not a promise." Will not reopen for Memorial Day. Latest seasonal reopen since WSDOT started tracking in 1972.',
    lastVerified: 'May 15, 2026 (via news + WSDOT advisory)',
    url: 'https://wsdot.com/travel/real-time/mountainpasses/north-cascades-highway',
    trust: 'high',
    trustNote:
      'Owns the road; emergency-contract status comes from here. Live page renders nav-only to scraping — confirm by phone or browser load.',
  },
  {
    id: 'nps-road-conditions',
    authority: 'NPS · North Cascades road conditions',
    whatItSays:
      '"Partially closed as of 3/18 ... Expected reopening: April or early May (weather-dependent)" — page last updated May 6, 2026. Contradicts WSDOT July 4 target.',
    lastVerified: 'May 17, 2026',
    url: 'https://www.nps.gov/noca/planyourvisit/road-conditions.htm',
    trust: 'low',
    trustNote:
      'STALE. NPS page hasn\'t been re-updated since May 6 and pre-dates the May 13 second emergency contract. WSDOT is the authority on the road itself.',
  },
  {
    id: 'news',
    authority: 'Local news (Methow Valley News, KING5, Seattle Times)',
    whatItSays:
      'East-section reopened to Porcupine Creek turnaround April 30. First emergency contract started May 5 (slope stabilization + debris removal at MP 131). Second contract started May 13 (washout repairs).',
    lastVerified: 'May 15, 2026',
    url: 'https://methowvalleynews.com/',
    trust: 'medium',
    trustNote:
      'Useful for milestone events. Re-search "North Cascades Highway" weekly through July for fresh announcements.',
  },
];

// ====================================================================
// PHONE-CHECK PROTOCOL
// ====================================================================

export interface PhoneNumber {
  label: string;
  number: string;
  hint: string;
}

export const WA20_PHONE_NUMBERS: readonly PhoneNumber[] = [
  {
    label: 'WSDOT — statewide highway info',
    number: '1-800-695-7623',
    hint: 'Press "5" for North Cascades Highway. Voice line, no menu maze. Updated as conditions change.',
  },
  {
    label: 'NPS · North Cascades NP — Visitor Center',
    number: '360-854-7200',
    hint: 'Mon-Fri 9am-4pm PT. Cross-confirms whether park-side roads (Cascade River Rd) are open even if WA-20 is closed.',
  },
];

export const WA20_PHONE_SCRIPT: readonly string[] = [
  '"Hi, calling about North Cascades Highway / SR-20 status. Is it open through the park between Marblemount and Mazama, or is the mid-corridor still closed?"',
  '"If still closed: do you have a current reopen estimate?"',
  '"If reopening soon: is the east section open past Washington Pass to Rainy Pass and Cutthroat Pass trailheads, or only as far as Porcupine Creek?"',
];

// ====================================================================
// AFFECTED DESTINATIONS — what becomes unreachable when MP 130-156 is closed
// ====================================================================

/**
 * Reachability when MP 130-156 mid-corridor is closed:
 *
 *   - LOST (mid-corridor): destinations sitting between MP 130-156 are simply
 *     unreachable while the closure holds. Only Diablo Lake Overlook + Thunder
 *     Knob + Ross Lake/Diablo kayak fall here on the curated site.
 *   - REROUTED (east-side): MP 156-179ish destinations (Rainy Pass / Washington
 *     Pass / Cutthroat / Blue Lake / Maple Pass / Cedar Creek Falls) stay
 *     REACHABLE — but only from the Mazama/Winthrop side. If your base is west,
 *     you can't get there without the Stevens Pass loop.
 *   - REROUTED (west-side): Newhalem-area items (MP 119-120) stay west-side
 *     reachable. Cascade Pass / Sahale Arm use Cascade River Rd, not WA-20
 *     mid-corridor — they're also fine from the west.
 */
export type Wa20Impact =
  | 'lost'             // sits inside MP 130-156 — unreachable
  | 'east-only'        // east of closure — east-base only
  | 'west-only'        // west of closure — west-base only
  | 'either-side';     // accessible from west AND east (e.g. Newhalem / Marblemount stuff)

export interface AffectedItem {
  /** Display name. */
  name: string;
  /** Which curated page hosts the full card. */
  source: 'hikes' | 'lakes' | 'activities' | 'hidden-gems' | 'viewpoints';
  /** Anchor on the source page (e.g. "blue-lake" → /hikes.html#blue-lake). */
  anchor: string;
  /** Where it sits on WA-20 (e.g. "MP 132", "MP 158-167 east"). */
  location: string;
  /** What happens to reachability when MP 130-156 is closed. */
  impact: Wa20Impact;
  /** One-line plain-language note ("Still open from Mazama"). */
  note: string;
}

export const WA20_AFFECTED: readonly AffectedItem[] = [
  // ───────── LOST (sit inside MP 130-156) ─────────
  {
    name: 'Diablo Lake Overlook',
    source: 'viewpoints',
    anchor: 'diablo-lake-overlook',
    location: 'MP 132 · mid-corridor',
    impact: 'lost',
    note: 'Sits inside the closure zone — no detour reaches it from either side.',
  },
  {
    name: 'Thunder Knob',
    source: 'hikes',
    anchor: 'thunder-knob',
    location: 'MP 130 · Colonial Creek (closure boundary)',
    impact: 'lost',
    note: 'TH at the western edge of the closure. Becomes reachable only if WSDOT reopens to MP 130 — partial reopens have not extended that far west yet.',
  },
  {
    name: 'Ross Lake water-taxi day (kayak + camping)',
    source: 'activities',
    anchor: 'ross-lake-watertaxi',
    location: 'Diablo Dam access · MP 134',
    impact: 'lost',
    note: 'Trailhead down to the resort is inside the closure. The ONLY on-water rental in the corridor — its absence is the biggest activity-side loss.',
  },
  {
    name: 'Diablo Lake kayak (self-launch)',
    source: 'activities',
    anchor: 'diablo-kayak',
    location: 'Colonial Creek launch · MP 130',
    impact: 'lost',
    note: 'Launch is at the closure boundary. North Cascade Kayaks rental in Rockport is fine; getting to the water is not.',
  },
  {
    name: 'Diablo Lake (lake card)',
    source: 'lakes',
    anchor: 'diablo-lake',
    location: 'MP 132 (overlook) · MP 130 launch',
    impact: 'lost',
    note: 'Both the iconic overlook AND the launch sit inside the closure zone.',
  },
  {
    name: 'Ross Lake (lake card)',
    source: 'lakes',
    anchor: 'ross-lake',
    location: 'Trailhead via Diablo Dam Rd · MP 134',
    impact: 'lost',
    note: 'Dam-access trailhead is mid-corridor. Stays look-only from afar unless WA-20 reopens.',
  },

  // ───────── EAST-ONLY (east of closure, east-base only) ─────────
  {
    name: 'Maple Pass Loop',
    source: 'hikes',
    anchor: 'maple-pass',
    location: 'Rainy Pass TH · MP 158',
    impact: 'east-only',
    note: 'East-section reopened to Porcupine Creek (MP 156.8) on Apr 30. Rainy Pass at MP 158 sits inside the still-closed mid-section — confirm with WSDOT before Aug 16.',
  },
  {
    name: 'Cutthroat Pass via PCT',
    source: 'hikes',
    anchor: 'cutthroat-pass',
    location: 'Rainy Pass TH · MP 158',
    impact: 'east-only',
    note: 'Same trailhead as Maple Pass — same caveat.',
  },
  {
    name: 'Rainy Lake',
    source: 'hikes',
    anchor: 'rainy-lake',
    location: 'Rainy Pass · MP 158',
    impact: 'east-only',
    note: 'Same trailhead — paved 1.8mi RT. Confirm WSDOT extends east-section past MP 156.8.',
  },
  {
    name: 'Blue Lake',
    source: 'hikes',
    anchor: 'blue-lake',
    location: 'MP 161 · east of Washington Pass',
    impact: 'east-only',
    note: 'East of the closure. Confirm east-section opens to MP 161+ before counting on it.',
  },
  {
    name: 'Cedar Creek Falls',
    source: 'hikes',
    anchor: 'cedar-creek-falls',
    location: 'FR 5310 off WA-20 · 8 min west of Mazama',
    impact: 'east-only',
    note: 'Reachable from Mazama side now (east of all closure work).',
  },
  {
    name: 'Cutthroat Lake (lake-only)',
    source: 'hidden-gems',
    anchor: 'cutthroat-lake',
    location: 'MP 167 · Cutthroat Creek TH',
    impact: 'east-only',
    note: 'East of Washington Pass — reachable from Mazama once east-section extends past MP 167.',
  },
  {
    name: 'Maple Pass + Frisco Mountain extension',
    source: 'hidden-gems',
    anchor: 'maple-pass-frisco',
    location: 'MP 158 · Rainy Pass scramble add-on',
    impact: 'east-only',
    note: 'Same Maple Pass trailhead caveat.',
  },
  {
    name: 'Washington Pass Overlook',
    source: 'viewpoints',
    anchor: 'washington-pass-overlook',
    location: 'MP 162 · highest point on WA-20',
    impact: 'east-only',
    note: 'East of the mid-corridor closure. From an east base, ~30 min drive — assuming east-section open to MP 162.',
  },
  {
    name: 'Cutthroat Pass drive-up vista',
    source: 'viewpoints',
    anchor: 'cutthroat-pass-pullout',
    location: 'MP 167 · roadside pullouts',
    impact: 'east-only',
    note: 'Same east-side caveat as Cutthroat Lake.',
  },

  // ───────── WEST-ONLY (west of closure / Cascade River Rd) ─────────
  // (Curated site doesn't tag these via needsWa20Through because they don't
  // need WA-20 mid-corridor — but they're listed here so the reader sees the
  // reachable-from-west picture clearly.)
];

// ====================================================================
// CONTINGENCY ROUTING
// ====================================================================

export interface ContingencyOption {
  id: string;
  title: string;
  /** Severity / tone for visual treatment. */
  tone: 'info' | 'warn' | 'bad';
  /** TLDR — what this option is in one sentence. */
  tldr: string;
  /** Detail bullets. */
  body: readonly string[];
  /** When to actually do this (the trigger). */
  whenToSwitch: string;
}

export const WA20_CONTINGENCY: readonly ContingencyOption[] = [
  {
    id: 'stevens-pass',
    title: 'Stevens Pass (US-2) detour — west↔east connector',
    tone: 'warn',
    tldr:
      'Drop down through Wenatchee. Adds ~4 hours one-way vs the open-WA-20 version. Plan to do it ONCE on the connector day, not as a daily commute.',
    body: [
      'Route: Marblemount → I-5 south → US-2 east over Stevens Pass → Wenatchee → US-97 north → SR-153 → Twisp → Winthrop. ~285 mi total.',
      'Drive time: ~5.5 hrs in normal traffic vs ~1 hr 45 min via an open WA-20 (Marblemount → Mazama).',
      'Stevens Pass historically always open mid-August. Confirm via WSDOT live page same week.',
      'Gas: fill at Marblemount on the way out (then again Wenatchee). Stevens Pass corridor itself is well-served, US-97 north is fine.',
      'No alternative open road through the park itself. The next federal pass north is Hwy 3 in Canada — not a usable detour.',
    ],
    whenToSwitch:
      'Path B (split: 2 nights west + 2 nights east). Build the day-3 transition around Stevens Pass and pad the schedule for the longer drive.',
  },
  {
    id: 'west-only',
    title: 'West-side-only plan (Path A staying)',
    tone: 'info',
    tldr:
      'Anchor 4 nights west (Marblemount/Rockport). Cascade Pass + Sahale Arm + Newhalem-area + Park Butte + Picture Lake (Mt. Baker corridor). Lose Maple Pass + Methow Valley.',
    body: [
      'Cascade River Rd to Cascade Pass TH uses a separate access from Marblemount — no WA-20 mid-corridor required. NPS reopens it late June / early July most years; confirm before the trip.',
      'Mt. Baker corridor (WA-542): Heliotrope Ridge, Picture Lake, Bagley Lakes, Artist Point. Day-trips out of Marblemount add ~2 hr each way but the destinations are world-class.',
      'Park Butte (via Baker Lake Rd, off WA-20 west of closure) reachable from the west.',
      'What you lose: Maple Pass, Cutthroat Pass, Methow Valley charm (Winthrop), Diablo Lake direct view (the iconic overlook is mid-corridor).',
    ],
    whenToSwitch:
      'Path A locked: WA-20 still closed by booking week (early July) OR fire/smoke flares Aug 1-15 and the east side is the smoke-pocket that day.',
  },
  {
    id: 'east-only',
    title: 'East-side-only plan (Path C staying)',
    tone: 'info',
    tldr:
      'Anchor 4 nights east (Winthrop/Mazama). Maple Pass + Cutthroat + Blue Lake + Sun Mountain + Patterson Lake + Methow towns. Lose Cascade Pass + Diablo / Ross.',
    body: [
      'Fly into Pangborn (Wenatchee, EAT) instead of SEA — drive ~2 hrs to Winthrop. OR fly SEA + drive via Stevens Pass (~5.5 hrs) once on arrival day.',
      'Maple Pass / Cutthroat Pass / Blue Lake / Cedar Creek / Rainy Lake all reachable from the east base (assuming WSDOT extends east-section to MP 158+).',
      'Sun Mountain Trails (Patterson Lake) + Pearrygin Lake swim + Methow River tube fill the non-hike days.',
      'What you lose: Cascade Pass area (the marquee west-side hike), Diablo Lake views, Ross Lake water-taxi, Newhalem/Trail of the Cedars stops.',
    ],
    whenToSwitch:
      'Path C locked: WA-20 still closed by booking week AND Cascade River Rd is still gated (some years it stays closed into July).',
  },
];

// ====================================================================
// HISTORY TIMELINE
// ====================================================================

export interface TimelineEvent {
  /** Date label as it should display. */
  date: string;
  /** Plain ISO for sort + accessibility. */
  iso: string;
  /** Headline event. */
  headline: string;
  /** One-paragraph context. */
  body: string;
  /** Tone marker for the dot color. */
  tone: 'bad' | 'warn' | 'info' | 'good';
}

export const WA20_TIMELINE: readonly TimelineEvent[] = [
  {
    date: 'Dec 2025',
    iso: '2025-12-15',
    headline: 'Atmospheric-river washouts (MP 142-148)',
    body:
      'A series of atmospheric-river storms wiped out 1,000+ feet of pavement between MP 142 and MP 148. Damage assessed as more severe than any single weather event since WSDOT began tracking in 1972.',
    tone: 'bad',
  },
  {
    date: 'Mar 2026',
    iso: '2026-03-15',
    headline: 'Rockslide at MP 131 (~4,000 cu yd)',
    body:
      'A second blow: a large rockslide deposited roughly 4,000 cubic yards of debris on the highway near Colonial Creek, compounding the December damage. WSDOT confirmed the corridor would not reopen for Memorial Day.',
    tone: 'bad',
  },
  {
    date: 'Apr 30, 2026',
    iso: '2026-04-30',
    headline: 'East section reopens to Porcupine Creek (MP 156.8)',
    body:
      'WSDOT reopened the east portion of WA-20 as far as Porcupine Creek turnaround, restoring access from Mazama side up to the closure boundary. The 26-mile mid-corridor (MP 130 → MP 156) remained closed.',
    tone: 'info',
  },
  {
    date: 'May 5, 2026',
    iso: '2026-05-05',
    headline: 'First emergency contract starts (slope stabilization, MP 131)',
    body:
      'WSDOT activated its first emergency contract: slope stabilization and debris removal at the MP 131 rockslide site. Work expected to take weeks given terrain.',
    tone: 'warn',
  },
  {
    date: 'May 13, 2026',
    iso: '2026-05-13',
    headline: 'Second emergency contract starts (washout repairs)',
    body:
      'A second emergency contract activated, focused on the December washout zone between MP 142 and MP 148. Both contracts run in parallel.',
    tone: 'warn',
  },
  {
    date: 'May 17, 2026',
    iso: '2026-05-17',
    headline: 'Status today — still closed; July 4 target holds',
    body:
      'No reopen date confirmed beyond WSDOT\'s working July 4 target ("a goal, not a promise"). Re-check WSDOT live page weekly through June. NPS road-conditions page still reads older April/May framing — it has not been re-updated since May 6.',
    tone: 'warn',
  },
];

// ====================================================================
// PAGE-LEVEL METADATA
// ====================================================================

export const WA20_PAGE_META = {
  /** Short page lede shown under the title in the image hero. */
  lede:
    'The deep dive behind the home-page banner. Sources, phone numbers, affected destinations, contingency routing, and history — everything you\'d want before locking the week or hitting the road.',
  /** Researched on — feeds the section-sources strip. */
  asOf: 'May 17, 2026',
} as const;
