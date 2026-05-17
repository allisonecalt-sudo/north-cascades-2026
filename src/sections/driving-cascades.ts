/**
 * driving-cascades.ts — driving primer renderer.
 *
 * Per TRAVEL.md country-specific driving primer. US carve-out: no IDP, no
 * vignettes — but the WA-20 closure / Cascade River Rd gravel / cell dead
 * zones / fire-smoke contingency machinery matters.
 *
 * Each topic renders as a card with TLDR + body bullets + source pill +
 * severity color.
 */

import { DRIVING_TOPICS, DRIVING_INTRO } from '../data/driving';
import { h, section } from '../dom';
import { renderSectionSources } from './section-sources';
import { renderPhotoCarousel, type CarouselPhoto } from './photo-carousel';

/**
 * WA-20 corridor viewpoint carousel (May 17, 2026 presentation pass).
 *
 * What the carousel shows the reader before they read 9 dense driving topics:
 * "this is what the drive looks like." Sets the mental model so the
 * closure/gravel/cell-dead-zone copy lands with stakes attached.
 */
const CORRIDOR_PHOTOS: readonly CarouselPhoto[] = [
  {
    src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Diablo_Lake_(Washington_State).jpg?width=1280',
    alt: 'Diablo Lake turquoise water with the North Cascades framing the basin from the WA-20 overlook.',
    credit: 'Photo: Wikimedia · CC',
    creditUrl: 'https://commons.wikimedia.org/wiki/File:Diablo_Lake_(Washington_State).jpg',
    width: 1600,
    height: 1067,
  },
  {
    src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Liberty_Bell_Group,_North_Cascades_Highway.jpg?width=1280',
    alt: 'Liberty Bell group of granite spires from the WA-20 corridor in summer.',
    credit: 'Photo: Wikimedia · CC',
    creditUrl: 'https://commons.wikimedia.org/wiki/File:Liberty_Bell_Group,_North_Cascades_Highway.jpg',
    width: 1600,
    height: 1067,
  },
  {
    src: 'https://commons.wikimedia.org/wiki/Special:FilePath/North_Cascades_Highway_from_Burgundy_Col.jpg?width=1280',
    alt: 'WA-20 corridor seen from above with the North Cascades in summer.',
    credit: 'Photo: Wikimedia · CC',
    creditUrl: 'https://commons.wikimedia.org/wiki/File:North_Cascades_Highway_from_Burgundy_Col.jpg',
    width: 1600,
    height: 1067,
  },
  {
    src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Washington_pass_overlook.jpg?width=1280',
    alt: 'Washington Pass Overlook on WA-20 with Liberty Bell Mountain behind.',
    credit: 'Photo: Wikimedia · CC',
    creditUrl: 'https://commons.wikimedia.org/wiki/File:Washington_pass_overlook.jpg',
    width: 1600,
    height: 1067,
  },
];

function renderTopic(topic: (typeof DRIVING_TOPICS)[number]): HTMLElement {
  return h(
    'article',
    {
      class: `driving-topic driving-topic--${topic.severity}`,
      id: `driving-${topic.id}`,
    },
    h(
      'header',
      { class: 'driving-topic__header' },
      h('h3', { class: 'driving-topic__title' }, topic.title)
    ),
    h(
      'p',
      { class: 'driving-topic__tldr' },
      h('strong', {}, 'TLDR: '),
      topic.tldr
    ),
    h(
      'ul',
      { class: 'driving-topic__body' },
      ...topic.body.map((line) => h('li', {}, line))
    ),
    topic.source
      ? h(
          'p',
          { class: 'driving-topic__source' },
          'Source: ',
          h(
            'a',
            { href: topic.source.url, rel: 'noopener noreferrer', target: '_blank' },
            topic.source.name,
            ' ↗'
          )
        )
      : null
  );
}

export function renderDrivingCascades(): HTMLElement {
  return section(
    'driving-cascades',
    'Driving in the Cascades',
    h('p', { class: 'section__lede' }, DRIVING_INTRO.scope),
    h(
      'div',
      { class: 'driving-corridor-figure' },
      renderPhotoCarousel(CORRIDOR_PHOTOS, {
        ariaLabel: 'What the WA-20 corridor looks like',
        className: 'driving-corridor-carousel',
      }),
      h(
        'p',
        { class: 'driving-corridor-caption' },
        'What the WA-20 corridor looks like — Diablo Lake, Liberty Bell group, the highway from above, Washington Pass Overlook.'
      )
    ),
    renderSectionSources({
      label: 'Sources',
      sources: [
        { name: 'WSDOT · live mountain pass status', url: 'https://wsdot.com/travel/real-time/mountainpasses' },
        { name: 'NPS · North Cascades road conditions', url: 'https://www.nps.gov/noca/planyourvisit/road-conditions.htm' },
        { name: 'AirNow · air-quality fallback', url: 'https://www.airnow.gov/' },
        { name: 'Google Maps · drive-time verify', url: 'https://www.google.com/maps' },
      ],
      asOf: DRIVING_INTRO.asOf,
    }),
    h(
      'p',
      { class: 'driving-anchors' },
      h('strong', {}, 'Jump to: '),
      ...DRIVING_TOPICS.flatMap((t, i) => [
        h('a', { href: `#driving-${t.id}`, class: 'driving-anchors__link' }, t.title.split(' (')[0] ?? t.title),
        i < DRIVING_TOPICS.length - 1 ? h('span', { class: 'driving-anchors__sep' }, ' · ') : null,
      ])
    ),
    h(
      'div',
      { class: 'driving-topics' },
      ...DRIVING_TOPICS.map(renderTopic)
    ),
    h(
      'p',
      { class: 'costs-fineprint__verified' },
      h('span', { class: 'badge badge--good' }, `Verified ${DRIVING_INTRO.asOf}`)
    )
  );
}
