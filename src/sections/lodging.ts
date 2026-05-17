/**
 * Lodging — mini-Booking.com listings surface (Wave 3, May 17, 2026).
 *
 * Standing display rules (Allison May 16, 2026):
 *   - Beds (count + type)
 *   - Bedrooms (count or studio)
 *   - Nature proximity (one prominent line)
 *   - Worth-noting extras (kitchen, hot tub, deck, view, atypical features)
 *
 * Wave 3 additions (May 17, 2026 — pipeline doc):
 *   *"Mini-Booking.com agent — filter starts empty + click chips to narrow,
 *   ✓ Pick button + shortlist, per-lodging drive matrix, Booking-style
 *   carousels + pills."*
 *
 *   1. **Filter chip row** above the cards. Starts EMPTY (no chip selected =
 *      all cards visible). Tapping a chip narrows. Multi-select within a
 *      group, AND across groups.
 *   2. **Pick / Shortlist** — every card has a ✓ Pick button that adds to
 *      localStorage. Sticky pill bottom-right when count > 0. Shortlist
 *      panel expands to compare-table.
 *   3. **Drive-time matrix** per card — small inline disclosure with
 *      minutes + miles to each canonical destination (Cascade Pass / Maple
 *      Pass / Diablo / Washington Pass / Newhalem / Sun Mountain / Grocery /
 *      Gas).
 *   4. **Photo carousel** — 3-5 thumbs per card, horizontal scroll-snap
 *      with dot indicators. Backward-compat: `photo` is slide 1.
 *
 * Path-filter (existing) still works orthogonally: when a path is selected,
 * cards NOT in that path's recommended ids fade into "Other corridor
 * options" disclosure. Path-filter is independent of chip filters.
 */

import {
  AVAILABILITY_LABELS,
  DRIVE_DESTINATIONS,
  EAST_LODGING,
  NATURE_LABELS,
  WEST_LODGING,
  sortByNature,
  type Lodging,
  type LodgingAmenities,
  type LodgingTier,
  type NatureTag,
} from '../data/lodging';
import { getPathById } from '../data/paths';
import { getSelectedPath, subscribeSelectedPath } from '../state/path';
import { badge, h, section } from '../dom';

// ====================================================================
// FILTER CHIP STATE — vanilla pub/sub. Default: empty (all visible).
// ====================================================================

interface FilterState {
  /** Empty Set = no chip selected in this group = no filter applied. */
  base: Set<'west' | 'east'>;
  tier: Set<'lean' | 'standard' | 'mid-high'>;
  /** beds is a single toggle ("2 beds min"). Off by default per Allison spec.
   *  (Erin's 2-bed rule is already enforced by the not-a-fit grouping —
   *  this chip is an explicit user-controllable filter, not a default.) */
  bedsMin2: boolean;
  kitchen: Set<'full' | 'kitchenette' | 'none'>;
  nature: Set<NatureTag>;
  sunsetOnly: boolean;
  /**
   * Free-cancellation hard filter (Allison May 17, 2026 — booking-discipline
   * mechanism while flights + lodging + WA-20 status are unresolved). Default
   * OFF — don't gatekeep the list until the research data is fully populated.
   * When ON, narrows to `freeCancellation === 'yes'` ONLY (not 'unknown' —
   * we don't show speculative inventory as flexible).
   */
  freeCancelOnly: boolean;
}

function emptyFilters(): FilterState {
  return {
    base: new Set(),
    tier: new Set(),
    bedsMin2: false,
    kitchen: new Set(),
    nature: new Set(),
    sunsetOnly: false,
    freeCancelOnly: false,
  };
}

const filters: FilterState = emptyFilters();
const filterListeners: (() => void)[] = [];

function notifyFilters(): void {
  for (const fn of filterListeners) fn();
}
function onFilterChange(fn: () => void): void {
  filterListeners.push(fn);
}

// Tier mapping — parse the pricePerNight string and assign one bucket.
//   lean       = under $200
//   standard   = $200-300
//   mid-high   = $300+
// Heuristic: take the LOWER bound of the price range as the anchor.
function lodgingTierBucket(l: Lodging): 'lean' | 'standard' | 'mid-high' {
  const match = l.pricePerNight.match(/\$(\d+)/);
  if (!match) return 'standard';
  const low = parseInt(match[1] ?? '0', 10);
  if (low < 200) return 'lean';
  if (low < 300) return 'standard';
  return 'mid-high';
}

function lodgingHasMin2Beds(l: Lodging): boolean {
  // Heuristic: if `tier === 'not-a-fit'`, the under-2-beds rule already failed.
  // For everything else assume the data is correct.
  return l.tier !== 'not-a-fit';
}

/**
 * Render the optional amenity-pill set per the May 17, 2026 mini-Booking.com
 * spec: laundry / baths / AC / parking / wifi / pets / hot tub. Only renders
 * a pill when the value is known (i.e. not undefined and not 'unknown') — we
 * intentionally skip rather than render "Unknown" pills, per the fail-loud
 * rule. Returns an array of HTMLElement | null so the caller can spread it
 * into the larger pillRow without empty wrappers.
 */
function renderAmenityPills(a: LodgingAmenities | undefined): (HTMLElement | null)[] {
  if (!a) return [];
  const pills: (HTMLElement | null)[] = [];
  const pill = (text: string): HTMLElement => h('li', { class: 'card__pill card__pill--amenity' }, text);

  if (a.baths) pills.push(pill(`🛁 ${a.baths} bath${a.baths === '1' ? '' : 's'}`));
  if (a.laundry && a.laundry !== 'unknown') {
    const label = a.laundry === 'in-unit' ? 'In-unit laundry'
      : a.laundry === 'on-site' ? 'On-site laundry'
      : a.laundry === 'shared' ? 'Shared laundry'
      : 'No laundry';
    pills.push(pill(`🧺 ${label}`));
  }
  if (a.ac && a.ac !== 'unknown') {
    pills.push(pill(a.ac === 'yes' ? '❄️ AC' : '🚫 No AC'));
  }
  if (a.parking && a.parking !== 'unknown') {
    const label = a.parking === 'free' ? 'Free parking'
      : a.parking === 'paid' ? 'Paid parking'
      : 'Street parking';
    pills.push(pill(`🅿 ${label}`));
  }
  if (a.wifi && a.wifi !== 'unknown') {
    const label = a.wifi === 'strong' ? 'Strong wifi'
      : a.wifi === 'basic' ? 'Basic wifi'
      : 'No wifi';
    pills.push(pill(`📶 ${label}`));
  }
  if (a.pets && a.pets !== 'unknown') {
    const label = a.pets === 'yes' ? 'Pets OK'
      : a.pets === 'fee' ? 'Pets (fee)'
      : 'No pets';
    pills.push(pill(`🐾 ${label}`));
  }
  if (a.hotTub) pills.push(pill('♨ Hot tub'));
  return pills;
}

function lodgingMatchesFilters(l: Lodging, base: 'west' | 'east'): boolean {
  if (filters.base.size > 0 && !filters.base.has(base)) return false;
  if (filters.tier.size > 0 && !filters.tier.has(lodgingTierBucket(l))) return false;
  if (filters.bedsMin2 && !lodgingHasMin2Beds(l)) return false;
  if (filters.kitchen.size > 0 && !filters.kitchen.has(l.kitchen)) return false;
  if (filters.nature.size > 0 && !filters.nature.has(l.natureTag)) return false;
  if (filters.sunsetOnly && (!l.sunset || l.sunset.worth !== 'yes')) return false;
  // Free-cancellation hard filter: only 'yes' passes. 'unknown' is treated
  // as a fail — we don't show speculative inventory as flexible when the
  // user explicitly asked for the booking-discipline guarantee.
  if (filters.freeCancelOnly && l.freeCancellation !== 'yes') return false;
  return true;
}

function activeFilterCount(): number {
  return (
    filters.base.size +
    filters.tier.size +
    (filters.bedsMin2 ? 1 : 0) +
    filters.kitchen.size +
    filters.nature.size +
    (filters.sunsetOnly ? 1 : 0) +
    (filters.freeCancelOnly ? 1 : 0)
  );
}

/** Live total of properties matching the current filters across both bases. */
function currentShowingCount(): number {
  const west = WEST_LODGING.filter((l) => lodgingMatchesFilters(l, 'west')).length;
  const east = EAST_LODGING.filter((l) => lodgingMatchesFilters(l, 'east')).length;
  return west + east;
}

// ====================================================================
// SHORTLIST STATE — localStorage-persisted ID array.
// ====================================================================

const SHORTLIST_KEY = 'ncades2026.lodgingPicks';

function loadShortlist(): Set<string> {
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

function saveShortlist(set: Set<string>): void {
  try {
    localStorage.setItem(SHORTLIST_KEY, JSON.stringify([...set]));
  } catch {
    // ignore
  }
}

const shortlist: Set<string> = loadShortlist();
const shortlistListeners: (() => void)[] = [];

function notifyShortlist(): void {
  saveShortlist(shortlist);
  for (const fn of shortlistListeners) fn();
}
function onShortlistChange(fn: () => void): void {
  shortlistListeners.push(fn);
}
function togglePick(id: string): void {
  if (shortlist.has(id)) shortlist.delete(id);
  else shortlist.add(id);
  notifyShortlist();
}

// ====================================================================
// PHOTO CAROUSEL
// ====================================================================

function renderCarousel(lodging: Lodging): HTMLElement {
  // Lodging Owner pass (2026-05-17): cap carousel at 3 slides. Was 5 — but
  // slides 4-5 were almost always the same stock Unsplash forest/firepit/
  // interior across 15+ cards. Cutting tail reduces stock-repetition without
  // touching the data layer. Property-authentic slide 1 stays leading.
  const allPhotos = lodging.photos && lodging.photos.length > 0 ? lodging.photos : [lodging.photo];
  const photos = allPhotos.slice(0, 3);
  const figure = h('figure', { class: 'card__figure card__figure--carousel' });
  const track = h('div', {
    class: 'lcarousel__track',
    role: 'group',
    'aria-label': `Photos of ${lodging.name} (${photos.length})`,
    tabindex: '0',
  });

  photos.forEach((p, idx) => {
    const isRepresentative = p.credit?.toLowerCase().includes('unsplash') ?? false;
    const img = h('img', {
      class: 'lcarousel__img',
      src: p.src,
      alt: isRepresentative
        ? `Representative photo (not actual property): ${p.alt}`
        : p.alt,
      width: p.width,
      height: p.height,
      loading: idx === 0 ? 'eager' : 'lazy',
      decoding: 'async',
    });
    const slide = h('div', { class: 'lcarousel__slide', 'data-slide': idx }, img);
    track.appendChild(slide);
  });

  figure.appendChild(track);

  // Dot indicators
  const dots = h('div', { class: 'lcarousel__dots', 'aria-hidden': 'true' });
  photos.forEach((_, idx) => {
    const dot = h('button', {
      type: 'button',
      class: idx === 0 ? 'lcarousel__dot lcarousel__dot--active' : 'lcarousel__dot',
      'aria-label': `Go to photo ${idx + 1}`,
      'data-slide': idx,
    });
    dots.appendChild(dot);
  });
  figure.appendChild(dots);

  // Count pill (Booking.com-style "1/4")
  const counter = h('span', { class: 'lcarousel__counter' }, `1 / ${photos.length}`);
  figure.appendChild(counter);

  // Wire up: clicking dot scrolls track. IntersectionObserver updates active dot.
  const slides = track.querySelectorAll<HTMLElement>('.lcarousel__slide');
  const dotBtns = dots.querySelectorAll<HTMLButtonElement>('.lcarousel__dot');
  dotBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset['slide'] ?? '0', 10);
      const target = slides[idx];
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
      }
    });
  });

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
          const target = entry.target as HTMLElement;
          const idx = parseInt(target.dataset['slide'] ?? '0', 10);
          dotBtns.forEach((d, i) => {
            d.classList.toggle('lcarousel__dot--active', i === idx);
          });
          counter.textContent = `${idx + 1} / ${photos.length}`;
        }
      }
    },
    { root: track, threshold: [0.6] }
  );
  slides.forEach((s) => observer.observe(s));

  // Photo credit (first slide)
  const first = photos[0];
  if (first && first.credit) {
    const credit = first.creditUrl
      ? h(
          'figcaption',
          { class: 'card__credit' },
          h('a', { href: first.creditUrl, rel: 'noopener', target: '_blank' }, first.credit)
        )
      : h('figcaption', { class: 'card__credit' }, first.credit);
    figure.appendChild(credit);
  }

  // Representative-photo warning if first slide is unsplash
  const firstIsRep = first?.credit?.toLowerCase().includes('unsplash') ?? false;
  if (firstIsRep) {
    figure.appendChild(
      h(
        'p',
        { class: 'card__photo-warning' },
        'Photos are representative — see booking link for actual property photos.'
      )
    );
  }

  return figure;
}

// ====================================================================
// DRIVE-TIME MATRIX
// ====================================================================

function renderDriveMatrix(lodging: Lodging): HTMLElement | null {
  if (!lodging.driveTimes || lodging.driveTimes.length === 0) return null;

  const rows = lodging.driveTimes.map((dt) => {
    const dest = DRIVE_DESTINATIONS[dt.destinationId];
    return h(
      'tr',
      { class: 'drive-matrix__row' },
      h('th', { class: 'drive-matrix__dest', scope: 'row' }, dest.short),
      h('td', { class: 'drive-matrix__min' }, `${dt.minutes} min`),
      h('td', { class: 'drive-matrix__mi' }, `${dt.miles} mi`)
    );
  });

  return h(
    'details',
    { class: 'drive-matrix' },
    h('summary', { class: 'drive-matrix__summary' }, `Drive times from here (${lodging.driveTimes.length})`),
    h(
      'table',
      { class: 'drive-matrix__table' },
      h(
        'thead',
        {},
        h(
          'tr',
          {},
          h('th', { scope: 'col' }, 'Destination'),
          h('th', { scope: 'col' }, 'Time'),
          h('th', { scope: 'col' }, 'Distance')
        )
      ),
      h('tbody', {}, ...rows)
    ),
    h(
      'p',
      { class: 'drive-matrix__note' },
      'Drive times from Google Maps norms (May 17, 2026 spot-check). Add buffer for weekend Aug traffic on WA-20.'
    )
  );
}

// ====================================================================
// CARDS
// ====================================================================

function renderLodgingCard(lodging: Lodging, inPath: boolean): HTMLElement {
  const natureLabel = NATURE_LABELS[lodging.natureTag];
  const isTownCenter = lodging.natureTag === 'town-center';

  const notFitBlock = lodging.notFitReason
    ? h(
        'p',
        { class: 'card__not-fit' },
        h('strong', {}, 'Not a fit: '),
        lodging.notFitReason
      )
    : null;

  // Emoji-pill row — May 16-17, 2026 standing rule. (Unchanged from Wave 2.)
  const kitchenLabel =
    lodging.kitchen === 'full'
      ? 'Full kitchen'
      : lodging.kitchen === 'kitchenette'
        ? 'Kitchenette'
        : 'No kitchen';
  const kitchenEmoji =
    lodging.kitchen === 'full' ? '🍳' : lodging.kitchen === 'kitchenette' ? '🍵' : '🚫';
  const viewEmoji =
    lodging.natureTag === 'lakeside'
      ? '🌊'
      : lodging.natureTag === 'riverside'
        ? '💧'
        : lodging.natureTag === 'mountain-view'
          ? '🏔'
          : lodging.natureTag === 'ranch-acreage'
            ? '🐎'
            : lodging.natureTag === 'town-center'
              ? '🏘'
              : '🌲';
  const tierEmoji = lodging.tier === 'splurge' ? '💎' : '💰';
  const sunsetBonus =
    lodging.sunset && lodging.sunset.worth === 'yes' ? ' · 🌅 sunset' : '';
  const reviewsPillScore =
    lodging.reviews.score === 'N/A' ? '[verify]' : lodging.reviews.score;
  const reviewsPillCount =
    lodging.reviews.count === 'N/A' ? '' : ` · ${lodging.reviews.count}`;
  const availabilityPillKind =
    lodging.availability === 'confirmed-aug-16-20'
      ? 'good'
      : lodging.availability === 'sold-out-or-unavailable'
        ? 'warn'
        : 'info';
  const amenityPills = renderAmenityPills(lodging.amenities);
  // Bed summary: extract the short headline from the verbose `beds` string.
  // Pattern: split on first ' — ' / '·' / '(' to keep what's before the
  // disambiguating parenthetical. Falls back to the original string.
  const bedsShort = (() => {
    const raw = lodging.beds;
    // If it contains a parenthetical breakdown, drop it.
    const noParen = raw.replace(/\s*\(.*?\)/g, '').trim();
    // If it contains a · separator with details on the right, take the left.
    const beforeMid = noParen.split('·')[0]?.trim() ?? noParen;
    // If it contains ' — ' (em dash with explanation), take the left side.
    const beforeDash = beforeMid.split(' — ')[0]?.trim() ?? beforeMid;
    // Strip trailing colon-led detail like "Riverside cabin: 1 queen..."
    const afterColon = beforeDash.includes(':') ? beforeDash.split(':').slice(1).join(':').trim() : beforeDash;
    return afterColon.length > 0 && afterColon.length <= 40 ? afterColon : beforeDash;
  })();
  // Lodging Owner pass (2026-05-17): collapse pill density.
  //   - Removed `✅ Verified May 2026` (appears on every card — moved to
  //     page-level disclaimer).
  //   - Removed `⚠️ Verify beds at booking` (87% of cards have it — moved
  //     to page-level disclaimer).
  //   - Removed `📅 Aug 16-20: verify` when value is 'verify-at-booking'
  //     (default state — moved to page-level disclaimer). Still rendered
  //     for 'confirmed-aug-16-20' (good signal) and 'sold-out-or-unavailable'
  //     (warn signal).
  //   - Bed pill summarized to a short headline. Full breakdown lives in
  //     the `notes` and `beds` body text below the carousel.
  const showAvailabilityPill =
    lodging.availability === 'confirmed-aug-16-20' ||
    lodging.availability === 'sold-out-or-unavailable';
  const pillRow = h(
    'ul',
    { class: 'card__pills', 'aria-label': 'At a glance' },
    h('li', { class: 'card__pill' }, `🛏 ${bedsShort}`),
    h('li', { class: 'card__pill' }, `🚪 ${lodging.bedrooms}`),
    h('li', { class: 'card__pill' }, `${kitchenEmoji} ${kitchenLabel}`),
    h(
      'li',
      { class: 'card__pill' },
      `${viewEmoji} ${natureLabel}${sunsetBonus}`
    ),
    ...amenityPills,
    h(
      'li',
      { class: 'card__pill card__pill--reviews' },
      `⭐ ${reviewsPillScore}`,
      h('span', { class: 'card__pill-count' }, reviewsPillCount)
    ),
    h('li', { class: 'card__pill' }, `${tierEmoji} ${lodging.pricePerNight}`),
    showAvailabilityPill
      ? h(
          'li',
          { class: `card__pill card__pill--${availabilityPillKind}` },
          `📅 ${AVAILABILITY_LABELS[lodging.availability]}`
        )
      : null,
    lodging.kosherCookingFit === false
      ? h(
          'li',
          { class: 'card__pill card__pill--bad' },
          '🚫 No real kitchen — won\'t work for cook-in'
        )
      : null,
    // Free-cancellation per-card pill (May 17, 2026 — Allison's booking-
    // discipline ask). Renders ONLY when we have a definitive answer.
    //   - 'no'  → red bad pill (warn the reader before they get attached)
    //   - 'yes' → green good pill (matches the filter chip's promise)
    //   - 'unknown' / omitted → render NOTHING (don't add visual noise for
    //     missing data — fail-loud rule, no fake confidence).
    lodging.freeCancellation === 'no'
      ? h(
          'li',
          { class: 'card__pill card__pill--bad' },
          '🚫 No free cancellation'
        )
      : lodging.freeCancellation === 'yes'
        ? h(
            'li',
            { class: 'card__pill card__pill--good' },
            '✓ Free cancellation'
          )
        : null
  );

  // Nature proximity line — prominent.
  const natureRow = h(
    'p',
    { class: `card__nature card__nature--${lodging.natureTag}` },
    h('strong', {}, `${natureLabel}: `),
    lodging.nature
  );

  // Sunset row.
  const sunsetRow =
    lodging.sunset && lodging.sunset.worth !== 'no'
      ? h(
          'p',
          {
            class: `card__sunset card__sunset--${lodging.sunset.worth}`,
          },
          h(
            'span',
            { class: `badge badge--${lodging.sunset.worth === 'yes' ? 'good' : 'info'} card__sunset-badge` },
            lodging.sunset.worth === 'yes' ? 'Sunset' : 'Sunset · maybe'
          ),
          ' ',
          h('span', { class: 'card__sunset-note' }, lodging.sunset.note)
        )
      : null;

  // Review row.
  const r = lodging.reviews;
  const reviewRow =
    r.score === 'N/A'
      ? null
      : h(
          'div',
          { class: 'card__reviews' },
          h(
            'div',
            { class: 'card__reviews-primary' },
            h('span', { class: 'card__reviews-score' }, r.score),
            h('span', { class: 'card__reviews-count' }, r.count),
            h('span', { class: 'card__reviews-source' }, ` · ${r.source}`)
          ),
          r.secondScore
            ? h(
                'div',
                { class: 'card__reviews-secondary' },
                h('span', { class: 'card__reviews-secondary-score' }, r.secondScore ?? ''),
                ' · ',
                h('span', { class: 'card__reviews-secondary-count' }, r.secondCount ?? ''),
                ` ${r.secondSource ?? ''}`
              )
            : null,
          h('span', { class: 'card__reviews-as-of' }, `Verified ${r.asOf}`)
        );
  const reviewHighlights = r.highlights
    ? h('p', { class: 'card__review-highlights' }, r.highlights)
    : null;

  // Pick button — Wave 3.
  const isPicked = shortlist.has(lodging.id);
  const pickBtn = h(
    'button',
    {
      type: 'button',
      class: isPicked ? 'pick-btn pick-btn--picked' : 'pick-btn',
      'data-lodging-id': lodging.id,
      'aria-pressed': isPicked ? 'true' : 'false',
    },
    isPicked ? '✓ Picked' : '✓ Pick'
  );
  pickBtn.addEventListener('click', () => {
    togglePick(lodging.id);
  });

  return h(
    'article',
    {
      class: `card lodging-card lodging-card--${lodging.tier}${inPath ? ' lodging-card--in-path' : ''}${isPicked ? ' lodging-card--picked' : ''}`,
      'data-vibe': lodging.vibe,
      'data-lodging-id': lodging.id,
      'data-nature': lodging.natureTag,
    },
    renderCarousel(lodging),
    h(
      'header',
      { class: 'card__header' },
      h('h3', { class: 'card__title' }, lodging.name),
      h(
        'div',
        { class: 'card__badges' },
        inPath ? badge('In this path', 'good') : null,
        pickBtn
      )
    ),
    pillRow,
    h('p', { class: 'card__address' }, lodging.address),
    lodging.phone ? h('p', { class: 'card__phone' }, lodging.phone) : null,
    notFitBlock,
    natureRow,
    reviewRow,
    reviewHighlights,
    h('p', { class: 'card__extras' }, h('strong', {}, 'Worth noting: '), lodging.extras),
    sunsetRow,
    isTownCenter
      ? h(
          'p',
          { class: 'card__tradeoff' },
          'Walkable to dinner, not woods-set — tradeoff vs nature-immersed picks.'
        )
      : null,
    h(
      'dl',
      { class: 'card__facts' },
      h('dt', {}, 'Type'),
      h('dd', {}, lodging.type),
      h('dt', {}, '$/night'),
      h('dd', {}, lodging.pricePerNight),
      h('dt', {}, 'Location'),
      h('dd', {}, lodging.distance)
    ),
    renderDriveMatrix(lodging),
    h('p', { class: 'card__note' }, lodging.notes),
    lodging.bookingUrl
      ? h(
          'p',
          { class: 'card__cta' },
          h(
            'a',
            { class: 'card__cta-link', href: lodging.bookingUrl, rel: 'noopener', target: '_blank' },
            'Booking link'
          )
        )
      : null,
    lodging.bookingHint ? h('p', { class: 'card__hint' }, lodging.bookingHint) : null
  );
}

function byTier(lodgings: Lodging[], tier: LodgingTier): Lodging[] {
  return lodgings.filter((l) => l.tier === tier);
}

function renderPanel(
  id: string,
  title: string,
  lodgings: Lodging[],
  base: 'west' | 'east',
  pathLodgingIds: Set<string> | null
): HTMLElement {
  // Apply chip filters FIRST. Then path filter. Then tier grouping.
  const filtered = lodgings.filter((l) => lodgingMatchesFilters(l, base));

  const fitsBrief = sortByNature(byTier(filtered, 'fits-brief'));
  const splurge = sortByNature(byTier(filtered, 'splurge'));
  const notFit = byTier(filtered, 'not-a-fit');
  const basic = byTier(filtered, 'budget-or-basic');
  const notes = byTier(filtered, 'note');

  const inPath = (lid: string) => (pathLodgingIds ? pathLodgingIds.has(lid) : false);
  const visibleFits = pathLodgingIds
    ? fitsBrief.filter((l) => inPath(l.id))
    : fitsBrief;
  const offPathFits = pathLodgingIds
    ? fitsBrief.filter((l) => !inPath(l.id))
    : [];

  const totalShown = filtered.length;

  const emptyState =
    totalShown === 0
      ? h(
          'p',
          { class: 'lodging-empty' },
          'No properties on this side match your filters. ',
          h(
            'button',
            {
              type: 'button',
              class: 'lodging-empty__clear',
              'data-action': 'clear-filters',
            },
            'Clear filters'
          )
        )
      : null;

  const fitsBriefGrid = h(
    'div',
    { class: 'card-grid' },
    ...visibleFits.map((l) => renderLodgingCard(l, inPath(l.id)))
  );

  const offPathBlock =
    offPathFits.length > 0
      ? h(
          'details',
          { class: 'disclosure' },
          h(
            'summary',
            { class: 'disclosure__summary' },
            `Other Terra Nova-tier options on this corridor (${offPathFits.length})`
          ),
          h(
            'p',
            { class: 'disclosure__lede' },
            'Not part of the selected path\'s default plan but bookable here too. Same 2-beds + nature-first sort applies.'
          ),
          h(
            'div',
            { class: 'card-grid' },
            ...offPathFits.map((l) => renderLodgingCard(l, false))
          )
        )
      : null;

  const splurgeBlock =
    splurge.length > 0
      ? h(
          'details',
          { class: 'disclosure' },
          h(
            'summary',
            { class: 'disclosure__summary' },
            `Splurge options (${splurge.length})`
          ),
          h(
            'div',
            { class: 'card-grid' },
            ...splurge.map((l) => renderLodgingCard(l, inPath(l.id)))
          )
        )
      : null;

  // Lodging Owner pass (2026-05-17): not-a-fit properties used to render
  // full cards (carousel + drive matrix + pills). Reader bandwidth wasted
  // on transparency-only entries. Now collapsed into a single summary list
  // — name + 1-line reason + booking link. If reader wants the full card,
  // there's a "show full cards" toggle inside the disclosure.
  const notFitBlock =
    notFit.length > 0
      ? h(
          'details',
          { class: 'disclosure disclosure--not-fit' },
          h(
            'summary',
            { class: 'disclosure__summary' },
            `Not a fit — under 2 beds or no kitchen (${notFit.length})`
          ),
          h(
            'p',
            { class: 'disclosure__lede' },
            'These properties exist on this corridor but don\'t meet the 2-beds + kosher-cook-in brief. Listed by name so the shortlist above is transparent.'
          ),
          h(
            'ul',
            { class: 'not-fit-list' },
            ...notFit.map((l) =>
              h(
                'li',
                { class: 'not-fit-list__item' },
                h(
                  'div',
                  { class: 'not-fit-list__head' },
                  l.bookingUrl
                    ? h(
                        'a',
                        {
                          class: 'not-fit-list__name',
                          href: l.bookingUrl,
                          rel: 'noopener',
                          target: '_blank',
                        },
                        l.name
                      )
                    : h('span', { class: 'not-fit-list__name' }, l.name),
                  h(
                    'span',
                    { class: 'not-fit-list__price' },
                    `${l.pricePerNight} · ${l.beds}`
                  )
                ),
                h(
                  'p',
                  { class: 'not-fit-list__reason' },
                  l.notFitReason ?? 'Single-bed configuration only.'
                )
              )
            )
          )
        )
      : null;

  const basicBlock =
    basic.length > 0
      ? h(
          'details',
          { class: 'disclosure' },
          h(
            'summary',
            { class: 'disclosure__summary' },
            `Cheaper / more basic options (${basic.length})`
          ),
          h(
            'div',
            { class: 'card-grid' },
            ...basic.map((l) => renderLodgingCard(l, false))
          )
        )
      : null;

  const notesBlock =
    notes.length > 0
      ? h(
          'details',
          { class: 'disclosure' },
          h(
            'summary',
            { class: 'disclosure__summary' },
            `Status notes (${notes.length})`
          ),
          h(
            'div',
            { class: 'card-grid' },
            ...notes.map((l) => renderLodgingCard(l, false))
          )
        )
      : null;

  return h(
    'div',
    {
      class: 'tab-panel',
      id: `lodging-panel-${id}`,
      role: 'tabpanel',
      'aria-labelledby': `lodging-tab-${id}`,
    },
    h('h3', { class: 'tab-panel__title' }, title),
    h(
      'p',
      { class: 'section__lede' },
      pathLodgingIds
        ? `${visibleFits.length} option${visibleFits.length === 1 ? '' : 's'} in the selected path. Nature-immersed picks lead; town-center picks are flagged. Other Terra Nova-tier picks on this corridor sit below.`
        : `Spacious, a little nicer than basic, ~$200-300 — Terra Nova tier. ${fitsBrief.length} cabin option${fitsBrief.length === 1 ? '' : 's'} that meet the 2-beds requirement. Nature-immersed picks lead; town-center picks are flagged.`
    ),
    emptyState,
    fitsBriefGrid,
    offPathBlock,
    splurgeBlock,
    notFitBlock,
    basicBlock,
    notesBlock
  );
}

// ====================================================================
// FILTER CHIP BAR
// ====================================================================

interface ChipDef {
  key: string;
  label: string;
  group: 'base' | 'tier' | 'beds' | 'kitchen' | 'nature' | 'sunset' | 'cancel';
  isActive: () => boolean;
  toggle: () => void;
}

function buildChipDefs(): ChipDef[] {
  const chips: ChipDef[] = [];

  // Base
  for (const v of ['west', 'east'] as const) {
    chips.push({
      key: `base-${v}`,
      label: v === 'west' ? 'West side' : 'East side',
      group: 'base',
      isActive: () => filters.base.has(v),
      toggle: () => {
        if (filters.base.has(v)) filters.base.delete(v);
        else filters.base.add(v);
        notifyFilters();
      },
    });
  }

  // Tier
  const tierLabels: Record<'lean' | 'standard' | 'mid-high', string> = {
    lean: 'Lean (<$200)',
    standard: 'Standard ($200-300)',
    'mid-high': 'Mid-high ($300+)',
  };
  for (const v of ['lean', 'standard', 'mid-high'] as const) {
    chips.push({
      key: `tier-${v}`,
      label: tierLabels[v],
      group: 'tier',
      isActive: () => filters.tier.has(v),
      toggle: () => {
        if (filters.tier.has(v)) filters.tier.delete(v);
        else filters.tier.add(v);
        notifyFilters();
      },
    });
  }

  // Beds
  chips.push({
    key: 'beds-min2',
    label: '2 beds min',
    group: 'beds',
    isActive: () => filters.bedsMin2,
    toggle: () => {
      filters.bedsMin2 = !filters.bedsMin2;
      notifyFilters();
    },
  });

  // Kitchen
  const kitchenLabels = { full: 'Full kitchen', kitchenette: 'Kitchenette', none: 'No kitchen' } as const;
  for (const v of ['full', 'kitchenette', 'none'] as const) {
    chips.push({
      key: `kitchen-${v}`,
      label: kitchenLabels[v],
      group: 'kitchen',
      isActive: () => filters.kitchen.has(v),
      toggle: () => {
        if (filters.kitchen.has(v)) filters.kitchen.delete(v);
        else filters.kitchen.add(v);
        notifyFilters();
      },
    });
  }

  // Nature — trimmed 2026-05-17 (Allison's call): keep lakeside / riverside /
  // woods only. Dropped mountain-view, ranch-acreage, town-center (less
  // differentiating for her preference set). Drops 3 chips.
  const natureChips: NatureTag[] = ['lakeside', 'riverside', 'woods'];
  for (const v of natureChips) {
    chips.push({
      key: `nature-${v}`,
      label: NATURE_LABELS[v],
      group: 'nature',
      isActive: () => filters.nature.has(v),
      toggle: () => {
        if (filters.nature.has(v)) filters.nature.delete(v);
        else filters.nature.add(v);
        notifyFilters();
      },
    });
  }

  // Sunset chip removed 2026-05-17 (Allison's call): "drop sunset/path
  // overlap". Sunset-having lodging is still surfaced via the per-card
  // sunset row + sorted naturally — just not a filter anymore.

  // Free-cancellation toggle — added 2026-05-17 evening per Allison's
  // booking-discipline ask. Default OFF (don't gatekeep while research
  // data is still landing). When ON, narrows to freeCancellation === 'yes'
  // ONLY. Lives in its own group ('cancel') so the visual hierarchy stays
  // legible — it's a hard booking-policy filter, not a property attribute
  // like setting or kitchen.
  chips.push({
    key: 'cancel-free-only',
    label: '✓ Free cancellation',
    group: 'cancel',
    isActive: () => filters.freeCancelOnly,
    toggle: () => {
      filters.freeCancelOnly = !filters.freeCancelOnly;
      notifyFilters();
    },
  });

  return chips;
}

function renderChipBar(): HTMLElement {
  const chips = buildChipDefs();
  const groupOrder: ChipDef['group'][] = ['base', 'tier', 'beds', 'kitchen', 'nature', 'cancel'];
  const groupLabels: Record<ChipDef['group'], string> = {
    base: 'Base',
    tier: 'Price tier',
    beds: 'Beds',
    kitchen: 'Kitchen',
    nature: 'Setting',
    sunset: 'Bonus',
    cancel: 'Cancellation',
  };

  const groups = groupOrder.map((g) => {
    const groupChips = chips.filter((c) => c.group === g);
    const buttons = groupChips.map((c) =>
      h(
        'button',
        {
          type: 'button',
          class: c.isActive() ? 'chip chip--active' : 'chip',
          'aria-pressed': c.isActive() ? 'true' : 'false',
          'data-chip-key': c.key,
        },
        c.label
      )
    );
    return h(
      'div',
      { class: 'chip-group', 'data-group': g },
      h('span', { class: 'chip-group__label' }, groupLabels[g]),
      h('div', { class: 'chip-group__chips' }, ...buttons)
    );
  });

  const count = activeFilterCount();
  const clearBtn = h(
    'button',
    {
      type: 'button',
      class: count > 0 ? 'chip-clear chip-clear--visible' : 'chip-clear',
      'data-action': 'clear-filters',
    },
    `Clear filters (${count})`
  );

  // Showing-count pill — Booking.com "X of Y showing" affordance. Updates
  // live when filters change via updateChipBar().
  const showingCount = currentShowingCount();
  const totalCount = WEST_LODGING.length + EAST_LODGING.length;
  const showingPill = h(
    'span',
    {
      class: 'chip-showing',
      'data-showing-pill': 'true',
      'aria-live': 'polite',
    },
    `${showingCount} of ${totalCount} showing`
  );

  const bar = h(
    'div',
    { class: 'chip-bar', role: 'group', 'aria-label': 'Filter properties' },
    h(
      'div',
      { class: 'chip-bar__head' },
      h('p', { class: 'chip-bar__lede' }, 'Tap chips to narrow. Empty = show all.'),
      showingPill
    ),
    h('div', { class: 'chip-bar__groups' }, ...groups),
    clearBtn
  );

  // Delegated click handler
  bar.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLButtonElement)) return;
    if (target.dataset['action'] === 'clear-filters') {
      filters.base.clear();
      filters.tier.clear();
      filters.bedsMin2 = false;
      filters.kitchen.clear();
      filters.nature.clear();
      filters.sunsetOnly = false;
      filters.freeCancelOnly = false;
      notifyFilters();
      return;
    }
    const key = target.dataset['chipKey'];
    if (!key) return;
    const def = chips.find((c) => c.key === key);
    if (def) def.toggle();
  });

  return bar;
}

function updateChipBar(bar: HTMLElement): void {
  const chips = buildChipDefs();
  const buttons = bar.querySelectorAll<HTMLButtonElement>('button.chip');
  buttons.forEach((btn) => {
    const key = btn.dataset['chipKey'];
    const def = chips.find((c) => c.key === key);
    if (!def) return;
    const active = def.isActive();
    btn.classList.toggle('chip--active', active);
    btn.setAttribute('aria-pressed', active ? 'true' : 'false');
  });
  const count = activeFilterCount();
  const clearBtn = bar.querySelector<HTMLButtonElement>('button.chip-clear');
  if (clearBtn) {
    clearBtn.classList.toggle('chip-clear--visible', count > 0);
    clearBtn.textContent = `Clear filters (${count})`;
  }
  // Refresh the "X of Y showing" pill.
  const showingPill = bar.querySelector<HTMLElement>('[data-showing-pill="true"]');
  if (showingPill) {
    const total = WEST_LODGING.length + EAST_LODGING.length;
    showingPill.textContent = `${currentShowingCount()} of ${total} showing`;
  }
}

// ====================================================================
// SHORTLIST PANEL
// ====================================================================

function allLodgings(): Lodging[] {
  return [...WEST_LODGING, ...EAST_LODGING];
}

function pricePerNightLow(l: Lodging): number {
  const m = l.pricePerNight.match(/\$(\d+)/);
  return m ? parseInt(m[1] ?? '0', 10) : 0;
}

function renderShortlistPanel(): HTMLElement {
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

function renderShortlistContainer(): HTMLElement {
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

function renderShortlistFloater(): HTMLElement {
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

// ====================================================================
// PANEL DETERMINATION (unchanged from Wave 2)
// ====================================================================

function determinePanels(selectedId: string | null): {
  showWest: boolean;
  showEast: boolean;
  westLabel: string;
  eastLabel: string;
} {
  if (!selectedId) {
    return { showWest: true, showEast: true, westLabel: 'West · Nights 1-2', eastLabel: 'East · Nights 3-4' };
  }
  const path = getPathById(selectedId as 'A' | 'B' | 'C');
  if (!path) {
    return { showWest: true, showEast: true, westLabel: 'West', eastLabel: 'East' };
  }
  if (path.id === 'A') return { showWest: true, showEast: false, westLabel: 'West · all 4 nights', eastLabel: 'East · not in this path' };
  if (path.id === 'B') return { showWest: true, showEast: true, westLabel: 'West · Nights 1-2', eastLabel: 'East · Nights 3-4' };
  return { showWest: true, showEast: true, westLabel: 'West · Night 1', eastLabel: 'East · Nights 2-4' };
}

// ====================================================================
// MAIN RENDER + WIRE-UP
// ====================================================================

function renderBody(wrap: HTMLElement, selectedId: string | null): void {
  const panels = determinePanels(selectedId);
  const path = selectedId ? getPathById(selectedId as 'A' | 'B' | 'C') : null;
  const pathLodgingIds = path ? new Set(path.lodgingIds) : null;

  const tabs = wrap.querySelector<HTMLElement>('.tabs');
  const westTabBtn = wrap.querySelector<HTMLButtonElement>('#lodging-tab-west');
  const eastTabBtn = wrap.querySelector<HTMLButtonElement>('#lodging-tab-east');
  if (westTabBtn) westTabBtn.textContent = panels.westLabel;
  if (eastTabBtn) eastTabBtn.textContent = panels.eastLabel;
  if (eastTabBtn) {
    eastTabBtn.disabled = !panels.showEast;
    eastTabBtn.classList.toggle('tab--disabled', !panels.showEast);
  }

  const westPanel = renderPanel(
    'west',
    'West side — Marblemount / Rockport / Concrete',
    WEST_LODGING,
    'west',
    pathLodgingIds
  );
  const eastPanel = renderPanel(
    'east',
    'East side — Winthrop / Mazama',
    EAST_LODGING,
    'east',
    pathLodgingIds
  );

  const defaultSide = path?.id === 'A' ? 'west' : path?.id === 'C' ? 'east' : 'west';
  eastPanel.hidden = defaultSide !== 'east';
  westPanel.hidden = defaultSide !== 'west';

  if (tabs) {
    const allTabs = tabs.querySelectorAll<HTMLButtonElement>('.tab');
    allTabs.forEach((t) => {
      const active = t.dataset['target'] === defaultSide;
      t.classList.toggle('tab--active', active);
      t.setAttribute('aria-selected', active ? 'true' : 'false');
    });
  }

  const container = wrap.querySelector<HTMLElement>('.lodging-panels');
  if (container) {
    container.replaceChildren(westPanel, eastPanel);
    // Empty-state clear-filters delegate
    container.addEventListener('click', (event) => {
      const target = event.target;
      if (target instanceof HTMLButtonElement && target.dataset['action'] === 'clear-filters') {
        filters.base.clear();
        filters.tier.clear();
        filters.bedsMin2 = false;
        filters.kitchen.clear();
        filters.nature.clear();
        filters.sunsetOnly = false;
        filters.freeCancelOnly = false;
        notifyFilters();
      }
    });
  }

  const gist = wrap.querySelector<HTMLElement>('.gist');
  if (gist) {
    gist.replaceChildren(
      h(
        'li',
        { class: 'gist__item' },
        path
          ? `Filtered to ${path.name}: ${path.lodgingShape}.`
          : 'Two bases — west side (Marblemount/Rockport, Nights 1-2) and east side (Winthrop/Mazama, Nights 3-4).'
      ),
      h(
        'li',
        { class: 'gist__item' },
        h('strong', {}, 'Filter chips above narrow the list.'),
        ' Tap ',
        h('strong', {}, '✓ Pick'),
        ' on cards to build a shortlist · compare table appears below.'
      ),
      h(
        'li',
        { class: 'gist__item' },
        'Each card has a photo carousel + a drive-time matrix (tap to expand). 2 beds, 1-2 bedrooms, ~$200-300 — Terra Nova tier.'
      )
    );
  }

  if (tabs) {
    const newTabs = tabs.cloneNode(true) as HTMLElement;
    tabs.replaceWith(newTabs);
    newTabs.addEventListener('click', (event) => {
      const target = event.target;
      if (!(target instanceof HTMLButtonElement)) return;
      if (target.disabled) return;
      const side = target.dataset['target'];
      if (side !== 'west' && side !== 'east') return;
      const allTabs = newTabs.querySelectorAll<HTMLButtonElement>('.tab');
      allTabs.forEach((t) => {
        const active = t.dataset['target'] === side;
        t.classList.toggle('tab--active', active);
        t.setAttribute('aria-selected', active ? 'true' : 'false');
      });
      westPanel.hidden = side !== 'west';
      eastPanel.hidden = side !== 'east';
    });
  }
}

// ====================================================================
// SEARCH-GUIDE SECTION — "How to search for lodging here"
// ====================================================================
//
// Allison's ask (May 17, 2026 via the live site notes widget):
//   *"send best practice agent here how to search where to sleep and just
//   get info on sleeping in this area this kid of trip."*
//
// Goal: between hero and the cards, give Erin (and anyone reading) a
// scannable best-practice playbook for finding lodging for THIS kind of
// trip — US national park gateway, August peak, kosher cook-in, 2 women,
// mid-tier (~$200-300/night). NOT a wall of prose. Bullet-heavy.
// Mobile-first (Pixel 7 Pro XL 412×892).
//
// Closes with a bridge: "Our shortlist below is the result of this
// search." — so it sets up the cards instead of competing with them.
//
// Deeper research log + sources live at
//   projects/north-cascades-2026/LODGING_SEARCH_RESEARCH_2026-05-17.md
// (in the private second-brain repo — not shipped to the site).

interface SearchTipGroup {
  id: string;
  title: string;
  intro?: string;
  bullets: { lead: string; rest: string }[];
}

const SEARCH_GUIDE_GROUPS: SearchTipGroup[] = [
  {
    id: 'where',
    title: 'Where to search — ranked for North Cascades',
    intro:
      'Most of the cabin inventory here lives on small property sites, not aggregators. Use multiple surfaces or you will miss things.',
    bullets: [
      {
        lead: 'Direct property sites first.',
        rest: '60-70% of the Marblemount/Mazama/Winthrop cabin inventory is direct-site-only. Usually cheaper than aggregators and the owner writes the copy, so kitchen detail is more honest.',
      },
      {
        lead: 'Google Maps "Lodging" layer.',
        rest: 'Underrated. Pan the map along WA-20 — surfaces tiny mom-and-pop cabins that do not pay for Booking/Airbnb visibility.',
      },
      {
        lead: 'Booking.com.',
        rest: 'Thin inventory both sides of the park, but the filters are the cleanest. Use "kitchen" (read: full), "free cancellation", review count ≥ 50, score ≥ 9.0.',
      },
      {
        lead: 'Airbnb.',
        rest: 'Best signal for cabin-style. Filter "entire home" + "kitchen" + Superhost. Watch the cleaning fee — it can double the effective nightly rate.',
      },
      {
        lead: 'VRBO.',
        rest: 'Similar to Airbnb, skewed older / larger groups, sometimes cheaper. Worth a parallel pass on the same dates.',
      },
      {
        lead: 'HipCamp.',
        rest: 'Tent-cabins, yurts, unique stays (e.g. Rolling Huts in Mazama). Outdoor-skewing — only if you want that vibe.',
      },
      {
        lead: 'Reddit + WTA forums.',
        rest: 'r/NationalParks, r/Seattle, r/WTA threads from the last 2-3 years are gold for under-the-radar picks and which lodges let you start hiking before checkout.',
      },
    ],
  },
  {
    id: 'kitchen',
    title: 'Filter for: a real kitchen (kosher cook-in)',
    intro:
      'Both of us keep kosher and the plan is cook-in. A kitchenette is NOT a kitchen — read carefully.',
    bullets: [
      {
        lead: 'Whole-house rentals = almost always full kitchens.',
        rest: 'B&Bs and roadside motels almost never. Cabin resorts are 50/50 — verify per unit, not per property.',
      },
      {
        lead: 'Demand actual kitchen photos.',
        rest: 'Not just "kitchen amenities" checkbox. No photo = probably not full. Marketing copy lies; pixels do not.',
      },
      {
        lead: 'Read for: oven, full fridge, stovetop, pots/pans/utensils.',
        rest: 'Some "kitchens" are stovetop-only. Some are mini-fridge + microwave. "Apartment-sized" (e.g. Freestone) is real but tight — fine for simple cooking, cramped for two people prepping.',
      },
      {
        lead: 'Call before booking.',
        rest: 'Script: "I need a full kitchen — oven, stovetop, full fridge, basic pots and pans. Is that what your [cabin name] has, or is it more of a kitchenette?" Owners will tell you straight.',
      },
      {
        lead: 'Ignore aggregator badges.',
        rest: 'Airbnb "Wow! Worthy" and Booking "Genius" do NOT correlate with kitchen quality. Different signal entirely.',
      },
    ],
  },
  {
    id: 'nature',
    title: 'Filter for: nature-near + sunset',
    intro:
      'Allison stays up later than Erin — sunset-having lodging is a real bonus for the solo wind-down.',
    bullets: [
      {
        lead: 'Lakeside + "west-facing".',
        rest: 'Cross-check on Google Maps satellite — confirm the porch actually faces west. Lakeside listings sometimes face north or east.',
      },
      {
        lead: 'Methow River cabins face east most of the day.',
        rest: 'River runs north-south; sunset is behind the property, not over the water. Still pretty, just not a sunset-over-river shot.',
      },
      {
        lead: 'Patterson Lake (Sun Mountain area) = cleanest east-side sunset-over-lake.',
        rest: 'Diablo Lake and Ross Lake have no traditional lodging — Ross Lake Resort is water-taxi-access only.',
      },
      {
        lead: 'Woods-set ≠ view.',
        rest: 'Forest cabins often have no sky. If sunset matters, prioritize "meadow", "ridge", "lake-front" over "tucked in trees".',
      },
    ],
  },
  {
    id: 'trust',
    title: 'Trust-signal checklist',
    bullets: [
      {
        lead: 'Review count ≥ 50.',
        rest: 'Fewer than that is noise. Pair with score ≥ 9.0 (Booking) or 4.7 (Airbnb).',
      },
      {
        lead: 'Most recent review within 3 months.',
        rest: 'Means the listing is actively maintained, not a ghost.',
      },
      {
        lead: 'Owner responds to negative reviews.',
        rest: 'Bonus if they fix the issue. Red flag if they argue or ignore.',
      },
      {
        lead: 'Photos updated within ~2 years.',
        rest: 'Look for dated finishes (granite countertops in 2010 photos = no update since). Renovation photos are a good sign.',
      },
      {
        lead: 'Cancellation policy: free until 7 days out, minimum.',
        rest: 'North Cascades weather + WA-20 closure risk is real — book flex.',
      },
    ],
  },
];

function renderSearchGuideGroup(group: SearchTipGroup): HTMLElement {
  return h(
    'section',
    { class: 'search-guide__group', 'data-group': group.id },
    h('h3', { class: 'search-guide__group-title' }, group.title),
    group.intro
      ? h('p', { class: 'search-guide__group-intro' }, group.intro)
      : null,
    h(
      'ul',
      { class: 'search-guide__list' },
      ...group.bullets.map((b) =>
        h(
          'li',
          { class: 'search-guide__item' },
          h('strong', { class: 'search-guide__lead' }, b.lead),
          ' ',
          h('span', { class: 'search-guide__rest' }, b.rest)
        )
      )
    )
  );
}

export function renderLodgingSearchGuide(): HTMLElement {
  // Lodging Owner pass 2026-05-17: section moved BELOW the cards + collapsed
  // by default. Reader who wants the playbook taps to expand; reader who just
  // wants the shortlist sees cards immediately. Bridge sentence removed (no
  // longer points "below" since cards are above).
  const intro = h(
    'p',
    { class: 'search-guide__intro' },
    'Same playbook we used to build the shortlist above. Read it if you want to sanity-check our picks, or save it for the next trip.'
  );

  const bookingWindow = h(
    'aside',
    { class: 'search-guide__note search-guide__note--info' },
    h('h3', { class: 'search-guide__note-title' }, 'When to book'),
    h(
      'p',
      {},
      'Now (May 2026) is the sweet spot for August. Peak inventory is roughly 30-50% sold but prices have not surged. ',
      'Marblemount/Newhalem has ~6 properties total, all west-side — books first. ',
      'Mazama/Winthrop has ~20 — more flex, but the marquee picks (Sun Mountain, Freestone, Inn at Mazama) book early for August. ',
      'Sun-Wed mid-week (our trip) is easier than Fri-Sat. If WA-20 reopens July 4 there will be a booking surge — get in before then.'
    )
  );

  const contingency = h(
    'aside',
    { class: 'search-guide__note search-guide__note--warn' },
    h('h3', { class: 'search-guide__note-title' }, 'WA-20 contingency'),
    h(
      'p',
      {},
      'WA-20 through the park is closed for storm-damage repair, target reopen July 4 (a goal, not a promise). ',
      'If you book a west-side primary, hold an east-side backup with free cancellation — and vice versa. ',
      'Direct property cancellation policies tend to be more generous than aggregator policies for small lodges. ',
      'CFAR (Cancel For Any Reason) trip insurance is the only flavor worth considering for this specific risk; default aggregator insurance excludes road closures.'
    )
  );

  // Wrap the entire body in <details> so it collapses by default.
  const body = h(
    'details',
    { class: 'search-guide-details' },
    h(
      'summary',
      { class: 'search-guide-details__summary' },
      'Open the search playbook (when, where, how — for next time too)'
    ),
    intro,
    h(
      'div',
      { class: 'search-guide__groups' },
      ...SEARCH_GUIDE_GROUPS.map(renderSearchGuideGroup)
    ),
    h('div', { class: 'search-guide__notes' }, bookingWindow, contingency)
  );

  return section('lodging-search-guide', 'How to search for lodging here', body);
}

export function renderLodging(): HTMLElement {
  const tabs = h(
    'div',
    { class: 'tabs', role: 'tablist', 'aria-label': 'Lodging side' },
    h(
      'button',
      {
        class: 'tab tab--active',
        type: 'button',
        role: 'tab',
        id: 'lodging-tab-west',
        'aria-selected': 'true',
        'aria-controls': 'lodging-panel-west',
        'data-target': 'west',
      },
      'West · Nights 1-2'
    ),
    h(
      'button',
      {
        class: 'tab',
        type: 'button',
        role: 'tab',
        id: 'lodging-tab-east',
        'aria-selected': 'false',
        'aria-controls': 'lodging-panel-east',
        'data-target': 'east',
      },
      'East · Nights 3-4'
    )
  );

  const sourceStrip = h(
    'ul',
    { class: 'source-strip', 'aria-label': 'Data sources' },
    h('li', { class: 'source-pill' }, 'Booking.com · live'),
    h('li', { class: 'source-pill' }, 'Vrbo · live'),
    h('li', { class: 'source-pill' }, 'Airbnb · live'),
    h('li', { class: 'source-pill source-pill--warn' }, 'Photos partly representative')
  );
  // Lodging Owner pass (2026-05-17): page-level disclaimer absorbs the
  // pills that used to repeat on every card: ✅ Verified May 2026, ⚠️ Verify
  // beds at booking, 📅 Aug 16-20: verify. Surfacing once instead of 19x.
  const sourceNote = h(
    'p',
    {
      style:
        'font-size: 0.78rem; color: var(--c-ink-500); margin: 0 0 var(--sp-4); line-height: 1.5;',
    },
    h('strong', {}, '✅ Verified May 2026.'),
    ' Review scores + prices searched live for Aug 16-20, 2026 dates. ',
    h('strong', {}, '⚠️ Multi-unit properties: confirm bed configuration at booking'),
    ' — cabin layouts vary by unit type, lodge rooms often differ from cabins. ',
    h('strong', {}, '📅 Aug 16-20 availability:'),
    ' verify on the booking site, supply fluctuates. ',
    'Some non-primary carousel photos are stock or regional context — see booking links for actual property photos.'
  );

  const chipBar = renderChipBar();
  const shortlistContainer = renderShortlistContainer();
  const shortlistFab = renderShortlistFloater();

  const wrap = section(
    'lodging',
    'Lodging',
    h('ul', { class: 'gist' }),
    sourceStrip,
    sourceNote,
    chipBar,
    shortlistContainer,
    tabs,
    h('div', { class: 'lodging-panels' }),
    shortlistFab
  );

  renderBody(wrap, getSelectedPath());

  // Re-render panels when filters change.
  onFilterChange(() => {
    updateChipBar(chipBar);
    renderBody(wrap, getSelectedPath());
  });

  // Re-render panels (so pick states flip) + shortlist + FAB when shortlist changes.
  onShortlistChange(() => {
    // Update FAB
    shortlistFab.classList.toggle('shortlist-fab--visible', shortlist.size > 0);
    const fabCount = shortlistFab.querySelector<HTMLElement>('.shortlist-fab__count');
    if (fabCount) fabCount.textContent = `${shortlist.size}`;

    // Update shortlist panel contents
    const oldPanel = shortlistContainer.querySelector<HTMLElement>(
      '.shortlist-panel'
    );
    if (oldPanel) oldPanel.remove();
    shortlistContainer.appendChild(renderShortlistPanel());
    const summaryCount = shortlistContainer.querySelector<HTMLElement>('.shortlist__count');
    if (summaryCount) summaryCount.textContent = `${shortlist.size}`;

    // Re-render panels so card pick-states flip.
    renderBody(wrap, getSelectedPath());
  });

  subscribeSelectedPath((next) => renderBody(wrap, next));

  return wrap;
}
