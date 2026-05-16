/**
 * Rental car — lead picks visible, alt-shape options collapsed.
 *
 * V1 showed five cards (SEA SUV, SEA sedan, BLI→SEA one-way, Turo, Camper
 * Van). Pass 1 (2026-05-16): collapse the open-jaw, peer-to-peer, and
 * vanlife options behind a disclosure. The two lead cards (Compact SUV
 * roundtrip, Mid-size sedan roundtrip) match the SEA-roundtrip flight default
 * across all three paths; the rest are alt-shape trips that don't fit the
 * brief but stay accessible for completeness.
 */

import { RENTAL_OPTIONS, type RentalOption } from '../data/rental';
import { h, section } from '../dom';

// Lead picks pair with the default SEA-roundtrip flight on every path.
const LEAD_IDS = new Set(['sea-rt-suv', 'sea-rt-sedan']);

function renderCard(option: RentalOption): HTMLElement {
  return h(
    'article',
    { class: 'card rental-card' },
    h(
      'header',
      { class: 'card__header' },
      h('h3', { class: 'card__title' }, option.label)
    ),
    h('p', { class: 'card__subtitle' }, option.vehicleType),
    h(
      'dl',
      { class: 'card__facts' },
      h('dt', {}, 'Cost (5 days)'),
      h('dd', {}, option.costRange),
      h('dt', {}, 'Pairs with'),
      h('dd', {}, option.pairsWith)
    ),
    h('p', { class: 'card__note' }, option.tradeoff)
  );
}

export function renderRental(): HTMLElement {
  const lead = RENTAL_OPTIONS.filter((o) => LEAD_IDS.has(o.id));
  const alt = RENTAL_OPTIONS.filter((o) => !LEAD_IDS.has(o.id));

  return section(
    'rental',
    'Rental car',
    h(
      'ul',
      { class: 'gist' },
      h(
        'li',
        { class: 'gist__item' },
        'Compact SUV is the all-purpose pick; sedan works too — Cascade River Rd is gravel-but-passable for any car with reasonable clearance.'
      ),
      h('li', { class: 'gist__item' }, 'Lead picks pair with the SEA-roundtrip flight that all three paths default to.')
    ),
    h('div', { class: 'card-grid' }, ...lead.map(renderCard)),
    alt.length > 0
      ? h(
          'details',
          { class: 'disclosure' },
          h(
            'summary',
            { class: 'disclosure__summary' },
            `Less common shapes — open-jaw, peer-to-peer, vanlife (${alt.length})`
          ),
          h(
            'p',
            { class: 'disclosure__lede' },
            'Different trip shapes. Listed for completeness.'
          ),
          h('div', { class: 'card-grid' }, ...alt.map(renderCard))
        )
      : null
  );
}
