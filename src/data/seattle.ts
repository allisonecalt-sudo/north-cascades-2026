/**
 * Seattle add-on — conditional, not central.
 *
 * Per Allison May 16: "give suggestions if worth it." Frame the section as
 * optional + situational, not part of the core plan. The Day-5 layover window
 * is the most common case; the rest are alternatives.
 *
 * No museums (ruled out). Sightseeing stops focus on walkables + outdoorsy.
 */

export interface SeattlePhoto {
  src: string;
  alt: string;
  credit?: string;
  creditUrl?: string;
  width: number;
  height: number;
}

export type SeattleCategory = 'walkable' | 'outdoorsy' | 'food' | 'lodging';

export interface SeattleStop {
  id: string;
  name: string;
  category: SeattleCategory;
  address: string;
  why: string;
  timeNeeded: string;
  practical?: string;
  /** Single photo (backward-compat — also slide 1 when photos[] is absent). */
  photo: SeattlePhoto;
  /**
   * Optional multi-photo carousel. Added Wave 4 photo-curation pass,
   * May 17, 2026. 2-4 photos. Falls back to `photo` when undefined.
   */
  photos?: readonly SeattlePhoto[];
  /** "Verified on" date for trust signal. */
  verifiedAsOf?: string;
}

export interface SeattleItinerary {
  id: string;
  label: string;
  scenario: string;
  steps: string[];
}

export interface SeattleLogisticsRow {
  topic: string;
  detail: string;
}

export const CATEGORY_LABELS: Record<SeattleCategory, string> = {
  walkable: 'Walkable',
  outdoorsy: 'Outdoorsy',
  food: 'Food',
  lodging: 'Lodging',
};

export const SEATTLE_STOPS: SeattleStop[] = [
  {
    id: 'pike-place',
    name: 'Pike Place Market',
    category: 'walkable',
    address: '85 Pike St, Seattle, WA 98101',
    why: 'Market arcade + flying-fish stalls + original Starbucks + waterfront below. Walk it in 45 min; longer if you stop to eat.',
    timeNeeded: '1-2 hours',
    practical:
      'Pike Place Market Garage (1531 Western Ave): ~$8/hr, $30 daily max.',
    verifiedAsOf: 'May 17, 2026',
    photo: {
      src: 'img/pike-place-market-seattle.jpg',
      alt: 'Pike Place Public Market entrance with the famous red neon sign and clock.',
      credit: 'Photo: Daniel Schwen · CC BY-SA 4.0 (Wikimedia)',
      creditUrl: 'https://commons.wikimedia.org/wiki/File:Pike_Place_Market_Seattle.jpg',
      width: 800,
      height: 551,
    },
    photos: [
      {
        src: 'img/pike-place-market-seattle.jpg',
        alt: 'Pike Place Public Market entrance with the famous red neon sign and clock.',
        credit: 'Photo: Daniel Schwen · CC BY-SA 4.0 (Wikimedia)',
        creditUrl: 'https://commons.wikimedia.org/wiki/File:Pike_Place_Market_Seattle.jpg',
        width: 800,
        height: 551,
      },
    ],
  },
  {
    id: 'kerry-park',
    name: 'Kerry Park viewpoint',
    category: 'walkable',
    address: '211 W Highland Dr, Seattle, WA 98119',
    why: 'Skyline view — Space Needle framed against Mt Rainier on a clear day. Best near sunset.',
    timeNeeded: '20-30 min',
    practical: 'Free street parking on W Highland Dr.',
    verifiedAsOf: 'May 17, 2026',
    photo: {
      src: 'img/seattle-skyline-from-kerry-park-march-2019.jpg',
      alt: 'Seattle skyline panorama from Kerry Park with the Space Needle and Mount Rainier behind.',
      credit: 'Photo: SounderBruce · CC BY-SA 4.0 (Wikimedia)',
      creditUrl:
        'https://commons.wikimedia.org/wiki/File:Seattle_skyline_from_Kerry_Park,_March_2019.jpg',
      width: 800,
      height: 228,
    },
    photos: [
      {
        src: 'img/seattle-skyline-from-kerry-park-march-2019.jpg',
        alt: 'Seattle skyline panorama from Kerry Park with the Space Needle and Mount Rainier behind.',
        credit: 'Photo: SounderBruce · CC BY-SA 4.0 (Wikimedia)',
        creditUrl:
          'https://commons.wikimedia.org/wiki/File:Seattle_skyline_from_Kerry_Park,_March_2019.jpg',
        width: 800,
        height: 228,
      },
      {
        src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Kerry_Park_%26_Seattle_skyline_01.jpg?width=1280',
        alt: 'Kerry Park viewpoint with the Seattle skyline beyond, summer day.',
        credit: 'Photo: Wikimedia · CC',
        creditUrl: 'https://commons.wikimedia.org/wiki/File:Kerry_Park_%26_Seattle_skyline_01.jpg',
        width: 1600,
        height: 1067,
      },
      {
        src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Seattle_-_tourists_at_Kerry_Park_01.jpg?width=1280',
        alt: 'Tourists looking out from Kerry Park at the Seattle skyline.',
        credit: 'Photo: Wikimedia · CC',
        creditUrl: 'https://commons.wikimedia.org/wiki/File:Seattle_-_tourists_at_Kerry_Park_01.jpg',
        width: 1600,
        height: 1067,
      },
    ],
  },
  {
    id: 'pioneer-square',
    name: 'Pioneer Square',
    category: 'walkable',
    address: 'Pioneer Square Historic District, Seattle, WA',
    why: 'Seattle\'s oldest neighborhood — red-brick blocks, Smith Tower, Occidental Square, galleries, bookstores. Quieter than Pike Place.',
    timeNeeded: '45-60 min',
    practical: 'Diamond garage at 1st & James or street meters.',
    verifiedAsOf: 'May 17, 2026',
    photo: {
      src: 'img/seattle-pioneer-square-pergola-2020-04-24.jpg',
      alt: 'Iron-and-glass Pioneer Square pergola in front of historic brick buildings.',
      credit: 'Photo: Joe Mabel · CC BY-SA 4.0 (Wikimedia)',
      creditUrl:
        'https://commons.wikimedia.org/wiki/File:Seattle_-_Pioneer_Square_Pergola_-_2020-04-24.jpg',
      width: 800,
      height: 533,
    },
    photos: [
      {
        src: 'img/seattle-pioneer-square-pergola-2020-04-24.jpg',
        alt: 'Iron-and-glass Pioneer Square pergola in front of historic brick buildings.',
        credit: 'Photo: Joe Mabel · CC BY-SA 4.0 (Wikimedia)',
        creditUrl:
          'https://commons.wikimedia.org/wiki/File:Seattle_-_Pioneer_Square_Pergola_-_2020-04-24.jpg',
        width: 800,
        height: 533,
      },
      {
        src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Seattle,_WA_-_Pioneer_Square-Skid_Road_District_-_Pioneer_Place.jpg?width=1280',
        alt: 'Pioneer Place in the Pioneer Square historic district.',
        credit: 'Photo: Wikimedia · CC',
        creditUrl: 'https://commons.wikimedia.org/wiki/File:Seattle,_WA_-_Pioneer_Square-Skid_Road_District_-_Pioneer_Place.jpg',
        width: 1600,
        height: 1067,
      },
      {
        src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Seattle_-_Pioneer_Square_Park_04.jpg?width=1280',
        alt: 'Pioneer Square Park with the historic buildings around it.',
        credit: 'Photo: Wikimedia · CC',
        creditUrl: 'https://commons.wikimedia.org/wiki/File:Seattle_-_Pioneer_Square_Park_04.jpg',
        width: 1600,
        height: 1067,
      },
    ],
  },
  {
    id: 'olympic-sculpture',
    name: 'Olympic Sculpture Park',
    category: 'walkable',
    address: '2901 Western Ave, Seattle, WA 98121',
    why: 'Free outdoor sculpture park on the waterfront — 9 acres of large-scale art, Puget Sound views. Easy walk from Pike Place along the Overlook Walk.',
    timeNeeded: '30-45 min',
    practical: 'Free entry, open daily sunrise-sunset. Small paid lot on site (~$6/hr).',
    photo: {
      src: 'img/seattle-wa-usa-olympic-sculpture-park-hartriegel-2022-1615.jpg',
      alt: 'View through Olympic Sculpture Park trees with the waterfront beyond.',
      credit: 'Photo: Dietmar Rabich · CC BY-SA 4.0 (Wikimedia)',
      creditUrl:
        'https://commons.wikimedia.org/wiki/File:Seattle_(WA,_USA),_Olympic_Sculpture_Park,_Hartriegel_--_2022_--_1615.jpg',
      width: 800,
      height: 600,
    },
  },
  {
    id: 'snoqualmie-falls',
    name: 'Snoqualmie Falls',
    category: 'outdoorsy',
    address: '6501 Railroad Ave SE, Snoqualmie, WA 98065',
    why: '270-foot waterfall ~30 min east of SEA on I-90 — basically on the return route via I-90. Upper viewpoint is paved + 5-min walk from parking.',
    timeNeeded: '30-60 min',
    practical: 'Free parking at upper lot. Upper deck is accessible; 1.4-mi RT trail descends to the lower viewpoint.',
    verifiedAsOf: 'May 17, 2026',
    photo: {
      src: 'img/snoqualmie-falls-washington.jpg',
      alt: 'Snoqualmie Falls cascading down a forested cliff in a wide misty plunge.',
      credit: 'Photo: Kpsudeep · CC BY-SA 4.0 (Wikimedia)',
      creditUrl: 'https://commons.wikimedia.org/wiki/File:Snoqualmie_Falls_Washington.jpg',
      width: 800,
      height: 542,
    },
    photos: [
      {
        src: 'img/snoqualmie-falls-washington.jpg',
        alt: 'Snoqualmie Falls cascading down a forested cliff in a wide misty plunge.',
        credit: 'Photo: Kpsudeep · CC BY-SA 4.0 (Wikimedia)',
        creditUrl: 'https://commons.wikimedia.org/wiki/File:Snoqualmie_Falls_Washington.jpg',
        width: 800,
        height: 542,
      },
      {
        src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Snoqualmie_Falls_in_summer_2.jpg?width=1280',
        alt: 'Snoqualmie Falls in summer flow from the upper viewing deck.',
        credit: 'Photo: Wikimedia · CC',
        creditUrl: 'https://commons.wikimedia.org/wiki/File:Snoqualmie_Falls_in_summer_2.jpg',
        width: 1600,
        height: 1067,
      },
    ],
  },
  {
    id: 'discovery-park',
    name: 'Discovery Park',
    category: 'outdoorsy',
    address: '3801 Discovery Park Blvd, Seattle, WA 98199',
    why: 'Seattle\'s largest park — 534 acres of forest, meadow, sea bluffs. West Point Lighthouse trail (2.8 mi RT) drops to the beach.',
    timeNeeded: '1-2 hours',
    practical: 'Free parking. Open 4am-11:30pm. Gentle beach loop after a hiking trip.',
    verifiedAsOf: 'May 17, 2026',
    photo: {
      src: 'img/seattle-discovery-park-lighthouse-51521932685.jpg',
      alt: 'West Point Lighthouse at Discovery Park with Puget Sound and distant peaks.',
      credit: 'Photo: Seattle City Council · CC BY 2.0 (Wikimedia)',
      creditUrl:
        'https://commons.wikimedia.org/wiki/File:Seattle_Discovery_Park_Lighthouse_(51521932685).jpg',
      width: 800,
      height: 535,
    },
    photos: [
      {
        src: 'img/seattle-discovery-park-lighthouse-51521932685.jpg',
        alt: 'West Point Lighthouse at Discovery Park with Puget Sound and distant peaks.',
        credit: 'Photo: Seattle City Council · CC BY 2.0 (Wikimedia)',
        creditUrl:
          'https://commons.wikimedia.org/wiki/File:Seattle_Discovery_Park_Lighthouse_(51521932685).jpg',
        width: 800,
        height: 535,
      },
      {
        src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Discovery_Park,_Seattle_pano_01.jpg?width=1280',
        alt: 'Panorama of Discovery Park bluffs over Puget Sound.',
        credit: 'Photo: Wikimedia · CC',
        creditUrl: 'https://commons.wikimedia.org/wiki/File:Discovery_Park,_Seattle_pano_01.jpg',
        width: 1600,
        height: 800,
      },
      {
        src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Seattle_-_Discovery_Park_04.jpg?width=1280',
        alt: 'Trail and meadow inside Discovery Park.',
        credit: 'Photo: Wikimedia · CC',
        creditUrl: 'https://commons.wikimedia.org/wiki/File:Seattle_-_Discovery_Park_04.jpg',
        width: 1600,
        height: 1067,
      },
    ],
  },
  {
    id: 'bainbridge-ferry',
    name: 'Bainbridge Island ferry',
    category: 'outdoorsy',
    address: 'Colman Dock, 801 Alaskan Way, Seattle, WA 98104',
    why: '35-min ferry across Puget Sound — open-air deck, the skyline shrinking behind you, mountains all around. Walk on (no car) for ~$10 round trip.',
    timeNeeded: '2.5-3 hrs with a Bainbridge stop',
    practical: 'Pier 50 garage or Pioneer Square garages within a 5-min walk. Walk-on fares only charged westbound.',
    verifiedAsOf: 'May 17, 2026',
    photo: {
      src: 'img/washington-state-ferry-leaving-for-bainbridge-islandfor-bain-52230622298.jpg',
      alt: 'Washington State Ferry pulling away from Colman Dock toward Bainbridge Island.',
      credit: 'Photo: Han Zheng · CC BY-SA 2.0 (Wikimedia)',
      creditUrl:
        'https://commons.wikimedia.org/wiki/File:Washington_State_Ferry_leaving_for_Bainbridge_Islandfor_Bain_(52230622298).jpg',
      width: 800,
      height: 533,
    },
    photos: [
      {
        src: 'img/washington-state-ferry-leaving-for-bainbridge-islandfor-bain-52230622298.jpg',
        alt: 'Washington State Ferry pulling away from Colman Dock toward Bainbridge Island.',
        credit: 'Photo: Han Zheng · CC BY-SA 2.0 (Wikimedia)',
        creditUrl:
          'https://commons.wikimedia.org/wiki/File:Washington_State_Ferry_leaving_for_Bainbridge_Islandfor_Bain_(52230622298).jpg',
        width: 800,
        height: 533,
      },
      {
        src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Bainbridge_Island,_WA.jpg?width=1280',
        alt: 'Bainbridge Island ferry terminal and downtown waterfront.',
        credit: 'Photo: Wikimedia · CC',
        creditUrl: 'https://commons.wikimedia.org/wiki/File:Bainbridge_Island,_WA.jpg',
        width: 1600,
        height: 1067,
      },
      {
        src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Aerial_view_of_Bainbridge_Island_and_Agate_Passage_in_Olympic_Peninsula.jpg?width=1280',
        alt: 'Aerial view of Bainbridge Island and Agate Passage with the Olympic Peninsula beyond.',
        credit: 'Photo: Wikimedia · CC',
        creditUrl: 'https://commons.wikimedia.org/wiki/File:Aerial_view_of_Bainbridge_Island_and_Agate_Passage_in_Olympic_Peninsula.jpg',
        width: 1600,
        height: 1067,
      },
    ],
  },
  {
    id: 'arboretum',
    name: 'Washington Park Arboretum',
    category: 'outdoorsy',
    address: '2300 Arboretum Dr E, Seattle, WA 98112',
    why: '230 acres of curated landscape between Lake Washington and UW. Quiet, leafy. Japanese Garden inside for an extra $10.',
    timeNeeded: '45-90 min',
    practical: 'Free parking + free admission to the main arboretum.',
    photo: {
      src: 'img/washington-park-arboretum-seattle-august-2024.jpg',
      alt: 'Late-summer trail through the Washington Park Arboretum with tall trees on both sides.',
      credit: 'Photo: Another Believer · CC BY-SA 4.0 (Wikimedia)',
      creditUrl:
        'https://commons.wikimedia.org/wiki/File:Washington_Park_Arboretum,_Seattle,_August_2024.jpg',
      width: 800,
      height: 600,
    },
  },
  {
    id: 'hotel-andra',
    name: 'Hotel Andra',
    category: 'lodging',
    address: '2000 4th Ave, Seattle, WA 98121',
    why: 'Scandinavian-modern boutique in Belltown, walking distance to Pike Place + the waterfront. Spacious rooms, warm wood + wool — same nicer-not-fussy tier as the trip\'s cabin picks.',
    timeNeeded: 'Overnight',
    practical: '~$280-380/night Aug 2026. Valet parking ~$55/night.',
    photo: {
      src: 'img/seattle-hotel-andra-01.jpg',
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
      'About 14 mi via I-5 N. ~20 min off-peak, 35-55 min in PM rush (3-7pm weekdays). Leave a 1.5-hr buffer before a flight even off-peak.',
  },
  {
    topic: 'Parking a rental for a few hours',
    detail:
      'Pike Place Market Garage (1531 Western Ave) — covered, ~$8/hr, $30 daily max. Pacific Place Garage (600 Pine St) — similar rates. Pioneer Square: Diamond garage at 1st & James.',
  },
  {
    topic: 'Keep the rental or drop + Uber?',
    detail:
      'For a 3-4 hr Day-5 stop: keep it. Detour to a garage near Pike Place, then back to SEA via I-5. For an overnight: drop the rental at SEA on arrival, take Link light rail downtown ($3 / 40 min), or Uber.',
  },
  {
    topic: 'Light rail',
    detail:
      'Link 1 Line runs SEA station → Westlake (downtown / Pike Place) in ~40 min for $3 one way. Trains every 8-10 min. Faster than driving at rush hour.',
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
    label: 'Thu Aug 20 — half-day after the drive',
    scenario:
      'Most common: arrive Seattle mid-afternoon Thu, ~4-6 hours before the evening flight. Optional stop only if you want it.',
    steps: [
      'Stop at Snoqualmie Falls on the way in (~30 min from Seattle on I-90).',
      'Park at Pike Place Market Garage (~$8/hr). Walk Pike Place arcade + waterfront + Olympic Sculpture Park (~2 hrs).',
      'Drive to SEA — leave 90 min before boarding, more in rush hour.',
    ],
  },
  {
    id: 'thu-ferry',
    label: 'Thu Aug 20 — ferry mini-loop',
    scenario:
      'Same Thu evening flight, but trade the walking tour for a ferry ride. Works if you arrive in Seattle by ~1pm.',
    steps: [
      'Park at Pier 50 / Pioneer Square garages.',
      'Walk on the Bainbridge ferry (~$10 RT, 35 min each way) — eat lunch with a skyline view.',
      'Short stroll in Bainbridge town (~1.5 hrs ashore).',
      'Ferry back, walk Pioneer Square for 30-45 min. Drive to SEA.',
    ],
  },
  {
    id: 'sat-overnight',
    label: 'Sat Aug 15 — pre-trip overnight',
    scenario:
      'Land Saturday afternoon/evening, sleep in Seattle, drive Sunday morning to Marblemount (~2 hrs) fresh. Useful if redeye-jet-lag is a concern.',
    steps: [
      'Drop the rental at SEA — Link light rail to Westlake in 40 min.',
      'Check into Hotel Andra (Belltown) — walking distance to Pike Place + waterfront.',
      'Dinner — Teapot Vegetarian House (kosher pareve, Capitol Hill) or Pabla Indian (kosher dairy, Renton). See Food + restaurants for the full Va\'ad-certified list.',
      'Sunday morning: Uber to SEA, pick up the rental, drive ~2 hrs to Marblemount.',
    ],
  },
  {
    id: 'thu-overnight',
    label: 'Thu→Fri Aug 20-21 — add-on night',
    scenario:
      'Push the eastbound flight to Friday morning. Gives a full evening + morning in Seattle. Worth it if it\'s your first PNW trip.',
    steps: [
      'Drive Winthrop → Snoqualmie Falls → SEA car drop in afternoon.',
      'Link light rail or Uber to Hotel Andra.',
      'Late afternoon — Kerry Park at sunset.',
      'Fri morning — Discovery Park beach loop or Bainbridge ferry, then SEA for departure.',
    ],
  },
];
