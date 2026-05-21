/**
 * home.ts — landing page entry. Trimmed 2026-05-21 (declutter pass).
 *
 * Posture: the trip is BOOKED (flights + lodging). The home page used to carry
 * 13 sections (path picker, featured strip, story-arc, towns, peak-moment,
 * overview, conversation-state, fresh-notes, home-reference, page-ctas …) built
 * for the "compare three options" era. Now that flights + lodging are booked,
 * the comparison scaffolding is dead weight. Allison: "trim everything that
 * seems trimmable — we don't need it to be overwhelming."
 *
 * Lean stack (top → bottom):
 *   1. Image hero — Cascade Pass, with the WA-20 closure note (showClosure)
 *   2. Stat-band — quick orientation
 *   3. LOCKED decisions — what's settled
 *   4. OPEN loops + Next action — what's left + who's holding it
 *   5. Map — where everything is
 *   6. Itinerary — the day-by-day
 *
 * De-surfaced (NOT deleted — files kept, reachable by URL, just not on home):
 *   conversation-state, story-arc, paths (path picker), featured-strip,
 *   trip-state, fresh-notes, peak-moment, overview, towns, home-reference,
 *   page-ctas. Per Allison's "don't disappear → archive nicely → pullable."
 */

import '../styles/main.css';
import { mountPageShell, attachNotesToAllSections } from '../page-shell';
import { renderMap } from '../sections/map';
import { renderItinerary } from '../sections/itinerary';
import { renderStatRow } from '../sections/stat-row';
import { renderLockedDecisions } from '../sections/locked-decisions';
import { renderOpenLoops } from '../sections/open-loops';
import { h } from '../dom';

function mount(): void {
  const main = mountPageShell({
    pageId: 'home',
    title: 'North Cascades · Aug 16-20, 2026 · Allison + Erin',
    lede:
      'The trip is booked — flights (United, EWR⇄SEA) and lodging (three west-side Airbnbs held for the same dates). What\'s left: pick one booked house and cancel the other two, and watch the WA-20 reopen. Scroll for live state, the map, and the day-by-day.',
    showClosure: true,
    imageHero: {
      // Cascade Pass / Sahale Arm — Pelton Peak + Yawning Glacier + Magic
      // Mountain. CC BY 2.0 Daniel Hershman, 2007.
      src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Cascade_pass.jpg/1920px-Cascade_pass.jpg',
      alt: 'Pelton Peak, Yawning Glacier, and Magic Mountain seen from the Sahale Arm above Cascade Pass in North Cascades National Park',
      credit: 'Photo: Daniel Hershman / Wikimedia · CC BY 2.0',
      ctaLabel: 'See what\'s locked',
      ctaHref: '#locked',
    },
  });

  // Stat-band — quick orientation: 5 days · 4 nights · etc.
  const statBand = h(
    'div',
    { class: 'stat-band' },
    h('div', { class: 'stat-band__inner' }, renderStatRow())
  );

  main.append(
    statBand,

    // ──── Decision-state block (the headline) ────
    renderLockedDecisions(),
    renderOpenLoops(),

    // ──── Where + when ────
    renderMap(),
    renderItinerary()
  );

  attachNotesToAllSections(main);
}

mount();
