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
  BOOKED_STAYS,
  EAST_LODGING,
  WEST_LODGING,
  sortByNature,
  type BookedStay,
  type Lodging,
  type LodgingTier,
} from '../../data/lodging';
import { getPathById } from '../../data/paths';
import { getSelectedPath, subscribeSelectedPath } from '../../state/path';
import { h, section } from '../../dom';

import {
  filters,
  lodgingMatchesFilters,
  notifyFilters,
  onFilterChange,
  resetFilters,
  unverifiedHiddenCount,
  verifiedPickCount,
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

  // Empty-state copy depends on WHY the list is empty. In trust-mode with
  // 0 confirmed picks on this side, the friendlier framing is "Allison
  // hasn't verified any picks on this side yet" + an explicit widen-the-
  // list button — not the generic "clear filters" pointer (which lands
  // on the same trust-mode default and just re-renders empty).
  const emptyState =
    totalShown === 0
      ? filters.verifiedOnly
        ? h(
            'p',
            { class: 'lodging-empty' },
            'Allison hasn\'t verified any picks on this side yet. ',
            h(
              'button',
              {
                type: 'button',
                class: 'lodging-empty__clear',
                'data-action': 'show-unverified',
              },
              'Show unverified properties (needs phone-confirmation)'
            )
          )
        : h(
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
  const path = getPathById(selectedId as 'A' | 'B');
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

/**
 * Re-render the trust-mode banner in place. Called both at first render
 * and on every filter change (so toggling "Verified picks only" off via
 * the chip flips the banner copy in sync).
 *
 * The banner has two voices:
 *   - trust-mode ON  (default): "Showing N personally verified picks for
 *     Aug 16-20. [Show all (M more, need phone-confirmation)]"
 *   - trust-mode OFF: "Showing all properties incl. unverified.
 *     [Back to verified-only]"
 */
function renderTrustBanner(host: HTMLElement): void {
  const verifiedCount = verifiedPickCount();
  const unverifiedCount = unverifiedHiddenCount();

  if (filters.verifiedOnly) {
    host.replaceChildren(
      h(
        'p',
        { class: 'lodging-trust-banner__copy' },
        h(
          'strong',
          {},
          `Showing only the ${verifiedCount} propert${verifiedCount === 1 ? 'y' : 'ies'} Allison personally verified for Aug 16-20.`
        ),
        ' Auto-scraped availability proved unreliable, so unverified picks are hidden until phone-confirmed. '
      ),
      h(
        'button',
        {
          type: 'button',
          class: 'lodging-trust-banner__toggle',
          'data-action': 'show-unverified',
        },
        `Show all (${unverifiedCount} more, need phone-confirmation)`
      )
    );
  } else {
    host.replaceChildren(
      h(
        'p',
        { class: 'lodging-trust-banner__copy' },
        'Showing all properties, including ',
        h('strong', {}, `${unverifiedCount} unverified`),
        ' picks that need a phone call to confirm Aug 16-20 availability.'
      ),
      h(
        'button',
        {
          type: 'button',
          class: 'lodging-trust-banner__toggle',
          'data-action': 'verified-only',
        },
        `Back to verified-only (${verifiedCount})`
      )
    );
  }
}

function renderBody(wrap: HTMLElement, selectedId: string | null): void {
  const panels = determinePanels(selectedId);
  const path = selectedId ? getPathById(selectedId as 'A' | 'B') : null;
  const pathLodgingIds = path ? new Set(path.lodgingIds) : null;

  const trustBanner = wrap.querySelector<HTMLElement>('.lodging-trust-banner');
  if (trustBanner) renderTrustBanner(trustBanner);

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

  // Default to the west panel for both Path A (west-only) and Path B (starts
  // west). Was a path?.id === 'C' branch for east-default — Path C was removed
  // 2026-05-19. `path` referenced to keep the binding live for future per-path
  // defaults.
  void path;
  const defaultSide: 'west' | 'east' = 'west';
  eastPanel.hidden = true;
  westPanel.hidden = false;

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
    // Empty-state delegate. Handles both:
    //   - clear-filters  (legacy: returns to default trust-mode baseline)
    //   - show-unverified (trust-mode 0-results case: flips verifiedOnly off
    //     so the user can see what's behind the curtain on this side)
    container.addEventListener('click', (event) => {
      const target = event.target;
      if (!(target instanceof HTMLButtonElement)) return;
      if (target.dataset['action'] === 'clear-filters') {
        resetFilters();
        notifyFilters();
      } else if (target.dataset['action'] === 'show-unverified') {
        filters.verifiedOnly = false;
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
        h('strong', {}, 'Lodging is booked.'),
        ' Three Airbnbs are reserved for Aug 16–20 (Arlington + two in Sedro-Woolley) — all kept for now until Allison + Erin pick one and cancel the rest. See the booked-stays cards above.'
      ),
      h(
        'li',
        { class: 'gist__item' },
        'All three booked stays sit WEST of the WA-20 corridor — accessible even if the highway stays closed — and ~40 min farther west than the Marblemount cluster the comparison below was built around.'
      ),
      h(
        'li',
        { class: 'gist__item' },
        'The filter/shortlist comparison below is pre-booking research, kept for the record.'
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

// ====================================================================
// BOOKED STAYS — top-of-section reality (May 19-20, 2026)
// ====================================================================

/** One booked-stay card. */
function renderBookedStayCard(stay: BookedStay): HTMLElement {
  const facts: HTMLElement[] = [];
  if (stay.host) {
    facts.push(h('dt', {}, 'Host'), h('dd', {}, stay.host));
  }
  if (stay.guests) {
    facts.push(h('dt', {}, 'Sleeps'), h('dd', {}, `${stay.guests} guests`));
  }
  if (stay.layout) {
    facts.push(h('dt', {}, 'Layout'), h('dd', {}, stay.layout));
  }
  if (stay.price) {
    facts.push(h('dt', {}, 'Price'), h('dd', {}, stay.price));
  }
  if (stay.rating) {
    facts.push(h('dt', {}, 'Rating'), h('dd', {}, stay.rating));
  }
  facts.push(
    h('dt', {}, 'Booked by'),
    h('dd', {}, stay.bookedBy)
  );
  facts.push(
    h('dt', {}, 'Confirmation'),
    h('dd', {}, stay.conf ?? '—')
  );
  return h(
    'article',
    { class: 'card booked-stay-card', 'aria-label': `Booked: ${stay.name}` },
    h(
      'header',
      { class: 'card__header' },
      h('span', { class: 'booked-stay-card__badge' }, '✅ Booked'),
      h('h4', { class: 'card__title' }, stay.name)
    ),
    h('p', { class: 'booked-stay-card__place' }, stay.place),
    stay.unitType ? h('p', { class: 'booked-stay-card__addr' }, stay.unitType) : null,
    stay.address ? h('p', { class: 'booked-stay-card__addr' }, stay.address) : null,
    h('dl', { class: 'card__facts' }, ...facts),
    stay.freeCancellation
      ? h(
          'p',
          { class: 'booked-stay-card__feature' },
          stay.freeCancelUntil
            ? `✓ Free cancellation until ${stay.freeCancelUntil}`
            : '✓ Free cancellation'
        )
      : null,
    stay.feature ? h('p', { class: 'booked-stay-card__feature' }, stay.feature) : null,
    stay.source ? h('p', { class: 'booked-stay-card__source' }, stay.source) : null
  );
}

/** Booked-stays block — leads the Lodging section now that three Airbnbs are
 *  reserved for the same dates. All three are kept on purpose (Allison May 21):
 *  she + Erin haven't picked yet. Decide before the free-cancellation windows
 *  close. Allison booked two; Erin booked The Carriage House. */
function renderBookedStays(): HTMLElement {
  return h(
    'div',
    { class: 'booked-stays' },
    h('h3', { class: 'booked-stays__title' }, 'Booked stays'),
    h(
      'p',
      { class: 'booked-stays__warning', role: 'note' },
      h('strong', {}, 'Three reservations, same dates — all kept for now. '),
      'All three Airbnbs below hold the identical nights (Aug 16–20). Allison booked two (Sedro-Woolley Lakeside + Arlington); Erin booked The Carriage House (Sedro-Woolley). ',
      h('strong', {}, 'Allison + Erin haven\'t picked yet'),
      ' — decide before each free-cancellation window closes, then cancel the rest.'
    ),
    h(
      'div',
      { class: 'card-grid booked-stays__grid' },
      ...BOOKED_STAYS.map(renderBookedStayCard)
    ),
    h(
      'ul',
      { class: 'booked-stays__notes' },
      h(
        'li',
        {},
        h('strong', {}, 'Location: '),
        'all three (Arlington + the two Sedro-Woolley stays) are WEST of the WA-20 corridor — accessible even if the highway stays closed — but ~40 min farther west than the old Marblemount-cluster plan. Sedro-Woolley is ≈ 1 hr 15 to Marblemount-area trailheads.'
      ),
      h(
        'li',
        {},
        h('strong', {}, 'Address note: '),
        'Erin shared "27024 Minkler Rd, Sedro-Woolley, WA 98284" as "the house" — it\'s not confirmed which Sedro-Woolley listing that address belongs to.'
      ),
      h(
        'li',
        {},
        h('strong', {}, 'Kosher / kitchen: '),
        'the cook-in-from-Va\'ad-groceries plan still holds across the options.'
      )
    )
  );
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

  // Reframed 2026-05-21 — lodging is now BOOKED (see renderBookedStays above).
  // The path-shape comparison below is kept for context (which trailheads each
  // path reaches) but it is no longer a lodging decision surface.
  const splitCallout = h(
    'details',
    { class: 'disclosure lodging-split-callout' },
    h(
      'summary',
      { class: 'disclosure__summary' },
      'How we got here · the Marblemount-cluster comparison (pre-booking)'
    ),
    h(
      'p',
      { class: 'disclosure__lede' },
      'Lodging is booked (above). The picks and the two path-shapes below are the research that led there — kept for the record, not a live choice. NB: the booked house sits ~40 min farther west than the Marblemount cluster these were graded against, so drive-times here run short.'
    ),
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

  // Trust-mode banner — sits directly above the tabs so it's the first
  // thing a reader sees when scanning into the lodging grid. Populated
  // by renderTrustBanner() on every renderBody() call so its copy
  // tracks `filters.verifiedOnly`.
  const trustBanner = h('div', {
    class: 'lodging-trust-banner',
    role: 'note',
    'aria-live': 'polite',
  });

  // Delegate the trust-banner toggle buttons. Lives on the banner element
  // itself (not bubbled up through the panels container, which already
  // owns the empty-state delegate).
  trustBanner.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLButtonElement)) return;
    if (target.dataset['action'] === 'show-unverified') {
      filters.verifiedOnly = false;
      notifyFilters();
    } else if (target.dataset['action'] === 'verified-only') {
      filters.verifiedOnly = true;
      notifyFilters();
    }
  });

  // The full comparison apparatus (chip filters, shortlist, tabs, panels) is
  // now history — lodging is booked (see renderBookedStays). Demote it behind
  // one expander. querySelector in renderBody still reaches these elements
  // regardless of the <details> nesting, so all wiring keeps working.
  const comparisonApparatus = h(
    'details',
    { class: 'disclosure lodging-comparison' },
    h(
      'summary',
      { class: 'disclosure__summary' },
      'Browse the full Marblemount-cluster comparison (pre-booking research)'
    ),
    h(
      'p',
      { class: 'disclosure__lede' },
      'Kept for the record. The booked house is ~40 min west of this cluster, so the per-card drive-times below run short for the actual stay.'
    ),
    sourceStrip,
    sourceNote,
    chipBar,
    shortlistContainer,
    trustBanner,
    tabs,
    h('div', { class: 'lodging-panels' })
  );

  const wrap = section(
    'lodging',
    'Lodging',
    h('ul', { class: 'gist' }),
    renderBookedStays(),
    splitCallout,
    comparisonApparatus,
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
