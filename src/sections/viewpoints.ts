/**
 * Roadside viewpoints along WA-20.
 *
 * Featured stops (Diablo Lake, Washington Pass) lead with photos. Quick
 * pull-offs sit below as a milepost timeline. No "postcard" hierarchy.
 */

import { VIEWPOINTS, type Viewpoint } from '../data/viewpoints';
import { h, section } from '../dom';

function renderViewpointPhoto(v: Viewpoint): HTMLElement | null {
  if (!v.photo) return null;
  const img = h('img', {
    class: 'timeline__img',
    src: v.photo.src,
    alt: v.photo.alt,
    width: v.photo.width,
    height: v.photo.height,
    loading: 'lazy',
    decoding: 'async',
  });
  const figure = h('figure', { class: 'timeline__figure' }, img);
  if (v.photo.credit) {
    const credit = v.photo.creditUrl
      ? h(
          'figcaption',
          { class: 'timeline__credit' },
          h(
            'a',
            { href: v.photo.creditUrl, rel: 'noopener', target: '_blank' },
            v.photo.credit
          )
        )
      : h('figcaption', { class: 'timeline__credit' }, v.photo.credit);
    figure.append(credit);
  }
  return figure;
}

function renderTimelineItem(v: Viewpoint): HTMLElement {
  return h(
    'li',
    { class: 'timeline__item' },
    h(
      'div',
      { class: 'timeline__marker', 'aria-hidden': 'true' },
      h('span', { class: 'timeline__mp' }, `MP ${v.milepost}`)
    ),
    h(
      'div',
      { class: 'timeline__body' },
      h(
        'div',
        { class: 'timeline__head' },
        h('h3', { class: 'timeline__name' }, v.name),
        h('span', { class: 'timeline__time' }, v.timeNeeded)
      ),
      h('p', { class: 'timeline__detail' }, v.description),
      renderViewpointPhoto(v)
    )
  );
}

function renderViewpointSummary(v: Viewpoint): HTMLElement {
  return h(
    'li',
    { class: 'mini-list__item' },
    h('strong', { class: 'mini-list__label' }, `MP ${v.milepost} · ${v.name}`),
    h('span', { class: 'mini-list__detail' }, `${v.description} · ${v.timeNeeded}`)
  );
}

export function renderViewpoints(): HTMLElement {
  // Sort by milepost for the full timeline, but lead with the two photo-featured stops.
  const featured = VIEWPOINTS.filter((v) => v.featured).sort((a, b) => a.milepost - b.milepost);
  const rest = VIEWPOINTS.filter((v) => !v.featured).sort((a, b) => a.milepost - b.milepost);

  return section(
    'viewpoints',
    'Roadside viewpoints (WA-20)',
    h(
      'ul',
      { class: 'gist' },
      h('li', { class: 'gist__item' }, 'Two bigger stops with parking, restrooms, and 20-30 min walks: Diablo Lake (MP 132) and Washington Pass (MP 162).'),
      h('li', { class: 'gist__item' }, 'A handful of 5-minute pull-offs between them, listed by milepost below.')
    ),
    h('ol', { class: 'timeline' }, ...featured.map(renderTimelineItem)),
    rest.length > 0
      ? h(
          'details',
          { class: 'disclosure' },
          h(
            'summary',
            { class: 'disclosure__summary' },
            `Quick pull-offs by milepost (${rest.length})`
          ),
          h('ul', { class: 'mini-list' }, ...rest.map(renderViewpointSummary))
        )
      : null
  );
}
