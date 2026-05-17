/**
 * next-action.ts — adaptive call-to-action pill for the home page.
 *
 * What this is: a single, prominent next-action hint that adapts to where Erin
 * (or Allison) is in the trip-planning flow. Sits between the image hero and
 * the story-arc strip so it's the first thing the eye lands on after the
 * cinematic photo.
 *
 * Why: cold-start UX research — "What do I do first?" is the #1 question new
 * visitors ask within 5 seconds. A path picker + 4 chips + 3 path cards is a
 * lot to scan. ONE pill that names the next step removes that load.
 *
 * Adaptive logic (in priority order):
 *   1. No path selected + no shortlist picks → "Start: pick a path →"
 *      (anchors to #paths, the picker on the home page)
 *   2. Path selected + zero lodging picks → "You picked Path X — browse your
 *      lodging shortlist on the Stay page →"
 *   3. Path selected + lodging picks made → "You picked Path X — review your
 *      N lodging picks →"
 *   4. No path but shortlist picks exist (rare — exploring without committing)
 *      → "You've shortlisted N lodgings. Pick a path to see them in context →"
 *
 * Read sources:
 *   - selectedPath state via getSelectedPath() + subscribeSelectedPath()
 *   - localStorage 'ncades2026.lodgingPicks' (per the shortlist key pattern)
 *   - localStorage 'ncades2026.hikePicks'
 *
 * Caveats: localStorage is per-browser, so the count only reflects what THIS
 * device has picked. That's accurate to the user reading the page — they want
 * THEIR state, not aggregate state.
 *
 * Re-renders on path change (subscribed). Doesn't re-poll localStorage on
 * every page paint — picks made on other pages reflect after a reload of home,
 * which is the dominant flow (user clicks back to home from Stay/Hikes).
 */

import { h } from '../dom';
import { getSelectedPath, subscribeSelectedPath } from '../state/path';

const LODGING_KEY = 'ncades2026.lodgingPicks';
const HIKE_KEY = 'ncades2026.hikePicks';

interface PickCounts {
  lodging: number;
  hikes: number;
}

function readPickCounts(): PickCounts {
  let lodging = 0;
  let hikes = 0;
  try {
    const rawL = localStorage.getItem(LODGING_KEY);
    if (rawL) {
      const parsed: unknown = JSON.parse(rawL);
      if (Array.isArray(parsed)) lodging = parsed.length;
    }
    const rawH = localStorage.getItem(HIKE_KEY);
    if (rawH) {
      const parsed: unknown = JSON.parse(rawH);
      if (Array.isArray(parsed)) hikes = parsed.length;
    }
  } catch {
    // localStorage might be blocked — fall through with zeroes.
  }
  return { lodging, hikes };
}

interface ActionContent {
  /** Short eyebrow above the pill, e.g. "Start here" or "You're on Path B". */
  eyebrow: string;
  /** Main pill label — verb-led, action-shaped. */
  label: string;
  /** Anchor href — onsite hash or .html link. */
  href: string;
  /** Visual variant — primary (orange/CTA) vs secondary (glacier/info). */
  variant: 'primary' | 'secondary';
}

function computeAction(
  path: string | null,
  picks: PickCounts
): ActionContent {
  // Case 1 — no path yet, no picks: pure cold-start.
  if (!path && picks.lodging === 0 && picks.hikes === 0) {
    return {
      eyebrow: 'Start here',
      label: 'Pick a path below →',
      href: '#paths',
      variant: 'primary',
    };
  }

  // Case 4 — picks but no path: gently nudge toward committing.
  if (!path && (picks.lodging > 0 || picks.hikes > 0)) {
    const parts: string[] = [];
    if (picks.lodging > 0) parts.push(`${picks.lodging} lodging${picks.lodging === 1 ? '' : 's'}`);
    if (picks.hikes > 0) parts.push(`${picks.hikes} hike${picks.hikes === 1 ? '' : 's'}`);
    return {
      eyebrow: `You've shortlisted ${parts.join(' + ')}`,
      label: 'Pick a path to see them in context →',
      href: '#paths',
      variant: 'secondary',
    };
  }

  // Case 2 — path but no lodging picks yet.
  if (path && picks.lodging === 0) {
    return {
      eyebrow: `You're on Path ${path}`,
      label: 'Browse the lodging shortlist →',
      href: 'lodging.html',
      variant: 'primary',
    };
  }

  // Case 3 — path + lodging picks: review what you've got.
  const lodgingStr =
    picks.lodging === 1 ? '1 lodging pick' : `${picks.lodging} lodging picks`;
  const hikeStr =
    picks.hikes > 0
      ? ` + ${picks.hikes} hike${picks.hikes === 1 ? '' : 's'}`
      : '';
  return {
    eyebrow: `You're on Path ${path ?? '?'} · ${lodgingStr}${hikeStr}`,
    label: 'Review your shortlist →',
    href: 'lodging.html#lodging-shortlist',
    variant: 'primary',
  };
}

function buildPill(action: ActionContent): HTMLElement {
  return h(
    'div',
    {
      class: `next-action next-action--${action.variant}`,
      'aria-label': action.eyebrow,
    },
    h('span', { class: 'next-action__eyebrow' }, action.eyebrow),
    h(
      'a',
      { class: 'next-action__cta', href: action.href },
      action.label
    )
  );
}

export function renderNextAction(): HTMLElement {
  const wrap = h('div', { class: 'next-action-wrap' });
  const paint = (): void => {
    const path = getSelectedPath();
    const picks = readPickCounts();
    const action = computeAction(path, picks);
    wrap.replaceChildren(buildPill(action));
  };
  paint();
  subscribeSelectedPath(paint);
  // Re-paint when the tab regains focus — covers the case where Erin picks
  // lodging on the Stay page, then nav-clicks home; localStorage has changed
  // but state subscribers don't fire because the path didn't change.
  if (typeof window !== 'undefined') {
    window.addEventListener('focus', paint);
    window.addEventListener('storage', (e) => {
      if (e.key === LODGING_KEY || e.key === HIKE_KEY) paint();
    });
  }
  return wrap;
}
