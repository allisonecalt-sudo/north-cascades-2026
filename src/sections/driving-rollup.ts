/**
 * driving-rollup.ts — "All driving on this trip" per-path rollup.
 *
 * Added 2026-05-19 after Allison flagged: "the site needs to make all the
 * driving visible at every level — not just airport-to-base." Previously
 * the travel page only surfaced SEA→Marblemount and BLI→Marblemount.
 *
 * Renders on the travel page below the existing airport-compare strip.
 * Shows:
 *   1. Headline comparison line (Path A vs Path B totals)
 *   2. Per-path rollup cards (heaviest day / lightest day / return-day load)
 *   3. Collapsible per-segment table grouped by Day 1-5
 *
 * Data: `data/driving.ts` (PATH_DRIVING_ROLLUPS, DRIVE_SEGMENTS, helpers).
 */

import {
  DRIVING_HEADLINE_COMPARE,
  PATH_DRIVING_ROLLUPS,
  segmentsByDay,
  type DriveSegment,
  type DriveDayContext,
  type PathDrivingRollup,
} from '../data/driving';
import { GAS, VEHICLE_MPG, fuelCost } from '../data/pricing';
import { h } from '../dom';

const DAY_ORDER: DriveDayContext[] = ['day-1', 'day-2', 'day-3', 'day-4', 'day-5'];

const DAY_LABELS: Record<DriveDayContext, string> = {
  'day-1': 'Day 1 — Setup',
  'day-2': 'Day 2 — First hike',
  'day-3': 'Day 3 — Viewpoints / transit',
  'day-4': 'Day 4 — Second hike',
  'day-5': 'Day 5 — Return to SEA',
};

function statusBadge(seg: DriveSegment): HTMLElement | null {
  if (seg.status === 'gravel') {
    return h('span', { class: 'drive-seg__badge drive-seg__badge--warn' }, '⚠ Gravel');
  }
  if (seg.status === 'wa20-through-only') {
    return h('span', { class: 'drive-seg__badge drive-seg__badge--bad' }, '↻ Needs WA-20 through');
  }
  if (seg.status === 'wa20-and-gravel') {
    return h(
      'span',
      { class: 'drive-seg__badge drive-seg__badge--bad' },
      '↻ Needs WA-20 + gravel'
    );
  }
  return null;
}

function renderRollupCard(rollup: PathDrivingRollup): HTMLElement {
  const isPathA = rollup.pathId === 'A';
  // Gas cost at the trip-anchor price ($5.75/gal) — assume a compact SUV
  // (28 mpg) as the realistic-rental baseline. Split 50/50.
  const fuelLow = fuelCost(rollup.totalMilesLow, VEHICLE_MPG.compactSuv);
  const fuelHigh = fuelCost(rollup.totalMilesHigh, VEHICLE_MPG.compactSuv);
  const fuelHybridLow = fuelCost(rollup.totalMilesLow, VEHICLE_MPG.hybrid);
  const fuelHybridHigh = fuelCost(rollup.totalMilesHigh, VEHICLE_MPG.hybrid);
  return h(
    'article',
    {
      class: `drive-rollup-card drive-rollup-card--path-${rollup.pathId.toLowerCase()}`,
      'aria-label': `Path ${rollup.pathId} driving rollup`,
    },
    h(
      'header',
      { class: 'drive-rollup-card__header' },
      h('span', { class: 'drive-rollup-card__id' }, `Path ${rollup.pathId}`),
      h('h3', { class: 'drive-rollup-card__title' }, isPathA ? 'West-side anchor' : 'Both sides, balanced')
    ),
    h(
      'p',
      { class: 'drive-rollup-card__headline' },
      h('strong', {}, `~${rollup.totalHoursLow.toFixed(0)}-${rollup.totalHoursHigh.toFixed(0)} hr total driving`),
      ' · ',
      `~${rollup.totalMilesLow}-${rollup.totalMilesHigh} mi across 5 days`
    ),
    h(
      'p',
      { class: 'drive-rollup-card__fuel' },
      h('strong', {}, 'Gas: '),
      `~$${fuelLow}-$${fuelHigh} compact SUV @ 28 mpg`,
      h('br', {}),
      h('em', {}, `~$${fuelHybridLow}-$${fuelHybridHigh} if hybrid @ 45 mpg`),
      h('br', {}),
      h('span', { class: 'drive-rollup-card__fuel-note' }, `WA gas $${GAS.tripAnchor}/gal (AAA ${GAS.verifiedOn}). Split 2-ways = ~$${Math.round(fuelLow / 2)}-$${Math.round(fuelHigh / 2)}/person.`)
    ),
    h(
      'dl',
      { class: 'drive-rollup-card__facts' },
      h('dt', {}, 'Heaviest day'),
      h(
        'dd',
        {},
        h('strong', {}, `${rollup.heaviestDay.label} (~${rollup.heaviestDay.hours} hr)`),
        ' — ',
        rollup.heaviestDay.detail
      ),
      h('dt', {}, 'Lightest day'),
      h(
        'dd',
        {},
        h('strong', {}, `${rollup.lightestDay.label} (~${rollup.lightestDay.hours} hr)`),
        ' — ',
        rollup.lightestDay.detail
      ),
      h('dt', {}, 'Day-5 return load'),
      h(
        'dd',
        {},
        h('strong', {}, `~${rollup.returnDay.hours} hr`),
        ' — ',
        rollup.returnDay.detail
      )
    )
  );
}

function renderSegmentRow(seg: DriveSegment): HTMLElement {
  const badge = statusBadge(seg);
  return h(
    'li',
    { class: 'drive-seg' },
    h(
      'div',
      { class: 'drive-seg__head' },
      h('span', { class: 'drive-seg__route' }, `${seg.from} → ${seg.to}`),
      badge
    ),
    h(
      'div',
      { class: 'drive-seg__stats' },
      h('span', { class: 'drive-seg__time' }, seg.drive),
      h('span', { class: 'drive-seg__miles' }, seg.miles),
      h('span', { class: 'drive-seg__road' }, seg.road)
    ),
    h('p', { class: 'drive-seg__note' }, seg.note),
    seg.source
      ? h(
          'p',
          { class: 'drive-seg__source' },
          h(
            'a',
            { href: seg.source.url, target: '_blank', rel: 'noopener noreferrer' },
            seg.source.name,
            ' ↗'
          )
        )
      : null,
    seg.needsVerify ? h('span', { class: 'drive-seg__badge drive-seg__badge--warn' }, '[verify]') : null
  );
}

function renderPathTable(pathId: 'A' | 'B'): HTMLElement {
  const byDay = segmentsByDay(pathId);
  const dayBlocks: HTMLElement[] = [];
  for (const day of DAY_ORDER) {
    const segs = byDay[day];
    if (segs.length === 0) continue;
    dayBlocks.push(
      h(
        'div',
        { class: 'drive-day-block' },
        h('h4', { class: 'drive-day-block__title' }, DAY_LABELS[day]),
        h('ul', { class: 'drive-seg-list' }, ...segs.map(renderSegmentRow))
      )
    );
  }

  return h(
    'details',
    { class: 'disclosure drive-rollup-table' },
    h(
      'summary',
      { class: 'disclosure__summary' },
      `Path ${pathId} — every segment by day`
    ),
    h(
      'p',
      { class: 'disclosure__lede' },
      `Each drive segment in Path ${pathId}, grouped by day. Round-trip drives are noted "(RT)". Times verified against Google Maps May 17, 2026 + NPS for gravel sections; weather-dependent drives flagged in the notes.`
    ),
    h('div', { class: 'drive-rollup-table__body' }, ...dayBlocks)
  );
}

/**
 * Main render — "All driving on this trip" section, intended to mount
 * inside the existing flights section or directly below it on the travel
 * page. Returns a wrapping element (no .section wrapper — the caller
 * decides if it sits inside flights or stands alone).
 */
export function renderDrivingRollup(): HTMLElement {
  return h(
    'div',
    { id: 'driving-rollup', class: 'driving-rollup' },
    h(
      'div',
      { class: 'driving-rollup__head' },
      h('h3', { class: 'driving-rollup__title' }, 'All driving on this trip'),
      h(
        'p',
        { class: 'driving-rollup__headline' },
        DRIVING_HEADLINE_COMPARE
      )
    ),
    h(
      'div',
      { class: 'drive-rollup-cards' },
      ...PATH_DRIVING_ROLLUPS.map(renderRollupCard)
    ),
    h(
      'div',
      { class: 'drive-rollup-tables' },
      ...PATH_DRIVING_ROLLUPS.map((r) => renderPathTable(r.pathId))
    )
  );
}
