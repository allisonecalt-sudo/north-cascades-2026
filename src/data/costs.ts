/**
 * costs.ts — budget breakdown per path × category × tier.
 *
 * Wave 3 GENIUS UX pass (May 17, 2026):
 *  - Per-tier trim-moves (concrete USD savings)
 *  - Per-category locked/flexible flag (lodging/rental/flights = locked; food/activities/fuel = flexible)
 *  - Per-category source-href for deep links from the breakdown rows
 *  - perPersonShare() helper for Splitwise math
 *  - Public-facing tier labels: Lean / Standard / Splurge
 *
 * Three paths (A / B / C), each with low / mid / high tiers built from:
 *   - flights.ts (SEA RT NYC, peak Aug)
 *   - rental.ts (verified Costco quotes May 16, 2026)
 *   - lodging.ts (per-night ranges from the listed cabins)
 *   - groceries + treat-meal estimate for kosher self-cater
 *   - park pass + activity costs
 *   - 10% contingency on subtotal
 *
 * All numbers in USD, all-in. Two-person trip totals (both share the cabin +
 * rental + groceries; flights are per-person × 2).
 */

export type PathLetter = 'A' | 'B' | 'C';
export type Tier = 'low' | 'mid' | 'high';

export type CategoryKey =
  | 'flights'
  | 'rental'
  | 'lodging'
  | 'food'
  | 'activities'
  | 'fuel'
  | 'contingency';

export interface CostCategory {
  key: CategoryKey;
  label: string;
  note: string;
  amount: number;
  /** "locked" = mostly fixed once booked; "flexible" = compressible. */
  flex: 'locked' | 'flexible';
  sourceHref: string;
  sourceLabel: string;
}

export interface TrimMove {
  label: string;
  saves: number;
}

export interface CostTier {
  tier: Tier;
  summary: string;
  categories: CostCategory[];
  trims: TrimMove[];
}

export interface PathCost {
  pathId: PathLetter;
  pathName: string;
  tiers: CostTier[];
}

/** Public-facing tier names. */
export const TIER_LABEL: Record<Tier, string> = {
  low: 'Lean',
  mid: 'Standard',
  high: 'Splurge',
};

// ─────────────────────────────────────────────────────────────
// Shared per-person flight estimates (peak Aug NYC↔SEA, nonstop)
//   - Low: $380 (12-week book-ahead, midweek)
//   - Mid: $470 (typical Aug peak)
//   - High: $580 (last-minute or premium-economy seat)
// ─────────────────────────────────────────────────────────────
const FLIGHT_LOW_PP = 380;
const FLIGHT_MID_PP = 470;
const FLIGHT_HIGH_PP = 580;

// Rental — from rental.ts verified Costco quotes May 16, 2026.
const RENTAL_LOW = 674;
const RENTAL_MID = 750;
const RENTAL_HIGH = 815;

// Food — kosher self-cater + 1-2 treat-meals.
const FOOD_LOW = 250;
const FOOD_MID = 380;
const FOOD_HIGH = 520;

// Activities + parks
const ACTIVITIES_LOW = 80;
const ACTIVITIES_MID = 150;
const ACTIVITIES_HIGH = 340;

// Fuel — depends on path miles + vehicle mpg.
const fuel = (miles: number, mpg: number): number =>
  Math.round((miles / mpg) * 4.4);

const PATH_MILES: Record<PathLetter, number> = { A: 600, B: 900, C: 750 };

function buildTier(
  pathId: PathLetter,
  tier: Tier,
  lodgingTotal: number
): CostTier {
  const isLow = tier === 'low';
  const isMid = tier === 'mid';
  const isHigh = tier === 'high';
  const flightPp = isLow ? FLIGHT_LOW_PP : isMid ? FLIGHT_MID_PP : FLIGHT_HIGH_PP;
  const rental = isLow ? RENTAL_LOW : isMid ? RENTAL_MID : RENTAL_HIGH;
  const food = isLow ? FOOD_LOW : isMid ? FOOD_MID : FOOD_HIGH;
  const activities = isLow ? ACTIVITIES_LOW : isMid ? ACTIVITIES_MID : ACTIVITIES_HIGH;
  const mpg = isHigh ? 24 : isMid ? 32 : 32;
  const fuelCost = fuel(PATH_MILES[pathId], mpg);
  const subtotal = flightPp * 2 + rental + lodgingTotal + food + activities + fuelCost;
  const contingency = Math.round(subtotal * 0.1);
  const summary =
    tier === 'low'
      ? 'Cheapest reasonable — early-booked flights, compact sedan, lean cabin pick.'
      : tier === 'mid'
        ? 'Typical comfortable — mid-tier cabin, compact SUV or hybrid sedan, 1-2 treat-meals.'
        : 'Splurge — premium cabin (Cascade River House / Sun Mountain), Standard Elite SUV, spa/extras.';

  const lodgingAnchor =
    tier === 'low'
      ? 'Rhody House / lean cabin'
      : tier === 'mid'
        ? 'Riverside Retreat / Terra Nova-tier'
        : 'Cascade River House / Sun Mountain Lodge';

  const trims: TrimMove[] =
    tier === 'low'
      ? [
          { label: 'Book flights 14+ weeks out (vs 12)', saves: 80 },
          { label: 'Skip 1 packaged-prepared dinner, grocery cook instead', saves: 25 },
          { label: 'Single-tank rental return (vs full)', saves: 30 },
        ]
      : tier === 'mid'
        ? [
            { label: 'Compact sedan instead of SUV/hybrid', saves: 75 },
            { label: 'Skip the Patterson Lake kayak rental', saves: 50 },
            { label: 'Trade 1 restaurant lunch for cabin lunch', saves: 60 },
            { label: 'Earlier-book flights (12+ weeks out)', saves: 90 },
          ]
        : [
            { label: 'Skip Sun Mountain spa pass for 1 person', saves: 95 },
            { label: 'Trade Standard Elite SUV for Compact SUV', saves: 65 },
            { label: 'Skip the Sun Mountain ridge dinner / drink', saves: 80 },
            { label: 'Drop premium grocery haul to mid-tier', saves: 140 },
          ];

  return {
    tier,
    summary,
    trims,
    categories: [
      {
        key: 'flights',
        label: 'Flights',
        note: `2 × NYC↔SEA nonstop · ~$${flightPp}/person · independent of each other`,
        amount: flightPp * 2,
        flex: 'locked',
        sourceHref: 'travel.html',
        sourceLabel: 'See flight options on Travel →',
      },
      {
        key: 'rental',
        label: 'Rental car',
        note:
          tier === 'low'
            ? 'Compact sedan (Corolla/Versa) all-in, Costco verified May 16'
            : tier === 'mid'
              ? 'Compact SUV or hybrid sedan all-in (CDW+SLI bundled)'
              : 'Standard Elite SUV (Audi Q3 / Cadillac XT4) all-in',
        amount: rental,
        flex: 'locked',
        sourceHref: 'rental.html',
        sourceLabel: 'See rental quotes on Rental →',
      },
      {
        key: 'lodging',
        label: 'Lodging',
        note:
          (pathId === 'A'
            ? '4 nights, one west cabin · '
            : pathId === 'B'
              ? '2 west + 2 east, mid-trip move · '
              : '1 west + 3 east · ') + lodgingAnchor,
        amount: lodgingTotal,
        flex: 'locked',
        sourceHref: 'lodging.html',
        sourceLabel: 'See lodging options on Lodging →',
      },
      {
        key: 'food',
        label: 'Food + treats',
        note:
          tier === 'low'
            ? 'Kosher groceries + cabin cooking, minimal eat-out · ~$25/day/person'
            : tier === 'mid'
              ? 'Groceries + 2 packaged-prepared dinners + Cascadian Farm + winery stop · ~$40/day/person'
              : 'Premium grocery + winery + Sun Mountain drink + ice cream · ~$55/day/person',
        amount: food,
        flex: 'flexible',
        sourceHref: 'food.html',
        sourceLabel: 'See kosher strategy on Food →',
      },
      {
        key: 'activities',
        label: 'Activities + passes',
        note:
          tier === 'low'
            ? 'America the Beautiful pass + Discover Pass'
            : tier === 'mid'
              ? '+ Patterson kayak rental + Cascadian Farm stop'
              : '+ Sun Mountain spa pass per person + extras',
        amount: activities,
        flex: 'flexible',
        sourceHref: 'details.html',
        sourceLabel: 'See trip details on Details →',
      },
      {
        key: 'fuel',
        label: 'Fuel',
        note: `${PATH_MILES[pathId]} mi @ ~${mpg} mpg combined (PNW Aug ~$4.40/gal)`,
        amount: fuelCost,
        flex: 'flexible',
        sourceHref: 'driving-cascades.html',
        sourceLabel: 'See driving notes →',
      },
      {
        key: 'contingency',
        label: 'Contingency (10%)',
        note: 'Buffer for price drift, gear, parking, unplanned ice cream',
        amount: contingency,
        flex: 'flexible',
        sourceHref: 'notes.html',
        sourceLabel: 'See notes →',
      },
    ],
  };
}

// Path A — 4 nights one west cabin
const PATH_A: PathCost = {
  pathId: 'A',
  pathName: 'Path A · West-Side Anchor',
  tiers: [
    buildTier('A', 'low', 760),
    buildTier('A', 'mid', 1020),
    buildTier('A', 'high', 1700),
  ],
};

// Path B — 2 west + 2 east
const PATH_B: PathCost = {
  pathId: 'B',
  pathName: 'Path B · Both Sides, Balanced',
  tiers: [
    buildTier('B', 'low', 780),
    buildTier('B', 'mid', 1030),
    buildTier('B', 'high', 1650),
  ],
};

// Path C — 1 west + 3 east
const PATH_C: PathCost = {
  pathId: 'C',
  pathName: 'Path C · Slow Winthrop Base',
  tiers: [
    buildTier('C', 'low', 790),
    buildTier('C', 'mid', 1035),
    buildTier('C', 'high', 1625),
  ],
};

export const PATH_COSTS: PathCost[] = [PATH_A, PATH_B, PATH_C];

export function tierTotal(tier: CostTier): number {
  return tier.categories.reduce((sum, c) => sum + c.amount, 0);
}

export function pathRange(path: PathCost): { low: number; mid: number; high: number } {
  return {
    low: tierTotal(path.tiers[0] as CostTier),
    mid: tierTotal(path.tiers[1] as CostTier),
    high: tierTotal(path.tiers[2] as CostTier),
  };
}

export function findPath(id: PathLetter): PathCost {
  const p = PATH_COSTS.find((x) => x.pathId === id);
  if (!p) throw new Error(`Unknown path: ${id}`);
  return p;
}

export function findTier(path: PathCost, tier: Tier): CostTier {
  const t = path.tiers.find((x) => x.tier === tier);
  if (!t) throw new Error(`Unknown tier ${tier} on path ${path.pathId}`);
  return t;
}

/** Per-person split for a 2-traveler trip.
 * Flights = independent (each person pays their own seat).
 * Everything else (rental, lodging, food, activities, fuel, contingency) = 50/50.
 * Returns one traveler's total share.
 */
export function perPersonShare(tier: CostTier): number {
  let share = 0;
  for (const c of tier.categories) {
    // Flights amount = pp × 2, so /2 gives per-person.
    // Other categories are split 50/50, so /2 gives per-person.
    share += c.amount / 2;
  }
  return Math.round(share);
}

export const COSTS_NOTES = {
  includes:
    'Includes: round-trip flights for 2, 5-day rental all-in (CDW+SLI), 4 nights cabin, groceries + treats, passes, fuel, 10% contingency.',
  excludes:
    'Excludes: travel insurance, gear rentals (poles/bear-spray), gifts, shipping/luggage fees, last-minute weather pivots (e.g. extra night in Seattle).',
  asOf: 'May 16-17, 2026 quotes',
};
