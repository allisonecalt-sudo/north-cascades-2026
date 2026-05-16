/**
 * Sky — sunrise/sunset/golden-hour + stargazing for the trip dates.
 */

import { SKY_DAYS, DARK_SKY_SPOTS, SUNSET_SPOTS, SKY_NOTES } from '../data/sky';
import { h, section } from '../dom';

export function renderSky(): HTMLElement {
  return section(
    'sky',
    'Sunrise · sunset · stars',
    h(
      'p',
      { class: 'section__lede' },
      'Golden-hour timing + dark-sky spots. Aug 18, 2026 is a new moon — best chance for stars all month.'
    ),
    h(
      'div',
      { class: 'sky-times' },
      h('h3', { class: 'subsection__title' }, 'Sunrise + sunset · Aug 16-20'),
      h(
        'table',
        { class: 'sky-table' },
        h(
          'thead',
          {},
          h(
            'tr',
            {},
            h('th', {}, 'Date'),
            h('th', {}, 'Sunrise'),
            h('th', {}, 'Sunset'),
            h('th', {}, 'Golden hour PM'),
            h('th', {}, 'Astro-dark')
          )
        ),
        h(
          'tbody',
          {},
          ...SKY_DAYS.map((d) =>
            h(
              'tr',
              {},
              h('td', {}, d.date),
              h('td', {}, d.sunrise),
              h('td', {}, d.sunset),
              h('td', {}, d.goldenHourPM),
              h('td', {}, d.astronomicalDark)
            )
          )
        )
      )
    ),
    h(
      'div',
      { class: 'sky-notes' },
      h('p', { class: 'sky-notes__item' }, h('strong', {}, 'New moon: '), SKY_NOTES.newMoonNote),
      h('p', { class: 'sky-notes__item' }, h('strong', {}, 'Perseids: '), SKY_NOTES.perseidsTail)
    ),
    h(
      'div',
      { class: 'sky-spots sky-spots--sunset' },
      h('h3', { class: 'subsection__title' }, 'Sunset spots'),
      h(
        'p',
        { class: 'section__lede' },
        'Worth a deliberate visit at golden hour if your cabin isn\'t west-facing. (Stay through dusk = stargazing too.)'
      ),
      h(
        'ul',
        { class: 'sky-spots__list' },
        ...SUNSET_SPOTS.map((spot) =>
          h(
            'li',
            { class: 'sky-spots__item' },
            h('strong', { class: 'sky-spots__name' }, spot.name),
            h('span', { class: 'sky-spots__where' }, ` · ${spot.where}`),
            h('p', { class: 'sky-spots__why' }, spot.why),
            spot.note ? h('p', { class: 'sky-spots__note' }, spot.note) : null
          )
        )
      )
    ),
    h(
      'details',
      { class: 'disclosure' },
      h(
        'summary',
        { class: 'disclosure__summary' },
        `Stars-only spots (Methow Valley + Hart's Pass) — ${DARK_SKY_SPOTS.length}`
      ),
      h(
        'p',
        { class: 'disclosure__lede' },
        'For dedicated stargazing. Sunset spots above also work for stars — stay past dusk.'
      ),
      h(
        'ul',
        { class: 'sky-spots__list' },
        ...DARK_SKY_SPOTS.map((spot) =>
          h(
            'li',
            { class: 'sky-spots__item' },
            h('strong', { class: 'sky-spots__name' }, spot.name),
            h('span', { class: 'sky-spots__where' }, ` · ${spot.where}`),
            h('p', { class: 'sky-spots__why' }, spot.why),
            spot.note ? h('p', { class: 'sky-spots__note' }, spot.note) : null
          )
        )
      )
    )
  );
}
