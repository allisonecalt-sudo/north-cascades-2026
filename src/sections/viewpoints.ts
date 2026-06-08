/**
 * Roadside viewpoints along WA-20.
 *
 * Two renderers ship from this file:
 *   - `renderViewpoints()` — compact WA-20 timeline + Baker bonus block,
 *     embedded on the Hikes page as a secondary section.
 *   - `renderViewpointsGallery()` — full Airbnb-tier gallery for the
 *     dedicated /viewpoints page (May 17, 2026 buildout per Allison brief
 *     *"Could destinations use more beefing up? Reference austria"*). Cards
 *     with 3-5 photo carousels + at-a-glance pills + drive times from both
 *     bases + filter chips.
 *
 * Featured stops (Diablo Lake, Washington Pass) lead with photos in the
 * compact view. No "postcard" hierarchy in the gallery view — they're all
 * cards, sortable by corridor + effort.
 */

import {
  BAKER_NOTE,
  BAKER_VIEWPOINTS,
  VIEWPOINTS,
  VIEWPOINT_BESTTIME_LABEL,
  VIEWPOINT_CORRIDOR_LABEL,
  VIEWPOINT_DESTINATIONS,
  VIEWPOINT_EFFORT_LABEL,
  type Viewpoint,
  type ViewpointBestTime,
  type ViewpointCorridor,
  type ViewpointDestination,
  type ViewpointEffort,
} from '../data/viewpoints';
import { badge, h, section } from '../dom';
import { renderPhotoCarousel, type CarouselPhoto } from './photo-carousel';
import { renderSectionSources } from './section-sources';
import { renderVideoPill } from './video-embed';
import { createShortlist } from './shortlist-shared';
import { registerPicksShortlist } from './picks-fab';

// ====================================================================
// SHORTLIST — viewpoints (registered with the unified ✓ Picks FAB)
// ====================================================================

const viewpointShortlist = createShortlist({
  storageKey: 'ncades2026.viewpointPicks',
  entityKind: 'Viewpoint',
  entityKindPlural: 'Viewpoints',
  all: () => VIEWPOINT_DESTINATIONS,
  getId: (v) => v.id,
  getName: (v) => v.name,
  getThumb: (v) => {
    const first = v.photos[0];
    return first ? { src: first.src, alt: first.alt } : null;
  },
  getDetail: (v) => {
    const corridor = VIEWPOINT_CORRIDOR_LABEL[v.corridor];
    const mp = v.milepost !== undefined ? `MP ${v.milepost} · ` : '';
    return `${mp}${corridor}`;
  },
});
registerPicksShortlist(viewpointShortlist);

function renderViewpointPhoto(v: Viewpoint): HTMLElement | null {
  if (!v.photo) return null;
  const img = h('img', {
    class: 'timeline__img',
    src: v.photo.src,
    alt: v.photo.alt,
    width: v.photo.width,
    height: v.photo.height,
    loading: 'lazy',
    decoding: 'async',
  });
  const figure = h('figure', { class: 'timeline__figure' }, img);
  if (v.photo.credit) {
    const credit = v.photo.creditUrl
      ? h(
          'figcaption',
          { class: 'timeline__credit' },
          h(
            'a',
            { href: v.photo.creditUrl, rel: 'noopener', target: '_blank' },
            v.photo.credit
          )
        )
      : h('figcaption', { class: 'timeline__credit' }, v.photo.credit);
    figure.append(credit);
  }
  return figure;
}

function renderTimelineItem(v: Viewpoint): HTMLElement {
  return h(
    'li',
    { class: 'timeline__item' },
    h(
      'div',
      { class: 'timeline__marker', 'aria-hidden': 'true' },
      h('span', { class: 'timeline__mp' }, `MP ${v.milepost}`)
    ),
    h(
      'div',
      { class: 'timeline__body' },
      h(
        'div',
        { class: 'timeline__head' },
        h('h3', { class: 'timeline__name' }, v.name),
        h('span', { class: 'timeline__time' }, v.timeNeeded)
      ),
      h('p', { class: 'timeline__detail' }, v.description),
      renderViewpointPhoto(v)
    )
  );
}

function renderViewpointSummary(v: Viewpoint): HTMLElement {
  return h(
    'li',
    { class: 'mini-list__item' },
    h('strong', { class: 'mini-list__label' }, `MP ${v.milepost} · ${v.name}`),
    h('span', { class: 'mini-list__detail' }, `${v.description} · ${v.timeNeeded}`)
  );
}

// ====================================================================
// GALLERY RENDERER — dedicated /viewpoints page (May 17, 2026 buildout)
// ====================================================================

interface ViewpointFilterState {
  corridor: Set<ViewpointCorridor>;
  effort: Set<ViewpointEffort>;
  bestTime: Set<ViewpointBestTime>;
  needsWa20: 'any' | 'yes' | 'no';
}

function emptyVpFilters(): ViewpointFilterState {
  return {
    corridor: new Set(),
    effort: new Set(),
    bestTime: new Set(),
    needsWa20: 'any',
  };
}

const vpFilters: ViewpointFilterState = emptyVpFilters();
const vpFilterListeners: (() => void)[] = [];

function vpNotifyFilters(): void {
  for (const fn of vpFilterListeners) fn();
}
function vpOnFilterChange(fn: () => void): void {
  vpFilterListeners.push(fn);
}

function vpMatches(v: ViewpointDestination): boolean {
  if (vpFilters.corridor.size > 0 && !vpFilters.corridor.has(v.corridor)) return false;
  if (vpFilters.effort.size > 0 && !vpFilters.effort.has(v.effort)) return false;
  if (vpFilters.bestTime.size > 0 && !vpFilters.bestTime.has(v.bestTime)) return false;
  if (vpFilters.needsWa20 === 'yes' && !v.needsWa20) return false;
  if (vpFilters.needsWa20 === 'no' && v.needsWa20) return false;
  return true;
}

function vpActiveFilterCount(): number {
  return (
    vpFilters.corridor.size +
    vpFilters.effort.size +
    vpFilters.bestTime.size +
    (vpFilters.needsWa20 === 'any' ? 0 : 1)
  );
}

function vpEffortEmoji(e: ViewpointEffort): string {
  return e === 'drive-up' ? '🚗' : '🚶';
}

function vpBestTimeEmoji(t: ViewpointBestTime): string {
  switch (t) {
    case 'sunrise':
      return '🌄';
    case 'sunset':
    case 'golden-hour':
      return '🌅';
    case 'morning':
      return '☀️';
    case 'midday':
      return '🌞';
    case 'anytime':
    default:
      return '⏱';
  }
}

function renderVpPills(v: ViewpointDestination): HTMLElement {
  const pill = (cls: string, text: string): HTMLElement => h('li', { class: cls }, text);
  const items: HTMLElement[] = [];
  items.push(pill('card__pill', `${vpEffortEmoji(v.effort)} ${VIEWPOINT_EFFORT_LABEL[v.effort]}`));
  items.push(pill('card__pill', `🅿 ${v.parking}`));
  items.push(pill('card__pill', `📅 ${v.openSeason}`));
  items.push(
    pill('card__pill', `${vpBestTimeEmoji(v.bestTime)} Best: ${VIEWPOINT_BESTTIME_LABEL[v.bestTime]}`)
  );
  items.push(
    pill(
      v.needsWa20 ? 'card__pill card__pill--bad' : 'card__pill card__pill--good',
      v.needsWa20 ? '⚠ Needs WA-20 through' : '✓ Reachable w/o WA-20 through'
    )
  );
  items.push(pill('card__pill', `⏱ ${v.timeNeeded}`));
  if (v.restrooms) items.push(pill('card__pill', '🚻 Restrooms'));
  if (v.ada) items.push(pill('card__pill', '♿ Paved / ADA'));
  // Milepost is already in the `where` subtitle — no separate pill (dedup).
  items.push(pill('card__pill card__pill--good', `✅ Verified ${v.verifiedAsOf}`));
  if (v.video) {
    items.push(
      renderVideoPill({
        videoId: v.video.youtubeId,
        title: v.video.title,
        creator: v.video.creator,
      })
    );
  }
  return h('ul', { class: 'card__pills', 'aria-label': 'At a glance' }, ...items);
}

function renderVpDriveBlock(v: ViewpointDestination): HTMLElement {
  return h(
    'dl',
    { class: 'card__drive-grid', 'aria-label': 'Drive times from base' },
    h('dt', {}, '🚗 From Marblemount (west)'),
    h('dd', {}, v.driveFromMarblemount),
    h('dt', {}, '🚗 From Winthrop (east)'),
    h('dd', {}, v.driveFromWinthrop)
  );
}

function vpCarouselPhotos(v: ViewpointDestination): CarouselPhoto[] {
  return v.photos.map((p) => ({
    src: p.src,
    alt: p.alt,
    credit: p.credit,
    creditUrl: p.creditUrl,
    width: p.width,
    height: p.height,
  }));
}

function renderVpCard(v: ViewpointDestination): HTMLElement {
  const photos = vpCarouselPhotos(v);
  const corridor = VIEWPOINT_CORRIDOR_LABEL[v.corridor];

  const pickBtn = viewpointShortlist.renderPickButton(v.id, v.name);
  return h(
    'article',
    {
      class: `card viewpoint-card viewpoint-card--${v.corridor}`,
      id: `vp-${v.id}`,
      'data-viewpoint-id': v.id,
    },
    photos.length > 0
      ? renderPhotoCarousel(photos, { ariaLabel: `Photos of ${v.name}` })
      : null,
    h(
      'header',
      { class: 'card__header' },
      h('h3', { class: 'card__title' }, v.name),
      h(
        'div',
        { class: 'card__badges' },
        badge(corridor, 'info'),
        pickBtn
      )
    ),
    h('p', { class: 'card__subtitle' }, v.where),
    renderVpPills(v),
    h('p', { class: 'card__note' }, v.lede),
    renderVpDriveBlock(v),
    v.caveat
      ? h(
          'p',
          { class: 'card__caveat' },
          h('strong', {}, 'Heads-up: '),
          v.caveat
        )
      : null,
    v.sourceUrl
      ? h(
          'p',
          { class: 'card__source' },
          h(
            'a',
            { href: v.sourceUrl, rel: 'noopener', target: '_blank' },
            `${v.sourceLabel ?? 'Source'} →`
          )
        )
      : null
  );
}

interface VpChipDef {
  key: string;
  label: string;
  group: 'corridor' | 'effort' | 'bestTime' | 'wa20';
  isActive: () => boolean;
  toggle: () => void;
}

function buildVpChipDefs(): VpChipDef[] {
  const chips: VpChipDef[] = [];

  (Object.keys(VIEWPOINT_CORRIDOR_LABEL) as ViewpointCorridor[]).forEach((c) => {
    chips.push({
      key: `corridor-${c}`,
      label: VIEWPOINT_CORRIDOR_LABEL[c],
      group: 'corridor',
      isActive: () => vpFilters.corridor.has(c),
      toggle: () => {
        if (vpFilters.corridor.has(c)) vpFilters.corridor.delete(c);
        else vpFilters.corridor.add(c);
        vpNotifyFilters();
      },
    });
  });

  (['drive-up', 'short-walk'] as ViewpointEffort[]).forEach((e) => {
    chips.push({
      key: `effort-${e}`,
      label: VIEWPOINT_EFFORT_LABEL[e],
      group: 'effort',
      isActive: () => vpFilters.effort.has(e),
      toggle: () => {
        if (vpFilters.effort.has(e)) vpFilters.effort.delete(e);
        else vpFilters.effort.add(e);
        vpNotifyFilters();
      },
    });
  });

  (['sunrise', 'morning', 'midday', 'golden-hour', 'sunset', 'anytime'] as ViewpointBestTime[]).forEach(
    (t) => {
      chips.push({
        key: `bestTime-${t}`,
        label: VIEWPOINT_BESTTIME_LABEL[t],
        group: 'bestTime',
        isActive: () => vpFilters.bestTime.has(t),
        toggle: () => {
          if (vpFilters.bestTime.has(t)) vpFilters.bestTime.delete(t);
          else vpFilters.bestTime.add(t);
          vpNotifyFilters();
        },
      });
    }
  );

  (['any', 'yes', 'no'] as const).forEach((mode) => {
    const labelByMode = {
      any: 'Any',
      yes: 'Needs WA-20',
      no: 'No WA-20 needed',
    } as const;
    chips.push({
      key: `wa20-${mode}`,
      label: labelByMode[mode],
      group: 'wa20',
      isActive: () => vpFilters.needsWa20 === mode,
      toggle: () => {
        vpFilters.needsWa20 = mode;
        vpNotifyFilters();
      },
    });
  });

  return chips;
}

function renderVpChipBar(): HTMLElement {
  const chips = buildVpChipDefs();
  const groupOrder: VpChipDef['group'][] = ['corridor', 'effort', 'bestTime', 'wa20'];
  const groupLabels: Record<VpChipDef['group'], string> = {
    corridor: 'Corridor',
    effort: 'Effort',
    bestTime: 'Best time',
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

  const count = vpActiveFilterCount();
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
    `${VIEWPOINT_DESTINATIONS.filter(vpMatches).length} of ${VIEWPOINT_DESTINATIONS.length} showing`
  );

  const bar = h(
    'div',
    { class: 'chip-bar', role: 'group', 'aria-label': 'Filter viewpoints' },
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
      vpFilters.corridor.clear();
      vpFilters.effort.clear();
      vpFilters.bestTime.clear();
      vpFilters.needsWa20 = 'any';
      vpNotifyFilters();
      return;
    }
    const key = target.dataset['chipKey'];
    if (!key) return;
    const def = chips.find((c) => c.key === key);
    if (def) def.toggle();
  });

  return bar;
}

function updateVpChipBar(bar: HTMLElement): void {
  const chips = buildVpChipDefs();
  const buttons = bar.querySelectorAll<HTMLButtonElement>('button.chip');
  buttons.forEach((btn) => {
    const key = btn.dataset['chipKey'];
    const def = chips.find((c) => c.key === key);
    if (!def) return;
    const active = def.isActive();
    btn.classList.toggle('chip--active', active);
    btn.setAttribute('aria-pressed', active ? 'true' : 'false');
  });
  const count = vpActiveFilterCount();
  const clearBtn = bar.querySelector<HTMLButtonElement>('button.chip-clear');
  if (clearBtn) {
    clearBtn.classList.toggle('chip-clear--visible', count > 0);
    clearBtn.textContent = `Clear filters (${count})`;
  }
  const showingPill = bar.querySelector<HTMLElement>('[data-showing-pill="true"]');
  if (showingPill) {
    showingPill.textContent = `${VIEWPOINT_DESTINATIONS.filter(vpMatches).length} of ${VIEWPOINT_DESTINATIONS.length} showing`;
  }
}

function renderVpCorridorGroup(corridor: ViewpointCorridor): HTMLElement | null {
  const vps = VIEWPOINT_DESTINATIONS.filter((v) => v.corridor === corridor).filter(vpMatches);
  if (vps.length === 0) return null;
  return h(
    'div',
    { class: 'viewpoints-corridor', 'data-corridor': corridor },
    h(
      'h3',
      { class: 'subsection__title' },
      `${VIEWPOINT_CORRIDOR_LABEL[corridor]} (${vps.length})`
    ),
    h('div', { class: 'card-grid card-grid--hikes' }, ...vps.map(renderVpCard))
  );
}

function renderVpGroups(host: HTMLElement): void {
  const groups: HTMLElement[] = [];
  (Object.keys(VIEWPOINT_CORRIDOR_LABEL) as ViewpointCorridor[]).forEach((c) => {
    const g = renderVpCorridorGroup(c);
    if (g) groups.push(g);
  });
  if (groups.length === 0) {
    host.replaceChildren(
      h(
        'p',
        { class: 'card__note' },
        'No viewpoints match those filters. Tap ',
        h('strong', {}, 'Clear filters'),
        ' to reset.'
      )
    );
  } else {
    host.replaceChildren(...groups);
  }
}

export function renderViewpointsGallery(): HTMLElement {
  const chipBar = renderVpChipBar();
  const groupsHost = h('div', { class: 'viewpoints-groups' });
  renderVpGroups(groupsHost);

  vpOnFilterChange(() => {
    updateVpChipBar(chipBar);
    renderVpGroups(groupsHost);
  });

  return section(
    'viewpoints',
    'Viewpoints — drive-up postcard spots',
    h(
      'ul',
      { class: 'gist' },
      h(
        'li',
        { class: 'gist__item' },
        'Drive-up moments — reach by car or a sub-10-minute walk. Drive times from both bases on every card.'
      ),
      h(
        'li',
        { class: 'gist__item' },
        h('strong', {}, 'Filter chips below narrow by corridor.'),
        ' WA-20 stops need the through-route open; Mt. Baker (WA-542) + Methow are independent.'
      )
    ),
    renderSectionSources({
      label: 'Viewpoint facts sourced from',
      sources: [
        { name: 'NPS · North Cascades', url: 'https://www.nps.gov/noca/planyourvisit/things2do.htm' },
        { name: 'WTA · Washington Trails Association', url: 'https://www.wta.org/' },
        { name: 'USFS · Mt. Baker-Snoqualmie + Okanogan-Wenatchee', url: 'https://www.fs.usda.gov/mbs' },
      ],
      asOf: 'May 17, 2026',
    }),
    chipBar,
    groupsHost
  );
}

export function renderViewpoints(): HTMLElement {
  // Sort by milepost for the full timeline, but lead with the two photo-featured stops.
  const featured = VIEWPOINTS.filter((v) => v.featured).sort((a, b) => a.milepost - b.milepost);
  const rest = VIEWPOINTS.filter((v) => !v.featured).sort((a, b) => a.milepost - b.milepost);

  return section(
    'viewpoints',
    'Roadside viewpoints (WA-20)',
    h(
      'ul',
      { class: 'gist' },
      h('li', { class: 'gist__item' }, 'Two bigger stops with parking, restrooms, and 20-30 min walks: Diablo Lake (MP 132) and Washington Pass (MP 162).'),
      h('li', { class: 'gist__item' }, 'A handful of 5-minute pull-offs between them, listed by milepost below.')
    ),
    h('ol', { class: 'timeline' }, ...featured.map(renderTimelineItem)),
    rest.length > 0
      ? h(
          'details',
          { class: 'disclosure' },
          h(
            'summary',
            { class: 'disclosure__summary' },
            `Quick pull-offs by milepost (${rest.length})`
          ),
          h('ul', { class: 'mini-list' }, ...rest.map(renderViewpointSummary))
        )
      : null,
    h(
      'details',
      { class: 'disclosure' },
      h(
        'summary',
        { class: 'disclosure__summary' },
        `Bonus — Mt. Baker corridor (WA-542, off WA-20)`
      ),
      h('p', { class: 'disclosure__lede' }, BAKER_NOTE),
      h(
        'ul',
        { class: 'mini-list' },
        ...BAKER_VIEWPOINTS.map((v) =>
          h(
            'li',
            { class: 'mini-list__item' },
            h('strong', { class: 'mini-list__label' }, v.name),
            h('span', { class: 'mini-list__detail' }, `${v.description} · ${v.where} · ${v.timeNeeded}`)
          )
        )
      )
    )
  );
}
