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
    title: 'Where we sleep',
    verifiedOn: '2026-05-17 (Wave 4 — Owner pass + free-cancel + sold-out hide)',
    // Hero lede rewritten 2026-05-17 (Lodging Owner pass): set context up
    // front. Dates + travelers + the kosher-cook-in HARD requirement that
    // drives why kitchen pills lead every card.
    lede: '4 nights · Sun Aug 16 → Thu Aug 20, 2026 · Allison + Erin. Both kosher → full kitchen is required, not a nice-to-have. 2 beds always. Spacious-mid-tier (~$200-300/night), nature-near leads. Refundable filter is ON by default (Erin May 18 — booking-as-backup discipline). DEFAULT BASE per Erin May 18: Marblemount cluster (Marblemount / Concrete / Rockport). Path B adds an east-side stretch (Winthrop / Mazama) as 2 nights west + 2 nights east. Path A keeps all 4 nights in the Marblemount cluster.',
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
