/**
 * Food + restaurants — KOSHER ONLY.
 *
 * Tightened May 16, 2026: non-kosher restaurants do NOT appear here (not even
 * as "context" or "worth knowing about"). Corridor towns with no kosher options
 * render a single-line notice pointing back to cabin-cooking strategy. Seattle
 * Va\'ad-certified options are the only sit-down picks.
 *
 * Path-aware: when the selected path excludes Seattle, the Seattle kosher town
 * collapses into a disclosure (kept accessible if plans bend).
 */

import { RESTAURANTS, type Restaurant, type RestaurantTown } from '../data/restaurants';
import { getPathById } from '../data/paths';
import { getSelectedPath, subscribeSelectedPath } from '../state/path';
import { h, section } from '../dom';
import { renderSectionSources } from './section-sources';

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
      h('span', { class: 'restaurants__hechsher' }, `Hechsher: ${place.hechsher}`)
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
  // No-kosher towns: rendered as compact single-row notice (not a full subsection).
  // Stops the "Marblemount · No kosher" + "Winthrop · No kosher" two-block wall.
  if (town.noKosher) {
    return h(
      'p',
      { class: 'restaurants__no-kosher restaurants__no-kosher--inline' },
      h('strong', {}, `${town.town}: `),
      'no kosher options — cabin meals (see ',
      h('a', { href: '#food' }, 'Kosher notes'),
      ').'
    );
  }
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

function isEastSideTown(town: RestaurantTown): boolean {
  return /winthrop|mazama/i.test(town.town);
}

/**
 * Path A is west-side-only. East-side notice still useful (no kosher there
 * either) but demoted into a disclosure on Path A.
 */
function pathExcludesEastSide(pathId: string | null): boolean {
  return pathId === 'A';
}

function renderBody(selectedId: string | null): HTMLElement {
  const path = selectedId ? getPathById(selectedId as 'A' | 'B' | 'C') : null;
  const seattleExcluded = path !== null && !path.includeSeattle;
  const eastExcluded = pathExcludesEastSide(selectedId);

  const inCorridor = (t: RestaurantTown): boolean =>
    !isSeattleTown(t) && (!eastExcluded || !isEastSideTown(t));

  const visibleCorridor = RESTAURANTS.filter(inCorridor);
  const hiddenEast = eastExcluded
    ? RESTAURANTS.filter((t) => !isSeattleTown(t) && isEastSideTown(t))
    : [];
  const seattle = RESTAURANTS.filter(isSeattleTown);

  const children: (HTMLElement | null)[] = visibleCorridor.map(renderTown);

  if (hiddenEast.length > 0) {
    children.push(
      h(
        'details',
        { class: 'disclosure' },
        h(
          'summary',
          { class: 'disclosure__summary' },
          'East-side towns — Winthrop · Mazama (not in this path)'
        ),
        h(
          'p',
          { class: 'disclosure__lede' },
          'Path A skips the east side. No kosher restaurants there either — same cabin-meals default.'
        ),
        ...hiddenEast.map(renderTown)
      )
    );
  }

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
    h(
      'li',
      { class: 'gist__item' },
      h('strong', {}, 'Kosher only. '),
      'Corridor towns have no kosher restaurants — cabin meals from packaged hechsher goods are the default.'
    ),
    seattleExcluded
      ? h('li', { class: 'gist__item' }, 'Seattle Va\'ad options sit collapsed below — this path skips Seattle.')
      : h('li', { class: 'gist__item' }, 'Seattle Va\'ad-certified options listed for sit-down kosher meals on the Day-5 SEA leg or a pre/post-trip overnight.')
  );
}

export function renderRestaurants(): HTMLElement {
  const wrap = section(
    'restaurants',
    'Food + restaurants',
    renderGist(getSelectedPath()),
    renderSectionSources({
      label: 'Hechsher certifications via',
      sources: [
        { name: 'Seattle Va\'ad of Kashruth', url: 'https://seattlevaad.org/' },
        { name: 'koshergrocers.com', url: 'https://www.koshergrocers.com/' },
      ],
      asOf: 'May 2026',
    }),
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
