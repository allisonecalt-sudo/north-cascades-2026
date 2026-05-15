import { VIEWPOINTS } from '../data/viewpoints';
import { badge, h, section } from '../dom';

export function renderViewpoints(): HTMLElement {
  return section(
    'viewpoints',
    'Roadside viewpoints (WA-20)',
    h(
      'p',
      { class: 'section__lede' },
      'Drive-by stops along the corridor, listed west-to-east by milepost. Two postcard stops at MP 132 and MP 162.'
    ),
    h(
      'ol',
      { class: 'timeline' },
      ...VIEWPOINTS.map((v) =>
        h(
          'li',
          { class: `timeline__item${v.postcard ? ' timeline__item--postcard' : ''}` },
          h(
            'div',
            { class: 'timeline__marker', 'aria-hidden': 'true' },
            h('span', { class: 'timeline__mp' }, `MP ${v.milepost}`)
          ),
          h(
            'div',
            { class: 'timeline__body' },
            h(
              'div',
              { class: 'timeline__head' },
              h('h3', { class: 'timeline__name' }, v.name),
              v.postcard ? badge('Postcard', 'good') : null
            ),
            h('p', { class: 'timeline__detail' }, v.description)
          )
        )
      )
    )
  );
}
