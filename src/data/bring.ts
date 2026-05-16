/**
 * Bring list — PNW mid-August day-hike + roadside-viewpoint specific.
 *
 * Compact, mobile-friendly. Not a 50-item checklist — just the things people
 * forget in August that matter for this corridor.
 *
 * Sourced from NPS North Cascades hiker prep + standard PNW August packing
 * lists (rain layer, smoke mask, headlamp, etc.). Not exhaustive — assumes
 * the standard clothes/toiletries set.
 */

export interface BringItem {
  item: string;
  why: string;
}

export interface BringGroup {
  group: string;
  items: BringItem[];
}

export const BRING_GROUPS: BringGroup[] = [
  {
    group: 'Layers (mid-August at altitude)',
    items: [
      {
        item: 'Light rain shell',
        why: 'West-side moisture happens even in low-rain forecasts; alpine afternoons turn quickly.',
      },
      {
        item: 'Warm mid-layer (fleece or light puffy)',
        why: 'Pass-level mornings can hit 45-50°F. Cascade Pass + Maple Pass both top out near 5,400-6,600 ft.',
      },
      {
        item: 'Sun hat + sunglasses + SPF 30+',
        why: 'East-side exposure is real — Methow Valley runs 80-85°F with little shade above tree line.',
      },
    ],
  },
  {
    group: 'Feet + hike',
    items: [
      {
        item: 'Broken-in hiking shoes or boots',
        why: 'Cascade Pass + Maple Pass both have ~2,000 ft gain on rocky/rooty trail. Sneakers struggle.',
      },
      {
        item: '2 L water per person per hike',
        why: 'No water at trailheads. No filterable sources on the pass routes themselves.',
      },
      {
        item: 'Trekking poles (optional)',
        why: 'Maple Pass descent is steady downhill — knees appreciate them. Skip if you usually skip.',
      },
    ],
  },
  {
    group: 'Safety + just-in-case',
    items: [
      {
        item: 'Headlamp + spare batteries',
        why: 'Hikes that run long in August finish in twilight (sunset ~8:25 PM). Phone flashlight is not enough.',
      },
      {
        item: 'Basic first aid + blister kit',
        why: 'Trailheads have no cell service for help; closest pharmacy is 30-60 min away.',
      },
      {
        item: 'N95 / KN95 masks (2-3 per person)',
        why: 'August wildfire-smoke risk is real in the Methow Valley (precedent: Sourdough Fire 2023). Tuck in the bag, hope to leave them tucked.',
      },
      {
        item: 'Bear spray (Cascade Pass area)',
        why: 'Black bears are present on Cascade River Rd corridor. Not a daily worry but standard precaution for the pass-area hikes.',
      },
    ],
  },
  {
    group: 'Connectivity + navigation',
    items: [
      {
        item: 'Offline Google Maps for the WA-20 corridor',
        why: 'No cell from Newhalem to Mazama (~60 mi). Download before leaving Bellingham or Seattle.',
      },
      {
        item: 'AllTrails GPX files for every planned hike',
        why: 'Trail signage is good but no service means no live re-routing. Pre-download to phone.',
      },
      {
        item: 'Paper map of WA-20 (optional but nice)',
        why: 'Backs up the offline maps if phone dies. Free at Newhalem Visitor Center.',
      },
    ],
  },
  {
    group: 'Cabin life (kosher self-cater)',
    items: [
      {
        item: 'Insulated cooler bag',
        why: 'For the supermarket run on the way in — keeps packaged kosher goods cold during the 2-3 hr drive.',
      },
      {
        item: 'Reusable food containers',
        why: 'For trail lunches packed at the cabin. Saves single-use waste + fits more in the daypack.',
      },
      {
        item: 'Travel kettle (optional)',
        why: 'Most cabins have one but verify. Useful for instant coffee, oatmeal, packaged dinners.',
      },
    ],
  },
  {
    group: 'Photos + the sky',
    items: [
      {
        item: 'Real camera or just the phone — your call',
        why: 'Diablo Lake + Washington Pass + Maple Pass ridge all reward a real lens. Phone is also fine.',
      },
      {
        item: 'Tripod (small) if you care about stars',
        why: 'North Cascades is dark-sky country — Diablo Lake + Washington Pass + Patterson Lake all work for Milky Way shots in August (new moon Aug 18, 2026).',
      },
      {
        item: 'Extra phone battery or power bank',
        why: 'Cold + photo + offline-maps drain batteries fast. 10,000 mAh covers a day.',
      },
    ],
  },
];
