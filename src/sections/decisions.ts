import { OPEN_DECISIONS } from '../data/decisions';
import { h, section } from '../dom';

export function renderDecisions(): HTMLElement {
  return section(
    'decisions',
    'Decisions',
    h(
      'ul',
      { class: 'gist' },
      h('li', { class: 'gist__item' }, 'Still to pick. Most can wait for the early-July WSDOT check.')
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
