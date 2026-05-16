/**
 * Rental car — lead picks visible, alt-shape options collapsed.
 *
 * Hard rules surfaced in section header (Allison May 16, 2026):
 *   - Automatic transmission only
 *   - Gas or hybrid powertrain (no EVs)
 *   - All-in price = headline (CDW/LDW + liability + supplemental bundled)
 *   - Bare rental price kept as smaller secondary line for transparency
 *
 * Lead picks: SEA-roundtrip hybrid + gas SUV + mid-size sedan (all 3 paths
 * share the SEA-RT flight default). Open-jaw + peer-to-peer = alt shapes.
 */

import { POWERTRAIN_LABELS, RENTAL_OPTIONS, type RentalOption } from '../data/rental';
import { h, section } from '../dom';

// Lead picks pair with the default SEA-roundtrip flight on every path.
const LEAD_IDS = new Set(['sea-rt-suv-hybrid', 'sea-rt-suv-gas', 'sea-rt-sedan']);

function renderCard(option: RentalOption): HTMLElement {
  return h(
    'article',
    { class: `card rental-card rental-card--${option.powertrain}` },
    h(
      'header',
      { class: 'card__header' },
      h('h3', { class: 'card__title' }, option.label),
      h('span', { class: `badge badge--${option.powertrain === 'hybrid' ? 'good' : 'info'}` }, POWERTRAIN_LABELS[option.powertrain])
    ),
    h('p', { class: 'card__subtitle' }, option.vehicleType),
    h(
      'div',
      { class: 'rental-card__price-block' },
      h(
        'p',
        { class: 'rental-card__price-allin' },
        h('strong', {}, option.costAllIn)
      ),
      h(
        'p',
        { class: 'rental-card__price-bare' },
        option.costBare
      ),
      h(
        'p',
        { class: 'rental-card__price-note' },
        'Headline price includes full insurance — CDW/LDW + liability + supplemental.'
      )
    ),
    h(
      'dl',
      { class: 'card__facts' },
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
      'p',
      { class: 'section__lede rental__hard-rules' },
      h('strong', {}, 'Hard rules: '),
      'automatic transmission, gas or hybrid powertrain, prices include full insurance.'
    ),
    h(
      'ul',
      { class: 'gist' },
      h(
        'li',
        { class: 'gist__item' },
        'Hybrid SUV is the best all-around — saves ~$40-60 in fuel over the trip vs the gas equivalent.'
      ),
      h('li', { class: 'gist__item' }, 'Mid-size sedan is the cheaper option; Cascade River Rd is gravel-but-passable for any car with reasonable clearance.'),
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
            `Less common shapes — open-jaw, peer-to-peer (${alt.length})`
          ),
          h(
            'p',
            { class: 'disclosure__lede' },
            'Different trip shapes. Same hard rules apply — automatic, gas or hybrid, all-in pricing.'
          ),
          h('div', { class: 'card-grid' }, ...alt.map(renderCard))
        )
      : null
  );
}
