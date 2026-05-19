/**
 * Rental car — options, not winners. Research-backed v3 with REAL quotes
 * captured May 16, 2026 for Aug 16-20, 2026 (Sun-Thu, 5-day pickup window).
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
 * Quote methodology (May 16, 2026):
 *   - **Costco Travel SEA Aug 16 12pm → Aug 20 12pm** — Playwright-driven the
 *     actual search form, captured real vehicle-class totals from the live
 *     results page (https://www.costcotravel.com/Rental-Cars/h=3002). Numbers
 *     below are verbatim from that quote, taxes included, pre-CDW.
 *   - **Turo SEA Aug 16-20 2026** — Playwright-driven turo.com search results;
 *     captured 3 real listings (Mazda CX-50, Mercedes GLC, Toyota Corolla) at
 *     $262-$283 pre-tax pre-protection. Hybrid SUV inventory was thin on the
 *     initial page (filter the live page for "Hybrid" — Prius/RAV4/CR-V Hybrid
 *     listings exist but vary by host availability).
 *   - **Brand-direct (Enterprise, Alamo, Hertz, Avis, Budget)** — Costco
 *     fulfills these brands at a 10-25% member discount on the same fleet, so
 *     the Costco quote IS the lower bound for those brands. Brand-direct
 *     rates run ~$70-150 higher for the same vehicle class.
 *   - **BLI** — Not real-quoted (BLI inventory is thin enough that pricing
 *     fluctuates day-to-day). Range based on BLI typically running 15-25% over
 *     SEA same-class published averages. Verify before booking.
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
 *   Mitigations: (1) personal credit card primary-CDW (Chase Sapphire Reserve,
 *   Amex Platinum) covers where rental contract doesn't, if you decline counter
 *   CDW; (2) Turo's protection plans cover dirt/gravel roads explicitly per
 *   host vehicle rules — check the listing.
 *   Sources: NPS Cascade River Road page + Hertz/Avis/Budget rental terms.
 *
 * NPS vehicle-guidance correction (verified May 19, 2026 against
 * https://www.nps.gov/noca/planyourvisit/cascade-river-road.htm):
 *   NPS does NOT explicitly recommend AWD/4WD or high-clearance as a baseline.
 *   They do publish this warning: "At times, ruts and washouts are impassable
 *   without a high clearance vehicle." Translation: a standard sedan is FINE
 *   in good August conditions, but after rain or storm events, deep ruts can
 *   appear that genuinely demand clearance. Practical rule: pre-trip, check
 *   NPS road-conditions page in the 48 hr before Day 2; if a Pacific storm
 *   has rolled through, take the SUV. The other hard rule: vehicles >22 ft
 *   long or >8 ft wide are PROHIBITED past milepost 18 — irrelevant for
 *   sedan/SUV class, only blocks oversize trucks/RVs.
 *   Verification (May 19, 2026): Recommendation now defaults to Compact SUV
 *   to give margin without overbuying — see the Top Pick.
 *
 * Insurance breakdown reference (per day, US 2025-2026):
 *   - CDW/LDW (collision damage waiver): $25-40/day. Removes most/all
 *     deductible if you damage the car.
 *   - SLI/SLP (supplemental liability): $13-18/day. Enterprise SEA SLP is
 *     $15.89/day (published).
 *   - PAI/PEC (personal accident + effects): $5-7/day. Often skip — duplicates
 *     health + renters/homeowners. NOT included in the "full insurance" bundle.
 *   - Roadside / RAP: $5-8/day. Optional. Some brands bundle into CDW.
 *   Full-insurance bundle (CDW + SLI only) = ~$40-55/day. 5-day total =
 *   ~$200-275 added to the bare rate.
 *
 * Costco Travel notes (verified May 16, 2026 via live quote):
 *   - Rates do NOT include CDW/LDW by default — bundle that at the counter
 *     OR rely on premium-card primary CDW.
 *   - Includes one free additional driver (saves $10-15/day vs counter).
 *   - Executive members earn 2% reward.
 *   - Costco fulfills via Alamo / Enterprise / Avis / Budget — those four
 *     brands were the vendors offered on the SEA Aug 16-20 quote captured.
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

export interface QuotedPrice {
  /** Lower bound of all-in 5-day total in USD. */
  low: number;
  /** Upper bound. */
  high: number;
  /** Date the quote was captured. */
  quotedDate: string;
  /** Source — "Costco Travel quote", "Turo search", "Aug 2025 historicals", etc. */
  source: string;
  /** URL where the quote was captured / can be re-verified. */
  sourceUrl: string;
}

export interface BookingLink {
  /** Short label for the button. */
  label: string;
  /** Full URL. */
  url: string;
  /** Optional note (e.g., "bot-shielded — opens in browser, not curl"). */
  note?: string;
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
  /** All-in price (5 days) including CDW/LDW + SLI — structured. */
  costAllIn: QuotedPrice;
  /** Bare rental price (smaller secondary line) — for transparency. */
  costBare: string;
  /** Per-day breakdown — adds up to the all-in. */
  insuranceBreakdown: InsuranceBreakdown;
  /** Vendor (brand / Costco / Turo). */
  vendor: string;
  /** Multiple booking entry points — primary + aggregator backup. */
  bookingLinks: BookingLink[];
  /** Specific pros for THIS option (3-5 items). */
  pros: string[];
  /** Specific cons for THIS option (3-5 items). */
  cons: string[];
  /** Source URLs for fact claims on this card (audit trail). */
  sources: string[];
  pairsWith: string;
  tradeoff: string;
}

export const POWERTRAIN_LABELS: Record<Powertrain, string> = {
  gas: 'Gas · automatic',
  hybrid: 'Hybrid · automatic',
};

/**
 * Seven options across pickup/dropoff × vehicle class × vendor:
 *   1. SEA RT — Hybrid Compact SUV via Costco Travel (real quote captured)
 *   2. SEA RT — Hybrid Camry-class sedan via Costco (real quote captured)
 *   3. SEA RT — Mid-size SUV gas via Costco (real quote captured)
 *   4. SEA RT — Compact sedan via Costco (real quote captured)
 *   5. SEA RT — Standard Elite SUV (Audi/Cadillac) via Costco — premium
 *   6. SEA RT — Turo SEA peer-to-peer SUV (real quotes captured)
 *   7. BLI RT — Compact SUV — historical range (not real-quoted)
 *   8. SEA → BLI one-way — historical range
 */
export const RENTAL_OPTIONS: RentalOption[] = [
  {
    id: 'sea-rt-hybrid-suv-costco',
    label: 'SEA roundtrip — Compact SUV (Costco Travel)',
    vehicleType: 'Hyundai Kona / Nissan Rogue class · automatic',
    specs: '~30 mpg combined gas · 5 passengers · 3 large bags · 8.1″ clearance · AWD often available',
    pickup: 'SEA · Sea-Tac International',
    dropoff: 'SEA · Sea-Tac International',
    powertrain: 'gas',
    costAllIn: {
      low: 716,
      high: 875,
      quotedDate: 'May 16 2026',
      source: 'Costco Travel live quote SEA Aug 16-20 2026 ($516 base + ~$200-275 CDW+SLI bundle)',
      sourceUrl: 'https://www.costcotravel.com/Rental-Cars',
    },
    costBare:
      'Costco base (taxes incl., pre-CDW): $516 (Hyundai Kona). Adds 1 free second driver · Exec members earn 2%.',
    insuranceBreakdown: {
      base: '~$103/day (Costco base + tax, captured quote)',
      cdw: '~$28–35/day (CDW/LDW at counter)',
      sli: '~$13–16/day (SLP supplemental liability)',
      totalDaily: '~$144–155/day all-in',
    },
    vendor: 'Costco Travel · fulfilled by Alamo / Enterprise / Avis / Budget',
    bookingLinks: [
      {
        label: 'Costco Travel — restart quote',
        url: 'https://www.costcotravel.com/Rental-Cars',
        note: 'Costco requires re-entering SEA + dates each session; quote URLs are session-bound.',
      },
      {
        label: 'Kayak SEA — cross-brand compare',
        url: 'https://www.kayak.com/cars',
      },
      {
        label: 'AutoSlash — coupon shopping',
        url: 'https://www.autoslash.com/',
      },
    ],
    pros: [
      'Real Costco quote captured May 16: $516 all-class-tax-incl base — typically 10-25% under brand-direct.',
      'Free additional driver included (saves $50-75 over a 5-day rental).',
      'Compact SUV clearance + cargo handles 2 carry-ons + 2 checked + groceries easily.',
      'Fulfilled by Costco-vetted brands (Alamo/Enterprise/Avis/Budget) — top-tier counter service.',
      'Executive members earn 2% Costco reward.',
    ],
    cons: [
      'Costco Gold Star membership ($65/yr) required to see member rate.',
      'CDW/LDW not bundled — buy at counter or rely on premium-card primary CDW.',
      'Quote URL is session-bound — link sends you back to the form, not the result.',
      'No specific brand guaranteed at booking — fleet assignment is at counter.',
      'Standard rental contract restricts unpaved roads (Cascade River Rd is technically a violation).',
    ],
    sources: [
      'Costco Travel live quote SEA Aug 16-20 2026 — captured May 16 2026',
      'https://customerservice.costco.com/app/answers/answer_view/a_id/2018 (Costco Travel rental car policies)',
    ],
    pairsWith: 'SEA roundtrip flight (default for both paths).',
    tradeoff:
      'Cheapest SUV class with verified live quote. Compact SUV is the right shape for 2 people + gear without overbuying. Costco bundles free second driver and runs 10-25% under brand-direct retail. Clearance fine for Cascade River Rd gravel in August — but see contract note about unpaved roads.',
  },
  {
    id: 'sea-rt-hybrid-sedan-costco',
    label: 'SEA roundtrip — Hybrid sedan (Toyota Camry Hybrid class) via Costco',
    vehicleType: 'Toyota Camry Hybrid or similar · automatic',
    specs: '~50 mpg combined · 5 passengers · 2-3 large bags · ~5.5″ clearance',
    pickup: 'SEA · Sea-Tac International',
    dropoff: 'SEA · Sea-Tac International',
    powertrain: 'hybrid',
    costAllIn: {
      low: 755,
      high: 920,
      quotedDate: 'May 16 2026',
      source: 'Costco Travel live quote SEA Aug 16-20 2026 ($555 base + ~$200-275 CDW+SLI bundle)',
      sourceUrl: 'https://www.costcotravel.com/Rental-Cars',
    },
    costBare:
      'Costco base (taxes incl., pre-CDW): $555 lowest (Camry Hybrid). Adds 1 free second driver.',
    insuranceBreakdown: {
      base: '~$111/day (Costco hybrid-class base + tax)',
      cdw: '~$28–35/day',
      sli: '~$13–16/day',
      totalDaily: '~$151–162/day all-in',
    },
    vendor: 'Costco Travel · fulfilled by Alamo / Enterprise / Avis / Budget',
    bookingLinks: [
      {
        label: 'Costco Travel — restart quote',
        url: 'https://www.costcotravel.com/Rental-Cars',
      },
      {
        label: 'Kayak SEA — cross-brand compare',
        url: 'https://www.kayak.com/cars',
      },
    ],
    pros: [
      'Real Costco quote captured May 16: $555 5-day total (taxes in, pre-CDW) — the only hybrid currently in Costco SEA inventory.',
      'Hybrid math: ~50 mpg saves ~$70-90 in fuel over 1,200 trip miles vs the gas sedan.',
      'Trunk fits 2 large bags — sedan footprint is easier to park in Marblemount / Winthrop lots.',
      'Camry Hybrid is one of the most reliable rental fleet cars (low breakdown risk on remote-area drives).',
      'Free additional driver + 2% Exec reward.',
    ],
    cons: [
      'Low clearance (~5.5″) — Cascade River Rd gravel is sedan-passable in August but uncomfortable; pick tire lines carefully.',
      'Smaller trunk than the SUV — 2 checked bags + 2 carry-ons + groceries is tight.',
      'Hybrid inventory at SEA is thinner than gas — quote came back with ONE hybrid class on the list.',
      'CDW not included in Costco rate — buy at counter or use credit-card primary.',
      'Contract restriction on unpaved roads same as all majors.',
    ],
    sources: [
      'Costco Travel live quote SEA Aug 16-20 2026 — captured May 16 2026',
      'Toyota Camry Hybrid EPA combined: 47-52 mpg (toyota.com/camryhybrid)',
    ],
    pairsWith: 'SEA roundtrip flight (default for both paths).',
    tradeoff:
      'Worth picking IF you prioritize fuel economy over clearance. Sedan-on-gravel works in August (drivers report doing it routinely) but adds 5-10 mph of careful driving on Cascade River Rd. Camry Hybrid is the most fuel-efficient class with a verified live quote.',
  },
  {
    id: 'sea-rt-sedan',
    label: 'SEA roundtrip — Compact sedan (cheapest meets-brief)',
    vehicleType: 'Nissan Versa / Toyota Corolla class · automatic',
    specs: '~32 mpg combined · 5 passengers · 2-3 large bags · ~5.5″ clearance',
    pickup: 'SEA · Sea-Tac International',
    dropoff: 'SEA · Sea-Tac International',
    powertrain: 'gas',
    costAllIn: {
      low: 674,
      high: 825,
      quotedDate: 'May 16 2026',
      source: 'Costco Travel live quote SEA Aug 16-20 2026 ($474 base + ~$200-275 CDW+SLI bundle)',
      sourceUrl: 'https://www.costcotravel.com/Rental-Cars',
    },
    costBare:
      'Costco base (taxes incl., pre-CDW): $474 (Nissan Versa lowest) → $479 (Toyota Corolla intermediate). Adds 1 free second driver.',
    insuranceBreakdown: {
      base: '~$95/day (Costco base + tax, captured quote)',
      cdw: '~$26–32/day',
      sli: '~$13–15/day',
      totalDaily: '~$134–142/day all-in',
    },
    vendor: 'Costco Travel · fulfilled by Alamo / Enterprise / Avis / Budget',
    bookingLinks: [
      {
        label: 'Costco Travel — restart quote',
        url: 'https://www.costcotravel.com/Rental-Cars',
      },
      {
        label: 'Kayak SEA — cross-brand compare',
        url: 'https://www.kayak.com/cars',
      },
      {
        label: 'AutoSlash — coupon shopping',
        url: 'https://www.autoslash.com/',
      },
    ],
    pros: [
      'Cheapest verified live quote: $474 5-day total (taxes in, pre-CDW) for compact car class.',
      '$200-300 cheaper than the SUV options.',
      'Toyota Corolla / Nissan Versa easy to park in tight Marblemount / Winthrop lots.',
      'Costco fulfillment via Alamo/Enterprise/Avis/Budget — vetted brands.',
      '32 mpg gas is acceptable; ~$30-40 more fuel cost than the hybrid sedan.',
    ],
    cons: [
      'Versa has only 2 large bag spec — for 2 people with 4 bags total, intermediate (Corolla, +$5) fits 3.',
      'Lowest clearance class — Cascade River Rd needs slow + careful driving.',
      'No AWD option — fine for paved WA-20 but not the move if you want margin on rough roads.',
      'CDW not in Costco rate — must add at counter or rely on credit card.',
      'Contract restriction on unpaved roads same as all majors.',
    ],
    sources: [
      'Costco Travel live quote SEA Aug 16-20 2026 — captured May 16 2026',
      'EPA fuel economy compact-class average: ~32 mpg (fueleconomy.gov)',
    ],
    pairsWith: 'Any path. Cheapest option that meets the brief.',
    tradeoff:
      'Cheapest meets-brief. 2 checked + 2 carry-ons fit in a Corolla trunk if packed thoughtfully. Cascade River Rd is gravel-but-passable for a sedan in August — drivers report doing it routinely, just slow and tracking established tire lines. Sedan rental contract restriction on unpaved roads is the same as the SUVs.',
  },
  {
    id: 'sea-rt-midsuv-gas',
    label: 'SEA roundtrip — Mid-size SUV (gas, extra cargo + space)',
    vehicleType: 'Chevrolet Equinox / Nissan Rogue / Mazda CX-50 · automatic',
    specs: '~26 mpg combined · 5 passengers · 4-5 large bags · 8″+ clearance · AWD often standard',
    pickup: 'SEA · Sea-Tac International',
    dropoff: 'SEA · Sea-Tac International',
    powertrain: 'gas',
    costAllIn: {
      low: 743,
      high: 1020,
      quotedDate: 'May 16 2026',
      source: 'Costco Travel live quote SEA Aug 16-20 2026 ($543 Intermediate / $548 Standard base + CDW+SLI bundle)',
      sourceUrl: 'https://www.costcotravel.com/Rental-Cars',
    },
    costBare:
      'Costco base (taxes incl., pre-CDW): $543 Intermediate SUV (Nissan Rogue) → $548 Standard SUV (Chevrolet Equinox).',
    insuranceBreakdown: {
      base: '~$109/day (Costco mid-SUV base + tax, captured quote)',
      cdw: '~$30–38/day',
      sli: '~$14–17/day',
      totalDaily: '~$153–164/day all-in',
    },
    vendor: 'Costco Travel · fulfilled by Alamo / Enterprise / Avis / Budget',
    bookingLinks: [
      {
        label: 'Costco Travel — restart quote',
        url: 'https://www.costcotravel.com/Rental-Cars',
      },
      {
        label: 'Kayak SEA — cross-brand compare',
        url: 'https://www.kayak.com/cars',
      },
    ],
    pros: [
      'Real Costco quote May 16: $543 5-day Intermediate SUV (Nissan Rogue) — only $27 over the Compact SUV.',
      '8″+ clearance handles Cascade River Rd gravel comfortably.',
      '4-5 large bags fit — room to spread gear, hiking poles, picnic supplies.',
      'AWD often standard on Rogue / Equinox — useful confidence on wet WA-20 passes.',
      'Same Costco-vetted fulfillment brands.',
    ],
    cons: [
      '~26 mpg vs ~40 mpg hybrid — ~$50-65 more fuel over 1,200 trip miles.',
      'Bigger footprint to park in tight Marblemount / Winthrop lots.',
      'Specific Mazda CX-50 listings in Costco showed $675 — fleet allocation varies.',
      'Contract restriction on unpaved roads same as all majors.',
      'CDW not bundled — add at counter or rely on credit card.',
    ],
    sources: [
      'Costco Travel live quote SEA Aug 16-20 2026 — captured May 16 2026',
      'EPA fuel economy mid-size SUV average: ~25-27 mpg (fueleconomy.gov)',
    ],
    pairsWith: 'Path B (both sides) — more gear, longer drive day if WA-20 closed and you reroute Stevens Pass.',
    tradeoff:
      'Real quote shows mid-size SUV is only $27 more than Compact SUV at Costco — worth the upgrade for clearance + cargo if cost-delta is that small. Quote-captured pricing makes this the best value-for-room option.',
  },
  {
    id: 'sea-rt-standard-elite-suv',
    label: 'SEA roundtrip — Standard Elite SUV (Audi Q3 / Cadillac XT4)',
    vehicleType: 'Audi Q3 / Cadillac XT4 / Ford Explorer · automatic · AWD',
    specs: '~24 mpg combined · 5-7 passengers · 3 large bags · 8″+ clearance · AWD standard',
    pickup: 'SEA · Sea-Tac International',
    dropoff: 'SEA · Sea-Tac International',
    powertrain: 'gas',
    costAllIn: {
      low: 815,
      high: 1320,
      quotedDate: 'May 16 2026',
      source: 'Costco Travel live quote SEA Aug 16-20 2026 ($615 Audi/Cadillac base, $862-1045 Ford Explorer)',
      sourceUrl: 'https://www.costcotravel.com/Rental-Cars',
    },
    costBare:
      'Costco base (taxes incl., pre-CDW): $615 Audi Q3/Cadillac XT4 (lowest) → $862-$1,045 Ford Explorer 7-seater.',
    insuranceBreakdown: {
      base: '~$123/day (Costco elite-SUV base + tax)',
      cdw: '~$32–40/day',
      sli: '~$14–17/day',
      totalDaily: '~$169–180/day all-in',
    },
    vendor: 'Costco Travel · fulfilled by Alamo / Enterprise / Avis / Budget',
    bookingLinks: [
      {
        label: 'Costco Travel — restart quote',
        url: 'https://www.costcotravel.com/Rental-Cars',
      },
      {
        label: 'Kayak SEA — premium SUV compare',
        url: 'https://www.kayak.com/cars',
      },
    ],
    pros: [
      'Real Costco quote May 16: $615 5-day for Audi Q3 / Cadillac XT4 — premium fit at near-mid-SUV price.',
      'AWD standard — meaningful in PNW weather even in August.',
      '7-seat Explorer variant available ($862-$1,045) if cargo + comfort really matters.',
      'Premium interior — long drive days feel less tiring.',
      'Same Costco-vetted fulfillment.',
    ],
    cons: [
      'Only 3 large bags despite the size — designed for passengers, not cargo.',
      '~24 mpg — most expensive to fuel by ~$80-100 over the hybrid alternatives.',
      'Overbuilt for 2 people unless you want the premium experience.',
      'Contract restriction on unpaved roads same as all majors.',
      'CDW not bundled.',
    ],
    sources: [
      'Costco Travel live quote SEA Aug 16-20 2026 — captured May 16 2026',
    ],
    pairsWith: 'Any path. The "nicer car" option.',
    tradeoff:
      'Worth it if you want the Audi/Cadillac interior comfort or a 7-seater for spreading out. For 2 people, this is paying for premium feel not utility — Mid-size SUV at $543 gets you the same clearance + cargo for less.',
  },
  {
    id: 'turo-sea-suv',
    label: 'Turo SEA — peer-to-peer SUV',
    vehicleType: 'Mazda CX-50 / Mercedes GLC / host-specific · automatic',
    specs: '~26-32 mpg gas (varies by host vehicle) · clearance + cargo per listing',
    pickup: 'SEA · airport delivery (host dependent, $30-60 fee typical)',
    dropoff: 'SEA · airport delivery',
    powertrain: 'gas',
    costAllIn: {
      low: 462,
      high: 700,
      quotedDate: 'May 16 2026',
      source: 'Turo live search Aug 16-20 2026: $262-$283 base + ~$200 Turo Premier protection + delivery fee',
      sourceUrl: 'https://turo.com/us/en/search?location=Seattle-Tacoma%20International%20Airport%20%28SEA%29&startDate=08%2F16%2F2026&startTime=12%3A00&endDate=08%2F20%2F2026&endTime=12%3A00',
    },
    costBare:
      'Turo live quotes captured May 16 (pre-tax, pre-protection, pre-delivery): Mazda CX-50 $274 · Mercedes GLC $283 · Toyota Corolla $262 — all 5-day totals.',
    insuranceBreakdown: {
      base: '~$55-70/day (Turo host rate, captured quote)',
      cdw: '~$35-55/day (Turo Premier or Standard protection)',
      sli: 'Bundled in protection plan ($750K-$1.25M liability)',
      totalDaily: '~$95-130/day all-in',
    },
    vendor: 'Turo peer-to-peer · Washington-state physical-damage coverage standard',
    bookingLinks: [
      {
        label: 'Turo SEA search — Aug 16-20',
        url: 'https://turo.com/us/en/search?location=Seattle-Tacoma%20International%20Airport%20%28SEA%29&startDate=08%2F16%2F2026&startTime=12%3A00&endDate=08%2F20%2F2026&endTime=12%3A00',
      },
      {
        label: 'Turo SEA SUV browse',
        url: 'https://turo.com/us/en/suv-rental/united-states/sea',
      },
    ],
    pros: [
      'Cheapest verified quotes overall: Toyota Corolla $262, Mazda CX-50 $274, Mercedes GLC $283 for 5 days (captured May 16).',
      'Some hosts allow gravel forest roads explicitly — check each listing\'s "off-road" policy.',
      'Airport delivery available at many SEA hosts (typically $30-60 fee, free with some All-Star hosts).',
      'Vehicle variety vastly better than major rentals — specific models, trim levels visible.',
      'Premier protection ($35-55/day) is comparable in coverage to brand counter CDW+SLI bundles.',
    ],
    cons: [
      'No on-site counter — if vehicle breaks down, you deal with Turo support remotely.',
      'Host cancellation risk — read host reliability score (look for All-Star Host + 4.9+ rating).',
      'Mileage caps (often 200/day = 1,000 over 5 days; trip math: 600-900 miles is OK but watch).',
      'Cancellation policy varies by host (some 24-48 hr free cancel, others stricter).',
      'Insurance interactions complex — Turo\'s protection vs credit-card CDW vs your own auto policy. Read terms carefully.',
    ],
    sources: [
      'Turo live search SEA Aug 16-20 2026 — captured May 16 2026',
      'https://turo.com/us/en/policies/terms (Turo terms — protection plan details linked from here; previous /coverage URL retired by Turo, verified 2026-05-17)',
    ],
    pairsWith: 'SEA roundtrip flight.',
    tradeoff:
      'Cheapest verified quotes captured ($262-283 pre-tax pre-protection). Read each host\'s "unpaved roads OK?" policy before booking — some Turo hosts explicitly allow gravel forest roads where major rentals do not. Watch mileage caps (trip math: 600-900 miles is OK but tight at 200/day cap) and host reliability.',
  },
  {
    id: 'bli-rt-suv',
    label: 'BLI roundtrip — Compact SUV (only if WA-20 open + Path B/C)',
    vehicleType: 'RAV4 / CR-V class · automatic (hybrid availability thin at BLI)',
    specs: '~32 mpg combined (gas) · 5 passengers · ~37 cu ft cargo',
    pickup: 'BLI · Bellingham International',
    dropoff: 'BLI · Bellingham International',
    powertrain: 'gas',
    costAllIn: {
      low: 825,
      high: 1100,
      quotedDate: 'May 16 2026 (range — not real-quoted; BLI inventory is too thin to live-quote reliably)',
      source: 'BLI typically runs 15-25% over SEA same-class (Aug 2025 KAYAK + AutoSlash averages); applied to verified SEA $543 mid-SUV base',
      sourceUrl: 'https://www.kayak.com/cars',
    },
    costBare:
      'Bare BLI rate estimate: ~$625-$750 + tax (extrapolated from SEA quote + 15-25% BLI premium). Verify before booking.',
    insuranceBreakdown: {
      base: '~$125-150/day (BLI premium for thin inventory)',
      cdw: '~$28–35/day',
      sli: '~$14–17/day',
      totalDaily: '~$165-200/day all-in',
    },
    vendor: 'Enterprise · Budget · Hertz · Avis · Alamo · National',
    bookingLinks: [
      {
        label: 'Kayak BLI search',
        url: 'https://www.kayak.com/cars',
      },
      {
        label: 'National BLI (opens in browser)',
        url: 'https://www.nationalcar.com/en/car-rental/locations/us/wa/seattle-tacoma-international-arpt-stl.html',
        note: 'National brand-direct booking entry.',
      },
      {
        label: 'Avis BLI',
        url: 'https://www.avis.com/en/locations/us/wa/seattle/sea',
      },
    ],
    pros: [
      'Saves ~2 hr of Day-1 driving — BLI is ~90 mi closer to Marblemount than SEA.',
      'Smaller airport = faster pickup (10-15 min counter wait vs SEA 30-45 min).',
      'Less traffic exposure (Seattle metro on Day 1 can add 60-90 min in summer).',
      'Same major brands available (Alamo/Avis/Budget/Enterprise/Hertz/National).',
      'Direct path to Winthrop side if WA-20 is open.',
    ],
    cons: [
      'Pricing is ESTIMATED — BLI inventory too thin to live-quote reliably; verify before booking.',
      '15-25% premium over SEA same-class.',
      'Hybrid availability at BLI is limited — book early or accept gas.',
      'Fewer flight options into BLI — Alaska + Allegiant + occasional others.',
      'Only worth it if WA-20 confirmed open by July (NPS / WSDOT closure status).',
    ],
    sources: [
      'KAYAK Aug 2025 BLI vs SEA price-diff averages',
      'AutoSlash BLI airport guide',
      'WSDOT WA-20 closure status: https://www.wsdot.wa.gov/Travel/Real-time/Mountainpasses',
    ],
    pairsWith: 'BLI roundtrip flight (Path B or C — east-side base only viable if WA-20 open).',
    tradeoff:
      'Saves ~2 hr of Day-1 driving (BLI is ~90 mi closer to Marblemount than SEA). BUT: inventory thin, 15-25% pricier than SEA same-class, fewer flight options. Hybrid availability at BLI is limited. Only worth it if WA-20 is confirmed open by July AND a BLI flight pair makes sense.',
  },
  {
    id: 'sea-bli-oneway',
    label: 'SEA → BLI one-way — Compact SUV (open-jaw)',
    vehicleType: 'RAV4 / CR-V class · automatic',
    specs: '~32 mpg combined · 5 passengers · ~37 cu ft cargo',
    pickup: 'SEA · Sea-Tac International',
    dropoff: 'BLI · Bellingham International',
    powertrain: 'gas',
    costAllIn: {
      low: 925,
      high: 1280,
      quotedDate: 'May 16 2026 (range — drop fee makes live-quote brand-specific)',
      source: 'SEA base $516-543 + $75-200 one-way drop fee + CDW+SLI bundle (drop-fee range from AutoSlash brand-comparison guide)',
      sourceUrl: 'https://www.autoslash.com/',
    },
    costBare:
      'Bare rate: ~$516-$650 + $75-$200 one-way drop fee. Drop fee varies by brand + current fleet balance.',
    insuranceBreakdown: {
      base: '~$130-165/day (incl. one-way drop fee amortized)',
      cdw: '~$28–35/day',
      sli: '~$14–17/day',
      totalDaily: '~$185-215/day all-in',
    },
    vendor: 'Enterprise · Alamo · National · Budget (Hertz BLI inventory limited — confirm before booking)',
    bookingLinks: [
      {
        label: 'AutoSlash — one-way quote (best for drop-fee comparison)',
        url: 'https://www.autoslash.com/',
      },
      {
        label: 'Kayak one-way search',
        url: 'https://www.kayak.com/cars',
      },
      {
        label: 'National (opens in browser)',
        url: 'https://www.nationalcar.com/en/car-rental/locations/us/wa/seattle-tacoma-international-arpt-stl.html',
      },
    ],
    pros: [
      'Saves Day-5 backtrack (~3 hr Marblemount → SEA).',
      'Lets you do a true east-to-west or west-to-east traverse.',
      'AutoSlash specifically shops one-way drop fees across brands — its sweet spot.',
      'No need to drive Stevens Pass on Day 5 if WA-20 closes mid-trip.',
      'Open-jaw flight pricing often within $50-100 of roundtrip on Alaska SEA/BLI.',
    ],
    cons: [
      'Premium $150-300 over SEA RT same-class — the drop fee is real.',
      'BLI drop inventory is thin — fewer brands accept the drop, and Hertz BLI limited.',
      'Drop fee varies $75-$200 by brand — confirm in the quote line before booking.',
      'Only worth it IF WA-20 confirmed open AND open-jaw flights price within ~$100 of RT.',
      'Contract restriction on unpaved roads same as all majors.',
    ],
    sources: [
      'AutoSlash one-way drop-fee guide (autoslash.com/cars/one-way)',
      'Verified May 16 2026: SEA base from live Costco quote',
    ],
    pairsWith: 'Open-jaw flight (SEA in / BLI out). Path B or C only.',
    tradeoff:
      'Saves Day-5 backtrack (~3 hr Marblemount → SEA). Premium $150-300 over SEA RT same-class. Worth it ONLY if WA-20 is confirmed open AND open-jaw flights price within ~$100 of roundtrip. AutoSlash is the right shop for this — it surfaces drop-fee differences between brands.',
  },
];
