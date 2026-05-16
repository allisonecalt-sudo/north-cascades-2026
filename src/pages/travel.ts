/**
 * travel.ts — flights + rental car + logistics.
 *
 * The "how to get there + around" page. Three sections.
 */

import '../styles/main.css';
import { mountPageShell, attachNotesToAllSections } from '../page-shell';
import { renderFlights } from '../sections/flights';
import { renderRental } from '../sections/rental';
import { renderLogistics } from '../sections/logistics';
import { renderPageCtas } from '../sections/page-ctas';

function mount(): void {
  const main = mountPageShell({
    pageId: 'travel',
    title: 'Flights, rental, and logistics',
    lede: 'Real flight options + rental booking specifics. Path-filtered when a path is active.',
  });

  main.append(renderFlights(), renderRental(), renderLogistics(), renderPageCtas('travel'));
  attachNotesToAllSections(main);
}

mount();
