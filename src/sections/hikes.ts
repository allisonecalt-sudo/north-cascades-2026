/**
 * Hikes — grouped by effort level. Easy + moderate lead.
 *
 * When a path is selected, hikes that are part of that path get an "In your
 * path" badge. Hikes NOT in the path fade slightly but stay visible (they're
 * still options if she wants to swap on the day).
 */

import { HIKES, LEVEL_LABELS, type Hike, type HikeLevel } from '../data/hikes';
import { getPathById } from '../data/paths';
import { getSelectedPath, subscribeSelectedPath } from '../state/path';
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

function renderHikeCard(hike: Hike, inPath: boolean, pathSelected: boolean): HTMLElement {
  return h(
    'article',
    {
      class: `card hike-card hike-card--${hike.level}${pathSelected && !inPath ? ' hike-card--off-path' : ''}${pathSelected && inPath ? ' hike-card--in-path' : ''}`,
      'data-hike-id': hike.id,
    },
    renderHikePhoto(hike),
    h(
      'header',
      { class: 'card__header' },
      h('h3', { class: 'card__title' }, hike.name),
      h(
        'div',
        { class: 'card__badges' },
        inPath ? badge('In your path', 'good') : null,
        badge(sideLabel(hike.side), 'info')
      )
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
  return HIKES.filter((hike) => hike.level === level);
}

function sortInPathFirst(hikes: Hike[], inPath: (id: string) => boolean): Hike[] {
  // When a path is selected, lead with in-path hikes — off-path stay visible
  // (still options if she wants to swap on the day) but don't block the scan.
  return [...hikes].sort((a, b) => {
    const aIn = inPath(a.id) ? 0 : 1;
    const bIn = inPath(b.id) ? 0 : 1;
    return aIn - bIn;
  });
}

function renderBody(wrap: HTMLElement, selectedId: string | null): void {
  const easy = byLevel('easy');
  const moderate = byLevel('moderate');

  const path = selectedId ? getPathById(selectedId as 'A' | 'B' | 'C') : null;
  const pathHikeIds = path ? new Set(path.hikeIds) : new Set<string>();
  const pathSelected = path !== null;
  const inPath = (id: string): boolean => pathHikeIds.has(id);

  const easyOrdered = pathSelected ? sortInPathFirst(easy, inPath) : easy;
  const modOrdered = pathSelected ? sortInPathFirst(moderate, inPath) : moderate;

  const gist = wrap.querySelector<HTMLElement>('.gist');
  if (gist) {
    gist.replaceChildren(
      h(
        'li',
        { class: 'gist__item' },
        path
          ? `${path.name} — in-path hikes lead. Others stay visible as day-of swap options.`
          : 'Options at different levels — beautiful nature, easy → moderate is the sweet spot.'
      ),
      h('li', { class: 'gist__item' }, 'No must-dos — pick by energy on the day.')
    );
  }

  const easyWrap = wrap.querySelector<HTMLElement>('.hikes-easy');
  if (easyWrap) {
    easyWrap.replaceChildren(...easyOrdered.map((hike) => renderHikeCard(hike, inPath(hike.id), pathSelected)));
  }
  const modWrap = wrap.querySelector<HTMLElement>('.hikes-moderate');
  if (modWrap) {
    modWrap.replaceChildren(...modOrdered.map((hike) => renderHikeCard(hike, inPath(hike.id), pathSelected)));
  }
}

export function renderHikes(): HTMLElement {
  const easy = byLevel('easy');
  const moderate = byLevel('moderate');
  const ambitious = byLevel('ambitious');

  const wrap = section(
    'hikes',
    'Hikes',
    h('ul', { class: 'gist' }),
    h('h3', { class: 'subsection__title' }, `Easy walks (${easy.length})`),
    h('div', { class: 'card-grid card-grid--hikes hikes-easy' }),
    h('h3', { class: 'subsection__title' }, `Moderate hikes — beautiful + doable (${moderate.length})`),
    h('div', { class: 'card-grid card-grid--hikes hikes-moderate' }),
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

  renderBody(wrap, getSelectedPath());
  subscribeSelectedPath((next) => renderBody(wrap, next));

  return wrap;
}
