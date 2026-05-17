/**
 * home.ts — landing page entry, re-sequenced 2026-05-17 for cold-start UX.
 *
 * Question this page must answer in 30 seconds for a cold visitor (Erin):
 *   1. WHAT is this?       → image hero + tagline ("shared draft for Aug 16-20")
 *   2. WHO is it for?      → image hero subline + welcome-popup (Erin's intro)
 *   3. WHAT do I do first? → next-action pill ("Start: pick a path →")
 *   4. HOW does it work?   → story-arc strip (the 4-chip planning sequence)
 *   5. WHERE are decisions? → path picker + featured-strip + fresh-notes
 *
 * Sequence (top → bottom):
 *   1. Image hero (with closure banner below in the hero band)
 *   2. Next-action pill (adapts to Erin's state — picker / shortlist / review)
 *   3. Stat-row (5 days · 4 nights · 2 bases · 3 paths)
 *   4. Story-arc strip (Stay → Do → Get there → Costs, with live counts)
 *   5. Path picker (the central choose-your-path decision)
 *   6. Featured-strip (3 path cards with photos + per-path scope counts)
 *   7. Trip-state (countdown + WA-20 status + next milestone)
 *   8. Fresh-notes (3 most recent notes from Erin, auto-hides if zero)
 *   9. Peak-moment (Cascade Pass emotional anchor)
 *  10. Map (path-aware Leaflet map)
 *  11. Overview (gist + contingency disclosure)
 *  12. Itinerary (5-day shape, path-filtered)
 *  13. Towns (corridor character stops, path-filtered)
 *  14. Home-reference (collapsed disclosure: weather / pre-trip / details / etc.)
 *  15. Page-CTAs (cross-promo to other pages, footer-style)
 *
 * What's NEW (vs previous home, before this rebuild):
 *   - next-action pill (renderNextAction) — top-of-page adaptive CTA
 *   - trip-state (renderTripState) — countdown + WA-20 + milestones
 *   - fresh-notes (renderFreshNotes) — latest 3 notes, fail-loud
 *   - home-reference (renderHomeReference) — admin disclosure at bottom
 *   - story-arc enhanced with live count badges
 *   - featured-strip enhanced with per-path scope + shortlist count
 *
 * What's REMOVED: nothing — every prior section is still in the sequence.
 * Order changed to put orientation surfaces above content-detail surfaces.
 *
 * Strategy doc: see the task brief in the agent transcript + NAV_STRATEGY_
 * 2026-05-17.md for the 4 user-moments mapping.
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
import { renderNextAction } from '../sections/next-action';
import { renderErinMustsStrip } from '../sections/erin-musts-strip';
import { renderTripState } from '../sections/trip-state';
import { renderFreshNotes } from '../sections/fresh-notes';
import { renderHomeReference } from '../sections/home-reference';
import { h } from '../dom';

function mount(): void {
  const main = mountPageShell({
    pageId: 'home',
    title: 'Allison + Erin · North Cascades · Aug 16-20',
    lede: 'A shared draft. Both keep kosher — every lodging on the shortlist has a full kitchen. Three paths below — tap one to filter the whole site, or browse all three. Leave notes (or just text Allison) and the site updates next session.',
    showClosure: true,
    imageHero: {
      // Cascade Pass / Sahale Arm — Pelton Peak + Yawning Glacier + Magic
      // Mountain. CC BY 2.0 Daniel Hershman, 2007. Brand-fit: glacial palette.
      src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Cascade_pass.jpg/1920px-Cascade_pass.jpg',
      alt: 'Pelton Peak, Yawning Glacier, and Magic Mountain seen from the Sahale Arm above Cascade Pass in North Cascades National Park',
      credit: 'Photo: Daniel Hershman / Wikimedia · CC BY 2.0',
      ctaLabel: 'Choose a path',
      ctaHref: '#paths',
    },
  });

  // Stat-row sits in its own framed band so it visually bridges the hero
  // and the path picker without colliding with either.
  const statBand = h(
    'div',
    { class: 'stat-band' },
    h('div', { class: 'stat-band__inner' }, renderStatRow())
  );

  main.append(
    // ──── Orientation block (above-the-fold on mobile after the hero) ────
    // Adaptive "what do I do first" pill. Sits as close to the hero as
    // possible so it's the first thing in the content stream.
    renderNextAction(),
    // 5 must-have questions for Erin — surfaced PROMINENTLY between the
    // pill and the stat-row so a first-time visitor can't miss them.
    // Self-hides once Erin flips the "I've answered these" flag on /for-erin.
    renderErinMustsStrip(),
    statBand,
    // Narrative anchor — sets the "plan in this order" mental model before
    // the path picker forces a decision.
    renderStoryArc(),

    // ──── Central decision ────
    renderPaths(),
    renderFeaturedStrip(),

    // ──── Live state ────
    // Countdown + road status + next milestone. After the decision-making
    // block so the reader has already engaged with the picker.
    renderTripState(),
    // Fresh notes from Erin (auto-removes itself if zero notes exist).
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
