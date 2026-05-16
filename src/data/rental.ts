/**
 * Rental car — options, not winners. Research-backed pass (May 16, 2026).
 *
 * Hard rules (Allison, May 16, 2026):
 *   - **Automatic transmission ONLY.** *"car must be automatic."* US major-fleet
 *     defaults all automatic — sticks not offered on standard reservations.
 *   - **Gas or hybrid powertrain.** No EVs (rural charging logistics — no
 *     reliable DC fast-charging between Marblemount and Winthrop), no diesel.
 *   - **Prices quoted ALL-IN with full insurance** (CDW/LDW + supplemental
 *     liability + roadside / loss-of-use) — that's the headline number. Bare
 *     rental shows only as a smaller secondary line for transparency.
 *
 * Critical contractual finding worth knowing before booking:
 *   ALL major US rental brands (Hertz, Avis, Enterprise, Budget, Alamo,
 *   National, Dollar) restrict driving on unpaved roads. Hertz says
 *   "regularly maintained" only; Avis says "paved" only; Budget calls out
 *   "gravel and dirt roads not regularly maintained." Driving Cascade River
 *   Road's final ~13 mi of compacted gravel VIOLATES these clauses and
 *   technically voids CDW/LDW + liability. In practice: Cascade River Rd is
 *   NPS-maintained, sedan-passable in August, and routinely driven by rental
 *   tourists — but if something happens, you are on the hook.
 *   Mitigations: (1) personal credit card primary-CDW some cards (Chase
 *   Sapphire Reserve, Amex Platinum) cover where rental contract doesn't,
 *   if you decline counter CDW; (2) Turo's protection plans cover dirt/gravel
 *   roads explicitly per host vehicle rules — check the listing.
 *   Sources: NPS Cascade River Road page + Hertz/Avis/Budget rental terms.
 *
 * Pricing methodology:
 *   Aug 16-20 2026 (Sun-Thu, 5 days/4 nights) is shoulder-of-peak — summer
 *   demand high, but mid-week return helps. Ranges below are anchored to
 *   published Aug 2025-2026 SEA/BLI rate data from KAYAK, momondo, AutoSlash
 *   guide pages, and brand averages. SEA inventory is deep (12+ brands).
 *   BLI inventory is thin — Alamo, Avis, Budget, Enterprise, Hertz, National
 *   only, and Hertz BLI is reservation-only with limited fleet.
 *
 * Insurance breakdown reference (per day, US 2025-2026):
 *   - CDW/LDW (collision damage waiver): $25-40/day. Removes most/all
 *     deductible if you damage the car.
 *   - SLI/SLP (supplemental liability): $13-18/day. Enterprise SEA SLP is
 *     $15.89/day (published). Bumps third-party liability to ~$300K-$1M.
 *   - PAI/PEC (personal accident + effects): $5-7/day. Often skip — duplicates
 *     health + renters/homeowners. Not included in the "full insurance"
 *     bundle below.
 *   - Roadside / RAP: $5-8/day. Optional. Some brands bundle into CDW.
 *   Full-insurance bundle (CDW + SLI only) = ~$40-55/day. 5-day total =
 *   ~$200-275 added to the bare rate.
 *
 * Costco Travel notes (verified May 16, 2026):
 *   - Rates do NOT include CDW/LDW by default — bundle that at the counter
 *     OR rely on premium-card primary CDW.
 *   - Includes one free additional driver (saves $10-15/day vs counter).
 *   - Executive members earn 2% reward.
 *   - Typically 10-25% under direct retail for the same vehicle.
 */

export type Powertrain = 'gas' | 'hybrid';

export interface InsuranceBreakdown {
  /** Base rental + tax (no insurance). */
  base: string;
  /** Collision damage waiver / LDW. */
  cdw: string;
  /** Supplemental liability (SLI/SLP). */
  sli: string;
  /** Total daily-rate equivalent including base + CDW + SLI. */
  totalDaily: string;
}

export interface RentalOption {
  id: string;
  label: string;
  vehicleType: string;
  /** MPG + cargo info, for the "is this enough vehicle" question. */
  specs: string;
  pickup: string;
  dropoff: string;
  /** Powertrain — gas or hybrid only. No EVs. */
  powertrain: Powertrain;
  /** All-in price (5 days) including CDW/LDW + SLI. */
  costAllIn: string;
  /** Bare rental price (smaller secondary line) — for transparency. */
  costBare: string;
  /** Per-day breakdown — adds up to the all-in. */
  insuranceBreakdown: InsuranceBreakdown;
  /** Vendor (brand / Costco / Turo). */
  vendor: string;
  /** Real, verified-live booking entry point. */
  bookingLink: string;
  pairsWith: string;
  tradeoff: string;
}

export const POWERTRAIN_LABELS: Record<Powertrain, string> = {
  gas: 'Gas · automatic',
  hybrid: 'Hybrid · automatic',
};

/**
 * Six options across pickup/dropoff × vehicle class × vendor:
 *   1. SEA RT — Hybrid Compact SUV via Costco Travel (RAV4 Hybrid class)
 *   2. SEA RT — Hybrid Compact SUV direct via Enterprise (apples-to-apples)
 *   3. SEA RT — Gas Mid-size SUV (Highlander / Pilot class) — extra room
 *   4. SEA RT — Mid-size sedan (Camry / Accord class) — cheapest meets-brief
 *   5. BLI RT — Compact SUV — only if WA-20 confirmed open + Path B/C
 *   6. SEA → BLI one-way — Compact SUV — open-jaw, premium for no-backtrack
 *   7. Turo SEA — Hybrid SUV peer-to-peer — alt shape, gravel-friendly hosts
 */
export const RENTAL_OPTIONS: RentalOption[] = [
  {
    id: 'sea-rt-hybrid-suv-costco',
    label: 'SEA roundtrip — Hybrid Compact SUV (Costco Travel)',
    vehicleType: 'Toyota RAV4 Hybrid / Honda CR-V Hybrid · automatic',
    specs: '~40 mpg combined · ~37 cu ft cargo (rear seats up) · 8.1″ clearance',
    pickup: 'SEA · Sea-Tac International',
    dropoff: 'SEA · Sea-Tac International',
    powertrain: 'hybrid',
    costAllIn: '$575–700 all-in (5 days, CDW + SLI bundled)',
    costBare:
      'Bare Costco base rate: ~$340–450 · adds 1 free second driver · Exec members earn 2%.',
    insuranceBreakdown: {
      base: '~$70–90/day (Costco base + tax)',
      cdw: '~$28–35/day (CDW/LDW at counter)',
      sli: '~$13–16/day (SLP supplemental liability)',
      totalDaily: '~$115–140/day all-in',
    },
    vendor: 'Costco Travel · usually fulfilled by Alamo / Enterprise / Budget',
    bookingLink: 'https://www.costcotravel.com/Rental-Cars',
    pairsWith: 'SEA roundtrip flight (default for all 3 paths).',
    tradeoff:
      'Best all-around. Hybrid saves ~$45–65 in fuel over 1,200+ trip miles vs the gas equivalent. Costco bundles free second driver (saves $50–75 at the counter) and runs 10–25% under brand-direct retail. Clearance fine for Cascade River Rd gravel in August — but see contract note about unpaved roads.',
  },
  {
    id: 'sea-rt-hybrid-suv-enterprise',
    label: 'SEA roundtrip — Hybrid Compact SUV (Enterprise direct)',
    vehicleType: 'Toyota RAV4 Hybrid / Honda CR-V Hybrid · automatic',
    specs: '~40 mpg combined · ~37 cu ft cargo · 8.1″ clearance',
    pickup: 'SEA · Sea-Tac International',
    dropoff: 'SEA · Sea-Tac International',
    powertrain: 'hybrid',
    costAllIn: '$650–800 all-in (5 days, DW + SLP bundled)',
    costBare: 'Bare Enterprise rate: ~$425–550 + tax (no insurance).',
    insuranceBreakdown: {
      base: '~$85–110/day (Enterprise rate + tax)',
      cdw: '~$30–35/day (Damage Waiver)',
      sli: '$15.89/day (SLP — Enterprise SEA published)',
      totalDaily: '~$130–160/day all-in',
    },
    vendor: 'Enterprise direct',
    bookingLink:
      'https://www.enterprise.com/en/car-rental-locations/us/wa/seattle-tacoma-sea-tac-intl-airport-45b8.html',
    pairsWith: 'SEA roundtrip flight.',
    tradeoff:
      'Same vehicle as the Costco card, ~$75–100 more. Worth it if (a) Costco fulfillment goes to a brand you trust less, or (b) you want the published Enterprise customer-service track record. Enterprise consistently scores top of US rental brand satisfaction; Hertz + Avis trail on toll-fee complaints.',
  },
  {
    id: 'sea-rt-midsuv-gas',
    label: 'SEA roundtrip — Mid-size SUV (gas, extra cargo)',
    vehicleType: 'Toyota Highlander / Honda Pilot / Ford Explorer · automatic',
    specs: '~24 mpg combined · ~48 cu ft cargo · 8″+ clearance · AWD often standard',
    pickup: 'SEA · Sea-Tac International',
    dropoff: 'SEA · Sea-Tac International',
    powertrain: 'gas',
    costAllIn: '$700–875 all-in (5 days, CDW + SLI bundled)',
    costBare: 'Bare rate: ~$465–600 + tax.',
    insuranceBreakdown: {
      base: '~$95–120/day',
      cdw: '~$30–38/day',
      sli: '~$14–17/day',
      totalDaily: '~$140–175/day all-in',
    },
    vendor: 'Costco Travel or Alamo direct',
    bookingLink: 'https://www.costcotravel.com/Rental-Cars',
    pairsWith: 'Path B (both sides) — more gear, longer drive day if WA-20 closed and you reroute Stevens Pass.',
    tradeoff:
      'Overbuilt for 2 people. Worth it only if you want AWD comfort on WA-20 mountain pass (it is paved + maintained — AWD is not needed but is nice) or want to spread out gear. Costs ~$100–175 more than the hybrid for 16 fewer mpg.',
  },
  {
    id: 'sea-rt-sedan',
    label: 'SEA roundtrip — Mid-size sedan',
    vehicleType: 'Toyota Camry / Honda Accord / Nissan Altima · automatic (gas; hybrid sometimes available — ask)',
    specs: '~32 mpg gas / ~50 mpg hybrid · ~15 cu ft trunk · ~5.5″ clearance',
    pickup: 'SEA · Sea-Tac International',
    dropoff: 'SEA · Sea-Tac International',
    powertrain: 'gas',
    costAllIn: '$475–625 all-in (5 days, CDW + SLI bundled)',
    costBare: 'Bare rate: ~$250–400 + tax.',
    insuranceBreakdown: {
      base: '~$50–80/day',
      cdw: '~$26–32/day',
      sli: '~$13–15/day',
      totalDaily: '~$95–125/day all-in',
    },
    vendor: 'Costco Travel · Budget · Alamo · Enterprise',
    bookingLink: 'https://www.costcotravel.com/Rental-Cars',
    pairsWith: 'Any path. Cheapest option that meets the brief.',
    tradeoff:
      'Cheapest meets-brief. 2 checked + 2 carry-ons fit in a Camry trunk if packed thoughtfully. Cascade River Rd is gravel-but-passable for a sedan in August — drivers report doing it in small sedans, just slow and tracking established tire lines. Sedan rental contract restriction on unpaved roads is the same as the SUVs — see note above.',
  },
  {
    id: 'bli-rt-suv',
    label: 'BLI roundtrip — Compact SUV (only if WA-20 open + Path B/C)',
    vehicleType: 'RAV4 / CR-V class · automatic (hybrid availability thin at BLI)',
    specs: '~32 mpg combined (gas) · ~37 cu ft cargo',
    pickup: 'BLI · Bellingham International',
    dropoff: 'BLI · Bellingham International',
    powertrain: 'gas',
    costAllIn: '$700–925 all-in (5 days, CDW + SLI bundled)',
    costBare: 'Bare rate: ~$425–600 + tax. BLI runs 15–25% over SEA for same class.',
    insuranceBreakdown: {
      base: '~$85–120/day (BLI premium for thin inventory)',
      cdw: '~$28–35/day',
      sli: '~$14–17/day',
      totalDaily: '~$140–180/day all-in',
    },
    vendor: 'Enterprise · Budget · Hertz · Avis · Alamo · National',
    bookingLink:
      'https://www.enterprise.com/en/car-rental-locations/us/wa/bellingham-international-airport-4592.html',
    pairsWith: 'BLI roundtrip flight (Path B or C — east-side base only viable if WA-20 open).',
    tradeoff:
      'Saves ~2 hr of Day-1 driving (BLI is ~90 mi closer to Marblemount than SEA). BUT: inventory thin, 15–25% pricier than SEA same-class, fewer flight options. Hybrid availability at BLI is limited — book early or accept gas. Only worth it if a BLI flight pair makes sense AND WA-20 is confirmed open by July (NPS / WSDOT closure status).',
  },
  {
    id: 'sea-bli-oneway',
    label: 'SEA → BLI one-way — Compact SUV (open-jaw)',
    vehicleType: 'RAV4 / CR-V class · automatic',
    specs: '~32 mpg combined · ~37 cu ft cargo',
    pickup: 'SEA · Sea-Tac International',
    dropoff: 'BLI · Bellingham International',
    powertrain: 'gas',
    costAllIn: '$775–1,050 all-in (5 days, CDW + SLI + drop fee)',
    costBare: 'Bare rate: ~$425–650 + $75–200 one-way drop fee.',
    insuranceBreakdown: {
      base: '~$85–130/day (incl. one-way drop fee amortized)',
      cdw: '~$28–35/day',
      sli: '~$14–17/day',
      totalDaily: '~$155–185/day all-in',
    },
    vendor: 'Enterprise · Alamo · National · Budget (Hertz BLI inventory limited — confirm before booking)',
    bookingLink: 'https://www.autoslash.com/',
    pairsWith: 'Open-jaw flight (SEA in / BLI out). Path B or C only.',
    tradeoff:
      'Saves Day-5 backtrack (~3 hr Marblemount → SEA). Premium $150–300 over SEA RT same-class. Worth it ONLY if WA-20 is confirmed open AND open-jaw flights price within ~$100 of roundtrip. Confirm drop fee in the quote before booking — varies by brand and current fleet balance.',
  },
  {
    id: 'turo-sea-hybrid',
    label: 'Turo SEA — Hybrid SUV (peer-to-peer)',
    vehicleType: 'RAV4 Hybrid / Hyundai Palisade Hybrid / similar · automatic (host-dependent)',
    specs: '~32–40 mpg · cargo varies · check host listing for clearance + mileage caps',
    pickup: 'SEA · airport delivery (host dependent, $30–60 fee)',
    dropoff: 'SEA · airport delivery',
    powertrain: 'hybrid',
    costAllIn: '$575–875 all-in (5 days, Premier or Standard protection)',
    costBare: 'Bare Turo rate: ~$95–120/day × 5 = $475–600 + $50–100 delivery fee. Reference: 2026 Hyundai Palisade Hybrid Seattle averaged $118/day.',
    insuranceBreakdown: {
      base: '~$95–120/day (host rate)',
      cdw: '~$35–55/day (Turo Premier or Standard protection)',
      sli: 'Bundled in protection plan ($750K–$1.25M liability)',
      totalDaily: '~$130–175/day all-in',
    },
    vendor: 'Turo peer-to-peer · Washington-state physical-damage coverage standard',
    bookingLink: 'https://turo.com/us/en/suv-rental/united-states/sea',
    pairsWith: 'SEA roundtrip flight.',
    tradeoff:
      'Worth a 10-min check. Filter automatic + gas/hybrid (Turo has more EVs than major rentals — filter them out). Read each host\'s "unpaved roads OK?" policy before booking — some Turo hosts explicitly allow gravel forest roads where major rentals do not. Tradeoffs: mileage caps (often 200/day — math: 600–900 trip mi over 5 days = OK but tight), cancellation policy is host-specific, no on-site counter if something goes wrong.',
  },
];
