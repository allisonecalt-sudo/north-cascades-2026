/**
 * pre-trip.ts — countdown checklist with localStorage state.
 *
 * Per TRAVEL.md section 1: pre-trip prep tasks per category (book flights /
 * lodging / rental, kosher pantry, pack, verify scope, US trip carve-outs).
 *
 * The view persists checkbox state per task-id under localStorage key
 * `nc2026.preTripChecks` so revisiting the page shows what's already done.
 *
 * Trip is Sun Aug 16, 2026. Today (May 17, 2026) = ~91 days out. Each task has
 * a `daysOut` band that the page can highlight when the window opens.
 */

export interface PreTripTask {
  /** Stable id for localStorage key. NEVER change once shipped. */
  id: string;
  label: string;
  /** Why this matters — surfaces in the row body. */
  why: string;
  /** Earliest sensible date — for the "this opens N days out" highlight. */
  earliestDaysOut: number;
  /** Latest reasonable date — for "this should be done by N days out" stress. */
  latestDaysOut: number;
  /** Optional link (booking site, doc page). */
  link?: { label: string; url: string };
}

export interface PreTripGroup {
  group: string;
  /** Short description of the group's purpose. */
  blurb: string;
  tasks: PreTripTask[];
}

export const PRE_TRIP_GROUPS: PreTripGroup[] = [
  {
    group: 'Bookings (lock these first)',
    blurb: 'Aug peak — flights + lodging + rental all spike if booked late.',
    tasks: [
      {
        id: 'book-flights',
        label: 'Book NYC↔SEA flights for both travelers',
        why: 'Peak-Aug nonstops on Alaska/Delta/JetBlue/United — book 8-12 weeks ahead for best fare.',
        earliestDaysOut: 180,
        latestDaysOut: 56,
        link: { label: 'Google Flights NYC→SEA', url: 'https://www.google.com/travel/flights' },
      },
      {
        id: 'lock-path',
        label: 'Decide path A / B / C with Erin',
        why: 'Lodging strategy + rental class hinge on this. WA-20 reopen target Jul 4 is the swing factor.',
        earliestDaysOut: 90,
        latestDaysOut: 60,
      },
      {
        id: 'book-lodging',
        label: 'Book cabins per chosen path',
        why: 'Terra Nova-tier 2-bed cabins in Marblemount/Winthrop sell out for Aug weekends 8-12 weeks ahead.',
        earliestDaysOut: 120,
        latestDaysOut: 49,
        link: { label: 'Lodging page →', url: 'lodging.html' },
      },
      {
        id: 'book-rental',
        label: 'Book rental car (Costco / Turo / Brand-direct)',
        why: 'Quote captured May 16 — re-verify before booking. Costco lock at 70 days = lowest typical rate.',
        earliestDaysOut: 120,
        latestDaysOut: 30,
        link: {
          label: 'Costco Travel · SEA',
          url: 'https://www.costcotravel.com/Rental-Cars',
        },
      },
    ],
  },
  {
    group: 'Verify scope (~6 weeks out)',
    blurb: "Confirm what you've already booked is what you think it is.",
    tasks: [
      {
        id: 'verify-lodging-kitchen',
        label: 'Verify each cabin has full kitchen + 2 actual beds',
        why: 'Multi-unit properties (Glacier Peak, Sun Mountain, Freestone) vary by cabin number. Confirm at booking, not at arrival.',
        earliestDaysOut: 60,
        latestDaysOut: 21,
      },
      {
        id: 'verify-wa20',
        label: 'Re-check WSDOT WA-20 status (target reopen Jul 4)',
        why: 'If still closed Jul 15 → switch to west-only Plan B. Check Jul 8 (4 days post-target) and Jul 15.',
        earliestDaysOut: 42,
        latestDaysOut: 28,
        link: {
          label: 'WSDOT live status',
          url: 'https://wsdot.com/travel/real-time/mountainpasses/north-cascades-highway',
        },
      },
      {
        id: 'verify-firesmoke',
        label: 'Check fire/smoke forecast for Methow Valley window',
        why: 'August wildfire risk is real (Sourdough Fire 2023 precedent). Air-quality fallback = west-side only.',
        earliestDaysOut: 21,
        latestDaysOut: 7,
        link: { label: 'AirNow.gov', url: 'https://www.airnow.gov/' },
      },
    ],
  },
  {
    group: 'Kosher pantry + grocery plan',
    blurb: 'Cabins have full kitchens — the trip food strategy is cook-from-cabin with one supermarket run on the drive in.',
    tasks: [
      {
        id: 'pantry-plan',
        label: 'Build packaged kosher pantry list for the cabin',
        why: 'No kosher restaurants in the corridor. Stock from Seattle Kosher OR Trader Joe\'s/QFC/Whole Foods on the way out of Seattle.',
        earliestDaysOut: 14,
        latestDaysOut: 3,
      },
      {
        id: 'pantry-cooler',
        label: 'Pack insulated cooler bag for the drive in',
        why: 'Keeps cold groceries cold during the 2-3 hr SEA → Marblemount drive.',
        earliestDaysOut: 7,
        latestDaysOut: 1,
      },
      {
        id: 'pantry-stop',
        label: 'Plan grocery stop on Day 1 drive route',
        why: 'Easiest: Trader Joe\'s University Village (off I-5 north of SEA) OR QFC Smokey Point. Plan ~30-45 min stop.',
        earliestDaysOut: 14,
        latestDaysOut: 1,
      },
    ],
  },
  {
    group: 'Pack + gear',
    blurb: 'PNW August at altitude — layers, rain shell, smoke mask, headlamp.',
    tasks: [
      {
        id: 'pack-layers',
        label: 'Pack rain shell + warm mid-layer + hat + SPF 30+',
        why: 'Pass-level mornings can hit 45-50°F. East-side runs 80-85°F. Pack for both.',
        earliestDaysOut: 7,
        latestDaysOut: 1,
        link: { label: 'Bring list →', url: 'details.html#bring' },
      },
      {
        id: 'pack-hiking-shoes',
        label: 'Pack broken-in hiking shoes',
        why: 'Cascade Pass + Maple Pass both ~2,000 ft on rocky/rooty trail. Sneakers struggle.',
        earliestDaysOut: 7,
        latestDaysOut: 1,
      },
      {
        id: 'pack-headlamp',
        label: 'Pack headlamp + spare batteries',
        why: 'Long hikes finish in twilight (sunset ~8:25 PM). Phone flashlight not enough.',
        earliestDaysOut: 7,
        latestDaysOut: 1,
      },
      {
        id: 'pack-n95',
        label: 'Pack 2-3 N95/KN95 masks per person',
        why: 'August wildfire-smoke contingency. Hope to leave them packed.',
        earliestDaysOut: 7,
        latestDaysOut: 1,
      },
    ],
  },
  {
    group: 'Connectivity + navigation',
    blurb: 'No cell from Newhalem to Mazama (~60 mi).',
    tasks: [
      {
        id: 'offline-maps',
        label: 'Download offline Google Maps for WA-20 corridor + Marblemount + Winthrop',
        why: 'No cell service between Newhalem and Mazama. Download before leaving Bellingham or Seattle.',
        earliestDaysOut: 3,
        latestDaysOut: 0,
      },
      {
        id: 'alltrails-gpx',
        label: 'Download AllTrails GPX for every planned hike',
        why: 'Trail signage is good but no cell means no live re-routing.',
        earliestDaysOut: 3,
        latestDaysOut: 0,
      },
      {
        id: 'us-cell-plan',
        label: 'Verify cell plan covers US (Allison: TLV plan check)',
        why: 'Israeli plans need international add-on or a US eSIM for the trip. T-Mobile/Mint eSIMs work in WA.',
        earliestDaysOut: 14,
        latestDaysOut: 3,
      },
    ],
  },
  {
    group: 'US trip specifics (no IDP needed)',
    blurb: 'US carve-outs vs Europe trips.',
    tasks: [
      {
        id: 'no-idp-us',
        label: 'Confirm: NO IDP needed for US (Israeli license fine)',
        why: 'Unlike European rentals — for the US, Israeli driver license + passport are sufficient. NO MEMSI run needed.',
        earliestDaysOut: 90,
        latestDaysOut: 1,
      },
      {
        id: 'passport-validity',
        label: 'Confirm both passports valid through Feb 2027 (6 mo past return)',
        why: 'US entry rule. Renew now if either is close to the edge.',
        earliestDaysOut: 180,
        latestDaysOut: 90,
      },
      {
        id: 'esta-check',
        label: 'ESTA / visa status verified for both travelers',
        why: 'Both US-based already, but confirm Erin\'s green card / Allison\'s ESTA are current.',
        earliestDaysOut: 60,
        latestDaysOut: 14,
      },
      {
        id: 'credit-card-cdw',
        label: 'Confirm credit-card primary CDW coverage (Chase Sapphire Reserve / Amex Plat)',
        why: 'Lets you decline counter CDW + saves $150-200. Verify your specific card covers Cascade River Rd gravel.',
        earliestDaysOut: 30,
        latestDaysOut: 7,
      },
    ],
  },
  {
    group: 'Day-before + day-of',
    blurb: 'Last 24 hours.',
    tasks: [
      {
        id: 'day-before-pack-final',
        label: 'Final pack + bag-weigh',
        why: 'Avoid airport surprise. Each carry-on ≤ 22 lbs on Alaska / 35 lbs on most majors for checked.',
        earliestDaysOut: 1,
        latestDaysOut: 0,
      },
      {
        id: 'day-before-charge',
        label: 'Charge phones + headlamp + power bank',
        why: 'Cold + photo + offline-maps drain fast.',
        earliestDaysOut: 1,
        latestDaysOut: 0,
      },
      {
        id: 'day-before-itinerary',
        label: 'Screenshot Day-1 itinerary (offline access)',
        why: 'WA-20 corridor goes dead; printed/screen-shotted backup matters.',
        earliestDaysOut: 1,
        latestDaysOut: 0,
      },
    ],
  },
];

export const TRIP_START_DATE = '2026-08-16';

/** Returns days between today and trip start. Negative if past. */
export function daysUntilTrip(now: Date = new Date()): number {
  const start = new Date(TRIP_START_DATE + 'T00:00:00');
  const diffMs = start.getTime() - now.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}
