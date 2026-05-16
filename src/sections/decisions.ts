import { OPEN_DECISIONS } from '../data/decisions';
import { h, section } from '../dom';

export function renderDecisions(): HTMLElement {
  return section(
    'decisions',
    'Decisions',
    h(
      'ul',
      { class: 'gist' },
      h('li', { class: 'gist__item' }, 'Things still to pick. None are urgent yet — most can wait until the WSDOT road-status check in early July.'),
      h('li', { class: 'gist__item' }, 'Where there\'s a clear external fact (e.g. a closed property), it\'s flagged. Otherwise: pick what fits.')
    ),
    h(
      'ul',
      { class: 'decisions' },
      ...OPEN_DECISIONS.map((d) =>
        h(
          'li',
          { class: 'decisions__item' },
          h(
            'label',
            { class: 'decisions__row' },
            h('input', { type: 'checkbox', class: 'decisions__check', 'aria-label': d.question }),
            h(
              'div',
              { class: 'decisions__body' },
              h('h3', { class: 'decisions__question' }, d.question),
              h('p', { class: 'decisions__options' }, d.options),
              h('p', { class: 'decisions__target' }, `Target: ${d.targetBy}`),
              d.rec ? h('p', { class: 'decisions__rec' }, `Note: ${d.rec}`) : null
            )
          )
        )
      )
    )
  );
}
