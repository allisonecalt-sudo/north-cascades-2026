import {
  AIRPORT_ALTERNATIVES,
  BOOKING_TIPS,
  FLIGHT_OPTIONS,
  FLIGHT_RETURN_OPTIONS,
  OTHER_FLIGHT_SUMMARIES,
  type FlightOption,
} from '../data/flights';
import { badge, h, section } from '../dom';

function renderPrimaryFlightCard(option: FlightOption): HTMLElement {
  return h(
    'article',
    {
      class: 'card flight-card flight-card--recommended flight-card--primary',
      'aria-label': option.label,
    },
    h(
      'header',
      { class: 'card__header' },
      h('h3', { class: 'card__title' }, option.label),
      badge('Pick', 'good')
    ),
    h('p', { class: 'card__route' }, option.route),
    h('p', { class: 'card__diagram', 'aria-hidden': 'true' }, option.routeDiagram),
    h(
      'dl',
      { class: 'card__facts' },
      h('dt', {}, 'Duration'),
      h('dd', {}, option.drivingHours),
      h('dt', {}, 'Cost'),
      h('dd', {}, option.costDelta)
    ),
    option.recommendationNote
      ? h('p', { class: 'card__note' }, option.recommendationNote)
      : null
  );
}

function renderOptionSummary(opt: { label: string; oneLiner: string }): HTMLElement {
  return h(
    'li',
    { class: 'mini-list__item' },
    h('strong', { class: 'mini-list__label' }, opt.label),
    h('span', { class: 'mini-list__detail' }, opt.oneLiner)
  );
}

export function renderFlights(): HTMLElement {
  const primary = FLIGHT_OPTIONS.find((o) => o.recommended) ?? FLIGHT_OPTIONS[0];
  if (!primary) {
    return section('flights', 'Flights');
  }

  const others = OTHER_FLIGHT_SUMMARIES;
  const recommendedReturn = FLIGHT_RETURN_OPTIONS.find((o) => o.recommended);
  const otherReturns = FLIGHT_RETURN_OPTIONS.filter((o) => !o.recommended);

  return section(
    'flights',
    'Flights',
    h(
      'p',
      { class: 'section__lede' },
      'One pick, fewest stopovers. Everything else is collapsed below.'
    ),
    renderPrimaryFlightCard(primary),
    // Return-flight timing — surface the recommended one, collapse the rest.
    recommendedReturn
      ? h(
          'div',
          { class: 'subsection' },
          h('h3', { class: 'subsection__title' }, 'Return flight timing'),
          h(
            'div',
            { class: 'option-list__item option-list__item--rec' },
            h(
              'div',
              { class: 'option-list__head' },
              h('strong', {}, recommendedReturn.label),
              badge('Pick', 'good')
            ),
            h('p', { class: 'option-list__note' }, recommendedReturn.note)
          ),
          otherReturns.length > 0
            ? h(
                'details',
                { class: 'disclosure' },
                h(
                  'summary',
                  { class: 'disclosure__summary' },
                  `Other return-timing options (${otherReturns.length})`
                ),
                h(
                  'ul',
                  { class: 'mini-list' },
                  ...otherReturns.map((o) =>
                    h(
                      'li',
                      { class: 'mini-list__item' },
                      h('strong', { class: 'mini-list__label' }, o.label),
                      h('span', { class: 'mini-list__detail' }, o.note)
                    )
                  )
                )
              )
            : null
        )
      : null,
    // Other flight routings — collapsed.
    h(
      'details',
      { class: 'disclosure' },
      h(
        'summary',
        { class: 'disclosure__summary' },
        `Other flight routings (${others.length})`
      ),
      h('p', { class: 'disclosure__lede' }, 'Compact one-liners — expand if you want the trade-offs.'),
      h(
        'ul',
        { class: 'mini-list' },
        ...others.map(renderOptionSummary)
      )
    ),
    // Airport alternatives — single line each, collapsed.
    h(
      'details',
      { class: 'disclosure' },
      h(
        'summary',
        { class: 'disclosure__summary' },
        `Nearby airport alternatives (${AIRPORT_ALTERNATIVES.length})`
      ),
      h(
        'ul',
        { class: 'mini-list' },
        ...AIRPORT_ALTERNATIVES.map(renderOptionSummary)
      )
    ),
    // Booking tips — collapsed.
    h(
      'details',
      { class: 'disclosure' },
      h(
        'summary',
        { class: 'disclosure__summary' },
        `Booking tips (${BOOKING_TIPS.length})`
      ),
      h(
        'ul',
        { class: 'mini-list' },
        ...BOOKING_TIPS.map((tip) =>
          h(
            'li',
            { class: 'mini-list__item' },
            h('strong', { class: 'mini-list__label' }, tip.topic),
            h('span', { class: 'mini-list__detail' }, tip.detail)
          )
        )
      )
    )
  );
}
