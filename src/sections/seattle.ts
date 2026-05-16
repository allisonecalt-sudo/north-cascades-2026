/**
 * Seattle add-on — conditional, all-optional.
 *
 * Per Allison May 16: "give suggestions if worth it." Section opens with
 * "skip if you don't want it" framing. Itineraries are listed as scenarios,
 * no "Pick" badge — none is the answer.
 */

import {
  CATEGORY_LABELS,
  SEATTLE_ITINERARIES,
  SEATTLE_LOGISTICS,
  SEATTLE_STOPS,
  type SeattleItinerary,
  type SeattleStop,
} from '../data/seattle';
import { getPathById } from '../data/paths';
import { getSelectedPath, subscribeSelectedPath } from '../state/path';
import { badge, h, section } from '../dom';

function renderPhoto(stop: SeattleStop): HTMLElement {
  const { photo } = stop;
  const img = h('img', {
    class: 'card__img',
    src: photo.src,
    alt: photo.alt,
    width: photo.width,
    height: photo.height,
    loading: 'lazy',
    decoding: 'async',
  });
  const figure = h('figure', { class: 'card__figure' }, img);
  if (photo.credit) {
    const credit = photo.creditUrl
      ? h(
          'figcaption',
          { class: 'card__credit' },
          h(
            'a',
            { href: photo.creditUrl, rel: 'noopener', target: '_blank' },
            photo.credit
          )
        )
      : h('figcaption', { class: 'card__credit' }, photo.credit);
    figure.append(credit);
  }
  return figure;
}

function renderStopCard(stop: SeattleStop): HTMLElement {
  return h(
    'article',
    {
      class: 'card seattle-card',
      'data-category': stop.category,
    },
    renderPhoto(stop),
    h(
      'header',
      { class: 'card__header' },
      h('h3', { class: 'card__title' }, stop.name),
      badge(CATEGORY_LABELS[stop.category], 'info')
    ),
    h('p', { class: 'card__address' }, stop.address),
    h(
      'dl',
      { class: 'card__facts' },
      h('dt', {}, 'Time'),
      h('dd', {}, stop.timeNeeded)
    ),
    h('p', { class: 'card__note' }, stop.why),
    stop.practical ? h('p', { class: 'card__hint' }, stop.practical) : null
  );
}

function renderItinerary(it: SeattleItinerary): HTMLElement {
  return h(
    'article',
    { class: 'option-list__item' },
    h('header', { class: 'option-list__head' }, h('strong', {}, it.label)),
    h('p', { class: 'option-list__note' }, it.scenario),
    h(
      'ol',
      { class: 'seattle-itin__steps' },
      ...it.steps.map((s) => h('li', {}, s))
    )
  );
}

function renderPathNotice(selectedId: string | null): HTMLElement {
  const path = selectedId ? getPathById(selectedId as 'A' | 'B' | 'C') : null;
  if (!path) {
    return h(
      'ul',
      { class: 'gist' },
      h('li', { class: 'gist__item' }, 'Day 5 flow has 4-6 hours in Seattle between the drive in and the evening flight — natural fit for a stop if you want one.'),
      h('li', { class: 'gist__item' }, 'Skip the whole section if you\'d rather go straight to SEA. Nothing here is core.'),
      h('li', { class: 'gist__item' }, 'No museums. Walkables + outdoorsy stops only.')
    );
  }
  return h(
    'ul',
    { class: 'gist' },
    h('li', { class: 'gist__item' }, `${path.name}: ${path.seattleNote}`),
    path.includeSeattle
      ? h('li', { class: 'gist__item' }, 'A Leavenworth lunch stop on the Day-5 scenic US-2 return is the only "town" stop flagged for this path.')
      : h('li', { class: 'gist__item' }, 'This path doesn\'t plan a Seattle stop. Section kept for reference if you change plans.'),
    h('li', { class: 'gist__item' }, 'No museums. Walkables + outdoorsy stops only.')
  );
}

export function renderSeattle(): HTMLElement {
  const wrap = section(
    'seattle',
    'Seattle (optional)',
    renderPathNotice(getSelectedPath()),

    // Scenarios — all neutral.
    h('h3', { class: 'subsection__title' }, 'When-it-fits scenarios'),
    h('div', { class: 'option-list' }, ...SEATTLE_ITINERARIES.map(renderItinerary)),

    // Sights — collapsed.
    h(
      'details',
      { class: 'disclosure' },
      h(
        'summary',
        { class: 'disclosure__summary' },
        `Seattle stops + neighborhoods (${SEATTLE_STOPS.length})`
      ),
      h('div', { class: 'card-grid' }, ...SEATTLE_STOPS.map(renderStopCard))
    ),

    // Logistics — collapsed.
    h(
      'details',
      { class: 'disclosure' },
      h(
        'summary',
        { class: 'disclosure__summary' },
        `Seattle logistics (parking, light rail, traffic — ${SEATTLE_LOGISTICS.length})`
      ),
      h(
        'ul',
        { class: 'mini-list' },
        ...SEATTLE_LOGISTICS.map((row) =>
          h(
            'li',
            { class: 'mini-list__item' },
            h('strong', { class: 'mini-list__label' }, row.topic),
            h('span', { class: 'mini-list__detail' }, row.detail)
          )
        )
      )
    )
  );

  subscribeSelectedPath((next) => {
    const oldGist = wrap.querySelector('.gist');
    if (oldGist) {
      oldGist.replaceWith(renderPathNotice(next));
    }
  });

  return wrap;
}
