import { RESTAURANTS } from '../data/restaurants';
import { h, section } from '../dom';

export function renderRestaurants(): HTMLElement {
  return section(
    'restaurants',
    'Restaurants (kosher)',
    h(
      'p',
      { class: 'section__lede' },
      'Kosher-only listings — both travelers keep kosher. Corridor towns have zero kosher restaurants; Seattle has a small but real set. See Food Strategy for the self-catering plan that fills the gap.'
    ),
    ...RESTAURANTS.map((town) =>
      h(
        'div',
        { class: 'restaurants__town' },
        h('h3', { class: 'subsection__title' }, town.town),
        town.noKosher && town.noKosherNote
          ? h(
              'div',
              { class: 'restaurants__none' },
              h('strong', { class: 'restaurants__none-headline' }, 'No kosher restaurants here.'),
              h('p', { class: 'restaurants__none-note' }, town.noKosherNote)
            )
          : null,
        town.places.length > 0
          ? h(
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
                    h('span', { class: 'restaurants__address' }, place.address),
                    place.phone
                      ? h('span', { class: 'restaurants__phone' }, place.phone)
                      : null,
                    place.hechsher
                      ? h(
                          'span',
                          { class: 'restaurants__hechsher' },
                          `Hechsher: ${place.hechsher}`
                        )
                      : null
                  ),
                  h('p', { class: 'restaurants__note' }, place.note),
                  place.website
                    ? h(
                        'p',
                        { class: 'restaurants__link' },
                        h(
                          'a',
                          {
                            href: place.website,
                            target: '_blank',
                            rel: 'noopener noreferrer',
                          },
                          'Website →'
                        )
                      )
                    : null
                )
              )
            )
          : null
      )
    )
  );
}
