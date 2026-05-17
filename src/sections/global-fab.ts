/**
 * global-fab.ts — persistent bottom-right "💬 Note" button on every page.
 *
 * Why this file exists: Erin asked for a way to leave a note from ANYWHERE on
 * the site, not just from a section header. The per-section 💬 buttons
 * (`notes-button.ts`) still exist and still work — those scope to a specific
 * section. This FAB is the always-available fallback that opens the same
 * modal scoped to the whole trip.
 *
 * What's decided:
 *   - Bottom-right floating pill, mirrors the Austria pattern from
 *     `austria-2026/src/notes-widget.ts`.
 *   - Mounted ONCE per page via `page-shell.ts`. Idempotent — guards against
 *     double-init if any page imports it directly.
 *   - Re-uses the existing notes modal from `notes-button.ts` —
 *     `initNotesModal()` + `openModal()` (re-exported). No second Supabase
 *     client, no second modal DOM tree.
 *   - Scope when opened from FAB: `section = 'whole-trip'`,
 *     `sectionLabel = 'whole trip'`. Judgment call: brief left this open —
 *     choosing the constant `whole-trip` (kebab-case) so it's distinct from
 *     any real section id and stays grouped together on the notes summary
 *     page. NOT current-page-name, because Erin's complaint was that
 *     section-scoped notes weren't enough; per-page would just recreate the
 *     same friction at a different granularity.
 *   - Hides itself when the notes modal is open (prevents the FAB peeking
 *     through the backdrop). Uses a MutationObserver on the modal `class`
 *     attribute — cheap, no polling.
 *   - z-index 998 — above all page chrome (highest existing was 60), below
 *     the notes modal backdrop (z-index 1000) so opening the modal still
 *     visually layers correctly. The brief said "99999" but Austria's modal
 *     sits at 100000 — same intent (FAB below modal). 998 keeps us
 *     consistent with the actual existing stack.
 *   - Visible on EVERY page including notes.html — Erin or Allison should be
 *     able to leave a note from the notes feed without scrolling to find a
 *     section header.
 *   - Pixel 7 Pro XL safe: bottom positioning uses
 *     `env(safe-area-inset-bottom)`, right offset accounts for the existing
 *     back-to-top button so they don't collide (FAB sits to the LEFT of
 *     back-to-top; back-to-top is shorter-lived — only after scroll).
 *
 * What's built: `initGlobalFab()`.
 * What's next: optional unread badge on the FAB (count of pending notes
 * not authored by the current user) — deferred.
 *
 * Links: `notes-button.ts` (modal + insert), `page-shell.ts` (mount point),
 * `styles/components.css` (.global-fab rules).
 */

import { initNotesModal, openGlobalScopeModal } from './notes-button';

const WHOLE_TRIP_SECTION = 'whole-trip';
const WHOLE_TRIP_LABEL = 'whole trip';

let mounted = false;

function buildFab(): HTMLButtonElement {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'global-fab';
  btn.setAttribute('aria-label', 'Leave a note for Allison about the trip');
  btn.setAttribute('title', 'Tell Allison what to change — type anything');
  btn.innerHTML =
    '<span class="global-fab__icon" aria-hidden="true">💬</span>' +
    '<span class="global-fab__label">Note</span>';
  return btn;
}

/**
 * Watch the notes modal's class list. When it gains `.open`, hide the FAB so
 * it doesn't peek through the backdrop. When it loses `.open`, show again.
 */
function bindModalAutoHide(fab: HTMLButtonElement): void {
  const modal = document.querySelector<HTMLDivElement>('.notes-modal-backdrop');
  if (!modal) return;
  const sync = (): void => {
    const isOpen = modal.classList.contains('open');
    fab.classList.toggle('global-fab--hidden', isOpen);
  };
  sync();
  const observer = new MutationObserver(sync);
  observer.observe(modal, { attributes: true, attributeFilter: ['class'] });
}

/**
 * Mount the global FAB. Idempotent — safe to call from page-shell on every
 * page; second call is a no-op.
 *
 * Order matters: notes modal must be in the DOM first so the MutationObserver
 * has something to observe. Caller (page-shell) already calls
 * `initNotesModal()` before this — we also call it defensively here in case
 * `initGlobalFab` is invoked standalone.
 */
export function initGlobalFab(): void {
  if (mounted) return;
  if (document.querySelector('.global-fab')) {
    mounted = true;
    return;
  }
  initNotesModal();
  const fab = buildFab();
  document.body.appendChild(fab);
  fab.addEventListener('click', () => {
    openGlobalScopeModal(WHOLE_TRIP_SECTION, WHOLE_TRIP_LABEL);
  });
  bindModalAutoHide(fab);
  mounted = true;
}
