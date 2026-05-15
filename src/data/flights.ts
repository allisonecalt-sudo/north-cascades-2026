export interface FlightOption {
  id: string;
  label: string;
  route: string;
  routeDiagram: string;
  costDelta: string;
  drivingHours: string;
  pros: string[];
  cons: string[];
  recommended: boolean;
  recommendationNote?: string;
  /** Optional warning shown prominently (e.g. passport for YVR). */
  warning?: string;
}

export const FLIGHT_OPTIONS: FlightOption[] = [
  {
    id: 'sea-rt',
    label: 'SEA roundtrip on Alaska Airlines',
    route: 'NYC (JFK/EWR) → SEA → NYC',
    routeDiagram: 'NYC ──► SEA ──► NYC',
    costDelta: 'Cheapest. Saves ~$200-400 on flights + ~$100-250 on one-way drop fee.',
    drivingHours: '~5.5-6 hr nonstop · +2 hr Day-1 drive to Marblemount · 4 hr Day-5 drive back',
    pros: [
      'Fewest stopovers — JFK↔SEA + EWR↔SEA both run nonstop on Alaska, Delta, JetBlue, United',
      'Cheapest routing — skips the BLI feeder both ways',
      'Works under every WA-20 contingency',
      'No one-way rental drop fee',
    ],
    cons: ['+2 hrs of driving on Day 1 morning to reach Marblemount'],
    recommended: true,
    recommendationNote:
      'The pick. Nonstop NYC↔SEA on Alaska is the fewest-stop, most-reliable routing — and it stays the right call under every road-closure contingency.',
  },
  {
    id: 'bli-sea',
    label: 'B. BLI in / SEA out (open-jaw)',
    route: 'NYC → SEA → BLI in; SEA → NYC out',
    routeDiagram: 'NYC ──► SEA ──► BLI  ···  SEA ──► NYC',
    costDelta:
      'Most expensive. Pays SEA→BLI feeder (~$200) + one-way rental drop fee (~$100-250).',
    drivingHours: '-2 hrs Day 1 (closer to park) · 4-hr drive Day 5',
    pros: [
      'Maximizes park time on Day 1 (shortest drive in)',
      'No backtracking on WA-20 when corridor is open',
      'Short ~30 min final feeder SEA→BLI on Alaska',
    ],
    cons: [
      'If WA-20 stays closed, you land on the wrong side of the corridor',
      'Pays the open-jaw premium for a benefit that may not exist',
    ],
    recommended: false,
  },
  {
    id: 'sea-bli',
    label: 'C. SEA in / BLI out (reverse open-jaw)',
    route: 'NYC → SEA in; BLI → SEA → NYC out',
    routeDiagram: 'NYC ──► SEA  ···  BLI ──► SEA ──► NYC',
    costDelta: 'Roughly same as B.',
    drivingHours: 'Drive east → west · ~2 hr SEA backtrack on the return',
    pros: ['Same open-jaw economics as B'],
    cons: [
      'Worse pacing — Cascade Pass on Day 4, Maple Pass on Day 2 (jet-lagged)',
      'Return trip backtracks 2 hrs to SEA',
    ],
    recommended: false,
  },
  {
    id: 'bli-rt',
    label: 'D. BLI roundtrip (west-side only)',
    route: 'NYC → SEA → BLI in/out',
    routeDiagram: 'NYC ──► SEA ──► BLI ──► SEA ──► NYC',
    costDelta: 'Mid — pays BLI feeders both ways but skips the one-way drop fee.',
    drivingHours: 'West side only · no east-side driving',
    pros: [
      'Pairs naturally with a west-side-only contingency (Cascade Pass + Park Butte + Artist Point)',
      'Shortest drive days both ends',
    ],
    cons: [
      'Skips the entire east side (Winthrop, Maple Pass) — only good as a Plan B',
      'Two feeder legs adds cost vs SEA roundtrip',
    ],
    recommended: false,
  },
  {
    id: 'geg',
    label: 'E. Spokane (GEG) into east side',
    route: 'NYC → SEA → GEG in; SEA → NYC out',
    routeDiagram: 'NYC ──► SEA ──► GEG  ···  SEA ──► NYC',
    costDelta:
      'Adds ~$250-400 vs SEA RT — extra feeder leg + one-way drop fee. Alaska runs ~14-15 daily SEA↔GEG.',
    drivingHours: 'GEG → Winthrop ~3 hr 45 min, 180 mi · SEA out via Stevens Pass ~4 hr',
    pros: [
      'Lands you east of the WA-20 closure — Winthrop / Maple Pass guaranteed even if the highway stays shut',
      'Backup if SEA → BLI feeder availability tightens',
    ],
    cons: [
      'Extra 4 hrs driving total vs SEA RT (3:45 in + extra distance back to SEA)',
      'No nonstops from JFK/EWR — always connects through SEA, MSP, or DEN',
      'Most expensive of the five routings',
    ],
    recommended: false,
  },
  {
    id: 'pdx',
    label: 'F. Portland (PDX) southern alternate',
    route: 'NYC → PDX in; SEA → NYC out (or PDX RT)',
    routeDiagram: 'NYC ──► PDX  ···  SEA ──► NYC',
    costDelta:
      'Often cheaper than SEA RT — Alaska + Delta + JetBlue all run JFK↔PDX nonstops (~6 hr 25 min). Round-trips from ~$317.',
    drivingHours: 'PDX → Marblemount ~5 hr 15 min via I-5 north. Adds ~3 hrs vs SEA.',
    pros: [
      'Direct JFK↔PDX nonstops on Alaska/Delta = fewer connection-failure risks',
      'Often the cheapest west-coast fare from JFK',
      'Scenic I-5 drive — option to stop in Seattle on the way',
    ],
    cons: [
      'Big driving hit — ~3 extra hrs vs SEA',
      'Only worthwhile if a fare alert flags a deep PDX deal',
    ],
    recommended: false,
  },
  {
    id: 'yvr',
    label: 'G. Vancouver, BC (YVR) northern alternate',
    route: 'NYC → YVR in; SEA → NYC out',
    routeDiagram: 'NYC ──► YVR  ···  SEA ──► NYC',
    costDelta:
      'Variable. JetBlue runs the only JFK→YVR nonstop (~6 hr 20 min, 4×/week). Connections via SEA on Alaska. Often cheaper than BLI feeders.',
    drivingHours:
      'YVR → Marblemount ~2 hr 45 min via Hwy 1 + border at Sumas. Add 30-90 min for border depending on the line.',
    pros: [
      'Lands closest to the park of any option (~2:45 to Marblemount vs SEA’s 2 hr)',
      'JetBlue JFK→YVR nonstop is a real option',
      'Border crossing at Sumas is usually one of the calmer ones',
    ],
    cons: [
      'Border crossing adds unpredictable wait (30-90 min in summer)',
      'Need passport ready + accept the rental-car border-crossing surcharge if doing one-way',
      'Cross-border one-way rental drops are limited; usually need to return YVR car at YVR and rent again in WA',
    ],
    recommended: false,
    warning:
      'Passport required (US/Canada border). Confirm rental brand allows cross-border drive — many do not, or charge surcharges.',
  },
];

/**
 * Compact one-line summaries of every non-primary routing.
 * Used inside a collapsed "Other flight options" expander on the site.
 */
export interface FlightOptionSummary {
  id: string;
  label: string;
  oneLiner: string;
}

export const OTHER_FLIGHT_SUMMARIES: FlightOptionSummary[] = [
  {
    id: 'bli-sea',
    label: 'BLI in / SEA out (open-jaw)',
    oneLiner:
      '+1 stopover SEA→BLI on Alaska, ~30 min hop. Saves ~2 hrs Day-1 driving but adds ~$300-450 (BLI feeder + one-way drop fee). Only wins if WA-20 is confirmed open.',
  },
  {
    id: 'sea-bli',
    label: 'SEA in / BLI out (reverse open-jaw)',
    oneLiner:
      'Same open-jaw economics as the standard direction but pacing is worse — Cascade Pass falls on Day 4 instead of Day 2.',
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
      'Lands east of the closure — Winthrop guaranteed even if WA-20 stays shut. Always +1 stopover (no nonstop NYC→GEG); 3:45 drive on arrival. Most expensive.',
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
      'Closest landing to the park, but border + passport + rental cross-border rules add friction. JetBlue runs the only JFK→YVR nonstop.',
  },
];

/**
 * Concise summaries of nearby airport alternatives (one line each).
 * Previously a deep-dive — now collapsed.
 */
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
    oneLiner: 'Closest landing (~2:45 to Marblemount). Border + passport overhead. JetBlue JFK nonstop.',
  },
];

export const FLIGHT_RETURN_OPTIONS = [
  {
    id: 'wed-late',
    label: 'A. Wed Aug 19 late-night SEA departure',
    note: 'Drive Winthrop → SEA after dinner Wed (~4 hrs). Kills Day 5. Not recommended.',
    recommended: false,
  },
  {
    id: 'thu-evening',
    label: 'B. Thu Aug 20 evening SEA departure',
    note: 'Sleep Winthrop Wed, slow morning, drive Thu, evening flight east. Redeye lands Fri AM.',
    recommended: true,
  },
  {
    id: 'thu-redeye',
    label: 'C. Thu Aug 20 redeye SEA → JFK/EWR',
    note: 'Same as B but lands east coast Fri AM. Connect to TLV Fri evening if heading home same day.',
    recommended: false,
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
      'Peak August West-Coast flights: book 8-12 weeks ahead (~late May / early June for Aug 16-20). Long-haul TLV→NYC: book 5-7 months out — ideally already locked. Fares typically stabilize ~6 weeks pre-departure; last-minute peak fares spike hard.',
  },
  {
    topic: 'Fare-alert tools',
    detail:
      'Set alerts on Google Flights (price-tracking graph + email alerts), Hopper (predicts cheaper dates), Going (formerly Scott’s Cheap Flights — best for deep-discount mistake fares), and Kayak Hacker Fares. Start monitoring 3-5 months before departure to learn the typical price band.',
  },
  {
    topic: 'Alaska Airlines route quirks',
    detail:
      'SEA hub serves BLI (~30 min hop, ~26 weekly), GEG (~14-15 daily), PDX, YVR. Mileage Plan transfers from Marriott Bonvoy + Bilt Rewards. Saver fares allow free same-day standby on Alaska metal.',
  },
  {
    topic: 'Delta + JetBlue + United',
    detail:
      'Delta runs nonstop JFK↔SEA + JFK↔PDX. JetBlue is the only nonstop JFK↔YVR. United routes through EWR↔SEA or EWR↔PDX. American serves JFK↔SEA but with fewer summer slots than Alaska/Delta.',
  },
  {
    topic: 'Open-jaw pricing',
    detail:
      'Open-jaw (BLI in / SEA out) sometimes prices the same as a roundtrip if booked as a multi-city itinerary on Alaska. Always check both single-airline multi-city AND two separate one-ways before booking.',
  },
  {
    topic: 'Day-of-week strategy',
    detail:
      'For peak-summer SEA, Tuesday and Wednesday departures typically run 10-20% cheaper than Friday/Sunday. Mid-week return is usually fine since Thu Aug 20 is the target return day anyway.',
  },
];
