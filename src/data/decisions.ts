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
    id: 'flights-booked',
    question: '✅ Flights — BOOKED',
    options: 'United Economy EWR⇄SEA · out UA1330 Sun Aug 16 (7:59 AM → 11:03 AM) · return UA2017 Thu Aug 20 redeye (10:58 PM → 7:10 AM+1)',
    targetBy: 'Done — booked May 20, 2026 (Allison conf IXMH2Z; Erin booked matching seats).',
  },
  {
    id: 'lodging-primary',
    question: 'Which booked house to keep (cancel the other two)',
    options:
      'Arlington (host Brandi, 6 guests, conf HMKXHM8AW5, Allison booked) · Sedro-Woolley "Lakeside Cabin w/ Dock & Boats" (host Jackie, 4 guests, conf HMA4W2E22N, Allison booked) · Sedro-Woolley "Edwards House Retreat" ($493/4 nights, 4.99★, free cancellation, Erin booked)',
    targetBy: 'Before the free-cancellation windows close — all three held for the same Aug 16–20 dates; pick one, cancel the other two.',
    rec: 'All three are BOOKED for identical dates and kept on purpose until Allison + Erin pick. The Edwards House is the cheaper option.',
  },
  {
    id: 'rental-car',
    question: 'Rental car',
    options: 'SEA RT compact SUV · SEA RT sedan · Turo (flights land + depart SEA, so SEA roundtrip)',
    targetBy: 'Book ~6-8 weeks out (late June)',
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
    id: 'kosher-stock-day',
    question: 'Kosher stock-up day',
    options: 'Stock at Seattle (Day 1 / pre-trip) · stock at Marblemount/Winthrop grocery · pre-order Seattle Kosher delivery',
    targetBy: 'Before leaving Seattle',
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
