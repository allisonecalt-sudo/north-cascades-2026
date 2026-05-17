/**
 * Map section — PATH-AWARE rebuild (May 17, 2026).
 *
 * Erin's ask: "do location paths of trip within that path etc — can add
 * interactive map like austria check that out."
 *
 * What this build adds over the prior GENIUS pass:
 *   1. Drive-line polylines per path A/B/C, road-aligned (not crow-flies).
 *      Rendered when a path is selected — color-matched to the path chip.
 *   2. Numbered overnight markers ("Nights 1-2") at each lodging base for the
 *      selected path. Anchored to the path's first recommended-lodging coord.
 *   3. Path chips above the map (All · A · B · C) wired to global selectedPath.
 *      Sync both ways with the home picker / nav.
 *   4. Per-pin DRAWER (right-side desktop, bottom-sheet mobile) replacing
 *      Leaflet's tiny popup. Drawer: photo + category badge + at-a-glance pills
 *      + drive matrix + "similar nearby" + deep links.
 *   5. Layer toggles + WA-20 closure polyline + clustering unchanged.
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

// ---------------------------------------------------------------------------
// Co-located pin jitter — multiple categories share the same coord (e.g.
// Diablo viewpoint + Diablo sunset both at 48.7117,-121.0911). Without offset
// the upper marker covers the lower one entirely. We jitter MARKER placement
// only — `loc.lat`/`loc.lng` are unchanged so drawer copy + drive math stay
// truthful. Jitter is deterministic per (id+type) so layout is stable on
// reload. Magnitude ≤0.0008° ≈ 80m at NC latitude, small enough to read as
// the same place when zoomed out and far enough apart to click independently
// at street zoom.
// ---------------------------------------------------------------------------
const JITTER_DEG = 0.0008;

function hashString(s: string): number {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = (h * 33) ^ s.charCodeAt(i);
  return h >>> 0;
}

function jitteredLatLng(loc: MapLocation): [number, number] {
  const seed = hashString(loc.id);
  // Two independent angles via hash bits.
  const angle = ((seed & 0xffff) / 0xffff) * Math.PI * 2;
  const mag = ((((seed >>> 16) & 0xffff) / 0xffff) * 0.5 + 0.5) * JITTER_DEG;
  return [loc.lat + Math.sin(angle) * mag, loc.lng + Math.cos(angle) * mag];
}

// ---------------------------------------------------------------------------
// Marker icon — emoji on a circular badge.
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
// Path-fade logic.
// ---------------------------------------------------------------------------
function isFaded(loc: MapLocation, path: PathId | null): boolean {
  if (path === null) return false;
  if (loc.pathAssoc === 'both') return false;
  if (path === 'A') return loc.pathAssoc === 'east';
  if (path === 'B') return false;
  if (path === 'C') return loc.pathAssoc === 'west';
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
// "Similar nearby" — same-category neighbours by straight-line.
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
    // Skip co-located entries (≤0.1 mi ~ 500ft) so we don't recommend a pin
    // that sits literally on top of the current one.
    .filter((x) => x.d > 0.1 && x.d <= 25)
    .sort((a, b) => a.d - b.d)
    .slice(0, limit)
    .map((x) => x.m);
}

// ---------------------------------------------------------------------------
// Drawer — right rail desktop, bottom sheet mobile. Singleton in <body>.
// ---------------------------------------------------------------------------
interface DrawerRefs {
  root: HTMLElement;
  body: HTMLElement;
  closeBtn: HTMLButtonElement;
  backdrop: HTMLElement;
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
  const root = h(
    'aside',
    {
      class: 'map-drawer',
      role: 'dialog',
      'aria-modal': 'false',
      'aria-label': 'Place details',
      'aria-hidden': 'true',
      tabindex: '-1',
    },
    h('div', { class: 'map-drawer__grab', 'aria-hidden': 'true' }),
    h(
      'div',
      { class: 'map-drawer__head' },
      h('span', { class: 'map-drawer__eyebrow' }, 'Place'),
      closeBtn
    ),
    body
  );
  // Backdrop for mobile tap-to-close — sits behind drawer but in front of map.
  // CSS hides it on >=900px (where drawer is a side rail and tap-outside means
  // tapping the map, which the layer-control + pin handlers own).
  const backdrop = h('div', {
    class: 'map-drawer-backdrop',
    'aria-hidden': 'true',
  });
  document.body.appendChild(backdrop);
  document.body.appendChild(root);

  closeBtn.addEventListener('click', () => closeDrawer());
  backdrop.addEventListener('click', () => closeDrawer());

  drawerRefs = { root, body, closeBtn, backdrop };
  return drawerRefs;
}

function openDrawer(
  loc: MapLocation,
  route: TripRoute | null,
  pathId: PathId | null,
  pageId: string | null
): void {
  const refs = buildDrawer();
  lastFocused = (document.activeElement as HTMLElement) ?? null;
  refs.root.setAttribute('aria-hidden', 'false');
  refs.backdrop.setAttribute('aria-hidden', 'false');
  refs.backdrop.classList.add('map-drawer-backdrop--open');
  const eyebrow = refs.root.querySelector<HTMLElement>('.map-drawer__eyebrow');
  if (eyebrow) eyebrow.textContent = TYPE_FRIENDLY[loc.type];
  refs.body.innerHTML = drawerInnerHtml(loc, route, pathId, pageId);
  refs.body.scrollTop = 0;
  refs.closeBtn.focus();
  // ESC closes drawer regardless of focus location — bound on document.
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
  lastFocused?.focus();
  lastFocused = null;
  if (docEscHandler) {
    document.removeEventListener('keydown', docEscHandler, true);
    docEscHandler = null;
  }
}

/**
 * Anchor remapper — when drawer is open on the dedicated map page, in-page
 * anchors like `#lodging` don't resolve (no #lodging section on map.html).
 * Rewrite to the cross-page equivalent (lodging.html). On the home page (or
 * any other page that already has the section), keep the in-page anchor.
 */
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
  const photo = loc.photo
    ? `<img class="map-drawer__photo" src="${escapeHtml(loc.photo.src)}" alt="${escapeHtml(loc.photo.alt)}" loading="lazy" width="640" height="280" />`
    : '';

  const style = TYPE_STYLES[loc.type];
  const badges: string[] = [];
  badges.push(
    `<span class="map-drawer__badge" style="background:${style.color}1a;color:${style.color}">${escapeHtml(style.emoji)} ${escapeHtml(TYPE_FRIENDLY[loc.type])}</span>`
  );
  if (isInPathRecommendation(loc, route)) {
    const c = route?.color ?? '#16a34a';
    badges.push(
      `<span class="map-drawer__badge map-drawer__badge--inpath" style="background:${c}1a;color:${c}">★ In your path</span>`
    );
  }
  if (pathId && isFaded(loc, pathId)) {
    badges.push(`<span class="map-drawer__badge map-drawer__badge--off">off this path</span>`);
  }

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

  const ctaList: string[] = [];
  if (loc.anchor) {
    const href = resolveAnchor(loc.anchor, pageId);
    const label = href === loc.anchor ? 'View on this page' : 'View on full page';
    ctaList.push(
      `<a class="map-drawer__cta map-drawer__cta--secondary" href="${escapeHtml(href)}">${label}</a>`
    );
  }
  if (loc.externalAnchor) {
    ctaList.push(
      `<a class="map-drawer__cta map-drawer__cta--secondary" href="${escapeHtml(loc.externalAnchor)}">Open full page</a>`
    );
  }
  const bookUrl =
    loc.meta?.lodging?.bookUrl ??
    loc.meta?.coolSleeping?.bookUrl ??
    loc.meta?.water?.operatorUrl ??
    loc.meta?.trailhead?.wtaUrl;
  if (bookUrl) {
    const label =
      loc.meta?.trailhead != null
        ? 'WTA page ↗'
        : loc.meta?.water != null
          ? 'Operator ↗'
          : 'Book ↗';
    ctaList.push(
      `<a class="map-drawer__cta map-drawer__cta--primary" href="${escapeHtml(bookUrl)}" target="_blank" rel="noopener">${label}</a>`
    );
  }
  const gmaps = `https://www.google.com/maps?q=${loc.lat},${loc.lng}`;
  ctaList.push(
    `<a class="map-drawer__cta map-drawer__cta--secondary" href="${escapeHtml(gmaps)}" target="_blank" rel="noopener">Google Maps ↗</a>`
  );

  return `
    ${photo}
    <h2 class="map-drawer__title">${safeName}</h2>
    <p class="map-drawer__context">${safeContext}</p>
    <div class="map-drawer__badges">${badges.join('')}</div>
    ${meta}
    ${drives}
    ${simHtml}
    <div class="map-drawer__ctas">${ctaList.join('')}</div>
  `;
}

function drawerMetaHtml(loc: MapLocation): string {
  if (loc.meta?.lodging) {
    const m = loc.meta.lodging;
    return rowsHtml([
      ['Beds', m.beds],
      ['Price', m.priceTier],
      ['Kitchen', m.kitchen ?? '—'],
    ]);
  }
  if (loc.meta?.trailhead) {
    const m = loc.meta.trailhead;
    return rowsHtml([
      ['Miles', m.mileage],
      ['Climb', m.elevation],
      ['Effort', m.difficulty],
    ]);
  }
  if (loc.meta?.viewpoint) {
    const m = loc.meta.viewpoint;
    return rowsHtml([
      ['Where', m.mileMarker],
      ['Best', m.bestTime],
    ]);
  }
  if (loc.meta?.sunset) {
    const m = loc.meta.sunset;
    const rows: Array<[string, string]> = [
      ['Rank', `#${m.rank} of 7`],
      ['Faces', m.viewDirection],
      ['Paths', m.bestByPath],
    ];
    if (m.fromLodgingNote) rows.push(['Note', m.fromLodgingNote]);
    return rowsHtml(rows);
  }
  if (loc.meta?.water) {
    const m = loc.meta.water;
    const rows: Array<[string, string]> = [
      ['Cost', m.cost],
      ['Time', m.time],
    ];
    if (m.operator) rows.push(['Via', m.operator]);
    return rowsHtml(rows);
  }
  if (loc.meta?.coolSleeping) {
    const m = loc.meta.coolSleeping;
    const rows: Array<[string, string]> = [
      ['Access', m.access],
      ['Beds', m.beds],
      ['Price', m.priceTier],
    ];
    if (m.bookingNote) rows.push(['Note', m.bookingNote]);
    return rowsHtml(rows);
  }
  if (loc.meta?.town) {
    return rowsHtml([['Role', loc.meta.town.role]]);
  }
  if (loc.meta?.airport) {
    const m = loc.meta.airport;
    return rowsHtml([
      ['Code', m.code],
      ['NYC nonstop', m.nonstopFromNyc ? 'Yes (Alaska)' : 'Connection required'],
    ]);
  }
  return '';
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
  if (loc.meta?.lodging?.drive?.length) {
    const rows = loc.meta.lodging.drive
      .map(
        (d) =>
          `<li class="map-drawer__drive-row"><span class="map-drawer__drive-to">${escapeHtml(d.to)}</span><span class="map-drawer__drive-time">${d.minutes} min · ${d.miles} mi</span></li>`
      )
      .join('');
    return `<div class="map-drawer__drives">
      <h3 class="map-drawer__section-title">Drive from this base</h3>
      <ul class="map-drawer__drive-list">${rows}</ul>
    </div>`;
  }
  const westCoord = { lat: 48.5316, lng: -121.4448 };
  const eastCoord = { lat: 48.476, lng: -120.1859 };
  const westMiles = distMiles(westCoord, loc) * 1.6;
  const eastMiles = distMiles(eastCoord, loc) * 1.6;
  const westMin = Math.round((westMiles / 38) * 60);
  const eastMin = Math.round((eastMiles / 38) * 60);
  return `<div class="map-drawer__drives">
    <h3 class="map-drawer__section-title">Drive (approx)</h3>
    <ul class="map-drawer__drive-list">
      <li class="map-drawer__drive-row"><span class="map-drawer__drive-to">From west base (Marblemount)</span><span class="map-drawer__drive-time">~${westMin} min · ~${Math.round(westMiles)} mi</span></li>
      <li class="map-drawer__drive-row"><span class="map-drawer__drive-to">From east base (Winthrop)</span><span class="map-drawer__drive-time">~${eastMin} min · ~${Math.round(eastMiles)} mi</span></li>
    </ul>
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
// Legend.
// ---------------------------------------------------------------------------
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
    div.innerHTML = `<details class="map-legend__details"><summary class="map-legend__summary">Legend</summary><ul class="map-legend__list">${items}</ul></details>`;
    L.DomEvent.disableClickPropagation(div);
    L.DomEvent.disableScrollPropagation(div);
    return div;
  };
  return legend;
}

// ---------------------------------------------------------------------------
// Path chips — wired to selectedPath state.
// ---------------------------------------------------------------------------
function buildPathChips(): HTMLElement {
  const wrap = h('div', { class: 'map-pathchips', role: 'group', 'aria-label': 'Filter map by trip path' });
  const make = (id: PathId | null, label: string, color: string): HTMLButtonElement => {
    const btn = h(
      'button',
      {
        type: 'button',
        class: 'map-pathchip',
        'data-path': id ?? 'all',
        style: id ? `--chip-color:${color}` : `--chip-color:#6b7280`,
      },
      label
    ) as HTMLButtonElement;
    btn.addEventListener('click', () => setSelectedPath(id));
    return btn;
  };
  wrap.append(
    make(null, 'All', '#6b7280'),
    make('A', 'Path A · West', TRIP_ROUTES.A.color),
    make('B', 'Path B · Both', TRIP_ROUTES.B.color),
    make('C', 'Path C · East', TRIP_ROUTES.C.color)
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
  /** Force the canvas tall on dedicated map page. */
  tall?: boolean;
  /** Override the section title. */
  title?: string;
  /** Override the gist bullets. */
  gist?: string[];
  /**
   * Page identifier — used to rewrite in-page anchors in the drawer to
   * cross-page links when the map is rendered on its dedicated page. e.g. on
   * map.html, `#lodging` (in-page anchor) is rewritten to `lodging.html#…`.
   * On the home page (default), in-page anchors stay as-is.
   */
  pageId?: string;
}

export function renderMap(opts: RenderMapOptions = {}): HTMLElement {
  fixDefaultIconPaths();

  const mapEl = h('div', {
    class: opts.tall ? 'map-canvas map-canvas--tall' : 'map-canvas',
    'aria-label': 'Trip overview map',
  });
  const pathChips = buildPathChips();

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
    mapEl
  );

  let pathLayerGroup: L.LayerGroup | null = null;

  // Page-scoped data attribute so the singleton similar-button handler at the
  // bottom of this module knows which page issued the drawer. Necessary because
  // the drawer lives in <body> and outlives any single render.
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

    // FAIL-LOUD: surface any locations missing lat/lng.
    const bad = MAP_LOCATIONS.filter(
      (l) => !Number.isFinite(l.lat) || !Number.isFinite(l.lng) || l.lat === 0 || l.lng === 0
    );
    if (bad.length > 0) {
      console.warn('[map] dropped locations missing lat/lng:', bad.map((l) => l.id));
      const banner = h(
        'p',
        { class: 'map-fail-loud' },
        `Heads-up: ${bad.length} location(s) missing coordinates — they will not appear on the map. IDs: ${bad.map((l) => l.id).join(', ')}`
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
        openDrawer(loc, route, cur, opts.pageId ?? null);
      });
      marker.bindTooltip(loc.name, { direction: 'top', offset: [0, -10] });
      const group = layerByType.get(loc.type);
      if (group) group.addLayer(marker);
      return { marker, loc };
    });

    const closureGroup = L.layerGroup([closure]);

    for (const group of layerByType.values()) group.addTo(map);
    closureGroup.addTo(map);

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
          if (nearest) openDrawer(nearest.e.loc, route, path, opts.pageId ?? null);
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

    // Cluster spiderfy detaches/reattaches child marker DOM — the path-fade
    // classes set by applyPathFilter live on those elements and get lost when
    // children re-render. Re-apply on every spiderfy/unspiderfy/animationend.
    for (const group of layerByType.values()) {
      // Only cluster groups emit `spiderfied` / `unspiderfied` / `animationend`.
      // L.LayerGroup doesn't, but `on` ignores unknown events safely.
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
    // After CSS settles, invalidate AND refit — the initial fitBounds runs
    // inside requestAnimationFrame and can compute against a 0-width canvas
    // when the parent flex layout hasn't finished.
    setTimeout(() => {
      map.invalidateSize();
      const cur = getSelectedPath();
      if (!cur) {
        map.fitBounds(bounds, { padding: [30, 30] });
      }
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

// Delegated handler — "Similar nearby" buttons in the drawer reopen the
// drawer with the clicked location. Reads page context from the body data
// attribute so anchor rewriting is consistent with the originating render.
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
  openDrawer(loc, route, cur, pageId);
});
