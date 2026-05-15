export type LodgingVibe =
  | 'cabin'
  | 'lodge'
  | 'bnb'
  | 'rental'
  | 'glamping'
  | 'ranch'
  | 'inn';

export interface LodgingPhoto {
  src: string;
  alt: string;
  /** Optional credit line displayed under the image (Wikimedia attribution etc). */
  credit?: string;
  /** Source page (Wikimedia file page, Unsplash photo page) for click-through credit. */
  creditUrl?: string;
  /** Intrinsic image dimensions for layout-shift prevention. */
  width: number;
  height: number;
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
  notes: string;
  bookingHint?: string;
  bookingUrl?: string;
  topPick?: boolean;
  photo: LodgingPhoto;
}

// Generic, property-appropriate photos from Unsplash's hotlinking-permitted CDN.
// Each URL uses ?w=800 to cap bandwidth; full-resolution photos are available
// on Unsplash by clicking the credit link.
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
  riverCottage: {
    src: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=800&q=70',
    alt: 'Riverfront cottage with deck on a clear mountain river.',
    credit: 'Photo: Roberto Nickson / Unsplash',
    creditUrl: 'https://unsplash.com/photos/I4iLmGLb6Bk',
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

export const WEST_LODGING: Lodging[] = [
  {
    id: 'skagit-river-resort',
    name: 'Skagit River Resort (Clark’s Cabins)',
    address: '58468 Clark Cabin Rd, Rockport, WA 98283',
    phone: '(360) 873-2250',
    type: 'Theme cabins · kitchen · gas fireplace',
    vibe: 'cabin',
    pricePerNight: '$150-250 peak',
    distance: '~10 min west of Marblemount · ~1 hr to Cascade Pass trailhead',
    notes:
      'Fully equipped theme cabins, recently remodeled under new owners. On-site Clark’s Eatery (famous cinnamon rolls). Matches the spacious-cabin brief.',
    bookingHint: 'Book direct by phone.',
    bookingUrl: 'https://www.skagitriverresort.com/',
    topPick: true,
    photo: PHOTOS.cabinClassic,
  },
  {
    id: 'glacier-peak',
    name: 'Glacier Peak Resort & Winery',
    address: '58468 Clark Cabin Rd, Rockport, WA 98283',
    phone: '(360) 708-3005',
    type: 'Cabins · on-site restaurant + winery',
    vibe: 'cabin',
    pricePerNight: '$150-220 cabins',
    distance: 'Same road as Skagit River Resort · ~1 hr to Cascade Pass',
    notes: 'Cabins with sofa beds, smart TVs, free WiFi. Winery + restaurant on property.',
    bookingUrl: 'https://www.glacierpeakresort.com/',
    photo: PHOTOS.cabinWoods,
  },
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
      'Walkable to Buffalo Run Restaurant + Marblemount Country Store. Inn-style rather than cabin — solid backup.',
    bookingUrl: 'https://www.buffalorunrestaurant.com/',
    photo: PHOTOS.innClassic,
  },
  {
    id: 'ovenells',
    name: 'Ovenell’s Heritage Inn & Log Cabins',
    address: '46276 Concrete Sauk Valley Rd, Concrete, WA 98237',
    phone: '(360) 853-8494',
    type: 'Log cabins + guesthouses on a 580-acre cattle ranch',
    vibe: 'ranch',
    pricePerNight: '$200-330',
    distance: '~25 min west of Marblemount · ~1 hr 25 min to Cascade Pass',
    notes:
      'Working cattle ranch with views of Mt. Baker. Bear Hollow, Cougar Crest, Eagle guesthouses + four log cabins. AAA-approved. Distinctive ranch experience.',
    bookingUrl: 'https://www.ovenells-inn.com/',
    topPick: true,
    photo: PHOTOS.ranchProperty,
  },
  {
    id: 'cascade-river-house',
    name: 'Cascade River House',
    address: 'Cascade River Rd, Marblemount, WA 98267',
    type: 'Whole-house vacation rental on Cascade River',
    vibe: 'rental',
    pricePerNight: '$350-500',
    distance: 'On Cascade River Rd · ~30-45 min to Cascade Pass trailhead',
    notes:
      'Riverfront private house, sleeps a small group. Closest rental to the Cascade Pass trailhead — the road literally runs by the door.',
    bookingUrl: 'https://www.cascaderiverhouse.com/',
    photo: PHOTOS.cabinRiver,
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
      'Just off the North Cascades Highway. Front and back decks, fire pit, dog-friendly. Quiet evening base.',
    bookingHint: 'Listed on Airbnb.',
    bookingUrl: 'https://www.airbnb.com/rooms/724602112999024219',
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
      'Family cabin nestled along the Skagit River. Private hot tub on deck, river access. Reviewers call out the deck and water sound.',
    bookingUrl: 'https://www.airbnb.com/rooms/1159630003390456641',
    photo: PHOTOS.cabinHot,
  },
  {
    id: 'rhody-house',
    name: 'The Rhody House',
    address: 'Marblemount, WA · vacation rental',
    type: 'Two-bedroom cabin vacation rental',
    vibe: 'rental',
    pricePerNight: '$190-260',
    distance: 'Marblemount · ~50 min to Cascade Pass trailhead',
    notes:
      'Bright, well-reviewed cabin rental — repeatedly cited as ideal for Cascade Pass day hikers. Full kitchen + outdoor space.',
    bookingHint: 'Listed on Airbnb (search “Rhody House Marblemount”).',
    bookingUrl: 'https://www.airbnb.com/marblemount-wa/stays',
    photo: PHOTOS.rentalAFrame,
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
      '10 traditional rooms downstairs + 5 economy rooms upstairs (shared bath). Restaurant discount at Upriver Grill & Taproom next door. Online-only reservations.',
    bookingUrl: 'https://www.northcascadesinn.com/',
    photo: PHOTOS.motelInn,
  },
];

export const EAST_LODGING: Lodging[] = [
  {
    id: 'freestone',
    name: 'Freestone Inn & Cabins',
    address: '31 Early Winters Dr, Mazama, WA 98833',
    phone: '(509) 996-3906',
    type: 'Lodge rooms + lakeside cabins · pool · hot tub · restaurant',
    vibe: 'lodge',
    pricePerNight: '$200-300 lodge · $300+ cabins (Aug peak)',
    distance: '15 mi west of Winthrop · ~25 min to Rainy Pass',
    notes:
      'Lodge rooms with gas fireplace + private deck overlooking Freestone Lake; rustic cabins with kitchens. Closest east-side stay to Rainy Pass. Strongest match for "spacious + a little nicer than basic."',
    bookingUrl: 'https://www.freestoneinn.com/',
    topPick: true,
    photo: PHOTOS.lodgeMountain,
  },
  {
    id: 'sun-mountain',
    name: 'Sun Mountain Lodge',
    address: '604 Patterson Lake Rd, Winthrop, WA 98862',
    phone: '(509) 996-2211',
    type: 'Iconic ridge-top lodge · Patterson Lake Cabins · spa',
    vibe: 'lodge',
    pricePerNight: 'From $270 + ~$25 resort fee · cabins higher',
    distance: '~10 min from Winthrop · ~45 min to Rainy Pass',
    notes:
      '1,500 acres of trails. Main lodge rooms or Patterson Lake Cabins (full kitchens, fireplaces, porches). Multiple restaurants, kayaks on the lake. Splurge.',
    bookingUrl: 'https://www.sunmountainlodge.com/',
    topPick: true,
    photo: PHOTOS.lodgeRidge,
  },
  {
    id: 'methow-river',
    name: 'Methow River Lodge & Cabins',
    address: '110 White Ave, Winthrop, WA 98862',
    phone: '(509) 996-4348',
    type: 'Cabins + lodge rooms on the Methow River',
    vibe: 'cabin',
    pricePerNight: '$200-250',
    distance: 'Walking distance to Winthrop boardwalk',
    notes:
      'Mid-tier — nicer than basic. River setting, kitchenettes, walkable to dinner and the boardwalk.',
    bookingUrl: 'https://www.methowriverlodge.com/',
    photo: PHOTOS.cabinRiver,
  },
  {
    id: 'inn-at-mazama',
    name: 'The Inn at Mazama (Mazama Country Inn)',
    address: '15 Country Rd, Mazama, WA 98833',
    phone: '(509) 996-2681',
    type: 'Lodge rooms + nightly cabins · pool · hot tub',
    vibe: 'lodge',
    pricePerNight: '$200-375',
    distance: 'Mazama village · ~30 min to Rainy Pass',
    notes:
      '18 guest rooms, pet-friendly options, seasonal outdoor pool, fitness center, yoga studio. Adventure basecamp at the edge of the Pasayten Wilderness. On-site restaurant.',
    bookingUrl: 'https://www.innmazama.com/',
    photo: PHOTOS.lodgeMountain,
  },
  {
    id: 'chewuch',
    name: 'Chewuch Inn & Cabins',
    address: '223 White Ave, Winthrop, WA 98862',
    phone: '(509) 996-3107',
    type: 'B&B inn (11 rooms) + 6 cabins · hot tub · full breakfast',
    vibe: 'bnb',
    pricePerNight: '$160-260',
    distance: 'Half-mile from downtown Winthrop · ~40 min to Rainy Pass',
    notes:
      'Hearty buffet breakfast included, deluxe linens, fireplaces, kitchenettes. Walkable to Old-West boardwalk. Strong reviews for value + warm hospitality.',
    bookingUrl: 'https://chewuchinn.com/',
    photo: PHOTOS.bnbCozy,
  },
  {
    id: 'rivers-edge',
    name: 'River’s Edge Resort',
    address: '115 Riverside Ave, Winthrop, WA 98862',
    phone: '(509) 996-8000',
    type: 'Riverside chalets + cottages with private hot tubs',
    vibe: 'cabin',
    pricePerNight: '$210-310',
    distance: 'Downtown Winthrop on the Chewuch River · ~40 min to Rainy Pass',
    notes:
      'Every cabin has a private deck + hot tub. Two-bedroom riverside chalets sleep four with full kitchens. Walk to dinner.',
    bookingUrl: 'https://riversedgewinthrop.com/',
    photo: PHOTOS.cabinHot,
  },
  {
    id: 'rio-vista',
    name: 'Hotel Rio Vista',
    address: '285 Riverside Ave, Winthrop, WA 98862',
    phone: '(509) 996-3535',
    type: 'Boutique riverside hotel (every room has a private balcony)',
    vibe: 'inn',
    pricePerNight: '$170-260',
    distance: 'Downtown Winthrop, walkable everywhere · ~40 min to Rainy Pass',
    notes:
      'Family-owned, riverfront. Every room has a private balcony overlooking the Methow/Chewuch confluence. Riverside hot tub. Best walkable hotel pick.',
    bookingUrl: 'https://hotelriovista.com/',
    photo: PHOTOS.motelInn,
  },
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
      'Six architect-designed huts on a meadow. Tea kettle, mini-fridge, fireplace, WiFi in each. Bathrooms in a central barn. Glamping aesthetic — clean modern not roughing-it. Two-night minimum.',
    bookingUrl: 'https://rollinghuts.com/',
    photo: PHOTOS.glampingHut,
  },
  {
    id: 'spring-creek-ranch',
    name: 'Spring Creek Ranch',
    address: 'Winthrop, WA 98862',
    type: 'Family ranch w/ three private cabins on 60 acres',
    vibe: 'ranch',
    pricePerNight: '$220-340',
    distance: 'On the Methow River · ~7 min to downtown · ~45 min to Rainy Pass',
    notes:
      'Spring Creek Cabin (2BR custom log), Owl’s Nest (studio for couples), Ranch House. Goose-down duvets, local pottery, alfalfa-field setting. Quiet + private.',
    bookingUrl: 'https://springcreekwinthrop.com/lodging/',
    photo: PHOTOS.cabinClassic,
  },
  {
    id: 'mt-gardner',
    name: 'Mt. Gardner Inn',
    address: '611 WA-20, Winthrop, WA 98862',
    phone: '(509) 996-2000',
    type: 'Mid-tier inn (standard, deluxe, luxury suites)',
    vibe: 'inn',
    pricePerNight: '$149-353',
    distance: 'WA-20 at the south edge of Winthrop · ~40 min to Rainy Pass',
    notes:
      'Reliable mid-tier — quieter than the riverside hotels. Luxury suites available for the splurge-but-not-Sun-Mountain budget. Family-run, easy parking.',
    bookingUrl: 'https://mtgardnerinn.com/',
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
