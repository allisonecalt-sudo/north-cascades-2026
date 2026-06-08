/**
 * Cool sleeping places — section render.
 *
 * Inspiration catalog below the standard West/East tabs. Most entries are NOT
 * bookable for Aug 16-20 (lottery, ferry-in, strenuous hike-in) — the whole
 * section is collapsed behind a <details> so it doesn't compete with the
 * booked stays. Each card carries a "Source ↗" provenance link (Austria pattern).
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
    ? badge('2-bed: meets', 'good')
    : badge('2-bed: inspiration only', 'warn');

  // Source pill — Austria's per-item provenance pattern.
  const sourceRow = h(
    'p',
    { class: 'cool-sleep__source' },
    h(
      'a',
      {
        class: 'cool-sleep__source-link',
        href: place.sourceUrl,
        rel: 'noopener noreferrer',
        target: '_blank',
      },
      `Source: ${place.sourceName} ↗`
    )
  );

  // Decider pills only (4): beds · access · price · bookability.
  const accessEmoji =
    place.access === 'drive-in'
      ? '🚗'
      : place.access === 'boat-in'
        ? '⛴'
        : place.access === 'hike-in'
          ? '🥾'
          : '🚌';
  const pillRow = h(
    'ul',
    { class: 'card__pills', 'aria-label': 'At a glance' },
    h('li', { class: 'card__pill' }, `🛏 ${place.beds}`),
    h('li', { class: 'card__pill' }, `${accessEmoji} ${accessLabel}`),
    h('li', { class: 'card__pill' }, `💰 ${place.priceRange}`),
    h(
      'li',
      {
        class: `card__pill card__pill--${place.bookingStatus === 'open-bookable' ? 'good' : place.bookingStatus === 'lottery' ? 'warn' : 'info'}`,
      },
      `📅 ${statusLabel}`
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
        fitBadge
      )
    ),
    pillRow,
    h('p', { class: 'card__address' }, place.region),
    h('p', { class: 'card__extras' }, place.whyCool),
    h(
      'p',
      { class: 'card__note' },
      h('strong', {}, 'Booking: '),
      place.bookingNote
    ),
    sourceRow
  );
}

export function renderCoolSleepingPlaces(): HTMLElement {
  const places = sortByTier(COOL_SLEEPING_PLACES);
  const inPark = places.filter((p) => p.locationTier === 'in-park');
  const aroundPark = places.filter((p) => p.locationTier === 'around-park');
  const quirky = places.filter((p) => p.locationTier === 'quirky');

  const group = (icon: string, label: string, list: CoolSleepingPlace[]): HTMLElement =>
    h(
      'div',
      { class: 'cool-sleep__group' },
      h(
        'h3',
        { class: 'cool-sleep__group-title' },
        h('span', { class: 'cool-sleep__group-icon', 'aria-hidden': 'true' }, icon),
        ` ${label} (${list.length})`
      ),
      h('div', { class: 'card-grid' }, ...list.map(renderCard))
    );

  const body = h(
    'details',
    { class: 'cool-sleep-details' },
    h(
      'summary',
      { class: 'cool-sleep-details__summary' },
      `Browse cool places to sleep — inspiration, mostly not bookable for Aug 16-20 (${places.length})`
    ),
    group('🏔', 'In the park', inPark),
    group('🌲', 'Around the park', aroundPark),
    group('🌳', 'Quirky / distinctive', quirky)
  );

  return section(
    'cool-sleeping-places',
    'Cool sleeping places — in & around the park',
    body
  );
}
