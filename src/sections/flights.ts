import { FLIGHT_OPTIONS, FLIGHT_RETURN_OPTIONS, type FlightOption } from '../data/flights';
import { badge, h, section } from '../dom';

function renderFlightCard(option: FlightOption): HTMLElement {
  return h(
    'article',
    {
      class: `card flight-card${option.recommended ? ' flight-card--recommended' : ''}`,
      'aria-label': option.label,
    },
    h(
      'header',
      { class: 'card__header' },
      h('h3', { class: 'card__title' }, option.label),
      option.recommended ? badge('Recommended', 'good') : null
    ),
    h('p', { class: 'card__route' }, option.route),
    h('p', { class: 'card__diagram', 'aria-hidden': 'true' }, option.routeDiagram),
    h(
      'dl',
      { class: 'card__facts' },
      h('dt', {}, 'Cost'),
      h('dd', {}, option.costDelta),
      h('dt', {}, 'Driving'),
      h('dd', {}, option.drivingHours)
    ),
    h(
      'div',
      { class: 'card__proscons' },
      h(
        'div',
        { class: 'card__pros' },
        h('h4', { class: 'card__list-title' }, 'Pros'),
        h('ul', {}, ...option.pros.map((p) => h('li', {}, p)))
      ),
      h(
        'div',
        { class: 'card__cons' },
        h('h4', { class: 'card__list-title' }, 'Cons'),
        h('ul', {}, ...option.cons.map((c) => h('li', {}, c)))
      )
    ),
    option.recommendationNote
      ? h('p', { class: 'card__note' }, option.recommendationNote)
      : null
  );
}

export function renderFlights(): HTMLElement {
  return section(
    'flights',
    'Flights',
    h(
      'p',
      { class: 'section__lede' },
      'Allison routes TLV → NYC (JFK/EWR) → west coast. Alaska runs ~26 weekly BLI↔SEA feeders. SEA is the major hub.'
    ),
    h('div', { class: 'card-grid' }, ...FLIGHT_OPTIONS.map(renderFlightCard)),
    h(
      'div',
      { class: 'subsection' },
      h('h3', { class: 'subsection__title' }, 'Return flight timing'),
      h(
        'ul',
        { class: 'option-list' },
        ...FLIGHT_RETURN_OPTIONS.map((opt) =>
          h(
            'li',
            { class: `option-list__item${opt.recommended ? ' option-list__item--rec' : ''}` },
            h(
              'div',
              { class: 'option-list__head' },
              h('strong', {}, opt.label),
              opt.recommended ? badge('Recommended', 'good') : null
            ),
            h('p', { class: 'option-list__note' }, opt.note)
          )
        )
      )
    )
  );
}
