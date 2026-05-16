/**
 * Map section — birds-eye Leaflet map showing every trip location + the WA-20
 * closed segment as a red polyline.
 *
 * Tech: Leaflet 1.9 + OpenStreetMap tiles (no API key needed).
 *
 * Behaviors:
 *   - Marker types are color/icon-coded (see makeIcon). A legend lives bottom-
 *     right of the map.
 *   - Path filter awareness: when the user picks Path A in the picker, east-
 *     side lodging fades to 0.3 opacity. Path C fades non-Winthrop lodging.
 *     Compare-all (null) shows everything full.
 *   - Mobile-friendly height. Pan + pinch-zoom work via Leaflet defaults.
 *   - Auto-fit on first render so the whole network + closure is in viewport.
 */

import L from 'leaflet';
import { h, section } from '../dom';
import {
  MAP_LOCATIONS,
  WA20_CLOSURE_POLYLINE,
  CLOSURE_LABEL,
  TYPE_LABELS,
  type LocationType,
  type MapLocation,
} from '../data/locations';
import { getSelectedPath, subscribeSelectedPath } from '../state/path';
import type { PathId } from '../data/paths';

// ---------------------------------------------------------------------------
// Marker styling — one color per type. We use Leaflet divIcons (HTML markers)
// instead of image sprites so the build stays bundler-clean without copying
// image files into /public.
// ---------------------------------------------------------------------------
const TYPE_COLORS: Record<LocationType, string> = {
  airport: '#f97316', // orange-500
  'lodging-west': '#2563eb', // blue-600
  'lodging-east': '#2563eb',
  trailhead: '#16a34a', // green-600
  viewpoint: '#7c3aed', // violet-600
  town: '#6b7280', // gray-500
  seattle: '#fb923c', // orange-400 (smaller dot)
};

function makeIcon(type: LocationType): L.DivIcon {
  const color = TYPE_COLORS[type];
  const isSeattleDot = type === 'seattle';
  const isViewpoint = type === 'viewpoint';
  const isTown = type === 'town';
  const size = isSeattleDot ? 10 : isTown ? 12 : 18;

  // Viewpoints get a star shape; everyone else gets a filled circle with a
  // white border (looks like a map pin head).
  let html: string;
  if (isViewpoint) {
    html = `<div class="map-marker map-marker--star" style="--marker-color:${color}" aria-hidden="true">★</div>`;
  } else {
    html = `<div class="map-marker map-marker--dot map-marker--${type}" style="--marker-color:${color};--marker-size:${size}px" aria-hidden="true"></div>`;
  }

  return L.divIcon({
    html,
    className: 'map-marker__wrap',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2 - 2],
  });
}

// ---------------------------------------------------------------------------
// Path-filter logic — decide whether a location is "full" or "faded" given
// the current selectedPath.
// ---------------------------------------------------------------------------
function isFaded(loc: MapLocation, path: PathId | null): boolean {
  if (path === null) return false;
  // Trailheads, viewpoints, airports, towns ALWAYS full.
  if (loc.pathAssoc === 'both') return false;
  // Path A — west-side only. Fade everything tagged 'east'.
  if (path === 'A') return loc.pathAssoc === 'east';
  // Path B — both sides. Show everything.
  if (path === 'B') return false;
  // Path C — east-side only. Fade west-side lodging, but keep west trailheads/
  // viewpoints (which are 'both').
  if (path === 'C') return loc.pathAssoc === 'west';
  return false;
}

// ---------------------------------------------------------------------------
// Popup HTML — name + 1-line context + optional anchor link.
// ---------------------------------------------------------------------------
function popupHtml(loc: MapLocation): string {
  const safeName = escapeHtml(loc.name);
  const safeContext = escapeHtml(loc.context);
  const link = loc.anchor
    ? `<a class="map-popup__link" href="${loc.anchor}">View details ↓</a>`
    : '';
  return `<div class="map-popup">
    <h4 class="map-popup__title">${safeName}</h4>
    <p class="map-popup__body">${safeContext}</p>
    ${link}
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
// Legend builder.
// ---------------------------------------------------------------------------
function makeLegend(): L.Control {
  const legend = new L.Control({ position: 'bottomright' });
  legend.onAdd = (): HTMLElement => {
    const div = L.DomUtil.create('div', 'map-legend');
    const rows: Array<{ key: LocationType | 'closure'; label: string }> = [
      { key: 'airport', label: TYPE_LABELS.airport },
      { key: 'lodging-west', label: 'Lodging' },
      { key: 'trailhead', label: TYPE_LABELS.trailhead },
      { key: 'viewpoint', label: TYPE_LABELS.viewpoint },
      { key: 'town', label: TYPE_LABELS.town },
      { key: 'closure', label: 'WA-20 closed' },
    ];
    const items = rows
      .map((r) => {
        if (r.key === 'closure') {
          return `<li class="map-legend__item"><span class="map-legend__line" aria-hidden="true"></span>${r.label}</li>`;
        }
        const color = TYPE_COLORS[r.key];
        const isViewpoint = r.key === 'viewpoint';
        const swatch = isViewpoint
          ? `<span class="map-legend__star" style="color:${color}" aria-hidden="true">★</span>`
          : `<span class="map-legend__dot" style="background:${color}" aria-hidden="true"></span>`;
        return `<li class="map-legend__item">${swatch}${r.label}</li>`;
      })
      .join('');
    div.innerHTML = `<ul class="map-legend__list">${items}</ul>`;
    // Stop map drag/zoom propagation when the user interacts with the legend.
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
  // Leaflet's default Marker icons rely on relative image paths the bundler
  // can't resolve. We're using divIcons for everything, so this never gets
  // hit, but if anyone falls back to L.Marker(latlng) without an icon, this
  // prevents the broken-image flicker.
  delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl:
      'https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl:
      'https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/images/marker-shadow.png',
  });
}

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
        'Every lodging, trailhead, and viewpoint pinned. The red line is the WA-20 closure (MP 130 → MP 156, WSDOT target reopen Jul 4).'
      ),
      h(
        'li',
        { class: 'gist__item' },
        'Pick a path above to fade markers that don\'t apply — east-side lodging dims on Path A, west-side on Path C.'
      )
    ),
    mapEl
  );

  // Defer Leaflet init until the element is in the DOM. We use a microtask via
  // requestAnimationFrame so the container has measurable dimensions.
  requestAnimationFrame(() => {
    const map = L.map(mapEl, {
      zoomControl: true,
      scrollWheelZoom: false, // avoid scroll-jacking on long page
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

    // Closure polyline.
    const closure = L.polyline(WA20_CLOSURE_POLYLINE, {
      color: '#ef4444',
      weight: 6,
      opacity: 0.85,
      lineCap: 'round',
      lineJoin: 'round',
    }).addTo(map);
    closure.bindPopup(
      `<div class="map-popup"><h4 class="map-popup__title">${escapeHtml(CLOSURE_LABEL.title)}</h4><p class="map-popup__body">${escapeHtml(CLOSURE_LABEL.detail)}</p></div>`
    );

    // Markers.
    const entries: MarkerEntry[] = MAP_LOCATIONS.map((loc) => {
      const marker = L.marker([loc.lat, loc.lng], {
        icon: makeIcon(loc.type),
        title: loc.name,
        riseOnHover: true,
      });
      marker.bindPopup(popupHtml(loc));
      marker.addTo(map);
      return { marker, loc };
    });

    // Legend.
    makeLegend().addTo(map);

    // Fit map to bounds of markers + closure.
    const allLatLngs: L.LatLngExpression[] = [
      ...entries.map((e) => [e.loc.lat, e.loc.lng] as [number, number]),
      ...WA20_CLOSURE_POLYLINE,
    ];
    const bounds = L.latLngBounds(allLatLngs);
    map.fitBounds(bounds, { padding: [30, 30] });

    // Apply current path filter on init.
    applyPathFilter(entries, getSelectedPath());

    // Subscribe to path changes.
    subscribeSelectedPath((next) => {
      applyPathFilter(entries, next);
    });

    // Resize handler — Leaflet needs invalidateSize() if container was hidden
    // or resized after init.
    window.addEventListener('resize', () => {
      map.invalidateSize();
    });
    // Initial invalidate one frame later in case fonts/CSS shifted layout.
    setTimeout(() => map.invalidateSize(), 200);
  });

  return wrap;
}

function applyPathFilter(entries: MarkerEntry[], path: PathId | null): void {
  for (const { marker, loc } of entries) {
    const faded = isFaded(loc, path);
    const el = marker.getElement();
    if (el) {
      el.style.opacity = faded ? '0.3' : '1';
      el.style.filter = faded ? 'grayscale(0.4)' : '';
    }
  }
}
