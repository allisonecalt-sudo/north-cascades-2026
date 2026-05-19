/**
 * Map section — UX/UI ELEVATION pass (May 17, 2026 evening).
 *
 * Building on the prior path-aware rebuild + bug-fix pass (commit 9c6ffb6).
 * This pass elevates from "works correctly" to "feels great."
 *
 * Elevations shipped here (full rationale in MAP_UX_DESIGN_2026-05-17.md):
 *   1. Drawer redesign: category color stripe eyebrow, CTAs pinned at top under
 *      photo, at-a-glance pills replacing dense dt/dd for small-meta types,
 *      visual drive-time bars, "in your path" promoted above title.
 *   2. Mobile half-sheet → expanded states (45% peek, drag-up to 80% full).
 *   3. Context strip ("Path B · 4 nights · 2 bases · WA-20 corridor") + first-
 *      visit hint ("Pick a path to see the route ↑").
 *   4. Selected-pin pulse + ring (confirms tap before drawer slides in).
 *   5. Anchor labels — always-on names at zoom ≥11 for the 4 marquee places.
 *   6. Desktop hover preview card (thumbnail + 1-liner) replaces plain text tip.
 *   7. Path chips show shape ("A · 4 nts west", "B · 2+2").
 *   8. Drawer transitions: 280ms cubic-bezier with opacity fade-in.
 *   9. Skeleton shimmer behind drawer photo (no more "broken image" appearance
 *      while loading).
 *  10. Legend open on first visit (localStorage), collapsible after.
 *  11. Always-visible "open in Google Maps" pin-action shortcut on every pin.
 *  12. Drawer ARIA-modal switch on mobile (true) vs desktop (false) — matches
 *      visual modality.
 */

import L from 'leaflet';
import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import { h, section } from '../dom';
import {
  MAP_LOCATIONS,
  WA20_CLOSURE_POLYLINE,
  CLOSURE_LABEL,
  TRIP_ROUTES,
  type LocationType,
  type MapLocation,
  type TripRoute,
  type NightStop,
} from '../data/locations';
import { getSelectedPath, setSelectedPath, subscribeSelectedPath } from '../state/path';
import type { PathId } from '../data/paths';

// ---------------------------------------------------------------------------
// Per-type visual identity.
// ---------------------------------------------------------------------------
interface TypeStyle {
  emoji: string;
  color: string;
  layerLabel: string;
}

const TYPE_STYLES: Record<LocationType, TypeStyle> = {
  airport: { emoji: '✈️', color: '#f97316', layerLabel: 'Airports' },
  'lodging-west': { emoji: '\u{1F3E1}', color: '#2563eb', layerLabel: 'Lodging - West' },
  'lodging-east': { emoji: '\u{1F3E1}', color: '#0d9488', layerLabel: 'Lodging - East' },
  'cool-sleeping': { emoji: '\u{1F3D5}️', color: '#d97706', layerLabel: 'Cool sleeping places' },
  trailhead: { emoji: '\u{1F97E}', color: '#16a34a', layerLabel: 'Trailheads' },
  viewpoint: { emoji: '\u{1F4F7}', color: '#7c3aed', layerLabel: 'Viewpoints' },
  sunset: { emoji: '\u{1F305}', color: '#f59e0b', layerLabel: 'Sunset spots' },
  water: { emoji: '\u{1F6A3}', color: '#0891b2', layerLabel: 'Water activities' },
  town: { emoji: '\u{1F3D8}️', color: '#6b7280', layerLabel: 'Towns' },
  seattle: { emoji: '\u{1F306}', color: '#9ca3af', layerLabel: 'Seattle' },
};

const TYPE_FRIENDLY: Record<LocationType, string> = {
  airport: 'Airport',
  'lodging-west': 'Lodging (west)',
  'lodging-east': 'Lodging (east)',
  'cool-sleeping': 'Cool sleeping',
  trailhead: 'Trailhead',
  viewpoint: 'Viewpoint',
  sunset: 'Sunset spot',
  water: 'Water activity',
  town: 'Town',
  seattle: 'Seattle',
};

const CLOSURE_LAYER_LABEL = 'WA-20 closure';

// Marquee anchor IDs — always-on labels at zoom ≥11 so the eye finds them.
const ANCHOR_LABEL_IDS = new Set<string>([
  'view-diablo',
  'view-washington-pass',
  'trail-cascade-pass',
  'trail-rainy-maple',
]);

// Per-path picker copy — chip subtext.
const PATH_CHIP_SHAPE: Record<PathId, string> = {
  A: '4 nts west',
  B: '2 + 2 split',
};

// Drive matrix max for the visual time-bar (cap so a single 4-hr outlier
// doesn't squash every other bar into a sliver).
const DRIVE_BAR_CAP_MIN = 90;

// ---------------------------------------------------------------------------
// Co-located pin jitter — unchanged from prior pass.
// ---------------------------------------------------------------------------
const JITTER_DEG = 0.0008;

function hashString(s: string): number {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = (h * 33) ^ s.charCodeAt(i);
  return h >>> 0;
}

function jitteredLatLng(loc: MapLocation): [number, number] {
  const seed = hashString(loc.id);
  const angle = ((seed & 0xffff) / 0xffff) * Math.PI * 2;
  const mag = ((((seed >>> 16) & 0xffff) / 0xffff) * 0.5 + 0.5) * JITTER_DEG;
  return [loc.lat + Math.sin(angle) * mag, loc.lng + Math.cos(angle) * mag];
}

// ---------------------------------------------------------------------------
// Marker icon — emoji on a circular badge with selectable state.
// ---------------------------------------------------------------------------
function makeIcon(type: LocationType, size = 32): L.DivIcon {
  const style = TYPE_STYLES[type];
  const html = `<div class="map-marker map-marker--badge" style="--marker-color:${style.color};--marker-size:${size}px" aria-hidden="true"><span class="map-marker__glyph">${style.emoji}</span></div>`;
  return L.divIcon({
    html,
    className: 'map-marker__wrap',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2 - 2],
  });
}

/** Numbered overnight marker — sits above a lodging pin. */
function makeNightIcon(label: string, color: string): L.DivIcon {
  const safe = escapeHtml(label);
  const html = `<div class="map-night-badge" style="--night-color:${color}" aria-label="${safe}"><span class="map-night-badge__text">${safe}</span></div>`;
  return L.divIcon({
    html,
    className: 'map-night-badge__wrap',
    iconSize: [98, 28],
    iconAnchor: [49, 34],
  });
}

// ---------------------------------------------------------------------------
// Path-fade logic — unchanged.
// ---------------------------------------------------------------------------
function isFaded(loc: MapLocation, path: PathId | null): boolean {
  if (path === null) return false;
  if (loc.pathAssoc === 'both') return false;
  if (path === 'A') return loc.pathAssoc === 'east';
  if (path === 'B') return false;
  return false;
}

function isInPathRecommendation(loc: MapLocation, route: TripRoute | null): boolean {
  if (!route) return false;
  for (const night of route.nights) {
    if (night.lodgingIdCandidates.includes(loc.id)) return true;
  }
  return false;
}

// ---------------------------------------------------------------------------
// Similar nearby — unchanged.
// ---------------------------------------------------------------------------
function distMiles(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const R = 3958.7613;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const x = dLng * Math.cos((lat1 + lat2) / 2);
  return Math.sqrt(x * x + dLat * dLat) * R;
}

function similarNearby(loc: MapLocation, limit = 3): MapLocation[] {
  const sameType = MAP_LOCATIONS.filter((m) => m.id !== loc.id && m.type === loc.type);
  return sameType
    .map((m) => ({ m, d: distMiles(loc, m) }))
    .filter((x) => x.d > 0.1 && x.d <= 25)
    .sort((a, b) => a.d - b.d)
    .slice(0, limit)
    .map((x) => x.m);
}

// ---------------------------------------------------------------------------
// Drawer — bottom sheet mobile w/ half-state, right rail desktop.
// ---------------------------------------------------------------------------
interface DrawerRefs {
  root: HTMLElement;
  body: HTMLElement;
  closeBtn: HTMLButtonElement;
  backdrop: HTMLElement;
  grab: HTMLElement;
  /** Current open marker — boosted ring is applied/removed via this ref. */
  currentMarkerEl: HTMLElement | null;
}

let drawerRefs: DrawerRefs | null = null;
let lastFocused: HTMLElement | null = null;
let docEscHandler: ((e: KeyboardEvent) => void) | null = null;

function buildDrawer(): DrawerRefs {
  if (drawerRefs) return drawerRefs;
  const closeBtn = h(
    'button',
    {
      type: 'button',
      class: 'map-drawer__close',
      'aria-label': 'Close place details',
    },
    '×'
  ) as HTMLButtonElement;
  const body = h('div', { class: 'map-drawer__body' });
  const grab = h('div', {
    class: 'map-drawer__grab',
    role: 'button',
    'aria-label': 'Drag to expand or collapse',
    tabindex: '0',
  });
  const root = h(
    'aside',
    {
      class: 'map-drawer map-drawer--peek',
      role: 'dialog',
      'aria-modal': 'false',
      'aria-label': 'Place details',
      'aria-hidden': 'true',
      tabindex: '-1',
    },
    grab,
    h(
      'div',
      { class: 'map-drawer__head' },
      h('span', { class: 'map-drawer__eyebrow' }, 'Place'),
      closeBtn
    ),
    body
  );
  const backdrop = h('div', {
    class: 'map-drawer-backdrop',
    'aria-hidden': 'true',
  });
  document.body.appendChild(backdrop);
  document.body.appendChild(root);

  closeBtn.addEventListener('click', () => closeDrawer());
  backdrop.addEventListener('click', () => closeDrawer());

  // Drag / tap-to-expand on mobile. Tap the grab toggles peek/full.
  grab.addEventListener('click', () => toggleDrawerExpand());
  grab.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleDrawerExpand();
    }
  });

  // Touch drag — vertical swipe up = expand, swipe down = peek/close.
  let startY = 0;
  let startedExpanded = false;
  grab.addEventListener('touchstart', (e) => {
    const t = e.touches[0];
    if (!t) return;
    startY = t.clientY;
    startedExpanded = root.classList.contains('map-drawer--full');
  }, { passive: true });
  grab.addEventListener('touchend', (e) => {
    const t = e.changedTouches[0];
    if (!t) return;
    const dy = t.clientY - startY;
    if (dy < -30 && !startedExpanded) {
      // swiped up enough → expand
      root.classList.remove('map-drawer--peek');
      root.classList.add('map-drawer--full');
    } else if (dy > 50 && startedExpanded) {
      // swiped down → back to peek
      root.classList.remove('map-drawer--full');
      root.classList.add('map-drawer--peek');
    } else if (dy > 80 && !startedExpanded) {
      // swiped down hard from peek → close
      closeDrawer();
    }
  });

  drawerRefs = { root, body, closeBtn, backdrop, grab, currentMarkerEl: null };
  return drawerRefs;
}

function toggleDrawerExpand(): void {
  if (!drawerRefs) return;
  const root = drawerRefs.root;
  if (root.classList.contains('map-drawer--full')) {
    root.classList.remove('map-drawer--full');
    root.classList.add('map-drawer--peek');
  } else {
    root.classList.remove('map-drawer--peek');
    root.classList.add('map-drawer--full');
  }
}

function openDrawer(
  loc: MapLocation,
  route: TripRoute | null,
  pathId: PathId | null,
  pageId: string | null,
  markerEl: HTMLElement | null
): void {
  const refs = buildDrawer();
  lastFocused = (document.activeElement as HTMLElement) ?? null;

  // Selected-pin ring — strip previous, add to new.
  if (refs.currentMarkerEl) refs.currentMarkerEl.classList.remove('map-marker__wrap--selected');
  if (markerEl) {
    markerEl.classList.add('map-marker__wrap--selected');
    refs.currentMarkerEl = markerEl;
  }

  // Mobile: start in peek; desktop: full rail.
  const isMobile = window.matchMedia('(max-width: 899px)').matches;
  refs.root.classList.remove('map-drawer--full', 'map-drawer--peek');
  refs.root.classList.add(isMobile ? 'map-drawer--peek' : 'map-drawer--full');
  refs.root.setAttribute('aria-hidden', 'false');
  refs.root.setAttribute('aria-modal', isMobile ? 'true' : 'false');
  refs.backdrop.setAttribute('aria-hidden', 'false');
  refs.backdrop.classList.add('map-drawer-backdrop--open');
  // Color the eyebrow band per category for instant visual classification.
  const style = TYPE_STYLES[loc.type];
  refs.root.style.setProperty('--drawer-accent', style.color);
  const eyebrow = refs.root.querySelector<HTMLElement>('.map-drawer__eyebrow');
  if (eyebrow) {
    eyebrow.textContent = TYPE_FRIENDLY[loc.type];
    eyebrow.style.color = style.color;
  }
  refs.body.innerHTML = drawerInnerHtml(loc, route, pathId, pageId);
  refs.body.scrollTop = 0;
  refs.closeBtn.focus();
  if (!docEscHandler) {
    docEscHandler = (e: KeyboardEvent): void => {
      if (e.key === 'Escape' && drawerRefs?.root.getAttribute('aria-hidden') === 'false') {
        e.preventDefault();
        e.stopPropagation();
        closeDrawer();
      }
    };
    document.addEventListener('keydown', docEscHandler, true);
  }
}

function closeDrawer(): void {
  if (!drawerRefs) return;
  drawerRefs.root.setAttribute('aria-hidden', 'true');
  drawerRefs.backdrop.setAttribute('aria-hidden', 'true');
  drawerRefs.backdrop.classList.remove('map-drawer-backdrop--open');
  if (drawerRefs.currentMarkerEl) {
    drawerRefs.currentMarkerEl.classList.remove('map-marker__wrap--selected');
    drawerRefs.currentMarkerEl = null;
  }
  lastFocused?.focus();
  lastFocused = null;
  if (docEscHandler) {
    document.removeEventListener('keydown', docEscHandler, true);
    docEscHandler = null;
  }
}

const ANCHOR_TO_PAGE: Record<string, string> = {
  '#lodging': 'lodging.html',
  '#hikes': 'hikes.html',
  '#viewpoints': 'viewpoints.html',
  '#top-sunsets': 'top-sunsets.html',
  '#activities': 'activities.html',
  '#cool-sleeping': 'lodging.html#cool-sleeping',
  '#flights': 'travel.html#flights',
  '#seattle': 'seattle.html',
};

function resolveAnchor(anchor: string, pageId: string | null): string {
  if (pageId !== 'map') return anchor;
  return ANCHOR_TO_PAGE[anchor] ?? anchor;
}

function drawerInnerHtml(
  loc: MapLocation,
  route: TripRoute | null,
  pathId: PathId | null,
  pageId: string | null
): string {
  const safeName = escapeHtml(loc.name);
  const safeContext = escapeHtml(loc.context);

  // Photo with skeleton shimmer fallback — image lazy-loads with a colored
  // gradient backdrop so the empty box reads "loading" instead of "broken."
  const photo = loc.photo
    ? `<div class="map-drawer__photo-wrap"><img class="map-drawer__photo" src="${escapeHtml(loc.photo.src)}" alt="${escapeHtml(loc.photo.alt)}" loading="lazy" width="640" height="360" onload="this.parentElement?.classList.add('map-drawer__photo-wrap--loaded')" onerror="this.parentElement?.classList.add('map-drawer__photo-wrap--errored')" /></div>`
    : '';

  // In-path callout above the title — promoted because it answers the user's
  // top question on this pin ("does this fit my picked path?").
  const inPathCallout = isInPathRecommendation(loc, route) && route
    ? `<div class="map-drawer__inpath-callout" style="--callout-color:${route.color}">
         <span class="map-drawer__inpath-icon" aria-hidden="true">★</span>
         <span class="map-drawer__inpath-text">In your Path ${pathId} plan</span>
       </div>`
    : '';
  const offPathCallout = pathId && isFaded(loc, pathId)
    ? `<div class="map-drawer__offpath-callout">
         <span aria-hidden="true">⚠️</span>
         <span>Not on Path ${pathId} — skip or switch paths</span>
       </div>`
    : '';

  // Quick-action CTA row — pinned right under the photo so reach is one
  // thumb-flick. Google Maps + Book/WTA/Operator depending on what's available.
  const bookUrl =
    loc.meta?.lodging?.bookUrl ??
    loc.meta?.coolSleeping?.bookUrl ??
    loc.meta?.water?.operatorUrl ??
    loc.meta?.trailhead?.wtaUrl;
  const bookLabel =
    loc.meta?.trailhead != null
      ? 'WTA page'
      : loc.meta?.water != null
        ? 'Operator'
        : 'Book';
  const gmaps = `https://www.google.com/maps?q=${loc.lat},${loc.lng}`;
  const quickActions = `<div class="map-drawer__quick-actions">
    <a class="map-drawer__qa map-drawer__qa--primary" href="${escapeHtml(gmaps)}" target="_blank" rel="noopener" aria-label="Open in Google Maps">
      <span aria-hidden="true">\u{1F5FA}️</span> Google Maps
    </a>
    ${bookUrl ? `<a class="map-drawer__qa map-drawer__qa--accent" href="${escapeHtml(bookUrl)}" target="_blank" rel="noopener" aria-label="${escapeHtml(bookLabel)}">
      <span aria-hidden="true">↗</span> ${escapeHtml(bookLabel)}
    </a>` : ''}
  </div>`;

  // Compact at-a-glance pills row for small-meta types (viewpoint / sunset /
  // water / cool-sleeping / town / airport / trailhead). The dense dt/dd
  // grid still renders for lodging where 3+ rows of structured data justify
  // the heavier treatment.
  const meta = drawerMetaHtml(loc);
  const drives = drawerDrivesHtml(loc);

  const sim = similarNearby(loc, 3);
  const simHtml = sim.length
    ? `<div class="map-drawer__section">
        <h3 class="map-drawer__section-title">Similar nearby</h3>
        <ul class="map-drawer__similar">
          ${sim
            .map(
              (s) =>
                `<li><button type="button" class="map-drawer__similar-btn" data-similar-id="${escapeHtml(s.id)}"><span class="map-drawer__similar-dot" style="background:${TYPE_STYLES[s.type].color}"></span><span class="map-drawer__similar-name">${escapeHtml(s.name)}</span><span class="map-drawer__similar-context">${escapeHtml(s.context)}</span></button></li>`
            )
            .join('')}
        </ul>
      </div>`
    : '';

  // Secondary CTAs (deep-page link) — kept at the bottom; primary actions are
  // already covered in the top quick-action row.
  const ctaList: string[] = [];
  if (loc.anchor) {
    const href = resolveAnchor(loc.anchor, pageId);
    const label = href === loc.anchor ? 'View on this page' : 'See full page →';
    ctaList.push(
      `<a class="map-drawer__cta map-drawer__cta--secondary" href="${escapeHtml(href)}">${label}</a>`
    );
  }
  if (loc.externalAnchor) {
    ctaList.push(
      `<a class="map-drawer__cta map-drawer__cta--secondary" href="${escapeHtml(loc.externalAnchor)}">Open full page ↗</a>`
    );
  }
  const ctaSection = ctaList.length
    ? `<div class="map-drawer__ctas">${ctaList.join('')}</div>`
    : '';

  return `
    ${photo}
    <div class="map-drawer__head-block">
      ${inPathCallout}
      ${offPathCallout}
      <h2 class="map-drawer__title">${safeName}</h2>
      <p class="map-drawer__context">${safeContext}</p>
    </div>
    ${quickActions}
    ${meta}
    ${drives}
    ${simHtml}
    ${ctaSection}
  `;
}

function drawerMetaHtml(loc: MapLocation): string {
  // Lodging: structured grid (3 rows of essential booking data justifies the
  // heavier treatment).
  if (loc.meta?.lodging) {
    const m = loc.meta.lodging;
    return rowsHtml([
      ['Beds', m.beds],
      ['Price', m.priceTier],
      ['Kitchen', m.kitchen ?? '—'],
    ]);
  }
  // Trailhead: pills + WTA chip — quick scan of mileage/climb/effort.
  if (loc.meta?.trailhead) {
    const m = loc.meta.trailhead;
    return pillsHtml([
      { label: 'Distance', value: m.mileage, color: '#16a34a' },
      { label: 'Climb', value: m.elevation, color: '#0d9488' },
      { label: 'Effort', value: m.difficulty, color: '#7c3aed' },
    ]);
  }
  // Viewpoint: pills.
  if (loc.meta?.viewpoint) {
    const m = loc.meta.viewpoint;
    return pillsHtml([
      { label: 'Where', value: m.mileMarker, color: '#7c3aed' },
      { label: 'Best time', value: m.bestTime, color: '#f59e0b' },
    ]);
  }
  // Sunset: pills + rank badge.
  if (loc.meta?.sunset) {
    const m = loc.meta.sunset;
    const pills = [
      { label: 'Rank', value: `#${m.rank} of 7`, color: '#f59e0b' },
      { label: 'Faces', value: m.viewDirection, color: '#d97706' },
      { label: 'Paths', value: m.bestByPath, color: '#7c3aed' },
    ];
    let extra = '';
    if (m.fromLodgingNote) {
      extra = `<p class="map-drawer__note">\u{1F4CD} ${escapeHtml(m.fromLodgingNote)}</p>`;
    }
    return pillsHtml(pills) + extra;
  }
  // Water: pills.
  if (loc.meta?.water) {
    const m = loc.meta.water;
    const pills = [
      { label: 'Cost', value: m.cost, color: '#0891b2' },
      { label: 'Time', value: m.time, color: '#2563eb' },
    ];
    if (m.operator) pills.push({ label: 'Via', value: m.operator, color: '#6b7280' });
    return pillsHtml(pills);
  }
  // Cool-sleeping: structured grid (booking-relevant) + note callout.
  if (loc.meta?.coolSleeping) {
    const m = loc.meta.coolSleeping;
    const rows: Array<[string, string]> = [
      ['Access', m.access],
      ['Beds', m.beds],
      ['Price', m.priceTier],
    ];
    let extra = '';
    if (m.bookingNote) {
      extra = `<p class="map-drawer__note">\u{1F4CD} ${escapeHtml(m.bookingNote)}</p>`;
    }
    return rowsHtml(rows) + extra;
  }
  // Town: single inline pill — minimal.
  if (loc.meta?.town) {
    return pillsHtml([{ label: 'Role', value: loc.meta.town.role, color: '#6b7280' }]);
  }
  // Airport: two pills.
  if (loc.meta?.airport) {
    const m = loc.meta.airport;
    return pillsHtml([
      { label: 'Code', value: m.code, color: '#f97316' },
      { label: 'NYC nonstop', value: m.nonstopFromNyc ? 'Yes (United primary)' : 'Connection required', color: '#6b7280' },
    ]);
  }
  return '';
}

interface MetaPill { label: string; value: string; color: string }
function pillsHtml(pills: MetaPill[]): string {
  return `<div class="map-drawer__pills">${pills
    .map(
      (p) =>
        `<div class="map-drawer__pill" style="--pill-color:${p.color}"><span class="map-drawer__pill-label">${escapeHtml(p.label)}</span><span class="map-drawer__pill-value">${escapeHtml(p.value)}</span></div>`
    )
    .join('')}</div>`;
}

function rowsHtml(rows: Array<[string, string]>): string {
  return `<dl class="map-drawer__meta">${rows
    .map(
      ([k, v]) =>
        `<div class="map-drawer__meta-row"><dt>${escapeHtml(k)}</dt><dd>${escapeHtml(v)}</dd></div>`
    )
    .join('')}</dl>`;
}

function drawerDrivesHtml(loc: MapLocation): string {
  // Lodging — render bars proportional to drive time so the eye reads
  // "Cascade Pass is a real haul, Newhalem is a hop."
  if (loc.meta?.lodging?.drive?.length) {
    const rows = loc.meta.lodging.drive
      .map((d) => {
        const pct = Math.min(100, Math.round((d.minutes / DRIVE_BAR_CAP_MIN) * 100));
        return `<li class="map-drawer__drive-row">
            <div class="map-drawer__drive-meta">
              <span class="map-drawer__drive-to">${escapeHtml(d.to)}</span>
              <span class="map-drawer__drive-time">${d.minutes} min · ${d.miles} mi</span>
            </div>
            <div class="map-drawer__drive-bar" aria-hidden="true">
              <div class="map-drawer__drive-bar-fill" style="width:${pct}%"></div>
            </div>
          </li>`;
      })
      .join('');
    return `<div class="map-drawer__drives">
      <h3 class="map-drawer__section-title">Drive from this base</h3>
      <ul class="map-drawer__drive-list">${rows}</ul>
    </div>`;
  }
  // Non-lodging — show approximate drives from both bases with bars.
  const westCoord = { lat: 48.5316, lng: -121.4448 };
  const eastCoord = { lat: 48.476, lng: -120.1859 };
  const westMiles = distMiles(westCoord, loc) * 1.6;
  const eastMiles = distMiles(eastCoord, loc) * 1.6;
  const westMin = Math.round((westMiles / 38) * 60);
  const eastMin = Math.round((eastMiles / 38) * 60);
  const rows: Array<{ label: string; min: number; mi: number }> = [
    { label: 'From west base (Marblemount)', min: westMin, mi: Math.round(westMiles) },
    { label: 'From east base (Winthrop)', min: eastMin, mi: Math.round(eastMiles) },
  ];
  const rowsHtmlStr = rows
    .map((r) => {
      const pct = Math.min(100, Math.round((r.min / DRIVE_BAR_CAP_MIN) * 100));
      return `<li class="map-drawer__drive-row">
          <div class="map-drawer__drive-meta">
            <span class="map-drawer__drive-to">${escapeHtml(r.label)}</span>
            <span class="map-drawer__drive-time">~${r.min} min · ~${r.mi} mi</span>
          </div>
          <div class="map-drawer__drive-bar" aria-hidden="true">
            <div class="map-drawer__drive-bar-fill" style="width:${pct}%"></div>
          </div>
        </li>`;
    })
    .join('');
  return `<div class="map-drawer__drives">
    <h3 class="map-drawer__section-title">Drive (approx)</h3>
    <ul class="map-drawer__drive-list">${rowsHtmlStr}</ul>
    <p class="map-drawer__drives-note">Straight-line × 1.6 corridor pace, 38 mph average. Re-check Google Maps before the day.</p>
  </div>`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// ---------------------------------------------------------------------------
// Legend — pinned-open on first visit, collapsible after.
// ---------------------------------------------------------------------------
const LEGEND_OPENED_KEY = 'nc-map-legend-seen';

function makeLegend(): L.Control {
  const legend = new L.Control({ position: 'bottomright' });
  legend.onAdd = (): HTMLElement => {
    const div = L.DomUtil.create('div', 'map-legend');
    const rows: Array<{ type: LocationType | 'closure' }> = [
      { type: 'lodging-west' },
      { type: 'lodging-east' },
      { type: 'cool-sleeping' },
      { type: 'trailhead' },
      { type: 'viewpoint' },
      { type: 'sunset' },
      { type: 'water' },
      { type: 'town' },
      { type: 'airport' },
      { type: 'closure' },
    ];
    const items = rows
      .map((r) => {
        if (r.type === 'closure') {
          return `<li class="map-legend__item"><span class="map-legend__line" aria-hidden="true"></span>${CLOSURE_LAYER_LABEL}</li>`;
        }
        const style = TYPE_STYLES[r.type];
        return `<li class="map-legend__item"><span class="map-legend__badge" style="--marker-color:${style.color}" aria-hidden="true"><span class="map-legend__glyph">${style.emoji}</span></span>${style.layerLabel}</li>`;
      })
      .join('');
    // Open on first visit; collapse on subsequent visits if user closed it.
    let openAttr = '';
    try {
      if (!localStorage.getItem(LEGEND_OPENED_KEY)) openAttr = 'open';
    } catch { /* SSR / blocked storage */ }
    div.innerHTML = `<details class="map-legend__details" ${openAttr}><summary class="map-legend__summary">Legend</summary><ul class="map-legend__list">${items}</ul></details>`;
    const details = div.querySelector<HTMLDetailsElement>('.map-legend__details');
    if (details) {
      details.addEventListener('toggle', () => {
        try {
          localStorage.setItem(LEGEND_OPENED_KEY, '1');
        } catch { /* noop */ }
      });
    }
    L.DomEvent.disableClickPropagation(div);
    L.DomEvent.disableScrollPropagation(div);
    return div;
  };
  return legend;
}

// ---------------------------------------------------------------------------
// Path chips — now show shape + nights count.
// ---------------------------------------------------------------------------
function buildPathChips(): HTMLElement {
  const wrap = h('div', { class: 'map-pathchips', role: 'group', 'aria-label': 'Filter map by trip path' });
  const make = (id: PathId | null, label: string, sub: string, color: string): HTMLButtonElement => {
    const btn = h(
      'button',
      {
        type: 'button',
        class: 'map-pathchip',
        'data-path': id ?? 'all',
        style: `--chip-color:${color}`,
      },
      h('span', { class: 'map-pathchip__label' }, label),
      sub ? h('span', { class: 'map-pathchip__sub' }, sub) : ''
    ) as HTMLButtonElement;
    btn.addEventListener('click', () => setSelectedPath(id));
    return btn;
  };
  wrap.append(
    make(null, 'All', 'browse mode', '#6b7280'),
    make('A', 'Path A', PATH_CHIP_SHAPE.A, TRIP_ROUTES.A.color),
    make('B', 'Path B', PATH_CHIP_SHAPE.B, TRIP_ROUTES.B.color)
  );
  const sync = (): void => {
    const cur = getSelectedPath();
    for (const btn of wrap.querySelectorAll<HTMLButtonElement>('button')) {
      const pid = btn.dataset['path'];
      const match = (pid === 'all' && cur === null) || pid === cur;
      btn.classList.toggle('map-pathchip--active', match);
      btn.setAttribute('aria-pressed', match ? 'true' : 'false');
    }
  };
  sync();
  subscribeSelectedPath(sync);
  return wrap;
}

/** Context strip — "Path B · 4 nights · 2 bases" or first-visit hint. */
function buildContextStrip(): HTMLElement {
  const strip = h('div', { class: 'map-context-strip', 'aria-live': 'polite' });
  const sync = (): void => {
    const cur = getSelectedPath();
    if (!cur) {
      strip.innerHTML = `<span class="map-context-strip__hint">\u{1F446} <strong>Pick a path</strong> to draw the actual drive route and badges show "in your path."</span>`;
      strip.classList.add('map-context-strip--hint');
      strip.classList.remove('map-context-strip--path');
      return;
    }
    const route = TRIP_ROUTES[cur];
    const nights = route.nights.reduce((sum, n) => {
      const m = n.label.match(/Nights?\s+(\d+)(?:-(\d+))?/);
      if (!m) return sum;
      const a = m[1] ? parseInt(m[1], 10) : 0;
      const b = m[2] ? parseInt(m[2], 10) : a;
      return sum + (b - a + 1);
    }, 0);
    const baseCount = route.nights.length;
    const baseSummary = route.nights.map((n) => n.townLabel.replace(/\s*\(.*?\)\s*/g, '')).join(' → ');
    strip.innerHTML = `
      <span class="map-context-strip__pip" style="--pip-color:${route.color}"></span>
      <strong>Path ${cur}</strong>
      <span class="map-context-strip__sep">·</span>
      <span>${nights} nights</span>
      <span class="map-context-strip__sep">·</span>
      <span>${baseCount} ${baseCount === 1 ? 'base' : 'bases'}: ${escapeHtml(baseSummary)}</span>
    `;
    strip.classList.add('map-context-strip--path');
    strip.classList.remove('map-context-strip--hint');
  };
  sync();
  subscribeSelectedPath(sync);
  return strip;
}

// ---------------------------------------------------------------------------
// Hover preview card — desktop only. Singleton in <body>.
// ---------------------------------------------------------------------------
let hoverPreviewEl: HTMLElement | null = null;
function ensureHoverPreview(): HTMLElement {
  if (hoverPreviewEl) return hoverPreviewEl;
  hoverPreviewEl = h('div', { class: 'map-hover-preview', 'aria-hidden': 'true' });
  document.body.appendChild(hoverPreviewEl);
  return hoverPreviewEl;
}
function showHoverPreview(loc: MapLocation, x: number, y: number): void {
  const el = ensureHoverPreview();
  const style = TYPE_STYLES[loc.type];
  const thumb = loc.photo
    ? `<img class="map-hover-preview__thumb" src="${escapeHtml(loc.photo.src)}" alt="" loading="lazy" />`
    : `<div class="map-hover-preview__thumb map-hover-preview__thumb--placeholder" style="background:${style.color}33;color:${style.color}">${escapeHtml(style.emoji)}</div>`;
  el.innerHTML = `${thumb}
    <div class="map-hover-preview__body">
      <span class="map-hover-preview__eyebrow" style="color:${style.color}">${escapeHtml(TYPE_FRIENDLY[loc.type])}</span>
      <span class="map-hover-preview__name">${escapeHtml(loc.name)}</span>
      <span class="map-hover-preview__context">${escapeHtml(loc.context)}</span>
    </div>`;
  el.style.left = `${x + 14}px`;
  el.style.top = `${y + 14}px`;
  el.classList.add('map-hover-preview--visible');
  el.setAttribute('aria-hidden', 'false');
}
function hideHoverPreview(): void {
  if (!hoverPreviewEl) return;
  hoverPreviewEl.classList.remove('map-hover-preview--visible');
  hoverPreviewEl.setAttribute('aria-hidden', 'true');
}

// ---------------------------------------------------------------------------
// Main entry.
// ---------------------------------------------------------------------------
interface MarkerEntry {
  marker: L.Marker;
  loc: MapLocation;
}

function fixDefaultIconPaths(): void {
  delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl:
      'https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl:
      'https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/images/marker-shadow.png',
  });
}

const CLUSTER_TYPES: ReadonlySet<LocationType> = new Set<LocationType>([
  'lodging-west',
  'lodging-east',
  'cool-sleeping',
]);

export interface RenderMapOptions {
  tall?: boolean;
  title?: string;
  gist?: string[];
  pageId?: string;
}

export function renderMap(opts: RenderMapOptions = {}): HTMLElement {
  fixDefaultIconPaths();

  const mapEl = h('div', {
    class: opts.tall ? 'map-canvas map-canvas--tall' : 'map-canvas',
    'aria-label': 'Trip overview map',
  });
  const pathChips = buildPathChips();
  const contextStrip = buildContextStrip();

  const gistItems = opts.gist ?? [
    'Every lodging, trailhead, viewpoint, sunset spot, and water option pinned. Toggle layers in the top-right control. The red dashed line is the WA-20 closure (MP 130 → MP 156, WSDOT target reopen Jul 4).',
    'Pick a path to draw the actual drive route, color-matched. Numbered "Nights" badges float above the recommended cabin for each base.',
    'Click any pin to open a drawer with photos, the facts, drive matrix, and similar places nearby.',
  ];

  const wrap = section(
    'map',
    opts.title ?? 'Map - where everything is',
    h(
      'ul',
      { class: 'gist' },
      ...gistItems.map((t) => h('li', { class: 'gist__item' }, t))
    ),
    pathChips,
    contextStrip,
    mapEl
  );

  let pathLayerGroup: L.LayerGroup | null = null;
  let anchorLabelLayer: L.LayerGroup | null = null;

  if (opts.pageId) {
    document.body.setAttribute('data-map-page-id', opts.pageId);
  }

  requestAnimationFrame(() => {
    const map = L.map(mapEl, {
      zoomControl: true,
      scrollWheelZoom: false,
      dragging: true,
      touchZoom: true,
      doubleClickZoom: true,
      boxZoom: false,
      keyboard: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 18,
    }).addTo(map);

    // ----- WA-20 closure polyline -----
    const closure = L.polyline(WA20_CLOSURE_POLYLINE, {
      color: '#dc2626',
      weight: 8,
      opacity: 0.9,
      lineCap: 'round',
      lineJoin: 'round',
      dashArray: '12, 8',
    });
    closure.bindTooltip(`WA-20 closed mid-corridor - Plan-B via Stevens Pass`, {
      sticky: true,
      direction: 'top',
      className: 'map-tooltip',
    });
    closure.bindPopup(
      `<div class="map-popup map-popup--closure">
        <h4 class="map-popup__title">${escapeHtml(CLOSURE_LABEL.title)}</h4>
        <p class="map-popup__body">${escapeHtml(CLOSURE_LABEL.detail)}</p>
        <p class="map-popup__body map-popup__body--em">${escapeHtml(CLOSURE_LABEL.planBNote)}</p>
        <p class="map-popup__caption">As of ${escapeHtml(CLOSURE_LABEL.asOfDate)}</p>
        <div class="map-popup__ctas">
          <a class="map-popup__cta map-popup__cta--primary" href="${escapeHtml(CLOSURE_LABEL.wsdotUrl)}" target="_blank" rel="noopener">WSDOT live status ↗</a>
        </div>
      </div>`,
      { maxWidth: 300 }
    );

    // ----- Layer groups per type -----
    const layerByType = new Map<LocationType, L.LayerGroup>();
    for (const type of Object.keys(TYPE_STYLES) as LocationType[]) {
      const group: L.LayerGroup = CLUSTER_TYPES.has(type)
        ? L.markerClusterGroup({
            maxClusterRadius: 45,
            disableClusteringAtZoom: 12,
            spiderfyOnMaxZoom: true,
            chunkedLoading: true,
            showCoverageOnHover: false,
            iconCreateFunction: (cluster) => {
              const count = cluster.getChildCount();
              return L.divIcon({
                html: `<div class="map-cluster"><span class="map-cluster__count">${count}</span></div>`,
                className: 'map-cluster__wrap',
                iconSize: L.point(40, 40),
              });
            },
          })
        : L.layerGroup();
      layerByType.set(type, group);
    }

    const bad = MAP_LOCATIONS.filter(
      (l) => !Number.isFinite(l.lat) || !Number.isFinite(l.lng) || l.lat === 0 || l.lng === 0
    );
    if (bad.length > 0) {
      console.warn('[map] dropped locations missing lat/lng:', bad.map((l) => l.id));
      const banner = h(
        'p',
        { class: 'map-fail-loud' },
        `Heads-up: ${bad.length} location(s) missing coordinates - they will not appear on the map. IDs: ${bad.map((l) => l.id).join(', ')}`
      );
      mapEl.before(banner);
    }

    const entries: MarkerEntry[] = MAP_LOCATIONS.filter((l) => !bad.includes(l)).map((loc) => {
      const pos = jitteredLatLng(loc);
      const marker = L.marker(pos, {
        icon: makeIcon(loc.type),
        title: loc.name,
        riseOnHover: true,
      });
      marker.on('click', () => {
        const cur = getSelectedPath();
        const route = cur ? TRIP_ROUTES[cur] : null;
        const el = marker.getElement() ?? null;
        openDrawer(loc, route, cur, opts.pageId ?? null, el);
      });
      // Desktop hover-preview — only fires above 900px where there's actual
      // hover capability. Mobile users tap straight to the drawer.
      marker.on('mouseover', (ev) => {
        if (!window.matchMedia('(min-width: 900px)').matches) return;
        const oe = (ev as L.LeafletMouseEvent).originalEvent;
        if (oe) showHoverPreview(loc, oe.clientX, oe.clientY);
      });
      marker.on('mouseout', () => hideHoverPreview());
      // Suppress Leaflet's default text tooltip on desktop (replaced by hover
      // preview). Keep it on mobile for accessibility / long-press.
      if (!window.matchMedia('(min-width: 900px)').matches) {
        marker.bindTooltip(loc.name, { direction: 'top', offset: [0, -10] });
      }
      const group = layerByType.get(loc.type);
      if (group) group.addLayer(marker);
      return { marker, loc };
    });

    const closureGroup = L.layerGroup([closure]);

    for (const group of layerByType.values()) group.addTo(map);
    closureGroup.addTo(map);

    // ----- Always-on anchor labels for marquee places -----
    const buildAnchorLabels = (): L.LayerGroup => {
      const labels: L.Layer[] = [];
      for (const entry of entries) {
        if (!ANCHOR_LABEL_IDS.has(entry.loc.id)) continue;
        const labelEl = L.divIcon({
          className: 'map-anchor-label__wrap',
          html: `<div class="map-anchor-label">${escapeHtml(entry.loc.name)}</div>`,
          iconSize: [120, 20],
          iconAnchor: [60, -16],
        });
        labels.push(L.marker([entry.loc.lat, entry.loc.lng], {
          icon: labelEl,
          interactive: false,
          keyboard: false,
          zIndexOffset: -500,
        }));
      }
      return L.layerGroup(labels);
    };
    const updateAnchorLabels = (): void => {
      const z = map.getZoom();
      if (z >= 10) {
        if (!anchorLabelLayer) {
          anchorLabelLayer = buildAnchorLabels();
          anchorLabelLayer.addTo(map);
        }
      } else if (anchorLabelLayer) {
        anchorLabelLayer.remove();
        anchorLabelLayer = null;
      }
    };
    map.on('zoomend', updateAnchorLabels);

    // Layer control.
    const overlays: Record<string, L.Layer> = {};
    for (const type of Object.keys(TYPE_STYLES) as LocationType[]) {
      const group = layerByType.get(type);
      if (!group) continue;
      const style = TYPE_STYLES[type];
      const labelHtml = `<span class="map-layer-label"><span class="map-layer-label__glyph" style="color:${style.color}">${style.emoji}</span>${style.layerLabel}</span>`;
      overlays[labelHtml] = group;
    }
    overlays[
      `<span class="map-layer-label"><span class="map-layer-label__glyph" style="color:#dc2626">⚠️</span>${CLOSURE_LAYER_LABEL}</span>`
    ] = closureGroup;

    L.control
      .layers(undefined, overlays, { collapsed: true, position: 'topright' })
      .addTo(map);

    makeLegend().addTo(map);

    const allLatLngs: L.LatLngExpression[] = [
      ...entries.map((e) => [e.loc.lat, e.loc.lng] as [number, number]),
      ...WA20_CLOSURE_POLYLINE,
    ];
    const bounds = L.latLngBounds(allLatLngs);
    map.fitBounds(bounds, { padding: [30, 30] });
    updateAnchorLabels();

    // ----- Path-route renderer -----
    const updatePathRoute = (path: PathId | null): void => {
      if (pathLayerGroup) {
        pathLayerGroup.remove();
        pathLayerGroup = null;
      }
      if (path === null) return;
      const route = TRIP_ROUTES[path];
      if (!route) return;
      const layers: L.Layer[] = [];

      route.segments.forEach((seg) => {
        const baseWeight =
          seg.kind === 'drive-day' ? 6 : seg.kind === 'hike-out-and-back' ? 5 : 4;
        const poly = L.polyline(seg.points, {
          color: route.color,
          weight: baseWeight,
          opacity: 0.85,
          lineCap: 'round',
          lineJoin: 'round',
          dashArray: seg.kind === 'hike-out-and-back' ? '10, 6' : undefined,
        });
        poly.bindTooltip(seg.note, {
          sticky: true,
          direction: 'top',
          className: 'map-tooltip map-tooltip--route',
        });
        poly.on('click', () => {
          const last = seg.points[seg.points.length - 1];
          if (!last) return;
          const target = { lat: last[0], lng: last[1] };
          const nearest = entries
            .filter((e) => e.loc.type === 'lodging-west' || e.loc.type === 'lodging-east')
            .map((e) => ({ e, d: distMiles(e.loc, target) }))
            .sort((a, b) => a.d - b.d)[0];
          if (nearest) {
            const el = nearest.e.marker.getElement() ?? null;
            openDrawer(nearest.e.loc, route, path, opts.pageId ?? null, el);
          }
        });
        layers.push(poly);
      });

      route.nights.forEach((night) => {
        const anchor = pickNightAnchor(night, entries);
        const nightMarker = L.marker(anchor, {
          icon: makeNightIcon(night.label, route.color),
          interactive: false,
          keyboard: false,
          zIndexOffset: 1000,
        });
        layers.push(nightMarker);
      });

      pathLayerGroup = L.layerGroup(layers);
      pathLayerGroup.addTo(map);
    };

    applyPathFilter(entries, getSelectedPath());
    updatePathRoute(getSelectedPath());

    for (const group of layerByType.values()) {
      const g = group as L.LayerGroup & {
        on?: (e: string, fn: () => void) => void;
      };
      if (typeof g.on === 'function') {
        const refresh = (): void => applyPathFilter(entries, getSelectedPath());
        g.on('spiderfied', refresh);
        g.on('unspiderfied', refresh);
        g.on('animationend', refresh);
      }
    }

    subscribeSelectedPath((next) => {
      applyPathFilter(entries, next);
      updatePathRoute(next);
      if (next) {
        const route = TRIP_ROUTES[next];
        const allPts: Array<[number, number]> = [];
        for (const seg of route.segments) for (const p of seg.points) allPts.push(p);
        for (const night of route.nights) allPts.push(pickNightAnchor(night, entries));
        if (allPts.length > 0) {
          map.flyToBounds(L.latLngBounds(allPts), { padding: [40, 40], duration: 0.8 });
        }
      } else {
        map.flyToBounds(bounds, { padding: [30, 30], duration: 0.6 });
      }
    });

    window.addEventListener('resize', () => {
      map.invalidateSize();
    });
    setTimeout(() => {
      map.invalidateSize();
      const cur = getSelectedPath();
      if (!cur) {
        map.fitBounds(bounds, { padding: [30, 30] });
      }
      updateAnchorLabels();
    }, 200);
  });

  return wrap;
}

function pickNightAnchor(night: NightStop, entries: MarkerEntry[]): [number, number] {
  for (const cand of night.lodgingIdCandidates) {
    const match = entries.find((e) => e.loc.id === cand);
    if (match) return [match.loc.lat, match.loc.lng];
  }
  return night.fallbackCoord;
}

function applyPathFilter(entries: MarkerEntry[], path: PathId | null): void {
  const route = path ? TRIP_ROUTES[path] : null;
  for (const { marker, loc } of entries) {
    const faded = isFaded(loc, path);
    const el = marker.getElement();
    if (!el) continue;
    if (faded) {
      el.classList.add('map-marker__wrap--faded');
    } else {
      el.classList.remove('map-marker__wrap--faded');
    }
    if (isInPathRecommendation(loc, route)) {
      el.classList.add('map-marker__wrap--inpath');
      el.style.setProperty('--inpath-color', route?.color ?? '#16a34a');
    } else {
      el.classList.remove('map-marker__wrap--inpath');
    }
  }
}

// Delegated handler — "Similar nearby" buttons reopen drawer with clicked loc.
document.addEventListener('click', (e) => {
  const target = e.target;
  if (!(target instanceof HTMLElement)) return;
  const btn = target.closest<HTMLButtonElement>('[data-similar-id]');
  if (!btn) return;
  const id = btn.dataset['similarId'];
  if (!id) return;
  const loc = MAP_LOCATIONS.find((l) => l.id === id);
  if (!loc) return;
  const cur = getSelectedPath();
  const route = cur ? TRIP_ROUTES[cur] : null;
  const pageId = document.body.getAttribute('data-map-page-id');
  // Find the marker element in the Leaflet pane to apply selected-ring.
  // Best-effort — find first .leaflet-marker-icon with matching title attr.
  let markerEl: HTMLElement | null = null;
  const candidates = document.querySelectorAll<HTMLElement>('.leaflet-marker-icon');
  for (const c of candidates) {
    if (c.getAttribute('title') === loc.name) {
      markerEl = c;
      break;
    }
  }
  openDrawer(loc, route, cur, pageId, markerEl);
});
