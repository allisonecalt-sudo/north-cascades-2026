/**
 * Lodging shortlist — localStorage-persisted ID Set + UI surfaces.
 *
 * Extracted 2026-05-17 (Lodging Refactor agent) from `sections/lodging.ts`.
 * Owns:
 *   - `SHORTLIST_KEY` localStorage namespace
 *   - `loadShortlist` / `saveShortlist`
 *   - The `shortlist` Set + `shortlistListeners` + `notifyShortlist` /
 *     `onShortlistChange` pub/sub
 *   - `togglePick(id)`
 *   - `renderShortlistPanel()` — compare table + mailto export
 *   - `renderShortlistContainer()` — sticky pill wrap
 *   - `renderShortlistFloater()` — FAB
 *   - `pricePerNightLow` helper (used for 4-night estimate column)
 *
 * Card render (`card.ts`) imports the Set + `togglePick`. The orchestrator
 * (`index.ts`) wires `onShortlistChange` to re-render panels + FAB.
 *
 * NOTE: This module is lodging-specific by design — the cross-section
 * shortlist DRY work (`sections/_shortlist.ts` factory called out in the
 * code audit #3) is a separate refactor and is NOT in scope here.
 */

import {
  EAST_LODGING,
  NATURE_LABELS,
  WEST_LODGING,
  type Lodging,
} from '../../data/lodging';
import { h } from '../../dom';

// ====================================================================
// STATE
// ====================================================================

export const SHORTLIST_KEY = 'ncades2026.lodgingPicks';

export function loadShortlist(): Set<string> {
  try {
    const raw = localStorage.getItem(SHORTLIST_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return new Set(parsed.filter((x): x is string => typeof x === 'string'));
  } catch {
    // localStorage might be blocked or stale data; ignore.
  }
  return new Set();
}

export function saveShortlist(set: Set<string>): void {
  try {
    localStorage.setItem(SHORTLIST_KEY, JSON.stringify([...set]));
  } catch {
    // ignore
  }
}

export const shortlist: Set<string> = loadShortlist();
const shortlistListeners: (() => void)[] = [];

export function notifyShortlist(): void {
  saveShortlist(shortlist);
  for (const fn of shortlistListeners) fn();
}

export function onShortlistChange(fn: () => void): void {
  shortlistListeners.push(fn);
}

export function togglePick(id: string): void {
  if (shortlist.has(id)) shortlist.delete(id);
  else shortlist.add(id);
  notifyShortlist();
}

// ====================================================================
// HELPERS
// ====================================================================

function allLodgings(): Lodging[] {
  return [...WEST_LODGING, ...EAST_LODGING];
}

export function pricePerNightLow(l: Lodging): number {
  const m = l.pricePerNight.match(/\$(\d+)/);
  return m ? parseInt(m[1] ?? '0', 10) : 0;
}

// ====================================================================
// SHORTLIST PANEL (compare table + mailto + clear)
// ====================================================================

export function renderShortlistPanel(): HTMLElement {
  const picked = allLodgings().filter((l) => shortlist.has(l.id));

  if (picked.length === 0) {
    return h(
      'div',
      { class: 'shortlist-panel shortlist-panel--empty' },
      h('p', {}, 'No picks yet — tap ', h('strong', {}, '✓ Pick'), ' on a card to start a shortlist.')
    );
  }

  // Compare table
  const headerRow = h(
    'tr',
    {},
    h('th', { scope: 'col' }, 'Property'),
    h('th', { scope: 'col' }, 'Beds'),
    h('th', { scope: 'col' }, 'Kitchen'),
    h('th', { scope: 'col' }, 'Setting'),
    h('th', { scope: 'col' }, '$/night'),
    h('th', { scope: 'col' }, '4-nt est.'),
    h('th', { scope: 'col' }, 'Sunset'),
    h('th', { scope: 'col' }, '')
  );

  const rows = picked.map((l) => {
    const low = pricePerNightLow(l);
    const fourNight = low > 0 ? `~$${low * 4}+` : '—';
    const removeBtn = h(
      'button',
      {
        type: 'button',
        class: 'shortlist-remove',
        'data-lodging-id': l.id,
        'aria-label': `Remove ${l.name} from shortlist`,
      },
      '×'
    );
    removeBtn.addEventListener('click', () => togglePick(l.id));
    return h(
      'tr',
      {},
      h(
        'td',
        { class: 'shortlist-name' },
        l.bookingUrl
          ? h('a', { href: l.bookingUrl, rel: 'noopener', target: '_blank' }, l.name)
          : document.createTextNode(l.name)
      ),
      h('td', {}, l.beds),
      h(
        'td',
        {},
        l.kitchen === 'full' ? 'Full' : l.kitchen === 'kitchenette' ? 'Kitchenette' : 'None'
      ),
      h('td', {}, NATURE_LABELS[l.natureTag]),
      h('td', {}, l.pricePerNight),
      h('td', {}, fourNight),
      h('td', {}, l.sunset?.worth === 'yes' ? '⭐' : l.sunset?.worth === 'maybe' ? '~' : '—'),
      h('td', { class: 'shortlist-actions' }, removeBtn)
    );
  });

  // mailto link — newline-encoded summary
  const subject = encodeURIComponent('North Cascades 2026 — lodging shortlist');
  const bodyLines = picked.map((l) => {
    const low = pricePerNightLow(l);
    const fourNight = low > 0 ? `~$${low * 4}+ for 4 nights` : '';
    return `• ${l.name} (${l.address})\n  Beds: ${l.beds} · ${l.pricePerNight}/night ${fourNight}\n  ${l.bookingUrl ?? ''}`;
  });
  const body = encodeURIComponent(
    `Hey Allison — here's my shortlist from the trip site:\n\n${bodyLines.join('\n\n')}\n\nReply with which you want to book.\n\n— Erin`
  );
  const mailHref = `mailto:allisonecalt@gmail.com?subject=${subject}&body=${body}`;

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
      h('h4', { class: 'shortlist-panel__title' }, `Your shortlist (${picked.length})`),
      h('p', { class: 'shortlist-panel__hint' }, '4-nt est. = base low rate × 4 nights, taxes/fees not included.')
    ),
    h(
      'div',
      { class: 'shortlist-table-wrap' },
      h(
        'table',
        { class: 'shortlist-table' },
        h('thead', {}, headerRow),
        h('tbody', {}, ...rows)
      )
    ),
    h(
      'div',
      { class: 'shortlist-actions-row' },
      h(
        'a',
        { class: 'shortlist-email', href: mailHref },
        '✉ Email shortlist to Allison'
      ),
      clearAllBtn
    )
  );
}

// ====================================================================
// CONTAINER + FAB
// ====================================================================

export function renderShortlistContainer(): HTMLElement {
  const details = h(
    'details',
    { class: 'shortlist', id: 'lodging-shortlist' },
    h(
      'summary',
      { class: 'shortlist__summary' },
      h('span', { class: 'shortlist__count' }, `${shortlist.size}`),
      h('span', { class: 'shortlist__label' }, ' picked — tap to compare')
    )
  );
  details.appendChild(renderShortlistPanel());
  return details;
}

export function renderShortlistFloater(): HTMLElement {
  const btn = h(
    'a',
    {
      class: shortlist.size > 0 ? 'shortlist-fab shortlist-fab--visible' : 'shortlist-fab',
      href: '#lodging-shortlist',
    },
    h('span', { class: 'shortlist-fab__count' }, `${shortlist.size}`),
    h('span', { class: 'shortlist-fab__label' }, ' picked · view shortlist →')
  );
  return btn;
}
