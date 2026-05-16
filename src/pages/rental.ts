/**
 * rental.ts — dedicated page for the rental-car deep dive.
 *
 * Why split: rental section was 5,435px (~55% of the entire travel page on
 * mobile). Pulling it onto its own URL lets Travel breathe (flights + logistics
 * only) and gives the rental decision its own context — multiple cars, multiple
 * insurance shapes, the Cascade River Rd gravel disclosure, verified quotes.
 *
 * Lifted from Austria's nav-consolidation pattern (the Logistics hub page
 * approach) — instead of cramming heavy decision surfaces inside a parent
 * page, give them their own URL.
 */

import '../styles/main.css';
import { mountPageShell, attachNotesToAllSections } from '../page-shell';
import { renderRental } from '../sections/rental';
import { renderPageCtas } from '../sections/page-ctas';

function mount(): void {
  const main = mountPageShell({
    pageId: 'rental',
    title: 'Rental car',
    lede: 'Automatic, gas or hybrid, all-in pricing (CDW/LDW + SLI bundled). Lead picks below — less-common shapes in disclosure.',
  });

  main.append(renderRental(), renderPageCtas('rental'));
  attachNotesToAllSections(main);
}

mount();
