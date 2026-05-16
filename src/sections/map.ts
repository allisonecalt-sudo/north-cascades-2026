/**
 * Map section — GENIUS pass (May 17, 2026).
 *
 * Tech: Leaflet 1.9 + OpenStreetMap tiles + Leaflet.markercluster.
 *
 * Behaviors:
 *   - Layer-group toggle (top-right Leaflet control) for every type:
 *       Lodging W / Lodging E / Cool sleeping / Trailheads / Viewpoints /
 *       Sunset spots / Water / Towns / Airports / Closures.
 *   - Lodging (west + east + cool-sleeping) cluster automatically when zoomed
 *     out. Other layers render unclustered (count is low enough they don't
 *     crowd).
 *   - Custom emoji divIcons per type — distinguish at a glance without an
 *     image-asset pipeline.
 *   - Rich popups with hero photo (lazy), name, context, type-specific facts
 *     (drive matrix for lodging, mileage + WTA for trails, mile marker +
 *     best-time for viewpoints, cost + operator for water, sunset rank +
 *     view-direction for sunset spots), and CTAs (View on site + Book →).
 *   - Path filter integration — off-path markers fade to opacity 0.25 +
 *     shrink, on-path markers full-size full-opacity. Compare-all = all full.
 *   - WA-20 closure polyline polished: thick (weight 8) red dashed line,
 *     hover tooltip, click popup with WSDOT live link + as-of date +
 *     Plan-B note.
 *   - Mobile-aware — pinch zoom + pan default, popups max-width 300px so
 *     they fit on a 412 px viewport. Layer control sits top-right, away
 *     from the legend.
 *
 * Leaflet best-practices applied (researched May 17, 2026):
 *   - scrollWheelZoom disabled → avoid scroll-jacking on long page.
 *   - divIcons with explicit iconSize/anchor/popupAnchor → markers render
 *     correctly at any zoom and popups don't overlap the pin.
 *   - L.control.layers({}, overlays) — base layer empty, overlays for
 *     toggleable groups. Standard pattern for type-based maps.
 *   - bindPopup with maxWidth + className → consistent popup style.
 *   - Marker clusters with maxClusterRadius 45 + chunkedLoading for perf.
 *   - invalidateSize on resize + 200ms after init (handles font/CSS shifts).
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
  type LocationType,
  type MapLocation,
} from '../data/locations';
import { getSelectedPath, subscribeSelectedPath } from '../state/path';
import type { PathId } from '../data/paths';

// ---------------------------------------------------------------------------
// Per-type visual identity — emoji glyph + ring color. Glyph chosen to read
// at a glance even when the map is dense. Colors echo the rest of the site
// palette (greens/blues + utility orange/gold).
// ---------------------------------------------------------------------------
interface TypeStyle {
  emoji: string;
  color: string;
  layerLabel: string;
}

const TYPE_STYLES: Record<LocationType, TypeStyle> = {
  airport: { emoji: '✈️', color: '#f97316', layerLabel: 'Airports' },
  'lodging-west': { emoji: '\u{1F3E1}', color: '#2563eb', layerLabel: 'Lodging — West' },
  'lodging-east': { emoji: '\u{1F3E1}', color: '#0d9488', layerLabel: 'Lodging — East' },
  'cool-sleeping': { emoji: '\u{1F3D5}️', color: '#d97706', layerLabel: 'Cool sleeping places' },
  trailhead: { emoji: '\u{1F97E}', color: '#16a34a', layerLabel: 'Trailheads' },
  viewpoint: { emoji: '\u{1F4F7}', color: '#7c3aed', layerLabel: 'Viewpoints' },
  sunset: { emoji: '\u{1F305}', color: '#f59e0b', layerLabel: 'Sunset spots' },
  water: { emoji: '\u{1F6A3}', color: '#0891b2', layerLabel: 'Water activities' },
  town: { emoji: '\u{1F3D8}️', color: '#6b7280', layerLabel: 'Towns' },
  seattle: { emoji: '\u{1F306}', color: '#9ca3af', layerLabel: 'Seattle' },
};

const CLOSURE_LAYER_LABEL = 'WA-20 closure';

// ---------------------------------------------------------------------------
// Marker icon — emoji on a circular badge. divIcon (HTML) so we don't need
// to ship image assets.
// ---------------------------------------------------------------------------
function makeIcon(type: LocationType, size = 30): L.DivIcon {
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

// ---------------------------------------------------------------------------
// Path-filter logic.
// ---------------------------------------------------------------------------
function isFaded(loc: MapLocation, path: PathId | null): boolean {
  if (path === null) return false;
  if (loc.pathAssoc === 'both') return false;
  if (path === 'A') return loc.pathAssoc === 'east';
  if (path === 'B') return false;
  if (path === 'C') return loc.pathAssoc === 'west';
  return false;
}

// ---------------------------------------------------------------------------
// Popup HTML — name + hero photo + type-specific meta + CTAs.
// ---------------------------------------------------------------------------
function popupHtml(loc: MapLocation): string {
  const safeName = escapeHtml(loc.name);
  const safeContext = escapeHtml(loc.context);

  const photo = loc.photo
    ? `<img class="map-popup__photo" src="${escapeHtml(loc.photo.src)}" alt="${escapeHtml(loc.photo.alt)}" loading="lazy" width="280" height="160" />`
    : '';

  let metaBlock = '';
  if (loc.meta?.lodging) {
    const m = loc.meta.lodging;
    const driveRows = (m.drive ?? [])
      .map(
        (d) =>
          `<li class="map-popup__drive-row"><span class="map-popup__drive-to">${escapeHtml(d.to)}</span><span class="map-popup__drive-time">${d.minutes} min · ${d.miles} mi</span></li>`
      )
      .join('');
    metaBlock = `<dl class="map-popup__meta">
      <div class="map-popup__meta-row"><dt>Beds</dt><dd>${escapeHtml(m.beds)}</dd></div>
      <div class="map-popup__meta-row"><dt>Price</dt><dd>${escapeHtml(m.priceTier)}</dd></div>
      ${m.kitchen ? `<div class="map-popup__meta-row"><dt>Kitchen</dt><dd>${escapeHtml(m.kitchen)}</dd></div>` : ''}
    </dl>
    ${driveRows ? `<div class="map-popup__drive"><div class="map-popup__drive-label">Drive to</div><ul class="map-popup__drive-list">${driveRows}</ul></div>` : ''}`;
  } else if (loc.meta?.trailhead) {
    const m = loc.meta.trailhead;
    metaBlock = `<dl class="map-popup__meta">
      <div class="map-popup__meta-row"><dt>Miles</dt><dd>${escapeHtml(m.mileage)}</dd></div>
      <div class="map-popup__meta-row"><dt>Climb</dt><dd>${escapeHtml(m.elevation)}</dd></div>
      <div class="map-popup__meta-row"><dt>Level</dt><dd>${escapeHtml(m.difficulty)}</dd></div>
    </dl>`;
  } else if (loc.meta?.viewpoint) {
    const m = loc.meta.viewpoint;
    metaBlock = `<dl class="map-popup__meta">
      <div class="map-popup__meta-row"><dt>Where</dt><dd>${escapeHtml(m.mileMarker)}</dd></div>
      <div class="map-popup__meta-row"><dt>Best</dt><dd>${escapeHtml(m.bestTime)}</dd></div>
    </dl>`;
  } else if (loc.meta?.sunset) {
    const m = loc.meta.sunset;
    metaBlock = `<dl class="map-popup__meta">
      <div class="map-popup__meta-row"><dt>Rank</dt><dd>#${m.rank} of 7</dd></div>
      <div class="map-popup__meta-row"><dt>Faces</dt><dd>${escapeHtml(m.viewDirection)}</dd></div>
      <div class="map-popup__meta-row"><dt>Paths</dt><dd>${escapeHtml(m.bestByPath)}</dd></div>
      ${m.fromLodgingNote ? `<div class="map-popup__meta-row map-popup__meta-row--wide"><dt>Note</dt><dd>${escapeHtml(m.fromLodgingNote)}</dd></div>` : ''}
    </dl>`;
  } else if (loc.meta?.water) {
    const m = loc.meta.water;
    metaBlock = `<dl class="map-popup__meta">
      <div class="map-popup__meta-row"><dt>Cost</dt><dd>${escapeHtml(m.cost)}</dd></div>
      <div class="map-popup__meta-row"><dt>Time</dt><dd>${escapeHtml(m.time)}</dd></div>
      ${m.operator ? `<div class="map-popup__meta-row"><dt>Via</dt><dd>${escapeHtml(m.operator)}</dd></div>` : ''}
    </dl>`;
  } else if (loc.meta?.coolSleeping) {
    const m = loc.meta.coolSleeping;
    metaBlock = `<dl class="map-popup__meta">
      <div class="map-popup__meta-row"><dt>Access</dt><dd>${escapeHtml(m.access)}</dd></div>
      <div class="map-popup__meta-row"><dt>Beds</dt><dd>${escapeHtml(m.beds)}</dd></div>
      <div class="map-popup__meta-row"><dt>Price</dt><dd>${escapeHtml(m.priceTier)}</dd></div>
      ${m.bookingNote ? `<div class="map-popup__meta-row map-popup__meta-row--wide"><dt>Note</dt><dd>${escapeHtml(m.bookingNote)}</dd></div>` : ''}
    </dl>`;
  } else if (loc.meta?.town) {
    metaBlock = `<dl class="map-popup__meta"><div class="map-popup__meta-row map-popup__meta-row--wide"><dt>Role</dt><dd>${escapeHtml(loc.meta.town.role)}</dd></div></dl>`;
  } else if (loc.meta?.airport) {
    const m = loc.meta.airport;
    metaBlock = `<dl class="map-popup__meta">
      <div class="map-popup__meta-row"><dt>Code</dt><dd>${escapeHtml(m.code)}</dd></div>
      <div class="map-popup__meta-row"><dt>NYC nonstop</dt><dd>${m.nonstopFromNyc ? 'Yes (Alaska)' : 'No — connection required'}</dd></div>
    </dl>`;
  }

  const ctaList: string[] = [];
  if (loc.anchor) {
    ctaList.push(
      `<a class="map-popup__cta map-popup__cta--secondary" href="${escapeHtml(loc.anchor)}">View on site ↓</a>`
    );
  }
  if (loc.externalAnchor) {
    ctaList.push(
      `<a class="map-popup__cta map-popup__cta--secondary" href="${escapeHtml(loc.externalAnchor)}">Full page →</a>`
    );
  }
  const bookUrl =
    loc.meta?.lodging?.bookUrl ??
    loc.meta?.coolSleeping?.bookUrl ??
    loc.meta?.water?.operatorUrl ??
    loc.meta?.trailhead?.wtaUrl;
  if (bookUrl) {
    const bookLabel =
      loc.meta?.trailhead != null
        ? 'WTA page ↗'
        : loc.meta?.water != null
          ? 'Operator ↗'
          : 'Book ↗';
    ctaList.push(
      `<a class="map-popup__cta map-popup__cta--primary" href="${escapeHtml(bookUrl)}" target="_blank" rel="noopener">${bookLabel}</a>`
    );
  }
  const ctas = ctaList.length
    ? `<div class="map-popup__ctas">${ctaList.join('')}</div>`
    : '';

  return `<div class="map-popup">
    ${photo}
    <h4 class="map-popup__title">${safeName}</h4>
    <p class="map-popup__body">${safeContext}</p>
    ${metaBlock}
    ${ctas}
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
// Legend builder — minimal label list, lives bottom-right.
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
// Map render — main entry.
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

/** Types that get clustered when zoomed out — the lodging-dense ones. */
const CLUSTER_TYPES: ReadonlySet<LocationType> = new Set<LocationType>([
  'lodging-west',
  'lodging-east',
  'cool-sleeping',
]);

export function renderMap(): HTMLElement {
  fixDefaultIconPaths();

  const mapEl = h('div', { class: 'map-canvas', 'aria-label': 'Trip overview map' });
  const wrap = section(
    'map',
    'Map — where everything is',
    h(
      'ul',
      { class: 'gist' },
      h(
        'li',
        { class: 'gist__item' },
        'Every lodging, trailhead, viewpoint, sunset spot, and water option pinned. Toggle layers in the top-right control. The red dashed line is the WA-20 closure (MP 130 → MP 156, WSDOT target reopen Jul 4).'
      ),
      h(
        'li',
        { class: 'gist__item' },
        "Click any pin — popup shows a photo, the facts (beds + drive time for lodging, mileage + WTA for trails, mile marker + best-time for viewpoints), and a Book → link where it applies."
      ),
      h(
        'li',
        { class: 'gist__item' },
        "Pick a path above to fade markers that don't apply — east-side dims on Path A, west-side on Path C."
      )
    ),
    mapEl
  );

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

    // -----------------------------------------------------------------------
    // Closure polyline polish — thick + dashed + hover tooltip + popup.
    // -----------------------------------------------------------------------
    const closure = L.polyline(WA20_CLOSURE_POLYLINE, {
      color: '#dc2626',
      weight: 8,
      opacity: 0.9,
      lineCap: 'round',
      lineJoin: 'round',
      dashArray: '12, 8',
    });
    closure.bindTooltip(
      `WA-20 closed mid-corridor — Plan-B via Stevens Pass`,
      { sticky: true, direction: 'top', className: 'map-tooltip' }
    );
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

    // -----------------------------------------------------------------------
    // Layer groups — one per type.
    // -----------------------------------------------------------------------
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

    // Render markers into the right layer group.
    const entries: MarkerEntry[] = MAP_LOCATIONS.map((loc) => {
      const marker = L.marker([loc.lat, loc.lng], {
        icon: makeIcon(loc.type),
        title: loc.name,
        riseOnHover: true,
      });
      marker.bindPopup(popupHtml(loc), { maxWidth: 300, className: 'map-popup__container' });
      const group = layerByType.get(loc.type);
      if (group) group.addLayer(marker);
      return { marker, loc };
    });

    // Closures are their own dedicated layer-group (one polyline only).
    const closureGroup = L.layerGroup([closure]);

    // Add all layers to the map by default — everything ON.
    for (const group of layerByType.values()) {
      group.addTo(map);
    }
    closureGroup.addTo(map);

    // Layer control (top-right).
    const overlays: Record<string, L.Layer> = {};
    for (const type of Object.keys(TYPE_STYLES) as LocationType[]) {
      const group = layerByType.get(type);
      if (!group) continue;
      const style = TYPE_STYLES[type];
      const labelHtml = `<span class="map-layer-label"><span class="map-layer-label__glyph" style="color:${style.color}">${style.emoji}</span>${style.layerLabel}</span>`;
      overlays[labelHtml] = group;
    }
    overlays[`<span class="map-layer-label"><span class="map-layer-label__glyph" style="color:#dc2626">⚠️</span>${CLOSURE_LAYER_LABEL}</span>`] =
      closureGroup;

    L.control
      .layers(undefined, overlays, { collapsed: true, position: 'topright' })
      .addTo(map);

    // Legend.
    makeLegend().addTo(map);

    // Fit map to bounds of markers + closure.
    const allLatLngs: L.LatLngExpression[] = [
      ...entries.map((e) => [e.loc.lat, e.loc.lng] as [number, number]),
      ...WA20_CLOSURE_POLYLINE,
    ];
    const bounds = L.latLngBounds(allLatLngs);
    map.fitBounds(bounds, { padding: [30, 30] });

    // Path filter — initial + subscription.
    applyPathFilter(entries, getSelectedPath());
    subscribeSelectedPath((next) => {
      applyPathFilter(entries, next);
    });

    // Resize hygiene.
    window.addEventListener('resize', () => {
      map.invalidateSize();
    });
    setTimeout(() => map.invalidateSize(), 200);
  });

  return wrap;
}

function applyPathFilter(entries: MarkerEntry[], path: PathId | null): void {
  for (const { marker, loc } of entries) {
    const faded = isFaded(loc, path);
    const el = marker.getElement();
    if (!el) continue;
    if (faded) {
      el.classList.add('map-marker__wrap--faded');
    } else {
      el.classList.remove('map-marker__wrap--faded');
    }
  }
}
