/**
 * wa20-status.ts — WA-20 status page entrypoint.
 *
 * Job (Reference/status): answer "is the road open?" in 2 seconds, then let the
 * reader go as deep as they want. The status block leads; everything else is
 * supporting detail.
 *
 * This page also absorbed the retired "Driving in the Cascades" + "How to do
 * this trip" pages (2026-06-02). To stop those two full pages from burying the
 * status answer, they're mounted behind <details> accordions (collapsed by
 * default) instead of stacked open — progressive disclosure, not a wall.
 *
 * Banner data lives in `data/closure.ts` (CLOSURE_ALERT). Page data lives in
 * `data/wa20-status.ts`. The two stay in sync via the `detail` + `target`
 * fields being read from CLOSURE_ALERT directly.
 */

import '../styles/main.css';
import { mountPageShell } from '../page-shell';
import { renderWa20Status } from '../sections/wa20-status';
import { renderDrivingCascades } from '../sections/driving-cascades';
import { renderHowTo } from '../sections/how-to';
import { renderPageCtas } from '../sections/page-ctas';
import { WA20_STATUS } from '../data/wa20-status';
import { h } from '../dom';

/**
 * Collapsible wrapper for the absorbed secondary content. Each section is a full
 * former page; collapsed-by-default keeps the status answer above the fold and
 * lets the reader open only what they need (DESIGN-RULES §4 progressive
 * disclosure, §9 fewer choices). The section renders lazily on first open so the
 * page doesn't pay for two heavy tools (carousel, interactive path filter) up
 * front.
 *
 * `anchorId` matches the id the inner section renders with (e.g. "driving-
 * cascades"), so a deep link like `wa20-status.html#driving-cascades` can find
 * and auto-open this accordion (see openAccordionForHash below).
 */
function collapsible(
  anchorId: string,
  summary: string,
  hint: string,
  build: () => HTMLElement
): HTMLElement {
  const details = h('details', { class: 'wa20-disclose', 'data-anchor': anchorId });
  const summaryEl = h(
    'summary',
    { class: 'wa20-disclose__summary' },
    h('span', { class: 'wa20-disclose__label' }, summary),
    h('span', { class: 'wa20-disclose__hint' }, hint),
    h('span', { class: 'wa20-disclose__caret', 'aria-hidden': 'true' }, '▾')
  );
  details.appendChild(summaryEl);
  let built = false;
  details.addEventListener('toggle', () => {
    if (details.open && !built) {
      built = true;
      details.appendChild(build());
    }
  });
  return details;
}

/**
 * Deep-link support: inbound links (page CTAs, the old how-to.html /
 * driving-cascades.html redirects) point at `#driving-cascades` / `#how-to`.
 * Those ids live INSIDE collapsed, lazily-built accordions, so a bare hash
 * scroll would find nothing. On load + hashchange, open the matching accordion
 * (which triggers its lazy build), then scroll the inner section into view.
 */
function openAccordionForHash(): void {
  const id = location.hash.replace('#', '');
  if (!id) return;
  const target = document.querySelector<HTMLDetailsElement>(
    `.wa20-disclose[data-anchor="${CSS.escape(id)}"]`
  );
  if (!target) return; // hash points at something already in the open DOM
  target.open = true;
  // Build is synchronous on the toggle handler; scroll after it lands.
  requestAnimationFrame(() => {
    (document.getElementById(id) ?? target).scrollIntoView({ block: 'start' });
  });
}

function ensureDiscloseStyles(): void {
  if (typeof document === 'undefined') return;
  if (document.getElementById('wa20-disclose-styles')) return;
  const style = document.createElement('style');
  style.id = 'wa20-disclose-styles';
  style.textContent = `
.wa20-disclose {
  border: 1px solid var(--c-line, #d9d4ca);
  border-radius: var(--radius-md, 10px);
  background: #fff;
  margin-top: var(--sp-3, 12px);
}
.wa20-disclose__summary {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: var(--sp-4, 16px);
  min-height: 44px;
  cursor: pointer;
  list-style: none;
  font-size: var(--fs-lg, 1.1rem);
  font-weight: 700;
}
.wa20-disclose__summary::-webkit-details-marker { display: none; }
.wa20-disclose__label { flex: 0 0 auto; }
.wa20-disclose__hint {
  flex: 1 1 auto;
  font-weight: 400;
  font-size: 0.9rem;
  color: var(--c-ink-soft, #514a3b);
}
.wa20-disclose__caret {
  flex: 0 0 auto;
  transition: transform 150ms ease;
  color: var(--c-ink-soft, #514a3b);
}
.wa20-disclose[open] .wa20-disclose__caret { transform: rotate(180deg); }
.wa20-disclose[open] .wa20-disclose__summary {
  border-bottom: 1px solid var(--c-line, #d9d4ca);
}
.wa20-disclose > .section { padding: 0 var(--sp-4, 16px) var(--sp-4, 16px); }
`;
  document.head.appendChild(style);
}

function mount(): void {
  ensureDiscloseStyles();

  const main = mountPageShell({
    pageId: 'wa20-status',
    title: 'WA-20 road status',
    // Verification date tracks the live status data (data/wa20-status.ts),
    // not a stale literal — the May 30 west-side reopen is the current truth.
    verifiedOn: `${WA20_STATUS.asOfLabel} (WSDOT live status)`,
    lede: 'Is the road open? The answer, the source, and the phone number to confirm — up top. Driving notes and the Plan-A/B path picker are tucked below.',
    imageHero: {
      // Wikimedia: Washington Highway 20 winding through the North Cascades.
      // HEAD-verified May 17, 2026 via curl (200).
      // Same photo already used as the driving-cascades hero — consistent visual
      // identity across the two road-related pages.
      src: 'img/washington-highway-20-north-cascades.jpg',
      alt: 'Washington Highway 20 winding through the North Cascades — the corridor this page is about.',
      credit: 'Photo: Wikimedia · CC',
      ctaLabel: 'See the status',
      ctaHref: '#wa20-status',
    },
  });

  // Status FIRST (the page's job). Then the absorbed driving + how-to content,
  // each behind a collapsed accordion so it supports without overwhelming.
  // Inbound how-to.html + driving-cascades.html links still resolve here; the
  // #driving-cascades / #how-to anchors land on the (collapsed) accordions.
  main.append(
    renderWa20Status(),
    collapsible(
      'driving-cascades',
      'Driving in the Cascades',
      'Gravel, cell dead zones, smoke, gas — the road primer',
      renderDrivingCascades
    ),
    collapsible(
      'how-to',
      'How to do this trip',
      'Plan A if WA-20 opens, Plan B if it stays closed — pick a path',
      renderHowTo
    ),
    renderPageCtas('wa20-status')
  );

  // Auto-open the right accordion if we arrived on a deep link, and on any
  // later in-page hash change (e.g. a "Driving →" CTA on this same page).
  openAccordionForHash();
  window.addEventListener('hashchange', openAccordionForHash);
}

mount();
