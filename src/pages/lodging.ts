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
      // Unsplash — summer A-frame cabin tucked in green PNW forest.
      // Replaced May 17, 2026 — prior hero was a snow-covered winter scene
      // (violates Aug-trip "no snow" rule).
      src: 'https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&w=1920&q=70',
      alt: 'A-frame cabin tucked into a green evergreen forest in summer light',
      credit: 'Photo: Sterling Davis / Unsplash',
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
