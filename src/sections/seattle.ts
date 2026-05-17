/**
 * Seattle add-on — conditional, all-optional.
 *
 * Per Allison May 16: "give suggestions if worth it." Section opens with
 * "skip if you don't want it" framing. Itineraries are listed as scenarios,
 * no "Pick" badge — none is the answer.
 *
 * Filter behavior (added Pass 1, 2026-05-16): when a path is selected that
 * excludes Seattle (Path A), the whole content body collapses into a single
 * disclosure. The section title + one-line path note remain visible — but the
 * 1,855px of "section kept for reference" wall stops blocking scroll-flow when
 * the path explicitly skips Seattle. "Compare all" mode still shows everything.
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
      h('h3', { class: 'card__title' }, stop.name),
      h(
        'div',
        { class: 'card__badges' },
        badge(CATEGORY_LABELS[stop.category], 'info'),
        stop.verifiedAsOf
          ? h('span', { class: 'badge badge--good' }, `✅ Verified ${stop.verifiedAsOf}`)
          : null
      )
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
      h('li', { class: 'gist__item' }, 'Day 5 has 4-6 hours between the drive in and the evening flight — natural fit for a stop if you want one.'),
      h('li', { class: 'gist__item' }, 'No museums. Walkables + outdoorsy stops only.')
    );
  }
  if (path.includeSeattle) {
    return h(
      'ul',
      { class: 'gist' },
      h('li', { class: 'gist__item' }, `${path.name}: ${path.seattleNote}`),
      h('li', { class: 'gist__item' }, 'No museums. Walkables + outdoorsy stops only.')
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

function renderFullContent(): HTMLElement[] {
  return [
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
      h('div', { class: 'card-grid' }, ...SEATTLE_STOPS.map(renderStopCard))
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
  const path = selectedId ? getPathById(selectedId as 'A' | 'B' | 'C') : null;
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
