/**
 * lakes.ts — Lakes & water destination cards.
 *
 * Allison's ask (2026-05-17): *"Could destinations use more beefing up?
 * Reference austria."* — Austria treated lake-swimming and water-activities
 * as their own destination pages, not buried under "things to do." This
 * section renders the 6 NC water destinations as Airbnb-tier cards with:
 *
 *   1. Photo carousel per lake via `renderPhotoCarousel`.
 *   2. Booking.com-style filter chip bar: swim-friendly / rental availability /
 *      side / kid / boat-ramp — empty = show all.
 *   3. At-a-glance pill row per card: swim / rental / fee / boat ramp /
 *      parking / kid-friendly / drive-from-each-base.
 *   4. Named rental concessions w/ phone numbers (the "where do I actually
 *      call?" gap on activities.ts).
 *   5. Best-window line (the "when in mid-August" answer).
 *   6. Cross-links to the activities + lodging entries — this destination
 *      page is the menu front-end, those pages are the operator details.
 */
import {
  LAKES,
  LAKES_RULED_OUT,
  type Lake,
  type LakeBase,
  type LakeSwim,
  type LakeRental,
} from '../data/lakes';
import { h, section } from '../dom';
import { renderSectionSources } from './section-sources';
import { renderPhotoCarousel } from './photo-carousel';
import { renderVideoPill } from './video-embed';
import { createShortlist } from './shortlist-shared';
import { registerPicksShortlist } from './picks-fab';

// ====================================================================
// SHORTLIST — lakes (registered with the unified ✓ Picks FAB)
// ====================================================================

const lakeShortlist = createShortlist({
  storageKey: 'ncades2026.lakePicks',
  entityKind: 'Lake',
  entityKindPlural: 'Lakes',
  all: () => LAKES,
  getId: (l) => l.id,
  getName: (l) => l.name,
  getThumb: (l) => {
    const first = l.photos[0];
    return first ? { src: first.src, alt: first.alt } : null;
  },
  getDetail: (l) =>
    `${l.swim === 'yes' ? 'Swim-friendly' : l.swim === 'cold-dip-only' ? 'Cold dip' : 'No swim'} · ${l.rental === 'on-water' ? 'Rentals on-water' : l.rental === 'self-haul' ? 'Self-haul rental' : 'BYO gear'}`,
});
registerPicksShortlist(lakeShortlist);

// ====================================================================
// FILTER STATE
// ====================================================================

interface LakeFilterState {
  base: Set<'west' | 'east'>;
  swim: Set<LakeSwim>;
  rental: Set<LakeRental>;
  kidFriendly: boolean;
  boatRamp: boolean;
  wa20: 'any' | 'needs' | 'no-wa20';
}

function emptyFilters(): LakeFilterState {
  return {
    base: new Set(),
    swim: new Set(),
    rental: new Set(),
    kidFriendly: false,
    boatRamp: false,
    wa20: 'any',
  };
}

const filters: LakeFilterState = emptyFilters();
const filterListeners: (() => void)[] = [];

function notifyFilters(): void {
  for (const fn of filterListeners) fn();
}
function onFilterChange(fn: () => void): void {
  filterListeners.push(fn);
}

function baseOf(lake: Lake): LakeBase {
  return lake.base;
}

function lakeMatchesFilters(lake: Lake): boolean {
  if (filters.base.size > 0) {
    const b = baseOf(lake);
    if (b === 'either') {
      // 'either' matches any base filter
    } else if (!filters.base.has(b)) {
      return false;
    }
  }
  if (filters.swim.size > 0 && !filters.swim.has(lake.swim)) return false;
  if (filters.rental.size > 0 && !filters.rental.has(lake.rental)) return false;
  if (filters.kidFriendly && lake.kidFriendly !== true) return false;
  if (filters.boatRamp && lake.boatRamp !== true) return false;
  if (filters.wa20 === 'needs' && lake.needsWa20Through !== true) return false;
  if (filters.wa20 === 'no-wa20' && lake.needsWa20Through === true) return false;
  return true;
}

function activeFilterCount(): number {
  return (
    filters.base.size +
    filters.swim.size +
    filters.rental.size +
    (filters.kidFriendly ? 1 : 0) +
    (filters.boatRamp ? 1 : 0) +
    (filters.wa20 === 'any' ? 0 : 1)
  );
}

function currentShowingCount(): number {
  return LAKES.filter(lakeMatchesFilters).length;
}

// ====================================================================
// PILL LABEL MAPS
// ====================================================================

const SWIM_LABEL: Record<LakeSwim, string> = {
  yes: '🏊 Swim-friendly',
  'cold-dip-only': '🥶 Cold dip only',
  no: '🚫 No swim',
};

const SWIM_FILTER_LABEL: Record<LakeSwim, string> = {
  yes: '🏊 Swim',
  'cold-dip-only': '🥶 Cold dip',
  no: '🚫 No swim',
};

const RENTAL_LABEL: Record<LakeRental, string> = {
  'on-water': '✅ Rentals on-water',
  'self-haul': '🚙 Self-haul rental',
  none: '🎒 BYO gear',
};

const RENTAL_FILTER_LABEL: Record<LakeRental, string> = {
  'on-water': '✅ On-water',
  'self-haul': '🚙 Self-haul',
  none: '🎒 BYO',
};

// ====================================================================
// CARD PARTS
// ====================================================================

function renderLakePills(lake: Lake): HTMLElement {
  const items: HTMLElement[] = [];
  const pill = (cls: string, text: string): HTMLElement => h('li', { class: cls }, text);

  // Trimmed to the 3 that drive the decision (swim / rental / fee) — boat ramp,
  // parking, kid + side are all filter chips, so repeating them as pills was noise.
  const swimClass =
    lake.swim === 'yes'
      ? 'card__pill card__pill--good'
      : lake.swim === 'no'
        ? 'card__pill card__pill--bad'
        : 'card__pill';
  items.push(pill(swimClass, SWIM_LABEL[lake.swim]));

  const rentalClass =
    lake.rental === 'on-water' ? 'card__pill card__pill--good' : 'card__pill';
  items.push(pill(rentalClass, RENTAL_LABEL[lake.rental]));

  items.push(pill('card__pill', `💲 ${lake.fee}`));

  if (lake.needsWa20Through === true) {
    items.push(pill('card__pill card__pill--bad', '↻ Needs WA-20 through'));
  }

  if (lake.video) {
    items.push(
      renderVideoPill({
        videoId: lake.video.youtubeId,
        title: lake.video.title,
        creator: lake.video.creator,
      })
    );
  }

  return h('ul', { class: 'card__pills', 'aria-label': 'At a glance' }, ...items);
}

function renderDriveMatrix(lake: Lake): HTMLElement {
  return h(
    'div',
    { class: 'lake-card__drives' },
    h('p', { class: 'lake-card__drives-label' }, 'Drive from each base:'),
    h(
      'ul',
      { class: 'lake-card__drives-list' },
      ...lake.driveFromBases.map((d) =>
        h(
          'li',
          { class: 'lake-card__drives-row' },
          h('span', { class: 'lake-card__drives-from' }, d.from),
          h('span', { class: 'lake-card__drives-mins' }, d.minutes)
        )
      )
    )
  );
}

function renderConcessions(lake: Lake): HTMLElement | null {
  if (!lake.concessions || lake.concessions.length === 0) return null;
  return h(
    'div',
    { class: 'lake-card__concessions' },
    h('p', { class: 'lake-card__concessions-label' }, 'Rental / operator:'),
    h(
      'ul',
      { class: 'lake-card__concessions-list' },
      ...lake.concessions.map((c) => {
        const parts: (HTMLElement | string)[] = [
          c.url
            ? h(
                'a',
                { href: c.url, rel: 'noopener', target: '_blank' },
                h('strong', {}, c.name),
                ' ↗'
              )
            : h('strong', {}, c.name),
        ];
        if (c.phone) {
          parts.push(' · ');
          parts.push(h('a', { href: `tel:${c.phone.replace(/[^0-9+]/g, '')}` }, c.phone));
        }
        if (c.notes) {
          parts.push(h('p', { class: 'lake-card__concessions-notes' }, c.notes));
        }
        return h('li', { class: 'lake-card__concessions-row' }, ...parts);
      })
    )
  );
}

function renderCrossLinks(lake: Lake): HTMLElement | null {
  const links: HTMLElement[] = [];
  if (lake.activityAnchor) {
    links.push(
      h(
        'a',
        { class: 'lake-card__crosslink', href: lake.activityAnchor },
        'Operator detail on Activities →'
      )
    );
  }
  if (lake.sleepAnchor) {
    links.push(
      h(
        'a',
        { class: 'lake-card__crosslink', href: lake.sleepAnchor },
        'Sleep on this lake →'
      )
    );
  }
  if (links.length === 0) return null;
  return h('div', { class: 'lake-card__crosslinks' }, ...links);
}

function renderLakeCard(lake: Lake): HTMLElement {
  const pickBtn = lakeShortlist.renderPickButton(lake.id, lake.name);
  return h(
    'article',
    { class: `card lake-card lake-card--${lake.base}`, 'data-lake-id': lake.id },
    renderPhotoCarousel(lake.photos, { ariaLabel: `Photos of ${lake.name}` }),
    h(
      'header',
      { class: 'card__header' },
      h('h3', { class: 'card__title' }, lake.name),
      h('span', { class: 'lake-card__where' }, lake.where),
      pickBtn
    ),
    h('p', { class: 'card__subtitle lake-card__lede' }, lake.lede),
    renderLakePills(lake),
    lake.swimNote ? h('p', { class: 'lake-card__swim-note' }, lake.swimNote) : null,
    h('p', { class: 'card__note' }, lake.description),
    h(
      'p',
      { class: 'lake-card__window' },
      h('strong', {}, 'Best window: '),
      lake.bestWindow
    ),
    renderDriveMatrix(lake),
    renderConcessions(lake),
    h(
      'p',
      { class: 'card__source' },
      h(
        'a',
        { href: lake.sourceUrl, rel: 'noopener', target: '_blank' },
        lake.sourceLabel + ' →'
      )
    ),
    renderCrossLinks(lake)
  );
}

// ====================================================================
// FILTER CHIP BAR
// ====================================================================

interface ChipDef {
  key: string;
  label: string;
  group: 'base' | 'swim' | 'rental' | 'kid' | 'ramp' | 'wa20';
  isActive: () => boolean;
  toggle: () => void;
}

function buildChipDefs(): ChipDef[] {
  const chips: ChipDef[] = [];

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

  const swimOrder: LakeSwim[] = ['yes', 'cold-dip-only', 'no'];
  for (const v of swimOrder) {
    chips.push({
      key: `swim-${v}`,
      label: SWIM_FILTER_LABEL[v],
      group: 'swim',
      isActive: () => filters.swim.has(v),
      toggle: () => {
        if (filters.swim.has(v)) filters.swim.delete(v);
        else filters.swim.add(v);
        notifyFilters();
      },
    });
  }

  const rentalOrder: LakeRental[] = ['on-water', 'self-haul', 'none'];
  for (const v of rentalOrder) {
    chips.push({
      key: `rental-${v}`,
      label: RENTAL_FILTER_LABEL[v],
      group: 'rental',
      isActive: () => filters.rental.has(v),
      toggle: () => {
        if (filters.rental.has(v)) filters.rental.delete(v);
        else filters.rental.add(v);
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
    key: 'boat-ramp',
    label: '🛥 Boat ramp',
    group: 'ramp',
    isActive: () => filters.boatRamp,
    toggle: () => {
      filters.boatRamp = !filters.boatRamp;
      notifyFilters();
    },
  });

  const wa20Labels = { any: 'Any', needs: 'Needs WA-20', 'no-wa20': 'No WA-20 needed' } as const;
  for (const v of ['any', 'needs', 'no-wa20'] as const) {
    chips.push({
      key: `wa20-${v}`,
      label: wa20Labels[v],
      group: 'wa20',
      isActive: () => filters.wa20 === v,
      toggle: () => {
        filters.wa20 = v;
        notifyFilters();
      },
    });
  }

  return chips;
}

function renderChipBar(): HTMLElement {
  const chips = buildChipDefs();
  const groupOrder: ChipDef['group'][] = ['base', 'swim', 'wa20', 'rental', 'kid', 'ramp'];
  const groupLabels: Record<ChipDef['group'], string> = {
    base: 'Side',
    swim: 'Swim',
    rental: 'Rentals',
    kid: 'Kid',
    ramp: 'Ramp',
    wa20: 'WA-20 dependency',
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
    `${currentShowingCount()} of ${LAKES.length} showing`
  );

  const bar = h(
    'div',
    { class: 'chip-bar', role: 'group', 'aria-label': 'Filter lakes' },
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
      filters.base.clear();
      filters.swim.clear();
      filters.rental.clear();
      filters.kidFriendly = false;
      filters.boatRamp = false;
      filters.wa20 = 'any';
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
    showingPill.textContent = `${currentShowingCount()} of ${LAKES.length} showing`;
  }
}

// ====================================================================
// BODY
// ====================================================================

function renderBody(wrap: HTMLElement): void {
  const visible = LAKES.filter(lakeMatchesFilters);
  const groupsWrap = wrap.querySelector<HTMLElement>('.lakes-groups');
  if (!groupsWrap) return;
  groupsWrap.replaceChildren();

  if (visible.length === 0) {
    groupsWrap.appendChild(
      h(
        'p',
        { class: 'activities__empty' },
        'No lakes match those filters. ',
        h('strong', {}, 'Clear filters'),
        ' above to see all options.'
      )
    );
    return;
  }

  const grid = h(
    'div',
    { class: 'card-grid card-grid--lakes' },
    ...visible.map(renderLakeCard)
  );
  groupsWrap.appendChild(grid);
}

// ====================================================================
// MAIN RENDER
// ====================================================================

export function renderLakes(): HTMLElement {
  const chipBar = renderChipBar();

  const wrap = section(
    'lakes',
    'Lakes & water',
    h(
      'p',
      { class: 'section__lede' },
      'Six lakes + the Methow River — the rental to call, drive-time from each base, the honest swim story.'
    ),
    renderSectionSources({
      label: 'Operator hours + fees verified at',
      sources: [
        { name: 'WA State Parks · Pearrygin', url: 'https://parks.wa.gov/find-parks/state-parks/pearrygin-lake-state-park' },
        { name: 'Ross Lake Resort', url: 'https://www.rosslakeresort.com/equipment-rentals' },
        { name: 'Sun Mountain Lodge marina', url: 'https://sunmountainlodge.com/adventure/water-activities/' },
        { name: 'North Cascade Kayaks', url: 'https://northcascadekayaks.com/' },
        { name: 'Lady of the Lake (Chelan ferry)', url: 'https://ladyofthelake.com/boat-schedules/' },
        { name: 'NPS · North Cascades nature', url: 'https://www.nps.gov/noca/learn/nature/index.htm' },
      ],
      asOf: 'May 17, 2026',
    }),
    chipBar,
    h('div', { class: 'lakes-groups' }),
    h(
      'details',
      { class: 'disclosure' },
      h('summary', { class: 'disclosure__summary' }, 'Checked + ruled out — for transparency'),
      h(
        'ul',
        { class: 'ruled-out__list' },
        ...LAKES_RULED_OUT.map((r) =>
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
