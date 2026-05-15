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
    options: 'SEA roundtrip vs BLI-in/SEA-out vs SEA-in/BLI-out vs BLI roundtrip',
    targetBy: 'Decide by early July (after WSDOT July 4 status check)',
    rec: 'SEA roundtrip unless WA-20 is confirmed open by mid-July.',
  },
  {
    id: 'return-flight',
    question: 'Return flight timing',
    options: 'Wed Aug 19 late · Thu Aug 20 evening · Thu Aug 20 redeye',
    targetBy: 'Lock when flight routing locks',
    rec: 'Thu Aug 20 evening SEA departure.',
  },
  {
    id: 'rental-car',
    question: 'Rental car',
    options: 'SEA RT SUV · SEA RT sedan · BLI→SEA one-way · Turo',
    targetBy: 'Book ~6-8 weeks out (late June)',
    rec: 'SEA RT compact SUV (best value) unless open-jaw flight is locked.',
  },
  {
    id: 'west-lodging',
    question: 'West-side lodging (Nights 1-2)',
    options: 'Rhody House (Airbnb) · Cascade River House · Glacier Peak Resort cabins',
    targetBy: 'Book ASAP — cabins fill for August',
    rec: 'Rhody House (Airbnb, full kitchen) — Skagit River Resort / Clark\'s Cabins is closed; that brand should NOT be booked.',
  },
  {
    id: 'east-lodging',
    question: 'East-side lodging (Nights 3-4)',
    options: 'River\'s Edge Resort · Spring Creek Ranch · Sun Mountain Lodge Patterson Lake Cabins · Freestone Inn cabins',
    targetBy: 'Book ASAP — peak season',
    rec: 'River\'s Edge Resort or Spring Creek Ranch (both confirmed full kitchens). Freestone has "apartment-sized" kitchens — workable but smaller; matches the brief on amenities but not the strongest kosher-cook setup.',
  },
  {
    id: 'cascade-pass-extent',
    question: 'Cascade Pass — Day 2',
    options: 'Pass only (7.4 mi) vs Sahale Arm extension (12.8 mi)',
    targetBy: 'Decide morning-of based on energy',
  },
  {
    id: 'day-4-hike',
    question: 'Day 4 hike',
    options: 'Maple Pass Loop · Blue Lake · Cutthroat Pass',
    targetBy: 'Decide morning-of',
    rec: 'Maple Pass Loop (the east-side classic).',
  },
  {
    id: 'park-pass',
    question: 'Park pass',
    options: 'America the Beautiful $80 (12 mo) vs Northwest Forest Pass $30 (this trip only)',
    targetBy: 'Before trip — confirm resident status (nonresident annual is $250)',
  },
  {
    id: 'arrowleaf',
    question: 'Reserve Arrowleaf Bistro dinner',
    options: 'Yes (book ~2 wks out) vs no (skip the nicer Winthrop dinner)',
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
