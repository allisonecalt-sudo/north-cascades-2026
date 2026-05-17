/**
 * how-to.ts — renderer for the "How to do this trip" decision-tree page.
 *
 * Layout (top → bottom):
 *   1. TLDR card — "3 paths if WA-20 opens, 2 if it doesn't"
 *   2. WA-20 status pill — sets the branch context (reads from closure data)
 *   3. "Pick by question" widget — chips that filter the path list in real time
 *   4. Path cards — visible based on widget filters AND WA-20 branch
 *      - Each card: name + best-for + tradeoff + shape diagram + lodgings +
 *        day-by-day strip + cost + "Pick this path" button (syncs selectedPath
 *        state for A/B/C — D/E/F have no shared state target, so the button on
 *        those cards is a "Lock this plan" placeholder that just toasts)
 *   5. Comparison table — all 6 paths side-by-side
 *   6. Footnotes — links to map, lodging, WA-20 status pages
 *
 * Visual identity matches the WA-20 deep-dive page (scoped CSS, same palette
 * tokens via CSS vars). Path cards use the same "tone" tinting pattern as the
 * contingency cards on wa20-status.
 */

import {
  HOW_TO_PATHS,
  HOW_TO_TLDR,
  HOW_TO_PAGE_META,
  QUESTION_CHIPS,
  matchesFilters,
  type PathOption,
  type QuestionTag,
} from '../data/how-to';
import { WA20_STATUS } from '../data/wa20-status';
import {
  getSelectedPath,
  setSelectedPath,
  subscribeSelectedPath,
} from '../state/path';
import { h, section } from '../dom';

// ====================================================================
// 1. TLDR
// ====================================================================

function renderTldr(): HTMLElement {
  return h(
    'aside',
    { class: 'how-to-tldr', 'aria-label': 'TLDR' },
    h('h3', { class: 'how-to-tldr__title' }, 'TLDR'),
    h('p', { class: 'how-to-tldr__line' }, HOW_TO_TLDR.open),
    h('p', { class: 'how-to-tldr__line how-to-tldr__line--soft' }, HOW_TO_TLDR.closed),
    h(
      'p',
      { class: 'how-to-tldr__hint' },
      'Pick by answering questions below, scan the path cards, or compare them side-by-side.'
    )
  );
}

// ====================================================================
// 2. WA-20 STATUS BRANCH PILL
// ====================================================================

function renderWa20Branch(): HTMLElement {
  const state = WA20_STATUS.state;
  const pillClass = `how-to-branch-pill how-to-branch-pill--${state}`;
  const label =
    state === 'closed'
      ? 'WA-20 currently CLOSED — both branches shown below'
      : state === 'partial'
        ? 'WA-20 PARTIALLY open — both branches shown below'
        : 'WA-20 OPEN — Paths A/B/C are the default; D/E/F shown for reference';
  return h(
    'div',
    { class: 'how-to-branch' },
    h(
      'div',
      { class: pillClass },
      h('span', { class: 'how-to-branch-pill__icon', 'aria-hidden': 'true' }, '⚠'),
      h('span', { class: 'how-to-branch-pill__label' }, label)
    ),
    h(
      'p',
      { class: 'how-to-branch__detail' },
      'Status as of ',
      h('strong', {}, WA20_STATUS.asOfLabel),
      '. ',
      h(
        'a',
        { href: 'wa20-status.html', class: 'how-to-branch__link' },
        'See the WA-20 deep dive →'
      )
    )
  );
}

// ====================================================================
// 3. PICK-BY-QUESTION WIDGET
// ====================================================================

interface PickerState {
  active: Set<QuestionTag>;
}

function renderPicker(state: PickerState, onChange: () => void): HTMLElement {
  // Group chips by question.
  const groups = new Map<string, typeof QUESTION_CHIPS[number][]>();
  for (const chip of QUESTION_CHIPS) {
    const arr = groups.get(chip.question) ?? [];
    arr.push(chip);
    groups.set(chip.question, arr);
  }

  const widget = h(
    'div',
    { class: 'how-to-picker', 'aria-label': 'Pick by question' },
    h('h3', { class: 'how-to-picker__title' }, 'Pick by question'),
    h(
      'p',
      { class: 'how-to-picker__lede' },
      'Tap chips to narrow. Empty = show everything.'
    )
  );

  for (const [question, chips] of groups) {
    const row = h(
      'div',
      { class: 'how-to-picker__row' },
      h('span', { class: 'how-to-picker__question' }, question),
      h(
        'div',
        { class: 'how-to-picker__chips' },
        ...chips.map((chip) => {
          const isActive = state.active.has(chip.tag);
          const btn = h(
            'button',
            {
              type: 'button',
              class: `how-to-chip${isActive ? ' how-to-chip--active' : ''}`,
              'data-tag': chip.tag,
              'aria-pressed': isActive ? 'true' : 'false',
              title: chip.hint,
            },
            chip.label
          );
          btn.addEventListener('click', () => {
            if (state.active.has(chip.tag)) {
              state.active.delete(chip.tag);
            } else {
              state.active.add(chip.tag);
            }
            onChange();
          });
          return btn;
        })
      )
    );
    widget.appendChild(row);
  }

  // Clear-all link.
  const clear = h(
    'button',
    {
      type: 'button',
      class: 'how-to-picker__clear',
    },
    'Clear all answers'
  );
  clear.addEventListener('click', () => {
    state.active.clear();
    onChange();
  });
  widget.appendChild(clear);

  return widget;
}

// ====================================================================
// 4. PATH CARDS
// ====================================================================

function shapeDiagram(path: PathOption): HTMLElement {
  return h(
    'div',
    { class: 'how-to-shape', 'aria-label': 'Lodging shape' },
    ...path.shape.map((cell) =>
      h(
        'div',
        { class: 'how-to-shape__cell' },
        h('span', { class: 'how-to-shape__nights' }, cell.nights),
        h('span', { class: 'how-to-shape__arrow', 'aria-hidden': 'true' }, '↓'),
        h('span', { class: 'how-to-shape__base' }, cell.base)
      )
    )
  );
}

function lodgingPicks(path: PathOption): HTMLElement {
  if (path.lodgings.length === 0) {
    return h(
      'p',
      { class: 'how-to-card__no-lodging' },
      'No lodging picks — destination/timeline not yet locked.'
    );
  }
  return h(
    'ul',
    { class: 'how-to-card__lodgings' },
    ...path.lodgings.map((pick) =>
      h(
        'li',
        { class: 'how-to-card__lodging' },
        h(
          'a',
          {
            class: 'how-to-card__lodging-link',
            href: `lodging.html#${pick.id}`,
          },
          h('span', { class: 'how-to-card__lodging-name' }, pick.name)
        ),
        h(
          'span',
          { class: 'how-to-card__lodging-meta' },
          h('span', { class: 'how-to-card__lodging-base' }, pick.base),
          h(
            'span',
            {
              class: `how-to-card__kitchen-pill how-to-card__kitchen-pill--${pick.kitchen}`,
            },
            pick.kitchen === 'full'
              ? 'Full kitchen'
              : pick.kitchen === 'kitchenette'
                ? 'Kitchenette'
                : 'No kitchen'
          )
        ),
        h('p', { class: 'how-to-card__lodging-why' }, pick.why)
      )
    )
  );
}

function daysStrip(path: PathOption): HTMLElement {
  return h(
    'ol',
    { class: 'how-to-card__days' },
    ...path.days.map((day) =>
      h(
        'li',
        { class: 'how-to-card__day' },
        h('span', { class: 'how-to-card__day-label' }, day.label),
        h('p', { class: 'how-to-card__day-shape' }, day.shape),
        h(
          'ul',
          { class: 'how-to-card__day-hits' },
          ...day.hits.map((hit) => h('li', { class: 'how-to-card__day-hit' }, hit))
        )
      )
    )
  );
}

function pickButton(path: PathOption, isSelected: boolean): HTMLElement {
  // Paths A/B/C sync with the global selectedPath state. Paths D/E/F have no
  // shared state target (they're Plan-B routings, not the curated 3) — for
  // those, the button just toasts "Lock this plan" so the reader has the
  // affordance but doesn't break state.
  // sharablePathId is typed to PathId | null so TS knows it's narrowable.
  const sharablePathId: 'A' | 'B' | 'C' | null =
    path.id === 'A' || path.id === 'B' || path.id === 'C' ? path.id : null;
  const isSharable = sharablePathId !== null;
  const btn = h(
    'button',
    {
      type: 'button',
      class: `how-to-card__pick${isSelected ? ' how-to-card__pick--active' : ''}`,
      'data-action': isSelected ? 'clear' : 'select',
      'data-path': path.id,
    },
    isSelected ? '✓ Picked' : isSharable ? 'Pick this path' : 'This is the plan'
  );
  btn.addEventListener('click', () => {
    if (sharablePathId === null) {
      showToast(`Plan ${path.id} noted. (Paths D-F are Plan-B routings — not stored yet.)`);
      return;
    }
    if (isSelected) {
      setSelectedPath(null);
      showToast('Cleared — comparing all paths.');
    } else {
      setSelectedPath(sharablePathId);
      showToast(`Path ${path.id} picked. Rest of the site filters to it.`);
    }
  });
  return btn;
}

function renderPathCard(path: PathOption, isSelected: boolean): HTMLElement {
  const branchClass = `how-to-card how-to-card--${path.wa20Branch}${
    path.lastResort ? ' how-to-card--last-resort' : ''
  }${isSelected ? ' how-to-card--selected' : ''}`;
  return h(
    'article',
    { class: branchClass, 'data-path-id': path.id },
    h(
      'header',
      { class: 'how-to-card__header' },
      h('span', { class: `how-to-card__id-pill how-to-card__id-pill--${path.wa20Branch}` }, `Path ${path.id}`),
      h('h4', { class: 'how-to-card__name' }, path.name.replace(`Path ${path.id} · `, '')),
      h('p', { class: 'how-to-card__tagline' }, path.tagline)
    ),
    h(
      'div',
      { class: 'how-to-card__badges' },
      h(
        'span',
        { class: 'how-to-card__badge how-to-card__badge--best-for' },
        h('span', { class: 'how-to-card__badge-label' }, 'Best for: '),
        path.bestFor
      ),
      h(
        'span',
        { class: 'how-to-card__badge how-to-card__badge--tradeoff' },
        h('span', { class: 'how-to-card__badge-label' }, 'Tradeoff: '),
        path.tradeoff
      )
    ),
    shapeDiagram(path),
    h(
      'div',
      { class: 'how-to-card__section' },
      h('h5', { class: 'how-to-card__section-title' }, 'Where you sleep'),
      lodgingPicks(path)
    ),
    h(
      'div',
      { class: 'how-to-card__section' },
      h('h5', { class: 'how-to-card__section-title' }, 'Day-by-day skeleton'),
      daysStrip(path)
    ),
    h(
      'dl',
      { class: 'how-to-card__stats' },
      h('dt', {}, 'Drive total'),
      h('dd', {}, path.driveTotal),
      h('dt', {}, 'Marquee hikes'),
      h('dd', {}, `${path.hikeCount}`),
      h('dt', {}, 'Cost range'),
      h('dd', {}, path.costRange),
      h('dt', {}, 'WA-20 dependency'),
      h(
        'dd',
        {},
        path.wa20Dependency === 'none'
          ? 'None — works either way'
          : path.wa20Dependency === 'connector-only'
            ? 'Connector day only'
            : 'High — collapses if closed'
      )
    ),
    h('div', { class: 'how-to-card__actions' }, pickButton(path, isSelected))
  );
}

// ====================================================================
// Path-grid rendering — re-renders on filter change AND path change
// ====================================================================

function renderPathGrid(
  container: HTMLElement,
  pickerState: PickerState,
  selectedPath: string | null
): void {
  const visible = HOW_TO_PATHS.filter((p) => matchesFilters(p, pickerState.active));

  if (visible.length === 0) {
    container.replaceChildren(
      h(
        'p',
        { class: 'how-to-grid__empty' },
        'No paths match those answers. ',
        h('span', { style: 'opacity: 0.7' }, 'Try clearing a chip — the constraints conflict.')
      )
    );
    return;
  }

  // Split by branch so the "If WA-20 opens" + "If WA-20 stays closed"
  // headings make the structure unmissable.
  const openPaths = visible.filter((p) => p.wa20Branch === 'open');
  const closedPaths = visible.filter((p) => p.wa20Branch === 'closed');

  const frags: HTMLElement[] = [];
  if (openPaths.length > 0) {
    frags.push(
      h(
        'h3',
        { class: 'how-to-grid__branch-title how-to-grid__branch-title--open' },
        'If WA-20 opens by June 25'
      ),
      h(
        'div',
        { class: 'how-to-grid' },
        ...openPaths.map((p) => renderPathCard(p, p.id === selectedPath))
      )
    );
  }
  if (closedPaths.length > 0) {
    frags.push(
      h(
        'h3',
        { class: 'how-to-grid__branch-title how-to-grid__branch-title--closed' },
        'If WA-20 stays closed past June 25'
      ),
      h(
        'div',
        { class: 'how-to-grid' },
        ...closedPaths.map((p) => renderPathCard(p, p.id === selectedPath))
      )
    );
  }
  container.replaceChildren(...frags);
}

// ====================================================================
// 5. COMPARISON TABLE
// ====================================================================

function renderComparison(): HTMLElement {
  const wrap = h(
    'div',
    { class: 'how-to-compare' },
    h('h3', { class: 'how-to-block-title' }, 'Side-by-side comparison'),
    h(
      'p',
      { class: 'how-to-block-lede' },
      'All 6 paths at a glance. Scroll horizontally on mobile.'
    )
  );

  const tableWrap = h('div', { class: 'how-to-compare__scroll' });
  const table = h(
    'table',
    { class: 'how-to-compare__table' },
    h(
      'thead',
      {},
      h(
        'tr',
        {},
        h('th', { scope: 'col' }, 'Path'),
        h('th', { scope: 'col' }, 'Shape'),
        h('th', { scope: 'col' }, 'Hikes'),
        h('th', { scope: 'col' }, 'Drive'),
        h('th', { scope: 'col' }, 'Cost'),
        h('th', { scope: 'col' }, 'WA-20 dep')
      )
    ),
    h(
      'tbody',
      {},
      ...HOW_TO_PATHS.map((p) =>
        h(
          'tr',
          { class: `how-to-compare__row how-to-compare__row--${p.wa20Branch}` },
          h(
            'th',
            { scope: 'row' },
            h('span', { class: `how-to-card__id-pill how-to-card__id-pill--${p.wa20Branch}` }, `Path ${p.id}`),
            h('span', { class: 'how-to-compare__path-name' }, p.name.replace(`Path ${p.id} · `, ''))
          ),
          h(
            'td',
            {},
            p.shape.map((c) => `${c.nights}: ${c.base}`).join(' → ')
          ),
          h('td', {}, `${p.hikeCount}`),
          h('td', {}, p.driveTotal),
          h('td', {}, p.costRange),
          h(
            'td',
            {},
            p.wa20Dependency === 'none'
              ? 'None'
              : p.wa20Dependency === 'connector-only'
                ? 'Connector only'
                : 'High'
          )
        )
      )
    )
  );
  tableWrap.appendChild(table);
  wrap.appendChild(tableWrap);
  return wrap;
}

// ====================================================================
// 6. FOOTNOTES
// ====================================================================

function renderFootnotes(): HTMLElement {
  return h(
    'aside',
    { class: 'how-to-footnotes' },
    h('h3', { class: 'how-to-footnotes__title' }, 'Going deeper'),
    h(
      'ul',
      { class: 'how-to-footnotes__list' },
      h(
        'li',
        {},
        h('a', { href: 'map.html' }, 'Map →'),
        ' — see all paths plotted on the interactive map.'
      ),
      h(
        'li',
        {},
        h('a', { href: 'lodging.html' }, 'Lodging →'),
        ' — full property cards with photos, drive matrices, free-cancellation flags.'
      ),
      h(
        'li',
        {},
        h('a', { href: 'wa20-status.html' }, 'WA-20 status →'),
        ' — source-by-source closure status, phone-check protocol, affected destinations, contingency routing.'
      ),
      h(
        'li',
        {},
        h('a', { href: 'weather-plan-c.html' }, 'Weather Plan C →'),
        ' — smoke + bad-air swaps for any day.'
      ),
      h(
        'li',
        {},
        h('a', { href: 'costs.html' }, 'Costs →'),
        ' — flights + lodging + rental + food breakdown.'
      )
    )
  );
}

// ====================================================================
// TOAST — tiny celebration / status feedback
// ====================================================================

let toastTimer: ReturnType<typeof setTimeout> | null = null;
function showToast(message: string): void {
  if (typeof document === 'undefined') return;
  let toast = document.getElementById('how-to-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'how-to-toast';
    toast.className = 'how-to-toast';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('how-to-toast--visible');
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast?.classList.remove('how-to-toast--visible');
  }, 2400);
}

// ====================================================================
// SCOPED STYLES
// ====================================================================

const STYLE_ID = 'how-to-styles';

function ensureStyles(): void {
  if (typeof document === 'undefined') return;
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = HOW_TO_CSS;
  document.head.appendChild(style);
}

const HOW_TO_CSS = `
.how-to-tldr {
  background: var(--c-warm-100, #f5efe2);
  border: 1px solid var(--c-line, #d9d4ca);
  border-left: 4px solid var(--c-glacier-500, #4a86a5);
  border-radius: var(--radius-md, 10px);
  padding: var(--sp-4, 16px);
  margin-bottom: var(--sp-4, 16px);
}
.how-to-tldr__title { margin: 0 0 var(--sp-2, 8px); font-size: var(--fs-lg, 1.1rem); }
.how-to-tldr__line { margin: 0 0 var(--sp-2, 8px); line-height: 1.55; font-size: 0.98rem; }
.how-to-tldr__line--soft { color: var(--c-ink-soft, #514a3b); }
.how-to-tldr__hint { margin: 0; font-size: 0.88rem; font-style: italic; color: var(--c-ink-soft, #514a3b); }

.how-to-branch {
  margin-bottom: var(--sp-4, 16px);
}
.how-to-branch-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.42rem 0.85rem;
  border-radius: 999px;
  font-weight: 700;
  font-size: 0.95rem;
  letter-spacing: 0.02em;
  margin-bottom: var(--sp-2, 8px);
}
.how-to-branch-pill--closed { background: #c4393a; color: #fff; }
.how-to-branch-pill--partial { background: #d9a441; color: #2a1d05; }
.how-to-branch-pill--open { background: #2a8d5a; color: #fff; }
.how-to-branch-pill__icon { font-size: 0.95rem; }
.how-to-branch__detail { margin: 0; font-size: 0.9rem; opacity: 0.9; }
.how-to-branch__link { color: var(--c-glacier-500, #4a86a5); font-weight: 600; }

.how-to-picker {
  background: #fff;
  border: 1px solid var(--c-line, #d9d4ca);
  border-radius: var(--radius-md, 10px);
  padding: var(--sp-4, 16px);
  margin-bottom: var(--sp-4, 16px);
}
.how-to-picker__title { margin: 0 0 var(--sp-1, 4px); font-size: var(--fs-lg, 1.1rem); }
.how-to-picker__lede { margin: 0 0 var(--sp-3, 12px); font-size: 0.9rem; color: var(--c-ink-soft, #514a3b); }
.how-to-picker__row {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: var(--sp-2, 8px);
  margin-bottom: var(--sp-3, 12px);
}
.how-to-picker__question {
  flex: 0 0 auto;
  min-width: 95px;
  font-weight: 600;
  font-size: 0.85rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--c-ink-soft, #514a3b);
}
.how-to-picker__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}
.how-to-chip {
  font: inherit;
  cursor: pointer;
  padding: 0.36rem 0.75rem;
  border-radius: 999px;
  background: var(--c-warm-100, #f5efe2);
  border: 1px solid var(--c-line, #d9d4ca);
  color: var(--c-ink, #2b2620);
  font-size: 0.88rem;
  transition: background 120ms ease, color 120ms ease, border-color 120ms ease;
}
.how-to-chip:hover { background: #efe7d2; }
.how-to-chip--active {
  background: var(--c-glacier-500, #4a86a5);
  border-color: var(--c-glacier-500, #4a86a5);
  color: #fff;
  font-weight: 600;
}
.how-to-picker__clear {
  font: inherit;
  background: transparent;
  border: none;
  color: var(--c-glacier-500, #4a86a5);
  cursor: pointer;
  padding: 0;
  font-size: 0.88rem;
  text-decoration: underline;
}
.how-to-picker__clear:hover { color: var(--c-glacier-600, #356a87); }

.how-to-grid__branch-title {
  margin: var(--sp-5, 24px) 0 var(--sp-2, 8px);
  font-size: 1.05rem;
  padding-bottom: 0.3rem;
  border-bottom: 2px solid var(--c-line, #d9d4ca);
}
.how-to-grid__branch-title--open { border-bottom-color: #2a8d5a; }
.how-to-grid__branch-title--closed { border-bottom-color: #c4393a; }

.how-to-grid {
  display: grid;
  gap: var(--sp-4, 16px);
  margin-bottom: var(--sp-4, 16px);
}
.how-to-grid__empty {
  padding: var(--sp-4, 16px);
  background: var(--c-warm-100, #f5efe2);
  border-radius: var(--radius-md, 10px);
  text-align: center;
}

.how-to-card {
  background: #fff;
  border: 1px solid var(--c-line, #d9d4ca);
  border-radius: var(--radius-md, 10px);
  padding: var(--sp-4, 16px);
  border-left: 4px solid var(--c-line, #d9d4ca);
  transition: box-shadow 160ms ease;
}
.how-to-card--open { border-left-color: #2a8d5a; }
.how-to-card--closed { border-left-color: #c4393a; }
.how-to-card--last-resort { border-left-color: #d9a441; background: #fff9ec; }
.how-to-card--selected {
  box-shadow: 0 0 0 2px var(--c-glacier-500, #4a86a5);
}

.how-to-card__header {
  margin-bottom: var(--sp-3, 12px);
}
.how-to-card__id-pill {
  display: inline-block;
  padding: 0.18rem 0.6rem;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: #fff;
  margin-right: 0.5rem;
}
.how-to-card__id-pill--open { background: #2a8d5a; }
.how-to-card__id-pill--closed { background: #c4393a; }
.how-to-card__name {
  display: inline;
  margin: 0;
  font-size: 1.1rem;
}
.how-to-card__tagline {
  margin: 0.3rem 0 0;
  color: var(--c-ink-soft, #514a3b);
  font-size: 0.95rem;
  line-height: 1.5;
}

.how-to-card__badges {
  display: grid;
  gap: var(--sp-2, 8px);
  margin-bottom: var(--sp-3, 12px);
}
.how-to-card__badge {
  display: block;
  padding: var(--sp-2, 8px) var(--sp-3, 12px);
  border-radius: var(--radius-sm, 6px);
  font-size: 0.9rem;
  line-height: 1.5;
}
.how-to-card__badge--best-for { background: #e3f1eb; color: #1f4a3a; }
.how-to-card__badge--tradeoff { background: #fdecec; color: #6d1a1b; }
.how-to-card__badge-label { font-weight: 700; }

.how-to-shape {
  display: flex;
  flex-wrap: wrap;
  align-items: stretch;
  gap: var(--sp-2, 8px);
  margin-bottom: var(--sp-3, 12px);
}
.how-to-shape__cell {
  flex: 1 1 140px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--sp-3, 12px);
  background: var(--c-warm-100, #f5efe2);
  border: 1px dashed var(--c-line, #d9d4ca);
  border-radius: var(--radius-sm, 6px);
  text-align: center;
}
.how-to-shape__nights {
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--c-ink-soft, #514a3b);
}
.how-to-shape__arrow {
  font-size: 0.95rem;
  color: var(--c-glacier-500, #4a86a5);
  margin: 0.2rem 0;
}
.how-to-shape__base {
  font-weight: 700;
  font-size: 0.95rem;
}

.how-to-card__section { margin-bottom: var(--sp-3, 12px); }
.how-to-card__section-title {
  margin: 0 0 var(--sp-2, 8px);
  font-size: 0.85rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--c-ink-soft, #514a3b);
}

.how-to-card__lodgings {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: var(--sp-2, 8px);
}
.how-to-card__lodging {
  padding: var(--sp-2, 8px) var(--sp-3, 12px);
  background: #fafafa;
  border-radius: var(--radius-sm, 6px);
  border: 1px solid var(--c-line, #d9d4ca);
}
.how-to-card__lodging-link {
  text-decoration: none;
  color: inherit;
}
.how-to-card__lodging-link:hover .how-to-card__lodging-name { text-decoration: underline; }
.how-to-card__lodging-name { font-weight: 600; font-size: 0.95rem; }
.how-to-card__lodging-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
  margin: 0.2rem 0;
  font-size: 0.85rem;
  color: var(--c-ink-soft, #514a3b);
}
.how-to-card__kitchen-pill {
  display: inline-block;
  padding: 0.08rem 0.45rem;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}
.how-to-card__kitchen-pill--full { background: #e3f1eb; color: #1f4a3a; }
.how-to-card__kitchen-pill--kitchenette { background: #fce8c9; color: #5b3d10; }
.how-to-card__kitchen-pill--none { background: #fdecec; color: #6d1a1b; }
.how-to-card__lodging-why {
  margin: 0;
  font-size: 0.85rem;
  line-height: 1.45;
  color: var(--c-ink-soft, #514a3b);
}
.how-to-card__no-lodging {
  margin: 0;
  font-style: italic;
  color: var(--c-ink-soft, #514a3b);
  font-size: 0.9rem;
}

.how-to-card__days {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: var(--sp-2, 8px);
}
.how-to-card__day {
  padding: var(--sp-2, 8px) var(--sp-3, 12px);
  background: #fafafa;
  border-left: 3px solid var(--c-glacier-500, #4a86a5);
  border-radius: var(--radius-sm, 6px);
}
.how-to-card__day-label {
  font-weight: 700;
  font-size: 0.85rem;
  letter-spacing: 0.02em;
  color: var(--c-glacier-600, #356a87);
}
.how-to-card__day-shape { margin: 0.2rem 0; font-size: 0.92rem; line-height: 1.45; }
.how-to-card__day-hits {
  margin: 0;
  padding-left: 1.1rem;
  font-size: 0.85rem;
  color: var(--c-ink-soft, #514a3b);
}
.how-to-card__day-hit { line-height: 1.4; }

.how-to-card__stats {
  margin: var(--sp-3, 12px) 0;
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 0.3rem 0.8rem;
  padding: var(--sp-2, 8px) var(--sp-3, 12px);
  background: var(--c-warm-100, #f5efe2);
  border-radius: var(--radius-sm, 6px);
  font-size: 0.88rem;
}
.how-to-card__stats dt { font-weight: 700; color: var(--c-ink-soft, #514a3b); }
.how-to-card__stats dd { margin: 0; }

.how-to-card__actions {
  display: flex;
  justify-content: flex-end;
}
.how-to-card__pick {
  font: inherit;
  cursor: pointer;
  padding: 0.6rem 1.2rem;
  background: var(--c-glacier-500, #4a86a5);
  color: #fff;
  border: none;
  border-radius: 999px;
  font-weight: 600;
  font-size: 0.95rem;
  transition: background 120ms ease;
}
.how-to-card__pick:hover { background: var(--c-glacier-600, #356a87); }
.how-to-card__pick--active {
  background: #1f4a3a;
}
.how-to-card__pick--active:hover { background: #163326; }

.how-to-block-title {
  margin: var(--sp-5, 24px) 0 var(--sp-2, 8px);
  font-size: var(--fs-lg, 1.15rem);
}
.how-to-block-lede {
  margin: 0 0 var(--sp-3, 12px);
  color: var(--c-ink-soft, #514a3b);
  line-height: 1.55;
}

.how-to-compare__scroll {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}
.how-to-compare__table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.88rem;
  min-width: 640px;
}
.how-to-compare__table th,
.how-to-compare__table td {
  text-align: left;
  padding: 0.55rem 0.7rem;
  border-bottom: 1px solid var(--c-line, #d9d4ca);
  vertical-align: top;
}
.how-to-compare__table thead th {
  background: var(--c-warm-100, #f5efe2);
  font-weight: 700;
  font-size: 0.78rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--c-ink-soft, #514a3b);
}
.how-to-compare__row--closed { background: #fff8f8; }
.how-to-compare__path-name {
  display: block;
  margin-top: 0.2rem;
  font-weight: 600;
  font-size: 0.85rem;
  color: var(--c-ink-soft, #514a3b);
}

.how-to-footnotes {
  background: var(--c-warm-100, #f5efe2);
  border: 1px solid var(--c-line, #d9d4ca);
  border-radius: var(--radius-md, 10px);
  padding: var(--sp-4, 16px);
  margin-top: var(--sp-4, 16px);
}
.how-to-footnotes__title { margin: 0 0 var(--sp-2, 8px); font-size: var(--fs-lg, 1.05rem); }
.how-to-footnotes__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0.4rem;
}
.how-to-footnotes__list li { font-size: 0.92rem; line-height: 1.5; }
.how-to-footnotes__list a {
  color: var(--c-glacier-500, #4a86a5);
  font-weight: 600;
}

.how-to-toast {
  position: fixed;
  bottom: 88px;
  left: 50%;
  transform: translateX(-50%) translateY(12px);
  background: #1f4a3a;
  color: #fff;
  padding: 0.7rem 1.1rem;
  border-radius: 999px;
  font-size: 0.92rem;
  font-weight: 600;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.18);
  opacity: 0;
  pointer-events: none;
  transition: opacity 180ms ease, transform 180ms ease;
  z-index: 9999;
  max-width: 90vw;
  text-align: center;
}
.how-to-toast--visible {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}

@media (min-width: 760px) {
  .how-to-grid { grid-template-columns: repeat(2, 1fr); }
  .how-to-card__badges { grid-template-columns: 1fr 1fr; }
}
@media (min-width: 1100px) {
  .how-to-grid { grid-template-columns: repeat(3, 1fr); }
}
`;

// ====================================================================
// MAIN RENDERER
// ====================================================================

export function renderHowTo(): HTMLElement {
  ensureStyles();

  const pickerState: PickerState = { active: new Set() };
  const grid = h('div', { class: 'how-to-grid-wrap' });

  const refresh = (): void => {
    renderPathGrid(grid, pickerState, getSelectedPath());
    // Re-render the picker too so chip active-state reflects state.
    const oldPicker = sectionEl.querySelector('.how-to-picker');
    if (oldPicker) {
      const newPicker = renderPicker(pickerState, refresh);
      oldPicker.replaceWith(newPicker);
    }
  };

  // Initial render of picker is built once; refresh rebuilds it in-place.
  const sectionEl = section(
    'how-to',
    'How to do this trip',
    h('p', { class: 'section__lede' }, HOW_TO_PAGE_META.lede),
    renderTldr(),
    renderWa20Branch(),
    renderPicker(pickerState, refresh),
    grid,
    renderComparison(),
    renderFootnotes()
  );

  // Initial path-grid render.
  renderPathGrid(grid, pickerState, getSelectedPath());

  // Keep grid in sync with global selectedPath changes (so picking from
  // home picker highlights the card here too).
  subscribeSelectedPath(() => {
    renderPathGrid(grid, pickerState, getSelectedPath());
  });

  return sectionEl;
}
