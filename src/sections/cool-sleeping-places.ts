/**
 * Cool sleeping places — section render.
 *
 * Sits on lodging.html below the standard West/East tabs. Distinct visual
 * treatment so Erin sees these as conversation-starters, not "more lodging."
 *
 * Lifts Austria's pattern of surfacing source provenance per card (each card
 * has a "Source: <name>" pill). Honest about bookability — some entries are
 * lottery-based (Ross Lake Resort) or strenuous hike-in (Hidden Lake Lookout)
 * and the card states it clearly.
 */

import {
  COOL_SLEEPING_PLACES,
  ACCESS_LABELS,
  LOCATION_TIER_LABELS,
  BOOKING_STATUS_LABELS,
  sortByTier,
  type CoolSleepingPlace,
} from '../data/cool-sleeping-places';
import { badge, h, section } from '../dom';

function renderCard(place: CoolSleepingPlace): HTMLElement {
  const tierLabel = LOCATION_TIER_LABELS[place.locationTier];
  const accessLabel = ACCESS_LABELS[place.access];
  const statusLabel = BOOKING_STATUS_LABELS[place.bookingStatus];

  const tierBadgeKind = place.locationTier === 'in-park'
    ? 'good'
    : place.locationTier === 'around-park'
    ? 'info'
    : 'warn';

  const fitBadge = place.meetsBedRule
    ? badge('2-bed rule: meets', 'good')
    : badge('2-bed rule: NO (inspiration only)', 'warn');

  const statusBadgeKind = place.bookingStatus === 'open-bookable'
    ? 'good'
    : place.bookingStatus === 'lottery'
    ? 'warn'
    : 'info';

  const notFitRow = place.notFitReason
    ? h(
        'p',
        { class: 'card__not-fit' },
        h('strong', {}, 'Why this is inspiration-only: '),
        place.notFitReason
      )
    : null;

  const sunsetRow = place.sunsetNote
    ? h(
        'p',
        { class: 'card__sunset card__sunset--yes' },
        h('span', { class: 'badge badge--good card__sunset-badge' }, 'Sunset'),
        ' ',
        h('span', { class: 'card__sunset-note' }, place.sunsetNote)
      )
    : null;

  // Source pill — Austria's per-item provenance pattern.
  const sourceRow = h(
    'p',
    { class: 'cool-sleep__source' },
    h('span', { class: 'cool-sleep__source-label' }, 'Source: '),
    h(
      'a',
      {
        class: 'cool-sleep__source-link',
        href: place.sourceUrl,
        rel: 'noopener noreferrer',
        target: '_blank',
      },
      place.sourceName,
      ' ↗'
    ),
    h(
      'span',
      { class: 'cool-sleep__source-as-of' },
      ` · researched ${place.reviews.asOf}`
    )
  );

  return h(
    'article',
    {
      class: `card cool-sleep-card cool-sleep-card--${place.locationTier}${place.meetsBedRule ? '' : ' cool-sleep-card--inspiration'}`,
      'data-cool-id': place.id,
    },
    h(
      'header',
      { class: 'card__header' },
      h('h3', { class: 'card__title' }, place.name),
      h(
        'div',
        { class: 'card__badges' },
        badge(tierLabel, tierBadgeKind),
        badge(accessLabel, place.access === 'drive-in' ? 'good' : 'info'),
        badge(statusLabel, statusBadgeKind),
        fitBadge
      )
    ),
    h('p', { class: 'card__address' }, place.region),
    notFitRow,
    h(
      'p',
      { class: 'card__nature' },
      h('strong', {}, 'Setting: '),
      place.natureView
    ),
    sunsetRow,
    h(
      'p',
      { class: 'card__extras' },
      h('strong', {}, 'Why it\'s cool: '),
      place.whyCool
    ),
    h(
      'dl',
      { class: 'card__facts' },
      h('dt', {}, 'Beds'),
      h('dd', {}, place.beds),
      h('dt', {}, 'Bedrooms'),
      h('dd', {}, place.bedrooms),
      h('dt', {}, '$/night'),
      h('dd', {}, place.priceRange),
      h('dt', {}, 'Reviews'),
      h(
        'dd',
        {},
        `${place.reviews.score} · ${place.reviews.count} (${place.reviews.source}) · as of ${place.reviews.asOf}`
      )
    ),
    h(
      'p',
      { class: 'card__note' },
      h('strong', {}, 'Booking: '),
      place.bookingNote
    ),
    h(
      'p',
      { class: 'card__cta' },
      h(
        'a',
        {
          class: 'card__cta-link',
          href: place.bookingUrl,
          rel: 'noopener noreferrer',
          target: '_blank',
        },
        'Booking link'
      )
    ),
    sourceRow
  );
}

export function renderCoolSleepingPlaces(): HTMLElement {
  const places = sortByTier(COOL_SLEEPING_PLACES);
  const inPark = places.filter((p) => p.locationTier === 'in-park');
  const aroundPark = places.filter((p) => p.locationTier === 'around-park');
  const quirky = places.filter((p) => p.locationTier === 'quirky');

  const meetsCount = places.filter((p) => p.meetsBedRule).length;
  const inspirationCount = places.length - meetsCount;

  const sourceStrip = h(
    'ul',
    { class: 'source-strip', 'aria-label': 'Data sources' },
    h('li', { class: 'source-pill' }, 'NPS · rosslakeresort.com'),
    h('li', { class: 'source-pill' }, 'Recreation.gov · live'),
    h('li', { class: 'source-pill' }, 'parks.wa.gov · live'),
    h('li', { class: 'source-pill' }, 'methowreservations.com · live'),
    h('li', { class: 'source-pill source-pill--warn' }, 'Some lottery / not all bookable')
  );

  const sourceNote = h(
    'p',
    {
      class: 'cool-sleep__intro-note',
    },
    'Researched May 17, 2026 via property websites + Recreation.gov + Washington State Parks + Methow Reservations. ',
    h('strong', {}, `${meetsCount} of ${places.length} entries meet the 2-bed rule cleanly`),
    `; the other ${inspirationCount} are listed as inspiration only (floor-space lookouts, single-bed lodge rooms) — the card states why. Some entries (Ross Lake Resort) require a lottery; others (Stehekin) require a 4-hour ferry trip and likely don't fit a 5-day plan.`
  );

  return section(
    'cool-sleeping-places',
    'Cool sleeping places — in & around the park',
    h(
      'ul',
      { class: 'gist' },
      h(
        'li',
        { class: 'gist__item' },
        h('strong', {}, 'Distinct from the West/East tabs above.'),
        ' Floating cabins on Ross Lake. Lodging actually inside the park. Lakeside state-park cabins. Fire lookouts. Treehouses. Working dude ranches.'
      ),
      h(
        'li',
        { class: 'gist__item' },
        'Honesty pass — some are lottery-only or boat-in-only. Each card states bookability for Aug 16-20, 2026 and whether it meets the 2-bed rule.'
      ),
      h(
        'li',
        { class: 'gist__item' },
        'Even the ones that don\'t fit are surfaced as inspiration. Conversation-starters, not just bookings.'
      )
    ),
    sourceStrip,
    sourceNote,
    h(
      'div',
      { class: 'cool-sleep__group' },
      h(
        'h3',
        { class: 'cool-sleep__group-title' },
        h('span', { class: 'cool-sleep__group-icon', 'aria-hidden': 'true' }, '🏔'),
        ` In the park (${inPark.length})`
      ),
      h(
        'p',
        { class: 'cool-sleep__group-lede' },
        'NPS-managed or NPS-land-adjacent. The truly inside-the-park sleeping options.'
      ),
      h('div', { class: 'card-grid' }, ...inPark.map(renderCard))
    ),
    h(
      'div',
      { class: 'cool-sleep__group' },
      h(
        'h3',
        { class: 'cool-sleep__group-title' },
        h('span', { class: 'cool-sleep__group-icon', 'aria-hidden': 'true' }, '🌲'),
        ` Around the park (${aroundPark.length})`
      ),
      h(
        'p',
        { class: 'cool-sleep__group-lede' },
        'USFS, state-park, and on-boundary lodgings — distinctive settings just outside NPS lines.'
      ),
      h('div', { class: 'card-grid' }, ...aroundPark.map(renderCard))
    ),
    h(
      'div',
      { class: 'cool-sleep__group' },
      h(
        'h3',
        { class: 'cool-sleep__group-title' },
        h('span', { class: 'cool-sleep__group-icon', 'aria-hidden': 'true' }, '🌳'),
        ` Quirky / distinctive (${quirky.length})`
      ),
      h(
        'p',
        { class: 'cool-sleep__group-lede' },
        'Treehouse + lakeside cottages + working dude ranch — private operators with a strong identity.'
      ),
      h('div', { class: 'card-grid' }, ...quirky.map(renderCard))
    )
  );
}
