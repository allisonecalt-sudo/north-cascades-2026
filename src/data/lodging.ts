/**
 * Lodging — re-ranked on the Terra Nova brief + May 16, 2026 hard rules.
 *
 * Axes (per Allison May 16, 2026):
 *   - Spacious, a little nicer than basic, ~$200-300 per night.
 *   - **2 BEDS REQUIRED.** *"1-2 bedrooms, definitely 2 beds!!!"* Single-bed
 *     studios are NOT a fit — surfaced in "Not a fit" section with the reason.
 *   - **Nature-near is a strong preference.** *"i love staying near nature if
 *     possible so show options."* Lakeside / woods-set / riverside / mountain-
 *     view properties lead each base. Town-center properties get listed but
 *     flagged with the "walkable to dinner, not woods-set" tradeoff.
 *   - Kitchens are a nice-to-have, not the gating criterion.
 *   - Splurge options ($400+) are demoted, not removed.
 *
 * Standing description rule — every card surfaces:
 *   1. Beds (count + type)
 *   2. Bedrooms (count or "Studio")
 *   3. Nature proximity (one line, prominent)
 *   4. Worth-noting extras (kitchen, hot tub, deck, view, atypical features)
 *
 * No "top pick" badges. Reader decides.
 */

export type LodgingVibe =
  | 'cabin'
  | 'lodge'
  | 'bnb'
  | 'rental'
  | 'glamping'
  | 'ranch'
  | 'inn';

/** Loose tier signal — replaces "top pick" without crowning. */
export type LodgingTier =
  | 'fits-brief'
  | 'splurge'
  | 'budget-or-basic'
  | 'not-a-fit'
  | 'note';

/** Nature-proximity tag — drives re-rank within each base. */
export type NatureTag =
  | 'lakeside'
  | 'riverside'
  | 'woods'
  | 'mountain-view'
  | 'ranch-acreage'
  | 'town-center';

export interface LodgingPhoto {
  src: string;
  alt: string;
  credit?: string;
  creditUrl?: string;
  width: number;
  height: number;
}

/**
 * Drive-time entry — minutes + miles from this lodging to a key destination.
 * `destinationId` is one of the canonical DRIVE_DESTINATIONS keys below.
 * Wave 3 (May 17, 2026): mini-Booking.com per-lodging drive matrix.
 */
export interface DriveTime {
  destinationId: DriveDestinationId;
  minutes: number;
  miles: number;
}

/** Canonical drive destinations Erin + Allison care about.
 *  Wave 3 (May 17, 2026) added ross-lake, mt-baker, winthrop-downtown per
 *  Mini-Booking.com agent spec — these are marquee destinations Erin asked
 *  the matrix to cover beyond the previous WA-20-corridor set. */
export type DriveDestinationId =
  | 'cascade-pass'
  | 'maple-pass'
  | 'diablo-lake'
  | 'ross-lake'
  | 'mt-baker'
  | 'washington-pass'
  | 'newhalem'
  | 'sun-mountain'
  | 'winthrop-downtown'
  | 'grocery'
  | 'gas';

export interface DriveDestination {
  id: DriveDestinationId;
  label: string;
  short: string;
}

export const DRIVE_DESTINATIONS: Record<DriveDestinationId, DriveDestination> = {
  'cascade-pass': { id: 'cascade-pass', label: 'Cascade Pass trailhead', short: 'Cascade Pass' },
  'maple-pass': { id: 'maple-pass', label: 'Rainy / Maple Pass trailhead', short: 'Maple Pass' },
  'diablo-lake': { id: 'diablo-lake', label: 'Diablo Lake Overlook', short: 'Diablo Lk' },
  'ross-lake': { id: 'ross-lake', label: 'Ross Lake Overlook (MP 135)', short: 'Ross Lake' },
  'mt-baker': { id: 'mt-baker', label: 'Mt. Baker Heather Meadows / Artist Pt', short: 'Mt. Baker' },
  'washington-pass': { id: 'washington-pass', label: 'Washington Pass Overlook', short: 'WA Pass' },
  newhalem: { id: 'newhalem', label: 'Newhalem Visitor Center', short: 'Newhalem' },
  'sun-mountain': { id: 'sun-mountain', label: 'Sun Mountain Lodge', short: 'Sun Mtn' },
  'winthrop-downtown': { id: 'winthrop-downtown', label: 'Winthrop downtown (boardwalk)', short: 'Winthrop' },
  grocery: { id: 'grocery', label: 'Nearest grocery (QFC/Safeway-equivalent)', short: 'Grocery' },
  gas: { id: 'gas', label: 'Nearest gas station', short: 'Gas' },
};

export type KitchenLevel = 'full' | 'kitchenette' | 'none';

/**
 * Free-cancellation signal per property (Allison May 17, 2026).
 *
 *   - 'yes':     the property's own site or its booking portal explicitly
 *                offers free cancellation (e.g. "Free cancellation up to
 *                7 days before arrival"). REQUIRES a citation in a JSDoc
 *                comment on the entry — do not set without one.
 *   - 'no':      the property's own site explicitly states a non-refundable
 *                or restrictive cancellation policy. REQUIRES a citation.
 *   - 'unknown': we have not verified the policy directly OR the inventory
 *                is aggregator-listed (Airbnb / Booking listing host policy
 *                is per-listing, not site-wide). DEFAULT for every entry
 *                until a research pass fills it in. Renders NO pill —
 *                avoids fake-confidence visual noise.
 *
 * Why this exists: flights + lodging not booked, WA-20 closure unresolved.
 * Allison cannot commit to non-refundable inventory while booking discipline
 * still demands flex. The filter chip lets the reader hard-narrow to known-
 * flexible inventory; cards with `'no'` get a loud red warning pill.
 */
export type FreeCancellation = 'yes' | 'no' | 'unknown';

export const FREE_CANCELLATION_LABELS: Record<FreeCancellation, string> = {
  yes: '✓ Free cancellation',
  no: '🚫 No free cancellation',
  unknown: 'Free cancellation: unknown',
};

/**
 * Aug 16-20, 2026 availability signal — best-effort.
 *
 *   - 'confirmed-aug-16-20': URL + date pre-fill returned a bookable result;
 *     property has real-time inventory and current dates show as available.
 *   - 'likely-available': property has online booking but Aug 16-20 was not
 *     directly date-checked (e.g. Airbnb listings — JS-challenged so we can't
 *     date-pre-fill verify, but the listing itself resolves and is active).
 *   - 'verify-at-booking': no real-time online booking (B&B, small operator,
 *     phone/form only) — caller must confirm at booking time.
 *   - 'sold-out-or-unavailable': date-checked and confirmed unavailable, or
 *     property closed for the window.
 *
 * Pulled May 17, 2026.
 */
export type AvailabilityStatus =
  | 'confirmed-aug-16-20'
  | 'likely-available'
  | 'verify-at-booking'
  | 'sold-out-or-unavailable';

export const AVAILABILITY_LABELS: Record<AvailabilityStatus, string> = {
  'confirmed-aug-16-20': 'Aug 16-20: bookable',
  'likely-available': 'Aug 16-20: likely',
  'verify-at-booking': 'Aug 16-20: verify',
  'sold-out-or-unavailable': 'Aug 16-20: sold out',
};

/**
 * Sunset call-out per property.
 *   - 'yes': specific evidence (review hits, property language, geographic
 *     orientation) that this property is a notable sunset stay. Renders as a
 *     "Sunset" badge + one-line note on the card.
 *   - 'maybe': partial story — open exposure or one review hit, but no
 *     consistent sunset-as-feature framing. Renders as a softer "Sunset:
 *     maybe" note with the caveat.
 *   - 'no' (or field omitted): no sunset exposure worth noting. Nothing
 *     renders on the card.
 *
 * Allison May 16, 2026: *"if place to stay with amazing sunset worth noting."*
 * Tip-the-scale fact — not a ranking axis on its own.
 */
export interface SunsetFlag {
  worth: 'yes' | 'maybe' | 'no';
  note: string;
}

/** Review profile per the May 16 standing rule — score + count + source. */
export interface Reviews {
  /** Score string as shown by the source, e.g. "9.2/10", "4.8/5", "4 stars". */
  score: string;
  /** Review count. Use "N/A" if no current review profile. */
  count: string;
  /** Source name shown to the reader, e.g. "Booking.com", "Airbnb", "Google", "TripAdvisor". */
  source: string;
  /** Optional second source for triangulation. */
  secondScore?: string;
  secondCount?: string;
  secondSource?: string;
  /** "as of YYYY-MM" — pull date so future-Allison knows how stale this is. */
  asOf: string;
  /** Optional one-line "what reviewers call out" — verbatim themes, no spin. */
  highlights?: string;
}

export interface Lodging {
  id: string;
  name: string;
  address: string;
  phone?: string;
  type: string;
  vibe: LodgingVibe;
  pricePerNight: string;
  distance: string;
  /** Beds count + type. e.g. "2 queens" / "1 king + 1 queen" / "1 king (NO second bed — not a fit)". */
  beds: string;
  /** Bedrooms count or "Studio". */
  bedrooms: string;
  /** Nature proximity — one line, prominent. */
  nature: string;
  /** Nature tag — drives within-base sort. */
  natureTag: NatureTag;
  /** "Worth noting" extras — kitchen, hot tub, deck, view, atypical features. */
  extras: string;
  /** Sunset call-out — optional. Only render on card when worth !== 'no'. */
  sunset?: SunsetFlag;
  /** Review profile — REQUIRED per May 16 standing rule. */
  reviews: Reviews;
  /** True if bed count needs confirmation at booking (multi-unit properties). */
  verifyBeds?: boolean;
  /** For "Not a fit" entries — one-line reason (e.g. "Single king only, no second bed"). */
  notFitReason?: string;
  notes: string;
  bookingHint?: string;
  bookingUrl?: string;
  tier: LodgingTier;
  kitchen: KitchenLevel;
  /**
   * Kosher cook-in fit flag (May 17, 2026 verification). When `false`, the
   * property's "kitchen" is actually mini-fridge / microwave / coffee only —
   * not adequate for kosher meal prep across a 4-night stay. Surface this on
   * the lodging card so the reader doesn't book against the brief.
   */
  kosherCookingFit?: boolean;
  /**
   * Free-cancellation signal (May 17, 2026 — Allison's booking-discipline ask).
   * DEFAULT 'unknown' for every entry until a research pass fills it in.
   * Filter chip narrows to `'yes'` only; cards with `'no'` render a red pill.
   * See `FreeCancellation` type above for setting rules.
   */
  freeCancellation?: FreeCancellation;
  /** Aug 16-20, 2026 availability signal — best-effort, May 17 pull. */
  availability: AvailabilityStatus;
  photo: LodgingPhoto;
  /**
   * Wave 3 additions (May 17, 2026):
   *   photos — optional 3-5 supplemental shots (carousel). When present,
   *     a horizontal scroll-snap carousel renders with dots; `photo` field
   *     is the first slide so existing rendering stays backward-compat.
   *   driveTimes — minutes + miles to each canonical destination, computed
   *     once based on lat/lng + Google Maps norms (May 17 spot-checks).
   *   amenities — at-a-glance feature flags for the Booking-style pill row
   *     (laundry / bath count / AC / parking / wifi). All optional — when
   *     omitted the pill is skipped rather than rendered as "unknown" (we
   *     don't want to fake confidence). Pulled May 17 from property pages;
   *     verify-at-booking remains the rule.
   */
  photos?: LodgingPhoto[];
  driveTimes?: DriveTime[];
  amenities?: LodgingAmenities;
}

/**
 * Booking-style amenity flags. All optional — only render a pill when the
 * data is known. `unknown` (string) lets us be explicit about "we checked,
 * the listing didn't say" vs simply not having looked yet.
 */
export interface LodgingAmenities {
  /** In-unit / on-site / shared / none / unknown. */
  laundry?: 'in-unit' | 'on-site' | 'shared' | 'none' | 'unknown';
  /** Number of full bathrooms (1, 1.5, 2, etc.) — string for "1.5". */
  baths?: string;
  /** AC presence — uncommon in PNW summer cabins, surface explicitly. */
  ac?: 'yes' | 'no' | 'unknown';
  /** Free / paid / street / unknown. */
  parking?: 'free' | 'paid' | 'street' | 'unknown';
  /** Wifi tier — strong = reliable for video, basic = email-only, none. */
  wifi?: 'strong' | 'basic' | 'none' | 'unknown';
  /** Pet-friendly flag — Erin asked indirectly in starter doc. */
  pets?: 'yes' | 'no' | 'fee' | 'unknown';
  /** Hot tub — strong tip-the-scale per Allison's brief. */
  hotTub?: boolean;
}

export const KITCHEN_LABELS: Record<KitchenLevel, string> = {
  full: 'Full kitchen',
  kitchenette: 'Kitchenette',
  none: 'No kitchen',
};

export const NATURE_LABELS: Record<NatureTag, string> = {
  lakeside: 'Lakeside',
  riverside: 'Riverside',
  woods: 'Woods-set',
  'mountain-view': 'Mountain-view',
  'ranch-acreage': 'Ranch acreage',
  'town-center': 'Town-center',
};

/** Sort priority — lower = leads. Nature-immersed first, town-center last. */
const NATURE_PRIORITY: Record<NatureTag, number> = {
  lakeside: 1,
  riverside: 2,
  woods: 3,
  'ranch-acreage': 4,
  'mountain-view': 5,
  'town-center': 9,
};

/** Sort a list of lodgings so nature-immersed leads, town-center trails. */
export function sortByNature(list: Lodging[]): Lodging[] {
  return [...list].sort(
    (a, b) => NATURE_PRIORITY[a.natureTag] - NATURE_PRIORITY[b.natureTag]
  );
}

const PHOTOS = {
  cabinWoods: {
    src: 'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?auto=format&fit=crop&w=800&q=70',
    alt: 'Wooden cabin in a forest clearing surrounded by evergreens.',
    credit: 'Photo: Roberto Nickson / Unsplash',
    creditUrl: 'https://unsplash.com/photos/aWBO_xPq1Cg',
    width: 800,
    height: 533,
  },
  cabinRiver: {
    src: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=800&q=70',
    alt: 'Rustic cabin beside a forested river with a wooden deck.',
    credit: 'Photo: Cherise Evertz / Unsplash',
    creditUrl: 'https://unsplash.com/photos/RX2VAhJ9Ll8',
    width: 800,
    height: 533,
  },
  lodgeMountain: {
    src: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=70',
    alt: 'Large timber-frame lodge with mountain backdrop at dusk.',
    credit: 'Photo: Paul Gilmore / Unsplash',
    creditUrl: 'https://unsplash.com/photos/M3WeYrV-yyU',
    width: 800,
    height: 533,
  },
  lodgeRidge: {
    src: 'https://images.unsplash.com/photo-1517320964276-a002fa203177?auto=format&fit=crop&w=800&q=70',
    alt: 'Ridge-top lodge with sweeping valley views.',
    credit: 'Photo: Andre Benz / Unsplash',
    creditUrl: 'https://unsplash.com/photos/ehHaCAyq62E',
    width: 800,
    height: 533,
  },
  bnbCozy: {
    src: 'https://images.unsplash.com/photo-1568084680786-a84f91d1153c?auto=format&fit=crop&w=800&q=70',
    alt: 'Cozy bed-and-breakfast interior with fireplace and pine furniture.',
    credit: 'Photo: Spacejoy / Unsplash',
    creditUrl: 'https://unsplash.com/photos/RUmiI0Z3rino',
    width: 800,
    height: 533,
  },
  innClassic: {
    src: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=800&q=70',
    alt: 'Classic two-story inn with porch and country setting.',
    credit: 'Photo: Marvin Meyer / Unsplash',
    creditUrl: 'https://unsplash.com/photos/SYTO3xs06fU',
    width: 800,
    height: 533,
  },
  rentalModern: {
    src: 'https://images.unsplash.com/photo-1542718610-a1d656d1884c?auto=format&fit=crop&w=800&q=70',
    alt: 'Modern vacation rental with large windows on a wooded property.',
    credit: 'Photo: Andrea Davis / Unsplash',
    creditUrl: 'https://unsplash.com/photos/jJxOnsXyT9o',
    width: 800,
    height: 533,
  },
  rentalAFrame: {
    src: 'https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&w=800&q=70',
    alt: 'A-frame vacation rental tucked into the forest at golden hour.',
    credit: 'Photo: Sterling Davis / Unsplash',
    creditUrl: 'https://unsplash.com/photos/Q3rAQM7yMd0',
    width: 800,
    height: 533,
  },
  glampingHut: {
    src: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=70',
    alt: 'Minimalist modern hut with floor-to-ceiling glass and meadow view.',
    credit: 'Photo: Vincent Guth / Unsplash',
    creditUrl: 'https://unsplash.com/photos/p2TQ-3K7fpw',
    width: 800,
    height: 533,
  },
  ranchProperty: {
    src: 'https://images.unsplash.com/photo-1500076656116-558758c991c1?auto=format&fit=crop&w=800&q=70',
    alt: 'Open ranch property with split-rail fence and mountain backdrop.',
    credit: 'Photo: Adam Bouse / Unsplash',
    creditUrl: 'https://unsplash.com/photos/W4Z6oJZD-yU',
    width: 800,
    height: 533,
  },
  cabinClassic: {
    src: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=800&q=70',
    alt: 'Classic log cabin with stone chimney and front porch in pine forest.',
    credit: 'Photo: Eberhard Grossgasteiger / Unsplash',
    creditUrl: 'https://unsplash.com/photos/PUYIOL_zmBA',
    width: 800,
    height: 533,
  },
  cabinHot: {
    src: 'https://images.unsplash.com/photo-1488462237308-ecaa28b729d7?auto=format&fit=crop&w=800&q=70',
    alt: 'Wood-sided cabin with hot tub on the deck overlooking forest.',
    credit: 'Photo: Mike Marquez / Unsplash',
    creditUrl: 'https://unsplash.com/photos/0_PnY9LSf8E',
    width: 800,
    height: 533,
  },
  motelInn: {
    src: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=70',
    alt: 'Boutique inn with wood siding and welcoming entrance.',
    credit: 'Photo: Unsplash',
    creditUrl: 'https://unsplash.com/photos/6a8506099945',
    width: 800,
    height: 533,
  },
  // Supplemental carousel shots — area / interior / forest texture so each card
  // has 3-5 photos like a Booking.com listing tile. All Unsplash, all
  // PNW/forest/lake/cabin-themed for palette fit.
  carouselDeck: {
    // Replaced 2026-05-17 — previous photo-1520637836862 was 404 on Unsplash (returned HTML error page).
    src: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=800&q=70',
    alt: 'Wooden deck and chairs overlooking pine forest at golden hour.',
    credit: 'Photo: Unsplash',
    creditUrl: 'https://unsplash.com/photos/e29da59ef1c2',
    width: 800,
    height: 533,
  },
  carouselInterior: {
    src: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=70',
    alt: 'Cabin interior with wood beams and warm lighting.',
    credit: 'Photo: Andrea Davis / Unsplash',
    creditUrl: 'https://unsplash.com/photos/V0FfsxYRWWY',
    width: 800,
    height: 533,
  },
  carouselForest: {
    src: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=70',
    alt: 'Dense evergreen forest with shafts of morning light.',
    credit: 'Photo: Sebastian Unrau / Unsplash',
    creditUrl: 'https://unsplash.com/photos/sp-p7uuT0tw',
    width: 800,
    height: 533,
  },
  carouselRiver: {
    src: 'https://images.unsplash.com/photo-1502301103665-0b95cc738daf?auto=format&fit=crop&w=800&q=70',
    alt: 'River winding through forested mountain valley.',
    credit: 'Photo: Robson Hatsukami Morgan / Unsplash',
    creditUrl: 'https://unsplash.com/photos/rfWzS6yWXgo',
    width: 800,
    height: 533,
  },
  carouselFirepit: {
    src: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&w=800&q=70',
    alt: 'Stone firepit with chairs at a wooded campsite.',
    credit: 'Photo: Tegan Mierle / Unsplash',
    creditUrl: 'https://unsplash.com/photos/fDostElVhN8',
    width: 800,
    height: 533,
  },
  carouselSunset: {
    src: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=800&q=70',
    alt: 'Mountain valley at sunset with warm sky over evergreens.',
    credit: 'Photo: Bailey Zindel / Unsplash',
    creditUrl: 'https://unsplash.com/photos/NRQV-hBF10M',
    width: 800,
    height: 533,
  },
  carouselHotTub: {
    src: 'https://images.unsplash.com/photo-1521783988139-89397d761dce?auto=format&fit=crop&w=800&q=70',
    alt: 'Outdoor wooden hot tub on a deck surrounded by trees.',
    credit: 'Photo: Anthony Tran / Unsplash',
    creditUrl: 'https://unsplash.com/photos/9SD6jHd6Stk',
    width: 800,
    height: 533,
  },
  carouselRanch: {
    src: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=70',
    alt: 'Open pasture with mountains in the distance under big sky.',
    credit: 'Photo: Aaron Burden / Unsplash',
    creditUrl: 'https://unsplash.com/photos/eGpTDoFRAW0',
    width: 800,
    height: 533,
  },

  // ====================================================================
  // PROPERTY-AUTHENTIC photos — pulled May 17, 2026 from each property's
  // own marketing site (og:image or hero <img>). These ARE the actual
  // property, not representative. Verified 200 + image bytes > 60KB.
  // ====================================================================
  propFreestone: {
    src: 'https://lirp.cdn-website.com/0107d1ac/dms3rep/multi/opt/freestone-og-1920w.jpg',
    alt: 'Freestone Inn — view from cabin porch across the lawn to the alpine lake and Cascades.',
    credit: 'Photo: Freestone Inn (property site)',
    creditUrl: 'https://www.freestoneinn.com/',
    width: 900,
    height: 472,
  },
  propRiversEdge: {
    src: 'https://media.q4launch.website/uploads/sites/15/2020/10/hero.jpg',
    alt: "River's Edge Resort — private hot tub on the cabin deck overlooking the Chewuch River.",
    credit: "Photo: River's Edge Resort (property site)",
    creditUrl: 'https://riversedgewinthrop.com/',
    width: 900,
    height: 350,
  },
  propMethowRiver: {
    src: 'https://images.ctfassets.net/zfyf8amirbtp/7Ai4QQxX89NkVF6VnTZ5ed/f7d402be479e875b57f4ad2392ec0103/IMG_3406.jpeg?fm=jpg&w=1200&h=630&fit=crop&f=center',
    alt: 'Methow River Lodge — Methow River flowing past riverside cabin grounds in summer.',
    credit: 'Photo: Methow River Lodge (property site)',
    creditUrl: 'https://methowriverlodge.com/',
    width: 900,
    height: 472,
  },
  propChewuch: {
    src: 'https://images.ctfassets.net/zfyf8amirbtp/LKOdEjM91FvZ4HnaeI4WL/368360f899698666dafffcb73b747a90/IMG_1978.jpeg?fm=jpg&w=1200&h=630&fit=crop&f=center',
    alt: 'Chewuch Inn — log dining area set for breakfast with morning light.',
    credit: 'Photo: Chewuch Inn & Cabins (property site)',
    creditUrl: 'https://chewuchinn.com/',
    width: 900,
    height: 472,
  },
  propGlacierPeak: {
    src: 'https://img1.wsimg.com/isteam/ip/cfc68586-fdbe-4cef-8031-1befc7e32d97/IMG_6397-ad92bd7.jpg/:/rs=w:900,h:600,cg:true',
    alt: 'Glacier Peak Resort & Winery — on-site winery building with mountains behind in summer.',
    credit: 'Photo: Glacier Peak Resort & Winery (property site)',
    creditUrl: 'https://glacierpeakresortandwinery.com/',
    width: 900,
    height: 600,
  },
  propOvenellsCabin: {
    src: 'https://www.ovenells-inn.com/wp-content/uploads/2025/04/0071ef_c471687ca27c47098394bb16accfa25bmv2.jpg',
    alt: "Ovenell's Heritage Inn — log cabin entrance with rocking chairs and sun through the trees.",
    credit: "Photo: Ovenell's Heritage Inn (property site)",
    creditUrl: 'https://www.ovenells-inn.com/',
    width: 506,
    height: 419,
  },
  propOvenellsRoad: {
    src: 'https://www.ovenells-inn.com/wp-content/uploads/2025/04/0071ef_12fa21f6cb4845feaa3633303079acf8mv2.jpg',
    alt: "Ovenell's — ranch road through evergreens with golden sunlight at the end.",
    credit: "Photo: Ovenell's Heritage Inn (property site)",
    creditUrl: 'https://www.ovenells-inn.com/',
    width: 506,
    height: 332,
  },
  propSunMountain: {
    // Swapped 2026-05-17 — property hot-link returns 200 to curl but is
    // CORS/referer-blocked in browser. Wikimedia Patterson Lake (the lake
    // Sun Mountain Lodge sits on) is a better stable depiction anyway.
    src: 'https://commons.wikimedia.org/wiki/Special:FilePath/PattersonLake_Winthrop.jpg?width=900',
    alt: 'Patterson Lake near Sun Mountain Lodge, Winthrop — representative.',
    credit: 'Photo: Wikimedia · Representative — Patterson Lake (Sun Mountain Lodge area)',
    creditUrl: 'https://www.sunmountainlodge.com/',
    width: 900,
    height: 600,
  },
  propSpringCreekRanch: {
    src: 'https://springcreekwinthrop.com/wp-content/uploads/2018/02/welcome_01-960x610.jpg',
    alt: 'Spring Creek Ranch — open meadow with the ranch buildings and Methow Valley behind in summer.',
    credit: 'Photo: Spring Creek Ranch (property site)',
    creditUrl: 'https://springcreekwinthrop.com/',
    width: 960,
    height: 610,
  },
  propSpringCreekInterior: {
    // Swapped 2026-05-17 — interior hot-link CORS-blocked. Reusing the same
    // verified Methow River Wikimedia URL the regMethowRiver entry uses.
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Methow_River.JPG/960px-Methow_River.JPG',
    alt: 'Methow River near Spring Creek Ranch — representative (interior hot-link blocked).',
    credit: 'Photo: Wikimedia · Representative — Methow River',
    creditUrl: 'https://springcreekwinthrop.com/',
    width: 960,
    height: 610,
  },
  propBuffaloRun: {
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Buffalo_Run_Restaurant_-_Flickr_-_brewbooks.jpg/960px-Buffalo_Run_Restaurant_-_Flickr_-_brewbooks.jpg',
    alt: 'Buffalo Run Restaurant & Inn — roadside sign in summer with the WA-20 corridor and Cascades behind.',
    credit: 'Photo: brewbooks via Wikimedia Commons (CC BY-SA)',
    creditUrl: 'https://commons.wikimedia.org/wiki/File:Buffalo_Run_Restaurant_-_Flickr_-_brewbooks.jpg',
    width: 900,
    height: 675,
  },

  // ====================================================================
  // REGIONAL CONTEXT photos (Wikimedia Commons) — the actual region the
  // property sits in, not the property itself. Use to fill carousels when
  // the property's own gallery is hard to extract. Alt text + credit are
  // explicit that these are "Representative — [region]" so readers know
  // they are looking at the area, not the room. Pulled May 17, 2026.
  // ====================================================================
  regPattersonLake: {
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/PattersonLake_Winthrop.jpg/960px-PattersonLake_Winthrop.jpg',
    alt: 'Representative — Patterson Lake, Winthrop, WA — alpine lake with wildflowers and rolling Methow hills in summer.',
    credit: 'Photo: Geaugagrrl via Wikimedia Commons',
    creditUrl: 'https://commons.wikimedia.org/wiki/File:PattersonLake_Winthrop.jpg',
    width: 900,
    height: 675,
  },
  regMazama: {
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Mazama%2C_Washington.JPG/960px-Mazama%2C_Washington.JPG',
    alt: 'Representative — Mazama, WA — tall-grass meadow in the Methow Valley with the Cascades behind, summer.',
    credit: 'Photo: Wikimedia Commons (public domain)',
    creditUrl: 'https://commons.wikimedia.org/wiki/File:Mazama,_Washington.JPG',
    width: 900,
    height: 675,
  },
  regMethowRiver: {
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/Methow_River.JPG/960px-Methow_River.JPG',
    alt: 'Representative — Methow River near Mazama — turquoise river flowing through evergreen forest, summer.',
    credit: 'Photo: Benjamin Cody via Wikimedia Commons',
    creditUrl: 'https://commons.wikimedia.org/wiki/File:Methow_River.JPG',
    width: 900,
    height: 675,
  },
  regMethowSunset: {
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Methow_River_near_Pateros_at_sunset.jpg/960px-Methow_River_near_Pateros_at_sunset.jpg',
    alt: 'Representative — Methow River at sunset — orange-and-red sky over the river and Methow hills.',
    credit: 'Photo: Thayne via Wikimedia Commons',
    creditUrl: 'https://commons.wikimedia.org/wiki/File:Methow_River_near_Pateros_at_sunset.jpg',
    width: 900,
    height: 675,
  },
  regWashingtonPass: {
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Washington_pass_overlook.jpg/960px-Washington_pass_overlook.jpg',
    alt: 'Representative — Washington Pass overlook in summer — Liberty Bell Mountain group against clear blue sky.',
    credit: 'Photo: Wikimedia Commons',
    creditUrl: 'https://commons.wikimedia.org/wiki/File:Washington_pass_overlook.jpg',
    width: 900,
    height: 710,
  },
  regDiabloLake: {
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Diablo_Lake_%28Washington_State%29.jpg/960px-Diablo_Lake_%28Washington_State%29.jpg',
    alt: 'Representative — Diablo Lake, WA — turquoise glacial water surrounded by forested ridges in summer.',
    credit: 'Photo: Wikimedia Commons',
    creditUrl: 'https://commons.wikimedia.org/wiki/File:Diablo_Lake_(Washington_State).jpg',
    width: 900,
    height: 598,
  },
  regConcrete: {
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Concrete_town_hall.jpg/960px-Concrete_town_hall.jpg',
    alt: 'Representative — Concrete, WA town hall in summer — green-painted historic building with the US flag flying.',
    credit: 'Photo: Wikimedia Commons',
    creditUrl: 'https://commons.wikimedia.org/wiki/File:Concrete_town_hall.jpg',
    width: 900,
    height: 630,
  },
  regMarblemount: {
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Marblemount_Community_Club.jpg/960px-Marblemount_Community_Club.jpg',
    alt: 'Representative — Marblemount, WA Community Club in summer — small wood-shingle community building set in evergreens.',
    credit: 'Photo: Wikimedia Commons',
    creditUrl: 'https://commons.wikimedia.org/wiki/File:Marblemount_Community_Club.jpg',
    width: 900,
    height: 600,
  },
} as const satisfies Record<string, LodgingPhoto>;

// ====================================================================
// WEST SIDE — Marblemount / Rockport / Concrete
// ====================================================================
export const WEST_LODGING: Lodging[] = [
  // ---- Fits the brief (2 beds confirmed, Terra Nova tier) ----
  {
    id: 'rhody-house',
    name: 'The Rhody House',
    address: 'Marblemount, WA · vacation rental',
    type: 'Two-bedroom cabin vacation rental',
    vibe: 'rental',
    pricePerNight: '$190-260',
    distance: 'Marblemount · ~50 min to Cascade Pass trailhead',
    beds: '1 queen + 1 queen (2 bedrooms)',
    bedrooms: '2-bedroom cabin',
    nature: 'Woods-set, quiet residential lot in Marblemount — not lakeside but tree-shaded.',
    natureTag: 'woods',
    extras: 'Full kitchen, outdoor space, bright open layout. Spacious.',
    reviews: {
      score: '4.9/5',
      count: '~80+ reviews',
      source: 'Airbnb (Superhost-listed Marblemount 2BRs)',
      asOf: 'May 2026',
      highlights: 'Reviewers call out the quiet, the space, the kitchen.',
    },
    verifyBeds: true,
    notes:
      'SOLD OUT for Aug 16-20, 2026 — confirmed by Allison May 19, 2026 (Airbnb showed unavailable). Was: bright two-bedroom cabin rental, well-reviewed.',
    bookingHint: 'Listed on Airbnb — search "Rhody House Marblemount".',
    bookingUrl: 'https://www.airbnb.com/marblemount-wa/stays',
    tier: 'not-a-fit',
    kitchen: 'full',
    freeCancellation: 'unknown',
    availability: 'sold-out-or-unavailable',
    photo: PHOTOS.rentalAFrame,
    photos: [PHOTOS.rentalAFrame, PHOTOS.regMarblemount, PHOTOS.carouselForest, PHOTOS.carouselInterior, PHOTOS.carouselDeck],
    driveTimes: [
      { destinationId: 'cascade-pass', minutes: 50, miles: 23 },
      { destinationId: 'maple-pass', minutes: 75, miles: 38 },
      { destinationId: 'diablo-lake', minutes: 28, miles: 16 },
      { destinationId: 'washington-pass', minutes: 70, miles: 35 },
      { destinationId: 'newhalem', minutes: 18, miles: 8 },
      { destinationId: 'grocery', minutes: 25, miles: 12 },
      { destinationId: 'gas', minutes: 6, miles: 2 },
    ],
  },
  {
    id: 'nc-riverside',
    name: 'North Cascades Riverside Retreat',
    address: 'Concrete, WA · vacation rental',
    type: 'Skagit River cabin with hot tub + firepit',
    vibe: 'rental',
    pricePerNight: '$250-350',
    distance: '~25 min west of Marblemount · ~1 hr 25 min to Cascade Pass',
    beds: '1 king + 1 king + 2 queens (4 beds, 3 bedrooms — sleeps 8)',
    bedrooms: '3-bedroom cabin',
    nature: 'Riverside on the Skagit — water sound, deck overlooks the river.',
    natureTag: 'riverside',
    extras: 'Full kitchen, private hot tub on the deck, firepit, river access. Family-cabin feel.',
    reviews: {
      score: '4.95/5',
      count: '100+ reviews',
      source: 'Airbnb (Guest Favorite tag)',
      asOf: 'May 19, 2026 (verified live)',
      highlights: 'Reviewers call out the deck-on-the-river, the hot tub, the quiet.',
    },
    verifyBeds: false,
    notes:
      'SOLD OUT for Aug 16-20, 2026 — confirmed by Allison May 19, 2026 (Airbnb showed unavailable). Was: strongest "nature-near" pick on west side — riverside Skagit cabin with hot tub on water-facing deck, 3BR/4 beds sleeps 8.',
    bookingUrl: 'https://www.airbnb.com/rooms/1159630003390456641?check_in=2026-08-16&check_out=2026-08-20&adults=2',
    tier: 'not-a-fit',
    kitchen: 'full',
    freeCancellation: 'unknown',
    availability: 'sold-out-or-unavailable',
    photo: PHOTOS.cabinHot,
    // TODO Allison 2026-05-17: Airbnb screenshots — replace these slides.
    photos: [PHOTOS.cabinHot, PHOTOS.regConcrete, PHOTOS.carouselRiver, PHOTOS.carouselDeck, PHOTOS.carouselFirepit],
    driveTimes: [
      { destinationId: 'cascade-pass', minutes: 85, miles: 42 },
      { destinationId: 'maple-pass', minutes: 110, miles: 60 },
      { destinationId: 'diablo-lake', minutes: 55, miles: 32 },
      { destinationId: 'washington-pass', minutes: 105, miles: 56 },
      { destinationId: 'newhalem', minutes: 45, miles: 26 },
      { destinationId: 'grocery', minutes: 10, miles: 5 },
      { destinationId: 'gas', minutes: 8, miles: 3 },
    ],
  },
  {
    id: 'nc-hideaway',
    name: 'North Cascades Hideaway',
    address: 'Concrete, WA · vacation rental',
    type: 'Cabin vacation rental with fenced yard + firepit',
    vibe: 'rental',
    pricePerNight: '$200-280',
    distance: '~25 min west of Marblemount · ~1 hr 25 min to Cascade Pass',
    beds: '1 queen + 1 queen (per recent listing)',
    bedrooms: '2-bedroom cabin',
    nature: 'Woods-set, quiet — front + back decks open to trees, no neighbors visible.',
    natureTag: 'woods',
    extras: 'Full kitchen, front + back decks, firepit, fenced yard. Calm setting.',
    reviews: {
      score: '4.9/5',
      count: '60+ reviews',
      source: 'Airbnb',
      asOf: 'May 2026',
      highlights: 'Reviewers call out the privacy, the firepit evenings, the fenced yard.',
    },
    verifyBeds: true,
    notes:
      'SOLD OUT for Aug 16-20, 2026 — confirmed by Allison May 19, 2026 (Airbnb showed unavailable). Was: 2BR wooded cabin in Concrete with full kitchen + firepit.',
    bookingHint: 'Listed on Airbnb.',
    bookingUrl: 'https://www.airbnb.com/rooms/724602112999024219?check_in=2026-08-16&check_out=2026-08-20&adults=2',
    tier: 'not-a-fit',
    kitchen: 'full',
    freeCancellation: 'unknown',
    availability: 'sold-out-or-unavailable',
    photo: PHOTOS.rentalModern,
    // TODO Allison 2026-05-17: Airbnb screenshots — replace these slides.
    photos: [PHOTOS.rentalModern, PHOTOS.regConcrete, PHOTOS.carouselForest, PHOTOS.carouselFirepit, PHOTOS.carouselInterior],
    driveTimes: [
      { destinationId: 'cascade-pass', minutes: 85, miles: 42 },
      { destinationId: 'maple-pass', minutes: 110, miles: 60 },
      { destinationId: 'diablo-lake', minutes: 55, miles: 32 },
      { destinationId: 'washington-pass', minutes: 105, miles: 56 },
      { destinationId: 'newhalem', minutes: 45, miles: 26 },
      { destinationId: 'grocery', minutes: 10, miles: 5 },
      { destinationId: 'gas', minutes: 8, miles: 3 },
    ],
  },
  {
    id: 'ovenells',
    name: 'Ovenell\'s Heritage Inn & Log Cabins',
    address: '46276 Concrete Sauk Valley Rd, Concrete, WA 98237',
    phone: '(360) 853-8494',
    type: 'Log cabins on a 580-acre cattle ranch — BOOK A CABIN, not a guesthouse room',
    vibe: 'ranch',
    pricePerNight: '$200-330',
    distance: '~25 min west of Marblemount · ~1 hr 25 min to Cascade Pass',
    beds: 'Log cabins: 1 queen + 1 queen (2BR cabins) or 1 king + sofa-sleeper (1BR cabin) — verify per cabin',
    bedrooms: '1-bedroom + 2-bedroom log cabins',
    nature: 'Ranch acreage — 580 acres of pasture, Mt. Baker visible from the property.',
    natureTag: 'ranch-acreage',
    extras: 'Full kitchens in the log cabins, Mt. Baker views, working cattle ranch setting. Distinctive.',
    sunset: {
      worth: 'yes',
      note: 'Open ranch acreage with Mt. Baker to the southwest — multiple reviewers call out the "Million Dollar View" lit at sunset. No tree cover blocks the western sky.',
    },
    reviews: {
      score: '4.7/5',
      count: '~270 reviews',
      source: 'Google',
      secondScore: '4.5/5',
      secondCount: '~95 reviews',
      secondSource: 'TripAdvisor',
      asOf: 'May 2026',
      highlights: 'Reviewers call out the Mt. Baker view at sunset, the ranch animals, the log cabins.',
    },
    verifyBeds: true,
    notes:
      'Working cattle ranch with Mt. Baker views — distinctive setting. **Book a log cabin specifically**, NOT a guesthouse inn room (those are 1 bed only and not a fit). Log cabins have full kitchens.',
    bookingUrl: 'https://www.ovenells-inn.com/',
    tier: 'fits-brief',
    kitchen: 'full',
    // ovenells-inn.com (verified May 17, 2026): "If your travel plans change
    // and you must cancel your reservation, please call us at least (3) days
    // prior to your arrival date to cancel your reservation to receive a
    // refund of your deposit, less a 2% card processing fee." Cancellations
    // within 24 hours forfeit the full reservation. Not strictly free
    // (2% fee always retained; 24-hr window is fully non-refundable).
    freeCancellation: 'no',
    availability: 'verify-at-booking',
    photo: PHOTOS.propOvenellsCabin,
    photos: [PHOTOS.propOvenellsCabin, PHOTOS.propOvenellsRoad, PHOTOS.ranchProperty, PHOTOS.carouselSunset, PHOTOS.carouselRanch],
    driveTimes: [
      { destinationId: 'cascade-pass', minutes: 85, miles: 42 },
      { destinationId: 'maple-pass', minutes: 110, miles: 60 },
      { destinationId: 'diablo-lake', minutes: 55, miles: 32 },
      { destinationId: 'washington-pass', minutes: 105, miles: 56 },
      { destinationId: 'newhalem', minutes: 45, miles: 26 },
      { destinationId: 'grocery', minutes: 8, miles: 4 },
      { destinationId: 'gas', minutes: 6, miles: 2 },
    ],
  },
  {
    id: 'glacier-peak',
    name: 'Glacier Peak Resort & Winery',
    address: '58468 Clark Cabin Rd, Rockport, WA 98283',
    phone: '(360) 708-3005',
    type: 'Cabins · on-site restaurant + winery (formerly Skagit River Resort)',
    vibe: 'cabin',
    pricePerNight: '$150-220',
    distance: '~10 min west of Marblemount · ~1 hr to Cascade Pass',
    beds: '1 queen + 1 sofa-sleeper (most cabins) — verify per cabin type',
    bedrooms: 'Studio + 1-bedroom cabins',
    nature: 'Woods-set among the resort grounds — not riverside despite the name.',
    natureTag: 'woods',
    extras: 'Kitchenettes, sofa beds, smart TVs, free WiFi, on-site restaurant + winery.',
    reviews: {
      score: '4.0/5',
      count: '~329 reviews',
      source: 'Google',
      secondScore: '3.3/5',
      secondCount: '~150 reviews',
      secondSource: 'TripAdvisor',
      asOf: 'May 19, 2026 (verified live)',
      highlights: 'Mixed signal: passes the Google 4.0 floor but TripAdvisor 3.3 is below the floor. New operator (rebranded from Skagit River Resort / Clark\'s Cabins in early 2026); reviews skew across operators. Praised for cinnamon rolls + the winery; flagged for cabin condition + service inconsistency. Verify-before-booking.',
    },
    verifyBeds: true,
    notes:
      'A bit under the Terra Nova price band — fine if you want simple. Most cabins have a queen + sofa-sleeper (2 sleep spots, not 2 separate proper beds — ask which units have two queens). **Below-floor signal:** TripAdvisor 3.3/5 (150 reviews) trips the trip-site review-floor; passes Google 4.0 but barely. (This is the property that operated as Skagit River Resort / Clark\'s Cabins until early 2026 — review history spans operators.)',
    bookingUrl: 'https://glacierpeakresortandwinery.com/',
    tier: 'fits-brief',
    kitchen: 'kitchenette',
    // glacierpeakresortandwinery.com (verified May 17, 2026): "The first day
    // of every unit must be paid to book a reservation & is non refundable."
    // First-night non-refundable means it is NOT free-cancellation.
    freeCancellation: 'no',
    availability: 'verify-at-booking',
    photo: PHOTOS.propGlacierPeak,
    photos: [PHOTOS.propGlacierPeak, PHOTOS.cabinWoods, PHOTOS.carouselForest, PHOTOS.carouselInterior, PHOTOS.cabinClassic],
    driveTimes: [
      { destinationId: 'cascade-pass', minutes: 60, miles: 28 },
      { destinationId: 'maple-pass', minutes: 85, miles: 47 },
      { destinationId: 'diablo-lake', minutes: 35, miles: 21 },
      { destinationId: 'ross-lake', minutes: 50, miles: 32 },
      { destinationId: 'mt-baker', minutes: 105, miles: 60 },
      { destinationId: 'washington-pass', minutes: 80, miles: 43 },
      { destinationId: 'newhalem', minutes: 25, miles: 13 },
      { destinationId: 'winthrop-downtown', minutes: 140, miles: 90 },
      { destinationId: 'grocery', minutes: 18, miles: 9 },
      { destinationId: 'gas', minutes: 12, miles: 5 },
    ],
    amenities: {
      laundry: 'on-site',
      baths: '1',
      ac: 'unknown',
      parking: 'free',
      wifi: 'basic',
      pets: 'fee',
      hotTub: false,
    },
  },

  // ---- Splurge tier ----
  {
    id: 'cascade-river-house',
    name: 'Cascade River House',
    address: 'Cascade River Rd, Marblemount, WA 98267',
    type: 'Whole-house vacation rental on Cascade River',
    vibe: 'rental',
    pricePerNight: '$350-500',
    distance: 'On Cascade River Rd · ~30-45 min to Cascade Pass trailhead',
    beds: '1 king + 1 queen + 1 queen (sleeps 6 — 2-3 actual bedrooms)',
    bedrooms: '3-bedroom riverfront house',
    nature: 'Riverside on the Cascade River — closest rental to the trailhead, deep woods setting.',
    natureTag: 'riverside',
    extras: 'Full kitchen, riverfront, closest rental to Cascade Pass trailhead. Splurge tier.',
    reviews: {
      score: '4.8/5',
      count: '40+ reviews',
      source: 'VRBO / direct',
      asOf: 'May 2026',
      highlights: 'Reviewers call out the river right outside, the privacy, the proximity to the trailhead.',
    },
    verifyBeds: true,
    notes:
      'Riverfront private house — biggest, most-nature-immersed west-side option. Splurge tier ($350-500), listed if you want a step up from Terra Nova-tier. Verify exact bedroom layout at booking — 2BR and 3BR configurations exist. **Naming drift [verified 2026-05-17]:** cascaderiverhouse.com now lists only two units — "vacation home" and "luxury trailer" — dropping the earlier "Bungalow" / "House" branding. The Hospitable booking portal (riverstonerentals.hospitable.rentals) carries the live inventory; confirm at booking which physical unit + kitchen scope you are reserving (owner restructured product names).',
    bookingUrl: 'https://www.cascaderiverhouse.com/',
    tier: 'splurge',
    kitchen: 'full',
    // cascaderiverhouse.com (checked May 17, 2026): no cancellation policy
    // is published on the marketing site. Bookings flow through Hospitable
    // (riverstonerentals.hospitable.rentals) which sets per-listing terms.
    // Left 'unknown' until verified at booking.
    freeCancellation: 'unknown',
    availability: 'verify-at-booking',
    photo: PHOTOS.cabinRiver,
    photos: [PHOTOS.cabinRiver, PHOTOS.regMarblemount, PHOTOS.carouselRiver, PHOTOS.carouselDeck, PHOTOS.carouselInterior],
    driveTimes: [
      { destinationId: 'cascade-pass', minutes: 35, miles: 17 },
      { destinationId: 'maple-pass', minutes: 70, miles: 36 },
      { destinationId: 'diablo-lake', minutes: 22, miles: 12 },
      { destinationId: 'ross-lake', minutes: 35, miles: 22 },
      { destinationId: 'mt-baker', minutes: 130, miles: 75 },
      { destinationId: 'washington-pass', minutes: 65, miles: 32 },
      { destinationId: 'newhalem', minutes: 15, miles: 6 },
      { destinationId: 'winthrop-downtown', minutes: 130, miles: 80 },
      { destinationId: 'grocery', minutes: 30, miles: 14 },
      { destinationId: 'gas', minutes: 10, miles: 4 },
    ],
    amenities: {
      laundry: 'in-unit',
      baths: '2',
      ac: 'no',
      parking: 'free',
      wifi: 'strong',
      pets: 'unknown',
      hotTub: false,
    },
  },

  // ---- Not a fit (no 2nd bed) ----
  {
    id: 'buffalo-run',
    name: 'Buffalo Run Inn',
    address: '60084 WA-20, Marblemount, WA 98267',
    phone: '(360) 873-2103',
    type: 'Historic inn (1889, renovated 2004) — single rooms',
    vibe: 'inn',
    pricePerNight: '$130-180',
    distance: 'WA-20 in Marblemount center · ~55 min to Cascade Pass',
    beds: '1 queen OR 1 king per room (NO second bed)',
    bedrooms: 'Single room',
    nature: 'Town-center on WA-20 — not nature-immersed.',
    natureTag: 'town-center',
    extras: 'Inn-style rooms — no in-room cooking.',
    reviews: {
      score: '3.8/5',
      count: '~160 reviews',
      source: 'Google',
      asOf: 'May 2026',
      highlights: 'Reviewers call out the location, knock the room size + dated decor.',
    },
    notFitReason:
      'Single-bed rooms only — does NOT meet the 2-beds rule. Listed for transparency, not as an option.',
    notes:
      'Cheaper, simpler — but each room has only one bed. **Not a fit for this trip\'s 2-beds requirement.**',
    bookingUrl: 'https://www.buffalorunrestaurant.com/',
    tier: 'not-a-fit',
    kitchen: 'none',
    // No published cancellation policy; not researched (not-a-fit anyway).
    freeCancellation: 'unknown',
    availability: 'verify-at-booking',
    photo: PHOTOS.propBuffaloRun,
    photos: [PHOTOS.propBuffaloRun, PHOTOS.regMarblemount, PHOTOS.innClassic, PHOTOS.carouselInterior, PHOTOS.carouselForest],
    driveTimes: [
      { destinationId: 'cascade-pass', minutes: 55, miles: 25 },
      { destinationId: 'maple-pass', minutes: 80, miles: 42 },
      { destinationId: 'diablo-lake', minutes: 30, miles: 18 },
      { destinationId: 'newhalem', minutes: 20, miles: 9 },
      { destinationId: 'grocery', minutes: 25, miles: 12 },
      { destinationId: 'gas', minutes: 4, miles: 1 },
    ],
  },
  {
    id: 'nc-inn',
    name: 'North Cascades Inn',
    address: '60117 WA-20, Marblemount, WA 98267',
    phone: '(360) 661-8990',
    type: 'Restored historic mountain lodge (rooms)',
    vibe: 'inn',
    pricePerNight: '$135-180',
    distance: 'WA-20 Marblemount center · ~55 min to Cascade Pass',
    beds: '1 queen per room (NO second bed in standard rooms)',
    bedrooms: 'Single room',
    nature: 'Town-center on WA-20 — not nature-immersed.',
    natureTag: 'town-center',
    extras: 'Traditional rooms, no in-room kitchens.',
    reviews: {
      score: '4.0/5',
      count: '~85 reviews',
      source: 'Google',
      asOf: 'May 2026',
      highlights: 'Reviewers call out the historic feel + restoration; rooms small.',
    },
    notFitReason:
      'Single-bed rooms only — does NOT meet the 2-beds rule.',
    notes:
      'Same single-room layout as Buffalo Run. **Not a fit for the 2-beds requirement.**',
    bookingUrl: 'https://www.northcascadesinn.com/',
    tier: 'not-a-fit',
    kitchen: 'none',
    kosherCookingFit: false,
    freeCancellation: 'unknown',
    availability: 'verify-at-booking',
    photo: PHOTOS.motelInn,
    photos: [PHOTOS.motelInn, PHOTOS.regMarblemount, PHOTOS.innClassic, PHOTOS.carouselInterior, PHOTOS.carouselForest],
    driveTimes: [
      { destinationId: 'cascade-pass', minutes: 55, miles: 25 },
      { destinationId: 'maple-pass', minutes: 80, miles: 42 },
      { destinationId: 'diablo-lake', minutes: 30, miles: 18 },
      { destinationId: 'newhalem', minutes: 20, miles: 9 },
      { destinationId: 'grocery', minutes: 25, miles: 12 },
      { destinationId: 'gas', minutes: 4, miles: 1 },
    ],
  },

  // Lodging Owner pass (2026-05-17): Skagit River Resort "status note" card
  // REMOVED — same info is in the Glacier Peak Resort `notes` block above
  // ("This is the property that operated as Skagit River Resort / Clark's
  // Cabins until early 2026"). Don't duplicate.
];

// ====================================================================
// EAST SIDE — Winthrop / Mazama
// ====================================================================
export const EAST_LODGING: Lodging[] = [
  // ---- Fits the brief (2 beds confirmed, Terra Nova tier) ----
  {
    id: 'freestone',
    name: 'Freestone Inn — cabins',
    address: '31 Early Winters Dr, Mazama, WA 98833',
    phone: '(509) 996-3906',
    type: 'Rustic cabins with apartment-sized kitchens — BOOK A 2BR CABIN',
    vibe: 'lodge',
    pricePerNight: '$300+ cabins (Aug peak)',
    distance: '15 mi west of Winthrop · ~25 min to Rainy Pass',
    beds: '2BR cabin: 1 queen + 1 queen · 1BR cabin: 1 king + sofa-sleeper (verify)',
    bedrooms: '1-bedroom + 2-bedroom cabins',
    nature: 'Lakeside on Freestone Lake — woods-set property, lake-front cabins.',
    natureTag: 'lakeside',
    extras: 'Apartment-sized kitchens, pool, hot tub, on-site restaurant. Closest east-side stay to Rainy Pass.',
    sunset: {
      worth: 'maybe',
      note: 'Cabins line a small alpine lake — water-foreground sunset reflections are likely from the lake-front decks, but Mazama sits between 7000+ ft peaks so the sun drops behind the western ridge earlier than the calendar sunset. Ask which cabin numbers face the lake at booking.',
    },
    reviews: {
      score: '4.6/5',
      count: '~520 reviews',
      source: 'Google',
      secondScore: '4.5/5',
      secondCount: '~280 reviews',
      secondSource: 'TripAdvisor',
      asOf: 'May 2026',
      highlights: 'Reviewers call out the lake setting + the restaurant; mixed on cabin upkeep at this price point.',
    },
    verifyBeds: true,
    notes:
      'Strongest east-side "nature-near" pick — actual lakeside, woods-set property. Apartment-sized kitchens. Closest east-side stay to Rainy Pass, which matters on Maple Pass morning. **Book the 2-bedroom cabin** for two real beds. Top of the Terra Nova band.',
    bookingUrl: 'https://www.freestoneinn.com/',
    tier: 'fits-brief',
    kitchen: 'kitchenette',
    // freestoneinn.com/policies (verified May 17, 2026): "To cancel a
    // reservation with no fees, it must be done so 31 days prior to check
    // in date. If a reservation is cancelled within the 30-day window, the
    // card on file will be charged for the entire reservation." 30-day
    // cliff with no partial-refund window = not free-cancellation flex.
    freeCancellation: 'no',
    availability: 'verify-at-booking',
    photo: PHOTOS.propFreestone,
    photos: [PHOTOS.propFreestone, PHOTOS.regMazama, PHOTOS.lodgeMountain, PHOTOS.carouselDeck, PHOTOS.carouselInterior],
    driveTimes: [
      { destinationId: 'cascade-pass', minutes: 130, miles: 80 },
      { destinationId: 'maple-pass', minutes: 25, miles: 14 },
      { destinationId: 'diablo-lake', minutes: 50, miles: 32 },
      { destinationId: 'washington-pass', minutes: 18, miles: 9 },
      { destinationId: 'sun-mountain', minutes: 30, miles: 18 },
      { destinationId: 'grocery', minutes: 18, miles: 11 },
      { destinationId: 'gas', minutes: 16, miles: 9 },
    ],
  },
  {
    id: 'spring-creek-ranch',
    name: 'Spring Creek Ranch',
    address: 'Winthrop, WA 98862',
    type: 'Three private cabins on 60 acres — BOOK Spring Creek Cabin (2BR)',
    vibe: 'ranch',
    pricePerNight: '$220-340',
    distance: 'On the Methow River · ~7 min to downtown · ~45 min to Rainy Pass',
    beds: 'Spring Creek Cabin (2BR log): 1 queen + 1 queen · Owl\'s Nest is a studio (NOT a fit) · Ranch House: 1 king + 1 queen',
    bedrooms: '2-bedroom log cabin (Spring Creek) · 3-bedroom (Ranch House)',
    nature: 'Riverside on the Methow + ranch acreage — alfalfa-field setting, private and quiet.',
    natureTag: 'riverside',
    extras: 'Full kitchens, 60-acre property, river access. Private and quiet.',
    sunset: {
      worth: 'maybe',
      note: 'Open alfalfa-field setting with the Methow Valley to the west — property language calls out porch evenings with deer at golden hour. Not a guaranteed sunset stay (no explicit "sunset view" framing) but unobstructed western sky over the fields.',
    },
    reviews: {
      score: '4.9/5',
      count: '~90 reviews',
      source: 'Google',
      secondScore: '4.95/5',
      secondCount: '~140 reviews',
      secondSource: 'Airbnb',
      asOf: 'May 2026',
      highlights: 'Reviewers call out the privacy, the river, the alfalfa-field setting, the host responsiveness.',
    },
    verifyBeds: true,
    notes:
      '**Book the Spring Creek Cabin (2BR log) or Ranch House — skip Owl\'s Nest (studio, single bed, not a fit).** Riverside alfalfa-field setting. Top of the Terra Nova band.',
    bookingUrl: 'https://springcreekwinthrop.com/lodging/',
    tier: 'fits-brief',
    kitchen: 'full',
    // springcreekwinthrop.com/reservation-policy (verified May 17, 2026):
    // "Cancellations made more than 30 days before the first day of the
    // reservation will be refunded in full minus a $25 processing fee."
    // Within 30 days = no refund. $25 fee always retained on early cancel.
    // Not free-cancellation by any reading.
    freeCancellation: 'no',
    availability: 'verify-at-booking',
    photo: PHOTOS.propSpringCreekRanch,
    photos: [PHOTOS.propSpringCreekRanch, PHOTOS.propSpringCreekInterior, PHOTOS.regMethowRiver, PHOTOS.regMethowSunset, PHOTOS.cabinClassic],
    driveTimes: [
      { destinationId: 'cascade-pass', minutes: 145, miles: 92 },
      { destinationId: 'maple-pass', minutes: 45, miles: 24 },
      { destinationId: 'diablo-lake', minutes: 65, miles: 44 },
      { destinationId: 'ross-lake', minutes: 75, miles: 50 },
      { destinationId: 'mt-baker', minutes: 215, miles: 150 },
      { destinationId: 'washington-pass', minutes: 38, miles: 19 },
      { destinationId: 'sun-mountain', minutes: 12, miles: 5 },
      { destinationId: 'winthrop-downtown', minutes: 6, miles: 2 },
      { destinationId: 'grocery', minutes: 8, miles: 3 },
      { destinationId: 'gas', minutes: 8, miles: 3 },
    ],
    amenities: {
      laundry: 'in-unit',
      baths: '1.5',
      ac: 'yes',
      parking: 'free',
      wifi: 'strong',
      pets: 'yes',
      hotTub: false,
    },
  },
  {
    id: 'rivers-edge',
    name: 'River\'s Edge Resort',
    address: '115 Riverside Ave, Winthrop, WA 98862',
    phone: '(509) 996-8000',
    type: 'Riverside chalets + cottages with private hot tubs',
    vibe: 'cabin',
    pricePerNight: '$210-310',
    distance: 'Downtown Winthrop on the Chewuch River · ~40 min to Rainy Pass',
    beds: 'Chalets: 1 queen + 1 queen (or 1 king + 1 queen) — verify per unit',
    bedrooms: '1-bedroom chalets + 2-bedroom cottages',
    nature: 'Riverside on the Chewuch — downtown-adjacent though, walkable to dinner.',
    natureTag: 'riverside',
    extras: 'Full kitchens, private hot tubs, river access, walkable to Winthrop boardwalk.',
    reviews: {
      score: '4.5/5',
      count: '~340 reviews',
      source: 'Google',
      secondScore: '4.5/5',
      secondCount: '~210 reviews',
      secondSource: 'TripAdvisor',
      asOf: 'May 2026',
      highlights: 'Reviewers call out the hot tubs, the river-deck mornings, walkable downtown.',
    },
    verifyBeds: true,
    notes:
      'Riverside chalets with full kitchens + private hot tubs. Walkable to Winthrop boardwalk — bridges downtown convenience with riverside. Verify 2-bed configuration per chalet at booking.',
    bookingUrl: 'https://riversedgewinthrop.com/',
    tier: 'fits-brief',
    kitchen: 'full',
    // riversedgewinthrop.com/policies (verified May 17, 2026): "penalty-free
    // up to seven (7) days prior to arrival" for short stays 1-7 nights;
    // 30 days for weekends / extended / multi-cabin / holidays. Aug 16-20
    // Sun-Thu = 4 nights short stay = 7-day window. But advance deposits
    // are non-refundable. Mixed — conservative read = 'no' since the user
    // may need to cancel inside the 7-day window for WA-20 reasons and
    // deposits aren't recovered.
    freeCancellation: 'no',
    availability: 'verify-at-booking',
    photo: PHOTOS.propRiversEdge,
    photos: [PHOTOS.propRiversEdge, PHOTOS.regMethowRiver, PHOTOS.cabinHot, PHOTOS.carouselHotTub, PHOTOS.carouselInterior],
    driveTimes: [
      { destinationId: 'cascade-pass', minutes: 140, miles: 88 },
      { destinationId: 'maple-pass', minutes: 40, miles: 22 },
      { destinationId: 'diablo-lake', minutes: 60, miles: 40 },
      { destinationId: 'ross-lake', minutes: 70, miles: 47 },
      { destinationId: 'mt-baker', minutes: 210, miles: 148 },
      { destinationId: 'washington-pass', minutes: 32, miles: 17 },
      { destinationId: 'sun-mountain', minutes: 18, miles: 8 },
      { destinationId: 'winthrop-downtown', minutes: 2, miles: 0 },
      { destinationId: 'grocery', minutes: 3, miles: 1 },
      { destinationId: 'gas', minutes: 3, miles: 1 },
    ],
    amenities: {
      laundry: 'on-site',
      baths: '1',
      ac: 'yes',
      parking: 'free',
      wifi: 'strong',
      pets: 'fee',
      hotTub: true,
    },
  },
  {
    id: 'methow-river',
    name: 'Methow River Lodge & Cabins',
    address: '110 White Ave, Winthrop, WA 98862',
    phone: '(509) 996-4348',
    type: 'Cabins on the Methow River — BOOK A 2-QUEEN CABIN',
    vibe: 'cabin',
    pricePerNight: '$200-250',
    distance: 'Walking distance to Winthrop boardwalk · ~40 min to Rainy Pass',
    beds: 'Riverside cabin: 1 queen + 1 queen (some cabins have 2 queens; lodge rooms are 1 bed — skip those)',
    bedrooms: '1-bedroom cabins',
    nature: 'Riverside on the Methow — walkable to downtown for dinner.',
    natureTag: 'riverside',
    extras: 'Kitchenettes (microwave + fridge + small stove), private decks, river access.',
    reviews: {
      score: '4.6/5',
      count: '~290 reviews',
      source: 'Google',
      secondScore: '4.5/5',
      secondCount: '~180 reviews',
      secondSource: 'TripAdvisor',
      asOf: 'May 2026',
      highlights: 'Reviewers call out the river-facing deck, the location, the friendly owners.',
    },
    verifyBeds: true,
    notes:
      '**Book a cabin with two queens — skip the lodge rooms (single bed, not a fit).** River setting + walkable to Winthrop boardwalk = best-of-both. Lands squarely in the Terra Nova sweet spot.',
    bookingUrl: 'https://methowriverlodge.com/',
    tier: 'fits-brief',
    kitchen: 'kitchenette',
    // methowriverlodge.com (checked May 17, 2026): no published cancellation
    // policy on the marketing site; /policies returns 404. Bookings flow
    // through Frank Hotels' external reservation system which sets per-stay
    // terms. Left 'unknown' until verified at booking or phone-called.
    freeCancellation: 'unknown',
    availability: 'verify-at-booking',
    photo: PHOTOS.propMethowRiver,
    photos: [PHOTOS.propMethowRiver, PHOTOS.regMethowRiver, PHOTOS.cabinRiver, PHOTOS.carouselDeck, PHOTOS.carouselInterior],
    driveTimes: [
      { destinationId: 'cascade-pass', minutes: 140, miles: 88 },
      { destinationId: 'maple-pass', minutes: 40, miles: 22 },
      { destinationId: 'diablo-lake', minutes: 60, miles: 40 },
      { destinationId: 'washington-pass', minutes: 32, miles: 17 },
      { destinationId: 'sun-mountain', minutes: 18, miles: 8 },
      { destinationId: 'grocery', minutes: 3, miles: 1 },
      { destinationId: 'gas', minutes: 3, miles: 1 },
    ],
  },
  {
    id: 'inn-at-mazama',
    name: 'The Inn at Mazama (Mazama Country Inn)',
    address: '15 Country Rd, Mazama, WA 98833',
    phone: '(509) 996-2681',
    type: 'Lodge rooms + nightly cabins — BOOK A CABIN, NOT A LODGE ROOM',
    vibe: 'lodge',
    pricePerNight: '$200-375',
    distance: 'Mazama village · ~30 min to Rainy Pass',
    beds: 'Cabins: 1 queen + 1 queen (verify) · Lodge rooms are typically 1 queen — skip',
    bedrooms: '1-bedroom cabins · lodge rooms (skip)',
    nature: 'Woods-set, mountain-view — Mazama village setting, quiet.',
    natureTag: 'mountain-view',
    extras: 'Pool, hot tub, yoga studio. Some cabins have kitchens.',
    reviews: {
      score: '4.3/5',
      count: '~180 reviews',
      source: 'Google',
      secondScore: '4.0/5',
      secondCount: '~95 reviews',
      secondSource: 'TripAdvisor',
      asOf: 'May 2026',
      highlights: 'Reviewers call out the Mazama quiet + proximity to trails; lodge rooms get more mixed marks than cabins.',
    },
    verifyBeds: true,
    notes:
      '**Book a cabin specifically — confirm 2-bed configuration and kitchen at booking.** Lodge rooms are single-bed and not a fit. Solid Mazama-side option close to Rainy Pass.',
    bookingUrl: 'https://www.innmazama.com/',
    tier: 'fits-brief',
    kitchen: 'kitchenette',
    // innmazama.com/terms-and-conditions (verified May 17, 2026): "FIRST
    // NIGHT IS NON-REFUNDABLE & DUE AT BOOKING." Cancellations 2+ weeks
    // out refund all-but-first-night per room. Inside 2 weeks = full charge.
    // First-night non-refundable = not free-cancellation.
    freeCancellation: 'no',
    availability: 'verify-at-booking',
    photo: PHOTOS.lodgeMountain,
    photos: [PHOTOS.lodgeMountain, PHOTOS.regMazama, PHOTOS.regWashingtonPass, PHOTOS.carouselForest, PHOTOS.carouselInterior],
    driveTimes: [
      { destinationId: 'cascade-pass', minutes: 130, miles: 80 },
      { destinationId: 'maple-pass', minutes: 30, miles: 17 },
      { destinationId: 'diablo-lake', minutes: 52, miles: 34 },
      { destinationId: 'ross-lake', minutes: 62, miles: 41 },
      { destinationId: 'mt-baker', minutes: 200, miles: 140 },
      { destinationId: 'washington-pass', minutes: 22, miles: 11 },
      { destinationId: 'sun-mountain', minutes: 32, miles: 20 },
      { destinationId: 'winthrop-downtown', minutes: 18, miles: 13 },
      { destinationId: 'grocery', minutes: 15, miles: 9 },
      { destinationId: 'gas', minutes: 14, miles: 7 },
    ],
    amenities: {
      laundry: 'on-site',
      baths: '1',
      ac: 'no',
      parking: 'free',
      wifi: 'basic',
      pets: 'no',
      hotTub: true,
    },
  },
  {
    id: 'chewuch',
    name: 'Chewuch Inn & Cabins',
    address: '223 White Ave, Winthrop, WA 98862',
    phone: '(509) 996-3107',
    type: 'B&B inn + 6 cabins — BOOK A CABIN, NOT AN INN ROOM',
    vibe: 'bnb',
    pricePerNight: '$160-260',
    distance: 'Half-mile from downtown Winthrop · ~40 min to Rainy Pass',
    beds: 'Cabins: 1 queen + 1 queen (most) · Inn rooms are 1 queen — skip',
    bedrooms: '1-bedroom cabins · inn rooms (skip)',
    nature: 'Woods-set, half-mile from downtown — quiet residential edge, trees around.',
    natureTag: 'woods',
    extras: 'Cabins have kitchenettes, buffet breakfast at the inn, walkable to boardwalk.',
    sunset: {
      worth: 'maybe',
      note: 'Sits on the "sunny eastern slope" of the valley (per property description) — faces west across the Methow toward the Cascades, so western sky is open. Trees around the cabins limit foreground but the view itself is there. Ask which cabin has the most open western exposure.',
    },
    reviews: {
      score: '4.5/5',
      count: '~210 reviews',
      source: 'Google',
      secondScore: '4.5/5',
      secondCount: '~130 reviews',
      secondSource: 'TripAdvisor',
      asOf: 'May 2026',
      highlights: 'Reviewers call out the breakfast, the host warmth, walkability to town.',
    },
    verifyBeds: true,
    notes:
      '**Book a cabin — inn rooms are single-bed and not a fit.** Cabins with kitchenettes sit in the Terra Nova band. Walkable to the Old-West boardwalk.',
    bookingUrl: 'https://chewuchinn.com/',
    tier: 'fits-brief',
    kitchen: 'kitchenette',
    // May 17 verification: cabin "kitchenettes" are actually mini-fridge +
    // microwave + coffee maker only. Not a fit for kosher cook-in over a
    // 4-night stay.
    kosherCookingFit: false,
    // chewuchinn.com (checked May 17, 2026): ECONNREFUSED on direct fetch.
    // Unable to verify cancellation policy. Left 'unknown'.
    freeCancellation: 'unknown',
    availability: 'verify-at-booking',
    photo: PHOTOS.propChewuch,
    photos: [PHOTOS.propChewuch, PHOTOS.regMethowSunset, PHOTOS.bnbCozy, PHOTOS.carouselForest, PHOTOS.cabinClassic],
    driveTimes: [
      { destinationId: 'cascade-pass', minutes: 145, miles: 92 },
      { destinationId: 'maple-pass', minutes: 45, miles: 24 },
      { destinationId: 'diablo-lake', minutes: 65, miles: 44 },
      { destinationId: 'washington-pass', minutes: 38, miles: 19 },
      { destinationId: 'sun-mountain', minutes: 14, miles: 6 },
      { destinationId: 'grocery', minutes: 4, miles: 1 },
      { destinationId: 'gas', minutes: 4, miles: 1 },
    ],
  },

  // ---- Splurge tier ----
  /**
   * [High-demand for Aug 16-20 — call to confirm availability before assuming bookable.]
   * Sun Mountain's Patterson Lake Cabins are notoriously over-subscribed in
   * mid-August; phone-verify before locking the path. (Note added 2026-05-17 per
   * verification sweep — availability field intentionally left at
   * 'verify-at-booking' rather than auto-marked sold-out.)
   */
  {
    id: 'sun-mountain',
    name: 'Sun Mountain Lodge — Patterson Lake Cabins',
    address: '604 Patterson Lake Rd, Winthrop, WA 98862',
    phone: '(509) 996-2211',
    type: 'Patterson Lake Cabins (full kitchens)',
    vibe: 'lodge',
    pricePerNight: 'Cabins $400+ Aug peak · main lodge $270+',
    distance: '~10 min from Winthrop · ~45 min to Rainy Pass',
    beds: '2BR cabins: 1 queen + 1 queen (verify) · main lodge rooms vary',
    bedrooms: '1-bedroom + 2-bedroom cabins',
    nature: 'Lakeside on Patterson Lake + 1,500 acres of trails — most-nature-immersed east-side option.',
    natureTag: 'lakeside',
    extras: 'Full kitchens, fireplaces, porches, on-site spa + marina + 1,500 acres of trails.',
    sunset: {
      worth: 'yes',
      note: 'Main lodge sits at 3,000 ft on an open ridgetop with 360° Cascade + Methow Valley views — guests and the lodge itself call out sunset from the hot tub + main-lodge patio. Even if you book a Patterson Lake Cabin, the ridge is a 5-min drive up.',
    },
    reviews: {
      score: '4.6/5',
      count: '~1,400 reviews',
      source: 'Google',
      secondScore: '4.5/5',
      secondCount: '~830 reviews',
      secondSource: 'TripAdvisor',
      asOf: 'May 2026',
      highlights: 'Reviewers call out the ridge views, the dining, the spa; some flag price-to-room-condition gap in older main-lodge rooms.',
    },
    verifyBeds: true,
    notes:
      '1,500 acres of trails + spa + lakeside cabins. **Book a 2BR Patterson Lake Cabin.** Splurge tier — listed if you want the resort feel; otherwise Terra Nova-tier picks above match the brief better.',
    bookingUrl: 'https://www.sunmountainlodge.com/',
    tier: 'splurge',
    kitchen: 'full',
    // sunmountainlodge.com/faqs (verified May 17, 2026): "Notice of
    // cancellation must be given 21 days prior to arrival date or the
    // guest is responsible for the entire stay." 21-day cliff. Not free.
    freeCancellation: 'no',
    availability: 'verify-at-booking',
    photo: PHOTOS.regPattersonLake,
    photos: [PHOTOS.regPattersonLake, PHOTOS.propSunMountain, PHOTOS.regMethowSunset, PHOTOS.lodgeRidge, PHOTOS.carouselDeck],
    driveTimes: [
      { destinationId: 'cascade-pass', minutes: 150, miles: 95 },
      { destinationId: 'maple-pass', minutes: 50, miles: 28 },
      { destinationId: 'diablo-lake', minutes: 70, miles: 48 },
      { destinationId: 'ross-lake', minutes: 80, miles: 55 },
      { destinationId: 'mt-baker', minutes: 220, miles: 155 },
      { destinationId: 'washington-pass', minutes: 42, miles: 22 },
      { destinationId: 'sun-mountain', minutes: 0, miles: 0 },
      { destinationId: 'winthrop-downtown', minutes: 14, miles: 6 },
      { destinationId: 'grocery', minutes: 14, miles: 7 },
      { destinationId: 'gas', minutes: 14, miles: 7 },
    ],
    amenities: {
      laundry: 'on-site',
      baths: '2',
      ac: 'yes',
      parking: 'free',
      wifi: 'strong',
      pets: 'fee',
      hotTub: true,
    },
  },

  // ---- Not a fit ----
  {
    id: 'rolling-huts',
    name: 'Rolling Huts',
    address: '18381 WA-20, Winthrop, WA 98862',
    phone: '(509) 996-4442',
    type: 'Modern minimalist huts (glamping) — single sleeping platform',
    vibe: 'glamping',
    pricePerNight: '$145-200',
    distance: '~10 min from Winthrop · ~35 min to Rainy Pass',
    beds: '1 queen platform bed (NO second bed)',
    bedrooms: 'Studio hut',
    nature: 'Mountain-view, meadow setting — open glamping field.',
    natureTag: 'mountain-view',
    extras: 'Tea kettle + mini-fridge + fireplace, no stove. Bathrooms in central barn.',
    reviews: {
      score: '4.4/5',
      count: '~430 reviews',
      source: 'Google',
      secondScore: '4.5/5',
      secondCount: '~210 reviews',
      secondSource: 'TripAdvisor',
      asOf: 'May 2026',
      highlights: 'Reviewers call out the architecture + the mountain-meadow views; flag the barn-bathroom walk.',
    },
    notFitReason:
      'Single platform bed per hut — does NOT meet the 2-beds rule.',
    notes:
      '**Not a fit — each hut has only one queen platform.** Aesthetic is striking but the bed configuration rules it out.',
    bookingUrl: 'https://rollinghuts.com/',
    tier: 'not-a-fit',
    kitchen: 'kitchenette',
    // Not researched (not-a-fit for the brief).
    freeCancellation: 'unknown',
    availability: 'verify-at-booking',
    photo: PHOTOS.glampingHut,
    photos: [PHOTOS.glampingHut, PHOTOS.regMazama, PHOTOS.regMethowSunset, PHOTOS.carouselForest, PHOTOS.carouselSunset],
    driveTimes: [
      { destinationId: 'cascade-pass', minutes: 145, miles: 90 },
      { destinationId: 'maple-pass', minutes: 35, miles: 19 },
      { destinationId: 'diablo-lake', minutes: 60, miles: 42 },
      { destinationId: 'washington-pass', minutes: 26, miles: 14 },
      { destinationId: 'sun-mountain', minutes: 22, miles: 11 },
      { destinationId: 'grocery', minutes: 12, miles: 6 },
      { destinationId: 'gas', minutes: 12, miles: 6 },
    ],
  },
  {
    id: 'rio-vista',
    name: 'Hotel Rio Vista',
    address: '285 Riverside Ave, Winthrop, WA 98862',
    phone: '(509) 996-3535',
    type: 'Boutique riverside hotel — single-bed rooms',
    vibe: 'inn',
    pricePerNight: '$170-260',
    distance: 'Downtown Winthrop · ~40 min to Rainy Pass',
    beds: '1 queen or 1 king per room (NO second bed)',
    bedrooms: 'Single room',
    nature: 'Riverside but downtown — walk-to-dinner location, not woods-set.',
    natureTag: 'town-center',
    extras: 'Riverfront, private balconies, hot tub. No in-room cooking.',
    reviews: {
      score: '4.6/5',
      count: '~480 reviews',
      source: 'Google',
      secondScore: '4.5/5',
      secondCount: '~310 reviews',
      secondSource: 'TripAdvisor',
      asOf: 'May 2026',
      highlights: 'Reviewers call out the balconies + the river + walking-distance dinner.',
    },
    notFitReason:
      'Single-bed rooms only — does NOT meet the 2-beds rule.',
    notes:
      '**Not a fit — single-bed rooms only.** Riverfront and downtown-adjacent, but the bed configuration rules it out.',
    bookingUrl: 'https://hotelriovista.com/',
    tier: 'not-a-fit',
    kitchen: 'none',
    kosherCookingFit: false,
    freeCancellation: 'unknown',
    availability: 'verify-at-booking',
    photo: PHOTOS.motelInn,
    photos: [PHOTOS.motelInn, PHOTOS.regMethowRiver, PHOTOS.regMethowSunset, PHOTOS.carouselRiver, PHOTOS.carouselInterior],
    driveTimes: [
      { destinationId: 'maple-pass', minutes: 40, miles: 22 },
      { destinationId: 'diablo-lake', minutes: 60, miles: 40 },
      { destinationId: 'washington-pass', minutes: 32, miles: 17 },
      { destinationId: 'sun-mountain', minutes: 18, miles: 8 },
      { destinationId: 'grocery', minutes: 3, miles: 1 },
      { destinationId: 'gas', minutes: 3, miles: 1 },
    ],
  },
  {
    id: 'mt-gardner',
    name: 'Mt. Gardner Inn',
    address: '611 WA-20, Winthrop, WA 98862',
    phone: '(509) 996-2000',
    type: 'Mid-tier inn — single-bed rooms',
    vibe: 'inn',
    pricePerNight: '$149-353',
    distance: 'WA-20 south edge of Winthrop · ~40 min to Rainy Pass',
    beds: '1 queen per standard room (NO second bed)',
    bedrooms: 'Single room',
    nature: 'Town-center on WA-20.',
    natureTag: 'town-center',
    extras: 'Reliable, quiet, family-run. No in-room kitchens.',
    reviews: {
      score: '4.5/5',
      count: '~360 reviews',
      source: 'Google',
      asOf: 'May 2026',
      highlights: 'Reviewers call out the family-run feel + value; not as central as boardwalk hotels.',
    },
    notFitReason:
      'Single-bed rooms only — does NOT meet the 2-beds rule.',
    notes:
      '**Not a fit — single-bed rooms only.**',
    bookingUrl: 'https://mtgardnerinn.com/',
    tier: 'not-a-fit',
    kitchen: 'none',
    kosherCookingFit: false,
    freeCancellation: 'unknown',
    availability: 'verify-at-booking',
    photo: PHOTOS.motelInn,
    photos: [PHOTOS.motelInn, PHOTOS.regMazama, PHOTOS.innClassic, PHOTOS.carouselInterior, PHOTOS.carouselForest],
    driveTimes: [
      { destinationId: 'maple-pass', minutes: 42, miles: 23 },
      { destinationId: 'diablo-lake', minutes: 62, miles: 41 },
      { destinationId: 'washington-pass', minutes: 34, miles: 18 },
      { destinationId: 'sun-mountain', minutes: 16, miles: 7 },
      { destinationId: 'grocery', minutes: 4, miles: 2 },
      { destinationId: 'gas', minutes: 3, miles: 1 },
    ],
  },
];

export const VIBE_LABELS: Record<LodgingVibe, string> = {
  cabin: 'Cabins',
  lodge: 'Lodges',
  bnb: 'B&B',
  rental: 'Vacation rentals',
  glamping: 'Glamping',
  ranch: 'Ranch',
  inn: 'Inns',
};

export const TIER_LABELS: Record<LodgingTier, string> = {
  'fits-brief': 'Terra Nova tier',
  splurge: 'Splurge',
  'budget-or-basic': 'Basic / cheaper',
  'not-a-fit': 'Not a fit (under 2 beds)',
  note: 'Status note',
};
