/**
 * lodging.ts — full lodging deep-dive page.
 *
 * West + East tabs, all 2-bed cabins, splurge/not-fit/basic in disclosures.
 * Filters automatically to the active path if one is selected.
 */

import '../styles/main.css';
import { mountPageShell, attachNotesToAllSections } from '../page-shell';
import { renderLodging, renderLodgingSearchGuide } from '../sections/lodging';
import { renderCoolSleepingPlaces } from '../sections/cool-sleeping-places';
import { renderPageCtas } from '../sections/page-ctas';

function mount(): void {
  const main = mountPageShell({
    pageId: 'lodging',
    title: 'Marblemount cluster — west-side base',
    verifiedOn: '2026-05-19 (post-rework — Marblemount default + refundable + 2+2 split explicit)',
    // Hero lede rewritten 2026-05-19 (site rework): one-line current state +
    // the path-shape lookup. Background framing (kosher kitchen / 2 beds /
    // mid-tier) moves into the page-level disclaimer below.
    lede:
      'Erin\'s May 18 call — "the Marble Mount side… within an hour driving range." Default base = the Marblemount / Concrete / Rockport cluster. Path A keeps all 4 nights here. Path B splits 2 nights west + 2 nights east (Winthrop / Mazama). Refundable filter is ON by default (booking-as-backup discipline). Dates: Sun Aug 16 → Thu Aug 20, 2026.',
    imageHero: {
      // Re-re-swapped May 17, 2026 (8:13 AM IDT) — prior URL loaded fine but
      // depicted a tropical beach resort, not PNW. Switching to the Diablo
      // Lake Wikimedia image already used by the costs page (verified
      // bulletproof + actually depicts North Cascades).
      src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Diablo_Lake_%28Washington_State%29.jpg/1920px-Diablo_Lake_%28Washington_State%29.jpg',
      alt: 'Diablo Lake turquoise water with surrounding North Cascades peaks',
      credit: 'Photo: Wikimedia · CC',
      ctaLabel: 'See the cabins',
      ctaHref: '#lodging',
    },
  });

  // Lodging Owner pass (2026-05-17): re-ordered cards-first. The search-guide
  // is a reference resource, not above-the-fold value. It loads collapsed by
  // default now (see renderLodgingSearchGuide).
  main.append(
    renderLodging(),
    renderCoolSleepingPlaces(),
    renderLodgingSearchGuide(),
    renderPageCtas('lodging')
  );
  attachNotesToAllSections(main);
}

mount();
