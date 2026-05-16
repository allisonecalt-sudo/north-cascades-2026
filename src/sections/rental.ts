/**
 * Rental car — research-backed cards with REAL quotes, pros/cons, and
 * multiple booking links per option. v3 (May 16, 2026 update).
 *
 * Hard rules surfaced in section header (Allison May 16, 2026):
 *   - Automatic transmission only
 *   - Gas or hybrid powertrain (no EVs)
 *   - All-in price = headline (CDW/LDW + supplemental liability bundled)
 *   - Bare rental price kept as smaller secondary line for transparency
 *
 * Each card carries:
 *   - Structured `costAllIn` (low-high + source + sourceUrl + quotedDate)
 *   - Pros + cons (3-5 specific items each)
 *   - Multiple bookingLinks (primary + aggregator backup)
 *   - sources[] for audit trail
 *
 * Lead picks (now 3 verified-live-quote cards):
 *   1. SEA RT Compact SUV via Costco — $716-875 all-in
 *   2. SEA RT Hybrid sedan via Costco — $755-920 all-in
 *   3. SEA RT Compact sedan via Costco — $674-825 all-in (cheapest meets-brief)
 *
 * Less-common shapes in disclosure: Mid-size SUV, Standard Elite SUV, Turo,
 * BLI roundtrip, SEA→BLI open-jaw.
 *
 * Unpaved-road contract note is surfaced explicitly. Hertz/Avis/Budget/
 * Enterprise/Alamo all restrict gravel roads; Cascade River Rd is technically
 * a contract violation. Reader needs to know that, then decide.
 */

import {
  POWERTRAIN_LABELS,
  RENTAL_OPTIONS,
  type BookingLink,
  type RentalOption,
} from '../data/rental';
import { h, section } from '../dom';

// Lead picks = the SEA-roundtrip trio with VERIFIED LIVE QUOTES.
const LEAD_IDS = new Set([
  'sea-rt-hybrid-suv-costco',
  'sea-rt-hybrid-sedan-costco',
  'sea-rt-sedan',
]);

function formatPriceRange(low: number, high: number): string {
  const fmt = (n: number) => `$${n.toLocaleString('en-US')}`;
  return `${fmt(low)}–${fmt(high)}`;
}

function renderQuotedPrice(option: RentalOption): HTMLElement {
  const { low, high, quotedDate, source, sourceUrl } = option.costAllIn;
  return h(
    'div',
    { class: 'rental-card__price-block' },
    h(
      'p',
      { class: 'rental-card__price-allin' },
      h('strong', {}, `${formatPriceRange(low, high)} all-in (5 days, CDW + SLI bundled)`)
    ),
    h('p', { class: 'rental-card__price-bare' }, option.costBare),
    h(
      'p',
      { class: 'rental-card__price-source' },
      h('em', {}, `Quoted ${quotedDate}. `),
      h(
        'a',
        {
          href: sourceUrl,
          target: '_blank',
          rel: 'noopener noreferrer',
          class: 'rental-card__source-link',
        },
        'Source ↗'
      ),
      ` — ${source}`
    ),
    h(
      'p',
      { class: 'rental-card__price-note' },
      'Headline includes CDW/LDW + supplemental liability. PAI not included (usually skip).'
    )
  );
}

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

function renderProsCons(option: RentalOption): HTMLElement {
  return h(
    'div',
    { class: 'rental-card__proscons' },
    h(
      'div',
      { class: 'rental-card__pros' },
      h('h4', { class: 'rental-card__proscons-title rental-card__proscons-title--pros' }, 'Pros'),
      h(
        'ul',
        { class: 'rental-card__proscons-list' },
        ...option.pros.map((p) => h('li', {}, p))
      )
    ),
    h(
      'div',
      { class: 'rental-card__cons' },
      h('h4', { class: 'rental-card__proscons-title rental-card__proscons-title--cons' }, 'Cons'),
      h(
        'ul',
        { class: 'rental-card__proscons-list' },
        ...option.cons.map((c) => h('li', {}, c))
      )
    )
  );
}

function renderBookingLinks(option: RentalOption): HTMLElement {
  const linkNodes = option.bookingLinks.map((link: BookingLink) =>
    h(
      'li',
      { class: 'rental-card__booking-link-item' },
      h(
        'a',
        {
          class: 'rental-card__book-link',
          href: link.url,
          target: '_blank',
          rel: 'noopener noreferrer',
        },
        link.label + ' →'
      ),
      link.note ? h('span', { class: 'rental-card__booking-link-note' }, ` ${link.note}`) : null
    )
  );

  return h(
    'div',
    { class: 'rental-card__cta' },
    h('p', { class: 'rental-card__booking-label' }, 'Booking links'),
    h('ul', { class: 'rental-card__booking-list' }, ...linkNodes)
  );
}

function renderSources(option: RentalOption): HTMLElement | null {
  if (!option.sources || option.sources.length === 0) return null;
  return h(
    'details',
    { class: 'rental-card__sources' },
    h(
      'summary',
      { class: 'rental-card__sources-summary' },
      `Sources (${option.sources.length})`
    ),
    h(
      'ul',
      { class: 'rental-card__sources-list' },
      ...option.sources.map((s) => h('li', {}, s))
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
    renderQuotedPrice(option),
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
    renderProsCons(option),
    h('p', { class: 'card__note' }, option.tradeoff),
    renderBookingLinks(option),
    renderSources(option)
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
      'automatic transmission, gas or hybrid powertrain, prices include full insurance (CDW/LDW + supplemental liability). All quotes verified May 16, 2026 for Aug 16-20 pickup window.'
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
        'Cheapest verified live quote (May 16, 2026): Turo Toyota Corolla at $262 5-day pre-tax-pre-protection. Cheapest full-stack major: Costco Compact sedan at $674-825 all-in.'
      ),
      h(
        'li',
        { class: 'gist__item' },
        'Costco Travel is the consistent value across classes — fulfilled by Alamo/Enterprise/Avis/Budget, 10-25% under brand-direct, free additional driver included.'
      ),
      h(
        'li',
        { class: 'gist__item' },
        'Mid-size SUV is only $27 over Compact SUV at Costco — verified May 16 quote. Worth the bump for clearance + cargo if you want margin on Cascade River Rd gravel.'
      ),
      h(
        'li',
        { class: 'gist__item' },
        h(
          'a',
          { href: 'https://www.autoslash.com/', target: '_blank', rel: 'noopener noreferrer' },
          'AutoSlash'
        ),
        ' is the right shop for one-way drop fees and coupon hunting — emails comparison results across brands. Not a direct booking surface but useful as a price-tracker after booking.'
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
            `Less common shapes — mid-size SUV, Standard Elite, Turo, BLI base, open-jaw (${alt.length})`
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
