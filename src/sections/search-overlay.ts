/**
 * search-overlay.ts — global Cmd/Ctrl+/ search modal mounted on every page.
 *
 * Why this file exists: NC has 18+ pages and ~100 named entities. The search
 * overlay lets Erin type "winthrop", "blue lake", "cascade pass" and jump
 * straight to the right page+anchor without guessing the nav bucket.
 *
 * Keyboard contract:
 *   - Cmd/Ctrl+/      → opens overlay (Cmd+K stays for notes widget)
 *   - Esc / backdrop  → close
 *   - ArrowUp/Down    → navigate results
 *   - Enter           → follow active result
 *   - Tab             → focus trap inside the modal
 *
 * Mobile (412×892 Pixel 7 Pro XL baseline): overlay goes full-screen so the
 * keyboard has room. Each row is tap-sized (~64 px). The input is at the top
 * with a visible search icon and a clear ✕ button.
 *
 * Mount lifecycle (call once per page from `page-shell.ts`):
 *   - `initSearchOverlay()` — idempotent. Builds the modal once, wires Cmd+/
 *     and click handlers, restores the last query from sessionStorage.
 *
 * Standalone /search.html page: the overlay auto-opens on load. When mounted
 * inside the search page, the overlay class adds `search-overlay--inline` so
 * the modal renders inline rather than as a floating dialog.
 *
 * No external deps — no Fuse.js, no preact, no nothing. Vanilla DOM.
 */

import {
  searchIndex,
  groupHitsByKind,
  kindLabel,
  kindIcon,
  buildSearchIndex,
  type SearchHit,
  type SearchKind,
} from '../search-index';

const QUERY_STORAGE_KEY = 'nc-search-last-query';
const DEBOUNCE_MS = 80;

// =====================================================================
// Module-private state — one overlay per page, even with multiple imports.
// =====================================================================

interface OverlayRefs {
  root: HTMLDivElement;
  input: HTMLInputElement;
  count: HTMLDivElement;
  results: HTMLDivElement;
  closeBtn: HTMLButtonElement;
}

let refs: OverlayRefs | null = null;
let mounted = false;
let triggerEl: HTMLElement | null = null;
let activeRowIdx = 0;
let renderTimer: number | null = null;

// =====================================================================
// HTML escaping — overlay renders user-typed query verbatim in the count
// line. Keep it boring + safe.
// =====================================================================

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// =====================================================================
// DOM construction.
// =====================================================================

function buildOverlayDom(): OverlayRefs {
  const root = document.createElement('div');
  root.className = 'search-overlay';
  root.setAttribute('role', 'dialog');
  root.setAttribute('aria-modal', 'true');
  root.setAttribute('aria-label', 'Search the North Cascades 2026 trip site');
  root.hidden = true;
  root.innerHTML = `
    <div class="search-overlay__backdrop" data-action="close"></div>
    <div class="search-overlay__panel" role="document">
      <div class="search-overlay__header">
        <label class="search-overlay__input-wrap">
          <span aria-hidden="true" class="search-overlay__icon">🔍</span>
          <input
            type="search"
            class="search-overlay__input"
            placeholder="Search lodging, hikes, viewpoints, towns…"
            autocomplete="off"
            autocorrect="off"
            spellcheck="false"
            aria-controls="search-overlay-results"
            aria-label="Search the site"
          />
        </label>
        <button type="button" class="search-overlay__close" aria-label="Close search" data-action="close">✕</button>
      </div>
      <div class="search-overlay__count" aria-live="polite" role="status"></div>
      <div class="search-overlay__results" id="search-overlay-results" role="listbox"></div>
      <div class="search-overlay__footer">
        <span class="search-overlay__hint"><kbd>↑</kbd><kbd>↓</kbd> move</span>
        <span class="search-overlay__hint"><kbd>Enter</kbd> open</span>
        <span class="search-overlay__hint"><kbd>Esc</kbd> close</span>
        <span class="search-overlay__footer-spacer"></span>
        <span class="search-overlay__shortcut">Cmd/Ctrl + /</span>
      </div>
    </div>
  `;
  return {
    root,
    input: root.querySelector('.search-overlay__input') as HTMLInputElement,
    count: root.querySelector('.search-overlay__count') as HTMLDivElement,
    results: root.querySelector('.search-overlay__results') as HTMLDivElement,
    closeBtn: root.querySelector('.search-overlay__close') as HTMLButtonElement,
  };
}

// =====================================================================
// Result rendering.
// =====================================================================

function renderGroup(kind: SearchKind, hits: SearchHit[]): string {
  const rows = hits
    .map((h) => {
      const e = h.entry;
      const region = e.region
        ? `<span class="search-row__region">${escapeHtml(e.region)}</span>`
        : '';
      return `
        <a
          class="search-row"
          href="${escapeHtml(e.deepLinkUrl)}"
          role="option"
          tabindex="-1"
          data-row-id="${escapeHtml(e.id)}"
        >
          <span class="search-row__icon" aria-hidden="true">${kindIcon(kind)}</span>
          <div class="search-row__body">
            <div class="search-row__top">
              <span class="search-row__name">${escapeHtml(e.name)}</span>
              ${region}
            </div>
            <div class="search-row__desc">${escapeHtml(e.description)}</div>
          </div>
          <span class="search-row__open" aria-hidden="true">→</span>
        </a>
      `;
    })
    .join('');
  return `
    <section class="search-group" data-group="${kind}">
      <h3 class="search-group__title">
        <span aria-hidden="true">${kindIcon(kind)}</span>
        ${escapeHtml(kindLabel(kind))}
        <span class="search-group__count">${hits.length}</span>
      </h3>
      <div class="search-group__rows" role="presentation">${rows}</div>
    </section>
  `;
}

function renderResults(query: string): void {
  if (!refs) return;
  const hits = searchIndex(query, 80);
  refs.count.textContent =
    hits.length === 0
      ? `No matches for "${query}". Try "lodging", "blue lake", "winthrop", "kosher".`
      : `${hits.length} ${hits.length === 1 ? 'match' : 'matches'}${query ? ` for "${query}"` : ' — browse everything'}`;
  const grouped = groupHitsByKind(hits);
  if (grouped.size === 0) {
    refs.results.innerHTML = '<div class="search-empty">No matches — try fewer or different words.</div>';
    return;
  }
  refs.results.innerHTML = [...grouped.entries()]
    .map(([k, h]) => renderGroup(k, h))
    .join('');
  activeRowIdx = 0;
  highlightActiveRow();
}

function scheduleRender(query: string): void {
  if (renderTimer !== null) {
    window.clearTimeout(renderTimer);
  }
  renderTimer = window.setTimeout(() => {
    renderTimer = null;
    renderResults(query);
  }, DEBOUNCE_MS);
}

// =====================================================================
// Keyboard nav — flat row index across all groups.
// =====================================================================

function rowsArray(): HTMLAnchorElement[] {
  if (!refs) return [];
  return Array.from(refs.results.querySelectorAll<HTMLAnchorElement>('.search-row'));
}

function highlightActiveRow(): void {
  const rows = rowsArray();
  if (rows.length === 0) return;
  if (activeRowIdx < 0) activeRowIdx = 0;
  if (activeRowIdx >= rows.length) activeRowIdx = rows.length - 1;
  rows.forEach((r, i) => {
    const active = i === activeRowIdx;
    r.classList.toggle('search-row--active', active);
    if (active) {
      r.scrollIntoView({ block: 'nearest' });
    }
  });
}

// =====================================================================
// Open / close lifecycle.
// =====================================================================

function open(): void {
  if (!refs) return;
  if (!refs.root.hidden) return;
  triggerEl = (document.activeElement as HTMLElement) ?? null;
  refs.root.hidden = false;
  refs.root.classList.add('search-overlay--open');
  document.body.classList.add('search-overlay-open');
  // Restore last query (sessionStorage) so repeat opens pick up where we left off.
  let last = '';
  try {
    last = sessionStorage.getItem(QUERY_STORAGE_KEY) ?? '';
  } catch {
    /* ignore */
  }
  refs.input.value = last;
  renderResults(last);
  // Focus after a microtick so iOS mobile Safari surfaces the keyboard reliably.
  setTimeout(() => {
    refs?.input.focus();
    refs?.input.select();
  }, 20);
}

function close(): void {
  if (!refs) return;
  if (refs.root.hidden) return;
  refs.root.classList.remove('search-overlay--open');
  document.body.classList.remove('search-overlay-open');
  // Hide AFTER transition so a fade-out class could be applied later; for now
  // we keep CSS minimal and hide immediately.
  refs.root.hidden = true;
  if (triggerEl && typeof triggerEl.focus === 'function') {
    triggerEl.focus();
  }
}

// =====================================================================
// Event wiring.
// =====================================================================

function attachEvents(): void {
  if (!refs) return;
  // Close on backdrop / ✕ click.
  refs.root.addEventListener('click', (e) => {
    if (!(e.target instanceof HTMLElement)) return;
    const action = e.target.closest<HTMLElement>('[data-action]')?.dataset['action'];
    if (action === 'close') close();
  });
  // Input typing.
  refs.input.addEventListener('input', () => {
    const q = refs!.input.value;
    try {
      sessionStorage.setItem(QUERY_STORAGE_KEY, q);
    } catch {
      /* ignore */
    }
    scheduleRender(q);
  });
  // Keyboard nav inside the overlay.
  refs.root.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      close();
      return;
    }
    const rows = rowsArray();
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (rows.length === 0) return;
      activeRowIdx = Math.min(activeRowIdx + 1, rows.length - 1);
      highlightActiveRow();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (rows.length === 0) return;
      activeRowIdx = Math.max(activeRowIdx - 1, 0);
      highlightActiveRow();
    } else if (e.key === 'Enter') {
      const row = rows[activeRowIdx];
      if (row) {
        e.preventDefault();
        window.location.href = row.href;
      }
    } else if (e.key === 'Tab') {
      // Focus trap: input ↔ close button.
      const focusables: HTMLElement[] = [refs!.input, refs!.closeBtn];
      const active = document.activeElement as HTMLElement | null;
      const idx = active ? focusables.indexOf(active) : -1;
      if (idx === -1) return;
      e.preventDefault();
      const next = (idx + (e.shiftKey ? -1 : 1) + focusables.length) % focusables.length;
      focusables[next]?.focus();
    }
  });
  // Global Cmd/Ctrl + / shortcut — toggles open/close. Avoid Cmd+K (notes).
  document.addEventListener('keydown', (e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === '/') {
      e.preventDefault();
      if (refs?.root.hidden) open();
      else close();
    }
  });
  // Hash trigger — landing on any page with #search opens the overlay.
  if (window.location.hash === '#search') {
    // Defer so the page chrome has time to render first.
    setTimeout(open, 30);
  }
}

// =====================================================================
// Public API.
// =====================================================================

/**
 * Initialize the global search overlay. Mounts the modal on document.body,
 * wires Cmd/Ctrl + /, and seeds the last query from sessionStorage.
 *
 * Idempotent — safe to call from page-shell on every page.
 */
export function initSearchOverlay(): void {
  if (mounted) return;
  if (document.querySelector('.search-overlay')) {
    mounted = true;
    return;
  }
  // Skip on pages that opt out (the standalone /search.html mounts the panel
  // inline instead of as a floating dialog).
  if (document.body.dataset['searchSkip'] === 'true') {
    mounted = true;
    return;
  }
  refs = buildOverlayDom();
  document.body.appendChild(refs.root);
  attachEvents();
  mounted = true;
}

/**
 * Render the search modal INLINE inside a host element. Used by the
 * standalone /search.html page so users who hit it directly see a search box
 * rather than landing on an apparently-empty page.
 *
 * The inline mount uses the same DOM + match logic as the overlay so the
 * Cmd/Ctrl + / shortcut behavior stays consistent.
 */
export function mountInlineSearch(host: HTMLElement): void {
  // Mark the body so the overlay init self-skips — otherwise we'd have two
  // search UIs on the page, both responding to Cmd+/.
  document.body.dataset['searchSkip'] = 'true';
  refs = buildOverlayDom();
  refs.root.classList.add('search-overlay--inline');
  refs.root.hidden = false;
  host.appendChild(refs.root);
  attachEvents();
  // Inline mode: render the empty-query "browse everything" view immediately.
  renderResults('');
  // Focus the input on load.
  setTimeout(() => refs?.input.focus(), 30);
  mounted = true;
}

/**
 * Diagnostics-only — exposed so the standalone search page can show a
 * "indexed N entries" line at the bottom.
 */
export function indexedCount(): number {
  return buildSearchIndex().length;
}
