/**
 * Questions for Erin — what's STILL MISSING from her input before the trip locks.
 *
 * Reordered + expanded 2026-05-17 (PM, per Allison "ask Erin her hike ceiling,
 * what she wants … make it clear what's missing"):
 *   - Section 1 (must-have): the inputs the trip literally can't proceed without
 *   - Section 2 (shape): pace, intensity, day-type preferences
 *   - Section 3 (nice-to-have): per-day swaps + treats
 *
 * The whole site is Allison's research. Erin's voice is mostly absent. The 💬
 * buttons let her leave per-section notes; this page centralizes the
 * specific asks so she can scan + react.
 */

export type QuestionPriority = 'must' | 'shape' | 'nice';

export interface QuestionForErin {
  id: string;
  priority: QuestionPriority;
  question: string;
  context: string;
}

export const QUESTIONS_FOR_ERIN: QuestionForErin[] = [
  // ──────────────────────────────────────────────────────────────
  // MUST-HAVE — needed before the trip locks
  //
  // 2026-05-19 PM needs-match audit: removed `path` + `site-channel` +
  // `flight-time` questions. Path B (with A fallback) is LOCKED per
  // home-page conversation state strip (Erin's May 18 4:57am call).
  // Channel is covered in the welcome popup. Flight-time decision now
  // sits inside Erin's flight-research-tonight loop. Re-asking decided
  // things violates the "decisions reflected, not re-asked" rule.
  // ──────────────────────────────────────────────────────────────
  {
    id: 'hike-ceiling',
    priority: 'must',
    question: 'What\'s the hike ceiling — what feels GOOD and what feels TOO MUCH?',
    context:
      "React to these: Thunder Knob (3.6 mi · 635 ft) easy · Blue Lake (4.4 mi · 1,050 ft) moderate · Maple Pass Loop (7.2 mi · 2,020 ft) hard but stunning · Cascade Pass (7 mi · 1,800 ft) signature but climby · Sahale Arm (12 mi · 4,000 ft) full-day-killer. Where do you tap out? Where's it an \"absolutely\"?",
  },
  {
    id: 'wants-overall',
    priority: 'must',
    question: 'What does Erin actually want from this trip?',
    context:
      "Pick what fits: recharge / big views / sleep in late / earn the dinner / one unforgettable thing / slow & cozy / hike-heavy / photo-heavy / talk by the fire / low-stakes, no FOMO.",
  },
  {
    id: 'must-skip-or-must-do',
    priority: 'must',
    question: 'Anything that\'s a HARD YES or HARD NO?',
    context:
      "Hard yes = the one thing you'd be sad to miss. Hard no = the dealbreaker (no 4 AM starts, no all-day driving, no exposed ridges).",
  },

  // ──────────────────────────────────────────────────────────────
  // SHAPE — pace + intensity + day-type
  // ──────────────────────────────────────────────────────────────
  {
    id: 'pace',
    priority: 'shape',
    question: 'Early-start mornings or slow mornings + later afternoons?',
    context:
      "Early (6-7 AM out): empty trailhead + alpenglow, done by 4 PM. Slow (9-10 AM out): more vacation-feeling, trailheads can fill. Pick a default — flexes per day.",
  },
  {
    id: 'rest-day-want',
    priority: 'shape',
    question: 'Want at least one full rest day?',
    context:
      'Bake in a rest day, or active every day with the option to bail morning-of?',
  },
  {
    id: 'town-day',
    priority: 'shape',
    question: 'Town day in Winthrop or Mazama — yes please, or skip?',
    context:
      'Winthrop = Old-West boardwalk + shops. Mazama = tiny + scenic. Half-day fits most paths; a full town day = one less hike.',
  },
  {
    id: 'swim',
    priority: 'shape',
    question: 'Want a swim day at Pearrygin Lake?',
    context:
      "Pearrygin (5 min from Winthrop) is the one warm-water swim — sandy beach, $10 day-use. Most NC lakes are glacier-cold. Want it? Allison builds in 2-3 hrs.",
  },
  {
    id: 'maple-blue',
    priority: 'shape',
    question: 'Maple Pass Loop (7.2 mi · 2,020 ft) vs Blue Lake (4.4 mi · 1,050 ft)?',
    context:
      'Both east-side. Maple Pass = harder/longer wow; Blue Lake = shorter alpine-lake postcard. Decide morning-of by energy.',
  },

  // ──────────────────────────────────────────────────────────────
  // NICE-TO-HAVE — per-day swaps + treats
  // ──────────────────────────────────────────────────────────────
  {
    id: 'which-booked-house',
    priority: 'nice',
    question: 'Which of the three booked houses do we keep?',
    context:
      'Three houses held for the same dates (Arlington + two Sedro-Woolley). Pick one, cancel two before the free-cancel windows close.',
  },
  // `flight-time` removed 2026-05-19 PM needs-match audit — Erin's actively
  // researching the exact United fare tonight per home-page open-loop, so the
  // arrival-time slice will be answered as part of that booking. Surfacing
  // it as a separate question created duplicate-state confusion.
  {
    id: 'leavenworth',
    priority: 'nice',
    question: 'Leavenworth lunch stop on the Day-5 drive back, or skip for I-90 speed?',
    context:
      'US-2 / Stevens Pass is +30 min over I-90 but adds Leavenworth (Bavarian, walkable). Affects only Day 5.',
  },
  {
    id: 'kosher-stock',
    priority: 'nice',
    question: 'Stock up at Seattle Kosher (online) before the trip, or just supermarket on the way?',
    context:
      "Seattle Kosher = Va'ad-certified prepared meals (delivery/pickup) for a nicer cabin dinner. Otherwise supermarket packaged goods.",
  },
];
