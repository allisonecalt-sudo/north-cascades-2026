/**
 * Flights — fastest + reasonable schedule first, options below.
 *
 * Per Allison May 16: "fastest + good times" = fewest stopovers + reasonable
 * schedule. Not cheapest-at-all-cost. SEA roundtrip on Alaska still surfaces
 * as the leading option because it's nonstop NYC↔SEA on multiple carriers
 * (Alaska, Delta, JetBlue, United), but the framing is "fewest stops" not
 * "cheapest pick".
 */

export interface FlightOption {
  id: string;
  label: string;
  route: string;
  routeDiagram: string;
  /** Headline tradeoff line under the route diagram. Neutral; no "cheapest" hype. */
  costDelta: string;
  drivingHours: string;
  pros: string[];
  cons: string[];
  /** True if it leads the section. No "Pick" badge — just the order. */
  leading: boolean;
  /** Plain prose note under the leading card (no badge). */
  leadingNote?: string;
  warning?: string;
}

export const FLIGHT_OPTIONS: FlightOption[] = [
  {
    id: 'united-sea-rt',
    label: 'United → SEA roundtrip (RECOMMENDED — Erin May 18)',
    route: 'NYC (EWR/JFK) → SEA → NYC · United',
    routeDiagram: 'NYC ──► SEA ──► NYC  (United)',
    costDelta:
      'Erin May 18 11:07pm: "Yes we could do United. They fly into SEA. That\'s looking much cheaper." Allison has a United travel credit (May 18: "amazing and united ideal! If possible cuz I have this travel credit but not a must"). Refundable preferred when the price gap is reasonable.',
    drivingHours: '~5.5-6 hr nonstop EWR↔SEA · ~2.5 hr drive SEA → Marblemount · ~4 hr Day-5 drive back',
    pros: [
      'Cheapest carrier on this route per Erin\'s May 18 research',
      'Allison\'s United travel credit applies — direct $-off',
      'Nonstop EWR↔SEA on United',
      'Refundable fare class available (typically Economy Flex or Premium) — keeps Path B/A optionality open until WSDOT confirms',
      'Works under every WA-20 contingency',
      'No one-way rental drop fee (SEA roundtrip)',
    ],
    cons: [
      '+2.5 hrs of driving on Day 1 morning to reach Marblemount',
      'Refundable upgrade adds ~$150-300 vs non-refundable on United',
    ],
    leading: true,
    leadingNote:
      'Leading option after the May 18 thread. Both Erin (cheapest) and Allison (travel credit) want United. Refundable add-on keeps booking-discipline alive while WA-20 status is still unresolved.',
  },
  {
    id: 'alaska-bli',
    label: 'Alaska → BLI (faster drive, more expensive)',
    route: 'NYC → SEA → BLI · Alaska',
    routeDiagram: 'NYC ──► SEA ──► BLI  (Alaska)',
    costDelta:
      'Higher fare + adds SEA→BLI feeder hop. Non-refundable unless upgraded — Alaska\'s refundable add-on is significantly steeper than United\'s.',
    drivingHours: '~5.5-6 hr to SEA + ~30 min hop to BLI · ~1 hr drive BLI → Marblemount · ~4 hr drive SEA on return (if open-jaw)',
    pros: [
      'Shortest Day-1 drive (lands ~1 hr from Marblemount — saves 1.5 hrs vs SEA)',
      'Alaska runs the BLI feeder all day; tight reliable connections',
    ],
    cons: [
      'More expensive than United → SEA',
      'Refundable fares add significant cost on Alaska — worse flex-tradeoff than United',
      'BLI lands on the wrong side of the corridor if WA-20 stays closed',
    ],
    leading: false,
  },
  {
    id: 'sea-rt-other',
    label: 'SEA roundtrip on other carriers (Alaska / Delta / JetBlue)',
    route: 'NYC (JFK/EWR) → SEA → NYC',
    routeDiagram: 'NYC ──► SEA ──► NYC',
    costDelta:
      'Cross-shop if the United fare gap doesn\'t hold. Same airport, same ~2.5 hr drive — only the carrier changes.',
    drivingHours: '~5.5-6 hr nonstop · +2.5 hr Day-1 drive to Marblemount · 4 hr Day-5 drive back',
    pros: [
      'Nonstops both ways on Alaska, Delta, JetBlue — schedule flexibility',
      'Hedge if United\'s fare moves before booking',
    ],
    cons: [
      'No travel credit to apply (vs United)',
      'Typically higher base fare on this NYC↔SEA route per Erin\'s research',
    ],
    leading: false,
  },
  {
    id: 'bli-sea',
    label: 'BLI in / SEA out (open-jaw)',
    route: 'NYC → SEA → BLI in; SEA → NYC out',
    routeDiagram: 'NYC ──► SEA ──► BLI  ···  SEA ──► NYC',
    costDelta:
      'Adds ~30 min SEA→BLI hop. Pays the feeder + one-way rental drop fee (~$300-450 combined).',
    drivingHours: '-2 hrs Day 1 (closer to park) · 4-hr drive Day 5',
    pros: [
      'Shortest Day 1 drive (lands close to the park)',
      'No backtracking on WA-20 when the corridor is open',
    ],
    cons: [
      'Adds a stopover on the inbound (no nonstop NYC→BLI)',
      'If WA-20 stays closed, lands on the wrong side of the corridor',
    ],
    leading: false,
  },
  {
    id: 'sea-bli',
    label: 'SEA in / BLI out (reverse open-jaw)',
    route: 'NYC → SEA in; BLI → SEA → NYC out',
    routeDiagram: 'NYC ──► SEA  ···  BLI ──► SEA ──► NYC',
    costDelta: 'Same economics as BLI/SEA but extra stopover on the outbound.',
    drivingHours: 'Drive east → west · ~2 hr SEA backtrack on the return',
    pros: ['Same open-jaw structure as B'],
    cons: [
      'Worse pacing — Cascade Pass on Day 4, Maple Pass on Day 2 (jet-lagged)',
      'Return trip stops over to SEA',
    ],
    leading: false,
  },
  {
    id: 'bli-rt',
    label: 'BLI roundtrip (west-side only)',
    route: 'NYC → SEA → BLI in/out',
    routeDiagram: 'NYC ──► SEA ──► BLI ──► SEA ──► NYC',
    costDelta: 'Two stopovers (BLI feeder both ways). No one-way drop fee.',
    drivingHours: 'West side only · no east-side driving',
    pros: [
      'Pairs naturally with a west-side-only Plan B',
      'Shortest drive days both ends',
    ],
    cons: ['Skips the entire east side (Winthrop, Maple Pass)', 'Stopovers on both ends'],
    leading: false,
  },
  {
    id: 'geg',
    label: 'Spokane (GEG) into east side',
    route: 'NYC → SEA → GEG in; SEA → NYC out',
    routeDiagram: 'NYC ──► SEA ──► GEG  ···  SEA ──► NYC',
    costDelta: 'Stopover both ways + one-way drop fee. Adds significant driving on arrival.',
    drivingHours: 'GEG → Winthrop ~3 hr 45 min, 180 mi · SEA out via Stevens Pass ~4 hr',
    pros: [
      'Lands east of the WA-20 closure — Winthrop guaranteed even if highway stays shut',
    ],
    cons: [
      'Extra ~4 hrs total driving vs SEA RT',
      'No nonstops from JFK/EWR — always 1+ stops',
    ],
    leading: false,
  },
  {
    id: 'pdx',
    label: 'Portland (PDX) southern alternate',
    route: 'NYC → PDX in; SEA → NYC out (or PDX RT)',
    routeDiagram: 'NYC ──► PDX  ···  SEA ──► NYC',
    costDelta: 'Nonstop JFK↔PDX exists (Alaska, Delta, JetBlue, ~6 hr 25 min).',
    drivingHours: 'PDX → Marblemount ~5 hr 15 min via I-5 north. Adds ~3 hrs vs SEA.',
    pros: [
      'Direct JFK↔PDX nonstops — fewer connection-failure risks',
      'Scenic I-5 drive option',
    ],
    cons: ['~3 extra hrs driving vs SEA', 'Only worth it if a fare deal lines up'],
    leading: false,
  },
  {
    id: 'yvr',
    label: 'Vancouver, BC (YVR) northern alternate',
    route: 'NYC → YVR in; SEA → NYC out',
    routeDiagram: 'NYC ──► YVR  ···  SEA ──► NYC',
    costDelta: 'JetBlue runs the only JFK→YVR nonstop (~6 hr 20 min, 4×/week).',
    drivingHours: 'YVR → Marblemount ~2 hr 45 min via Hwy 1 + Sumas border. Add 30-90 min border.',
    pros: ['Lands closest to the park', 'JetBlue JFK→YVR nonstop is a real option'],
    cons: [
      'Border crossing adds unpredictable wait',
      'Cross-border rental rules add friction',
    ],
    leading: false,
    warning:
      'Passport required (US/Canada border). Confirm rental brand allows cross-border drive — many do not, or charge surcharges.',
  },
];

export interface FlightOptionSummary {
  id: string;
  label: string;
  oneLiner: string;
}

export const OTHER_FLIGHT_SUMMARIES: FlightOptionSummary[] = [
  {
    id: 'sea-bli',
    label: 'SEA in / BLI out (reverse open-jaw)',
    oneLiner:
      'Same structure as the standard open-jaw but pacing is worse — Cascade Pass falls on Day 4 instead of Day 2.',
  },
  {
    id: 'bli-rt',
    label: 'BLI roundtrip (west-side only)',
    oneLiner: 'Two BLI feeders. Pairs naturally with a west-side-only Plan B; skips the east side.',
  },
  {
    id: 'geg',
    label: 'GEG (Spokane) into east side',
    oneLiner:
      'Lands east of the closure — Winthrop guaranteed even if WA-20 stays shut. Always +1 stopover; 3:45 drive on arrival.',
  },
  {
    id: 'pdx',
    label: 'PDX (Portland) southern alternate',
    oneLiner: 'Nonstop JFK→PDX exists but adds ~3 hrs of driving north. Only if a deep fare deal appears.',
  },
  {
    id: 'yvr',
    label: 'YVR (Vancouver, BC) northern alternate',
    oneLiner:
      'Closest landing to the park, but border + passport + rental cross-border rules add friction.',
  },
];

/**
 * Airport → Marblemount drive comparison. Surfaced as a quick reference next
 * to the leading card so the SEA vs BLI tradeoff is one glance.
 * (Added 2026-05-19 per Erin May 18 thread.)
 */
export interface AirportDriveCompare {
  airport: string;
  drive: string;
  miles: string;
  note: string;
}

export const AIRPORT_DRIVE_COMPARE: AirportDriveCompare[] = [
  {
    airport: 'SEA → Marblemount',
    drive: '~2 hr 30 min',
    miles: '~110 mi',
    note: 'I-5 N → WA-20 E. Stock kosher pantry at a Seattle Trader Joe\'s / QFC / Whole Foods on the way out.',
  },
  {
    airport: 'BLI → Marblemount',
    drive: '~1 hr 30 min',
    miles: '~85 mi',
    note: 'I-5 S briefly → WA-20 E. Saves 1 hour vs SEA. No major Seattle Va\'ad grocery on this route.',
  },
];

export const AIRPORT_ALTERNATIVES: FlightOptionSummary[] = [
  {
    id: 'gef-short',
    label: 'Spokane (GEG)',
    oneLiner: 'East-side fallback if WA-20 stays closed. 3:45 from Winthrop. Always 1 stop from NYC.',
  },
  {
    id: 'pdx-short',
    label: 'Portland (PDX)',
    oneLiner: 'Has nonstops from JFK on Alaska/Delta. ~5:15 drive to Marblemount. Cheaper sometimes.',
  },
  {
    id: 'yvr-short',
    label: 'Vancouver, BC (YVR)',
    oneLiner: 'Closest landing (~2:45 to Marblemount). Border + passport overhead.',
  },
];

export const FLIGHT_RETURN_OPTIONS = [
  {
    id: 'thu-evening',
    label: 'Thu Aug 20 evening SEA departure',
    note: 'Sleep Winthrop Wed, slow morning, drive Thu, evening flight east. Redeye lands Fri AM. Matches the "back by 7-8 PM, balanced pace" brief.',
    leading: true,
  },
  {
    id: 'thu-redeye',
    label: 'Thu Aug 20 redeye SEA → JFK/EWR',
    note: 'Same as the evening option but lands east coast Fri AM. Useful if connecting onward to TLV Fri evening.',
    leading: false,
  },
  {
    id: 'wed-late',
    label: 'Wed Aug 19 late-night SEA departure',
    note: 'Drive Winthrop → SEA after dinner Wed (~4 hrs). Cuts a day; only if a flight deal forces it.',
    leading: false,
  },
];

export interface BookingTip {
  topic: string;
  detail: string;
}

export const BOOKING_TIPS: BookingTip[] = [
  {
    topic: 'When to book',
    detail:
      'Peak August West-Coast flights: book 8-12 weeks ahead (~late May / early June for Aug 16-20). Long-haul TLV→NYC: book 5-7 months out. Fares stabilize ~6 weeks pre-departure; last-minute peak fares spike hard.',
  },
  {
    topic: 'Fare-alert tools',
    detail:
      'Google Flights (price-tracking graph + email alerts), Hopper (predicts cheaper dates), Going (formerly Scott\'s Cheap Flights). Start monitoring 3-5 months out to learn the typical price band.',
  },
  {
    topic: 'Carriers serving SEA from NYC',
    detail:
      'Alaska, Delta, JetBlue, United all run nonstop JFK↔SEA. Delta + United also run EWR↔SEA. Cross-shopping gives the best chance at a reasonable-time departure.',
  },
  {
    topic: 'Open-jaw pricing',
    detail:
      'Open-jaw (BLI in / SEA out) sometimes prices the same as a roundtrip when booked as a multi-city itinerary. Check both single-airline multi-city AND two separate one-ways before booking.',
  },
  {
    topic: 'Day-of-week strategy',
    detail:
      'For peak-summer SEA, Tuesday and Wednesday departures typically run 10-20% cheaper than Friday/Sunday. Mid-week return is fine — Thu Aug 20 is the target.',
  },
];
