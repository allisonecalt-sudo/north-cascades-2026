/**
 * lodging.ts — full lodging deep-dive page.
 *
 * West + East tabs, all 2-bed cabins, splurge/not-fit/basic in disclosures.
 * Filters automatically to the active path if one is selected.
 */

import '../styles/main.css';
import { mountPageShell, attachNotesToAllSections } from '../page-shell';
import { renderLodging } from '../sections/lodging';
import { renderCoolSleepingPlaces } from '../sections/cool-sleeping-places';
import { renderPageCtas } from '../sections/page-ctas';

function mount(): void {
  const main = mountPageShell({
    pageId: 'lodging',
    title: 'Where we sleep',
    lede: 'Real cabin options for each base. 2 beds, 1-2 bedrooms, ~$200-300. Nature-immersed picks lead.',
    imageHero: {
      // Unsplash — riverside cabin in PNW forest. Brand-fit: forest palette.
      src: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1920&q=70',
      alt: 'Rustic cabin beside a forested river with wooden deck',
      credit: 'Photo: Cherise Evertz / Unsplash',
      ctaLabel: 'See the cabins',
      ctaHref: '#lodging',
    },
  });

  main.append(
    renderLodging(),
    renderCoolSleepingPlaces(),
    renderPageCtas('lodging')
  );
  attachNotesToAllSections(main);
}

mount();
