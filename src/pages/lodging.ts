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
  });

  main.append(
    renderLodging(),
    renderCoolSleepingPlaces(),
    renderPageCtas('lodging')
  );
  attachNotesToAllSections(main);
}

mount();
