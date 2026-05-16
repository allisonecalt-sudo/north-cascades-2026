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
    title: 'Arrive Bellingham, drive in',
    shape: 'Land BLI, drive WA-20 to Marblemount, easy evening orientation.',
    stops: [
      { step: 'Land BLI', detail: 'Afternoon, via SEA layover on Alaska Airlines.' },
      { step: 'Rental car pickup', detail: 'Enterprise / Hertz / Budget / Alamo — all on-site at BLI.' },
      {
        step: 'Drive BLI → Marblemount via WA-20',
        detail: '~85 mi · ~1 hr 45 min',
        time: '~1 hr 45 min',
      },
      {
        step: 'Check in',
        detail:
          'West-side base — see Lodging section for the Terra Nova-tier picks (Rhody House, North Cascades Hideaway, Glacier Peak Resort, etc).',
      },
      {
        step: 'Evening orientation (easy)',
        detail:
          'Newhalem Visitor Center (~25 min east) for a park briefing, then Ladder Creek Falls — short paved 0.5 mi loop behind Gorge Powerhouse, lit dusk-to-11 pm.',
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
        step: 'Drive Marblemount → Cascade Pass Trailhead',
        detail:
          'End of Cascade River Rd · ~23 mi · ~1 hr. First 10 mi paved, final 13 mi compacted dirt + gravel. Any car w/ reasonable clearance is fine — go slow.',
        time: '~1 hr',
      },
      {
        step: 'Hike option — Cascade Pass (moderate)',
        detail: '7.0 mi RT · ~1,800 ft gain · 3.5-4 hrs (WTA stats). Steady climb to a wide alpine pass at 5,400 ft.',
      },
      {
        step: 'Hike option — Sahale Arm add-on (ambitious)',
        detail:
          '12.8 mi RT · ~4,100 ft gain · 7-8 hrs. Long day with significant climb to the glacier camp basin at 7,600 ft. Only if both feel strong on the morning of, with an early start.',
      },
      { step: 'Drive back to Marblemount', detail: '~1 hr.', time: '~1 hr' },
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
      { step: 'Pack up, check out', detail: 'Moving lodging to Winthrop / Mazama tonight.' },
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
        'Either cook at the cabin or eat out in Winthrop — Old Schoolhouse Brewery + Arrowleaf Bistro are the well-reviewed options if eating out works for the night.',
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
        'Arrowleaf Bistro is the nicer Winthrop dinner (book ~2 weeks out). Old Schoolhouse Brewery is the casual brewpub option.',
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
        step: 'Drive Winthrop → SEA',
        detail:
          '~4 hrs via WA-20 east → US-97 south → I-90 west. Or ~4-4.5 hrs scenic via Stevens Pass (US-2). I-90 for time, US-2 for views.',
        time: '~4 hrs',
      },
      {
        step: 'Lunch en route',
        detail: 'Leavenworth (Bavarian village on US-2) or Cle Elum (on I-90). See Seattle section for kosher-specific stop info if useful.',
      },
      { step: 'Arrive SEA', detail: 'Mid-afternoon for the evening flight east.' },
    ],
    meals: {},
  },
];
