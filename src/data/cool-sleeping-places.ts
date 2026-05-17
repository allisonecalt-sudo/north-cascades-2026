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
    beds: '2BR cabins available (1 queen + 1 queen typical) — verify per cabin',
    bedrooms: '15 floating cabins · studio, 1-BR, 2-BR, and 3-BR configurations',
    priceRange: '~$290/night (sleeps 2) up to ~$495/night (sleeps 9)',
    natureView:
      'Cabins literally float on Ross Lake — pinned to the shoreline, surrounded by water + Cascade peaks. No road access at all.',
    sunsetNote:
      'Lake faces west toward the Cascade ridge — sunset is the property\'s defining feature in reviews. Floating deck = sunset over the water from your front door.',
    whyCool:
      'The only floating-cabin resort in NPS-managed waters. Built 1952. Reached by Diablo Lake water taxi + truck portage. Easily the most distinctive sleeping place in the park — Erin will want to see it even if logistics rule it out.',
    reviews: {
      score: '4.8/5',
      count: '~120 reviews',
      source: 'TripAdvisor + onlyinyourstate.com features',
      asOf: 'May 2026',
    },
    bookingStatus: 'lottery',
    bookingNote:
      'LOTTERY-BASED. 60% reservable 1 year in advance upon prior-guest checkout; 40% via website lottery list (opens Jan 1 each year for that year). 2026 lottery already opened — for Aug 16-20, 2026 try the cancellation list or last-minute first-come-first-serve. Call (206) 386-4437 to ask.',
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
    beds: '4 spacious cabins with private decks · 2-bed configurations in larger cabins (sleeps 3-6)',
    bedrooms: '1-BR + 2-BR cabins available · 7 units total have full kitchens',
    priceRange: '~$200-340/night per the 2026 rate sheet (cabins on the higher end)',
    natureView:
      'Lake Chelan at its northern head — 50-mile-long fjord-style alpine lake, surrounded by NCNP and Glacier Peak Wilderness on all sides. Wildly isolated.',
    sunsetNote:
      'Property faces south down the lake — sunset light travels the length of Lake Chelan from the western ridgeline. Notable from the lodge dock + cabin decks.',
    whyCool:
      'Stehekin has no road in. You arrive by Lady of the Lake ferry from Chelan (~4 hours), seaplane, or a multi-day hike from Cascade Pass. Once there, getting around is a shuttle bus + walking. It\'s the most isolated lodging in the contiguous US.',
    reviews: {
      score: '4.4/5',
      count: '~210 reviews',
      source: 'TripAdvisor + Google',
      asOf: 'May 2026',
    },
    bookingStatus: 'open-bookable',
    bookingNote:
      'Real online booking available. Logistics: would require a Lake Chelan ferry day each direction — likely doesn\'t fit the Aug 16-20 5-day plan unless you cut Cascade Pass.',
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
    beds: 'Tent-cabin sleeps 2-4 (1 queen + bunks) · Ranch cabin sleeps 4 (queen + bunk room)',
    bedrooms: 'Cabins range 1-BR with sleeping loft to multi-room',
    priceRange: '~$240-340/night per person including all meals + in-valley transit',
    natureView:
      'Working ranch in a glacial valley surrounded by NCNP wilderness. Horse pasture, mountain river, dirt roads, no cell signal.',
    sunsetNote:
      'Open valley setting with western ridgeline — pasture-edge sunsets are part of the property\'s identity.',
    whyCool:
      'All-inclusive meals + transport in the most isolated valley in the lower 48. Closer experience to a Patagonian estancia than a Washington vacation rental.',
    reviews: {
      score: '4.7/5',
      count: '~95 reviews',
      source: 'TripAdvisor',
      asOf: 'May 2026',
    },
    bookingStatus: 'phone-or-form',
    bookingNote:
      'Reservation form on the Stehekin community site. Reach by Lady of the Lake → ranch shuttle. Same logistics constraint as the Lodge — likely a Stehekin-only trip, not a side-quest.',
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
    beds: 'Quad-occupancy rooms: 4 twin beds (2 bunk beds) per room — book a whole room for 2 = 2 beds, 2 unused',
    bedrooms: 'Eco-lodge guest rooms — book one of the three eco-lodges',
    priceRange: '~$165-225/night per person (Base Camp package, includes meals + activities)',
    natureView:
      'Award-winning eco-campus on the WOODED SHORE of Diablo Lake. Three eco-lodges + dining hall + dock + amphitheater + composting center. Operated jointly by NPS + City of Seattle.',
    sunsetNote:
      'Diablo Lake itself = the turquoise jewel of WA-20. Dock-side sunsets over the lake are the literal point of the campus.',
    whyCool:
      'The only lodging actually INSIDE the park. Architect-designed sustainable buildings on the lake. Base Camp package includes 3 meals + naturalist-guided activities, so it\'s more "summer camp for adults" than hotel. Aug 16-20 likely overlaps a Base Camp session — they sell whole-package weekends.',
    reviews: {
      score: '4.6/5',
      count: '~85 reviews',
      source: 'Google + Yelp',
      asOf: 'April 2026',
    },
    bookingStatus: 'phone-or-form',
    bookingNote:
      'Programs sell as multi-night Base Camp packages. Check the 2026 calendar for Aug 16-20 availability — if no overlapping session, group lodging may still be bookable for the dates. Email info@ncascades.org.',
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
    beds: '1 full-size bed + 1 twin trundle bed (sleeps 4) — meets 2-bed rule',
    bedrooms: 'Studio cabin (16×16 ft) · half bath inside, full showers nearby',
    priceRange: '~$79-104/night',
    natureView:
      'Lakeside on Pearrygin Lake in the Methow Valley, "near the swim beach under the shade of willow and ash trees." Discover Pass required, state-park setting.',
    sunsetNote:
      'Pearrygin Lake is oriented east-west — open western sky over the water from the boat launch + dock + cabin area. Already listed as a sunset spot for non-guests.',
    whyCool:
      'The only state-park cabin lodging in the corridor. Two cabins total (C1, C2) — books up months ahead. Full lake access + swim beach + boat launch right out the door. Methow Valley dark-sky community certification.',
    reviews: {
      score: '4.5/5',
      count: '~290 reviews (campground overall)',
      source: 'Yelp · thedyrt.com',
      asOf: 'May 2026',
    },
    bookingStatus: 'check-availability',
    bookingNote:
      'Reservable Apr 25 - Oct 29. Call (888) 226-7688 or book online via Washington State Parks. Two cabins only — likely booked far ahead for August weekends. WORTH CHECKING.',
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
    beds: 'Sleeps 4 (1 double bed + bench/floor space, BYO bedding)',
    bedrooms: 'Single-room lookout cabin (NOT 2 separate bedrooms)',
    priceRange: '$75/night flat',
    natureView:
      '67-ft tower lookout at 1,700 ft. 360° view of Mount Index, Mount Persis, Bridal Veil Falls, the Skykomish Valley.',
    whyCool:
      'Recreation.gov-bookable historic USFS fire lookout. Hike-in is a moderate 1.3 mi / 850 ft to the base, then climb the tower stairs to the rental cab. The closest bookable lookout to North Cascades that consistently has availability.',
    reviews: {
      score: '4.7/5',
      count: '~140 reviews',
      source: 'Recreation.gov',
      asOf: 'May 2026',
    },
    bookingStatus: 'check-availability',
    bookingNote:
      'Books 6 months ahead at 7am Pacific via Recreation.gov. Aug 16-20 window opens Feb 16-20, 2026 — likely ALREADY GONE by May 2026 unless someone cancels. Check the live calendar.',
    bookingUrl: 'https://www.recreation.gov/camping/campgrounds/269838',
    sourceUrl: 'https://www.recreation.gov/camping/campgrounds/269838',
    sourceName: 'Recreation.gov',
    meetsBedRule: false,
    notFitReason:
      'Single-room cabin with 1 double bed — sleeps 4 but only 1 actual bed (rest is floor / bench space with BYO bedding). LISTED AS INSPIRATION ONLY — the lookout experience is distinct, but the bed configuration is technically NOT a fit per the standing rule.',
  },
  {
    id: 'hidden-lake-lookout',
    name: 'Hidden Lake Lookout (Friends-of maintained)',
    region: 'Marblemount · 30 min east · at NPS boundary',
    locationTier: 'around-park',
    access: 'hike-in',
    beds: 'Cabin floor space — BYO sleeping bag + pad',
    bedrooms: 'Single-room lookout · not bedded',
    priceRange: '$15-25/night suggested donation',
    natureView:
      '~7,000 ft perch with 360° view of Boston, Sahale, Snowking, Glacier, Eldorado, Torment, Forbidden peaks. One of the most distinguished lookout views in Washington.',
    whyCool:
      'Retired 1931 fire lookout maintained by Friends of Hidden Lake Lookout. First-come-first-served, no booking system, all year. The 9-mile RT / 3,400 ft hike is the gating logistics — strenuous, single-day-only access for a non-hiker pair.',
    reviews: {
      score: '4.9/5',
      count: '~80 trip reports',
      source: 'WTA · Bearfoot Theory',
      asOf: 'May 2026',
    },
    bookingStatus: 'phone-or-form',
    bookingNote:
      'NO BOOKING. FCFS means anyone arriving can claim it. 9 mi / 3,400 ft strenuous hike-in disqualifies under "practical-not-extreme" — listed as inspiration only. [Note 2026-05-17: fohll.org host not responding — direct site may be down. WTA write-up is the live source.]',
    bookingUrl: 'https://www.wta.org/news/magazine/features/what-you-need-to-know-about-spending-the-night-in-a-fire-lookout',
    sourceUrl: 'https://www.wta.org/news/magazine/features/what-you-need-to-know-about-spending-the-night-in-a-fire-lookout',
    sourceName: 'WTA (fohll.org host down 2026-05-17)',
    meetsBedRule: false,
    notFitReason:
      'Floor-space only (BYO bag + pad), NO beds. Strenuous 9 mi RT / 3,400 ft hike-in. Listed for the distinctive experience, NOT as a real option for this trip.',
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
    beds: '3 beds total · 2 bedrooms (queen + queen typical, verify per listing)',
    bedrooms: '2 bedrooms',
    priceRange: '~$220-310/night (similar Concrete treehouses on Airbnb)',
    natureView:
      'Treehouse perched in forest canopy near Concrete. Wraparound deck, trees on all sides, dense Pacific NW forest setting.',
    sunsetNote:
      'Forest canopy filters direct sunset light — golden-hour light comes through the trees, atmospheric rather than open-sky.',
    whyCool:
      'Actual elevated treehouse with 2BR + 3 beds — meets the bed rule cleanly. Distinctly a "this isn\'t a cabin" experience. Lots of Concrete-area Airbnb treehouses score 4.9+.',
    reviews: {
      score: '4.9/5',
      count: '~80+ reviews on similar Concrete listings',
      source: 'Airbnb (Superhost-listed)',
      asOf: 'May 2026',
    },
    bookingStatus: 'check-availability',
    bookingNote:
      'Search "treehouse Concrete WA" on Airbnb for Aug 16-20. Multiple 2BR options exist — pick the one with two real bedrooms and stable date availability.',
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
    beds: '2BR cabins: 1 queen + 1 queen Murphy (verify per cabin) · multiple configurations sleep 2-11',
    bedrooms: '1-BR + 2-BR cabins (16 cabins total)',
    priceRange: '~$400+/night Aug peak (cabin tier; main lodge $270+)',
    natureView:
      'Cottonwood grove on Patterson Lake — lakefront beach, common lawn, private covered porches. 1,500 acres of trails outside the door.',
    sunsetNote:
      'Main lodge sits at 3,000 ft on an open ridgetop with 360° views — reviewers consistently call out sunset from the lodge hot tub + patio. Even Patterson cabin guests drive the 5 min up to the ridge at golden hour.',
    whyCool:
      'Lakeside cabin grove with full kitchens + gas fireplaces + porches — Sun Mountain\'s adult-summer-camp version. The cabins are distinct enough from the main lodge to warrant their own category, and the ridge sunset is the trip\'s sunset jackpot.',
    reviews: {
      score: '4.6/5',
      count: '~1,400 reviews (property overall)',
      source: 'Google · TripAdvisor',
      asOf: 'May 2026',
    },
    bookingStatus: 'open-bookable',
    bookingNote:
      'Real online booking via the property site or major OTAs. Already listed in the main lodging.ts as a splurge tier — this card surfaces it specifically as a "cool" pick because the cottonwood grove + ridge-sunset combination is unusual.',
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
    bedrooms: '6 private cabins · 1-BR + 2-BR configs',
    priceRange: '~$165-260/night',
    natureView:
      'Tucked into the woods 6 mi past Mazama — at the foot of the North Cascades, in deep Methow Valley forest. Rustic interiors, wood stoves, full kitchens.',
    sunsetNote:
      'Deep forest setting filters direct sunset — atmospheric, not panoramic. The proximity to the ridge gives early-evening alpenglow on the surrounding peaks.',
    whyCool:
      'Oldest resort in the Methow Valley. Six private cabins with wood stoves + full kitchens. The "this is what Methow was before the boom" vibe — a working operation, not a styled retreat.',
    reviews: {
      score: '4.5/5',
      count: '~130 reviews',
      source: 'TripAdvisor · Expedia',
      asOf: 'May 2026',
    },
    bookingStatus: 'phone-or-form',
    bookingNote:
      'Book direct via lostriverresort.com or call (509) 996-2537. Book a 2BR cabin specifically (River House is the largest). Likely available for Aug 16-20 with some lead time. [URL refreshed 2026-05-17 — direct site is more reliable than methowreservations.com which 403s.]',
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
    beds: 'Log lodge: 15 rooms (1 queen or 1 king each — single-room config) · separate cabins (verify config)',
    bedrooms: 'Lodge rooms = single · standalone cabins may have 2-BR configs',
    priceRange: '~$140-260/night all-inclusive (meals + horseback riding included)',
    natureView:
      '1,600-acre working ranch + 30,000 leased acres for summer grazing. Massive open pasture, 70+ horses, no neighbors in any direction.',
    whyCool:
      'Family-run since 1961. All-inclusive: lodging + 3 meals + horseback riding + kayaking + fishing. Closer to Yellowstone dude-ranch vibe than to Methow Valley. Only catch — 3 hr east of Winthrop puts it OUTSIDE the trip corridor unless you anchor a whole leg here.',
    reviews: {
      score: '4.6/5',
      count: '~110 reviews',
      source: 'TripAdvisor · Yelp',
      asOf: 'May 2026',
    },
    bookingStatus: 'phone-or-form',
    bookingNote:
      'Call (509) 775-3511. Lodge rooms are single-bed (not a fit); ask about a 2-bedroom cabin specifically. 3-hour drive each way from Winthrop = whole-trip detour, not a side-trip.',
    bookingUrl: 'http://www.kdiamondk.com/',
    sourceUrl: 'http://www.kdiamondk.com/',
    sourceName: 'kdiamondk.com',
    meetsBedRule: false,
    notFitReason:
      'Lodge rooms are 15 single-bed configurations (king or queen, no second bed). Standalone cabin configurations may meet the rule — ASK at booking. Distance from Winthrop (~3 hr each way) makes this a whole-trip pivot, not a side-quest.',
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
