/**
 * costs.ts — visual budget breakdown per path × tier.
 *
 * Per TRAVEL.md section 1 — "Costs page UX" + stacked-bar pattern.
 * Allison May 16: "also give range of budget options" — answered by 3 tiers per path.
 *
 * Layout:
 *   - TLDR (≤50 words above the fold) — range per path × tier
 *   - Stacked-bar pattern: 3 paths side-by-side, each with low/mid/high pills
 *   - Per-category breakdown table (flights/rental/lodging/food/activities/fuel/contingency)
 *   - Includes/excludes line at bottom
 *   - Verified date pill
 */

import { PATH_COSTS, tierTotal, pathRange, COSTS_NOTES, type CostTier } from '../data/costs';
import { getSelectedPath, subscribeSelectedPath } from '../state/path';
import { h, section } from '../dom';
import { renderSectionSources } from './section-sources';

function usd(n: number): string {
  return '$' + n.toLocaleString('en-US');
}

function tierBar(tier: CostTier, max: number): HTMLElement {
  const total = tierTotal(tier);
  const pct = Math.round((total / max) * 100);
  const tierLabel =
    tier.tier === 'low' ? 'Low' : tier.tier === 'mid' ? 'Mid' : 'High';
  return h(
    'div',
    { class: `costs-bar costs-bar--${tier.tier}` },
    h(
      'div',
      { class: 'costs-bar__head' },
      h('span', { class: 'costs-bar__tier-label' }, tierLabel),
      h('span', { class: 'costs-bar__total' }, usd(total))
    ),
    h(
      'div',
      { class: 'costs-bar__track' },
      h('div', {
        class: 'costs-bar__fill',
        style: `width: ${pct}%`,
      })
    ),
    h('p', { class: 'costs-bar__summary' }, tier.summary)
  );
}

function renderCategoryTable(tier: CostTier): HTMLElement {
  const total = tierTotal(tier);
  return h(
    'table',
    { class: 'costs-table' },
    h(
      'thead',
      {},
      h(
        'tr',
        {},
        h('th', { scope: 'col' }, 'Category'),
        h('th', { scope: 'col' }, 'What'),
        h('th', { scope: 'col', class: 'costs-table__amount' }, 'USD')
      )
    ),
    h(
      'tbody',
      {},
      ...tier.categories.map((c) =>
        h(
          'tr',
          {},
          h('th', { scope: 'row' }, c.label),
          h('td', {}, c.note),
          h('td', { class: 'costs-table__amount' }, usd(c.amount))
        )
      ),
      h(
        'tr',
        { class: 'costs-table__total-row' },
        h('th', { scope: 'row' }, 'Total'),
        h('td', {}, ''),
        h('td', { class: 'costs-table__amount' }, usd(total))
      )
    )
  );
}

function renderPathBlock(pathCost: (typeof PATH_COSTS)[number], maxTotal: number, highlight: boolean): HTMLElement {
  const range = pathRange(pathCost);
  return h(
    'article',
    {
      class: `costs-path${highlight ? ' costs-path--active' : ''}`,
      'data-path-id': pathCost.pathId,
    },
    h(
      'header',
      { class: 'costs-path__header' },
      h('h3', { class: 'costs-path__title' }, pathCost.pathName),
      h(
        'p',
        { class: 'costs-path__range' },
        h('strong', {}, `${usd(range.low)} – ${usd(range.high)}`),
        ' total for 2 travelers · mid ',
        h('strong', {}, usd(range.mid))
      )
    ),
    h(
      'div',
      { class: 'costs-path__bars' },
      ...pathCost.tiers.map((t) => tierBar(t, maxTotal))
    ),
    h(
      'details',
      { class: 'disclosure costs-path__detail' },
      h(
        'summary',
        { class: 'disclosure__summary' },
        'Per-category breakdown · all three tiers'
      ),
      ...pathCost.tiers.map((t, i) =>
        h(
          'div',
          { class: 'costs-tier-block' },
          h(
            'h4',
            { class: 'costs-tier-block__title' },
            `Tier ${i + 1} · ${t.tier === 'low' ? 'Low' : t.tier === 'mid' ? 'Mid' : 'High'} · ${usd(tierTotal(t))}`
          ),
          renderCategoryTable(t)
        )
      )
    )
  );
}

export function renderCosts(): HTMLElement {
  const maxTotal = Math.max(
    ...PATH_COSTS.flatMap((p) => p.tiers.map((t) => tierTotal(t)))
  );

  const wrap = section(
    'costs',
    'Budget — three paths × three tiers',
    h(
      'p',
      { class: 'section__lede' },
      'Total for two travelers, 5 days, all-in (flights + 5-day rental with CDW+SLI + 4 nights cabin + groceries + passes + fuel + 10% buffer). Tier = booking-and-stay choices, not trip ambition.'
    ),
    renderSectionSources({
      label: 'Sources',
      sources: [
        { name: 'Costco Travel · live SEA Aug 16-20 quote', url: 'https://www.costcotravel.com/Rental-Cars' },
        { name: 'Google Flights · NYC↔SEA', url: 'https://www.google.com/travel/flights' },
        { name: 'Booking + Airbnb listings per lodging.ts', url: '#' },
      ],
      asOf: COSTS_NOTES.asOf,
    }),
    h('div', { class: 'costs-paths' })
  );

  function paint(selectedId: string | null): void {
    const container = wrap.querySelector<HTMLElement>('.costs-paths');
    if (!container) return;
    container.replaceChildren(
      ...PATH_COSTS.map((p) =>
        renderPathBlock(p, maxTotal, selectedId === p.pathId)
      )
    );
  }

  paint(getSelectedPath());
  subscribeSelectedPath(paint);

  wrap.append(
    h(
      'div',
      { class: 'costs-fineprint' },
      h('p', { class: 'costs-fineprint__line' }, h('strong', {}, 'Includes: '), COSTS_NOTES.includes),
      h('p', { class: 'costs-fineprint__line' }, h('strong', {}, 'Excludes: '), COSTS_NOTES.excludes),
      h(
        'p',
        { class: 'costs-fineprint__verified' },
        h('span', { class: 'badge badge--good' }, `Verified ${COSTS_NOTES.asOf}`)
      )
    )
  );

  return wrap;
}
