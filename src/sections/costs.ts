/**
 * costs.ts — Wave 3 GENIUS UX pass (May 17, 2026).
 *
 * Spec: 5-second-grasp test. Allison or Erin opens on mobile, must answer
 * in 5 seconds:
 *   - Roughly what does each path cost?      → BIG TOTAL on each card
 *   - Roughly what's my share?               → per-person split right below
 *   - What's the biggest line item?          → category bar visually emphasizes lodging
 *   - What's flexible if we need to trim?    → locked/flexible flag + concrete trim moves
 *
 * Layout:
 *   1. Global tier toggle (Lean / Standard / Splurge) sets all 3 cards.
 *   2. Three big path hero cards. HUGE total. Per-person split. Per-card tier override.
 *   3. Compare strip (only when no path selected) — 3 mini-totals to nudge a pick.
 *   4. Active-path category breakdown — rows with icon, label, locked/flex chip, amount,
 *      mini bar, deep-link to source page.
 *   5. Trim suggestions — "If you need to trim $X…" with concrete moves.
 *   6. Splitwise CTA — bottom of page. Split rules + button.
 *   7. USD only. No ILS. No EUR.
 */

import {
  PATH_COSTS,
  tierTotal,
  pathRange,
  perPersonShare,
  findPath,
  findTier,
  TIER_LABEL,
  COSTS_NOTES,
  type PathCost,
  type Tier,
  type PathLetter,
  type CategoryKey,
} from '../data/costs';
import { getSelectedPath, setSelectedPath, subscribeSelectedPath } from '../state/path';
import { h, section } from '../dom';
import { renderSectionSources } from './section-sources';

const TIER_STORAGE_KEY = 'ncades2026.costsTier';
const PER_PATH_TIER_KEY = 'ncades2026.costsTier.path';

function usd(n: number): string {
  return '$' + n.toLocaleString('en-US');
}

function readStoredTier(): Tier {
  try {
    const v = localStorage.getItem(TIER_STORAGE_KEY);
    if (v === 'low' || v === 'mid' || v === 'high') return v;
  } catch {
    // ignore
  }
  return 'mid';
}
function persistTier(t: Tier): void {
  try {
    localStorage.setItem(TIER_STORAGE_KEY, t);
  } catch {
    // ignore
  }
}

function readPerPathTier(pathId: PathLetter, fallback: Tier): Tier {
  try {
    const v = localStorage.getItem(`${PER_PATH_TIER_KEY}.${pathId}`);
    if (v === 'low' || v === 'mid' || v === 'high') return v;
  } catch {
    // ignore
  }
  return fallback;
}
function persistPerPathTier(pathId: PathLetter, t: Tier): void {
  try {
    localStorage.setItem(`${PER_PATH_TIER_KEY}.${pathId}`, t);
  } catch {
    // ignore
  }
}

// ─────────────────────────────────────────────────────────────
// Tier toggle (segmented control)
// ─────────────────────────────────────────────────────────────
function renderTierToggle(
  current: Tier,
  onChange: (t: Tier) => void,
  options: { compact?: boolean; ariaLabel: string }
): HTMLElement {
  const tiers: Tier[] = ['low', 'mid', 'high'];
  const wrap = h('div', {
    class: `costs-toggle${options.compact ? ' costs-toggle--compact' : ''}`,
    role: 'group',
    'aria-label': options.ariaLabel,
  });
  for (const t of tiers) {
    const btn = h(
      'button',
      {
        type: 'button',
        class: `costs-toggle__btn${t === current ? ' costs-toggle__btn--active' : ''}`,
        'data-tier': t,
        'aria-pressed': t === current ? 'true' : 'false',
      },
      TIER_LABEL[t]
    );
    btn.addEventListener('click', () => onChange(t));
    wrap.appendChild(btn);
  }
  return wrap;
}

function pathContextLine(pathId: PathLetter): string {
  switch (pathId) {
    case 'A':
      return '4 nights west side · 2 travelers · all-in';
    case 'B':
      return '2 west + 2 east · 2 travelers · all-in';
  }
}

// ─────────────────────────────────────────────────────────────
// Path hero card (big total + per-person + per-card tier toggle)
// ─────────────────────────────────────────────────────────────
function renderPathHero(
  pathCost: PathCost,
  tier: Tier,
  isActive: boolean,
  onTierChange: (t: Tier) => void,
  onSelectPath: () => void
): HTMLElement {
  const t = findTier(pathCost, tier);
  const total = tierTotal(t);
  const pp = perPersonShare(t);
  const range = pathRange(pathCost);

  const card = h(
    'article',
    {
      class: `costs-hero${isActive ? ' costs-hero--active' : ''}`,
      'data-path-id': pathCost.pathId,
    },
    h(
      'header',
      { class: 'costs-hero__head' },
      h('span', { class: 'costs-hero__chip' }, `Path ${pathCost.pathId}`),
      h('h3', { class: 'costs-hero__title' }, pathCost.pathName.replace(/^Path [AB] · /, ''))
    ),
    h(
      'div',
      { class: 'costs-hero__numbers' },
      h(
        'div',
        { class: 'costs-hero__total-wrap' },
        h('div', { class: 'costs-hero__total' }, usd(total)),
        h('div', { class: 'costs-hero__total-label' }, 'total for 2')
      ),
      h(
        'div',
        { class: 'costs-hero__pp-wrap' },
        h(
          'div',
          { class: 'costs-hero__pp' },
          usd(pp),
          h('span', { class: 'costs-hero__pp-suffix' }, ' / person')
        ),
        h('div', { class: 'costs-hero__pp-label' }, 'your share after splitting')
      )
    ),
    h('p', { class: 'costs-hero__context' }, pathContextLine(pathCost.pathId)),
    renderTierToggle(tier, onTierChange, {
      compact: true,
      ariaLabel: `Tier for ${pathCost.pathName}`,
    }),
    h(
      'p',
      { class: 'costs-hero__range' },
      'Range: ',
      h('strong', {}, usd(range.low)),
      ' (Lean) – ',
      h('strong', {}, usd(range.high)),
      ' (Splurge)'
    )
  );

  card.addEventListener('click', (ev) => {
    const target = ev.target as HTMLElement | null;
    if (!target) return;
    if (target.closest('.costs-toggle__btn')) return; // tier buttons handle themselves
    onSelectPath();
  });

  return card;
}

// ─────────────────────────────────────────────────────────────
// Active-path category breakdown
// ─────────────────────────────────────────────────────────────
const CATEGORY_ICON: Record<CategoryKey, string> = {
  flights: '✈',
  rental: '🚙',
  lodging: '🏡',
  food: '🛒',
  activities: '🥾',
  fuel: '⛽',
  contingency: '🪙',
};

function renderBreakdown(pathCost: PathCost, tier: Tier): HTMLElement {
  const t = findTier(pathCost, tier);
  const total = tierTotal(t);
  const maxAmount = Math.max(...t.categories.map((c) => c.amount));

  return h(
    'div',
    { class: 'costs-breakdown' },
    h(
      'header',
      { class: 'costs-breakdown__head' },
      h(
        'h3',
        { class: 'costs-breakdown__title' },
        `Where the money goes · Path ${pathCost.pathId} · ${TIER_LABEL[tier]}`
      ),
      h(
        'p',
        { class: 'costs-breakdown__total' },
        h('strong', {}, usd(total)),
        ' total · ',
        h('strong', {}, usd(perPersonShare(t))),
        ' per person'
      )
    ),
    h(
      'ul',
      { class: 'costs-rows' },
      ...t.categories.map((c) => {
        const pct = Math.round((c.amount / maxAmount) * 100);
        const isBiggest = c.amount === maxAmount;
        return h(
          'li',
          { class: `costs-row${isBiggest ? ' costs-row--biggest' : ''}` },
          h(
            'div',
            { class: 'costs-row__main' },
            h('span', { class: 'costs-row__icon', 'aria-hidden': 'true' }, CATEGORY_ICON[c.key]),
            h(
              'div',
              { class: 'costs-row__text' },
              h(
                'div',
                { class: 'costs-row__label-line' },
                h('span', { class: 'costs-row__label' }, c.label),
                h(
                  'span',
                  {
                    class: `costs-row__flex costs-row__flex--${c.flex}`,
                    title:
                      c.flex === 'locked'
                        ? 'Mostly locked once booked'
                        : 'Flexible — compressible if budget tight',
                  },
                  c.flex === 'locked' ? '🔒 Locked' : '🔓 Flex'
                )
              ),
              h('div', { class: 'costs-row__note' }, c.note),
              h(
                'a',
                {
                  class: 'costs-row__source',
                  href: c.sourceHref,
                  'aria-label': c.sourceLabel,
                },
                'source ↗'
              )
            )
          ),
          h(
            'div',
            { class: 'costs-row__amount-wrap' },
            h('div', { class: 'costs-row__amount' }, usd(c.amount)),
            h(
              'div',
              { class: 'costs-row__bar' },
              h('div', { class: 'costs-row__bar-fill', style: `width: ${pct}%` })
            )
          )
        );
      })
    )
  );
}

// ─────────────────────────────────────────────────────────────
// Trim suggestions
// ─────────────────────────────────────────────────────────────
function renderTrims(pathCost: PathCost, tier: Tier): HTMLElement {
  const t = findTier(pathCost, tier);
  const totalSavings = t.trims.reduce((sum, m) => sum + m.saves, 0);
  return h(
    'div',
    { class: 'costs-trims' },
    h(
      'h3',
      { class: 'costs-trims__title' },
      `If you need to trim ~${usd(totalSavings)}…`
    ),
    h(
      'p',
      { class: 'costs-trims__lede' },
      'Stack as needed.'
    ),
    h(
      'ul',
      { class: 'costs-trims__list' },
      ...t.trims.map((m) =>
        h(
          'li',
          { class: 'costs-trim' },
          h('span', { class: 'costs-trim__label' }, m.label),
          h('span', { class: 'costs-trim__saves' }, '−' + usd(m.saves))
        )
      )
    )
  );
}

// ─────────────────────────────────────────────────────────────
// Splitwise CTA
// ─────────────────────────────────────────────────────────────
function renderSplitwise(pathCost: PathCost, tier: Tier): HTMLElement {
  const t = findTier(pathCost, tier);
  const pp = perPersonShare(t);
  return h(
    'aside',
    { class: 'costs-splitwise' },
    h('h3', { class: 'costs-splitwise__title' }, 'Split with Erin via Splitwise'),
    h(
      'p',
      { class: 'costs-splitwise__lede' },
      'Roughly ',
      h('strong', {}, usd(pp)),
      ' each.'
    ),
    h(
      'ul',
      { class: 'costs-splitwise__rules' },
      h('li', {}, h('strong', {}, 'Lodging'), ' — 50 / 50.'),
      h('li', {}, h('strong', {}, 'Rental car + fuel'), ' — 50 / 50.'),
      h('li', {}, h('strong', {}, 'Groceries'), ' — 50 / 50. Treat-meals = whoever pays at the table.'),
      h('li', {}, h('strong', {}, 'Flights'), ' — independent (each books their own seat).'),
      h('li', {}, h('strong', {}, 'Activities + passes'), ' — 50 / 50 unless one person opts out (e.g. one spa pass).')
    ),
    h(
      'a',
      {
        class: 'costs-splitwise__cta',
        href: 'https://www.splitwise.com/',
        rel: 'noopener noreferrer',
        target: '_blank',
      },
      'Open Splitwise ↗'
    )
  );
}

// ─────────────────────────────────────────────────────────────
// Compare-all strip (when no path is selected)
// ─────────────────────────────────────────────────────────────
function renderCompareStrip(
  globalTier: Tier,
  onPickPath: (id: PathLetter) => void
): HTMLElement {
  return h(
    'div',
    { class: 'costs-compare' },
    h(
      'p',
      { class: 'costs-compare__lede' },
      'Pick a path:'
    ),
    h(
      'div',
      { class: 'costs-compare__row' },
      ...PATH_COSTS.map((p) => {
        const t = findTier(p, globalTier);
        const total = tierTotal(t);
        const pp = perPersonShare(t);
        const btn = h(
          'button',
          {
            type: 'button',
            class: 'costs-compare__btn',
            'data-path-id': p.pathId,
          },
          h('span', { class: 'costs-compare__btn-path' }, `Path ${p.pathId}`),
          h('span', { class: 'costs-compare__btn-total' }, usd(total)),
          h('span', { class: 'costs-compare__btn-pp' }, usd(pp) + ' / person')
        );
        btn.addEventListener('click', () => onPickPath(p.pathId));
        return btn;
      })
    )
  );
}

// ─────────────────────────────────────────────────────────────
// Main entrypoint
// ─────────────────────────────────────────────────────────────
export function renderCosts(): HTMLElement {
  let globalTier: Tier = readStoredTier();

  const wrap = section(
    'costs',
    'Budget — 5-second grasp',
    h(
      'p',
      { class: 'section__lede' },
      'Tap a path card to see its full breakdown.'
    ),
    renderSectionSources({
      label: 'Sources',
      sources: [
        {
          name: 'Costco Travel · live SEA Aug 16-20 quote (rental)',
          url: 'https://www.costcotravel.com/Rental-Cars',
        },
        { name: 'Google Flights + Expedia · NYC↔SEA Aug 2026', url: 'https://www.google.com/travel/flights' },
        { name: 'AAA Gas Prices · WA · $5.78/gal May 19, 2026', url: 'https://gasprices.aaa.com/?state=WA' },
        { name: 'NPS · America the Beautiful $80 (2026)', url: 'https://store.usgs.gov/2026-resident-annual-pass' },
        { name: 'NCI Skagit Tours · Diablo Lake afternoon $35/adult', url: 'https://ncascades.org/signup/programs/skagit-tours' },
        { name: 'Booking + Airbnb listings per Lodging page', url: 'lodging.html' },
      ],
      asOf: COSTS_NOTES.asOf,
    })
  );

  const globalToggleWrap = h(
    'div',
    { class: 'costs-global-toggle' },
    h('span', { class: 'costs-global-toggle__label' }, 'Show me:'),
    renderTierToggle(
      globalTier,
      (t) => {
        globalTier = t;
        persistTier(t);
        for (const p of PATH_COSTS) persistPerPathTier(p.pathId, t);
        paintAll();
      },
      { ariaLabel: 'Global tier toggle' }
    )
  );

  const heroRow = h('div', { class: 'costs-hero-row' });
  const breakdownSlot = h('div', { class: 'costs-breakdown-slot' });
  const trimsSlot = h('div', { class: 'costs-trims-slot' });
  const splitwiseSlot = h('div', { class: 'costs-splitwise-slot' });
  const compareSlot = h('div', { class: 'costs-compare-slot' });

  function paintHero(selectedId: PathLetter | null): void {
    heroRow.replaceChildren(
      ...PATH_COSTS.map((p) => {
        const tier = readPerPathTier(p.pathId, globalTier);
        return renderPathHero(
          p,
          tier,
          selectedId === p.pathId,
          (t) => {
            persistPerPathTier(p.pathId, t);
            paintAll();
          },
          () => {
            setSelectedPath(p.pathId);
          }
        );
      })
    );
  }

  function paintBreakdown(selectedId: PathLetter | null): void {
    if (!selectedId) {
      breakdownSlot.replaceChildren();
      trimsSlot.replaceChildren();
      splitwiseSlot.replaceChildren();
      compareSlot.replaceChildren(
        renderCompareStrip(globalTier, (id) => setSelectedPath(id))
      );
      return;
    }
    const path = findPath(selectedId);
    const tier = readPerPathTier(selectedId, globalTier);
    breakdownSlot.replaceChildren(renderBreakdown(path, tier));
    trimsSlot.replaceChildren(renderTrims(path, tier));
    splitwiseSlot.replaceChildren(renderSplitwise(path, tier));
    compareSlot.replaceChildren();
  }

  function paintAll(): void {
    const id = getSelectedPath();
    paintHero(id);
    paintBreakdown(id);
  }

  paintAll();
  subscribeSelectedPath(paintAll);

  wrap.append(
    globalToggleWrap,
    heroRow,
    compareSlot,
    breakdownSlot,
    trimsSlot,
    splitwiseSlot,
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
