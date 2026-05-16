/**
 * Map locations — every marker the Map section renders.
 *
 * Source of truth for lat/lng + type + path-association. Sections that already
 * carry their own data (lodging.ts, viewpoints.ts, hikes.ts) live in their own
 * files; this file is the geographic overlay layer.
 *
 * Coordinates are WGS84 decimal degrees. Mile-marker derived locations along
 * WA-20 were cross-referenced against WSDOT mileposts + OpenStreetMap.
 * Lodging coordinates come from each property's listed address geocoded to
 * approximate town-center where the exact pin wasn't published.
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
  | 'trailhead'
  | 'viewpoint'
  | 'town'
  | 'seattle';

export type PathAssoc = 'west' | 'east' | 'both';

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
}

// ====================================================================
// Airports
// ====================================================================
const AIRPORTS: MapLocation[] = [
  {
    id: 'airport-sea',
    type: 'airport',
    name: 'SEA — Seattle-Tacoma International',
    context: 'Default arrival/departure. Nonstop on Alaska from NYC.',
    lat: 47.4502,
    lng: -122.3088,
    pathAssoc: 'both',
    anchor: '#flights',
  },
  {
    id: 'airport-bli',
    type: 'airport',
    name: 'BLI — Bellingham International',
    context: 'Northern alternate — closer to the park but no nonstop from NYC.',
    lat: 48.7928,
    lng: -122.5375,
    pathAssoc: 'both',
    anchor: '#flights',
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
  },
  {
    id: 'town-concrete',
    type: 'town',
    name: 'Concrete',
    context: 'Small Skagit Valley town on WA-20, ~25 min west of Marblemount.',
    lat: 48.5392,
    lng: -121.7569,
    pathAssoc: 'west',
  },
  {
    id: 'town-marblemount',
    type: 'town',
    name: 'Marblemount',
    context: 'West-side base. Last gas + groceries before WA-20 enters the park.',
    lat: 48.5316,
    lng: -121.4448,
    pathAssoc: 'west',
  },
  {
    id: 'town-newhalem',
    type: 'town',
    name: 'Newhalem',
    context: 'Tiny National Park Service company town inside the park, MP 120.',
    lat: 48.6731,
    lng: -121.2459,
    pathAssoc: 'both',
  },
  {
    id: 'town-mazama',
    type: 'town',
    name: 'Mazama',
    context: 'East-side village, ~25 min from Rainy Pass.',
    lat: 48.5919,
    lng: -120.4053,
    pathAssoc: 'east',
  },
  {
    id: 'town-winthrop',
    type: 'town',
    name: 'Winthrop',
    context: 'Old-west boardwalk town. East-side base.',
    lat: 48.476,
    lng: -120.1859,
    pathAssoc: 'east',
  },
];

// ====================================================================
// Lodging — West side
// ====================================================================
const LODGING_WEST: MapLocation[] = [
  {
    id: 'lodging-rhody-house',
    type: 'lodging-west',
    name: 'The Rhody House',
    context: 'Marblemount · cabin rental · $190-260',
    lat: 48.5325,
    lng: -121.4439,
    pathAssoc: 'west',
    anchor: '#lodging',
  },
  {
    id: 'lodging-nc-hideaway',
    type: 'lodging-west',
    name: 'North Cascades Hideaway',
    context: 'Concrete · cabin rental · $200-280',
    lat: 48.5396,
    lng: -121.7575,
    pathAssoc: 'west',
    anchor: '#lodging',
  },
  {
    id: 'lodging-nc-riverside',
    type: 'lodging-west',
    name: 'NC Riverside Retreat',
    context: 'Concrete · Skagit River cabin · $250-350',
    lat: 48.5388,
    lng: -121.7521,
    pathAssoc: 'west',
    anchor: '#lodging',
  },
  {
    id: 'lodging-glacier-peak',
    type: 'lodging-west',
    name: 'Glacier Peak Resort & Winery',
    context: 'Rockport · cabins + winery · $150-220',
    lat: 48.4882,
    lng: -121.5803,
    pathAssoc: 'west',
    anchor: '#lodging',
  },
  {
    id: 'lodging-ovenells',
    type: 'lodging-west',
    name: "Ovenell's Heritage Inn",
    context: 'Concrete · log cabins on 580-acre ranch · $200-330',
    lat: 48.5354,
    lng: -121.7836,
    pathAssoc: 'west',
    anchor: '#lodging',
  },
  {
    id: 'lodging-cascade-river-house',
    type: 'lodging-west',
    name: 'Cascade River House',
    context: 'Marblemount (Cascade River Rd) · whole-house · $350-500',
    lat: 48.5099,
    lng: -121.3892,
    pathAssoc: 'west',
    anchor: '#lodging',
  },
  {
    id: 'lodging-buffalo-run',
    type: 'lodging-west',
    name: 'Buffalo Run Inn',
    context: 'Marblemount · historic inn · $130-180',
    lat: 48.5319,
    lng: -121.4421,
    pathAssoc: 'west',
    anchor: '#lodging',
  },
  {
    id: 'lodging-nc-inn',
    type: 'lodging-west',
    name: 'North Cascades Inn',
    context: 'Marblemount · restored lodge · $135-180',
    lat: 48.5322,
    lng: -121.4413,
    pathAssoc: 'west',
    anchor: '#lodging',
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
    context: 'Winthrop · cabins on the Methow · $200-250',
    lat: 48.4767,
    lng: -120.1846,
    pathAssoc: 'east',
    anchor: '#lodging',
  },
  {
    id: 'lodging-rivers-edge',
    type: 'lodging-east',
    name: "River's Edge Resort",
    context: 'Winthrop · riverside chalets · $210-310',
    lat: 48.4762,
    lng: -120.1862,
    pathAssoc: 'east',
    anchor: '#lodging',
  },
  {
    id: 'lodging-freestone',
    type: 'lodging-east',
    name: 'Freestone Inn',
    context: 'Mazama · cabins · ~25 min to Rainy Pass · $300+',
    lat: 48.5915,
    lng: -120.4019,
    pathAssoc: 'east',
    anchor: '#lodging',
  },
  {
    id: 'lodging-chewuch',
    type: 'lodging-east',
    name: 'Chewuch Inn & Cabins',
    context: 'Winthrop · B&B + cabins · $160-260',
    lat: 48.4798,
    lng: -120.1839,
    pathAssoc: 'east',
    anchor: '#lodging',
  },
  {
    id: 'lodging-inn-at-mazama',
    type: 'lodging-east',
    name: 'The Inn at Mazama',
    context: 'Mazama · lodge + cabins · $200-375',
    lat: 48.5926,
    lng: -120.4071,
    pathAssoc: 'east',
    anchor: '#lodging',
  },
  {
    id: 'lodging-spring-creek-ranch',
    type: 'lodging-east',
    name: 'Spring Creek Ranch',
    context: 'Winthrop · 3 cabins on 60 acres · $220-340',
    lat: 48.487,
    lng: -120.207,
    pathAssoc: 'east',
    anchor: '#lodging',
  },
  {
    id: 'lodging-sun-mountain',
    type: 'lodging-east',
    name: 'Sun Mountain Lodge',
    context: 'Winthrop · resort + Patterson Lake cabins · cabins $400+',
    lat: 48.4263,
    lng: -120.2378,
    pathAssoc: 'east',
    anchor: '#lodging',
  },
  {
    id: 'lodging-rolling-huts',
    type: 'lodging-east',
    name: 'Rolling Huts',
    context: 'Winthrop · modern glamping · $145-200',
    lat: 48.5089,
    lng: -120.2098,
    pathAssoc: 'east',
    anchor: '#lodging',
  },
  {
    id: 'lodging-rio-vista',
    type: 'lodging-east',
    name: 'Hotel Rio Vista',
    context: 'Winthrop · boutique riverside · $170-260',
    lat: 48.4768,
    lng: -120.1852,
    pathAssoc: 'east',
    anchor: '#lodging',
  },
  {
    id: 'lodging-mt-gardner',
    type: 'lodging-east',
    name: 'Mt. Gardner Inn',
    context: 'Winthrop · mid-tier inn · $149-353',
    lat: 48.4716,
    lng: -120.1864,
    pathAssoc: 'east',
    anchor: '#lodging',
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
    context: 'End of Cascade River Rd · west · 7.0 mi RT, +1,800 ft.',
    lat: 48.4747,
    lng: -121.0758,
    pathAssoc: 'west',
    anchor: '#hikes',
  },
  {
    id: 'trail-rainy-maple',
    type: 'trailhead',
    name: 'Rainy Pass — Maple Pass / Rainy Lake',
    context: 'MP 158 WA-20 · east · Maple Pass 7.2 mi loop or Rainy Lake 1.8 mi paved.',
    lat: 48.5167,
    lng: -120.7339,
    pathAssoc: 'both',
    anchor: '#hikes',
  },
  {
    id: 'trail-blue-lake',
    type: 'trailhead',
    name: 'Blue Lake Trailhead',
    context: 'MP 161 WA-20 · east · 4.4 mi RT, +1,050 ft.',
    lat: 48.5219,
    lng: -120.6794,
    pathAssoc: 'east',
    anchor: '#hikes',
  },
  {
    id: 'trail-thunder-knob',
    type: 'trailhead',
    name: 'Thunder Knob — Colonial Creek',
    context: 'MP 130 · west · 3.6 mi RT, +635 ft to Diablo Lake overlook.',
    lat: 48.6886,
    lng: -121.0992,
    pathAssoc: 'both',
    anchor: '#hikes',
  },
  {
    id: 'trail-ladder-creek',
    type: 'trailhead',
    name: 'Ladder Creek Falls',
    context: 'MP 120 · Newhalem · <0.5 mi paved loop, lit at dusk.',
    lat: 48.6738,
    lng: -121.2434,
    pathAssoc: 'both',
    anchor: '#hikes',
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
    context: 'MP 132 · turquoise glacier-flour lake · the signature view.',
    lat: 48.7117,
    lng: -121.0911,
    pathAssoc: 'both',
    anchor: '#viewpoints',
  },
  {
    id: 'view-washington-pass',
    type: 'viewpoint',
    name: 'Washington Pass Overlook',
    context: 'MP 162 · Liberty Bell + Early Winters Spires · 400-ft paved trail.',
    lat: 48.523,
    lng: -120.6531,
    pathAssoc: 'east',
    anchor: '#viewpoints',
  },
  {
    id: 'view-ross-lake',
    type: 'viewpoint',
    name: 'Ross Lake Overlook',
    context: 'MP 135 · quick pull-off, 5 min.',
    lat: 48.7261,
    lng: -121.0608,
    pathAssoc: 'both',
    anchor: '#viewpoints',
  },
  {
    id: 'view-gorge-creek',
    type: 'viewpoint',
    name: 'Gorge Creek Falls',
    context: 'MP 123 · pull-out + footbridge over the gorge.',
    lat: 48.6928,
    lng: -121.2089,
    pathAssoc: 'both',
    anchor: '#viewpoints',
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
    context: 'Airport-only by default — Pike Place stop possible on the way back.',
    lat: 47.6062,
    lng: -122.3321,
    pathAssoc: 'both',
    anchor: '#seattle',
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
  ...TRAILHEADS,
  ...VIEWPOINTS,
  ...SEATTLE,
];

// ====================================================================
// WA-20 closure polyline
// ====================================================================
/**
 * Approximate WA-20 routing through the closed segment, MP 130 (Colonial Creek)
 * to MP 156 (just east of the Ross Lake overlook turn) → continuing to Porcupine
 * Creek turnaround near MP 156. The polyline follows the highway's actual
 * geometry through Diablo, Ross Dam trailhead, the Skagit Gorge, and up over
 * to Rainy Pass approach.
 *
 * Coordinates are pulled from OSM-derived WA-20 trace; smoothed to ~15 points
 * for the closed segment so the red line reads at zoom 8.
 */
export const WA20_CLOSURE_POLYLINE: Array<[number, number]> = [
  [48.6886, -121.0992], // MP 130 — Colonial Creek
  [48.6997, -121.0961], // approach
  [48.7117, -121.0911], // MP 132 — Diablo Lake Overlook
  [48.7163, -121.0795], // east of overlook
  [48.7242, -121.0671], // bend
  [48.7261, -121.0608], // MP 135 — Ross Lake Overlook
  [48.7172, -121.0379],
  [48.694, -121.0061],
  [48.6754, -120.9696],
  [48.659, -120.926],
  [48.6293, -120.8809],
  [48.5957, -120.8312],
  [48.5618, -120.7855],
  [48.5341, -120.7548],
  [48.5167, -120.7339], // MP 158 — Rainy Pass (approximate Porcupine Creek turnaround MP 156)
];

export const CLOSURE_LABEL = {
  title: 'WA-20 closed (MP 130 → MP 156)',
  detail: 'WSDOT target reopen: Jul 4, 2026. "A goal, not a promise."',
};

// ====================================================================
// Type label map for the legend
// ====================================================================
export const TYPE_LABELS: Record<LocationType, string> = {
  airport: 'Airport',
  'lodging-west': 'Lodging (west)',
  'lodging-east': 'Lodging (east)',
  trailhead: 'Trailhead',
  viewpoint: 'Viewpoint',
  town: 'Town',
  seattle: 'Seattle',
};
