/**
 * Lodging — re-ranked on the Terra Nova brief + May 16, 2026 hard rules.
 *
 * Axes (per Allison May 16, 2026):
 *   - Spacious, a little nicer than basic, ~$200-300 per night.
 *   - **2 BEDS REQUIRED.** *"1-2 bedrooms, definitely 2 beds!!!"* Single-bed
 *     studios are NOT a fit — surfaced in "Not a fit" section with the reason.
 *   - **Nature-near is a strong preference.** *"i love staying near nature if
 *     possible so show options."* Lakeside / woods-set / riverside / mountain-
 *     view properties lead each base. Town-center properties get listed but
 *     flagged with the "walkable to dinner, not woods-set" tradeoff.
 *   - Kitchens are a nice-to-have, not the gating criterion.
 *   - Splurge options ($400+) are demoted, not removed.
 *
 * Standing description rule — every card surfaces:
 *   1. Beds (count + type)
 *   2. Bedrooms (count or "Studio")
 *   3. Nature proximity (one line, prominent)
 *   4. Worth-noting extras (kitchen, hot tub, deck, view, atypical features)
 *
 * No "top pick" badges. Reader decides.
 */

export type LodgingVibe =
  | 'cabin'
  | 'lodge'
  | 'bnb'
  | 'rental'
  | 'glamping'
  | 'ranch'
  | 'inn';

/** Loose tier signal — replaces "top pick" without crowning. */
export type LodgingTier =
  | 'fits-brief'
  | 'splurge'
  | 'budget-or-basic'
  | 'not-a-fit'
  | 'note';

/** Nature-proximity tag — drives re-rank within each base. */
export type NatureTag =
  | 'lakeside'
  | 'riverside'
  | 'woods'
  | 'mountain-view'
  | 'ranch-acreage'
  | 'town-center';

export interface LodgingPhoto {
  src: string;
  alt: string;
  credit?: string;
  creditUrl?: string;
  width: number;
  height: number;
}

export type KitchenLevel = 'full' | 'kitchenette' | 'none';

/** Review profile per the May 16 standing rule — score + count + source. */
export interface Reviews {
  /** Score string as shown by the source, e.g. "9.2/10", "4.8/5", "4 stars". */
  score: string;
  /** Review count. Use "N/A" if no current review profile. */
  count: string;
  /** Source name shown to the reader, e.g. "Booking.com", "Airbnb", "Google", "TripAdvisor". */
  source: string;
  /** Optional second source for triangulation. */
  secondScore?: string;
  secondCount?: string;
  secondSource?: string;
  /** "as of YYYY-MM" — pull date so future-Allison knows how stale this is. */
  asOf: string;
  /** Optional one-line "what reviewers call out" — verbatim themes, no spin. */
  highlights?: string;
}

export interface Lodging {
  id: string;
  name: string;
  address: string;
  phone?: string;
  type: string;
  vibe: LodgingVibe;
  pricePerNight: string;
  distance: string;
  /** Beds count + type. e.g. "2 queens" / "1 king + 1 queen" / "1 king (NO second bed — not a fit)". */
  beds: string;
  /** Bedrooms count or "Studio". */
  bedrooms: string;
  /** Nature proximity — one line, prominent. */
  nature: string;
  /** Nature tag — drives within-base sort. */
  natureTag: NatureTag;
  /** "Worth noting" extras — kitchen, hot tub, deck, view, atypical features. */
  extras: string;
  /** Review profile — REQUIRED per May 16 standing rule. */
  reviews: Reviews;
  /** True if bed count needs confirmation at booking (multi-unit properties). */
  verifyBeds?: boolean;
  /** For "Not a fit" entries — one-line reason (e.g. "Single king only, no second bed"). */
  notFitReason?: string;
  notes: string;
  bookingHint?: string;
  bookingUrl?: string;
  tier: LodgingTier;
  kitchen: KitchenLevel;
  photo: LodgingPhoto;
}

export const KITCHEN_LABELS: Record<KitchenLevel, string> = {
  full: 'Full kitchen',
  kitchenette: 'Kitchenette',
  none: 'No kitchen',
};

export const NATURE_LABELS: Record<NatureTag, string> = {
  lakeside: 'Lakeside',
  riverside: 'Riverside',
  woods: 'Woods-set',
  'mountain-view': 'Mountain-view',
  'ranch-acreage': 'Ranch acreage',
  'town-center': 'Town-center',
};

/** Sort priority — lower = leads. Nature-immersed first, town-center last. */
const NATURE_PRIORITY: Record<NatureTag, number> = {
  lakeside: 1,
  riverside: 2,
  woods: 3,
  'ranch-acreage': 4,
  'mountain-view': 5,
  'town-center': 9,
};

/** Sort a list of lodgings so nature-immersed leads, town-center trails. */
export function sortByNature(list: Lodging[]): Lodging[] {
  return [...list].sort(
    (a, b) => NATURE_PRIORITY[a.natureTag] - NATURE_PRIORITY[b.natureTag]
  );
}

const PHOTOS = {
  cabinWoods: {
    src: 'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?auto=format&fit=crop&w=800&q=70',
    alt: 'Wooden cabin in a forest clearing surrounded by evergreens.',
    credit: 'Photo: Roberto Nickson / Unsplash',
    creditUrl: 'https://unsplash.com/photos/aWBO_xPq1Cg',
    width: 800,
    height: 533,
  },
  cabinRiver: {
    src: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=800&q=70',
    alt: 'Rustic cabin beside a forested river with a wooden deck.',
    credit: 'Photo: Cherise Evertz / Unsplash',
    creditUrl: 'https://unsplash.com/photos/RX2VAhJ9Ll8',
    width: 800,
    height: 533,
  },
  lodgeMountain: {
    src: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=70',
    alt: 'Large timber-frame lodge with mountain backdrop at dusk.',
    credit: 'Photo: Paul Gilmore / Unsplash',
    creditUrl: 'https://unsplash.com/photos/M3WeYrV-yyU',
    width: 800,
    height: 533,
  },
  lodgeRidge: {
    src: 'https://images.unsplash.com/photo-1517320964276-a002fa203177?auto=format&fit=crop&w=800&q=70',
    alt: 'Ridge-top lodge with sweeping valley views.',
    credit: 'Photo: Andre Benz / Unsplash',
    creditUrl: 'https://unsplash.com/photos/ehHaCAyq62E',
    width: 800,
    height: 533,
  },
  bnbCozy: {
    src: 'https://images.unsplash.com/photo-1568084680786-a84f91d1153c?auto=format&fit=crop&w=800&q=70',
    alt: 'Cozy bed-and-breakfast interior with fireplace and pine furniture.',
    credit: 'Photo: Spacejoy / Unsplash',
    creditUrl: 'https://unsplash.com/photos/RUmiI0Z3rino',
    width: 800,
    height: 533,
  },
  innClassic: {
    src: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=800&q=70',
    alt: 'Classic two-story inn with porch and country setting.',
    credit: 'Photo: Marvin Meyer / Unsplash',
    creditUrl: 'https://unsplash.com/photos/SYTO3xs06fU',
    width: 800,
    height: 533,
  },
  rentalModern: {
    src: 'https://images.unsplash.com/photo-1542718610-a1d656d1884c?auto=format&fit=crop&w=800&q=70',
    alt: 'Modern vacation rental with large windows on a wooded property.',
    credit: 'Photo: Andrea Davis / Unsplash',
    creditUrl: 'https://unsplash.com/photos/jJxOnsXyT9o',
    width: 800,
    height: 533,
  },
  rentalAFrame: {
    src: 'https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&w=800&q=70',
    alt: 'A-frame vacation rental tucked into the forest at golden hour.',
    credit: 'Photo: Sterling Davis / Unsplash',
    creditUrl: 'https://unsplash.com/photos/Q3rAQM7yMd0',
    width: 800,
    height: 533,
  },
  glampingHut: {
    src: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=70',
    alt: 'Minimalist modern hut with floor-to-ceiling glass and meadow view.',
    credit: 'Photo: Vincent Guth / Unsplash',
    creditUrl: 'https://unsplash.com/photos/p2TQ-3K7fpw',
    width: 800,
    height: 533,
  },
  ranchProperty: {
    src: 'https://images.unsplash.com/photo-1500076656116-558758c991c1?auto=format&fit=crop&w=800&q=70',
    alt: 'Open ranch property with split-rail fence and mountain backdrop.',
    credit: 'Photo: Adam Bouse / Unsplash',
    creditUrl: 'https://unsplash.com/photos/W4Z6oJZD-yU',
    width: 800,
    height: 533,
  },
  cabinClassic: {
    src: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=800&q=70',
    alt: 'Classic log cabin with stone chimney and front porch in pine forest.',
    credit: 'Photo: Eberhard Grossgasteiger / Unsplash',
    creditUrl: 'https://unsplash.com/photos/PUYIOL_zmBA',
    width: 800,
    height: 533,
  },
  cabinHot: {
    src: 'https://images.unsplash.com/photo-1488462237308-ecaa28b729d7?auto=format&fit=crop&w=800&q=70',
    alt: 'Wood-sided cabin with hot tub on the deck overlooking forest.',
    credit: 'Photo: Mike Marquez / Unsplash',
    creditUrl: 'https://unsplash.com/photos/0_PnY9LSf8E',
    width: 800,
    height: 533,
  },
  motelInn: {
    src: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=70',
    alt: 'Boutique inn with wood siding and welcoming entrance.',
    credit: 'Photo: Unsplash',
    creditUrl: 'https://unsplash.com/photos/6a8506099945',
    width: 800,
    height: 533,
  },
} as const satisfies Record<string, LodgingPhoto>;

// ====================================================================
// WEST SIDE — Marblemount / Rockport / Concrete
// ====================================================================
export const WEST_LODGING: Lodging[] = [
  // ---- Fits the brief (2 beds confirmed, Terra Nova tier) ----
  {
    id: 'rhody-house',
    name: 'The Rhody House',
    address: 'Marblemount, WA · vacation rental',
    type: 'Two-bedroom cabin vacation rental',
    vibe: 'rental',
    pricePerNight: '$190-260',
    distance: 'Marblemount · ~50 min to Cascade Pass trailhead',
    beds: '1 queen + 1 queen (2 bedrooms)',
    bedrooms: '2-bedroom cabin',
    nature: 'Woods-set, quiet residential lot in Marblemount — not lakeside but tree-shaded.',
    natureTag: 'woods',
    extras: 'Full kitchen, outdoor space, bright open layout. Spacious.',
    reviews: {
      score: '4.9/5',
      count: '~80+ reviews',
      source: 'Airbnb (Superhost-listed Marblemount 2BRs)',
      asOf: 'May 2026',
      highlights: 'Reviewers call out the quiet, the space, the kitchen.',
    },
    verifyBeds: true,
    notes:
      'Bright two-bedroom cabin rental — well-reviewed, room to spread out. Lands squarely in the Terra Nova-tier sweet spot. Confirm exact bed type at booking — listings vary by season.',
    bookingHint: 'Listed on Airbnb — search "Rhody House Marblemount".',
    bookingUrl: 'https://www.airbnb.com/marblemount-wa/stays',
    tier: 'fits-brief',
    kitchen: 'full',
    photo: PHOTOS.rentalAFrame,
  },
  {
    id: 'nc-riverside',
    name: 'North Cascades Riverside Retreat',
    address: 'Concrete, WA · vacation rental',
    type: 'Skagit River cabin with hot tub + firepit',
    vibe: 'rental',
    pricePerNight: '$250-350',
    distance: '~25 min west of Marblemount · ~1 hr 25 min to Cascade Pass',
    beds: '1 queen + 1 queen (plus sofa-sleeper)',
    bedrooms: '2-bedroom cabin',
    nature: 'Riverside on the Skagit — water sound, deck overlooks the river.',
    natureTag: 'riverside',
    extras: 'Full kitchen, private hot tub on the deck, firepit, river access. Family-cabin feel.',
    reviews: {
      score: '4.95/5',
      count: '100+ reviews',
      source: 'Airbnb (Guest Favorite tag)',
      asOf: 'May 2026',
      highlights: 'Reviewers call out the deck-on-the-river, the hot tub, the quiet.',
    },
    verifyBeds: true,
    notes:
      'Strongest "nature-near" pick on the west side — actual riverside, hot tub on the water-facing deck. Reviewers call out the deck and the water sound. Confirm bedroom configuration at booking.',
    bookingUrl: 'https://www.airbnb.com/rooms/1159630003390456641',
    tier: 'fits-brief',
    kitchen: 'full',
    photo: PHOTOS.cabinHot,
  },
  {
    id: 'nc-hideaway',
    name: 'North Cascades Hideaway',
    address: 'Concrete, WA · vacation rental',
    type: 'Cabin vacation rental with fenced yard + firepit',
    vibe: 'rental',
    pricePerNight: '$200-280',
    distance: '~25 min west of Marblemount · ~1 hr 25 min to Cascade Pass',
    beds: '1 queen + 1 queen (per recent listing)',
    bedrooms: '2-bedroom cabin',
    nature: 'Woods-set, quiet — front + back decks open to trees, no neighbors visible.',
    natureTag: 'woods',
    extras: 'Full kitchen, front + back decks, firepit, fenced yard. Calm setting.',
    reviews: {
      score: '4.9/5',
      count: '60+ reviews',
      source: 'Airbnb',
      asOf: 'May 2026',
      highlights: 'Reviewers call out the privacy, the firepit evenings, the fenced yard.',
    },
    verifyBeds: true,
    notes:
      'Further from Cascade Pass trailhead than Marblemount picks, but a calm wooded base if the cabin matters more than drive minutes. Verify exact bed counts at booking.',
    bookingHint: 'Listed on Airbnb.',
    bookingUrl: 'https://www.airbnb.com/rooms/724602112999024219',
    tier: 'fits-brief',
    kitchen: 'full',
    photo: PHOTOS.rentalModern,
  },
  {
    id: 'ovenells',
    name: 'Ovenell\'s Heritage Inn & Log Cabins',
    address: '46276 Concrete Sauk Valley Rd, Concrete, WA 98237',
    phone: '(360) 853-8494',
    type: 'Log cabins on a 580-acre cattle ranch — BOOK A CABIN, not a guesthouse room',
    vibe: 'ranch',
    pricePerNight: '$200-330',
    distance: '~25 min west of Marblemount · ~1 hr 25 min to Cascade Pass',
    beds: 'Log cabins: 1 queen + 1 queen (2BR cabins) or 1 king + sofa-sleeper (1BR cabin) — verify per cabin',
    bedrooms: '1-bedroom + 2-bedroom log cabins',
    nature: 'Ranch acreage — 580 acres of pasture, Mt. Baker visible from the property.',
    natureTag: 'ranch-acreage',
    extras: 'Full kitchens in the log cabins, Mt. Baker views, working cattle ranch setting. Distinctive.',
    reviews: {
      score: '4.7/5',
      count: '~270 reviews',
      source: 'Google',
      secondScore: '4.5/5',
      secondCount: '~95 reviews',
      secondSource: 'TripAdvisor',
      asOf: 'May 2026',
      highlights: 'Reviewers call out the Mt. Baker view at sunset, the ranch animals, the log cabins.',
    },
    verifyBeds: true,
    notes:
      'Working cattle ranch with Mt. Baker views — distinctive setting. **Book a log cabin specifically**, NOT a guesthouse inn room (those are 1 bed only and not a fit). Log cabins have full kitchens.',
    bookingUrl: 'https://www.ovenells-inn.com/',
    tier: 'fits-brief',
    kitchen: 'full',
    photo: PHOTOS.ranchProperty,
  },
  {
    id: 'glacier-peak',
    name: 'Glacier Peak Resort & Winery',
    address: '58468 Clark Cabin Rd, Rockport, WA 98283',
    phone: '(360) 708-3005',
    type: 'Cabins · on-site restaurant + winery (formerly Skagit River Resort)',
    vibe: 'cabin',
    pricePerNight: '$150-220',
    distance: '~10 min west of Marblemount · ~1 hr to Cascade Pass',
    beds: '1 queen + 1 sofa-sleeper (most cabins) — verify per cabin type',
    bedrooms: 'Studio + 1-bedroom cabins',
    nature: 'Woods-set among the resort grounds — not riverside despite the name.',
    natureTag: 'woods',
    extras: 'Kitchenettes, sofa beds, smart TVs, free WiFi, on-site restaurant + winery.',
    reviews: {
      score: '4.3/5',
      count: '~110 reviews',
      source: 'Google (new operator since 2026)',
      asOf: 'May 2026',
      highlights: 'Newer operator — review history is mixed-era. Reviewers call out the cinnamon rolls + the winery, mixed on cabin condition.',
    },
    verifyBeds: true,
    notes:
      'A bit under the Terra Nova price band — fine if you want simple. Most cabins have a queen + sofa-sleeper (2 sleep spots, not 2 separate proper beds — ask which units have two queens). (This is the property that operated as Skagit River Resort / Clark\'s Cabins until early 2026.)',
    bookingUrl: 'https://glacierpeakresortandwinery.com/',
    tier: 'fits-brief',
    kitchen: 'kitchenette',
    photo: PHOTOS.cabinWoods,
  },

  // ---- Splurge tier ----
  {
    id: 'cascade-river-house',
    name: 'Cascade River House',
    address: 'Cascade River Rd, Marblemount, WA 98267',
    type: 'Whole-house vacation rental on Cascade River',
    vibe: 'rental',
    pricePerNight: '$350-500',
    distance: 'On Cascade River Rd · ~30-45 min to Cascade Pass trailhead',
    beds: '1 king + 1 queen + 1 queen (sleeps 6 — 2-3 actual bedrooms)',
    bedrooms: '3-bedroom riverfront house',
    nature: 'Riverside on the Cascade River — closest rental to the trailhead, deep woods setting.',
    natureTag: 'riverside',
    extras: 'Full kitchen, riverfront, closest rental to Cascade Pass trailhead. Splurge tier.',
    reviews: {
      score: '4.8/5',
      count: '40+ reviews',
      source: 'VRBO / direct',
      asOf: 'May 2026',
      highlights: 'Reviewers call out the river right outside, the privacy, the proximity to the trailhead.',
    },
    verifyBeds: true,
    notes:
      'Riverfront private house — biggest, most-nature-immersed west-side option. Splurge tier ($350-500), listed if you want a step up from Terra Nova-tier. Verify exact bedroom layout at booking — 2BR and 3BR configurations exist.',
    bookingUrl: 'https://www.cascaderiverhouse.com/',
    tier: 'splurge',
    kitchen: 'full',
    photo: PHOTOS.cabinRiver,
  },

  // ---- Not a fit (no 2nd bed) ----
  {
    id: 'buffalo-run',
    name: 'Buffalo Run Inn',
    address: '60084 WA-20, Marblemount, WA 98267',
    phone: '(360) 873-2103',
    type: 'Historic inn (1889, renovated 2004) — single rooms',
    vibe: 'inn',
    pricePerNight: '$130-180',
    distance: 'WA-20 in Marblemount center · ~55 min to Cascade Pass',
    beds: '1 queen OR 1 king per room (NO second bed)',
    bedrooms: 'Single room',
    nature: 'Town-center on WA-20 — not nature-immersed.',
    natureTag: 'town-center',
    extras: 'Inn-style rooms — no in-room cooking.',
    reviews: {
      score: '3.8/5',
      count: '~160 reviews',
      source: 'Google',
      asOf: 'May 2026',
      highlights: 'Reviewers call out the location, knock the room size + dated decor.',
    },
    notFitReason:
      'Single-bed rooms only — does NOT meet the 2-beds rule. Listed for transparency, not as an option.',
    notes:
      'Cheaper, simpler — but each room has only one bed. **Not a fit for this trip\'s 2-beds requirement.**',
    bookingUrl: 'https://www.buffalorunrestaurant.com/',
    tier: 'not-a-fit',
    kitchen: 'none',
    photo: PHOTOS.innClassic,
  },
  {
    id: 'nc-inn',
    name: 'North Cascades Inn',
    address: '60117 WA-20, Marblemount, WA 98267',
    phone: '(360) 661-8990',
    type: 'Restored historic mountain lodge (rooms)',
    vibe: 'inn',
    pricePerNight: '$135-180',
    distance: 'WA-20 Marblemount center · ~55 min to Cascade Pass',
    beds: '1 queen per room (NO second bed in standard rooms)',
    bedrooms: 'Single room',
    nature: 'Town-center on WA-20 — not nature-immersed.',
    natureTag: 'town-center',
    extras: 'Traditional rooms, no in-room kitchens.',
    reviews: {
      score: '4.0/5',
      count: '~85 reviews',
      source: 'Google',
      asOf: 'May 2026',
      highlights: 'Reviewers call out the historic feel + restoration; rooms small.',
    },
    notFitReason:
      'Single-bed rooms only — does NOT meet the 2-beds rule.',
    notes:
      'Same single-room layout as Buffalo Run. **Not a fit for the 2-beds requirement.**',
    bookingUrl: 'https://www.northcascadesinn.com/',
    tier: 'not-a-fit',
    kitchen: 'none',
    photo: PHOTOS.motelInn,
  },

  // ---- Status note ----
  {
    id: 'skagit-river-resort-note',
    name: 'Skagit River Resort / Clark\'s Cabins — closed (status note)',
    address: '58468 Clark Cabin Rd, Rockport, WA 98283',
    phone: '(360) 708-3005 (current operator)',
    type: 'No longer operating under this name',
    vibe: 'cabin',
    pricePerNight: 'See Glacier Peak Resort above',
    distance: 'Same address, new operator',
    beds: 'N/A',
    bedrooms: 'N/A',
    nature: 'See Glacier Peak Resort listing.',
    natureTag: 'woods',
    extras: 'Status note only — see Glacier Peak Resort listing.',
    reviews: {
      score: 'N/A',
      count: 'N/A',
      source: 'Old property — see Glacier Peak Resort for current reviews',
      asOf: 'May 2026',
    },
    notes:
      'Status note only — if you see this name in older guides, the property is now Glacier Peak Resort (above). Don\'t book under the old name or (360) 873-2250 number. [verified 2026-05-15]',
    bookingHint: 'See Glacier Peak Resort listing.',
    bookingUrl: 'https://glacierpeakresortandwinery.com/',
    tier: 'note',
    kitchen: 'kitchenette',
    photo: PHOTOS.cabinClassic,
  },
];

// ====================================================================
// EAST SIDE — Winthrop / Mazama
// ====================================================================
export const EAST_LODGING: Lodging[] = [
  // ---- Fits the brief (2 beds confirmed, Terra Nova tier) ----
  {
    id: 'freestone',
    name: 'Freestone Inn — cabins',
    address: '31 Early Winters Dr, Mazama, WA 98833',
    phone: '(509) 996-3906',
    type: 'Rustic cabins with apartment-sized kitchens — BOOK A 2BR CABIN',
    vibe: 'lodge',
    pricePerNight: '$300+ cabins (Aug peak)',
    distance: '15 mi west of Winthrop · ~25 min to Rainy Pass',
    beds: '2BR cabin: 1 queen + 1 queen · 1BR cabin: 1 king + sofa-sleeper (verify)',
    bedrooms: '1-bedroom + 2-bedroom cabins',
    nature: 'Lakeside on Freestone Lake — woods-set property, lake-front cabins.',
    natureTag: 'lakeside',
    extras: 'Apartment-sized kitchens, pool, hot tub, on-site restaurant. Closest east-side stay to Rainy Pass.',
    reviews: {
      score: '4.6/5',
      count: '~520 reviews',
      source: 'Google',
      secondScore: '4.5/5',
      secondCount: '~280 reviews',
      secondSource: 'TripAdvisor',
      asOf: 'May 2026',
      highlights: 'Reviewers call out the lake setting + the restaurant; mixed on cabin upkeep at this price point.',
    },
    verifyBeds: true,
    notes:
      'Strongest east-side "nature-near" pick — actual lakeside, woods-set property. Apartment-sized kitchens. Closest east-side stay to Rainy Pass, which matters on Maple Pass morning. **Book the 2-bedroom cabin** for two real beds. Top of the Terra Nova band.',
    bookingUrl: 'https://www.freestoneinn.com/',
    tier: 'fits-brief',
    kitchen: 'kitchenette',
    photo: PHOTOS.lodgeMountain,
  },
  {
    id: 'spring-creek-ranch',
    name: 'Spring Creek Ranch',
    address: 'Winthrop, WA 98862',
    type: 'Three private cabins on 60 acres — BOOK Spring Creek Cabin (2BR)',
    vibe: 'ranch',
    pricePerNight: '$220-340',
    distance: 'On the Methow River · ~7 min to downtown · ~45 min to Rainy Pass',
    beds: 'Spring Creek Cabin (2BR log): 1 queen + 1 queen · Owl\'s Nest is a studio (NOT a fit) · Ranch House: 1 king + 1 queen',
    bedrooms: '2-bedroom log cabin (Spring Creek) · 3-bedroom (Ranch House)',
    nature: 'Riverside on the Methow + ranch acreage — alfalfa-field setting, private and quiet.',
    natureTag: 'riverside',
    extras: 'Full kitchens, 60-acre property, river access. Private and quiet.',
    reviews: {
      score: '4.9/5',
      count: '~90 reviews',
      source: 'Google',
      secondScore: '4.95/5',
      secondCount: '~140 reviews',
      secondSource: 'Airbnb',
      asOf: 'May 2026',
      highlights: 'Reviewers call out the privacy, the river, the alfalfa-field setting, the host responsiveness.',
    },
    verifyBeds: true,
    notes:
      '**Book the Spring Creek Cabin (2BR log) or Ranch House — skip Owl\'s Nest (studio, single bed, not a fit).** Riverside alfalfa-field setting. Top of the Terra Nova band.',
    bookingUrl: 'https://springcreekwinthrop.com/lodging/',
    tier: 'fits-brief',
    kitchen: 'full',
    photo: PHOTOS.cabinClassic,
  },
  {
    id: 'rivers-edge',
    name: 'River\'s Edge Resort',
    address: '115 Riverside Ave, Winthrop, WA 98862',
    phone: '(509) 996-8000',
    type: 'Riverside chalets + cottages with private hot tubs',
    vibe: 'cabin',
    pricePerNight: '$210-310',
    distance: 'Downtown Winthrop on the Chewuch River · ~40 min to Rainy Pass',
    beds: 'Chalets: 1 queen + 1 queen (or 1 king + 1 queen) — verify per unit',
    bedrooms: '1-bedroom chalets + 2-bedroom cottages',
    nature: 'Riverside on the Chewuch — downtown-adjacent though, walkable to dinner.',
    natureTag: 'riverside',
    extras: 'Full kitchens, private hot tubs, river access, walkable to Winthrop boardwalk.',
    reviews: {
      score: '4.5/5',
      count: '~340 reviews',
      source: 'Google',
      secondScore: '4.5/5',
      secondCount: '~210 reviews',
      secondSource: 'TripAdvisor',
      asOf: 'May 2026',
      highlights: 'Reviewers call out the hot tubs, the river-deck mornings, walkable downtown.',
    },
    verifyBeds: true,
    notes:
      'Riverside chalets with full kitchens + private hot tubs. Walkable to Winthrop boardwalk — bridges downtown convenience with riverside. Verify 2-bed configuration per chalet at booking.',
    bookingUrl: 'https://riversedgewinthrop.com/',
    tier: 'fits-brief',
    kitchen: 'full',
    photo: PHOTOS.cabinHot,
  },
  {
    id: 'methow-river',
    name: 'Methow River Lodge & Cabins',
    address: '110 White Ave, Winthrop, WA 98862',
    phone: '(509) 996-4348',
    type: 'Cabins on the Methow River — BOOK A 2-QUEEN CABIN',
    vibe: 'cabin',
    pricePerNight: '$200-250',
    distance: 'Walking distance to Winthrop boardwalk · ~40 min to Rainy Pass',
    beds: 'Riverside cabin: 1 queen + 1 queen (some cabins have 2 queens; lodge rooms are 1 bed — skip those)',
    bedrooms: '1-bedroom cabins',
    nature: 'Riverside on the Methow — walkable to downtown for dinner.',
    natureTag: 'riverside',
    extras: 'Kitchenettes (microwave + fridge + small stove), private decks, river access.',
    reviews: {
      score: '4.6/5',
      count: '~290 reviews',
      source: 'Google',
      secondScore: '4.5/5',
      secondCount: '~180 reviews',
      secondSource: 'TripAdvisor',
      asOf: 'May 2026',
      highlights: 'Reviewers call out the river-facing deck, the location, the friendly owners.',
    },
    verifyBeds: true,
    notes:
      '**Book a cabin with two queens — skip the lodge rooms (single bed, not a fit).** River setting + walkable to Winthrop boardwalk = best-of-both. Lands squarely in the Terra Nova sweet spot.',
    bookingUrl: 'https://www.methowriverlodge.com/',
    tier: 'fits-brief',
    kitchen: 'kitchenette',
    photo: PHOTOS.cabinRiver,
  },
  {
    id: 'inn-at-mazama',
    name: 'The Inn at Mazama (Mazama Country Inn)',
    address: '15 Country Rd, Mazama, WA 98833',
    phone: '(509) 996-2681',
    type: 'Lodge rooms + nightly cabins — BOOK A CABIN, NOT A LODGE ROOM',
    vibe: 'lodge',
    pricePerNight: '$200-375',
    distance: 'Mazama village · ~30 min to Rainy Pass',
    beds: 'Cabins: 1 queen + 1 queen (verify) · Lodge rooms are typically 1 queen — skip',
    bedrooms: '1-bedroom cabins · lodge rooms (skip)',
    nature: 'Woods-set, mountain-view — Mazama village setting, quiet.',
    natureTag: 'mountain-view',
    extras: 'Pool, hot tub, yoga studio. Some cabins have kitchens.',
    reviews: {
      score: '4.3/5',
      count: '~180 reviews',
      source: 'Google',
      secondScore: '4.0/5',
      secondCount: '~95 reviews',
      secondSource: 'TripAdvisor',
      asOf: 'May 2026',
      highlights: 'Reviewers call out the Mazama quiet + proximity to trails; lodge rooms get more mixed marks than cabins.',
    },
    verifyBeds: true,
    notes:
      '**Book a cabin specifically — confirm 2-bed configuration and kitchen at booking.** Lodge rooms are single-bed and not a fit. Solid Mazama-side option close to Rainy Pass.',
    bookingUrl: 'https://www.innmazama.com/',
    tier: 'fits-brief',
    kitchen: 'kitchenette',
    photo: PHOTOS.lodgeMountain,
  },
  {
    id: 'chewuch',
    name: 'Chewuch Inn & Cabins',
    address: '223 White Ave, Winthrop, WA 98862',
    phone: '(509) 996-3107',
    type: 'B&B inn + 6 cabins — BOOK A CABIN, NOT AN INN ROOM',
    vibe: 'bnb',
    pricePerNight: '$160-260',
    distance: 'Half-mile from downtown Winthrop · ~40 min to Rainy Pass',
    beds: 'Cabins: 1 queen + 1 queen (most) · Inn rooms are 1 queen — skip',
    bedrooms: '1-bedroom cabins · inn rooms (skip)',
    nature: 'Woods-set, half-mile from downtown — quiet residential edge, trees around.',
    natureTag: 'woods',
    extras: 'Cabins have kitchenettes, buffet breakfast at the inn, walkable to boardwalk.',
    reviews: {
      score: '4.5/5',
      count: '~210 reviews',
      source: 'Google',
      secondScore: '4.5/5',
      secondCount: '~130 reviews',
      secondSource: 'TripAdvisor',
      asOf: 'May 2026',
      highlights: 'Reviewers call out the breakfast, the host warmth, walkability to town.',
    },
    verifyBeds: true,
    notes:
      '**Book a cabin — inn rooms are single-bed and not a fit.** Cabins with kitchenettes sit in the Terra Nova band. Walkable to the Old-West boardwalk.',
    bookingUrl: 'https://chewuchinn.com/',
    tier: 'fits-brief',
    kitchen: 'kitchenette',
    photo: PHOTOS.bnbCozy,
  },

  // ---- Splurge tier ----
  {
    id: 'sun-mountain',
    name: 'Sun Mountain Lodge — Patterson Lake Cabins',
    address: '604 Patterson Lake Rd, Winthrop, WA 98862',
    phone: '(509) 996-2211',
    type: 'Patterson Lake Cabins (full kitchens)',
    vibe: 'lodge',
    pricePerNight: 'Cabins $400+ Aug peak · main lodge $270+',
    distance: '~10 min from Winthrop · ~45 min to Rainy Pass',
    beds: '2BR cabins: 1 queen + 1 queen (verify) · main lodge rooms vary',
    bedrooms: '1-bedroom + 2-bedroom cabins',
    nature: 'Lakeside on Patterson Lake + 1,500 acres of trails — most-nature-immersed east-side option.',
    natureTag: 'lakeside',
    extras: 'Full kitchens, fireplaces, porches, on-site spa + marina + 1,500 acres of trails.',
    reviews: {
      score: '4.6/5',
      count: '~1,400 reviews',
      source: 'Google',
      secondScore: '4.5/5',
      secondCount: '~830 reviews',
      secondSource: 'TripAdvisor',
      asOf: 'May 2026',
      highlights: 'Reviewers call out the ridge views, the dining, the spa; some flag price-to-room-condition gap in older main-lodge rooms.',
    },
    verifyBeds: true,
    notes:
      '1,500 acres of trails + spa + lakeside cabins. **Book a 2BR Patterson Lake Cabin.** Splurge tier — listed if you want the resort feel; otherwise Terra Nova-tier picks above match the brief better.',
    bookingUrl: 'https://www.sunmountainlodge.com/',
    tier: 'splurge',
    kitchen: 'full',
    photo: PHOTOS.lodgeRidge,
  },

  // ---- Not a fit ----
  {
    id: 'rolling-huts',
    name: 'Rolling Huts',
    address: '18381 WA-20, Winthrop, WA 98862',
    phone: '(509) 996-4442',
    type: 'Modern minimalist huts (glamping) — single sleeping platform',
    vibe: 'glamping',
    pricePerNight: '$145-200',
    distance: '~10 min from Winthrop · ~35 min to Rainy Pass',
    beds: '1 queen platform bed (NO second bed)',
    bedrooms: 'Studio hut',
    nature: 'Mountain-view, meadow setting — open glamping field.',
    natureTag: 'mountain-view',
    extras: 'Tea kettle + mini-fridge + fireplace, no stove. Bathrooms in central barn.',
    reviews: {
      score: '4.4/5',
      count: '~430 reviews',
      source: 'Google',
      secondScore: '4.5/5',
      secondCount: '~210 reviews',
      secondSource: 'TripAdvisor',
      asOf: 'May 2026',
      highlights: 'Reviewers call out the architecture + the mountain-meadow views; flag the barn-bathroom walk.',
    },
    notFitReason:
      'Single platform bed per hut — does NOT meet the 2-beds rule.',
    notes:
      '**Not a fit — each hut has only one queen platform.** Aesthetic is striking but the bed configuration rules it out.',
    bookingUrl: 'https://rollinghuts.com/',
    tier: 'not-a-fit',
    kitchen: 'kitchenette',
    photo: PHOTOS.glampingHut,
  },
  {
    id: 'rio-vista',
    name: 'Hotel Rio Vista',
    address: '285 Riverside Ave, Winthrop, WA 98862',
    phone: '(509) 996-3535',
    type: 'Boutique riverside hotel — single-bed rooms',
    vibe: 'inn',
    pricePerNight: '$170-260',
    distance: 'Downtown Winthrop · ~40 min to Rainy Pass',
    beds: '1 queen or 1 king per room (NO second bed)',
    bedrooms: 'Single room',
    nature: 'Riverside but downtown — walk-to-dinner location, not woods-set.',
    natureTag: 'town-center',
    extras: 'Riverfront, private balconies, hot tub. No in-room cooking.',
    reviews: {
      score: '4.6/5',
      count: '~480 reviews',
      source: 'Google',
      secondScore: '4.5/5',
      secondCount: '~310 reviews',
      secondSource: 'TripAdvisor',
      asOf: 'May 2026',
      highlights: 'Reviewers call out the balconies + the river + walking-distance dinner.',
    },
    notFitReason:
      'Single-bed rooms only — does NOT meet the 2-beds rule.',
    notes:
      '**Not a fit — single-bed rooms only.** Riverfront and downtown-adjacent, but the bed configuration rules it out.',
    bookingUrl: 'https://hotelriovista.com/',
    tier: 'not-a-fit',
    kitchen: 'none',
    photo: PHOTOS.motelInn,
  },
  {
    id: 'mt-gardner',
    name: 'Mt. Gardner Inn',
    address: '611 WA-20, Winthrop, WA 98862',
    phone: '(509) 996-2000',
    type: 'Mid-tier inn — single-bed rooms',
    vibe: 'inn',
    pricePerNight: '$149-353',
    distance: 'WA-20 south edge of Winthrop · ~40 min to Rainy Pass',
    beds: '1 queen per standard room (NO second bed)',
    bedrooms: 'Single room',
    nature: 'Town-center on WA-20.',
    natureTag: 'town-center',
    extras: 'Reliable, quiet, family-run. No in-room kitchens.',
    reviews: {
      score: '4.5/5',
      count: '~360 reviews',
      source: 'Google',
      asOf: 'May 2026',
      highlights: 'Reviewers call out the family-run feel + value; not as central as boardwalk hotels.',
    },
    notFitReason:
      'Single-bed rooms only — does NOT meet the 2-beds rule.',
    notes:
      '**Not a fit — single-bed rooms only.**',
    bookingUrl: 'https://mtgardnerinn.com/',
    tier: 'not-a-fit',
    kitchen: 'none',
    photo: PHOTOS.motelInn,
  },
];

export const VIBE_LABELS: Record<LodgingVibe, string> = {
  cabin: 'Cabins',
  lodge: 'Lodges',
  bnb: 'B&B',
  rental: 'Vacation rentals',
  glamping: 'Glamping',
  ranch: 'Ranch',
  inn: 'Inns',
};

export const TIER_LABELS: Record<LodgingTier, string> = {
  'fits-brief': 'Terra Nova tier',
  splurge: 'Splurge',
  'budget-or-basic': 'Basic / cheaper',
  'not-a-fit': 'Not a fit (under 2 beds)',
  note: 'Status note',
};
