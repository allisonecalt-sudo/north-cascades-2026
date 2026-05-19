/**
 * home.ts — landing page entry, restructured 2026-05-19 (site rework).
 *
 * Posture shift: the site WAS "react to three options." It's now "execute on
 * the decisions we made." May 18 WhatsApp thread + May 19 corrections (NYC +
 * United + Marblemount cluster + refundable) closed the path question. The
 * home page now foregrounds DECISIONS and OPEN LOOPS; the path picker and
 * deep research sit below the fold.
 *
 * New sequence (top → bottom):
 *   1. Image hero — "The trip we're planning · Aug 16-20"
 *   2. Stat-band — 5 days · 4 nights · 2 cabins · NYC + United
 *   3. Conversation-state strip — quick status summary (existing, kept)
 *   4. LOCKED decisions — full list with verbatim quotes per item
 *   5. OPEN loops + Next action — what's left + who's holding it
 *   6. Story-arc — reading order ("plan in this order: stay → do → get there →
 *      costs"), still useful as orientation
 *   7. Path picker (DEEP DIVE) — two-card comparison, marked as comparison,
 *      not a decision-time-out
 *   8. Featured strip — 2 path cards w/ photos
 *   9. Trip-state — countdown + WA-20 + milestones (existing)
 *  10. Fresh notes
 *  11. Peak-moment + map
 *  12. Overview + itinerary + towns
 *  13. Home-reference (collapsed)
 *  14. Cross-promo footer
 *
 * Removed from above-the-fold:
 *   - "Start: pick a path" pill (decision already made)
 *   - "5 must-have questions for Erin" strip (decisions captured above)
 *
 * Both still exist on /for-erin for explicit invitation to keep adding input.
 */

import '../styles/main.css';
import { mountPageShell, attachNotesToAllSections } from '../page-shell';
import { renderPaths } from '../sections/paths';
import { renderMap } from '../sections/map';
import { renderOverview } from '../sections/overview';
import { renderItinerary } from '../sections/itinerary';
import { renderPageCtas } from '../sections/page-ctas';
import { renderStatRow } from '../sections/stat-row';
import { renderPeakMoment } from '../sections/peak-moment';
import { renderTowns } from '../sections/towns';
import { renderFeaturedStrip } from '../sections/featured-strip';
import { renderStoryArc } from '../sections/story-arc';
import { renderTripState } from '../sections/trip-state';
import { renderFreshNotes } from '../sections/fresh-notes';
import { renderHomeReference } from '../sections/home-reference';
import { renderConversationState } from '../sections/conversation-state';
import { renderLockedDecisions } from '../sections/locked-decisions';
import { renderOpenLoops } from '../sections/open-loops';
import { h } from '../dom';

function mount(): void {
  const main = mountPageShell({
    pageId: 'home',
    title: 'North Cascades · Aug 16-20, 2026 · Allison + Erin',
    lede:
      'The trip we\'re planning. Dates locked, path decided, lodging area chosen, airline preference set. What\'s open now: exact United fare (Erin tonight), Marblemount-cluster picks (Allison today), WSDOT reopen (WA-20 gate). Scroll for live state.',
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

    // ──── Decision-state block (the new headline) ────
    // Conversation-state stays — it's the 30-sec summary. Locked + open are
    // the longer-form per-item record below it.
    renderConversationState(),
    renderLockedDecisions(),
    renderOpenLoops(),

    // ──── Reading-order orientation ────
    renderStoryArc(),

    // ──── Path picker — DEEP DIVE, no longer the central decision ────
    renderPaths(),
    renderFeaturedStrip(),

    // ──── Live state ────
    renderTripState(),
    renderFreshNotes(),

    // ──── Emotional + map orientation ────
    renderPeakMoment(),
    renderMap(),

    // ──── Detail surfaces ────
    renderOverview(),
    renderItinerary(),
    renderTowns(),

    // ──── Reference + admin (collapsed at bottom) ────
    renderHomeReference(),
    renderPageCtas('home')
  );

  attachNotesToAllSections(main);
}

mount();
