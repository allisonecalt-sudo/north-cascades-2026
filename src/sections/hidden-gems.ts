/**
 * hidden-gems.ts — section renderer for the "beyond the marquee" page.
 *
 * Wave 3 #11 from the NC trip README. Lifts the hike/sunset card layout
 * (carousel → header → pills → why/trip-fit/drive matrix → sources →
 * verified badge). Filter chips for side (W/E/Mt-Baker) + effort.
 *
 * Why a separate section file (vs reusing hikes.ts):
 *   - Different data shape — `HiddenGem` carries `driveFromBases[]` and a
 *     `whyHidden` framing line that hikes don't have.
 *   - Different filter axes — no kid-friendly / dogs filter here; the bar
 *     is intentionally simpler.
 *   - The marquee `hikes.ts` is OTHER-AGENT TERRITORY for this build —
 *     reading it for cross-reference is fine, restructuring it isn't.
 */

import { HIDDEN_GEMS, EFFORT_LABELS, SIDE_LABELS, type HiddenGem, type GemEffort, type GemSide } from '../data/hidden-gems';
import { badge, h, section } from '../dom';
import { renderSectionSources } from './section-sources';
import { renderPhotoCarousel, type CarouselPhoto } from './photo-carousel';

// ====================================================================
// FILTER STATE
// ====================================================================

interface GemFilterState {
  side: Set<GemSide>;
  effort: Set<GemEffort>;
  hideClosed: boolean;
  wa20: 'any' | 'needs' | 'no-wa20';
}

function emptyFilters(): GemFilterState {
  return { side: new Set(), effort: new Set(), hideClosed: false, wa20: 'any' };
}

const filters: GemFilterState = emptyFilters();
const filterListeners: (() => void)[] = [];

function notifyFilters(): void {
  for (const fn of filterListeners) fn();
}
function onFilterChange(fn: () => void): void {
  filterListeners.push(fn);
}

function gemMatchesFilters(gem: HiddenGem): boolean {
  if (filters.side.size > 0 && !filters.side.has(gem.side)) return false;
  if (filters.effort.size > 0 && !filters.effort.has(gem.effort)) return false;
  if (filters.hideClosed && gem.status?.kind === 'closed') return false;
  if (filters.wa20 === 'needs' && gem.needsWa20Through !== true) return false;
  if (filters.wa20 === 'no-wa20' && gem.needsWa20Through === true) return false;
  return true;
}

function activeFilterCount(): number {
  return (
    filters.side.size +
    filters.effort.size +
    (filters.hideClosed ? 1 : 0) +
    (filters.wa20 === 'any' ? 0 : 1)
  );
}

function currentShowingCount(): number {
  return HIDDEN_GEMS.filter(gemMatchesFilters).length;
}

// ====================================================================
// PILLS
// ====================================================================

function effortPillClass(effort: GemEffort): string {
  if (effort === 'low') return 'card__pill card__pill--good';
  if (effort === 'expert-only') return 'card__pill card__pill--bad';
  if (effort === 'strenuous') return 'card__pill';
  return 'card__pill';
}

function permitLabel(p: HiddenGem['permit']): string {
  if (p === 'none') return 'No permit';
  if (p === 'nw-forest-pass') return 'NW Forest Pass';
  if (p === 'discover-pass') return 'Discover Pass';
  if (p === 'recreation-gov') return 'Recreation.gov permit';
  return p;
}

function sideEmoji(side: GemSide): string {
  if (side === 'west') return '🌲';
  if (side === 'east') return '☀';
  if (side === 'mt-baker') return '🏔';
  return '↔';
}

function renderGemPills(gem: HiddenGem): HTMLElement {
  const pill = (cls: string, text: string): HTMLElement => h('li', { class: cls }, text);
  const items: HTMLElement[] = [
    pill(effortPillClass(gem.effort), `🥾 ${EFFORT_LABELS[gem.effort]}`),
    pill('card__pill', `📏 ${gem.length}`),
    pill('card__pill', `⛰ ${gem.elevation}`),
    pill('card__pill', `${sideEmoji(gem.side)} ${SIDE_LABELS[gem.side]}`),
    pill('card__pill', `🛣 ${gem.roadAccessRequired}`),
    pill('card__pill', `🎟 ${permitLabel(gem.permit)}`),
  ];
  if (gem.needsWa20Through === true) {
    items.push(pill('card__pill card__pill--bad', '↻ Needs WA-20 through'));
  } else if (gem.needsWa20Through === false) {
    items.push(pill('card__pill card__pill--good', '✓ Reachable w/o WA-20 through'));
  }
  items.push(pill('card__pill card__pill--good', `✅ Verified ${gem.verifiedAsOf}`));
  if (gem.status) {
    items.push(pill('card__pill card__pill--bad', `⛔ ${gem.status.label}`));
  }
  return h('ul', { class: 'card__pills', 'aria-label': 'At a glance' }, ...items);
}

// ====================================================================
// STATUS ALERT
// ====================================================================

function renderGemStatusAlert(gem: HiddenGem): HTMLElement | null {
  if (!gem.status) return null;
  const children: (HTMLElement | string)[] = [
    h('strong', {}, `${gem.status.label} — `),
    gem.status.detail,
  ];
  if (gem.status.sourceUrl) {
    children.push(
      ' ',
      h('a', { href: gem.status.sourceUrl, rel: 'noopener', target: '_blank' }, 'Source →')
    );
  }
  children.push(h('span', { style: 'opacity: 0.75;' }, ` (as of ${gem.status.asOf})`));
  return h('p', { class: 'hike-card__alert' }, ...children);
}

// ====================================================================
// DRIVE MATRIX
// ====================================================================

function renderDriveMatrix(gem: HiddenGem): HTMLElement {
  return h(
    'dl',
    { class: 'sunset-card__facts gem-card__drives' },
    ...gem.driveFromBases.flatMap((d) => [
      h('dt', {}, d.from),
      h('dd', {}, d.text),
    ])
  );
}

// ====================================================================
// SOURCES STRIP
// ====================================================================

function renderGemSources(gem: HiddenGem): HTMLElement {
  return h(
    'p',
    { class: 'card__source' },
    'Trust signals: ',
    ...gem.sources.flatMap((src, i) => {
      const link = h(
        'a',
        { href: src.url, rel: 'noopener', target: '_blank' },
        `${src.name} ↗`
      );
      return i < gem.sources.length - 1 ? [link, ' · '] : [link];
    })
  );
}

// ====================================================================
// CARDS
// ====================================================================

function gemPhotos(gem: HiddenGem): CarouselPhoto[] {
  return [...gem.photos];
}

function renderGemCard(gem: HiddenGem): HTMLElement {
  const photos = gemPhotos(gem);
  return h(
    'article',
    { class: `card hike-card gem-card gem-card--${gem.effort}`, 'data-gem-id': gem.id },
    photos.length > 0
      ? renderPhotoCarousel(photos, { ariaLabel: `Photos of ${gem.name}` })
      : null,
    h(
      'header',
      { class: 'card__header' },
      h('h3', { class: 'card__title' }, gem.name),
      h(
        'div',
        { class: 'card__badges' },
        badge('Hidden gem', 'warn'),
        gem.status ? badge(gem.status.label, 'bad') : null
      )
    ),
    h('p', { class: 'card__subtitle' }, gem.where),
    renderGemPills(gem),
    renderGemStatusAlert(gem),
    h(
      'p',
      { class: 'card__note' },
      h('strong', {}, 'Why this is hidden: '),
      gem.whyHidden
    ),
    h(
      'p',
      { class: 'card__note' },
      h('strong', {}, 'Trip fit: '),
      gem.tripFit
    ),
    h('h4', { class: 'subsection__title gem-card__subhead' }, 'Drive from each base'),
    renderDriveMatrix(gem),
    renderGemSources(gem)
  );
}

// ====================================================================
// FILTER CHIP BAR
// ====================================================================

interface ChipDef {
  key: string;
  label: string;
  group: 'side' | 'effort' | 'status' | 'wa20';
  isActive: () => boolean;
  toggle: () => void;
}

function buildChipDefs(): ChipDef[] {
  const chips: ChipDef[] = [];

  for (const v of ['west', 'east', 'mt-baker'] as const) {
    chips.push({
      key: `side-${v}`,
      label: SIDE_LABELS[v],
      group: 'side',
      isActive: () => filters.side.has(v),
      toggle: () => {
        if (filters.side.has(v)) filters.side.delete(v);
        else filters.side.add(v);
        notifyFilters();
      },
    });
  }

  for (const v of ['low', 'moderate', 'strenuous', 'expert-only'] as const) {
    chips.push({
      key: `effort-${v}`,
      label: EFFORT_LABELS[v],
      group: 'effort',
      isActive: () => filters.effort.has(v),
      toggle: () => {
        if (filters.effort.has(v)) filters.effort.delete(v);
        else filters.effort.add(v);
        notifyFilters();
      },
    });
  }

  chips.push({
    key: 'hide-closed',
    label: 'Hide closed',
    group: 'status',
    isActive: () => filters.hideClosed,
    toggle: () => {
      filters.hideClosed = !filters.hideClosed;
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
  const groupOrder: ChipDef['group'][] = ['side', 'effort', 'wa20', 'status'];
  const groupLabels: Record<ChipDef['group'], string> = {
    side: 'Side',
    effort: 'Effort',
    status: 'Status',
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
    { class: 'chip-showing', 'data-showing-pill': 'true', 'aria-live': 'polite' },
    `${currentShowingCount()} of ${HIDDEN_GEMS.length} showing`
  );

  const bar = h(
    'div',
    { class: 'chip-bar', role: 'group', 'aria-label': 'Filter hidden gems' },
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
      filters.effort.clear();
      filters.hideClosed = false;
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
    showingPill.textContent = `${currentShowingCount()} of ${HIDDEN_GEMS.length} showing`;
  }
}

// ====================================================================
// BODY
// ====================================================================

function renderBody(wrap: HTMLElement): void {
  const grid = wrap.querySelector<HTMLElement>('.gem-grid');
  if (!grid) return;
  const filtered = HIDDEN_GEMS.filter(gemMatchesFilters);
  if (filtered.length === 0) {
    grid.replaceChildren(
      h(
        'p',
        { class: 'card__note', style: 'grid-column: 1 / -1; text-align: center; opacity: 0.7;' },
        'No gems match — try clearing a filter.'
      )
    );
    return;
  }
  grid.replaceChildren(...filtered.map(renderGemCard));
}

// ====================================================================
// MAIN
// ====================================================================

export function renderHiddenGems(): HTMLElement {
  const chipBar = renderChipBar();

  const wrap = section(
    'hidden-gems',
    'Hidden gems — beyond the marquee picks',
    h(
      'ul',
      { class: 'gist' },
      h(
        'li',
        { class: 'gist__item' },
        h('strong', {}, 'Beyond the curated 6-8 NPS hikes. '),
        "These are lesser-known viewpoints, lookouts, and lakes that locals love — but most North Cascades trip blogs skip. The 'wow per drive-minute' filter."
      ),
      h(
        'li',
        { class: 'gist__item' },
        'Each card spells out ',
        h('strong', {}, 'WHY this is hidden'),
        ' vs the marquee picks — so the trade is honest, not hyped.'
      ),
      h(
        'li',
        { class: 'gist__item' },
        'Exploratory — not the locked plan. Pick from here for a flex day or a Plan-B swap.'
      )
    ),
    renderSectionSources({
      label: 'Trust signals — research-backed sources',
      sources: [
        { name: 'Washington Trails Association (WTA)', url: 'https://www.wta.org/' },
        { name: 'AllTrails · North Cascades NP', url: 'https://www.alltrails.com/parks/us/washington/north-cascades-national-park' },
        { name: 'USFS · Mt. Baker-Snoqualmie roads', url: 'https://www.fs.usda.gov/r6/mbs/roadcondrep' },
        { name: 'NPS · road conditions', url: 'https://www.nps.gov/noca/planyourvisit/road-conditions.htm' },
      ],
      asOf: 'May 17, 2026',
    }),
    chipBar,
    h(
      'div',
      { class: 'card-grid card-grid--hikes gem-grid' }
    )
  );

  renderBody(wrap);
  onFilterChange(() => {
    updateChipBar(chipBar);
    renderBody(wrap);
  });

  wrap.append(
    h(
      'p',
      { class: 'costs-fineprint__verified' },
      h('span', { class: 'badge badge--good' }, `Verified May 17, 2026 · ${HIDDEN_GEMS.length} gems researched`)
    )
  );

  return wrap;
}
