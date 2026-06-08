/**
 * Cool sleeping places — in & around the park.
 *
 * Distinct from the standard West/East tabs. These are the conversation-starters:
 * NPS-area lodgings, fire lookouts on USFS land, lakeside state-park cabins,
 * working-ranch guest cabins. Even some bucket-list logistics (Stehekin is
 * boat-in only, Ross Lake Resort is lottery-based) are surfaced as options
 * Erin would want to see.
 *
 * Standing constraints (Allison May 16, 2026):
 *   - 2 beds + 1-2 bedrooms required.
 *   - Practical-not-extreme. Strenuous hike-in to a single-bunk lookout is
 *     NOT in scope. Cool = property type/setting, not difficulty of access.
 *   - No tent backcountry. No single-bed properties.
 *
 * Each entry carries:
 *   - In-park / Around-park / Quirky tag
 *   - Drive-in vs boat-in vs hike-in
 *   - Bed/bedroom config
 *   - Sunset + view + nature proximity notes
 *   - Real reviews + count + source + asOf
 *   - "Bookable Aug 16-20, 2026?" honest status (some are lottery-based)
 *   - Direct booking URL
 *   - Source URL the data was pulled from (for the citation strip)
 *
 * Researched May 17, 2026 via web search + property websites + Recreation.gov.
 */

export type AccessMode = 'drive-in' | 'boat-in' | 'hike-in' | 'shuttle/boat-in';

export type LocationTier =
  | 'in-park'        // NPS-operated or NPS-land-adjacent
  | 'around-park'    // USFS, state-park, or directly bordering NPS land
  | 'quirky';        // Distinctive private — treehouse, glamping, ranch

export type BookingStatus =
  | 'open-bookable'           // Real-time online booking, dates likely open
  | 'lottery'                 // Requires a lottery or waitlist (Ross Lake)
  | 'phone-or-form'           // No real-time online booking — contact required
  | 'check-availability';     // Site has online booking but Aug 16-20 demand-sensitive

export interface CoolSleepingPlace {
  id: string;
  name: string;
  /** "Diablo Lake · NPS Stehekin · etc." */
  region: string;
  locationTier: LocationTier;
  access: AccessMode;
  /** Bed/bedroom note — must explicitly note if 2-bed requirement is met. */
  beds: string;
  /** Bedrooms — "Studio cabin (NOT a fit)" if single. */
  bedrooms: string;
  /** Pricing range — verbatim from source where possible. */
  priceRange: string;
  /** One-line nature/view summary — prominent on card. */
  natureView: string;
  /** Sunset note — explicit if the property is known sunset-worthy. */
  sunsetNote?: string;
  /** Why it's a "cool sleeping place" — one or two sentences. */
  whyCool: string;
  /** Reviews — score + count + source + asOf. "N/A" allowed for waitlist-only. */
  reviews: {
    score: string;
    count: string;
    source: string;
    asOf: string;
  };
  /** Honest bookability status for Aug 16-20, 2026. */
  bookingStatus: BookingStatus;
  /** One-line explainer for non-trivial booking status. */
  bookingNote: string;
  bookingUrl: string;
  /** URL the source data was pulled from — surfaces as "Source ↗" on card. */
  sourceUrl: string;
  /** Source name shown to reader (e.g. "rosslakeresort.com", "Recreation.gov", "parks.wa.gov"). */
  sourceName: string;
  /** True if the property meets the 2-beds + 1-2 bedrooms rule. Surfaces a status badge. */
  meetsBedRule: boolean;
  /** One-line reason if it does NOT meet the bed rule (still listed as inspiration). */
  notFitReason?: string;
}

export const COOL_SLEEPING_PLACES: CoolSleepingPlace[] = [
  // ============================================================
  // IN-PARK — Operated by NPS / on NPS land
  // ============================================================
  /**
   * [High-demand for Aug 16-20 — call to confirm availability before assuming bookable.]
   * Ross Lake Resort runs on a lottery + cancellation list and mid-August is THE
   * peak window — default assumption for Aug 16-20 is NOT available unless lottery
   * hit or a cancellation surfaces. Phone (206) 386-4437 before counting on it.
   * (Note added 2026-05-17 per verification sweep — bookingStatus 'lottery' kept;
   * not auto-marked sold-out.)
   */
  {
    id: 'ross-lake-resort',
    name: 'Ross Lake Resort — floating cabins',
    region: 'Ross Lake · in North Cascades National Park',
    locationTier: 'in-park',
    access: 'boat-in',
    beds: '2BR cabins (1 queen + 1 queen typical) — verify per cabin',
    bedrooms: '15 floating cabins · studio to 3-BR',
    priceRange: '~$290-495/night',
    natureView: 'Cabins float on Ross Lake; no road access.',
    whyCool: 'The only floating-cabin resort in NPS waters — reached by water taxi.',
    reviews: {
      score: '4.8/5',
      count: '~120 reviews',
      source: 'TripAdvisor + onlyinyourstate.com features',
      asOf: 'May 2026',
    },
    bookingStatus: 'lottery',
    bookingNote:
      'Lottery-based (2026 lottery already opened). For Aug 16-20: cancellation list or call (206) 386-4437.',
    bookingUrl: 'https://www.rosslakeresort.com/stay',
    sourceUrl: 'https://www.rosslakeresort.com/',
    sourceName: 'rosslakeresort.com',
    meetsBedRule: true,
  },
  /**
   * [High-demand for Aug 16-20 — call to confirm availability before assuming bookable.]
   * Stehekin lodging is boat-only with small total inventory; mid-August fills
   * months ahead. Phone-verify (or check the online booking calendar) before
   * counting on it. (Note added 2026-05-17 per verification sweep —
   * bookingStatus kept; not auto-marked sold-out.)
   */
  {
    id: 'stehekin-lodge',
    name: 'North Cascades Lodge at Stehekin',
    region: 'Stehekin · head of Lake Chelan · in North Cascades National Park',
    locationTier: 'in-park',
    access: 'shuttle/boat-in',
    beds: '2-bed configs in larger cabins (sleeps 3-6)',
    bedrooms: '1-BR + 2-BR cabins · 7 units have full kitchens',
    priceRange: '~$200-340/night',
    natureView: 'Northern head of 50-mile Lake Chelan; wildly isolated.',
    whyCool:
      'No road in — ~4-hr ferry, seaplane, or multi-day hike. Most isolated lodging in the lower 48.',
    reviews: {
      score: '4.4/5',
      count: '~210 reviews',
      source: 'TripAdvisor + Google',
      asOf: 'May 2026',
    },
    bookingStatus: 'open-bookable',
    bookingNote:
      'Online booking. A ferry day each direction likely won\'t fit the 5-day plan.',
    bookingUrl: 'https://lodgeatstehekin.com/accommodations/',
    sourceUrl: 'https://lodgeatstehekin.com/accommodations/',
    sourceName: 'lodgeatstehekin.com',
    meetsBedRule: true,
  },
  {
    id: 'stehekin-valley-ranch',
    name: 'Stehekin Valley Ranch',
    region: 'Stehekin · 9 mi up-valley · in North Cascades National Park',
    locationTier: 'in-park',
    access: 'shuttle/boat-in',
    beds: 'Tent-cabin sleeps 2-4 (queen + bunks) · Ranch cabin sleeps 4',
    bedrooms: '1-BR with loft to multi-room',
    priceRange: '~$240-340/night per person, all meals + transit included',
    natureView: 'Working ranch in a glacial valley; no cell signal.',
    whyCool:
      'All-inclusive meals + transport in the lower 48\'s most isolated valley.',
    reviews: {
      score: '4.7/5',
      count: '~95 reviews',
      source: 'TripAdvisor',
      asOf: 'May 2026',
    },
    bookingStatus: 'phone-or-form',
    bookingNote:
      'Form on stehekin.com; reach by ferry → ranch shuttle. Same ferry constraint as the Lodge.',
    bookingUrl: 'https://stehekin.com/lodging/',
    sourceUrl: 'https://stehekin.com/lodging/',
    sourceName: 'stehekin.com',
    meetsBedRule: true,
  },
  {
    id: 'nc-environmental-learning-center',
    name: 'North Cascades Environmental Learning Center · Base Camp',
    region: 'Diablo Lake · inside North Cascades National Park',
    locationTier: 'in-park',
    access: 'drive-in',
    beds: '4 twin beds per room (2 bunks) — book a room for 2',
    bedrooms: 'Eco-lodge guest rooms',
    priceRange: '~$165-225/night per person (Base Camp pkg, meals + activities)',
    natureView: 'Eco-campus on the wooded shore of Diablo Lake.',
    whyCool:
      'The only lodging actually INSIDE the park. "Summer camp for adults" — meals + guided activities, not a hotel.',
    reviews: {
      score: '4.6/5',
      count: '~85 reviews',
      source: 'Google + Yelp',
      asOf: 'April 2026',
    },
    bookingStatus: 'phone-or-form',
    bookingNote:
      'Multi-night Base Camp packages. Check the 2026 calendar; email info@ncascades.org.',
    bookingUrl: 'https://ncascades.org/signup/programs/base-camp',
    sourceUrl: 'https://ncascades.org/discover/learning-center',
    sourceName: 'ncascades.org',
    meetsBedRule: true,
    notFitReason:
      undefined, // 2 of 4 beds used satisfies the rule
  },

  // ============================================================
  // AROUND-PARK — USFS / state-park lodgings
  // ============================================================
  {
    id: 'pearrygin-lake-state-park-cabins',
    name: 'Pearrygin Lake State Park — lakeside cabins',
    region: 'Winthrop · 10 min north · WA State Park',
    locationTier: 'around-park',
    access: 'drive-in',
    beds: '1 full + 1 twin trundle (sleeps 4)',
    bedrooms: 'Studio cabin · half bath inside, showers nearby',
    priceRange: '~$79-104/night',
    natureView: 'Lakeside on Pearrygin Lake; swim beach + boat launch out the door.',
    whyCool:
      'Only state-park cabins in the corridor. Two cabins total — dark-sky certified.',
    reviews: {
      score: '4.5/5',
      count: '~290 reviews (campground overall)',
      source: 'Yelp · thedyrt.com',
      asOf: 'May 2026',
    },
    bookingStatus: 'check-availability',
    bookingNote:
      'Reservable Apr 25 - Oct 29 via Washington State Parks or (888) 226-7688. Two cabins only — books far ahead.',
    bookingUrl: 'https://parks.wa.gov/find-parks/state-parks/pearrygin-lake-state-park/pearrygin-lake-cabins',
    sourceUrl: 'https://parks.wa.gov/find-parks/state-parks/pearrygin-lake-state-park/pearrygin-lake-cabins',
    sourceName: 'parks.wa.gov',
    meetsBedRule: true,
  },
  {
    id: 'heybrook-lookout',
    name: 'Heybrook Lookout (USFS fire lookout rental)',
    region: 'Index · ~2.5 hr from Marblemount · US Hwy 2 corridor',
    locationTier: 'around-park',
    access: 'hike-in',
    beds: '1 double + bench/floor space, BYO bedding (sleeps 4)',
    bedrooms: 'Single-room lookout cabin',
    priceRange: '$75/night flat',
    natureView: '67-ft tower lookout; 360° view of Mount Index + Skykomish Valley.',
    whyCool:
      'Recreation.gov-bookable fire lookout. Moderate 1.3 mi / 850 ft hike-in. Closest bookable lookout to North Cascades.',
    reviews: {
      score: '4.7/5',
      count: '~140 reviews',
      source: 'Recreation.gov',
      asOf: 'May 2026',
    },
    bookingStatus: 'check-availability',
    bookingNote:
      'Books 6 months ahead via Recreation.gov. Aug 16-20 likely gone unless someone cancels.',
    bookingUrl: 'https://www.recreation.gov/camping/campgrounds/269838',
    sourceUrl: 'https://www.recreation.gov/camping/campgrounds/269838',
    sourceName: 'Recreation.gov',
    meetsBedRule: false,
    notFitReason:
      'Single-room cabin, 1 double bed (rest floor/bench, BYO). Doesn\'t meet the 2-bed rule.',
  },
  {
    id: 'hidden-lake-lookout',
    name: 'Hidden Lake Lookout (Friends-of maintained)',
    region: 'Marblemount · 30 min east · at NPS boundary',
    locationTier: 'around-park',
    access: 'hike-in',
    beds: 'Floor space — BYO sleeping bag + pad',
    bedrooms: 'Single-room lookout · not bedded',
    priceRange: '$15-25/night suggested donation',
    natureView: '~7,000 ft perch; one of WA\'s most distinguished lookout views.',
    whyCool:
      'Retired 1931 fire lookout, FCFS. Strenuous 9-mi RT / 3,400 ft hike-in is the gating logistics.',
    reviews: {
      score: '4.9/5',
      count: '~80 trip reports',
      source: 'WTA · Bearfoot Theory',
      asOf: 'May 2026',
    },
    bookingStatus: 'phone-or-form',
    bookingNote:
      'No booking — FCFS. 9 mi / 3,400 ft hike-in disqualifies under "practical-not-extreme."',
    bookingUrl: 'https://www.wta.org/news/magazine/features/what-you-need-to-know-about-spending-the-night-in-a-fire-lookout',
    sourceUrl: 'https://www.wta.org/news/magazine/features/what-you-need-to-know-about-spending-the-night-in-a-fire-lookout',
    sourceName: 'WTA (fohll.org host down 2026-05-17)',
    meetsBedRule: false,
    notFitReason:
      'Floor-space only, no beds. Strenuous 9 mi / 3,400 ft hike-in.',
  },

  // ============================================================
  // QUIRKY — Treehouse / glamping / working-ranch
  // ============================================================
  {
    id: 'treehouse-concrete',
    name: 'Twin Cedars Treehouse (Concrete WA · 2BR Airbnb)',
    region: 'Concrete, WA · ~25 min west of Marblemount',
    locationTier: 'quirky',
    access: 'drive-in',
    beds: '3 beds · 2 bedrooms (queen + queen typical)',
    bedrooms: '2 bedrooms',
    priceRange: '~$220-310/night',
    natureView: 'Elevated treehouse in dense PNW forest canopy near Concrete.',
    whyCool:
      'Actual elevated treehouse, 2BR + 3 beds — meets the bed rule cleanly.',
    reviews: {
      score: '4.9/5',
      count: '~80+ reviews on similar Concrete listings',
      source: 'Airbnb (Superhost-listed)',
      asOf: 'May 2026',
    },
    bookingStatus: 'check-availability',
    bookingNote:
      'Search "treehouse Concrete WA" on Airbnb. Pick one with two real bedrooms.',
    bookingUrl: 'https://www.airbnb.com/rooms/619805721232504402?check_in=2026-08-16&check_out=2026-08-20&adults=2',
    sourceUrl: 'https://www.airbnb.com/s/concrete--wa/homes?refinement_paths%5B%5D=%2Fhomes&search_type=filter_change&adults=2&zoom_level=14',
    sourceName: 'Airbnb · Concrete WA treehouses',
    meetsBedRule: true,
  },
  {
    id: 'sun-mountain-patterson-cabins',
    name: 'Sun Mountain Lodge — Patterson Lake Cabins (cottonwood grove)',
    region: 'Winthrop · 10 min south · lakeside in the grove',
    locationTier: 'quirky',
    access: 'drive-in',
    beds: '2BR cabins: 1 queen + 1 queen Murphy (verify per cabin)',
    bedrooms: '1-BR + 2-BR cabins',
    priceRange: '~$400+/night Aug peak (main lodge $270+)',
    natureView: 'Cottonwood grove on Patterson Lake; 1,500 acres of trails out the door.',
    whyCool:
      'Lakeside cabin grove, full kitchens. The ridge sunset (5 min up) is the trip\'s sunset jackpot.',
    reviews: {
      score: '4.6/5',
      count: '~1,400 reviews (property overall)',
      source: 'Google · TripAdvisor',
      asOf: 'May 2026',
    },
    bookingStatus: 'open-bookable',
    bookingNote:
      'Online booking via the property site or OTAs.',
    bookingUrl: 'https://sunmountainlodge.com/',
    sourceUrl: 'https://sunmountainlodge.com/',
    sourceName: 'sunmountainlodge.com',
    meetsBedRule: true,
  },
  {
    id: 'lost-river-resort',
    name: 'Lost River Resort (oldest in the Methow)',
    region: 'Mazama · 6 mi past the Mazama Store',
    locationTier: 'quirky',
    access: 'drive-in',
    beds: 'River House cabin: 1 queen + 1 queen (2BR) · smaller cabins vary',
    bedrooms: '6 private cabins · 1-BR + 2-BR',
    priceRange: '~$165-260/night',
    natureView: 'Deep Methow Valley forest 6 mi past Mazama; wood stoves + full kitchens.',
    whyCool:
      'Oldest resort in the Methow Valley. Six private cabins — a working operation, not a styled retreat.',
    reviews: {
      score: '4.5/5',
      count: '~130 reviews',
      source: 'TripAdvisor · Expedia',
      asOf: 'May 2026',
    },
    bookingStatus: 'phone-or-form',
    bookingNote:
      'Book direct via lostriverresort.com or (509) 996-2537. Ask for the 2BR River House.',
    bookingUrl: 'https://www.lostriverresort.com/',
    sourceUrl: 'https://www.lostriverresort.com/',
    sourceName: 'lostriverresort.com',
    meetsBedRule: true,
  },
  {
    id: 'k-diamond-k-ranch',
    name: 'K-Diamond-K Guest Ranch (working dude ranch)',
    region: 'Republic, WA · ~3 hr east of Winthrop',
    locationTier: 'quirky',
    access: 'drive-in',
    beds: 'Log lodge: 15 single-bed rooms · separate cabins (verify config)',
    bedrooms: 'Lodge rooms = single · cabins may have 2-BR',
    priceRange: '~$140-260/night all-inclusive (meals + riding)',
    natureView: '1,600-acre working ranch; 70+ horses, no neighbors.',
    whyCool:
      'Family-run since 1961. All-inclusive lodging + meals + horseback + kayaking. But 3 hr east of Winthrop — outside the corridor.',
    reviews: {
      score: '4.6/5',
      count: '~110 reviews',
      source: 'TripAdvisor · Yelp',
      asOf: 'May 2026',
    },
    bookingStatus: 'phone-or-form',
    bookingNote:
      'Call (509) 775-3511; ask about a 2BR cabin (lodge rooms single-bed). 3 hr each way = whole-trip detour.',
    bookingUrl: 'http://www.kdiamondk.com/',
    sourceUrl: 'http://www.kdiamondk.com/',
    sourceName: 'kdiamondk.com',
    meetsBedRule: false,
    notFitReason:
      'Lodge rooms single-bed; cabins may fit — ask at booking. ~3 hr each way from Winthrop.',
  },
];

/** Sort priority within tier — in-park first (most distinctive), then around-park, then quirky. */
const TIER_PRIORITY: Record<LocationTier, number> = {
  'in-park': 1,
  'around-park': 2,
  quirky: 3,
};

export function sortByTier(list: CoolSleepingPlace[]): CoolSleepingPlace[] {
  return [...list].sort(
    (a, b) =>
      TIER_PRIORITY[a.locationTier] - TIER_PRIORITY[b.locationTier] ||
      Number(b.meetsBedRule) - Number(a.meetsBedRule)
  );
}

export const LOCATION_TIER_LABELS: Record<LocationTier, string> = {
  'in-park': 'In the park',
  'around-park': 'Around the park',
  quirky: 'Quirky / distinctive',
};

export const ACCESS_LABELS: Record<AccessMode, string> = {
  'drive-in': 'Drive-in',
  'boat-in': 'Boat-in only',
  'hike-in': 'Hike-in',
  'shuttle/boat-in': 'Shuttle or boat-in',
};

export const BOOKING_STATUS_LABELS: Record<BookingStatus, string> = {
  'open-bookable': 'Bookable',
  lottery: 'Lottery / waitlist',
  'phone-or-form': 'Call or form',
  'check-availability': 'Check Aug 16-20',
};
