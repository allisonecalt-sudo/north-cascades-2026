/**
 * towns.ts — corridor town profiles (RICHER schema, May 17, 2026).
 *
 * Why this file expanded: Allison live-note May 17 — *"Could destinations use
 * more beefing up? Reference austria"* — the previous town cards (4 bullets +
 * 1 wiki link) didn't match Austria's per-base depth. Erin profile (May 17)
 * says *"happy to visit towns if interesting."* So towns get the same
 * Booking-tier treatment as lodging + hikes + activities: photo carousel,
 * walkability rating, drive-times from each base, season + parking notes,
 * verified-date badges.
 *
 * NOT a restaurant page. Both Allison + Erin keep kosher and cook in. See
 * [[feedback_food_not_central_to_trips]]. Town content is about character /
 * walkability / shops / what's there for a between-hikes wander.
 *
 * What's decided (towns chosen):
 *   - Marblemount — west gateway, cabin cluster, Cascade River Rd splits off
 *   - Newhalem    — NPS company town, Ladder Creek Falls, no overnight
 *   - Concrete    — west, big-but-quiet, on the drive in from Bellingham
 *   - Mazama      — east, smallest, closest to Rainy/Maple Pass
 *   - Winthrop    — east, Old-West boardwalk, biggest east-side stop
 *
 * Photos: Wikimedia (corridor/town-authentic) + already-verified PHOTOS catalog
 * shots from lodging.ts (regional context). All HEAD-verified May 17, 2026.
 */

import type { LodgingPhoto } from './lodging';
import type { CarouselPhoto } from '../sections/photo-carousel';

/** Walkability — how much you can leave the car and just stroll. */
export type Walkability = 'high' | 'medium' | 'low' | 'none';

/** Best season for visiting (the trip is mid-Aug — but season notes still useful). */
export type SeasonNote = string;

export interface Town {
  id: string;
  name: string;
  side: 'west' | 'east';
  /** One-line vibe (boardwalk old-west, NPS company town, etc.). */
  tagline: string;
  /** Path filter — show on cards for these paths (or 'all'). */
  paths: ('A' | 'B' | 'C')[] | 'all';
  /** Summer vibe one-liner — green meadows / dusty heat / cool river / etc. */
  summerVibe: string;
  /** 2-line "why stop here" lede above the bullets. */
  whyStop: string;
  /** 3-5 short character bullets. NOT restaurants — vibe, shops, streets, walks. */
  bullets: string[];
  /** Practical bits: where it sits on the corridor + what's there for kosher self-cater. */
  practical: string;
  /** Walkability rating — high/medium/low/none. */
  walkability: Walkability;
  /** Short walkability detail (what you can walk to). */
  walkabilityNote: string;
  /** Drive minutes from Marblemount (west base). null if the town IS Marblemount. */
  driveFromMarblemountMin: number | null;
  /** Drive minutes from Winthrop (east base). null if the town IS Winthrop. */
  driveFromWinthropMin: number | null;
  /** Best season for visiting + why. */
  bestSeason: SeasonNote;
  /** Parking notes — free street / lot / RV-friendly / etc. */
  parking: string;
  /** Shops + character bullets (NOT restaurants). */
  shops: string[];
  /** Wikipedia link for the curious. */
  wikiUrl: string;
  /** Optional second link (NPS, town site, trail network). */
  extraLink?: { label: string; url: string };
  /** When the town's facts were last verified (renders as badge). */
  verifiedOn: string;
  /** Hero photo for the card (preserved for back-compat — equals photos[0]). */
  photo: LodgingPhoto;
  /** 3-5 carousel photos. First = hero. */
  photos: CarouselPhoto[];
}

// =============================================================================
// Photo helpers — pull from already-verified PHOTOS catalog when possible.
// Wikimedia URLs below were HEAD-verified May 17, 2026 (200, image/jpeg, >5KB).
// =============================================================================

const PHOTO_WA20: CarouselPhoto = {
  src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Washington_Highway_20_North_Cascades.jpg/1280px-Washington_Highway_20_North_Cascades.jpg',
  alt: 'WA-20 winding through the North Cascades corridor in summer — green ridges, the road threading through.',
  credit: 'Photo: Wikimedia · CC',
  creditUrl: 'https://commons.wikimedia.org/wiki/File:Washington_Highway_20_North_Cascades.jpg',
  width: 1280,
  height: 853,
};

const PHOTO_MARBLEMOUNT: CarouselPhoto = {
  src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Marblemount_Community_Club.jpg/960px-Marblemount_Community_Club.jpg',
  alt: 'Marblemount, WA — Community Club building set in evergreens in summer.',
  credit: 'Photo: Wikimedia · CC',
  creditUrl: 'https://commons.wikimedia.org/wiki/File:Marblemount_Community_Club.jpg',
  width: 900,
  height: 600,
};

const PHOTO_NEWHALEM: CarouselPhoto = {
  src: 'https://upload.wikimedia.org/wikipedia/commons/7/73/Newhalem_25887_crop.jpg',
  alt: 'Newhalem, the Seattle City Light company town along the Skagit River.',
  credit: 'Photo: Wikimedia · CC',
  creditUrl: 'https://commons.wikimedia.org/wiki/File:Newhalem_25887_crop.jpg',
  width: 1280,
  height: 853,
};

const PHOTO_DIABLO: CarouselPhoto = {
  src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Diablo_Lake_%28Washington_State%29.jpg/960px-Diablo_Lake_%28Washington_State%29.jpg',
  alt: 'Diablo Lake, WA — turquoise glacial water surrounded by forested ridges in summer.',
  credit: 'Photo: Wikimedia · CC',
  creditUrl: 'https://commons.wikimedia.org/wiki/File:Diablo_Lake_(Washington_State).jpg',
  width: 960,
  height: 598,
};

const PHOTO_WASHINGTON_PASS: CarouselPhoto = {
  src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Washington_pass_overlook.jpg/960px-Washington_pass_overlook.jpg',
  alt: 'Washington Pass overlook in summer — Liberty Bell Mountain group against clear blue sky.',
  credit: 'Photo: Wikimedia · CC',
  creditUrl: 'https://commons.wikimedia.org/wiki/File:Washington_pass_overlook.jpg',
  width: 960,
  height: 710,
};

const PHOTO_MAZAMA: CarouselPhoto = {
  src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Mazama%2C_Washington.JPG/960px-Mazama%2C_Washington.JPG',
  alt: 'Mazama, Washington — tall-grass meadow in the Methow Valley with the Cascades behind, summer.',
  credit: 'Photo: Wikimedia · CC',
  creditUrl: 'https://commons.wikimedia.org/wiki/File:Mazama,_Washington.JPG',
  width: 960,
  height: 720,
};

const PHOTO_METHOW_RIVER: CarouselPhoto = {
  src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Methow_River.JPG/960px-Methow_River.JPG',
  alt: 'Methow River near Mazama — turquoise river flowing through evergreen forest, summer.',
  credit: 'Photo: Wikimedia · CC',
  creditUrl: 'https://commons.wikimedia.org/wiki/File:Methow_River.JPG',
  width: 960,
  height: 720,
};

const PHOTO_METHOW_SUNSET: CarouselPhoto = {
  src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Methow_River_near_Pateros_at_sunset.jpg/960px-Methow_River_near_Pateros_at_sunset.jpg',
  alt: 'Methow River at sunset — orange-and-red sky over the river and Methow hills.',
  credit: 'Photo: Wikimedia · CC',
  creditUrl: 'https://commons.wikimedia.org/wiki/File:Methow_River_near_Pateros_at_sunset.jpg',
  width: 960,
  height: 720,
};

const PHOTO_PATTERSON: CarouselPhoto = {
  src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/PattersonLake_Winthrop.jpg/960px-PattersonLake_Winthrop.jpg',
  alt: 'Patterson Lake, Winthrop — alpine lake with wildflowers and rolling Methow hills in summer.',
  credit: 'Photo: Wikimedia · CC',
  creditUrl: 'https://commons.wikimedia.org/wiki/File:PattersonLake_Winthrop.jpg',
  width: 960,
  height: 720,
};

const PHOTO_WINTHROP: CarouselPhoto = {
  src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Winthrop%2C_USA_%2819801491829%29.jpg/1280px-Winthrop%2C_USA_%2819801491829%29.jpg',
  alt: 'Winthrop main street with wooden boardwalks, false-front Old-West buildings, and mountain backdrop in summer.',
  credit: 'Photo: Wikimedia · CC',
  creditUrl: 'https://commons.wikimedia.org/wiki/File:Winthrop,_USA_(19801491829).jpg',
  width: 1280,
  height: 853,
};

const PHOTO_CONCRETE: CarouselPhoto = {
  src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Concrete_town_hall.jpg/960px-Concrete_town_hall.jpg',
  alt: 'Concrete, WA town hall in summer — green-painted historic building with the US flag flying.',
  credit: 'Photo: Wikimedia · CC',
  creditUrl: 'https://commons.wikimedia.org/wiki/File:Concrete_town_hall.jpg',
  width: 960,
  height: 630,
};

// Reuse already-verified Unsplash cabin/river shots from lodging.ts PHOTOS
// catalog (carousel-grade, summer-palette, no snow).
const PHOTO_CABIN_RIVER: CarouselPhoto = {
  src: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=800&q=70',
  alt: 'Cabin beside a forested river — representative of the Marblemount cabin corridor.',
  credit: 'Photo: Cherise Evertz / Unsplash',
  creditUrl: 'https://unsplash.com/photos/RX2VAhJ9Ll8',
  width: 800,
  height: 533,
};

const PHOTO_FOREST: CarouselPhoto = {
  src: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=70',
  alt: 'Dense evergreen forest with shafts of morning light — typical of the Skagit corridor.',
  credit: 'Photo: Sebastian Unrau / Unsplash',
  creditUrl: 'https://unsplash.com/photos/sp-p7uuT0tw',
  width: 800,
  height: 533,
};

const PHOTO_INN_CLASSIC: CarouselPhoto = {
  src: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=800&q=70',
  alt: 'Classic two-story inn with porch and country setting — representative of corridor lodging vibe.',
  credit: 'Photo: Marvin Meyer / Unsplash',
  creditUrl: 'https://unsplash.com/photos/SYTO3xs06fU',
  width: 800,
  height: 533,
};

const PHOTO_DECK_GOLDEN: CarouselPhoto = {
  src: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=800&q=70',
  alt: 'Wooden deck and chairs overlooking pine forest at golden hour — vibe shot.',
  credit: 'Photo: Unsplash',
  creditUrl: 'https://unsplash.com/photos/e29da59ef1c2',
  width: 800,
  height: 533,
};

// =============================================================================
// TOWN ENTRIES
// =============================================================================

export const TOWNS: Town[] = [
  {
    id: 'marblemount',
    name: 'Marblemount',
    side: 'west',
    tagline: 'West-side trailhead village — where the cabins cluster.',
    paths: 'all',
    summerVibe: 'Cool river air, evergreen shade, slow pace — peak season but never crowded.',
    whyStop:
      "It's where you sleep two of the four nights. Strip-along-WA-20 footprint, but it's also the launch point for Cascade Pass and your last reliable cell service before the dead zone east.",
    bullets: [
      'Pop. ~200. WA-20 runs through it. Single main strip, ~5 min end to end.',
      'Cascade River Rd splits off here — gateway to Cascade Pass (23 mi gravel after MP 10).',
      'Last reliable Verizon 4G/5G heading east into the park.',
      'Marblemount Country Store on WA-20 — small but stocked for cabin meals.',
      'NPS Wilderness Information Center (just east of town) — permits, ranger advice.',
    ],
    practical:
      'On WA-20 at the Cascade River Rd junction. The cabins on the lodging page mostly sit within 5-10 minutes of here. Grocery: basic store in town for top-ups; do a real stock run in Burlington/Sedro-Woolley if you have to pick up anything serious.',
    walkability: 'low',
    walkabilityNote:
      'Walkable in the sense that "town" is one strip — store + ranger station + a couple of inns. No boardwalk, no shopping district.',
    driveFromMarblemountMin: 0,
    driveFromWinthropMin: 150,
    bestSeason:
      'Late June – early October. Mid-Aug = warm days (75-82°F), cool nights, low rain odds.',
    parking: 'Free, easy, pull-off on WA-20 or in any cabin lot. Plenty of room for SUVs.',
    shops: [
      'Marblemount Country Store — coffee, packaged goods, ice, basic groceries.',
      'NPS Wilderness Information Center — maps, books, backcountry permits.',
      'Cascadian Farm roadside stand (12 min west on WA-20 in Rockport) — organic farm stand, ice cream, smoothies.',
    ],
    wikiUrl: 'https://en.wikipedia.org/wiki/Marblemount,_Washington',
    extraLink: {
      label: 'NPS · Wilderness Information Center',
      url: 'https://www.nps.gov/noca/planyourvisit/wilderness-information-center.htm',
    },
    verifiedOn: '2026-05-17',
    photo: PHOTO_WA20,
    photos: [PHOTO_WA20, PHOTO_MARBLEMOUNT, PHOTO_CABIN_RIVER, PHOTO_FOREST],
  },
  {
    id: 'newhalem',
    name: 'Newhalem',
    side: 'west',
    tagline: 'NPS company town — Ladder Creek Falls + powerhouse.',
    paths: 'all',
    summerVibe: 'Mossy, lush, cool air off the river even in August — feels deep-Pacific-Northwest.',
    whyStop:
      "It's an actual functioning Seattle City Light company town and the NPS visitor center sits here. Short paved walks only — but Ladder Creek Falls is a small-effort huge-payoff stop and worth pairing with Diablo Lake on the same drive.",
    bullets: [
      'Pop. ~120. Owned by Seattle City Light — built for the Skagit dam workers.',
      'Ladder Creek Falls — short paved loop behind the Gorge Powerhouse, lit dusk to ~11 PM.',
      'Old steam engine #6 on display at the visitor center.',
      'North Cascades Visitor Center (open seasonally) — maps, weather, ranger talks.',
      'Gorge Creek Falls footbridge — 3 mi east on WA-20, MP 123, free 5-min stop.',
    ],
    practical:
      'WA-20 MP 120, about 15 minutes east of Marblemount. Worth a stop on Day 1 or Day 3 — short walks only, no overnight options. Cell service drops east of here.',
    walkability: 'medium',
    walkabilityNote:
      'Park once at the visitor center and walk the powerhouse + Ladder Creek loop + steam engine display + Skagit Tours dock — 30-45 min of easy paved walking total.',
    driveFromMarblemountMin: 15,
    driveFromWinthropMin: 135,
    bestSeason:
      'Late May – mid-October (visitor center hours). Ladder Creek Falls lit dusk-11 PM all summer is a small magic moment after dinner.',
    parking: 'Free paved lots at both the visitor center and Gorge Powerhouse. Bus / RV-friendly.',
    shops: [
      'North Cascades Visitor Center — maps, books, ranger desk, free Wi-Fi.',
      'Skagit Tours boat dock — old-style Skagit hydroelectric tour (separate ticket).',
      'No shops in the residential street — it is an active company town, not a tourist village.',
    ],
    wikiUrl: 'https://en.wikipedia.org/wiki/Newhalem,_Washington',
    extraLink: {
      label: 'NPS · North Cascades visitor centers',
      url: 'https://www.nps.gov/noca/planyourvisit/visitorcenters.htm',
    },
    verifiedOn: '2026-05-17',
    photo: PHOTO_NEWHALEM,
    photos: [PHOTO_NEWHALEM, PHOTO_DIABLO, PHOTO_FOREST, PHOTO_WA20],
  },
  {
    id: 'concrete',
    name: 'Concrete',
    side: 'west',
    tagline: 'Big-but-quiet Skagit valley town — on the drive in from Bellingham.',
    paths: 'all',
    summerVibe: 'Wide-valley Skagit farmland, eagles overhead, slow river flowing past town.',
    whyStop:
      'The biggest town on the drive in from Bellingham (pop. ~700) — last full grocery + gas + bakery before you hit Marblemount and lose options. Historic downtown is a 10-min stroll. Use it as a fuel-stop + walk-around break.',
    bullets: [
      'Pop. ~700. Skagit valley, 30 min west of Marblemount on WA-20.',
      'Named for the cement plant that built it — Art Deco silos still tower over the highway.',
      "Eagle-watching capital of the lower 48 in winter — Aug is off-season for eagles but the river setting is beautiful.",
      'Free Skagit River access at the Concrete Heritage Museum park.',
      "Albert's Red Apple Market (full grocery) — solid kosher-packaged-goods stop on the drive in.",
    ],
    practical:
      "WA-20 MP 89, about 30 minutes west of Marblemount. Your last full-service town heading east. If you forgot anything from the Seattle Va'ad grocery run, Albert's Red Apple in Concrete is the backup — packaged hechsher only.",
    walkability: 'medium',
    walkabilityNote:
      'Downtown is 3 blocks, walkable end to end in 10 min. Heritage Museum + river park add another 10 min of strolling.',
    driveFromMarblemountMin: 30,
    driveFromWinthropMin: 180,
    bestSeason:
      'Year-round — Aug = quiet shoulder season, Nov-Feb is bald-eagle peak but you are not here then.',
    parking: 'Free street parking everywhere downtown. Large grocery lot at the Red Apple.',
    shops: [
      "Albert's Red Apple Market — full-service grocery, decent packaged kosher selection.",
      'Concrete Heritage Museum — small-town history, free admission, riverside park.',
      'Cascade Burgers (NOT kosher) — landmark drive-in across from the silos, mentioned for character only.',
      "5b's Bakery — well-loved gluten-free bakery (kosher status not certified — skip per kosher rule).",
    ],
    wikiUrl: 'https://en.wikipedia.org/wiki/Concrete,_Washington',
    verifiedOn: '2026-05-17',
    photo: PHOTO_CONCRETE,
    photos: [PHOTO_CONCRETE, PHOTO_FOREST, PHOTO_WA20, PHOTO_INN_CLASSIC],
  },
  {
    id: 'mazama',
    name: 'Mazama',
    side: 'east',
    tagline: 'East-side hamlet — smallest town, biggest alpine drama.',
    paths: ['B', 'C'],
    summerVibe: 'Dry-side sunshine, sagebrush + pine, ridges punching up to 8,000 ft on both sides.',
    whyStop:
      'It is the closest base to Rainy Pass / Maple Pass — saves ~30 min on hike mornings vs. Winthrop. Tiny but the Mazama Store + bakery is a genuine destination, and the lodging here (Freestone Inn, Mazama Country Inn) sits right at the foot of the eastern Cascades.',
    bullets: [
      'Pop. ~150. Upper Methow Valley between 7,000+ ft ridges.',
      'Mazama Store (open year-round) — bakery + small grocer, packaged goods reliable for cabin meals.',
      'Closest base to Rainy Pass / Maple Pass — ~25 min vs. ~40 min from Winthrop.',
      'Walk-friendly cluster — store + a few cabins + the lodge, no real "downtown."',
      'Methow Trails network passes through — the largest non-motorized trail system in the US (over 200 km).',
    ],
    practical:
      "WA-20 east of Washington Pass, ~14 mi west of Winthrop. If your cabin is at Freestone or Mazama Country Inn, this is your village. Tiny but charming. Wider grocery run = Winthrop (Hank's Harvest Foods, 14 mi east).",
    walkability: 'low',
    walkabilityNote:
      'You walk from cabin to store to bakery and you are basically done with "town." Pleasant 10-min Methow River walk possible from Freestone Inn.',
    driveFromMarblemountMin: 120,
    driveFromWinthropMin: 20,
    bestSeason:
      'June – October. Aug = hot dry days (80-90°F), cool nights (~50°F). Bring sunscreen + water for any hike out of here.',
    parking: 'Free everywhere. Mazama Store lot gets full mid-morning on weekends; arrive early or park along the road.',
    shops: [
      'Mazama Store — bakery, deli sandwiches (verify kosher status if eating), packaged groceries, coffee, outdoor goods.',
      "Goat's Beard Mountain Supplies — small gear shop next to the store (climbing + hiking).",
      'Methow Cycle & Sport — bike rentals (in Winthrop, but they shuttle to Mazama trails).',
      'No traditional "downtown" — the Store IS the town center.',
    ],
    wikiUrl: 'https://en.wikipedia.org/wiki/Mazama,_Washington',
    extraLink: {
      label: 'Methow Trails — local trail network',
      url: 'https://www.methowtrails.org/',
    },
    verifiedOn: '2026-05-17',
    photo: PHOTO_MAZAMA,
    photos: [PHOTO_MAZAMA, PHOTO_METHOW_RIVER, PHOTO_WASHINGTON_PASS, PHOTO_DECK_GOLDEN],
  },
  {
    id: 'winthrop',
    name: 'Winthrop',
    side: 'east',
    tagline: 'Old-West boardwalk town — the proper "town night" stop.',
    paths: ['B', 'C'],
    summerVibe: 'Sunny, dusty, busy boardwalks, ice-cream weather. Most-alive town on the route.',
    whyStop:
      "Themed Old-West, but it's a real town — wooden boardwalks, false-front buildings, hitching posts, art galleries, a working historical museum. Park once, wander for 1-2 hours, optionally drive 10 min south to Patterson Lake for the sunset view.",
    bullets: [
      'Pop. ~430. Town is themed Old-West: wooden boardwalks, false-front buildings, hitching posts.',
      'Walkable: park once, wander shops + art galleries, the Shafer Museum, the Methow River footbridge.',
      'Patterson Lake + Sun Mountain ridge are a 10-min drive south for sunset.',
      'Winthrop Bakery is the local landmark — kosher status: NOT certified; cabin meals stay the default.',
      'Methow Trails network is the largest non-motorized trail system in the country — walking, biking, easy paths along the river right from downtown.',
    ],
    practical:
      "WA-20 + Riverside Ave junction, ~14 mi east of Mazama. Biggest town in the corridor. Hank's Harvest Foods is the full-service grocery — solid packaged hechsher selection for cabin restocks. This is the town to wander on a lazy day.",
    walkability: 'high',
    walkabilityNote:
      'Riverside Ave boardwalk is 4 blocks of continuous walkable storefront. Cross the footbridge to the Methow Trails riverside path — flat and easy. Easily 90 min on foot with no driving.',
    driveFromMarblemountMin: 140,
    driveFromWinthropMin: 0,
    bestSeason:
      'May – October. Mid-Aug = peak season, sunny, hot afternoons (85-92°F), evenings cool quickly. Boardwalk is busiest Sat-Sun.',
    parking: 'Free street parking on Riverside Ave + Castle Ave (free 2-hr) and free lot at Shafer Museum. Arrive before 11 AM on weekends.',
    shops: [
      "Trail's End Bookstore — independent, well-curated, regional titles + maps.",
      'Winthrop Mountain Sports — outdoor gear, bike + ski rentals, friendly staff.',
      'Methow Cycle & Sport — bike rentals + repair (Methow Trails launch from here).',
      'Shafer Historical Museum — restored buildings from the original 1890s townsite, suggested donation.',
      'Multiple art galleries + gift shops along Riverside Ave — Saturday is busiest.',
      "Hank's Harvest Foods — full grocery, decent packaged hechsher selection (verify each label).",
    ],
    wikiUrl: 'https://en.wikipedia.org/wiki/Winthrop,_Washington',
    extraLink: {
      label: 'Methow Trails — local trail network',
      url: 'https://www.methowtrails.org/',
    },
    verifiedOn: '2026-05-17',
    photo: PHOTO_WINTHROP,
    photos: [PHOTO_WINTHROP, PHOTO_PATTERSON, PHOTO_METHOW_SUNSET, PHOTO_METHOW_RIVER, PHOTO_DECK_GOLDEN],
  },
];

export function townsForPath(path: 'A' | 'B' | 'C' | null): Town[] {
  if (!path) return TOWNS;
  return TOWNS.filter((t) => t.paths === 'all' || t.paths.includes(path));
}
