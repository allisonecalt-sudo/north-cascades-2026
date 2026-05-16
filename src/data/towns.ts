/**
 * towns.ts — corridor town profiles.
 *
 * Why this file: Allison May 17, 2026 — *"towns are OK if interesting. erin
 * happy to visit interesting towns."* The site previously had restaurants
 * decentered (kosher rule kills food listings), but town CHARACTER got
 * decentered with it. Erin trips can include walkable streets, shops, vibe
 * stops — they're not restaurant-dependent.
 *
 * What's here: 4 corridor towns with character / walkable / shops / vibes,
 * plus a Wikipedia link for each. NOT a restaurant list (per kosher rule,
 * non-kosher restaurants are simply out of scope).
 *
 * What's decided:
 *   - Marblemount = west-side gateway, where the cabins cluster
 *   - Newhalem = NPS company town, Ladder Creek Falls + powerhouse
 *   - Mazama = east-side gateway, smallest, store + bakery + alpine vibe
 *   - Winthrop = the proper old-west boardwalk town, biggest east-side stop
 *
 * Photos: Wikimedia public-domain / CC-licensed. Each has alt + credit.
 */

import type { LodgingPhoto } from './lodging';

export interface Town {
  id: string;
  name: string;
  side: 'west' | 'east';
  /** One-line vibe (boardwalk old-west, NPS company town, etc.). */
  tagline: string;
  /** Path filter — show on cards for these paths (or 'all'). */
  paths: ('A' | 'B' | 'C')[] | 'all';
  /** 3-5 short character bullets. NOT restaurants — vibe, shops, streets, walks. */
  bullets: string[];
  /** Practical bits: where it sits on the corridor + what's there for kosher self-cater. */
  practical: string;
  /** Wikipedia link for the curious. */
  wikiUrl: string;
  /** Optional second link (NPS, town site). */
  extraLink?: { label: string; url: string };
  /** Hero photo for the card. */
  photo: LodgingPhoto;
}

export const TOWNS: Town[] = [
  {
    id: 'marblemount',
    name: 'Marblemount',
    side: 'west',
    tagline: 'West-side trailhead village — where the cabins cluster.',
    paths: 'all',
    bullets: [
      'Pop. ~200. WA-20 runs through it. Single main strip.',
      'Cascade River Rd splits off here — gateway to Cascade Pass.',
      'Last reliable cell service heading east into the park.',
      'Marblemount Country Store on WA-20 — small but stocked for cabin meals.',
    ],
    practical:
      'On WA-20 at the Cascade River Rd junction. The cabins on the lodging page mostly sit within 5-10 minutes of here. Grocery: a basic store in town; do a real stock run in Burlington/Sedro-Woolley if heading east.',
    wikiUrl: 'https://en.wikipedia.org/wiki/Marblemount,_Washington',
    photo: {
      src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Marblemount%2C_WA_-_view_from_WA_20.jpg/1280px-Marblemount%2C_WA_-_view_from_WA_20.jpg',
      alt: 'View of Marblemount along WA-20 with forested mountains rising behind.',
      credit: 'Photo: Joe Mabel · CC BY-SA 4.0 (Wikimedia)',
      creditUrl: 'https://commons.wikimedia.org/wiki/File:Marblemount,_WA_-_view_from_WA_20.jpg',
      width: 1280,
      height: 853,
    },
  },
  {
    id: 'newhalem',
    name: 'Newhalem',
    side: 'west',
    tagline: 'NPS company town — Ladder Creek Falls + powerhouse.',
    paths: 'all',
    bullets: [
      'Pop. ~120. Owned by Seattle City Light — built for the Skagit dam workers.',
      'Ladder Creek Falls — short paved loop behind the powerhouse, lit at dusk.',
      'Old steam engine #6 on display at the visitor center.',
      'NPS visitor center (open seasonally) — maps, weather, ranger talks.',
    ],
    practical:
      'WA-20 MP 120, about 15 minutes east of Marblemount. Worth a stop on Day 1 or Day 3 — short walks only, no overnight options. Cell service drops east of here.',
    wikiUrl: 'https://en.wikipedia.org/wiki/Newhalem,_Washington',
    extraLink: {
      label: 'NPS — North Cascades visitor centers',
      url: 'https://www.nps.gov/noca/planyourvisit/visitorcenters.htm',
    },
    photo: {
      src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Newhalem%2C_Washington_-_general_store.jpg/1280px-Newhalem%2C_Washington_-_general_store.jpg',
      alt: 'Newhalem general store with green-trimmed wood siding and NPS signage.',
      credit: 'Photo: Joe Mabel · CC BY-SA 4.0 (Wikimedia)',
      creditUrl: 'https://commons.wikimedia.org/wiki/File:Newhalem,_Washington_-_general_store.jpg',
      width: 1280,
      height: 853,
    },
  },
  {
    id: 'mazama',
    name: 'Mazama',
    side: 'east',
    tagline: 'East-side hamlet — smallest town, biggest alpine drama.',
    paths: ['B', 'C'],
    bullets: [
      'Pop. ~150. Sits in the upper Methow Valley between 7,000+ ft ridges.',
      'Mazama Store (open year-round) — bakery + small grocer, packaged goods reliable for cabin meals.',
      'Closest base to Rainy Pass / Maple Pass — saves ~30 min vs. Winthrop on hike mornings.',
      'Walk-friendly cluster — store + a few cabins + the lodge, no real "downtown."',
    ],
    practical:
      'WA-20 east of Washington Pass, ~14 mi west of Winthrop. If your cabin is at Freestone or Mazama Country Inn, this is your village. Tiny but charming. Wider grocery run = Winthrop or the drive in.',
    wikiUrl: 'https://en.wikipedia.org/wiki/Mazama,_Washington',
    photo: {
      src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Mazama_Country_Inn.JPG/1280px-Mazama_Country_Inn.JPG',
      alt: 'Mazama Country Inn with timber-frame architecture and mountain backdrop.',
      credit: 'Photo: Steven Pavlov · CC BY-SA 3.0 (Wikimedia)',
      creditUrl: 'https://commons.wikimedia.org/wiki/File:Mazama_Country_Inn.JPG',
      width: 1280,
      height: 853,
    },
  },
  {
    id: 'winthrop',
    name: 'Winthrop',
    side: 'east',
    tagline: 'Old-West boardwalk town — the proper "town night" stop.',
    paths: ['B', 'C'],
    bullets: [
      'Pop. ~430. Town is themed Old-West: wooden boardwalks, false-front buildings, hitching posts.',
      'Walkable: park once, wander shops, art galleries, the Shafer Museum, the Methow River footbridge.',
      'Patterson Lake + Sun Mountain ridge are a 10-min drive south for sunset.',
      'Winthrop Bakery is the local landmark — kosher status: NOT certified; cabin meals stay the default.',
      'The Methow Trails network is the largest non-motorized trail system in the country — walking, biking, easy paths along the river.',
    ],
    practical:
      'WA-20 + Riverside Ave junction, ~14 mi east of Mazama. Biggest town in the corridor. Hank\'s Harvest Foods is the full-service grocery — solid packaged hechsher selection for cabin restocks. This is the town to wander on Path C\'s lazy day.',
    wikiUrl: 'https://en.wikipedia.org/wiki/Winthrop,_Washington',
    extraLink: {
      label: 'Methow Trails — the local trail network',
      url: 'https://www.methowtrails.org/',
    },
    photo: {
      src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Winthrop_WA_002.jpg/1280px-Winthrop_WA_002.jpg',
      alt: 'Winthrop main street with wooden boardwalks, false-front Old-West buildings, and mountain backdrop.',
      credit: 'Photo: Walter Siegmund · CC BY-SA 3.0 (Wikimedia)',
      creditUrl: 'https://commons.wikimedia.org/wiki/File:Winthrop_WA_002.jpg',
      width: 1280,
      height: 853,
    },
  },
];

export function townsForPath(path: 'A' | 'B' | 'C' | null): Town[] {
  if (!path) return TOWNS;
  return TOWNS.filter((t) => t.paths === 'all' || t.paths.includes(path));
}
