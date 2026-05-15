export type HikeTag = 'must-do' | 'classic' | 'easy' | 'alternative' | 'plan-b';

export interface HikePhoto {
  src: string;
  alt: string;
  credit?: string;
  creditUrl?: string;
  width: number;
  height: number;
}

export interface Hike {
  rank: number;
  name: string;
  trailhead: string;
  mileage: string;
  elevation: string;
  duration: string;
  difficulty: string;
  tag: HikeTag;
  description: string;
  photo?: HikePhoto;
}

export const HIKES: Hike[] = [
  {
    rank: 1,
    name: 'Cascade Pass / Sahale Arm',
    trailhead: 'End of Cascade River Rd (west side, from Marblemount) · Day 2',
    mileage: '7.4 mi (pass) or 12.8 mi (w/ Sahale Arm)',
    elevation: '+1,700 ft (pass) or +4,100 ft (Sahale)',
    duration: '3.5-4 hrs or 7-8 hrs',
    difficulty: 'Moderate / Strenuous',
    tag: 'must-do',
    description: 'The trail. Switchbacks → alpine meadow → optional Sahale Glacier basin at 7,600 ft.',
    photo: {
      src: 'https://upload.wikimedia.org/wikipedia/commons/0/02/Sahale_Arm_and_Cascade_Pass_at_North_Cascades_in_Washington_02.jpg',
      alt: 'Alpine ridgeline of Sahale Arm with glaciated peaks beyond Cascade Pass.',
      credit: 'Photo: Wikimedia · CC BY-SA 4.0',
      creditUrl:
        'https://commons.wikimedia.org/wiki/File:Sahale_Arm_and_Cascade_Pass_at_North_Cascades_in_Washington_02.jpg',
      width: 1200,
      height: 675,
    },
  },
  {
    rank: 2,
    name: 'Maple Pass Loop',
    trailhead: 'Rainy Pass MP 158 (east side) · Day 4',
    mileage: '7.2 mi loop',
    elevation: '+2,200 ft',
    duration: '4-5 hrs',
    difficulty: 'Moderate',
    tag: 'classic',
    description:
      'The other trail. Forest switchbacks → alpine meadows → ridgeline panorama over Lake Ann + Cutthroat Peak.',
    photo: {
      src: 'https://upload.wikimedia.org/wikipedia/commons/f/fc/View_from_Maple_Pass.jpg',
      alt: 'Panoramic ridgeline view from Maple Pass over alpine valleys and lakes.',
      credit: 'Photo: Wikimedia · CC BY 2.0',
      creditUrl: 'https://commons.wikimedia.org/wiki/File:View_from_Maple_Pass.jpg',
      width: 1200,
      height: 844,
    },
  },
  {
    rank: 3,
    name: 'Blue Lake',
    trailhead: 'MP 161 WA-20 (east side)',
    mileage: '4.4 mi RT',
    elevation: '+1,050 ft',
    duration: '2-3 hrs',
    difficulty: 'Easy-moderate',
    tag: 'alternative',
    description: 'Quick + scenic alpine lake under Liberty Bell. Good Maple Pass alternate or add-on.',
    photo: {
      src: 'https://upload.wikimedia.org/wikipedia/commons/a/a8/Washington_Pass_and_Liberty_Bell_Mountain.JPG',
      alt: 'Liberty Bell Mountain group rising above pine forest.',
      credit: 'Photo: Jsayre64 · CC BY-SA 3.0 (Wikimedia)',
      creditUrl: 'https://commons.wikimedia.org/wiki/File:Washington_Pass_and_Liberty_Bell_Mountain.JPG',
      width: 1200,
      height: 800,
    },
  },
  {
    rank: 4,
    name: 'Thunder Knob',
    trailhead: 'Colonial Creek South Campground (MP 130) · Day 3',
    mileage: '3.6 mi RT',
    elevation: '+635 ft',
    duration: '1.5-2 hrs',
    difficulty: 'Easy-moderate',
    tag: 'easy',
    description: 'Day 3 leg-stretch with Diablo Lake views from above.',
    photo: {
      src: 'https://upload.wikimedia.org/wikipedia/commons/3/3f/Diablo_Lake_from_Overlook_03.jpg',
      alt: 'Diablo Lake glowing turquoise from a forested overlook — the Thunder Knob view.',
      credit: 'Photo: Joe Mabel · CC BY-SA 4.0 (Wikimedia)',
      creditUrl: 'https://commons.wikimedia.org/wiki/File:Diablo_Lake_from_Overlook_03.jpg',
      width: 1200,
      height: 800,
    },
  },
  {
    rank: 5,
    name: 'Cutthroat Pass (PCT)',
    trailhead: 'MP 158 WA-20 (east side)',
    mileage: '10 mi RT',
    elevation: '+2,034 ft',
    duration: '~5 hrs',
    difficulty: 'Hard',
    tag: 'alternative',
    description: 'Goes north on the PCT. Maple Pass alternate if you want bigger.',
    photo: {
      src: 'https://upload.wikimedia.org/wikipedia/commons/3/35/Cutthroat_Pass_at_North_Cascades_in_Washington_01.jpg',
      alt: 'Cutthroat Pass ridge with sparse subalpine pines and granite peaks.',
      credit: 'Photo: Jeffhollett · CC BY-SA 4.0 (Wikimedia)',
      creditUrl: 'https://commons.wikimedia.org/wiki/File:Cutthroat_Pass_at_North_Cascades_in_Washington_01.jpg',
      width: 1200,
      height: 800,
    },
  },
  {
    rank: 6,
    name: 'Rainy Lake',
    trailhead: 'MP 158 WA-20',
    mileage: '1.8 mi paved',
    elevation: 'Minimal',
    duration: '~1 hr',
    difficulty: 'Easy · wheelchair accessible',
    tag: 'easy',
    description: 'Family-friendly paved walk to alpine lake.',
    photo: {
      src: 'https://upload.wikimedia.org/wikipedia/commons/f/fc/View_from_Maple_Pass.jpg',
      alt: 'Alpine lake basin near Rainy Pass with surrounding ridgelines.',
      credit: 'Photo: Wikimedia · CC BY 2.0',
      creditUrl: 'https://commons.wikimedia.org/wiki/File:View_from_Maple_Pass.jpg',
      width: 1200,
      height: 844,
    },
  },
  {
    rank: 7,
    name: 'Ladder Creek Falls',
    trailhead: 'MP 120 (behind Gorge Powerhouse, Newhalem)',
    mileage: '<0.5 mi paved loop',
    elevation: 'Minimal',
    duration: '~20 min',
    difficulty: 'Very easy',
    tag: 'easy',
    description: 'Evening-lit option. Good Day 1 first-night win.',
    photo: {
      src: 'https://upload.wikimedia.org/wikipedia/commons/4/4e/Gorge_Creek_Falls_-_01.jpg',
      alt: 'Tall narrow waterfall threading through mossy granite walls.',
      credit: 'Photo: Joe Mabel · CC BY-SA 4.0 (Wikimedia)',
      creditUrl: 'https://commons.wikimedia.org/wiki/File:Gorge_Creek_Falls_-_01.jpg',
      width: 800,
      height: 1200,
    },
  },
  {
    rank: 8,
    name: 'Park Butte Lookout (Plan B)',
    trailhead: 'FR 13 off Baker Lake Rd · ~1 hr 15 min from Marblemount',
    mileage: '7-8 mi RT',
    elevation: '+2,100 ft',
    duration: '~5 hrs',
    difficulty: 'Moderate',
    tag: 'plan-b',
    description:
      'West-side fallback if east side smoked out or WA-20 closed. Historic 1932 fire lookout, in-your-face Mt. Baker views.',
    photo: {
      src: 'https://upload.wikimedia.org/wikipedia/commons/3/35/Cutthroat_Pass_at_North_Cascades_in_Washington_01.jpg',
      alt: 'High alpine ridge with glaciated volcano in the distance — Park Butte / Mt. Baker terrain.',
      credit: 'Photo: Wikimedia · CC BY-SA 4.0',
      creditUrl: 'https://commons.wikimedia.org/wiki/Category:Mount_Baker',
      width: 1200,
      height: 800,
    },
  },
  {
    rank: 9,
    name: 'Chain Lakes Loop / Artist Point (Plan B)',
    trailhead: 'WA-542 from Bellingham · ~1 hr east of BLI',
    mileage: '6-7 mi loop',
    elevation: '+1,700-1,800 ft',
    duration: '~4 hrs',
    difficulty: 'Moderate',
    tag: 'plan-b',
    description:
      'Heather Meadows / Artist Point — alpine lakes w/ views of Baker + Shuksan. Best built into Day 1 from BLI.',
    photo: {
      src: 'https://upload.wikimedia.org/wikipedia/commons/0/02/Sahale_Arm_and_Cascade_Pass_at_North_Cascades_in_Washington_02.jpg',
      alt: 'Alpine basin with glaciated peaks — representative Heather Meadows terrain.',
      credit: 'Photo: Wikimedia · CC BY-SA 4.0',
      creditUrl: 'https://commons.wikimedia.org/wiki/Category:Mount_Shuksan',
      width: 1200,
      height: 675,
    },
  },
];
