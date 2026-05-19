/**
 * Flights — NYC + United reality (full rewrite 2026-05-19).
 *
 * Posture: both Allison + Erin depart NYC area on the joint booking. Allison's
 * TLV→NYC long-haul is on a separate ticket — NOT in scope here. The May 18
 * WhatsApp thread + the May 19 corrections collapsed the routing question:
 *   - United EWR→SEA nonstop is the leading shape (Erin: "much cheaper" +
 *     Allison has a United travel credit + both have loyalty)
 *   - Alaska EWR→BLI stays as the fallback if United pricing breaks (faster
 *     drive but steep refundable premium)
 *   - JFK / LGA alternatives sit underneath as airport flex if EWR spikes
 *   - Cross-country open-jaw routings (BLI in / SEA out, etc.) and far-out
 *     alternates (PDX, YVR, GEG) are archived behind a single "comparison
 *     only" disclosure — these were the pre-decision research dump and are
 *     not in the active plan
 *
 * Voice rule: every recommendation card carries the verbatim Erin/Allison quote
 * that established the preference. Don't paraphrase the WhatsApp.
 */

export interface FlightOption {
  id: string;
  label: string;
  route: string;
  routeDiagram: string;
  /** Headline tradeoff line under the route diagram. Cites the source quote. */
  costDelta: string;
  drivingHours: string;
  /** Per-person fare ranges, USD round-trip — added 2026-05-19. */
  pricing?: {
    low: number;
    mid: number;
    refundable: number;
    refundablePremium: number;
    sourceLabel: string;
    verifiedOn: string;
  };
  pros: string[];
  cons: string[];
  /** True if it leads the section. */
  leading: boolean;
  /** True if it's the recommended fallback (loud secondary card). */
  fallback?: boolean;
  /** Plain prose note under the leading card. */
  leadingNote?: string;
  warning?: string;
}

export const FLIGHT_OPTIONS: FlightOption[] = [
  {
    id: 'united-ewr-sea',
    label: 'United EWR → SEA nonstop · RECOMMENDED',
    route: 'EWR → SEA → EWR · United',
    routeDiagram: 'EWR ──► SEA ──► EWR  (United nonstop)',
    costDelta:
      'Erin verified May 18 11:07pm: "Yes we could do United. They fly into SEA. That\'s looking much cheaper." Allison May 18: "amazing and united ideal! If possible cuz I have this travel credit but not a must." Refundable preferred — Erin May 18 5:25am: "if we find something refundable we can book it as a backup."',
    drivingHours:
      '~5.5-6 hr nonstop EWR↔SEA · ~2 hr 15 min drive SEA → Marblemount on Day 1 (~115 mi) · ~2-4 hr drive back on Day 5 depending on east-side base',
    pricing: {
      low: 340,
      mid: 440,
      refundable: 590,
      refundablePremium: 150,
      sourceLabel: 'Google Flights + Expedia · Aug 2026 sweep, verified May 19, 2026',
      verifiedOn: '2026-05-19',
    },
    pros: [
      'Cheapest carrier on this route per Erin\'s May 18 research',
      'Allison\'s United travel credit applies — direct $-off',
      'Both travelers have United loyalty status',
      'Nonstop EWR↔SEA on United',
      'Refundable fare class (Economy Flex / Premium) keeps Path B/A optionality open until WSDOT confirms',
      'No one-way rental drop fee (SEA roundtrip)',
      'Works under every WA-20 contingency',
    ],
    cons: [
      '+~50 min of driving on Day 1 vs landing at BLI (~115 mi vs ~71 mi)',
      'Refundable upgrade adds ~$150-300 vs non-refundable on United',
    ],
    leading: true,
    leadingNote:
      'Lock this when the United fare + refundable upgrade price the way Erin expects tonight. Allison: log into united.com so the travel credit is visible at checkout — credit applies pre-tax to the fare, so the displayed price will be lower for her than for Erin doing a logged-out search.',
  },
  {
    id: 'alaska-ewr-bli',
    label: 'Alaska EWR → BLI · FALLBACK',
    route: 'EWR → SEA → BLI · Alaska',
    routeDiagram: 'EWR ──► SEA ──► BLI  (Alaska, 1 stop)',
    costDelta:
      'Use only if United pricing breaks. Higher base fare + Alaska\'s refundable upgrade is significantly steeper than United\'s — worse flex-tradeoff for the same Aug 16-20 booking-as-backup discipline.',
    drivingHours:
      '~5.5-6 hr to SEA + ~30 min hop to BLI · ~1 hr 25 min drive BLI → Marblemount (~71 mi) · ~4 hr drive back to SEA on Day 5 if open-jaw',
    pricing: {
      low: 365,
      mid: 470,
      refundable: 670,
      refundablePremium: 200,
      sourceLabel: 'Travelocity · Alaska EWR↔BLI Aug 2026, verified May 19, 2026',
      verifiedOn: '2026-05-19',
    },
    pros: [
      'Shortest Day-1 drive (~1 hr 25 min from BLI vs ~2 hr 15 min from SEA)',
      'Alaska runs the BLI feeder all day; tight reliable connections',
    ],
    cons: [
      'More expensive than United → SEA per Erin\'s research',
      'Refundable upgrade premium is higher than United\'s',
      'No United travel credit to apply',
      'BLI lands on the wrong side of the corridor if WA-20 stays closed (Path A becomes harder, not easier)',
    ],
    leading: false,
    fallback: true,
  },
  {
    id: 'united-jfk-sea',
    label: 'United / JFK or LGA → SEA · airport flex if EWR spikes',
    route: 'JFK or LGA → SEA → JFK/LGA',
    routeDiagram: 'JFK/LGA ──► SEA ──► JFK/LGA',
    costDelta:
      'Same airline preference (United) but a different NYC airport. Useful if EWR fares spike on the chosen travel dates. JFK has more carriers competing on this route; LGA is usable but tighter inventory.',
    drivingHours:
      'JFK is ~5-6 hr nonstop on United / Alaska / Delta / JetBlue · LGA tighter inventory (cross-shop)',
    pricing: {
      low: 320,
      mid: 420,
      refundable: 570,
      refundablePremium: 150,
      sourceLabel: 'Skyscanner · JFK↔SEA + Google Flights LGA cross-shop, verified May 19, 2026',
      verifiedOn: '2026-05-19',
    },
    pros: [
      'NYC airport flexibility if EWR fares jump',
      'Allison May 19: EWR primary, JFK secondary, LGA acceptable — all three are reachable for both travelers',
      'Erin can still depart from NJ area (EWR is hometown for her)',
    ],
    cons: [
      'JFK adds NYC traffic from Erin\'s NJ base',
      'No travel credit if booking outside United on JFK',
    ],
    leading: false,
  },
];

/** Cross-country open-jaw + far-out alternates — kept for the comparison-only
 *  disclosure. These were the pre-decision research dump and aren't in the
 *  active May 18-19 plan. Don't promote them up the page. */
export interface FlightOptionSummary {
  id: string;
  label: string;
  oneLiner: string;
}

export const ARCHIVED_FLIGHT_SUMMARIES: FlightOptionSummary[] = [
  {
    id: 'bli-sea-openjaw',
    label: 'BLI in / SEA out (open-jaw)',
    oneLiner:
      'Originally framed as the "no-backtrack" option. Pays the BLI feeder + ~$100-250 one-way rental drop fee. Lost its edge once Erin chose the Marblemount cluster — both bases sit ~1 hr from each airport now, so the open-jaw premium isn\'t earning its keep.',
  },
  {
    id: 'sea-bli-reverse',
    label: 'SEA in / BLI out (reverse open-jaw)',
    oneLiner:
      'Pacing is worse — Cascade Pass falls on Day 4 (deeper in trip) instead of Day 2. Kept here only because the lodging math sometimes flips on a deep fare deal.',
  },
  {
    id: 'bli-rt',
    label: 'BLI roundtrip (west-side only)',
    oneLiner: 'Two BLI feeders. Only makes sense for a deliberately west-side-only Plan B — skips the east side entirely.',
  },
  {
    id: 'geg',
    label: 'GEG (Spokane) into east side',
    oneLiner:
      'Lands east of the closure — Winthrop guaranteed even if WA-20 stays shut. Always +1 stopover from NYC; 3:45 drive on arrival. Only worth it if a Path B → east-side-only collapse happens late.',
  },
  {
    id: 'pdx',
    label: 'PDX (Portland) southern alternate',
    oneLiner: 'Nonstop JFK→PDX exists but adds ~3 hrs of driving north. Only worth it on a deep fare deal.',
  },
  {
    id: 'yvr',
    label: 'YVR (Vancouver, BC) northern alternate',
    oneLiner:
      'Closest landing to the park, but border + passport + rental cross-border rules add friction. Cross-shop only.',
  },
];

/**
 * Airport → Marblemount drive comparison. Surfaced next to the leading card
 * so the SEA vs BLI tradeoff is one glance.
 *
 * Migrated 2026-05-19 to derive from `data/driving.ts` (DRIVE_SEGMENTS) so
 * there's a single source of truth for every drive time on the site.
 */
import { DRIVE_SEGMENTS } from './driving';

export interface AirportDriveCompare {
  airport: string;
  drive: string;
  miles: string;
  note: string;
}

const SEA_SEG = DRIVE_SEGMENTS.find((s) => s.id === 'sea-marblemount-arrival');
const BLI_SEG = DRIVE_SEGMENTS.find((s) => s.id === 'bli-marblemount-arrival');

export const AIRPORT_DRIVE_COMPARE: AirportDriveCompare[] = [
  {
    airport: 'SEA → Marblemount',
    drive: SEA_SEG?.drive ?? '~2 hr 15 min',
    miles: SEA_SEG?.miles ?? '~115 mi',
    note:
      'I-5 N → WA-20 E. Stock kosher-friendly groceries at a Seattle Trader Joe\'s / QFC / Whole Foods on the way out. Works for Path A (all 4 nights west) and Path B (2 west + 2 east).',
  },
  {
    airport: 'BLI → Marblemount',
    drive: BLI_SEG?.drive ?? '~1 hr 25 min',
    miles: BLI_SEG?.miles ?? '~71 mi',
    note:
      'I-5 S briefly → WA-20 E. Saves ~50 min on Day 1 vs SEA. No major Seattle Va\'ad grocery on this route — stock from BLI-area grocery instead.',
  },
];

export const FLIGHT_RETURN_OPTIONS = [
  {
    id: 'thu-evening',
    label: 'Thu Aug 20 evening SEA departure · RECOMMENDED',
    note:
      'Sleep east-side Wed night, slow Thu morning, drive west, evening flight home. Redeye lands NJ Fri AM. Matches the "back by 7-8 PM, balanced pace" brief and keeps Day 5 alive as a real travel day. Baseline fare = the headline number on each card above.',
    leading: true,
  },
  {
    id: 'thu-redeye',
    label: 'Thu Aug 20 redeye SEA → EWR/JFK',
    note:
      'Same shape as the evening option but a true overnight flight — lands NJ Fri AM. Useful if Allison is connecting onward to TLV Fri evening on her separate long-haul ticket. Typically ~$30/person cheaper than Thu evening.',
    leading: false,
  },
  {
    id: 'wed-late',
    label: 'Wed Aug 19 late-night SEA departure',
    note: 'Drive east-side base → SEA after dinner Wed (~4 hrs). Kills Day 5. Typically ~$60/person cheaper than Thu evening — only earns its keep on a real fare deal.',
    leading: false,
  },
];

export interface BookingTip {
  topic: string;
  detail: string;
}

export const BOOKING_TIPS: BookingTip[] = [
  {
    topic: 'United travel credit',
    detail:
      'Allison has a United travel credit — apply it at checkout. Price logged-in to united.com so the credit is visible pre-tax. Erin doing a logged-out search will see a higher number than what Allison actually pays. Don\'t book through a third-party (Expedia / Hopper) — credits only apply on united.com direct.',
  },
  {
    topic: 'Refundable fare class',
    detail:
      'On United, Economy Flex adds ~$150/person over Main Cabin (Premium Cabin adds $250-400 more depending on route). Alaska\'s refundable upgrade runs ~$200/person — steeper than United\'s. Worth it while WA-20 status is unresolved — refundable = the booking-as-backup discipline Erin named May 18. Concrete: budget +$300 for the pair to keep flex.',
  },
  {
    topic: 'When to book',
    detail:
      'Peak August West-Coast flights typically stabilize 8-12 weeks out (~late May for Aug 16-20). Erin said May 7 "once we pick a place, we should make reservations" — booking-discipline aware. Don\'t wait past mid-June for non-refundable; refundable buys flex up to 24 hrs before.',
  },
  {
    topic: 'Day-of-week strategy',
    detail:
      'Tuesday and Wednesday departures typically run 10-20% cheaper than Friday/Sunday for peak-summer SEA. Sun Aug 16 outbound + Thu Aug 20 return is decent — Sunday morning is busier than Tuesday, but Thursday return is favorable.',
  },
  {
    topic: 'Cross-shopping carriers',
    detail:
      'Alaska, Delta, JetBlue, United all run nonstop JFK↔SEA. Delta + United also run EWR↔SEA. United is the active default for the credit + Erin\'s research, but cross-shop the same dates on Google Flights to confirm the gap is real before booking.',
  },
];
