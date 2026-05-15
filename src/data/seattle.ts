/**
 * Seattle add-on data.
 *
 * Why this section exists:
 *   The current flight plan flows through SEA both directions. Day 5 (Thu Aug 20)
 *   has a 4-hr morning drive Winthrop → SEA and then 4-8 hours of dead time before
 *   evening flights east. A small Seattle stop is the natural fit. This section
 *   also covers a pre-trip overnight (land Saturday) and a longer add-on scenario.
 *
 * Photo licensing: all images verified via the Commons API on May 15 2026.
 *   URL pattern is the API-returned 960px-prefixed thumb (the path token is just
 *   Wikimedia's bucket label; rendered width comes from CSS). All photos have
 *   permissive CC licenses + attribution shown in the figcaption.
 */

export interface SeattlePhoto {
  src: string;
  alt: string;
  credit?: string;
  creditUrl?: string;
  width: number;
  height: number;
}

export type SeattleCategory = 'iconic' | 'outdoorsy' | 'food' | 'lodging';

export interface SeattleStop {
  id: string;
  name: string;
  category: SeattleCategory;
  address: string;
  why: string;
  timeNeeded: string;
  /** Optional parking / cost / hours note. */
  practical?: string;
  photo: SeattlePhoto;
}

export interface SeattleItinerary {
  id: string;
  label: string;
  scenario: string;
  steps: string[];
  recommended?: boolean;
}

export interface SeattleLogisticsRow {
  topic: string;
  detail: string;
}

export const CATEGORY_LABELS: Record<SeattleCategory, string> = {
  iconic: 'Iconic walkables',
  outdoorsy: 'Outdoorsy + photogenic',
  food: 'Real food',
  lodging: 'Lodging',
};

export const SEATTLE_STOPS: SeattleStop[] = [
  // ---------- Iconic walkables ----------
  {
    id: 'pike-place',
    name: 'Pike Place Market',
    category: 'iconic',
    address: '85 Pike St, Seattle, WA 98101',
    why: 'The market arcade + flying-fish stalls + the original Starbucks + waterfront just below. Walk it in 45 min; longer if you stop to eat.',
    timeNeeded: '1-2 hours',
    practical:
      'Pike Place Market Garage: 1531 Western Ave. ~$8/hr, $30 daily max. Validated by some market vendors.',
    photo: {
      src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Pike_Place_Market_Seattle.jpg/960px-Pike_Place_Market_Seattle.jpg',
      alt: 'Pike Place Public Market entrance with the famous red neon sign and clock.',
      credit: 'Photo: Daniel Schwen · CC BY-SA 4.0 (Wikimedia)',
      creditUrl: 'https://commons.wikimedia.org/wiki/File:Pike_Place_Market_Seattle.jpg',
      width: 800,
      height: 551,
    },
  },
  {
    id: 'kerry-park',
    name: 'Kerry Park viewpoint',
    category: 'iconic',
    address: '211 W Highland Dr, Seattle, WA 98119',
    why: 'The Seattle skyline postcard — Space Needle framed against Mt Rainier on a clear day. Tiny park, all about the view. Best near sunset.',
    timeNeeded: '20-30 min',
    practical: 'Free street parking on W Highland Dr; usually a few spots open. No facilities.',
    photo: {
      src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Seattle_skyline_from_Kerry_Park%2C_March_2019.jpg/960px-Seattle_skyline_from_Kerry_Park%2C_March_2019.jpg',
      alt: 'Seattle skyline panorama from Kerry Park with the Space Needle and Mount Rainier behind.',
      credit: 'Photo: SounderBruce · CC BY-SA 4.0 (Wikimedia)',
      creditUrl:
        'https://commons.wikimedia.org/wiki/File:Seattle_skyline_from_Kerry_Park,_March_2019.jpg',
      width: 800,
      height: 228,
    },
  },
  {
    id: 'pioneer-square',
    name: 'Pioneer Square',
    category: 'iconic',
    address: 'Pioneer Square Historic District, Seattle, WA',
    why: "Seattle's oldest neighborhood — red-brick blocks, Smith Tower, Occidental Square, art galleries, bookstores. Walkable cluster, quieter than Pike Place.",
    timeNeeded: '45-60 min',
    practical: 'Diamond garage at 1st & James (~$6-10/hr) or street meters.',
    photo: {
      src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Seattle_-_Pioneer_Square_Pergola_-_2020-04-24.jpg/960px-Seattle_-_Pioneer_Square_Pergola_-_2020-04-24.jpg',
      alt: 'Iron-and-glass Pioneer Square pergola in front of historic brick buildings.',
      credit: 'Photo: Joe Mabel · CC BY-SA 4.0 (Wikimedia)',
      creditUrl:
        'https://commons.wikimedia.org/wiki/File:Seattle_-_Pioneer_Square_Pergola_-_2020-04-24.jpg',
      width: 800,
      height: 533,
    },
  },
  {
    id: 'olympic-sculpture',
    name: 'Olympic Sculpture Park',
    category: 'iconic',
    address: '2901 Western Ave, Seattle, WA 98121',
    why: 'Free outdoor sculpture park on the waterfront — 9 acres of large-scale art, Puget Sound views, Mt Rainier on clear days. Easy walk from Pike Place along the new Overlook Walk.',
    timeNeeded: '30-45 min',
    practical: 'Free entry, open daily sunrise-sunset. Small paid lot on site (~$6/hr).',
    photo: {
      src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Seattle_%28WA%2C_USA%29%2C_Olympic_Sculpture_Park%2C_Hartriegel_--_2022_--_1615.jpg/960px-Seattle_%28WA%2C_USA%29%2C_Olympic_Sculpture_Park%2C_Hartriegel_--_2022_--_1615.jpg',
      alt: 'View through Olympic Sculpture Park trees with the waterfront beyond.',
      credit: 'Photo: Dietmar Rabich · CC BY-SA 4.0 (Wikimedia)',
      creditUrl:
        'https://commons.wikimedia.org/wiki/File:Seattle_(WA,_USA),_Olympic_Sculpture_Park,_Hartriegel_--_2022_--_1615.jpg',
      width: 800,
      height: 600,
    },
  },

  // ---------- Outdoorsy + photogenic ----------
  {
    id: 'snoqualmie-falls',
    name: 'Snoqualmie Falls',
    category: 'outdoorsy',
    address: '6501 Railroad Ave SE, Snoqualmie, WA 98065',
    why: '270-foot waterfall ~30 min east of SEA on I-90 — basically on the return route if you come back via Stevens Pass or I-90. Upper viewpoint is paved + 5-min walk from parking; longer trail descends to the river.',
    timeNeeded: '30-60 min',
    practical:
      'Free parking at the upper lot. Two viewpoints — upper deck (accessible) and a 1.4-mi round-trip trail to the lower viewing area.',
    photo: {
      src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Snoqualmie_Falls_Washington.jpg/960px-Snoqualmie_Falls_Washington.jpg',
      alt: 'Snoqualmie Falls cascading down a forested cliff in a wide misty plunge.',
      credit: 'Photo: Kpsudeep · CC BY-SA 4.0 (Wikimedia)',
      creditUrl: 'https://commons.wikimedia.org/wiki/File:Snoqualmie_Falls_Washington.jpg',
      width: 800,
      height: 542,
    },
  },
  {
    id: 'discovery-park',
    name: 'Discovery Park',
    category: 'outdoorsy',
    address: '3801 Discovery Park Blvd, Seattle, WA 98199',
    why: "Seattle's largest park — 534 acres of forest, meadow, and sea bluffs in Magnolia. West Point Lighthouse trail (2.8 mi round-trip) drops to the beach. Mt Rainier + Olympics across the Sound.",
    timeNeeded: '1-2 hours',
    practical:
      'Free parking at the East / South / North lots. Open daily 4am-11:30pm. After a hiking trip the beach loop is gentle.',
    photo: {
      src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Seattle_Discovery_Park_Lighthouse_%2851521932685%29.jpg/960px-Seattle_Discovery_Park_Lighthouse_%2851521932685%29.jpg',
      alt: 'West Point Lighthouse at Discovery Park with Puget Sound and distant peaks.',
      credit: 'Photo: Seattle City Council · CC BY 2.0 (Wikimedia)',
      creditUrl:
        'https://commons.wikimedia.org/wiki/File:Seattle_Discovery_Park_Lighthouse_(51521932685).jpg',
      width: 800,
      height: 535,
    },
  },
  {
    id: 'bainbridge-ferry',
    name: 'Bainbridge Island ferry',
    category: 'outdoorsy',
    address: 'Colman Dock, 801 Alaskan Way, Seattle, WA 98104',
    why: 'A 35-min ferry across Puget Sound IS the experience — open-air deck, the skyline shrinking behind you, mountains all around. Walk on (no car) for ~$10 round trip. Bainbridge town is a short stroll from the terminal — coffee, lunch, bookstore.',
    timeNeeded: '2.5-3 hours round trip with a Bainbridge stop',
    practical:
      'Pier 50 garage or Pioneer Square garages within a 5-min walk. Walk-on tickets only charged westbound (~$10); eastbound is free.',
    photo: {
      src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Washington_State_Ferry_leaving_for_Bainbridge_Islandfor_Bain_%2852230622298%29.jpg/960px-Washington_State_Ferry_leaving_for_Bainbridge_Islandfor_Bain_%2852230622298%29.jpg',
      alt: 'Washington State Ferry pulling away from Colman Dock toward Bainbridge Island.',
      credit: 'Photo: Han Zheng · CC BY-SA 2.0 (Wikimedia)',
      creditUrl:
        'https://commons.wikimedia.org/wiki/File:Washington_State_Ferry_leaving_for_Bainbridge_Islandfor_Bain_(52230622298).jpg',
      width: 800,
      height: 533,
    },
  },
  {
    id: 'arboretum',
    name: 'Washington Park Arboretum',
    category: 'outdoorsy',
    address: '2300 Arboretum Dr E, Seattle, WA 98112',
    why: '230 acres of curated landscape between Lake Washington and the University. Quiet, leafy, photogenic — Japanese Garden inside for an extra $10. Lower-key option if Discovery Park is too far from your route.',
    timeNeeded: '45-90 min',
    practical:
      'Free parking + free admission to the main arboretum. Japanese Garden is ticketed.',
    photo: {
      src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Washington_Park_Arboretum%2C_Seattle%2C_August_2024.jpg/960px-Washington_Park_Arboretum%2C_Seattle%2C_August_2024.jpg',
      alt: 'Late-summer trail through the Washington Park Arboretum with tall trees on both sides.',
      credit: 'Photo: Another Believer · CC BY-SA 4.0 (Wikimedia)',
      creditUrl:
        'https://commons.wikimedia.org/wiki/File:Washington_Park_Arboretum,_Seattle,_August_2024.jpg',
      width: 800,
      height: 600,
    },
  },

  // ---------- Real food ----------
  {
    id: 'sitka-spruce',
    name: 'Sitka & Spruce',
    category: 'food',
    address: 'Melrose Market, 1531 Melrose Ave, Seattle, WA 98122',
    why: 'PNW seasonal small plates from Matt Dillon, in the converted Melrose Market warehouse on Capitol Hill. Local, ingredient-driven — exactly the not-a-chain pick. Sit at the counter if you can.',
    timeNeeded: '1.5-2 hours',
    practical: 'Dinner only; reservations strongly recommended on Resy.',
    photo: {
      src: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=70',
      alt: 'Restaurant interior with warm wood, an open kitchen, and counter seating.',
      credit: 'Photo: Jay Wennington / Unsplash',
      creditUrl: 'https://unsplash.com/photos/N_Y88TWmGwA',
      width: 800,
      height: 533,
    },
  },
  {
    id: 'storyville',
    name: 'Storyville Coffee (Pike Place)',
    category: 'food',
    address: '94 Pike St #34, Seattle, WA 98101',
    why: 'Hidden upstairs on the corner of Pike Place — high windows over the market, wood-fired pastries, very good lattes. Better coffee than the original Starbucks line below, no wait.',
    timeNeeded: '30-45 min',
    practical: 'Walk in. Indoor seating + a tiny balcony. Open daily 7am-6pm.',
    photo: {
      src: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=70',
      alt: 'Latte in a ceramic cup on a wooden table beside a window.',
      credit: 'Photo: Nathan Dumlao / Unsplash',
      creditUrl: 'https://unsplash.com/photos/6VhPY27jdps',
      width: 800,
      height: 533,
    },
  },
  {
    id: 'walrus-carpenter',
    name: 'The Walrus and the Carpenter',
    category: 'food',
    address: '4743 Ballard Ave NW, Seattle, WA 98107',
    why: 'Famous Ballard oyster bar from Renee Erickson — small, lively, ingredient-driven seafood. James Beard winner. The Ballard / Fremont stretch is also one of the most-walkable food strips in the city.',
    timeNeeded: '1.5-2 hours',
    practical: 'No reservations — walk in early (5pm open) or expect a 30-90 min wait. Worth it.',
    photo: {
      src: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=800&q=70',
      alt: 'Plate of fresh oysters on ice with lemon wedges.',
      credit: 'Photo: Ben Stern / Unsplash',
      creditUrl: 'https://unsplash.com/photos/Cz38gW46_nA',
      width: 800,
      height: 533,
    },
  },

  // ---------- Lodging ----------
  {
    id: 'hotel-andra',
    name: 'Hotel Andra',
    category: 'lodging',
    address: '2000 4th Ave, Seattle, WA 98121',
    why: "Scandinavian-modern boutique in Belltown, walking distance to Pike Place + the waterfront + Olympic Sculpture Park. Spacious rooms, warm wood + wool textiles — same nicer-not-fussy tier as the trip's cabin picks.",
    timeNeeded: 'Overnight',
    practical:
      '~$280-380/night Aug 2026. Valet parking ~$55/night, or use the Pike Place garage.',
    photo: {
      src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Seattle_-_Hotel_Andra_01.jpg/960px-Seattle_-_Hotel_Andra_01.jpg',
      alt: 'Exterior of Hotel Andra in Belltown, Seattle.',
      credit: 'Photo: Joe Mabel · CC BY-SA 3.0 (Wikimedia)',
      creditUrl: 'https://commons.wikimedia.org/wiki/File:Seattle_-_Hotel_Andra_01.jpg',
      width: 800,
      height: 600,
    },
  },
];

export const SEATTLE_LOGISTICS: SeattleLogisticsRow[] = [
  {
    topic: 'SEA airport → downtown drive',
    detail:
      'About 14 mi via I-5 N. ~20 min off-peak, 35-55 min in PM rush (3-7pm weekdays). Returning the car at SEA is a 5-min hop from the freeway — leave a 1.5-hr buffer before a flight even off-peak.',
  },
  {
    topic: 'Parking a rental for a few hours',
    detail:
      'Pike Place Market Garage (1531 Western Ave) — covered, ~$8/hr, $30 daily max, validated by some market vendors. Pacific Place Garage (600 Pine St) — downtown shopping center, similar rates. Pioneer Square: Diamond garage at 1st & James.',
  },
  {
    topic: 'Keep the rental or drop + Uber?',
    detail:
      "For a 3-4 hour Day 5 stop: keep it. Detour to a garage near Pike Place, then back to SEA via I-5 — easier than the airport-shuttle round trip. For an overnight: drop the rental at SEA on arrival, take Link light rail downtown ($3 / 40 min), or just Uber + use the hotel's valet.",
  },
  {
    topic: 'Light rail option',
    detail:
      "Link 1 Line runs SEA station → Westlake (downtown / Pike Place) in ~40 min for $3 one way. Trains every 8-10 min. Faster than driving at rush hour. Works well if you've already returned the car.",
  },
  {
    topic: 'Traffic peaks to avoid',
    detail:
      'Weekday I-5 PM rush 3-7pm both directions through downtown. AM rush 6:30-9am. Saturday afternoons OK; Sunday usually clear.',
  },
];

export const SEATTLE_ITINERARIES: SeattleItinerary[] = [
  {
    id: 'thu-halfday',
    label: 'Thu Aug 20 post-trip half-day',
    scenario:
      "Drive Winthrop → SEA arrives mid-afternoon. You have ~4-6 hours before an evening eastbound flight. Default play if you're flying out Thu evening.",
    steps: [
      'Stop at Snoqualmie Falls on the way in (~30 min from Seattle on I-90) — adds ~1 hr but it is the natural last-glimpse-of-mountains stop.',
      'Park at Pike Place Market Garage (~$8/hr).',
      'Walk Pike Place arcade + waterfront + the Overlook Walk over to Olympic Sculpture Park (~2 hrs).',
      'Late lunch / early dinner — Storyville Coffee for a pre-flight reset, or walk to a Pike Place chowder counter.',
      'Drive to SEA — leave 90 min before boarding, more in rush hour.',
    ],
    recommended: true,
  },
  {
    id: 'thu-ferry',
    label: 'Thu Aug 20 ferry mini-loop',
    scenario:
      'Same Thu evening flight, but trade the walking-tour for a ferry ride. Best if you arrive in Seattle by ~1pm.',
    steps: [
      'Park at the Pier 50 / Pioneer Square garages.',
      'Walk on Bainbridge ferry (~$10 round trip, 35 min each way).',
      'Coffee + lunch + a short stroll in Bainbridge town (~1.5 hrs ashore).',
      'Ferry back, walk Pioneer Square for 30-45 min.',
      'Drive to SEA.',
    ],
  },
  {
    id: 'sat-overnight',
    label: 'Sat Aug 15 pre-trip overnight',
    scenario:
      'Land Saturday afternoon/evening, sleep in Seattle, drive Sunday morning to Marblemount (~2 hrs) fresh. Best if redeye-jet-lag is a concern, or if the flight gets in late.',
    steps: [
      'Drop the rental at SEA (or skip the pickup until Sunday) — Link light rail to Westlake in 40 min.',
      'Check into Hotel Andra (Belltown) — walking distance to Pike Place + waterfront.',
      'Quick walk-around at Pike Place sunset + Olympic Sculpture Park if light allows.',
      'Dinner at Sitka & Spruce or a Belltown spot.',
      'Sunday morning: coffee at Storyville, Uber to SEA, pick up rental, drive ~2 hrs to Marblemount.',
    ],
  },
  {
    id: 'thu-overnight',
    label: 'Thu→Fri Aug 20-21 add-on night',
    scenario:
      "Push the eastbound flight to Friday morning or use a redeye. Gives a full evening + morning in Seattle. Worth it if it's your first time in the PNW or fares are similar.",
    steps: [
      'Drive Winthrop → Snoqualmie Falls → SEA car drop in afternoon.',
      'Link light rail or Uber to Hotel Andra.',
      'Late afternoon — Kerry Park at sunset (the skyline shot).',
      'Dinner at The Walrus and the Carpenter (Ballard) — early arrival to skip the wait.',
      'Fri morning — Discovery Park beach loop or Bainbridge ferry, then SEA for departure.',
    ],
  },
];
