/**
 * Paths picker — the new top-level "choose your path" section.
 *
 * Three cards (Path A / B / C). Each card shows name + tagline + 3-4 snapshot
 * bullets + a "View this path's details" button. A "Compare all options"
 * toggle lets the user un-pick and see everything.
 *
 * Re-renders the picker on path change so the active card is visually marked.
 */

import { TRIP_PATHS, type TripPath } from '../data/paths';
import {
  getSelectedPath,
  setSelectedPath,
  subscribeSelectedPath,
} from '../state/path';
import { h, section } from '../dom';

function renderCard(path: TripPath, active: boolean): HTMLElement {
  const card = h(
    'article',
    {
      class: `path-card${active ? ' path-card--active' : ''}`,
      'data-path': path.id,
    },
    h(
      'header',
      { class: 'path-card__header' },
      h('span', { class: 'path-card__id' }, `Path ${path.id}`),
      h('h3', { class: 'path-card__name' }, path.name.replace(`Path ${path.id} · `, '')),
      h('p', { class: 'path-card__tagline' }, path.tagline)
    ),
    h(
      'p',
      { class: 'path-card__bestif' },
      h('strong', {}, 'Best if: '),
      path.bestIf
    ),
    h(
      'ul',
      { class: 'path-card__snapshot' },
      ...path.snapshot.map((line) => h('li', { class: 'path-card__bullet' }, line))
    ),
    h(
      'details',
      { class: 'path-card__details' },
      h(
        'summary',
        { class: 'path-card__details-summary' },
        'Lodging · Flights · Tradeoff'
      ),
      h(
        'dl',
        { class: 'path-card__facts' },
        h('dt', {}, 'Lodging'),
        h('dd', {}, path.lodgingShape),
        h('dt', {}, 'Flights'),
        h('dd', {}, path.flightNote),
        h('dt', {}, 'Tradeoff'),
        h('dd', { class: 'path-card__tradeoff' }, path.tradeoff)
      )
    ),
    h(
      'div',
      { class: 'path-card__actions' },
      h(
        'button',
        {
          class: `path-card__cta${active ? ' path-card__cta--active' : ''}`,
          type: 'button',
          'data-action': active ? 'clear' : 'select',
          'data-path': path.id,
        },
        active ? '✓ Selected' : 'Use this path'
      )
    )
  );
  return card;
}

const DESKTOP_BP = '(min-width: 760px)';

function syncFactsOpenness(container: HTMLElement): void {
  // On desktop, facts panel is always visible (room is available). On mobile,
  // it's collapsed by default so the picker is scan-light. <details> requires
  // the `open` attribute be added/removed via JS — pure CSS can't toggle it.
  const isDesktop =
    typeof window !== 'undefined' && window.matchMedia(DESKTOP_BP).matches;
  const allDetails = container.querySelectorAll<HTMLDetailsElement>(
    '.path-card__details'
  );
  allDetails.forEach((d) => {
    d.open = isDesktop;
  });
}

function renderPicker(container: HTMLElement, selected: string | null): void {
  const grid = container.querySelector<HTMLElement>('.path-grid');
  if (!grid) return;
  grid.replaceChildren(
    ...TRIP_PATHS.map((p) => renderCard(p, p.id === selected))
  );
  syncFactsOpenness(container);

  // "Compare all" button only shows when a path is active (action: clear).
  // When nothing is selected the button is dead weight — the picker IS the
  // compare view.
  const compareControls = container.querySelector<HTMLElement>('.path-controls');
  const compareBtn = container.querySelector<HTMLButtonElement>('.path-compare');
  if (compareBtn && compareControls) {
    const pathActive = selected !== null;
    compareControls.hidden = !pathActive;
    compareBtn.textContent = 'Show all options (clear path)';
  }

  // Update the active-path summary line.
  const summary = container.querySelector<HTMLElement>('.path-status');
  if (summary) {
    if (selected) {
      const path = TRIP_PATHS.find((p) => p.id === selected);
      summary.textContent = `Viewing Path ${selected}${path ? ` — ${path.name.replace(`Path ${selected} · `, '')}` : ''}. Itinerary, lodging, hikes, and Seattle below are filtered to this path.`;
      summary.hidden = false;
    } else {
      summary.hidden = true;
    }
  }
}

function scrollToSection(id: string): void {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export function renderPaths(): HTMLElement {
  const grid = h('div', { class: 'path-grid' });
  const status = h(
    'p',
    { class: 'path-status' },
    'No path selected — everything below shows the full options menu.'
  );
  const compareBtn = h(
    'button',
    {
      class: 'path-compare',
      type: 'button',
      'data-action': 'compare',
    },
    'Compare all options instead'
  );

  const wrap = section(
    'paths',
    'Choose a path',
    h(
      'ul',
      { class: 'gist' },
      h(
        'li',
        { class: 'gist__item' },
        'Three shapes for the same five days. Pick one to filter the rest of the page — or browse all three.'
      ),
      h(
        'li',
        { class: 'gist__item' },
        'None is "the recommendation." They trade simplicity, variety, and east-side time differently.'
      )
    ),
    grid,
    h('div', { class: 'path-controls' }, compareBtn),
    status
  );

  // Initial render
  renderPicker(wrap, getSelectedPath());

  // Click handling — event-delegation.
  wrap.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const btn = target.closest<HTMLElement>('[data-action]');
    if (!btn) return;
    const action = btn.dataset['action'];
    if (action === 'select') {
      const pathId = btn.dataset['path'];
      if (pathId === 'A' || pathId === 'B' || pathId === 'C') {
        setSelectedPath(pathId);
        // Smooth-scroll to the itinerary so the user sees the filter took effect.
        setTimeout(() => scrollToSection('itinerary'), 80);
      }
    } else if (action === 'clear') {
      setSelectedPath(null);
    } else if (action === 'compare') {
      setSelectedPath(null);
    }
  });

  // Subscribe to state changes — keep the picker in sync if state moves elsewhere.
  subscribeSelectedPath((next) => {
    renderPicker(wrap, next);
  });

  // Keep the desktop/mobile facts-open state synced across resize / device
  // rotation. Cheap — three <details> elements.
  if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
    const mql = window.matchMedia(DESKTOP_BP);
    // `addEventListener('change', ...)` is the modern API; some older browsers
    // only support `addListener`. We use the modern one — CI baseline is recent.
    mql.addEventListener('change', () => syncFactsOpenness(wrap));
  }

  return wrap;
}
