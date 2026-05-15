export interface ItineraryStop {
  step: string;
  detail: string;
  time?: string;
}

export interface ItineraryDay {
  day: number;
  date: string;
  title: string;
  subtitle?: string;
  badge?: string;
  stops: ItineraryStop[];
  meals: { lunch?: string; dinner?: string; breakfast?: string };
}

export const ITINERARY: ItineraryDay[] = [
  {
    day: 1,
    date: 'Sun Aug 16',
    title: 'Arrive Bellingham, drive in',
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
        detail: 'Skagit River Resort · Glacier Peak Resort · or Buffalo Run Inn (TBD).',
      },
      {
        step: 'Evening orientation',
        detail:
          'Newhalem Visitor Center (~25 min east) for park briefing, then Ladder Creek Falls — short paved 0.5 mi loop behind Gorge Powerhouse, lit dusk-to-11 pm.',
      },
    ],
    meals: {
      lunch:
        'Eat from the QFC Mercer Island / Trader Joe\'s kosher haul you stocked in Seattle/Bellingham (corridor towns have no kosher).',
      dinner:
        'Cook in the cabin (kitchen pick: Skagit River Resort or Rhody House). Sealed kosher meat + Va\'ad deli from QFC Mercer Island.',
    },
  },
  {
    day: 2,
    date: 'Mon Aug 17',
    title: 'Cascade Pass / Sahale Arm',
    badge: 'POSTCARD DAY',
    stops: [
      {
        step: 'Pre-hike fuel',
        detail:
          'Cabin breakfast (cereal + sealed kosher dairy from your TJ\'s haul). Pack a kosher sandwich + 2L water each — Marblemount Country Store is not kosher, only useful for sealed bottled water/whole fruit.',
      },
      {
        step: 'Drive Marblemount → Cascade Pass Trailhead',
        detail:
          'End of Cascade River Rd · ~23 mi · ~1 hr. First 10 mi paved, final 13 mi compacted dirt + gravel. Any car w/ reasonable clearance is fine — go slow.',
        time: '~1 hr',
      },
      {
        step: 'Hike Cascade Pass (Option A)',
        detail: '7.4 mi RT · ~1,700 ft gain · 3.5-4 hrs · moderate. Switchbacks up to alpine pass at 5,400 ft.',
      },
      {
        step: 'Hike Cascade Pass + Sahale Arm (Option B)',
        detail:
          '12.8 mi RT · ~4,100 ft gain · 7-8 hrs · strenuous. The postcard view of the whole park at 7,600 ft. Only if both feel strong.',
      },
      { step: 'Drive back to Marblemount', detail: '~1 hr.', time: '~1 hr' },
    ],
    meals: {
      dinner: 'Cook in the cabin. Post-hike kosher pasta + sealed sauce + pre-grilled chicken from your QFC haul travels well.',
    },
  },
  {
    day: 3,
    date: 'Tue Aug 18',
    title: 'WA-20 viewpoints + transit east',
    badge: 'DRIVE DAY',
    stops: [
      { step: 'Pack up, check out', detail: 'Moving lodging to Winthrop/Mazama tonight.' },
      { step: 'Gorge Creek Falls', detail: 'MP 123 · pull-out + footbridge · 5 min.' },
      {
        step: 'Diablo Lake Overlook',
        detail: 'MP 132 · POSTCARD · glacier-flour turquoise lake · 20-30 min.',
      },
      {
        step: 'Thunder Knob Trail',
        detail:
          'Trailhead at Colonial Creek South Campground (MP 130) · 3.6 mi RT · ~635 ft gain · easy-moderate · 1.5-2 hrs.',
      },
      { step: 'Ross Lake Overlook', detail: 'MP 135 · quick pull-off · 5 min.' },
      {
        step: 'Rainy Pass / Rainy Lake (optional)',
        detail: 'MP 158 · paved 1.8 mi RT walk · skip if back here Day 4.',
      },
      {
        step: 'Washington Pass Overlook',
        detail:
          'MP 162 · POSTCARD · 400-ft paved trail to Liberty Bell + Early Winters Spires view · 20 min.',
      },
      {
        step: 'Drive to lodging',
        detail: 'Washington Pass → Mazama ~15 min · Mazama → Winthrop ~25 min.',
      },
      { step: 'Check in', detail: 'Freestone Inn · Sun Mountain · or Methow River Lodge.' },
    ],
    meals: {
      lunch: 'Colonial Creek picnic area (post-hike) — bring kosher sandwiches from the cabin.',
      dinner:
        'Cook at the east-side cabin (Freestone cabin, River\'s Edge chalet, or Spring Creek Ranch — all have full kitchens). Winthrop restaurants are not kosher.',
    },
  },
  {
    day: 4,
    date: 'Wed Aug 19',
    title: 'Maple Pass Loop',
    badge: 'EAST-SIDE CLASSIC',
    stops: [
      {
        step: 'Pre-hike fuel',
        detail:
          'Cabin breakfast — Rocking Horse Bakery in Winthrop is not kosher. Brew your own and pack sealed kosher pastries from the Trader Joe\'s/QFC haul.',
      },
      {
        step: 'Drive to Rainy Pass Trailhead',
        detail: 'MP 158 WA-20 · ~30-35 min from Winthrop · ~25 min from Mazama.',
        time: '~30 min',
      },
      {
        step: 'Maple Pass Loop (recommended)',
        detail:
          '7.2 mi loop · ~2,200 ft gain · 4-5 hrs · moderate. Counterclockwise = steeper up, gentler down. Optional 1-mi spur to Lake Ann.',
      },
      {
        step: 'Easier alt — Blue Lake',
        detail: '4.4 mi RT · ~1,050 ft gain · 2-3 hrs · easy-moderate. Trailhead MP 161.',
      },
      {
        step: 'Longer alt — Cutthroat Pass via PCT',
        detail: '10 mi RT · ~2,034 ft gain · 5 hrs · harder. Trailhead MP 158.',
      },
      { step: 'Drive back to Winthrop', detail: '~30 min.', time: '~30 min' },
      {
        step: 'Winthrop walkabout',
        detail:
          'Old-west boardwalk on Riverside Ave. Shafer Historical Museum if open. (Sheri\'s Sweet Shoppe + town restaurants are not kosher — sightseeing only.)',
      },
    ],
    meals: {
      dinner: 'Cook in the cabin — kosher pasta night with the salad you picked up at QFC.',
    },
  },
  {
    day: 5,
    date: 'Thu Aug 20',
    title: 'Slow morning, drive to SEA',
    stops: [
      {
        step: 'Breakfast',
        detail:
          'Cabin breakfast from your kosher stock — last morning to use what\'s left. Pack a sandwich + bars for the drive.',
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
        step: 'Kosher lunch in Seattle',
        detail:
          'Stop at QFC Mercer Island (Va\'ad kosher deli, 7823 SE 28th St) for a real sit-down kosher lunch before SEA. (Leavenworth / Cle Elum have no kosher — sandwich-from-cooler only if you stop there.)',
      },
      { step: 'Arrive SEA', detail: 'Mid-afternoon for evening flight east.' },
    ],
    meals: {},
  },
];
