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
