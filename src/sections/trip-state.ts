/**
 * trip-state.ts — live "is this trip happening" status strip.
 *
 * What this is: three at-a-glance status tiles on the home page that answer
 * "Is the trip on?" without making the reader open WA-20 status / pre-trip /
 * costs separately. Sits below the path picker, above the deeper content.
 *
 *   1. Days until trip — countdown to Aug 16, 2026. Hard date, falls to "Today"
 *      / "Trip ongoing" / "Trip over" past the trip window.
 *   2. WA-20 road status — pulled from CLOSURE_ALERT, color-coded by whether
 *      the headline contains "CLOSED" / "OPEN" / "monitoring".
 *   3. Next milestone — Allison's next booking-discipline date (Jun 25 WSDOT
 *      target → Jun 28 re-check → Lodging book-by). One line, one action.
 *
 * Why: the brief asked for "Live trip state — WA-20 status pill, days until
 * trip, next milestone." This is that surface, condensed enough to live on
 * home next to the path picker.
 *
 * Data sources:
 *   - TRIP.dates → Aug 16 hard-coded fallback if parse fails (fail-loud).
 *   - CLOSURE_ALERT.headline / .target → road status pill + interpretation.
 *   - Milestones hard-coded here because they're trip-cycle dates not in any
 *     other file yet (this file becomes the milestone home; future edits in
 *     one place).
 */

import { CLOSURE_ALERT } from '../data/closure';
import { h, section } from '../dom';

// Hard trip start — keep in sync with TRIP.dates. Used for the countdown.
const TRIP_START = new Date('2026-08-16T00:00:00-07:00'); // Pacific time
const TRIP_END = new Date('2026-08-20T23:59:59-07:00');

interface Milestone {
  label: string;
  date: Date;
  detail: string;
}

// Booking-discipline milestones. Ordered earliest first; we render the next
// one that's still in the future. If all are past, we fall back to the most
// recent and label it "past".
const MILESTONES: Milestone[] = [
  {
    label: 'Pick one booked house · cancel the other two',
    date: new Date('2026-06-01T00:00:00-07:00'),
    detail: 'Three Airbnbs booked for the same dates (Arlington + two in Sedro-Woolley). Pick one, cancel the other two before the free-cancellation windows close.',
  },
  {
    label: 'WSDOT reopen target',
    date: new Date('2026-06-25T00:00:00-07:00'),
    detail: 'WA-20 target reopen — "a goal, not a promise." Both booked houses are west of the corridor, so the trip works either way; this just gates the east-side stretch.',
  },
  {
    label: 'WSDOT re-check',
    date: new Date('2026-06-28T00:00:00-07:00'),
    detail: '3 days post-target — confirm reopen actually happened. Call 1-800-695-7623 if site stale.',
  },
  {
    label: 'Kosher phone-sweep',
    date: new Date('2026-08-02T00:00:00-07:00'),
    detail: 'Call Pabla / Teapot / QFC U-Village / Einstein Bros / Chabad Whatcom to confirm Va\'ad portfolio.',
  },
];

function daysUntilTrip(): { tile: string; sub: string } {
  const now = new Date();
  if (now > TRIP_END) {
    return { tile: 'Trip over', sub: 'Aug 16–20, 2026' };
  }
  if (now >= TRIP_START) {
    return { tile: 'Trip in progress', sub: 'Through Thu Aug 20' };
  }
  const msPerDay = 86_400_000;
  const days = Math.ceil((TRIP_START.getTime() - now.getTime()) / msPerDay);
  if (days === 0) return { tile: 'Today', sub: 'Trip starts today' };
  if (days === 1) return { tile: '1 day', sub: 'Trip starts tomorrow' };
  return { tile: `${days} days`, sub: `Until Sun Aug 16` };
}

function nextMilestone(): { label: string; sub: string; daysAway: string } {
  const now = new Date();
  const upcoming = MILESTONES.find((m) => m.date >= now);
  if (!upcoming) {
    const last = MILESTONES[MILESTONES.length - 1];
    if (!last) return { label: '—', sub: 'No milestones set', daysAway: '' };
    return {
      label: last.label,
      sub: last.detail,
      daysAway: 'past',
    };
  }
  const msPerDay = 86_400_000;
  const days = Math.ceil((upcoming.date.getTime() - now.getTime()) / msPerDay);
  const daysAway =
    days === 0 ? 'today' : days === 1 ? 'tomorrow' : `in ${days} days`;
  return { label: upcoming.label, sub: upcoming.detail, daysAway };
}

function wa20Tile(): { headline: string; sub: string; tone: 'red' | 'green' | 'amber' } {
  // Read the CLOSURE_ALERT headline literally. Word matching is intentional:
  // if Allison flips the closure-data file when WSDOT reopens, this tile
  // auto-recolors. No second source of truth.
  const headline = CLOSURE_ALERT.headline;
  if (/CLOSED/i.test(headline)) {
    return {
      headline: 'WA-20 CLOSED',
      sub: 'Mid-corridor (MP 130–156). Target reopen Jun 25.',
      tone: 'red',
    };
  }
  if (/OPEN/i.test(headline)) {
    return {
      headline: 'WA-20 OPEN',
      sub: 'Full corridor through the park drivable.',
      tone: 'green',
    };
  }
  return {
    headline: 'WA-20 status',
    sub: 'See deep-dive for current state.',
    tone: 'amber',
  };
}

function buildTile(
  eyebrow: string,
  headline: string,
  sub: string,
  tone: 'neutral' | 'red' | 'green' | 'amber',
  href?: string
): HTMLElement {
  const inner = h(
    'div',
    { class: `trip-state__tile trip-state__tile--${tone}` },
    h('p', { class: 'trip-state__eyebrow' }, eyebrow),
    h('p', { class: 'trip-state__headline' }, headline),
    h('p', { class: 'trip-state__sub' }, sub)
  );
  if (href) {
    return h(
      'a',
      { class: 'trip-state__link', href, 'aria-label': `${eyebrow}: ${headline}` },
      inner
    );
  }
  return inner;
}

export function renderTripState(): HTMLElement {
  const countdown = daysUntilTrip();
  const wa20 = wa20Tile();
  const ms = nextMilestone();

  return section(
    'trip-state',
    'Where the trip stands',
    h(
      'p',
      { class: 'section__lede' },
      'Countdown, road status, and the next booking-discipline date — at a glance.'
    ),
    h(
      'div',
      { class: 'trip-state__grid' },
      buildTile('Days until trip', countdown.tile, countdown.sub, 'neutral'),
      buildTile('Road status', wa20.headline, wa20.sub, wa20.tone, 'wa20-status.html'),
      buildTile(
        `Next milestone · ${ms.daysAway}`,
        ms.label,
        ms.sub,
        'amber',
        'pre-trip.html'
      )
    )
  );
}
