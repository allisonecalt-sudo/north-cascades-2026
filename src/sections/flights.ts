/**
 * Flights — leading option + collapsed alternates.
 *
 * Visual prominence comes from card size + ordering. No "Pick" badges, no
 * "Best value" stamps — the lede explains the framing ("fastest + reasonable
 * schedule") and the leading card sits at the top.
 */

import {
  AIRPORT_ALTERNATIVES,
  BOOKING_TIPS,
  FLIGHT_OPTIONS,
  FLIGHT_RETURN_OPTIONS,
  OTHER_FLIGHT_SUMMARIES,
  type FlightOption,
} from '../data/flights';
import { h, section } from '../dom';
import { renderPhotoCarousel, type CarouselPhoto } from './photo-carousel';

/**
 * Arrival-side context carousel (May 17, 2026 presentation pass).
 * Sets the mental model for what the reader is flying INTO — SEA/BLI →
 * North Cascades vistas. Avoids generic "airplane wing in the sky" imagery
 * and instead sells the destination.
 */
const ARRIVAL_PHOTOS: readonly CarouselPhoto[] = [
  {
    src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Diablo_Lake_(Washington_State).jpg?width=1280',
    alt: 'Diablo Lake — the postcard view about 2 hours east of SEA on WA-20.',
    credit: 'Photo: Wikimedia · CC',
    creditUrl: 'https://commons.wikimedia.org/wiki/File:Diablo_Lake_(Washington_State).jpg',
    width: 1600,
    height: 1067,
  },
  {
    src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Washington_pass_overlook.jpg?width=1280',
    alt: 'Washington Pass Overlook on WA-20 — the east-side scenic high point reachable from SEA or BLI.',
    credit: 'Photo: Wikimedia · CC',
    creditUrl: 'https://commons.wikimedia.org/wiki/File:Washington_pass_overlook.jpg',
    width: 1600,
    height: 1067,
  },
  {
    src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Cascade_Pass_in_WA.jpg?width=1280',
    alt: 'Cascade Pass alpine basin reachable from the west side of the trip.',
    credit: 'Photo: Wikimedia · CC',
    creditUrl: 'https://commons.wikimedia.org/wiki/File:Cascade_Pass_in_WA.jpg',
    width: 1600,
    height: 1067,
  },
];

function renderLeadingFlightCard(option: FlightOption): HTMLElement {
  return h(
    'article',
    {
      class: 'card flight-card flight-card--leading',
      'aria-label': option.label,
    },
    h(
      'header',
      { class: 'card__header' },
      h('h3', { class: 'card__title' }, option.label)
    ),
    h('p', { class: 'card__route' }, option.route),
    h('p', { class: 'card__diagram', 'aria-hidden': 'true' }, option.routeDiagram),
    h(
      'dl',
      { class: 'card__facts' },
      h('dt', {}, 'Schedule'),
      h('dd', {}, option.drivingHours),
      h('dt', {}, 'Notes'),
      h('dd', {}, option.costDelta)
    ),
    option.leadingNote
      ? h('p', { class: 'card__note' }, option.leadingNote)
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
  const leading = FLIGHT_OPTIONS.find((o) => o.leading) ?? FLIGHT_OPTIONS[0];
  if (!leading) {
    return section('flights', 'Flights');
  }

  const others = OTHER_FLIGHT_SUMMARIES;
  const leadingReturn = FLIGHT_RETURN_OPTIONS.find((o) => o.leading);
  const otherReturns = FLIGHT_RETURN_OPTIONS.filter((o) => !o.leading);

  return section(
    'flights',
    'Flights',
    // Gist in 3 lines.
    h(
      'ul',
      { class: 'gist' },
      h('li', { class: 'gist__item' }, 'Target: fastest + good times (fewest stopovers + reasonable departure).'),
      h('li', { class: 'gist__item' }, 'SEA roundtrip nonstop on Alaska / Delta / JetBlue / United matches the brief most cleanly — leading option below.'),
      h('li', { class: 'gist__item' }, 'Open-jaw + other routings sit below as alternatives, mostly relevant if WA-20 status changes.')
    ),
    h(
      'div',
      { class: 'flights-arrival-figure' },
      renderPhotoCarousel(ARRIVAL_PHOTOS, {
        ariaLabel: 'What you are flying into — North Cascades viewpoints',
        className: 'flights-arrival-carousel',
      }),
      h(
        'p',
        { class: 'flights-arrival-caption' },
        'What you are flying into — Diablo Lake, Washington Pass, Cascade Pass. SEA → park gate is ~2 hr east on WA-20; BLI is ~1.5 hr.'
      )
    ),
    renderLeadingFlightCard(leading),
    // Return timing.
    leadingReturn
      ? h(
          'div',
          { class: 'subsection' },
          h('h3', { class: 'subsection__title' }, 'Return flight timing'),
          h(
            'div',
            { class: 'option-list__item option-list__item--leading' },
            h('div', { class: 'option-list__head' }, h('strong', {}, leadingReturn.label)),
            h('p', { class: 'option-list__note' }, leadingReturn.note)
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
    // Other routings — collapsed.
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
    // Airport alternatives — collapsed.
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
