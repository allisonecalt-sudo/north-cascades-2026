/**
 * selectedPath state — single source of truth for which trip path is active.
 *
 * - Default: null ("Compare all options" mode — shows everything ungated).
 * - Persisted to localStorage AND mirrored to URL hash (#path=A) so the link is
 *   shareable.
 * - Listeners re-render filtered sections (itinerary, lodging, hikes, seattle).
 *
 * Vanilla TS — no framework. The state object is a tiny pub/sub.
 */

import type { PathId } from '../data/paths';

const STORAGE_KEY = 'ncades2026.selectedPath';

type Listener = (path: PathId | null) => void;

const listeners: Listener[] = [];
let current: PathId | null = readInitial();

function isValidPath(v: string | null | undefined): v is PathId {
  return v === 'A' || v === 'B' || v === 'C';
}

/**
 * Parse a path= param out of the hash, supporting both:
 *   - `#path=A`                 (only path param)
 *   - `#section?path=A`         (section anchor + query)
 *   - `#section`                (section anchor, no path)
 * Hash like `#paths` (the picker section anchor) should NOT be misread as
 * `paths=` query param — strip query-segment manually.
 */
function extractPathFromHash(hash: string): PathId | null {
  const raw = hash.replace(/^#/, '');
  // Split on `?` — section before, query after.
  const queryIdx = raw.indexOf('?');
  let queryStr = '';
  if (queryIdx >= 0) {
    queryStr = raw.slice(queryIdx + 1);
  } else if (raw.includes('=')) {
    // Hash IS the query (e.g. `#path=A`).
    queryStr = raw;
  } else {
    return null;
  }
  const params = new URLSearchParams(queryStr);
  const fromHash = params.get('path');
  return isValidPath(fromHash) ? fromHash : null;
}

function readInitial(): PathId | null {
  // URL hash wins (shareable links).
  if (typeof window !== 'undefined') {
    const fromHash = extractPathFromHash(window.location.hash);
    if (fromHash) return fromHash;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (isValidPath(stored)) return stored;
    } catch {
      // localStorage might be blocked — ignore.
    }
  }
  return null;
}

function persist(path: PathId | null): void {
  try {
    if (path) {
      localStorage.setItem(STORAGE_KEY, path);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // ignore
  }
  // Mirror to URL hash. Preserve the section anchor (everything before `?`).
  if (typeof window !== 'undefined') {
    const raw = window.location.hash.replace(/^#/, '');
    let section = '';
    let queryStr = '';
    const queryIdx = raw.indexOf('?');
    if (queryIdx >= 0) {
      section = raw.slice(0, queryIdx);
      queryStr = raw.slice(queryIdx + 1);
    } else if (raw.includes('=')) {
      queryStr = raw;
    } else {
      section = raw;
    }
    const params = new URLSearchParams(queryStr);
    if (path) {
      params.set('path', path);
    } else {
      params.delete('path');
    }
    const nextQuery = params.toString();
    let url: string;
    if (section && nextQuery) {
      url = `#${section}?${nextQuery}`;
    } else if (section) {
      url = `#${section}`;
    } else if (nextQuery) {
      url = `#${nextQuery}`;
    } else {
      url = window.location.pathname + window.location.search;
    }
    history.replaceState(null, '', url);
  }
}

export function getSelectedPath(): PathId | null {
  return current;
}

export function setSelectedPath(path: PathId | null): void {
  if (current === path) return;
  current = path;
  persist(path);
  for (const fn of listeners) fn(current);
}

export function subscribeSelectedPath(fn: Listener): () => void {
  listeners.push(fn);
  return () => {
    const idx = listeners.indexOf(fn);
    if (idx >= 0) listeners.splice(idx, 1);
  };
}
