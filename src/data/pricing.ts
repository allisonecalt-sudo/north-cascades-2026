/**
 * pricing.ts — canonical $ figures for the trip.
 *
 * Built 2026-05-19 from a parallel research sweep. Replaces the scattered
 * inline price estimates that were drifting across `costs.ts`, `food.ts`,
 * `lodging.ts`, and `driving.ts`. ONE source of truth from now on; all
 * surfaces reference these constants.
 *
 * RULES OF THE ROAD:
 *   1. All numbers in USD.
 *   2. Each price block carries `verifiedOn` + `source` so future-Allison can
 *      see when it last got re-checked.
 *   3. Where live aggregator data couldn't be pulled (Airbnb/Booking JS-block,
 *      direct-property booking flow), the figure carries `verifyAtBooking: true`
 *      and a range that brackets the realistic Aug-peak band. Never fabricate
 *      a single point estimate — always a range.
 *   4. SCOPE — this trip only:
 *      - 2 travelers (Allison + Erin)
 *      - Aug 16-20, 2026 (4 nights / 5 days)
 *      - NYC↔SEA flights (Allison's TLV↔NYC long-haul is OUT of scope, on her
 *        separate ticket)
 *      - Rental car priced separately by a parallel agent (see `rental.ts`) —
 *        DO NOT add rental data here, will conflict with that agent's lane.
 *
 * What this module DOES NOT touch:
 *   - `rental.ts` (separate agent's lane)
 *   - Allison's TLV↔NYC long-haul (separate ticket)
 *   - Erin's NJ-EWR transit
 *
 * Verification dates: see per-block `verifiedOn`.
 */

// ============================================================
// FLIGHTS — per-person round-trip, NYC ↔ SEA
// ============================================================
//
// Sourced May 19, 2026 from a sweep across Google Flights / Kayak / Expedia
// summaries for Sun Aug 16 → Thu Aug 20 transcontinental dates. Live JS-driven
// fare pages weren't directly fetchable, so ranges are built from the
// summary-page data that did come through (Expedia "starting from $292
// August 2026 EWR↔SEA", Skyscanner JFK↔SEA $129-264 RT, Alaska "$365-404
// EWR↔BLI") + the known 12-week-out booking discipline.
//
// Refundable premium per United fare-class research: Economy Flex adds
// ~$150 over standard Economy on a typical transcon RT; Premium Economy
// runs $200-400 more depending on route. Alaska's refundable premium runs
// steeper than United's per Erin's May 18 research note.
// ============================================================

export interface FlightPrice {
  /** Lowest realistic basic-economy / saver fare booked 8-12 weeks out. */
  low: number;
  /** Typical main-cabin / standard economy fare. */
  mid: number;
  /** Refundable / Economy Flex / Premium economy fare. */
  refundable: number;
  /** Dollar premium of refundable over `mid` (the "buy flex" upcharge). */
  refundablePremium: number;
  /** Carrier label, e.g. "United". */
  carrier: string;
  /** Route diagram, e.g. "EWR ↔ SEA nonstop". */
  route: string;
  /** Source citation. */
  source: { name: string; url: string };
  /** Date the price was checked. ISO YYYY-MM-DD. */
  verifiedOn: string;
  /** Notes — anything caller should know (refundable cancellation rules etc.) */
  note: string;
}

export const FLIGHT_PRICES: Record<string, FlightPrice> = {
  'united-ewr-sea': {
    low: 340,
    mid: 440,
    refundable: 590,
    refundablePremium: 150,
    carrier: 'United',
    route: 'EWR ↔ SEA nonstop',
    source: {
      name: 'Expedia / Google Flights · EWR↔SEA Aug 2026 sweep',
      url: 'https://www.google.com/travel/flights/flights-from-newark-to-seattle.html',
    },
    verifiedOn: '2026-05-19',
    note:
      'Aug peak ~$292 baseline shown on Expedia for EWR↔SEA United; +$50-150 typical for Sun Aug 16 outbound + Thu Aug 20 return. Allison\'s United travel credit applies pre-tax on united.com direct (NOT third-party). Economy Flex (refundable) adds ~$150 per traveler over Main Cabin — buy this while WA-20 status is unresolved.',
  },
  'alaska-ewr-bli': {
    low: 365,
    mid: 470,
    refundable: 670,
    refundablePremium: 200,
    carrier: 'Alaska',
    route: 'EWR → SEA → BLI (Alaska, 1 stop)',
    source: {
      name: 'Travelocity · EWR↔BLI Alaska Aug 2026',
      url: 'https://www.travelocity.com/lp/flight-routes/alaska-airlines-from-newark-liberty-intl-airport-to-bellingham-intl/as/ewr/bli',
    },
    verifiedOn: '2026-05-19',
    note:
      'EWR↔BLI Alaska RT ~$365-404 baseline; add ~$50-100 for Aug peak. Refundable upgrade on Alaska runs steeper than United (~$200 per traveler) — Erin May 18 research called this out. No travel credit applies.',
  },
  'united-jfk-sea': {
    low: 320,
    mid: 420,
    refundable: 570,
    refundablePremium: 150,
    carrier: 'United',
    route: 'JFK ↔ SEA nonstop',
    source: {
      name: 'Skyscanner · JFK↔SEA',
      url: 'https://www.skyscanner.com/routes/jfk/sea/new-york-john-f-kennedy-to-seattle-tacoma-international.html',
    },
    verifiedOn: '2026-05-19',
    note:
      'JFK↔SEA baseline ~$129-264 RT across carriers; United nonstop runs ~$50-100 above the floor. Same Economy Flex math as EWR. JFK has more carrier competition so price spikes are softer than EWR.',
  },
  'united-lga-sea': {
    low: 380,
    mid: 480,
    refundable: 630,
    refundablePremium: 150,
    carrier: 'United / Delta',
    route: 'LGA ↔ SEA (limited nonstop inventory)',
    source: {
      name: 'Google Flights · LGA↔SEA',
      url: 'https://www.google.com/travel/flights',
    },
    verifiedOn: '2026-05-19',
    note:
      'LGA inventory tighter than EWR/JFK on transcon. Expect 10-20% premium over EWR/JFK for same booking class. Cross-shop only if EWR/JFK both spike.',
  },
} as const;

/** Return-timing fare delta — Thu evening is the lead; Wed late-night sometimes cheaper. */
export const RETURN_TIMING_DELTA = {
  thuEvening: { delta: 0, note: 'Lead option — Thu Aug 20 evening departure. Baseline price.' },
  thuRedeye: { delta: -30, note: 'Thu Aug 20 redeye runs ~$30 under evening on average — overnight inventory is softer.' },
  wedLate: { delta: -60, note: 'Wed Aug 19 late-night can run ~$60 under Thu evening, but kills Day 5. Only earn-its-keep on a real fare deal.' },
} as const;

// ============================================================
// LODGING — per-night ranges for Aug 16-20, 2026
// ============================================================
//
// Each entry is the realistic Aug-peak nightly range. Sources span direct-
// property pages, KAYAK / Expedia summary pages, and listing aggregators
// where direct-property booking flow was JS-blocked. ALL ranges should be
// re-verified at booking via the booking link (`bookingUrl` in `lodging.ts`).
//
// Cleaning + service fees: noted where the booking platform charges them
// separately (Airbnb / VRBO typically do; direct-property bookings typically
// include cleaning in the nightly rate). Resort fees flagged separately
// because they're a real surprise at checkout.
// ============================================================

export interface LodgingPrice {
  /** Lodging id matching `lodging.ts`. */
  id: string;
  /** Display-name (for cross-reference). */
  name: string;
  /** Aug-peak nightly rate range, low end. */
  nightlyLow: number;
  /** Aug-peak nightly rate range, high end. */
  nightlyHigh: number;
  /** Cleaning fee (per stay) — Airbnb/VRBO only, 0 if N/A. */
  cleaningFee: number;
  /** Service / booking fee (per stay) — Airbnb adds this, 0 if N/A. */
  serviceFee: number;
  /** Resort fee (per night) — Sun Mountain has this. */
  resortFee: number;
  /** Minimum-stay nights — most are 2, Spring Creek is 5. */
  minimumStay: number;
  /** Refundable upgrade premium per stay (if listed separately), 0 if N/A. */
  refundablePremium: number;
  /** Source citation. */
  source: { name: string; url: string };
  /** Date verified. */
  verifiedOn: string;
  /** Verify-at-booking flag — true when live rate couldn't be confirmed. */
  verifyAtBooking: boolean;
  /** Notes (cleaning fee context, peak-vs-shoulder, refundable rules). */
  note: string;
}

export const LODGING_PRICES: Record<string, LodgingPrice> = {
  // ───── WEST SIDE ─────
  'rhody-house': {
    id: 'rhody-house',
    name: 'The Rhody House',
    nightlyLow: 190,
    nightlyHigh: 260,
    cleaningFee: 120,
    serviceFee: 80,
    resortFee: 0,
    minimumStay: 2,
    refundablePremium: 0,
    source: { name: 'Airbnb Marblemount 2BR comparable sweep', url: 'https://www.airbnb.com/marblemount-wa/stays' },
    verifiedOn: '2026-05-19',
    verifyAtBooking: true,
    note: 'Airbnb listing — exact nightly rate JS-blocked. Range built from comparable Marblemount 2BR rentals on Airbnb. Cleaning + service fees per stay typical for Airbnb. Free-cancellation per-host (unknown).',
  },
  'nc-riverside': {
    id: 'nc-riverside',
    name: 'North Cascades Riverside Retreat',
    nightlyLow: 250,
    nightlyHigh: 350,
    cleaningFee: 175,
    serviceFee: 110,
    resortFee: 0,
    minimumStay: 2,
    refundablePremium: 0,
    source: { name: 'Airbnb listing 1159630003390456641', url: 'https://www.airbnb.com/rooms/1159630003390456641?check_in=2026-08-16&check_out=2026-08-20&adults=2' },
    verifiedOn: '2026-05-19',
    verifyAtBooking: true,
    note: 'Airbnb 3-bedroom — book the whole listing. Bigger property than the brief needs, so the nightly is a touch over Terra Nova band. Cleaning + service fees from comparable larger Airbnb. Per-host cancellation policy.',
  },
  'nc-hideaway': {
    id: 'nc-hideaway',
    name: 'North Cascades Hideaway',
    nightlyLow: 200,
    nightlyHigh: 280,
    cleaningFee: 130,
    serviceFee: 90,
    resortFee: 0,
    minimumStay: 2,
    refundablePremium: 0,
    source: { name: 'Airbnb listing 724602112999024219', url: 'https://www.airbnb.com/rooms/724602112999024219?check_in=2026-08-16&check_out=2026-08-20&adults=2' },
    verifiedOn: '2026-05-19',
    verifyAtBooking: true,
    note: 'Airbnb 2BR cabin. Cleaning fee + service fee per stay typical. Per-host cancellation.',
  },
  ovenells: {
    id: 'ovenells',
    name: "Ovenell's Heritage Inn & Log Cabins",
    nightlyLow: 200,
    nightlyHigh: 330,
    cleaningFee: 0,
    serviceFee: 0,
    resortFee: 0,
    minimumStay: 2,
    refundablePremium: 0,
    source: { name: "ovenells-inn.com direct booking", url: 'https://www.ovenells-inn.com/' },
    verifiedOn: '2026-05-19',
    verifyAtBooking: true,
    note: 'Direct booking — no separate cleaning/service fee. Cancellation policy: 3+ days = refund minus 2% card-processing fee; within 24 hrs forfeit full reservation. Not strictly free-cancellation. Book a LOG CABIN, not guesthouse room.',
  },
  'glacier-peak': {
    id: 'glacier-peak',
    name: 'Glacier Peak Resort & Winery',
    nightlyLow: 150,
    nightlyHigh: 220,
    cleaningFee: 0,
    serviceFee: 0,
    resortFee: 0,
    minimumStay: 1,
    refundablePremium: 0,
    source: { name: 'glacierpeakresortandwinery.com direct', url: 'https://glacierpeakresortandwinery.com/' },
    verifiedOn: '2026-05-19',
    verifyAtBooking: true,
    note: 'Direct booking — first-night payment NON-refundable. Cheaper than Terra Nova band; below-floor on TripAdvisor (3.3/5).',
  },
  'cascade-river-house': {
    id: 'cascade-river-house',
    name: 'Cascade River House',
    nightlyLow: 350,
    nightlyHigh: 500,
    cleaningFee: 200,
    serviceFee: 0,
    resortFee: 0,
    minimumStay: 3,
    refundablePremium: 0,
    source: { name: 'cascaderiverhouse.com / Hospitable portal', url: 'https://www.cascaderiverhouse.com/' },
    verifiedOn: '2026-05-19',
    verifyAtBooking: true,
    note: 'Splurge tier — riverfront house. Cleaning fee on Hospitable-style direct bookings. Property restructured in 2026, unit branding shifted — confirm exact unit type at booking.',
  },
  'buffalo-run': {
    id: 'buffalo-run',
    name: 'Buffalo Run Inn',
    nightlyLow: 130,
    nightlyHigh: 180,
    cleaningFee: 0,
    serviceFee: 0,
    resortFee: 0,
    minimumStay: 1,
    refundablePremium: 0,
    source: { name: 'Buffalo Run Inn direct', url: 'https://www.buffalorunrestaurant.com/' },
    verifiedOn: '2026-05-19',
    verifyAtBooking: true,
    note: 'NOT A FIT — single-bed rooms. Listed for price-floor context only.',
  },
  'nc-inn': {
    id: 'nc-inn',
    name: 'North Cascades Inn',
    nightlyLow: 135,
    nightlyHigh: 180,
    cleaningFee: 0,
    serviceFee: 0,
    resortFee: 0,
    minimumStay: 1,
    refundablePremium: 0,
    source: { name: 'North Cascades Inn direct', url: 'https://www.northcascadesinn.com/' },
    verifiedOn: '2026-05-19',
    verifyAtBooking: true,
    note: 'NOT A FIT — single-bed rooms.',
  },

  // ───── EAST SIDE ─────
  freestone: {
    id: 'freestone',
    name: 'Freestone Inn — cabins',
    nightlyLow: 280,
    nightlyHigh: 400,
    cleaningFee: 0,
    serviceFee: 0,
    resortFee: 0,
    minimumStay: 2,
    refundablePremium: 0,
    source: { name: 'KAYAK · Freestone Inn aggregate', url: 'https://www.kayak.com/Mazama-Hotels-Freestone-Inn.45982.ksp' },
    verifiedOn: '2026-05-19',
    verifyAtBooking: true,
    note: 'KAYAK shows from $142 baseline / $199 avg — but THAT is lodge rooms. Cabins (2BR specifically) run $300+ in Aug peak per trip-plan + property language. Cancellation: 31-day cliff for full refund — inside 30 days = full charge. Not free-cancellation flex.',
  },
  'spring-creek-ranch': {
    id: 'spring-creek-ranch',
    name: 'Spring Creek Ranch',
    nightlyLow: 220,
    nightlyHigh: 340,
    cleaningFee: 0,
    serviceFee: 0,
    resortFee: 0,
    minimumStay: 2,
    refundablePremium: 0,
    source: { name: 'springcreekwinthrop.com direct', url: 'https://springcreekwinthrop.com/lodging/' },
    verifiedOn: '2026-05-19',
    verifyAtBooking: true,
    note: 'Direct booking via property. Cancellation: 30+ days = full refund minus $25 processing fee; within 30 days = no refund. Not free-cancellation. Book Spring Creek Cabin (2BR log) for the 2-beds rule. 7-night discount 11% / 30-night discount 30%.',
  },
  'rivers-edge': {
    id: 'rivers-edge',
    name: "River's Edge Resort",
    nightlyLow: 210,
    nightlyHigh: 310,
    cleaningFee: 0,
    serviceFee: 0,
    resortFee: 0,
    minimumStay: 2,
    refundablePremium: 0,
    source: { name: 'riversedgewinthrop.com direct', url: 'https://riversedgewinthrop.com/' },
    verifiedOn: '2026-05-19',
    verifyAtBooking: true,
    note: 'Direct booking. Cancellation: penalty-free 7+ days out for 1-7 night stays; 30 days for weekends/holidays. Aug 16-20 (Sun-Thu) = 7-day window. Advance deposits NON-refundable. Conservative read = not free-cancellation if Aug 13+ cancel.',
  },
  'methow-river': {
    id: 'methow-river',
    name: 'Methow River Lodge & Cabins',
    nightlyLow: 200,
    nightlyHigh: 260,
    cleaningFee: 0,
    serviceFee: 0,
    resortFee: 0,
    minimumStay: 2,
    refundablePremium: 0,
    source: { name: 'KAYAK · Methow River Lodge Cabins', url: 'https://www.kayak.com/Winthrop-Hotels-Methow-River-Lodge-Cabins.6407119.ksp' },
    verifiedOn: '2026-05-19',
    verifyAtBooking: true,
    note: 'KAYAK shows cabins from $251 baseline — Aug peak runs $200-260 for a 2-queen cabin per trip-plan. Direct booking via Frank Hotels reservation system; cancellation policy per-stay (verify at booking).',
  },
  'inn-at-mazama': {
    id: 'inn-at-mazama',
    name: 'The Inn at Mazama (Mazama Country Inn)',
    nightlyLow: 200,
    nightlyHigh: 375,
    cleaningFee: 0,
    serviceFee: 0,
    resortFee: 0,
    minimumStay: 2,
    refundablePremium: 0,
    source: { name: 'innmazama.com direct', url: 'https://www.innmazama.com/' },
    verifiedOn: '2026-05-19',
    verifyAtBooking: true,
    note: 'Direct booking. Guest review noted ~$370/night for Pine Garden Room in July. Cancellation: first-night NON-refundable, due at booking. 2+ weeks out refunds all-but-first-night per room. Book a CABIN, not a lodge room.',
  },
  chewuch: {
    id: 'chewuch',
    name: 'Chewuch Inn & Cabins',
    nightlyLow: 160,
    nightlyHigh: 260,
    cleaningFee: 0,
    serviceFee: 0,
    resortFee: 0,
    minimumStay: 2,
    refundablePremium: 0,
    source: { name: 'chewuchinn.com', url: 'https://chewuchinn.com/' },
    verifiedOn: '2026-05-19',
    verifyAtBooking: true,
    note: 'Direct site was unreachable May 17 (ECONNREFUSED) — cancellation policy unverified. Cabin "kitchenettes" = mini-fridge + microwave + coffee maker only, NOT a fit for kosher cook-in 4 nights. Book a cabin (inn rooms = single bed).',
  },
  'sun-mountain': {
    id: 'sun-mountain',
    name: 'Sun Mountain Lodge — Patterson Lake Cabins',
    nightlyLow: 400,
    nightlyHigh: 970,
    cleaningFee: 0,
    serviceFee: 0,
    resortFee: 23,
    minimumStay: 2,
    refundablePremium: 0,
    source: { name: 'sunmountainlodge.com + KAYAK aggregate', url: 'https://sunmountainlodge.com/room/patterson-lake-cabins/' },
    verifiedOn: '2026-05-19',
    note: 'SPLURGE tier — 1BR Patterson Lake cabin floor ~$400/night Aug peak. 2BR Grand Suite $968+/night per KAYAK. $23/night resort fee + 10.4% WA state tax. Cancellation: 21 days out or full charge. NOT free-cancellation. Verify availability — often oversold for Aug.',
    verifyAtBooking: true,
  },
  'rolling-huts': {
    id: 'rolling-huts',
    name: 'Rolling Huts',
    nightlyLow: 145,
    nightlyHigh: 200,
    cleaningFee: 0,
    serviceFee: 0,
    resortFee: 0,
    minimumStay: 2,
    refundablePremium: 0,
    source: { name: 'rollinghuts.com', url: 'https://rollinghuts.com/' },
    verifiedOn: '2026-05-19',
    verifyAtBooking: true,
    note: 'NOT A FIT — single platform bed per hut.',
  },
  'rio-vista': {
    id: 'rio-vista',
    name: 'Hotel Rio Vista',
    nightlyLow: 170,
    nightlyHigh: 260,
    cleaningFee: 0,
    serviceFee: 0,
    resortFee: 0,
    minimumStay: 1,
    refundablePremium: 0,
    source: { name: 'hotelriovista.com', url: 'https://hotelriovista.com/' },
    verifiedOn: '2026-05-19',
    verifyAtBooking: true,
    note: 'NOT A FIT — single-bed rooms.',
  },
  'mt-gardner': {
    id: 'mt-gardner',
    name: 'Mt. Gardner Inn',
    nightlyLow: 149,
    nightlyHigh: 353,
    cleaningFee: 0,
    serviceFee: 0,
    resortFee: 0,
    minimumStay: 1,
    refundablePremium: 0,
    source: { name: 'mtgardnerinn.com', url: 'https://mtgardnerinn.com/' },
    verifiedOn: '2026-05-19',
    verifyAtBooking: true,
    note: 'NOT A FIT — single-bed rooms.',
  },
} as const;

// ============================================================
// PARK FEES + PERMITS — verified 2026-05-19
// ============================================================

export const PARK_FEES = {
  northCascadesEntrance: {
    cost: 0,
    label: 'North Cascades National Park entrance',
    note: 'No entrance fee for North Cascades National Park Service Complex. Adjacent Mt. Baker-Snoqualmie NF also free at most trailheads.',
    source: { name: 'NPS · North Cascades fees', url: 'https://www.nps.gov/noca/planyourvisit/fees.htm' },
    verifiedOn: '2026-05-19',
  },
  americaBeautifulPass: {
    cost: 80,
    label: 'America the Beautiful annual pass (US resident)',
    note: 'Covers Northwest Forest Pass at all federal trailheads + any other US National Park for the year. Available digitally on Recreation.gov as of Jan 2026. Two motorcycles per pass (2026 update). NONRESIDENT pass is $250.',
    source: { name: 'USGS Store · America the Beautiful Pass', url: 'https://store.usgs.gov/2026-resident-annual-pass' },
    verifiedOn: '2026-05-19',
  },
  northwestForestPassDay: {
    cost: 5,
    label: 'Northwest Forest Pass — day',
    note: 'Required at SOME Forest Service trailheads on this trip (Park Butte, Rainy Pass, Blue Lake, Cutthroat Pass). Per-day rate.',
    source: { name: 'NPS · North Cascades fees', url: 'https://www.nps.gov/noca/planyourvisit/fees.htm' },
    verifiedOn: '2026-05-19',
  },
  northwestForestPassAnnual: {
    cost: 30,
    label: 'Northwest Forest Pass — annual',
    note: 'Worth it over day-passes if you hit 6+ Forest Service trailheads. America the Beautiful ($80) covers this PLUS NPS lands, so only buy NW Forest Pass if you definitely won\'t use AtB for the year.',
    source: { name: 'NPS · North Cascades fees', url: 'https://www.nps.gov/noca/planyourvisit/fees.htm' },
    verifiedOn: '2026-05-19',
  },
  cascadePassParking: {
    cost: 0,
    label: 'Cascade Pass parking',
    note: 'No fee — NPS trailhead. Lot fills by 9-10 AM in August; arrive by 8:30 AM.',
    source: { name: 'NPS · Cascade River Road', url: 'https://www.nps.gov/noca/planyourvisit/cascade-river-road.htm' },
    verifiedOn: '2026-05-19',
  },
  backcountryOvernight: {
    cost: 16,
    label: 'Backcountry overnight permit',
    note: '$10/person + $6 processing fee. NOT needed for any day hike on this trip.',
    source: { name: 'NPS · North Cascades fees', url: 'https://www.nps.gov/noca/planyourvisit/fees.htm' },
    verifiedOn: '2026-05-19',
  },
  campingNightly: {
    cost: 22,
    label: 'NPS campground (developed)',
    note: '$20-24/night at developed NPS campgrounds. Not relevant for the cabin-based plan.',
    source: { name: 'NPS · North Cascades fees', url: 'https://www.nps.gov/noca/planyourvisit/fees.htm' },
    verifiedOn: '2026-05-19',
  },
} as const;

/**
 * Recommendation: buy ONE America the Beautiful pass ($80) for the trip. Both
 * travelers can use it (the pass owner + one passenger get covered at any
 * fee-charging trailhead). This trip has no NPS entrance fee, but the Forest
 * Service trailheads (Park Butte, Rainy Pass, Blue Lake, Cutthroat) need a NW
 * Forest Pass — AtB covers those. Split the $80 = $40/person.
 */
export const RECOMMENDED_PASS = {
  pass: 'America the Beautiful annual',
  cost: 80,
  perPerson: 40,
  note: 'One $80 pass, split between 2 travelers = $40/person. Covers all Forest Service trailheads on this trip + any other US NP for the next 12 months. Skip the $30 NW Forest Pass — AtB does the same thing AND more.',
} as const;

// ============================================================
// GAS / FUEL — verified 2026-05-19 from AAA
// ============================================================

export const GAS = {
  /** WA state average per AAA gasprices.aaa.com — 2026-05-19. */
  waStateAvg: 5.78,
  /** Skagit County (Mount Vernon / Marblemount corridor). */
  skagitCounty: 5.67,
  /** Whatcom County (Bellingham). */
  whatcomCounty: 5.73,
  /**
   * Anchor used for cost rollups — slightly conservative blend of the corridor
   * counties since the trip mostly drives Skagit + Methow Valley. Used to
   * compute fuel-cost ranges on each path.
   */
  tripAnchor: 5.75,
  source: { name: 'AAA · Washington gas prices', url: 'https://gasprices.aaa.com/?state=WA' },
  verifiedOn: '2026-05-19',
  note:
    'WA gas runs ~$5.78/gal as of May 19, 2026 — second-highest in the US (CA is $6.15). The site\'s prior assumption of $4.40/gal is stale. Aug typically drifts ±$0.20 from May.',
} as const;

/**
 * Vehicle MPG assumptions for the fuel cost rollup. Mid = the realistic
 * rental fleet (Costco quotes lean compact SUV / hybrid sedan).
 */
export const VEHICLE_MPG = {
  hybrid: 45,
  compactSedan: 32,
  compactSuv: 28,
  midSuv: 24,
} as const;

/**
 * Compute fuel cost for a path. Returns the all-in $ for that path's mileage
 * at the trip-anchor gas price.
 */
export function fuelCost(miles: number, mpg: number = VEHICLE_MPG.compactSuv): number {
  return Math.round((miles / mpg) * GAS.tripAnchor);
}

// ============================================================
// GROCERIES + FOOD — kosher self-cater approach
// ============================================================
//
// Approach (per Allison + Erin): both keep kosher. Both have full-kitchen
// lodging on most options. Plan = grocery stop in Seattle on Day 1 (Va'ad-
// certified store), supplement at Marblemount / Mazama Store along the route,
// cook most meals in cabin. Restaurants are NOT central to the trip.
// ============================================================

export const GROCERY = {
  /** Per-person trip total (5 days, 4 nights, cabin-cook most meals). */
  perPersonLow: 110,
  perPersonMid: 160,
  perPersonHigh: 220,
  /** Trip total for 2 travelers. */
  totalLow: 220,
  totalMid: 320,
  totalHigh: 440,
  /** Seattle Day-1 stock-up haul — the big trip to QFC U-Village + Trader Joe's. */
  seattleStockUp: 180,
  /** Mid-trip supplement at Marblemount Country Store or Mazama Store. */
  midTripSupplement: 60,
  /** "Pantry opener kit" — oil, salt, pepper, sugar, basics vacation rentals don't reliably stock. */
  pantryOpenerKit: 25,
  source: {
    name: 'BLS / US grocery cost data 2026 + Seattle Va\'ad portfolio',
    url: 'https://seattlevaad.org/kosher-portfolio',
  },
  verifiedOn: '2026-05-19',
  note:
    'Range built from $75-120/person/week US grocery norms (BLS / 2026 inflation-adjusted). For 5 days = ~$55-90/person base; kosher-certified packaged goods (OU/OK/Star-K/Kof-K) carry a ~30-50% premium → $110-220/person range. Seattle Va\'ad-certified stocking stop on Day 1: QFC U-Village (NE 45th St), Trader Joe\'s (regular packaged items with hechsher), PCC View Ridge (bulk). Marblemount Country Store + Mazama Store have small selections — staples only.',
} as const;

export const RESTAURANTS = {
  /** Realistic trip total per person for sit-down meals + coffees + ice cream. */
  perPersonLow: 30,
  perPersonMid: 75,
  perPersonHigh: 120,
  totalLow: 60,
  totalMid: 150,
  totalHigh: 240,
  note:
    'Food is NOT central to the trip. Per-meal estimate: $15-25/person fast-casual, $25-40/person sit-down. Plan = 1-2 sit-downs max + coffees/treats. Winthrop has Old Schoolhouse Brewery + Arrowleaf Bistro; corridor towns have Buffalo Run + Mondo + Birdsview Brewing. None are kosher-certified, but coffee/tea/packaged is fine. If a kosher sit-down sounds good on the Day-5 SEA return, QFC Mercer Island has a Va\'ad-certified deli counter.',
  source: { name: 'Trip-plan.md + Yelp pricing avg', url: 'https://www.yelp.com/' },
  verifiedOn: '2026-05-19',
} as const;

// ============================================================
// ACTIVITIES + EXTRAS
// ============================================================

export const ACTIVITIES = {
  diabloLakeLunchTour: {
    cost: 50,
    label: 'Diablo Lake & Lunch Tour (per adult)',
    note: '$50/adult, $45/senior 62+, $30/youth 3-12. 2.5-3 hrs incl. lunch at the Environmental Learning Center. Wed-Sun, Jul 3 - Sep 7. Tour aboard Alice Ross IV.',
    source: { name: 'NCI · Diablo Lake & Lunch', url: 'https://ncascades.org/signup/programs/skagit-tours/diablo-lake-and-lunch' },
    verifiedOn: '2026-05-19',
  },
  diabloLakeAfternoonCruise: {
    cost: 35,
    label: 'Diablo Lake Afternoon Cruise (per adult)',
    note: '$35/adult, $30/senior, $20/youth 3-12. ~2 hrs. Wed-Sun, Jul 3 - Sep 7. Cheaper option than the lunch tour if you just want the boat ride.',
    source: { name: 'NCI · Diablo Lake Afternoon', url: 'https://ncascades.org/signup/programs/skagit-tours/diablo-lake-afternoon-cruise' },
    verifiedOn: '2026-05-19',
  },
  cascadeLoopScenicDrive: {
    cost: 0,
    label: 'Cascade Loop scenic drive',
    note: 'Free — just gas + time.',
    source: { name: 'WSDOT', url: 'https://wsdot.com/' },
    verifiedOn: '2026-05-19',
  },
  visitorCenterEntry: {
    cost: 0,
    label: 'Visitor center entry',
    note: 'Free — Newhalem Visitor Center, Skagit Information Center, all NPS visitor centers.',
    source: { name: 'NPS · North Cascades', url: 'https://www.nps.gov/noca/planyourvisit/things2do.htm' },
    verifiedOn: '2026-05-19',
  },
  pattersonKayakRental: {
    cost: 30,
    label: 'Patterson Lake kayak rental (Sun Mountain Lodge marina)',
    note: '~$25-35/hour single kayak. Tandem ~$45. Day 5 optional add — 60-90 min if you go.',
    source: { name: 'Sun Mountain Lodge marina', url: 'https://www.sunmountainlodge.com/activities/' },
    verifiedOn: '2026-05-19',
  },
} as const;

// ============================================================
// PER-PATH TOTAL ROLLUP — what does each path actually cost?
// ============================================================
//
// Built from the building blocks above. Per-person totals EXCLUDE rental car
// (separate agent's lane) and EXCLUDE Allison's TLV↔NYC + Erin's NJ-EWR
// transit. Two scenarios per path: refundable (recommended while WA-20
// uncertainty stands) and non-refundable (lock-in if Aug 1 status looks good).
// ============================================================

export interface PathTotal {
  pathId: 'A' | 'B';
  pathName: string;
  /** Per-person, refundable-flights scenario. */
  perPersonRefundable: { low: number; mid: number; high: number };
  /** Per-person, non-refundable-flights scenario (the cheaper book-now). */
  perPersonNonRefundable: { low: number; mid: number; high: number };
  /** Lodging tier this path assumes for the mid scenario. */
  lodgingAnchor: string;
  /** Total miles this path drives. */
  miles: number;
  /** Notes — what's IN, what's OUT. */
  note: string;
}

/**
 * Per-path rollup math:
 *   Per-person = flight + lodging share + groceries + restaurants + gas share
 *                + park pass share + 10% contingency
 *   Lodging share = (nightly × 4 nights) / 2 travelers
 *   Gas share = (miles / mpg × $5.75) / 2 travelers
 *   Park pass share = $80 / 2 = $40
 *
 * Rental car is INTENTIONALLY EXCLUDED — separate agent priced it (see
 * rental.ts for the verified Costco quotes; budget on the costs page already
 * has a "rental" line that pulls from there).
 */
export const PATH_TOTALS: PathTotal[] = [
  {
    pathId: 'A',
    pathName: 'Path A · West-Side Anchor',
    perPersonRefundable: { low: 1290, mid: 1640, high: 2310 },
    perPersonNonRefundable: { low: 1140, mid: 1490, high: 2160 },
    lodgingAnchor: 'Rhody House (low) / Riverside Retreat (mid) / Cascade River House (high)',
    miles: 471,
    note: 'One west base, 4 nights. Lowest mileage path. Excludes rental car + transit to NYC.',
  },
  {
    pathId: 'B',
    pathName: 'Path B · Both Sides, Balanced',
    perPersonRefundable: { low: 1320, mid: 1680, high: 2370 },
    perPersonNonRefundable: { low: 1170, mid: 1530, high: 2220 },
    lodgingAnchor: '2 west + 2 east (Rhody + Methow River / Riverside + Freestone / River House + Sun Mountain)',
    miles: 605,
    note: 'Two bases, mid-trip move on Day 3. Highest mileage path. Excludes rental car + transit to NYC.',
  },
];

export const PRICING_AS_OF = '2026-05-19';
export const PRICING_NOTES = {
  scope:
    'Pricing for the joint NYC↔SEA booking + ground costs. EXCLUDES rental car (separate file: rental.ts), Allison\'s TLV↔NYC long-haul, and Erin\'s NJ-EWR transit.',
  reverify:
    'Re-verify flight prices the week of booking. Re-verify lodging at booking via each property\'s link. Gas/grocery/fees can drift ±10% before retrip.',
} as const;
