/**
 * Seattle add-on section.
 *
 * Renders the Seattle stop options as filterable cards (chips: All / Iconic /
 * Outdoorsy / Food / Lodging), then a logistics list, then the suggested
 * mini-itineraries. Mirrors the lodging-section visual language so it slots
 * into the existing cabin-glacial palette.
 */

import {
  CATEGORY_LABELS,
  SEATTLE_ITINERARIES,
  SEATTLE_LOGISTICS,
  SEATTLE_STOPS,
  type SeattleCategory,
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

function uniqueCategories(stops: SeattleStop[]): SeattleCategory[] {
  const seen = new Set<SeattleCategory>();
  for (const s of stops) seen.add(s.category);
  return (Object.keys(CATEGORY_LABELS) as SeattleCategory[]).filter((c) => seen.has(c));
}

function renderFilterChips(grid: HTMLElement, stops: SeattleStop[]): HTMLElement {
  const categories = uniqueCategories(stops);
  const allChip = h(
    'button',
    {
      type: 'button',
      class: 'chip chip--active',
      'data-filter': 'all',
      'aria-pressed': 'true',
    },
    `All (${stops.length})`
  );
  const chips = categories.map((c) => {
    const count = stops.filter((s) => s.category === c).length;
    return h(
      'button',
      {
        type: 'button',
        class: 'chip',
        'data-filter': c,
        'aria-pressed': 'false',
      },
      `${CATEGORY_LABELS[c]} (${count})`
    );
  });
  const bar = h(
    'div',
    {
      class: 'chip-row',
      role: 'group',
      'aria-label': 'Filter Seattle stops by category',
    },
    allChip,
    ...chips
  );
  bar.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLButtonElement)) return;
    const filter = target.dataset['filter'];
    if (!filter) return;
    const allChips = bar.querySelectorAll<HTMLButtonElement>('.chip');
    allChips.forEach((chip) => {
      const active = chip.dataset['filter'] === filter;
      chip.classList.toggle('chip--active', active);
      chip.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
    const cards = grid.querySelectorAll<HTMLElement>('.seattle-card');
    cards.forEach((card) => {
      const cat = card.dataset['category'];
      card.hidden = filter !== 'all' && cat !== filter;
    });
  });
  return bar;
}

function renderItinerary(it: SeattleItinerary): HTMLElement {
  return h(
    'article',
    {
      class: `option-list__item${it.recommended ? ' option-list__item--rec' : ''}`,
    },
    h(
      'header',
      { class: 'option-list__head' },
      h('strong', {}, it.label),
      it.recommended ? badge('Recommended', 'good') : null
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
  const grid = h(
    'div',
    { class: 'card-grid' },
    ...SEATTLE_STOPS.map(renderStopCard)
  );

  const wrap = section(
    'seattle',
    'Seattle add-on',
    h(
      'p',
      { class: 'section__lede' },
      "You're already paying SEA transit both ways. Day 5 (Thu Aug 20) most-likely lands you in town mid-afternoon with 4-8 hours before an evening flight east — natural fit for a half-day stop. This section covers that scenario plus a pre-trip Saturday overnight and a longer add-on-night option."
    ),
    h(
      'div',
      { class: 'seattle-sub' },
      h('h3', { class: 'subsection__title' }, 'Logistics'),
      h(
        'ul',
        { class: 'logistics' },
        ...SEATTLE_LOGISTICS.map((row) =>
          h(
            'li',
            { class: 'logistics__item' },
            h('h4', { class: 'logistics__topic' }, row.topic),
            h('p', { class: 'logistics__detail' }, row.detail)
          )
        )
      )
    ),
    h(
      'div',
      { class: 'seattle-sub' },
      h('h3', { class: 'subsection__title' }, 'Stops + cards'),
      h(
        'p',
        { class: 'section__lede' },
        'Filter by category. Photos credit linked to source.'
      ),
      renderFilterChips(grid, SEATTLE_STOPS),
      grid
    ),
    h(
      'div',
      { class: 'seattle-sub' },
      h('h3', { class: 'subsection__title' }, 'Suggested mini-itineraries'),
      h(
        'div',
        { class: 'option-list' },
        ...SEATTLE_ITINERARIES.map(renderItinerary)
      )
    )
  );

  return wrap;
}
