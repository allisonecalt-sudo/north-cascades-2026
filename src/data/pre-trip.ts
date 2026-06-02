/**
 * pre-trip.ts — date-anchored MILESTONE checklist for the booking-week and
 * pre-departure run-up.
 *
 * Rewritten 2026-05-17 PM: replaced the days-out "window" schema with a
 * milestone+subitem schema mirroring the home-page trip-state widget. Each
 * milestone has a hard calendar date (anchored to the trip-state.ts dates so
 * they don't drift), a phase, an action summary, an optional linked-page CTA,
 * and 2-6 concrete subitems Allison can tick off.
 *
 * localStorage state lives under `ncades2026.pretrip.{milestone-id}.{subitem-id}`
 * — one key per subitem so partial progress survives reloads and a future
 * cross-device sync (or a Supabase mirror) can iterate item-by-item.
 *
 * Source of truth for the milestone DATES is `sections/trip-state.ts`. If the
 * Jun 25 WSDOT target slips again, fix it there + here.
 */

/** Milestone phase grouping. Cards stack into these buckets in render order. */
export type Phase =
  | 'booking-week-1' // Lodging + path lock-in (Jun 15)
  | 'booking-week-2' // WSDOT confirm + re-check + flights + rental (Jun 25 – Jul 15)
  | 'two-weeks-out' // Kosher sweep + kitchen confirm (Aug 2)
  | 'final-week' // Last WSDOT call + pack (Aug 14-15)
  | 'day-of'; // Departure (Aug 16)

export const PHASE_TITLE: Record<Phase, string> = {
  'booking-week-1': 'Booking week — lodging lock',
  'booking-week-2': 'Booking week 2 — road, flights, car',
  'two-weeks-out': 'Two weeks out — verify the booked-thing-is-the-real-thing',
  'final-week': 'Final week — last calls + pack',
  'day-of': 'Day-of — departure',
};

export const PHASE_BLURB: Record<Phase, string> = {
  'booking-week-1':
    'Lodging holds the trip together. Lock it first — even before WSDOT confirms, free-cancellation properties stay flexible.',
  'booking-week-2':
    'Once WSDOT confirms WA-20 reopen, you have ~2-3 weeks to walk the rest: re-check stale dates, lock flights, lock the rental.',
  'two-weeks-out':
    'Two weeks before the trip is when assumptions need a phone call. Kosher hours, kitchen scope, anything you treated as static.',
  'final-week':
    'Final WSDOT call + a real pack. Screenshot anything that needs to work offline (road status, day-1 itinerary).',
  'day-of': 'Last morning before you leave for the airport.',
};

export interface Subitem {
  /** Stable id under the milestone. NEVER change once shipped. */
  id: string;
  /** Visible label. Imperative voice — concrete physical action. */
  label: string;
  /** Optional one-line hint (script, contact, address, etc.). */
  hint?: string;
}

export interface MilestoneLink {
  label: string;
  /** Absolute URL or relative .html slug within the site. */
  url: string;
}

export interface Milestone {
  /** Stable id — used as localStorage key prefix. NEVER change once shipped. */
  id: string;
  /** Phase bucket — controls render grouping. */
  phase: Phase;
  /** Short headline. ~5-8 words. */
  title: string;
  /** ISO calendar date (Pacific-time interpretation handled in render). */
  date: string;
  /** Display date — formatted for human eyes. */
  dateLabel: string;
  /** One-sentence action summary surfaced under the title. */
  action: string;
  /** Concrete physical subitems Allison ticks off. 2-6 each. */
  subitems: Subitem[];
  /** Optional linked CTA — sibling site page or external URL. */
  link?: MilestoneLink;
  /** Optional second link (e.g. phone-script + page). */
  secondaryLink?: MilestoneLink;
}

/**
 * 10 milestones. Dates anchored to sections/trip-state.ts. If you change a
 * date here, also update it there (the home widget reads from trip-state.ts).
 */
export const MILESTONES: Milestone[] = [
  // ── Phase 1: booking week ──
  // Order reshuffled 2026-05-18 per Erin's WhatsApp: "I think we should buy
  // flight tickets first and then we can decide on lodging areas/itinerary
  // just bc there's not so many flights to choose from and we don't want
  // them to fill up." Erin's right — SEA summer inventory thins. Flights
  // pulled forward + lodging stays refundable-only until WSDOT confirms.
  {
    id: 'flights-book',
    phase: 'booking-week-1',
    title: 'Flight book-by (FIRST — per Erin)',
    date: '2026-06-01',
    dateLabel: 'Mon Jun 1, 2026',
    action:
      "Book United EWR→SEA nonstop (primary, Allison's travel credit applies — log into united.com first). Alaska EWR→BLI is the fallback if United pricing breaks. Per Erin May 18: flights first — summer inventory is thin and we don't want them filling up. Lodging follows. Book Main Cabin (NOT Basic — Basic gives up voucher coverage).",
    subitems: [
      {
        id: 'morning-vs-midday',
        label: 'Confirm morning vs midday departure with Erin',
        hint: 'Morning = full Day 1 in Seattle / grocery + drive in. Midday = late arrival, hotel near SEA.',
      },
      {
        id: 'book-flights',
        label: 'Book both seats + save confirmation numbers',
      },
      {
        id: 'seat-select',
        label: 'Pick seats — same row if available',
      },
      {
        id: 'tsa-precheck',
        label: 'Confirm TSA PreCheck added to both bookings (KTN)',
      },
      {
        id: 'flights-confirm-erin',
        label: 'Send Erin the confirmation + dates locked',
      },
    ],
    link: { label: 'Flights page', url: 'travel.html' },
  },
  {
    id: 'lodging-book',
    phase: 'booking-week-1',
    title: 'Lodging book-by (REFUNDABLE-ONLY for now)',
    date: '2026-06-15',
    dateLabel: 'Mon Jun 15, 2026',
    action:
      'Book the 2 chosen lodgings on REFUNDABLE-ONLY policies (per Erin: "if we find something refundable we can book it as a backup"). Final lock only after WSDOT confirm Jun 25.',
    subitems: [
      {
        id: 'confirm-path',
        label: 'Confirm the path with Erin (A / B / C / D / E) before booking',
        hint: 'Erin May 18: down for Path B if WA-20 opens, Path A as fallback.',
      },
      {
        id: 'verify-free-cancel',
        label: 'REFUNDABLE-ONLY filter on the lodging page — anything else waits',
        hint: 'Already the new default per Erin\'s backup-booking instinct.',
      },
      {
        id: 'book-property-1',
        label: 'Book property #1 (refundable) + save confirmation number',
        hint: 'Paste the confirmation into the booked-row notes below.',
      },
      {
        id: 'book-property-2',
        label: 'Book property #2 (refundable, if Path B or C) + save confirmation number',
      },
      {
        id: 'photograph-confirmations',
        label: 'Screenshot each booking confirmation (offline backup)',
      },
      {
        id: 'save-kitchen-claim',
        label: 'Save the listing\'s "full kitchen" claim text per property',
        hint: 'For the Aug 2 phone confirmation script.',
      },
    ],
    link: { label: 'Lodging shortlist', url: 'lodging.html' },
  },

  // ── Phase 2: booking week 2 ──
  {
    id: 'wsdot-call',
    phase: 'booking-week-2',
    title: 'WSDOT confirmation call',
    date: '2026-06-25',
    dateLabel: 'Thu Jun 25, 2026',
    action:
      'Call WSDOT 1-800-695-7623 to confirm WA-20 is open through the park (mid-corridor MP 130-156).',
    subitems: [
      {
        id: 'call-wsdot',
        label: 'Call 1-800-695-7623 — ask: "Is WA-20 open between MP 130 and MP 156?"',
      },
      {
        id: 'log-answer',
        label: 'Log the answer (open / partial / closed) + the date confirmed',
      },
      {
        id: 'check-live-page',
        label: 'Cross-check the live WSDOT pass page after the call',
        hint: 'https://wsdot.com/travel/real-time/mountainpasses/north-cascades-highway',
      },
      {
        id: 'switch-plan-if-closed',
        label: 'If STILL closed → switch to Plan B (Path D west-only or Path E east-only via Stevens)',
        hint: 'Walk through the Plan-B path picker on wa20-status.html — picks the swap that keeps both lodgings usable.',
      },
    ],
    link: { label: 'WA-20 deep dive', url: 'wa20-status.html' },
    secondaryLink: { label: 'How-to (Plan B paths)', url: 'wa20-status.html#how-to' },
  },
  {
    id: 'recheck-site',
    phase: 'booking-week-2',
    title: 'Re-check verification dates',
    date: '2026-06-28',
    dateLabel: 'Sun Jun 28, 2026',
    action:
      '3 days post-WSDOT — open the live site, hard-refresh, walk every page that has a "verified-on" date. Flag anything stale.',
    subitems: [
      {
        id: 'recheck-lodging',
        label: 'Lodging: dates, room type, kitchen scope per booked property',
      },
      {
        id: 'recheck-hikes',
        label: 'Hikes: status (open / snow-blocked) for each marquee pick',
      },
      {
        id: 'recheck-restaurants',
        label: 'Restaurants: Va\'ad currency for Pabla, Teapot, QFC U-Village, Einstein UVillage',
      },
      {
        id: 'recheck-road',
        label: 'Road status: WA-20 final answer (matches Jun 25 call?)',
      },
      {
        id: 'recheck-fire',
        label: 'Fire / smoke: AirNow check for Methow Valley',
        hint: 'https://www.airnow.gov/',
      },
    ],
    link: { label: 'WA-20 deep dive', url: 'wa20-status.html' },
  },
  {
    id: 'lodging-firm',
    phase: 'booking-week-2',
    title: 'Lodging — convert refundable to firm (after WSDOT confirms)',
    date: '2026-07-01',
    dateLabel: 'Wed Jul 1, 2026',
    action:
      'WSDOT confirmed Jun 25 → choose: keep the refundable booking AS-IS, or swap to a better (possibly non-refundable) option now that the path is locked.',
    subitems: [
      {
        id: 'decision-keep-vs-swap',
        label: 'Keep refundable picks OR swap to a non-refundable upgrade?',
        hint: 'Non-refundable is often $40-80/night cheaper. Worth it if WSDOT is now firm.',
      },
      {
        id: 'final-lodging-confirm',
        label: 'Send Erin the final lodging confirmations',
      },
      {
        id: 'cancel-refundable-backup',
        label: 'If we swapped: cancel the original refundable hold before policy expires',
      },
    ],
    link: { label: 'Lodging', url: 'lodging.html' },
  },
  {
    id: 'rental-book',
    phase: 'booking-week-2',
    title: 'Rental car book-by',
    date: '2026-07-15',
    dateLabel: 'Wed Jul 15, 2026',
    action:
      'Book Costco Travel SEA pickup, Compact SUV class. Costco bundles taxes + adds 1 free 2nd driver.',
    subitems: [
      {
        id: 'costco-quote-refresh',
        label: 'Re-pull Costco quote (sessions expire — fresh URL each time)',
      },
      {
        id: 'book-rental',
        label: 'Book Compact SUV + save confirmation number',
        hint: 'Costco fulfills via Alamo / Enterprise / Avis / Budget.',
      },
      {
        id: 'second-driver',
        label: 'Add Erin as second driver (Costco = free; record her license #)',
      },
      {
        id: 'cdw-cc',
        label: 'Decide CDW: counter bundle vs credit-card primary (Chase Sapphire / Amex Plat)',
      },
      {
        id: 'pickup-time',
        label: 'Note pickup time aligned to landing + 60 min buffer',
      },
    ],
    link: { label: 'Rental details', url: 'rental.html' },
  },

  // ── Phase 3: two weeks out ──
  {
    id: 'kosher-sweep',
    phase: 'two-weeks-out',
    title: 'Kosher phone-sweep',
    date: '2026-08-02',
    dateLabel: 'Sun Aug 2, 2026',
    action:
      'Call each Va\'ad-listed restaurant + grocery to confirm hours + cert currency. Mark verified-DATE per item.',
    subitems: [
      {
        id: 'pabla',
        label: 'Pabla — confirm Va\'ad cert + Aug hours',
      },
      {
        id: 'teapot',
        label: 'Teapot Vegetarian — confirm Va\'ad cert + Aug hours',
      },
      {
        id: 'qfc-uvillage',
        label: 'QFC University Village — confirm kosher section + meat case currency',
      },
      {
        id: 'einstein-uvillage',
        label: 'Einstein Bros UVillage — (206) 522-1998 — confirm Va\'ad cert current',
      },
      {
        id: 'chabad-whatcom',
        label: 'Chabad of Whatcom County (Bellingham) — confirm contact + any takeout',
      },
      {
        id: 'chabad-seward',
        label: 'Chabad Seward Park (Seattle) — confirm contact + Shabbat hospitality if Fri overlap',
      },
    ],
    link: { label: 'Groceries + restaurants', url: 'food.html' },
  },
  {
    id: 'park-pass',
    phase: 'two-weeks-out',
    title: 'America the Beautiful pass — buy + split',
    date: '2026-08-02',
    dateLabel: 'Sun Aug 2, 2026',
    action:
      'Buy ONE $80 America the Beautiful annual pass (2026 digital). Covers all Forest Service trailheads on this trip (Rainy Pass, Blue Lake, Cutthroat, Park Butte) + any other US National Park for 12 months. Split with Erin = $40/person. Skip the $30 Northwest Forest Pass — AtB does the same job plus everything else.',
    subitems: [
      {
        id: 'buy-pass-recreation-gov',
        label: 'Buy 2026 America the Beautiful annual pass at Recreation.gov ($80)',
        hint: 'https://store.usgs.gov/2026-resident-annual-pass — digital pass, no shipping wait, both travelers can use it together.',
      },
      {
        id: 'save-pass-pdf',
        label: 'Save the digital pass PDF + screenshot to phone (offline-accessible)',
      },
      {
        id: 'splitwise-pass',
        label: 'Add $80 to Splitwise (pass + 50/50 split = $40/person)',
      },
      {
        id: 'check-resident-status',
        label: 'Confirm US-resident status at checkout (nonresident pass is $250, NOT $80)',
        hint: 'Allison is US-resident even while living in Jerusalem — the IRS definition (not the day-by-day where-you-physically-are) governs.',
      },
    ],
    link: { label: 'NPS · North Cascades fees', url: 'https://www.nps.gov/noca/planyourvisit/fees.htm' },
  },
  {
    id: 'kitchen-confirm',
    phase: 'two-weeks-out',
    title: 'Lodging kitchen-scope confirmation',
    date: '2026-08-02',
    dateLabel: 'Sun Aug 2, 2026',
    action:
      'Call each booked property to confirm full-kitchen scope (cookware / oven / fridge / utensils). Multi-unit properties vary by cabin number.',
    subitems: [
      {
        id: 'call-property-1',
        label: 'Call property #1 — run the kitchen script',
        hint: 'Script: "We\'re cooking all meals — what\'s ACTUALLY in the kitchen? Oven? Full fridge? Pots, pans, knives, plates for 2?"',
      },
      {
        id: 'call-property-2',
        label: 'Call property #2 (if Path B or C) — run the kitchen script',
      },
      {
        id: 'log-gaps',
        label: 'Log any gaps (no oven, no real fridge, missing cookware)',
      },
      {
        id: 'pack-fill-gaps',
        label: 'Add any gap-fillers to the pack list (foil pan, sharp knife, etc.)',
      },
    ],
    link: { label: 'Lodging shortlist', url: 'lodging.html' },
  },

  // ── Phase 4: final week ──
  {
    id: 'wsdot-final',
    phase: 'final-week',
    title: 'WSDOT final re-check',
    date: '2026-08-14',
    dateLabel: 'Fri Aug 14, 2026',
    action:
      'Final WSDOT call + NPS road conditions. Print or screenshot for offline access (no cell between Newhalem and Mazama).',
    subitems: [
      {
        id: 'call-wsdot-final',
        label: 'Final call to 1-800-695-7623',
      },
      {
        id: 'check-nps',
        label: 'Check NPS road conditions page (current alerts)',
        hint: 'https://www.nps.gov/noca/planyourvisit/conditions.htm',
      },
      {
        id: 'screenshot-road',
        label: 'Screenshot the road-status page (offline reference)',
      },
      {
        id: 'fire-smoke-final',
        label: 'Final AirNow check for Methow Valley + Mt. Baker area',
      },
    ],
    link: { label: 'WA-20 deep dive', url: 'wa20-status.html' },
  },
  {
    id: 'pack',
    phase: 'final-week',
    title: 'Pack',
    date: '2026-08-14',
    dateLabel: 'Fri Aug 14 – Sat Aug 15, 2026',
    action:
      'Both cooking all meals — kitchen-side packing matters. Plus layered hike gear for 45-50°F pass mornings + 80°F east side.',
    subitems: [
      {
        id: 'cook-supplies',
        label: 'Cook supplies: sharp knife, foil pans, dish soap, dish towel, ziplocs',
        hint: 'Hedge against incomplete cabin kitchens — easier than mid-trip Walmart run.',
      },
      {
        id: 'hike-gear',
        label: 'Hike gear: broken-in shoes, daypack, trekking poles (optional), 2L water',
      },
      {
        id: 'layers',
        label: 'Layers: rain shell, warm mid-layer, hat, gloves, SPF 30+',
      },
      {
        id: 'mosquito-kit',
        label: 'Mosquito kit: DEET or picaridin (Methow + Cascade Pass)',
      },
      {
        id: 'headlamp',
        label: 'Headlamp + spare batteries (sunset ~8:25 PM)',
      },
      {
        id: 'dry-bags',
        label: 'Dry bags (river / lake stops, sudden PNW rain)',
      },
      {
        id: 'n95',
        label: '2-3 N95 / KN95 masks per person (wildfire smoke contingency)',
      },
      {
        id: 'kosher-pantry',
        label: 'Packaged kosher pantry items to bring through US security',
      },
    ],
    link: { label: 'Bring list', url: 'pre-trip.html#bring' },
  },

  // ── Phase 5: day-of ──
  {
    id: 'day-of',
    phase: 'day-of',
    title: 'Day-of departure',
    date: '2026-08-16',
    dateLabel: 'Sun Aug 16, 2026',
    action:
      'Last-morning checks before the airport ride.',
    subitems: [
      {
        id: 'confirm-flight',
        label: 'Confirm flight on time + gate (United app — or Alaska app if fallback was booked)',
      },
      {
        id: 'kosher-snacks',
        label: 'Kosher snacks for the plane + transit',
      },
      {
        id: 'charge-phones',
        label: 'Phones + power banks + headlamp fully charged',
      },
      {
        id: 'offline-maps',
        label: 'Google Maps offline area downloaded (WA-20 corridor + Marblemount + Winthrop)',
      },
      {
        id: 'alltrails-gpx',
        label: 'AllTrails GPX downloaded for each planned hike',
      },
      {
        id: 'screenshot-day1',
        label: 'Screenshot Day-1 itinerary + grocery stop address',
      },
    ],
    link: { label: 'Day-by-day itinerary', url: 'index.html' },
  },
];

/** Trip start — kept here for backwards compat with anything importing it. */
export const TRIP_START_DATE = '2026-08-16';

/** Days between now and trip start. Negative when in-trip or past. */
export function daysUntilTrip(now: Date = new Date()): number {
  const start = new Date(TRIP_START_DATE + 'T00:00:00');
  const diffMs = start.getTime() - now.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

/** Days from now to a milestone date. Pacific-time anchor matches trip-state.ts. */
export function daysUntilDate(isoDate: string, now: Date = new Date()): number {
  const target = new Date(`${isoDate}T00:00:00-07:00`);
  const diffMs = target.getTime() - now.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

/** Total subitem count across all milestones (denominator for progress bar). */
export function totalSubitemCount(): number {
  return MILESTONES.reduce((sum, m) => sum + m.subitems.length, 0);
}
