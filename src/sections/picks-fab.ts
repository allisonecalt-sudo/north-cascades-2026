/**
 * picks-fab.ts — single unified ✓ Picks FAB for the NEW destination
 * entity types (viewpoints, lakes, towns, hidden gems, top sunsets).
 *
 * Why one FAB (not five)
 * ======================
 * Each section could mint its own FAB via shortlist-shared, but the screen
 * already has back-to-top + global-notes + (on hikes/lodging pages) the
 * existing shortlist-fab. Stacking 4-5 more pills would be visual noise.
 * Brief Option C: leave the existing lodging + hikes FABs alone, add ONE
 * extra FAB for the new types with tabs per entity-kind.
 *
 * Why "register" instead of "import every shortlist here"
 * =======================================================
 * Page-level code (e.g. `src/pages/viewpoints.ts`) only loads the sections
 * it actually renders. If picks-fab statically imported every section's
 * shortlist, every page would drag in every section's data + render code.
 * Registration lets each section declare itself when its render fn runs,
 * so the FAB only knows about the kinds present on the current page.
 *
 * Layout — fits between the back-to-top button and global-fab.
 * ============================================================
 * Existing right-side stack on every page (see styles/components.css):
 *   back-to-top   : right: var(--sp-4)              (z-index 60)
 *   global-fab    : right: var(--sp-4) + 100px      (z-index 998)
 *   picks-fab     : right: var(--sp-4) + 210px      (z-index 998, this file)
 * The lodging shortlist-fab (right: 1rem, z-index 40) is in-page on the
 * lodging page only, so it doesn't clash on the new destination pages.
 *
 * Always-hidden states
 * ====================
 *   - Hides itself when the notes modal is open (mirrors global-fab behavior).
 *   - Hides itself when no shortlist has any picks (no count → no FAB clutter).
 *   - Auto-shows again as soon as the first pick happens.
 *
 * a11y
 * ====
 * Modal is a proper <dialog>-style div w/ ARIA: role="dialog", focus trap,
 * ESC closes, click-outside closes, focus returns to FAB on close.
 */

import { h } from '../dom';
import type { Shortlist } from './shortlist-shared';

// ====================================================================
// REGISTRY — populated by sections at render time
// ====================================================================

interface RegisteredShortlist {
  // Erased generic — the FAB only touches `meta` accessors which are
  // typed by `Shortlist<unknown>`. We hold `unknown` because the registry
  // mixes Viewpoints / Lakes / Towns / etc. and we never need the
  // narrowed `T` once we have getName/getThumb.
  shortlist: Shortlist<unknown>;
}

const registry: RegisteredShortlist[] = [];
const registryListeners: (() => void)[] = [];

function notifyRegistry(): void {
  for (const fn of registryListeners) fn();
}

/**
 * Register a section's shortlist with the FAB. Idempotent per storage key —
 * re-registering the same shortlist (e.g. when a page re-renders) is a no-op.
 * MUST be called before `initPicksFab()` mounts (or before the FAB updates
 * after mount); call order is enforced by `page-shell.ts` mounting late.
 */
export function registerPicksShortlist<T>(shortlist: Shortlist<T>): void {
  const existing = registry.find(
    (r) => r.shortlist.meta.storageKey === shortlist.meta.storageKey
  );
  if (existing) return;
  // Erase the generic for storage (see comment on RegisteredShortlist).
  registry.push({ shortlist: shortlist as unknown as Shortlist<unknown> });
  // Subscribe so the FAB count + tab badges update on every toggle.
  shortlist.subscribe(notifyRegistry);
  notifyRegistry();
}

// ====================================================================
// CSS
// ====================================================================

const STYLE_ID = 'picks-fab-styles';

function ensureStyles(): void {
  if (typeof document === 'undefined') return;
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = PICKS_FAB_CSS;
  document.head.appendChild(style);
}

const PICKS_FAB_CSS = `
.picks-fab {
  position: fixed;
  bottom: calc(var(--sp-4, 16px) + env(safe-area-inset-bottom, 0px));
  /* Sits left of global-fab. global-fab is right: sp-4 + 100px;
     reserve ~110px for it + a small gap. */
  right: calc(var(--sp-4, 16px) + 210px);
  z-index: 998;
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 10px 16px;
  background: var(--c-forest-700, #2f5a3a);
  color: var(--c-warm-50, #fdfaf2);
  border: 1px solid var(--c-forest-800, #234430);
  border-radius: 999px;
  font-family: inherit;
  font-size: var(--fs-sm, 0.88rem);
  font-weight: 600;
  letter-spacing: 0.02em;
  box-shadow: var(--shadow-md, 0 6px 22px rgba(15,42,34,0.32));
  cursor: pointer;
  opacity: 0.96;
  transition:
    opacity 180ms ease,
    transform 180ms ease,
    background 180ms ease;
}
.picks-fab:hover {
  background: var(--c-forest-800, #234430);
  opacity: 1;
  box-shadow: var(--shadow-lg, 0 10px 32px rgba(15,42,34,0.4));
  transform: translateY(-1px);
}
.picks-fab:focus-visible {
  outline: 3px solid var(--c-accent, #ffb84d);
  outline-offset: 2px;
}
.picks-fab__count {
  display: inline-flex;
  min-width: 1.4rem;
  height: 1.4rem;
  padding: 0 0.45rem;
  border-radius: 999px;
  background: var(--c-warm-50, #fdfaf2);
  color: var(--c-forest-800, #234430);
  font-variant-numeric: tabular-nums;
  align-items: center;
  justify-content: center;
  font-size: 0.78rem;
}
.picks-fab--hidden {
  opacity: 0;
  pointer-events: none;
  transform: translateY(8px);
}

@media (max-width: 540px) {
  .picks-fab {
    /* On narrow phones, sit ABOVE back-to-top + global-fab to dodge the
       right-stack instead of competing for horizontal space (which on
       Pixel 7 Pro XL at 412px doesn't leave room for 3 pills side-by-side).
       Layout becomes: back-to-top (right), global-fab (right minus 100px),
       picks-fab (right of back-to-top, ~70px higher). */
    right: var(--sp-4, 16px);
    bottom: calc(var(--sp-4, 16px) + env(safe-area-inset-bottom, 0px) + 64px);
    padding: 9px 14px;
    font-size: 0.82rem;
  }
}

/* Modal backdrop */
.picks-modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 25, 20, 0.5);
  z-index: 1001;
  display: none;
  align-items: flex-end;
  justify-content: center;
  padding: 0;
}
.picks-modal-backdrop.open {
  display: flex;
}
@media (min-width: 720px) {
  .picks-modal-backdrop {
    align-items: center;
    padding: 4vh 5vw;
  }
}

.picks-modal {
  position: relative;
  background: var(--c-warm-50, #fdfaf2);
  width: 100%;
  max-width: 720px;
  max-height: 88vh;
  border-radius: 14px 14px 0 0;
  display: flex;
  flex-direction: column;
  box-shadow: 0 -8px 32px rgba(0, 0, 0, 0.35);
  overflow: hidden;
}
@media (min-width: 720px) {
  .picks-modal {
    border-radius: 14px;
    max-height: 80vh;
  }
}

.picks-modal__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.85rem 1rem 0.65rem;
  border-bottom: 1px solid var(--c-line, #e0d8c8);
}
.picks-modal__title {
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
  color: var(--c-ink-900, #1a1611);
}
.picks-modal__close {
  appearance: none;
  background: transparent;
  border: 0;
  font-size: 1.6rem;
  line-height: 1;
  cursor: pointer;
  color: var(--c-ink-700, #4a4338);
  padding: 0.1rem 0.5rem;
  border-radius: 6px;
}
.picks-modal__close:hover,
.picks-modal__close:focus-visible {
  background: var(--c-warm-100, #f6f3ed);
  color: var(--c-ink-900, #1a1611);
}
.picks-modal__close:focus-visible {
  outline: 2px solid var(--c-glacier-500, #4a86a5);
  outline-offset: 1px;
}

.picks-modal__tabs {
  display: flex;
  gap: 0;
  overflow-x: auto;
  background: var(--c-warm-100, #f6f3ed);
  border-bottom: 1px solid var(--c-line, #e0d8c8);
  scrollbar-width: thin;
}
.picks-modal__tab {
  appearance: none;
  background: transparent;
  border: 0;
  border-bottom: 2px solid transparent;
  padding: 0.6rem 0.9rem;
  font-family: inherit;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--c-ink-700, #4a4338);
  cursor: pointer;
  white-space: nowrap;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  transition: color 140ms ease, border-color 140ms ease;
}
.picks-modal__tab:hover {
  color: var(--c-ink-900, #1a1611);
}
.picks-modal__tab--active {
  color: var(--c-forest-800, #234430);
  border-bottom-color: var(--c-forest-700, #2f5a3a);
  background: var(--c-warm-50, #fdfaf2);
}
.picks-modal__tab-badge {
  display: inline-flex;
  min-width: 1.2rem;
  height: 1.2rem;
  padding: 0 0.4rem;
  border-radius: 999px;
  background: var(--c-forest-700, #2f5a3a);
  color: var(--c-warm-50, #fdfaf2);
  font-size: 0.7rem;
  font-weight: 700;
  align-items: center;
  justify-content: center;
  font-variant-numeric: tabular-nums;
}
.picks-modal__tab--empty .picks-modal__tab-badge {
  background: var(--c-ink-400, #877e6c);
}

.picks-modal__body {
  flex: 1 1 auto;
  overflow-y: auto;
  padding: 0.6rem 0.85rem 1rem;
  -webkit-overflow-scrolling: touch;
}
.picks-modal__empty {
  margin: 1.5rem 0;
  text-align: center;
  color: var(--c-ink-500, #6e6757);
  font-size: 0.9rem;
}

.picks-list {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  margin: 0.4rem 0 0;
  padding: 0;
  list-style: none;
}
.picks-list__item {
  display: grid;
  grid-template-columns: 64px 1fr auto;
  align-items: center;
  gap: 0.8rem;
  padding: 0.55rem;
  background: white;
  border: 1px solid var(--c-line, #e0d8c8);
  border-radius: 10px;
}
.picks-list__thumb {
  width: 64px;
  height: 64px;
  border-radius: 8px;
  background: var(--c-warm-100, #f6f3ed);
  object-fit: cover;
  display: block;
}
.picks-list__thumb--placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  color: var(--c-ink-400, #877e6c);
}
.picks-list__text {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  min-width: 0;
}
.picks-list__name {
  font-weight: 700;
  font-size: 0.92rem;
  color: var(--c-ink-900, #1a1611);
  line-height: 1.2;
}
.picks-list__detail {
  font-size: 0.78rem;
  color: var(--c-ink-500, #6e6757);
  line-height: 1.3;
}
.picks-list__remove {
  appearance: none;
  background: transparent;
  border: 1px solid var(--c-line, #e0d8c8);
  border-radius: 8px;
  color: var(--c-ink-700, #4a4338);
  cursor: pointer;
  width: 32px;
  height: 32px;
  font-size: 1.1rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.picks-list__remove:hover,
.picks-list__remove:focus-visible {
  background: var(--c-warm-100, #f6f3ed);
  color: var(--c-ink-900, #1a1611);
}
.picks-list__remove:focus-visible {
  outline: 2px solid var(--c-glacier-500, #4a86a5);
  outline-offset: 1px;
}

.picks-modal__actions {
  display: flex;
  justify-content: flex-end;
  padding: 0.6rem 0.9rem 0.85rem;
  border-top: 1px solid var(--c-line, #e0d8c8);
  background: var(--c-warm-50, #fdfaf2);
}
.picks-modal__clear {
  appearance: none;
  background: transparent;
  border: 0;
  color: var(--c-glacier-700, #1f4a3a);
  text-decoration: underline;
  font-family: inherit;
  font-size: 0.85rem;
  cursor: pointer;
  padding: 0.3rem 0.4rem;
  border-radius: 4px;
}
.picks-modal__clear:hover,
.picks-modal__clear:focus-visible {
  background: var(--c-warm-100, #f6f3ed);
}
`;

// ====================================================================
// FAB + MODAL STATE
// ====================================================================

let mounted = false;
let fabBtn: HTMLButtonElement | null = null;
let modalBackdrop: HTMLDivElement | null = null;
let modalTitle: HTMLElement | null = null;
let modalTabsBar: HTMLDivElement | null = null;
let modalBody: HTMLDivElement | null = null;
let activeStorageKey: string | null = null;
let lastFocusedBeforeOpen: HTMLElement | null = null;

function totalCount(): number {
  return registry.reduce((sum, r) => sum + r.shortlist.count(), 0);
}

function renderFabLabel(): string {
  const total = totalCount();
  return total === 0 ? '✓ Picks' : `✓ ${total} pick${total === 1 ? '' : 's'}`;
}

function syncFabVisibility(): void {
  if (!fabBtn) return;
  const total = totalCount();
  fabBtn.querySelector<HTMLSpanElement>('.picks-fab__label')!.textContent =
    renderFabLabel();
  const countEl = fabBtn.querySelector<HTMLSpanElement>('.picks-fab__count');
  if (countEl) {
    countEl.textContent = `${total}`;
    countEl.hidden = total === 0;
  }
  // Hide entirely when nothing is picked — no clutter on first visit.
  const shouldShow = total > 0;
  fabBtn.classList.toggle('picks-fab--hidden', !shouldShow);
  fabBtn.setAttribute('aria-hidden', shouldShow ? 'false' : 'true');
  if (!shouldShow) {
    fabBtn.tabIndex = -1;
  } else {
    fabBtn.removeAttribute('tabindex');
  }
}

function bindNotesModalAutoHide(): void {
  // Mirror global-fab.ts — when the notes modal opens, slide ours out of the way.
  const notesBackdrop = document.querySelector<HTMLDivElement>('.notes-modal-backdrop');
  if (!notesBackdrop || !fabBtn) return;
  const sync = (): void => {
    const isOpen = notesBackdrop.classList.contains('open');
    if (fabBtn) fabBtn.classList.toggle('picks-fab--hidden', isOpen || totalCount() === 0);
  };
  sync();
  const observer = new MutationObserver(sync);
  observer.observe(notesBackdrop, { attributes: true, attributeFilter: ['class'] });
}

function buildFab(): HTMLButtonElement {
  const btn = h(
    'button',
    {
      type: 'button',
      class: 'picks-fab picks-fab--hidden',
      'aria-label': 'View your picks',
      'aria-haspopup': 'dialog',
    },
    h('span', { class: 'picks-fab__icon', 'aria-hidden': 'true' }, '✓'),
    h('span', { class: 'picks-fab__label' }, renderFabLabel()),
    h('span', { class: 'picks-fab__count', hidden: true }, '0')
  ) as HTMLButtonElement;
  btn.addEventListener('click', () => openModal());
  return btn;
}

function buildModal(): HTMLDivElement {
  const backdrop = h(
    'div',
    {
      class: 'picks-modal-backdrop',
      role: 'dialog',
      'aria-modal': 'true',
      'aria-labelledby': 'picks-modal-title',
      hidden: true,
    },
    h(
      'div',
      { class: 'picks-modal' },
      h(
        'div',
        { class: 'picks-modal__head' },
        h('h2', { class: 'picks-modal__title', id: 'picks-modal-title' }, 'Your picks'),
        h(
          'button',
          {
            type: 'button',
            class: 'picks-modal__close',
            'aria-label': 'Close picks panel',
            'data-action': 'close-picks',
          },
          '×'
        )
      ),
      h('div', { class: 'picks-modal__tabs', role: 'tablist' }),
      h('div', { class: 'picks-modal__body' }),
      h(
        'div',
        { class: 'picks-modal__actions' },
        h(
          'button',
          {
            type: 'button',
            class: 'picks-modal__clear',
            'data-action': 'clear-current-tab',
          },
          'Clear this tab'
        )
      )
    )
  ) as HTMLDivElement;

  // Click backdrop to close (but not click inside the panel).
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) closeModal();
  });

  // Delegate close + clear actions inside the modal.
  backdrop.addEventListener('click', (e) => {
    const target = e.target;
    if (!(target instanceof HTMLElement)) return;
    const action = target.closest<HTMLElement>('[data-action]')?.dataset['action'];
    if (action === 'close-picks') closeModal();
    if (action === 'clear-current-tab' && activeStorageKey) {
      const r = registry.find((x) => x.shortlist.meta.storageKey === activeStorageKey);
      if (r) r.shortlist.clear();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && backdrop.classList.contains('open')) {
      closeModal();
    }
  });

  modalTitle = backdrop.querySelector<HTMLElement>('.picks-modal__title');
  modalTabsBar = backdrop.querySelector<HTMLDivElement>('.picks-modal__tabs');
  modalBody = backdrop.querySelector<HTMLDivElement>('.picks-modal__body');

  return backdrop;
}

function openModal(): void {
  if (!modalBackdrop) return;
  lastFocusedBeforeOpen = (document.activeElement as HTMLElement) ?? null;
  // Pick the first non-empty tab, or the first registered tab if all empty.
  const firstWithPicks = registry.find((r) => r.shortlist.count() > 0);
  activeStorageKey =
    (firstWithPicks ?? registry[0])?.shortlist.meta.storageKey ?? null;
  modalBackdrop.hidden = false;
  modalBackdrop.classList.add('open');
  document.body.style.overflow = 'hidden';
  renderTabs();
  renderActiveBody();
  // Focus the close button first — keyboard users can ESC out immediately.
  const closeBtn = modalBackdrop.querySelector<HTMLButtonElement>('.picks-modal__close');
  closeBtn?.focus();
}

function closeModal(): void {
  if (!modalBackdrop) return;
  modalBackdrop.classList.remove('open');
  modalBackdrop.hidden = true;
  document.body.style.overflow = '';
  if (lastFocusedBeforeOpen && document.contains(lastFocusedBeforeOpen)) {
    lastFocusedBeforeOpen.focus();
  } else {
    fabBtn?.focus();
  }
}

function renderTabs(): void {
  if (!modalTabsBar) return;
  const tabs = registry.map((r) => {
    const meta = r.shortlist.meta;
    const count = r.shortlist.count();
    const isActive = meta.storageKey === activeStorageKey;
    const classes = [
      'picks-modal__tab',
      isActive ? 'picks-modal__tab--active' : '',
      count === 0 ? 'picks-modal__tab--empty' : '',
    ]
      .filter(Boolean)
      .join(' ');
    const tab = h(
      'button',
      {
        type: 'button',
        class: classes,
        role: 'tab',
        'aria-selected': isActive ? 'true' : 'false',
        'data-storage-key': meta.storageKey,
      },
      h('span', {}, meta.entityKindPlural),
      h('span', { class: 'picks-modal__tab-badge' }, `${count}`)
    ) as HTMLButtonElement;
    tab.addEventListener('click', () => {
      activeStorageKey = meta.storageKey;
      renderTabs();
      renderActiveBody();
    });
    return tab;
  });
  modalTabsBar.replaceChildren(...tabs);
}

function renderActiveBody(): void {
  if (!modalBody) return;
  if (!activeStorageKey) {
    modalBody.replaceChildren(
      h(
        'p',
        { class: 'picks-modal__empty' },
        "No picks yet. Tap ✓ Pick on a card to start a shortlist — these are the ones you'd want to suggest to Allison."
      )
    );
    return;
  }
  const r = registry.find((x) => x.shortlist.meta.storageKey === activeStorageKey);
  if (!r) return;
  const meta = r.shortlist.meta;
  const picks = r.shortlist.picked();
  if (modalTitle) {
    modalTitle.textContent = `Your ${meta.entityKindPlural.toLowerCase()} picks`;
  }
  if (picks.length === 0) {
    modalBody.replaceChildren(
      h(
        'p',
        { class: 'picks-modal__empty' },
        `No ${meta.entityKindPlural.toLowerCase()} picked yet. Tap ✓ Pick on any ${meta.entityKind.toLowerCase()} card.`
      )
    );
    return;
  }
  const items = picks.map((entity) => {
    const name = meta.getName(entity);
    const thumb = meta.getThumb(entity);
    const detail = meta.getDetail ? meta.getDetail(entity) : '';
    const removeBtn = h(
      'button',
      {
        type: 'button',
        class: 'picks-list__remove',
        'aria-label': `Remove ${name} from picks`,
      },
      '×'
    ) as HTMLButtonElement;
    removeBtn.addEventListener('click', () => {
      const id = meta.getId(entity);
      r.shortlist.toggle(id);
    });
    const thumbEl = thumb
      ? h('img', {
          class: 'picks-list__thumb',
          src: thumb.src,
          alt: thumb.alt,
          loading: 'lazy',
          decoding: 'async',
          width: 64,
          height: 64,
        })
      : h('div', { class: 'picks-list__thumb picks-list__thumb--placeholder', 'aria-hidden': 'true' }, '📍');
    return h(
      'li',
      { class: 'picks-list__item' },
      thumbEl,
      h(
        'div',
        { class: 'picks-list__text' },
        h('span', { class: 'picks-list__name' }, name),
        detail ? h('span', { class: 'picks-list__detail' }, detail) : null
      ),
      removeBtn
    );
  });
  modalBody.replaceChildren(h('ul', { class: 'picks-list' }, ...items));
}

// ====================================================================
// MOUNT
// ====================================================================

/**
 * Mount the unified picks FAB + modal once per page. Idempotent — safe to
 * call from `page-shell.ts` for every page. Sections still need to call
 * `registerPicksShortlist(...)` to opt in; pages with no registered
 * shortlists will mount the FAB but it stays hidden (count is 0).
 */
export function initPicksFab(): void {
  if (mounted) return;
  if (typeof document === 'undefined') return;
  ensureStyles();

  fabBtn = buildFab();
  modalBackdrop = buildModal();

  document.body.appendChild(fabBtn);
  document.body.appendChild(modalBackdrop);

  // Listen for any registered shortlist change → resync FAB label/visibility.
  registryListeners.push(() => {
    syncFabVisibility();
    // If the modal is open, re-render the tabs/body so badge + list stay live.
    if (modalBackdrop?.classList.contains('open')) {
      renderTabs();
      renderActiveBody();
    }
  });
  syncFabVisibility();
  bindNotesModalAutoHide();

  mounted = true;
}
