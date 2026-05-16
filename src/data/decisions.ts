/**
 * Open decisions — neutral options menu.
 *
 * No "rec" on items where the answer is genuinely a personal choice.
 * Reserve `rec` for items with a clear external fact (e.g. Skagit River Resort
 * is closed, so don't book that name).
 */

export interface OpenDecision {
  id: string;
  question: string;
  options: string;
  targetBy: string;
  rec?: string;
}

export const OPEN_DECISIONS: OpenDecision[] = [
  {
    id: 'flight-routing',
    question: 'Flight routing',
    options: 'SEA roundtrip · BLI in / SEA out · SEA in / BLI out · BLI roundtrip',
    targetBy: 'Decide by early July (after WSDOT July 4 status check)',
  },
  {
    id: 'return-flight',
    question: 'Return flight timing',
    options: 'Wed Aug 19 late · Thu Aug 20 evening · Thu Aug 20 redeye',
    targetBy: 'Lock when flight routing locks',
  },
  {
    id: 'rental-car',
    question: 'Rental car',
    options: 'SEA RT compact SUV · SEA RT sedan · BLI→SEA one-way · Turo',
    targetBy: 'Book ~6-8 weeks out (late June)',
  },
  {
    id: 'west-lodging',
    question: 'West-side lodging (Nights 1-2)',
    options:
      'Rhody House · North Cascades Hideaway · Riverside Retreat · Glacier Peak Resort · Ovenell\'s · Cascade River House (splurge)',
    targetBy: 'Book ASAP — cabins fill for August',
    rec: 'Do not book under "Skagit River Resort / Clark\'s Cabins" — that operator is closed. Same address is now Glacier Peak Resort.',
  },
  {
    id: 'east-lodging',
    question: 'East-side lodging (Nights 3-4)',
    options:
      'Methow River Lodge · River\'s Edge Resort · Freestone Inn cabins · Chewuch Inn cabins · Inn at Mazama · Spring Creek Ranch · Sun Mountain Patterson Lake (splurge)',
    targetBy: 'Book ASAP — peak season',
  },
  {
    id: 'cascade-pass-extent',
    question: 'Cascade Pass — Day 2',
    options: 'Pass only (7.0 mi) · Sahale Arm ambitious add-on (12.8 mi, long day)',
    targetBy: 'Decide morning-of based on energy',
  },
  {
    id: 'day-4-hike',
    question: 'Day 4 hike',
    options: 'Maple Pass Loop (7.2 mi) · Blue Lake (4.4 mi, shorter) · Cutthroat Pass (10 mi, harder)',
    targetBy: 'Decide morning-of',
  },
  {
    id: 'park-pass',
    question: 'Park pass',
    options: 'America the Beautiful $80 (12 mo) · Northwest Forest Pass $30 (this trip only)',
    targetBy: 'Before trip — confirm resident status (nonresident annual is $250)',
  },
  {
    id: 'arrowleaf',
    question: 'Reserve Arrowleaf Bistro dinner',
    options: 'Yes (book ~2 wks out) · no',
    targetBy: 'Early August',
  },
  {
    id: 'offline-maps',
    question: 'Download offline maps + AllTrails GPX',
    options: 'WA-20 corridor + Cascade River Rd · all trails',
    targetBy: 'Before leaving Bellingham',
  },
  {
    id: 'cascade-river-rd',
    question: 'Confirm Cascade River Rd open status',
    options: 'Call NPS 360-854-7200',
    targetBy: 'Day before Day 2',
  },
];
