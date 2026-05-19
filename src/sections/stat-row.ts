/**
 * stat-row.ts — 4-up glanceable stat tiles above the path picker.
 *
 * Austria-lifted pattern. Reads in 5 seconds, gives the shape of the trip
 * before the path picker forces a decision: "5 days · 4 nights · 2 bases ·
 * 3 paths." Pulls from `TRIP` so anything we change in the data file flows
 * here.
 */

import { TRIP_PATHS } from '../data/paths';
import { h } from '../dom';

interface Stat {
  num: string;
  label: string;
}

/**
 * Build the 4-stat row. Numbers are stable across paths — every path is 5
 * days / 4 nights, every path uses 2 bases (some swap which base gets more
 * nights), and there are always 3 paths.
 */
export function renderStatRow(): HTMLElement {
  const stats: Stat[] = [
    { num: '5', label: 'Days' },
    { num: '4', label: 'Nights' },
    // "Scenic bases" was Allison's planning vocab — Erin would say "cabins."
    // Microcopy fix per 2026-05-19 PM needs-match audit (Erin gap doc #13).
    { num: '2', label: 'Cabins' },
    { num: String(TRIP_PATHS.length), label: 'Paths' },
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
