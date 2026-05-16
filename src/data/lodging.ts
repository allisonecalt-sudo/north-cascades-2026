/**
 * Lodging — re-ranked on the Terra Nova brief.
 *
 * Axis (per Allison May 16, 2026):
 *   - Spacious, a little nicer than basic, ~$200-300 per night.
 *   - Kitchens are a NICE-TO-HAVE, not the gating criterion (kosher is flexible —
 *     packaged hechsher goods + a fridge cover most of the trip).
 *   - Splurge options ($400+) are demoted, not removed — kept as "if you want
 *     to splurge" cards near the bottom.
 *
 * No "top pick" badges. Every card just shows what it costs, what it has, and
 * who it might fit. Reader decides.
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
export type LodgingTier = 'fits-brief' | 'splurge' | 'budget-or-basic' | 'note';

export interface LodgingPhoto {
  src: string;
  alt: string;
  credit?: string;
  creditUrl?: string;
  width: number;
  height: number;
}

export type KitchenLevel = 'full' | 'kitchenette' | 'none';

export interface Lodging {
  id: string;
  name: string;
  address: string;
  phone?: string;
  type: string;
  vibe: LodgingVibe;
  pricePerNight: string;
  distance: string;
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
  // ---- Fits the Terra Nova brief ($200-300, spacious, a little nicer) ----
  {
    id: 'rhody-house',
    name: 'The Rhody House',
    address: 'Marblemount, WA · vacation rental',
    type: 'Two-bedroom cabin vacation rental',
    vibe: 'rental',
    pricePerNight: '$190-260',
    distance: 'Marblemount · ~50 min to Cascade Pass trailhead',
    notes:
      'Bright cabin rental, well-reviewed, room to spread out. Full kitchen + outdoor space. Sits in the Terra Nova-tier sweet spot — spacious, a little nicer than basic, not a splurge.',
    bookingHint: 'Listed on Airbnb — search "Rhody House Marblemount".',
    bookingUrl: 'https://www.airbnb.com/marblemount-wa/stays',
    tier: 'fits-brief',
    kitchen: 'full',
    photo: PHOTOS.rentalAFrame,
  },
  {
    id: 'nc-hideaway',
    name: 'North Cascades Hideaway',
    address: 'Concrete, WA · vacation rental',
    type: 'Cabin vacation rental with fenced yard + firepit',
    vibe: 'rental',
    pricePerNight: '$200-280',
    distance: '~25 min west of Marblemount · ~1 hr 25 min to Cascade Pass',
    notes:
      'Full kitchen, front + back decks, fire pit, quiet setting. Further from the trailhead but a calm base if the cabin matters more than the drive minutes.',
    bookingHint: 'Listed on Airbnb.',
    bookingUrl: 'https://www.airbnb.com/rooms/724602112999024219',
    tier: 'fits-brief',
    kitchen: 'full',
    photo: PHOTOS.rentalModern,
  },
  {
    id: 'nc-riverside',
    name: 'North Cascades Riverside Retreat',
    address: 'Concrete, WA · vacation rental',
    type: 'Skagit River cabin with hot tub + firepit',
    vibe: 'rental',
    pricePerNight: '$250-350',
    distance: '~25 min west of Marblemount · ~1 hr 25 min to Cascade Pass',
    notes:
      'Family-cabin feel, full kitchen, private hot tub on the deck, river access. Reviewers call out the deck and the water sound.',
    bookingUrl: 'https://www.airbnb.com/rooms/1159630003390456641',
    tier: 'fits-brief',
    kitchen: 'full',
    photo: PHOTOS.cabinHot,
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
    notes:
      'Cabins with kitchenettes, sofa beds, smart TVs, free WiFi. A bit under the Terra Nova price band — fine if you want simple. (This is the property that operated as Skagit River Resort / Clark\'s Cabins until early 2026; call to confirm cabin scope before booking.)',
    bookingUrl: 'https://glacierpeakresortandwinery.com/',
    tier: 'fits-brief',
    kitchen: 'kitchenette',
    photo: PHOTOS.cabinWoods,
  },
  {
    id: 'ovenells',
    name: 'Ovenell\'s Heritage Inn & Log Cabins',
    address: '46276 Concrete Sauk Valley Rd, Concrete, WA 98237',
    phone: '(360) 853-8494',
    type: 'Log cabins + guesthouses on a 580-acre cattle ranch',
    vibe: 'ranch',
    pricePerNight: '$200-330',
    distance: '~25 min west of Marblemount · ~1 hr 25 min to Cascade Pass',
    notes:
      'Working cattle ranch with Mt. Baker views. Log cabins have full kitchens; guesthouse rooms do not. Distinctive setting — pick a cabin specifically if cooking matters.',
    bookingUrl: 'https://www.ovenells-inn.com/',
    tier: 'fits-brief',
    kitchen: 'full',
    photo: PHOTOS.ranchProperty,
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
    notes:
      'Riverfront private house with full kitchen, closest rental to the Cascade Pass trailhead. Splurge tier — listed if you want a step up from Terra Nova-tier.',
    bookingUrl: 'https://www.cascaderiverhouse.com/',
    tier: 'splurge',
    kitchen: 'full',
    photo: PHOTOS.cabinRiver,
  },

  // ---- Budget / basic / status notes ----
  {
    id: 'buffalo-run',
    name: 'Buffalo Run Inn',
    address: '60084 WA-20, Marblemount, WA 98267',
    phone: '(360) 873-2103',
    type: 'Historic inn (1889, renovated 2004)',
    vibe: 'inn',
    pricePerNight: '$130-180',
    distance: 'WA-20 in Marblemount center · ~55 min to Cascade Pass',
    notes:
      'Inn-style rooms — no in-room cooking. Cheaper, simpler — listed in case price drops are the priority.',
    bookingUrl: 'https://www.buffalorunrestaurant.com/',
    tier: 'budget-or-basic',
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
    notes:
      'Traditional rooms, no in-room kitchens. Same budget-tier tradeoff as Buffalo Run — fine if a cabin isn\'t available.',
    bookingUrl: 'https://www.northcascadesinn.com/',
    tier: 'budget-or-basic',
    kitchen: 'none',
    photo: PHOTOS.motelInn,
  },
  {
    id: 'skagit-river-resort-note',
    name: 'Skagit River Resort / Clark\'s Cabins — closed (status note)',
    address: '58468 Clark Cabin Rd, Rockport, WA 98283',
    phone: '(360) 708-3005 (current operator)',
    type: 'No longer operating under this name',
    vibe: 'cabin',
    pricePerNight: 'See Glacier Peak Resort above',
    distance: 'Same address, new operator',
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
  // ---- Fits the Terra Nova brief ($200-300, spacious, a little nicer) ----
  {
    id: 'methow-river',
    name: 'Methow River Lodge & Cabins',
    address: '110 White Ave, Winthrop, WA 98862',
    phone: '(509) 996-4348',
    type: 'Cabins + lodge rooms on the Methow River',
    vibe: 'cabin',
    pricePerNight: '$200-250',
    distance: 'Walking distance to Winthrop boardwalk · ~40 min to Rainy Pass',
    notes:
      'River setting, walkable to downtown Winthrop for dinner if you want to eat out. Cabins have kitchenettes (microwave + fridge + small stove); inn rooms are basic. Lands squarely in the Terra Nova-tier sweet spot.',
    bookingUrl: 'https://www.methowriverlodge.com/',
    tier: 'fits-brief',
    kitchen: 'kitchenette',
    photo: PHOTOS.cabinRiver,
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
    notes:
      'Riverside chalets with full kitchens + private hot tubs. Walkable to Winthrop boardwalk. Solid spacious-cabin pick at the upper end of the Terra Nova band.',
    bookingUrl: 'https://riversedgewinthrop.com/',
    tier: 'fits-brief',
    kitchen: 'full',
    photo: PHOTOS.cabinHot,
  },
  {
    id: 'freestone',
    name: 'Freestone Inn — cabins',
    address: '31 Early Winters Dr, Mazama, WA 98833',
    phone: '(509) 996-3906',
    type: 'Rustic cabins with apartment-sized kitchens',
    vibe: 'lodge',
    pricePerNight: '$300+ cabins (Aug peak)',
    distance: '15 mi west of Winthrop · ~25 min to Rainy Pass',
    notes:
      'Cabins have apartment-sized kitchens (smaller than full but workable). Pool, hot tub, on-site restaurant. Closest east-side stay to Rainy Pass, which matters on Maple Pass morning. Top of the Terra Nova band.',
    bookingUrl: 'https://www.freestoneinn.com/',
    tier: 'fits-brief',
    kitchen: 'kitchenette',
    photo: PHOTOS.lodgeMountain,
  },
  {
    id: 'chewuch',
    name: 'Chewuch Inn & Cabins',
    address: '223 White Ave, Winthrop, WA 98862',
    phone: '(509) 996-3107',
    type: 'B&B inn (11 rooms) + 6 cabins',
    vibe: 'bnb',
    pricePerNight: '$160-260',
    distance: 'Half-mile from downtown Winthrop · ~40 min to Rainy Pass',
    notes:
      'Cabins (with kitchenettes) sit in the Terra Nova band; inn rooms are bare. Buffet breakfast included but not relevant here. Walkable to the Old-West boardwalk.',
    bookingUrl: 'https://chewuchinn.com/',
    tier: 'fits-brief',
    kitchen: 'kitchenette',
    photo: PHOTOS.bnbCozy,
  },
  {
    id: 'inn-at-mazama',
    name: 'The Inn at Mazama (Mazama Country Inn)',
    address: '15 Country Rd, Mazama, WA 98833',
    phone: '(509) 996-2681',
    type: 'Lodge rooms + nightly cabins',
    vibe: 'lodge',
    pricePerNight: '$200-375',
    distance: 'Mazama village · ~30 min to Rainy Pass',
    notes:
      'Pool, hot tub, yoga studio. Some cabins have kitchens, lodge rooms do not — confirm per-unit at booking. Solid Mazama-side option close to Rainy Pass.',
    bookingUrl: 'https://www.innmazama.com/',
    tier: 'fits-brief',
    kitchen: 'kitchenette',
    photo: PHOTOS.lodgeMountain,
  },
  {
    id: 'spring-creek-ranch',
    name: 'Spring Creek Ranch',
    address: 'Winthrop, WA 98862',
    type: 'Three private cabins on 60 acres · full kitchens',
    vibe: 'ranch',
    pricePerNight: '$220-340',
    distance: 'On the Methow River · ~7 min to downtown · ~45 min to Rainy Pass',
    notes:
      'Spring Creek Cabin (2BR log), Owl\'s Nest (studio), Ranch House — all full kitchens, alfalfa-field setting. Private and quiet. Top of the Terra Nova band.',
    bookingUrl: 'https://springcreekwinthrop.com/lodging/',
    tier: 'fits-brief',
    kitchen: 'full',
    photo: PHOTOS.cabinClassic,
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
    notes:
      '1,500 acres of trails + spa. Patterson Lake Cabins have full kitchens, fireplaces, porches. Splurge tier — listed if you want the resort feel; otherwise Terra Nova-tier picks above match the brief better.',
    bookingUrl: 'https://www.sunmountainlodge.com/',
    tier: 'splurge',
    kitchen: 'full',
    photo: PHOTOS.lodgeRidge,
  },

  // ---- Budget / different vibe ----
  {
    id: 'rolling-huts',
    name: 'Rolling Huts',
    address: '18381 WA-20, Winthrop, WA 98862',
    phone: '(509) 996-4442',
    type: 'Modern minimalist huts (glamping)',
    vibe: 'glamping',
    pricePerNight: '$145-200',
    distance: '~10 min from Winthrop · ~35 min to Rainy Pass',
    notes:
      'Tea kettle + mini-fridge + fireplace, no stove. Bathrooms in a central barn. Two-night minimum. Different vibe — listed in case the aesthetic is the draw.',
    bookingUrl: 'https://rollinghuts.com/',
    tier: 'budget-or-basic',
    kitchen: 'kitchenette',
    photo: PHOTOS.glampingHut,
  },
  {
    id: 'rio-vista',
    name: 'Hotel Rio Vista',
    address: '285 Riverside Ave, Winthrop, WA 98862',
    phone: '(509) 996-3535',
    type: 'Boutique riverside hotel (no in-room kitchens)',
    vibe: 'inn',
    pricePerNight: '$170-260',
    distance: 'Downtown Winthrop · ~40 min to Rainy Pass',
    notes:
      'Riverfront, private balconies, hot tub. No in-room cooking — fine if eating out / cold-meal mode is OK.',
    bookingUrl: 'https://hotelriovista.com/',
    tier: 'budget-or-basic',
    kitchen: 'none',
    photo: PHOTOS.motelInn,
  },
  {
    id: 'mt-gardner',
    name: 'Mt. Gardner Inn',
    address: '611 WA-20, Winthrop, WA 98862',
    phone: '(509) 996-2000',
    type: 'Mid-tier inn (no kitchens)',
    vibe: 'inn',
    pricePerNight: '$149-353',
    distance: 'WA-20 south edge of Winthrop · ~40 min to Rainy Pass',
    notes:
      'Reliable, quiet, family-run. No in-room kitchens. Cheaper end of the spectrum.',
    bookingUrl: 'https://mtgardnerinn.com/',
    tier: 'budget-or-basic',
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
  note: 'Status note',
};
