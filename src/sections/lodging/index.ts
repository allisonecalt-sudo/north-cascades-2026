/**
 * Lodging — public API + orchestrator (Wave 3, May 17, 2026).
 *
 * Refactored 2026-05-17 (Lodging Refactor agent): the original
 * `sections/lodging.ts` was 1,802 lines / 31 functions — the code-audit
 * god-object. Split into:
 *   - `./filter-state` — FilterState + filters singleton + predicates + counts
 *   - `./shortlist`    — shortlist Set + togglePick + panel/container/fab UI
 *   - `./card`         — renderLodgingCard + amenityPills + carousel + drive matrix
 *   - `./chip-bar`     — buildChipDefs + renderChipBar + updateChipBar + sold-out banner
 *   - `./search-guide` — renderLodgingSearchGuide (collapsible reference section)
 *   - `./index`        — public entry: renderLodging + the panel/body orchestrator
 *
 * `src/sections/lodging.ts` is now a tiny re-export shim so existing imports
 * (`import { renderLodging } from '../sections/lodging'`) keep working.
 *
 * Standing display rules (Allison May 16, 2026):
 *   - Beds (count + type)
 *   - Bedrooms (count or studio)
 *   - Nature proximity (one prominent line)
 *   - Worth-noting extras (kitchen, hot tub, deck, view, atypical features)
 *
 * Wave 3 additions (May 17, 2026 — pipeline doc):
 *   *"Mini-Booking.com agent — filter starts empty + click chips to narrow,
 *   ✓ Pick button + shortlist, per-lodging drive matrix, Booking-style
 *   carousels + pills."*
 *
 * Path-filter (existing) still works orthogonally: when a path is selected,
 * cards NOT in that path's recommended ids fade into "Other corridor
 * options" disclosure. Path-filter is independent of chip filters.
 */

import {
  EAST_LODGING,
  WEST_LODGING,
  sortByNature,
  type Lodging,
  type LodgingTier,
} from '../../data/lodging';
import { getPathById } from '../../data/paths';
import { getSelectedPath, subscribeSelectedPath } from '../../state/path';
import { h, section } from '../../dom';

import {
  lodgingMatchesFilters,
  notifyFilters,
  onFilterChange,
  resetFilters,
} from './filter-state';
import { renderLodgingCard } from './card';
import {
  onShortlistChange,
  renderShortlistContainer,
  renderShortlistFloater,
  renderShortlistPanel,
  shortlist,
} from './shortlist';
import { renderChipBar, updateChipBar } from './chip-bar';

// Re-export the public-API neighbor so `sections/lodging.ts` shim can pass
// it through unchanged.
export { renderLodgingSearchGuide } from './search-guide';

// ====================================================================
// PANEL HELPERS
// ====================================================================

function byTier(lodgings: Lodging[], tier: LodgingTier): Lodging[] {
  return lodgings.filter((l) => l.tier === tier);
}

function renderPanel(
  id: string,
  title: string,
  lodgings: Lodging[],
  base: 'west' | 'east',
  pathLodgingIds: Set<string> | null
): HTMLElement {
  // Apply chip filters FIRST. Then path filter. Then tier grouping.
  const filtered = lodgings.filter((l) => lodgingMatchesFilters(l, base));
  const fitsBrief = sortByNature(byTier(filtered, 'fits-brief'));
  const splurge = sortByNature(byTier(filtered, 'splurge'));
  const notFit = byTier(filtered, 'not-a-fit');
  const basic = byTier(filtered, 'budget-or-basic');
  const notes = byTier(filtered, 'note');

  const inPath = (lid: string) => (pathLodgingIds ? pathLodgingIds.has(lid) : false);
  const visibleFits = pathLodgingIds
    ? fitsBrief.filter((l) => inPath(l.id))
    : fitsBrief;
  const offPathFits = pathLodgingIds
    ? fitsBrief.filter((l) => !inPath(l.id))
    : [];

  const totalShown = filtered.length;

  const emptyState =
    totalShown === 0
      ? h(
          'p',
          { class: 'lodging-empty' },
          'No properties on this side match your filters. ',
          h(
            'button',
            {
              type: 'button',
              class: 'lodging-empty__clear',
              'data-action': 'clear-filters',
            },
            'Clear filters'
          )
        )
      : null;

  const fitsBriefGrid = h(
    'div',
    { class: 'card-grid' },
    ...visibleFits.map((l) => renderLodgingCard(l, inPath(l.id)))
  );

  const offPathBlock =
    offPathFits.length > 0
      ? h(
          'details',
          { class: 'disclosure' },
          h(
            'summary',
            { class: 'disclosure__summary' },
            `Other Terra Nova-tier options on this corridor (${offPathFits.length})`
          ),
          h(
            'p',
            { class: 'disclosure__lede' },
            'Not part of the selected path\'s default plan but bookable here too. Same 2-beds + nature-first sort applies.'
          ),
          h(
            'div',
            { class: 'card-grid' },
            ...offPathFits.map((l) => renderLodgingCard(l, false))
          )
        )
      : null;

  const splurgeBlock =
    splurge.length > 0
      ? h(
          'details',
          { class: 'disclosure' },
          h(
            'summary',
            { class: 'disclosure__summary' },
            `Splurge options (${splurge.length})`
          ),
          h(
            'div',
            { class: 'card-grid' },
            ...splurge.map((l) => renderLodgingCard(l, inPath(l.id)))
          )
        )
      : null;

  // Lodging Owner pass (2026-05-17): not-a-fit properties used to render
  // full cards (carousel + drive matrix + pills). Reader bandwidth wasted
  // on transparency-only entries. Now collapsed into a single summary list
  // — name + 1-line reason + booking link. If reader wants the full card,
  // there's a "show full cards" toggle inside the disclosure.
  const notFitBlock =
    notFit.length > 0
      ? h(
          'details',
          { class: 'disclosure disclosure--not-fit' },
          h(
            'summary',
            { class: 'disclosure__summary' },
            `Not a fit — under 2 beds or no kitchen (${notFit.length})`
          ),
          h(
            'p',
            { class: 'disclosure__lede' },
            'These properties exist on this corridor but don\'t meet the 2-beds + kosher-cook-in brief. Listed by name so the shortlist above is transparent.'
          ),
          h(
            'ul',
            { class: 'not-fit-list' },
            ...notFit.map((l) =>
              h(
                'li',
                { class: 'not-fit-list__item' },
                h(
                  'div',
                  { class: 'not-fit-list__head' },
                  l.bookingUrl
                    ? h(
                        'a',
                        {
                          class: 'not-fit-list__name',
                          href: l.bookingUrl,
                          rel: 'noopener',
                          target: '_blank',
                        },
                        l.name
                      )
                    : h('span', { class: 'not-fit-list__name' }, l.name),
                  h(
                    'span',
                    { class: 'not-fit-list__price' },
                    `${l.pricePerNight} · ${l.beds}`
                  )
                ),
                h(
                  'p',
                  { class: 'not-fit-list__reason' },
                  l.notFitReason ?? 'Single-bed configuration only.'
                )
              )
            )
          )
        )
      : null;

  const basicBlock =
    basic.length > 0
      ? h(
          'details',
          { class: 'disclosure' },
          h(
            'summary',
            { class: 'disclosure__summary' },
            `Cheaper / more basic options (${basic.length})`
          ),
          h(
            'div',
            { class: 'card-grid' },
            ...basic.map((l) => renderLodgingCard(l, false))
          )
        )
      : null;

  const notesBlock =
    notes.length > 0
      ? h(
          'details',
          { class: 'disclosure' },
          h(
            'summary',
            { class: 'disclosure__summary' },
            `Status notes (${notes.length})`
          ),
          h(
            'div',
            { class: 'card-grid' },
            ...notes.map((l) => renderLodgingCard(l, false))
          )
        )
      : null;

  return h(
    'div',
    {
      class: 'tab-panel',
      id: `lodging-panel-${id}`,
      role: 'tabpanel',
      'aria-labelledby': `lodging-tab-${id}`,
    },
    h('h3', { class: 'tab-panel__title' }, title),
    h(
      'p',
      { class: 'section__lede' },
      pathLodgingIds
        ? `${visibleFits.length} option${visibleFits.length === 1 ? '' : 's'} in the selected path. Nature-immersed picks lead; town-center picks are flagged. Other Terra Nova-tier picks on this corridor sit below.`
        : `Spacious, a little nicer than basic, ~$200-300 — Terra Nova tier. ${fitsBrief.length} cabin option${fitsBrief.length === 1 ? '' : 's'} that meet the 2-beds requirement. Nature-immersed picks lead; town-center picks are flagged.`
    ),
    emptyState,
    fitsBriefGrid,
    offPathBlock,
    splurgeBlock,
    notFitBlock,
    basicBlock,
    notesBlock
  );
}

// ====================================================================
// PANEL DETERMINATION (unchanged from Wave 2)
// ====================================================================

function determinePanels(selectedId: string | null): {
  showWest: boolean;
  showEast: boolean;
  westLabel: string;
  eastLabel: string;
} {
  if (!selectedId) {
    return { showWest: true, showEast: true, westLabel: 'West · Nights 1-2', eastLabel: 'East · Nights 3-4' };
  }
  const path = getPathById(selectedId as 'A' | 'B' | 'C');
  if (!path) {
    return { showWest: true, showEast: true, westLabel: 'West', eastLabel: 'East' };
  }
  if (path.id === 'A') return { showWest: true, showEast: false, westLabel: 'West · all 4 nights', eastLabel: 'East · not in this path' };
  if (path.id === 'B') return { showWest: true, showEast: true, westLabel: 'West · Nights 1-2', eastLabel: 'East · Nights 3-4' };
  return { showWest: true, showEast: true, westLabel: 'West · Night 1', eastLabel: 'East · Nights 2-4' };
}

// ====================================================================
// MAIN RENDER + WIRE-UP
// ====================================================================

function renderBody(wrap: HTMLElement, selectedId: string | null): void {
  const panels = determinePanels(selectedId);
  const path = selectedId ? getPathById(selectedId as 'A' | 'B' | 'C') : null;
  const pathLodgingIds = path ? new Set(path.lodgingIds) : null;

  const tabs = wrap.querySelector<HTMLElement>('.tabs');
  const westTabBtn = wrap.querySelector<HTMLButtonElement>('#lodging-tab-west');
  const eastTabBtn = wrap.querySelector<HTMLButtonElement>('#lodging-tab-east');
  if (westTabBtn) westTabBtn.textContent = panels.westLabel;
  if (eastTabBtn) eastTabBtn.textContent = panels.eastLabel;
  if (eastTabBtn) {
    eastTabBtn.disabled = !panels.showEast;
    eastTabBtn.classList.toggle('tab--disabled', !panels.showEast);
  }

  const westPanel = renderPanel(
    'west',
    'West side — Marblemount / Rockport / Concrete',
    WEST_LODGING,
    'west',
    pathLodgingIds
  );
  const eastPanel = renderPanel(
    'east',
    'East side — Winthrop / Mazama',
    EAST_LODGING,
    'east',
    pathLodgingIds
  );

  const defaultSide = path?.id === 'A' ? 'west' : path?.id === 'C' ? 'east' : 'west';
  eastPanel.hidden = defaultSide !== 'east';
  westPanel.hidden = defaultSide !== 'west';

  if (tabs) {
    const allTabs = tabs.querySelectorAll<HTMLButtonElement>('.tab');
    allTabs.forEach((t) => {
      const active = t.dataset['target'] === defaultSide;
      t.classList.toggle('tab--active', active);
      t.setAttribute('aria-selected', active ? 'true' : 'false');
    });
  }

  const container = wrap.querySelector<HTMLElement>('.lodging-panels');
  if (container) {
    container.replaceChildren(westPanel, eastPanel);
    // Empty-state clear-filters delegate
    container.addEventListener('click', (event) => {
      const target = event.target;
      if (target instanceof HTMLButtonElement && target.dataset['action'] === 'clear-filters') {
        resetFilters();
        notifyFilters();
      }
    });
  }

  const gist = wrap.querySelector<HTMLElement>('.gist');
  if (gist) {
    gist.replaceChildren(
      h(
        'li',
        { class: 'gist__item' },
        path
          ? `Filtered to ${path.name}: ${path.lodgingShape}.`
          : 'Two bases — west side (Marblemount/Rockport, Nights 1-2) and east side (Winthrop/Mazama, Nights 3-4).'
      ),
      h(
        'li',
        { class: 'gist__item' },
        h('strong', {}, 'Filter chips above narrow the list.'),
        ' Tap ',
        h('strong', {}, '✓ Pick'),
        ' on cards to build a shortlist · compare table appears below.'
      ),
      h(
        'li',
        { class: 'gist__item' },
        'Each card has a photo carousel + a drive-time matrix (tap to expand). 2 beds, 1-2 bedrooms, ~$200-300 — Terra Nova tier.'
      )
    );
  }

  if (tabs) {
    const newTabs = tabs.cloneNode(true) as HTMLElement;
    tabs.replaceWith(newTabs);
    newTabs.addEventListener('click', (event) => {
      const target = event.target;
      if (!(target instanceof HTMLButtonElement)) return;
      if (target.disabled) return;
      const side = target.dataset['target'];
      if (side !== 'west' && side !== 'east') return;
      const allTabs = newTabs.querySelectorAll<HTMLButtonElement>('.tab');
      allTabs.forEach((t) => {
        const active = t.dataset['target'] === side;
        t.classList.toggle('tab--active', active);
        t.setAttribute('aria-selected', active ? 'true' : 'false');
      });
      westPanel.hidden = side !== 'west';
      eastPanel.hidden = side !== 'east';
    });
  }
}

export function renderLodging(): HTMLElement {
  const tabs = h(
    'div',
    { class: 'tabs', role: 'tablist', 'aria-label': 'Lodging side' },
    h(
      'button',
      {
        class: 'tab tab--active',
        type: 'button',
        role: 'tab',
        id: 'lodging-tab-west',
        'aria-selected': 'true',
        'aria-controls': 'lodging-panel-west',
        'data-target': 'west',
      },
      'West · Nights 1-2'
    ),
    h(
      'button',
      {
        class: 'tab',
        type: 'button',
        role: 'tab',
        id: 'lodging-tab-east',
        'aria-selected': 'false',
        'aria-controls': 'lodging-panel-east',
        'data-target': 'east',
      },
      'East · Nights 3-4'
    )
  );

  const sourceStrip = h(
    'ul',
    { class: 'source-strip', 'aria-label': 'Data sources' },
    h('li', { class: 'source-pill' }, 'Booking.com · live'),
    h('li', { class: 'source-pill' }, 'Vrbo · live'),
    h('li', { class: 'source-pill' }, 'Airbnb · live'),
    h('li', { class: 'source-pill source-pill--warn' }, 'Photos partly representative')
  );

  // Added 2026-05-19. Updated for site rework — Path B is primary, Path A is
  // the locked fallback, both lean on the Marblemount cluster as the west base.
  const splitCallout = h(
    'div',
    { class: 'lodging-split-callout' },
    h('h3', { class: 'lodging-split-callout__title' }, 'Two locked shapes · same west base'),
    h(
      'ol',
      { class: 'lodging-split-callout__list' },
      h(
        'li',
        {},
        h('strong', {}, 'Path B (primary) — 2 nights west + 2 nights east:'),
        ' Marblemount cluster Nights 1-2 → Winthrop/Mazama Nights 3-4. ',
        h(
          'em',
          {},
          '"the Marble Mount side, just because in case that road doesn\'t open up in time… within an hour driving range."'
        ),
        ' — Erin May 18, 11:43pm VN.'
      ),
      h(
        'li',
        {},
        h('strong', {}, 'Path A (locked fallback) — 4 nights in Marblemount cluster:'),
        ' one cabin all trip in Marblemount / Concrete / Rockport. Engages automatically if WA-20 stays closed.'
      )
    ),
    h(
      'p',
      { class: 'lodging-split-callout__note' },
      'Both shapes share the same west base — what differs is whether we add an east-side stretch. Picks below are graded against the Path B 2+2 by default; the Path B picks also work for Path A by extending the west stay.'
    )
  );
  // Lodging Owner pass (2026-05-17): page-level disclaimer absorbs the
  // pills that used to repeat on every card: ✅ Verified May 2026, ⚠️ Verify
  // beds at booking, 📅 Aug 16-20: verify. Surfacing once instead of 19x.
  const sourceNote = h(
    'p',
    {
      style:
        'font-size: 0.78rem; color: var(--c-ink-500); margin: 0 0 var(--sp-4); line-height: 1.5;',
    },
    h('strong', {}, '✅ Verified May 2026.'),
    ' Review scores + prices searched live for Aug 16-20, 2026 dates. ',
    h('strong', {}, '⚠️ Multi-unit properties: confirm bed configuration at booking'),
    ' — cabin layouts vary by unit type, lodge rooms often differ from cabins. ',
    h('strong', {}, '📅 Aug 16-20 availability:'),
    ' verify on the booking site, supply fluctuates. ',
    'Some non-primary carousel photos are stock or regional context — see booking links for actual property photos.'
  );

  const chipBar = renderChipBar();
  const shortlistContainer = renderShortlistContainer();
  const shortlistFab = renderShortlistFloater();

  const wrap = section(
    'lodging',
    'Lodging',
    h('ul', { class: 'gist' }),
    sourceStrip,
    sourceNote,
    splitCallout,
    chipBar,
    shortlistContainer,
    tabs,
    h('div', { class: 'lodging-panels' }),
    shortlistFab
  );

  renderBody(wrap, getSelectedPath());

  // Re-render panels when filters change.
  onFilterChange(() => {
    updateChipBar(chipBar);
    renderBody(wrap, getSelectedPath());
  });

  // Re-render panels (so pick states flip) + shortlist + FAB when shortlist changes.
  onShortlistChange(() => {
    // Update FAB
    shortlistFab.classList.toggle('shortlist-fab--visible', shortlist.size > 0);
    const fabCount = shortlistFab.querySelector<HTMLElement>('.shortlist-fab__count');
    if (fabCount) fabCount.textContent = `${shortlist.size}`;

    // Update shortlist panel contents
    const oldPanel = shortlistContainer.querySelector<HTMLElement>(
      '.shortlist-panel'
    );
    if (oldPanel) oldPanel.remove();
    shortlistContainer.appendChild(renderShortlistPanel());
    const summaryCount = shortlistContainer.querySelector<HTMLElement>('.shortlist__count');
    if (summaryCount) summaryCount.textContent = `${shortlist.size}`;

    // Re-render panels so card pick-states flip.
    renderBody(wrap, getSelectedPath());
  });

  subscribeSelectedPath((next) => renderBody(wrap, next));

  return wrap;
}
