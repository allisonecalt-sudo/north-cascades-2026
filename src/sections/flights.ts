/**
 * Flights — booked itinerary headline + collapsed pre-booking comparison.
 * Booked card on top; alternates (cards, return-timing, archived routings,
 * booking tips) live behind one disclosure.
 */

import {
  AIRPORT_DRIVE_COMPARE,
  ARCHIVED_FLIGHT_SUMMARIES,
  BOOKED_FLIGHTS,
  BOOKING_TIPS,
  FLIGHT_OPTIONS,
  FLIGHT_RETURN_OPTIONS,
  type FlightOption,
  type TravelerView,
} from '../data/flights';
import { h, section } from '../dom';
import { renderPhotoCarousel, type CarouselPhoto } from './photo-carousel';
import { renderDrivingRollup } from './driving-rollup';

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

type CardVariant = 'leading' | 'fallback' | 'tertiary';

/** Per-traveler mini-row inside the split pricing block.
 *  Same flight, one booking view. Two of these sit side-by-side on
 *  desktop (≥640px) and stack on mobile. Allison's row gets a credit-
 *  applies accent when `creditApplies === true`. */
function renderTravelerView(
  view: TravelerView,
  who: 'allison' | 'erin'
): HTMLElement {
  const creditAccent = view.creditApplies ? ' traveler-view--credit' : '';
  return h(
    'div',
    {
      class: `traveler-view traveler-view--${who}${creditAccent}`,
      'aria-label': `${view.name} booking view`,
    },
    h(
      'header',
      { class: 'traveler-view__head' },
      h('span', { class: 'traveler-view__name' }, view.name),
      view.creditApplies
        ? h('span', { class: 'traveler-view__credit-tag' }, '💳 credit applies')
        : null
    ),
    h(
      'dl',
      { class: 'traveler-view__facts' },
      h('dt', {}, 'Airport'),
      h('dd', {}, view.airportPref),
      h('dt', {}, 'Loyalty'),
      h('dd', {}, view.loyalty),
      h('dt', {}, 'Expected price'),
      h('dd', { class: 'traveler-view__price' }, view.expectedPrice),
      h('dt', {}, 'Book at'),
      h('dd', {}, view.bookingNote),
      view.refundableNote
        ? [h('dt', {}, 'Refundable'), h('dd', {}, view.refundableNote)]
        : null
    )
  );
}

function renderPricingBlock(option: FlightOption): HTMLElement | null {
  if (!option.pricing && !option.allison && !option.erin) return null;
  const p = option.pricing;
  return h(
    'div',
    {
      class: 'flight-card__pricing flight-card__pricing--split',
      'aria-label': 'Per-traveler booking views — Allison and Erin book independently',
    },
    h(
      'h4',
      { class: 'flight-card__pricing-title' },
      'Per-traveler booking views · they book independently'
    ),
    h(
      'div',
      { class: 'traveler-split' },
      option.allison ? renderTravelerView(option.allison, 'allison') : null,
      option.erin ? renderTravelerView(option.erin, 'erin') : null
    ),
    // Keep the shared baseline numbers visible underneath the split so the
    // sourcing line + headline range stay one-glance for the booker.
    p
      ? h(
          'div',
          { class: 'flight-card__pricing-baseline' },
          h(
            'p',
            { class: 'flight-card__pricing-baseline-line' },
            h('strong', {}, 'Shared baseline · '),
            `Basic ~$${p.low} · Main Cabin ~$${p.mid} · Refundable ~$${p.refundable} (+$${p.refundablePremium} flex).`
          ),
          h(
            'p',
            { class: 'flight-card__pricing-source' },
            `Source: ${p.sourceLabel} · re-verify before booking.`
          )
        )
      : null
  );
}

function renderFlightCard(option: FlightOption, variant: CardVariant): HTMLElement {
  return h(
    'article',
    {
      class: `card flight-card flight-card--${variant}`,
      'aria-label': option.label,
    },
    h(
      'header',
      { class: 'card__header' },
      h('h3', { class: 'card__title' }, option.label)
    ),
    h('p', { class: 'card__route' }, option.route),
    h('p', { class: 'card__diagram', 'aria-hidden': 'true' }, option.routeDiagram),
    renderPricingBlock(option),
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
      : null,
    option.warning
      ? h('p', { class: 'card__warning' }, h('strong', {}, '⚠ '), option.warning)
      : null,
    h(
      'div',
      { class: 'card__pros-cons' },
      h(
        'div',
        { class: 'card__col' },
        h('h4', { class: 'card__col-title' }, 'Pros'),
        h(
          'ul',
          { class: 'card__list' },
          ...option.pros.map((p) => h('li', {}, p))
        )
      ),
      h(
        'div',
        { class: 'card__col' },
        h('h4', { class: 'card__col-title' }, 'Cons'),
        h(
          'ul',
          { class: 'card__list' },
          ...option.cons.map((c) => h('li', {}, c))
        )
      )
    )
  );
}

function renderReturnRow(opt: (typeof FLIGHT_RETURN_OPTIONS)[number]): HTMLElement {
  return h(
    'li',
    {
      class: `returns-strip__item${opt.leading ? ' returns-strip__item--leading' : ''}`,
    },
    h(
      'div',
      { class: 'returns-strip__head' },
      h('strong', { class: 'returns-strip__label' }, opt.label)
    ),
    h('p', { class: 'returns-strip__note' }, opt.note)
  );
}

/** BOOKED itinerary card — the headline now that flights are locked. */
function renderBookedFlights(): HTMLElement {
  const b = BOOKED_FLIGHTS;
  return h(
    'article',
    { class: 'card flight-card flight-card--booked', 'aria-label': 'Booked flights' },
    h(
      'header',
      { class: 'card__header' },
      h('h3', { class: 'card__title' }, `✅ Booked · ${b.carrier} ${b.cabin}`)
    ),
    h(
      'ul',
      { class: 'booked-flights__legs' },
      ...b.legs.map((leg) =>
        h(
          'li',
          { class: 'booked-flights__leg' },
          h(
            'div',
            { class: 'booked-flights__leg-head' },
            h('strong', { class: 'booked-flights__flight' }, `${leg.flight}`),
            h('span', { class: 'booked-flights__dir' }, ` · ${leg.direction}`)
          ),
          h('p', { class: 'booked-flights__line' }, `${leg.date} · ${leg.route} · ${leg.times}`),
          leg.note
            ? h('p', { class: 'booked-flights__note card__warning' }, h('strong', {}, '⚠ '), leg.note)
            : null
        )
      )
    ),
    h(
      'dl',
      { class: 'card__facts' },
      h('dt', {}, 'Allison'),
      h('dd', {}, `Conf ${b.allisonConf} · seats ${b.allisonSeats}`),
      h('dt', {}, 'Erin'),
      h('dd', {}, b.erinNote)
    ),
    h(
      'blockquote',
      { class: 'locked-row__quote' },
      b.quote,
      h('cite', { class: 'locked-row__attribution' }, ` — ${b.attribution}`)
    )
  );
}

export function renderFlights(): HTMLElement {
  const leading = FLIGHT_OPTIONS.find((o) => o.leading) ?? FLIGHT_OPTIONS[0];
  const fallback = FLIGHT_OPTIONS.find((o) => o.fallback);
  const tertiary = FLIGHT_OPTIONS.find((o) => !o.leading && !o.fallback);

  // No comparison data at all — still show the booked itinerary as the headline.
  if (!leading) {
    return section('flights', 'Flights', renderBookedFlights());
  }

  // Pre-booking comparison, collapsed behind one expander.
  const alternatesConsidered = h(
    'details',
    { class: 'disclosure' },
    h(
      'summary',
      { class: 'disclosure__summary' },
      'How we got here · alternates considered (pre-booking research)'
    ),
    // ─── Airport drive comparison ───
    h(
      'div',
      { class: 'airport-compare' },
      h('h3', { class: 'airport-compare__title' }, 'Drive from airport · SEA vs BLI'),
      h(
        'ul',
        { class: 'airport-compare__list' },
        ...AIRPORT_DRIVE_COMPARE.map((row) =>
          h(
            'li',
            { class: 'airport-compare__row' },
            h('strong', { class: 'airport-compare__airport' }, row.airport),
            h(
              'span',
              { class: 'airport-compare__stats' },
              `${row.drive} · ${row.miles}`
            ),
            h('span', { class: 'airport-compare__note' }, row.note)
          )
        )
      )
    ),

    // ─── United credit callout (Allison-specific booking note) ───
    h(
      'aside',
      { class: 'united-credit-callout', role: 'note' },
      h('h3', { class: 'united-credit-callout__title' }, '💳 Allison · apply the United travel credit'),
      h(
        'p',
        { class: 'united-credit-callout__body' },
        'Book direct on united.com logged in — credit shows pre-tax. Not third-party.'
      )
    ),

    // ─── Leading card ───
    renderFlightCard(leading, 'leading'),

    // ─── Fallback card ───
    fallback ? renderFlightCard(fallback, 'fallback') : null,

    // ─── Tertiary card (airport flex) ───
    tertiary ? renderFlightCard(tertiary, 'tertiary') : null,

    // ─── Return-timing strip (all 3 options visible) ───
    h(
      'div',
      { class: 'returns-strip-wrap' },
      h('h3', { class: 'returns-strip__title' }, 'Return flight timing'),
      h(
        'ul',
        { class: 'returns-strip' },
        ...FLIGHT_RETURN_OPTIONS.map(renderReturnRow)
      )
    ),

    // ─── Archived routings (open-jaw + PDX/YVR/GEG) — comparison only ───
    h(
      'details',
      { class: 'disclosure' },
      h(
        'summary',
        { class: 'disclosure__summary' },
        `Archived routings · comparison only (${ARCHIVED_FLIGHT_SUMMARIES.length})`
      ),
      h(
        'ul',
        { class: 'mini-list' },
        ...ARCHIVED_FLIGHT_SUMMARIES.map((opt) =>
          h(
            'li',
            { class: 'mini-list__item' },
            h('strong', { class: 'mini-list__label' }, opt.label),
            h('span', { class: 'mini-list__detail' }, opt.oneLiner)
          )
        )
      )
    ),

    // ─── Booking tips ───
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

  return section(
    'flights',
    'Flights',
    // ─── Booked itinerary — the headline now that flights are locked ───
    h(
      'p',
      { class: 'section__lede' },
      'Alternates considered are collapsed at the bottom.'
    ),
    renderBookedFlights(),

    // ─── Arrival photos — what you're flying into (kept; not comparison) ───
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
        'What you\'re flying into — Diablo Lake, Washington Pass, Cascade Pass. SEA → park gate is ~2 hr east on WA-20.'
      )
    ),

    // ─── All driving on this trip ───
    renderDrivingRollup(),

    // ─── How we got here / alternates considered (collapsed) ───
    alternatesConsidered
  );
}
