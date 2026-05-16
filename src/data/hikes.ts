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
  /** Lesser-known options beyond the curated core. Surface with a badge. */
  hiddenGem?: boolean;
  /** WTA / NPS source link for the trail. Optional — added for hidden gems. */
  sourceUrl?: string;
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
      src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Between_Rainy_and_Washington_Pass_(36871032836).jpg?width=1280',
      alt: 'Alpine peak and meadows in the Rainy Pass corridor along WA-20 in summer.',
      credit: 'Photo: Robert Ashworth · CC BY 2.0 (Wikimedia)',
      creditUrl: 'https://commons.wikimedia.org/wiki/File:Between_Rainy_and_Washington_Pass_(36871032836).jpg',
      width: 2048,
      height: 1536,
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
      src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Ladder_Creek_Falls_at_Newhalem,_WA.jpg?width=1280',
      alt: 'Ladder Creek Falls plunging through narrow mossy granite walls behind the Gorge Powerhouse in Newhalem.',
      credit: 'Photo: Ron Clausen · CC BY-SA 4.0 (Wikimedia)',
      creditUrl: 'https://commons.wikimedia.org/wiki/File:Ladder_Creek_Falls_at_Newhalem,_WA.jpg',
      width: 1280,
      height: 1707,
    },
  },

  // ---------- Easy hidden gems ----------
  {
    id: 'trail-of-cedars',
    name: 'Trail of the Cedars',
    trailhead: 'End of Main St, Newhalem · MP 120 (west)',
    mileage: '0.3 mi loop',
    elevation: 'Minimal',
    duration: '~20 min',
    difficulty: 'Wheelchair-friendly, paved/gravel',
    level: 'easy',
    side: 'west',
    description:
      'Suspension bridge over the Skagit then a short interpretive loop through old-growth Western red cedar. Easy add-on to any Newhalem stop — pair with Ladder Creek Falls.',
    hiddenGem: true,
    sourceUrl: 'https://www.wta.org/go-hiking/hikes/trail-of-the-cedars',
  },
  {
    id: 'picture-lake',
    name: 'Picture Lake Loop',
    trailhead: 'WA-542 past Heather Meadows · Mt. Baker Hwy (west)',
    mileage: '0.6 mi loop',
    elevation: '45 ft',
    duration: '~30 min',
    difficulty: 'Paved, ADA-accessible',
    level: 'easy',
    side: 'west',
    description:
      "Mt. Shuksan reflected in a tiny tarn — said to be one of the most photographed views in America. Pair with Chain Lakes / Artist Point on a Day-1 Bellingham detour.",
    hiddenGem: true,
    sourceUrl: 'https://www.wta.org/go-hiking/hikes/picture-lake',
    photo: {
      src: 'https://upload.wikimedia.org/wikipedia/commons/6/6c/MountShuksanPictureLake.JPG',
      alt: 'Mount Shuksan reflected in Picture Lake on a calm summer morning.',
      credit: 'Photo: Siradia · Public domain (Wikimedia)',
      creditUrl: 'https://commons.wikimedia.org/wiki/File:MountShuksanPictureLake.JPG',
      width: 1600,
      height: 1200,
    },
  },
  {
    id: 'bagley-lakes',
    name: 'Bagley Lakes',
    trailhead: 'Heather Meadows, Mt. Baker Ski Area · WA-542 (west)',
    mileage: '2.0 mi loop',
    elevation: '+150 ft',
    duration: '~1 hr',
    difficulty: 'Easy',
    level: 'easy',
    side: 'west',
    description:
      'Two alpine lakes + a year-round snowfield + wildflowers, right inside Heather Meadows. Pair with Picture Lake on the same Mt. Baker corridor swing.',
    hiddenGem: true,
    sourceUrl: 'https://www.wta.org/go-hiking/hikes/bagley-lakes',
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
      src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Blue_Lake_in_Okanogan_National_Forest.jpg?width=1280',
      alt: 'Blue Lake under the granite spires of the Liberty Bell group on a clear summer day.',
      credit: 'Photo: Miguel Vieira · CC BY 2.0 (Wikimedia)',
      creditUrl: 'https://commons.wikimedia.org/wiki/File:Blue_Lake_in_Okanogan_National_Forest.jpg',
      width: 1280,
      height: 960,
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
      src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Cascade_Pass_Trail_at_North_Cascades_in_Washington_15.jpg?width=1280',
      alt: 'Summer view from Cascade Pass looking west into Stehekin valley with glaciated peaks beyond.',
      credit: 'Photo: Jeffhollett · CC BY-SA 4.0 (Wikimedia)',
      creditUrl:
        'https://commons.wikimedia.org/wiki/File:Cascade_Pass_Trail_at_North_Cascades_in_Washington_15.jpg',
      width: 1280,
      height: 960,
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

  // ---------- More hidden gems (moderate — extend the menu) ----------
  {
    id: 'patterson-lake',
    name: 'Patterson Lake Trail',
    trailhead: 'Chickadee TH / Sun Mountain Lodge · 15 min south of Winthrop (east)',
    mileage: '~3.5 mi loop options',
    elevation: '+200-400 ft',
    duration: '1.5-2 hrs',
    difficulty: 'Easy-moderate',
    level: 'easy',
    side: 'east',
    description:
      'Forested lake-edge walk in the Sun Mountain trail web — picnic viewpoint on the southwest side, optional dip. Easy rest-day option from Winthrop or pair with the marina kayak rental.',
    hiddenGem: true,
    sourceUrl: 'https://www.wta.org/go-hiking/hikes/sun-mountain-trails',
  },
  {
    id: 'cedar-creek-falls',
    name: 'Cedar Creek Falls',
    trailhead: 'FR 5310 off WA-20 · 8 min west of Mazama (east)',
    mileage: '3.6 mi RT',
    elevation: '+500 ft',
    duration: '2-2.5 hrs',
    difficulty: 'Easy-moderate',
    level: 'moderate',
    side: 'east',
    description:
      'Short, gradual climb through east-side pine + wildflowers to a two-tier falls. Steep first stretch then gentle. Quiet east-side option if Maple Pass is your big-hike day and you want something light.',
    hiddenGem: true,
    sourceUrl: 'https://www.wta.org/go-hiking/hikes/cedar-creek',
  },
  {
    id: 'sauk-mountain',
    name: 'Sauk Mountain',
    trailhead: 'FR 1030 off WA-20 · ~25 min west of Marblemount (west)',
    mileage: '4.2 mi RT',
    elevation: '+1,200 ft',
    duration: '2.5-3.5 hrs',
    difficulty: 'Moderate',
    level: 'moderate',
    side: 'west',
    description:
      'Wildflower-streaked switchbacks up to a 5,500 ft summit with Baker, Shuksan, Pickets, San Juans on clear days. South-facing + exposed — sun protection mandatory. Steep FR 1030 is rough but passable for the rental.',
    hiddenGem: true,
    sourceUrl: 'https://www.wta.org/go-hiking/hikes/sauk-mountain',
  },
  {
    id: 'heliotrope-ridge',
    name: 'Heliotrope Ridge',
    trailhead: 'FR 39 (Glacier Creek Rd) off WA-542 (west · Mt. Baker corridor)',
    mileage: '5.5 mi RT',
    elevation: '+1,400 ft',
    duration: '3-4 hrs',
    difficulty: 'Moderate',
    level: 'moderate',
    side: 'west',
    description:
      'Forest + meadows to a nose-to-nose Coleman Glacier overlook on Mt. Baker. Notable: a real creek crossing with slick rocks — go in the morning when flow is low. Mt. Baker corridor side trip — far from Marblemount, plan it as a Day-1 Bellingham detour or skip.',
    hiddenGem: true,
    sourceUrl: 'https://www.wta.org/go-hiking/hikes/heliotrope-ridge',
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
