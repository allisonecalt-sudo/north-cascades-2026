/**
 * Lodging chip bar — filter UI + sold-out banner.
 *
 * Extracted 2026-05-17 (Lodging Refactor agent) from `sections/lodging.ts`.
 * Owns:
 *   - `ChipDef` interface
 *   - `buildChipDefs()`     — per-group chip definitions
 *   - `renderChipBar()`     — full bar render (filter chips, clear btn,
 *                              showing-count pill, sold-out banner, delegated
 *                              click handler)
 *   - `updateChipBar(bar)`  — in-place active-state refresh after a filter
 *                              mutation (called from the orchestrator's
 *                              onFilterChange subscriber)
 *
 * Reads/writes the shared `filters` singleton from `filter-state.ts`.
 */

import {
  EAST_LODGING,
  NATURE_LABELS,
  WEST_LODGING,
  type NatureTag,
} from '../../data/lodging';
import { h } from '../../dom';
import {
  activeFilterCount,
  currentShowingCount,
  filters,
  notifyFilters,
  resetFilters,
  soldOutCount,
} from './filter-state';

export interface ChipDef {
  key: string;
  label: string;
  group: 'trust' | 'base' | 'tier' | 'beds' | 'kitchen' | 'nature' | 'sunset' | 'cancel';
  isActive: () => boolean;
  toggle: () => void;
}

export function buildChipDefs(): ChipDef[] {
  const chips: ChipDef[] = [];

  // Trust-mode (Allison 2026-05-19) — page-default narrowing to ONLY the
  // 4 Aug-16-20 personally-verified picks. ON by default. Lives in its
  // own group at the very top of the chip bar so the trust posture is
  // the first thing a visitor reads. Un-checking widens the list to the
  // 15 verify-at-booking entries (sold-out stays hidden via its own
  // toggle).
  chips.push({
    key: 'trust-verified-only',
    label: '✅ Verified picks only',
    group: 'trust',
    isActive: () => filters.verifiedOnly,
    toggle: () => {
      filters.verifiedOnly = !filters.verifiedOnly;
      notifyFilters();
    },
  });

  // Base
  for (const v of ['west', 'east'] as const) {
    chips.push({
      key: `base-${v}`,
      label: v === 'west' ? 'West side' : 'East side',
      group: 'base',
      isActive: () => filters.base.has(v),
      toggle: () => {
        if (filters.base.has(v)) filters.base.delete(v);
        else filters.base.add(v);
        notifyFilters();
      },
    });
  }

  // Tier
  const tierLabels: Record<'lean' | 'standard' | 'mid-high', string> = {
    lean: 'Lean (<$200)',
    standard: 'Standard ($200-300)',
    'mid-high': 'Mid-high ($300+)',
  };
  for (const v of ['lean', 'standard', 'mid-high'] as const) {
    chips.push({
      key: `tier-${v}`,
      label: tierLabels[v],
      group: 'tier',
      isActive: () => filters.tier.has(v),
      toggle: () => {
        if (filters.tier.has(v)) filters.tier.delete(v);
        else filters.tier.add(v);
        notifyFilters();
      },
    });
  }

  // Beds
  chips.push({
    key: 'beds-min2',
    label: '2 beds min',
    group: 'beds',
    isActive: () => filters.bedsMin2,
    toggle: () => {
      filters.bedsMin2 = !filters.bedsMin2;
      notifyFilters();
    },
  });

  // Kitchen
  const kitchenLabels = { full: 'Full kitchen', kitchenette: 'Kitchenette', none: 'No kitchen' } as const;
  for (const v of ['full', 'kitchenette', 'none'] as const) {
    chips.push({
      key: `kitchen-${v}`,
      label: kitchenLabels[v],
      group: 'kitchen',
      isActive: () => filters.kitchen.has(v),
      toggle: () => {
        if (filters.kitchen.has(v)) filters.kitchen.delete(v);
        else filters.kitchen.add(v);
        notifyFilters();
      },
    });
  }

  // Nature — trimmed 2026-05-17 (Allison's call): keep lakeside / riverside /
  // woods only. Dropped mountain-view, ranch-acreage, town-center (less
  // differentiating for her preference set). Drops 3 chips.
  const natureChips: NatureTag[] = ['lakeside', 'riverside', 'woods'];
  for (const v of natureChips) {
    chips.push({
      key: `nature-${v}`,
      label: NATURE_LABELS[v],
      group: 'nature',
      isActive: () => filters.nature.has(v),
      toggle: () => {
        if (filters.nature.has(v)) filters.nature.delete(v);
        else filters.nature.add(v);
        notifyFilters();
      },
    });
  }

  // Sunset chip removed 2026-05-17 (Allison's call): "drop sunset/path
  // overlap". Sunset-having lodging is still surfaced via the per-card
  // sunset row + sorted naturally — just not a filter anymore.

  // Free-cancellation toggle — added 2026-05-17 evening per Allison's
  // booking-discipline ask. Default OFF (don't gatekeep while research
  // data is still landing). When ON, narrows to freeCancellation === 'yes'
  // ONLY. Lives in its own group ('cancel') so the visual hierarchy stays
  // legible — it's a hard booking-policy filter, not a property attribute
  // like setting or kitchen.
  chips.push({
    key: 'cancel-free-only',
    label: '✓ Free cancellation',
    group: 'cancel',
    isActive: () => filters.freeCancelOnly,
    toggle: () => {
      filters.freeCancelOnly = !filters.freeCancelOnly;
      notifyFilters();
    },
  });

  return chips;
}

export function renderChipBar(): HTMLElement {
  const chips = buildChipDefs();
  const groupOrder: ChipDef['group'][] = ['trust', 'base', 'tier', 'beds', 'kitchen', 'nature', 'cancel'];
  const groupLabels: Record<ChipDef['group'], string> = {
    trust: 'Trust mode',
    base: 'Base',
    tier: 'Price tier',
    beds: 'Beds',
    kitchen: 'Kitchen',
    nature: 'Setting',
    sunset: 'Bonus',
    cancel: 'Cancellation',
  };

  const groups = groupOrder.map((g) => {
    const groupChips = chips.filter((c) => c.group === g);
    const buttons = groupChips.map((c) =>
      h(
        'button',
        {
          type: 'button',
          class: c.isActive() ? 'chip chip--active' : 'chip',
          'aria-pressed': c.isActive() ? 'true' : 'false',
          'data-chip-key': c.key,
        },
        c.label
      )
    );
    return h(
      'div',
      { class: 'chip-group', 'data-group': g },
      h('span', { class: 'chip-group__label' }, groupLabels[g]),
      h('div', { class: 'chip-group__chips' }, ...buttons)
    );
  });

  const count = activeFilterCount();
  const clearBtn = h(
    'button',
    {
      type: 'button',
      class: count > 0 ? 'chip-clear chip-clear--visible' : 'chip-clear',
      'data-action': 'clear-filters',
    },
    `Clear filters (${count})`
  );

  // Showing-count pill — Booking.com "X of Y showing" affordance. Updates
  // live when filters change via updateChipBar().
  const showingCount = currentShowingCount();
  const totalCount = WEST_LODGING.length + EAST_LODGING.length;
  const showingPill = h(
    'span',
    {
      class: 'chip-showing',
      'data-showing-pill': 'true',
      'aria-live': 'polite',
    },
    `${showingCount} of ${totalCount} showing`
  );

  // Sold-out banner — only renders when there ARE sold-out entries AND they're
  // currently being hidden. Click flips showSoldOut to true.
  const hiddenSoldOut = soldOutCount();
  const soldOutBanner =
    hiddenSoldOut > 0 && !filters.showSoldOut
      ? h(
          'div',
          {
            class: 'chip-bar__soldout-banner',
            'data-soldout-banner': 'true',
            role: 'note',
          },
          `Hiding ${hiddenSoldOut} sold-out propert${hiddenSoldOut === 1 ? 'y' : 'ies'} — `,
          h(
            'button',
            { type: 'button', class: 'link-btn', 'data-action': 'show-sold-out' },
            'show all'
          )
        )
      : null;

  const bar = h(
    'div',
    { class: 'chip-bar', role: 'group', 'aria-label': 'Filter properties' },
    h(
      'div',
      { class: 'chip-bar__head' },
      h('p', { class: 'chip-bar__lede' }, 'Tap chips to narrow. Empty = show all.'),
      showingPill
    ),
    h('div', { class: 'chip-bar__groups' }, ...groups),
    clearBtn,
    soldOutBanner
  );

  // Delegated click handler
  bar.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLButtonElement)) return;
    if (target.dataset['action'] === 'clear-filters') {
      resetFilters();
      notifyFilters();
      return;
    }
    if (target.dataset['action'] === 'show-sold-out') {
      filters.showSoldOut = true;
      notifyFilters();
      return;
    }
    const key = target.dataset['chipKey'];
    if (!key) return;
    const def = chips.find((c) => c.key === key);
    if (def) def.toggle();
  });

  return bar;
}

export function updateChipBar(bar: HTMLElement): void {
  const chips = buildChipDefs();
  const buttons = bar.querySelectorAll<HTMLButtonElement>('button.chip');
  buttons.forEach((btn) => {
    const key = btn.dataset['chipKey'];
    const def = chips.find((c) => c.key === key);
    if (!def) return;
    const active = def.isActive();
    btn.classList.toggle('chip--active', active);
    btn.setAttribute('aria-pressed', active ? 'true' : 'false');
  });
  const count = activeFilterCount();
  const clearBtn = bar.querySelector<HTMLButtonElement>('button.chip-clear');
  if (clearBtn) {
    clearBtn.classList.toggle('chip-clear--visible', count > 0);
    clearBtn.textContent = `Clear filters (${count})`;
  }
  // Refresh the "X of Y showing" pill.
  const showingPill = bar.querySelector<HTMLElement>('[data-showing-pill="true"]');
  if (showingPill) {
    const total = WEST_LODGING.length + EAST_LODGING.length;
    showingPill.textContent = `${currentShowingCount()} of ${total} showing`;
  }
}
