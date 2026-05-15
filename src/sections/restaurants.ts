import { RESTAURANTS } from '../data/restaurants';
import { h, section } from '../dom';

export function renderRestaurants(): HTMLElement {
  return section(
    'restaurants',
    'Restaurants',
    ...RESTAURANTS.map((town) =>
      h(
        'div',
        { class: 'restaurants__town' },
        h('h3', { class: 'subsection__title' }, town.town),
        h(
          'ul',
          { class: 'restaurants__list' },
          ...town.places.map((place) =>
            h(
              'li',
              { class: 'restaurants__item' },
              h(
                'div',
                { class: 'restaurants__head' },
                h('strong', { class: 'restaurants__name' }, place.name),
                h('span', { class: 'restaurants__address' }, place.address)
              ),
              h('p', { class: 'restaurants__note' }, place.note)
            )
          )
        )
      )
    )
  );
}
