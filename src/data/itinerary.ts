/**
 * Itinerary — five-day shape, not a prescription.
 *
 * Tone: peer-collaborator. No badges shouting "POSTCARD DAY" / "MUST-DO".
 * Each day is a shape (anchor + options), not a step-by-step script. Meals
 * mention kosher only where it's helpful context, never as the framing.
 */

export interface ItineraryStop {
  step: string;
  detail: string;
  time?: string;
}

export interface ItineraryDay {
  day: number;
  date: string;
  title: string;
  /** Short framing line (1 sentence) shown on the collapsed summary. */
  shape: string;
  stops: ItineraryStop[];
  meals: { lunch?: string; dinner?: string; breakfast?: string };
}

export const ITINERARY: ItineraryDay[] = [
  {
    day: 1,
    date: 'Sun Aug 16',
    title: 'Arrive SEA, drive to the booked house',
    shape: 'Land SEA late morning, drive I-5 N to the Sedro-Woolley / Arlington house, easy evening.',
    stops: [
      { step: 'Land SEA (UA1330)', detail: 'EWR→SEA nonstop, lands 11:03 AM. Rental car pickup at SEA — Enterprise / Hertz / Budget / Alamo all on-site.' },
      {
        step: 'Drive SEA → booked house (Sedro-Woolley / Arlington)',
        detail:
          '~75-80 mi up I-5 N · ~1 hr 30 min to Sedro-Woolley (Arlington is ~20 min closer). Stock kosher-friendly packaged groceries at a Seattle / Everett Trader Joe\'s, QFC, or Whole Foods on the way out. [drive-time TBD — re-verify exact figure from the confirmed address, 27024 Minkler Rd.]',
        time: '~1 hr 30 min',
      },
      {
        step: 'Check in',
        detail:
          'The booked house (see Lodging — Arlington or Sedro-Woolley Lakeside Cabin, primary still to confirm).',
      },
      {
        step: 'Evening orientation (easy)',
        detail:
          'Optional: the house is ~40 min west of the Marblemount cluster, so the Newhalem / Ladder Creek Falls orientation drive is now ~1 hr+ each way — better saved for a hike day than Day-1 evening. Easy unwind at the house instead.',
      },
    ],
    meals: {
      dinner:
        'Cabin dinner. Stock up on packaged groceries (hechsher-certified) at any major supermarket on the way in — Trader Joe\'s, QFC, Whole Foods, Safeway all work.',
    },
  },
  {
    day: 2,
    date: 'Mon Aug 17',
    title: 'Cascade Pass day',
    shape: 'Drive Cascade River Rd, hike Cascade Pass (moderate) or add the Sahale Arm extension if both feel strong.',
    stops: [
      {
        step: 'Pre-hike fuel',
        detail:
          'Cabin breakfast + packed lunch + 2L water each. No services at the trailhead.',
      },
      {
        step: 'Drive house → Cascade Pass Trailhead',
        detail:
          'From Sedro-Woolley: ~1 hr 15 min to the Marblemount area + ~1 hr up Cascade River Rd (final 13 mi compacted dirt + gravel) = ~2 hr 15 min total each way. Earlier start than the old Marblemount-base plan. [drive-time TBD — re-verify the Cascade River Rd leg from the booked address.]',
        time: '~2 hr 15 min',
      },
      {
        step: 'Hike option — Cascade Pass (moderate)',
        detail: '7.0 mi RT · ~1,800 ft gain · 3.5-4 hrs (WTA stats). Steady climb to a wide alpine pass at 5,400 ft.',
      },
      {
        step: 'Hike option — Sahale Arm add-on (ambitious)',
        detail:
          '12.8 mi RT · ~4,100 ft gain · 7-8 hrs. Long day. With the longer drive from the west-side house, this likely needs a very early start — judge on the morning.',
      },
      { step: 'Drive back to the house', detail: '~2 hr 15 min.', time: '~2 hr 15 min' },
    ],
    meals: {
      dinner: 'Cabin dinner — pasta + sealed sauce is the easy post-hike option.',
    },
  },
  {
    day: 3,
    date: 'Tue Aug 18',
    title: 'Drive day — WA-20 viewpoints, transit east',
    shape: 'Pack up, work the viewpoints west → east along WA-20, settle into the east-side base by evening.',
    stops: [
      { step: 'Pack up, check out', detail: 'Moving lodging to Winthrop / Mazama tonight. Restock packaged kosher goods en route. NOTE: the booked house is reserved all 4 nights (Aug 16–20) — if we stay on the west side the whole trip (single-base / Path A shape), this east-transit day becomes a viewpoint day-trip out-and-back from the west house instead. [structure TBD — depends on the final single-base vs. two-base call.]' },
      { step: 'Gorge Creek Falls', detail: 'MP 123 · pull-out + footbridge · 5 min.' },
      {
        step: 'Diablo Lake Overlook',
        detail: 'MP 132 · turquoise glacier-flour lake from above · 20-30 min.',
      },
      {
        step: 'Thunder Knob Trail (optional moderate hike)',
        detail:
          'Trailhead at Colonial Creek South Campground (MP 130) · 3.6 mi RT · ~635 ft · 1.5-2 hrs.',
      },
      { step: 'Ross Lake Overlook', detail: 'MP 135 · quick pull-off · 5 min.' },
      {
        step: 'Rainy Pass / Rainy Lake (optional)',
        detail: 'MP 158 · paved 1.8 mi RT walk · skip if you\'ll be back here Day 4.',
      },
      {
        step: 'Washington Pass Overlook',
        detail:
          'MP 162 · 400-ft paved trail to Liberty Bell view · 20 min.',
      },
      {
        step: 'Drive to lodging',
        detail: 'Washington Pass → Mazama ~15 min · Mazama → Winthrop ~25 min.',
      },
      { step: 'Check in', detail: 'East-side base — Methow River Lodge, River\'s Edge, Freestone cabins, etc.' },
    ],
    meals: {
      lunch: 'Colonial Creek picnic area is the natural mid-drive stop.',
      dinner:
        'Cabin dinner at the new east-side base. No kosher restaurants in Winthrop / Mazama — see Kosher notes for the supermarket strategy.',
    },
  },
  {
    day: 4,
    date: 'Wed Aug 19',
    title: 'East-side hike day',
    shape: 'Maple Pass Loop is the main option; Blue Lake is the shorter alternate, Cutthroat Pass is the harder one.',
    stops: [
      {
        step: 'Pre-hike fuel',
        detail: 'Cabin breakfast, pack lunch + water.',
      },
      {
        step: 'Drive to Rainy Pass Trailhead',
        detail: 'MP 158 WA-20 · ~30-35 min from Winthrop · ~25 min from Mazama.',
        time: '~30 min',
      },
      {
        step: 'Hike option — Maple Pass Loop (moderate)',
        detail:
          '7.2 mi loop · ~2,020 ft (WTA) · 4-5 hrs. Counterclockwise is easier on the knees.',
      },
      {
        step: 'Shorter option — Blue Lake',
        detail: '4.4 mi RT · ~1,050 ft · 2-3 hrs · easy-moderate. Trailhead MP 161.',
      },
      {
        step: 'Ambitious option — Cutthroat Pass via PCT',
        detail: '10 mi RT · ~2,034 ft · ~5 hrs · harder. Only if Maple Pass feels too short.',
      },
      { step: 'Drive back to Winthrop', detail: '~30 min.', time: '~30 min' },
      {
        step: 'Afternoon — Winthrop',
        detail:
          'Old-west boardwalk on Riverside Ave. Shafer Historical Museum if open. Easy unwind before dinner.',
      },
    ],
    meals: {
      dinner:
        'Cabin dinner — nicer kosher meal cooked at home (sealed-sauce pasta, sealed kosher meats, or Seattle Kosher prepared meals if you stocked up).',
    },
  },
  {
    day: 5,
    date: 'Thu Aug 20',
    title: 'Slow morning, drive to SEA',
    shape: 'Easy morning in the Methow Valley, then the ~4 hr drive to SEA for the evening flight.',
    stops: [
      {
        step: 'Breakfast',
        detail: 'Cabin breakfast or a Winthrop stop on the way out.',
      },
      {
        step: 'Optional easy morning',
        detail:
          'Patterson Lake kayaks (Sun Mountain Lodge marina, 60-90 min) OR Winthrop boardwalk + gifts.',
      },
      {
        step: 'Drive to SEA',
        detail:
          'IF staying east (Winthrop): ~4 hrs via WA-20 → US-97 → I-90, or ~4-4.5 hrs scenic via Stevens Pass (US-2). IF staying west the whole trip (booked-house / single-base shape): only ~1 hr 30 min Sedro-Woolley → SEA, so the day is far more relaxed. [drive-time TBD — depends on the final single-base vs. two-base call.]',
        time: '~1 hr 30 min – 4 hrs',
      },
      {
        step: 'Lunch en route',
        detail: 'If east/scenic: Leavenworth (US-2) or Cle Elum (I-90). If west: an easy Skagit Valley / Seattle stop. See Seattle section for kosher-specific stop info.',
      },
      {
        step: 'Return flight — UA2017 (redeye)',
        detail:
          'Departs SEA 10:58 PM, lands EWR 7:10 AM Fri Aug 21. Thursday is a FULL day in WA — no rush to the airport until the evening. Drive to SEA for the late departure.',
      },
    ],
    meals: {},
  },
];
