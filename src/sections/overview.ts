import { TRIP } from '../data/trip';
import { OPEN_DECISIONS } from '../data/decisions';
import { CONTINGENCIES } from '../data/logistics';
import { h, section } from '../dom';

export function renderOverview(): HTMLElement {
  const stats: { label: string; value: string }[] = [
    { label: 'Dates', value: TRIP.dates },
    { label: 'Duration', value: TRIP.duration },
    { label: 'Travelers', value: TRIP.travelers },
    { label: 'Lodging bases', value: TRIP.lodgingBases },
    { label: 'Open decisions', value: `${OPEN_DECISIONS.length} to lock` },
  ];

  return section(
    'overview',
    'Overview',
    h(
      'div',
      { class: 'overview' },
      h(
        'dl',
        { class: 'overview__stats' },
        ...stats.flatMap((s) => [
          h('dt', { class: 'overview__label' }, s.label),
          h('dd', { class: 'overview__value' }, s.value),
        ])
      ),
      h(
        'div',
        { class: 'overview__contingencies' },
        h('h3', { class: 'overview__sub' }, 'If WA-20 stays closed by Aug 16'),
        h(
          'ul',
          { class: 'overview__contingency-list' },
          ...CONTINGENCIES.map((c) =>
            h(
              'li',
              { class: 'contingency-card' },
              h('h4', { class: 'contingency-card__title' }, c.label),
              h('p', { class: 'contingency-card__detail' }, c.detail)
            )
          )
        )
      )
    )
  );
}
