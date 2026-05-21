/**
 * search-index.ts — global search index for the NC 2026 trip site.
 *
 * Why this file exists: NC now has 18+ pages and ~100 named entities (lodging,
 * hikes, viewpoints, lakes, towns, hidden gems, activities, sunsets, Seattle
 * stops, restaurants, map locations). Without a search affordance, Erin has to
 * guess the nav bucket every time she wants to look up "Blue Lake", "winthrop",
 * or "Cascade Pass". This module builds a flat searchable index that powers
 * the global Cmd/Ctrl+/ overlay (`sections/search-overlay.ts`).
 *
 * Indexed kinds (one row per entity):
 *   - 'lodging'    — WEST_LODGING + EAST_LODGING from data/lodging.ts
 *   - 'hike'       — HIKES from data/hikes.ts
 *   - 'viewpoint'  — VIEWPOINT_DESTINATIONS + roadside VIEWPOINTS + BAKER_VIEWPOINTS
 *   - 'lake'       — LAKES from data/lakes.ts
 *   - 'town'       — TOWNS from data/towns.ts
 *   - 'gem'        — HIDDEN_GEMS from data/hidden-gems.ts
 *   - 'activity'   — ACTIVITIES from data/activities.ts
 *   - 'sunset'     — TOP_SUNSETS from data/top-sunsets.ts
 *   - 'restaurant' — RESTAURANTS rows from data/restaurants.ts (kosher only)
 *   - 'sleeping'   — COOL_SLEEPING_PLACES from data/cool-sleeping-places.ts
 *   - 'seattle'    — SEATTLE_STOPS from data/seattle.ts
 *   - 'page'       — top-level pages (Home / Costs / Pre-trip / Map / Travel / ...)
 *
 * Each row carries `deepLinkUrl` — an absolute href into the site that resolves
 * to a real anchor (page or page#entityId). The overlay just sets
 * `window.location.href = entry.deepLinkUrl` on Enter.
 *
 * No external deps (no Fuse.js). The matcher is plain substring + tag matching
 * with name-hits weighted higher than tag/description hits. See `searchIndex`.
 *
 * Cmd/Ctrl+/ — search keybinding. Cmd+K is reserved for the notes widget.
 */

import { WEST_LODGING, EAST_LODGING } from './data/lodging';
import { HIKES } from './data/hikes';
import {
  VIEWPOINT_DESTINATIONS,
  VIEWPOINTS,
  BAKER_VIEWPOINTS,
} from './data/viewpoints';
import { LAKES } from './data/lakes';
import { TOWNS } from './data/towns';
import { HIDDEN_GEMS } from './data/hidden-gems';
import { ACTIVITIES } from './data/activities';
import { TOP_SUNSETS } from './data/top-sunsets';
import { RESTAURANTS } from './data/restaurants';
import { COOL_SLEEPING_PLACES } from './data/cool-sleeping-places';
import { SEATTLE_STOPS } from './data/seattle';

// =====================================================================
// Public shape — every search-overlay row consumes this.
// =====================================================================

export type SearchKind =
  | 'lodging'
  | 'hike'
  | 'viewpoint'
  | 'lake'
  | 'town'
  | 'gem'
  | 'activity'
  | 'sunset'
  | 'restaurant'
  | 'sleeping'
  | 'seattle'
  | 'page';

export interface SearchEntry {
  /** Stable id — kind-prefixed slug. Used for React-style keys + dedup. */
  id: string;
  /** Display name — what the user sees as the row title. */
  name: string;
  /** What bucket of the site this lives in. Drives grouping + icon. */
  kind: SearchKind;
  /** Free-form short blurb shown under the name (~140 chars). */
  description: string;
  /** Region / corridor / town label shown as a meta chip. */
  region: string;
  /** Absolute href into the site (page.html or page.html#entityId). */
  deepLinkUrl: string;
  /** Free-form tags (region, vibe, side, path, etc.) for fuzzy match. */
  tags: string[];
  /** 0-100 sort weight; default ordering inside a kind group. */
  weight: number;
}

// =====================================================================
// Helpers — kept private. No DOM, no I/O. Pure data shaping.
// =====================================================================

function oneLine(s: string | undefined | null, max = 140): string {
  if (!s) return '';
  const flat = s.replace(/\s+/g, ' ').trim();
  if (flat.length <= max) return flat;
  return flat.slice(0, max - 1).trimEnd() + '…';
}

function slug(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80);
}

// =====================================================================
// Per-kind indexers — each returns SearchEntry[] from its data module.
// =====================================================================

function indexLodgings(): SearchEntry[] {
  const out: SearchEntry[] = [];
  const seen = new Set<string>();
  const allLodging = [
    ...WEST_LODGING.map((l) => ({ lodging: l, side: 'west' as const })),
    ...EAST_LODGING.map((l) => ({ lodging: l, side: 'east' as const })),
  ];
  for (const { lodging: l, side } of allLodging) {
    // Skip sold-out properties — same posture as the lodging renderer.
    if (l.availability === 'sold-out-or-unavailable') continue;
    const id = `lodging-${l.id}`;
    if (seen.has(id)) continue;
    seen.add(id);
    const region =
      side === 'west' ? 'West side · Marblemount corridor' : 'East side · Mazama / Winthrop';
    const tags = [
      side,
      l.vibe,
      l.tier,
      l.natureTag,
      l.kitchen,
      ...(l.amenities?.hotTub ? ['hot-tub'] : []),
      ...(l.sunset?.worth === 'yes' ? ['sunset'] : []),
      ...(l.kosherCookingFit ? ['kosher-kitchen'] : []),
      ...(l.freeCancellation === 'yes' ? ['free-cancellation'] : []),
    ].filter(Boolean) as string[];
    // Weighting: fits-brief leads, splurge mid, not-a-fit trails.
    const tierWeight =
      l.tier === 'fits-brief' ? 95 : l.tier === 'splurge' ? 70 : l.tier === 'note' ? 50 : 40;
    out.push({
      id,
      name: l.name,
      kind: 'lodging',
      description: oneLine(`${l.beds} · ${l.nature} · ${l.notes}`),
      region,
      deepLinkUrl: `lodging.html#lodging-${l.id}`,
      tags,
      weight: tierWeight,
    });
  }
  return out;
}

function indexHikes(): SearchEntry[] {
  return HIKES.map((h): SearchEntry => {
    const tags = [
      h.side,
      h.level,
      h.difficulty.toLowerCase(),
      ...(h.kidFriendly ? ['kids', 'family'] : []),
      ...(h.dogsAllowed ? ['dogs'] : []),
      ...(h.hiddenGem ? ['hidden-gem'] : []),
      ...(h.permitNeeded ? [h.permitNeeded] : []),
      ...(h.needsWa20Through ? ['needs-wa20'] : []),
      'hike',
      'trail',
    ].filter(Boolean) as string[];
    const weight =
      40 +
      (h.level === 'easy' ? 10 : h.level === 'moderate' ? 15 : 5) +
      (h.hiddenGem ? 5 : 0);
    return {
      id: `hike-${h.id}`,
      name: h.name,
      kind: 'hike',
      description: oneLine(
        `${h.mileage} · ${h.elevation} · ${h.duration}. ${h.description}`
      ),
      region: h.trailhead,
      deepLinkUrl: `hikes.html#hike-${h.id}`,
      tags,
      weight,
    };
  });
}

function indexViewpoints(): SearchEntry[] {
  const out: SearchEntry[] = [];
  const seen = new Set<string>();
  // Rich viewpoint destinations (the main page renders these).
  for (const v of VIEWPOINT_DESTINATIONS) {
    const id = `viewpoint-${v.id}`;
    if (seen.has(id)) continue;
    seen.add(id);
    const corridorLabel =
      v.corridor === 'wa-20' ? 'WA-20 corridor' :
      v.corridor === 'mt-baker' ? 'Mt. Baker corridor (WA-542)' :
      'Methow Valley';
    out.push({
      id,
      name: v.name,
      kind: 'viewpoint',
      description: oneLine(v.lede),
      region: corridorLabel,
      deepLinkUrl: `viewpoints.html#${v.id}`,
      tags: [
        v.corridor,
        v.effort,
        v.bestTime,
        ...(v.needsWa20 ? ['needs-wa20'] : []),
        ...(v.ada ? ['ada', 'accessible'] : []),
        ...(v.restrooms ? ['restrooms'] : []),
        'viewpoint',
        'drive-up',
      ],
      weight: v.bestTime === 'sunset' ? 75 : 65,
    });
  }
  // Roadside WA-20 viewpoints (compact list — names only — anchored by milepost).
  for (const v of VIEWPOINTS) {
    const id = `viewpoint-mp${v.milepost}-${slug(v.name)}`;
    if (seen.has(id)) continue;
    seen.add(id);
    out.push({
      id,
      name: `${v.name} — MP ${v.milepost}`,
      kind: 'viewpoint',
      description: oneLine(`${v.timeNeeded} · ${v.description}`),
      region: 'WA-20 roadside',
      deepLinkUrl: `viewpoints.html#mp-${v.milepost}`,
      tags: ['wa-20', 'roadside', 'pull-off', `mp-${v.milepost}`],
      weight: v.featured ? 60 : 45,
    });
  }
  // Mt. Baker corridor viewpoints (WA-542 bonus).
  for (const v of BAKER_VIEWPOINTS) {
    const id = `viewpoint-baker-${slug(v.name)}`;
    if (seen.has(id)) continue;
    seen.add(id);
    out.push({
      id,
      name: v.name,
      kind: 'viewpoint',
      description: oneLine(`${v.timeNeeded} · ${v.description}`),
      region: 'Mt. Baker corridor (WA-542)',
      deepLinkUrl: `viewpoints.html#baker-${slug(v.name)}`,
      tags: ['mt-baker', 'wa-542', 'baker-corridor'],
      weight: 55,
    });
  }
  return out;
}

function indexLakes(): SearchEntry[] {
  return LAKES.map((l): SearchEntry => {
    const tags = [
      l.base,
      l.swim,
      l.rental,
      ...(l.kidFriendly ? ['kids', 'family'] : []),
      ...(l.needsWa20Through ? ['needs-wa20'] : []),
      'lake',
      'water',
    ].filter(Boolean) as string[];
    return {
      id: `lake-${l.id}`,
      name: l.name,
      kind: 'lake',
      description: oneLine(l.lede),
      region: l.where,
      deepLinkUrl: `lakes.html#${l.id}`,
      tags,
      weight: l.swim === 'yes' ? 70 : 55,
    };
  });
}

function indexTowns(): SearchEntry[] {
  return TOWNS.map((t): SearchEntry => {
    const tags = [
      t.side,
      t.walkability,
      ...(Array.isArray(t.paths) ? t.paths.map((p) => `path-${p.toLowerCase()}`) : ['all-paths']),
      'town',
      'corridor',
    ].filter(Boolean) as string[];
    return {
      id: `town-${t.id}`,
      name: t.name,
      kind: 'town',
      description: oneLine(`${t.tagline} · ${t.whyStop}`),
      region: t.side === 'west' ? 'West side · WA-20 corridor' : 'East side · Methow Valley',
      deepLinkUrl: `towns.html#${t.id}`,
      tags,
      weight: t.walkability === 'high' ? 65 : 50,
    };
  });
}

function indexHiddenGems(): SearchEntry[] {
  return HIDDEN_GEMS.map((g): SearchEntry => {
    const sideLabel =
      g.side === 'west' ? 'West' :
      g.side === 'east' ? 'East' :
      g.side === 'mt-baker' ? 'Mt. Baker corridor' : 'Either';
    const tags = [
      g.side,
      g.effort,
      g.permit,
      ...(g.needsWa20Through ? ['needs-wa20'] : []),
      'hidden-gem',
      'lesser-known',
    ].filter(Boolean) as string[];
    return {
      id: `gem-${g.id}`,
      name: g.name,
      kind: 'gem',
      description: oneLine(`${g.length} · ${g.elevation}. ${g.whyHidden}`),
      region: `${sideLabel} side · ${g.where}`,
      deepLinkUrl: `hidden-gems.html#${g.id}`,
      tags,
      weight: g.effort === 'moderate' ? 60 : g.effort === 'low' ? 55 : 45,
    };
  });
}

function indexActivities(): SearchEntry[] {
  return ACTIVITIES.map((a): SearchEntry => {
    const tags = [
      a.category ?? 'general',
      a.costTier,
      ...(a.side ? [a.side] : []),
      ...(a.kidFriendly ? ['kids', 'family'] : []),
      ...(a.rentalsOnSite ? ['rentals-on-site'] : []),
      ...(a.needsWa20Through ? ['needs-wa20'] : []),
      'activity',
    ].filter(Boolean) as string[];
    return {
      id: `activity-${a.id}`,
      name: a.name,
      kind: 'activity',
      description: oneLine(`${a.time} · ${a.cost}. ${a.description}`),
      region: a.where,
      deepLinkUrl: `activities.html#${a.id}`,
      tags,
      weight: a.category === 'water' ? 65 : 50,
    };
  });
}

function indexSunsets(): SearchEntry[] {
  return TOP_SUNSETS.map((s): SearchEntry => {
    const tags = [
      ...s.bestByPath.map((p) => `path-${p.toLowerCase()}`),
      ...(s.fromLodging ? ['from-lodging', 'porch'] : []),
      'sunset',
      'golden-hour',
      'top-sunset',
    ];
    // Rank 1-3 weight highest.
    const weight = 85 - (s.rank - 1) * 5;
    return {
      id: `sunset-${slug(s.name)}`,
      name: `${s.name} — sunset`,
      kind: 'sunset',
      description: oneLine(s.why),
      region: s.where,
      deepLinkUrl: `top-sunsets.html#sunset-${s.rank}`,
      tags,
      weight,
    };
  });
}

function indexRestaurants(): SearchEntry[] {
  const out: SearchEntry[] = [];
  for (const town of RESTAURANTS) {
    if (town.noKosher) continue;
    for (const r of town.places) {
      out.push({
        id: `restaurant-${slug(r.name)}`,
        name: r.name,
        kind: 'restaurant',
        description: oneLine(`${r.hechsher}. ${r.note}`),
        region: town.town,
        deepLinkUrl: `food.html#restaurant-${slug(r.name)}`,
        tags: ['kosher', 'restaurant', 'food', 'vaad', slug(town.town)],
        weight: 60,
      });
    }
  }
  return out;
}

function indexCoolSleeping(): SearchEntry[] {
  return COOL_SLEEPING_PLACES.map((p): SearchEntry => {
    const tags = [
      p.access,
      p.locationTier,
      p.bookingStatus,
      ...(p.meetsBedRule ? ['fits-brief'] : ['note']),
      'cool-sleeping',
      'lodging-quirky',
    ];
    return {
      id: `sleeping-${p.id}`,
      name: p.name,
      kind: 'sleeping',
      description: oneLine(`${p.beds}. ${p.whyCool}`),
      region: p.region,
      deepLinkUrl: `lodging.html#sleeping-${p.id}`,
      tags,
      weight: p.meetsBedRule ? 60 : 40,
    };
  });
}

function indexSeattle(): SearchEntry[] {
  return SEATTLE_STOPS.map((s): SearchEntry => ({
    id: `seattle-${s.id}`,
    name: s.name,
    kind: 'seattle',
    description: oneLine(`${s.timeNeeded} · ${s.why}`),
    region: 'Seattle · Day 1 or Day 5',
    deepLinkUrl: `seattle.html#${s.id}`,
    tags: [s.category, 'seattle', 'layover'],
    weight: s.category === 'walkable' ? 55 : 45,
  }));
}

// =====================================================================
// Page entries — top-level navigation targets so search doubles as a
// nav launcher.
// =====================================================================

interface PageRow {
  id: string;
  name: string;
  url: string;
  blurb: string;
  tags: string[];
  weight: number;
}

const PAGE_ROWS: PageRow[] = [
  { id: 'home', name: 'Home', url: './', blurb: 'The booked trip at a glance — locked decisions, open loops, map, itinerary.', tags: ['home', 'landing'], weight: 90 },
  { id: 'lodging', name: 'Where we sleep', url: 'lodging.html', blurb: 'All cabins, West + East, with 2-bed + kitchen filtering.', tags: ['lodging', 'cabins', 'sleep', 'stay'], weight: 88 },
  { id: 'hikes', name: 'Hikes', url: 'hikes.html', blurb: 'Easy to ambitious — Cascade Pass, Maple Pass, Blue Lake, hidden gems.', tags: ['hikes', 'trails', 'walk'], weight: 86 },
  { id: 'viewpoints', name: 'Viewpoints', url: 'viewpoints.html', blurb: 'Drive-up postcards along WA-20 + Mt. Baker corridor.', tags: ['viewpoints', 'overlooks', 'drive-up'], weight: 78 },
  { id: 'lakes', name: 'Lakes & water', url: 'lakes.html', blurb: 'Diablo, Ross, Patterson, Pearrygin — paddle, swim, ferry.', tags: ['lakes', 'water', 'swim', 'kayak'], weight: 76 },
  { id: 'activities', name: 'Activities', url: 'activities.html', blurb: 'Non-hiking ways to spend a day — kayak, bike, wildlife, towns.', tags: ['activities', 'kayak', 'paddle'], weight: 70 },
  { id: 'hidden-gems', name: 'Hidden gems', url: 'hidden-gems.html', blurb: 'Lesser-known viewpoints, lookouts, and trails.', tags: ['hidden-gems', 'lesser-known'], weight: 70 },
  { id: 'towns', name: 'Towns', url: 'towns.html', blurb: 'Marblemount → Newhalem → Concrete → Mazama → Winthrop.', tags: ['towns', 'corridor'], weight: 68 },
  { id: 'top-sunsets', name: 'Top sunsets', url: 'top-sunsets.html', blurb: 'Best sunset spots per path — porch, drive-up, walkable.', tags: ['sunset', 'golden-hour'], weight: 66 },
  { id: 'food', name: 'Groceries & food', url: 'food.html', blurb: 'Kosher grocery run + cook-in strategy.', tags: ['food', 'groceries', 'kosher', 'kitchen'], weight: 60 },
  { id: 'seattle', name: 'Seattle', url: 'seattle.html', blurb: 'Day 1 + Day 5 anchor — Pike Place, Kerry Park, kosher stops.', tags: ['seattle', 'sea', 'layover'], weight: 70 },
  { id: 'travel', name: 'Travel', url: 'travel.html', blurb: 'Flights, routings, primary + 6 collapsed alternates.', tags: ['travel', 'flights', 'airfare'], weight: 72 },
  { id: 'rental', name: 'Rental car', url: 'rental.html', blurb: 'Automatic, gas/hybrid, all-in insurance pricing.', tags: ['rental', 'car', 'auto'], weight: 65 },
  { id: 'driving-cascades', name: 'Driving the Cascades', url: 'driving-cascades.html', blurb: 'WA-20 mile-by-mile + Cascade River Rd dirt section.', tags: ['driving', 'wa-20', 'cascade-river-rd'], weight: 65 },
  { id: 'costs', name: 'Costs', url: 'costs.html', blurb: 'Budget ranges + breakdown per path.', tags: ['costs', 'budget', 'money'], weight: 80 },
  { id: 'pre-trip', name: 'Pre-trip', url: 'pre-trip.html', blurb: 'Book-by dates + verification timeline.', tags: ['pre-trip', 'verify', 'book-by'], weight: 60 },
  { id: 'for-erin', name: 'For Erin', url: 'for-erin.html', blurb: 'Open decisions to weigh in on.', tags: ['erin', 'decisions', 'feedback'], weight: 75 },
  { id: 'details', name: 'Details', url: 'details.html', blurb: 'Restaurants + bring list + decision log.', tags: ['details', 'bring', 'restaurants'], weight: 55 },
  { id: 'notes', name: 'Notes', url: 'notes.html', blurb: 'Every 💬 note across the site, one feed.', tags: ['notes', 'comments', 'feedback'], weight: 55 },
  { id: 'map', name: 'Map', url: 'map.html', blurb: 'Interactive map of every lodging + trailhead + viewpoint.', tags: ['map', 'leaflet', 'pins'], weight: 75 },
  { id: 'search', name: 'Search', url: 'search.html', blurb: 'Search every place + page on the site.', tags: ['search', 'find', 'lookup'], weight: 50 },
];

function indexPages(): SearchEntry[] {
  return PAGE_ROWS.map((p) => ({
    id: `page-${p.id}`,
    name: p.name,
    kind: 'page' as const,
    description: p.blurb,
    region: 'Site navigation',
    deepLinkUrl: p.url,
    tags: ['page', ...p.tags],
    weight: p.weight,
  }));
}

// =====================================================================
// Public API — buildSearchIndex() returns the cached flat list.
// =====================================================================

let CACHED: SearchEntry[] | null = null;

export function buildSearchIndex(): SearchEntry[] {
  if (CACHED) return CACHED;
  CACHED = [
    ...indexPages(),
    ...indexLodgings(),
    ...indexHikes(),
    ...indexViewpoints(),
    ...indexLakes(),
    ...indexTowns(),
    ...indexHiddenGems(),
    ...indexActivities(),
    ...indexSunsets(),
    ...indexRestaurants(),
    ...indexCoolSleeping(),
    ...indexSeattle(),
  ];
  return CACHED;
}

/**
 * For diagnostics + the reporter — count entries by kind.
 */
export function countByKind(): Record<SearchKind, number> {
  const out: Record<SearchKind, number> = {
    page: 0,
    lodging: 0,
    hike: 0,
    viewpoint: 0,
    lake: 0,
    town: 0,
    gem: 0,
    activity: 0,
    sunset: 0,
    restaurant: 0,
    sleeping: 0,
    seattle: 0,
  };
  for (const e of buildSearchIndex()) out[e.kind] += 1;
  return out;
}

// =====================================================================
// Fuzzy match — substring + tag match. No external dep. Name hits weigh
// more than tag/description hits; multi-term queries AND together.
// =====================================================================

export interface SearchHit {
  entry: SearchEntry;
  score: number;
}

export function searchIndex(query: string, limit = 80): SearchHit[] {
  const index = buildSearchIndex();
  const q = query.trim().toLowerCase();
  if (!q) {
    return index
      .map((entry) => ({ entry, score: entry.weight }))
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }
  const terms = q.split(/\s+/).filter(Boolean);
  const hits: SearchHit[] = [];
  for (const entry of index) {
    const name = entry.name.toLowerCase();
    const region = entry.region.toLowerCase();
    const tags = entry.tags.join(' ').toLowerCase();
    const desc = entry.description.toLowerCase();
    let score = 0;
    let matchedAll = true;
    for (const t of terms) {
      const inName = name.includes(t);
      const inRegion = region.includes(t);
      const inTags = tags.includes(t);
      const inDesc = desc.includes(t);
      if (!(inName || inRegion || inTags || inDesc)) {
        matchedAll = false;
        break;
      }
      if (inName && name.startsWith(t)) score += 60; // prefix-match bonus
      else if (inName) score += 40;
      if (inRegion) score += 15;
      if (inTags) score += 12;
      if (inDesc) score += 6;
    }
    if (!matchedAll) continue;
    score += entry.weight * 0.4;
    hits.push({ entry, score });
  }
  hits.sort((a, b) => b.score - a.score);
  return hits.slice(0, limit);
}

/** Group hits by kind — overlay renders one section per non-empty group. */
export function groupHitsByKind(hits: SearchHit[]): Map<SearchKind, SearchHit[]> {
  const out = new Map<SearchKind, SearchHit[]>();
  const ORDER: SearchKind[] = [
    'page',
    'lodging',
    'hike',
    'viewpoint',
    'lake',
    'town',
    'gem',
    'activity',
    'sunset',
    'restaurant',
    'sleeping',
    'seattle',
  ];
  for (const k of ORDER) out.set(k, []);
  for (const h of hits) {
    const arr = out.get(h.entry.kind);
    if (arr) arr.push(h);
  }
  for (const [k, v] of out) if (v.length === 0) out.delete(k);
  return out;
}

export function kindLabel(k: SearchKind): string {
  switch (k) {
    case 'page': return 'Pages';
    case 'lodging': return 'Lodging';
    case 'hike': return 'Hikes';
    case 'viewpoint': return 'Viewpoints';
    case 'lake': return 'Lakes & water';
    case 'town': return 'Towns';
    case 'gem': return 'Hidden gems';
    case 'activity': return 'Activities';
    case 'sunset': return 'Top sunsets';
    case 'restaurant': return 'Kosher restaurants';
    case 'sleeping': return 'Cool sleeping';
    case 'seattle': return 'Seattle stops';
  }
}

export function kindIcon(k: SearchKind): string {
  switch (k) {
    case 'page': return '📄';
    case 'lodging': return '🏠';
    case 'hike': return '🥾';
    case 'viewpoint': return '🏞️';
    case 'lake': return '💧';
    case 'town': return '🏘️';
    case 'gem': return '💎';
    case 'activity': return '🚣';
    case 'sunset': return '🌅';
    case 'restaurant': return '🍽️';
    case 'sleeping': return '🛏️';
    case 'seattle': return '🌆';
  }
}
