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
  // ──────────────────────────────────────────────────────────────
  {
    id: 'path',
    priority: 'must',
    question: 'Path A, B, or C — which one fits your read?',
    context:
      "A = simplest, one west-side base. B = full park, mid-trip move. C = slow east-side base, skips Cascade Pass. We haven't picked — it's yours to weigh in on first. (See the path picker on the home page + the How to do this trip page for the full breakdown.)",
  },
  {
    id: 'hike-ceiling',
    priority: 'must',
    question: 'What\'s your hike ceiling — what feels GOOD and what feels TOO MUCH?',
    context:
      "Tell me your real comfort zone, not what you think you should say. Examples to react to: Thunder Knob (3.6 mi · 635 ft) easy · Blue Lake (4.4 mi · 1,050 ft) moderate · Maple Pass Loop (7.2 mi · 2,020 ft) hard but stunning · Cascade Pass (7 mi · 1,800 ft) signature but climby · Sahale Arm (12 mi · 4,000 ft) full-day-killer. Where do you tap out? Where do you say \"absolutely\"?",
  },
  {
    id: 'site-channel',
    priority: 'must',
    question: 'How do you want to use this site — Google Doc, notes here, or both?',
    context:
      "Allison built this as a comparison-pitch you can react to. The 💬 buttons let you leave notes inline (Allison sees them next time she opens the site). But your Google Doc is also still the working plan — totally fine to keep editing there + just text/email Allison. Whichever's easier. Tell us so the site stops guessing.",
  },
  {
    id: 'wants-overall',
    priority: 'must',
    question: 'What do you actually want from this trip?',
    context:
      "Open-ended on purpose. Examples: \"recharge\" / \"big views\" / \"sleep in late\" / \"earn the dinner\" / \"see one thing I'll never forget\" / \"slow & cozy\" / \"hike-heavy\" / \"photo-heavy\" / \"talk about life by the fire\" / \"low-stakes, no FOMO.\" Whatever orients the trip in your head — Allison wants to know.",
  },
  {
    id: 'must-skip-or-must-do',
    priority: 'must',
    question: 'Anything that\'s a HARD YES or HARD NO?',
    context:
      "Hard yes = the one thing you'd be sad to miss. Hard no = the thing that's a dealbreaker (e.g. \"no 4 AM starts,\" \"no all-day driving,\" \"no caves,\" \"no exposed ridges\"). Either kind helps Allison plan the right shape.",
  },

  // ──────────────────────────────────────────────────────────────
  // SHAPE — pace + intensity + day-type
  // ──────────────────────────────────────────────────────────────
  {
    id: 'pace',
    priority: 'shape',
    question: 'Early-start mornings or slow mornings + later afternoons?',
    context:
      "Early start (6-7 AM out the door) gets the empty trailhead + best alpenglow but kills you by 4 PM. Slow morning (9-10 AM out) is more vacation-feeling but the popular trailheads can be full. Pick a default — we can flex per day.",
  },
  {
    id: 'rest-day-want',
    priority: 'shape',
    question: 'Want at least one full rest day?',
    context:
      "Path C Day 4 already has a built-in slow day (porch + Winthrop). For Paths A + B, do you want me to BAKE IN a rest day too, or are you up for active every day with the option to bail morning-of?",
  },
  {
    id: 'town-day',
    priority: 'shape',
    question: 'Town day in Winthrop or Mazama — yes please, or skip?',
    context:
      "Both are walkable. Winthrop has the Old-West boardwalk + a few shops. Mazama is tiny + scenic (one general store, one bakery). Most paths can fit a half-day; full town day means one less hike. Your call.",
  },
  {
    id: 'swim',
    priority: 'shape',
    question: 'Want a swim day at Pearrygin Lake?',
    context:
      "Pearrygin (east, 5 min from Winthrop) is the warm-water swim story for mid-August. Sandy beach, $10 day-use. Most NC lakes are glacier-cold (no swim). If you want a real swim afternoon, we'd build in 2-3 hrs there. Hard pass = totally fine, we just hike.",
  },
  {
    id: 'maple-blue',
    priority: 'shape',
    question: 'Maple Pass Loop (7.2 mi · 2,020 ft) vs Blue Lake (4.4 mi · 1,050 ft)?',
    context:
      "Both are east-side, both gorgeous. Maple Pass is the harder/longer wow; Blue Lake is the shorter alpine-lake postcard. Decide morning-of based on energy — just flagging so it's not a surprise. (Falls under your hike-ceiling answer above.)",
  },

  // ──────────────────────────────────────────────────────────────
  // NICE-TO-HAVE — per-day swaps + treats
  // ──────────────────────────────────────────────────────────────
  {
    id: 'splurge-night',
    priority: 'nice',
    question: 'Want to splurge one night on Sun Mountain Lodge or Cascade River House?',
    context:
      'Default is the Terra Nova-tier cabins ($200-300/night). A one-night bump to a splurge property is a fine alternative if you want the lodge-view experience for a stretch. Listed under "Splurge options" in Lodging.',
  },
  {
    id: 'flight-time',
    priority: 'nice',
    question: 'Morning arrival into SEA or mid-day?',
    context:
      'Morning maximizes Day 1 (cabin by 1-2 PM, easy evening hike). Mid-day means sleeping on the redeye and landing fresher. Allison leans morning but no strong preference. Affects nothing else if WA-20 is open.',
  },
  {
    id: 'leavenworth',
    priority: 'nice',
    question: 'Leavenworth lunch stop on the Day-5 drive back, or skip for I-90 speed?',
    context:
      'US-2 / Stevens Pass scenic route is +30 min over I-90 but includes Leavenworth (Bavarian theme, walkable). Or take I-90 straight to SEA. Affects only Day 5.',
  },
  {
    id: 'kosher-stock',
    priority: 'nice',
    question: 'Stock up at Seattle Kosher (online) before the trip, or just supermarket on the way?',
    context:
      "Seattle Kosher delivers / has pickup with Va'ad-certified prepared meals. Useful if a nicer cabin dinner sounds good one night. Otherwise standard supermarket packaged goods cover everything.",
  },
];
