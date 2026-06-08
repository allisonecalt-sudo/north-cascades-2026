/**
 * wa20-status.ts — WA-20 deep-dive page entrypoint.
 *
 * The home banner is a teaser; this page is where Erin gets linked the morning
 * of any travel-decision call. Source-by-source reconciliation, phone-check
 * protocol, affected destinations cross-linked to their full cards, and a
 * vertical timeline of how the closure got to where it is.
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
import { WA20_PAGE_META } from '../data/wa20-status';

function mount(): void {
  const main = mountPageShell({
    pageId: 'wa20-status',
    title: 'WA-20 status — the deep dive',
    verifiedOn: '2026-05-17 (target updated July 4 → June 25 per WSDOT)',
    lede: WA20_PAGE_META.lede,
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

  // Consolidation (2026-06-02): the standalone "How to do this trip" and
  // "Driving in the Cascades" pages were retired; their sections (id="how-to",
  // id="driving-cascades") now live here so the Plan-B path picker + driving/
  // closure context survive on a live page. Inbound how-to.html +
  // driving-cascades.html links point here.
  main.append(
    renderWa20Status(),
    renderDrivingCascades(),
    renderHowTo(),
    renderPageCtas('wa20-status')
  );
}

mount();
