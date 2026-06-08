/**
 * Seattle add-on — conditional, all-optional ("skip if you don't want it").
 *
 * Path-aware: when the selected path excludes Seattle (Path A), the content body
 * collapses into a single disclosure. "Compare all" mode still shows everything.
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
import { h, section } from '../dom';
import { renderPhotoCarousel, type CarouselPhoto } from './photo-carousel';

function stopPhotos(stop: SeattleStop): CarouselPhoto[] {
  if (stop.photos && stop.photos.length > 0) return [...stop.photos];
  return [stop.photo];
}

function renderStopCard(stop: SeattleStop): HTMLElement {
  return h(
    'article',
    {
      class: 'card seattle-card',
      'data-category': stop.category,
    },
    renderPhotoCarousel(stopPhotos(stop), {
      ariaLabel: `Photos of ${stop.name}`,
    }),
    h(
      'header',
      { class: 'card__header' },
      h('h3', { class: 'card__title' }, stop.name)
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
  const path = selectedId ? getPathById(selectedId as 'A' | 'B') : null;
  if (!path) {
    return h(
      'ul',
      { class: 'gist' },
      h('li', { class: 'gist__item' }, 'Optional add-on — skip it if you don\'t want it.')
    );
  }
  if (path.includeSeattle) {
    return h(
      'ul',
      { class: 'gist' },
      h('li', { class: 'gist__item' }, `${path.name}: ${path.seattleNote}`)
    );
  }
  // Path excludes Seattle — single calm sentence, no scenarios pile.
  return h(
    'ul',
    { class: 'gist' },
    h(
      'li',
      { class: 'gist__item' },
      `${path.name} skips Seattle — drive straight to the park, fly home from SEA. `,
      h('strong', {}, 'Section collapsed below.')
    )
  );
}

/** Order categories present a clear west-to-outdoorsy reading flow. */
const CATEGORY_ORDER: SeattleStop['category'][] = ['walkable', 'outdoorsy', 'food', 'lodging'];

function renderKeyFacts(): HTMLElement {
  const fact = (label: string, value: string): HTMLElement =>
    h(
      'li',
      { class: 'mini-list__item' },
      h('strong', { class: 'mini-list__label' }, label),
      h('span', { class: 'mini-list__detail' }, value)
    );
  return h(
    'ul',
    { class: 'mini-list mini-list--key-facts' },
    fact('Window', 'Day 5 ~4-6 hr OR Day 1 overnight'),
    fact('From SEA', '~30 min to downtown'),
    fact('Stops', 'Walkable + outdoorsy only — no museums')
  );
}

function renderGroupedStops(): HTMLElement {
  const groups = CATEGORY_ORDER.map((cat) => {
    const stops = SEATTLE_STOPS.filter((s) => s.category === cat);
    if (stops.length === 0) return null;
    return h(
      'div',
      { class: 'seattle-group' },
      h('h4', { class: 'seattle-group__title' }, CATEGORY_LABELS[cat]),
      h('div', { class: 'card-grid' }, ...stops.map(renderStopCard))
    );
  });
  return h(
    'div',
    { class: 'seattle-groups' },
    ...groups.filter((g): g is HTMLDivElement => g !== null)
  );
}

function renderFullContent(): HTMLElement[] {
  return [
    renderKeyFacts(),
    h('h3', { class: 'subsection__title' }, 'When-it-fits scenarios'),
    h('div', { class: 'option-list' }, ...SEATTLE_ITINERARIES.map(renderItinerary)),
    h(
      'details',
      { class: 'disclosure' },
      h(
        'summary',
        { class: 'disclosure__summary' },
        `Seattle stops + neighborhoods (${SEATTLE_STOPS.length})`
      ),
      renderGroupedStops()
    ),
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
    ),
  ];
}

function renderBody(selectedId: string | null): HTMLElement {
  const path = selectedId ? getPathById(selectedId as 'A' | 'B') : null;
  const seattleExcluded = path !== null && !path.includeSeattle;

  if (seattleExcluded) {
    return h(
      'details',
      { class: 'disclosure disclosure--seattle-collapsed' },
      h(
        'summary',
        { class: 'disclosure__summary' },
        'Browse Seattle options anyway (scenarios + stops + logistics)'
      ),
      ...renderFullContent()
    );
  }
  return h('div', { class: 'seattle-body' }, ...renderFullContent());
}

export function renderSeattle(): HTMLElement {
  const wrap = section(
    'seattle',
    'Seattle (optional)',
    renderPathNotice(getSelectedPath()),
    renderBody(getSelectedPath())
  );

  subscribeSelectedPath((next) => {
    const oldGist = wrap.querySelector('.gist');
    if (oldGist) {
      oldGist.replaceWith(renderPathNotice(next));
    }
    const oldBody =
      wrap.querySelector('.seattle-body') ||
      wrap.querySelector('.disclosure--seattle-collapsed');
    if (oldBody) {
      oldBody.replaceWith(renderBody(next));
    }
  });

  return wrap;
}
