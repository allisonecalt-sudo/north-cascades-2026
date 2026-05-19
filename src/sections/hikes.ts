/**
 * Hikes — Airbnb-tier presentation pass (May 17, 2026).
 *
 * What changed in this rewrite (per Allison brief — "carousels everywhere ...
 * presentation analysis ... world-class improvements"):
 *
 *   1. Photo carousel per hike (3-5 photos where curated) via the reusable
 *      `renderPhotoCarousel` helper.
 *   2. At-a-glance pill row: difficulty / distance / elevation / season /
 *      permit / kid-friendly / dogs / verified-DATE — like lodging.
 *   3. Filter chip bar above the grid: side (W/E), level, kid-friendly,
 *      dog-allowed, permit type — Booking.com behavior (empty = show all).
 *   4. ✓ Pick + Shortlist per hike — localStorage-persisted, separate from
 *      the lodging shortlist key. Reader can build a "hikes I want to try"
 *      list for the day-of decision.
 *   5. "X of Y showing" live counter when filters apply.
 *   6. Status badges use the `.badge--bad` class (Heliotrope-Ridge closed).
 *   7. Path-aware: in-path hikes lead, off-path stay visible (existing
 *      behavior preserved).
 */

import { HIKES, LEVEL_LABELS, type Hike, type HikeLevel } from '../data/hikes';
import { getPathById } from '../data/paths';
import { getDriveSegment } from '../data/driving';
import { getSelectedPath, subscribeSelectedPath } from '../state/path';
import { badge, h, section } from '../dom';
import { renderSectionSources } from './section-sources';
import { renderPhotoCarousel, type CarouselPhoto } from './photo-carousel';
import { renderVideoPill } from './video-embed';

/**
 * Map hike id → canonical drive-segment id (from data/driving.ts). When set,
 * a "Drive from base" pill renders on the hike card so the reader sees the
 * driving load without leaving the page. Added 2026-05-19 per the "make
 * driving visible at every level" brief.
 */
const HIKE_DRIVE_SEGMENT: Record<string, string> = {
  'cascade-pass': 'marblemount-cascade-pass-rt',
  'sahale-arm': 'marblemount-cascade-pass-rt',
  'park-butte': 'marblemount-park-butte-rt',
  'thunder-knob': 'marblemount-thunder-knob-rt',
  'rainy-lake': 'winthrop-rainy-pass-rt',
  'maple-pass': 'winthrop-rainy-pass-rt',
  'blue-lake': 'winthrop-rainy-pass-rt',
  'cutthroat-pass': 'winthrop-rainy-pass-rt',
};

// ====================================================================
// FILTER CHIP STATE
// ====================================================================

interface HikeFilterState {
  side: Set<'west' | 'east'>;
  level: Set<HikeLevel>;
  kidFriendly: boolean;
  dogsAllowed: boolean;
  permit: Set<'none' | 'nw-forest-pass' | 'discover-pass'>;
  /** WA-20 dependency tri-state. Added 2026-05-17 by integration-audit. */
  wa20: 'any' | 'needs' | 'no-wa20';
}

function emptyFilters(): HikeFilterState {
  return {
    side: new Set(),
    level: new Set(),
    kidFriendly: false,
    dogsAllowed: false,
    permit: new Set(),
    wa20: 'any',
  };
}

const filters: HikeFilterState = emptyFilters();
const filterListeners: (() => void)[] = [];

function notifyFilters(): void {
  for (const fn of filterListeners) fn();
}
function onFilterChange(fn: () => void): void {
  filterListeners.push(fn);
}

function hikeMatchesFilters(hike: Hike): boolean {
  if (filters.side.size > 0) {
    if (hike.side === 'either') {
      // 'either' matches any side filter — surface in both.
    } else if (!filters.side.has(hike.side)) {
      return false;
    }
  }
  if (filters.level.size > 0 && !filters.level.has(hike.level)) return false;
  if (filters.kidFriendly && !hike.kidFriendly) return false;
  if (filters.dogsAllowed && !hike.dogsAllowed) return false;
  if (filters.permit.size > 0 && !filters.permit.has(hike.permitNeeded ?? 'none')) return false;
  if (filters.wa20 === 'needs' && hike.needsWa20Through !== true) return false;
  if (filters.wa20 === 'no-wa20' && hike.needsWa20Through === true) return false;
  return true;
}

function activeFilterCount(): number {
  return (
    filters.side.size +
    filters.level.size +
    (filters.kidFriendly ? 1 : 0) +
    (filters.dogsAllowed ? 1 : 0) +
    filters.permit.size +
    (filters.wa20 === 'any' ? 0 : 1)
  );
}

function currentShowingCount(): number {
  return HIKES.filter(hikeMatchesFilters).length;
}

// ====================================================================
// SHORTLIST (separate key from lodging)
// ====================================================================

const SHORTLIST_KEY = 'ncades2026.hikePicks';

function loadShortlist(): Set<string> {
  try {
    const raw = localStorage.getItem(SHORTLIST_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return new Set(parsed.filter((x): x is string => typeof x === 'string'));
  } catch {
    // ignore
  }
  return new Set();
}

function saveShortlist(set: Set<string>): void {
  try {
    localStorage.setItem(SHORTLIST_KEY, JSON.stringify([...set]));
  } catch {
    // ignore
  }
}

const shortlist: Set<string> = loadShortlist();
const shortlistListeners: (() => void)[] = [];

function notifyShortlist(): void {
  saveShortlist(shortlist);
  for (const fn of shortlistListeners) fn();
}
function onShortlistChange(fn: () => void): void {
  shortlistListeners.push(fn);
}
function togglePick(id: string): void {
  if (shortlist.has(id)) shortlist.delete(id);
  else shortlist.add(id);
  notifyShortlist();
}

// ====================================================================
// PILLS + helpers
// ====================================================================

function permitLabel(p: Hike['permitNeeded']): { emoji: string; label: string } | null {
  if (!p) return null;
  if (p === 'none') return { emoji: '🟢', label: 'No permit' };
  if (p === 'nw-forest-pass') return { emoji: '🎟', label: 'NW Forest Pass' };
  if (p === 'discover-pass') return { emoji: '🎟', label: 'Discover Pass' };
  return null;
}

function seasonLabel(s: Hike['season']): string | null {
  if (!s) return null;
  if (s === 'year-round') return 'Year-round';
  if (s === 'may-oct') return 'May-Oct';
  if (s === 'jun-oct') return 'Jun-Oct';
  if (s === 'jul-oct') return 'Jul-Oct (alpine)';
  return null;
}

function sideEmoji(side: Hike['side']): string {
  if (side === 'west') return '🌲';
  if (side === 'east') return '☀';
  return '↔';
}

function sideLabel(side: Hike['side']): string {
  if (side === 'west') return 'West side';
  if (side === 'east') return 'East side';
  return 'Either side';
}

function renderHikePills(hike: Hike): HTMLElement {
  const items: (HTMLElement | null)[] = [];
  const pill = (cls: string, text: string): HTMLElement => h('li', { class: cls }, text);

  items.push(pill('card__pill', `🥾 ${hike.difficulty}`));
  items.push(pill('card__pill', `📏 ${hike.mileage}`));
  items.push(pill('card__pill', `⛰ ${hike.elevation}`));
  items.push(pill('card__pill', `⏱ ${hike.duration}`));
  items.push(pill('card__pill', `${sideEmoji(hike.side)} ${sideLabel(hike.side)}`));

  // Drive-from-base pill — pulls from the canonical driving.ts module so
  // there's one source of truth for every drive time on the site.
  const driveSegId = HIKE_DRIVE_SEGMENT[hike.id];
  if (driveSegId) {
    const seg = getDriveSegment(driveSegId);
    if (seg) {
      // Cascade Pass especially — flag the gravel + 1-hr-each-way callout.
      const isCascadePass = hike.id === 'cascade-pass' || hike.id === 'sahale-arm';
      const pillClass =
        seg.status === 'gravel' || seg.status === 'wa20-and-gravel'
          ? 'card__pill card__pill--warn'
          : 'card__pill';
      const label = isCascadePass
        ? `🚗 ${seg.drive} from ${seg.from} (gravel, slow)`
        : `🚗 ${seg.drive} from ${seg.from}`;
      items.push(pill(pillClass, label));
    }
  }

  const season = seasonLabel(hike.season);
  if (season) items.push(pill('card__pill', `📅 ${season}`));

  const permit = permitLabel(hike.permitNeeded);
  if (permit) items.push(pill('card__pill', `${permit.emoji} ${permit.label}`));

  if (hike.kidFriendly) items.push(pill('card__pill', '👶 Kid-friendly'));
  if (hike.dogsAllowed === true) items.push(pill('card__pill', '🐕 Dogs OK'));
  if (hike.dogsAllowed === false) items.push(pill('card__pill', '🚫 No dogs'));

  // WA-20 closure-dependency pill — matches viewpoints convention.
  if (hike.needsWa20Through === true) {
    items.push(pill('card__pill card__pill--bad', '↻ Needs WA-20 through'));
  } else if (hike.needsWa20Through === false) {
    items.push(pill('card__pill card__pill--good', '✓ Reachable w/o WA-20 through'));
  }

  if (hike.verifiedAsOf) {
    items.push(pill('card__pill card__pill--good', `✅ Verified ${hike.verifiedAsOf}`));
  }
  if (hike.status) {
    items.push(pill('card__pill card__pill--bad', `⛔ ${hike.status.label}`));
  }
  if (hike.video) {
    items.push(
      renderVideoPill({
        videoId: hike.video.youtubeId,
        title: hike.video.title,
        creator: hike.video.creator,
      })
    );
  }

  return h('ul', { class: 'card__pills', 'aria-label': 'At a glance' }, ...items);
}

// ====================================================================
// CARDS
// ====================================================================

function hikePhotos(hike: Hike): CarouselPhoto[] {
  if (hike.photos && hike.photos.length > 0) return [...hike.photos];
  if (hike.photo) return [hike.photo];
  return [];
}

function renderHikeStatusAlert(hike: Hike): HTMLElement | null {
  if (!hike.status) return null;
  const children: (HTMLElement | string)[] = [
    h('strong', {}, hike.status.label + ' — '),
    hike.status.detail,
  ];
  if (hike.status.sourceUrl) {
    children.push(
      ' ',
      h('a', { href: hike.status.sourceUrl, rel: 'noopener', target: '_blank' }, 'WTA alert →')
    );
  }
  children.push(h('span', { style: 'opacity: 0.75;' }, ` (as of ${hike.status.asOf})`));
  return h('p', { class: 'hike-card__alert' }, ...children);
}

function renderHikeCard(hike: Hike, inPath: boolean, pathSelected: boolean): HTMLElement {
  const photos = hikePhotos(hike);
  const isPicked = shortlist.has(hike.id);

  const pickBtn = h(
    'button',
    {
      type: 'button',
      class: isPicked ? 'pick-btn pick-btn--picked' : 'pick-btn',
      'data-hike-id': hike.id,
      'aria-pressed': isPicked ? 'true' : 'false',
    },
    isPicked ? '✓ Picked' : '✓ Pick'
  );
  pickBtn.addEventListener('click', () => togglePick(hike.id));

  return h(
    'article',
    {
      class: `card hike-card hike-card--${hike.level}${pathSelected && !inPath ? ' hike-card--off-path' : ''}${pathSelected && inPath ? ' hike-card--in-path' : ''}${isPicked ? ' hike-card--picked' : ''}`,
      'data-hike-id': hike.id,
    },
    photos.length > 0
      ? renderPhotoCarousel(photos, { ariaLabel: `Photos of ${hike.name}` })
      : null,
    h(
      'header',
      { class: 'card__header' },
      h('h3', { class: 'card__title' }, hike.name),
      h(
        'div',
        { class: 'card__badges' },
        inPath ? badge('In your path', 'good') : null,
        hike.hiddenGem ? badge('Hidden gem', 'warn') : null,
        hike.status ? badge(hike.status.label, 'bad') : null,
        pickBtn
      )
    ),
    h('p', { class: 'card__subtitle' }, hike.trailhead),
    renderHikePills(hike),
    renderHikeStatusAlert(hike),
    h('p', { class: 'card__note' }, hike.description),
    hike.sourceUrl
      ? h(
          'p',
          { class: 'card__source' },
          h('a', { href: hike.sourceUrl, rel: 'noopener', target: '_blank' }, 'WTA trail page →')
        )
      : null
  );
}

function renderHikeSummary(hike: Hike): HTMLElement {
  return h(
    'li',
    { class: 'mini-list__item' },
    h(
      'strong',
      { class: 'mini-list__label' },
      hike.name,
      ' ',
      badge(sideLabel(hike.side), 'info')
    ),
    h(
      'span',
      { class: 'mini-list__detail' },
      `${hike.mileage} · ${hike.elevation} · ${hike.difficulty}. ${hike.description}`
    )
  );
}

function byLevel(level: HikeLevel): Hike[] {
  return HIKES.filter((hike) => hike.level === level);
}

function sortInPathFirst(hikes: Hike[], inPath: (id: string) => boolean): Hike[] {
  return [...hikes].sort((a, b) => {
    const aIn = inPath(a.id) ? 0 : 1;
    const bIn = inPath(b.id) ? 0 : 1;
    return aIn - bIn;
  });
}

// ====================================================================
// FILTER CHIP BAR
// ====================================================================

interface ChipDef {
  key: string;
  label: string;
  group: 'side' | 'level' | 'kid' | 'dogs' | 'permit' | 'wa20';
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

  for (const v of ['easy', 'moderate', 'ambitious'] as const) {
    chips.push({
      key: `level-${v}`,
      label: v === 'ambitious' ? 'Ambitious' : v === 'moderate' ? 'Moderate' : 'Easy',
      group: 'level',
      isActive: () => filters.level.has(v),
      toggle: () => {
        if (filters.level.has(v)) filters.level.delete(v);
        else filters.level.add(v);
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
    key: 'dogs-allowed',
    label: '🐕 Dogs OK',
    group: 'dogs',
    isActive: () => filters.dogsAllowed,
    toggle: () => {
      filters.dogsAllowed = !filters.dogsAllowed;
      notifyFilters();
    },
  });

  const permitLabels = {
    none: 'No permit',
    'nw-forest-pass': 'NW Forest Pass',
    'discover-pass': 'Discover Pass',
  } as const;
  for (const v of ['none', 'nw-forest-pass', 'discover-pass'] as const) {
    chips.push({
      key: `permit-${v}`,
      label: permitLabels[v],
      group: 'permit',
      isActive: () => filters.permit.has(v),
      toggle: () => {
        if (filters.permit.has(v)) filters.permit.delete(v);
        else filters.permit.add(v);
        notifyFilters();
      },
    });
  }

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
  const groupOrder: ChipDef['group'][] = ['side', 'level', 'wa20', 'kid', 'dogs', 'permit'];
  const groupLabels: Record<ChipDef['group'], string> = {
    side: 'Side',
    level: 'Effort',
    kid: 'Kid',
    dogs: 'Dogs',
    permit: 'Permit',
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
    `${currentShowingCount()} of ${HIKES.length} showing`
  );

  const bar = h(
    'div',
    { class: 'chip-bar', role: 'group', 'aria-label': 'Filter hikes' },
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
      filters.level.clear();
      filters.kidFriendly = false;
      filters.dogsAllowed = false;
      filters.permit.clear();
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
    showingPill.textContent = `${currentShowingCount()} of ${HIKES.length} showing`;
  }
}

// ====================================================================
// SHORTLIST PANEL
// ====================================================================

function renderShortlistPanel(): HTMLElement {
  const picked = HIKES.filter((h) => shortlist.has(h.id));

  if (picked.length === 0) {
    return h(
      'div',
      { class: 'shortlist-panel shortlist-panel--empty' },
      h('p', {}, 'No picks yet — tap ', h('strong', {}, '✓ Pick'), ' on a hike card to start a shortlist.')
    );
  }

  const rows = picked.map((hike) => {
    const removeBtn = h(
      'button',
      {
        type: 'button',
        class: 'shortlist-remove',
        'data-hike-id': hike.id,
        'aria-label': `Remove ${hike.name} from shortlist`,
      },
      '×'
    );
    removeBtn.addEventListener('click', () => togglePick(hike.id));
    return h(
      'tr',
      {},
      h('td', { class: 'shortlist-name' }, hike.name),
      h('td', {}, hike.mileage),
      h('td', {}, hike.elevation),
      h('td', {}, hike.difficulty),
      h('td', {}, sideLabel(hike.side)),
      h('td', { class: 'shortlist-actions' }, removeBtn)
    );
  });

  const clearAllBtn = h(
    'button',
    { type: 'button', class: 'shortlist-clear' },
    'Clear shortlist'
  );
  clearAllBtn.addEventListener('click', () => {
    if (shortlist.size === 0) return;
    shortlist.clear();
    notifyShortlist();
  });

  return h(
    'div',
    { class: 'shortlist-panel' },
    h(
      'div',
      { class: 'shortlist-panel__head' },
      h('h4', { class: 'shortlist-panel__title' }, `Your hike shortlist (${picked.length})`),
      h('p', { class: 'shortlist-panel__hint' }, 'Pick the ones you want to try — decide on the day by energy + weather.')
    ),
    h(
      'div',
      { class: 'shortlist-table-wrap' },
      h(
        'table',
        { class: 'shortlist-table' },
        h(
          'thead',
          {},
          h(
            'tr',
            {},
            h('th', { scope: 'col' }, 'Hike'),
            h('th', { scope: 'col' }, 'Distance'),
            h('th', { scope: 'col' }, 'Elevation'),
            h('th', { scope: 'col' }, 'Effort'),
            h('th', { scope: 'col' }, 'Side'),
            h('th', { scope: 'col' }, '')
          )
        ),
        h('tbody', {}, ...rows)
      )
    ),
    h(
      'div',
      { class: 'shortlist-actions-row' },
      clearAllBtn
    )
  );
}

function renderShortlistContainer(): HTMLElement {
  const details = h(
    'details',
    { class: 'shortlist', id: 'hikes-shortlist' },
    h(
      'summary',
      { class: 'shortlist__summary' },
      h('span', { class: 'shortlist__count' }, `${shortlist.size}`),
      h('span', { class: 'shortlist__label' }, ' hike pick(s) — tap to compare')
    )
  );
  details.appendChild(renderShortlistPanel());
  return details;
}

// ====================================================================
// BODY
// ====================================================================

function renderBody(wrap: HTMLElement, selectedId: string | null): void {
  const path = selectedId ? getPathById(selectedId as 'A' | 'B' | 'C') : null;
  const pathHikeIds = path ? new Set(path.hikeIds) : new Set<string>();
  const pathSelected = path !== null;
  const inPath = (id: string): boolean => pathHikeIds.has(id);

  const easyAll = byLevel('easy').filter(hikeMatchesFilters);
  const modAll = byLevel('moderate').filter(hikeMatchesFilters);
  const ambAll = byLevel('ambitious').filter(hikeMatchesFilters);
  const easy = pathSelected ? sortInPathFirst(easyAll, inPath) : easyAll;
  const moderate = pathSelected ? sortInPathFirst(modAll, inPath) : modAll;
  const ambitious = ambAll;

  const gist = wrap.querySelector<HTMLElement>('.gist');
  if (gist) {
    gist.replaceChildren(
      h(
        'li',
        { class: 'gist__item' },
        path
          ? `${path.name} — in-path hikes lead. Others stay visible as day-of swap options.`
          : 'Options at different levels — beautiful nature, easy → moderate is the sweet spot.'
      ),
      h(
        'li',
        { class: 'gist__item' },
        h('strong', {}, 'Filter chips above narrow the list.'),
        ' Tap ',
        h('strong', {}, '✓ Pick'),
        ' on cards to build a shortlist · compare appears below.'
      ),
      h('li', { class: 'gist__item' }, 'No must-dos — pick by energy on the day.')
    );
  }

  const easyWrap = wrap.querySelector<HTMLElement>('.hikes-easy');
  if (easyWrap) {
    easyWrap.replaceChildren(...easy.map((hike) => renderHikeCard(hike, inPath(hike.id), pathSelected)));
  }
  const modWrap = wrap.querySelector<HTMLElement>('.hikes-moderate');
  if (modWrap) {
    modWrap.replaceChildren(...moderate.map((hike) => renderHikeCard(hike, inPath(hike.id), pathSelected)));
  }

  const easyHeading = wrap.querySelector<HTMLElement>('[data-hike-heading="easy"]');
  if (easyHeading) easyHeading.textContent = `Easy walks (${easy.length})`;
  const modHeading = wrap.querySelector<HTMLElement>('[data-hike-heading="moderate"]');
  if (modHeading) modHeading.textContent = `Moderate hikes — beautiful + doable (${moderate.length})`;

  const ambList = wrap.querySelector<HTMLElement>('.hikes-ambitious-list');
  const ambDetails = wrap.querySelector<HTMLElement>('.hikes-ambitious-block');
  if (ambList && ambDetails) {
    if (ambitious.length === 0) {
      ambDetails.style.display = 'none';
    } else {
      ambDetails.style.display = '';
      ambList.replaceChildren(...ambitious.map(renderHikeSummary));
      const ambSummary = ambDetails.querySelector<HTMLElement>('summary');
      if (ambSummary) {
        ambSummary.textContent = `${LEVEL_LABELS.ambitious}s — long days, only if both feel strong (${ambitious.length})`;
      }
    }
  }
}

// ====================================================================
// MAIN RENDER
// ====================================================================

export function renderHikes(): HTMLElement {
  const chipBar = renderChipBar();
  const shortlistContainer = renderShortlistContainer();

  const ambitiousBlock = h(
    'details',
    { class: 'disclosure hikes-ambitious-block' },
    h(
      'summary',
      { class: 'disclosure__summary' },
      `${LEVEL_LABELS.ambitious}s — long days, only if both feel strong`
    ),
    h(
      'p',
      { class: 'disclosure__lede' },
      'Significant climb + long day. Listed for completeness, not as the plan.'
    ),
    h('ul', { class: 'mini-list hikes-ambitious-list' })
  );

  const wrap = section(
    'hikes',
    'Hikes',
    h('ul', { class: 'gist' }),
    renderSectionSources({
      label: 'Trail stats sourced from',
      sources: [
        { name: 'Washington Trails Association (WTA)', url: 'https://www.wta.org/' },
        { name: 'NPS · noca.gov', url: 'https://www.nps.gov/noca/planyourvisit/hiking.htm' },
        { name: 'AllTrails', url: 'https://www.alltrails.com/parks/us/washington/north-cascades-national-park' },
      ],
      asOf: 'May 17, 2026',
    }),
    chipBar,
    shortlistContainer,
    h('h3', { class: 'subsection__title', 'data-hike-heading': 'easy' }, 'Easy walks'),
    h('div', { class: 'card-grid card-grid--hikes hikes-easy' }),
    h('h3', { class: 'subsection__title', 'data-hike-heading': 'moderate' }, 'Moderate hikes — beautiful + doable'),
    h('div', { class: 'card-grid card-grid--hikes hikes-moderate' }),
    ambitiousBlock
  );

  renderBody(wrap, getSelectedPath());

  onFilterChange(() => {
    updateChipBar(chipBar);
    renderBody(wrap, getSelectedPath());
  });

  onShortlistChange(() => {
    const oldPanel = shortlistContainer.querySelector<HTMLElement>('.shortlist-panel');
    if (oldPanel) oldPanel.remove();
    shortlistContainer.appendChild(renderShortlistPanel());
    const summaryCount = shortlistContainer.querySelector<HTMLElement>('.shortlist__count');
    if (summaryCount) summaryCount.textContent = `${shortlist.size}`;
    renderBody(wrap, getSelectedPath());
  });

  subscribeSelectedPath((next) => renderBody(wrap, next));

  return wrap;
}
