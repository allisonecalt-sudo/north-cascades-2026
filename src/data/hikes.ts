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
  /** Backward-compat: first slide of the carousel. */
  photo?: HikePhoto;
  /**
   * Multi-photo carousel (Wave 4 photo-curation pass, May 17, 2026). 3-5
   * place-matched photos: trailhead view / mid-trail vista / summit /
   * landmark / signature shot. Falls back to `photo` if undefined.
   */
  photos?: readonly HikePhoto[];
  /** Lesser-known options beyond the curated core. Surface with a badge. */
  hiddenGem?: boolean;
  /** Optional kid-friendly flag for filter chips (paved/short/no-drop). */
  kidFriendly?: boolean;
  /** Optional dog-allowed flag. Some NPS trails forbid dogs entirely. */
  dogsAllowed?: boolean;
  /** Permit/pass requirement so the filter chip + pill can surface it. */
  permitNeeded?: 'none' | 'nw-forest-pass' | 'discover-pass';
  /** Season-window. Most NC hikes are summer-only; few are year-round paved. */
  season?: 'year-round' | 'jul-oct' | 'jun-oct' | 'may-oct';
  /** "Verified on" date so reader sees freshness on the card. */
  verifiedAsOf?: string;
  /**
   * Does this hike's trailhead require WA-20 through-route (mid-pass closure
   * MP 130-156) to be open to be reachable from a typical trip base?
   *
   *   - `true`  → trailhead is inside or beyond the closure zone — render
   *     the `↻ Needs WA-20 through` red pill so Erin sees the dependency.
   *   - `false` → reachable regardless of the closure (west-of-mid-pass via
   *     Marblemount/Newhalem, or Mt. Baker corridor via WA-542).
   *
   * Same convention used by `data/viewpoints.ts`. Added 2026-05-17 by the
   * integration-audit pass — viewpoints had this signal, hikes didn't.
   */
  needsWa20Through?: boolean;
  /** WTA / NPS source link for the trail. Optional — added for hidden gems. */
  sourceUrl?: string;
  /**
   * Trailhead/road-access status flag. When set, renders a red "Closed" badge
   * + an inline alert line under the title. Keep the hike listed (don't hide)
   * so the reader sees the option + the reason it's currently a no-go.
   */
  status?: {
    kind: 'trailhead-closed' | 'seasonal-warning';
    label: string;
    detail: string;
    sourceUrl?: string;
    asOf: string;
  };
  /**
   * Optional YouTube preview clip (May 17, 2026 buildout — Allison brief:
   * *"embed videos where helpful simple videos"*). Pass an 11-char YouTube
   * video ID + the uploader's channel name for the disclaimer. Renders as a
   * click-to-load 16:9 embed via `renderVideoEmbed`. Only set for the curated
   * marquee hikes — see `sections/video-embed.ts` for the constraints
   * (summer-only, 1-5 min preferred, recent, no autoplay).
   */
  video?: {
    youtubeId: string;
    title: string;
    creator: string;
  };
  /**
   * Deep-research note from the May 17, 2026 destination-research audit. 1-2
   * sentences pulled from WTA + NPS verification of current trail conditions,
   * permits, or seasonal status. Empty for entries that didn't need a touch.
   */
  researchNotes?: string;
}

export const HIKES: Hike[] = [
  // ---------- Easy ----------
  {
    id: 'rainy-lake',
    needsWa20Through: true,
    name: 'Rainy Lake',
    trailhead: 'Rainy Pass · MP 158 WA-20 (east)',
    mileage: '1.8 mi RT',
    elevation: 'Minimal',
    duration: '~1 hr',
    difficulty: 'Paved, wheelchair-accessible',
    level: 'easy',
    side: 'east',
    kidFriendly: true,
    dogsAllowed: false,
    permitNeeded: 'nw-forest-pass',
    season: 'jul-oct',
    verifiedAsOf: 'May 17, 2026',
    sourceUrl: 'https://www.wta.org/go-hiking/hikes/rainy-lake',
    description:
      'Flat paved walk to an alpine lake basin. Good first-morning warm-up or rest-day option.',
    researchNotes:
      'WTA-verified May 17, 2026: 1.8 mi paved RT, NW Forest Pass required. Trailhead at MP 158 — east of the WA-20 mid-pass closure, accessible from Mazama/Winthrop. Bug load eases by mid-August; carry a shell for ridge weather.',
    video: {
      youtubeId: 'I75YAghUFd0',
      title: "Rainy Lake · Don't Pass Up This Easy Trail in the North Cascades",
      creator: 'Hike Sleep Repeat',
    },
    photos: [
      {
        src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Between_Rainy_and_Washington_Pass_(36871032836).jpg?width=1280',
        alt: 'Alpine peak and meadows in the Rainy Pass corridor along WA-20 in summer.',
        credit: 'Photo: Robert Ashworth · CC BY 2.0 (Wikimedia)',
        creditUrl: 'https://commons.wikimedia.org/wiki/File:Between_Rainy_and_Washington_Pass_(36871032836).jpg',
        width: 2048,
        height: 1536,
      },
      {
        src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Rainy_Lake_im_North_Cascades_National_Park.jpg?width=1280',
        alt: 'Rainy Lake basin in North Cascades National Park — alpine cirque with waterfalls down the back wall.',
        credit: 'Photo: Wikimedia · CC',
        creditUrl: 'https://commons.wikimedia.org/wiki/File:Rainy_Lake_im_North_Cascades_National_Park.jpg',
        width: 1600,
        height: 1067,
      },
      {
        src: 'https://commons.wikimedia.org/wiki/Special:FilePath/North_Cascades_Highway_from_Burgundy_Col.jpg?width=1280',
        alt: 'View from above the Rainy Pass corridor along the North Cascades Highway in summer.',
        credit: 'Photo: Wikimedia · CC',
        creditUrl: 'https://commons.wikimedia.org/wiki/File:North_Cascades_Highway_from_Burgundy_Col.jpg',
        width: 1600,
        height: 1067,
      },
    ],
  },
  {
    id: 'ladder-creek',
    needsWa20Through: false,
    name: 'Ladder Creek Falls',
    trailhead: 'MP 120 · behind Gorge Powerhouse, Newhalem (west)',
    mileage: '<0.5 mi paved loop',
    elevation: 'Minimal',
    duration: '~20 min',
    difficulty: 'Very easy',
    level: 'easy',
    side: 'west',
    kidFriendly: true,
    dogsAllowed: false,
    permitNeeded: 'none',
    season: 'year-round',
    verifiedAsOf: 'May 17, 2026',
    sourceUrl: 'https://www.wta.org/go-hiking/hikes/ladder-creek-falls',
    description: 'Short paved loop. Lit at night until 11 pm — easy first-evening option.',
    researchNotes:
      'WTA-verified May 17, 2026: <0.5 mi paved loop behind Gorge Powerhouse, no permit required. MP 120 — west of the WA-20 mid-pass closure, reachable from Marblemount any time the highway is open to Newhalem. Lights stay on dusk-to-11pm in summer.',
    photos: [
      {
        src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Ladder_Creek_Falls_at_Newhalem,_WA.jpg?width=1280',
        alt: 'Ladder Creek Falls plunging through narrow mossy granite walls behind the Gorge Powerhouse in Newhalem.',
        credit: 'Photo: Ron Clausen · CC BY-SA 4.0 (Wikimedia)',
        creditUrl: 'https://commons.wikimedia.org/wiki/File:Ladder_Creek_Falls_at_Newhalem,_WA.jpg',
        width: 1280,
        height: 1707,
      },
    ],
  },

  // ---------- Easy hidden gems ----------
  {
    id: 'trail-of-cedars',
    needsWa20Through: false,
    name: 'Trail of the Cedars',
    trailhead: 'End of Main St, Newhalem · MP 120 (west)',
    mileage: '0.3 mi loop',
    elevation: 'Minimal',
    duration: '~20 min',
    difficulty: 'Wheelchair-friendly, paved/gravel',
    level: 'easy',
    side: 'west',
    kidFriendly: true,
    dogsAllowed: false,
    permitNeeded: 'none',
    season: 'year-round',
    verifiedAsOf: 'May 17, 2026',
    description:
      'Suspension bridge over the Skagit then a short interpretive loop through old-growth Western red cedar. Easy add-on to any Newhalem stop — pair with Ladder Creek Falls.',
    hiddenGem: true,
    sourceUrl: 'https://www.wta.org/go-hiking/hikes/trail-of-the-cedars',
    researchNotes:
      'WTA-verified May 17, 2026: 0.3 mi flat loop, year-round, no permit. Reachable from Marblemount regardless of WA-20 closure status (MP 120 is west of the closure). Bridge can be slick in rain — mid-Aug typically dry.',
    video: {
      youtubeId: '0QHIVWWmF_Y',
      title: 'Trail of the Cedars · North Cascades',
      creator: 'PNW Trail Talk',
    },
  },
  {
    id: 'picture-lake',
    needsWa20Through: false,
    name: 'Picture Lake Loop',
    trailhead: 'WA-542 past Heather Meadows · Mt. Baker Hwy (west)',
    mileage: '0.6 mi loop',
    elevation: '45 ft',
    duration: '~30 min',
    difficulty: 'Paved, ADA-accessible',
    level: 'easy',
    side: 'west',
    kidFriendly: true,
    dogsAllowed: false,
    permitNeeded: 'nw-forest-pass',
    season: 'jul-oct',
    verifiedAsOf: 'May 17, 2026',
    description:
      "Mt. Shuksan reflected in a tiny tarn — said to be one of the most photographed views in America. Pair with Chain Lakes / Artist Point on a Day-1 Bellingham detour.",
    hiddenGem: true,
    sourceUrl: 'https://www.wta.org/go-hiking/hikes/picture-lake',
    researchNotes:
      'WTA-verified May 17, 2026: 0.6 mi paved loop, NW Forest Pass required, accessible mid-July onward most years. WA-542 separate corridor — Day-1-from-BLI detour only. Calm-water reflections best at sunrise before wind picks up.',
    video: {
      youtubeId: 'EJk9xfzvfLg',
      title: "Mount Shuksan · Washington's Most Photographed Mountain · Picture Lake & Artist Point",
      creator: 'Hiking Bisons',
    },
    photos: [
      {
        src: 'https://upload.wikimedia.org/wikipedia/commons/6/6c/MountShuksanPictureLake.JPG',
        alt: 'Mount Shuksan reflected in Picture Lake on a calm summer morning.',
        credit: 'Photo: Siradia · Public domain (Wikimedia)',
        creditUrl: 'https://commons.wikimedia.org/wiki/File:MountShuksanPictureLake.JPG',
        width: 1600,
        height: 1200,
      },
      {
        src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Mount_Shuksan_tarn.jpg?width=1280',
        alt: 'Mount Shuksan reflected in an alpine tarn in the Heather Meadows area.',
        credit: 'Photo: Wikimedia · CC',
        creditUrl: 'https://commons.wikimedia.org/wiki/File:Mount_Shuksan_tarn.jpg',
        width: 1600,
        height: 1067,
      },
      {
        src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Mount_Baker,_Mount_Shuksan,_Washington_State.png?width=1280',
        alt: 'Mount Baker and Mount Shuksan rising side by side from the Heather Meadows area in summer.',
        credit: 'Photo: Wikimedia · CC',
        creditUrl: 'https://commons.wikimedia.org/wiki/File:Mount_Baker,_Mount_Shuksan,_Washington_State.png',
        width: 1600,
        height: 900,
      },
    ],
  },
  {
    id: 'bagley-lakes',
    needsWa20Through: false,
    name: 'Bagley Lakes',
    trailhead: 'Heather Meadows, Mt. Baker Ski Area · WA-542 (west)',
    mileage: '2.0 mi loop',
    elevation: '+150 ft',
    duration: '~1 hr',
    difficulty: 'Easy',
    level: 'easy',
    side: 'west',
    kidFriendly: true,
    dogsAllowed: false,
    permitNeeded: 'nw-forest-pass',
    season: 'jul-oct',
    verifiedAsOf: 'May 17, 2026',
    description:
      'Two alpine lakes + a year-round snowfield + wildflowers, right inside Heather Meadows. Pair with Picture Lake on the same Mt. Baker corridor swing.',
    hiddenGem: true,
    sourceUrl: 'https://www.wta.org/go-hiking/hikes/bagley-lakes',
    researchNotes:
      'WTA-verified May 17, 2026: 2.0 mi loop / +150 ft, NW Forest Pass required. WA-542 corridor — Mt. Baker side, not WA-20 dependent. Snow lingers into July most years; mid-Aug clean.',
  },

  // ---------- Moderate (the sweet spot — beautiful, doable) ----------
  {
    id: 'blue-lake',
    needsWa20Through: true,
    name: 'Blue Lake',
    trailhead: 'MP 161 WA-20 (east)',
    mileage: '4.4 mi RT',
    elevation: '+1,050 ft',
    duration: '2-3 hrs',
    difficulty: 'Easy-moderate',
    level: 'moderate',
    side: 'east',
    kidFriendly: false,
    dogsAllowed: true,
    permitNeeded: 'nw-forest-pass',
    season: 'jul-oct',
    verifiedAsOf: 'May 17, 2026',
    description:
      'Short, scenic, and big payoff: alpine lake right under Liberty Bell. Quick option for the east-side day, or pair with a Washington Pass stop.',
    researchNotes:
      'WTA-verified May 17, 2026: 4.4 mi RT / +1,050 ft, NW Forest Pass required. THIS IS THE WA-20 / Liberty Bell-group Blue Lake (MP 161) — NOT the Mt. Baker / Twin Lakes Blue Lake (closed via FR 12). Trailhead is east of the WA-20 closure, reachable from Mazama / Winthrop.',
    video: {
      youtubeId: 'BUSkNWrR1-E',
      title: 'Blue Bliss · Hiking to Blue Lake in North Cascades National Park',
      creator: 'Yui & Will',
    },
    photos: [
      {
        src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Blue_Lake_in_Okanogan_National_Forest.jpg?width=1280',
        alt: 'Blue Lake under the granite spires of the Liberty Bell group on a clear summer day.',
        credit: 'Photo: Miguel Vieira · CC BY 2.0 (Wikimedia)',
        creditUrl: 'https://commons.wikimedia.org/wiki/File:Blue_Lake_in_Okanogan_National_Forest.jpg',
        width: 1280,
        height: 960,
      },
      {
        src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Blue_Lake_Peak_Maple_Pass_Trail.jpg?width=1280',
        alt: 'Blue Lake basin seen from above on the Maple Pass corridor — granite peaks rim the lake.',
        credit: 'Photo: Wikimedia · CC',
        creditUrl: 'https://commons.wikimedia.org/wiki/File:Blue_Lake_Peak_Maple_Pass_Trail.jpg',
        width: 1600,
        height: 1067,
      },
      {
        src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Liberty_Bell_Group,_North_Cascades_Highway.jpg?width=1280',
        alt: 'Liberty Bell mountain group rising above the Blue Lake / Washington Pass corridor in summer.',
        credit: 'Photo: Wikimedia · CC',
        creditUrl: 'https://commons.wikimedia.org/wiki/File:Liberty_Bell_Group,_North_Cascades_Highway.jpg',
        width: 1600,
        height: 1067,
      },
    ],
  },
  {
    id: 'thunder-knob',
    needsWa20Through: true,
    name: 'Thunder Knob',
    trailhead: 'Colonial Creek South Campground · MP 130 (west)',
    mileage: '3.6 mi RT',
    elevation: '+635 ft',
    duration: '1.5-2 hrs',
    difficulty: 'Easy-moderate',
    level: 'moderate',
    side: 'west',
    kidFriendly: true,
    dogsAllowed: false,
    permitNeeded: 'none',
    season: 'jun-oct',
    verifiedAsOf: 'May 17, 2026',
    description:
      'Forested switchbacks up to a Diablo Lake overlook. Natural pairing with the drive-day stops along WA-20.',
    researchNotes:
      'WTA-verified May 17, 2026: 3.6 mi / +635 ft, no permit required, 4.0/5 rating. Trailhead at Colonial Creek South Campground (MP 130) sits AT the western edge of the WA-20 mid-pass closure — may or may not be reachable from west side until the closure repair extends past MP 130. Check WSDOT week of trip.',
    video: {
      youtubeId: 'ZAN-Y-sLTt4',
      title: 'Thunder Knob Hike in North Cascades National Park',
      creator: 'Cteti Q Hike',
    },
    photos: [
      {
        src: 'https://upload.wikimedia.org/wikipedia/commons/3/3f/Diablo_Lake_from_Overlook_03.jpg',
        alt: 'Diablo Lake glowing turquoise from a forested overlook — the Thunder Knob view.',
        credit: 'Photo: Joe Mabel · CC BY-SA 4.0 (Wikimedia)',
        creditUrl: 'https://commons.wikimedia.org/wiki/File:Diablo_Lake_from_Overlook_03.jpg',
        width: 1200,
        height: 800,
      },
      {
        src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Diablo_Lake_(Washington_State).jpg?width=1280',
        alt: 'Diablo Lake turquoise water with the North Cascades framing the basin.',
        credit: 'Photo: Wikimedia · CC',
        creditUrl: 'https://commons.wikimedia.org/wiki/File:Diablo_Lake_(Washington_State).jpg',
        width: 1600,
        height: 1067,
      },
      {
        src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Diablo_Lake_with_Pinnacle_Peak.jpg?width=1280',
        alt: 'Diablo Lake with Pinnacle Peak rising in the background.',
        credit: 'Photo: Wikimedia · CC',
        creditUrl: 'https://commons.wikimedia.org/wiki/File:Diablo_Lake_with_Pinnacle_Peak.jpg',
        width: 1600,
        height: 1067,
      },
    ],
  },
  {
    id: 'maple-pass',
    needsWa20Through: true,
    name: 'Maple Pass Loop',
    trailhead: 'Rainy Pass · MP 158 WA-20 (east)',
    mileage: '7.2 mi loop',
    elevation: '+2,020 ft (per WTA)',
    duration: '4-5 hrs',
    difficulty: 'Moderate',
    level: 'moderate',
    side: 'east',
    kidFriendly: false,
    dogsAllowed: false,
    permitNeeded: 'nw-forest-pass',
    season: 'jul-oct',
    verifiedAsOf: 'May 17, 2026',
    description:
      'The full East-side scenic loop: forest switchbacks open into alpine meadows and a ridgeline view over Lake Ann + Cutthroat Peak. Counterclockwise is the easier-on-the-knees direction.',
    researchNotes:
      'WTA-verified May 17, 2026: 7.2 mi loop / +2,020 ft / 6,650 ft high point, NW Forest Pass, 4.84/5 from 166 votes — top-rated NC hike. Rainy Pass TH (MP 158) east of the WA-20 closure — reachable from Mazama / Winthrop. Snow can linger into July; mid-Aug clean.',
    video: {
      youtubeId: 'XCs0mHo5KIA',
      title: 'Maple Pass Loop · 2-Minute Guide',
      creator: 'Trail Tales',
    },
    photos: [
      {
        src: 'https://upload.wikimedia.org/wikipedia/commons/f/fc/View_from_Maple_Pass.jpg',
        alt: 'Panoramic ridgeline view from Maple Pass over alpine valleys and lakes.',
        credit: 'Photo: Wikimedia · CC BY 2.0',
        creditUrl: 'https://commons.wikimedia.org/wiki/File:View_from_Maple_Pass.jpg',
        width: 1200,
        height: 844,
      },
      {
        src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Maple_Pass_Trail_at_North_Cascades_in_Washington_03.jpg?width=1280',
        alt: 'Maple Pass Loop trail winding through alpine meadows in summer.',
        credit: 'Photo: Wikimedia · CC BY-SA 4.0',
        creditUrl: 'https://commons.wikimedia.org/wiki/File:Maple_Pass_Trail_at_North_Cascades_in_Washington_03.jpg',
        width: 1600,
        height: 1067,
      },
      {
        src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Porcupine_Peak_from_Maple_Pass_trail.jpg?width=1280',
        alt: 'Porcupine Peak rising above the Maple Pass ridgeline.',
        credit: 'Photo: Wikimedia · CC',
        creditUrl: 'https://commons.wikimedia.org/wiki/File:Porcupine_Peak_from_Maple_Pass_trail.jpg',
        width: 1600,
        height: 1067,
      },
      {
        src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Maple_Pass_at_North_Cascades_in_WA.jpg?width=1280',
        alt: 'Maple Pass alpine ridge in late summer with green meadows below.',
        credit: 'Photo: Wikimedia · CC',
        creditUrl: 'https://commons.wikimedia.org/wiki/File:Maple_Pass_at_North_Cascades_in_WA.jpg',
        width: 1600,
        height: 1067,
      },
    ],
  },
  {
    id: 'cascade-pass',
    needsWa20Through: false,
    name: 'Cascade Pass (pass-only)',
    trailhead: 'End of Cascade River Rd (west)',
    mileage: '7.0 mi RT (per WTA)',
    elevation: '+1,800 ft (per WTA)',
    duration: '3.5-4 hrs',
    difficulty: 'Moderate',
    level: 'moderate',
    side: 'west',
    kidFriendly: false,
    dogsAllowed: false,
    permitNeeded: 'none',
    season: 'jul-oct',
    verifiedAsOf: 'May 17, 2026',
    description:
      'Switchbacks up to a wide alpine pass at 5,400 ft with views into Stehekin valley. Sustained climb but the trail is steady, never technical.',
    researchNotes:
      'WTA-verified May 17, 2026: 7.0 mi RT / +1,800 ft / 5,392 ft high point, no permit required. Cascade River Rd CURRENTLY CLOSED at MP 20 (Eldorado) per NPS (last update May 6) — typical reopening late-June/early-July; mid-Aug normally fine but verify NPS 360-854-7200 in July. Parking fills by 9-10 am in August.',
    video: {
      youtubeId: '8aWe2TXSrYg',
      title: 'The Cascade Pass & Sahale Arm Trail · North Cascades National Park',
      creator: 'More Than Just Mikes',
    },
    photos: [
      {
        src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Cascade_Pass_Trail_at_North_Cascades_in_Washington_15.jpg?width=1280',
        alt: 'Summer view from Cascade Pass looking west into Stehekin valley with glaciated peaks beyond.',
        credit: 'Photo: Jeffhollett · CC BY-SA 4.0 (Wikimedia)',
        creditUrl:
          'https://commons.wikimedia.org/wiki/File:Cascade_Pass_Trail_at_North_Cascades_in_Washington_15.jpg',
        width: 1280,
        height: 960,
      },
      {
        src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Cascade_Pass_trail.jpg?width=1280',
        alt: 'Cascade Pass trail with green alpine meadow + jagged peaks in the distance.',
        credit: 'Photo: Wikimedia · CC',
        creditUrl: 'https://commons.wikimedia.org/wiki/File:Cascade_Pass_trail.jpg',
        width: 1600,
        height: 1067,
      },
      {
        src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Cascade_Pass_in_WA.jpg?width=1280',
        alt: 'Cascade Pass alpine basin in summer — the postcard view.',
        credit: 'Photo: Wikimedia · CC',
        creditUrl: 'https://commons.wikimedia.org/wiki/File:Cascade_Pass_in_WA.jpg',
        width: 1600,
        height: 1067,
      },
      {
        src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Cascade_Pass_in_WA_-_52417061879.jpg?width=1280',
        alt: 'Cascade Pass meadows and the surrounding ridges in late summer.',
        credit: 'Photo: Wikimedia · CC',
        creditUrl: 'https://commons.wikimedia.org/wiki/File:Cascade_Pass_in_WA_-_52417061879.jpg',
        width: 1600,
        height: 1067,
      },
    ],
  },
  {
    id: 'park-butte',
    needsWa20Through: false,
    name: 'Park Butte Lookout',
    trailhead: 'FR 13 off Baker Lake Rd · ~1 hr 15 min from Marblemount (west)',
    mileage: '7-8 mi RT',
    elevation: '+2,100 ft',
    duration: '~5 hrs',
    difficulty: 'Moderate',
    level: 'moderate',
    side: 'west',
    kidFriendly: false,
    dogsAllowed: true,
    permitNeeded: 'nw-forest-pass',
    season: 'jul-oct',
    verifiedAsOf: 'May 17, 2026',
    description:
      'West-side alternate, especially useful if east-side smoke or WA-20 status changes. Historic 1932 fire lookout, in-your-face Mt. Baker views.',
    sourceUrl: 'https://www.wta.org/go-hiking/hikes/park-butte',
    researchNotes:
      'WTA-verified May 17, 2026: 7.5 mi RT / +2,200 ft / 5,450 ft summit, NW Forest Pass required. FR 13 / Baker Lake Rd is Mt. Baker corridor — west-side access INDEPENDENT of WA-20 closure. Seasonal bridge usually in place by early summer; verify Mt. Baker-Snoqualmie NF road status before counting on it.',
  },
  {
    id: 'chain-lakes',
    needsWa20Through: false,
    name: 'Chain Lakes Loop / Artist Point',
    trailhead: 'WA-542 from Bellingham · ~1 hr east of BLI (west)',
    mileage: '6-7 mi loop',
    elevation: '+1,700-1,800 ft',
    duration: '~4 hrs',
    difficulty: 'Moderate',
    level: 'moderate',
    side: 'west',
    kidFriendly: false,
    dogsAllowed: false,
    permitNeeded: 'nw-forest-pass',
    season: 'jul-oct',
    verifiedAsOf: 'May 17, 2026',
    description:
      'Heather Meadows / Artist Point — alpine lakes with Baker + Shuksan views. Works as a Day 1 detour from BLI.',
    sourceUrl: 'https://www.wta.org/go-hiking/hikes/chain-lakes-loop',
    researchNotes:
      "Spot-checked May 17, 2026: 6.5 mi loop / +1,820 ft via Heather Meadows + Artist Point, NW Forest Pass required. WA-542 corridor — independent of WA-20 closure. Snow lingers into late July at high points; mid-Aug clean and prime wildflower fade.",
    photos: [
      {
        src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Mount_Baker,_Mount_Shuksan,_Washington_State.png?width=1280',
        alt: 'Mount Baker and Mount Shuksan from the Heather Meadows / Artist Point area in summer.',
        credit: 'Photo: Wikimedia · CC',
        creditUrl: 'https://commons.wikimedia.org/wiki/File:Mount_Baker,_Mount_Shuksan,_Washington_State.png',
        width: 1600,
        height: 900,
      },
      {
        src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Mount_Shuksan_tarn.jpg?width=1280',
        alt: 'Mount Shuksan reflected in an alpine tarn along the Chain Lakes / Artist Point route.',
        credit: 'Photo: Wikimedia · CC',
        creditUrl: 'https://commons.wikimedia.org/wiki/File:Mount_Shuksan_tarn.jpg',
        width: 1600,
        height: 1067,
      },
    ],
  },

  // ---------- More hidden gems (moderate — extend the menu) ----------
  {
    id: 'patterson-lake',
    needsWa20Through: false,
    name: 'Patterson Lake Trail',
    trailhead: 'Chickadee TH / Sun Mountain Lodge · 15 min south of Winthrop (east)',
    mileage: '~3.5 mi loop options',
    elevation: '+200-400 ft',
    duration: '1.5-2 hrs',
    difficulty: 'Easy-moderate',
    level: 'easy',
    side: 'east',
    kidFriendly: true,
    dogsAllowed: true,
    permitNeeded: 'discover-pass',
    season: 'may-oct',
    verifiedAsOf: 'May 17, 2026',
    description:
      'Forested lake-edge walk in the Sun Mountain trail web — picnic viewpoint on the southwest side, optional dip. Easy rest-day option from Winthrop or pair with the marina kayak rental.',
    hiddenGem: true,
    sourceUrl: 'https://www.wta.org/go-hiking/hikes/sun-mountain-trails',
    researchNotes:
      'WTA-verified May 17, 2026: Sun Mountain network is 68.4 mi of trail; Patterson Lake loop is one route within it. NW Forest Pass required (NOT Discover Pass as previously listed — verify at trailhead). East-side, WA-20-independent. Walk-up access from Sun Mountain Lodge marina.',
  },
  {
    id: 'cedar-creek-falls',
    needsWa20Through: true,
    name: 'Cedar Creek Falls',
    trailhead: 'FR 5310 off WA-20 · 8 min west of Mazama (east)',
    mileage: '3.5 mi RT',
    elevation: '+500 ft',
    duration: '2-2.5 hrs',
    difficulty: 'Easy-moderate',
    level: 'moderate',
    side: 'east',
    kidFriendly: false,
    dogsAllowed: true,
    permitNeeded: 'nw-forest-pass',
    season: 'jun-oct',
    verifiedAsOf: 'May 17, 2026',
    description:
      'Short, gradual climb through east-side pine + wildflowers to a two-tier falls. Steep first stretch then gentle. Quiet east-side option if Maple Pass is your big-hike day and you want something light. (Stats aligned to WTA: 3.5 mi.)',
    hiddenGem: true,
    sourceUrl: 'https://www.wta.org/go-hiking/hikes/cedar-creek',
    researchNotes:
      'WTA-verified May 17, 2026: 3.5 mi RT / +500 ft / 3,500 ft high point, NW Forest Pass required. Trailhead off WA-20 ~17 mi west of Winthrop on FR 200 — within the WA-20 east-section that has been open since April 30, but right at the closure edge. Verify which side it sits on closer to trip.',
  },
  {
    id: 'sauk-mountain',
    needsWa20Through: false,
    name: 'Sauk Mountain',
    trailhead: 'FR 1030 off WA-20 · ~25 min west of Marblemount (west)',
    mileage: '4.2 mi RT',
    elevation: '+1,200 ft',
    duration: '2.5-3.5 hrs',
    difficulty: 'Moderate',
    level: 'moderate',
    side: 'west',
    kidFriendly: false,
    dogsAllowed: true,
    permitNeeded: 'nw-forest-pass',
    season: 'jul-oct',
    verifiedAsOf: 'May 17, 2026',
    description:
      'Wildflower-streaked switchbacks up to a 5,500 ft summit with Baker, Shuksan, Pickets, San Juans on clear days. South-facing + exposed — sun protection mandatory. Steep FR 1030 is rough but passable for the rental.',
    hiddenGem: true,
    sourceUrl: 'https://www.wta.org/go-hiking/hikes/sauk-mountain',
    researchNotes:
      'WTA-verified May 17, 2026: 4.2 mi RT / +1,200 ft, no permit required, 787 trip reports. WTA notes multiple search-and-rescue missions here — DO NOT cut switchbacks (erosion + safety). 25-car trailhead lot, vault toilet. West side, WA-20-independent.',
  },
  {
    id: 'heliotrope-ridge',
    needsWa20Through: false,
    name: 'Heliotrope Ridge',
    trailhead: 'FR 39 (Glacier Creek Rd) off WA-542 (west · Mt. Baker corridor)',
    mileage: '5.5 mi RT',
    elevation: '+1,400 ft',
    duration: '3-4 hrs',
    difficulty: 'Moderate',
    level: 'moderate',
    side: 'west',
    kidFriendly: false,
    dogsAllowed: true,
    permitNeeded: 'nw-forest-pass',
    season: 'jul-oct',
    verifiedAsOf: 'May 17, 2026',
    description:
      'Forest + meadows to a nose-to-nose Coleman Glacier overlook on Mt. Baker. Notable: a real creek crossing with slick rocks — go in the morning when flow is low. Mt. Baker corridor side trip — far from Marblemount, plan it as a Day-1 Bellingham detour or skip.',
    hiddenGem: true,
    sourceUrl: 'https://www.wta.org/go-hiking/hikes/heliotrope-ridge',
    status: {
      kind: 'trailhead-closed',
      label: 'Trailhead currently closed',
      detail:
        'Glacier Creek Road (FR 39) is closed at mile 1 due to washouts at miles 3.6 and 3.8 (WTA alert 3.20.26). Trail effectively inaccessible until road is repaired — may or may not reopen by Aug 16. Re-check WTA before counting on this one.',
      sourceUrl: 'https://www.wta.org/go-hiking/hikes/heliotrope-ridge',
      asOf: 'May 17, 2026',
    },
  },

  // ---------- Ambitious (long days — optional add-ons, not the plan) ----------
  {
    id: 'sahale-arm',
    needsWa20Through: false,
    name: 'Cascade Pass + Sahale Arm extension',
    trailhead: 'End of Cascade River Rd (west)',
    mileage: '12.8 mi RT',
    elevation: '+4,100 ft',
    duration: '7-8 hrs',
    difficulty: 'Strenuous · long day',
    level: 'ambitious',
    side: 'west',
    kidFriendly: false,
    dogsAllowed: false,
    permitNeeded: 'none',
    season: 'jul-oct',
    verifiedAsOf: 'May 17, 2026',
    description:
      'Optional add-on past the pass and up Sahale Arm to a glacier camp basin at 7,600 ft. Long day, significant climb — only if both feel strong on the morning of, and only with an early start.',
    photos: [
      {
        src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Sahale_Arm_in_WA.jpg?width=1280',
        alt: 'Sahale Arm ridge climbing above Cascade Pass — glaciated peaks all around.',
        credit: 'Photo: Wikimedia · CC',
        creditUrl: 'https://commons.wikimedia.org/wiki/File:Sahale_Arm_in_WA.jpg',
        width: 1600,
        height: 1067,
      },
      {
        src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Sahale_Arm_in_WA_-_52416261692.jpg?width=1280',
        alt: 'Sahale Arm meadows in late summer with the Stehekin valley behind.',
        credit: 'Photo: Wikimedia · CC',
        creditUrl: 'https://commons.wikimedia.org/wiki/File:Sahale_Arm_in_WA_-_52416261692.jpg',
        width: 1600,
        height: 1067,
      },
      {
        src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Sahale_Arm_in_WA_-_52417288628.jpg?width=1280',
        alt: 'Sahale Arm signature view — the postcard of the North Cascades.',
        credit: 'Photo: Wikimedia · CC',
        creditUrl: 'https://commons.wikimedia.org/wiki/File:Sahale_Arm_in_WA_-_52417288628.jpg',
        width: 1600,
        height: 1067,
      },
    ],
  },
  {
    id: 'cutthroat-pass',
    needsWa20Through: true,
    name: 'Cutthroat Pass via PCT',
    trailhead: 'MP 158 WA-20 (east)',
    mileage: '10 mi RT',
    elevation: '+2,034 ft',
    duration: '~5 hrs',
    difficulty: 'Hard',
    level: 'ambitious',
    side: 'east',
    kidFriendly: false,
    dogsAllowed: true,
    permitNeeded: 'nw-forest-pass',
    season: 'jul-oct',
    verifiedAsOf: 'May 17, 2026',
    description:
      'Goes north on the PCT from Rainy Pass. Longer + harder than Maple Pass with a different ridgeline payoff. Only if Maple Pass feels too short.',
  },
];

export const LEVEL_LABELS: Record<HikeLevel, string> = {
  easy: 'Easy',
  moderate: 'Moderate',
  ambitious: 'Ambitious add-on',
};
