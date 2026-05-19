/**
 * Map locations — every marker the Map section renders.
 *
 * Wave 3 GENIUS pass (May 17, 2026):
 *   - Expanded types: sunset, water, cool-sleeping (in addition to existing
 *     airport / lodging-west / lodging-east / trailhead / viewpoint / town /
 *     seattle).
 *   - Per-marker meta lets popups show drive-time matrix for lodging, mileage
 *     + difficulty + WTA link for trailheads, mile-marker + best-time for
 *     viewpoints, cost + time + best-window for water activities, sunset
 *     direction + accessFromX for sunset spots.
 *   - Hero photo URL on every location that has one (lodging, trailheads,
 *     viewpoints — pulled from the corresponding data file by id).
 *
 * Path association rule (used by map.ts to fade markers when a path is picked):
 *   - 'west'   → Path A + B (west-side stays)
 *   - 'east'   → Path B + C (east-side stays)
 *   - 'both'   → shown on every path (trailheads, viewpoints, airports, towns)
 */

export type LocationType =
  | 'airport'
  | 'lodging-west'
  | 'lodging-east'
  | 'cool-sleeping'
  | 'trailhead'
  | 'viewpoint'
  | 'sunset'
  | 'water'
  | 'town'
  | 'seattle';

export type PathAssoc = 'west' | 'east' | 'both';

/** Optional hero photo. Loaded lazily by the popup. */
export interface MapPhoto {
  src: string;
  alt: string;
}

/** Optional drive-time row used by lodging popups. */
export interface PopupDriveRow {
  to: string;
  minutes: number;
  miles: number;
}

/**
 * Type-specific meta — keyed by which kind of popup detail to render.
 * Only the matching `meta` block renders for a given LocationType.
 */
export interface MapMeta {
  lodging?: {
    beds: string;
    priceTier: string;
    kitchen?: string;
    drive?: PopupDriveRow[];
    bookUrl?: string;
  };
  trailhead?: {
    mileage: string;
    elevation: string;
    difficulty: string;
    wtaUrl?: string;
  };
  viewpoint?: {
    mileMarker: string;
    bestTime: string;
  };
  sunset?: {
    rank: number;
    viewDirection: string;
    fromLodgingNote?: string;
    bestByPath: string;
  };
  water?: {
    cost: string;
    time: string;
    operator?: string;
    operatorUrl?: string;
  };
  coolSleeping?: {
    access: string;
    beds: string;
    priceTier: string;
    bookUrl?: string;
    bookingNote?: string;
  };
  town?: {
    role: string;
  };
  airport?: {
    code: string;
    nonstopFromNyc: boolean;
  };
}

export interface MapLocation {
  id: string;
  type: LocationType;
  name: string;
  /** 1-line context shown in the popup. */
  context: string;
  lat: number;
  lng: number;
  /** Which paths surface this marker. 'both' = always full opacity. */
  pathAssoc: PathAssoc;
  /** Optional same-page anchor (#lodging) so the popup deep-links. */
  anchor?: string;
  /** Optional external page (e.g. for-erin.html#sleeping-X). */
  externalAnchor?: string;
  /** Optional hero photo for the popup. */
  photo?: MapPhoto;
  /** Type-specific meta block (renders matching popup section). */
  meta?: MapMeta;
}

// ====================================================================
// Airports
// ====================================================================
const AIRPORTS: MapLocation[] = [
  {
    id: 'airport-sea',
    type: 'airport',
    name: 'SEA — Seattle-Tacoma',
    context: 'Default arrival. Nonstop on United EWR→SEA from NYC (primary — Allison\'s travel credit + both have loyalty). Alaska is the fallback carrier.',
    lat: 47.4502,
    lng: -122.3088,
    pathAssoc: 'both',
    anchor: '#flights',
    meta: { airport: { code: 'SEA', nonstopFromNyc: true } },
  },
  {
    id: 'airport-bli',
    type: 'airport',
    name: 'BLI — Bellingham',
    context: 'Northern alt — closer to the park, no nonstop from NYC.',
    lat: 48.7928,
    lng: -122.5375,
    pathAssoc: 'both',
    anchor: '#flights',
    meta: { airport: { code: 'BLI', nonstopFromNyc: false } },
  },
];

// ====================================================================
// Towns
// ====================================================================
const TOWNS: MapLocation[] = [
  {
    id: 'town-bellingham',
    type: 'town',
    name: 'Bellingham',
    context: 'Northern gateway — closest big town to BLI.',
    lat: 48.7519,
    lng: -122.4787,
    pathAssoc: 'both',
    meta: { town: { role: 'Northern gateway · BLI airport city' } },
  },
  {
    id: 'town-concrete',
    type: 'town',
    name: 'Concrete',
    context: 'Small Skagit Valley town on WA-20, ~25 min west of Marblemount.',
    lat: 48.5392,
    lng: -121.7569,
    pathAssoc: 'west',
    meta: { town: { role: 'West base · groceries + gas before park' } },
  },
  {
    id: 'town-marblemount',
    type: 'town',
    name: 'Marblemount',
    context: 'Last gas + groceries before WA-20 enters the park.',
    lat: 48.5316,
    lng: -121.4448,
    pathAssoc: 'west',
    meta: { town: { role: 'West base · NPS Wilderness Info Center' } },
  },
  {
    id: 'town-newhalem',
    type: 'town',
    name: 'Newhalem',
    context: 'NPS company town inside the park, MP 120.',
    lat: 48.6731,
    lng: -121.2459,
    pathAssoc: 'both',
    meta: { town: { role: 'Visitor center + Ladder Creek Falls' } },
  },
  {
    id: 'town-mazama',
    type: 'town',
    name: 'Mazama',
    context: 'East-side village, ~25 min from Rainy Pass.',
    lat: 48.5919,
    lng: -120.4053,
    pathAssoc: 'east',
    meta: { town: { role: 'East base · Mazama Store + trailhead access' } },
  },
  {
    id: 'town-winthrop',
    type: 'town',
    name: 'Winthrop',
    context: 'Old-west boardwalk town. East-side base.',
    lat: 48.476,
    lng: -120.1859,
    pathAssoc: 'east',
    meta: { town: { role: 'East base · main lodging hub' } },
  },
];

// ====================================================================
// Lodging — West side (drive times from lodging.ts Wave 3 data)
// ====================================================================
const LODGING_PHOTO_FALLBACK_WEST =
  'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?auto=format&fit=crop&w=420&q=70';
const LODGING_PHOTO_FALLBACK_EAST =
  'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=420&q=70';

const LODGING_WEST: MapLocation[] = [
  {
    id: 'lodging-rhody-house',
    type: 'lodging-west',
    name: 'The Rhody House',
    context: 'Marblemount · 2BR cabin rental',
    lat: 48.5325,
    lng: -121.4439,
    pathAssoc: 'west',
    anchor: '#lodging',
    photo: {
      src: 'https://images.unsplash.com/photo-1542718610-a1d656d1884c?auto=format&fit=crop&w=420&q=70',
      alt: 'Modern A-frame style cabin in the woods.',
    },
    meta: {
      lodging: {
        beds: '1 queen + 1 queen · 2 BR',
        priceTier: '$190-260',
        kitchen: 'Full kitchen',
        drive: [
          { to: 'Cascade Pass', minutes: 50, miles: 23 },
          { to: 'Diablo Lake', minutes: 28, miles: 16 },
          { to: 'Newhalem', minutes: 18, miles: 8 },
        ],
        bookUrl: 'https://www.airbnb.com/marblemount-wa/stays',
      },
    },
  },
  {
    id: 'lodging-nc-hideaway',
    type: 'lodging-west',
    name: 'NC Hideaway',
    context: 'Concrete · 2BR cabin · woods-set',
    lat: 48.5396,
    lng: -121.7575,
    pathAssoc: 'west',
    anchor: '#lodging',
    photo: { src: LODGING_PHOTO_FALLBACK_WEST, alt: 'Wooded cabin retreat.' },
    meta: {
      lodging: {
        beds: '1 queen + 1 queen · 2 BR',
        priceTier: '$200-280',
        kitchen: 'Full kitchen',
        drive: [
          { to: 'Cascade Pass', minutes: 85, miles: 42 },
          { to: 'Diablo Lake', minutes: 55, miles: 32 },
          { to: 'Grocery', minutes: 10, miles: 5 },
        ],
        bookUrl: 'https://www.airbnb.com/rooms/724602112999024219?check_in=2026-08-16&check_out=2026-08-20&adults=2',
      },
    },
  },
  {
    id: 'lodging-nc-riverside',
    type: 'lodging-west',
    name: 'NC Riverside Retreat',
    context: 'Concrete · Skagit River cabin + hot tub',
    lat: 48.5388,
    lng: -121.7521,
    pathAssoc: 'west',
    anchor: '#lodging',
    photo: { src: LODGING_PHOTO_FALLBACK_WEST, alt: 'Riverside cabin deck.' },
    meta: {
      lodging: {
        beds: '1 queen + 1 queen · 2 BR',
        priceTier: '$250-350',
        kitchen: 'Full kitchen',
        drive: [
          { to: 'Cascade Pass', minutes: 85, miles: 42 },
          { to: 'Diablo Lake', minutes: 55, miles: 32 },
          { to: 'Newhalem', minutes: 45, miles: 26 },
        ],
        bookUrl: 'https://www.airbnb.com/rooms/1159630003390456641?check_in=2026-08-16&check_out=2026-08-20&adults=2',
      },
    },
  },
  {
    id: 'lodging-glacier-peak',
    type: 'lodging-west',
    name: 'Glacier Peak Resort & Winery',
    context: 'Rockport · cabins + winery',
    lat: 48.4882,
    lng: -121.5803,
    pathAssoc: 'west',
    anchor: '#lodging',
    photo: { src: LODGING_PHOTO_FALLBACK_WEST, alt: 'Resort cabins among evergreens.' },
    meta: {
      lodging: {
        beds: 'Cabin configs vary · verify 2-bed at booking',
        priceTier: '$150-220',
        kitchen: 'Kitchenette',
        drive: [
          { to: 'Cascade Pass', minutes: 70, miles: 35 },
          { to: 'Diablo Lake', minutes: 50, miles: 27 },
        ],
        bookUrl: 'https://glacierpeakresortandwinery.com/',
      },
    },
  },
  {
    id: 'lodging-ovenells',
    type: 'lodging-west',
    name: "Ovenell's Heritage Inn",
    context: 'Concrete · log cabins on 580-acre ranch',
    lat: 48.5354,
    lng: -121.7836,
    pathAssoc: 'west',
    anchor: '#lodging',
    photo: { src: LODGING_PHOTO_FALLBACK_WEST, alt: 'Log cabin on a ranch.' },
    meta: {
      lodging: {
        beds: '2BR cabins: 1 queen + 1 queen · verify per cabin',
        priceTier: '$200-330',
        kitchen: 'Full kitchen',
        drive: [
          { to: 'Cascade Pass', minutes: 85, miles: 42 },
          { to: 'Diablo Lake', minutes: 55, miles: 32 },
        ],
        bookUrl: 'https://www.ovenells-inn.com/',
      },
    },
  },
  {
    id: 'lodging-cascade-river-house',
    type: 'lodging-west',
    name: 'Cascade River House',
    context: 'Marblemount · whole-house · splurge tier',
    lat: 48.5099,
    lng: -121.3892,
    pathAssoc: 'west',
    anchor: '#lodging',
    photo: { src: LODGING_PHOTO_FALLBACK_WEST, alt: 'Riverside vacation home.' },
    meta: {
      lodging: {
        beds: 'Multi-bed · whole-house · verify config',
        priceTier: '$350-500',
        kitchen: 'Full kitchen',
        drive: [
          { to: 'Cascade Pass', minutes: 40, miles: 17 },
          { to: 'Diablo Lake', minutes: 30, miles: 18 },
        ],
        bookUrl: 'https://www.cascaderiverhouse.com/',
      },
    },
  },
  {
    id: 'lodging-buffalo-run',
    type: 'lodging-west',
    name: 'Buffalo Run Inn',
    context: 'Marblemount · historic inn',
    lat: 48.5319,
    lng: -121.4421,
    pathAssoc: 'west',
    anchor: '#lodging',
    photo: { src: LODGING_PHOTO_FALLBACK_WEST, alt: 'Historic Western inn.' },
    meta: {
      lodging: {
        beds: 'Rooms vary · verify 2-bed configuration',
        priceTier: '$130-180',
        drive: [
          { to: 'Cascade Pass', minutes: 50, miles: 23 },
          { to: 'Newhalem', minutes: 18, miles: 8 },
        ],
        bookUrl: 'https://www.booking.com/searchresults.html?ss=Buffalo+Run+Inn+Marblemount',
      },
    },
  },
  {
    id: 'lodging-nc-inn',
    type: 'lodging-west',
    name: 'North Cascades Inn',
    context: 'Marblemount · restored lodge',
    lat: 48.5322,
    lng: -121.4413,
    pathAssoc: 'west',
    anchor: '#lodging',
    photo: { src: LODGING_PHOTO_FALLBACK_WEST, alt: 'Restored mountain inn.' },
    meta: {
      lodging: {
        beds: 'Rooms vary · verify 2-bed configuration',
        priceTier: '$135-180',
        drive: [
          { to: 'Cascade Pass', minutes: 50, miles: 23 },
          { to: 'Newhalem', minutes: 18, miles: 8 },
        ],
        bookUrl: 'https://northcascadesinn.com/',
      },
    },
  },
];

// ====================================================================
// Lodging — East side
// ====================================================================
const LODGING_EAST: MapLocation[] = [
  {
    id: 'lodging-methow-river',
    type: 'lodging-east',
    name: 'Methow River Lodge & Cabins',
    context: 'Winthrop · cabins on the Methow',
    lat: 48.4767,
    lng: -120.1846,
    pathAssoc: 'east',
    anchor: '#lodging',
    photo: { src: LODGING_PHOTO_FALLBACK_EAST, alt: 'Riverside cabins.' },
    meta: {
      lodging: {
        beds: '2 queens typical · verify per cabin',
        priceTier: '$200-250',
        kitchen: 'Kitchenette',
        drive: [
          { to: 'Maple Pass', minutes: 50, miles: 30 },
          { to: 'WA Pass', minutes: 40, miles: 26 },
        ],
        bookUrl: 'https://methowriverlodge.com/',
      },
    },
  },
  {
    id: 'lodging-rivers-edge',
    type: 'lodging-east',
    name: "River's Edge Resort",
    context: 'Winthrop · riverside chalets',
    lat: 48.4762,
    lng: -120.1862,
    pathAssoc: 'east',
    anchor: '#lodging',
    photo: { src: LODGING_PHOTO_FALLBACK_EAST, alt: 'Riverside chalets.' },
    meta: {
      lodging: {
        beds: 'Chalets vary · verify 2-bed at booking',
        priceTier: '$210-310',
        kitchen: 'Kitchenette',
        drive: [
          { to: 'Maple Pass', minutes: 50, miles: 30 },
          { to: 'WA Pass', minutes: 40, miles: 26 },
        ],
        bookUrl: 'https://riversedgeresort.com/',
      },
    },
  },
  {
    id: 'lodging-freestone',
    type: 'lodging-east',
    name: 'Freestone Inn',
    context: 'Mazama · lake-front cabins',
    lat: 48.5915,
    lng: -120.4019,
    pathAssoc: 'east',
    anchor: '#lodging',
    photo: { src: LODGING_PHOTO_FALLBACK_EAST, alt: 'Lake-front cabin at dusk.' },
    meta: {
      lodging: {
        beds: '2BR cabins available · verify per cabin',
        priceTier: '$300+',
        kitchen: 'Kitchenette',
        drive: [
          { to: 'Maple Pass', minutes: 25, miles: 14 },
          { to: 'WA Pass', minutes: 18, miles: 11 },
        ],
        bookUrl: 'https://www.freestoneinn.com/',
      },
    },
  },
  {
    id: 'lodging-chewuch',
    type: 'lodging-east',
    name: 'Chewuch Inn & Cabins',
    context: 'Winthrop · B&B + cabins',
    lat: 48.4798,
    lng: -120.1839,
    pathAssoc: 'east',
    anchor: '#lodging',
    photo: { src: LODGING_PHOTO_FALLBACK_EAST, alt: 'B&B-style mountain inn.' },
    meta: {
      lodging: {
        beds: 'Cabins: 2 beds typical · B&B rooms vary',
        priceTier: '$160-260',
        drive: [
          { to: 'Maple Pass', minutes: 50, miles: 30 },
          { to: 'WA Pass', minutes: 40, miles: 26 },
        ],
        bookUrl: 'https://chewuchinn.com/',
      },
    },
  },
  {
    id: 'lodging-inn-at-mazama',
    type: 'lodging-east',
    name: 'The Inn at Mazama',
    context: 'Mazama · lodge + cabins',
    lat: 48.5926,
    lng: -120.4071,
    pathAssoc: 'east',
    anchor: '#lodging',
    photo: { src: LODGING_PHOTO_FALLBACK_EAST, alt: 'Lodge with mountain backdrop.' },
    meta: {
      lodging: {
        beds: 'Cabins: 2 queens typical · rooms vary',
        priceTier: '$200-375',
        kitchen: 'Kitchenette',
        drive: [
          { to: 'Maple Pass', minutes: 25, miles: 14 },
          { to: 'WA Pass', minutes: 18, miles: 11 },
        ],
        bookUrl: 'https://www.innmazama.com/',
      },
    },
  },
  {
    id: 'lodging-spring-creek-ranch',
    type: 'lodging-east',
    name: 'Spring Creek Ranch',
    context: 'Winthrop · 3 cabins on 60 acres',
    lat: 48.487,
    lng: -120.207,
    pathAssoc: 'east',
    anchor: '#lodging',
    photo: { src: LODGING_PHOTO_FALLBACK_EAST, alt: 'Ranch cabins on open acreage.' },
    meta: {
      lodging: {
        beds: '2BR cabin configs · verify per cabin',
        priceTier: '$220-340',
        kitchen: 'Full kitchen',
        drive: [
          { to: 'Maple Pass', minutes: 50, miles: 30 },
          { to: 'Sun Mtn', minutes: 12, miles: 6 },
        ],
        bookUrl: 'https://springcreekwinthrop.com/',
      },
    },
  },
  {
    id: 'lodging-sun-mountain',
    type: 'lodging-east',
    name: 'Sun Mountain Lodge',
    context: 'Winthrop · ridge resort + Patterson Lake cabins',
    lat: 48.4263,
    lng: -120.2378,
    pathAssoc: 'east',
    anchor: '#lodging',
    photo: { src: LODGING_PHOTO_FALLBACK_EAST, alt: 'Mountain resort lodge with sweeping views.' },
    meta: {
      lodging: {
        beds: 'Cabins: 2BR available · rooms vary',
        priceTier: '$400+',
        kitchen: 'Cabins: full · rooms: none',
        drive: [
          { to: 'Maple Pass', minutes: 55, miles: 35 },
          { to: 'WA Pass', minutes: 50, miles: 32 },
        ],
        bookUrl: 'https://sunmountainlodge.com/',
      },
    },
  },
  {
    id: 'lodging-rolling-huts',
    type: 'lodging-east',
    name: 'Rolling Huts',
    context: 'Winthrop · modern glamping',
    lat: 48.5089,
    lng: -120.2098,
    pathAssoc: 'east',
    anchor: '#lodging',
    photo: { src: LODGING_PHOTO_FALLBACK_EAST, alt: 'Modern glamping huts on a meadow.' },
    meta: {
      lodging: {
        beds: '1 queen + sofa-sleeper · NOT 2 separate beds — verify fit',
        priceTier: '$145-200',
        kitchen: 'Kitchenette',
        drive: [
          { to: 'Maple Pass', minutes: 45, miles: 28 },
          { to: 'Sun Mtn', minutes: 12, miles: 6 },
        ],
        bookUrl: 'https://rollinghuts.com/',
      },
    },
  },
  {
    id: 'lodging-rio-vista',
    type: 'lodging-east',
    name: 'Hotel Rio Vista',
    context: 'Winthrop · boutique riverside',
    lat: 48.4768,
    lng: -120.1852,
    pathAssoc: 'east',
    anchor: '#lodging',
    photo: { src: LODGING_PHOTO_FALLBACK_EAST, alt: 'Boutique riverside hotel.' },
    meta: {
      lodging: {
        beds: 'Rooms: 1 king or 2 queens · verify',
        priceTier: '$170-260',
        drive: [
          { to: 'Maple Pass', minutes: 50, miles: 30 },
          { to: 'WA Pass', minutes: 40, miles: 26 },
        ],
        bookUrl: 'https://www.hotelriovista.com/',
      },
    },
  },
  {
    id: 'lodging-mt-gardner',
    type: 'lodging-east',
    name: 'Mt. Gardner Inn',
    context: 'Winthrop · mid-tier inn',
    lat: 48.4716,
    lng: -120.1864,
    pathAssoc: 'east',
    anchor: '#lodging',
    photo: { src: LODGING_PHOTO_FALLBACK_EAST, alt: 'Mid-tier inn at the edge of town.' },
    meta: {
      lodging: {
        beds: 'Rooms: 2 queens typical · verify',
        priceTier: '$149-353',
        drive: [
          { to: 'Maple Pass', minutes: 50, miles: 30 },
          { to: 'WA Pass', minutes: 40, miles: 26 },
        ],
        bookUrl: 'https://www.mtgardnerinn.com/',
      },
    },
  },
];

// ====================================================================
// Cool sleeping places (subset — only ones with sensible coords)
// ====================================================================
const COOL_SLEEPING: MapLocation[] = [
  {
    id: 'cool-ross-lake-resort',
    type: 'cool-sleeping',
    name: 'Ross Lake Resort (floating cabins)',
    context: 'Boat-in only · floating cabins on Ross Lake · LOTTERY',
    lat: 48.7273,
    lng: -121.0682,
    pathAssoc: 'both',
    anchor: '#cool-sleeping',
    externalAnchor: 'for-erin.html#cool-sleeping',
    photo: {
      // Canonical Ross Lake summer photo from data/lakes.ts ross-lake entry.
      src: 'https://commons.wikimedia.org/wiki/Special:FilePath/North_Cascades_-_Ross_Lake_-_2017_8_29.jpg?width=420',
      alt: 'Ross Lake in late August — bright summer blue between forested Cascade ridges.',
    },
    meta: {
      coolSleeping: {
        access: 'Boat-in only',
        beds: '2BR cabins available',
        priceTier: '~$290-495/night',
        bookUrl: 'https://www.rosslakeresort.com/stay',
        bookingNote: 'Lottery + waitlist. Call (206) 386-4437 for cancellation list.',
      },
    },
  },
  {
    id: 'cool-stehekin-lodge',
    type: 'cool-sleeping',
    name: 'NC Lodge at Stehekin',
    context: 'Ferry-in only · 50-mi alpine fjord village',
    lat: 48.3197,
    lng: -120.6708,
    pathAssoc: 'both',
    anchor: '#cool-sleeping',
    externalAnchor: 'for-erin.html#cool-sleeping',
    photo: {
      // Canonical Stehekin/Lake Chelan photo from data/lakes.ts lake-chelan entry.
      src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Stehekin_Chelan.JPG?width=420',
      alt: 'Stehekin landing at the head of Lake Chelan in summer.',
    },
    meta: {
      coolSleeping: {
        access: 'Shuttle or boat-in',
        beds: '1-BR + 2-BR cabins',
        priceTier: '$200-340/night',
        bookUrl: 'https://lodgeatstehekin.com/accommodations/',
        bookingNote: 'Online booking. Lake Chelan ferry each direction (~4 hr).',
      },
    },
  },
  {
    id: 'cool-nc-elc',
    type: 'cool-sleeping',
    name: 'NC Environmental Learning Center',
    context: 'Only lodging INSIDE the park · Diablo Lake shore',
    lat: 48.7113,
    lng: -121.114,
    pathAssoc: 'both',
    anchor: '#cool-sleeping',
    externalAnchor: 'for-erin.html#cool-sleeping',
    photo: {
      // Diablo Lake shore — the ELC is on the Diablo shoreline. Distinct angle from view-diablo.
      src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Diablo_Lake_with_Pinnacle_Peak.jpg?width=420',
      alt: 'Diablo Lake with Pinnacle Peak rising above the basin — bright August blue.',
    },
    meta: {
      coolSleeping: {
        access: 'Drive-in',
        beds: '4 twin beds per room (book a room for 2)',
        priceTier: '~$165-225/person',
        bookUrl: 'https://ncascades.org/signup/programs/base-camp',
        bookingNote: 'Email info@ncascades.org for Aug 16-20 availability.',
      },
    },
  },
  {
    id: 'cool-pearrygin-cabins',
    type: 'cool-sleeping',
    name: 'Pearrygin Lake SP Cabins',
    context: 'State-park lakeside cabins · 2 cabins only',
    lat: 48.4944,
    lng: -120.1656,
    pathAssoc: 'east',
    anchor: '#cool-sleeping',
    externalAnchor: 'for-erin.html#cool-sleeping',
    photo: {
      // Canonical Pearrygin photo from data/lakes.ts pearrygin entry.
      src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Pearrygin_Lake_State_Park.jpg?width=420',
      alt: 'Pearrygin Lake State Park — calm green water and the Methow hills in summer.',
    },
    meta: {
      coolSleeping: {
        access: 'Drive-in',
        beds: '1 full + 1 twin trundle',
        priceTier: '$79-104/night',
        bookUrl: 'https://parks.wa.gov/find-parks/state-parks/pearrygin-lake-state-park/pearrygin-lake-cabins',
        bookingNote: 'Only 2 cabins · book FAR ahead via WA State Parks.',
      },
    },
  },
  {
    id: 'cool-treehouse-concrete',
    type: 'cool-sleeping',
    name: 'Twin Cedars Treehouse',
    context: 'Concrete · actual elevated treehouse · 2BR',
    lat: 48.5395,
    lng: -121.7635,
    pathAssoc: 'west',
    anchor: '#cool-sleeping',
    externalAnchor: 'for-erin.html#cool-sleeping',
    photo: {
      src: 'https://images.unsplash.com/photo-1488462237308-ecaa28b729d7?auto=format&fit=crop&w=420&q=70',
      alt: 'Elevated treehouse in a dense forest.',
    },
    meta: {
      coolSleeping: {
        access: 'Drive-in',
        beds: '3 beds · 2 BR',
        priceTier: '$220-310/night',
        bookUrl: 'https://www.airbnb.com/rooms/619805721232504402?check_in=2026-08-16&check_out=2026-08-20&adults=2',
        bookingNote: 'Search "treehouse Concrete WA" — pick a 2BR with stable Aug 16-20 availability.',
      },
    },
  },
  {
    id: 'cool-lost-river-resort',
    type: 'cool-sleeping',
    name: 'Lost River Resort',
    context: 'Mazama · oldest Methow resort · 6 private cabins',
    lat: 48.6463,
    lng: -120.4912,
    pathAssoc: 'east',
    anchor: '#cool-sleeping',
    externalAnchor: 'for-erin.html#cool-sleeping',
    photo: {
      src: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=420&q=70',
      alt: 'Rustic forest cabin with wood stove.',
    },
    meta: {
      coolSleeping: {
        access: 'Drive-in',
        beds: 'River House: 2 queens · 2 BR',
        priceTier: '$165-260/night',
        bookUrl: 'https://www.lostriverresort.com/',
        bookingNote: 'Call (509) 996-2537 to book a 2BR.',
      },
    },
  },
];

// ====================================================================
// Trailheads
// ====================================================================
const TRAILHEADS: MapLocation[] = [
  {
    id: 'trail-cascade-pass',
    type: 'trailhead',
    name: 'Cascade Pass Trailhead',
    context: 'End of Cascade River Rd · signature west-side hike.',
    lat: 48.4747,
    lng: -121.0758,
    pathAssoc: 'west',
    anchor: '#hikes',
    photo: {
      src: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=420&q=70',
      alt: 'High alpine pass with switchbacks below craggy peaks.',
    },
    meta: {
      trailhead: {
        mileage: '7.0 mi RT',
        elevation: '+1,800 ft',
        difficulty: 'Moderate — switchbacks, sustained climb',
        wtaUrl: 'https://www.wta.org/go-hiking/hikes/cascade-pass',
      },
    },
  },
  {
    id: 'trail-rainy-maple',
    type: 'trailhead',
    name: 'Rainy Pass — Maple Pass / Rainy Lake',
    context: 'MP 158 WA-20 · Maple loop OR paved Rainy Lake.',
    lat: 48.5167,
    lng: -120.7339,
    pathAssoc: 'both',
    anchor: '#hikes',
    photo: {
      // Canonical Maple Pass photo from data/hikes.ts maple-pass entry.
      src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Maple_Pass_at_North_Cascades_in_WA.jpg?width=420',
      alt: 'Maple Pass loop ridgeline above an alpine lake in the North Cascades.',
    },
    meta: {
      trailhead: {
        mileage: 'Maple loop: 7.2 mi · Rainy Lake: 1.8 mi paved',
        elevation: 'Maple: +2,020 ft · Rainy: minimal',
        difficulty: 'Moderate loop OR easy paved',
        wtaUrl: 'https://www.wta.org/go-hiking/hikes/maple-pass',
      },
    },
  },
  {
    id: 'trail-blue-lake',
    type: 'trailhead',
    name: 'Blue Lake Trailhead',
    context: 'MP 161 · Liberty Bell base · ~half-day.',
    lat: 48.5219,
    lng: -120.6794,
    pathAssoc: 'east',
    anchor: '#hikes',
    photo: {
      // Canonical Blue Lake photo from data/hikes.ts blue-lake entry (Liberty Bell-group Blue Lake, MP 161).
      src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Blue_Lake_in_Okanogan_National_Forest.jpg?width=420',
      alt: 'Blue Lake in the Okanogan National Forest under Liberty Bell — alpine summer.',
    },
    meta: {
      trailhead: {
        mileage: '4.4 mi RT',
        elevation: '+1,050 ft',
        difficulty: 'Moderate',
        // WTA slug for the correct Blue Lake (Washington Pass / Liberty Bell,
        // MP 161 WA-20) is unknown — `blue-lake-1` points to a DIFFERENT
        // (currently closed) trail in the Mt. Baker Twin Lakes area. Linking
        // to the WTA search until the verified slug is found.
        // [verified WTA URL pending — search to find current]
        wtaUrl:
          'https://www.wta.org/go-outside/hikes/?b_start:int=0&SearchableText=blue+lake+washington+pass',
      },
    },
  },
  {
    id: 'trail-thunder-knob',
    type: 'trailhead',
    name: 'Thunder Knob — Colonial Creek',
    context: 'MP 130 · easy lake overlook walk.',
    lat: 48.6886,
    lng: -121.0992,
    pathAssoc: 'both',
    anchor: '#hikes',
    photo: {
      // Pyramid + Pinnacle Peaks rise above Diablo Lake — visible from Thunder Knob.
      src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Pyramid_and_Pinnacle_Peaks,_North_Cascades.jpg?width=420',
      alt: 'Pyramid and Pinnacle Peaks rising above the WA-20 corridor — visible from Thunder Knob.',
    },
    meta: {
      trailhead: {
        mileage: '3.6 mi RT',
        elevation: '+635 ft',
        difficulty: 'Easy-moderate',
        wtaUrl: 'https://www.wta.org/go-hiking/hikes/thunder-knob',
      },
    },
  },
  {
    id: 'trail-ladder-creek',
    type: 'trailhead',
    name: 'Ladder Creek Falls',
    context: 'MP 120 · Newhalem · short paved loop · lit at dusk.',
    lat: 48.6738,
    lng: -121.2434,
    pathAssoc: 'both',
    anchor: '#hikes',
    photo: {
      src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Ladder_Creek_Falls_at_Newhalem,_WA.jpg?width=420',
      alt: 'Waterfall cascading through mossy granite walls.',
    },
    meta: {
      trailhead: {
        mileage: '<0.5 mi loop',
        elevation: 'Minimal',
        difficulty: 'Very easy · paved · lit',
        wtaUrl: 'https://www.wta.org/go-hiking/hikes/ladder-creek-falls',
      },
    },
  },
];

// ====================================================================
// Viewpoints (purple star)
// ====================================================================
const VIEWPOINTS: MapLocation[] = [
  {
    id: 'view-diablo',
    type: 'viewpoint',
    name: 'Diablo Lake Overlook',
    context: 'MP 132 · turquoise glacier-flour lake · signature view.',
    lat: 48.7117,
    lng: -121.0911,
    pathAssoc: 'both',
    anchor: '#viewpoints',
    photo: {
      // Canonical Diablo Lake Overlook photo from data/viewpoints.ts diablo-lake-overlook entry.
      src: 'https://upload.wikimedia.org/wikipedia/commons/3/3f/Diablo_Lake_from_Overlook_03.jpg',
      alt: 'Turquoise Diablo Lake from the WA-20 overlook, surrounded by forested peaks.',
    },
    meta: {
      viewpoint: {
        mileMarker: 'MP 132 · WA-20',
        bestTime: 'Late morning · midday · sunset (S+W exposure)',
      },
    },
  },
  {
    id: 'view-washington-pass',
    type: 'viewpoint',
    name: 'Washington Pass Overlook',
    context: 'MP 162 · Liberty Bell + Early Winters Spires.',
    lat: 48.523,
    lng: -120.6531,
    pathAssoc: 'east',
    anchor: '#viewpoints',
    photo: {
      // Canonical Washington Pass Overlook photo from data/top-sunsets.ts washington-pass entry.
      src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Washington_pass_overlook.jpg?width=420',
      alt: 'Washington Pass Overlook on WA-20 with Liberty Bell Mountain behind.',
    },
    meta: {
      viewpoint: {
        mileMarker: 'MP 162 · WA-20',
        bestTime: 'Sunset alpenglow on the spires · then astro-dark for stars',
      },
    },
  },
  {
    id: 'view-ross-lake',
    type: 'viewpoint',
    name: 'Ross Lake Overlook',
    context: 'MP 135 · quick pull-off · 5 min.',
    lat: 48.7261,
    lng: -121.0608,
    pathAssoc: 'both',
    anchor: '#viewpoints',
    photo: {
      // Place-specific Ross Lake morning photo (Wikimedia Commons).
      src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Ross_Lake_morning.jpg?width=420',
      alt: 'Ross Lake in morning light — long glacial lake between forested Cascade ridges.',
    },
    meta: {
      viewpoint: {
        mileMarker: 'MP 135 · WA-20',
        bestTime: 'Anytime · 5-min pull-off',
      },
    },
  },
  {
    id: 'view-gorge-creek',
    type: 'viewpoint',
    name: 'Gorge Creek Falls',
    context: 'MP 123 · footbridge over the gorge.',
    lat: 48.6928,
    lng: -121.2089,
    pathAssoc: 'both',
    anchor: '#viewpoints',
    photo: {
      src: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=420&q=70',
      alt: 'Waterfall plunging into a deep forested gorge.',
    },
    meta: {
      viewpoint: {
        mileMarker: 'MP 123 · WA-20',
        bestTime: 'Morning · soft light through the gorge',
      },
    },
  },
];

// ====================================================================
// Sunset spots (gold sun icon)
// ====================================================================
const SUNSET_SPOTS: MapLocation[] = [
  {
    id: 'sunset-wa-pass',
    type: 'sunset',
    name: 'Washington Pass Overlook — sunset',
    context: '#1 ranked · 5,477 ft · alpenglow on Liberty Bell.',
    lat: 48.523,
    lng: -120.6531,
    pathAssoc: 'east',
    anchor: '#top-sunsets',
    externalAnchor: 'top-sunsets.html#washington-pass',
    photo: {
      src: 'https://images.unsplash.com/photo-1490604001847-b712b0c2f967?auto=format&fit=crop&w=420&q=70',
      alt: 'Mountain spires lit by golden-hour sunset.',
    },
    meta: {
      sunset: {
        rank: 1,
        viewDirection: 'West-southwest',
        bestByPath: 'B + C',
      },
    },
  },
  {
    id: 'sunset-sun-mountain',
    type: 'sunset',
    name: 'Sun Mountain Lodge — patio',
    context: '#2 ranked · 360° ridgetop view at 3,000 ft.',
    lat: 48.467,
    lng: -120.247,
    pathAssoc: 'east',
    anchor: '#top-sunsets',
    externalAnchor: 'top-sunsets.html#sun-mountain',
    photo: {
      // Patterson Lake from below Sun Mountain Lodge — canonical from data/viewpoints.ts sun-mountain-viewpoint.
      src: 'https://commons.wikimedia.org/wiki/Special:FilePath/PattersonLake_Winthrop.jpg?width=420',
      alt: 'Patterson Lake from below Sun Mountain Lodge — Cascades reflected in calm summer water.',
    },
    meta: {
      sunset: {
        rank: 2,
        viewDirection: '360° · west to Cascades, south down Methow',
        fromLodgingNote: 'Porch sunset if booked · otherwise 5-min drive up the ridge',
        bestByPath: 'B + C',
      },
    },
  },
  {
    id: 'sunset-ovenells',
    type: 'sunset',
    name: "Ovenell's ranch acreage",
    context: '#3 ranked · 580 acres open to Mt. Baker.',
    lat: 48.5354,
    lng: -121.7836,
    pathAssoc: 'west',
    anchor: '#top-sunsets',
    externalAnchor: 'top-sunsets.html#ovenells',
    photo: {
      src: 'https://images.unsplash.com/photo-1500964757637-c85e8a162699?auto=format&fit=crop&w=420&q=70',
      alt: 'Open ranch pasture at sunset under distant mountain.',
    },
    meta: {
      sunset: {
        rank: 3,
        viewDirection: 'West-southwest toward Mt. Baker',
        fromLodgingNote: 'Porch sunset from the log cabins · zero driving',
        bestByPath: 'A + B',
      },
    },
  },
  {
    id: 'sunset-diablo',
    type: 'sunset',
    name: 'Diablo Lake Overlook — sunset',
    context: '#4 ranked · turquoise water + bouncing light.',
    lat: 48.7117,
    lng: -121.0911,
    pathAssoc: 'both',
    anchor: '#top-sunsets',
    externalAnchor: 'top-sunsets.html#diablo',
    photo: {
      // Alternate Diablo Lake angle from data/lakes.ts diablo-lake entry (distinct from view-diablo).
      src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Diablo_Lake_(Washington_State).jpg?width=420',
      alt: 'Diablo Lake turquoise water ringed by Cascade walls — late-day light.',
    },
    meta: {
      sunset: {
        rank: 4,
        viewDirection: 'South + west over the lake',
        bestByPath: 'A + B (verify WA-20 reopens through the closure)',
      },
    },
  },
  {
    id: 'sunset-patterson',
    type: 'sunset',
    name: 'Patterson Lake — west shore',
    context: '#5 ranked · quieter alt to Pearrygin.',
    lat: 48.461,
    lng: -120.247,
    pathAssoc: 'east',
    anchor: '#top-sunsets',
    externalAnchor: 'top-sunsets.html#patterson',
    photo: {
      src: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=420&q=70',
      alt: 'Calm lake at sunset with reflected ridge.',
    },
    meta: {
      sunset: {
        rank: 5,
        viewDirection: 'West toward Cascade foothills',
        bestByPath: 'B + C',
      },
    },
  },
  {
    id: 'sunset-pearrygin',
    type: 'sunset',
    name: 'Pearrygin Lake — boat launch',
    context: '#6 ranked · open western sky over the water.',
    lat: 48.494,
    lng: -120.156,
    pathAssoc: 'east',
    anchor: '#top-sunsets',
    externalAnchor: 'top-sunsets.html#pearrygin',
    photo: {
      // Place-specific Pearrygin Lake photo (Wikimedia Commons — alt angle from cool-pearrygin-cabins).
      src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Pearrygin_Lake,_Washington_(9864223215).jpg?width=420',
      alt: 'Pearrygin Lake from the shoreline — open western sky over the water.',
    },
    meta: {
      sunset: {
        rank: 6,
        viewDirection: 'West over the water',
        bestByPath: 'B + C',
      },
    },
  },
  {
    id: 'sunset-freestone',
    type: 'sunset',
    name: 'Freestone Inn — lake-front porch',
    context: '#7 ranked · porch sunset reflections.',
    lat: 48.591,
    lng: -120.404,
    pathAssoc: 'east',
    anchor: '#top-sunsets',
    externalAnchor: 'top-sunsets.html#freestone',
    photo: {
      src: 'https://images.unsplash.com/photo-1487014679447-9f8336841d58?auto=format&fit=crop&w=420&q=70',
      alt: 'Alpine lake-front cabin at sunset.',
    },
    meta: {
      sunset: {
        rank: 7,
        viewDirection: 'West over a small alpine lake',
        fromLodgingNote: 'Porch sunset from lake-front cabins',
        bestByPath: 'B + C',
      },
    },
  },
];

// ====================================================================
// Water activities (blue droplet)
// ====================================================================
const WATER: MapLocation[] = [
  {
    id: 'water-patterson-kayak',
    type: 'water',
    name: 'Patterson Lake kayak/SUP',
    context: 'Sun Mountain marina · walk-up rentals.',
    lat: 48.467,
    lng: -120.247,
    pathAssoc: 'east',
    anchor: '#activities',
    photo: {
      src: 'https://images.unsplash.com/photo-1487730116645-74489c95b41b?auto=format&fit=crop&w=420&q=70',
      alt: 'Kayaks on a calm sub-alpine lake.',
    },
    meta: {
      water: {
        cost: '~$30-50/hr kayak · SUP + rowboat',
        time: '60-90 min',
        operator: 'Sun Mountain Lodge Marina',
        operatorUrl: 'https://sunmountainlodge.com/adventure/water-activities/',
      },
    },
  },
  {
    id: 'water-diablo-launch',
    type: 'water',
    name: 'Diablo Lake kayak launch',
    context: 'Colonial Creek · self-haul · turquoise water.',
    lat: 48.6886,
    lng: -121.0992,
    pathAssoc: 'both',
    anchor: '#activities',
    photo: {
      // Pyramid Peak reflected in Diablo Lake — from the water's edge (canonical from data/hidden-gems.ts pyramid-lake).
      src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Pyramid_Peak_reflected_in_Diablo_Lake.jpg?width=420',
      alt: 'Pyramid Peak reflected in the turquoise water of Diablo Lake in summer.',
    },
    meta: {
      water: {
        cost: '~$100-150/day rental · launch free',
        time: 'Half to full day',
        operator: 'North Cascade Kayaks (Rockport)',
        operatorUrl: 'https://northcascadekayaks.com/',
      },
    },
  },
  {
    id: 'water-ross-taxi',
    type: 'water',
    name: 'Ross Lake water taxi + kayak',
    context: 'Ross Lake Resort · only on-water rentals.',
    lat: 48.7273,
    lng: -121.0682,
    pathAssoc: 'both',
    anchor: '#activities',
    photo: {
      // Canonical Ross Lake photo from data/lakes.ts ross-lake entry (USGS/NPS public-domain).
      src: 'https://commons.wikimedia.org/wiki/Special:FilePath/North_Cascades_Natnl_Pk_Washington_State_Ross_Lake_4311.jpg?width=420',
      alt: 'Ross Lake stretching north between forested Cascade ridges in summer.',
    },
    meta: {
      water: {
        cost: 'Taxi $4/person · kayak $60/day',
        time: 'Half to full day',
        operator: 'Ross Lake Resort',
        operatorUrl: 'https://www.rosslakeresort.com/equipment-rentals',
      },
    },
  },
  {
    id: 'water-pearrygin-swim',
    type: 'water',
    name: 'Pearrygin Lake swim',
    context: 'Warm-water swim · sandy beach + raft.',
    lat: 48.494,
    lng: -120.156,
    pathAssoc: 'east',
    anchor: '#activities',
    photo: {
      // Place-specific Pearrygin Lake shore photo (alt angle from cool-pearrygin-cabins + sunset-pearrygin).
      src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Pearrygin_Lake,_Washington_(9864253616).jpg?width=420',
      alt: 'Pearrygin Lake shoreline on a sunny summer day — sandy state-park swim area.',
    },
    meta: {
      water: {
        cost: 'Discover Pass $10/day',
        time: '1-2 hrs',
        operator: 'WA State Parks',
        operatorUrl: 'https://parks.wa.gov/find-parks/state-parks/pearrygin-lake-state-park',
      },
    },
  },
  {
    id: 'water-baker-lake',
    type: 'water',
    name: 'Baker Lake swim + launch',
    context: 'Horseshoe Cove · sandy swim beach.',
    lat: 48.682,
    lng: -121.66,
    pathAssoc: 'west',
    anchor: '#activities',
    photo: {
      src: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=420&q=70',
      alt: 'Sandy beach on a forested mountain reservoir.',
    },
    meta: {
      water: {
        cost: '$5 day-use · swim free',
        time: '1-3 hrs',
        operator: 'Mt. Baker-Snoqualmie NF',
        operatorUrl: 'https://www.fs.usda.gov/recarea/mbs/recarea/?recid=17856',
      },
    },
  },
];

// ====================================================================
// Seattle (optional smaller dot)
// ====================================================================
const SEATTLE: MapLocation[] = [
  {
    id: 'seattle-downtown',
    type: 'seattle',
    name: 'Seattle (downtown)',
    context: 'Airport-only by default — Pike Place stop possible.',
    lat: 47.6062,
    lng: -122.3321,
    pathAssoc: 'both',
    anchor: '#seattle',
    photo: {
      src: 'https://images.unsplash.com/photo-1503551723145-6c040742065b?auto=format&fit=crop&w=420&q=70',
      alt: 'Seattle skyline with Mt. Rainier in the distance.',
    },
  },
];

// ====================================================================
// All locations
// ====================================================================
export const MAP_LOCATIONS: MapLocation[] = [
  ...AIRPORTS,
  ...TOWNS,
  ...LODGING_WEST,
  ...LODGING_EAST,
  ...COOL_SLEEPING,
  ...TRAILHEADS,
  ...VIEWPOINTS,
  ...SUNSET_SPOTS,
  ...WATER,
  ...SEATTLE,
];

// ====================================================================
// WA-20 closure polyline (unchanged from Wave 2)
// ====================================================================
export const WA20_CLOSURE_POLYLINE: Array<[number, number]> = [
  [48.6886, -121.0992], // MP 130 — Colonial Creek
  [48.6997, -121.0961],
  [48.7117, -121.0911], // MP 132 — Diablo Lake Overlook
  [48.7163, -121.0795],
  [48.7242, -121.0671],
  [48.7261, -121.0608], // MP 135 — Ross Lake Overlook
  [48.7172, -121.0379],
  [48.694, -121.0061],
  [48.6754, -120.9696],
  [48.659, -120.926],
  [48.6293, -120.8809],
  [48.5957, -120.8312],
  [48.5618, -120.7855],
  [48.5341, -120.7548],
  [48.5167, -120.7339], // MP 158 — Rainy Pass approach
];

export const CLOSURE_LABEL = {
  title: 'WA-20 closed — MP 130 → MP 156',
  detail:
    'WSDOT target reopen: Jul 4, 2026. "A goal, not a promise." Re-check WSDOT before counting on the through-route.',
  wsdotUrl: 'https://wsdot.com/travel/real-time/mountainpasses/northcascades',
  asOfDate: 'May 17, 2026',
  planBNote: 'Plan-B routing: bookend via I-90 + US-2 (Stevens Pass) instead of through-route.',
};

// ====================================================================
// Drive-route polylines per path — road-aligned, NOT crow-flies.
// ====================================================================
//
// Source: hand-curated waypoints traced from OSM/Google Maps along the actual
// road centerlines. WA-20 east of Marblemount, Cascade River Rd, and the
// I-5/I-90/US-97 connectors. The shapes are intentionally moderate-resolution
// (8-30 points per segment) — enough to read as "follows the road," not enough
// to ship megabytes. Re-trace if a road realigns.

export type RouteSegmentKind =
  | 'drive-day'
  | 'lodging-anchor'
  | 'hike-out-and-back'
  | 'sightseeing';

export interface RouteSegment {
  points: Array<[number, number]>;
  note: string;
  day: number;
  kind: RouteSegmentKind;
}

export interface NightStop {
  lodgingIdCandidates: string[];
  fallbackCoord: [number, number];
  label: string;
  townLabel: string;
}

export interface TripRoute {
  color: string;
  nights: NightStop[];
  segments: RouteSegment[];
}

// ---------------- Shared road geometries -----------------------------
const ROAD_SEA_TO_MARBLEMOUNT: Array<[number, number]> = [
  [47.4502, -122.3088], // SEA
  [47.6062, -122.3321], // Seattle (I-5 jog)
  [47.8202, -122.2683], // Lynnwood I-5
  [48.082, -122.2186], // Marysville I-5
  [48.2098, -122.1855], // Stanwood exit area
  [48.4204, -122.3346], // Mt. Vernon exit
  [48.4521, -122.2856], // Burlington (start WA-20 east)
  [48.4894, -122.0668], // Sedro-Woolley
  [48.5246, -121.9415], // Hamilton
  [48.5267, -121.78], // Concrete
  [48.4882, -121.5803], // Rockport / Glacier Peak Resort
  [48.5099, -121.3892], // Cascade River House / WA-20 jog
  [48.5316, -121.4448], // Marblemount
];

const ROAD_MARBLEMOUNT_TO_CASCADE_PASS: Array<[number, number]> = [
  [48.5316, -121.4448],
  [48.5099, -121.3892],
  [48.4814, -121.345],
  [48.4691, -121.2806],
  [48.4592, -121.2231],
  [48.461, -121.1572],
  [48.4727, -121.115],
  [48.4747, -121.0758], // Cascade Pass TH
];

const ROAD_MARBLEMOUNT_TO_DIABLO: Array<[number, number]> = [
  [48.5316, -121.4448],
  [48.5658, -121.3777],
  [48.6113, -121.3162],
  [48.6493, -121.2723],
  [48.6731, -121.2459], // Newhalem
  [48.6928, -121.2089], // Gorge Creek
  [48.6886, -121.0992], // Colonial Creek
  [48.7117, -121.0911], // Diablo Lake Overlook
];

const ROAD_DIABLO_TO_ROSS: Array<[number, number]> = [
  [48.7117, -121.0911],
  [48.7163, -121.0795],
  [48.7242, -121.0671],
  [48.7261, -121.0608],
];

const ROAD_ROSS_TO_RAINY: Array<[number, number]> = [
  [48.7261, -121.0608],
  [48.7172, -121.0379],
  [48.694, -121.0061],
  [48.6754, -120.9696],
  [48.659, -120.926],
  [48.6293, -120.8809],
  [48.5957, -120.8312],
  [48.5618, -120.7855],
  [48.5341, -120.7548],
  [48.5167, -120.7339], // Rainy Pass
];

const ROAD_RAINY_TO_WINTHROP: Array<[number, number]> = [
  [48.5167, -120.7339], // Rainy Pass
  [48.5219, -120.6794], // Blue Lake TH
  [48.523, -120.6531], // Washington Pass Overlook
  [48.566, -120.5732],
  [48.5919, -120.4053], // Mazama
  [48.5485, -120.302],
  [48.5113, -120.2386],
  [48.476, -120.1859], // Winthrop
];

const ROAD_RAINY_TO_WINTHROP_DIRECT: Array<[number, number]> = [
  [48.5167, -120.7339],
  [48.523, -120.6531],
  [48.566, -120.5732],
  [48.5919, -120.4053],
  [48.5485, -120.302],
  [48.476, -120.1859],
];

const ROAD_WINTHROP_TO_SEA_I90: Array<[number, number]> = [
  [48.476, -120.1859], // Winthrop
  [48.3119, -120.1183], // Twisp
  [48.0497, -119.8729], // Pateros
  [47.8302, -119.9819], // Brewster area
  [47.5953, -120.6604], // Wenatchee
  [47.3927, -120.5634], // Cle Elum approach
  [47.1953, -120.9404], // Cle Elum (I-90)
  [47.4426, -121.4136], // Snoqualmie Pass
  [47.5301, -121.8266], // North Bend
  [47.5763, -122.1786], // Bellevue
  [47.4502, -122.3088], // SEA
];

function reverseRoad(road: Array<[number, number]>): Array<[number, number]> {
  return road.slice().reverse();
}

// ---------------- Per-path route configs -----------------------------
export const TRIP_ROUTES: Record<'A' | 'B' | 'C', TripRoute> = {
  A: {
    color: '#16a34a',
    nights: [
      {
        lodgingIdCandidates: [
          'lodging-cascade-river-house',
          'lodging-rhody-house',
          'lodging-nc-hideaway',
          'lodging-nc-riverside',
          'lodging-ovenells',
          'lodging-glacier-peak',
        ],
        fallbackCoord: [48.5316, -121.4448],
        label: 'Nights 1-4',
        townLabel: 'Marblemount (west base)',
      },
    ],
    segments: [
      { points: ROAD_SEA_TO_MARBLEMOUNT, note: 'Day 1 · SEA → Marblemount (~2 hrs)', day: 1, kind: 'drive-day' },
      { points: ROAD_MARBLEMOUNT_TO_CASCADE_PASS, note: 'Day 2 · Cascade Pass out-and-back', day: 2, kind: 'hike-out-and-back' },
      { points: ROAD_MARBLEMOUNT_TO_DIABLO, note: 'Day 3 · WA-20 viewpoints (Diablo)', day: 3, kind: 'sightseeing' },
      { points: ROAD_DIABLO_TO_ROSS, note: 'Day 3 · Ross Lake spur', day: 3, kind: 'sightseeing' },
      { points: reverseRoad(ROAD_SEA_TO_MARBLEMOUNT), note: 'Day 5 · Marblemount → SEA', day: 5, kind: 'drive-day' },
    ],
  },
  B: {
    color: '#7c3aed',
    nights: [
      {
        lodgingIdCandidates: ['lodging-cascade-river-house', 'lodging-rhody-house', 'lodging-glacier-peak'],
        fallbackCoord: [48.5316, -121.4448],
        label: 'Nights 1-2',
        townLabel: 'Marblemount (west base)',
      },
      {
        lodgingIdCandidates: [
          'lodging-methow-river',
          'lodging-rivers-edge',
          'lodging-freestone',
          'lodging-inn-at-mazama',
          'lodging-chewuch',
          'lodging-spring-creek-ranch',
        ],
        fallbackCoord: [48.476, -120.1859],
        label: 'Nights 3-4',
        townLabel: 'Winthrop/Mazama (east base)',
      },
    ],
    segments: [
      { points: ROAD_SEA_TO_MARBLEMOUNT, note: 'Day 1 · SEA → Marblemount', day: 1, kind: 'drive-day' },
      { points: ROAD_MARBLEMOUNT_TO_CASCADE_PASS, note: 'Day 2 · Cascade Pass out-and-back', day: 2, kind: 'hike-out-and-back' },
      { points: ROAD_MARBLEMOUNT_TO_DIABLO, note: 'Day 3 · Marblemount → Diablo (transit east)', day: 3, kind: 'drive-day' },
      { points: ROAD_DIABLO_TO_ROSS, note: 'Day 3 · Ross Lake spur', day: 3, kind: 'drive-day' },
      { points: ROAD_ROSS_TO_RAINY, note: 'Day 3 · WA-20 closure zone (verify reopen)', day: 3, kind: 'drive-day' },
      { points: ROAD_RAINY_TO_WINTHROP, note: 'Day 3 · Rainy Pass → Winthrop', day: 3, kind: 'drive-day' },
      { points: reverseRoad(ROAD_RAINY_TO_WINTHROP_DIRECT), note: 'Day 4 · Winthrop ↔ Maple Pass loop', day: 4, kind: 'hike-out-and-back' },
      { points: ROAD_WINTHROP_TO_SEA_I90, note: 'Day 5 · Winthrop → SEA via US-97 + I-90', day: 5, kind: 'drive-day' },
    ],
  },
  C: {
    color: '#f59e0b',
    nights: [
      {
        lodgingIdCandidates: ['lodging-glacier-peak', 'lodging-rhody-house', 'lodging-cascade-river-house'],
        fallbackCoord: [48.5316, -121.4448],
        label: 'Night 1',
        townLabel: 'Marblemount (overnight only)',
      },
      {
        lodgingIdCandidates: [
          'lodging-methow-river',
          'lodging-rivers-edge',
          'lodging-freestone',
          'lodging-inn-at-mazama',
          'lodging-chewuch',
          'lodging-spring-creek-ranch',
        ],
        fallbackCoord: [48.476, -120.1859],
        label: 'Nights 2-4',
        townLabel: 'Winthrop/Mazama (east base · 3 nights)',
      },
    ],
    segments: [
      { points: ROAD_SEA_TO_MARBLEMOUNT, note: 'Day 1 · SEA → Marblemount', day: 1, kind: 'drive-day' },
      { points: ROAD_MARBLEMOUNT_TO_DIABLO, note: 'Day 2 · Marblemount → Diablo (transit east)', day: 2, kind: 'drive-day' },
      { points: ROAD_DIABLO_TO_ROSS, note: 'Day 2 · Ross Lake spur', day: 2, kind: 'drive-day' },
      { points: ROAD_ROSS_TO_RAINY, note: 'Day 2 · WA-20 closure zone (verify reopen)', day: 2, kind: 'drive-day' },
      { points: ROAD_RAINY_TO_WINTHROP, note: 'Day 2 · Rainy Pass → Winthrop', day: 2, kind: 'drive-day' },
      { points: reverseRoad(ROAD_RAINY_TO_WINTHROP_DIRECT), note: 'Day 3 · Maple Pass day-trip', day: 3, kind: 'hike-out-and-back' },
      { points: ROAD_WINTHROP_TO_SEA_I90, note: 'Day 5 · Winthrop → SEA via US-97 + I-90', day: 5, kind: 'drive-day' },
    ],
  },
};

// ====================================================================
// Type label map for the legend / layer control
// ====================================================================
export const TYPE_LABELS: Record<LocationType, string> = {
  airport: 'Airport',
  'lodging-west': 'Lodging (west)',
  'lodging-east': 'Lodging (east)',
  'cool-sleeping': 'Cool sleeping place',
  trailhead: 'Trailhead',
  viewpoint: 'Viewpoint',
  sunset: 'Sunset spot',
  water: 'Water activity',
  town: 'Town',
  seattle: 'Seattle',
};
