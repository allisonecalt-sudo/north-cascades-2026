import { VIEWPOINTS, type Viewpoint } from '../data/viewpoints';
import { badge, h, section } from '../dom';

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
    { class: `timeline__item${v.postcard ? ' timeline__item--postcard' : ''}` },
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
        v.postcard ? badge('Postcard', 'good') : null
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
    h('span', { class: 'mini-list__detail' }, v.description)
  );
}

export function renderViewpoints(): HTMLElement {
  const postcards = VIEWPOINTS.filter((v) => v.postcard);
  const rest = VIEWPOINTS.filter((v) => !v.postcard);

  return section(
    'viewpoints',
    'Roadside viewpoints (WA-20)',
    h(
      'p',
      { class: 'section__lede' },
      'Two postcard stops along the corridor. Quick pull-offs collapsed below.'
    ),
    h('ol', { class: 'timeline' }, ...postcards.map(renderTimelineItem)),
    rest.length > 0
      ? h(
          'details',
          { class: 'disclosure' },
          h(
            'summary',
            { class: 'disclosure__summary' },
            `Other pull-offs along WA-20 (${rest.length})`
          ),
          h('ul', { class: 'mini-list' }, ...rest.map(renderViewpointSummary))
        )
      : null
  );
}
