/**
 * Seattle add-on section.
 *
 * Recommended Thu-evening half-day is surfaced first; everything else
 * (alternative itineraries, sights, logistics) is collapsed behind
 * disclosure widgets to keep density low.
 */

import {
  CATEGORY_LABELS,
  SEATTLE_ITINERARIES,
  SEATTLE_LOGISTICS,
  SEATTLE_STOPS,
  type SeattleItinerary,
  type SeattleStop,
} from '../data/seattle';
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

function renderItinerary(it: SeattleItinerary, primary: boolean): HTMLElement {
  return h(
    'article',
    {
      class: `option-list__item${primary ? ' option-list__item--rec' : ''}`,
    },
    h(
      'header',
      { class: 'option-list__head' },
      h('strong', {}, it.label),
      primary ? badge('Pick', 'good') : null
    ),
    h('p', { class: 'option-list__note' }, it.scenario),
    h(
      'ol',
      { class: 'seattle-itin__steps' },
      ...it.steps.map((s) => h('li', {}, s))
    )
  );
}

export function renderSeattle(): HTMLElement {
  const primaryItin = SEATTLE_ITINERARIES.find((i) => i.recommended);
  const otherItins = SEATTLE_ITINERARIES.filter((i) => !i.recommended);

  return section(
    'seattle',
    'Seattle add-on',
    h(
      'p',
      { class: 'section__lede' },
      'Day 5 lands in Seattle mid-afternoon with hours before an evening flight east — natural fit for a half-day stop. Kosher meals come from QFC Mercer Island.'
    ),
    // Recommended itinerary front-and-centre.
    primaryItin ? renderItinerary(primaryItin, true) : null,
    // Other itineraries — collapsed.
    otherItins.length > 0
      ? h(
          'details',
          { class: 'disclosure' },
          h(
            'summary',
            { class: 'disclosure__summary' },
            `Other Seattle scenarios (${otherItins.length})`
          ),
          h(
            'div',
            { class: 'option-list' },
            ...otherItins.map((it) => renderItinerary(it, false))
          )
        )
      : null,
    // Sights — collapsed.
    h(
      'details',
      { class: 'disclosure' },
      h(
        'summary',
        { class: 'disclosure__summary' },
        `Seattle sights + neighborhoods (${SEATTLE_STOPS.length})`
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
}
