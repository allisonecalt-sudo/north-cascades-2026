/**
 * Food + restaurants.
 *
 * Mixed list — non-kosher corridor spots that are worth knowing for nights
 * you want to eat out, plus the slim set of Va\'ad-certified kosher options
 * in Seattle. No panic blocks. No "NO KOSHER HERE" alarms.
 *
 * Path-aware (Pass 1, 2026-05-16): when the selected path excludes Seattle,
 * the Seattle kosher town collapses into a disclosure so the corridor towns
 * (which are what the trip actually visits) lead the section.
 */

import { RESTAURANTS, type Restaurant, type RestaurantTown } from '../data/restaurants';
import { getPathById } from '../data/paths';
import { getSelectedPath, subscribeSelectedPath } from '../state/path';
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

function renderTown(town: RestaurantTown): HTMLElement {
  return h(
    'div',
    { class: 'restaurants__town' },
    h('h3', { class: 'subsection__title' }, town.town),
    town.context ? h('p', { class: 'section__lede' }, town.context) : null,
    town.places.length > 0
      ? h('ul', { class: 'restaurants__list' }, ...town.places.map(renderPlace))
      : null
  );
}

function isSeattleTown(town: RestaurantTown): boolean {
  return /seattle/i.test(town.town);
}

function renderBody(selectedId: string | null): HTMLElement {
  const path = selectedId ? getPathById(selectedId as 'A' | 'B' | 'C') : null;
  const seattleExcluded = path !== null && !path.includeSeattle;

  const corridor = RESTAURANTS.filter((t) => !isSeattleTown(t));
  const seattle = RESTAURANTS.filter(isSeattleTown);

  const children: (HTMLElement | null)[] = corridor.map(renderTown);

  if (seattle.length > 0) {
    if (seattleExcluded) {
      children.push(
        h(
          'details',
          { class: 'disclosure' },
          h(
            'summary',
            { class: 'disclosure__summary' },
            'Seattle kosher options (not in this path)'
          ),
          h(
            'p',
            { class: 'disclosure__lede' },
            'Listed for reference — if the trip ever bends into a Day-5 Seattle stop, these are the Va\'ad-certified picks.'
          ),
          ...seattle.map(renderTown)
        )
      );
    } else {
      children.push(...seattle.map(renderTown));
    }
  }

  return h('div', { class: 'restaurants__body' }, ...children.filter((c): c is HTMLElement => c !== null));
}

function renderGist(selectedId: string | null): HTMLElement {
  const path = selectedId ? getPathById(selectedId as 'A' | 'B' | 'C') : null;
  const seattleExcluded = path !== null && !path.includeSeattle;

  return h(
    'ul',
    { class: 'gist' },
    h('li', { class: 'gist__item' }, 'Cabin meals are the easier default; eating out works when the night calls for it.'),
    seattleExcluded
      ? h('li', { class: 'gist__item' }, 'Corridor towns lead. Seattle kosher options sit collapsed below — this path skips Seattle.')
      : h('li', { class: 'gist__item' }, 'Corridor towns have no kosher restaurants. Seattle Va\'ad options listed if a sit-down kosher meal matters.')
  );
}

export function renderRestaurants(): HTMLElement {
  const wrap = section(
    'restaurants',
    'Food + restaurants',
    renderGist(getSelectedPath()),
    renderBody(getSelectedPath())
  );

  subscribeSelectedPath((next) => {
    const oldGist = wrap.querySelector('.gist');
    if (oldGist) oldGist.replaceWith(renderGist(next));
    const oldBody = wrap.querySelector('.restaurants__body');
    if (oldBody) oldBody.replaceWith(renderBody(next));
  });

  return wrap;
}
