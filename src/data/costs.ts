/**
 * costs.ts — budget breakdown per path × category × tier.
 *
 * Per Allison's May 16 ask: *"also give range of budget options"*.
 *
 * Three paths (A / B / C), each with low / mid / high tiers built from:
 *   - flights.ts (SEA RT NYC, peak Aug)
 *   - rental.ts (verified Costco quotes May 16, 2026)
 *   - lodging.ts (per-night ranges from the listed cabins)
 *   - groceries + treat-meal estimate for kosher self-cater
 *   - park pass + activity costs
 *   - 10% contingency on subtotal
 *
 * Path A = 4 west nights, no east-side driving (~600 mi).
 * Path B = 2 west + 2 east, mid-trip move (~900 mi).
 * Path C = 1 west + 3 east, less driving but longer drive home (~750 mi).
 *
 * All numbers in USD, all-in (rental quoted with CDW+SLI bundle). Two-person
 * trip totals (both share the cabin + rental + groceries; flights are per-person
 * × 2). Tier-low ≈ cheapest reasonable; tier-mid ≈ typical comfortable; tier-
 * high ≈ splurge cabin + Standard SUV.
 */

export type PathLetter = 'A' | 'B' | 'C';
export type Tier = 'low' | 'mid' | 'high';

export interface CostCategory {
  /** Display label. */
  label: string;
  /** One-line note on what's in this bucket. */
  note: string;
  /** USD amount for this tier × path. */
  amount: number;
}

export interface CostTier {
  tier: Tier;
  /** Short description: "Cheapest reasonable / Typical comfortable / Splurge". */
  summary: string;
  categories: CostCategory[];
}

export interface PathCost {
  pathId: PathLetter;
  pathName: string;
  tiers: CostTier[];
}

// ─────────────────────────────────────────────────────────────
// Shared per-person flight estimates (peak Aug NYC↔SEA, nonstop)
//   - Low: $380 (12-week book-ahead, midweek)
//   - Mid: $470 (typical Aug peak)
//   - High: $580 (last-minute or premium-economy seat)
// Per-trip = ×2 passengers.
// ─────────────────────────────────────────────────────────────
const FLIGHT_LOW_PP = 380;
const FLIGHT_MID_PP = 470;
const FLIGHT_HIGH_PP = 580;

// Rental — from rental.ts verified Costco quotes May 16, 2026.
//   Low all-in:  $674 (Compact sedan, Versa/Corolla)
//   Mid all-in:  $743-755 (Compact SUV gas OR Hybrid sedan) → use $750
//   High all-in: $815 (Standard Elite SUV — Audi Q3/Cadillac XT4)
const RENTAL_LOW = 674;
const RENTAL_MID = 750;
const RENTAL_HIGH = 815;

// Lodging — from lodging.ts per-night ranges (4 nights total).
//   Path A: 4 nights one west cabin
//     Low: 4 × $190 (Rhody House low) = $760
//     Mid: 4 × $255 (Riverside Retreat mid) = $1,020
//     High: 4 × $425 (Cascade River House splurge mid) = $1,700
//   Path B: 2 west + 2 east
//     Low:  2×$190 + 2×$200 = $780
//     Mid:  2×$255 + 2×$260 = $1,030
//     High: 2×$425 + 2×$400 = $1,650
//   Path C: 1 west + 3 east
//     Low:  1×$190 + 3×$200 = $790
//     Mid:  1×$255 + 3×$260 = $1,035
//     High: 1×$425 + 3×$400 = $1,625

// Food — kosher self-cater + 1-2 treat-meals.
//   Low (groceries-heavy): $250 for two over 5 days
//   Mid (groceries + 2 packaged-prepared dinners + winery stop): $380
//   High (premium grocery haul + winery + Sun Mountain drink + ice cream): $520
const FOOD_LOW = 250;
const FOOD_MID = 380;
const FOOD_HIGH = 520;

// Activities + parks
//   Low: park pass $30 + Discover Pass $10/day × 2 = $50 → ~$80 total
//   Mid: + 1 Patterson Lake kayak rental (~$50) + Cascadian Farm stop ($20) = ~$150
//   High: + Sun Mountain spa pass ($95 each) + extras = ~$340
const ACTIVITIES_LOW = 80;
const ACTIVITIES_MID = 150;
const ACTIVITIES_HIGH = 340;

// Fuel — depends on path miles + vehicle mpg.
//   Path A ~600 mi · Path B ~900 mi · Path C ~750 mi.
//   Hybrid sedan (~50 mpg) @ $4.40 PNW Aug avg, gas (~28 mpg) ~ same price.
//   Low/Mid uses gas-compact maths; High uses gas-SUV maths.
const fuel = (miles: number, mpg: number): number =>
  Math.round((miles / mpg) * 4.4);

const PATH_MILES: Record<PathLetter, number> = { A: 600, B: 900, C: 750 };

// ─────────────────────────────────────────────────────────────
// Build the tier × path matrix
// ─────────────────────────────────────────────────────────────
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

  return {
    tier,
    summary,
    categories: [
      {
        label: 'Flights',
        note: `2 × NYC↔SEA nonstop · ~$${flightPp}/person`,
        amount: flightPp * 2,
      },
      {
        label: 'Rental car',
        note:
          tier === 'low'
            ? 'Compact sedan (Corolla/Versa) all-in, Costco verified May 16'
            : tier === 'mid'
              ? 'Compact SUV or hybrid sedan all-in (CDW+SLI bundled)'
              : 'Standard Elite SUV (Audi Q3 / Cadillac XT4) all-in',
        amount: rental,
      },
      {
        label: 'Lodging',
        note:
          pathId === 'A'
            ? '4 nights, one west cabin'
            : pathId === 'B'
              ? '2 west + 2 east, mid-trip move'
              : '1 west + 3 east',
        amount: lodgingTotal,
      },
      {
        label: 'Food + treats',
        note:
          tier === 'low'
            ? 'Kosher groceries + cabin cooking, minimal eat-out'
            : tier === 'mid'
              ? 'Groceries + 2 packaged-prepared dinners + Cascadian Farm + winery stop'
              : 'Premium grocery + winery + Sun Mountain drink + ice cream',
        amount: food,
      },
      {
        label: 'Activities + passes',
        note:
          tier === 'low'
            ? 'America the Beautiful pass + Discover Pass'
            : tier === 'mid'
              ? '+ Patterson kayak rental + Cascadian Farm stop'
              : '+ Sun Mountain spa pass per person + extras',
        amount: activities,
      },
      {
        label: 'Fuel',
        note: `${PATH_MILES[pathId]} mi @ ~${mpg} mpg combined (PNW Aug ~$4.40/gal)`,
        amount: fuelCost,
      },
      {
        label: 'Contingency (10%)',
        note: 'Buffer for price drift, gear, parking, unplanned ice cream',
        amount: contingency,
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

export const COSTS_NOTES = {
  includes:
    'Includes: round-trip flights for 2, 5-day rental all-in (CDW+SLI), 4 nights cabin, groceries + treats, passes, fuel, 10% contingency.',
  excludes:
    'Excludes: travel insurance, gear rentals (poles/bear-spray), gifts, shipping/luggage fees, last-minute weather pivots (e.g. extra night in Seattle).',
  asOf: 'May 16-17, 2026 quotes',
};
