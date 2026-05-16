/**
 * Hikes — neutral options menu.
 *
 * Tone: peer-collaborator. No "must-do" / "the trail" / hierarchy.
 * Levels are descriptive (easy / moderate / ambitious) so Erin and Allison can
 * pick by energy on the day. Easy + moderate lead; ambitious add-ons sit at
 * the bottom with an honest "long day, significant climb" framing.
 *
 * Stats aligned to WTA where they differed from the old site (Maple Pass
 * 2,200 → 2,020 ft, Cascade Pass 7.4 → 7.0 mi / 1,700 → 1,800 ft).
 */

export type HikeLevel = 'easy' | 'moderate' | 'ambitious';

export interface HikePhoto {
  src: string;
  alt: string;
  credit?: string;
  creditUrl?: string;
  width: number;
  height: number;
}

export interface Hike {
  id: string;
  name: string;
  trailhead: string;
  mileage: string;
  elevation: string;
  duration: string;
  difficulty: string;
  level: HikeLevel;
  side: 'west' | 'east' | 'either';
  description: string;
  photo?: HikePhoto;
}

export const HIKES: Hike[] = [
  // ---------- Easy ----------
  {
    id: 'rainy-lake',
    name: 'Rainy Lake',
    trailhead: 'Rainy Pass · MP 158 WA-20 (east)',
    mileage: '1.8 mi RT',
    elevation: 'Minimal',
    duration: '~1 hr',
    difficulty: 'Paved, wheelchair-accessible',
    level: 'easy',
    side: 'east',
    description:
      'Flat paved walk to an alpine lake basin. Good first-morning warm-up or rest-day option.',
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
    id: 'ladder-creek',
    name: 'Ladder Creek Falls',
    trailhead: 'MP 120 · behind Gorge Powerhouse, Newhalem (west)',
    mileage: '<0.5 mi paved loop',
    elevation: 'Minimal',
    duration: '~20 min',
    difficulty: 'Very easy',
    level: 'easy',
    side: 'west',
    description: 'Short paved loop. Lit at night until 11 pm — easy first-evening option.',
    photo: {
      src: 'https://upload.wikimedia.org/wikipedia/commons/4/4e/Gorge_Creek_Falls_-_01.jpg',
      alt: 'Tall narrow waterfall threading through mossy granite walls.',
      credit: 'Photo: Joe Mabel · CC BY-SA 4.0 (Wikimedia)',
      creditUrl: 'https://commons.wikimedia.org/wiki/File:Gorge_Creek_Falls_-_01.jpg',
      width: 800,
      height: 1200,
    },
  },

  // ---------- Moderate (the sweet spot — beautiful, doable) ----------
  {
    id: 'blue-lake',
    name: 'Blue Lake',
    trailhead: 'MP 161 WA-20 (east)',
    mileage: '4.4 mi RT',
    elevation: '+1,050 ft',
    duration: '2-3 hrs',
    difficulty: 'Easy-moderate',
    level: 'moderate',
    side: 'east',
    description:
      'Short, scenic, and big payoff: alpine lake right under Liberty Bell. Quick option for the east-side day, or pair with a Washington Pass stop.',
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
    id: 'thunder-knob',
    name: 'Thunder Knob',
    trailhead: 'Colonial Creek South Campground · MP 130 (west)',
    mileage: '3.6 mi RT',
    elevation: '+635 ft',
    duration: '1.5-2 hrs',
    difficulty: 'Easy-moderate',
    level: 'moderate',
    side: 'west',
    description:
      'Forested switchbacks up to a Diablo Lake overlook. Natural pairing with the drive-day stops along WA-20.',
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
    id: 'maple-pass',
    name: 'Maple Pass Loop',
    trailhead: 'Rainy Pass · MP 158 WA-20 (east)',
    mileage: '7.2 mi loop',
    elevation: '+2,020 ft (per WTA)',
    duration: '4-5 hrs',
    difficulty: 'Moderate',
    level: 'moderate',
    side: 'east',
    description:
      'The full East-side scenic loop: forest switchbacks open into alpine meadows and a ridgeline view over Lake Ann + Cutthroat Peak. Counterclockwise is the easier-on-the-knees direction.',
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
    id: 'cascade-pass',
    name: 'Cascade Pass (pass-only)',
    trailhead: 'End of Cascade River Rd (west)',
    mileage: '7.0 mi RT (per WTA)',
    elevation: '+1,800 ft (per WTA)',
    duration: '3.5-4 hrs',
    difficulty: 'Moderate',
    level: 'moderate',
    side: 'west',
    description:
      'Switchbacks up to a wide alpine pass at 5,400 ft with views into Stehekin valley. Sustained climb but the trail is steady, never technical.',
    photo: {
      src: 'https://upload.wikimedia.org/wikipedia/commons/0/02/Sahale_Arm_and_Cascade_Pass_at_North_Cascades_in_Washington_02.jpg',
      alt: 'Alpine ridgeline near Cascade Pass with glaciated peaks beyond.',
      credit: 'Photo: Wikimedia · CC BY-SA 4.0',
      creditUrl:
        'https://commons.wikimedia.org/wiki/File:Sahale_Arm_and_Cascade_Pass_at_North_Cascades_in_Washington_02.jpg',
      width: 1200,
      height: 675,
    },
  },
  {
    id: 'park-butte',
    name: 'Park Butte Lookout',
    trailhead: 'FR 13 off Baker Lake Rd · ~1 hr 15 min from Marblemount (west)',
    mileage: '7-8 mi RT',
    elevation: '+2,100 ft',
    duration: '~5 hrs',
    difficulty: 'Moderate',
    level: 'moderate',
    side: 'west',
    description:
      'West-side alternate, especially useful if east-side smoke or WA-20 status changes. Historic 1932 fire lookout, in-your-face Mt. Baker views.',
  },
  {
    id: 'chain-lakes',
    name: 'Chain Lakes Loop / Artist Point',
    trailhead: 'WA-542 from Bellingham · ~1 hr east of BLI (west)',
    mileage: '6-7 mi loop',
    elevation: '+1,700-1,800 ft',
    duration: '~4 hrs',
    difficulty: 'Moderate',
    level: 'moderate',
    side: 'west',
    description:
      'Heather Meadows / Artist Point — alpine lakes with Baker + Shuksan views. Works as a Day 1 detour from BLI.',
  },

  // ---------- Ambitious (long days — optional add-ons, not the plan) ----------
  {
    id: 'sahale-arm',
    name: 'Cascade Pass + Sahale Arm extension',
    trailhead: 'End of Cascade River Rd (west)',
    mileage: '12.8 mi RT',
    elevation: '+4,100 ft',
    duration: '7-8 hrs',
    difficulty: 'Strenuous · long day',
    level: 'ambitious',
    side: 'west',
    description:
      'Optional add-on past the pass and up Sahale Arm to a glacier camp basin at 7,600 ft. Long day, significant climb — only if both feel strong on the morning of, and only with an early start.',
  },
  {
    id: 'cutthroat-pass',
    name: 'Cutthroat Pass via PCT',
    trailhead: 'MP 158 WA-20 (east)',
    mileage: '10 mi RT',
    elevation: '+2,034 ft',
    duration: '~5 hrs',
    difficulty: 'Hard',
    level: 'ambitious',
    side: 'east',
    description:
      'Goes north on the PCT from Rainy Pass. Longer + harder than Maple Pass with a different ridgeline payoff. Only if Maple Pass feels too short.',
  },
];

export const LEVEL_LABELS: Record<HikeLevel, string> = {
  easy: 'Easy',
  moderate: 'Moderate',
  ambitious: 'Ambitious add-on',
};
