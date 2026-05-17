/**
 * Questions for Erin — the open decisions she should weigh in on.
 *
 * The whole site is Allison's research. Erin's voice is mostly absent
 * (the Notes button lets her leave per-section thoughts — this section
 * just centralizes "things to ask her" so she can scan + react).
 */

export interface QuestionForErin {
  id: string;
  question: string;
  context: string;
}

export const QUESTIONS_FOR_ERIN: QuestionForErin[] = [
  {
    id: 'path',
    question: 'Path A, B, or C — which one fits your read?',
    context:
      'A = simplest, one west-side base. B = full park, mid-trip move. C = slow east-side base, skips Cascade Pass. Allison hasn\'t picked — it\'s yours to weigh in on first.',
  },
  {
    id: 'splurge-night',
    question: 'Want to splurge one night on Sun Mountain Lodge or Cascade River House?',
    context:
      'Default is the Terra Nova-tier cabins. A one-night bump to a splurge property is a fine alternative if you want the lodge-view experience for a stretch. Listed under "Splurge options" in Lodging.',
  },
  {
    id: 'flight-time',
    question: 'Morning arrival into SEA or mid-day?',
    context:
      'Morning maximizes Day 1 (cabin by 1-2 PM, easy evening hike). Mid-day means sleeping on the redeye and landing fresher. Allison leans morning but no strong preference. Affects nothing else if WA-20 is open.',
  },
  {
    id: 'hike-difficulty',
    question: 'Cascade Pass (moderate, ~7 mi · 1,800 ft) — yes, swap easier, or skip?',
    context:
      'This is the signature west-side hike. If 1,800 ft of climb feels like a lot, Thunder Knob (easy-mod, 3.6 mi · 635 ft) is the alternative on the same drive day. Affects Path A + B; Path C already skips Cascade Pass.',
  },
  {
    id: 'maple-blue',
    question: 'Maple Pass Loop (7.2 mi · 2,020 ft) vs Blue Lake (4.4 mi · 1,050 ft)?',
    context:
      'Both are east-side, both gorgeous. Decide morning-of based on energy. Just helpful to flag now that the option exists so it\'s not a surprise.',
  },
  {
    id: 'leavenworth',
    question: 'Leavenworth lunch stop on the Day-5 drive back, or skip for I-90 speed?',
    context:
      'US-2 / Stevens Pass scenic route is +30 min over I-90 but includes Leavenworth (Bavarian theme, walkable). Or take I-90 straight to SEA. Affects only Day 5.',
  },
  {
    id: 'site-channel',
    question: 'How do you want to use this site — Google Doc, notes here, or both?',
    context:
      "Allison's been building this as a comparison-pitch you can react to. The 💬 buttons let you leave notes inline (Allison sees them next time she opens the site). But your Google Doc is also still the working plan — totally fine to keep editing there + just text/email Allison. Or both. Whichever's easier for you. Leave a note or text Allison the answer to this one.",
  },
  {
    id: 'rest-day',
    question: 'Path C Day 4 — kayaks, paved Rainy Lake walk, or just porch + boardwalk?',
    context:
      'No big hike that day. Three flavors: active (Patterson Lake kayaks), gentle (paved 1.8 mi at Rainy Lake), or do-nothing (Winthrop wander + porch). Decide morning-of.',
  },
  {
    id: 'kosher-stock',
    question: 'Do you want to stock up at Seattle Kosher (online) before the trip, or just supermarket on the way?',
    context:
      'Seattle Kosher delivers / has pickup with Va\'ad-certified prepared meals. Useful if a nicer cabin dinner sounds good one night. Otherwise standard supermarket packaged goods cover everything.',
  },
];
