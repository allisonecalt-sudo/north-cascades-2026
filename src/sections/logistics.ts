import { LOGISTICS } from '../data/logistics';
import { h, section } from '../dom';

export function renderLogistics(): HTMLElement {
  return section(
    'logistics',
    'Logistics',
    h(
      'ul',
      { class: 'logistics' },
      ...LOGISTICS.map((item) =>
        h(
          'li',
          { class: 'logistics__item' },
          h('h3', { class: 'logistics__topic' }, item.topic),
          h('p', { class: 'logistics__detail' }, item.detail),
          item.link
            ? h(
                'a',
                {
                  class: 'logistics__link',
                  href: item.link.url,
                  target: '_blank',
                  rel: 'noopener noreferrer',
                },
                `${item.link.label} →`
              )
            : null
        )
      )
    )
  );
}
