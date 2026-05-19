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
 * May 19, 2026: Path C removed (Allison's call — not using it). Only A + B.
 *
 * Two paths (A / B), each with low / mid / high tiers built from:
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

export type PathLetter = 'A' | 'B';
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
// VERIFIED 2026-05-19 from Google Flights + Expedia + Skyscanner sweep.
//   - Low: $340 (United EWR↔SEA Basic Economy, 8-12wk book-ahead)
//   - Mid: $440 (United EWR↔SEA Main Cabin, typical Aug peak)
//   - High: $590 (Economy Flex refundable — recommended while WA-20
//     status is unresolved per Erin May 18 flex-discipline note)
// ─────────────────────────────────────────────────────────────
const FLIGHT_LOW_PP = 340;
const FLIGHT_MID_PP = 440;
const FLIGHT_HIGH_PP = 590;

// Rental — from rental.ts verified Costco quotes May 16, 2026.
const RENTAL_LOW = 674;
const RENTAL_MID = 750;
const RENTAL_HIGH = 815;

// Food — kosher self-cater + 1-2 treat-meals. Verified 2026-05-19.
// Low = $25/day/person × 5 days × 2 = $250 → kept (matches GROCERY.totalLow).
// Mid = groceries $320 + restaurants $150 = $470 (was $380, bumped to
//       reflect verified $5.78 WA grocery inflation + 30-50% kosher premium).
// High = groceries $440 + restaurants $240 + extras = $720 (was $520, raised
//        to match verified kosher-premium realistic ceiling).
const FOOD_LOW = 250;
const FOOD_MID = 470;
const FOOD_HIGH = 720;

// Activities + parks. America the Beautiful $80 split = $40/person × 2 = $80
// for the pair. Diablo Lake afternoon cruise $35 × 2 = $70. Patterson kayak
// rental ~$60 (2 hrs tandem). Sun Mountain spa pass ~$60 per person × 2.
const ACTIVITIES_LOW = 80;   // AtB pass only
const ACTIVITIES_MID = 150;  // AtB + Diablo afternoon cruise for 2
const ACTIVITIES_HIGH = 340; // AtB + Diablo lunch tour for 2 + kayak + Sun Mtn extras

// Fuel — depends on path miles + vehicle mpg.
// VERIFIED 2026-05-19: WA gas $5.78/gal AAA state avg (Skagit County $5.67,
// Whatcom County $5.73). Was $4.40/gal — stale by 31%. Using $5.75 as the
// trip-corridor anchor since the drive is mostly in Skagit + Methow Valley.
const fuel = (miles: number, mpg: number): number =>
  Math.round((miles / mpg) * 5.75);

const PATH_MILES: Record<PathLetter, number> = { A: 471, B: 605 };

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
            : '2 west + 2 east, mid-trip move · ') + lodgingAnchor,
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
            ? 'Kosher groceries + cabin cooking, minimal eat-out · ~$110/person trip groceries + minimal restaurants'
            : tier === 'mid'
              ? 'Groceries ($160/pp) + 1-2 sit-down treat dinners ($75/pp) + coffees/ice cream'
              : 'Premium kosher grocery haul + Arrowleaf Bistro nicer dinner + Sun Mountain drink + ice cream',
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
            ? 'America the Beautiful annual pass ($80 split = $40/pp)'
            : tier === 'mid'
              ? '+ Diablo Lake afternoon cruise ($35/pp × 2)'
              : '+ Diablo Lake lunch tour ($50/pp × 2) + Patterson kayak rental + Sun Mountain extras',
        amount: activities,
        flex: 'flexible',
        sourceHref: 'details.html',
        sourceLabel: 'See trip details on Details →',
      },
      {
        key: 'fuel',
        label: 'Fuel',
        note: `${PATH_MILES[pathId]} mi @ ~${mpg} mpg · WA gas $5.78/gal (AAA May 19, 2026 — Skagit County $5.67, Whatcom $5.73)`,
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

// Lodging totals — 4-night STAY total (nightly × 4 + cleaning/service fees
// where Airbnb-style), all-in pre-tax. VERIFIED 2026-05-19 against pricing.ts.
//
// Path A (4 nights west, ONE base):
//   - Low: Rhody House $190-260/night → $190×4 = $760 + $200 fees = $960
//   - Mid: Riverside Retreat $250-350/night → $300×4 = $1,200 + $285 fees = $1,485
//   - High: Cascade River House $350-500/night → $425×4 = $1,700 + $200 fees = $1,900
//
// Path B (2 west + 2 east, TWO bases):
//   - Low: Rhody $200×2 + Methow River $220×2 = $840 + $200 west fees = $1,040
//   - Mid: Riverside $300×2 + Freestone $340×2 = $1,280 + $285 = $1,565
//   - High: Cascade River House $425×2 + Sun Mountain $620×2 = $2,090 + fees + resort = $2,350

// Path A — 4 nights one west cabin
const PATH_A: PathCost = {
  pathId: 'A',
  pathName: 'Path A · West-Side Anchor',
  tiers: [
    buildTier('A', 'low', 960),
    buildTier('A', 'mid', 1485),
    buildTier('A', 'high', 1900),
  ],
};

// Path B — 2 west + 2 east
const PATH_B: PathCost = {
  pathId: 'B',
  pathName: 'Path B · Both Sides, Balanced',
  tiers: [
    buildTier('B', 'low', 1040),
    buildTier('B', 'mid', 1565),
    buildTier('B', 'high', 2350),
  ],
};

export const PATH_COSTS: PathCost[] = [PATH_A, PATH_B];

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
    'Includes: round-trip flights for 2 (NYC↔SEA), 5-day rental all-in (CDW+SLI), 4 nights cabin + cleaning/resort fees where applicable, kosher groceries + treats, America the Beautiful pass split, fuel at WA $5.78/gal (AAA May 2026), 10% contingency.',
  excludes:
    'Excludes: travel insurance, gear rentals (poles/bear-spray), gifts, shipping/luggage fees, last-minute weather pivots (e.g. extra night in Seattle), Allison\'s TLV↔NYC long-haul (separate ticket), Erin\'s NJ→EWR transit.',
  asOf: 'May 19, 2026 pricing sweep',
};
