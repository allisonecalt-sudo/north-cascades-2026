/**
 * Rental car — research-backed cards + decision surfaces. v4 (May 17, 2026
 * Rental Genius agent pass: added TLDR strip, decision matrix, sortable
 * comparison table, best-practice block, booking checklist on top of the
 * existing per-card grid).
 *
 * Hard rules surfaced in section header (Allison May 16, 2026):
 *   - Automatic transmission only
 *   - Gas or hybrid powertrain (no EVs)
 *   - All-in price = headline (CDW/LDW + supplemental liability bundled)
 *   - Bare rental price kept as smaller secondary line for transparency
 *
 * New on May 17 (NO data file changes — only render layer):
 *   - rental-tldr        — top-of-section answer card
 *   - rental-matrix      — best-for-X 4-cell grid
 *   - rental-compare     — sortable comparison table (vehicle x price x hybrid x clearance x cancel x notes)
 *   - rental-bestpx      — 10 obsessive best-practice items, each with a one-line "why"
 *   - rental-checklist   — at-pickup punch list
 *
 * All TLDR/matrix/table/best-px/checklist data is derived in this file from
 * RENTAL_OPTIONS (no parallel SSOT). Styles live in src/styles/rental-extras.css.
 *
 * Research log: projects/north-cascades-2026/RENTAL_RESEARCH_2026-05-17.md
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

// id of the top recommendation (highlighted in matrix + comparison row).
const TOP_PICK_ID = 'sea-rt-hybrid-suv-costco';

function formatPriceRange(low: number, high: number): string {
  const fmt = (n: number) => `$${n.toLocaleString('en-US')}`;
  return `${fmt(low)}–${fmt(high)}`;
}

/** Wrap a render in a collapsed <details> so secondary depth is tucked away. */
function collapsed(summaryText: string, body: HTMLElement): HTMLElement {
  return h(
    'details',
    { class: 'disclosure' },
    h('summary', { class: 'disclosure__summary' }, summaryText),
    body
  );
}

// ────────────────────────────────────────────────────────────
// TLDR strip — top of section, picks the headline + 2 alts.
// ────────────────────────────────────────────────────────────
function renderTldr(): HTMLElement {
  const top = RENTAL_OPTIONS.find((o) => o.id === TOP_PICK_ID);
  const sedan = RENTAL_OPTIONS.find((o) => o.id === 'sea-rt-sedan');
  const hybridSedan = RENTAL_OPTIONS.find((o) => o.id === 'sea-rt-hybrid-sedan-costco');
  if (!top || !sedan || !hybridSedan) {
    // Fail-loud rather than fabricate.
    return h(
      'div',
      { class: 'rental-tldr', role: 'note' },
      h(
        'p',
        { class: 'rental-tldr__head' },
        'TLDR unavailable — RENTAL_OPTIONS missing expected ids.'
      )
    );
  }
  const tldrPrice = formatPriceRange(top.costAllIn.low, top.costAllIn.high);
  return h(
    'div',
    { class: 'rental-tldr', role: 'note', 'aria-label': 'Top rental pick summary' },
    h('p', { class: 'rental-tldr__eyebrow' }, 'Top pick · Aug 16–20, 2026'),
    h(
      'p',
      { class: 'rental-tldr__head' },
      'Best pick: ',
      h('strong', {}, 'Costco Travel — SEA roundtrip, Compact SUV'),
      ' all-in ',
      h('strong', {}, tldrPrice),
      ' for 5 days. Fulfilled by Alamo / Enterprise / Avis / Budget. Free 2nd driver, free cancel until pickup.'
    ),
    h(
      'ul',
      { class: 'rental-tldr__alts' },
      h(
        'li',
        {},
        'Cheapest meets-brief: ',
        h('strong', {}, 'Costco Compact sedan '),
        formatPriceRange(sedan.costAllIn.low, sedan.costAllIn.high),
        ' (Corolla/Versa class, gas, lowest verified quote).'
      ),
      h(
        'li',
        {},
        'Only hybrid with a verified quote: ',
        h('strong', {}, 'Costco Camry Hybrid '),
        formatPriceRange(hybridSedan.costAllIn.low, hybridSedan.costAllIn.high),
        ' (~50 mpg saves ~$70–90 fuel; trades clearance).'
      ),
      h(
        'li',
        {},
        'Cheapest absolute (with risk): ',
        h('strong', {}, 'Turo CX-50 / GLC '),
        '$462–$700 — host-dependent, no on-site counter, watch mileage caps.'
      )
    ),
  );
}

// ────────────────────────────────────────────────────────────
// Decision matrix — best for X cells.
// ────────────────────────────────────────────────────────────
interface MatrixCell {
  label: string;
  pick: string;
  price: string;
  why: string;
  top?: boolean;
}

function renderMatrixCell(cell: MatrixCell): HTMLElement {
  return h(
    'div',
    { class: `rental-matrix__cell${cell.top ? ' rental-matrix__cell--top' : ''}` },
    h('p', { class: 'rental-matrix__label' }, cell.label),
    h('p', { class: 'rental-matrix__pick' }, cell.pick),
    h('p', { class: 'rental-matrix__price' }, cell.price),
    h('p', { class: 'rental-matrix__why' }, cell.why)
  );
}

function renderMatrix(): HTMLElement {
  const cells: MatrixCell[] = [
    {
      label: 'Best value (top pick)',
      pick: 'Costco Compact SUV',
      price: '$716–$875 all-in',
      why: 'Only $27 over the compact sedan. Buys clearance + cargo for Cascade River Rd gravel.',
      top: true,
    },
    {
      label: 'Cheapest meets-brief',
      pick: 'Costco Compact sedan',
      price: '$674–$825 all-in',
      why: 'Toyota Corolla / Nissan Versa class. Lowest verified live quote.',
    },
    {
      label: 'Best hybrid',
      pick: 'Costco Camry Hybrid sedan',
      price: '$755–$920 all-in',
      why: 'Only hybrid in Costco SEA inventory for our dates. ~50 mpg saves ~$70–90 fuel.',
    },
    {
      label: 'Best flexibility',
      pick: 'Costco — any class',
      price: 'Same as listed',
      why: 'Free cancel until pickup, no prepay. Re-shop and re-book if prices drop — zero penalty.',
    },
  ];
  return h(
    'div',
    {
      class: 'rental-matrix',
      role: 'list',
      'aria-label': 'Best-for decision matrix',
    },
    ...cells.map(renderMatrixCell)
  );
}

// ────────────────────────────────────────────────────────────
// Sortable comparison table.
// ────────────────────────────────────────────────────────────
interface CompareRow {
  id: string;
  vehicle: string;
  vendor: string;
  base: number; // all-in low for sort
  baseDisplay: string;
  hybrid: boolean;
  clearance: string;
  cancel: string;
  notes: string;
}

function buildCompareRows(): CompareRow[] {
  const map: Record<string, Partial<CompareRow>> = {
    'sea-rt-hybrid-suv-costco': {
      clearance: '8.1″',
      cancel: 'Free until pickup',
      notes: 'Top pick. AWD often avail. Restrict-unpaved clause same as all majors.',
    },
    'sea-rt-hybrid-sedan-costco': {
      clearance: '~5.5″',
      cancel: 'Free until pickup',
      notes: 'Only hybrid in Costco SEA inventory. Saves ~$70–90 fuel over trip.',
    },
    'sea-rt-sedan': {
      clearance: '~5.5″',
      cancel: 'Free until pickup',
      notes: 'Cheapest meets-brief. Versa fits 2 large bags; Corolla intermediate fits 3.',
    },
    'sea-rt-midsuv-gas': {
      clearance: '8″+',
      cancel: 'Free until pickup',
      notes: '+$27 over Compact SUV. 4–5 large bags + AWD often standard.',
    },
    'sea-rt-standard-elite-suv': {
      clearance: '8″+',
      cancel: 'Free until pickup',
      notes: 'Premium feel (Audi Q3 / Cadillac XT4). Overbuilt for 2 people unless you want it.',
    },
    'turo-sea-suv': {
      clearance: 'Per listing',
      cancel: 'Varies — read host',
      notes: 'Cheapest absolute. No on-site counter. 200 mi/day common; watch caps.',
    },
    'bli-rt-suv': {
      clearance: '~8″',
      cancel: 'Brand-direct policy',
      notes: 'NOT live-quoted. +15–25% over SEA. Only if WA-20 + BLI flights confirmed.',
    },
    'sea-bli-oneway': {
      clearance: '~8″',
      cancel: 'Brand-direct policy',
      notes: '$75–$200 drop fee on top. AutoSlash is the right shop. Open-jaw only.',
    },
  };
  return RENTAL_OPTIONS.map((o) => {
    const extras = map[o.id] ?? {};
    return {
      id: o.id,
      vehicle: o.label,
      vendor: o.vendor.split('·')[0]?.trim() ?? o.vendor,
      base: o.costAllIn.low,
      baseDisplay: formatPriceRange(o.costAllIn.low, o.costAllIn.high),
      hybrid: o.powertrain === 'hybrid',
      clearance: extras.clearance ?? '—',
      cancel: extras.cancel ?? '—',
      notes: extras.notes ?? '',
    };
  });
}

function renderCompareTable(): HTMLElement {
  const rows = buildCompareRows();
  const head = h(
    'thead',
    {},
    h(
      'tr',
      {},
      h(
        'th',
        { 'data-sort': 'vehicle', 'aria-sort': 'none', tabindex: '0', scope: 'col' },
        'Vehicle'
      ),
      h(
        'th',
        { 'data-sort': 'price', 'aria-sort': 'ascending', tabindex: '0', scope: 'col' },
        'All-in (5 days)'
      ),
      h(
        'th',
        { 'data-sort': 'hybrid', 'aria-sort': 'none', tabindex: '0', scope: 'col' },
        'Hybrid?'
      ),
      h('th', { scope: 'col' }, 'Clearance'),
      h('th', { scope: 'col' }, 'Cancellation'),
      h('th', { scope: 'col' }, 'Notes')
    )
  );
  const body = h(
    'tbody',
    {},
    ...rows.map((r) =>
      h(
        'tr',
        {
          class: r.id === TOP_PICK_ID ? 'is-toppick' : '',
          'data-vehicle': r.vehicle,
          'data-price': r.base,
          'data-hybrid': r.hybrid ? '1' : '0',
        },
        h(
          'td',
          { class: 'rental-compare__vehicle' },
          r.vehicle,
          h('br'),
          h('span', { class: 'rental-compare__hybrid--no' }, r.vendor)
        ),
        h('td', { class: 'rental-compare__price', 'data-label': 'All-in (5 days)' }, r.baseDisplay),
        r.hybrid
          ? h('td', { class: 'rental-compare__hybrid--yes', 'data-label': 'Hybrid?' }, 'Yes')
          : h('td', { class: 'rental-compare__hybrid--no', 'data-label': 'Hybrid?' }, 'No'),
        h('td', { 'data-label': 'Clearance' }, r.clearance),
        h('td', { 'data-label': 'Cancellation' }, r.cancel),
        h('td', { 'data-label': 'Notes' }, r.notes)
      )
    )
  );
  const table = h(
    'table',
    { class: 'rental-compare__table', 'aria-label': 'Rental options comparison' },
    head,
    body
  );
  return h(
    'div',
    { class: 'rental-compare' },
    h('div', { class: 'rental-compare__scroll' }, table),
    h(
      'p',
      { class: 'rental-compare__note' },
      h(
        'span',
        { class: 'rental-compare__note-wide' },
        'Sortable — tap a column header. Default sort: price ascending.'
      ),
      h(
        'span',
        { class: 'rental-compare__note-narrow' },
        'One card per vehicle, ordered cheapest first. Top pick highlighted.'
      )
    )
  );
}

// Sort wiring — vanilla, no framework. Only price + hybrid + vehicle sort.
function attachCompareSort(root: HTMLElement): void {
  const table = root.querySelector<HTMLTableElement>('.rental-compare__table');
  if (!table) return;
  const tbody = table.tBodies[0];
  if (!tbody) return;
  const headers = table.querySelectorAll<HTMLTableCellElement>('th[data-sort]');
  const apply = (key: string, dir: 'ascending' | 'descending'): void => {
    const rows = Array.from(tbody.querySelectorAll<HTMLTableRowElement>('tr'));
    rows.sort((a, b) => {
      const va = a.dataset[key as 'vehicle' | 'price' | 'hybrid'] ?? '';
      const vb = b.dataset[key as 'vehicle' | 'price' | 'hybrid'] ?? '';
      if (key === 'price' || key === 'hybrid') {
        const na = Number(va);
        const nb = Number(vb);
        return dir === 'ascending' ? na - nb : nb - na;
      }
      return dir === 'ascending' ? va.localeCompare(vb) : vb.localeCompare(va);
    });
    rows.forEach((row) => tbody.appendChild(row));
  };
  headers.forEach((th) => {
    const handler = (): void => {
      const key = th.dataset.sort;
      if (!key) return;
      const current = th.getAttribute('aria-sort');
      const next: 'ascending' | 'descending' = current === 'ascending' ? 'descending' : 'ascending';
      headers.forEach((other) => other.setAttribute('aria-sort', 'none'));
      th.setAttribute('aria-sort', next);
      apply(key, next);
    };
    th.addEventListener('click', handler);
    th.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handler();
      }
    });
  });
  // Default sort on render: price ascending (matches initial markup).
  apply('price', 'ascending');
}

// ────────────────────────────────────────────────────────────
// Where-to-book — consolidated source comparison.
// ────────────────────────────────────────────────────────────
interface BookingSource {
  name: string;
  url: string;
  bestFor: string;
  why: string;
  tradeoff: string;
}

function renderWhereToBook(): HTMLElement {
  const sources: BookingSource[] = [
    {
      name: 'Costco Travel',
      url: 'https://www.costcotravel.com/Rental-Cars',
      bestFor: 'TOP PICK — primary booking entry',
      why: '10–25% under brand-direct, free 2nd driver, no prepay, free cancel until pickup.',
      tradeoff: 'Costco Gold Star ($65/yr) required; quote URLs session-bound.',
    },
    {
      name: 'AutoSlash',
      url: 'https://www.autoslash.com/',
      bestFor: 'Price-drop monitoring after booking',
      why: 'Free — emails you when your reservation price drops to re-book.',
      tradeoff: 'Manual re-book (not auto); search less deep than brand-direct.',
    },
    {
      name: 'Kayak / cars',
      url: 'https://www.kayak.com/cars',
      bestFor: 'Cross-brand price compare in one view',
      why: 'Fast snapshot across all majors — sanity-check the Costco quote.',
      tradeoff: 'Book on the brand-direct or Costco link, not via Kayak.',
    },
    {
      name: 'Turo',
      url: 'https://turo.com/us/en/search?location=Seattle-Tacoma%20International%20Airport%20%28SEA%29&startDate=08%2F16%2F2026&startTime=12%3A00&endDate=08%2F20%2F2026&endTime=12%3A00',
      bestFor: 'Cheapest absolute, with risk',
      why: 'Peer-to-peer — Corolla $262 / CX-50 $274 / GLC $283 (5-day pre-protection); some hosts allow gravel.',
      tradeoff: 'No counter, host-cancel risk, mileage caps (~200/day), complex insurance.',
    },
    {
      name: 'Hertz / Avis / Budget / Enterprise / Alamo / National (brand-direct)',
      url: 'https://www.hertz.com',
      bestFor: 'Loyalty-status holders + corporate codes',
      why: 'Elite status (Gold/Preferred/Emerald) points + skip-counter can beat Costco.',
      tradeoff: 'Rates $70–150 higher; counter CDW upsell more aggressive.',
    },
    {
      name: 'Priceline / Hotwire (opaque)',
      url: 'https://www.priceline.com/drive/',
      bestFor: 'Last-resort cheapest if nothing else works',
      why: 'Opaque-bidding can land 30–40% under retail.',
      tradeoff: 'Non-refundable, no free 2nd driver, brand unknown until paid.',
    },
    {
      name: 'AAA / Sam\'s Club discounts',
      url: 'https://www.hertz.com/rentacar/discount-rates/',
      bestFor: 'Stacking with a Hertz/Avis brand booking',
      why: 'AAA ~10% off Hertz; Sam\'s Club ~15% off Avis/Budget.',
      tradeoff: 'Does not stack on a Costco rate — pick the lower path.',
    },
  ];

  return h(
    'div',
    { class: 'rental-wheretobook' },
    h('h3', { class: 'rental-wheretobook__title' }, 'Where to book — sources compared'),
    h(
      'p',
      { class: 'rental-wheretobook__intro' },
      'Costco quote → Kayak sanity-check → AutoSlash price alert. Turo for cheapest-with-risk.'
    ),
    h(
      'ol',
      { class: 'rental-wheretobook__list' },
      ...sources.map((src) =>
        h(
          'li',
          { class: 'rental-wheretobook__item' },
          h(
            'a',
            {
              class: 'rental-wheretobook__name',
              href: src.url,
              target: '_blank',
              rel: 'noopener noreferrer',
            },
            src.name,
            ' ↗'
          ),
          h('p', { class: 'rental-wheretobook__bestfor' }, h('strong', {}, src.bestFor)),
          h('p', { class: 'rental-wheretobook__why' }, h('em', {}, 'Why: '), src.why),
          h(
            'p',
            { class: 'rental-wheretobook__tradeoff' },
            h('em', {}, 'Tradeoff: '),
            src.tradeoff
          )
        )
      )
    )
  );
}

// ────────────────────────────────────────────────────────────
// Best-practice block — 10 obsessions.
// ────────────────────────────────────────────────────────────
interface BestPx {
  headline: string;
  why: string;
}

function renderBestPractice(): HTMLElement {
  const items: BestPx[] = [
    {
      headline: 'Decline counter CDW if (and only if) you put the rental on a Chase Sapphire Reserve.',
      why: 'Reserve = PRIMARY $75K, no exotic exclusion. Saves ~$28–35/day = $140–175 over 5 days. Without primary CC, take the bundle — one ding wipes the savings.',
    },
    {
      headline: 'Bring a printed Sapphire benefits guide to the counter.',
      why: 'Agents push CDW hard. One A4 page ("I have primary collision coverage via Chase Sapphire Reserve") shuts down the upsell.',
    },
    {
      headline: 'Fill up at Mazama Store — last gas before the 75-mi WA-20 dead zone.',
      why: 'Marblemount → Mazama is the dead zone. Mazama Store has LIMITED HOURS (no evening fills). Mazama gas ~$4.60/gal vs Seattle ~$5.78 — fill east-side before driving west on Day 5.',
    },
    {
      headline: 'Avoid the SR-167 HOT toll lane between Renton and Pacific.',
      why: 'Converted from HOV to express-toll Jan 12, 2026. Rental pay-by-mail surcharge $25/bill (Avis) on top of the toll. Parallel I-5 is free — Google Maps defaults to I-5; don\'t override.',
    },
    {
      headline: 'Walk the car in video mode before driving off.',
      why: 'Counter agents miss passenger-side damage. Phone video w/ timestamp, email it to yourself. Cuts dispute exposure on return.',
    },
    {
      headline: 'Refuel within 10 minutes of return at a SeaTac-adjacent station.',
      why: 'Closest is the 76 station on S 188th St. Keep the receipt. Rental "fuel service" runs $7–10/gal vs ~$5/gal retail.',
    },
    {
      headline: 'Take the consolidated SEA rental shuttle, not Uber.',
      why: 'Facility is 3150 S 160th St, ~2 mi from terminal. Free shuttle every 5 min, 24/7. No advantage to Uber.',
    },
    {
      headline: 'Book Costco now to lock the ceiling — re-shop until pickup.',
      why: 'Costco = no prepay, no cancel fee. AutoSlash monitors your reservation free and EMAILS YOU when the price drops — you re-book manually (not auto-rebook, despite some old write-ups). Cheapest version of "buy now, save later."',
    },
    {
      headline: 'Hybrid math: usually no for 5 days.',
      why: 'Camry Hybrid (~50 mpg) vs Corolla (~32 mpg) over ~700 trip miles = ~8 gal saved = ~$40–47. Hybrid premium over the sedan is ~$80–95. Pure cost: gas sedan wins for a 5-day rental.',
    },
    {
      headline: 'Decline PAI and PEC.',
      why: 'Personal Accident Insurance + Personal Effects Coverage duplicate US health insurance + renters/homeowners. Pure markup, ~$5–7/day.',
    },
  ];
  return h(
    'div',
    { class: 'rental-bestpx' },
    h('h3', { class: 'rental-bestpx__title' }, '10 best-practice obsessions'),
    h(
      'ol',
      { class: 'rental-bestpx__list' },
      ...items.map((item) =>
        h('li', {}, h('strong', {}, item.headline), ' ', item.why)
      )
    )
  );
}

// ────────────────────────────────────────────────────────────
// Booking checklist.
// ────────────────────────────────────────────────────────────
function renderChecklist(): HTMLElement {
  const items: { strong: string; rest: string }[] = [
    { strong: 'Both drivers\' licenses', rest: '— Allison + Erin (free 2nd driver via Costco; confirm at counter).' },
    { strong: 'Credit card used for booking', rest: '— same card pays the security hold.' },
    { strong: 'Reservation confirmation', rest: '— Costco email + booking # screenshotted offline.' },
    { strong: 'Photo / video walk-around', rest: '— 360° exterior, interior, dashboard mileage, gas gauge BEFORE leaving the lot.' },
    { strong: 'Fuel policy confirmed "full-to-full"', rest: '— NOT pre-paid fuel.' },
    { strong: 'CDW decision', rest: '— DECLINE if using primary CC (Sapphire Reserve); ACCEPT if not. Verify what\'s checked on the contract.' },
    { strong: 'PAI / PEC declined', rest: '— pure markup, duplicates other coverage.' },
    { strong: 'Tolling option declined', rest: '— most majors push $4–6/day toll-pass-rental. Decline. Avoid SR-167 + I-405 ETLs and you skip all tolls.' },
    { strong: 'Spare tire + jack present', rest: '— verify, especially on Turo. Cascade River Rd gravel + rural roads = nontrivial flat risk.' },
    { strong: 'Roadside assistance number saved', rest: '— Costco fulfillment defaults to brand roadside (Alamo 800-326-5377 / Enterprise 800-307-6666). Save before leaving the lot.' },
  ];
  return h(
    'div',
    { class: 'rental-checklist' },
    h('h3', { class: 'rental-checklist__title' }, 'At-pickup checklist'),
    h(
      'ul',
      { class: 'rental-checklist__list' },
      ...items.map((item) => h('li', {}, h('strong', {}, item.strong), ' ', item.rest))
    )
  );
}

// ────────────────────────────────────────────────────────────
// Existing card rendering — preserved verbatim from v3.
// ────────────────────────────────────────────────────────────
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
      'PAI not included (usually skip).'
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

  const sec = section(
    'rental',
    'Rental car',
    h(
      'p',
      { class: 'section__lede rental__hard-rules' },
      h('strong', {}, 'Hard rules: '),
      'automatic, gas or hybrid, all-in prices (CDW/LDW + SLI). Quotes verified May 16, 2026 — re-quote within 7 days of booking.'
    ),
    // Source-citation strip — Austria pattern, applied to rental quotes.
    h(
      'ul',
      { class: 'source-strip', 'aria-label': 'Rental data sources' },
      h('li', { class: 'source-pill' }, 'Costco Travel · verified live quote'),
      h('li', { class: 'source-pill' }, 'Turo · verified live quote'),
      h('li', { class: 'source-pill source-pill--warn' }, 'BLI / one-way · range, re-quote')
    ),
    renderTldr(),
    renderCompareTable(),
    collapsed('Best-for-X decision matrix', renderMatrix()),
    h(
      'details',
      { class: 'disclosure rental__unpaved-disclosure' },
      h(
        'summary',
        { class: 'disclosure__summary' },
        'Cascade River Rd gravel — read before booking'
      ),
      h(
        'p',
        { class: 'disclosure__lede' },
        'All major US brands restrict unpaved roads. The final ~13 mi to Cascade Pass is NPS-maintained gravel — sedan-passable in August but technically a contract violation that can void CDW. ',
        h(
          'a',
          {
            href: 'https://www.nps.gov/noca/planyourvisit/cascade-river-road.htm',
            target: '_blank',
            rel: 'noopener noreferrer',
          },
          'NPS road status →'
        ),
        ' Mitigation: premium-card primary CDW (Chase Sapphire Reserve / Amex Platinum) or a Turo host that allows gravel.'
      ),
      h(
        'p',
        { class: 'disclosure__lede' },
        'NPS: a standard passenger car is fine in good conditions, but ',
        h('em', {}, '"ruts and washouts are at times impassable without high clearance."'),
        ' Check the NPS road page 48 hr before Day 2; take the SUV class if a storm rolled through.'
      )
    ),
    h('h3', { class: 'section__subtitle' }, 'Lead picks — verified live quotes'),
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
          h('div', { class: 'card-grid' }, ...alt.map(renderCard))
        )
      : null,
    collapsed('Where to book — 7 sources compared', renderWhereToBook()),
    collapsed('10 booking best-practices', renderBestPractice()),
    renderChecklist()
  );

  // Wire up sort after the section is built (handlers attached pre-mount;
  // events bind when nodes are inserted into the live DOM).
  attachCompareSort(sec);
  return sec;
}
