/**
 * Food + restaurants.
 *
 * Mixed list — non-kosher corridor spots that are worth knowing for nights
 * you want to eat out, plus the slim set of Va\'ad-certified kosher options
 * in Seattle. No panic blocks. No "NO KOSHER HERE" alarms.
 */

import { RESTAURANTS, type Restaurant } from '../data/restaurants';
import { h, section } from '../dom';

function renderPlace(place: Restaurant): HTMLElement {
  return h(
    'li',
    { class: 'restaurants__item' },
    h(
      'div',
      { class: 'restaurants__head' },
      h('strong', { class: 'restaurants__name' }, place.name),
      h('span', { class: 'restaurants__address' }, place.address),
      place.phone ? h('span', { class: 'restaurants__phone' }, place.phone) : null,
      place.hechsher
        ? h('span', { class: 'restaurants__hechsher' }, `Hechsher: ${place.hechsher}`)
        : null
    ),
    h('p', { class: 'restaurants__note' }, place.note),
    place.website
      ? h(
          'p',
          { class: 'restaurants__link' },
          h(
            'a',
            { href: place.website, target: '_blank', rel: 'noopener noreferrer' },
            'Website →'
          )
        )
      : null
  );
}

export function renderRestaurants(): HTMLElement {
  return section(
    'restaurants',
    'Food + restaurants',
    h(
      'ul',
      { class: 'gist' },
      h('li', { class: 'gist__item' }, 'Cabin meals are the easier default; eating out works when the night calls for it.'),
      h('li', { class: 'gist__item' }, 'Corridor towns have no kosher restaurants — see Kosher notes for the flexible approach.'),
      h('li', { class: 'gist__item' }, 'Seattle has a handful of Va\'ad-certified kosher options if a sit-down kosher meal matters.')
    ),
    ...RESTAURANTS.map((town) =>
      h(
        'div',
        { class: 'restaurants__town' },
        h('h3', { class: 'subsection__title' }, town.town),
        town.context ? h('p', { class: 'section__lede' }, town.context) : null,
        town.places.length > 0
          ? h('ul', { class: 'restaurants__list' }, ...town.places.map(renderPlace))
          : null
      )
    )
  );
}
