/**
 * activities.ts — Airbnb-tier presentation pass (2026-05-17).
 *
 * Promoted from a buried sub-section on the Details page to its own top-level
 * page. Allison's live-site note: *"Add activities and also a lot of missing
 * photos."* — readers couldn't find activities because the nav didn't surface
 * them.
 *
 * What this rewrite does (matches the hikes section pattern):
 *   1. Photo carousel per activity via `renderPhotoCarousel` (the shared
 *      module). 3-5 photos where curated.
 *   2. At-a-glance pill row: category / duration / cost / equipment / kid /
 *      drive-from-base / verified-DATE — like lodging + hikes.
 *   3. Filter chip bar above the grid: side / category / cost / kid-friendly /
 *      rentals-on-site — Booking.com behavior (empty = show all).
 *   4. "X of Y showing" live counter when filters apply.
 *   5. Per-side groupings preserved as headings underneath the chip bar.
 *   6. "Ruled out" disclosure preserved (fail-loud transparency about why some
 *      things aren't here).
 */

import { ACTIVITIES, RULED_OUT, type Activity, type ActivityCategory, type ActivityCost } from '../data/activities';
import { h, section } from '../dom';
import { renderSectionSources } from './section-sources';
import { renderPhotoCarousel, type CarouselPhoto } from './photo-carousel';

// ====================================================================
// FILTER CHIP STATE
// ====================================================================

interface ActivityFilterState {
  side: Set<'west' | 'east'>;
  category: Set<ActivityCategory>;
  cost: Set<ActivityCost>;
  kidFriendly: boolean;
  rentalsOnSite: boolean;
}

function emptyFilters(): ActivityFilterState {
  return {
    side: new Set(),
    category: new Set(),
    cost: new Set(),
    kidFriendly: false,
    rentalsOnSite: false,
  };
}

const filters: ActivityFilterState = emptyFilters();
const filterListeners: (() => void)[] = [];

function notifyFilters(): void {
  for (const fn of filterListeners) fn();
}
function onFilterChange(fn: () => void): void {
  filterListeners.push(fn);
}

function categoryOf(act: Activity): ActivityCategory {
  return act.category ?? 'general';
}

function activityMatchesFilters(act: Activity): boolean {
  if (filters.side.size > 0) {
    const s = act.side ?? 'either';
    if (s === 'either') {
      // either matches any side filter
    } else if (!filters.side.has(s)) {
      return false;
    }
  }
  if (filters.category.size > 0 && !filters.category.has(categoryOf(act))) return false;
  if (filters.cost.size > 0 && !filters.cost.has(act.costTier)) return false;
  if (filters.kidFriendly && act.kidFriendly !== true) return false;
  if (filters.rentalsOnSite && act.rentalsOnSite !== true) return false;
  return true;
}

function activeFilterCount(): number {
  return (
    filters.side.size +
    filters.category.size +
    filters.cost.size +
    (filters.kidFriendly ? 1 : 0) +
    (filters.rentalsOnSite ? 1 : 0)
  );
}

function currentShowingCount(): number {
  return ACTIVITIES.filter(activityMatchesFilters).length;
}

// ====================================================================
// PILLS + helpers
// ====================================================================

const CATEGORY_LABEL: Record<ActivityCategory, string> = {
  water: '🛶 Water',
  town: '🏘 Town',
  wildlife: '🦌 Wildlife',
  general: '✨ Other',
};

const COST_LABEL: Record<ActivityCost, string> = {
  free: '🆓 Free',
  low: '💲 Low',
  mid: '💲💲 Mid',
  high: '💲💲💲 High',
};

function sideEmoji(side: Activity['side']): string {
  if (side === 'west') return '🌲';
  if (side === 'east') return '☀';
  return '↔';
}

function sideLabel(side: Activity['side']): string {
  if (side === 'west') return 'West side';
  if (side === 'east') return 'East side';
  return 'Either side';
}

function renderActivityPills(act: Activity): HTMLElement {
  const items: (HTMLElement | null)[] = [];
  const pill = (cls: string, text: string): HTMLElement => h('li', { class: cls }, text);

  items.push(pill('card__pill', CATEGORY_LABEL[categoryOf(act)]));
  items.push(pill('card__pill', `⏱ ${act.time}`));
  items.push(pill('card__pill', COST_LABEL[act.costTier]));
  items.push(pill('card__pill', `${sideEmoji(act.side)} ${sideLabel(act.side)}`));
  if (act.driveFromBase) items.push(pill('card__pill', `🚗 ${act.driveFromBase}`));
  if (act.equipment) items.push(pill('card__pill', `🎒 ${act.equipment}`));
  if (act.rentalsOnSite) items.push(pill('card__pill card__pill--good', '✅ Rentals on-site'));
  if (act.kidFriendly) items.push(pill('card__pill', '👶 Kid-friendly'));
  if (act.verifiedAsOf) {
    items.push(pill('card__pill card__pill--good', `✅ Verified ${act.verifiedAsOf}`));
  }

  return h('ul', { class: 'card__pills', 'aria-label': 'At a glance' }, ...items);
}

// ====================================================================
// CARDS
// ====================================================================

function activityPhotos(act: Activity): CarouselPhoto[] {
  if (act.photos && act.photos.length > 0) return [...act.photos];
  return [];
}

function renderActivityCard(act: Activity): HTMLElement {
  const photos = activityPhotos(act);

  return h(
    'article',
    {
      class: `card activity-card activity-card--${categoryOf(act)}`,
      'data-activity-id': act.id,
    },
    photos.length > 0
      ? renderPhotoCarousel(photos, { ariaLabel: `Photos of ${act.name}` })
      : null,
    h(
      'header',
      { class: 'card__header' },
      h('h3', { class: 'card__title' }, act.name),
      h('span', { class: 'activities__path-fit' }, act.pathFit)
    ),
    h('p', { class: 'card__subtitle' }, act.where),
    renderActivityPills(act),
    h('p', { class: 'card__note' }, act.description),
    h(
      'p',
      { class: 'card__source activity-card__cost' },
      h('strong', {}, 'Cost: '),
      act.cost
    ),
    act.sourceUrl
      ? h(
          'p',
          { class: 'card__source' },
          h(
            'a',
            { href: act.sourceUrl, rel: 'noopener', target: '_blank' },
            (act.sourceLabel ?? 'Source') + ' →'
          )
        )
      : null
  );
}

// ====================================================================
// FILTER CHIP BAR
// ====================================================================

interface ChipDef {
  key: string;
  label: string;
  group: 'side' | 'category' | 'cost' | 'kid' | 'rentals';
  isActive: () => boolean;
  toggle: () => void;
}

function buildChipDefs(): ChipDef[] {
  const chips: ChipDef[] = [];

  for (const v of ['west', 'east'] as const) {
    chips.push({
      key: `side-${v}`,
      label: v === 'west' ? 'West side' : 'East side',
      group: 'side',
      isActive: () => filters.side.has(v),
      toggle: () => {
        if (filters.side.has(v)) filters.side.delete(v);
        else filters.side.add(v);
        notifyFilters();
      },
    });
  }

  const catOrder: ActivityCategory[] = ['water', 'town', 'wildlife', 'general'];
  for (const v of catOrder) {
    chips.push({
      key: `cat-${v}`,
      label: CATEGORY_LABEL[v],
      group: 'category',
      isActive: () => filters.category.has(v),
      toggle: () => {
        if (filters.category.has(v)) filters.category.delete(v);
        else filters.category.add(v);
        notifyFilters();
      },
    });
  }

  const costOrder: ActivityCost[] = ['free', 'low', 'mid', 'high'];
  for (const v of costOrder) {
    chips.push({
      key: `cost-${v}`,
      label: COST_LABEL[v],
      group: 'cost',
      isActive: () => filters.cost.has(v),
      toggle: () => {
        if (filters.cost.has(v)) filters.cost.delete(v);
        else filters.cost.add(v);
        notifyFilters();
      },
    });
  }

  chips.push({
    key: 'kid-friendly',
    label: '👶 Kid-friendly',
    group: 'kid',
    isActive: () => filters.kidFriendly,
    toggle: () => {
      filters.kidFriendly = !filters.kidFriendly;
      notifyFilters();
    },
  });

  chips.push({
    key: 'rentals-on-site',
    label: '✅ Rentals on-site',
    group: 'rentals',
    isActive: () => filters.rentalsOnSite,
    toggle: () => {
      filters.rentalsOnSite = !filters.rentalsOnSite;
      notifyFilters();
    },
  });

  return chips;
}

function renderChipBar(): HTMLElement {
  const chips = buildChipDefs();
  const groupOrder: ChipDef['group'][] = ['side', 'category', 'cost', 'kid', 'rentals'];
  const groupLabels: Record<ChipDef['group'], string> = {
    side: 'Side',
    category: 'Kind',
    cost: 'Cost',
    kid: 'Kid',
    rentals: 'Rentals',
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

  const showingPill = h(
    'span',
    {
      class: 'chip-showing',
      'data-showing-pill': 'true',
      'aria-live': 'polite',
    },
    `${currentShowingCount()} of ${ACTIVITIES.length} showing`
  );

  const bar = h(
    'div',
    { class: 'chip-bar', role: 'group', 'aria-label': 'Filter activities' },
    h(
      'div',
      { class: 'chip-bar__head' },
      h('p', { class: 'chip-bar__lede' }, 'Tap chips to narrow. Empty = show all.'),
      showingPill
    ),
    h('div', { class: 'chip-bar__groups' }, ...groups),
    clearBtn
  );

  bar.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLButtonElement)) return;
    if (target.dataset['action'] === 'clear-filters') {
      filters.side.clear();
      filters.category.clear();
      filters.cost.clear();
      filters.kidFriendly = false;
      filters.rentalsOnSite = false;
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

function updateChipBar(bar: HTMLElement): void {
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
  const showingPill = bar.querySelector<HTMLElement>('[data-showing-pill="true"]');
  if (showingPill) {
    showingPill.textContent = `${currentShowingCount()} of ${ACTIVITIES.length} showing`;
  }
}

// ====================================================================
// BODY
// ====================================================================

function renderBody(wrap: HTMLElement): void {
  const visible = ACTIVITIES.filter(activityMatchesFilters);
  const water = visible.filter((a) => categoryOf(a) === 'water');
  const town = visible.filter((a) => categoryOf(a) === 'town');
  const wildlife = visible.filter((a) => categoryOf(a) === 'wildlife');
  const general = visible.filter((a) => categoryOf(a) === 'general');

  const groups: { key: ActivityCategory; title: string; lede: string | null; items: Activity[] }[] = [
    {
      key: 'water',
      title: 'Water + lakes',
      lede:
        'Kayaks, swimming holes, boat tours. Two real on-water rental options in the corridor (Sun Mountain + Ross Lake Resort) plus self-launch + swim spots. Diablo Lake itself has no on-lake rentals — bring or haul.',
      items: water,
    },
    { key: 'town', title: 'Side towns + biking', lede: null, items: town },
    { key: 'wildlife', title: 'Wildlife', lede: null, items: wildlife },
    { key: 'general', title: 'Other', lede: null, items: general },
  ];

  const groupsWrap = wrap.querySelector<HTMLElement>('.activities-groups');
  if (!groupsWrap) return;
  groupsWrap.replaceChildren();

  for (const g of groups) {
    if (g.items.length === 0) continue;
    const heading = h(
      'h3',
      { class: 'subsection__title', 'data-activity-heading': g.key },
      `${g.title} (${g.items.length})`
    );
    const lede = g.lede ? h('p', { class: 'section__lede activities__group-lede' }, g.lede) : null;
    const grid = h(
      'div',
      { class: 'card-grid card-grid--activities' },
      ...g.items.map(renderActivityCard)
    );
    const groupBlock = h(
      'div',
      { class: `activities__group activities__group--${g.key}` },
      heading,
      lede,
      grid
    );
    groupsWrap.appendChild(groupBlock);
  }

  // Empty state — keep behavior consistent with hikes when chips kill all rows.
  if (visible.length === 0) {
    groupsWrap.appendChild(
      h(
        'p',
        { class: 'activities__empty' },
        'No activities match those filters. ',
        h('strong', {}, 'Clear filters'),
        ' above to see all options.'
      )
    );
  }
}

// ====================================================================
// MAIN RENDER
// ====================================================================

export function renderActivities(): HTMLElement {
  const chipBar = renderChipBar();

  const wrap = section(
    'activities',
    'Activities',
    h(
      'p',
      { class: 'section__lede' },
      'Non-hike options for rest days or evenings — paddle, swim, bike, side-town walks. Not "must-do." Menu items to choose from on the day.'
    ),
    renderSectionSources({
      label: 'Operator hours + prices verified at',
      sources: [
        { name: 'Sun Mountain Lodge', url: 'https://sunmountainlodge.com/adventure/water-activities/' },
        { name: 'Ross Lake Resort', url: 'https://www.rosslakeresort.com/equipment-rentals' },
        { name: 'North Cascade Kayaks', url: 'https://northcascadekayaks.com/' },
        { name: 'WA State Parks · Pearrygin', url: 'https://parks.wa.gov/find-parks/state-parks/pearrygin-lake-state-park' },
        { name: 'Lady of the Lake', url: 'https://ladyofthelake.com/boat-schedules/' },
      ],
      asOf: 'May 17, 2026',
    }),
    chipBar,
    h('div', { class: 'activities-groups' }),
    h(
      'details',
      { class: 'disclosure' },
      h('summary', { class: 'disclosure__summary' }, 'Checked + ruled out — for transparency'),
      h(
        'ul',
        { class: 'ruled-out__list' },
        ...RULED_OUT.map((r) =>
          h(
            'li',
            { class: 'ruled-out__item' },
            h('strong', {}, r.what),
            h('p', { class: 'ruled-out__why' }, r.why)
          )
        )
      )
    )
  );

  renderBody(wrap);

  onFilterChange(() => {
    updateChipBar(chipBar);
    renderBody(wrap);
  });

  return wrap;
}
