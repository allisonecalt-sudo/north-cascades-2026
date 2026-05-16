/**
 * Rental car — research-backed cards with insurance breakdowns + booking links.
 *
 * Hard rules surfaced in section header (Allison May 16, 2026):
 *   - Automatic transmission only
 *   - Gas or hybrid powertrain (no EVs)
 *   - All-in price = headline (CDW/LDW + supplemental liability bundled)
 *   - Bare rental price kept as smaller secondary line for transparency
 *
 * Lead picks: the three SEA-roundtrip cards (hybrid SUV via Costco, hybrid SUV
 * via Enterprise direct, mid-size sedan). Less common shapes — mid-size SUV,
 * BLI roundtrip, SEA→BLI open-jaw, Turo peer-to-peer — live in the disclosure.
 *
 * Unpaved-road contract note is surfaced explicitly. Hertz/Avis/Budget/
 * Enterprise/Alamo all restrict gravel roads; Cascade River Rd is technically
 * a contract violation. Reader needs to know that, then decide.
 */

import { POWERTRAIN_LABELS, RENTAL_OPTIONS, type RentalOption } from '../data/rental';
import { h, section } from '../dom';

// Lead picks = the SEA-roundtrip trio. All three trip paths default to SEA RT flights.
const LEAD_IDS = new Set([
  'sea-rt-hybrid-suv-costco',
  'sea-rt-hybrid-suv-enterprise',
  'sea-rt-sedan',
]);

function renderInsuranceBreakdown(option: RentalOption): HTMLElement {
  return h(
    'details',
    { class: 'rental-card__breakdown' },
    h('summary', { class: 'rental-card__breakdown-summary' }, 'Insurance breakdown (per day)'),
    h(
      'dl',
      { class: 'rental-card__breakdown-list' },
      h('dt', {}, 'Base + tax'),
      h('dd', {}, option.insuranceBreakdown.base),
      h('dt', {}, 'CDW / LDW'),
      h('dd', {}, option.insuranceBreakdown.cdw),
      h('dt', {}, 'SLI (supplemental liability)'),
      h('dd', {}, option.insuranceBreakdown.sli),
      h('dt', { class: 'rental-card__breakdown-total' }, 'Daily all-in'),
      h('dd', { class: 'rental-card__breakdown-total' }, option.insuranceBreakdown.totalDaily)
    )
  );
}

function renderCard(option: RentalOption): HTMLElement {
  const sameLocation = option.pickup === option.dropoff;
  const routing = sameLocation
    ? `${option.pickup} · roundtrip`
    : `${option.pickup} → ${option.dropoff}`;

  return h(
    'article',
    { class: `card rental-card rental-card--${option.powertrain}` },
    h(
      'header',
      { class: 'card__header' },
      h('h3', { class: 'card__title' }, option.label),
      h(
        'span',
        { class: `badge badge--${option.powertrain === 'hybrid' ? 'good' : 'info'}` },
        POWERTRAIN_LABELS[option.powertrain]
      )
    ),
    h('p', { class: 'card__subtitle' }, option.vehicleType),
    h('p', { class: 'rental-card__specs' }, option.specs),
    h(
      'div',
      { class: 'rental-card__price-block' },
      h('p', { class: 'rental-card__price-allin' }, h('strong', {}, option.costAllIn)),
      h('p', { class: 'rental-card__price-bare' }, option.costBare),
      h(
        'p',
        { class: 'rental-card__price-note' },
        'Headline includes CDW/LDW + supplemental liability. PAI not included (usually skip).'
      )
    ),
    renderInsuranceBreakdown(option),
    h(
      'dl',
      { class: 'card__facts' },
      h('dt', {}, 'Routing'),
      h('dd', {}, routing),
      h('dt', {}, 'Vendor'),
      h('dd', {}, option.vendor),
      h('dt', {}, 'Pairs with'),
      h('dd', {}, option.pairsWith)
    ),
    h('p', { class: 'card__note' }, option.tradeoff),
    h(
      'p',
      { class: 'rental-card__cta' },
      h(
        'a',
        {
          class: 'rental-card__book-link',
          href: option.bookingLink,
          target: '_blank',
          rel: 'noopener noreferrer',
        },
        'Open booking page →'
      )
    )
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
      'automatic transmission, gas or hybrid powertrain, prices include full insurance (CDW/LDW + supplemental liability).'
    ),
    h(
      'div',
      { class: 'rental__unpaved-note' },
      h('strong', {}, 'Heads-up on Cascade River Rd: '),
      'all major US rental brands (Hertz, Avis, Enterprise, Budget, Alamo, National) restrict driving on unpaved roads in their contracts. The final ~13 mi to the Cascade Pass trailhead is NPS-maintained gravel — sedan-passable in August, routinely driven by tourists — but technically a contract violation that can void CDW. ',
      h(
        'a',
        {
          href: 'https://www.nps.gov/noca/planyourvisit/cascade-river-road.htm',
          target: '_blank',
          rel: 'noopener noreferrer',
        },
        'NPS road status'
      ),
      '. Mitigations: premium-credit-card primary CDW (Chase Sapphire Reserve, Amex Platinum) covers where rental contract does not; some Turo hosts explicitly allow gravel forest roads.'
    ),
    h(
      'ul',
      { class: 'gist' },
      h(
        'li',
        { class: 'gist__item' },
        'Hybrid Compact SUV via Costco Travel is the simplest fit — RAV4/CR-V Hybrid class, ~40 mpg, full second-driver included, 10–25% under brand-direct.'
      ),
      h(
        'li',
        { class: 'gist__item' },
        'Mid-size sedan is the cheapest meets-brief; sedan-on-gravel works in August but adds ~5–10 mph of careful driving on Cascade River Rd.'
      ),
      h(
        'li',
        { class: 'gist__item' },
        'Lead picks all pair with the SEA-roundtrip flight that all three trip paths default to.'
      ),
      h(
        'li',
        { class: 'gist__item' },
        h(
          'a',
          { href: 'https://www.autoslash.com/', target: '_blank', rel: 'noopener noreferrer' },
          'AutoSlash'
        ),
        ' is worth a 2-minute parallel quote — it shops coupons + member rates across brands and emails comparison results. Not a direct booking surface, but useful as a price-tracker once you book.'
      )
    ),
    h('div', { class: 'card-grid' }, ...lead.map(renderCard)),
    alt.length > 0
      ? h(
          'details',
          { class: 'disclosure' },
          h(
            'summary',
            { class: 'disclosure__summary' },
            `Less common shapes — mid-size SUV, BLI base, open-jaw, peer-to-peer (${alt.length})`
          ),
          h(
            'p',
            { class: 'disclosure__lede' },
            'Different vehicle classes, pickup locations, or rental shapes. Same hard rules apply — automatic, gas or hybrid, all-in pricing.'
          ),
          h('div', { class: 'card-grid' }, ...alt.map(renderCard))
        )
      : null
  );
}
