/**
 * Overview — gist in 3 lines, then trip facts, then a soft contingency note.
 *
 * No "MUST READ" framing; no contingency-as-headline. Reader sees the shape
 * of the trip first, then mechanics, then the road-status caveat.
 */

import { TRIP, TRIP_GIST } from '../data/trip';
import { CONTINGENCIES } from '../data/logistics';
import { h, section } from '../dom';

export function renderOverview(): HTMLElement {
  const stats: { label: string; value: string }[] = [
    { label: 'Dates', value: TRIP.dates },
    { label: 'Duration', value: TRIP.duration },
    { label: 'Travelers', value: TRIP.travelers },
    { label: 'Lodging bases', value: TRIP.lodgingBases },
  ];

  return section(
    'overview',
    'Overview',
    // Gist in 3 lines.
    h(
      'ul',
      { class: 'gist' },
      ...TRIP_GIST.map((line) => h('li', { class: 'gist__item' }, line))
    ),
    // Stats grid.
    h(
      'dl',
      { class: 'overview__stats' },
      ...stats.flatMap((s) => [
        h('dt', { class: 'overview__label' }, s.label),
        h('dd', { class: 'overview__value' }, s.value),
      ])
    ),
    // Soft contingency disclosure — collapsed.
    h(
      'details',
      { class: 'disclosure' },
      h(
        'summary',
        { class: 'disclosure__summary' },
        'If WA-20 is still closed in August — three fallback shapes'
      ),
      h(
        'ul',
        { class: 'mini-list' },
        ...CONTINGENCIES.map((c) =>
          h(
            'li',
            { class: 'mini-list__item' },
            h('strong', { class: 'mini-list__label' }, c.label),
            h('span', { class: 'mini-list__detail' }, c.detail)
          )
        )
      )
    )
  );
}
