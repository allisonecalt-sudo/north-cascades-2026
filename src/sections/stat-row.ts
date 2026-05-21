/**
 * stat-row.ts — 4-up glanceable stat tiles in the home hero.
 *
 * Austria-lifted pattern. Reads in 5 seconds, gives the shape of the trip:
 * "5 days · 4 nights · 3 stays booked · 2 travelers." Updated 2026-05-21 after
 * flights + lodging were booked and the path-comparison machinery was retired
 * (was "2 cabins · 2 paths").
 */

import { h } from '../dom';

interface Stat {
  num: string;
  label: string;
}

/**
 * Build the 4-stat row. All fixed now that the trip is booked: 5 days / 4
 * nights, 3 Airbnbs held for the same dates (Arlington + 2 in Sedro-Woolley),
 * 2 travelers (Allison + Erin).
 */
export function renderStatRow(): HTMLElement {
  const stats: Stat[] = [
    { num: '5', label: 'Days' },
    { num: '4', label: 'Nights' },
    { num: '3', label: 'Stays booked' },
    { num: '2', label: 'Travelers' },
  ];
  return h(
    'ul',
    { class: 'stat-row', 'aria-label': 'Trip at a glance' },
    ...stats.map((s) =>
      h(
        'li',
        { class: 'stat-tile' },
        h('p', { class: 'stat-tile__num' }, s.num),
        h('p', { class: 'stat-tile__label' }, s.label)
      )
    )
  );
}
