/**
 * Lodging filter state — mutable singleton + pub/sub.
 *
 * Extracted 2026-05-17 (Lodging Refactor agent) from the 1,802-line
 * `sections/lodging.ts` god-object. Owns:
 *   - `FilterState` shape + `emptyFilters()` factory
 *   - The `filters` singleton + `filterListeners` array
 *   - `notifyFilters` / `onFilterChange` pub/sub
 *   - Predicates that read this state: `lodgingTierBucket`,
 *     `lodgingHasMin2Beds`, `lodgingMatchesFilters`
 *   - Live counters: `activeFilterCount`, `currentShowingCount`,
 *     `soldOutCount`
 *
 * The filter chip bar (`chip-bar.ts`) and the panel renderer (`index.ts`)
 * both import from here. Mutation goes through `notifyFilters()` so
 * subscribers re-render.
 */

import {
  EAST_LODGING,
  WEST_LODGING,
  type Lodging,
  type NatureTag,
} from '../../data/lodging';

export interface FilterState {
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
  /**
   * Show sold-out lodgings? Default FALSE per Allison May 17, 2026:
   * "WE DONT NEED SOLD OUT DPMT SHOW." Entries with
   * `availability === 'sold-out-or-unavailable'` are hidden by default.
   * The banner above the cards shows "Hiding N sold-out — show all" when N > 0.
   */
  showSoldOut: boolean;
  /**
   * Trust-mode default (Allison May 19, 2026). When TRUE (default), only
   * shows lodgings with `availability === 'confirmed-aug-16-20'` — the
   * picks Allison has personally verified for Aug 16-20. The auto-scrape
   * `'likely-available'` signal proved unreliable (sold-out properties
   * leaking into "likely"), and the 15 `'verify-at-booking'` entries
   * require a phone call before they can be trusted. Toggling this OFF
   * shows everything UNVERIFIED too (still respects showSoldOut for
   * sold-out entries — they stay hidden unless that's also flipped).
   *
   * Her words: trust principle is "only show properties she has
   * personally verified."
   */
  verifiedOnly: boolean;
}

export function emptyFilters(): FilterState {
  return {
    base: new Set(),
    tier: new Set(),
    bedsMin2: false,
    kitchen: new Set(),
    nature: new Set(),
    sunsetOnly: false,
    // Default OFF (2026-05-19 needs-match audit). The intent is correct —
    // Erin's WhatsApp May 18: "if we find something refundable we can book
    // it as a backup" — but ALL 18 current listings are flagged 'no' or
    // 'unknown' (Allison's research today is to populate 'yes' picks). With
    // the chip ON by default, the page renders "0 of 18 showing" and Erin
    // bounces before seeing any cabins. Show the full list; let her opt
    // into refundable narrowing once data is populated. The hero copy now
    // surfaces the refundable preference as text instead of as a hidden gate.
    freeCancelOnly: false,
    showSoldOut: false,
    // Default ON (2026-05-19, Allison's trust principle). Page opens
    // showing ONLY the 4 confirmed Aug-16-20 picks she's personally
    // verified. Banner above the grid invites toggling to see all 15
    // unverified properties. Sold-out (3 entries) stays hidden behind
    // its own showSoldOut toggle even when verifiedOnly is OFF.
    verifiedOnly: true,
  };
}

export const filters: FilterState = emptyFilters();
export const filterListeners: (() => void)[] = [];

export function notifyFilters(): void {
  for (const fn of filterListeners) fn();
}

export function onFilterChange(fn: () => void): void {
  filterListeners.push(fn);
}

/** Reset every filter field in place. Used by Clear-filters + empty-state. */
export function resetFilters(): void {
  filters.base.clear();
  filters.tier.clear();
  filters.bedsMin2 = false;
  filters.kitchen.clear();
  filters.nature.clear();
  filters.sunsetOnly = false;
  filters.freeCancelOnly = false;
  filters.showSoldOut = false;
  // resetFilters returns to the trust-mode default (verifiedOnly ON).
  // "Clear filters" should NOT widen the list to unverified — it should
  // return to the safe baseline.
  filters.verifiedOnly = true;
}

// Tier mapping — parse the pricePerNight string and assign one bucket.
//   lean       = under $200
//   standard   = $200-300
//   mid-high   = $300+
// Heuristic: take the LOWER bound of the price range as the anchor.
export function lodgingTierBucket(l: Lodging): 'lean' | 'standard' | 'mid-high' {
  const match = l.pricePerNight.match(/\$(\d+)/);
  if (!match) return 'standard';
  const low = parseInt(match[1] ?? '0', 10);
  if (low < 200) return 'lean';
  if (low < 300) return 'standard';
  return 'mid-high';
}

export function lodgingHasMin2Beds(l: Lodging): boolean {
  // Heuristic: if `tier === 'not-a-fit'`, the under-2-beds rule already failed.
  // For everything else assume the data is correct.
  return l.tier !== 'not-a-fit';
}

export function lodgingMatchesFilters(l: Lodging, base: 'west' | 'east'): boolean {
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
  // Sold-out is hidden by default. The show-all banner above the grid flips
  // showSoldOut to true so a user can audit what was hidden.
  if (!filters.showSoldOut && l.availability === 'sold-out-or-unavailable') return false;
  // Trust-mode (default ON, Allison 2026-05-19): narrow to ONLY personally
  // verified Aug 16-20 picks. The auto-scrape 'likely-available' signal
  // proved unreliable; 'verify-at-booking' entries need a phone call before
  // they're trustworthy. Toggle OFF (via the "Verified picks only" chip or
  // the banner above the grid) to widen the list to unverified inventory.
  if (filters.verifiedOnly && l.availability !== 'confirmed-aug-16-20') return false;
  return true;
}

/** Live count of sold-out entries (across both bases), regardless of other filters. */
export function soldOutCount(): number {
  return (
    WEST_LODGING.filter((l) => l.availability === 'sold-out-or-unavailable').length +
    EAST_LODGING.filter((l) => l.availability === 'sold-out-or-unavailable').length
  );
}

/**
 * Count of properties currently hidden by the trust-mode toggle — i.e.,
 * non-sold-out entries that are NOT 'confirmed-aug-16-20'. Used to drive
 * the "Show all (N more, need phone-confirmation)" banner copy above the
 * cards. Excludes sold-out (those are tracked separately via soldOutCount).
 */
export function unverifiedHiddenCount(): number {
  const isUnverified = (a: string): boolean =>
    a !== 'confirmed-aug-16-20' && a !== 'sold-out-or-unavailable';
  return (
    WEST_LODGING.filter((l) => isUnverified(l.availability)).length +
    EAST_LODGING.filter((l) => isUnverified(l.availability)).length
  );
}

/** Live count of personally-verified picks (across both bases). */
export function verifiedPickCount(): number {
  return (
    WEST_LODGING.filter((l) => l.availability === 'confirmed-aug-16-20').length +
    EAST_LODGING.filter((l) => l.availability === 'confirmed-aug-16-20').length
  );
}

export function activeFilterCount(): number {
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
export function currentShowingCount(): number {
  const west = WEST_LODGING.filter((l) => lodgingMatchesFilters(l, 'west')).length;
  const east = EAST_LODGING.filter((l) => lodgingMatchesFilters(l, 'east')).length;
  return west + east;
}
