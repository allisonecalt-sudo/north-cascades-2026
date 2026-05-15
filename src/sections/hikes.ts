import { HIKES, type Hike, type HikeTag } from '../data/hikes';
import { badge, h, section } from '../dom';

const TAG_META: Record<HikeTag, { label: string; kind: 'good' | 'info' | 'warn' | 'default' }> = {
  'must-do': { label: 'Must-do', kind: 'good' },
  classic: { label: 'Classic', kind: 'good' },
  easy: { label: 'Easy', kind: 'info' },
  alternative: { label: 'Alternative', kind: 'default' },
  'plan-b': { label: 'Plan B', kind: 'warn' },
};

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

function renderHikeCard(hike: Hike): HTMLElement {
  const meta = TAG_META[hike.tag];
  return h(
    'article',
    { class: 'card hike-card' },
    renderHikePhoto(hike),
    h(
      'header',
      { class: 'card__header' },
      h(
        'h3',
        { class: 'card__title' },
        h('span', { class: 'hike-card__rank', 'aria-hidden': 'true' }, `#${hike.rank}`),
        ' ',
        hike.name
      ),
      badge(meta.label, meta.kind)
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

export function renderHikes(): HTMLElement {
  return section(
    'hikes',
    'Hikes',
    h(
      'p',
      { class: 'section__lede' },
      'Ranked by signature value. Two anchor hikes (#1, #2); the rest are alternates, easy add-ons, or Plan B if WA-20 stays closed.'
    ),
    h('div', { class: 'card-grid card-grid--hikes' }, ...HIKES.map(renderHikeCard))
  );
}
