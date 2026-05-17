/**
 * shortlist-shared.ts — generic per-entity-type ✓pick state factory.
 *
 * What this is
 * ============
 * A reusable factory that gives any "list of cards" section the same
 * ✓ Pick / shortlist behavior that lodging and hikes already have. Before
 * this module each section that wanted ✓pick had to roll its own:
 * localStorage key, Set, listener pub/sub, save/load, pick-button render.
 * That worked for two sections; it doesn't scale to the 5+ new destination
 * pages added in Wave 3 (viewpoints, lakes, towns, hidden-gems, top-sunsets).
 *
 * Why it exists (Erin behavior)
 * =============================
 * Erin's pre-trip pattern is: scan → ✓ shortlist → trade with Allison.
 * If a destination type can't be ✓-picked, that idea gets lost — she can't
 * easily say "these 3 viewpoints, not the others." This factory unblocks
 * ✓pick on every entity type with one consistent API.
 *
 * What it owns
 * ============
 *   - localStorage persistence under a per-entity-type key (e.g.
 *     `ncades2026.viewpointPicks`).
 *   - The picked-IDs Set + listener pub/sub (notify on toggle / clear).
 *   - `renderPickButton(id, name)` — the standard `.pick-btn` markup,
 *     wired to toggle on click. Matches the visual+class convention
 *     established by `sections/hikes.ts` so the unified CSS rule still
 *     applies (no per-section CSS forks).
 *   - `picked()` helper that returns the entity objects (not IDs) for
 *     panel rendering.
 *
 * What it does NOT do
 * ===================
 *   - The FAB UI. That lives in `picks-fab.ts` as a single unified surface
 *     across the new entity types (one FAB, tabs per kind). This module
 *     just hands out a `Shortlist<T>` handle; the FAB consumes registered
 *     shortlists.
 *   - Touch lodging / hikes shortlists. Those have richer compare-tables
 *     (mailto export, $/night column) tightly coupled to their card data;
 *     porting those would risk regressing their existing behavior. Their
 *     FABs stay separate. This factory unblocks the NEW 5 sections.
 *
 * Layout-safety note
 * ==================
 * The FAB layout is OWNED by `picks-fab.ts` — this module never appends
 * anything to <body>. That keeps factories non-intrusive: a section can
 * adopt ✓pick state without forcing a UI on every page.
 */
import { h } from '../dom';

// ====================================================================
// PUBLIC TYPES
// ====================================================================

export interface ShortlistThumb {
  src: string;
  alt: string;
}

export interface CreateShortlistOptions<T> {
  /**
   * localStorage namespace — MUST be unique per entity type. Convention:
   * `ncades2026.<kind>Picks` (matches the lodging / hikes precedent).
   */
  storageKey: string;
  /** Display label used in the FAB tab + button text (e.g. "Viewpoint"). */
  entityKind: string;
  /** Plural form (e.g. "Viewpoints") — used as the tab label. */
  entityKindPlural: string;
  /** Stable callback returning the canonical list of entities. */
  all: () => readonly T[];
  /** Extract the stable string ID for an entity (what we persist). */
  getId: (entity: T) => string;
  /** Extract the display name for an entity. */
  getName: (entity: T) => string;
  /**
   * Extract a thumbnail (first carousel photo or representative image).
   * Returning `null` is fine — the panel just renders a placeholder.
   */
  getThumb: (entity: T) => ShortlistThumb | null;
  /**
   * Optional short detail string ("MP 132 · WA-20", "Swim-friendly", etc.)
   * to render under the name in the picks panel.
   */
  getDetail?: (entity: T) => string;
}

export interface Shortlist<T> {
  /** Read-only check: is this ID currently picked? */
  has: (id: string) => boolean;
  /** Toggle pick state for an ID. Triggers persistence + subscribers. */
  toggle: (id: string) => void;
  /** Current pick count. */
  count: () => number;
  /** Subscribe to changes — returns an unsubscribe fn. */
  subscribe: (fn: () => void) => () => void;
  /** Resolve picked IDs back to entity objects (in `all()` order). */
  picked: () => T[];
  /** Clear every pick (no-op if already empty). */
  clear: () => void;
  /** Build a `.pick-btn` element for a card. Wires the click handler. */
  renderPickButton: (id: string, name: string) => HTMLButtonElement;
  /**
   * The factory configuration — exposed so picks-fab can render a panel
   * for this shortlist (name, thumb, detail extractors).
   */
  readonly meta: {
    entityKind: string;
    entityKindPlural: string;
    storageKey: string;
    getId: (entity: T) => string;
    getName: (entity: T) => string;
    getThumb: (entity: T) => ShortlistThumb | null;
    getDetail?: (entity: T) => string;
    all: () => readonly T[];
  };
}

// ====================================================================
// SHARED CSS — injected once, regardless of how many factories spin up
// ====================================================================

const STYLE_ID = 'shortlist-shared-styles';

function ensureStyles(): void {
  if (typeof document === 'undefined') return;
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = SHARED_CSS;
  document.head.appendChild(style);
}

/**
 * `.pick-btn` styles match the convention established in `sections/hikes.ts`
 * and the lodging card. We re-state them here so any page that adopts
 * shortlist-shared gets the visuals without needing a global stylesheet
 * change. If the global styles already define `.pick-btn`, this loses
 * the cascade-tie because :where() keeps specificity 0 — global rules win.
 */
const SHARED_CSS = `
:where(.pick-btn) {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.32rem 0.7rem;
  border-radius: 999px;
  border: 1px solid var(--c-forest-700, #2f5a3a);
  background: var(--c-warm-50, #fdfaf2);
  color: var(--c-forest-800, #234430);
  font-family: inherit;
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  cursor: pointer;
  transition: background 140ms ease, color 140ms ease, transform 140ms ease;
}
:where(.pick-btn:hover, .pick-btn:focus-visible) {
  background: var(--c-forest-100, #d6e4d8);
  transform: translateY(-1px);
}
:where(.pick-btn:focus-visible) {
  outline: 2px solid var(--c-glacier-500, #4a86a5);
  outline-offset: 2px;
}
:where(.pick-btn--picked) {
  background: var(--c-forest-700, #2f5a3a);
  color: var(--c-warm-50, #fdfaf2);
}
:where(.pick-btn--picked:hover, .pick-btn--picked:focus-visible) {
  background: var(--c-forest-800, #234430);
}
`;

// ====================================================================
// FACTORY
// ====================================================================

function loadIds(storageKey: string): Set<string> {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return new Set();
    const parsed: unknown = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return new Set(parsed.filter((x): x is string => typeof x === 'string'));
    }
  } catch {
    // localStorage blocked or stale data — fail silent.
  }
  return new Set();
}

function saveIds(storageKey: string, set: Set<string>): void {
  try {
    localStorage.setItem(storageKey, JSON.stringify([...set]));
  } catch {
    // ignore
  }
}

/**
 * Build a `Shortlist<T>` handle for one entity type. Call ONCE per type
 * at module scope (so the Set + listeners persist across re-renders).
 */
export function createShortlist<T>(opts: CreateShortlistOptions<T>): Shortlist<T> {
  ensureStyles();

  const ids: Set<string> = loadIds(opts.storageKey);
  const listeners: (() => void)[] = [];

  const notify = (): void => {
    saveIds(opts.storageKey, ids);
    for (const fn of listeners) fn();
  };

  const has = (id: string): boolean => ids.has(id);

  const toggle = (id: string): void => {
    if (ids.has(id)) ids.delete(id);
    else ids.add(id);
    notify();
  };

  const count = (): number => ids.size;

  const subscribe = (fn: () => void): (() => void) => {
    listeners.push(fn);
    return () => {
      const idx = listeners.indexOf(fn);
      if (idx >= 0) listeners.splice(idx, 1);
    };
  };

  const picked = (): T[] => {
    const all = opts.all();
    return all.filter((e) => ids.has(opts.getId(e)));
  };

  const clear = (): void => {
    if (ids.size === 0) return;
    ids.clear();
    notify();
  };

  const renderPickButton = (id: string, name: string): HTMLButtonElement => {
    const isPicked = ids.has(id);
    const btn = h(
      'button',
      {
        type: 'button',
        class: isPicked ? 'pick-btn pick-btn--picked' : 'pick-btn',
        'aria-pressed': isPicked ? 'true' : 'false',
        'aria-label': isPicked
          ? `Remove ${name} from your ${opts.entityKind.toLowerCase()} picks`
          : `Add ${name} to your ${opts.entityKind.toLowerCase()} picks`,
        'data-entity-kind': opts.entityKind,
        'data-entity-id': id,
      },
      isPicked ? '✓ Picked' : '✓ Pick'
    ) as HTMLButtonElement;
    btn.addEventListener('click', () => toggle(id));
    // Keep this button in sync if the user toggles from elsewhere
    // (e.g. the FAB panel's Remove button on the same card).
    const unsub = subscribe(() => {
      const nowPicked = ids.has(id);
      btn.classList.toggle('pick-btn--picked', nowPicked);
      btn.setAttribute('aria-pressed', nowPicked ? 'true' : 'false');
      btn.textContent = nowPicked ? '✓ Picked' : '✓ Pick';
      btn.setAttribute(
        'aria-label',
        nowPicked
          ? `Remove ${name} from your ${opts.entityKind.toLowerCase()} picks`
          : `Add ${name} to your ${opts.entityKind.toLowerCase()} picks`
      );
    });
    // Detach the subscription if the button leaves the DOM.
    // MutationObserver scoped to document.body is the lightest option;
    // we batch all such observers by using a single observer per button
    // since pages typically only have ~20-30 cards rendered at once.
    const obs = new MutationObserver(() => {
      if (!btn.isConnected) {
        unsub();
        obs.disconnect();
      }
    });
    obs.observe(document.body, { childList: true, subtree: true });
    return btn;
  };

  return {
    has,
    toggle,
    count,
    subscribe,
    picked,
    clear,
    renderPickButton,
    meta: {
      entityKind: opts.entityKind,
      entityKindPlural: opts.entityKindPlural,
      storageKey: opts.storageKey,
      getId: opts.getId,
      getName: opts.getName,
      getThumb: opts.getThumb,
      ...(opts.getDetail ? { getDetail: opts.getDetail } : {}),
      all: opts.all,
    },
  };
}
