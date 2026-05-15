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
}

export const FLIGHT_OPTIONS: FlightOption[] = [
  {
    id: 'sea-rt',
    label: 'A. SEA roundtrip',
    route: 'NYC → SEA → NYC',
    routeDiagram: 'NYC ──► SEA ──► NYC',
    costDelta: 'Cheapest. Saves ~$200-400 on flights + ~$100-250 on one-way drop fee.',
    drivingHours: '+2 hr west drive Day 1 · 0 hr added on return',
    pros: [
      'Cheapest routing — skips the BLI feeder both ways',
      'Works under every contingency (Stevens Pass loop OR west-side-only OR punt to Sep)',
      'No one-way rental drop fee',
      'Most flexible if WA-20 status changes',
    ],
    cons: ['+2 hrs of driving on Day 1 morning to reach Marblemount'],
    recommended: true,
    recommendationNote:
      'Top recommendation given the WA-20 closure uncertainty. Open-jaw only wins if the highway is fully reopened well before mid-August.',
  },
  {
    id: 'bli-sea',
    label: 'B. BLI in / SEA out (original plan)',
    route: 'NYC → SEA → BLI in; SEA → NYC out',
    routeDiagram: 'NYC ──► SEA ──► BLI  ···  SEA ──► NYC',
    costDelta:
      'Most expensive. Pays SEA→BLI feeder (~$200) + one-way rental drop fee (~$100-250).',
    drivingHours: '-2 hrs Day 1 (closer to park) · 4-hr drive Day 5',
    pros: [
      'Maximizes park time on Day 1 (shortest drive in)',
      'No backtracking on WA-20',
      'Short ~30 min final feeder SEA→BLI',
    ],
    cons: [
      'If WA-20 stays closed, you land on the wrong side of the corridor',
      'Pays the open-jaw premium for a benefit that may not exist',
    ],
    recommended: false,
  },
  {
    id: 'sea-bli',
    label: 'C. SEA in / BLI out (reverse)',
    route: 'NYC → SEA in; BLI → SEA → NYC out',
    routeDiagram: 'NYC ──► SEA  ···  BLI ──► SEA ──► NYC',
    costDelta: 'Roughly same as B.',
    drivingHours: 'Drive east → west; ~2 hr SEA backtrack on the return',
    pros: ['Same open-jaw economics as B'],
    cons: [
      'Worse pacing — Cascade Pass on Day 4 (less time to acclimate routing) and Maple Pass on Day 2 (jet-lagged)',
      'Return trip backtracks 2 hrs to SEA',
    ],
    recommended: false,
  },
  {
    id: 'bli-rt',
    label: 'D. BLI roundtrip (west-side only)',
    route: 'NYC → SEA → BLI in/out',
    routeDiagram: 'NYC ──► SEA ──► BLI  ◄──► BLI ──► SEA ──► NYC',
    costDelta: 'Mid — pays BLI feeders both ways but skips the one-way drop fee.',
    drivingHours: 'West side only; no east-side driving',
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
