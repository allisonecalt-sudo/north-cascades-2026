/**
 * Hikes — grouped by effort level. Easy + moderate lead.
 *
 * Ambitious add-ons (Sahale Arm, Cutthroat Pass) sit at the bottom inside a
 * disclosure with an honest framing line. No "must-do" / "the trail" /
 * crowned hikes. Each card shows level + side so the reader scans by fit.
 */

import { HIKES, LEVEL_LABELS, type Hike, type HikeLevel } from '../data/hikes';
import { badge, h, section } from '../dom';

function renderHikePhoto(hike: Hike): HTMLElement | null {
  if (!hike.photo) return null;
  const img = h('img', {
    class: 'card__img',
    src: hike.photo.src,
    alt: hike.photo.alt,
    width: hike.photo.width,
    height: hike.photo.height,
    loading: 'lazy',
    decoding: 'async',
  });
  const figure = h('figure', { class: 'card__figure' }, img);
  if (hike.photo.credit) {
    const credit = hike.photo.creditUrl
      ? h(
          'figcaption',
          { class: 'card__credit' },
          h(
            'a',
            { href: hike.photo.creditUrl, rel: 'noopener', target: '_blank' },
            hike.photo.credit
          )
        )
      : h('figcaption', { class: 'card__credit' }, hike.photo.credit);
    figure.append(credit);
  }
  return figure;
}

function sideLabel(side: Hike['side']): string {
  if (side === 'west') return 'West side';
  if (side === 'east') return 'East side';
  return 'Either side';
}

function renderHikeCard(hike: Hike): HTMLElement {
  return h(
    'article',
    { class: `card hike-card hike-card--${hike.level}` },
    renderHikePhoto(hike),
    h(
      'header',
      { class: 'card__header' },
      h('h3', { class: 'card__title' }, hike.name),
      badge(sideLabel(hike.side), 'info')
    ),
    h('p', { class: 'card__subtitle' }, hike.trailhead),
    h(
      'dl',
      { class: 'card__facts card__facts--inline' },
      h('dt', {}, 'Distance'),
      h('dd', {}, hike.mileage),
      h('dt', {}, 'Elevation'),
      h('dd', {}, hike.elevation),
      h('dt', {}, 'Duration'),
      h('dd', {}, hike.duration),
      h('dt', {}, 'Difficulty'),
      h('dd', {}, hike.difficulty)
    ),
    h('p', { class: 'card__note' }, hike.description)
  );
}

function renderHikeSummary(hike: Hike): HTMLElement {
  return h(
    'li',
    { class: 'mini-list__item' },
    h(
      'strong',
      { class: 'mini-list__label' },
      hike.name,
      ' ',
      badge(sideLabel(hike.side), 'info')
    ),
    h(
      'span',
      { class: 'mini-list__detail' },
      `${hike.mileage} · ${hike.elevation} · ${hike.difficulty}. ${hike.description}`
    )
  );
}

function byLevel(level: HikeLevel): Hike[] {
  return HIKES.filter((h) => h.level === level);
}

export function renderHikes(): HTMLElement {
  const easy = byLevel('easy');
  const moderate = byLevel('moderate');
  const ambitious = byLevel('ambitious');

  return section(
    'hikes',
    'Hikes',
    // Gist in 3 lines.
    h(
      'ul',
      { class: 'gist' },
      h('li', { class: 'gist__item' }, 'Options at different levels — beautiful nature, easy → moderate is the sweet spot.'),
      h(
        'li',
        { class: 'gist__item' },
        'Moderate cards lead (Maple Pass, Cascade Pass, Blue Lake, Thunder Knob). Easy walks sit above; ambitious add-ons collapse below.'
      ),
      h('li', { class: 'gist__item' }, 'No must-dos — pick by energy on the day.')
    ),

    // Easy walks
    h('h3', { class: 'subsection__title' }, `Easy walks (${easy.length})`),
    h('div', { class: 'card-grid card-grid--hikes' }, ...easy.map(renderHikeCard)),

    // Moderate (the sweet spot)
    h('h3', { class: 'subsection__title' }, `Moderate hikes — beautiful + doable (${moderate.length})`),
    h('div', { class: 'card-grid card-grid--hikes' }, ...moderate.map(renderHikeCard)),

    // Ambitious — collapsed.
    ambitious.length > 0
      ? h(
          'details',
          { class: 'disclosure' },
          h(
            'summary',
            { class: 'disclosure__summary' },
            `${LEVEL_LABELS.ambitious}s — long days, only if both feel strong (${ambitious.length})`
          ),
          h(
            'p',
            { class: 'disclosure__lede' },
            'Significant climb + long day. Listed for completeness, not as the plan.'
          ),
          h('ul', { class: 'mini-list' }, ...ambitious.map(renderHikeSummary))
        )
      : null
  );
}
