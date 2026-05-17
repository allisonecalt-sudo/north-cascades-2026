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
    lede: 'Real cabin options for each base. 2 beds, 1-2 bedrooms, ~$200-300. Nature-immersed picks lead.',
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

  main.append(
    renderLodgingSearchGuide(),
    renderLodging(),
    renderCoolSleepingPlaces(),
    renderPageCtas('lodging')
  );
  attachNotesToAllSections(main);
}

mount();
